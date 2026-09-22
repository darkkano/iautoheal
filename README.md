# Sistema de auto-healing — práctica hexagonal (NestJS)

```
Prometheus/Grafana webhook  →  últimos 100 logs  →  IA diagnostica
                                                 →  si identifica: script (reiniciar o escalar)
                                                 →  si no: incidente ignored (humano)
```

Puerto: **3003**.

Los scripts son **simulados**. No se ejecuta `systemctl` ni se toca la nube.

---

## 1. Finalidad

Cuando un servidor pega un pico de CPU o se cae, hoy un humano abre Grafana, lee logs y reinicia. Eso tarda y de madrugada duele.

**Este proyecto es el agente en el medio.** Escucha el webhook de Alertmanager. Trae los últimos 100 errores. Si la IA reconoce el patrón (connection refused, Postgres sin slots, OOM), dispara un playbook: reiniciar el servicio o escalar la base. Si no reconoce nada, **no toca nada** y deja el incidente para un humano.

| Sin esto | Con esto |
|----------|----------|
| Humano lee logs y corre `systemctl` | Webhook → diagnóstico → playbook (o ignore) |
| Reinicios a ciegas | Cooldown 60s + umbral de confianza 0.7 |

---

## 2. Cómo se usa — endpoints

```bash
cd iautoheal
npm install
npm run start:dev
```

Base: `http://localhost:3003`

| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET` | `/` | Mapa |
| `POST` | `/v1/webhooks/prometheus` | Payload Alertmanager |
| `POST` | `/v1/webhooks/grafana` | Igual, marca source=grafana |
| `POST` | `/v1/debug/logs` | Inyecta un log de error (Loki simulado) |
| `GET` | `/v1/logs?service=` | Últimos errores de un servicio |
| `POST` | `/v1/debug/alert` | Alerta slim `{ service, alertname }` |
| `GET` | `/v1/incidents` | Historial |
| `GET` | `/v1/incidents/:id` | Detalle (diagnosis + action) |

---

### `GET /`

```bash
curl -s http://localhost:3003/
```

---

### `POST /v1/debug/logs`

En producción los logs vendrían de Loki. Aquí los cargas tú para practicar.

```bash
curl -s http://localhost:3003/v1/debug/logs \
  -H "Content-Type: application/json" \
  -d '{"service":"api-payments","message":"connect ECONNREFUSED 127.0.0.1:5432"}'
```

---

### `POST /v1/webhooks/prometheus`

Cuerpo tipo **Alertmanager**. El campo clave es `labels.service`.

```bash
curl -s http://localhost:3003/v1/webhooks/prometheus \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"firing\",\"alerts\":[{\"status\":\"firing\",\"labels\":{\"alertname\":\"HighCPU\",\"service\":\"api-payments\",\"severity\":\"critical\"},\"annotations\":{\"summary\":\"CPU > 90%\"}}]}"
```

**201** ejemplo healed:

```json
{
  "incidents": [
    {
      "status": "healed",
      "alert": { "alertname": "HighCPU", "service": "api-payments" },
      "logsAnalyzed": 1,
      "diagnosis": {
        "cause": "connection_refused",
        "confidence": 0.92,
        "playbook": "restart_service"
      },
      "action": {
        "playbook": "restart_service",
        "executed": true,
        "output": "[simulado] systemctl restart api-payments → OK"
      }
    }
  ]
}
```

**Statuses:** `healed` · `ignored` · `failed`

Alertas `resolved` se ignoran.

---

### `POST /v1/debug/alert`

Misma lógica, body chico:

```bash
curl -s http://localhost:3003/v1/debug/alert \
  -H "Content-Type: application/json" \
  -d '{"service":"api-payments","alertname":"HighCPU"}'
```

---

### Cómo forzar cada playbook

| Logs inyectados | cause | playbook |
|-----------------|-------|----------|
| `ECONNREFUSED` / `connection refused` | `connection_refused` | `restart_service` |
| `too many connections` / `remaining connection slots` | `db_exhausted` | `scale_database` |
| `heap out of memory` / `OOM` | `oom` | `restart_service` |
| sin patrón o 0 logs | `unknown` | **ninguno** (`ignored`) |

Escalar DB:

```bash
curl -s http://localhost:3003/v1/debug/logs \
  -H "Content-Type: application/json" \
  -d '{"service":"api-payments","message":"FATAL: remaining connection slots are reserved"}'

curl -s http://localhost:3003/v1/debug/alert \
  -H "Content-Type: application/json" \
  -d '{"service":"api-payments","alertname":"HighCPU"}'
```

Segunda alerta al mismo servicio en < 60s → `ignored` (cooldown).

---

### `GET /v1/incidents` y `GET /v1/logs?service=`

```bash
curl -s http://localhost:3003/v1/incidents
curl -s http://localhost:3003/v1/logs?service=api-payments
```

**404** si el incidente no existe.

**400** si el webhook no trae `service`.

---

## 3. Algoritmo (`HandleAlertUseCase`)

1. Validar alerta (`service` obligatorio)
2. `LogSourcePort.lastErrors(service, 100)`
3. `DiagnoserPort.diagnose(alert, logs)`
4. Cooldown 60s por servicio ya `healed`
5. `shouldAutoHeal` (playbook ≠ none y confidence ≥ 0.7) → `ScriptRunnerPort`
6. Guardar `Incident`

El webhook **no** reinicia a ciegas: sin diagnóstico claro, status `ignored`.

---

## 4. Hexágono

```
DRIVING                              APPLICATION                    DRIVEN
POST /v1/webhooks/prometheus  →  HandleAlertUseCase  →  Logs, Diagnoser, Scripts, Repo
POST /v1/debug/logs           →  AppendLogUseCase    →  LogSource
GET /v1/incidents             →  Get/List            →  IncidentRepo
```

Loki real / LLM / `kubectl rollout`: cambias `useClass` en `app.module.ts`.

---

## 5. Tests

```bash
npm test
npm run test:e2e
npm run build
```

---

## 6. Relación con los otros

| Proyecto | Puerto | Rol |
|----------|--------|-----|
| `iaseguro` | 3000 | Gateway IA (PII + costo) |
| `ifraude` | 3001 | Fraude async + circuit breaker |
| `iconcilia` | 3002 | PDF → JSON estricto |
| `iautoheal` | 3003 | Alerta → logs → playbook |

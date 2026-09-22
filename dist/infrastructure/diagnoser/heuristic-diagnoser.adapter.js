var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HeuristicDiagnoserAdapter_1;
import { Injectable, Logger } from '@nestjs/common';
import { Diagnosis } from '../../domain/entities/diagnosis.js';
let HeuristicDiagnoserAdapter = HeuristicDiagnoserAdapter_1 = class HeuristicDiagnoserAdapter {
    logger = new Logger(HeuristicDiagnoserAdapter_1.name);
    async diagnose(alert, logs) {
        const blob = logs.map((l) => l.message).join('\n').toLowerCase();
        this.logger.log(`diagnosticar ${alert.service} con ${logs.length} logs`);
        if (/econnrefused|connection refused/.test(blob)) {
            return new Diagnosis('connection_refused', 0.92, 'restart_service', 'Los logs muestran connection refused: el proceso del servicio no responde.');
        }
        if (/too many connections|remaining connection slots|too many clients/.test(blob)) {
            return new Diagnosis('db_exhausted', 0.88, 'scale_database', 'PostgreSQL sin slots de conexión: conviene escalar la base, no solo reiniciar la API.');
        }
        if (/\booms?\b|heap out of memory|javascript heap/.test(blob)) {
            return new Diagnosis('oom', 0.85, 'restart_service', 'Out of memory: reinicio controlado del servicio.');
        }
        return new Diagnosis('unknown', 0.2, 'none', logs.length === 0
            ? 'No hay logs de error: un humano debe investigar. No se ejecuta script.'
            : 'Patrón no reconocido en los logs. No se auto-ejecuta nada.');
    }
};
HeuristicDiagnoserAdapter = HeuristicDiagnoserAdapter_1 = __decorate([
    Injectable()
], HeuristicDiagnoserAdapter);
export { HeuristicDiagnoserAdapter };
//# sourceMappingURL=heuristic-diagnoser.adapter.js.map
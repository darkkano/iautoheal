import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { HandleAlertUseCase } from '../../application/use-cases/handle-alert.use-case.js';
import {
  AppendLogUseCase,
  GetIncidentUseCase,
  ListIncidentsUseCase,
  ListLogsUseCase,
} from '../../application/use-cases/get-incident.use-case.js';
import { Alert } from '../../domain/entities/alert.js';
import { LogLine } from '../../domain/entities/log-line.js';
import { incidentJson } from './incident.json.js';

@Controller('v1/incidents')
export class IncidentController {
  constructor(
    private readonly getOne: GetIncidentUseCase,
    private readonly list: ListIncidentsUseCase,
  ) {}

  @Get()
  async findAll() {
    const rows = await this.list.execute();
    return rows.map(incidentJson);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const row = await this.getOne.execute(id);
    return incidentJson(row);
  }
}

@Controller('v1')
export class DebugController {
  constructor(
    private readonly appendLog: AppendLogUseCase,
    private readonly listLogs: ListLogsUseCase,
    private readonly handleAlert: HandleAlertUseCase,
  ) {}

  /** Inyecta un log de error (en prod vendría de Loki). */
  @Post('debug/logs')
  async seedLog(
    @Body() body: { service?: string; message?: string; level?: 'error' | 'warn' | 'info' },
  ) {
    if (!body?.service?.trim() || !body?.message?.trim()) {
      throw new BadRequestException('service y message son obligatorios.');
    }
    const line = new LogLine(
      new Date().toISOString(),
      body.service.trim(),
      body.level ?? 'error',
      body.message.trim(),
    );
    await this.appendLog.execute(line);
    return { ok: true, line };
  }

  @Get('logs')
  logs(@Query('service') service?: string) {
    if (!service?.trim()) {
      throw new BadRequestException('query service es obligatorio.');
    }
    return this.listLogs.execute(service.trim());
  }

  /** Atajo de práctica: alerta slim sin payload Alertmanager. */
  @Post('debug/alert')
  async slimAlert(
    @Body() body: { service?: string; alertname?: string; summary?: string },
  ) {
    if (!body?.service?.trim()) {
      throw new BadRequestException('service es obligatorio.');
    }
    const incident = await this.handleAlert.execute(
      new Alert(
        'prometheus',
        body.alertname ?? 'HighCPU',
        body.service.trim(),
        'critical',
        body.summary ?? 'CPU spike',
        new Date().toISOString(),
      ),
    );
    return incidentJson(incident);
  }
}

@Controller()
export class HealthController {
  @Get()
  info() {
    return {
      name: 'Auto-healing de servidores (práctica hexagonal)',
      idea: 'Webhook Prometheus → IA lee últimos 100 logs → si identifica, reinicia o escala (simulado).',
      endpoints: {
        'POST /v1/webhooks/prometheus': 'Alertmanager',
        'POST /v1/webhooks/grafana': 'Grafana',
        'POST /v1/debug/logs': 'Inyectar log de error',
        'GET /v1/logs?service=': 'Últimos errores',
        'POST /v1/debug/alert': 'Alerta slim de práctica',
        'GET /v1/incidents': 'Historial',
        'GET /v1/incidents/:id': 'Un incidente',
      },
      lee: 'README.md',
    };
  }
}

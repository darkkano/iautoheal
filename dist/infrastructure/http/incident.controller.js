var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Body, Controller, Get, Param, Post, Query, } from '@nestjs/common';
import { HandleAlertUseCase } from '../../application/use-cases/handle-alert.use-case.js';
import { AppendLogUseCase, GetIncidentUseCase, ListIncidentsUseCase, ListLogsUseCase, } from '../../application/use-cases/get-incident.use-case.js';
import { Alert } from '../../domain/entities/alert.js';
import { LogLine } from '../../domain/entities/log-line.js';
import { incidentJson } from './incident.json.js';
let IncidentController = class IncidentController {
    getOne;
    list;
    constructor(getOne, list) {
        this.getOne = getOne;
        this.list = list;
    }
    async findAll() {
        const rows = await this.list.execute();
        return rows.map(incidentJson);
    }
    async findOne(id) {
        const row = await this.getOne.execute(id);
        return incidentJson(row);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncidentController.prototype, "findOne", null);
IncidentController = __decorate([
    Controller('v1/incidents'),
    __metadata("design:paramtypes", [GetIncidentUseCase,
        ListIncidentsUseCase])
], IncidentController);
export { IncidentController };
let DebugController = class DebugController {
    appendLog;
    listLogs;
    handleAlert;
    constructor(appendLog, listLogs, handleAlert) {
        this.appendLog = appendLog;
        this.listLogs = listLogs;
        this.handleAlert = handleAlert;
    }
    async seedLog(body) {
        if (!body?.service?.trim() || !body?.message?.trim()) {
            throw new BadRequestException('service y message son obligatorios.');
        }
        const line = new LogLine(new Date().toISOString(), body.service.trim(), body.level ?? 'error', body.message.trim());
        await this.appendLog.execute(line);
        return { ok: true, line };
    }
    logs(service) {
        if (!service?.trim()) {
            throw new BadRequestException('query service es obligatorio.');
        }
        return this.listLogs.execute(service.trim());
    }
    async slimAlert(body) {
        if (!body?.service?.trim()) {
            throw new BadRequestException('service es obligatorio.');
        }
        const incident = await this.handleAlert.execute(new Alert('prometheus', body.alertname ?? 'HighCPU', body.service.trim(), 'critical', body.summary ?? 'CPU spike', new Date().toISOString()));
        return incidentJson(incident);
    }
};
__decorate([
    Post('debug/logs'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "seedLog", null);
__decorate([
    Get('logs'),
    __param(0, Query('service')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DebugController.prototype, "logs", null);
__decorate([
    Post('debug/alert'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "slimAlert", null);
DebugController = __decorate([
    Controller('v1'),
    __metadata("design:paramtypes", [AppendLogUseCase,
        ListLogsUseCase,
        HandleAlertUseCase])
], DebugController);
export { DebugController };
let HealthController = class HealthController {
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
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "info", null);
HealthController = __decorate([
    Controller()
], HealthController);
export { HealthController };
//# sourceMappingURL=incident.controller.js.map
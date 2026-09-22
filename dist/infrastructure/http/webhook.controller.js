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
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { HandleAlertUseCase } from '../../application/use-cases/handle-alert.use-case.js';
import { Alert } from '../../domain/entities/alert.js';
import { incidentJson } from './incident.json.js';
let WebhookController = class WebhookController {
    handleAlert;
    constructor(handleAlert) {
        this.handleAlert = handleAlert;
    }
    prometheus(body) {
        return this.dispatch(body, 'prometheus');
    }
    grafana(body) {
        return this.dispatch(body, 'grafana');
    }
    async dispatch(body, source) {
        const alerts = extractAlerts(body, source);
        if (alerts.length === 0) {
            throw new BadRequestException('Se espera payload Alertmanager ({ alerts: [...] }) o { alertname, service }.');
        }
        const incidents = [];
        for (const alert of alerts) {
            incidents.push(await this.handleAlert.execute(alert));
        }
        return { incidents: incidents.map(incidentJson) };
    }
};
__decorate([
    Post('prometheus'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "prometheus", null);
__decorate([
    Post('grafana'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "grafana", null);
WebhookController = __decorate([
    Controller('v1/webhooks'),
    __metadata("design:paramtypes", [HandleAlertUseCase])
], WebhookController);
export { WebhookController };
function extractAlerts(body, fallbackSource) {
    const now = new Date().toISOString();
    if (Array.isArray(body.alerts) && body.alerts.length > 0) {
        return body.alerts
            .filter((a) => (a.status ?? 'firing') !== 'resolved')
            .map((a) => new Alert(fallbackSource, a.labels?.alertname ?? 'Unknown', a.labels?.service ?? a.labels?.job ?? '', a.labels?.severity ?? 'warning', a.annotations?.summary ?? a.annotations?.description ?? '', now));
    }
    if (body.service || body.alertname) {
        return [
            new Alert(body.source ?? fallbackSource, body.alertname ?? 'Manual', body.service ?? '', body.severity ?? 'critical', body.summary ?? '', now),
        ];
    }
    return [];
}
//# sourceMappingURL=webhook.controller.js.map
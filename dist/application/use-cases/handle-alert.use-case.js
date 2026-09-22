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
var HandleAlertUseCase_1;
import { randomUUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { HealingAction } from '../../domain/entities/healing-action.js';
import { Incident } from '../../domain/entities/incident.js';
import { InvalidAlertError } from '../../domain/errors/domain.error.js';
import { COOLDOWN_MS, LOG_LIMIT, shouldAutoHeal, } from '../../domain/healing-policy.js';
import { DIAGNOSER, INCIDENT_REPO, LOG_SOURCE, SCRIPT_RUNNER, } from '../../domain/ports/tokens.js';
let HandleAlertUseCase = HandleAlertUseCase_1 = class HandleAlertUseCase {
    logs;
    diagnoser;
    scripts;
    incidents;
    logger = new Logger(HandleAlertUseCase_1.name);
    constructor(logs, diagnoser, scripts, incidents) {
        this.logs = logs;
        this.diagnoser = diagnoser;
        this.scripts = scripts;
        this.incidents = incidents;
    }
    async execute(alert) {
        if (!alert.service?.trim()) {
            throw new InvalidAlertError('falta labels.service');
        }
        this.logger.log(`[1] Alerta ${alert.alertname} service=${alert.service}`);
        const lines = await this.logs.lastErrors(alert.service, LOG_LIMIT);
        this.logger.log(`[2] ${lines.length} logs de error`);
        const diagnosis = await this.diagnoser.diagnose(alert, lines);
        this.logger.log(`[3] cause=${diagnosis.cause} confidence=${diagnosis.confidence} playbook=${diagnosis.playbook}`);
        const lastHealed = await this.incidents.lastHealedAt(alert.service);
        if (lastHealed && Date.now() - Date.parse(lastHealed) < COOLDOWN_MS) {
            this.logger.warn(`[4] cooldown activo para ${alert.service}`);
            const incident = new Incident(randomUUID(), alert, lines, diagnosis, `cooldown ${COOLDOWN_MS}ms`, null, 'ignored', new Date().toISOString());
            await this.incidents.save(incident);
            return incident;
        }
        if (!shouldAutoHeal(diagnosis) || diagnosis.playbook === 'none') {
            this.logger.log(`[5] no auto-heal (${diagnosis.rationale})`);
            const incident = new Incident(randomUUID(), alert, lines, diagnosis, diagnosis.rationale, null, 'ignored', new Date().toISOString());
            await this.incidents.save(incident);
            return incident;
        }
        this.logger.log(`[5] ejecutar ${diagnosis.playbook} sobre ${alert.service}`);
        const result = await this.scripts.run(diagnosis.playbook, alert.service);
        const action = new HealingAction(diagnosis.playbook, alert.service, result.ok, result.output, new Date().toISOString());
        const incident = new Incident(randomUUID(), alert, lines, diagnosis, null, action, result.ok ? 'healed' : 'failed', new Date().toISOString());
        await this.incidents.save(incident);
        this.logger.log(`[6] incidente ${incident.id} status=${incident.status}`);
        return incident;
    }
};
HandleAlertUseCase = HandleAlertUseCase_1 = __decorate([
    Injectable(),
    __param(0, Inject(LOG_SOURCE)),
    __param(1, Inject(DIAGNOSER)),
    __param(2, Inject(SCRIPT_RUNNER)),
    __param(3, Inject(INCIDENT_REPO)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], HandleAlertUseCase);
export { HandleAlertUseCase };
//# sourceMappingURL=handle-alert.use-case.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppendLogUseCase, GetIncidentUseCase, ListIncidentsUseCase, ListLogsUseCase, } from './application/use-cases/get-incident.use-case.js';
import { HandleAlertUseCase } from './application/use-cases/handle-alert.use-case.js';
import { DIAGNOSER, INCIDENT_REPO, LOG_SOURCE, SCRIPT_RUNNER, } from './domain/ports/tokens.js';
import { HeuristicDiagnoserAdapter } from './infrastructure/diagnoser/heuristic-diagnoser.adapter.js';
import { DomainExceptionFilter } from './infrastructure/http/domain-exception.filter.js';
import { DebugController, HealthController, IncidentController, } from './infrastructure/http/incident.controller.js';
import { WebhookController } from './infrastructure/http/webhook.controller.js';
import { InMemoryLogSource } from './infrastructure/logs/in-memory-log-source.js';
import { InMemoryIncidentRepository } from './infrastructure/persistence/in-memory-incident.repository.js';
import { SimulatedScriptRunner } from './infrastructure/scripts/simulated-script.runner.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        controllers: [
            HealthController,
            WebhookController,
            IncidentController,
            DebugController,
        ],
        providers: [
            HandleAlertUseCase,
            GetIncidentUseCase,
            ListIncidentsUseCase,
            AppendLogUseCase,
            ListLogsUseCase,
            { provide: APP_FILTER, useClass: DomainExceptionFilter },
            { provide: INCIDENT_REPO, useClass: InMemoryIncidentRepository },
            { provide: LOG_SOURCE, useClass: InMemoryLogSource },
            { provide: DIAGNOSER, useClass: HeuristicDiagnoserAdapter },
            { provide: SCRIPT_RUNNER, useClass: SimulatedScriptRunner },
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map
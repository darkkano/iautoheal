import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  AppendLogUseCase,
  GetIncidentUseCase,
  ListIncidentsUseCase,
  ListLogsUseCase,
} from './application/use-cases/get-incident.use-case.js';
import { HandleAlertUseCase } from './application/use-cases/handle-alert.use-case.js';
import {
  DIAGNOSER,
  INCIDENT_REPO,
  LOG_SOURCE,
  SCRIPT_RUNNER,
} from './domain/ports/tokens.js';
import { HeuristicDiagnoserAdapter } from './infrastructure/diagnoser/heuristic-diagnoser.adapter.js';
import { DomainExceptionFilter } from './infrastructure/http/domain-exception.filter.js';
import {
  DebugController,
  HealthController,
  IncidentController,
} from './infrastructure/http/incident.controller.js';
import { WebhookController } from './infrastructure/http/webhook.controller.js';
import { InMemoryLogSource } from './infrastructure/logs/in-memory-log-source.js';
import { InMemoryIncidentRepository } from './infrastructure/persistence/in-memory-incident.repository.js';
import { SimulatedScriptRunner } from './infrastructure/scripts/simulated-script.runner.js';

@Module({
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
export class AppModule {}

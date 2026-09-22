import { randomUUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Alert } from '../../domain/entities/alert.js';
import { HealingAction } from '../../domain/entities/healing-action.js';
import { Incident } from '../../domain/entities/incident.js';
import { InvalidAlertError } from '../../domain/errors/domain.error.js';
import {
  COOLDOWN_MS,
  LOG_LIMIT,
  shouldAutoHeal,
} from '../../domain/healing-policy.js';
import type { DiagnoserPort } from '../../domain/ports/diagnoser.port.js';
import type { IncidentRepositoryPort } from '../../domain/ports/incident-repository.port.js';
import type { LogSourcePort } from '../../domain/ports/log-source.port.js';
import type { ScriptRunnerPort } from '../../domain/ports/script-runner.port.js';
import {
  DIAGNOSER,
  INCIDENT_REPO,
  LOG_SOURCE,
  SCRIPT_RUNNER,
} from '../../domain/ports/tokens.js';

/**
 * CAPA: Application
 *
 * ALGORITMO (alerta → maybe script):
 *   1. Validar alerta (service obligatorio)
 *   2. Traer últimos 100 logs de error
 *   3. IA diagnostica
 *   4. Cooldown: si ya se sanó ese servicio hace < 60s, no repetir
 *   5. shouldAutoHeal? → ScriptRunner : ignorar
 *   6. Persistir Incident
 */
@Injectable()
export class HandleAlertUseCase {
  private readonly logger = new Logger(HandleAlertUseCase.name);

  constructor(
    @Inject(LOG_SOURCE) private readonly logs: LogSourcePort,
    @Inject(DIAGNOSER) private readonly diagnoser: DiagnoserPort,
    @Inject(SCRIPT_RUNNER) private readonly scripts: ScriptRunnerPort,
    @Inject(INCIDENT_REPO) private readonly incidents: IncidentRepositoryPort,
  ) {}

  async execute(alert: Alert): Promise<Incident> {
    if (!alert.service?.trim()) {
      throw new InvalidAlertError('falta labels.service');
    }

    this.logger.log(`[1] Alerta ${alert.alertname} service=${alert.service}`);
    const lines = await this.logs.lastErrors(alert.service, LOG_LIMIT);
    this.logger.log(`[2] ${lines.length} logs de error`);

    const diagnosis = await this.diagnoser.diagnose(alert, lines);
    this.logger.log(
      `[3] cause=${diagnosis.cause} confidence=${diagnosis.confidence} playbook=${diagnosis.playbook}`,
    );

    const lastHealed = await this.incidents.lastHealedAt(alert.service);
    if (lastHealed && Date.now() - Date.parse(lastHealed) < COOLDOWN_MS) {
      this.logger.warn(`[4] cooldown activo para ${alert.service}`);
      const incident = new Incident(
        randomUUID(),
        alert,
        lines,
        diagnosis,
        `cooldown ${COOLDOWN_MS}ms`,
        null,
        'ignored',
        new Date().toISOString(),
      );
      await this.incidents.save(incident);
      return incident;
    }

    if (!shouldAutoHeal(diagnosis) || diagnosis.playbook === 'none') {
      this.logger.log(`[5] no auto-heal (${diagnosis.rationale})`);
      const incident = new Incident(
        randomUUID(),
        alert,
        lines,
        diagnosis,
        diagnosis.rationale,
        null,
        'ignored',
        new Date().toISOString(),
      );
      await this.incidents.save(incident);
      return incident;
    }

    this.logger.log(`[5] ejecutar ${diagnosis.playbook} sobre ${alert.service}`);
    const result = await this.scripts.run(diagnosis.playbook, alert.service);
    const action = new HealingAction(
      diagnosis.playbook,
      alert.service,
      result.ok,
      result.output,
      new Date().toISOString(),
    );
    const incident = new Incident(
      randomUUID(),
      alert,
      lines,
      diagnosis,
      null,
      action,
      result.ok ? 'healed' : 'failed',
      new Date().toISOString(),
    );
    await this.incidents.save(incident);
    this.logger.log(`[6] incidente ${incident.id} status=${incident.status}`);
    return incident;
  }
}

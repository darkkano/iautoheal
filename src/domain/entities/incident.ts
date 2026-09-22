import { Alert } from './alert.js';
import { Diagnosis } from './diagnosis.js';
import { HealingAction } from './healing-action.js';
import { LogLine } from './log-line.js';

export type IncidentStatus = 'healed' | 'ignored' | 'failed';

/**
 * CAPA: Domain / agregado
 *
 * FLUJO:
 *   Webhook → HandleAlertUseCase → Incident
 *   GET /v1/incidents/:id
 */
export class Incident {
  constructor(
    public readonly id: string,
    public readonly alert: Alert,
    public readonly logs: LogLine[],
    public readonly diagnosis: Diagnosis,
    public readonly skipReason: string | null,
    public readonly action: HealingAction | null,
    public readonly status: IncidentStatus,
    public readonly createdAt: string,
  ) {}
}

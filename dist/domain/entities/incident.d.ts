import { Alert } from './alert.js';
import { Diagnosis } from './diagnosis.js';
import { HealingAction } from './healing-action.js';
import { LogLine } from './log-line.js';
export type IncidentStatus = 'healed' | 'ignored' | 'failed';
export declare class Incident {
    readonly id: string;
    readonly alert: Alert;
    readonly logs: LogLine[];
    readonly diagnosis: Diagnosis;
    readonly skipReason: string | null;
    readonly action: HealingAction | null;
    readonly status: IncidentStatus;
    readonly createdAt: string;
    constructor(id: string, alert: Alert, logs: LogLine[], diagnosis: Diagnosis, skipReason: string | null, action: HealingAction | null, status: IncidentStatus, createdAt: string);
}

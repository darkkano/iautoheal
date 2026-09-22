import { Alert } from '../entities/alert.js';
import { Diagnosis } from '../entities/diagnosis.js';
import { LogLine } from '../entities/log-line.js';
export interface DiagnoserPort {
    diagnose(alert: Alert, logs: LogLine[]): Promise<Diagnosis>;
}

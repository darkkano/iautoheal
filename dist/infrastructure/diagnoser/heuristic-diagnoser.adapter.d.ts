import { Alert } from '../../domain/entities/alert.js';
import { Diagnosis } from '../../domain/entities/diagnosis.js';
import { LogLine } from '../../domain/entities/log-line.js';
import type { DiagnoserPort } from '../../domain/ports/diagnoser.port.js';
export declare class HeuristicDiagnoserAdapter implements DiagnoserPort {
    private readonly logger;
    diagnose(alert: Alert, logs: LogLine[]): Promise<Diagnosis>;
}

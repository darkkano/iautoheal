import { Alert } from '../entities/alert.js';
import { Diagnosis } from '../entities/diagnosis.js';
import { LogLine } from '../entities/log-line.js';

/**
 * PUERTO driven — "IA que lee los logs".
 * Hoy: heurística. Mañana: LLM con los 100 logs + la alerta.
 */
export interface DiagnoserPort {
  diagnose(alert: Alert, logs: LogLine[]): Promise<Diagnosis>;
}

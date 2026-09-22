import { LogLine } from '../entities/log-line.js';

/**
 * PUERTO driven — últimos N logs de error del servicio.
 * Hoy: buffer en RAM. Mañana: Loki / Elasticsearch / journalctl.
 */
export interface LogSourcePort {
  lastErrors(service: string, limit: number): Promise<LogLine[]>;
  append(line: LogLine): Promise<void>;
}

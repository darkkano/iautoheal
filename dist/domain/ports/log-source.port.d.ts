import { LogLine } from '../entities/log-line.js';
export interface LogSourcePort {
    lastErrors(service: string, limit: number): Promise<LogLine[]>;
    append(line: LogLine): Promise<void>;
}

import { LogLine } from '../../domain/entities/log-line.js';
import type { LogSourcePort } from '../../domain/ports/log-source.port.js';
export declare class InMemoryLogSource implements LogSourcePort {
    private readonly lines;
    lastErrors(service: string, limit: number): Promise<LogLine[]>;
    append(line: LogLine): Promise<void>;
}

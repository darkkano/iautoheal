import { Incident } from '../../domain/entities/incident.js';
import { LogLine } from '../../domain/entities/log-line.js';
import type { IncidentRepositoryPort } from '../../domain/ports/incident-repository.port.js';
import type { LogSourcePort } from '../../domain/ports/log-source.port.js';
export declare class GetIncidentUseCase {
    private readonly repo;
    constructor(repo: IncidentRepositoryPort);
    execute(id: string): Promise<Incident>;
}
export declare class ListIncidentsUseCase {
    private readonly repo;
    constructor(repo: IncidentRepositoryPort);
    execute(): Promise<Incident[]>;
}
export declare class AppendLogUseCase {
    private readonly logs;
    constructor(logs: LogSourcePort);
    execute(line: LogLine): Promise<void>;
}
export declare class ListLogsUseCase {
    private readonly logs;
    constructor(logs: LogSourcePort);
    execute(service: string, limit?: number): Promise<LogLine[]>;
}

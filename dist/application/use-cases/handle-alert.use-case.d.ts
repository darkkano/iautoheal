import { Alert } from '../../domain/entities/alert.js';
import { Incident } from '../../domain/entities/incident.js';
import type { DiagnoserPort } from '../../domain/ports/diagnoser.port.js';
import type { IncidentRepositoryPort } from '../../domain/ports/incident-repository.port.js';
import type { LogSourcePort } from '../../domain/ports/log-source.port.js';
import type { ScriptRunnerPort } from '../../domain/ports/script-runner.port.js';
export declare class HandleAlertUseCase {
    private readonly logs;
    private readonly diagnoser;
    private readonly scripts;
    private readonly incidents;
    private readonly logger;
    constructor(logs: LogSourcePort, diagnoser: DiagnoserPort, scripts: ScriptRunnerPort, incidents: IncidentRepositoryPort);
    execute(alert: Alert): Promise<Incident>;
}

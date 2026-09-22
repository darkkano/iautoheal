import { HandleAlertUseCase } from '../../application/use-cases/handle-alert.use-case.js';
import { AppendLogUseCase, GetIncidentUseCase, ListIncidentsUseCase, ListLogsUseCase } from '../../application/use-cases/get-incident.use-case.js';
import { LogLine } from '../../domain/entities/log-line.js';
export declare class IncidentController {
    private readonly getOne;
    private readonly list;
    constructor(getOne: GetIncidentUseCase, list: ListIncidentsUseCase);
    findAll(): Promise<{
        id: string;
        status: import("../../domain/entities/incident.js").IncidentStatus;
        createdAt: string;
        skipReason: string | null;
        alert: {
            source: "prometheus" | "grafana";
            alertname: string;
            service: string;
            severity: string;
            summary: string;
        };
        logsAnalyzed: number;
        logsSample: {
            at: string;
            level: "error" | "warn" | "info";
            message: string;
        }[];
        diagnosis: {
            cause: import("../../domain/entities/diagnosis.js").Cause;
            confidence: number;
            playbook: import("../../domain/entities/diagnosis.js").Playbook;
            rationale: string;
        };
        action: {
            playbook: import("../../domain/entities/diagnosis.js").Playbook;
            target: string;
            executed: boolean;
            output: string;
            at: string;
        } | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: import("../../domain/entities/incident.js").IncidentStatus;
        createdAt: string;
        skipReason: string | null;
        alert: {
            source: "prometheus" | "grafana";
            alertname: string;
            service: string;
            severity: string;
            summary: string;
        };
        logsAnalyzed: number;
        logsSample: {
            at: string;
            level: "error" | "warn" | "info";
            message: string;
        }[];
        diagnosis: {
            cause: import("../../domain/entities/diagnosis.js").Cause;
            confidence: number;
            playbook: import("../../domain/entities/diagnosis.js").Playbook;
            rationale: string;
        };
        action: {
            playbook: import("../../domain/entities/diagnosis.js").Playbook;
            target: string;
            executed: boolean;
            output: string;
            at: string;
        } | null;
    }>;
}
export declare class DebugController {
    private readonly appendLog;
    private readonly listLogs;
    private readonly handleAlert;
    constructor(appendLog: AppendLogUseCase, listLogs: ListLogsUseCase, handleAlert: HandleAlertUseCase);
    seedLog(body: {
        service?: string;
        message?: string;
        level?: 'error' | 'warn' | 'info';
    }): Promise<{
        ok: boolean;
        line: LogLine;
    }>;
    logs(service?: string): Promise<LogLine[]>;
    slimAlert(body: {
        service?: string;
        alertname?: string;
        summary?: string;
    }): Promise<{
        id: string;
        status: import("../../domain/entities/incident.js").IncidentStatus;
        createdAt: string;
        skipReason: string | null;
        alert: {
            source: "prometheus" | "grafana";
            alertname: string;
            service: string;
            severity: string;
            summary: string;
        };
        logsAnalyzed: number;
        logsSample: {
            at: string;
            level: "error" | "warn" | "info";
            message: string;
        }[];
        diagnosis: {
            cause: import("../../domain/entities/diagnosis.js").Cause;
            confidence: number;
            playbook: import("../../domain/entities/diagnosis.js").Playbook;
            rationale: string;
        };
        action: {
            playbook: import("../../domain/entities/diagnosis.js").Playbook;
            target: string;
            executed: boolean;
            output: string;
            at: string;
        } | null;
    }>;
}
export declare class HealthController {
    info(): {
        name: string;
        idea: string;
        endpoints: {
            'POST /v1/webhooks/prometheus': string;
            'POST /v1/webhooks/grafana': string;
            'POST /v1/debug/logs': string;
            'GET /v1/logs?service=': string;
            'POST /v1/debug/alert': string;
            'GET /v1/incidents': string;
            'GET /v1/incidents/:id': string;
        };
        lee: string;
    };
}

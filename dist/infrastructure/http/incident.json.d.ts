import { Incident } from '../../domain/entities/incident.js';
export declare function incidentJson(row: Incident): {
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
};

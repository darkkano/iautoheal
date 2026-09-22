import { HandleAlertUseCase } from '../../application/use-cases/handle-alert.use-case.js';
type AlertmanagerBody = {
    status?: string;
    alerts?: Array<{
        status?: string;
        labels?: Record<string, string>;
        annotations?: Record<string, string>;
    }>;
    alertname?: string;
    service?: string;
    severity?: string;
    summary?: string;
    source?: 'prometheus' | 'grafana';
};
export declare class WebhookController {
    private readonly handleAlert;
    constructor(handleAlert: HandleAlertUseCase);
    prometheus(body: AlertmanagerBody): Promise<{
        incidents: {
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
        }[];
    }>;
    grafana(body: AlertmanagerBody): Promise<{
        incidents: {
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
        }[];
    }>;
    private dispatch;
}
export {};

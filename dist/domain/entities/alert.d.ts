export declare class Alert {
    readonly source: 'prometheus' | 'grafana';
    readonly alertname: string;
    readonly service: string;
    readonly severity: string;
    readonly summary: string;
    readonly receivedAt: string;
    constructor(source: 'prometheus' | 'grafana', alertname: string, service: string, severity: string, summary: string, receivedAt: string);
}

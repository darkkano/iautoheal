export class Alert {
    source;
    alertname;
    service;
    severity;
    summary;
    receivedAt;
    constructor(source, alertname, service, severity, summary, receivedAt) {
        this.source = source;
        this.alertname = alertname;
        this.service = service;
        this.severity = severity;
        this.summary = summary;
        this.receivedAt = receivedAt;
    }
}
//# sourceMappingURL=alert.js.map
export class Incident {
    id;
    alert;
    logs;
    diagnosis;
    skipReason;
    action;
    status;
    createdAt;
    constructor(id, alert, logs, diagnosis, skipReason, action, status, createdAt) {
        this.id = id;
        this.alert = alert;
        this.logs = logs;
        this.diagnosis = diagnosis;
        this.skipReason = skipReason;
        this.action = action;
        this.status = status;
        this.createdAt = createdAt;
    }
}
//# sourceMappingURL=incident.js.map
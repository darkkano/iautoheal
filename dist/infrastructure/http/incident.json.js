export function incidentJson(row) {
    return {
        id: row.id,
        status: row.status,
        createdAt: row.createdAt,
        skipReason: row.skipReason,
        alert: {
            source: row.alert.source,
            alertname: row.alert.alertname,
            service: row.alert.service,
            severity: row.alert.severity,
            summary: row.alert.summary,
        },
        logsAnalyzed: row.logs.length,
        logsSample: row.logs.slice(0, 5).map((l) => ({
            at: l.at,
            level: l.level,
            message: l.message,
        })),
        diagnosis: {
            cause: row.diagnosis.cause,
            confidence: row.diagnosis.confidence,
            playbook: row.diagnosis.playbook,
            rationale: row.diagnosis.rationale,
        },
        action: row.action
            ? {
                playbook: row.action.playbook,
                target: row.action.target,
                executed: row.action.executed,
                output: row.action.output,
                at: row.action.at,
            }
            : null,
    };
}
//# sourceMappingURL=incident.json.js.map
export class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class IncidentNotFoundError extends DomainError {
    constructor(id) {
        super(`Incidente no encontrado: ${id}`);
    }
}
export class InvalidAlertError extends DomainError {
    constructor(reason) {
        super(`Alerta inválida: ${reason}`);
    }
}
//# sourceMappingURL=domain.error.js.map
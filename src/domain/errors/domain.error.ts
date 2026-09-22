/**
 * CAPA: Domain
 * Error de negocio. HTTP lo traduce el filter.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class IncidentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Incidente no encontrado: ${id}`);
  }
}

export class InvalidAlertError extends DomainError {
  constructor(reason: string) {
    super(`Alerta inválida: ${reason}`);
  }
}

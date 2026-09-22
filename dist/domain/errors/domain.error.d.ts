export declare class DomainError extends Error {
    constructor(message: string);
}
export declare class IncidentNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class InvalidAlertError extends DomainError {
    constructor(reason: string);
}

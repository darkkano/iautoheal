export type Cause = 'connection_refused' | 'db_exhausted' | 'oom' | 'unknown';
export type Playbook = 'restart_service' | 'scale_database' | 'none';
export declare class Diagnosis {
    readonly cause: Cause;
    readonly confidence: number;
    readonly playbook: Playbook;
    readonly rationale: string;
    constructor(cause: Cause, confidence: number, playbook: Playbook, rationale: string);
}

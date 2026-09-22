/**
 * CAPA: Domain
 * Qué cree la IA y qué playbook conviene.
 *
 * FLUJO: DiagnoserPort.diagnose(alert, logs) → Diagnosis
 *        decideAction(diagnosis) → ejecutar o no
 */
export type Cause = 'connection_refused' | 'db_exhausted' | 'oom' | 'unknown';
export type Playbook = 'restart_service' | 'scale_database' | 'none';

export class Diagnosis {
  constructor(
    public readonly cause: Cause,
    public readonly confidence: number,
    public readonly playbook: Playbook,
    public readonly rationale: string,
  ) {}
}

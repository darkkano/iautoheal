import { Diagnosis } from './entities/diagnosis.js';

/**
 * CAPA: Domain / política PURA
 *
 * Auto-heal SOLO si:
 *   - playbook != none
 *   - confidence >= 0.7
 *
 * Si no, un humano debe mirar el incidente. Nunca se lanza un script "por si acaso".
 */
export const MIN_CONFIDENCE = 0.7;
export const LOG_LIMIT = 100;
export const COOLDOWN_MS = 60_000;

export function shouldAutoHeal(diagnosis: Diagnosis): boolean {
  return diagnosis.playbook !== 'none' && diagnosis.confidence >= MIN_CONFIDENCE;
}

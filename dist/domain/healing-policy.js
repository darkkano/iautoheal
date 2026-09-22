export const MIN_CONFIDENCE = 0.7;
export const LOG_LIMIT = 100;
export const COOLDOWN_MS = 60_000;
export function shouldAutoHeal(diagnosis) {
    return diagnosis.playbook !== 'none' && diagnosis.confidence >= MIN_CONFIDENCE;
}
//# sourceMappingURL=healing-policy.js.map
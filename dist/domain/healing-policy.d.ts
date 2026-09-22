import { Diagnosis } from './entities/diagnosis.js';
export declare const MIN_CONFIDENCE = 0.7;
export declare const LOG_LIMIT = 100;
export declare const COOLDOWN_MS = 60000;
export declare function shouldAutoHeal(diagnosis: Diagnosis): boolean;

import { Playbook } from '../entities/diagnosis.js';

export interface ScriptResult {
  ok: boolean;
  output: string;
}

/**
 * PUERTO driven — ejecuta el playbook.
 * NUNCA systemctl real en esta práctica: solo simula.
 */
export interface ScriptRunnerPort {
  run(playbook: Exclude<Playbook, 'none'>, service: string): Promise<ScriptResult>;
}

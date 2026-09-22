import { Playbook } from '../entities/diagnosis.js';
export interface ScriptResult {
    ok: boolean;
    output: string;
}
export interface ScriptRunnerPort {
    run(playbook: Exclude<Playbook, 'none'>, service: string): Promise<ScriptResult>;
}

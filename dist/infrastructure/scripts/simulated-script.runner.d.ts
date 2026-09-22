import { Playbook } from '../../domain/entities/diagnosis.js';
import type { ScriptResult, ScriptRunnerPort } from '../../domain/ports/script-runner.port.js';
export declare class SimulatedScriptRunner implements ScriptRunnerPort {
    private readonly logger;
    run(playbook: Exclude<Playbook, 'none'>, service: string): Promise<ScriptResult>;
}

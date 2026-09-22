import { Playbook } from './diagnosis.js';
export declare class HealingAction {
    readonly playbook: Playbook;
    readonly target: string;
    readonly executed: boolean;
    readonly output: string;
    readonly at: string;
    constructor(playbook: Playbook, target: string, executed: boolean, output: string, at: string);
}

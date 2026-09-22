import { Playbook } from './diagnosis.js';

export class HealingAction {
  constructor(
    public readonly playbook: Playbook,
    public readonly target: string,
    public readonly executed: boolean,
    public readonly output: string,
    public readonly at: string,
  ) {}
}

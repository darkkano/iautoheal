import { Injectable, Logger } from '@nestjs/common';
import { Playbook } from '../../domain/entities/diagnosis.js';
import type { ScriptResult, ScriptRunnerPort } from '../../domain/ports/script-runner.port.js';

/**
 * ADAPTER driven — playbooks SIMULADOS.
 *
 * No corre systemctl, kubectl ni AWS.
 * En producción aquí iría un runner con allowlist de scripts.
 */
@Injectable()
export class SimulatedScriptRunner implements ScriptRunnerPort {
  private readonly logger = new Logger(SimulatedScriptRunner.name);

  async run(
    playbook: Exclude<Playbook, 'none'>,
    service: string,
  ): Promise<ScriptResult> {
    if (playbook === 'restart_service') {
      const output = `[simulado] systemctl restart ${service} → OK`;
      this.logger.log(output);
      return { ok: true, output };
    }
    const output = `[simulado] scale database for ${service}: replicas+1 / max_connections↑ → OK`;
    this.logger.log(output);
    return { ok: true, output };
  }
}

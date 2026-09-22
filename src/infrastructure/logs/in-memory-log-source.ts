import { Injectable } from '@nestjs/common';
import { LogLine } from '../../domain/entities/log-line.js';
import type { LogSourcePort } from '../../domain/ports/log-source.port.js';

/**
 * ADAPTER driven — buffer de logs (Loki simulado).
 * POST /v1/debug/logs empuja líneas. El webhook lee las últimas 100.
 */
@Injectable()
export class InMemoryLogSource implements LogSourcePort {
  private readonly lines: LogLine[] = [];

  async lastErrors(service: string, limit: number): Promise<LogLine[]> {
    return this.lines
      .filter((l) => l.service === service && l.level === 'error')
      .slice(-limit)
      .reverse();
  }

  async append(line: LogLine): Promise<void> {
    this.lines.push(line);
  }
}

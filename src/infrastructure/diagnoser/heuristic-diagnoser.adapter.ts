import { Injectable, Logger } from '@nestjs/common';
import { Alert } from '../../domain/entities/alert.js';
import { Diagnosis } from '../../domain/entities/diagnosis.js';
import { LogLine } from '../../domain/entities/log-line.js';
import type { DiagnoserPort } from '../../domain/ports/diagnoser.port.js';

/**
 * ADAPTER driven — IA de diagnóstico (heurística).
 *
 * Patrones de práctica:
 *   ECONNREFUSED / connection refused     → restart_service
 *   too many connections / remaining slots → scale_database
 *   OOM / heap out of memory              → restart_service
 *   sin patrón                            → unknown (NO script)
 */
@Injectable()
export class HeuristicDiagnoserAdapter implements DiagnoserPort {
  private readonly logger = new Logger(HeuristicDiagnoserAdapter.name);

  async diagnose(alert: Alert, logs: LogLine[]): Promise<Diagnosis> {
    const blob = logs.map((l) => l.message).join('\n').toLowerCase();
    this.logger.log(`diagnosticar ${alert.service} con ${logs.length} logs`);

    if (/econnrefused|connection refused/.test(blob)) {
      return new Diagnosis(
        'connection_refused',
        0.92,
        'restart_service',
        'Los logs muestran connection refused: el proceso del servicio no responde.',
      );
    }
    if (/too many connections|remaining connection slots|too many clients/.test(blob)) {
      return new Diagnosis(
        'db_exhausted',
        0.88,
        'scale_database',
        'PostgreSQL sin slots de conexión: conviene escalar la base, no solo reiniciar la API.',
      );
    }
    if (/\booms?\b|heap out of memory|javascript heap/.test(blob)) {
      return new Diagnosis(
        'oom',
        0.85,
        'restart_service',
        'Out of memory: reinicio controlado del servicio.',
      );
    }

    return new Diagnosis(
      'unknown',
      0.2,
      'none',
      logs.length === 0
        ? 'No hay logs de error: un humano debe investigar. No se ejecuta script.'
        : 'Patrón no reconocido en los logs. No se auto-ejecuta nada.',
    );
  }
}

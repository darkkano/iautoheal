import { HeuristicDiagnoserAdapter } from './heuristic-diagnoser.adapter.js';
import { Alert } from '../../domain/entities/alert.js';
import { LogLine } from '../../domain/entities/log-line.js';

const alert = new Alert('prometheus', 'HighCPU', 'api', 'critical', 'cpu', new Date().toISOString());
const diag = new HeuristicDiagnoserAdapter();

function logs(message: string): LogLine[] {
  return [new LogLine(new Date().toISOString(), 'api', 'error', message)];
}

describe('HeuristicDiagnoserAdapter', () => {
  it('ECONNREFUSED → restart_service', async () => {
    const d = await diag.diagnose(alert, logs('connect ECONNREFUSED 127.0.0.1:3000'));
    expect(d.playbook).toBe('restart_service');
    expect(d.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it('too many connections → scale_database', async () => {
    const d = await diag.diagnose(alert, logs('FATAL: too many connections'));
    expect(d.playbook).toBe('scale_database');
  });

  it('sin patrón → none', async () => {
    const d = await diag.diagnose(alert, logs('algo raro no catalogado'));
    expect(d.playbook).toBe('none');
    expect(d.cause).toBe('unknown');
  });
});

import { HandleAlertUseCase } from './handle-alert.use-case.js';
import { Alert } from '../../domain/entities/alert.js';
import { Diagnosis } from '../../domain/entities/diagnosis.js';
import { LogLine } from '../../domain/entities/log-line.js';
import type { DiagnoserPort } from '../../domain/ports/diagnoser.port.js';
import type { IncidentRepositoryPort } from '../../domain/ports/incident-repository.port.js';
import type { LogSourcePort } from '../../domain/ports/log-source.port.js';
import type { ScriptRunnerPort } from '../../domain/ports/script-runner.port.js';
import { Incident } from '../../domain/entities/incident.js';

function alert(service = 'api-payments'): Alert {
  return new Alert('prometheus', 'HighCPU', service, 'critical', 'CPU > 90%', new Date().toISOString());
}

function build(opts: {
  diagnosis: Diagnosis;
  logs?: LogLine[];
  lastHealedAt?: string | null;
  scriptOk?: boolean;
}) {
  const stored: Incident[] = [];
  const logs: LogSourcePort = {
    lastErrors: async () => opts.logs ?? [],
    append: async () => undefined,
  };
  const diagnoser: DiagnoserPort = {
    diagnose: async () => opts.diagnosis,
  };
  const run = vi.fn(async () => ({
    ok: opts.scriptOk ?? true,
    output: 'ok',
  }));
  const scripts: ScriptRunnerPort = { run };
  const incidents: IncidentRepositoryPort = {
    save: async (i) => {
      stored.push(i);
    },
    findById: async () => null,
    list: async () => stored,
    lastHealedAt: async () => opts.lastHealedAt ?? null,
  };
  return {
    run,
    stored,
    useCase: new HandleAlertUseCase(logs, diagnoser, scripts, incidents),
  };
}

describe('HandleAlertUseCase', () => {
  it('connection_refused + alta confianza → ejecuta restart', async () => {
    const { useCase, run, stored } = build({
      diagnosis: new Diagnosis('connection_refused', 0.92, 'restart_service', 'refused'),
    });
    const incident = await useCase.execute(alert());
    expect(run).toHaveBeenCalledWith('restart_service', 'api-payments');
    expect(incident.status).toBe('healed');
    expect(stored).toHaveLength(1);
  });

  it('unknown → ignored y NO corre script', async () => {
    const { useCase, run } = build({
      diagnosis: new Diagnosis('unknown', 0.2, 'none', 'no sé'),
    });
    const incident = await useCase.execute(alert());
    expect(run).not.toHaveBeenCalled();
    expect(incident.status).toBe('ignored');
  });

  it('cooldown → ignored aunque el diagnóstico pida restart', async () => {
    const { useCase, run } = build({
      diagnosis: new Diagnosis('oom', 0.9, 'restart_service', 'oom'),
      lastHealedAt: new Date().toISOString(),
    });
    const incident = await useCase.execute(alert());
    expect(run).not.toHaveBeenCalled();
    expect(incident.status).toBe('ignored');
    expect(incident.skipReason).toMatch(/cooldown/);
  });
});

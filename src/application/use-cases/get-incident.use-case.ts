import { Inject, Injectable } from '@nestjs/common';
import { Incident } from '../../domain/entities/incident.js';
import { LogLine } from '../../domain/entities/log-line.js';
import { IncidentNotFoundError } from '../../domain/errors/domain.error.js';
import type { IncidentRepositoryPort } from '../../domain/ports/incident-repository.port.js';
import type { LogSourcePort } from '../../domain/ports/log-source.port.js';
import { INCIDENT_REPO, LOG_SOURCE } from '../../domain/ports/tokens.js';

@Injectable()
export class GetIncidentUseCase {
  constructor(
    @Inject(INCIDENT_REPO) private readonly repo: IncidentRepositoryPort,
  ) {}

  async execute(id: string): Promise<Incident> {
    const row = await this.repo.findById(id);
    if (!row) throw new IncidentNotFoundError(id);
    return row;
  }
}

@Injectable()
export class ListIncidentsUseCase {
  constructor(
    @Inject(INCIDENT_REPO) private readonly repo: IncidentRepositoryPort,
  ) {}

  execute(): Promise<Incident[]> {
    return this.repo.list();
  }
}

@Injectable()
export class AppendLogUseCase {
  constructor(@Inject(LOG_SOURCE) private readonly logs: LogSourcePort) {}

  execute(line: LogLine): Promise<void> {
    return this.logs.append(line);
  }
}

@Injectable()
export class ListLogsUseCase {
  constructor(@Inject(LOG_SOURCE) private readonly logs: LogSourcePort) {}

  execute(service: string, limit = 100): Promise<LogLine[]> {
    return this.logs.lastErrors(service, limit);
  }
}

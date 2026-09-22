import { Injectable } from '@nestjs/common';
import { Incident } from '../../domain/entities/incident.js';
import type { IncidentRepositoryPort } from '../../domain/ports/incident-repository.port.js';

@Injectable()
export class InMemoryIncidentRepository implements IncidentRepositoryPort {
  private readonly store = new Map<string, Incident>();

  async save(incident: Incident): Promise<void> {
    this.store.set(incident.id, incident);
  }

  async findById(id: string): Promise<Incident | null> {
    return this.store.get(id) ?? null;
  }

  async list(): Promise<Incident[]> {
    return [...this.store.values()].reverse();
  }

  async lastHealedAt(service: string): Promise<string | null> {
    const healed = [...this.store.values()]
      .filter((i) => i.alert.service === service && i.status === 'healed')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return healed[0]?.createdAt ?? null;
  }
}

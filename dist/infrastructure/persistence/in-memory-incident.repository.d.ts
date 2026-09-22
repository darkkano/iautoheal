import { Incident } from '../../domain/entities/incident.js';
import type { IncidentRepositoryPort } from '../../domain/ports/incident-repository.port.js';
export declare class InMemoryIncidentRepository implements IncidentRepositoryPort {
    private readonly store;
    save(incident: Incident): Promise<void>;
    findById(id: string): Promise<Incident | null>;
    list(): Promise<Incident[]>;
    lastHealedAt(service: string): Promise<string | null>;
}

import { Incident } from '../entities/incident.js';
export interface IncidentRepositoryPort {
    save(incident: Incident): Promise<void>;
    findById(id: string): Promise<Incident | null>;
    list(): Promise<Incident[]>;
    lastHealedAt(service: string): Promise<string | null>;
}

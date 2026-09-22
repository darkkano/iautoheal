var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let InMemoryIncidentRepository = class InMemoryIncidentRepository {
    store = new Map();
    async save(incident) {
        this.store.set(incident.id, incident);
    }
    async findById(id) {
        return this.store.get(id) ?? null;
    }
    async list() {
        return [...this.store.values()].reverse();
    }
    async lastHealedAt(service) {
        const healed = [...this.store.values()]
            .filter((i) => i.alert.service === service && i.status === 'healed')
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return healed[0]?.createdAt ?? null;
    }
};
InMemoryIncidentRepository = __decorate([
    Injectable()
], InMemoryIncidentRepository);
export { InMemoryIncidentRepository };
//# sourceMappingURL=in-memory-incident.repository.js.map
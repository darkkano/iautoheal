var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@nestjs/common';
import { IncidentNotFoundError } from '../../domain/errors/domain.error.js';
import { INCIDENT_REPO, LOG_SOURCE } from '../../domain/ports/tokens.js';
let GetIncidentUseCase = class GetIncidentUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(id) {
        const row = await this.repo.findById(id);
        if (!row)
            throw new IncidentNotFoundError(id);
        return row;
    }
};
GetIncidentUseCase = __decorate([
    Injectable(),
    __param(0, Inject(INCIDENT_REPO)),
    __metadata("design:paramtypes", [Object])
], GetIncidentUseCase);
export { GetIncidentUseCase };
let ListIncidentsUseCase = class ListIncidentsUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    execute() {
        return this.repo.list();
    }
};
ListIncidentsUseCase = __decorate([
    Injectable(),
    __param(0, Inject(INCIDENT_REPO)),
    __metadata("design:paramtypes", [Object])
], ListIncidentsUseCase);
export { ListIncidentsUseCase };
let AppendLogUseCase = class AppendLogUseCase {
    logs;
    constructor(logs) {
        this.logs = logs;
    }
    execute(line) {
        return this.logs.append(line);
    }
};
AppendLogUseCase = __decorate([
    Injectable(),
    __param(0, Inject(LOG_SOURCE)),
    __metadata("design:paramtypes", [Object])
], AppendLogUseCase);
export { AppendLogUseCase };
let ListLogsUseCase = class ListLogsUseCase {
    logs;
    constructor(logs) {
        this.logs = logs;
    }
    execute(service, limit = 100) {
        return this.logs.lastErrors(service, limit);
    }
};
ListLogsUseCase = __decorate([
    Injectable(),
    __param(0, Inject(LOG_SOURCE)),
    __metadata("design:paramtypes", [Object])
], ListLogsUseCase);
export { ListLogsUseCase };
//# sourceMappingURL=get-incident.use-case.js.map
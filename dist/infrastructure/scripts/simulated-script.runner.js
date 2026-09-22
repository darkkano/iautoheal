var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SimulatedScriptRunner_1;
import { Injectable, Logger } from '@nestjs/common';
let SimulatedScriptRunner = SimulatedScriptRunner_1 = class SimulatedScriptRunner {
    logger = new Logger(SimulatedScriptRunner_1.name);
    async run(playbook, service) {
        if (playbook === 'restart_service') {
            const output = `[simulado] systemctl restart ${service} → OK`;
            this.logger.log(output);
            return { ok: true, output };
        }
        const output = `[simulado] scale database for ${service}: replicas+1 / max_connections↑ → OK`;
        this.logger.log(output);
        return { ok: true, output };
    }
};
SimulatedScriptRunner = SimulatedScriptRunner_1 = __decorate([
    Injectable()
], SimulatedScriptRunner);
export { SimulatedScriptRunner };
//# sourceMappingURL=simulated-script.runner.js.map
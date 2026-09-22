import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.PORT ?? 3003;
    await app.listen(port);
    const logger = new Logger('Bootstrap');
    logger.log(`Auto-healing (práctica) → http://localhost:${port}`);
    logger.log('POST /v1/webhooks/prometheus | POST /v1/debug/logs | GET /v1/incidents');
}
await bootstrap();
//# sourceMappingURL=main.js.map
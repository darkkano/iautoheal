import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('Auto-healing (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(res.body.name).toContain('Auto-healing');
  });

  it('logs ECONNREFUSED + webhook → healed restart', async () => {
    await request(app.getHttpServer())
      .post('/v1/debug/logs')
      .send({ service: 'api-payments', message: 'connect ECONNREFUSED 127.0.0.1:5432' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/v1/webhooks/prometheus')
      .send({
        status: 'firing',
        alerts: [
          {
            status: 'firing',
            labels: { alertname: 'HighCPU', service: 'api-payments', severity: 'critical' },
            annotations: { summary: 'CPU > 90%' },
          },
        ],
      })
      .expect(201);

    expect(res.body.incidents[0].status).toBe('healed');
    expect(res.body.incidents[0].action.playbook).toBe('restart_service');
    expect(res.body.incidents[0].action.output).toContain('simulado');
  });

  it('sin logs → ignored, no script', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/debug/alert')
      .send({ service: 'api-orphan', alertname: 'HighCPU' })
      .expect(201);

    expect(res.body.status).toBe('ignored');
    expect(res.body.action).toBeNull();
  });

  it('GET incidente desconocido → 404', async () => {
    const res = await request(app.getHttpServer()).get('/v1/incidents/nope').expect(404);
    expect(res.body.error).toBe('IncidentNotFoundError');
  });
});

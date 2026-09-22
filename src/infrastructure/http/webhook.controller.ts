import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { HandleAlertUseCase } from '../../application/use-cases/handle-alert.use-case.js';
import { Alert } from '../../domain/entities/alert.js';
import { incidentJson } from './incident.json.js';

type AlertmanagerBody = {
  status?: string;
  alerts?: Array<{
    status?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  }>;
  alertname?: string;
  service?: string;
  severity?: string;
  summary?: string;
  source?: 'prometheus' | 'grafana';
};

/**
 * ADAPTER driving — webhooks de Prometheus Alertmanager / Grafana.
 *
 * FLUJO:
 *   POST /v1/webhooks/prometheus  →  HandleAlertUseCase
 *   El humano ya no lee logs a mano: el agente diagnostica y, si puede, sana.
 */
@Controller('v1/webhooks')
export class WebhookController {
  constructor(private readonly handleAlert: HandleAlertUseCase) {}

  @Post('prometheus')
  prometheus(@Body() body: AlertmanagerBody) {
    return this.dispatch(body, 'prometheus');
  }

  @Post('grafana')
  grafana(@Body() body: AlertmanagerBody) {
    return this.dispatch(body, 'grafana');
  }

  private async dispatch(body: AlertmanagerBody, source: 'prometheus' | 'grafana') {
    const alerts = extractAlerts(body, source);
    if (alerts.length === 0) {
      throw new BadRequestException(
        'Se espera payload Alertmanager ({ alerts: [...] }) o { alertname, service }.',
      );
    }
    const incidents = [];
    for (const alert of alerts) {
      incidents.push(await this.handleAlert.execute(alert));
    }
    return { incidents: incidents.map(incidentJson) };
  }
}

function extractAlerts(
  body: AlertmanagerBody,
  fallbackSource: 'prometheus' | 'grafana',
): Alert[] {
  const now = new Date().toISOString();

  if (Array.isArray(body.alerts) && body.alerts.length > 0) {
    return body.alerts
      .filter((a) => (a.status ?? 'firing') !== 'resolved')
      .map(
        (a) =>
          new Alert(
            fallbackSource,
            a.labels?.alertname ?? 'Unknown',
            a.labels?.service ?? a.labels?.job ?? '',
            a.labels?.severity ?? 'warning',
            a.annotations?.summary ?? a.annotations?.description ?? '',
            now,
          ),
      );
  }

  if (body.service || body.alertname) {
    return [
      new Alert(
        body.source ?? fallbackSource,
        body.alertname ?? 'Manual',
        body.service ?? '',
        body.severity ?? 'critical',
        body.summary ?? '',
        now,
      ),
    ];
  }

  return [];
}

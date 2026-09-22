/**
 * CAPA: Domain / value object
 * Lo que llega de Prometheus/Grafana (ya normalizado, sin HTTP).
 */
export class Alert {
  constructor(
    public readonly source: 'prometheus' | 'grafana',
    public readonly alertname: string,
    public readonly service: string,
    public readonly severity: string,
    public readonly summary: string,
    public readonly receivedAt: string,
  ) {}
}

export class LogLine {
  constructor(
    public readonly at: string,
    public readonly service: string,
    public readonly level: 'error' | 'warn' | 'info',
    public readonly message: string,
  ) {}
}

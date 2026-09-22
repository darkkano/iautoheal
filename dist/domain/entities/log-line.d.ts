export declare class LogLine {
    readonly at: string;
    readonly service: string;
    readonly level: 'error' | 'warn' | 'info';
    readonly message: string;
    constructor(at: string, service: string, level: 'error' | 'warn' | 'info', message: string);
}

export interface Logger {
    log(message: string, ...args: any[]): void;

    error(message: string, ...args: any[]): void;

    debug(message: string, ...args: any[]): void;
}

export class ConsoleLogger implements Logger {
    constructor(public log = console.log,
                public error = console.error,
                public debug = console.debug) {
    }
}
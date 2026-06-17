export declare enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error"
}
export declare class Logger {
    private level;
    constructor(level?: LogLevel);
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, error?: Error | unknown): void;
    private _shouldLog;
    setLevel(level: LogLevel): void;
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map
// Unified logger for the ecosystem
export var LogLevel;
(function (LogLevel) {
    LogLevel["Debug"] = "debug";
    LogLevel["Info"] = "info";
    LogLevel["Warn"] = "warn";
    LogLevel["Error"] = "error";
})(LogLevel || (LogLevel = {}));
export class Logger {
    level;
    constructor(level = LogLevel.Info) {
        this.level = level;
    }
    debug(message, data) {
        if (this._shouldLog(LogLevel.Debug)) {
            console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
        }
    }
    info(message, data) {
        if (this._shouldLog(LogLevel.Info)) {
            console.info(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
        }
    }
    warn(message, data) {
        if (this._shouldLog(LogLevel.Warn)) {
            console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
        }
    }
    error(message, error) {
        if (this._shouldLog(LogLevel.Error)) {
            console.error(`[ERROR] ${message}`, error);
        }
    }
    _shouldLog(level) {
        const levels = [LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error];
        const currentIndex = levels.indexOf(this.level);
        const requestIndex = levels.indexOf(level);
        return requestIndex >= currentIndex;
    }
    setLevel(level) {
        this.level = level;
    }
}
export const logger = new Logger();
//# sourceMappingURL=logger.js.map
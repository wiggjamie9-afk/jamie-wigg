// Unified logger for the ecosystem

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.Info) {
    this.level = level;
  }

  debug(message: string, data?: unknown): void {
    if (this._shouldLog(LogLevel.Debug)) {
      console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  info(message: string, data?: unknown): void {
    if (this._shouldLog(LogLevel.Info)) {
      console.info(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this._shouldLog(LogLevel.Warn)) {
      console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (this._shouldLog(LogLevel.Error)) {
      console.error(`[ERROR] ${message}`, error);
    }
  }

  private _shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error];
    const currentIndex = levels.indexOf(this.level);
    const requestIndex = levels.indexOf(level);
    return requestIndex >= currentIndex;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

export const logger = new Logger();

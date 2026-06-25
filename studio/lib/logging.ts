/**
 * Logging utilities for API endpoints
 * Structured logging with request IDs for tracing
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  requestId: string;
  timestamp: string;
  level: LogLevel;
  endpoint: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Format and log a request
 */
export function logRequest(
  requestId: string,
  endpoint: string,
  status: string = 'started',
  metadata?: Record<string, unknown>
): void {
  const context: LogContext = {
    requestId,
    timestamp: new Date().toISOString(),
    level: 'info',
    endpoint,
    status,
    metadata,
  };

  console.log(JSON.stringify(context));
}

/**
 * Format and log an error
 */
export function logError(
  requestId: string,
  message: string,
  error: unknown
): void {
  const errorData = error instanceof Error ? {
    message: error.message,
    stack: error.stack,
  } : String(error);

  const context: LogContext = {
    requestId,
    timestamp: new Date().toISOString(),
    level: 'error',
    endpoint: 'unknown',
    status: 'error',
    metadata: {
      error_message: message,
      error_data: errorData,
    },
  };

  console.error(JSON.stringify(context));
}

/**
 * Format and log a warning
 */
export function logWarn(
  requestId: string,
  endpoint: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  const context: LogContext = {
    requestId,
    timestamp: new Date().toISOString(),
    level: 'warn',
    endpoint,
    status: 'warning',
    metadata: {
      warning: message,
      ...metadata,
    },
  };

  console.warn(JSON.stringify(context));
}

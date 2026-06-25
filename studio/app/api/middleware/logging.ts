/**
 * Structured logging middleware
 * Outputs to Datadog/Axiom-compatible JSON
 */

interface LogContext {
  request_id: string
  timestamp: string
  environment: string
  service: 'rhythmix-api'
}

interface RequestLogEntry extends LogContext {
  event_type: 'request'
  method: string
  path: string
  status_code: number
  message: string
  job_id?: string
  duration_ms?: number
  user_agent?: string
  ip_address?: string
}

interface ErrorLogEntry extends LogContext {
  event_type: 'error'
  level: 'error'
  message: string
  error_code?: string
  stack_trace?: string
  context?: Record<string, unknown>
}

interface MetricsLogEntry extends LogContext {
  event_type: 'metric'
  metric_name: string
  value: number
  tags?: Record<string, string>
}

type LogEntry = RequestLogEntry | ErrorLogEntry | MetricsLogEntry

const ENVIRONMENT = process.env.NODE_ENV || 'development'
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/**
 * Log HTTP request
 */
export function logRequest(
  requestId: string,
  method: string,
  path: string,
  statusCode: number,
  message: string,
  jobId?: string,
  durationMs?: number
): void {
  const entry: RequestLogEntry = {
    request_id: requestId,
    timestamp: new Date().toISOString(),
    environment: ENVIRONMENT,
    service: 'rhythmix-api',
    event_type: 'request',
    method,
    path,
    status_code: statusCode,
    message,
    job_id: jobId,
    duration_ms: durationMs,
  }

  // Always log requests
  outputLog(entry)
}

/**
 * Log error
 */
export function logError(
  requestId: string,
  message: string,
  context?: Record<string, unknown>
): void {
  const entry: ErrorLogEntry = {
    request_id: requestId,
    timestamp: new Date().toISOString(),
    environment: ENVIRONMENT,
    service: 'rhythmix-api',
    event_type: 'error',
    level: 'error',
    message,
    context,
  }

  if (context?.error instanceof Error) {
    entry.stack_trace = context.error.stack
    entry.error_code = (context.error as any).code
  }

  outputLog(entry)
}

/**
 * Log metric
 */
export function logMetric(
  requestId: string,
  metricName: string,
  value: number,
  tags?: Record<string, string>
): void {
  const entry: MetricsLogEntry = {
    request_id: requestId,
    timestamp: new Date().toISOString(),
    environment: ENVIRONMENT,
    service: 'rhythmix-api',
    event_type: 'metric',
    metric_name: metricName,
    value,
    tags,
  }

  outputLog(entry)
}

/**
 * Output log to console and/or external service
 */
function outputLog(entry: LogEntry): void {
  // For development, pretty-print
  if (ENVIRONMENT === 'development') {
    console.log(JSON.stringify(entry, null, 2))
  } else {
    // For production, output as single-line JSON (Datadog/Axiom compatible)
    console.log(JSON.stringify(entry))
  }

  // TODO: Send to Datadog/Axiom
  // if (process.env.DATADOG_API_KEY) {
  //   await sendToDatadog(entry)
  // }
}

/**
 * Datadog/Axiom integration stub
 */
async function sendToDatadog(entry: LogEntry): Promise<void> {
  // Stub implementation
  try {
    const apiKey = process.env.DATADOG_API_KEY || process.env.AXIOM_API_KEY
    if (!apiKey) return

    const endpoint =
      process.env.DATADOG_API_KEY
        ? 'https://http-intake.logs.datadoghq.com/v1/input'
        : 'https://api.axiom.co/v1/datasets/rhythmix-logs/ingest'

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': apiKey,
      },
      body: JSON.stringify(entry),
    })
  } catch (err) {
    // Fail silently to avoid breaking requests
    console.error('Failed to send log to external service:', err)
  }
}

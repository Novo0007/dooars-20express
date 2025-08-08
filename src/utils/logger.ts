// Production-ready logging system

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  source?: string
}

class Logger {
  private isDevelopment: boolean
  private logs: LogEntry[] = []
  private maxLogs = 1000

  constructor() {
    this.isDevelopment = import.meta.env.DEV
  }

  private log(level: LogLevel, message: string, data?: any, source?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source,
    }

    // Store in memory (limited to maxLogs)
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output in development
    if (this.isDevelopment) {
      this.consoleLog(entry)
    }

    // Send critical errors to monitoring service in production
    if (level === 'error' && !this.isDevelopment) {
      this.sendToMonitoring(entry)
    }
  }

  private consoleLog(entry: LogEntry) {
    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}`
    const message = entry.source
      ? `${prefix} [${entry.source}] ${entry.message}`
      : `${prefix} ${entry.message}`

    // Properly serialize data for console output
    const logData = entry.data ? this.serializeData(entry.data) : null

    switch (entry.level) {
      case 'debug':
        if (logData) console.debug(message, logData)
        else console.debug(message)
        break
      case 'info':
        if (logData) console.info(message, logData)
        else console.info(message)
        break
      case 'warn':
        if (logData) console.warn(message, logData)
        else console.warn(message)
        break
      case 'error':
        if (logData) console.error(message, logData)
        else console.error(message)
        break
    }
  }

  private serializeData(data: any): any {
    if (!data) return null

    try {
      // Handle Error objects specially
      if (data instanceof Error) {
        return {
          name: data.name,
          message: data.message,
          stack: data.stack,
          cause: data.cause,
        }
      }

      // Handle objects that might not serialize properly
      if (typeof data === 'object') {
        const serialized: any = {}
        for (const [key, value] of Object.entries(data)) {
          if (value instanceof Error) {
            serialized[key] = {
              name: value.name,
              message: value.message,
              stack: value.stack,
            }
          } else if (typeof value === 'function') {
            serialized[key] = '[Function]'
          } else if (typeof value === 'object' && value !== null) {
            try {
              serialized[key] = JSON.parse(JSON.stringify(value))
            } catch {
              serialized[key] = '[Object - could not serialize]'
            }
          } else {
            serialized[key] = value
          }
        }
        return serialized
      }

      return data
    } catch (error) {
      return '[Data could not be serialized]'
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // In production, send to monitoring service like Sentry, LogRocket, etc.
      // For now, just store in localStorage as fallback
      const errorLogs = JSON.parse(localStorage.getItem('error_logs') || '[]')
      errorLogs.push(entry)

      // Keep only last 50 error logs
      if (errorLogs.length > 50) {
        errorLogs.splice(0, errorLogs.length - 50)
      }

      localStorage.setItem('error_logs', JSON.stringify(errorLogs))
    } catch (error) {
      console.error('Failed to log error to monitoring service:', error)
    }
  }

  debug(message: string, data?: any, source?: string) {
    this.log('debug', message, data, source)
  }

  info(message: string, data?: any, source?: string) {
    this.log('info', message, data, source)
  }

  warn(message: string, data?: any, source?: string) {
    this.log('warn', message, data, source)
  }

  error(message: string, data?: any, source?: string) {
    this.log('error', message, data, source)
  }

  // Convenience methods for common scenarios
  apiError(endpoint: string, error: any) {
    this.error(
      `API Error: ${endpoint}`,
      {
        error: error.message || error,
        stack: error.stack,
        endpoint,
      },
      'API',
    )
  }

  userAction(action: string, data?: any) {
    this.info(`User Action: ${action}`, data, 'USER')
  }

  paymentEvent(event: string, data?: any) {
    this.info(`Payment Event: ${event}`, data, 'PAYMENT')
  }

  authEvent(event: string, data?: any) {
    this.info(`Auth Event: ${event}`, data, 'AUTH')
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level)
    }
    return [...this.logs]
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Export logs for support
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Create global logger instance
export const logger = new Logger()

// Error boundary helper
export const handleGlobalError = (error: Error, source?: string) => {
  logger.error(
    'Unhandled Error',
    {
      message: error.message,
      stack: error.stack,
      source,
    },
    'GLOBAL',
  )
}

// Setup global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    handleGlobalError(event.error, 'window.error')
  })

  window.addEventListener('unhandledrejection', (event) => {
    handleGlobalError(new Error(event.reason), 'unhandledrejection')
  })
}

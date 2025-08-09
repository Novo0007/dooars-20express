import { useNotificationStore } from '@/stores/notification'
import { logger } from '@/utils/logger'
import { formatError } from '@/utils/errorFormatter'

/**
 * Unified error handling composable to eliminate duplicate error handling patterns
 */
export const useErrorHandler = () => {
  const notificationStore = useNotificationStore()

  /**
   * Handle errors with consistent logging and user notification
   */
  const handleError = (
    error: any,
    context: string,
    options?: {
      showNotification?: boolean
      notificationTitle?: string
      logLevel?: 'error' | 'warn'
      fallbackMessage?: string
    },
  ) => {
    const {
      showNotification = true,
      notificationTitle = 'Error',
      logLevel = 'error',
      fallbackMessage = 'An unexpected error occurred',
    } = options || {}

    // Format error message
    const errorMessage = formatError(error) || fallbackMessage

    // Log error
    if (logLevel === 'error') {
      logger.error(`${context}: ${errorMessage}`, { error, context })
    } else {
      logger.warn(`${context}: ${errorMessage}`, { error, context })
    }

    // Show user notification
    if (showNotification) {
      notificationStore.error(errorMessage, notificationTitle)
    }

    return errorMessage
  }

  /**
   * Handle API errors specifically (common pattern in the app)
   */
  const handleApiError = (
    error: any,
    operation: string,
    options?: {
      showNotification?: boolean
      fallbackMessage?: string
    },
  ) => {
    return handleError(error, `API ${operation}`, {
      notificationTitle: `${operation} Failed`,
      fallbackMessage: `Failed to ${operation.toLowerCase()}`,
      ...options,
    })
  }

  /**
   * Handle database errors specifically (common Supabase pattern)
   */
  const handleDbError = (
    error: any,
    table: string,
    operation: string,
    options?: {
      showNotification?: boolean
    },
  ) => {
    return handleError(error, `Database ${operation} on ${table}`, {
      notificationTitle: `Database Error`,
      fallbackMessage: `Failed to ${operation} ${table} data`,
      ...options,
    })
  }

  /**
   * Handle loading state with error handling
   */
  const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    context: string,
    options?: {
      showNotification?: boolean
      fallbackValue?: T
    },
  ): Promise<T | undefined> => {
    try {
      return await operation()
    } catch (error) {
      handleError(error, context, options)
      return options?.fallbackValue
    }
  }

  return {
    handleError,
    handleApiError,
    handleDbError,
    withErrorHandling,
  }
}

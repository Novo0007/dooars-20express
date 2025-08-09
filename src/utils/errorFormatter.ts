/**
 * Utility functions to properly format errors and prevent "[object Object]" displays
 */

export interface FormattedError {
  message: string
  code?: string
  details?: string
  hint?: string
}

/**
 * Format any error to a readable string, preventing "[object Object]" displays
 */
export const formatError = (error: any): string => {
  if (!error) return 'Unknown error'
  
  // If it's already a string, return it
  if (typeof error === 'string') return error
  
  // Handle Error instances
  if (error instanceof Error) {
    return error.message || 'Unknown error'
  }
  
  // Handle Supabase error objects
  if (error && typeof error === 'object') {
    // Supabase errors have message, code, details, hint properties
    if (error.message) {
      const parts = [error.message]
      if (error.code) parts.push(`Code: ${error.code}`)
      if (error.details) parts.push(`Details: ${error.details}`)
      if (error.hint) parts.push(`Hint: ${error.hint}`)
      return parts.join(' - ')
    }
    
    // Handle error arrays
    if (Array.isArray(error)) {
      return error.map(e => formatError(e)).join('; ')
    }
    
    // Try to extract meaningful information from object
    const meaningfulProps = ['error', 'message', 'description', 'reason', 'statusText']
    for (const prop of meaningfulProps) {
      if (error[prop] && typeof error[prop] === 'string') {
        return error[prop]
      }
    }
    
    // Last resort: try to stringify, but catch circular references
    try {
      const stringified = JSON.stringify(error)
      if (stringified && stringified !== '{}') {
        return stringified
      }
    } catch {
      // Circular reference or other stringify issues
    }
  }
  
  // Fallback for truly unformattable errors
  return 'Complex error - check console for details'
}

/**
 * Format error with context for better debugging
 */
export const formatErrorWithContext = (error: any, context: string): string => {
  const baseMessage = formatError(error)
  return `${context}: ${baseMessage}`
}

/**
 * Create a FormattedError object from any error type
 */
export const parseError = (error: any): FormattedError => {
  if (!error) {
    return { message: 'Unknown error' }
  }
  
  if (typeof error === 'string') {
    return { message: error }
  }
  
  if (error instanceof Error) {
    return { message: error.message || 'Unknown error' }
  }
  
  if (error && typeof error === 'object') {
    return {
      message: error.message || formatError(error),
      code: error.code,
      details: error.details,
      hint: error.hint
    }
  }
  
  return { message: formatError(error) }
}

/**
 * Safe error logging that prevents "[object Object]" in console
 */
export const logError = (error: any, context?: string) => {
  const formatted = parseError(error)
  const prefix = context ? `[${context}]` : ''
  
  console.error(`${prefix} ${formatted.message}`, {
    code: formatted.code,
    details: formatted.details,
    hint: formatted.hint,
    originalError: error
  })
}

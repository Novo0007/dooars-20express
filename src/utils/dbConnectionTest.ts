import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'

export interface DatabaseTestResult {
  connected: boolean
  tablesAccessible: boolean
  roomsCount: number
  hotelsCount: number
  errors: string[]
}

export async function testDatabaseConnection(): Promise<DatabaseTestResult> {
  const result: DatabaseTestResult = {
    connected: false,
    tablesAccessible: false,
    roomsCount: 0,
    hotelsCount: 0,
    errors: [],
  }

  try {
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('hotels')
      .select('count', { count: 'exact', head: true })

    if (healthError) {
      result.errors.push(`Health check failed: ${healthError.message}`)
      logger.error('Database health check failed', { error: healthError })
      return result
    }

    result.connected = true

    // Test hotels table access
    try {
      const { count: hotelsCount, error: hotelsError } = await supabase
        .from('hotels')
        .select('*', { count: 'exact', head: true })

      if (hotelsError) {
        result.errors.push(`Hotels table error: ${hotelsError.message}`)
        logger.error('Hotels table access failed', { error: hotelsError })
      } else {
        result.hotelsCount = hotelsCount || 0
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown hotels table error'
      result.errors.push(`Hotels table exception: ${errorMessage}`)
      logger.error('Hotels table exception', { error })
    }

    // Test rooms table access
    try {
      const { count: roomsCount, error: roomsError } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })

      if (roomsError) {
        result.errors.push(`Rooms table error: ${roomsError.message}`)
        logger.error('Rooms table access failed', { error: roomsError })
      } else {
        result.roomsCount = roomsCount || 0
        result.tablesAccessible = true
      }
    } catch (error) {
      let errorMessage = 'Unknown rooms table error'
      let errorDetails = ''

      if (error instanceof Error) {
        errorMessage = error.message
        errorDetails = error.stack || ''
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase error objects
        const supabaseError = error as any
        errorMessage = supabaseError.message || supabaseError.error_description || 'Supabase rooms error'
        errorDetails = `Code: ${supabaseError.code || 'N/A'}, Details: ${supabaseError.details || 'N/A'}`
      } else {
        errorMessage = String(error)
      }

      result.errors.push(`Rooms table exception: ${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}`)
      logger.error('Rooms table exception', { error, errorMessage, errorDetails })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown connection error'
    result.errors.push(`Connection failed: ${errorMessage}`)
    logger.error('Database connection test failed', { error })
  }

  return result
}

export async function testRoomsQuery(): Promise<{
  success: boolean
  data?: any[]
  error?: string
}> {
  try {
    const { data, error } = await supabase.from('rooms').select('*').limit(5)

    if (error) {
      logger.error('Rooms query test failed', { error })
      return {
        success: false,
        error: error.message || 'Unknown rooms query error',
      }
    }

    logger.info('Rooms query test successful', { recordCount: data?.length || 0 })
    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    let errorMessage = 'Rooms query exception'
    let errorDetails = ''

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || ''
    } else if (typeof error === 'object' && error !== null) {
      // Handle Supabase error objects
      const supabaseError = error as any
      errorMessage = supabaseError.message || supabaseError.error_description || 'Supabase rooms query error'
      errorDetails = `Code: ${supabaseError.code || 'N/A'}, Details: ${supabaseError.details || 'N/A'}, Hint: ${supabaseError.hint || 'N/A'}`
    } else {
      errorMessage = String(error)
    }

    logger.error('Rooms query exception', { error, errorMessage, errorDetails })
    return {
      success: false,
      error: `${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}`,
    }
  }
}

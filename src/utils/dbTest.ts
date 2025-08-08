// Database connection and table test utility
import { supabase } from '../lib/supabase'

export interface DBTestResult {
  success: boolean
  message: string
  data?: any
  error?: any
}

export const testDatabaseConnection = async (): Promise<DBTestResult> => {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('hotels')
      .select('count', { count: 'exact', head: true })

    if (error) {
      return {
        success: false,
        message: `Database connection failed: ${error.message}`,
        error,
      }
    }

    return {
      success: true,
      message: 'Database connection successful',
      data: { count: data },
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error,
    }
  }
}

export const testTableAccess = async (tableName: string): Promise<DBTestResult> => {
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1)

    if (error) {
      return {
        success: false,
        message: `Table '${tableName}' access failed: ${error.message}`,
        error,
      }
    }

    return {
      success: true,
      message: `Table '${tableName}' accessible`,
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: `Table '${tableName}' test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error,
    }
  }
}

export const testHotelsTable = async (): Promise<DBTestResult> => {
  try {
    console.log('Testing hotels table access...')

    // Test basic select
    const { data: hotels, error } = await supabase
      .from('hotels')
      .select('id, name, location, is_active')
      .limit(3)

    if (error) {
      console.error('Hotels table error:', error)
      return {
        success: false,
        message: `Hotels table access failed: ${error.message}`,
        error,
      }
    }

    console.log('Hotels table accessible, found:', hotels?.length || 0, 'hotels')

    return {
      success: true,
      message: `Hotels table accessible with ${hotels?.length || 0} records`,
      data: hotels,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Hotels table test failed:', errorMsg)
    return {
      success: false,
      message: `Hotels table test failed: ${errorMsg}`,
      error,
    }
  }
}

export const testRoomsTable = async (): Promise<DBTestResult> => {
  try {
    console.log('Testing rooms table access...')

    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('id, hotel_id, price_per_night')
      .limit(3)

    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown rooms table error'
    console.error('Rooms table error:', errorMessage)
      return {
        success: false,
        message: `Rooms table access failed: ${error.message}`,
        error,
      }
    }

    console.log('Rooms table accessible, found:', rooms?.length || 0, 'rooms')

    return {
      success: true,
      message: `Rooms table accessible with ${rooms?.length || 0} records`,
      data: rooms,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Rooms table test failed:', errorMsg)
    return {
      success: false,
      message: `Rooms table test failed: ${errorMsg}`,
      error,
    }
  }
}

export const runFullDatabaseTest = async () => {
  console.log('🔍 Running full database connectivity test...')

  const results = {
    connection: await testDatabaseConnection(),
    hotels: await testHotelsTable(),
    rooms: await testRoomsTable(),
  }

  console.log('📊 Database test results:', results)

  const allSuccess = Object.values(results).every((result) => result.success)

  if (allSuccess) {
    console.log('✅ All database tests passed!')
  } else {
    console.log('❌ Some database tests failed:')
    Object.entries(results).forEach(([test, result]) => {
      if (!result.success) {
        console.log(`  - ${test}: ${result.message}`)
      }
    })
  }

  return results
}

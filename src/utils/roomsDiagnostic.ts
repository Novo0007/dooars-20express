import { supabase } from '@/lib/supabase'
import { logger } from '@/utils/logger'

export interface RoomsDiagnosticResult {
  tableExists: boolean
  accessible: boolean
  recordCount: number
  sampleRecords: any[]
  schema: any[]
  errors: string[]
  warnings: string[]
}

export async function diagnosticRoomsTable(): Promise<RoomsDiagnosticResult> {
  const result: RoomsDiagnosticResult = {
    tableExists: false,
    accessible: false,
    recordCount: 0,
    sampleRecords: [],
    schema: [],
    errors: [],
    warnings: [],
  }

  try {
    console.log('🔍 Starting rooms table diagnostic...')

    // Test 1: Check if table exists and is accessible
    console.log('📋 Step 1: Testing basic table access...')
    const { data: countData, error: countError } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      result.errors.push(`Table access failed: ${countError.message}`)
      if (countError.code) {
        result.errors.push(`Error code: ${countError.code}`)
      }
      if (countError.details) {
        result.errors.push(`Details: ${countError.details}`)
      }
      if (countError.hint) {
        result.warnings.push(`Hint: ${countError.hint}`)
      }
      return result
    }

    result.tableExists = true
    result.accessible = true
    console.log('✅ Table exists and is accessible')

    // Test 2: Get record count
    console.log('📊 Step 2: Getting record count...')
    const { count } = await supabase.from('rooms').select('*', { count: 'exact', head: true })

    result.recordCount = count || 0
    console.log(`📈 Found ${result.recordCount} records`)

    // Test 3: Get sample records to understand structure
    console.log('🔬 Step 3: Fetching sample records...')
    const { data: sampleData, error: sampleError } = await supabase
      .from('rooms')
      .select('*')
      .limit(3)

    if (sampleError) {
      result.errors.push(`Sample query failed: ${sampleError.message}`)
    } else {
      result.sampleRecords = sampleData || []
      console.log('📄 Sample records retrieved:', result.sampleRecords.length)
    }

    // Test 4: Test specific fields we expect
    console.log('🧪 Step 4: Testing expected fields...')
    const expectedFields = [
      'id',
      'hotel_id',
      'type',
      'price',
      'max_guests',
      'available_count',
      'is_active',
    ]

    for (const field of expectedFields) {
      try {
        const { data, error } = await supabase.from('rooms').select(field).limit(1)

        if (error) {
          result.errors.push(`Field '${field}' test failed: ${error.message}`)
        } else {
          console.log(`✅ Field '${field}' accessible`)
        }
      } catch (err) {
        result.errors.push(`Field '${field}' exception: ${err}`)
      }
    }

    // Test 5: Test hotel relationship
    console.log('🔗 Step 5: Testing hotel relationship...')
    try {
      const { data: relationData, error: relationError } = await supabase
        .from('rooms')
        .select(
          `
          id,
          hotel_id,
          hotels (
            id,
            name
          )
        `,
        )
        .limit(1)

      if (relationError) {
        result.warnings.push(`Hotel relationship test failed: ${relationError.message}`)
      } else {
        console.log('✅ Hotel relationship working')
      }
    } catch (err) {
      result.warnings.push(`Hotel relationship exception: ${err}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown diagnostic error'
    result.errors.push(`Diagnostic exception: ${errorMessage}`)
    logger.error('Rooms diagnostic failed', { error })
  }

  return result
}

export function printDiagnosticReport(result: RoomsDiagnosticResult) {
  console.log('\n🏥 ROOMS TABLE DIAGNOSTIC REPORT')
  console.log('================================')
  console.log(`Table Exists: ${result.tableExists ? '✅' : '❌'}`)
  console.log(`Accessible: ${result.accessible ? '✅' : '❌'}`)
  console.log(`Record Count: ${result.recordCount}`)
  console.log(`Sample Records: ${result.sampleRecords.length}`)

  if (result.sampleRecords.length > 0) {
    console.log('\n📄 Sample Record Structure:')
    console.log(JSON.stringify(result.sampleRecords[0], null, 2))
  }

  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS:')
    result.errors.forEach((error) => console.log(`  - ${error}`))
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:')
    result.warnings.forEach((warning) => console.log(`  - ${warning}`))
  }

  console.log('\n================================\n')
}

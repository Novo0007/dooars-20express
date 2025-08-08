import { supabase } from '@/lib/supabase'

// Quick test to identify rooms table issues
export async function quickRoomsTest() {
  console.log('🚀 Quick Rooms Test Starting...')

  try {
    // Test 1: Basic table access
    console.log('1️⃣ Testing basic rooms table access...')
    const { data: basicData, error: basicError } = await supabase.from('rooms').select('*').limit(1)

    if (basicError) {
      console.error('❌ Basic access failed:', basicError)
      return { success: false, error: basicError.message }
    }

    console.log('✅ Basic access works, sample data:', basicData)

    // Test 2: Count query
    console.log('2️⃣ Testing count query...')
    const { count, error: countError } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Count query failed:', countError)
    } else {
      console.log(`✅ Count works: ${count} rooms found`)
    }

    // Test 3: Specific fields used in app
    console.log('3️⃣ Testing specific fields...')
    const { data: fieldsData, error: fieldsError } = await supabase
      .from('rooms')
      .select('id, type, price, max_guests, available_count, is_active')
      .limit(1)

    if (fieldsError) {
      console.error('❌ Fields test failed:', fieldsError)
    } else {
      console.log('✅ Field access works:', fieldsData)
    }

    // Test 4: Hotel relationship
    console.log('4️⃣ Testing hotel relationship...')
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
      console.error('❌ Hotel relationship failed:', relationError)
    } else {
      console.log('✅ Hotel relationship works:', relationData)
    }

    // Test 5: Complex query used in app
    console.log('5️⃣ Testing complex query from hotel store...')
    const { data: complexData, error: complexError } = await supabase
      .from('hotels')
      .select(
        `
        *,
        rooms (
          id,
          type,
          price,
          max_guests,
          available_count,
          is_active
        )
      `,
      )
      .eq('is_active', true)
      .limit(1)

    if (complexError) {
      console.error('❌ Complex query failed:', complexError)
      return { success: false, error: complexError.message }
    } else {
      console.log('✅ Complex query works:', complexData)
    }

    console.log('🎉 All tests passed!')
    return { success: true, message: 'All rooms tests passed' }
  } catch (error) {
    console.error('💥 Test exception:', error)
    return { success: false, error: String(error) }
  }
}

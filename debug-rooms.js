// Browser Console Debug Script for Rooms Table
// Copy and paste this into the browser console to debug rooms table issues

(async function debugRoomsTable() {
  console.log('🔍 Debugging Rooms Table...');
  
  // Get Supabase client from window (if available)
  const supabase = window.__supabase__ || 
    (window.Vue && window.Vue.createApp && 
     document.querySelector('#app')?.__vue_app__?.config?.globalProperties?.$supabase);
  
  if (!supabase) {
    console.error('❌ Supabase client not found. Make sure you are on the app page.');
    return;
  }

  try {
    // Test 1: Basic query
    console.log('1️⃣ Testing basic rooms query...');
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .limit(3);
    
    if (roomsError) {
      console.error('❌ Rooms query failed:', roomsError);
      console.log('Error details:', {
        message: roomsError.message,
        code: roomsError.code,
        details: roomsError.details,
        hint: roomsError.hint
      });
    } else {
      console.log('✅ Rooms query successful:', rooms);
    }

    // Test 2: Count query
    console.log('2️⃣ Testing count query...');
    const { count, error: countError } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Count query failed:', countError);
    } else {
      console.log(`✅ Count query successful: ${count} rooms`);
    }

    // Test 3: Hotel with rooms join
    console.log('3️⃣ Testing hotel-rooms join...');
    const { data: hotels, error: joinError } = await supabase
      .from('hotels')
      .select(`
        id,
        name,
        rooms (
          id,
          type,
          price
        )
      `)
      .eq('is_active', true)
      .limit(2);
    
    if (joinError) {
      console.error('❌ Join query failed:', joinError);
      console.log('Join error details:', {
        message: joinError.message,
        code: joinError.code,
        details: joinError.details,
        hint: joinError.hint
      });
    } else {
      console.log('✅ Join query successful:', hotels);
    }

    console.log('🎉 Debug complete! Check results above.');

  } catch (error) {
    console.error('💥 Debug script failed:', error);
  }
})();

// Manual queries you can run:
console.log(`
🛠️  Manual Queries:
Copy and paste these one by one to test specific issues:

// Basic rooms query:
supabase.from('rooms').select('*').limit(1)

// Count rooms:
supabase.from('rooms').select('*', { count: 'exact', head: true })

// Test specific fields:
supabase.from('rooms').select('id, type, price, max_guests, available_count, is_active').limit(1)

// Test hotel join:
supabase.from('hotels').select('id, name, rooms(id, type, price)').eq('is_active', true).limit(1)
`);

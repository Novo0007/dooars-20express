# Supabase Configuration Guide

## 🚀 Quick Setup

The app is currently using demo Supabase credentials. To connect to a real Supabase database:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to initialize

### 2. Get Your Credentials
From your Supabase dashboard:

1. **Project URL**: Found in Settings → API
   - Format: `https://your-project-id.supabase.co`

2. **Anon Key**: Found in Settings → API  
   - The `anon` `public` key (starts with `eyJ...`)

### 3. Update Environment Variables

Use the DevServerControl tool to set your real credentials:

```bash
# Set your Supabase URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Set your Supabase anon key  
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Required Database Tables

Your Supabase project needs these tables:

#### Hotels Table
```sql
CREATE TABLE hotels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rating DOUBLE PRECISION DEFAULT 4.5,
  badge TEXT,
  amenities TEXT[],
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Rooms Table  
```sql
CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  hotel_id BIGINT REFERENCES hotels(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  amenities TEXT[],
  max_guests INTEGER DEFAULT 2,
  available_count INTEGER DEFAULT 1,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id BIGINT REFERENCES hotels(id),
  room_id BIGINT REFERENCES rooms(id),
  user_id UUID REFERENCES auth.users(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  rooms_count INTEGER DEFAULT 1,
  total_price NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  final_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id TEXT,
  guest_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Row Level Security (Optional)

Enable RLS and create policies for secure access:

```sql
-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for hotels and rooms
CREATE POLICY "Allow public read access" ON hotels FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON rooms FOR SELECT USING (is_active = true);

-- User can only see their own bookings
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
```

## 🔧 Current Configuration Status

The app includes automatic configuration validation:

- ✅ **Environment Variables**: Set via DevServerControl
- ✅ **Fallback Data**: Demo hotels shown when database is unavailable  
- ✅ **Error Handling**: Proper error messages instead of "[object Object]"
- ✅ **Connection Testing**: Automatic validation on startup

## 🚨 Troubleshooting

### "Failed to fetch" errors
- Check your Supabase project is active
- Verify the URL and anon key are correct
- Ensure tables exist in your database

### No data showing
- The app shows fallback demo data when Supabase isn't configured
- Check browser console for connection errors
- Verify Row Level Security policies if enabled

### Permission errors
- Make sure anon key has proper permissions
- Check RLS policies are not too restrictive
- Verify table structure matches the schema above

---

**Note**: The app currently works with demo data even without a real Supabase connection, so you can explore the features before setting up your database.

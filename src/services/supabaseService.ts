import { supabase } from '../lib/supabase'
import type { Tables, Inserts, Updates } from '../lib/supabase'

export class SupabaseService {
  // Hotels
  static async getHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getHotelById(id: number) {
    const { data, error } = await supabase
      .from('hotels')
      .select(`
        *,
        rooms (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async searchHotels(filters: {
    destination?: string
    minPrice?: number
    maxPrice?: number
    rating?: number
  }) {
    let query = supabase.from('hotels').select('*')

    if (filters.destination) {
      query = query.ilike('location', `%${filters.destination}%`)
    }

    if (filters.rating) {
      query = query.gte('rating', filters.rating)
    }

    query = query.order('rating', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Rooms
  static async getRoomsByHotelId(hotelId: number) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('price', { ascending: true })
    
    if (error) throw error
    return data
  }

  // Reviews
  static async getReviewsByHotelId(hotelId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createReview(review: Inserts<'reviews'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Bookings
  static async createBooking(booking: Inserts<'bookings'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select(`
        *,
        hotels (*),
        rooms (*)
      `)
      .single()
    
    if (error) throw error
    return data
  }

  static async getBookingById(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        hotels (*),
        rooms (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        hotels (*),
        rooms (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateBooking(id: string, updates: Updates<'bookings'>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async cancelBooking(id: string) {
    return this.updateBooking(id, { status: 'cancelled' })
  }

  // Utility methods
  static async uploadImage(file: File, bucket: string, path: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  }

  static getImageUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}

// Example SQL to create the tables in Supabase:
/*
-- Hotels table
CREATE TABLE hotels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0,
  badge TEXT,
  amenities TEXT[],
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  hotel_id BIGINT REFERENCES hotels(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  amenities TEXT[],
  max_guests INTEGER DEFAULT 2,
  available_count INTEGER DEFAULT 1,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  hotel_id BIGINT REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id BIGINT REFERENCES hotels(id),
  room_id BIGINT REFERENCES rooms(id),
  user_id UUID REFERENCES auth.users(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  rooms_count INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  final_price DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_id TEXT,
  guest_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies (adjust as needed for your security requirements)
CREATE POLICY "Hotels are viewable by everyone" ON hotels FOR SELECT USING (true);
CREATE POLICY "Rooms are viewable by everyone" ON rooms FOR SELECT USING (true);
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
*/

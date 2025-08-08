-- Enhanced Dooars Express Database Schema with Authentication and Admin Features

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS booking_stats CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hotels table with enhanced fields for admin management
CREATE TABLE hotels (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  badge TEXT,
  amenities TEXT[],
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
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
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  preferred_language TEXT DEFAULT 'en',
  role TEXT CHECK (role IN ('user', 'admin', 'super_admin')) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id BIGINT REFERENCES hotels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, hotel_id)
);

-- Reviews table
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  hotel_id BIGINT REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced bookings table
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
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial_refund')) DEFAULT 'pending',
  payment_id TEXT,
  payment_method TEXT,
  cancellation_reason TEXT,
  special_requests TEXT,
  guest_info JSONB NOT NULL,
  nights INTEGER GENERATED ALWAYS AS (check_out - check_in) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking statistics view for admin dashboard
CREATE TABLE booking_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  confirmed_bookings INTEGER DEFAULT 0,
  cancelled_bookings INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  average_booking_value DECIMAL(10, 2) DEFAULT 0,
  unique_customers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month)
);

-- Enable RLS (Row Level Security)
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Hotels
CREATE POLICY "Hotels are viewable by everyone" ON hotels 
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Hotels are manageable by admins" ON hotels 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for Rooms
CREATE POLICY "Rooms are viewable by everyone" ON rooms 
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (SELECT 1 FROM hotels WHERE hotels.id = rooms.hotel_id AND hotels.is_active = true)
  );
  
CREATE POLICY "Rooms are manageable by admins" ON rooms 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for User Profiles
CREATE POLICY "Users can view their own profile" ON user_profiles 
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own profile" ON user_profiles 
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Admins can view all profiles" ON user_profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for User Favorites
CREATE POLICY "Users can manage their own favorites" ON user_favorites 
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews 
  FOR SELECT USING (is_approved = true);
  
CREATE POLICY "Users can create reviews" ON reviews 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can edit their own reviews" ON reviews 
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can manage all reviews" ON reviews 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for Bookings
CREATE POLICY "Users can view their own bookings" ON bookings 
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create bookings" ON bookings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own bookings" ON bookings 
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can view all bookings" ON bookings 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for Booking Stats
CREATE POLICY "Admins can view booking stats" ON booking_stats 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Functions to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update hotel ratings automatically
CREATE OR REPLACE FUNCTION public.update_hotel_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hotels 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2) 
      FROM reviews 
      WHERE hotel_id = COALESCE(NEW.hotel_id, OLD.hotel_id) 
      AND is_approved = true
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE hotel_id = COALESCE(NEW.hotel_id, OLD.hotel_id) 
      AND is_approved = true
    )
  WHERE id = COALESCE(NEW.hotel_id, OLD.hotel_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update hotel ratings when reviews change
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_hotel_rating();

-- Function to generate booking statistics
CREATE OR REPLACE FUNCTION public.update_booking_stats()
RETURNS void AS $$
BEGIN
  INSERT INTO booking_stats (
    month,
    total_bookings,
    confirmed_bookings,
    cancelled_bookings,
    total_revenue,
    average_booking_value,
    unique_customers
  )
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
    SUM(final_price) FILTER (WHERE payment_status = 'paid') as total_revenue,
    AVG(final_price) FILTER (WHERE payment_status = 'paid') as average_booking_value,
    COUNT(DISTINCT user_id) as unique_customers
  FROM bookings
  WHERE created_at >= DATE_TRUNC('month', NOW() - INTERVAL '12 months')
  GROUP BY DATE_TRUNC('month', created_at)
  ON CONFLICT (month) DO UPDATE SET
    total_bookings = EXCLUDED.total_bookings,
    confirmed_bookings = EXCLUDED.confirmed_bookings,
    cancelled_bookings = EXCLUDED.cancelled_bookings,
    total_revenue = EXCLUDED.total_revenue,
    average_booking_value = EXCLUDED.average_booking_value,
    unique_customers = EXCLUDED.unique_customers,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample hotels (keeping existing data)
INSERT INTO hotels (name, location, description, latitude, longitude, rating, badge, amenities, images, featured) VALUES
(
  'Ocean View Resort',
  'Maldives',
  'Luxury overwater resort with stunning ocean views and world-class amenities. Experience paradise with crystal-clear waters, pristine beaches, and exceptional service that will make your stay unforgettable.',
  3.2028,
  73.2207,
  4.9,
  'Luxury',
  ARRAY['Private Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Room Service', 'Diving Center', 'Fitness Center'],
  ARRAY[
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
  ],
  true
),
(
  'Mountain Lodge',
  'Swiss Alps, Switzerland',
  'Cozy mountain retreat with breathtaking alpine views and rustic charm. Perfect for skiing enthusiasts and nature lovers seeking tranquility in the heart of the Alps.',
  46.8182,
  8.2275,
  4.8,
  'Featured',
  ARRAY['Fireplace', 'Spa', 'Restaurant', 'Ski Access', 'WiFi', 'Balcony', 'Hiking Trails', 'Mountain Views'],
  ARRAY[
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  ],
  true
),
(
  'City Center Hotel',
  'New York, USA',
  'Modern hotel in the heart of Manhattan with easy access to major attractions. Experience the vibrant energy of New York City while enjoying luxury accommodations and top-notch amenities.',
  40.7128,
  -74.0060,
  4.7,
  'Popular',
  ARRAY['Gym', 'Business Center', 'Restaurant', 'Bar', 'WiFi', 'Concierge', 'Rooftop Terrace', '24/7 Service'],
  ARRAY[
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'
  ],
  true
),
(
  'Santorini Sunset Villa',
  'Santorini, Greece',
  'Stunning villa overlooking the Aegean Sea with infinity pool and sunset views. Experience the magic of Santorini with its iconic white-washed buildings and breathtaking sunsets.',
  36.3932,
  25.4615,
  4.9,
  'Romantic',
  ARRAY['Infinity Pool', 'Sunset Views', 'Private Terrace', 'Spa', 'WiFi', 'Breakfast', 'Hot Tub', 'Wine Cellar'],
  ARRAY[
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544024663-274167469b96?w=800&h=600&fit=crop'
  ],
  false
);

-- Insert sample rooms
INSERT INTO rooms (hotel_id, type, price, description, amenities, max_guests, available_count, images) VALUES
-- Ocean View Resort rooms
(1, 'Overwater Villa', 450, 'Spacious villa with direct ocean access and private pool', ARRAY['Private Pool', 'Ocean View', 'King Bed', 'Outdoor Shower'], 2, 3, ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop']),
(1, 'Beach Suite', 350, 'Elegant suite steps from the beach with panoramic views', ARRAY['Beach Access', 'Ocean View', 'Queen Bed', 'Private Terrace'], 2, 5, ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop']),
(1, 'Garden Villa', 280, 'Peaceful villa surrounded by tropical gardens', ARRAY['Garden View', 'King Bed', 'Private Patio', 'Mini Bar'], 2, 4, ARRAY['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop']),

-- Mountain Lodge rooms
(2, 'Alpine Suite', 320, 'Luxury suite with mountain panorama and fireplace', ARRAY['Fireplace', 'Mountain View', 'King Bed', 'Balcony'], 2, 2, ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop']),
(2, 'Cozy Cabin', 220, 'Rustic cabin with modern amenities and garden views', ARRAY['Fireplace', 'Garden View', 'Queen Bed', 'Kitchenette'], 2, 6, ARRAY['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop']),

-- City Center Hotel rooms
(3, 'Executive Suite', 380, 'Spacious suite with city skyline views and living area', ARRAY['City View', 'Living Room', 'King Bed', 'Work Desk'], 3, 4, ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop']),
(3, 'Standard Room', 280, 'Comfortable room with modern amenities and city views', ARRAY['City View', 'Work Desk', 'Queen Bed', 'Coffee Machine'], 2, 8, ARRAY['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop']),

-- Santorini Sunset Villa rooms
(4, 'Sunset Villa', 380, 'Private villa with infinity pool and sunset views', ARRAY['Infinity Pool', 'Sunset View', 'King Bed', 'Hot Tub'], 4, 2, ARRAY['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop']);

-- Insert sample reviews
INSERT INTO reviews (hotel_id, user_name, user_avatar, rating, comment, is_verified, is_approved) VALUES
(1, 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 5, 'Absolutely stunning resort! The overwater villa was a dream come true. The service was impeccable and the views were breathtaking.', true, true),
(1, 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 5, 'Perfect honeymoon destination. The staff went above and beyond to make our stay special. Highly recommend!', true, true),
(1, 'Emma Williams', NULL, 4, 'Beautiful location and excellent amenities. The spa was incredible. Only minor issue was the wifi speed in some areas.', false, true),
(1, 'David Rodriguez', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 5, 'Exceeded all expectations. The dining options were fantastic and the overwater bungalow was magical.', true, true),

(2, 'Lisa Anderson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 5, 'Amazing mountain retreat! The views were incredible and the skiing was world-class. Perfect for a winter getaway.', true, true),
(2, 'James Wilson', NULL, 4, 'Cozy and comfortable lodge with excellent service. The fireplace in our room was a nice touch.', false, true),

(3, 'Maria Garcia', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face', 4, 'Great location in the heart of Manhattan. Easy access to everything. The rooftop bar was amazing!', true, true),
(3, 'Robert Brown', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', 5, 'Excellent business hotel with all the amenities needed. The concierge service was outstanding.', true, true);

-- Create indexes for better performance
CREATE INDEX idx_hotels_rating ON hotels(rating DESC);
CREATE INDEX idx_hotels_location ON hotels USING gin(to_tsvector('english', location));
CREATE INDEX idx_hotels_featured ON hotels(featured) WHERE featured = true;
CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_rooms_price ON rooms(price);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_hotel_id ON user_favorites(hotel_id);
CREATE INDEX idx_reviews_hotel_id ON reviews(hotel_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_hotel_id ON bookings(hotel_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_booking_stats_month ON booking_stats(month DESC);

-- Initialize booking stats for the last 12 months
SELECT public.update_booking_stats();

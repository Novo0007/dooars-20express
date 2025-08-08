-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;

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
  user_id UUID,
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
  user_id UUID,
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
CREATE POLICY "Bookings are viewable by everyone" ON bookings FOR SELECT USING (true);

-- Insert sample hotels
INSERT INTO hotels (name, location, description, latitude, longitude, rating, badge, amenities, images) VALUES
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
  ]
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
  ]
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
  ]
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
  ]
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
INSERT INTO reviews (hotel_id, user_name, user_avatar, rating, comment) VALUES
(1, 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 5, 'Absolutely stunning resort! The overwater villa was a dream come true. The service was impeccable and the views were breathtaking.'),
(1, 'Michael Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 5, 'Perfect honeymoon destination. The staff went above and beyond to make our stay special. Highly recommend!'),
(1, 'Emma Williams', NULL, 4, 'Beautiful location and excellent amenities. The spa was incredible. Only minor issue was the wifi speed in some areas.'),
(1, 'David Rodriguez', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 5, 'Exceeded all expectations. The dining options were fantastic and the overwater bungalow was magical.'),

(2, 'Lisa Anderson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 5, 'Amazing mountain retreat! The views were incredible and the skiing was world-class. Perfect for a winter getaway.'),
(2, 'James Wilson', NULL, 4, 'Cozy and comfortable lodge with excellent service. The fireplace in our room was a nice touch.'),

(3, 'Maria Garcia', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face', 4, 'Great location in the heart of Manhattan. Easy access to everything. The rooftop bar was amazing!'),
(3, 'Robert Brown', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', 5, 'Excellent business hotel with all the amenities needed. The concierge service was outstanding.');

-- Create indexes for better performance
CREATE INDEX idx_hotels_rating ON hotels(rating DESC);
CREATE INDEX idx_hotels_location ON hotels USING gin(to_tsvector('english', location));
CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_rooms_price ON rooms(price);
CREATE INDEX idx_reviews_hotel_id ON reviews(hotel_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_hotel_id ON bookings(hotel_id);
CREATE INDEX idx_bookings_status ON bookings(status);

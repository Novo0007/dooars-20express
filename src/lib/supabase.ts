import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface Database {
  public: {
    Tables: {
      hotels: {
        Row: {
          id: number
          name: string
          location: string
          description: string
          latitude: number
          longitude: number
          rating: number
          badge: string
          amenities: string[]
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          location: string
          description: string
          latitude: number
          longitude: number
          rating?: number
          badge?: string
          amenities?: string[]
          images?: string[]
        }
        Update: {
          name?: string
          location?: string
          description?: string
          latitude?: number
          longitude?: number
          rating?: number
          badge?: string
          amenities?: string[]
          images?: string[]
        }
      }
      rooms: {
        Row: {
          id: number
          hotel_id: number
          type: string
          price: number
          description: string
          amenities: string[]
          max_guests: number
          available_count: number
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          hotel_id: number
          type: string
          price: number
          description: string
          amenities?: string[]
          max_guests?: number
          available_count?: number
          images?: string[]
        }
        Update: {
          hotel_id?: number
          type?: string
          price?: number
          description?: string
          amenities?: string[]
          max_guests?: number
          available_count?: number
          images?: string[]
        }
      }
      reviews: {
        Row: {
          id: number
          hotel_id: number
          user_id: string
          user_name: string
          user_avatar: string | null
          rating: number
          comment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          hotel_id: number
          user_id: string
          user_name: string
          user_avatar?: string | null
          rating: number
          comment: string
        }
        Update: {
          hotel_id?: number
          user_id?: string
          user_name?: string
          user_avatar?: string | null
          rating?: number
          comment?: string
        }
      }
      bookings: {
        Row: {
          id: string
          hotel_id: number
          room_id: number
          user_id: string
          check_in: string
          check_out: string
          guests: number
          rooms_count: number
          total_price: number
          discount_amount: number
          final_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_id: string | null
          guest_info: {
            firstName: string
            lastName: string
            email: string
            phone: string
            specialRequests?: string
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id: number
          room_id: number
          user_id: string
          check_in: string
          check_out: string
          guests: number
          rooms_count: number
          total_price: number
          discount_amount?: number
          final_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_id?: string | null
          guest_info: {
            firstName: string
            lastName: string
            email: string
            phone: string
            specialRequests?: string
          }
        }
        Update: {
          hotel_id?: number
          room_id?: number
          user_id?: string
          check_in?: string
          check_out?: string
          guests?: number
          rooms_count?: number
          total_price?: number
          discount_amount?: number
          final_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_id?: string | null
          guest_info?: {
            firstName: string
            lastName: string
            email: string
            phone: string
            specialRequests?: string
          }
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

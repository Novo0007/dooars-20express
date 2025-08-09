import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.includes('.supabase.co')
  )
}

// Helper to format Supabase errors properly
export const formatSupabaseError = (error: any): string => {
  if (!error) return 'Unknown error'

  if (typeof error === 'string') return error

  if (error.message) {
    const details = error.code ? ` (Code: ${error.code})` : ''
    const hint = error.hint ? `, Hint: ${error.hint}` : ''
    return `${error.message}${details}${hint}`
  }

  // Fallback for complex error objects
  try {
    return JSON.stringify(error)
  } catch {
    return '[Complex error object - check console]'
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Test connection on module load (in development)
if (import.meta.env.DEV) {
  const testConnection = async () => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured - using placeholder values')
      console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
      return
    }

    try {
      const { error } = await supabase.from('hotels').select('count').limit(1)
      if (error) {
        console.error('Supabase connection test failed:', formatSupabaseError(error))
      } else {
        console.log('✅ Supabase connection successful')
      }
    } catch (err) {
      console.error('Supabase connection test error:', err)
    }
  }

  // Run test after a short delay to avoid blocking module loading
  setTimeout(testConnection, 1000)
}

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
          user_profiles: {
            Row: {
              id: string
              email: string
              full_name: string | null
              avatar_url: string | null
              phone: string | null
              date_of_birth: string | null
              preferred_language: string
              role: 'user' | 'admin' | 'super_admin'
              is_active: boolean
              email_notifications: boolean
              marketing_emails: boolean
              created_at: string
              updated_at: string
            }
            Insert: {
              id: string
              email: string
              full_name?: string | null
              avatar_url?: string | null
              phone?: string | null
              date_of_birth?: string | null
              preferred_language?: string
              role?: 'user' | 'admin' | 'super_admin'
              is_active?: boolean
              email_notifications?: boolean
              marketing_emails?: boolean
            }
            Update: {
              email?: string
              full_name?: string | null
              avatar_url?: string | null
              phone?: string | null
              date_of_birth?: string | null
              preferred_language?: string
              role?: 'user' | 'admin' | 'super_admin'
              is_active?: boolean
              email_notifications?: boolean
              marketing_emails?: boolean
            }
          }
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

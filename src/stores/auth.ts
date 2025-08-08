import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  date_of_birth?: string
  preferred_language: string
  role: 'user' | 'admin' | 'super_admin'
  is_active: boolean
  email_notifications: boolean
  marketing_emails: boolean
  created_at: string
  updated_at: string
}

export interface User extends SupabaseUser {
  profile?: UserProfile
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!session.value)
  const userDisplayName = computed(() => {
    if (!user.value?.profile?.full_name) return user.value?.email || ''
    return user.value.profile.full_name
  })
  const isAdmin = computed(
    () => user.value?.profile?.role === 'admin' || user.value?.profile?.role === 'super_admin',
  )

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Customize error messages for better user experience
        if (authError.message.includes('Email not confirmed')) {
          throw new Error(
            'Please check your email and click the confirmation link before signing in.',
          )
        }
        throw authError
      }

      if (data.user && data.session) {
        await setUser(data.user, data.session)
      }

      return { user: data.user, session: data.session }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const signup = async (userData: {
    email: string
    password: string
    full_name: string
    phone?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
          },
        },
      })

      if (authError) throw authError

      if (data.user && data.session) {
        await setUser(data.user, data.session)
      }

      return { user: data.user, session: data.session }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Signup failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError

      // Clear state
      user.value = null
      session.value = null
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err instanceof Error ? err.message : 'Logout failed'
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user.value || !user.value.profile) throw new Error('No user logged in')

    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local state
      if (user.value.profile) {
        user.value.profile = { ...user.value.profile, ...data }
      }

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Profile update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addFavoriteHotel = async (hotelId: number) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      const { error: insertError } = await supabase.from('user_favorites').insert({
        user_id: user.value.id,
        hotel_id: hotelId,
      })

      if (insertError) throw insertError
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add favorite'
      throw err
    }
  }

  const removeFavoriteHotel = async (hotelId: number) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.value.id)
        .eq('hotel_id', hotelId)

      if (deleteError) throw deleteError
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove favorite'
      throw err
    }
  }

  const getUserFavorites = async (): Promise<number[]> => {
    if (!user.value) return []

    try {
      const { data, error: fetchError } = await supabase
        .from('user_favorites')
        .select('hotel_id')
        .eq('user_id', user.value.id)

      if (fetchError) throw fetchError

      return data.map((item) => item.hotel_id)
    } catch (err) {
      console.error('Failed to fetch favorites:', err)
      return []
    }
  }

  const setUser = async (authUser: SupabaseUser, authSession: Session) => {
    session.value = authSession

    // Note: Removed problematic connection test that was causing RLS infinite recursion

    // Fetch user profile
    try {
      console.log('Fetching profile for user:', authUser.id, authUser.email)

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 = row not found, which is expected for new users
        console.error('Profile fetch error:', profileError.message || profileError.hint || JSON.stringify(profileError))

        // Try to create a basic profile for new users
        if (profileError.code === 'PGRST116') {
          console.log('Creating basic profile for new user...')
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || null,
              role: 'user'
            })
            .select()
            .single()

          if (createError) {
            console.error('Failed to create user profile:', createError.message)
          } else {
            console.log('Created new user profile successfully')
            user.value = {
              ...authUser,
              profile: newProfile,
            }
            return
          }
        }

        throw profileError
      }

      if (profile) {
        console.log('Found user profile:', profile.full_name, profile.role)
      } else {
        console.log('No profile found for user, will use basic auth data')
      }

      user.value = {
        ...authUser,
        profile: profile || undefined,
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err instanceof Error ? err.message : JSON.stringify(err))
      // Even if profile fetch fails, set the basic user info
      user.value = authUser
    }
  }

  const initializeAuth = async () => {
    try {
      // Validate Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co' ||
          !supabaseKey || supabaseKey === 'your-anon-key') {
        console.error('Supabase configuration is missing or using default values. Please check your .env file.')
        console.log('Current URL:', supabaseUrl)
        isInitialized.value = true
        return
      }

      // Get current session
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Failed to get session:', sessionError.message || JSON.stringify(sessionError))
        return
      }

      if (currentSession?.user) {
        console.log('Found existing session for user:', currentSession.user.email)
        await setUser(currentSession.user, currentSession)
      } else {
        console.log('No existing session found')
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, authSession) => {
        console.log('Auth state change:', event, authSession?.user?.email)

        if (event === 'SIGNED_IN' && authSession?.user) {
          await setUser(authSession.user, authSession)
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          session.value = null
        } else if (event === 'TOKEN_REFRESHED' && authSession?.user) {
          await setUser(authSession.user, authSession)
        }
      })
    } catch (err) {
      console.error('Failed to initialize auth:', err)
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) throw resetError
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Password reset failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPassword: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Password update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resendConfirmation = async (email: string) => {
    loading.value = true
    error.value = null

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (resendError) throw resendError
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to resend confirmation email'
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshUserProfile = async () => {
    if (!user.value) return

    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (profileError) throw profileError

      if (profile) {
        user.value = {
          ...user.value,
          profile: profile,
        }
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err)
    }
  }

  return {
    // State
    user,
    session,
    loading,
    error,

    // Computed
    isAuthenticated,
    userDisplayName,
    isAdmin,

    // Actions
    login,
    signup,
    logout,
    updateProfile,
    addFavoriteHotel,
    removeFavoriteHotel,
    getUserFavorites,
    initializeAuth,
    resetPassword,
    refreshUserProfile,
    updatePassword,
    resendConfirmation,
  }
})

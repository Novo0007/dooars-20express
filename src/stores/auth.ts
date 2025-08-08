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
  const isInitialized = ref(false)
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

  const isSuperAdmin = computed(() => user.value?.profile?.role === 'super_admin')

  const isHotelManager = computed(() => user.value?.profile?.role === 'hotel_manager')

  const userRole = computed(() => user.value?.profile?.role || 'user')

  // Hotel assignments for hotel managers
  const hotelAssignments = ref<any[]>([])
  const assignedHotels = computed(() =>
    hotelAssignments.value.map((assignment) => assignment.hotel_id),
  )

  // Role-based permissions system
  const permissions = computed(() => {
    const role = userRole.value

    const basePermissions = {
      // Basic user permissions
      view_own_profile: true,
      edit_own_profile: true,
      view_hotels: true,
      create_booking: true,
      view_own_bookings: true,
      cancel_own_booking: true,
      add_favorites: true,
      leave_reviews: true,
    }

    const hotelManagerPermissions = {
      ...basePermissions,
      // Hotel manager permissions (limited to assigned hotels)
      view_hotel_dashboard: true,
      view_assigned_hotels: true,
      manage_assigned_hotels: true,
      manage_assigned_rooms: true,
      view_assigned_bookings: true,
      manage_assigned_bookings: true,
      view_assigned_reports: true,
      export_assigned_data: true,
      moderate_assigned_reviews: true,
    }

    const adminPermissions = {
      ...basePermissions,
      // Admin permissions
      view_admin_dashboard: true,
      view_all_users: true,
      edit_user_profiles: true,
      view_all_bookings: true,
      manage_bookings: true,
      manage_hotels: true,
      manage_rooms: true,
      view_reports: true,
      export_data: true,
      moderate_reviews: true,
      activate_deactivate_users: true,
      assign_hotel_managers: true,
    }

    const superAdminPermissions = {
      ...adminPermissions,
      // Super admin permissions
      manage_admin_users: true,
      delete_users: true,
      system_settings: true,
      backup_restore: true,
      invite_users: true,
      change_user_roles: true,
      delete_hotels: true,
      delete_bookings: true,
    }

    switch (role) {
      case 'super_admin':
        return superAdminPermissions
      case 'admin':
        return adminPermissions
      case 'hotel_manager':
        return hotelManagerPermissions
      case 'user':
      default:
        return basePermissions
    }
  })

  const hasPermission = (permission: string) => {
    return permissions.value[permission] || false
  }

  const canManageUser = (targetUser: any) => {
    if (!isAdmin.value) return false

    // Super admins can manage anyone
    if (isSuperAdmin.value) return true

    // Admins can manage regular users and hotel managers but not other admins
    if (targetUser.role === 'admin' || targetUser.role === 'super_admin') {
      return false
    }

    return true
  }

  const fetchHotelAssignments = async () => {
    if (!user.value || !isHotelManager.value) return

    try {
      const { data, error } = await supabase
        .from('hotel_assignments')
        .select('*, hotel:hotels(*)')
        .eq('user_id', user.value.id)
        .eq('is_active', true)

      if (error) throw error
      hotelAssignments.value = data || []
    } catch (error) {
      console.error('Error fetching hotel assignments:', error)
    }
  }

  const assignUserToHotel = async (userId: string, hotelId: number, role: string = 'manager') => {
    try {
      const { data, error } = await supabase
        .from('hotel_assignments')
        .upsert({
          user_id: userId,
          hotel_id: hotelId,
          role: role,
          assigned_by: user.value?.id,
          is_active: true,
        })
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error assigning user to hotel:', error)
      throw error
    }
  }

  const removeUserFromHotel = async (userId: string, hotelId: number) => {
    try {
      const { error } = await supabase
        .from('hotel_assignments')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('hotel_id', hotelId)

      if (error) throw error
    } catch (error) {
      console.error('Error removing user from hotel:', error)
      throw error
    }
  }

  const canAccessHotel = (hotelId: number) => {
    // Admins and super admins can access all hotels
    if (isAdmin.value) return true

    // Hotel managers can only access assigned hotels
    if (isHotelManager.value) {
      return assignedHotels.value.includes(hotelId)
    }

    return false
  }

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
        console.error(
          'Profile fetch error:',
          profileError.message || profileError.hint || JSON.stringify(profileError),
        )

        // Try to create a basic profile for new users
        if (profileError.code === 'PGRST116') {
          console.log('Creating basic profile for new user...')
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || null,
              role: 'user',
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

      // Auto-fetch hotel assignments for hotel managers
      if (profile?.role === 'hotel_manager') {
        await fetchHotelAssignments()
      }
    } catch (err) {
      console.error(
        'Failed to fetch user profile:',
        err instanceof Error ? err.message : JSON.stringify(err),
      )
      // Even if profile fetch fails, set the basic user info
      user.value = authUser
    }
  }

  const initializeAuth = async () => {
    try {
      // Validate Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (
        !supabaseUrl ||
        supabaseUrl === 'https://your-project.supabase.co' ||
        !supabaseKey ||
        supabaseKey === 'your-anon-key'
      ) {
        console.error(
          'Supabase configuration is missing or using default values. Please check your .env file.',
        )
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
        console.error(
          'Failed to get session:',
          sessionError.message || JSON.stringify(sessionError),
        )
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
    isInitialized,

    // Computed
    isAuthenticated,
    userDisplayName,
    isAdmin,
    isSuperAdmin,
    isHotelManager,
    userRole,
    permissions,
    hotelAssignments,
    assignedHotels,

    // Permission functions
    hasPermission,
    canManageUser,
    canAccessHotel,

    // Hotel assignment functions
    fetchHotelAssignments,
    assignUserToHotel,
    removeUserFromHotel,

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

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  preferences: {
    language: string
    currency: string
    notifications: boolean
  }
  favoriteHotels: number[]
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum'
  joinedAt: Date
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      // Mock login API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        preferences: {
          language: 'en',
          currency: 'USD',
          notifications: true,
        },
        favoriteHotels: [1, 3],
        membershipLevel: 'gold',
        joinedAt: new Date('2023-01-15'),
      }

      const mockToken = 'mock-jwt-token-12345'

      user.value = mockUser
      token.value = mockToken

      // Store in localStorage
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user_data', JSON.stringify(mockUser))

      return { user: mockUser, token: mockToken }
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
    firstName: string
    lastName: string
    phone?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      // Mock signup API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful signup
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        preferences: {
          language: 'en',
          currency: 'USD',
          notifications: true,
        },
        favoriteHotels: [],
        membershipLevel: 'bronze',
        joinedAt: new Date(),
      }

      const newToken = `mock-jwt-token-${Date.now()}`

      user.value = newUser
      token.value = newToken

      // Store in localStorage
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('user_data', JSON.stringify(newUser))

      return { user: newUser, token: newToken }
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
      // Mock logout API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Clear state
      user.value = null
      token.value = null

      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) throw new Error('No user logged in')

    loading.value = true
    error.value = null

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data
      user.value = { ...user.value, ...updates }

      // Update localStorage
      localStorage.setItem('user_data', JSON.stringify(user.value))

      return user.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Profile update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addFavoriteHotel = async (hotelId: number) => {
    if (!user.value) return

    if (!user.value.favoriteHotels.includes(hotelId)) {
      user.value.favoriteHotels.push(hotelId)
      localStorage.setItem('user_data', JSON.stringify(user.value))
    }
  }

  const removeFavoriteHotel = async (hotelId: number) => {
    if (!user.value) return

    user.value.favoriteHotels = user.value.favoriteHotels.filter((id) => id !== hotelId)
    localStorage.setItem('user_data', JSON.stringify(user.value))
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch (err) {
        console.error('Failed to restore auth state:', err)
        // Clear invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
  }

  const refreshToken = async () => {
    if (!token.value) return false

    try {
      // Mock token refresh
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newToken = `refreshed-token-${Date.now()}`
      token.value = newToken
      localStorage.setItem('auth_token', newToken)

      return true
    } catch (err) {
      console.error('Token refresh failed:', err)
      await logout()
      return false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,
    userDisplayName,

    // Actions
    login,
    signup,
    logout,
    updateProfile,
    addFavoriteHotel,
    removeFavoriteHotel,
    initializeAuth,
    refreshToken,
  }
})

<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">My Profile</h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Summary Card -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft p-6">
            <div class="text-center">
              <!-- Avatar -->
              <div class="relative inline-block mb-4">
                <img
                  v-if="authStore.user?.profile?.avatar_url"
                  :src="authStore.user.profile.avatar_url"
                  :alt="authStore.userDisplayName"
                  class="w-24 h-24 rounded-full mx-auto"
                />
                <div
                  v-else
                  class="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold mx-auto"
                >
                  {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
                </div>
                <button
                  @click="showAvatarUpload = true"
                  class="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>

              <h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {{ authStore.userDisplayName || 'User' }}
              </h3>
              <p class="text-neutral-600 dark:text-neutral-400 mb-4">
                {{ authStore.user?.email }}
              </p>

              <!-- Role Badge -->
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getRoleBadgeClass()"
              >
                {{ getRoleLabel() }}
              </span>
            </div>

            <!-- Quick Stats -->
            <div class="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {{ stats.totalBookings }}
                  </div>
                  <div class="text-sm text-neutral-600 dark:text-neutral-400">Total Bookings</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {{ stats.favoriteHotels }}
                  </div>
                  <div class="text-sm text-neutral-600 dark:text-neutral-400">Favorite Hotels</div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-6 space-y-2">
              <router-link
                to="/favorites"
                class="w-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                View Favorites
              </router-link>
              <router-link
                to="/booking-history"
                class="w-full bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Booking History
              </router-link>
            </div>
          </div>
        </div>

        <!-- Profile Settings -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft p-6">
            <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Profile Settings
            </h2>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Personal Information -->
              <div>
                <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Personal Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      v-model="profileForm.full_name"
                      type="text"
                      class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                      placeholder="Enter your email address"
                      readonly
                    />
                    <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Email cannot be changed from here. Contact support if needed.
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      v-model="profileForm.phone"
                      type="tel"
                      class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Date of Birth
                    </label>
                    <input
                      v-model="profileForm.date_of_birth"
                      type="date"
                      class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Preferred Language
                    </label>
                    <select
                      v-model="profileForm.preferred_language"
                      class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Preferences -->
              <div>
                <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                  Preferences
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="font-medium text-neutral-900 dark:text-neutral-100">
                        Email Notifications
                      </label>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400">
                        Receive booking confirmations and updates
                      </p>
                    </div>
                    <input
                      v-model="profileForm.email_notifications"
                      type="checkbox"
                      class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="font-medium text-neutral-900 dark:text-neutral-100">
                        Marketing Emails
                      </label>
                      <p class="text-sm text-neutral-600 dark:text-neutral-400">
                        Receive deals, promotions, and travel tips
                      </p>
                    </div>
                    <input
                      v-model="profileForm.marketing_emails"
                      type="checkbox"
                      class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
                  </div>
                </div>
              </div>

              <!-- Success Message -->
              <div v-if="success" class="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div class="ml-3">
                    <p class="text-sm text-green-800 dark:text-green-200">{{ success }}</p>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  <span v-if="loading" class="flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password Section -->
          <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft p-6 mt-6">
            <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Change Password
            </h2>
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  New Password
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="Confirm new password"
                />
              </div>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="passwordLoading || !isPasswordFormValid"
                  class="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 disabled:bg-neutral-400 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  <span v-if="passwordLoading">Updating...</span>
                  <span v-else>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { supabase } from '@/lib/supabase'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const passwordLoading = ref(false)
const error = ref('')
const success = ref('')
const showAvatarUpload = ref(false)

const stats = ref({
  totalBookings: 0,
  favoriteHotels: 0,
})

// Profile form
const profileForm = ref({
  full_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  preferred_language: 'en',
  email_notifications: true,
  marketing_emails: false,
})

// Password form
const passwordForm = ref({
  newPassword: '',
  confirmPassword: '',
})

const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.newPassword.length >= 6 &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword
  )
})

const getRoleLabel = () => {
  const role = authStore.user?.profile?.role
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'super_admin':
      return 'Super Admin'
    default:
      return 'Member'
  }
}

const getRoleBadgeClass = () => {
  const role = authStore.user?.profile?.role
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }
}

const loadUserStats = async () => {
  if (!authStore.isAuthenticated) return

  try {
    // Get booking count
    const { count: bookingCount, error: bookingError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user!.id)

    if (bookingError) throw bookingError

    // Get favorites count
    const { count: favoritesCount, error: favoritesError } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user!.id)

    if (favoritesError) throw favoritesError

    stats.value = {
      totalBookings: bookingCount || 0,
      favoriteHotels: favoritesCount || 0,
    }

    console.log('User stats loaded successfully')
  } catch (error) {
    console.error('Failed to load user stats:', error)
    notificationStore.warning('Some profile statistics could not be loaded.')

    // Set default values even if there's an error
    stats.value = {
      totalBookings: 0,
      favoriteHotels: 0,
    }
  }
}

const loadProfileData = () => {
  if (authStore.user?.profile) {
    profileForm.value = {
      full_name: authStore.user.profile.full_name || '',
      email: authStore.user.email || '',
      phone: authStore.user.profile.phone || '',
      date_of_birth: authStore.user.profile.date_of_birth || '',
      preferred_language: authStore.user.profile.preferred_language || 'en',
      email_notifications: authStore.user.profile.email_notifications ?? true,
      marketing_emails: authStore.user.profile.marketing_emails ?? false,
    }
  }
}

const updateProfile = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    console.log('Submitting profile form:', profileForm.value)

    // Validate required fields
    if (!profileForm.value.full_name?.trim()) {
      throw new Error('Full name is required')
    }

    // Email is always available from auth store, no need to validate form email

    // Update profile via auth store
    await authStore.updateProfile(profileForm.value)

    success.value = 'Profile updated successfully!'
    notificationStore.success('Profile updated successfully!')

    console.log('Profile update completed successfully')

    setTimeout(() => {
      success.value = ''
    }, 5000)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
    error.value = errorMessage
    notificationStore.error(errorMessage)
    console.error('Profile update error:', err)
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (!isPasswordFormValid.value) return

  try {
    passwordLoading.value = true
    error.value = ''
    success.value = ''

    await authStore.updatePassword(passwordForm.value.newPassword)

    passwordForm.value = {
      newPassword: '',
      confirmPassword: '',
    }

    success.value = 'Password updated successfully!'

    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update password'
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  loadProfileData()
  loadUserStats()

  // Ensure form is initialized even if profile data is not fully loaded
  if (!profileForm.value.email && authStore.user?.email) {
    profileForm.value.email = authStore.user.email
  }
})
</script>

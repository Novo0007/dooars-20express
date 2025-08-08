<template>
  <!-- Mobile Navigation -->
  <nav class="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
    <!-- Top Bar -->
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <img src="/logo.svg" alt="Dooars Express" class="w-8 h-8" />
          <span class="font-bold text-lg text-gray-900 dark:text-white">Dooars Express</span>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :class="getTouchTargetSize()"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click="closeMobileMenu" />
    </transition>

    <!-- Mobile Menu Panel -->
    <transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform translate-x-full"
    >
      <div v-if="isMobileMenuOpen" class="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
        <!-- Menu Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              @click="closeMobileMenu"
              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :class="getTouchTargetSize()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- User Info (if logged in) -->
        <div v-if="authStore.isAuthenticated" class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">
                {{ authStore.user?.profile?.full_name?.charAt(0) || 'U' }}
              </span>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ authStore.user?.profile?.full_name || 'User' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="py-2">
          <!-- Main Navigation -->
          <div class="space-y-1 px-2">
            <router-link
              v-for="item in mainNavItems"
              :key="item.path"
              :to="item.path"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              :class="[getTouchTargetSize(), { 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300': $route.path === item.path }]"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span class="font-medium">{{ item.name }}</span>
            </router-link>
          </div>

          <!-- Admin Section -->
          <div v-if="authStore.isAdmin || authStore.isHotelManager" class="mt-6">
            <div class="px-4 py-2">
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ authStore.isAdmin ? 'Admin' : 'Hotel Manager' }}
              </h3>
            </div>
            <div class="space-y-1 px-2">
              <router-link
                v-for="item in adminNavItems"
                :key="item.path"
                :to="item.path"
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                :class="[getTouchTargetSize(), { 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300': $route.path.startsWith(item.path) }]"
              >
                <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span class="font-medium">{{ item.name }}</span>
              </router-link>
            </div>
          </div>

          <!-- User Actions -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div v-if="!authStore.isAuthenticated" class="space-y-1 px-2">
              <router-link
                to="/login"
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors font-medium"
                :class="getTouchTargetSize()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </router-link>
              <router-link
                to="/signup"
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                :class="getTouchTargetSize()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </router-link>
            </div>

            <div v-else class="space-y-1 px-2">
              <router-link
                to="/profile"
                @click="closeMobileMenu"
                class="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                :class="getTouchTargetSize()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </router-link>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                :class="getTouchTargetSize()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          <!-- App Settings -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="px-4 py-2">
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Settings</h3>
            </div>
            <div class="space-y-1 px-2">
              <button
                @click="toggleDarkMode"
                class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                :class="getTouchTargetSize()"
              >
                <svg v-if="appStore.isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                {{ appStore.isDarkMode ? 'Light Mode' : 'Dark Mode' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import { useResponsive } from '../utils/mobile'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const { getTouchTargetSize } = useResponsive()

const isMobileMenuOpen = ref(false)

// Simple icon components
const HomeIcon = defineComponent({
  render() {
    return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
    ])
  }
})

const SearchIcon = defineComponent({
  render() {
    return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
    ])
  }
})

const BookingIcon = defineComponent({
  render() {
    return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ])
  }
})

const HeartIcon = defineComponent({
  render() {
    return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
    ])
  }
})

const DashboardIcon = defineComponent({
  render() {
    return h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
    ])
  }
})

const mainNavItems = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Search Hotels', path: '/search', icon: SearchIcon },
  { name: 'My Bookings', path: '/booking-history', icon: BookingIcon },
  { name: 'Favorites', path: '/favorites', icon: HeartIcon }
]

const adminNavItems = [
  { name: 'Dashboard', path: '/admin', icon: DashboardIcon },
  { name: 'Hotels', path: '/admin/hotels', icon: HomeIcon },
  { name: 'Bookings', path: '/admin/bookings', icon: BookingIcon },
  { name: 'Users', path: '/admin/users', icon: SearchIcon }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleDarkMode = () => {
  appStore.toggleDarkMode()
}

const handleLogout = async () => {
  closeMobileMenu()
  await authStore.logout()
  router.push('/')
}
</script>

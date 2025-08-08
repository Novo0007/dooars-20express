<template>
  <nav
    class="bg-white dark:bg-neutral-900 shadow-soft sticky top-0 z-50 transition-colors duration-200"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3">
          <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-2">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span class="font-display font-bold text-xl text-neutral-800 dark:text-neutral-200"
            >Dooars Express</span
          >
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navigation"
            :key="item.href"
            :to="item.href"
            class="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="{
              'text-primary-600 dark:text-primary-400 font-semibold': $route.path === item.href,
            }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Desktop Auth Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />

          <!-- Authenticated User Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              <img
                v-if="authStore.user?.profile?.avatar_url"
                :src="authStore.user.profile.avatar_url"
                :alt="authStore.userDisplayName"
                class="w-8 h-8 rounded-full"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold"
              >
                {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
              </div>
              <span>{{ authStore.userDisplayName }}</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- User Dropdown Menu -->
            <div
              v-if="showUserMenu"
              @click="showUserMenu = false"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-large border border-neutral-200 dark:border-neutral-700 py-1 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                My Profile
              </router-link>
              <router-link
                to="/favorites"
                class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                My Favorites
              </router-link>
              <router-link
                to="/booking-history"
                class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Booking History
              </router-link>
              <hr
                v-if="authStore.isAdmin"
                class="my-1 border-neutral-200 dark:border-neutral-700"
              />
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Admin Dashboard
              </router-link>
              <router-link
                v-if="authStore.hasPermission('view_all_users')"
                to="/admin/users"
                class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Manage Users
              </router-link>
              <hr class="my-1 border-neutral-200 dark:border-neutral-700" />
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Sign Out
              </button>
            </div>
          </div>

          <!-- Guest Auth Buttons -->
          <template v-else>
            <router-link
              to="/login"
              class="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              {{ $t('nav.signin') }}
            </router-link>
            <router-link
              to="/signup"
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {{ $t('nav.signup') }}
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 p-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.href"
          :to="item.href"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
          :class="{
            'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50':
              $route.path === item.href,
          }"
        >
          {{ item.name }}
        </router-link>
        <div class="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
          <div class="px-3 py-2 mb-2">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-neutral-600 dark:text-neutral-300">{{
                $t('nav.theme')
              }}</span>
              <ThemeToggle />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-neutral-600 dark:text-neutral-300"
                >Language</span
              >
              <LanguageSelector />
            </div>
          </div>
          <!-- Authenticated Mobile Menu -->
          <template v-if="authStore.isAuthenticated">
            <div class="px-3 py-2 mb-2">
              <div class="flex items-center space-x-3 mb-3">
                <img
                  v-if="authStore.user?.profile?.avatar_url"
                  :src="authStore.user.profile.avatar_url"
                  :alt="authStore.userDisplayName"
                  class="w-10 h-10 rounded-full"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold"
                >
                  {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-medium text-neutral-900 dark:text-neutral-100">
                    {{ authStore.userDisplayName }}
                  </div>
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">
                    {{ authStore.user?.email }}
                  </div>
                </div>
              </div>
            </div>
            <router-link
              to="/profile"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
            >
              My Profile
            </router-link>
            <router-link
              to="/favorites"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
            >
              My Favorites
            </router-link>
            <router-link
              to="/booking-history"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
            >
              Booking History
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
            >
              Admin Dashboard
            </router-link>
            <router-link
              v-if="authStore.hasPermission('view_all_users')"
              to="/admin/users"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
            >
              Manage Users
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md mt-2 transition-colors duration-200"
            >
              Sign Out
            </button>
          </template>

          <!-- Guest Mobile Menu -->
          <template v-else>
            <router-link
              to="/login"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
            >
              {{ $t('nav.signin') }}
            </router-link>
            <router-link
              to="/signup"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-md mt-2 transition-colors duration-200"
            >
              {{ $t('nav.signup') }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSelector from './LanguageSelector.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)

const navigation = computed(() => [
  { name: t('nav.home'), href: '/' },
  { name: t('nav.search'), href: '/search' },
  { name: t('nav.bookings'), href: '/profile' },
])

const handleLogout = async () => {
  try {
    await authStore.logout()
    showUserMenu.value = false
    mobileMenuOpen.value = false
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close user menu when clicking outside
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
})
</script>

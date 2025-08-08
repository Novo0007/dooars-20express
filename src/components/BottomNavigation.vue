<template>
  <nav
    v-if="shouldShowBottomNav"
    class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-700 z-50 md:hidden"
  >
    <div class="flex items-center justify-around py-2">
      <!-- Home -->
      <router-link
        to="/"
        class="flex flex-col items-center justify-center p-3 min-h-[60px] min-w-[60px] transition-colors duration-200"
        :class="
          $route.path === '/'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-500 dark:text-neutral-400'
        "
      >
        <div class="relative">
          <svg
            class="w-6 h-6 mb-1 transition-transform duration-200"
            :class="$route.path === '/' ? 'scale-110' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <div
            v-if="$route.path === '/'"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
          ></div>
        </div>
        <span class="text-xs font-medium">{{ $t('nav.home') }}</span>
      </router-link>

      <!-- Search -->
      <router-link
        to="/search"
        class="flex flex-col items-center justify-center p-3 min-h-[60px] min-w-[60px] transition-colors duration-200"
        :class="
          $route.path === '/search'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-500 dark:text-neutral-400'
        "
      >
        <div class="relative">
          <svg
            class="w-6 h-6 mb-1 transition-transform duration-200"
            :class="$route.path === '/search' ? 'scale-110' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <div
            v-if="$route.path === '/search'"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
          ></div>
        </div>
        <span class="text-xs font-medium">{{ $t('nav.search') }}</span>
      </router-link>

      <!-- Bookings -->
      <router-link
        to="/booking-history"
        class="flex flex-col items-center justify-center p-3 min-h-[60px] min-w-[60px] transition-colors duration-200"
        :class="
          $route.path === '/booking-history'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-500 dark:text-neutral-400'
        "
      >
        <div class="relative">
          <svg
            class="w-6 h-6 mb-1 transition-transform duration-200"
            :class="$route.path === '/booking-history' ? 'scale-110' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div
            v-if="$route.path === '/booking-history'"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
          ></div>
          <!-- Notification badge for pending bookings -->
          <div
            v-if="pendingBookingsCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ pendingBookingsCount > 9 ? '9+' : pendingBookingsCount }}
          </div>
        </div>
        <span class="text-xs font-medium">{{ $t('nav.bookings') }}</span>
      </router-link>

      <!-- Favorites -->
      <router-link
        to="/favorites"
        class="flex flex-col items-center justify-center p-3 min-h-[60px] min-w-[60px] transition-colors duration-200"
        :class="
          $route.path === '/favorites'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-500 dark:text-neutral-400'
        "
      >
        <div class="relative">
          <svg
            class="w-6 h-6 mb-1 transition-transform duration-200"
            :class="[
              $route.path === '/favorites' ? 'scale-110' : '',
              $route.path === '/favorites' ? 'fill-current' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <div
            v-if="$route.path === '/favorites'"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
          ></div>
        </div>
        <span class="text-xs font-medium">{{ $t('nav.favorites') }}</span>
      </router-link>

      <!-- Profile/Account -->
      <router-link
        to="/profile"
        class="flex flex-col items-center justify-center p-3 min-h-[60px] min-w-[60px] transition-colors duration-200"
        :class="
          $route.path === '/profile'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-neutral-500 dark:text-neutral-400'
        "
      >
        <div class="relative">
          <!-- User Avatar or Icon -->
          <div
            v-if="authStore.isAuthenticated && authStore.user?.profile?.avatar_url"
            class="w-6 h-6 mb-1 rounded-full overflow-hidden"
          >
            <img
              :src="authStore.user.profile.avatar_url"
              :alt="authStore.userDisplayName"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else-if="authStore.isAuthenticated"
            class="w-6 h-6 mb-1 rounded-full bg-primary-600 dark:bg-primary-400 flex items-center justify-center text-white text-xs font-semibold"
          >
            {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
          </div>
          <svg
            v-else
            class="w-6 h-6 mb-1 transition-transform duration-200"
            :class="$route.path === '/profile' ? 'scale-110' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <div
            v-if="$route.path === '/profile'"
            class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
          ></div>
        </div>
        <span class="text-xs font-medium">{{
          authStore.isAuthenticated ? $t('nav.profile') : $t('nav.login')
        }}</span>
      </router-link>
    </div>

    <!-- Safe area for devices with home indicator -->
    <div class="h-safe-area-inset-bottom bg-white dark:bg-neutral-900"></div>
  </nav>

  <!-- Bottom spacer to prevent content from being hidden behind bottom nav -->
  <div class="h-20 md:hidden"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const authStore = useAuthStore()
const bookingStore = useBookingStore()
const { t } = useI18n()

// Hide bottom nav on admin pages and during booking flow
const shouldShowBottomNav = computed(() => {
  const hiddenRoutes = ['/admin', '/hotel-manager', '/booking/', '/booking-confirmation/']
  return !hiddenRoutes.some((hiddenRoute) => route.path.startsWith(hiddenRoute))
})

// Get pending bookings count for notification badge
const pendingBookingsCount = computed(() => {
  // This would typically come from a store or API call
  // For now, we'll return 0, but you can implement this based on your booking logic
  return 0
})
</script>

<style scoped>
/* Ensure proper spacing for devices with notch/home indicator */
.h-safe-area-inset-bottom {
  height: env(safe-area-inset-bottom);
}

/* Active state animation */
.router-link-exact-active svg {
  @apply scale-110;
}

/* Touch target optimization for mobile */
@media (max-width: 768px) {
  .router-link-exact-active {
    @apply text-primary-600 dark:text-primary-400;
  }
}

/* Hover effects for larger screens */
@media (min-width: 769px) {
  .router-link:hover {
    @apply text-primary-600 dark:text-primary-400;
  }
}

/* Smooth transitions */
.router-link {
  @apply transition-all duration-200 ease-in-out;
}

/* Prevent tap highlight on mobile */
.router-link {
  -webkit-tap-highlight-color: transparent;
}
</style>

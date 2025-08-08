// Composable for bottom navigation functionality
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export const useBottomNavigation = () => {
  const route = useRoute()
  const authStore = useAuthStore()

  // Navigation items configuration
  const navigationItems = computed(() => [
    {
      name: 'Home',
      path: '/',
      icon: 'home',
      exactMatch: true,
    },
    {
      name: 'Search',
      path: '/search',
      icon: 'search',
      exactMatch: false,
    },
    {
      name: 'Bookings',
      path: '/booking-history',
      icon: 'calendar',
      exactMatch: false,
      badge: computed(() => getPendingBookingsCount()),
    },
    {
      name: 'Favorites',
      path: '/favorites',
      icon: 'heart',
      exactMatch: false,
    },
    {
      name: authStore.isAuthenticated ? 'Profile' : 'Login',
      path: authStore.isAuthenticated ? '/profile' : '/login',
      icon: 'user',
      exactMatch: false,
      avatar: computed(() => authStore.user?.profile?.avatar_url),
      initials: computed(() =>
        authStore.isAuthenticated ? authStore.userDisplayName.charAt(0).toUpperCase() : '',
      ),
    },
  ])

  // Check if route is active
  const isRouteActive = (path: string, exactMatch = false) => {
    if (exactMatch) {
      return route.path === path
    }
    return route.path.startsWith(path)
  }

  // Get pending bookings count (placeholder - implement based on your booking logic)
  const getPendingBookingsCount = () => {
    // This would typically come from a booking store or API call
    return 0
  }

  // Check if bottom navigation should be visible
  const shouldShowBottomNav = computed(() => {
    // Hide on admin/manager dashboards
    const adminRoutes = ['/admin', '/hotel-manager']
    return !adminRoutes.some((route) => route.path.startsWith(route))
  })

  return {
    navigationItems,
    isRouteActive,
    shouldShowBottomNav,
  }
}

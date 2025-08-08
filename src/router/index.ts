import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import HotelDetails from '../views/HotelDetails.vue'
import Booking from '../views/Booking.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Placeholder from '../views/Placeholder.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: { title: 'Search Hotels' },
    },
    {
      path: '/hotel/:id',
      name: 'hotel-details',
      component: HotelDetails,
      meta: { title: 'Hotel Details' },
    },
    {
      path: '/booking',
      name: 'booking',
      component: Booking,
      meta: { title: 'Booking', requiresAuth: true },
    },
    {
      path: '/booking-confirmation/:id',
      name: 'booking-confirmation',
      component: () => import('../views/BookingConfirmation.vue'),
      meta: { title: 'Booking Confirmed', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: 'Login', guest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { title: 'Sign Up', guest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { title: 'My Profile', requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/Favorites.vue'),
      meta: { title: 'My Favorites', requiresAuth: true },
    },
    {
      path: '/booking-history',
      name: 'booking-history',
      component: () => import('../views/BookingHistory.vue'),
      meta: { title: 'Booking History', requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/Dashboard.vue'),
      meta: { title: 'Admin Dashboard', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/hotels',
      name: 'admin-hotels',
      component: () => import('../views/Admin/Hotels.vue'),
      meta: { title: 'Manage Hotels', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('../views/Admin/Bookings.vue'),
      meta: { title: 'Manage Bookings', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/Admin/Users.vue'),
      meta: { title: 'Manage Users', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/rooms',
      name: 'admin-rooms',
      component: () => import('../views/Admin/Rooms.vue'),
      meta: { title: 'Manage Rooms', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/reports',
      name: 'admin-reports',
      component: () => import('../views/Admin/Reports.vue'),
      meta: { title: 'Reports & Analytics', requiresAuth: true, requiresAdmin: true },
    },
    // Hotel Manager Routes
    {
      path: '/hotel-manager',
      name: 'hotel-manager',
      component: () => import('../views/HotelManager/Dashboard.vue'),
      meta: { title: 'Hotel Manager Dashboard', requiresAuth: true, requiresHotelManager: true },
    },
    {
      path: '/hotel-manager/bookings',
      name: 'hotel-manager-bookings',
      component: () => import('../views/HotelManager/Bookings.vue'),
      meta: { title: 'Manage Bookings', requiresAuth: true, requiresHotelManager: true },
    },
    {
      path: '/hotel-manager/rooms',
      name: 'hotel-manager-rooms',
      component: () => import('../views/HotelManager/Rooms.vue'),
      meta: { title: 'Manage Rooms', requiresAuth: true, requiresHotelManager: true },
    },
    {
      path: '/hotel-manager/reports',
      name: 'hotel-manager-reports',
      component: () => import('../views/HotelManager/Reports.vue'),
      meta: { title: 'Hotel Reports', requiresAuth: true, requiresHotelManager: true },
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth if not already done
  if (!authStore.user && !authStore.session) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires admin privileges
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
    return
  }

  // Redirect authenticated users away from guest-only routes
  if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'profile' })
    return
  }

  next()
})

export default router

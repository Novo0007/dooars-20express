import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'

// Create pinia instance
const pinia = createPinia()

// Note: Router injection is handled in main.ts after router creation

export default pinia

// Re-export all stores
export { useAppStore } from './app'
export { useHotelStore } from './hotel'
export { useBookingStore } from './booking'
export { useAuthStore } from './auth'
export { useNotificationStore } from './notification'

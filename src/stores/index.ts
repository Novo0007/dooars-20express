import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'

// Create pinia instance
const pinia = createPinia()

// Add router to pinia context for use in stores
pinia.use(({ store }) => {
  store.router = markRaw(useRouter())
})

export default pinia

// Re-export all stores
export { useAppStore } from './app'
export { useHotelStore } from './hotel'
export { useBookingStore } from './booking'
export { useAuthStore } from './auth'

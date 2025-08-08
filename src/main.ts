import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'
import { useAppStore } from './stores/app'
import { useAuthStore } from './stores/auth'
import { logConfigStatus } from './utils/config'
import { logger } from './utils/logger'

// Validate configuration on startup
const configValidation = logConfigStatus()
if (!configValidation.isValid && import.meta.env.PROD) {
  logger.error('App started with invalid configuration', configValidation.errors)
}

const pinia = createPinia()

const app = createApp(App)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  logger.error('Vue Error', {
    error: err.message,
    stack: err.stack,
    info,
    component: instance?.$options.name || 'Unknown'
  })
}

app.use(pinia)
app.use(i18n)
app.use(router)

// Initialize theme after mounting
app.mount('#app')

// Initialize app store and theme
const appStore = useAppStore()
appStore.initializeTheme()

// Initialize auth store
const authStore = useAuthStore()
authStore.initializeAuth()

// Set initial language
const savedLanguage = appStore.language
if (savedLanguage) {
  i18n.global.locale.value = savedLanguage
}

// Log app startup
logger.info('App started successfully', {
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  url: window.location.href
})

// Register PWA service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      logger.info('Service Worker registered successfully')

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show notification
              logger.info('New app version available')
              // Use notification system instead of confirm
              const notificationStore = useNotificationStore()
              notificationStore.info('New version available! Please refresh to update.', 'App Update', 0)
            }
          })
        }
      })
    } catch (error) {
      logger.error('Service Worker registration failed', error)
    }
  })
}

// Load cached results on app start
appStore.loadCachedResults()

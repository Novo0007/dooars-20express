import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'
import { useAppStore } from './stores/app'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(router)

// Initialize theme after mounting
app.mount('#app')

// Initialize app store and theme
const appStore = useAppStore()
appStore.initializeTheme()

// Set initial language
const savedLanguage = appStore.language
if (savedLanguage) {
  i18n.global.locale.value = savedLanguage
}

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered: ', registration)

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, refresh the page
              console.log('New content is available; please refresh.')
              if (confirm('New version available! Refresh to update?')) {
                window.location.reload()
              }
            }
          })
        }
      })
    } catch (error) {
      console.log('SW registration failed: ', error)
    }
  })
}

// Load cached results on app start
appStore.loadCachedResults()

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAppStore } from './stores/app'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)

// Initialize theme after mounting
app.mount('#app')

// Initialize app store and theme
const appStore = useAppStore()
appStore.initializeTheme()

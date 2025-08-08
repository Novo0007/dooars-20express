import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Theme state
  const isDarkMode = ref(false)
  const language = ref('en')
  const currency = ref('USD')
  
  // Chat state
  const isChatOpen = ref(false)
  const chatMessages = ref<Array<{ id: string; text: string; sender: 'user' | 'agent'; timestamp: Date }>>([])
  
  // Promo codes
  const appliedPromoCode = ref<string | null>(null)
  const availPromoCodes = ref([
    { code: 'SAVE20', discount: 20, type: 'percentage', description: '20% off on all bookings' },
    { code: 'WELCOME50', discount: 50, type: 'fixed', description: '$50 off your first booking' },
    { code: 'SUMMER25', discount: 25, type: 'percentage', description: '25% off summer destinations' }
  ])

  // Offline state
  const isOffline = ref(!navigator.onLine)
  const cachedSearchResults = ref<any[]>([])

  // Computed
  const currentTheme = computed(() => isDarkMode.value ? 'dark' : 'light')
  const appliedDiscount = computed(() => {
    if (!appliedPromoCode.value) return null
    return availPromoCodes.value.find(code => code.code === appliedPromoCode.value)
  })

  // Actions
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', currentTheme.value)
    updateThemeClass()
  }

  const setLanguage = (lang: string) => {
    language.value = lang
    localStorage.setItem('language', lang)
  }

  const setCurrency = (curr: string) => {
    currency.value = curr
    localStorage.setItem('currency', curr)
  }

  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
  }

  const addChatMessage = (text: string, sender: 'user' | 'agent') => {
    const message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    }
    chatMessages.value.push(message)
  }

  const applyPromoCode = (code: string) => {
    const validCode = availPromoCodes.value.find(promo => promo.code === code.toUpperCase())
    if (validCode) {
      appliedPromoCode.value = code.toUpperCase()
      return true
    }
    return false
  }

  const removePromoCode = () => {
    appliedPromoCode.value = null
  }

  const updateThemeClass = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const savedLanguage = localStorage.getItem('language')
    const savedCurrency = localStorage.getItem('currency')
    
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    if (savedLanguage) {
      language.value = savedLanguage
    }
    
    if (savedCurrency) {
      currency.value = savedCurrency
    }
    
    updateThemeClass()
  }

  const updateOfflineStatus = () => {
    isOffline.value = !navigator.onLine
  }

  const cacheSearchResults = (results: any[]) => {
    cachedSearchResults.value = results
    localStorage.setItem('cachedSearchResults', JSON.stringify(results))
  }

  const loadCachedResults = () => {
    const cached = localStorage.getItem('cachedSearchResults')
    if (cached) {
      cachedSearchResults.value = JSON.parse(cached)
    }
  }

  // Listen for online/offline events
  window.addEventListener('online', updateOfflineStatus)
  window.addEventListener('offline', updateOfflineStatus)

  return {
    // State
    isDarkMode,
    language,
    currency,
    isChatOpen,
    chatMessages,
    appliedPromoCode,
    availPromoCodes,
    isOffline,
    cachedSearchResults,
    
    // Computed
    currentTheme,
    appliedDiscount,
    
    // Actions
    toggleDarkMode,
    setLanguage,
    setCurrency,
    toggleChat,
    addChatMessage,
    applyPromoCode,
    removePromoCode,
    initializeTheme,
    updateOfflineStatus,
    cacheSearchResults,
    loadCachedResults
  }
})

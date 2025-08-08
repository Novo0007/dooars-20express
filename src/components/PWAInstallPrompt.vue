<template>
  <div
    v-if="showInstallPrompt"
    class="fixed bottom-20 right-6 max-w-sm bg-white dark:bg-neutral-800 rounded-xl shadow-large border border-neutral-200 dark:border-neutral-700 p-4 z-40 animate-slide-up"
  >
    <div class="flex items-start space-x-3">
      <div
        class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0"
      >
        <svg
          class="w-6 h-6 text-primary-600 dark:text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-neutral-800 dark:text-neutral-200 text-sm mb-1">
          Install WanderStay
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 text-xs mb-3">
          Get the full app experience with offline access and push notifications.
        </p>

        <div class="flex space-x-2">
          <button
            @click="installApp"
            class="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
          >
            Install
          </button>
          <button
            @click="dismissPrompt"
            class="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium transition-colors duration-200"
          >
            Not now
          </button>
        </div>
      </div>

      <button
        @click="dismissPrompt"
        class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
let deferredPrompt: any = null

onMounted(() => {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e

    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (!dismissed) {
      setTimeout(() => {
        showInstallPrompt.value = true
      }, 3000) // Show after 3 seconds
    }
  })

  // Listen for app install
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed')
    showInstallPrompt.value = false
    deferredPrompt = null
  })
})

const installApp = async () => {
  if (!deferredPrompt) return

  showInstallPrompt.value = false

  try {
    const result = await deferredPrompt.prompt()
    console.log('Install prompt result:', result)

    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
  } catch (error) {
    console.error('Error showing install prompt:', error)
  }

  deferredPrompt = null
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', 'true')
  deferredPrompt = null
}
</script>

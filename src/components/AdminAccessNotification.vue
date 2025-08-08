<template>
  <div v-if="showNotification" class="fixed top-4 right-4 z-50">
    <div class="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-green-800">
            Admin Access Granted!
          </h3>
          <p class="mt-1 text-sm text-green-700">
            You now have admin privileges. Click "Refresh Access" to see the admin menu.
          </p>
          <div class="mt-3 flex space-x-2">
            <button 
              @click="refreshAccess"
              :disabled="loading"
              class="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded-md transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Refreshing...' : 'Refresh Access' }}
            </button>
            <button 
              @click="goToAdmin"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-md transition-colors"
            >
              Go to Admin
            </button>
          </div>
        </div>
        <button 
          @click="dismiss"
          class="ml-2 flex-shrink-0 text-green-400 hover:text-green-600"
        >
          <span class="sr-only">Dismiss</span>
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const showNotification = ref(false)
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const refreshAccess = async () => {
  loading.value = true
  try {
    await authStore.refreshUserProfile()
    // Force reactivity update
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (authStore.isAdmin) {
      showNotification.value = false
      router.push('/admin')
    }
  } catch (error) {
    console.error('Failed to refresh access:', error)
  } finally {
    loading.value = false
  }
}

const goToAdmin = () => {
  router.push('/admin')
  showNotification.value = false
}

const dismiss = () => {
  showNotification.value = false
}

// Check if user should see this notification
onMounted(() => {
  // Show if user is authenticated but not showing as admin yet
  // This is for users who just got admin access
  const userEmail = authStore.user?.email
  if (userEmail === 'mynameisjyotirmoy@gmail.com' && !authStore.isAdmin) {
    showNotification.value = true
  }
})
</script>

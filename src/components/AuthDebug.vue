<template>
  <div class="fixed bottom-4 right-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-4 text-xs max-w-sm z-50" v-if="showDebug">
    <div class="flex items-center justify-between mb-2">
      <h4 class="font-semibold text-neutral-900 dark:text-neutral-100">Auth Status</h4>
      <button @click="showDebug = false" class="text-neutral-500 hover:text-neutral-700">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div class="space-y-2 text-neutral-600 dark:text-neutral-400">
      <div>
        <strong>Authenticated:</strong> 
        <span :class="authStore.isAuthenticated ? 'text-green-600' : 'text-red-600'">
          {{ authStore.isAuthenticated ? 'Yes' : 'No' }}
        </span>
      </div>
      
      <div v-if="authStore.user">
        <strong>User:</strong> {{ authStore.user.email }}
      </div>
      
      <div v-if="authStore.user?.profile">
        <strong>Profile:</strong> {{ authStore.user.profile.full_name }} ({{ authStore.user.profile.role }})
      </div>
      
      <div v-if="authStore.session">
        <strong>Session:</strong> Valid
      </div>
      
      <div v-if="authStore.error">
        <strong>Error:</strong> 
        <span class="text-red-600">{{ authStore.error }}</span>
      </div>
      
      <div>
        <strong>Loading:</strong> {{ authStore.loading ? 'Yes' : 'No' }}
      </div>
    </div>
  </div>
  
  <!-- Debug Toggle Button -->
  <button 
    v-if="!showDebug"
    @click="showDebug = true"
    class="fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg z-50"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showDebug = ref(false)
</script>

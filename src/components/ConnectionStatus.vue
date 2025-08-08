<template>
  <div v-if="showStatus" class="fixed bottom-4 right-4 z-50">
    <div
      class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
      :class="{
        'border-red-200 bg-red-50': status === 'error',
        'border-yellow-200 bg-yellow-50': status === 'warning',
        'border-green-200 bg-green-50': status === 'success',
      }"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg
            v-if="status === 'error'"
            class="h-5 w-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="status === 'warning'"
            class="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3
            class="text-sm font-medium"
            :class="{
              'text-red-800': status === 'error',
              'text-yellow-800': status === 'warning',
              'text-green-800': status === 'success',
            }"
          >
            {{ title }}
          </h3>
          <p
            class="mt-1 text-sm"
            :class="{
              'text-red-700': status === 'error',
              'text-yellow-700': status === 'warning',
              'text-green-700': status === 'success',
            }"
          >
            {{ message }}
          </p>
          <div v-if="showDetails" class="mt-2">
            <button
              @click="showDetails = !showDetails"
              class="text-xs underline"
              :class="{
                'text-red-600': status === 'error',
                'text-yellow-600': status === 'warning',
                'text-green-600': status === 'success',
              }"
            >
              {{ showDetails ? 'Hide' : 'Show' }} Details
            </button>
            <div v-if="showDetails" class="mt-1 text-xs font-mono bg-gray-100 p-2 rounded">
              {{ details }}
            </div>
          </div>
        </div>
        <button @click="dismiss" class="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600">
          <span class="sr-only">Dismiss</span>
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ConnectionStatusProps {
  status: 'success' | 'warning' | 'error'
  title: string
  message: string
  details?: string
  autoDismiss?: number
}

const props = defineProps<ConnectionStatusProps>()

const showStatus = ref(true)
const showDetails = ref(false)

const dismiss = () => {
  showStatus.value = false
}

let autoDismissTimer: number | null = null

onMounted(() => {
  if (props.autoDismiss) {
    autoDismissTimer = window.setTimeout(() => {
      dismiss()
    }, props.autoDismiss)
  }
})

onUnmounted(() => {
  if (autoDismissTimer) {
    clearTimeout(autoDismissTimer)
  }
})
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">Promo Code</h3>
      <button
        v-if="!showPromoInput && !appliedPromo"
        @click="showPromoInput = true"
        class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
      >
        Add Code
      </button>
    </div>

    <!-- Applied Promo Code -->
    <div v-if="appliedPromo" class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-green-800 dark:text-green-200">{{ appliedPromo.code }}</p>
          <p class="text-sm text-green-600 dark:text-green-400">{{ appliedPromo.description }}</p>
        </div>
      </div>
      <button
        @click="removePromoCode"
        class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Promo Code Input -->
    <div v-else-if="showPromoInput" class="space-y-3">
      <div class="flex space-x-2">
        <input
          v-model="promoCode"
          @keyup.enter="applyPromoCode"
          placeholder="Enter promo code"
          class="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm transition-colors duration-200"
          :class="{ 'border-red-300 dark:border-red-600': errorMessage }"
        />
        <button
          @click="applyPromoCode"
          :disabled="!promoCode.trim() || loading"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Applying...
          </span>
          <span v-else>Apply</span>
        </button>
      </div>
      
      <div class="flex items-center justify-between">
        <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
        <button
          @click="showPromoInput = false; promoCode = ''; errorMessage = ''"
          class="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Available Promo Codes (Development/Demo) -->
    <div v-else-if="showAvailableCodes" class="space-y-3">
      <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Available codes for demo:</p>
      <div class="grid gap-2">
        <button
          v-for="code in availableCodes"
          :key="code.code"
          @click="quickApplyCode(code.code)"
          class="text-left p-3 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-neutral-800 dark:text-neutral-200">{{ code.code }}</p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ code.description }}</p>
            </div>
            <div class="text-primary-600 dark:text-primary-400 font-semibold">
              {{ code.type === 'percentage' ? `${code.discount}%` : `$${code.discount}` }} off
            </div>
          </div>
        </button>
      </div>
      <button
        @click="showAvailableCodes = false"
        class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200"
      >
        Hide codes
      </button>
    </div>

    <!-- Show available codes toggle (Development) -->
    <div v-else class="text-center">
      <button
        @click="showAvailableCodes = true"
        class="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-200"
      >
        Show demo codes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const promoCode = ref('')
const showPromoInput = ref(false)
const showAvailableCodes = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const appliedPromo = computed(() => appStore.appliedDiscount)
const availableCodes = computed(() => appStore.availPromoCodes)

const applyPromoCode = async () => {
  if (!promoCode.value.trim()) return

  loading.value = true
  errorMessage.value = ''

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const success = appStore.applyPromoCode(promoCode.value)
  
  if (success) {
    promoCode.value = ''
    showPromoInput.value = false
    showAvailableCodes.value = false
  } else {
    errorMessage.value = 'Invalid promo code. Please try again.'
  }

  loading.value = false
}

const quickApplyCode = async (code: string) => {
  promoCode.value = code
  await applyPromoCode()
}

const removePromoCode = () => {
  appStore.removePromoCode()
  errorMessage.value = ''
}
</script>

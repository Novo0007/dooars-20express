<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
      <h3 class="text-lg font-semibold">Secure Payment</h3>
      <p class="text-blue-100 text-sm mt-1">Complete your booking with trusted Indian payment options</p>
    </div>

    <!-- Payment Amount Summary -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-600">
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-600 dark:text-gray-300">Room charges</span>
          <span class="font-medium">{{ formatCurrency(paymentDetails.baseAmount) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600 dark:text-gray-300">Taxes & fees</span>
          <span class="font-medium">{{ formatCurrency(paymentDetails.taxes) }}</span>
        </div>
        <div v-if="paymentDetails.discount > 0" class="flex justify-between items-center text-green-600 dark:text-green-400">
          <span>Discount</span>
          <span class="font-medium">-{{ formatCurrency(paymentDetails.discount) }}</span>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(paymentDetails.totalAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Options -->
    <div class="p-6">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Choose Payment Method</h4>
      
      <div class="space-y-3">
        <!-- Razorpay (Primary) -->
        <label 
          class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="selectedMethod === 'razorpay' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'"
        >
          <input 
            type="radio" 
            value="razorpay" 
            v-model="selectedMethod"
            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          >
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">💳</span>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Credit/Debit Card</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, RuPay, American Express</p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <img src="https://razorpay.com/favicon.png" alt="Razorpay" class="w-4 h-4" />
                <span class="text-xs text-gray-500">Secure</span>
              </div>
            </div>
          </div>
        </label>

        <!-- UPI -->
        <label 
          class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'"
        >
          <input 
            type="radio" 
            value="upi" 
            v-model="selectedMethod"
            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          >
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">📱</span>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">UPI</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">PhonePe, GooglePay, Paytm, BHIM</p>
                </div>
              </div>
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Instant</span>
            </div>
          </div>
        </label>

        <!-- Net Banking -->
        <label 
          class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="selectedMethod === 'netbanking' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'"
        >
          <input 
            type="radio" 
            value="netbanking" 
            v-model="selectedMethod"
            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          >
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🏦</span>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Net Banking</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">SBI, HDFC, ICICI, Axis & 50+ banks</p>
                </div>
              </div>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Secure</span>
            </div>
          </div>
        </label>

        <!-- Digital Wallets -->
        <label 
          class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="selectedMethod === 'wallets' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'"
        >
          <input 
            type="radio" 
            value="wallets" 
            v-model="selectedMethod"
            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          >
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">💰</span>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Digital Wallets</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Paytm, Amazon Pay, Mobikwik, FreeCharge</p>
                </div>
              </div>
              <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Quick</span>
            </div>
          </div>
        </label>
      </div>

      <!-- Customer Info -->
      <div class="mt-6 space-y-4">
        <h5 class="text-sm font-medium text-gray-900 dark:text-white">Billing Information</h5>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="customerInfo.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mobile Number <span class="text-red-500">*</span>
            </label>
            <input
              v-model="customerInfo.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="10-digit mobile number"
              maxlength="10"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address <span class="text-red-500">*</span>
          </label>
          <input
            v-model="customerInfo.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <!-- Security Info -->
      <div class="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h6 class="text-sm font-medium text-green-800 dark:text-green-200">Secure Payment</h6>
            <p class="text-sm text-green-700 dark:text-green-300 mt-1">
              Your payment information is encrypted and secure. We don't store your card details.
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          @click="$emit('cancel')"
          class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          @click="processPayment"
          :disabled="!isFormValid || isProcessing"
          class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="isProcessing" class="flex items-center gap-2">
            <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Processing...
          </span>
          <span v-else>
            Pay {{ formatCurrency(paymentDetails.totalAmount) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import { paymentService } from '../services/paymentService'
import { useNotificationStore } from '../stores/notification'

interface PaymentDetails {
  baseAmount: number
  taxes: number
  discount: number
  totalAmount: number
  orderId: string
  description: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

const props = defineProps<{
  paymentDetails: PaymentDetails
}>()

const emit = defineEmits<{
  success: [paymentId: string, orderId: string]
  cancel: []
  error: [message: string]
}>()

const notificationStore = useNotificationStore()

const selectedMethod = ref('razorpay')
const isProcessing = ref(false)
const customerInfo = ref<CustomerInfo>({
  name: '',
  email: '',
  phone: ''
})

const isFormValid = computed(() => {
  return customerInfo.value.name.length > 0 &&
         customerInfo.value.email.includes('@') &&
         customerInfo.value.phone.length === 10 &&
         /^[6-9]\d{9}$/.test(customerInfo.value.phone)
})

const formatCurrency = (amount: number) => {
  return paymentService.formatIndianCurrency(amount)
}

const processPayment = async () => {
  if (!isFormValid.value) {
    notificationStore.error('Please fill all required fields correctly')
    return
  }

  isProcessing.value = true

  try {
    const paymentRequest = {
      amount: props.paymentDetails.totalAmount * 100, // Convert to paise
      currency: 'INR',
      orderId: props.paymentDetails.orderId,
      customerName: customerInfo.value.name,
      customerEmail: customerInfo.value.email,
      customerPhone: customerInfo.value.phone,
      description: props.paymentDetails.description
    }

    const result = await paymentService.processRazorpayPayment(paymentRequest)

    if (result.success && result.paymentId) {
      notificationStore.success('Payment completed successfully!', 'Success')
      emit('success', result.paymentId, result.orderId)
    } else {
      notificationStore.error(result.error || 'Payment failed. Please try again.', 'Payment Failed')
      emit('error', result.error || 'Payment failed')
    }
  } catch (error) {
    console.error('Payment error:', error)
    notificationStore.error('An unexpected error occurred. Please try again.', 'Error')
    emit('error', 'An unexpected error occurred')
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <!-- Progress Indicator -->
    <div
      class="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 py-4"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="router.back()"
              class="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {{ $t('common.back') }}
            </button>
            <h1 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200">
              {{ $t('booking.completeBooking') }}
            </h1>
          </div>

          <!-- Progress Steps -->
          <div class="hidden sm:flex items-center space-x-2">
            <div class="flex items-center">
              <div
                class="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
              >
                1
              </div>
              <span class="ml-2 text-sm text-neutral-600 dark:text-neutral-400">{{
                $t('booking.guestInfo')
              }}</span>
            </div>
            <div class="w-8 border-t border-neutral-300 dark:border-neutral-600"></div>
            <div class="flex items-center">
              <div
                class="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-400 rounded-full flex items-center justify-center text-sm font-semibold"
              >
                2
              </div>
              <span class="ml-2 text-sm text-neutral-400">{{ $t('booking.payment') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Booking Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Guest Information -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-6">
            <h2 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-6">
              {{ $t('booking.guestInformation') }}
            </h2>

            <form @submit.prevent="proceedToPayment" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    {{ $t('booking.firstName') }} *
                  </label>
                  <input
                    v-model="guestInfo.firstName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    {{ $t('booking.lastName') }} *
                  </label>
                  <input
                    v-model="guestInfo.lastName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  {{ $t('booking.email') }} *
                </label>
                <input
                  v-model="guestInfo.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  {{ $t('booking.phone') }} *
                </label>
                <input
                  v-model="guestInfo.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  {{ $t('booking.specialRequests') }}
                </label>
                <textarea
                  v-model="guestInfo.specialRequests"
                  rows="3"
                  :placeholder="$t('booking.specialRequestsPlaceholder')"
                  class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                ></textarea>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-start space-x-3 pt-4">
                <input
                  v-model="agreeToTerms"
                  type="checkbox"
                  id="terms"
                  required
                  class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded"
                />
                <label for="terms" class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ $t('booking.agreeToTerms') }}
                  <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">{{
                    $t('booking.termsConditions')
                  }}</a>
                  {{ $t('booking.and') }}
                  <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">{{
                    $t('booking.privacyPolicy')
                  }}</a>
                </label>
              </div>

              <!-- Marketing Emails -->
              <div class="flex items-start space-x-3">
                <input
                  v-model="subscribeToEmails"
                  type="checkbox"
                  id="emails"
                  class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded"
                />
                <label for="emails" class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ $t('booking.subscribeEmails') }}
                </label>
              </div>
            </form>
          </div>

          <!-- Payment Section (if in payment step) -->
          <div v-if="currentStep === 'payment'" class="bg-white dark:bg-neutral-800 rounded-xl p-6">
            <h2 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-6">
              {{ $t('booking.paymentDetails') }}
            </h2>

            <!-- Payment Methods -->
            <div class="space-y-4 mb-6">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  @click="selectedPaymentMethod = method.id"
                  class="flex items-center justify-center p-4 border-2 rounded-lg transition-all duration-200"
                  :class="
                    selectedPaymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  "
                >
                  <img :src="method.logo" :alt="method.name" class="h-8" />
                </button>
              </div>
            </div>

            <!-- Razorpay Payment Information -->
            <div v-if="selectedPaymentMethod === 'razorpay'" class="space-y-4">
              <div
                class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <div class="flex items-center space-x-2">
                  <svg
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Secure Payment with Razorpay
                  </span>
                </div>
                <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Pay securely using Credit Cards, Debit Cards, UPI, or Digital Wallets. Your payment information is encrypted and protected.
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              v-if="currentStep === 'payment'"
              @click="currentStep = 'guest-info'"
              class="flex-1 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors duration-200"
            >
              {{ $t('common.previous') }}
            </button>

            <button
              v-if="currentStep === 'guest-info'"
              @click="proceedToPayment"
              :disabled="!isGuestInfoValid"
              class="flex-1 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {{ $t('booking.proceedToPayment') }}
            </button>

            <button
              v-if="currentStep === 'payment'"
              @click="processPayment"
              :disabled="!isPaymentValid || loading"
              class="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {{ $t('booking.processing') }}
              </span>
              <span v-else> {{ $t('booking.payNow') }} {{ formatPrice(currentBooking?.finalPrice || 0) }} </span>
            </button>
          </div>
        </div>

        <!-- Booking Summary Sidebar -->
        <div class="lg:sticky lg:top-8">
          <BookingSummary v-if="currentBooking" :booking="currentBooking" :show-details="true" />

          <!-- Help Section -->
          <div class="mt-6 bg-white dark:bg-neutral-800 rounded-xl p-6">
            <h3 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {{ $t('booking.needHelp') }}
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{{ $t('booking.callSupport') }}: +1-800-WANDER</span>
              </div>
              <div class="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{{ $t('booking.liveChat') }}</span>
              </div>
              <button
                @click="appStore.toggleChat"
                class="w-full mt-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {{ $t('booking.startChat') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBookingStore } from '../stores/booking'
import { useAppStore } from '../stores/app'
import { formatPrice } from '../utils/currency'
import BookingSummary from '../components/BookingSummary.vue'

const router = useRouter()
const { t } = useI18n()
const bookingStore = useBookingStore()
const appStore = useAppStore()

const currentStep = ref<'guest-info' | 'payment'>('guest-info')
const loading = ref(false)
const agreeToTerms = ref(false)
const subscribeToEmails = ref(false)
const selectedPaymentMethod = ref('razorpay')

const guestInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialRequests: '',
})

const paymentMethods = ref([
  {
    id: 'razorpay',
    name: 'Razorpay (All Cards, UPI, Wallets)',
    logo: 'https://razorpay.com/assets/razorpay-logo.svg',
  },
])

const currentBooking = computed(() => bookingStore.currentBooking)

const isGuestInfoValid = computed(() => {
  return (
    guestInfo.value.firstName.trim() &&
    guestInfo.value.lastName.trim() &&
    guestInfo.value.email.trim() &&
    guestInfo.value.phone.trim() &&
    agreeToTerms.value
  )
})

const isPaymentValid = computed(() => {
  // Only Razorpay payment is supported
  return selectedPaymentMethod.value === 'razorpay'
})

const proceedToPayment = () => {
  if (!isGuestInfoValid.value) return

  // Update booking with guest info
  bookingStore.updateGuestInfo(guestInfo.value)
  currentStep.value = 'payment'

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const processPayment = async () => {
  if (!isPaymentValid.value || !currentBooking.value) return

  loading.value = true

  try {
    await processRazorpayPayment()
  } catch (error) {
    console.error('Payment error:', error)
    // Show user-friendly error message
    alert('Payment failed. Please try again or contact support.')
  } finally {
    loading.value = false
  }
}

const processRazorpayPayment = async () => {
  // Load Razorpay script
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  document.head.appendChild(script)

  script.onload = () => {
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      throw new Error('Razorpay Key ID not configured. Please set VITE_RAZORPAY_KEY_ID environment variable.')
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: currentBooking.value!.finalPrice * 100, // Amount in paise
      currency: 'INR',
      name: 'WanderStay',
      description: `Booking for ${currentBooking.value!.hotel.name}`,
      image: '/favicon.ico',
      order_id: `order_${Date.now()}`, // Generate order ID
      prefill: {
        name: `${guestInfo.value.firstName} ${guestInfo.value.lastName}`,
        email: guestInfo.value.email,
        contact: guestInfo.value.phone,
      },
      theme: {
        color: '#3b82f6',
      },
      handler: async function (response: any) {
        console.log('Payment successful:', response)
        await completeBooking(response.razorpay_payment_id)
      },
      modal: {
        ondismiss: function () {
          loading.value = false
          console.log('Payment cancelled')
        },
      },
    }

    // @ts-ignore
    const rzp = new Razorpay(options)
    rzp.open()
  }
}


const completeBooking = async (paymentId: string) => {
  try {
    // Confirm the booking
    const booking = await bookingStore.confirmBooking()

    if (booking) {
      // Redirect to confirmation page
      router.push(`/booking-confirmation/${booking.id}`)
    }
  } catch (error) {
    console.error('Booking confirmation error:', error)
    // Handle error - show message to user
  }
}

onMounted(() => {
  // Check if there's a current booking
  if (!currentBooking.value) {
    router.push('/search')
    return
  }

  // Pre-fill guest info if user is authenticated
  // This would come from user profile in a real app
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Success Header -->
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1
          class="text-3xl lg:text-4xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-4"
        >
          {{ $t('confirmation.bookingConfirmed') }}
        </h1>

        <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-2">
          {{ $t('confirmation.thankYou') }}
        </p>

        <p class="text-neutral-600 dark:text-neutral-400">
          {{ $t('confirmation.confirmationNumber') }}:
          <span class="font-semibold text-primary-600 dark:text-primary-400">{{ bookingId }}</span>
        </p>
      </div>

      <!-- Booking Details Card -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-8"
      >
        <!-- Header -->
        <div class="bg-primary-600 dark:bg-primary-700 px-6 py-4">
          <h2 class="text-xl font-display font-bold text-white">
            {{ $t('confirmation.bookingDetails') }}
          </h2>
        </div>

        <div class="p-6">
          <!-- Hotel Information -->
          <div class="flex space-x-4 mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
            <img
              :src="mockBooking.hotel.image"
              :alt="mockBooking.hotel.name"
              class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1">
              <h3
                class="font-display font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-1"
              >
                {{ mockBooking.hotel.name }}
              </h3>
              <p class="text-neutral-600 dark:text-neutral-400 flex items-center mb-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ mockBooking.hotel.location }}
              </p>
              <div class="flex items-center">
                <span class="text-amber-400 mr-1">⭐</span>
                <span class="text-neutral-600 dark:text-neutral-400">{{
                  mockBooking.hotel.rating
                }}</span>
              </div>
            </div>
          </div>

          <!-- Booking Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Check-in -->
            <div class="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {{ $t('booking.checkin') }}
              </div>
              <div class="font-semibold text-neutral-800 dark:text-neutral-200">
                {{ formatDate(mockBooking.checkIn) }}
              </div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ $t('confirmation.from15') }}
              </div>
            </div>

            <!-- Check-out -->
            <div class="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {{ $t('booking.checkout') }}
              </div>
              <div class="font-semibold text-neutral-800 dark:text-neutral-200">
                {{ formatDate(mockBooking.checkOut) }}
              </div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ $t('confirmation.until11') }}
              </div>
            </div>

            <!-- Duration -->
            <div class="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {{ $t('booking.duration') }}
              </div>
              <div class="font-semibold text-neutral-800 dark:text-neutral-200">
                {{ nights }} {{ nights === 1 ? $t('booking.night') : $t('booking.nights') }}
              </div>
            </div>

            <!-- Guests -->
            <div class="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
              <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {{ $t('booking.guests') }}
              </div>
              <div class="font-semibold text-neutral-800 dark:text-neutral-200">
                {{ mockBooking.guests }}
                {{ mockBooking.guests === 1 ? $t('booking.guest') : $t('booking.guests') }}
              </div>
            </div>
          </div>

          <!-- Room Information -->
          <div
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
          >
            <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              {{ $t('booking.roomType') }}
            </h4>
            <p class="text-blue-700 dark:text-blue-300">{{ mockBooking.roomType }}</p>
          </div>

          <!-- Guest Information -->
          <div class="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h4 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              {{ $t('booking.guestInformation') }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-neutral-600 dark:text-neutral-400"
                  >{{ $t('booking.name') }}:</span
                >
                <span class="ml-2 text-neutral-800 dark:text-neutral-200">John Doe</span>
              </div>
              <div>
                <span class="text-neutral-600 dark:text-neutral-400"
                  >{{ $t('booking.email') }}:</span
                >
                <span class="ml-2 text-neutral-800 dark:text-neutral-200">john@example.com</span>
              </div>
              <div>
                <span class="text-neutral-600 dark:text-neutral-400"
                  >{{ $t('booking.phone') }}:</span
                >
                <span class="ml-2 text-neutral-800 dark:text-neutral-200">+1-555-0123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Summary -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6 mb-8"
      >
        <h3 class="text-lg font-display font-bold text-neutral-800 dark:text-neutral-200 mb-4">
          {{ $t('confirmation.paymentSummary') }}
        </h3>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-neutral-600 dark:text-neutral-400">{{ $t('booking.subtotal') }}</span>
            <span class="text-neutral-800 dark:text-neutral-200"
              >${{ mockBooking.totalPrice }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-600 dark:text-neutral-400">{{
              $t('booking.taxesAndFees')
            }}</span>
            <span class="text-neutral-800 dark:text-neutral-200">${{ taxesAndFees }}</span>
          </div>
          <div
            class="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-semibold"
          >
            <span class="text-neutral-800 dark:text-neutral-200">{{ $t('booking.total') }}</span>
            <span class="text-xl text-green-600 dark:text-green-400"
              >${{ mockBooking.finalPrice }}</span
            >
          </div>
        </div>

        <div
          class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <svg
              class="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span class="text-green-800 dark:text-green-200 font-medium">{{
              $t('confirmation.paymentSuccessful')
            }}</span>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6 mb-8"
      >
        <h3 class="text-lg font-display font-bold text-neutral-800 dark:text-neutral-200 mb-4">
          {{ $t('confirmation.nextSteps') }}
        </h3>

        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            >
              1
            </div>
            <div>
              <h4 class="font-medium text-neutral-800 dark:text-neutral-200">
                {{ $t('confirmation.step1Title') }}
              </h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ $t('confirmation.step1Description') }}
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            >
              2
            </div>
            <div>
              <h4 class="font-medium text-neutral-800 dark:text-neutral-200">
                {{ $t('confirmation.step2Title') }}
              </h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ $t('confirmation.step2Description') }}
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            >
              3
            </div>
            <div>
              <h4 class="font-medium text-neutral-800 dark:text-neutral-200">
                {{ $t('confirmation.step3Title') }}
              </h4>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ $t('confirmation.step3Description') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="downloadConfirmation"
          class="px-6 py-3 border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors duration-200"
        >
          {{ $t('confirmation.downloadPDF') }}
        </button>

        <button
          @click="emailConfirmation"
          class="px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors duration-200"
        >
          {{ $t('confirmation.emailCopy') }}
        </button>

        <router-link
          to="/profile"
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 text-center"
        >
          {{ $t('confirmation.viewBookings') }}
        </router-link>
      </div>

      <!-- Support Section -->
      <div class="text-center mt-8 p-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
        <h3 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          {{ $t('confirmation.needAssistance') }}
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-4">
          {{ $t('confirmation.supportDescription') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+1-800-WANDER"
            class="inline-flex items-center px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            +1-800-WANDER
          </a>
          <button
            @click="appStore.toggleChat"
            class="inline-flex items-center px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {{ $t('confirmation.liveChat') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookingStore } from '../stores/booking'
import { formatPrice } from '../utils/currency'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'

const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const bookingStore = useBookingStore()

const bookingId = ref((route.params.id as string) || '')
const booking = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Load booking data from store or current booking
const loadBooking = async () => {
  try {
    loading.value = true
    // Check if it's the current booking from the store
    if (bookingStore.currentBooking) {
      booking.value = bookingStore.currentBooking
    } else {
      error.value = 'Booking not found. Please complete a booking first.'
    }
  } catch (err) {
    console.error('Failed to load booking:', err)
    error.value = 'Failed to load booking details'
  } finally {
    loading.value = false
  }
}

const nights = computed(() => {
  const checkIn = new Date(mockBooking.value.checkIn)
  const checkOut = new Date(mockBooking.value.checkOut)
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
})

const taxesAndFees = computed(() => {
  return mockBooking.value.finalPrice - mockBooking.value.totalPrice
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const downloadConfirmation = () => {
  // Mock PDF download
  console.log('Downloading confirmation PDF...')
}

const emailConfirmation = () => {
  // Mock email confirmation
  console.log('Sending email confirmation...')
}

onMounted(() => {
  // In a real app, fetch booking details from API using the booking ID
})
</script>

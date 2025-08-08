<template>
  <div
    class="booking-widget bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6 sticky top-8"
  >
    <div class="mb-6">
      <h3 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        {{ $t('booking.bookYourStay') }}
      </h3>
      <div v-if="selectedRoom" class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ selectedRoom.type }} - {{ formatPricePerNight(calculatePrice(selectedRoom.price)) }}
      </div>
    </div>

    <form @submit.prevent="initiateBooking" class="space-y-4">
      <!-- Check-in Date -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {{ $t('home.search.checkin') }}
        </label>
        <input
          v-model="bookingForm.checkIn"
          type="date"
          :min="today"
          required
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
          @change="validateDates"
        />
      </div>

      <!-- Check-out Date -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {{ $t('home.search.checkout') }}
        </label>
        <input
          v-model="bookingForm.checkOut"
          type="date"
          :min="minCheckoutDate"
          required
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
          @change="validateDates"
        />
      </div>

      <!-- Guests -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {{ $t('home.search.guests') }}
        </label>
        <select
          v-model.number="bookingForm.guests"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
        >
          <option v-for="n in maxGuests" :key="n" :value="n">
            {{ n }} {{ n === 1 ? $t('booking.guest') : $t('booking.guests') }}
          </option>
        </select>
      </div>

      <!-- Rooms -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {{ $t('booking.rooms') }}
        </label>
        <select
          v-model.number="bookingForm.rooms"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
        >
          <option v-for="n in maxRooms" :key="n" :value="n">
            {{ n }} {{ n === 1 ? $t('booking.room') : $t('booking.rooms') }}
          </option>
        </select>
      </div>

      <!-- Room Type Selection -->
      <div v-if="!selectedRoom && roomTypes.length > 1">
        <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {{ $t('booking.roomType') }}
        </label>
        <select
          v-model="bookingForm.roomType"
          class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
        >
          <option value="">{{ $t('booking.selectRoomType') }}</option>
          <option v-for="room in roomTypes" :key="room.id" :value="room.id">
            {{ room.type }} - {{ formatPrice(calculatePrice(room.price)) }}
          </option>
        </select>
      </div>

      <!-- Price Breakdown -->
      <div
        v-if="isValidBooking"
        class="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-3"
      >
        <div class="flex justify-between text-sm">
          <span class="text-neutral-600 dark:text-neutral-400">
            ${{ basePrice }} × {{ nights }}
            {{ nights === 1 ? $t('booking.night') : $t('booking.nights') }} ×
            {{ bookingForm.rooms }}
            {{ bookingForm.rooms === 1 ? $t('booking.room') : $t('booking.rooms') }}
          </span>
          <span class="text-neutral-800 dark:text-neutral-200">${{ subtotal }}</span>
        </div>

        <div v-if="taxesAndFees > 0" class="flex justify-between text-sm">
          <span class="text-neutral-600 dark:text-neutral-400">{{
            $t('booking.taxesAndFees')
          }}</span>
          <span class="text-neutral-800 dark:text-neutral-200">${{ taxesAndFees }}</span>
        </div>

        <div
          v-if="hasDiscount"
          class="flex justify-between text-sm text-green-600 dark:text-green-400"
        >
          <span>{{ $t('booking.discount') }} ({{ appliedDiscount.code }})</span>
          <span>-${{ discountAmount }}</span>
        </div>

        <div
          class="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-semibold"
        >
          <span class="text-neutral-800 dark:text-neutral-200">{{ $t('booking.total') }}</span>
          <span class="text-xl text-primary-600 dark:text-primary-400">{{ formatPrice(totalPrice) }}</span>
        </div>

        <div class="text-xs text-neutral-500 dark:text-neutral-400">
          {{ $t('booking.priceNote') }}
        </div>
      </div>

      <!-- Promo Code -->
      <div class="border-t border-neutral-200 dark:border-neutral-700 pt-4">
        <PromoCodeInput />
      </div>

      <!-- Booking Button -->
      <button
        type="submit"
        :disabled="!isValidBooking || loading"
        class="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
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
        <span v-else> {{ $t('booking.bookNow') }} - {{ formatPrice(totalPrice) }} </span>
      </button>

      <!-- Login Notice -->
      <div v-if="!isAuthenticated" class="text-center">
        <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          {{ $t('booking.loginRequired') }}
        </p>
        <router-link
          to="/login"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          {{ $t('nav.signin') }}
        </router-link>
        <span class="text-neutral-400 mx-2">|</span>
        <router-link
          to="/signup"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
        >
          {{ $t('nav.signup') }}
        </router-link>
      </div>

      <!-- Safety Notice -->
      <div
        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
      >
        <div class="flex items-start space-x-2">
          <svg
            class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div class="text-sm text-green-800 dark:text-green-200">
            <div class="font-medium mb-1">{{ $t('booking.safetyNotice') }}</div>
            <div class="text-green-700 dark:text-green-300">
              {{ $t('booking.freeCancellation') }}
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBookingStore } from '../stores/booking'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import PromoCodeInput from './PromoCodeInput.vue'

interface Props {
  hotel: any
  roomTypes: any[]
  selectedRoom?: any
}

const props = defineProps<Props>()

const router = useRouter()
const { t } = useI18n()
const bookingStore = useBookingStore()
const authStore = useAuthStore()
const appStore = useAppStore()

const loading = ref(false)

const bookingForm = ref({
  checkIn: '',
  checkOut: '',
  guests: 2,
  rooms: 1,
  roomType: props.selectedRoom?.id || '',
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const minCheckoutDate = computed(() => {
  if (!bookingForm.value.checkIn) return today.value
  const checkIn = new Date(bookingForm.value.checkIn)
  checkIn.setDate(checkIn.getDate() + 1)
  return checkIn.toISOString().split('T')[0]
})

const maxGuests = computed(() => {
  if (props.selectedRoom) return props.selectedRoom.max_guests || 4
  if (bookingForm.value.roomType) {
    const room = props.roomTypes.find((r) => r.id === bookingForm.value.roomType)
    return room?.max_guests || 4
  }
  return 8 // Default max
})

const maxRooms = computed(() => {
  if (props.selectedRoom) return props.selectedRoom.available_count || 1
  if (bookingForm.value.roomType) {
    const room = props.roomTypes.find((r) => r.id === bookingForm.value.roomType)
    return room?.available_count || 1
  }
  return 3 // Default max
})

const selectedRoomData = computed(() => {
  if (props.selectedRoom) return props.selectedRoom
  if (bookingForm.value.roomType) {
    return props.roomTypes.find((r) => r.id === bookingForm.value.roomType)
  }
  return props.roomTypes[0] // Default to first room type
})

const nights = computed(() => {
  if (!bookingForm.value.checkIn || !bookingForm.value.checkOut) return 0
  const checkIn = new Date(bookingForm.value.checkIn)
  const checkOut = new Date(bookingForm.value.checkOut)
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
})

const basePrice = computed(() => {
  if (!selectedRoomData.value) return 0
  return calculatePrice(selectedRoomData.value.price)
})

const subtotal = computed(() => {
  return basePrice.value * nights.value * bookingForm.value.rooms
})

const taxesAndFees = computed(() => {
  return Math.round(subtotal.value * 0.12) // 12% taxes and fees
})

const hasDiscount = computed(() => !!appStore.appliedDiscount)
const appliedDiscount = computed(() => appStore.appliedDiscount)

const discountAmount = computed(() => {
  if (!hasDiscount.value) return 0
  const discount = appliedDiscount.value!
  const baseAmount = subtotal.value + taxesAndFees.value

  if (discount.type === 'percentage') {
    return Math.round(baseAmount * (discount.discount / 100))
  } else {
    return Math.min(discount.discount, baseAmount)
  }
})

const totalPrice = computed(() => {
  return Math.max(0, subtotal.value + taxesAndFees.value - discountAmount.value)
})

const isValidBooking = computed(() => {
  return (
    bookingForm.value.checkIn &&
    bookingForm.value.checkOut &&
    nights.value > 0 &&
    selectedRoomData.value &&
    bookingForm.value.guests <= maxGuests.value
  )
})

const isAuthenticated = computed(() => authStore.isAuthenticated)

const calculatePrice = (price: number): number => {
  const discount = appStore.appliedDiscount
  if (!discount) return price

  if (discount.type === 'percentage') {
    return Math.round(price * (1 - discount.discount / 100))
  } else {
    return Math.max(0, price - discount.discount)
  }
}

const validateDates = () => {
  if (bookingForm.value.checkIn && bookingForm.value.checkOut) {
    const checkIn = new Date(bookingForm.value.checkIn)
    const checkOut = new Date(bookingForm.value.checkOut)

    if (checkOut <= checkIn) {
      // Reset checkout date
      const newCheckout = new Date(checkIn)
      newCheckout.setDate(newCheckout.getDate() + 1)
      bookingForm.value.checkOut = newCheckout.toISOString().split('T')[0]
    }
  }
}

const initiateBooking = async () => {
  if (!isValidBooking.value) return

  if (!isAuthenticated.value) {
    // Store booking intent and redirect to login
    sessionStorage.setItem(
      'bookingIntent',
      JSON.stringify({
        hotelId: props.hotel.id,
        roomId: selectedRoomData.value.id,
        ...bookingForm.value,
        totalPrice: totalPrice.value,
      }),
    )
    router.push('/login')
    return
  }

  loading.value = true

  try {
    // Create booking object
    const bookingData = {
      hotel: props.hotel,
      room: selectedRoomData.value,
      checkIn: bookingForm.value.checkIn,
      checkOut: bookingForm.value.checkOut,
      guests: bookingForm.value.guests,
      rooms: bookingForm.value.rooms,
      totalPrice: subtotal.value + taxesAndFees.value,
      discountAmount: discountAmount.value,
      finalPrice: totalPrice.value,
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
    }

    // Start booking process
    bookingStore.startBooking(props.hotel, bookingData)

    // Navigate to booking page
    router.push('/booking')
  } catch (error) {
    console.error('Booking error:', error)
  } finally {
    loading.value = false
  }
}

// Watch for selected room changes
watch(
  () => props.selectedRoom,
  (newRoom) => {
    if (newRoom) {
      bookingForm.value.roomType = newRoom.id
    }
  },
  { immediate: true },
)

// Set default dates
const setDefaultDates = () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date(today)
  dayAfter.setDate(dayAfter.getDate() + 2)

  if (!bookingForm.value.checkIn) {
    bookingForm.value.checkIn = tomorrow.toISOString().split('T')[0]
  }
  if (!bookingForm.value.checkOut) {
    bookingForm.value.checkOut = dayAfter.toISOString().split('T')[0]
  }
}

setDefaultDates()
</script>

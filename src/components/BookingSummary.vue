<template>
  <div
    class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6"
  >
    <h3 class="text-lg font-display font-bold text-neutral-800 dark:text-neutral-200 mb-6">
      {{ $t('booking.bookingSummary') }}
    </h3>

    <!-- Hotel Information -->
    <div class="mb-6">
      <div class="flex space-x-4">
        <img
          :src="booking.hotel.image"
          :alt="booking.hotel.name"
          class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div class="flex-1">
          <h4 class="font-semibold text-neutral-800 dark:text-neutral-200">
            {{ booking.hotel.name }}
          </h4>
          <p class="text-sm text-neutral-600 dark:text-neutral-400 flex items-center mt-1">
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
            {{ booking.hotel.location }}
          </p>
          <div class="flex items-center mt-1">
            <span class="text-amber-400 text-sm">⭐</span>
            <span class="text-sm text-neutral-600 dark:text-neutral-400 ml-1">{{
              booking.hotel.rating
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details -->
    <div class="space-y-4 mb-6">
      <!-- Dates -->
      <div
        class="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700"
      >
        <span class="text-sm text-neutral-600 dark:text-neutral-400">{{
          $t('booking.dates')
        }}</span>
        <span class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
        </span>
      </div>

      <!-- Duration -->
      <div
        class="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700"
      >
        <span class="text-sm text-neutral-600 dark:text-neutral-400">{{
          $t('booking.duration')
        }}</span>
        <span class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {{ nights }} {{ nights === 1 ? $t('booking.night') : $t('booking.nights') }}
        </span>
      </div>

      <!-- Room Type -->
      <div
        v-if="booking.room"
        class="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700"
      >
        <span class="text-sm text-neutral-600 dark:text-neutral-400">{{
          $t('booking.roomType')
        }}</span>
        <span class="text-sm font-medium text-neutral-800 dark:text-neutral-200">{{
          booking.room.type
        }}</span>
      </div>

      <!-- Guests -->
      <div
        class="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700"
      >
        <span class="text-sm text-neutral-600 dark:text-neutral-400">{{
          $t('booking.guests')
        }}</span>
        <span class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {{ booking.guests }}
          {{ booking.guests === 1 ? $t('booking.guest') : $t('booking.guests') }}
        </span>
      </div>

      <!-- Rooms -->
      <div
        class="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700"
      >
        <span class="text-sm text-neutral-600 dark:text-neutral-400">{{
          $t('booking.rooms')
        }}</span>
        <span class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {{ booking.rooms || 1 }}
          {{ (booking.rooms || 1) === 1 ? $t('booking.room') : $t('booking.rooms') }}
        </span>
      </div>
    </div>

    <!-- Pricing Breakdown -->
    <div v-if="showDetails" class="space-y-3 mb-6">
      <h4 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
        {{ $t('booking.priceBreakdown') }}
      </h4>

      <!-- Room Rate -->
      <div class="flex justify-between text-sm">
        <span class="text-neutral-600 dark:text-neutral-400">
          {{ formatPrice(roomRate) }} × {{ nights }}
          {{ nights === 1 ? $t('booking.night') : $t('booking.nights') }} ×
          {{ booking.rooms || 1 }}
          {{ (booking.rooms || 1) === 1 ? $t('booking.room') : $t('booking.rooms') }}
        </span>
        <span class="text-neutral-800 dark:text-neutral-200">{{ formatPrice(subtotal) }}</span>
      </div>

      <!-- Taxes and Fees -->
      <div class="flex justify-between text-sm">
        <span class="text-neutral-600 dark:text-neutral-400">{{ $t('booking.taxesAndFees') }}</span>
        <span class="text-neutral-800 dark:text-neutral-200">${{ taxesAndFees }}</span>
      </div>

      <!-- Discount -->
      <div
        v-if="hasDiscount"
        class="flex justify-between text-sm text-green-600 dark:text-green-400"
      >
        <span>{{ $t('booking.discount') }} ({{ appliedDiscount.code }})</span>
        <span>-${{ discountAmount }}</span>
      </div>

      <!-- Total -->
      <div
        class="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-semibold"
      >
        <span class="text-neutral-800 dark:text-neutral-200">{{ $t('booking.total') }}</span>
        <span class="text-xl text-primary-600 dark:text-primary-400"
          >${{ booking.finalPrice }}</span
        >
      </div>
    </div>

    <!-- Promo Code Section -->
    <div v-if="showDetails" class="mb-6">
      <PromoCodeInput />
    </div>

    <!-- Cancellation Policy -->
    <div
      class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
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
        <div class="text-sm">
          <div class="font-medium text-green-800 dark:text-green-200 mb-1">
            {{ $t('booking.freeCancellation') }}
          </div>
          <div class="text-green-700 dark:text-green-300">
            {{ $t('booking.cancellationPolicy') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Guest Info Summary (for booking review) -->
    <div
      v-if="showGuestInfo && booking.guestInfo?.firstName"
      class="border-t border-neutral-200 dark:border-neutral-700 pt-6"
    >
      <h4 class="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
        {{ $t('booking.guestInformation') }}
      </h4>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-neutral-600 dark:text-neutral-400">{{ $t('booking.name') }}</span>
          <span class="text-neutral-800 dark:text-neutral-200">
            {{ booking.guestInfo.firstName }} {{ booking.guestInfo.lastName }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-600 dark:text-neutral-400">{{ $t('booking.email') }}</span>
          <span class="text-neutral-800 dark:text-neutral-200">{{ booking.guestInfo.email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-600 dark:text-neutral-400">{{ $t('booking.phone') }}</span>
          <span class="text-neutral-800 dark:text-neutral-200">{{ booking.guestInfo.phone }}</span>
        </div>
      </div>
    </div>

    <!-- Support Notice -->
    <div
      class="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700"
    >
      {{ $t('booking.supportNotice') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import PromoCodeInput from './PromoCodeInput.vue'

interface Props {
  booking: any
  showDetails?: boolean
  showGuestInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
  showGuestInfo: false,
})

const { t } = useI18n()
const appStore = useAppStore()

const nights = computed(() => {
  if (!props.booking.checkIn || !props.booking.checkOut) return 0
  const checkIn = new Date(props.booking.checkIn)
  const checkOut = new Date(props.booking.checkOut)
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
})

const roomRate = computed(() => {
  if (props.booking.room) return props.booking.room.price
  return props.booking.totalPrice / (nights.value * (props.booking.rooms || 1))
})

const subtotal = computed(() => {
  return roomRate.value * nights.value * (props.booking.rooms || 1)
})

const taxesAndFees = computed(() => {
  return Math.round(subtotal.value * 0.12) // 12% taxes and fees
})

const hasDiscount = computed(() => !!appStore.appliedDiscount)
const appliedDiscount = computed(() => appStore.appliedDiscount)

const discountAmount = computed(() => {
  if (!hasDiscount.value || !appliedDiscount.value) return 0
  const discount = appliedDiscount.value
  const baseAmount = subtotal.value + taxesAndFees.value

  if (discount.type === 'percentage') {
    return Math.round(baseAmount * (discount.discount / 100))
  } else {
    return Math.min(discount.discount, baseAmount)
  }
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
</script>

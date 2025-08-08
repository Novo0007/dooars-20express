import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Hotel } from './hotel'
import { useAppStore } from './app'
import { formatPrice, calculateIndianTaxes, convertPriceToINR } from '@/utils/currency'

export interface BookingDetails {
  id?: string
  hotel: Hotel
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  roomType: string
  totalPrice: number
  discountAmount?: number
  finalPrice: number
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
  }
  paymentInfo?: {
    method: string
    status: 'pending' | 'completed' | 'failed'
    transactionId?: string
  }
  status: 'draft' | 'confirmed' | 'cancelled'
  createdAt: Date
}

export const useBookingStore = defineStore('booking', () => {
  // State
  const currentBooking = ref<Partial<BookingDetails> | null>(null)
  const userBookings = ref<BookingDetails[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get app store instance
  const appStore = useAppStore()

  // Computed
  const bookingTotal = computed(() => {
    if (!currentBooking.value || !currentBooking.value.totalPrice) return 0

    let total = currentBooking.value.totalPrice

    // Apply discount if available
    if (appStore.appliedDiscount) {
      const discount = appStore.appliedDiscount
      if (discount.type === 'percentage') {
        total = total * (1 - discount.discount / 100)
      } else {
        total = Math.max(0, total - discount.discount)
      }
    }

    return total
  })

  const bookingDuration = computed(() => {
    if (!currentBooking.value?.checkIn || !currentBooking.value?.checkOut) return 0

    const checkIn = new Date(currentBooking.value.checkIn)
    const checkOut = new Date(currentBooking.value.checkOut)

    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  })

  const upcomingBookings = computed(() => {
    const now = new Date()
    return userBookings.value.filter((booking) => {
      const checkIn = new Date(booking.checkIn)
      return checkIn > now && booking.status === 'confirmed'
    })
  })

  const pastBookings = computed(() => {
    const now = new Date()
    return userBookings.value.filter((booking) => {
      const checkOut = new Date(booking.checkOut)
      return checkOut < now && booking.status === 'confirmed'
    })
  })

  // Actions
  const startBooking = (hotel: Hotel, searchParams: any) => {
    currentBooking.value = {
      hotel,
      checkIn: searchParams.checkIn || '',
      checkOut: searchParams.checkOut || '',
      guests: searchParams.guests || 2,
      rooms: 1,
      roomType: 'Standard',
      totalPrice: hotel.price * (bookingDuration.value || 1),
      finalPrice: 0,
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
      status: 'draft',
      createdAt: new Date(),
    }

    // Calculate final price
    currentBooking.value.finalPrice = bookingTotal.value
  }

  const updateBookingDetails = (details: Partial<BookingDetails>) => {
    if (!currentBooking.value) return

    Object.assign(currentBooking.value, details)

    // Recalculate total price
    if (
      currentBooking.value.hotel &&
      currentBooking.value.checkIn &&
      currentBooking.value.checkOut
    ) {
      const duration = bookingDuration.value
      currentBooking.value.totalPrice =
        currentBooking.value.hotel.price * duration * (currentBooking.value.rooms || 1)
      currentBooking.value.finalPrice = bookingTotal.value
    }
  }

  const updateGuestInfo = (guestInfo: Partial<BookingDetails['guestInfo']>) => {
    if (!currentBooking.value) return

    currentBooking.value.guestInfo = {
      ...currentBooking.value.guestInfo,
      ...guestInfo,
    }
  }

  const confirmBooking = async () => {
    if (!currentBooking.value) throw new Error('No booking in progress')

    loading.value = true
    error.value = null

    try {
      // Generate booking ID
      const bookingId = `WS${Date.now()}`

      // Create final booking object
      const finalBooking: BookingDetails = {
        ...currentBooking.value,
        id: bookingId,
        status: 'confirmed',
        paymentInfo: {
          method: 'razorpay',
          status: 'completed',
          transactionId: `txn_${Date.now()}`,
        },
      } as BookingDetails

      // Mock API call to confirm booking
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add to user bookings
      userBookings.value.push(finalBooking)

      // Clear current booking
      currentBooking.value = null

      return finalBooking
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Booking failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (bookingId: string) => {
    loading.value = true
    error.value = null

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update booking status
      const booking = userBookings.value.find((b) => b.id === bookingId)
      if (booking) {
        booking.status = 'cancelled'
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Cancellation failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserBookings = async () => {
    loading.value = true
    error.value = null

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data would be fetched here
      // userBookings.value = await api.getUserBookings()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch bookings'
    } finally {
      loading.value = false
    }
  }

  const clearCurrentBooking = () => {
    currentBooking.value = null
  }

  const calculatePrice = (hotel: Hotel, checkIn: string, checkOut: string, rooms: number = 1) => {
    if (!checkIn || !checkOut) return 0

    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Convert to INR if price is in USD (legacy data)
    const priceInINR = hotel.price < 1000 ? convertPriceToINR(hotel.price) : hotel.price
    const baseAmount = priceInINR * duration * rooms

    // Calculate Indian taxes (12% GST)
    const taxes = calculateIndianTaxes(baseAmount)

    return taxes.finalAmount // Return price including taxes
  }

  return {
    // State
    currentBooking,
    userBookings,
    loading,
    error,

    // Computed
    bookingTotal,
    bookingDuration,
    upcomingBookings,
    pastBookings,

    // Actions
    startBooking,
    updateBookingDetails,
    updateGuestInfo,
    confirmBooking,
    cancelBooking,
    fetchUserBookings,
    clearCurrentBooking,
    calculatePrice,
  }
})

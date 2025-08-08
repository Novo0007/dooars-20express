<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Booking History
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          Track all your past and upcoming hotel reservations
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-8">
        <div class="border-b border-neutral-200 dark:border-neutral-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              @click="activeFilter = tab.key"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
              :class="activeFilter === tab.key
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'"
            >
              {{ tab.label }} ({{ getBookingCount(tab.key) }})
            </button>
          </nav>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBookings.length === 0" class="text-center py-20">
        <svg class="mx-auto h-24 w-24 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          No bookings found
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          {{ getEmptyStateMessage() }}
        </p>
        <router-link
          to="/search"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
        >
          Start Booking
        </router-link>
      </div>

      <!-- Bookings List -->
      <div v-else class="space-y-6">
        <div
          v-for="booking in filteredBookings"
          :key="booking.id"
          class="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <!-- Booking Status Badge -->
              <div class="flex items-center space-x-3">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusBadgeClass(booking.status)"
                >
                  {{ getStatusLabel(booking.status) }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getPaymentStatusBadgeClass(booking.payment_status)"
                >
                  {{ getPaymentStatusLabel(booking.payment_status) }}
                </span>
              </div>
              
              <!-- Booking ID -->
              <div class="text-right">
                <p class="text-sm text-neutral-500 dark:text-neutral-400">
                  Booking ID
                </p>
                <p class="text-sm font-mono text-neutral-900 dark:text-neutral-100">
                  {{ booking.id.slice(0, 8).toUpperCase() }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Hotel Information -->
              <div class="lg:col-span-2">
                <div class="flex space-x-4">
                  <img
                    :src="booking.hotel?.images?.[0] || '/placeholder-hotel.jpg'"
                    :alt="booking.hotel?.name"
                    class="w-20 h-20 rounded-lg object-cover"
                  />
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {{ booking.hotel?.name }}
                    </h3>
                    <p class="text-neutral-600 dark:text-neutral-400 mb-2 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ booking.hotel?.location }}
                    </p>
                    
                    <!-- Booking Details Grid -->
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="text-neutral-500 dark:text-neutral-400">Check-in:</span>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-100">
                          {{ formatDate(booking.check_in) }}
                        </span>
                      </div>
                      <div>
                        <span class="text-neutral-500 dark:text-neutral-400">Check-out:</span>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-100">
                          {{ formatDate(booking.check_out) }}
                        </span>
                      </div>
                      <div>
                        <span class="text-neutral-500 dark:text-neutral-400">Room:</span>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-100">
                          {{ booking.room?.type }}
                        </span>
                      </div>
                      <div>
                        <span class="text-neutral-500 dark:text-neutral-400">Guests:</span>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-100">
                          {{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}
                        </span>
                      </div>
                      <div>
                        <span class="text-neutral-500 dark:text-neutral-400">Nights:</span>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-100">
                          {{ booking.nights }} {{ booking.nights === 1 ? 'night' : 'nights' }}
                        </span>
                      </div>
                      <div>
                        <span class="text-neutral-500 dark:text-neutral-400">Booked:</span>
                        <span class="ml-1 text-neutral-900 dark:text-neutral-100">
                          {{ formatDate(booking.created_at) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Price and Actions -->
              <div class="lg:text-right">
                <div class="mb-4">
                  <div v-if="booking.discount_amount > 0" class="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                    ${{ booking.total_price.toFixed(2) }}
                  </div>
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ${{ booking.final_price.toFixed(2) }}
                  </div>
                  <div v-if="booking.discount_amount > 0" class="text-sm text-green-600 dark:text-green-400">
                    Saved ${{ booking.discount_amount.toFixed(2) }}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2">
                  <button
                    @click="viewBookingDetails(booking)"
                    class="w-full px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-primary-300 dark:border-primary-700 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    View Details
                  </button>
                  
                  <button
                    v-if="canCancelBooking(booking)"
                    @click="cancelBooking(booking)"
                    class="w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Cancel Booking
                  </button>
                  
                  <button
                    v-if="canReview(booking)"
                    @click="leaveReview(booking)"
                    class="w-full px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 border border-secondary-300 dark:border-secondary-700 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Leave Review
                  </button>
                  
                  <router-link
                    v-if="booking.status === 'completed'"
                    :to="`/hotel/${booking.hotel_id}`"
                    class="block w-full px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                  >
                    Book Again
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMoreBookings && !loading" class="mt-8 text-center">
        <button
          @click="loadMoreBookings"
          class="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg transition-colors duration-200"
        >
          Load More Bookings
        </button>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Booking Details
            </h3>
            <button
              @click="selectedBooking = null"
              class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Detailed booking information would go here -->
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Guest Information</h4>
              <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                <p><strong>Name:</strong> {{ selectedBooking.guest_info?.name }}</p>
                <p><strong>Email:</strong> {{ selectedBooking.guest_info?.email }}</p>
                <p><strong>Phone:</strong> {{ selectedBooking.guest_info?.phone }}</p>
              </div>
            </div>
            
            <div v-if="selectedBooking.special_requests">
              <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Special Requests</h4>
              <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                <p>{{ selectedBooking.special_requests }}</p>
              </div>
            </div>
            
            <div>
              <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Payment Information</h4>
              <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4">
                <p><strong>Payment ID:</strong> {{ selectedBooking.payment_id || 'N/A' }}</p>
                <p><strong>Payment Method:</strong> {{ selectedBooking.payment_method || 'Credit Card' }}</p>
                <p><strong>Total Amount:</strong> ${{ selectedBooking.final_price.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

interface Booking {
  id: string
  hotel_id: number
  room_id: number
  check_in: string
  check_out: string
  guests: number
  rooms_count: number
  total_price: number
  discount_amount: number
  final_price: number
  status: string
  payment_status: string
  payment_id?: string
  payment_method?: string
  special_requests?: string
  guest_info: any
  nights: number
  created_at: string
  hotel?: any
  room?: any
}

const authStore = useAuthStore()

const loading = ref(true)
const bookings = ref<Booking[]>([])
const selectedBooking = ref<Booking | null>(null)
const activeFilter = ref('all')
const hasMoreBookings = ref(false)
const currentPage = ref(1)
const pageSize = 10

const filterTabs = [
  { key: 'all', label: 'All Bookings' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' }
]

const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') return bookings.value
  
  if (activeFilter.value === 'upcoming') {
    return bookings.value.filter(booking => 
      ['pending', 'confirmed'].includes(booking.status) && 
      new Date(booking.check_in) > new Date()
    )
  }
  
  if (activeFilter.value === 'completed') {
    return bookings.value.filter(booking => booking.status === 'completed')
  }
  
  if (activeFilter.value === 'cancelled') {
    return bookings.value.filter(booking => booking.status === 'cancelled')
  }
  
  return bookings.value
})

const getBookingCount = (filter: string) => {
  if (filter === 'all') return bookings.value.length
  
  if (filter === 'upcoming') {
    return bookings.value.filter(booking => 
      ['pending', 'confirmed'].includes(booking.status) && 
      new Date(booking.check_in) > new Date()
    ).length
  }
  
  if (filter === 'completed') {
    return bookings.value.filter(booking => booking.status === 'completed').length
  }
  
  if (filter === 'cancelled') {
    return bookings.value.filter(booking => booking.status === 'cancelled').length
  }
  
  return 0
}

const getEmptyStateMessage = () => {
  switch (activeFilter.value) {
    case 'upcoming': return 'You have no upcoming bookings. Start planning your next trip!'
    case 'completed': return 'You haven\'t completed any stays yet.'
    case 'cancelled': return 'You have no cancelled bookings.'
    default: return 'You haven\'t made any bookings yet. Start exploring amazing hotels!'
  }
}

const fetchBookings = async (page = 1, append = false) => {
  if (!authStore.isAuthenticated) return

  try {
    loading.value = true

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('bookings')
      .select(`
        *,
        hotel:hotels(*),
        room:rooms(*)
      `, { count: 'exact' })
      .eq('user_id', authStore.user!.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    if (append) {
      bookings.value.push(...(data || []))
    } else {
      bookings.value = data || []
    }

    hasMoreBookings.value = (count || 0) > page * pageSize
    currentPage.value = page
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    // Ensure we have empty array on error
    if (!append) {
      bookings.value = []
    }
  } finally {
    loading.value = false
  }
}

const loadMoreBookings = () => {
  fetchBookings(currentPage.value + 1, true)
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    no_show: 'No Show'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Payment Pending',
    paid: 'Paid',
    failed: 'Payment Failed',
    refunded: 'Refunded',
    partial_refund: 'Partially Refunded'
  }
  return labels[status] || status
}

const getPaymentStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    partial_refund: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const canCancelBooking = (booking: Booking) => {
  return ['pending', 'confirmed'].includes(booking.status) && 
         new Date(booking.check_in) > new Date()
}

const canReview = (booking: Booking) => {
  return booking.status === 'completed' && 
         new Date(booking.check_out) < new Date()
}

const viewBookingDetails = (booking: Booking) => {
  selectedBooking.value = booking
}

const cancelBooking = async (booking: Booking) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', booking.id)

    if (error) throw error

    // Update local state
    const index = bookings.value.findIndex(b => b.id === booking.id)
    if (index !== -1) {
      bookings.value[index].status = 'cancelled'
    }
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    alert('Failed to cancel booking. Please try again.')
  }
}

const leaveReview = (booking: Booking) => {
  // This would typically open a review modal
  // For now, redirect to hotel page
  window.open(`/hotel/${booking.hotel_id}#reviews`, '_blank')
}

onMounted(() => {
  fetchBookings()
})
</script>

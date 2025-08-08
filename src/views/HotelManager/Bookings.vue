<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Manage Bookings
            </h1>
            <p class="text-neutral-600 dark:text-neutral-400">
              View and manage bookings for your assigned hotels
            </p>
          </div>
          <router-link
            to="/hotel-manager"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
      </div>

      <!-- Hotel Selection -->
      <div class="mb-8 bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">Select Hotel</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            v-model="selectedHotelId"
            @change="fetchBookings"
            class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a hotel</option>
            <option
              v-for="assignment in authStore.hotelAssignments"
              :key="assignment.hotel.id"
              :value="assignment.hotel.id"
            >
              {{ assignment.hotel.name }} - {{ assignment.hotel.location }}
            </option>
          </select>
          <div class="flex space-x-2">
            <button
              @click="fetchBookings"
              :disabled="!selectedHotelId || loading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              {{ loading ? 'Loading...' : 'Load Bookings' }}
            </button>
            <button
              @click="exportBookings"
              :disabled="!selectedHotelId || bookings.length === 0"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedHotelId && bookings.length > 0">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Bookings</p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ bookings.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Pending</p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ pendingCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Confirmed</p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ confirmedCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Revenue</p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">${{ totalRevenue.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings Table -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Bookings for {{ getSelectedHotelName() }}
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead class="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Guest
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Room
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Dates
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-neutral-900 dark:text-neutral-100">
                    #{{ booking.id.slice(-8) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {{ booking.guest_info?.firstName }} {{ booking.guest_info?.lastName }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ booking.guest_info?.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                    {{ booking.room?.type || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                    <div>{{ formatDate(booking.check_in) }}</div>
                    <div class="text-neutral-500">to {{ formatDate(booking.check_out) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(booking.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ booking.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    ${{ booking.final_price }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="viewBooking(booking)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                      <button
                        v-if="booking.status === 'pending'"
                        @click="approveBooking(booking)"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Approve
                      </button>
                      <button
                        v-if="['pending', 'confirmed'].includes(booking.status)"
                        @click="cancelBooking(booking)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="selectedHotelId && !loading && bookings.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No bookings found</h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">This hotel has no bookings yet.</p>
      </div>

      <!-- Select Hotel State -->
      <div v-else-if="!selectedHotelId" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">Select a hotel</h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Choose a hotel from the dropdown above to view its bookings.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const authStore = useAuthStore()

// State
const selectedHotelId = ref('')
const bookings = ref<any[]>([])
const loading = ref(false)

// Computed
const pendingCount = computed(() => bookings.value.filter(b => b.status === 'pending').length)
const confirmedCount = computed(() => bookings.value.filter(b => b.status === 'confirmed').length)
const totalRevenue = computed(() => bookings.value.reduce((sum, b) => sum + (b.final_price || 0), 0))

// Methods
const fetchBookings = async () => {
  if (!selectedHotelId.value) return

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(*)
      `)
      .eq('hotel_id', selectedHotelId.value)
      .order('created_at', { ascending: false })

    if (error) throw error
    bookings.value = data || []
  } catch (error) {
    console.error('Error fetching bookings:', error)
  } finally {
    loading.value = false
  }
}

const approveBooking = async (booking: any) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking.id)

    if (error) throw error
    await fetchBookings()
  } catch (error) {
    console.error('Error approving booking:', error)
  }
}

const cancelBooking = async (booking: any) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', booking.id)

    if (error) throw error
    await fetchBookings()
  } catch (error) {
    console.error('Error canceling booking:', error)
  }
}

const viewBooking = (booking: any) => {
  console.log('View booking:', booking)
  // Implement booking detail modal
}

const exportBookings = () => {
  const headers = ['Booking ID', 'Guest Name', 'Email', 'Room', 'Check-in', 'Check-out', 'Status', 'Amount']
  const csvData = bookings.value.map(booking => [
    booking.id,
    `${booking.guest_info?.firstName} ${booking.guest_info?.lastName}`,
    booking.guest_info?.email,
    booking.room?.type || 'N/A',
    booking.check_in,
    booking.check_out,
    booking.status,
    booking.final_price
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `hotel-bookings-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const getSelectedHotelName = () => {
  const assignment = authStore.hotelAssignments.find(a => a.hotel.id.toString() === selectedHotelId.value)
  return assignment?.hotel.name || 'Unknown Hotel'
}

const getStatusClass = (status: string) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'confirmed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await authStore.fetchHotelAssignments()
  
  // Auto-select hotel from query parameter
  const hotelParam = route.query.hotel as string
  if (hotelParam && authStore.hotelAssignments.some(a => a.hotel.id.toString() === hotelParam)) {
    selectedHotelId.value = hotelParam
    await fetchBookings()
  }
})
</script>

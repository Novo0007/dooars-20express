<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Hotel Manager Dashboard
            </h1>
            <p class="text-neutral-600 dark:text-neutral-400">
              Manage your assigned hotels and bookings
            </p>
          </div>
          <div class="text-right">
            <div
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              Hotel Manager
            </div>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {{ authStore.user?.profile?.full_name || authStore.user?.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- Hotel Selection -->
      <div
        class="mb-8 bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
      >
        <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Your Assigned Hotels
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="assignment in authStore.hotelAssignments"
            :key="assignment.id"
            @click="selectHotel(assignment.hotel)"
            :class="[
              'cursor-pointer rounded-lg border-2 p-4 transition-colors duration-200',
              selectedHotel?.id === assignment.hotel.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {{ assignment.hotel.name }}
                </h4>
                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                  {{ assignment.hotel.location }}
                </p>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 mt-1"
                >
                  {{ assignment.role.charAt(0).toUpperCase() + assignment.role.slice(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="authStore.hotelAssignments.length === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
            No hotels assigned
          </h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Contact your administrator to assign hotels to your account.
          </p>
        </div>
      </div>

      <div v-if="selectedHotel">
        <!-- Quick Actions -->
        <div class="mb-8 flex flex-wrap gap-4">
          <router-link
            :to="`/hotel-manager/bookings?hotel=${selectedHotel.id}`"
            class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Manage Bookings
          </router-link>
          <router-link
            :to="`/hotel-manager/rooms?hotel=${selectedHotel.id}`"
            class="inline-flex items-center px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
            </svg>
            Manage Rooms
          </router-link>
          <router-link
            :to="`/hotel-manager/reports?hotel=${selectedHotel.id}`"
            class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Reports
          </router-link>
        </div>

        <!-- Stats Cards for Selected Hotel -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            v-for="stat in hotelStats"
            :key="stat.name"
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div :class="[stat.iconBg, 'p-3 rounded-full']">
                  <svg
                    class="w-6 h-6"
                    :class="stat.iconColor"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="stat.icon"
                    />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {{ stat.name }}
                </p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ stat.value }}
                </p>
                <div class="flex items-center mt-1">
                  <svg
                    v-if="stat.changeType === 'increase'"
                    class="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span :class="stat.changeColor" class="text-sm font-medium">
                    {{ stat.change }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Bookings Table -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-8"
        >
          <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Recent Bookings - {{ selectedHotel.name }}
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead class="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Guest
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Dates
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700"
              >
                <tr
                  v-for="booking in recentBookings"
                  :key="booking.id"
                  class="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {{ booking.guest_info?.firstName }} {{ booking.guest_info?.lastName }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ booking.guest_info?.email }}
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    {{ booking.room?.type }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    {{ formatDate(booking.check_in) }} - {{ formatDate(booking.check_out) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getStatusClass(booking.status)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ booking.status }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    ${{ booking.final_price }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="viewBooking(booking)"
                        class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </button>
                      <button
                        @click="approveBooking(booking)"
                        v-if="booking.status === 'pending'"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Approve
                      </button>
                      <button
                        @click="cancelBooking(booking)"
                        v-if="['pending', 'confirmed'].includes(booking.status)"
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
          <div v-if="recentBookings.length === 0" class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              No recent bookings
            </h3>
            <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Bookings for this hotel will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { supabase } from '@/lib/supabase'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// State
const selectedHotel = ref<any>(null)
const recentBookings = ref<any[]>([])
const loading = ref(true)

const hotelStats = ref([
  {
    name: "Today's Bookings",
    value: '0',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Monthly Revenue',
    value: '$0',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    name: 'Occupancy Rate',
    value: '0%',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    name: 'Available Rooms',
    value: '0',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
    iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
])

// Methods
const selectHotel = (hotel: any) => {
  selectedHotel.value = hotel
  loadHotelData()
}

const loadHotelData = async () => {
  if (!selectedHotel.value) return

  loading.value = true
  try {
    // Fetch recent bookings for selected hotel
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        room:rooms(*)
      `,
      )
      .eq('hotel_id', selectedHotel.value.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (bookingsError) throw bookingsError
    recentBookings.value = bookings || []

    // Calculate hotel stats
    await calculateHotelStats()
  } catch (error) {
    console.error('Error loading hotel data:', error)
    notificationStore.error('Failed to load hotel data. Please try again.')
  } finally {
    loading.value = false
  }
}

const calculateHotelStats = async () => {
  if (!selectedHotel.value) return

  try {
    // Today's bookings
    const today = new Date().toISOString().split('T')[0]
    const { count: todayBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', selectedHotel.value.id)
      .gte('created_at', today)

    // Monthly revenue
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    const { data: monthlyRevenue } = await supabase
      .from('bookings')
      .select('final_price')
      .eq('hotel_id', selectedHotel.value.id)
      .eq('payment_status', 'paid')
      .gte('created_at', startOfMonth.toISOString())

    const totalRevenue =
      monthlyRevenue?.reduce((sum, booking) => sum + (booking.final_price || 0), 0) || 0

    // Occupancy rate
    const { count: totalRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', selectedHotel.value.id)
      .eq('is_active', true)

    const { count: occupiedRooms } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('hotel_id', selectedHotel.value.id)
      .eq('status', 'confirmed')
      .lte('check_in', new Date().toISOString())
      .gte('check_out', new Date().toISOString())

    const occupancyRate = totalRooms ? Math.round(((occupiedRooms || 0) / totalRooms) * 100) : 0
    const availableRooms = totalRooms - (occupiedRooms || 0)

    // Update stats
    hotelStats.value[0].value = todayBookings?.toString() || '0'
    hotelStats.value[1].value = `$${totalRevenue.toLocaleString()}`
    hotelStats.value[2].value = `${occupancyRate}%`
    hotelStats.value[3].value = availableRooms.toString()
  } catch (error) {
    console.error('Error calculating hotel stats:', error)
    notificationStore.warning('Hotel statistics may not be up to date.')
  }
}

const viewBooking = (booking: any) => {
  // Implement booking view modal
  console.log('View booking:', booking)
}

const approveBooking = async (booking: any) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking.id)

    if (error) throw error
    await loadHotelData()
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
    await loadHotelData()
  } catch (error) {
    console.error('Error canceling booking:', error)
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  try {
    // Fetch hotel assignments for the current user
    await authStore.fetchHotelAssignments()

    // Auto-select first hotel if available
    if (authStore.hotelAssignments.length > 0) {
      selectHotel(authStore.hotelAssignments[0].hotel)
    } else {
      loading.value = false
      notificationStore.info('No hotels assigned to your account. Please contact an administrator.')
    }
  } catch (error) {
    console.error('Failed to load hotel assignments:', error)
    notificationStore.error('Failed to load your hotel assignments.')
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Admin Dashboard
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          Welcome to the Dooars Express management panel
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8 flex flex-wrap gap-4">
        <router-link
          to="/admin/hotels"
          class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Add Hotel
        </router-link>
        <router-link
          to="/admin/bookings"
          class="inline-flex items-center px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Manage Bookings
        </router-link>
        <router-link
          v-if="authStore.hasPermission('view_all_users')"
          to="/admin/users"
          class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          Manage Users
        </router-link>
        <router-link
          v-if="authStore.hasPermission('manage_rooms')"
          to="/admin/rooms"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          Manage Rooms
        </router-link>
        <router-link
          to="/admin/reports"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Reports
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-8 w-8 rounded-md"
                :class="stat.iconBg"
              >
                <svg class="h-5 w-5" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                  {{ stat.name }}
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {{ stat.value }}
                  </div>
                  <div
                    class="ml-2 flex items-baseline text-sm font-semibold"
                    :class="stat.changeColor"
                  >
                    <svg
                      class="self-center flex-shrink-0 h-5 w-5"
                      :class="stat.changeIcon"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        :d="stat.changePath"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="sr-only">{{ stat.changeType === 'increase' ? 'Increased' : 'Decreased' }} by</span>
                    {{ stat.change }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Monthly Revenue Trend
          </h3>
          <div class="h-64">
            <canvas ref="revenueChart" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Booking Trends Chart -->
        <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Booking Trends by Destination
          </h3>
          <div class="h-64">
            <canvas ref="bookingChart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Bookings Table -->
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700">
        <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Recent Bookings
          </h3>
        </div>
        <div class="overflow-hidden">
          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">Loading bookings...</p>
          </div>
          <div v-else-if="recentBookings.length === 0" class="p-8 text-center">
            <p class="text-neutral-600 dark:text-neutral-400">No recent bookings found.</p>
          </div>
          <table v-else class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead class="bg-neutral-50 dark:bg-neutral-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Guest
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Hotel
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Check-in
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
              <tr v-for="booking in recentBookings" :key="booking.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {{ booking.id.slice(0, 8).toUpperCase() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {{ booking.guest_info?.name || 'Unknown' }}
                  </div>
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">
                    {{ booking.guest_info?.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {{ booking.hotel?.name || 'Unknown Hotel' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                  {{ formatDate(booking.check_in) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusBadgeClass(booking.status)"
                  >
                    {{ getStatusLabel(booking.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  ${{ booking.final_price?.toFixed(2) }}
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
        <div class="px-6 py-3 bg-neutral-50 dark:bg-neutral-700 border-t border-neutral-200 dark:border-neutral-600">
          <router-link
            to="/admin/bookings"
            class="text-sm text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            View all bookings →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const authStore = useAuthStore()

const loading = ref(true)
const recentBookings = ref<any[]>([])
const revenueChart = ref<HTMLCanvasElement>()
const bookingChart = ref<HTMLCanvasElement>()

const stats = ref([
  {
    name: 'Total Bookings',
    value: '0',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    changeIcon: '',
    changePath: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Total Revenue',
    value: '$0',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    changeIcon: '',
    changePath: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'Occupancy Rate',
    value: '0%',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    changeIcon: '',
    changePath: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    name: 'Total Users',
    value: '0',
    change: '0%',
    changeType: 'increase',
    changeColor: 'text-green-600',
    changeIcon: '',
    changePath: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400'
  }
])

const loadDashboardData = async () => {
  try {
    loading.value = true

    // Fetch recent bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        hotel:hotels(*),
        room:rooms(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (bookingsError) throw bookingsError

    recentBookings.value = bookings || []

    // Calculate stats
    await calculateStats()

  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const calculateStats = async () => {
  try {
    // Total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })

    // Total revenue (paid bookings only)
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('final_price')
      .eq('payment_status', 'paid')

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.final_price || 0), 0) || 0

    // Calculate occupancy rate
    const { count: totalRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: bookedRooms } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .lte('check_in', new Date().toISOString())
      .gte('check_out', new Date().toISOString())

    const occupancyRate = totalRooms ? Math.round((bookedRooms || 0) / totalRooms * 100) : 0

    // Total users (only show if admin has permission)
    let totalUsers = 0
    if (authStore.hasPermission('view_all_users')) {
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
      totalUsers = userCount || 0
    }

    // Update stats
    stats.value[0].value = totalBookings?.toString() || '0'
    stats.value[1].value = `$${totalRevenue.toLocaleString()}`
    stats.value[2].value = `${occupancyRate}%`
    stats.value[3].value = totalUsers.toString()

  } catch (error) {
    console.error('Failed to calculate stats:', error)
  }
}

const createCharts = async () => {
  await nextTick()
  
  // Mock revenue chart
  if (revenueChart.value) {
    const ctx = revenueChart.value.getContext('2d')
    if (ctx) {
      // Simple chart drawing (you can replace with Chart.js)
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(50, 50, 100, 150)
      ctx.fillStyle = '#60a5fa'
      ctx.fillRect(200, 75, 100, 125)
      ctx.fillStyle = '#93c5fd'
      ctx.fillRect(350, 25, 100, 175)
    }
  }

  // Mock booking trends chart
  if (bookingChart.value) {
    const ctx = bookingChart.value.getContext('2d')
    if (ctx) {
      // Simple pie chart representation
      ctx.beginPath()
      ctx.arc(200, 100, 80, 0, Math.PI * 2)
      ctx.fillStyle = '#3b82f6'
      ctx.fill()
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
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

const viewBooking = (booking: any) => {
  // Navigate to booking details
  console.log('View booking:', booking.id)
}

const approveBooking = async (booking: any) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking.id)

    if (error) throw error

    // Update local state
    booking.status = 'confirmed'
    
    // TODO: Send confirmation email
    alert('Booking approved successfully!')
  } catch (error) {
    console.error('Failed to approve booking:', error)
    alert('Failed to approve booking')
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

    // Update local state
    booking.status = 'cancelled'
    
    alert('Booking cancelled successfully!')
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    alert('Failed to cancel booking')
  }
}

onMounted(async () => {
  await loadDashboardData()
  await createCharts()
})
</script>

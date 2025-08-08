<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Hotel Reports
            </h1>
            <p class="text-neutral-600 dark:text-neutral-400">
              View reports and analytics for your assigned hotels
            </p>
          </div>
          <router-link
            to="/hotel-manager"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </router-link>
        </div>
      </div>

      <!-- Hotel Selection -->
      <div
        class="mb-8 bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
      >
        <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
          Select Hotel & Date Range
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            v-model="selectedHotelId"
            @change="generateReport"
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
          <input
            v-model="dateRange.start"
            type="date"
            class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-model="dateRange.end"
            type="date"
            class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="flex space-x-2">
            <button
              @click="generateReport"
              :disabled="!selectedHotelId || loading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              {{ loading ? 'Loading...' : 'Generate' }}
            </button>
            <button
              @click="exportReport"
              :disabled="!selectedHotelId || !reportData.bookings.length"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedHotelId && reportData.bookings.length > 0">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Bookings
                </p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ reportData.summary.totalBookings }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <svg
                  class="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Revenue
                </p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  ${{ reportData.summary.totalRevenue.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <svg
                  class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Avg. Daily Rate
                </p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  ${{ reportData.summary.avgDailyRate }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <svg
                  class="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Occupancy Rate
                </p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ reportData.summary.occupancyRate }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Revenue Chart -->
          <div
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              Daily Revenue
            </h3>
            <div
              class="h-64 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg"
            >
              <div class="text-center">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p class="mt-2 text-sm text-neutral-500">Chart will be displayed here</p>
              </div>
            </div>
          </div>

          <!-- Booking Status Chart -->
          <div
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              Booking Status Distribution
            </h3>
            <div class="h-64">
              <div class="space-y-3">
                <div
                  v-for="status in reportData.summary.statusBreakdown"
                  :key="status.name"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <div
                      :class="getStatusColorClass(status.name)"
                      class="w-4 h-4 rounded-full mr-3"
                    ></div>
                    <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{{
                      status.name
                    }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm text-neutral-600 dark:text-neutral-400 mr-2">{{
                      status.count
                    }}</span>
                    <div class="w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        :class="getStatusColorClass(status.name)"
                        class="h-2 rounded-full"
                        :style="`width: ${status.percentage}%`"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Room Performance Table -->
        <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-8"
        >
          <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Room Performance
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead class="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Room Type
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Bookings
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Revenue
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Avg. Rate
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Occupancy
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700"
              >
                <tr
                  v-for="room in reportData.summary.roomPerformance"
                  :key="room.type"
                  class="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100"
                  >
                    {{ room.type }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    {{ room.bookings }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    ${{ room.revenue.toLocaleString() }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100"
                  >
                    ${{ room.avgRate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mr-2">
                        <div
                          class="bg-blue-600 h-2 rounded-full"
                          :style="`width: ${room.occupancy}%`"
                        ></div>
                      </div>
                      <span class="text-sm text-neutral-900 dark:text-neutral-100"
                        >{{ room.occupancy }}%</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="selectedHotelId && !loading && reportData.bookings.length === 0"
        class="text-center py-12"
      >
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
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          No data available
        </h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          No bookings found for the selected date range.
        </p>
      </div>

      <!-- Select Hotel State -->
      <div v-else-if="!selectedHotelId" class="text-center py-12">
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
          Select a hotel
        </h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Choose a hotel and date range to generate reports.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const authStore = useAuthStore()

// State
const selectedHotelId = ref('')
const loading = ref(false)
const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
  end: new Date().toISOString().split('T')[0], // today
})

const reportData = ref({
  bookings: [] as any[],
  summary: {
    totalBookings: 0,
    totalRevenue: 0,
    avgDailyRate: 0,
    occupancyRate: 0,
    statusBreakdown: [] as any[],
    roomPerformance: [] as any[],
  },
})

// Methods
const generateReport = async () => {
  if (!selectedHotelId.value) return

  loading.value = true
  try {
    // Fetch bookings for the selected hotel and date range
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        room:rooms(*)
      `,
      )
      .eq('hotel_id', selectedHotelId.value)
      .gte('created_at', dateRange.value.start)
      .lte('created_at', dateRange.value.end + 'T23:59:59')
      .order('created_at', { ascending: false })

    if (error) throw error

    reportData.value.bookings = bookings || []
    calculateSummary()
  } catch (error) {
    console.error('Error generating report:', error)
  } finally {
    loading.value = false
  }
}

const calculateSummary = () => {
  const bookings = reportData.value.bookings

  // Basic metrics
  reportData.value.summary.totalBookings = bookings.length
  reportData.value.summary.totalRevenue = bookings.reduce((sum, b) => sum + (b.final_price || 0), 0)
  reportData.value.summary.avgDailyRate =
    bookings.length > 0 ? Math.round(reportData.value.summary.totalRevenue / bookings.length) : 0

  // Status breakdown
  const statusCounts = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalBookings = bookings.length
  reportData.value.summary.statusBreakdown = Object.entries(statusCounts).map(
    ([status, count]) => ({
      name: status,
      count,
      percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
    }),
  )

  // Room performance
  const roomStats = bookings.reduce(
    (acc, booking) => {
      const roomType = booking.room?.type || 'Unknown'
      if (!acc[roomType]) {
        acc[roomType] = { bookings: 0, revenue: 0, rates: [] }
      }
      acc[roomType].bookings++
      acc[roomType].revenue += booking.final_price || 0
      acc[roomType].rates.push(booking.final_price || 0)
      return acc
    },
    {} as Record<string, any>,
  )

  reportData.value.summary.roomPerformance = Object.entries(roomStats).map(([type, stats]) => ({
    type,
    bookings: stats.bookings,
    revenue: stats.revenue,
    avgRate: stats.rates.length > 0 ? Math.round(stats.revenue / stats.rates.length) : 0,
    occupancy: Math.floor(Math.random() * 100), // Mock occupancy
  }))

  // Mock occupancy rate
  reportData.value.summary.occupancyRate = Math.floor(Math.random() * 100)
}

const exportReport = () => {
  const headers = ['Date', 'Booking ID', 'Guest Name', 'Room Type', 'Status', 'Amount']
  const csvData = reportData.value.bookings.map((booking) => [
    new Date(booking.created_at).toLocaleDateString(),
    booking.id,
    `${booking.guest_info?.firstName} ${booking.guest_info?.lastName}`,
    booking.room?.type || 'N/A',
    booking.status,
    booking.final_price,
  ])

  const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `hotel-report-${selectedHotelId.value}-${dateRange.value.start}-${dateRange.value.end}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const getStatusColorClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-500',
    cancelled: 'bg-red-500',
    completed: 'bg-blue-500',
  }
  return classes[status as keyof typeof classes] || 'bg-gray-500'
}

// Lifecycle
onMounted(async () => {
  await authStore.fetchHotelAssignments()

  // Auto-select hotel from query parameter
  const hotelParam = route.query.hotel as string
  if (hotelParam && authStore.hotelAssignments.some((a) => a.hotel.id.toString() === hotelParam)) {
    selectedHotelId.value = hotelParam
    await generateReport()
  }
})
</script>

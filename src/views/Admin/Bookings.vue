<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Booking Management
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400">Monitor and manage all hotel bookings</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/20"
              >
                <svg
                  class="h-5 w-5 text-blue-600 dark:text-blue-400"
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
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                  Total Bookings
                </dt>
                <dd class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ stats.total }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-8 w-8 rounded-md bg-yellow-100 dark:bg-yellow-900/20"
              >
                <svg
                  class="h-5 w-5 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                  Pending
                </dt>
                <dd class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ stats.pending }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-900/20"
              >
                <svg
                  class="h-5 w-5 text-green-600 dark:text-green-400"
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
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                  Confirmed
                </dt>
                <dd class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ stats.confirmed }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 border border-neutral-200 dark:border-neutral-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-900/20"
              >
                <svg
                  class="h-5 w-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                  Revenue
                </dt>
                <dd class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  ${{ stats.revenue.toLocaleString() }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 mb-8 border border-neutral-200 dark:border-neutral-700"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Search
            </label>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search by booking ID, guest name, or email"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Status
            </label>
            <select
              v-model="statusFilter"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Payment Status
            </label>
            <select
              v-model="paymentFilter"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Date Range
            </label>
            <select
              v-model="dateFilter"
              class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            @click="clearFilters"
            class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
          <button
            @click="exportBookings"
            class="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            Export CSV
          </button>
        </div>
      </div>

      <!-- Bookings Table -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700"
      >
        <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Bookings ({{ filteredBookings.length }})
          </h3>
        </div>

        <div class="overflow-hidden">
          <div v-if="loading" class="p-8 text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"
            ></div>
            <p class="mt-2 text-neutral-600 dark:text-neutral-400">Loading bookings...</p>
          </div>

          <div v-else-if="filteredBookings.length === 0" class="p-8 text-center">
            <p class="text-neutral-600 dark:text-neutral-400">No bookings found.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead class="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Booking Details
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Guest Information
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    Hotel & Room
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
                  v-for="booking in paginatedBookings"
                  :key="booking.id"
                  class="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      #{{ booking.id.slice(0, 8).toUpperCase() }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ formatDate(booking.created_at) }}
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {{ booking.guest_info?.name || 'Unknown' }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ booking.guest_info?.email }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ booking.guest_info?.phone }}
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {{ booking.hotel?.name || 'Unknown Hotel' }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ booking.room?.type || 'Unknown Room' }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-neutral-900 dark:text-neutral-100">
                      <strong>In:</strong> {{ formatDate(booking.check_in) }}
                    </div>
                    <div class="text-sm text-neutral-900 dark:text-neutral-100">
                      <strong>Out:</strong> {{ formatDate(booking.check_out) }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400">
                      {{ booking.nights }} {{ booking.nights === 1 ? 'night' : 'nights' }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col gap-1">
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusBadgeClass(booking.status)"
                      >
                        {{ getStatusLabel(booking.status) }}
                      </span>
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getPaymentStatusBadgeClass(booking.payment_status)"
                      >
                        {{ getPaymentStatusLabel(booking.payment_status) }}
                      </span>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      ${{ booking.final_price?.toFixed(2) }}
                    </div>
                    <div
                      v-if="booking.discount_amount > 0"
                      class="text-sm text-green-600 dark:text-green-400"
                    >
                      -${{ booking.discount_amount.toFixed(2) }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex flex-col gap-1">
                      <button
                        @click="viewBooking(booking)"
                        class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        View Details
                      </button>
                      <button
                        @click="approveBooking(booking)"
                        v-if="booking.status === 'pending'"
                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        Approve
                      </button>
                      <button
                        @click="cancelBooking(booking)"
                        v-if="['pending', 'confirmed'].includes(booking.status)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-left"
                      >
                        Cancel
                      </button>
                      <button
                        @click="sendConfirmationEmail(booking)"
                        v-if="booking.status === 'confirmed'"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        Send Email
                      </button>
                      <button
                        @click="processRefund(booking)"
                        v-if="
                          booking.payment_status === 'paid' &&
                          ['cancelled', 'no_show'].includes(booking.status)
                        "
                        class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 text-left"
                      >
                        Refund
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredBookings.length > pageSize"
          class="px-6 py-3 bg-neutral-50 dark:bg-neutral-700 border-t border-neutral-200 dark:border-neutral-600"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-neutral-700 dark:text-neutral-300">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to
              {{ Math.min(currentPage * pageSize, filteredBookings.length) }} of
              {{ filteredBookings.length }} bookings
            </div>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-600"
              >
                Previous
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage >= totalPages"
                class="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Details Modal -->
      <div
        v-if="selectedBooking"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Booking Details - #{{ selectedBooking.id.slice(0, 8).toUpperCase() }}
              </h3>
              <button
                @click="selectedBooking = null"
                class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Guest Information -->
              <div>
                <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Guest Information
                </h4>
                <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 space-y-2">
                  <div><strong>Name:</strong> {{ selectedBooking.guest_info?.name }}</div>
                  <div><strong>Email:</strong> {{ selectedBooking.guest_info?.email }}</div>
                  <div><strong>Phone:</strong> {{ selectedBooking.guest_info?.phone }}</div>
                  <div v-if="selectedBooking.special_requests">
                    <strong>Special Requests:</strong> {{ selectedBooking.special_requests }}
                  </div>
                </div>
              </div>

              <!-- Booking Information -->
              <div>
                <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Booking Information
                </h4>
                <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 space-y-2">
                  <div><strong>Hotel:</strong> {{ selectedBooking.hotel?.name }}</div>
                  <div><strong>Room:</strong> {{ selectedBooking.room?.type }}</div>
                  <div><strong>Check-in:</strong> {{ formatDate(selectedBooking.check_in) }}</div>
                  <div><strong>Check-out:</strong> {{ formatDate(selectedBooking.check_out) }}</div>
                  <div><strong>Guests:</strong> {{ selectedBooking.guests }}</div>
                  <div><strong>Nights:</strong> {{ selectedBooking.nights }}</div>
                </div>
              </div>

              <!-- Payment Information -->
              <div>
                <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Payment Information
                </h4>
                <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 space-y-2">
                  <div><strong>Total:</strong> ${{ selectedBooking.total_price?.toFixed(2) }}</div>
                  <div v-if="selectedBooking.discount_amount > 0">
                    <strong>Discount:</strong> -${{ selectedBooking.discount_amount.toFixed(2) }}
                  </div>
                  <div>
                    <strong>Final Amount:</strong> ${{ selectedBooking.final_price?.toFixed(2) }}
                  </div>
                  <div>
                    <strong>Payment Status:</strong>
                    {{ getPaymentStatusLabel(selectedBooking.payment_status) }}
                  </div>
                  <div v-if="selectedBooking.payment_id">
                    <strong>Payment ID:</strong> {{ selectedBooking.payment_id }}
                  </div>
                </div>
              </div>

              <!-- Status & Actions -->
              <div>
                <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Status & Actions
                </h4>
                <div class="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 space-y-3">
                  <div><strong>Status:</strong> {{ getStatusLabel(selectedBooking.status) }}</div>
                  <div><strong>Created:</strong> {{ formatDate(selectedBooking.created_at) }}</div>

                  <div class="flex flex-wrap gap-2 pt-2">
                    <button
                      @click="approveBooking(selectedBooking)"
                      v-if="selectedBooking.status === 'pending'"
                      class="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      @click="cancelBooking(selectedBooking)"
                      v-if="['pending', 'confirmed'].includes(selectedBooking.status)"
                      class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      @click="sendConfirmationEmail(selectedBooking)"
                      class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
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
import { supabase } from '@/lib/supabase'
import { useNotificationStore } from '@/stores/notification'
import { logger } from '@/utils/logger'

const notificationStore = useNotificationStore()
const loading = ref(true)
const bookings = ref<any[]>([])
const selectedBooking = ref<any>(null)
const searchTerm = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const pageSize = 20

const stats = ref({
  total: 0,
  pending: 0,
  confirmed: 0,
  revenue: 0,
})

const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (booking) =>
        booking.id.toLowerCase().includes(search) ||
        booking.guest_info?.name?.toLowerCase().includes(search) ||
        booking.guest_info?.email?.toLowerCase().includes(search),
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((booking) => booking.status === statusFilter.value)
  }

  if (paymentFilter.value) {
    filtered = filtered.filter((booking) => booking.payment_status === paymentFilter.value)
  }

  if (dateFilter.value) {
    const now = new Date()
    switch (dateFilter.value) {
      case 'today':
        filtered = filtered.filter(
          (booking) => new Date(booking.check_in).toDateString() === now.toDateString(),
        )
        break
      case 'week':
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(
          (booking) =>
            new Date(booking.check_in) >= now && new Date(booking.check_in) <= weekFromNow,
        )
        break
      case 'month':
        filtered = filtered.filter(
          (booking) =>
            new Date(booking.check_in).getMonth() === now.getMonth() &&
            new Date(booking.check_in).getFullYear() === now.getFullYear(),
        )
        break
      case 'upcoming':
        filtered = filtered.filter((booking) => new Date(booking.check_in) > now)
        break
    }
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / pageSize))

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredBookings.value.slice(start, end)
})

const loadBookings = async () => {
  try {
    loading.value = true

    const { data, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        hotel:hotels(*),
        room:rooms(*)
      `,
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    bookings.value = data || []
    calculateStats()
  } catch (error) {
    logger.error('Failed to load bookings', { error })
    const errorMessage = error instanceof Error ? error.message : 'Failed to load bookings'
    notificationStore.error(errorMessage, 'Bookings Loading Error')
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  stats.value = {
    total: bookings.value.length,
    pending: bookings.value.filter((b) => b.status === 'pending').length,
    confirmed: bookings.value.filter((b) => b.status === 'confirmed').length,
    revenue: bookings.value
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.final_price || 0), 0),
  }
}

const clearFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  paymentFilter.value = ''
  dateFilter.value = ''
  currentPage.value = 1
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
    no_show: 'No Show',
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Payment Pending',
    paid: 'Paid',
    failed: 'Payment Failed',
    refunded: 'Refunded',
    partial_refund: 'Partially Refunded',
  }
  return labels[status] || status
}

const getPaymentStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    partial_refund: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const viewBooking = (booking: any) => {
  selectedBooking.value = booking
}

const approveBooking = async (booking: any) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking.id)

    if (error) throw error

    booking.status = 'confirmed'
    calculateStats()
    alert('Booking approved successfully!')
  } catch (error) {
    logger.error('Failed to approve booking', { error, bookingId })
    const errorMessage = error instanceof Error ? error.message : 'Failed to approve booking'
    notificationStore.error(errorMessage, 'Booking Approval Error')
  }
}

const cancelBooking = async (booking: any) => {
  const reason = prompt('Please provide a cancellation reason:')
  if (!reason) return

  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
      })
      .eq('id', booking.id)

    if (error) throw error

    booking.status = 'cancelled'
    booking.cancellation_reason = reason
    calculateStats()
    alert('Booking cancelled successfully!')
  } catch (error) {
    logger.error('Failed to cancel booking', { error, bookingId })
    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking'
    notificationStore.error(errorMessage, 'Booking Cancellation Error')
  }
}

const sendConfirmationEmail = (booking: any) => {
  // TODO: Integrate with email service
  alert(`Confirmation email would be sent to ${booking.guest_info?.email}`)
}

const processRefund = async (booking: any) => {
  const amount = prompt(`Enter refund amount (max: $${booking.final_price}):`)
  if (!amount || isNaN(Number(amount))) return

  try {
    const refundAmount = Number(amount)
    const newStatus = refundAmount >= booking.final_price ? 'refunded' : 'partial_refund'

    const { error } = await supabase
      .from('bookings')
      .update({ payment_status: newStatus })
      .eq('id', booking.id)

    if (error) throw error

    booking.payment_status = newStatus
    alert(`Refund of $${refundAmount} processed successfully!`)
  } catch (error) {
    logger.error('Failed to process refund', { error, bookingId })
    const errorMessage = error instanceof Error ? error.message : 'Failed to process refund'
    notificationStore.error(errorMessage, 'Refund Processing Error')
  }
}

const exportBookings = () => {
  // Create CSV content
  const headers = [
    'Booking ID',
    'Guest Name',
    'Email',
    'Hotel',
    'Check-in',
    'Check-out',
    'Status',
    'Payment Status',
    'Amount',
  ]
  const csvContent = [
    headers.join(','),
    ...filteredBookings.value.map((booking) =>
      [
        booking.id,
        booking.guest_info?.name || '',
        booking.guest_info?.email || '',
        booking.hotel?.name || '',
        booking.check_in,
        booking.check_out,
        booking.status,
        booking.payment_status,
        booking.final_price,
      ].join(','),
    ),
  ].join('\n')

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

onMounted(() => {
  loadBookings()
})
</script>

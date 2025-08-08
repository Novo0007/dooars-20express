<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Room Management</h1>
        <p class="text-gray-600 mt-2">Manage room categories, pricing, and availability</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="testConnection"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Test DB
        </button>
        <button
          @click="testErrorHandling"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
          Test Errors
        </button>
        <button
          @click="openCreateModal"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add Room Type
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Rooms</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalRooms }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Available</p>
            <p class="text-2xl font-semibold text-gray-900">{{ availableRooms }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg. Price</p>
            <p class="text-2xl font-semibold text-gray-900">${{ averagePrice }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Occupancy</p>
            <p class="text-2xl font-semibold text-gray-900">{{ occupancyRate }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search rooms..."
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hotel</label>
          <select
            v-model="selectedHotel"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Hotels</option>
            <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
              {{ hotel.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="selectedCategory"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Family">Family</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Rooms Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Room Details
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hotel
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amenities
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="room in filteredRooms" :key="room.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    v-if="room.image_url"
                    :src="room.image_url"
                    :alt="room.name"
                    class="h-10 w-10 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ room.type }}</div>
                    <div class="text-sm text-gray-500">
                      {{ room.description || 'No description' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getHotelName(room.hotel_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getCategoryClass(room.type)"
                >
                  {{ room.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ room.price }}/night
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(room.is_active)"
                >
                  {{ room.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="amenity in room.amenities?.slice(0, 3)"
                    :key="amenity"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ amenity }}
                  </span>
                  <span
                    v-if="room.amenities?.length > 3"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    +{{ room.amenities.length - 3 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="editRoom(room)" class="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                  <button
                    @click="toggleRoomStatus(room)"
                    class="text-green-600 hover:text-green-900"
                  >
                    {{ room.is_active ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button @click="deleteRoom(room.id)" class="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{ Math.min(currentPage * itemsPerPage, filteredRooms.length) }} of
              {{ filteredRooms.length }} results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditing ? 'Edit Room' : 'Add New Room' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveRoom" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <input
                  v-model="roomForm.type"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Single, Double, Suite, etc."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Price per Night ($)</label
                >
                <input
                  v-model.number="roomForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
                <select
                  v-model="roomForm.hotel_id"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Hotel</option>
                  <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
                    {{ hotel.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                <input
                  v-model.number="roomForm.max_guests"
                  type="number"
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Available Count</label>
                <input
                  v-model.number="roomForm.available_count"
                  type="number"
                  min="0"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  v-model="roomForm.is_active"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="roomForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Room description..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label
                  v-for="amenity in availableAmenities"
                  :key="amenity"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    :value="amenity"
                    v-model="roomForm.amenities"
                    class="mr-2 rounded"
                  />
                  <span class="text-sm text-gray-700">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : isEditing ? 'Update Room' : 'Create Room' }}
              </button>
            </div>
          </form>
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
import { testDatabaseConnection, testRoomsQuery } from '@/utils/dbConnectionTest'
import { runAllErrorTests } from '@/utils/errorTestUtils'

// State
const rooms = ref<any[]>([])
const hotels = ref<any[]>([])
const loading = ref(false)
const notificationStore = useNotificationStore()
const showModal = ref(false)
const isEditing = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const searchQuery = ref('')
const selectedHotel = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

// Form
const roomForm = ref({
  id: null,
  type: '',
  hotel_id: '',
  price: 0,
  max_guests: 1,
  available_count: 1,
  is_active: true,
  description: '',
  amenities: [] as string[],
})

const availableAmenities = [
  'Wi-Fi',
  'Air Conditioning',
  'TV',
  'Mini Bar',
  'Room Service',
  'Balcony',
  'Ocean View',
  'City View',
  'Bathtub',
  'Shower',
  'Safe',
  'Coffee Maker',
  'Refrigerator',
  'Desk',
  'Sofa',
  'Wardrobe',
]

// Computed
const filteredRooms = computed(() => {
  let filtered = rooms.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (room) =>
        room.type?.toLowerCase().includes(query) ||
        room.description?.toLowerCase().includes(query) ||
        getHotelName(room.hotel_id)?.toLowerCase().includes(query),
    )
  }

  if (selectedHotel.value) {
    filtered = filtered.filter((room) => room.hotel_id === selectedHotel.value)
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((room) => room.type === selectedCategory.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter((room) => {
      if (selectedStatus.value === 'active') return room.is_active
      if (selectedStatus.value === 'inactive') return !room.is_active
      return true
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredRooms.value.length / itemsPerPage.value))

const totalRooms = computed(() => rooms.value.length)
const availableRooms = computed(() => rooms.value.filter((room) => room.is_active).length)
const averagePrice = computed(() => {
  if (rooms.value.length === 0) return 0
  const total = rooms.value.reduce((sum, room) => sum + (room.price || 0), 0)
  return Math.round(total / rooms.value.length)
})
const occupancyRate = computed(() => {
  if (totalRooms.value === 0) return 0
  const totalAvailable = rooms.value.reduce((sum, room) => sum + (room.available_count || 0), 0)
  const totalCapacity = rooms.value.length * 10 // Assume average capacity
  return Math.round(Math.random() * 100) // Mock calculation for now
})

// Methods
const testErrorHandling = () => {
  notificationStore.info('Running error handling tests...', 'Error Test')

  try {
    const allPassed = runAllErrorTests()

    if (allPassed) {
      notificationStore.success(
        'All error handling tests passed! No [object Object] errors detected.',
        'Error Test Successful'
      )
    } else {
      notificationStore.warning(
        'Some error handling tests failed. Check console for details.',
        'Error Test Warning'
      )
    }
  } catch (error) {
    logger.error('Error test execution failed', { error })
    const errorMessage = error instanceof Error ? error.message : 'Error test failed'
    notificationStore.error(errorMessage, 'Error Test Failed')
  }
}

const testConnection = async () => {
  notificationStore.info('Testing database connection...', 'Database Test')

  try {
    const result = await testDatabaseConnection()
    const roomsTest = await testRoomsQuery()

    logger.info('Database test results', { connectionTest: result, roomsTest })

    if (result.connected && result.tablesAccessible && roomsTest.success) {
      notificationStore.success(
        `Connected! Hotels: ${result.hotelsCount}, Rooms: ${result.roomsCount}`,
        'Database Test Successful',
      )
    } else {
      const allErrors = [...result.errors]
      if (roomsTest.error) {
        const errorMessage = typeof roomsTest.error === 'string' ? roomsTest.error : 'Rooms query failed'
        allErrors.push(errorMessage)
      }
      notificationStore.error(`Issues found: ${allErrors.join('; ')}`, 'Database Test Failed')
    }
  } catch (error) {
    logger.error('Database test exception', { error })
    const errorMessage = error instanceof Error ? error.message : 'Database test failed'
    notificationStore.error(errorMessage, 'Database Test Error')
  }
}

const fetchRooms = async () => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    rooms.value = data || []
  } catch (error) {
    logger.error('Error fetching rooms', { error })
    const errorMessage = error instanceof Error ? error.message : 'Failed to load rooms'
    notificationStore.error(errorMessage, 'Rooms Loading Error')
  }
}

const fetchHotels = async () => {
  try {
    const { data, error } = await supabase.from('hotels').select('id, name').order('name')

    if (error) throw error
    hotels.value = data || []
  } catch (error) {
    logger.error('Error fetching hotels', { error })
    const errorMessage = error instanceof Error ? error.message : 'Failed to load hotels'
    notificationStore.error(errorMessage, 'Hotels Loading Error')
  }
}

const openCreateModal = () => {
  isEditing.value = false
  roomForm.value = {
    id: null,
    type: '',
    hotel_id: '',
    price: 0,
    max_guests: 1,
    available_count: 1,
    is_active: true,
    description: '',
    amenities: [],
  }
  showModal.value = true
}

const editRoom = (room: any) => {
  isEditing.value = true
  roomForm.value = { ...room, amenities: room.amenities || [] }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
}

const saveRoom = async () => {
  loading.value = true
  try {
    const { id, ...roomData } = roomForm.value

    if (isEditing.value) {
      const { error } = await supabase.from('rooms').update(roomData).eq('id', roomForm.value.id)

      if (error) throw error
      notificationStore.success('Room updated successfully')
    } else {
      const { error } = await supabase.from('rooms').insert([roomData])

      if (error) throw error
      notificationStore.success('Room created successfully')
    }

    await fetchRooms()
    closeModal()
  } catch (error) {
    logger.error('Error saving room', { error, roomData: roomForm.value })
    const errorMessage = error instanceof Error ? error.message : 'Failed to save room'
    notificationStore.error(errorMessage, 'Room Save Error')
  } finally {
    loading.value = false
  }
}

const toggleRoomStatus = async (room: any) => {
  const newStatus = !room.is_active

  try {
    const { error } = await supabase
      .from('rooms')
      .update({ is_active: newStatus })
      .eq('id', room.id)

    if (error) throw error
    await fetchRooms()
    notificationStore.success(`Room ${newStatus ? 'activated' : 'deactivated'} successfully`)
  } catch (error) {
    logger.error('Error updating room status', { error, roomId: room.id, newStatus })
    const errorMessage = error instanceof Error ? error.message : 'Failed to update room status'
    notificationStore.error(errorMessage, 'Status Update Error')
  }
}

const deleteRoom = async (roomId: string) => {
  if (!confirm('Are you sure you want to delete this room?')) return

  try {
    const { error } = await supabase.from('rooms').delete().eq('id', roomId)

    if (error) throw error
    await fetchRooms()
    notificationStore.success('Room deleted successfully')
  } catch (error) {
    logger.error('Error deleting room', { error, roomId })
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete room'
    notificationStore.error(errorMessage, 'Room Deletion Error')
  }
}

const getHotelName = (hotelId: string) => {
  const hotel = hotels.value.find((h) => h.id === hotelId)
  return hotel?.name || 'Unknown Hotel'
}

const getCategoryClass = (category: string) => {
  const classes = {
    Single: 'bg-blue-100 text-blue-800',
    Double: 'bg-green-100 text-green-800',
    Suite: 'bg-purple-100 text-purple-800',
    Deluxe: 'bg-yellow-100 text-yellow-800',
    Family: 'bg-pink-100 text-pink-800',
  }
  return classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (isActive: boolean) => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Lifecycle
onMounted(() => {
  fetchRooms()
  fetchHotels()
})
</script>

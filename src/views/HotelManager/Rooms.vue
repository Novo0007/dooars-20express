<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Manage Rooms
            </h1>
            <p class="text-neutral-600 dark:text-neutral-400">
              View and manage rooms for your assigned hotels
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
          Select Hotel
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            v-model="selectedHotelId"
            @change="fetchRooms"
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
              @click="fetchRooms"
              :disabled="!selectedHotelId || loading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              {{ loading ? 'Loading...' : 'Load Rooms' }}
            </button>
            <button
              @click="openAddRoomModal"
              :disabled="!selectedHotelId"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              Add Room
            </button>
          </div>
        </div>
      </div>

      <div v-if="selectedHotelId && rooms.length > 0">
        <!-- Stats Cards -->
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Rooms
                </p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ rooms.length }}
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Available</p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ availableRooms }}
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg. Price</p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  ${{ averagePrice }}
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
                <p class="text-sm font-medium text-neutral-600 dark:text-neutral-400">Occupancy</p>
                <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ occupancyRate }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Rooms Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="room in rooms"
            :key="room.id"
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ room.type }}
                </h3>
                <span
                  :class="getStatusClass(room.is_active)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ room.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-600 dark:text-neutral-400">Price per night:</span>
                  <span class="font-medium text-neutral-900 dark:text-neutral-100"
                    >${{ room.price }}</span
                  >
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-600 dark:text-neutral-400">Max guests:</span>
                  <span class="font-medium text-neutral-900 dark:text-neutral-100">{{
                    room.max_guests
                  }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-neutral-600 dark:text-neutral-400">Available:</span>
                  <span class="font-medium text-neutral-900 dark:text-neutral-100">{{
                    room.available_count
                  }}</span>
                </div>
              </div>

              <div v-if="room.amenities && room.amenities.length > 0" class="mb-4">
                <h4 class="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Amenities
                </h4>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="amenity in room.amenities.slice(0, 3)"
                    :key="amenity"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  >
                    {{ amenity }}
                  </span>
                  <span
                    v-if="room.amenities.length > 3"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  >
                    +{{ room.amenities.length - 3 }}
                  </span>
                </div>
              </div>

              <div class="flex space-x-2">
                <button
                  @click="editRoom(room)"
                  class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="toggleRoomStatus(room)"
                  :class="
                    room.is_active
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                  "
                  class="flex-1 px-3 py-2 text-white text-sm font-medium rounded-md transition-colors"
                >
                  {{ room.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="selectedHotelId && !loading && rooms.length === 0" class="text-center py-12">
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
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          No rooms found
        </h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          This hotel has no rooms configured yet.
        </p>
        <div class="mt-6">
          <button
            @click="openAddRoomModal"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add First Room
          </button>
        </div>
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
          Choose a hotel from the dropdown above to view its rooms.
        </p>
      </div>

      <!-- Add/Edit Room Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white dark:bg-neutral-800"
        >
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {{ isEditing ? 'Edit Room' : 'Add New Room' }}
              </h3>
              <button @click="closeModal" class="text-neutral-400 hover:text-neutral-600">
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

            <form @submit.prevent="saveRoom" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >Room Type</label
                  >
                  <input
                    v-model="roomForm.type"
                    type="text"
                    required
                    class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Single, Double, Suite, etc."
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >Price per Night</label
                  >
                  <input
                    v-model.number="roomForm.price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >Max Guests</label
                  >
                  <input
                    v-model.number="roomForm.max_guests"
                    type="number"
                    min="1"
                    required
                    class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >Available Count</label
                  >
                  <input
                    v-model.number="roomForm.available_count"
                    type="number"
                    min="0"
                    required
                    class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                  >Description</label
                >
                <textarea
                  v-model="roomForm.description"
                  rows="3"
                  class="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Room description..."
                />
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ loading ? 'Saving...' : isEditing ? 'Update Room' : 'Add Room' }}
                </button>
              </div>
            </form>
          </div>
        </div>
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
const rooms = ref<any[]>([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editingRoom = ref<any>(null)

const roomForm = ref({
  type: '',
  price: 0,
  description: '',
  max_guests: 1,
  available_count: 1,
  is_active: true,
})

// Computed
const availableRooms = computed(() => rooms.value.filter((r) => r.is_active).length)
const averagePrice = computed(() => {
  if (rooms.value.length === 0) return 0
  const total = rooms.value.reduce((sum, room) => sum + (room.price || 0), 0)
  return Math.round(total / rooms.value.length)
})
const occupancyRate = computed(() => {
  // Mock occupancy calculation
  return Math.floor(Math.random() * 100)
})

// Methods
const fetchRooms = async () => {
  if (!selectedHotelId.value) return

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('hotel_id', selectedHotelId.value)
      .order('created_at', { ascending: false })

    if (error) throw error
    rooms.value = data || []
  } catch (error) {
    console.error('Error fetching rooms:', error)
  } finally {
    loading.value = false
  }
}

const openAddRoomModal = () => {
  isEditing.value = false
  editingRoom.value = null
  roomForm.value = {
    type: '',
    price: 0,
    description: '',
    max_guests: 1,
    available_count: 1,
    is_active: true,
  }
  showModal.value = true
}

const editRoom = (room: any) => {
  isEditing.value = true
  editingRoom.value = room
  roomForm.value = { ...room }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingRoom.value = null
}

const saveRoom = async () => {
  loading.value = true
  try {
    const roomData = {
      ...roomForm.value,
      hotel_id: selectedHotelId.value,
    }

    if (isEditing.value) {
      const { error } = await supabase.from('rooms').update(roomData).eq('id', editingRoom.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase.from('rooms').insert([roomData])

      if (error) throw error
    }

    await fetchRooms()
    closeModal()
  } catch (error) {
    console.error('Error saving room:', error)
    alert('Error saving room. Please try again.')
  } finally {
    loading.value = false
  }
}

const toggleRoomStatus = async (room: any) => {
  try {
    const { error } = await supabase
      .from('rooms')
      .update({ is_active: !room.is_active })
      .eq('id', room.id)

    if (error) throw error
    await fetchRooms()
  } catch (error) {
    console.error('Error updating room status:', error)
  }
}

const getStatusClass = (isActive: boolean) => {
  return isActive
    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
}

// Lifecycle
onMounted(async () => {
  await authStore.fetchHotelAssignments()

  // Auto-select hotel from query parameter
  const hotelParam = route.query.hotel as string
  if (hotelParam && authStore.hotelAssignments.some((a) => a.hotel.id.toString() === hotelParam)) {
    selectedHotelId.value = hotelParam
    await fetchRooms()
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Hotel Management
          </h1>
          <p class="text-neutral-600 dark:text-neutral-400">
            Manage hotels, rooms, amenities, and pricing
          </p>
        </div>
        <button
          @click="showAddHotelModal = true"
          class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Hotel
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search hotels..."
            class="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
        >
          <option value="">All Hotels</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      <!-- Hotels Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6 animate-pulse"
        >
          <div class="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-4"></div>
          <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
        </div>
      </div>

      <div v-else-if="filteredHotels.length === 0" class="text-center py-12">
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
          No hotels found
        </h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Get started by adding your first hotel.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="hotel in filteredHotels"
          :key="hotel.id"
          class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-medium transition-all duration-200"
        >
          <!-- Hotel Image -->
          <div class="relative h-48 overflow-hidden">
            <img
              :src="hotel.images?.[0] || '/placeholder-hotel.jpg'"
              :alt="hotel.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-4 left-4 flex gap-2">
              <span
                v-if="hotel.featured"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              >
                Featured
              </span>
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="
                  hotel.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                "
              >
                {{ hotel.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="absolute top-4 right-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-neutral-800"
              >
                ⭐ {{ hotel.rating || 0 }}
              </span>
            </div>
          </div>

          <!-- Hotel Info -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {{ hotel.name }}
              </h3>
              <span
                v-if="hotel.badge"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
              >
                {{ hotel.badge }}
              </span>
            </div>

            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex items-center">
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
              {{ hotel.location }}
            </p>

            <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
              {{ hotel.description }}
            </p>

            <!-- Amenities -->
            <div class="mb-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="amenity in (hotel.amenities || []).slice(0, 3)"
                  :key="amenity"
                  class="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {{ amenity }}
                </span>
                <span
                  v-if="(hotel.amenities || []).length > 3"
                  class="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  +{{ (hotel.amenities || []).length - 3 }} more
                </span>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span class="text-neutral-500 dark:text-neutral-400">Rooms:</span>
                <span class="ml-1 font-medium text-neutral-900 dark:text-neutral-100">{{
                  hotel.room_count || 0
                }}</span>
              </div>
              <div>
                <span class="text-neutral-500 dark:text-neutral-400">Reviews:</span>
                <span class="ml-1 font-medium text-neutral-900 dark:text-neutral-100">{{
                  hotel.review_count || 0
                }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="editHotel(hotel)"
                class="flex-1 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-primary-300 dark:border-primary-700 rounded-lg transition-colors duration-200"
              >
                Edit
              </button>
              <button
                @click="manageRooms(hotel)"
                class="flex-1 px-3 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 border border-secondary-300 dark:border-secondary-700 rounded-lg transition-colors duration-200"
              >
                Rooms
              </button>
              <button
                @click="toggleHotelStatus(hotel)"
                class="px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                :class="
                  hotel.is_active
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-300 dark:border-red-700'
                    : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-300 dark:border-green-700'
                "
              >
                {{ hotel.is_active ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Hotel Modal -->
      <div
        v-if="showAddHotelModal || editingHotel"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {{ editingHotel ? 'Edit Hotel' : 'Add New Hotel' }}
              </h3>
              <button
                @click="closeModal"
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

            <form @submit.prevent="saveHotel" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Basic Info -->
                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Hotel Name *
                  </label>
                  <input
                    v-model="hotelForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="Enter hotel name"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Location *
                  </label>
                  <input
                    v-model="hotelForm.location"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Badge
                  </label>
                  <select
                    v-model="hotelForm.badge"
                    class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="">No Badge</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Featured">Featured</option>
                    <option value="Popular">Popular</option>
                    <option value="Romantic">Romantic</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Rating
                  </label>
                  <input
                    v-model.number="hotelForm.rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  v-model="hotelForm.description"
                  rows="4"
                  class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="Enter hotel description"
                ></textarea>
              </div>

              <!-- Coordinates -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Latitude
                  </label>
                  <input
                    v-model.number="hotelForm.latitude"
                    type="number"
                    step="any"
                    class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="0.000000"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                  >
                    Longitude
                  </label>
                  <input
                    v-model.number="hotelForm.longitude"
                    type="number"
                    step="any"
                    class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="0.000000"
                  />
                </div>
              </div>

              <!-- Amenities -->
              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Amenities
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <label
                    v-for="amenity in availableAmenities"
                    :key="amenity"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      :value="amenity"
                      v-model="hotelForm.amenities"
                      class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">{{
                      amenity
                    }}</span>
                  </label>
                </div>
              </div>

              <!-- Images -->
              <div>
                <label
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Image URLs (one per line)
                </label>
                <textarea
                  v-model="imageUrls"
                  rows="4"
                  class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                ></textarea>
              </div>

              <!-- Status Toggles -->
              <div class="flex gap-6">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="hotelForm.is_active"
                    class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Active</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="hotelForm.featured"
                    class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">Featured</span>
                </label>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-6">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  <span v-if="saving">Saving...</span>
                  <span v-else>{{ editingHotel ? 'Update Hotel' : 'Create Hotel' }}</span>
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
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const hotels = ref<any[]>([])
const searchTerm = ref('')
const statusFilter = ref('')
const showAddHotelModal = ref(false)
const editingHotel = ref<any>(null)
const imageUrls = ref('')

const hotelForm = ref({
  name: '',
  location: '',
  description: '',
  latitude: null as number | null,
  longitude: null as number | null,
  rating: null as number | null,
  badge: '',
  amenities: [] as string[],
  is_active: true,
  featured: false,
})

const availableAmenities = [
  'WiFi',
  'Pool',
  'Spa',
  'Gym',
  'Restaurant',
  'Bar',
  'Room Service',
  'Parking',
  'Pet Friendly',
  'Business Center',
  'Concierge',
  'Laundry',
  'Airport Shuttle',
  'Beach Access',
  'Tennis Court',
  'Golf Course',
  'Skiing',
  'Hiking Trails',
]

const filteredHotels = computed(() => {
  let filtered = hotels.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(search) || hotel.location.toLowerCase().includes(search),
    )
  }

  if (statusFilter.value) {
    switch (statusFilter.value) {
      case 'active':
        filtered = filtered.filter((hotel) => hotel.is_active)
        break
      case 'inactive':
        filtered = filtered.filter((hotel) => !hotel.is_active)
        break
      case 'featured':
        filtered = filtered.filter((hotel) => hotel.featured)
        break
    }
  }

  return filtered
})

const loadHotels = async () => {
  try {
    loading.value = true

    const { data, error } = await supabase
      .from('hotels')
      .select(
        `
        *,
        room_count:rooms(count),
        review_count:reviews(count)
      `,
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    hotels.value = data || []
  } catch (error) {
    console.error('Failed to load hotels:', error)
  } finally {
    loading.value = false
  }
}

const editHotel = (hotel: any) => {
  editingHotel.value = hotel
  hotelForm.value = {
    name: hotel.name || '',
    location: hotel.location || '',
    description: hotel.description || '',
    latitude: hotel.latitude,
    longitude: hotel.longitude,
    rating: hotel.rating,
    badge: hotel.badge || '',
    amenities: hotel.amenities || [],
    is_active: hotel.is_active,
    featured: hotel.featured,
  }
  imageUrls.value = (hotel.images || []).join('\n')
}

const closeModal = () => {
  showAddHotelModal.value = false
  editingHotel.value = null
  hotelForm.value = {
    name: '',
    location: '',
    description: '',
    latitude: null,
    longitude: null,
    rating: null,
    badge: '',
    amenities: [],
    is_active: true,
    featured: false,
  }
  imageUrls.value = ''
}

const saveHotel = async () => {
  // Validate required fields
  if (!hotelForm.value.name?.trim() || !hotelForm.value.location?.trim()) {
    notificationStore.error('Please fill in all required fields (Name and Location)')
    return
  }

  try {
    saving.value = true
    console.log('Saving hotel with data:', hotelForm.value)

    const hotelData = {
      name: hotelForm.value.name.trim(),
      location: hotelForm.value.location.trim(),
      description: hotelForm.value.description?.trim() || '',
      latitude: Number(hotelForm.value.latitude) || 0,
      longitude: Number(hotelForm.value.longitude) || 0,
      rating: Number(hotelForm.value.rating) || 4.0,
      badge: hotelForm.value.badge || 'Featured',
      amenities: hotelForm.value.amenities || [],
      images: imageUrls.value.split('\n').filter((url) => url.trim()).map(url => url.trim()),
      is_active: true,
      updated_at: new Date().toISOString()
    }

    if (editingHotel.value) {
      // Update existing hotel
      const { error } = await supabase
        .from('hotels')
        .update(hotelData)
        .eq('id', editingHotel.value.id)

      if (error) throw error

      // Update local state
      const index = hotels.value.findIndex((h) => h.id === editingHotel.value.id)
      if (index !== -1) {
        hotels.value[index] = { ...editingHotel.value, ...hotelData }
      }
    } else {
      // Create new hotel
      const { data, error } = await supabase.from('hotels').insert([hotelData]).select().single()

      if (error) throw error

      hotels.value.unshift(data)
    }

    closeModal()
    notificationStore.success(`Hotel ${editingHotel.value ? 'updated' : 'created'} successfully!`)

    // Reload hotels to ensure fresh data
    await loadHotels()
  } catch (error) {
    console.error('Failed to save hotel:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save hotel'
    notificationStore.error(`Failed to save hotel: ${errorMessage}`)
  } finally {
    saving.value = false
  }
}

const manageRooms = (hotel: any) => {
  router.push(`/admin/rooms?hotel=${hotel.id}`)
}

const toggleHotelStatus = async (hotel: any) => {
  try {
    const newStatus = !hotel.is_active

    const { error } = await supabase
      .from('hotels')
      .update({ is_active: newStatus })
      .eq('id', hotel.id)

    if (error) throw error

    hotel.is_active = newStatus

    alert(`Hotel ${newStatus ? 'activated' : 'deactivated'} successfully!`)
  } catch (error) {
    console.error('Failed to toggle hotel status:', error)
    alert('Failed to update hotel status.')
  }
}

onMounted(() => {
  loadHotels()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          My Favorite Hotels
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          Your saved hotels for future bookings
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="favoriteHotels.length === 0" class="text-center py-20">
        <svg class="mx-auto h-24 w-24 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          No favorite hotels yet
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          Start browsing hotels and save your favorites for easy access later. Click the heart icon on any hotel to add it to your favorites.
        </p>
        <router-link
          to="/search"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
        >
          Browse Hotels
        </router-link>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="hotel in favoriteHotels"
          :key="hotel.id"
          class="group bg-white dark:bg-neutral-800 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative"
          @click="goToHotel(hotel.id)"
        >
          <!-- Remove from Favorites Button -->
          <button
            @click.stop="removeFavorite(hotel.id)"
            class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            :class="{ 'animate-pulse': removingFavorites.includes(hotel.id) }"
          >
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <div class="relative overflow-hidden rounded-t-2xl">
            <img
              :src="hotel.images?.[0] || '/placeholder-hotel.jpg'"
              :alt="hotel.name"
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute top-4 left-4">
              <span class="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ hotel.badge }}
              </span>
            </div>
            <div class="absolute bottom-4 right-4">
              <span
                class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-neutral-800"
              >
                ⭐ {{ hotel.rating }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <h3
              class="font-display font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-2"
            >
              {{ hotel.name }}
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 mb-4 flex items-center">
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
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">
              {{ hotel.description }}
            </p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-lg font-bold text-primary-600 dark:text-primary-400">
                  From ${{ getLowestRoomPrice(hotel.id) }}
                </span>
                <span class="text-neutral-500 dark:text-neutral-400">/night</span>
              </div>
              <button
                class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors duration-200"
              >
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div v-if="favoriteHotels.length > 0" class="mt-12 flex justify-center">
        <button
          @click="clearAllFavorites"
          class="px-6 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg font-medium transition-colors duration-200"
        >
          Clear All Favorites
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

interface Hotel {
  id: number
  name: string
  location: string
  description: string
  rating: number
  badge: string
  images: string[]
}

interface Room {
  hotel_id: number
  price: number
}

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const favoriteHotels = ref<Hotel[]>([])
const rooms = ref<Room[]>([])
const removingFavorites = ref<number[]>([])

const fetchFavorites = async () => {
  if (!authStore.isAuthenticated) return

  try {
    loading.value = true

    // Get user's favorite hotel IDs
    const { data: favorites, error: favError } = await supabase
      .from('user_favorites')
      .select('hotel_id')
      .eq('user_id', authStore.user!.id)

    if (favError) throw favError

    if (favorites.length === 0) {
      loading.value = false
      return
    }

    const hotelIds = favorites.map(f => f.hotel_id)

    // Fetch hotel details
    const { data: hotels, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .in('id', hotelIds)
      .eq('is_active', true)

    if (hotelError) throw hotelError

    favoriteHotels.value = hotels || []

    // Fetch room prices for lowest price calculation
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('hotel_id, price')
      .in('hotel_id', hotelIds)
      .eq('is_active', true)

    if (roomError) throw roomError

    rooms.value = roomData || []
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
  } finally {
    loading.value = false
  }
}

const removeFavorite = async (hotelId: number) => {
  if (!authStore.isAuthenticated) return

  try {
    removingFavorites.value.push(hotelId)

    await authStore.removeFavoriteHotel(hotelId)
    
    // Remove from local state
    favoriteHotels.value = favoriteHotels.value.filter(hotel => hotel.id !== hotelId)
  } catch (error) {
    console.error('Failed to remove favorite:', error)
  } finally {
    removingFavorites.value = removingFavorites.value.filter(id => id !== hotelId)
  }
}

const clearAllFavorites = async () => {
  if (!authStore.isAuthenticated) return
  
  if (!confirm('Are you sure you want to remove all hotels from your favorites?')) {
    return
  }

  try {
    loading.value = true

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', authStore.user!.id)

    if (error) throw error

    favoriteHotels.value = []
  } catch (error) {
    console.error('Failed to clear favorites:', error)
  } finally {
    loading.value = false
  }
}

const getLowestRoomPrice = (hotelId: number): number => {
  const hotelRooms = rooms.value.filter(room => room.hotel_id === hotelId)
  if (hotelRooms.length === 0) return 0
  return Math.min(...hotelRooms.map(room => room.price))
}

const goToHotel = (id: number) => {
  router.push(`/hotel/${id}`)
}

onMounted(() => {
  fetchFavorites()
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

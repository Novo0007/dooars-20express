<template>
  <div class="min-h-screen">
    <!-- Modern Hero Section with Search -->
    <section
      class="relative bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 overflow-hidden"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0 opacity-20">
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-600/10 animate-pulse"
        ></div>
        <svg
          class="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: rgba(255, 255, 255, 0.1); stop-opacity: 1" />
              <stop offset="100%" style="stop-color: rgba(255, 255, 255, 0.05); stop-opacity: 1" />
            </linearGradient>
            <pattern id="modern-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="url(#grid-gradient)"
                stroke-width="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#modern-grid)" />
        </svg>
      </div>

      <!-- Floating Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float"
        ></div>
        <div
          class="absolute top-40 right-32 w-24 h-24 bg-purple-300/10 rounded-full blur-lg animate-float-delayed"
        ></div>
        <div
          class="absolute bottom-32 left-1/3 w-40 h-40 bg-blue-300/5 rounded-full blur-2xl animate-float-slow"
        ></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center mb-12">
          <h1 class="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span
              class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            >
              Stay
            </span>
          </h1>
          <p class="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover amazing hotels in India with the best prices, verified reviews, and instant
            booking
          </p>

          <!-- Trust Indicators -->
          <div class="flex items-center justify-center gap-6 mb-12 text-blue-100">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">{{ totalHotels }}+ Hotels</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="text-sm font-medium">Verified Reviews</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-sm font-medium">Secure Booking</span>
            </div>
          </div>
        </div>

        <!-- Modern Search Form -->
        <div class="max-w-5xl mx-auto">
          <div
            class="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
          >
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <!-- Destination -->
              <div class="lg:col-span-2">
                <label class="block text-sm font-semibold text-white mb-3">Where to?</label>
                <div class="relative">
                  <input
                    v-model="searchForm.destination"
                    type="text"
                    placeholder="City, landmark, or hotel name..."
                    class="w-full px-5 py-4 bg-white/90 border-0 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white text-gray-800 placeholder-gray-500 text-lg transition-all duration-200"
                  />
                  <svg
                    class="absolute right-4 top-4 w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                </div>
              </div>

              <!-- Check-in -->
              <div>
                <label class="block text-sm font-semibold text-white mb-3">Check-in</label>
                <input
                  v-model="searchForm.checkIn"
                  type="date"
                  :min="today"
                  class="w-full px-5 py-4 bg-white/90 border-0 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white text-gray-800 text-lg transition-all duration-200"
                />
              </div>

              <!-- Check-out -->
              <div>
                <label class="block text-sm font-semibold text-white mb-3">Check-out</label>
                <input
                  v-model="searchForm.checkOut"
                  type="date"
                  :min="searchForm.checkIn || today"
                  class="w-full px-5 py-4 bg-white/90 border-0 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white text-gray-800 text-lg transition-all duration-200"
                />
              </div>

              <!-- Search Button -->
              <div class="flex items-end">
                <button
                  @click="handleSearch"
                  :disabled="isSearching"
                  class="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                >
                  <span v-if="isSearching" class="flex items-center justify-center">
                    <svg
                      class="animate-spin w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Searching...
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search Hotels
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Hotels Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Hotels
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Handpicked accommodations offering exceptional experiences across India
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loadingHotels" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-300 dark:bg-gray-700 rounded-2xl h-64 mb-4"></div>
            <div class="bg-gray-300 dark:bg-gray-700 rounded h-4 mb-2"></div>
            <div class="bg-gray-300 dark:bg-gray-700 rounded h-4 w-3/4"></div>
          </div>
        </div>

        <!-- Hotels Grid -->
        <div
          v-else-if="featuredHotels.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for="hotel in featuredHotels"
            :key="hotel.id"
            class="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
            @click="goToHotel(hotel.id)"
          >
            <div class="relative overflow-hidden">
              <img
                :src="
                  hotel.images?.[0] ||
                  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
                "
                :alt="hotel.name"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>

              <!-- Rating Badge -->
              <div class="absolute top-4 right-4">
                <div class="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    <span class="text-sm font-bold text-gray-800">{{ hotel.rating || '4.5' }}</span>
                  </div>
                </div>
              </div>

              <!-- Category Badge -->
              <div class="absolute top-4 left-4">
                <span
                  class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                >
                  {{ hotel.badge || 'Featured' }}
                </span>
              </div>
            </div>

            <div class="p-6">
              <h3
                class="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
              >
                {{ hotel.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                <svg
                  class="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {{ formatPricePerNight(getLowestRoomPrice(hotel)) }}
                  </span>
                  <span class="text-gray-500 dark:text-gray-400 text-sm">/night</span>
                </div>
                <button
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No hotels available
          </h3>
          <p class="text-gray-500 dark:text-gray-400">Check back later for amazing deals!</p>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-20 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose Dooars Express?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We make hotel booking simple, secure, and rewarding
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.id" class="text-center group">
            <div class="relative">
              <div
                class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="feature.icon"
                  />
                </svg>
              </div>
              <div
                class="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 mx-auto"
              ></div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { formatPrice, formatPricePerNight } from '../utils/currency'
import { useNotificationStore } from '../stores/notification'
import { useHotelStore } from '../stores/hotel'
import { runFullDatabaseTest } from '../utils/dbTest'

const router = useRouter()
const notificationStore = useNotificationStore()
const hotelStore = useHotelStore()

// Reactive state
const featuredHotels = ref<any[]>([])
const loadingHotels = ref(true)
const isSearching = ref(false)
const totalHotels = ref(0)

// Search form
const searchForm = ref({
  destination: '',
  checkIn: '',
  checkOut: '',
})

// Get today's date for date inputs
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Features data
const features = ref([
  {
    id: 1,
    title: 'Best Price Guarantee',
    description:
      "Find the same hotel for less? We'll match the price and give you an extra 5% off.",
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 2,
    title: '24/7 Customer Support',
    description:
      'Our travel experts are available around the clock to help you with any questions.',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    id: 3,
    title: 'Secure Booking',
    description:
      'Your personal and payment information is protected with industry-standard encryption.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
])

// Methods
const loadFeaturedHotels = async () => {
  try {
    loadingHotels.value = true
    console.log('Loading featured hotels using hotel store...')

    // Use the hotel store which has proper error handling and fallback data
    await hotelStore.fetchFeaturedHotels()

    // Get the data from the store
    featuredHotels.value = hotelStore.featuredHotels
    totalHotels.value = hotelStore.featuredHotels.length

    console.log('Featured hotels loaded successfully:', featuredHotels.value.length)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Failed to load featured hotels:', {
      error: errorMessage,
      fullError: error,
    })
    // Don't show error notification since store already handles fallback gracefully
    console.log('Using fallback data from hotel store')
  } finally {
    loadingHotels.value = false
  }
}

const getLowestRoomPrice = (hotel: any) => {
  if (!hotel.rooms || hotel.rooms.length === 0) {
    return 3000 // Default price if no rooms
  }

  const prices = hotel.rooms.map((room: any) => room.price)
  return Math.min(...prices)
}

const handleSearch = async () => {
  isSearching.value = true

  try {
    const query: any = {}
    if (searchForm.value.destination) query.destination = searchForm.value.destination
    if (searchForm.value.checkIn) query.checkIn = searchForm.value.checkIn
    if (searchForm.value.checkOut) query.checkOut = searchForm.value.checkOut

    await router.push({ path: '/search', query })
  } catch (error) {
    console.error('Search navigation failed:', error)
    notificationStore.error('Failed to navigate to search. Please try again.')
  } finally {
    isSearching.value = false
  }
}

const goToHotel = (id: number) => {
  router.push(`/hotel/${id}`)
}

// Initialize data on mount
onMounted(async () => {
  // Run database test first to diagnose any issues
  await runFullDatabaseTest()

  // Then load featured hotels
  loadFeaturedHotels()
})
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite 2s;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite 4s;
}

/* Gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Smooth transitions */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow,
    transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

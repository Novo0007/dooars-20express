<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <!-- Search Header -->
    <div
      class="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 py-6"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div>
            <h1 class="text-2xl font-display font-bold text-neutral-800 dark:text-neutral-200">
              {{ searchResults.length }} {{ $t('common.hotels') }} found
            </h1>
            <p class="text-neutral-600 dark:text-neutral-400 mt-1">
              {{ searchFilters.destination || 'All destinations' }} • {{ searchFilters.guests }}
              {{ $t('home.search.guests').toLowerCase() }}
            </p>
          </div>

          <!-- Quick Filters -->
          <div class="flex flex-wrap gap-2">
            <select
              v-model="searchFilters.sortBy"
              @change="updateSort"
              class="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm"
            >
              <option value="rating">{{ $t('search.sortBy.rating') }}</option>
              <option value="price">{{ $t('search.sortBy.price') }}</option>
              <option value="distance">{{ $t('search.sortBy.distance') }}</option>
            </select>

            <button
              @click="showFilters = !showFilters"
              class="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors duration-200"
            >
              <svg
                class="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.121A1 1 0 013 6.414V4z"
                />
              </svg>
              {{ $t('search.filters') }}
            </button>

            <button
              @click="showMap = !showMap"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 lg:hidden"
            >
              <svg
                class="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              {{ showMap ? $t('search.hideMap') : $t('search.showMap') }}
            </button>
          </div>
        </div>

        <!-- Advanced Filters -->
        <div v-if="showFilters" class="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Price Range -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {{ $t('search.priceRange') }}
              </label>
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="searchFilters.priceRange[0]"
                  type="number"
                  :placeholder="$t('search.minPrice')"
                  class="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm"
                />
                <span class="text-neutral-500">-</span>
                <input
                  v-model.number="searchFilters.priceRange[1]"
                  type="number"
                  :placeholder="$t('search.maxPrice')"
                  class="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm"
                />
              </div>
            </div>

            <!-- Rating -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {{ $t('search.minRating') }}
              </label>
              <select
                v-model.number="searchFilters.rating"
                class="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-sm"
              >
                <option value="0">{{ $t('search.anyRating') }}</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>

            <!-- Amenities -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {{ $t('search.amenities') }}
              </label>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="amenity in popularAmenities"
                  :key="amenity"
                  @click="toggleAmenity(amenity)"
                  class="px-2 py-1 text-xs rounded-full transition-colors duration-200"
                  :class="
                    searchFilters.amenities.includes(amenity)
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                  "
                >
                  {{ amenity }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Results List -->
        <div class="space-y-6" :class="{ 'lg:col-span-2': !showMap }">
          <!-- Promo Code Section -->
          <PromoCodeInput />

          <!-- Loading State -->
          <div v-if="loading" class="grid gap-6">
            <div
              v-for="i in 3"
              :key="i"
              class="bg-white dark:bg-neutral-800 rounded-xl p-6 animate-pulse"
            >
              <div class="flex space-x-4">
                <div class="w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div class="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                  <div class="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hotel Results -->
          <div v-else class="space-y-6">
            <div
              v-for="hotel in filteredResults"
              :key="hotel.id"
              class="bg-white dark:bg-neutral-800 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group"
              @click="selectHotel(hotel)"
            >
              <div class="flex flex-col sm:flex-row">
                <div
                  class="relative sm:w-48 h-48 sm:h-auto overflow-hidden sm:rounded-l-xl rounded-t-xl sm:rounded-tr-none"
                >
                  <img
                    :src="hotel.image"
                    :alt="hotel.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute top-3 left-3">
                    <span
                      class="bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ hotel.badge }}
                    </span>
                  </div>
                  <div class="absolute top-3 right-3">
                    <span
                      class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-neutral-800"
                    >
                      ⭐ {{ hotel.rating }}
                    </span>
                  </div>
                </div>

                <div class="flex-1 p-6">
                  <div class="flex justify-between items-start mb-2">
                    <h3
                      class="font-display font-bold text-xl text-neutral-800 dark:text-neutral-200"
                    >
                      {{ hotel.name }}
                    </h3>
                    <div class="text-right">
                      <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${{ applyDiscount(hotel.price) }}
                      </div>
                      <div v-if="hasDiscount" class="text-sm text-neutral-500 line-through">
                        ${{ hotel.price }}
                      </div>
                      <div class="text-sm text-neutral-500 dark:text-neutral-400">
                        {{ $t('home.featured.perNight') }}
                      </div>
                    </div>
                  </div>

                  <p class="text-neutral-600 dark:text-neutral-400 mb-3 flex items-center">
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

                  <p
                    v-if="hotel.description"
                    class="text-neutral-600 dark:text-neutral-400 text-sm mb-4"
                  >
                    {{ hotel.description }}
                  </p>

                  <div v-if="hotel.amenities" class="flex flex-wrap gap-1 mb-4">
                    <span
                      v-for="amenity in hotel.amenities.slice(0, 4)"
                      :key="amenity"
                      class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs rounded-full"
                    >
                      {{ amenity }}
                    </span>
                    <span
                      v-if="hotel.amenities.length > 4"
                      class="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-1"
                    >
                      +{{ hotel.amenities.length - 4 }} more
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <button
                      class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors duration-200"
                    >
                      {{ $t('home.featured.viewDetails') }} →
                    </button>
                    <button
                      @click.stop="bookNow(hotel)"
                      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      {{ $t('search.bookNow') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="!loading && filteredResults.length === 0" class="text-center py-12">
            <div
              class="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              {{ $t('search.noResults') }}
            </h3>
            <p class="text-neutral-600 dark:text-neutral-400 mb-4">
              {{ $t('search.tryAdjustingFilters') }}
            </p>
            <button
              @click="clearFilters"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {{ $t('search.clearFilters') }}
            </button>
          </div>
        </div>

        <!-- Map -->
        <div v-if="showMap" class="lg:sticky lg:top-6">
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-soft">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">
                {{ $t('search.mapView') }}
              </h3>
              <button
                @click="showMap = false"
                class="lg:hidden text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <LeafletMap
              :center="mapCenter"
              :markers="mapMarkers"
              height="500px"
              @marker-click="onMarkerClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHotelStore } from '../stores/hotel'
import { useBookingStore } from '../stores/booking'
import { useAppStore } from '../stores/app'
import LeafletMap from '../components/LeafletMap.vue'
import PromoCodeInput from '../components/PromoCodeInput.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const hotelStore = useHotelStore()
const bookingStore = useBookingStore()
const appStore = useAppStore()

const showFilters = ref(false)
const showMap = ref(true)

const searchResults = computed(() => hotelStore.searchResults)
const filteredResults = computed(() => hotelStore.filteredHotels)
const searchFilters = computed(() => hotelStore.searchFilters)
const loading = computed(() => hotelStore.loading)
const hasDiscount = computed(() => !!appStore.appliedDiscount)

const popularAmenities = ref([
  'WiFi',
  'Pool',
  'Spa',
  'Gym',
  'Restaurant',
  'Bar',
  'Parking',
  'Pet Friendly',
])

const mapCenter = computed<[number, number]>(() => {
  if (filteredResults.value.length > 0 && filteredResults.value[0].coordinates) {
    return [filteredResults.value[0].coordinates.lat, filteredResults.value[0].coordinates.lng]
  }
  return [51.505, -0.09] // Default to London
})

const mapMarkers = computed(() => {
  return filteredResults.value
    .filter((hotel) => hotel.coordinates)
    .map((hotel) => ({
      position: [hotel.coordinates!.lat, hotel.coordinates!.lng] as [number, number],
      title: hotel.name,
      description: `${hotel.location} • $${applyDiscount(hotel.price)}/night • ⭐ ${hotel.rating}`,
    }))
})

const applyDiscount = (price: number): number => {
  const discount = appStore.appliedDiscount
  if (!discount) return price

  if (discount.type === 'percentage') {
    return Math.round(price * (1 - discount.discount / 100))
  } else {
    return Math.max(0, price - discount.discount)
  }
}

const updateSort = () => {
  // Trigger reactive update
  hotelStore.updateSearchFilters({ sortBy: searchFilters.value.sortBy })
}

const toggleAmenity = (amenity: string) => {
  const amenities = [...searchFilters.value.amenities]
  const index = amenities.indexOf(amenity)

  if (index === -1) {
    amenities.push(amenity)
  } else {
    amenities.splice(index, 1)
  }

  hotelStore.updateSearchFilters({ amenities })
}

const selectHotel = (hotel: any) => {
  router.push(`/hotel/${hotel.id}`)
}

const bookNow = (hotel: any) => {
  bookingStore.startBooking(hotel, searchFilters.value)
  router.push('/booking')
}

const onMarkerClick = (marker: any) => {
  const hotel = filteredResults.value.find(
    (h) =>
      h.coordinates &&
      h.coordinates.lat === marker.position[0] &&
      h.coordinates.lng === marker.position[1],
  )
  if (hotel) {
    selectHotel(hotel)
  }
}

const clearFilters = () => {
  hotelStore.updateSearchFilters({
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
    sortBy: 'rating',
  })
}

onMounted(async () => {
  // Initialize search with query parameters
  const destination = route.query.destination as string
  const checkIn = route.query.checkIn as string
  const checkOut = route.query.checkOut as string
  const guests = Number(route.query.guests) || 2

  if (destination || checkIn || checkOut) {
    await hotelStore.searchHotels({
      destination,
      checkIn,
      checkOut,
      guests,
    })
  } else {
    // Load featured hotels as default results
    await hotelStore.fetchFeaturedHotels()
    hotelStore.searchResults = hotelStore.featuredHotels
  }
})

// Watch for route changes
watch(
  () => route.query,
  async (newQuery) => {
    if (newQuery.destination || newQuery.checkIn || newQuery.checkOut) {
      await hotelStore.searchHotels({
        destination: newQuery.destination as string,
        checkIn: newQuery.checkIn as string,
        checkOut: newQuery.checkOut as string,
        guests: Number(newQuery.guests) || 2,
      })
    }
  },
)
</script>

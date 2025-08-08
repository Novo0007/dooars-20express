<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-96 bg-neutral-200 dark:bg-neutral-700 rounded-2xl mb-8"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
            <div class="space-y-2">
              <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
              <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
            </div>
          </div>
          <div class="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- Hotel Details Content -->
    <div v-else-if="hotel" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Navigation -->
      <button
        @click="router.back()"
        class="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-6 transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {{ $t('common.back') }}
      </button>

      <!-- Photo Carousel -->
      <PhotoCarousel :images="hotel.images || [hotel.image]" :title="hotel.name" class="mb-8" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Hotel Header -->
          <div>
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1
                  class="text-3xl lg:text-4xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-2"
                >
                  {{ hotel.name }}
                </h1>
                <div class="flex items-center space-x-4 text-neutral-600 dark:text-neutral-400">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  </div>
                  <div class="flex items-center">
                    <span class="text-xl font-semibold text-amber-500 mr-1">⭐</span>
                    {{ hotel.rating }}
                    <span class="ml-1">({{ reviews.length }} {{ $t('hotel.reviews') }})</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <span class="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {{ hotel.badge }}
                </span>
                <button
                  v-if="authStore.isAuthenticated"
                  @click="toggleFavorite"
                  :disabled="favoriteLoading"
                  class="p-2 rounded-full transition-colors duration-200 disabled:opacity-50"
                  :class="
                    isFavorite
                      ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  "
                >
                  <svg
                    class="w-6 h-6"
                    :fill="isFavorite ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div class="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ roomTypes.length }}
                </div>
                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ $t('hotel.roomTypes') }}
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ hotel.amenities?.length || 0 }}
                </div>
                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ $t('hotel.amenities') }}
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ hotel.rating }}
                </div>
                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ $t('hotel.rating') }}
                </div>
              </div>
              <div class="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ formatPrice(lowestPrice) }}
                </div>
                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ $t('hotel.startingFrom') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-6">
            <h2 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              {{ $t('hotel.aboutHotel') }}
            </h2>
            <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {{ hotel.description }}
            </p>
          </div>

          <!-- Amenities -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-6">
            <h2 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              {{ $t('hotel.amenities') }}
            </h2>
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="amenity in hotel.amenities"
                :key="amenity"
                class="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400"
              >
                <svg
                  class="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{{ amenity }}</span>
              </div>
            </div>
          </div>

          <!-- Room Types -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-6">
            <h2 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-6">
              {{ $t('hotel.roomsAndRates') }}
            </h2>
            <div class="space-y-6">
              <div
                v-for="room in roomTypes"
                :key="room.id"
                class="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
              >
                <div
                  class="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0"
                >
                  <div class="flex-1">
                    <div class="flex items-start space-x-4">
                      <!-- Room Image -->
                      <img
                        v-if="room.images && room.images[0]"
                        :src="room.images[0]"
                        :alt="room.type"
                        class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      <div class="flex-1">
                        <h3
                          class="font-semibold text-lg text-neutral-800 dark:text-neutral-200 mb-2"
                        >
                          {{ room.type }}
                        </h3>
                        <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                          {{ room.description }}
                        </p>

                        <!-- Room Amenities -->
                        <div class="flex flex-wrap gap-1 mb-3">
                          <span
                            v-for="amenity in room.amenities?.slice(0, 3)"
                            :key="amenity"
                            class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs rounded-full"
                          >
                            {{ amenity }}
                          </span>
                          <span
                            v-if="room.amenities && room.amenities.length > 3"
                            class="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-1"
                          >
                            +{{ room.amenities.length - 3 }} more
                          </span>
                        </div>

                        <div class="text-sm text-neutral-500 dark:text-neutral-400">
                          <span class="mr-4">👥 Up to {{ room.max_guests }} guests</span>
                          <span>🟢 {{ room.available_count || 0 }} rooms available</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {{ formatPrice(calculateRoomPrice(room.price)) }}
                    </div>
                    <div v-if="hasDiscount" class="text-sm text-neutral-500 line-through">
                      {{ formatPrice(room.price) }}
                    </div>
                    <div class="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                      {{ $t('home.featured.perNight') }}
                    </div>
                    <button
                      @click="selectRoom(room)"
                      class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      {{ $t('hotel.selectRoom') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200">
                {{ $t('hotel.guestReviews') }}
              </h2>
              <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{{
                  hotel.rating
                }}</span>
                <div>
                  <div class="flex text-amber-400">
                    <span v-for="star in 5" :key="star" class="text-lg">
                      {{ star <= Math.floor(hotel.rating) ? '★' : '☆' }}
                    </span>
                  </div>
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">
                    {{ reviews.length }} {{ $t('hotel.reviews') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Rating Breakdown -->
            <div class="mb-6">
              <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm">
                <div
                  v-for="rating in [5, 4, 3, 2, 1]"
                  :key="rating"
                  class="flex items-center space-x-2"
                >
                  <span class="w-3">{{ rating }}</span>
                  <span class="text-amber-400">★</span>
                  <div class="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      class="bg-amber-400 h-2 rounded-full"
                      :style="{ width: `${getRatingPercentage(rating)}%` }"
                    ></div>
                  </div>
                  <span class="text-neutral-500 dark:text-neutral-400 w-8 text-right">
                    {{ getRatingCount(rating) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Individual Reviews -->
            <div class="space-y-6">
              <div
                v-for="review in reviews.slice(0, showAllReviews ? reviews.length : 3)"
                :key="review.id"
                class="border-b border-neutral-200 dark:border-neutral-700 pb-6 last:border-b-0"
              >
                <div class="flex items-start space-x-4">
                  <img
                    :src="
                      review.user_avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=3b82f6&color=fff`
                    "
                    :alt="review.user_name"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-neutral-800 dark:text-neutral-200">
                        {{ review.user_name }}
                      </h4>
                      <div class="flex items-center space-x-2">
                        <div class="flex text-amber-400">
                          <span v-for="star in 5" :key="star" class="text-sm">
                            {{ star <= review.rating ? '★' : '☆' }}
                          </span>
                        </div>
                        <span class="text-sm text-neutral-500 dark:text-neutral-400">
                          {{ formatDate(review.created_at) }}
                        </span>
                      </div>
                    </div>
                    <p class="text-neutral-600 dark:text-neutral-400">
                      {{ review.comment }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Show More Reviews Button -->
            <div v-if="reviews.length > 3" class="text-center mt-6">
              <button
                @click="showAllReviews = !showAllReviews"
                class="px-6 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors duration-200"
              >
                {{ showAllReviews ? $t('hotel.showLessReviews') : $t('hotel.showMoreReviews') }}
              </button>
            </div>
          </div>

          <!-- Map Location -->
          <div class="bg-white dark:bg-neutral-800 rounded-xl p-6">
            <h2 class="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              {{ $t('hotel.location') }}
            </h2>
            <LeafletMap
              :center="[hotel.coordinates?.lat || 0, hotel.coordinates?.lng || 0]"
              :markers="[
                {
                  position: [hotel.coordinates?.lat || 0, hotel.coordinates?.lng || 0],
                  title: hotel.name,
                  description: hotel.location,
                },
              ]"
              :zoom="15"
              height="300px"
            />
            <div class="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <p class="text-neutral-600 dark:text-neutral-400 text-sm">
                <svg
                  class="w-4 h-4 inline mr-1"
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
            </div>
          </div>
        </div>

        <!-- Booking Sidebar -->
        <div class="lg:sticky lg:top-8">
          <BookingWidget :hotel="hotel" :room-types="roomTypes" :selected-room="selectedRoom" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <div
        class="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mx-auto mb-4 flex items-center justify-center"
      >
        <svg class="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
        {{ $t('hotel.notFound') }}
      </h3>
      <p class="text-neutral-600 dark:text-neutral-400 mb-4">
        {{ $t('hotel.notFoundDescription') }}
      </p>
      <router-link
        to="/search"
        class="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        {{ $t('hotel.browseHotels') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHotelStore } from '../stores/hotel'
import { useBookingStore } from '../stores/booking'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import PhotoCarousel from '../components/PhotoCarousel.vue'
import LeafletMap from '../components/LeafletMap.vue'
import BookingWidget from '../components/BookingWidget.vue'
import { formatPrice } from '../utils/currency'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const hotelStore = useHotelStore()
const bookingStore = useBookingStore()
const authStore = useAuthStore()
const appStore = useAppStore()

const showAllReviews = ref(false)
const selectedRoom = ref<any>(null)

const loading = computed(() => hotelStore.loading)
const hotel = computed(() => hotelStore.selectedHotel)
const hasDiscount = computed(() => !!appStore.appliedDiscount)

// Computed property for room types from hotel data
const roomTypes = computed(() => {
  if (!hotel.value?.rooms) {
    return []
  }

  return hotel.value.rooms.filter(room => room.is_active).map(room => ({
    id: room.id,
    type: room.type,
    price: room.price,
    description: room.description || `Comfortable ${room.type.toLowerCase()} with modern amenities`,
    amenities: room.amenities || ['WiFi', 'Air Conditioning', 'TV'],
    max_guests: room.max_guests || 2,
    available_count: room.available_count || 0,
    images: room.images || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
  }))
})

const reviews = ref([
  {
    id: 1,
    hotel_id: 1,
    user_id: '1',
    user_name: 'Sarah Johnson',
    user_avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment:
      'Absolutely stunning resort! The overwater villa was a dream come true. The service was impeccable and the views were breathtaking.',
    created_at: '2024-01-20T14:30:00Z',
  },
  {
    id: 2,
    hotel_id: 1,
    user_id: '2',
    user_name: 'Michael Chen',
    user_avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment:
      'Perfect honeymoon destination. The staff went above and beyond to make our stay special. Highly recommend!',
    created_at: '2024-01-18T16:45:00Z',
  },
  {
    id: 3,
    hotel_id: 1,
    user_id: '3',
    user_name: 'Emma Williams',
    user_avatar: null,
    rating: 4,
    comment:
      'Beautiful location and excellent amenities. The spa was incredible. Only minor issue was the wifi speed.',
    created_at: '2024-01-15T10:20:00Z',
  },
  {
    id: 4,
    hotel_id: 1,
    user_id: '4',
    user_name: 'David Rodriguez',
    user_avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment:
      'Exceeded all expectations. The dining options were fantastic and the overwater bungalow was magical.',
    created_at: '2024-01-12T08:15:00Z',
  },
])

const lowestPrice = computed(() => {
  if (roomTypes.value.length === 0) return 0
  return Math.min(...roomTypes.value.map((room) => calculateRoomPrice(room.price)))
})

const isFavorite = ref(false)
const favoriteLoading = ref(false)

const calculateRoomPrice = (price: number): number => {
  const discount = appStore.appliedDiscount
  if (!discount) return price

  if (discount.type === 'percentage') {
    return Math.round(price * (1 - discount.discount / 100))
  } else {
    return Math.max(0, price - discount.discount)
  }
}

const getRatingCount = (rating: number): number => {
  return reviews.value.filter((review) => review.rating === rating).length
}

const getRatingPercentage = (rating: number): number => {
  const count = getRatingCount(rating)
  return reviews.value.length > 0 ? (count / reviews.value.length) * 100 : 0
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const checkIfFavorite = async () => {
  if (!authStore.isAuthenticated || !hotel.value) {
    isFavorite.value = false
    return
  }

  try {
    const favorites = await authStore.getUserFavorites()
    isFavorite.value = favorites.includes(hotel.value.id)
  } catch (error) {
    console.error('Failed to check favorite status:', error)
  }
}

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated || !hotel.value) return

  try {
    favoriteLoading.value = true

    if (isFavorite.value) {
      await authStore.removeFavoriteHotel(hotel.value.id)
      isFavorite.value = false
    } else {
      await authStore.addFavoriteHotel(hotel.value.id)
      isFavorite.value = true
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  } finally {
    favoriteLoading.value = false
  }
}

const selectRoom = (room: any) => {
  selectedRoom.value = room
  // Scroll to booking widget
  const bookingWidget = document.querySelector('.booking-widget')
  if (bookingWidget) {
    bookingWidget.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(async () => {
  const hotelId = Number(route.params.id)
  if (hotelId) {
    await hotelStore.getHotelById(hotelId)
    await checkIfFavorite()
  }
})
</script>

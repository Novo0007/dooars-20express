<template>
  <div class="min-h-screen">
    <!-- Hero Section with Search -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center mb-12">
          <h1 class="text-4xl lg:text-6xl font-display font-bold text-white mb-6 animate-fade-in">
            {{ $t('home.hero.title') }}
            <span class="text-accent-300">{{ $t('home.hero.titleAccent') }}</span>
          </h1>
          <p class="text-xl lg:text-2xl text-primary-100 mb-8 animate-slide-up">
            {{ $t('home.hero.subtitle') }}
          </p>
        </div>

        <!-- Search Form -->
        <div class="max-w-6xl mx-auto animate-scale-in">
          <div class="bg-white rounded-2xl shadow-large p-6 lg:p-8">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <!-- Destination -->
              <div class="lg:col-span-1">
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{{ $t('home.search.destination') }}</label>
                <div class="relative">
                  <input
                    v-model="searchForm.destination"
                    type="text"
                    :placeholder="$t('home.search.destinationPlaceholder')"
                    class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all duration-200"
                  />
                  <svg class="absolute right-3 top-3.5 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              <!-- Check-in Date -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{{ $t('home.search.checkin') }}</label>
                <input
                  v-model="searchForm.checkIn"
                  type="date"
                  class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all duration-200"
                />
              </div>

              <!-- Check-out Date -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{{ $t('home.search.checkout') }}</label>
                <input
                  v-model="searchForm.checkOut"
                  type="date"
                  class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all duration-200"
                />
              </div>

              <!-- Guests -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{{ $t('home.search.guests') }}</label>
                <select
                  v-model="searchForm.guests"
                  class="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all duration-200"
                >
                  <option value="1">{{ $t('home.search.guestOptions.1') }}</option>
                  <option value="2">{{ $t('home.search.guestOptions.2') }}</option>
                  <option value="3">{{ $t('home.search.guestOptions.3') }}</option>
                  <option value="4">{{ $t('home.search.guestOptions.4') }}</option>
                  <option value="5+">{{ $t('home.search.guestOptions.5+') }}</option>
                </select>
              </div>
            </div>

            <!-- Search Button -->
            <div class="mt-6">
              <button 
                @click="handleSearch"
                class="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-primary-200"
              >
                <span class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Hotels
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Hotels Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-neutral-800 mb-4">
            Featured Hotels
          </h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our handpicked selection of luxury hotels and boutique properties
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="hotel in featuredHotels" 
            :key="hotel.id"
            class="group bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            @click="goToHotel(hotel.id)"
          >
            <div class="relative overflow-hidden rounded-t-2xl">
              <img 
                :src="hotel.image" 
                :alt="hotel.name"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute top-4 right-4">
                <span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-neutral-800">
                  ⭐ {{ hotel.rating }}
                </span>
              </div>
              <div class="absolute top-4 left-4">
                <span class="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {{ hotel.badge }}
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="font-display font-bold text-xl text-neutral-800 mb-2">{{ hotel.name }}</h3>
              <p class="text-neutral-600 mb-4 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ hotel.location }}
              </p>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-primary-600">${{ hotel.price }}</span>
                  <span class="text-neutral-500">/night</span>
                </div>
                <button class="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Destinations Section -->
    <section class="py-20 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-neutral-800 mb-4">
            Popular Destinations
          </h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore the world's most sought-after travel destinations
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="destination in popularDestinations" 
            :key="destination.id"
            class="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300"
            @click="searchDestination(destination.name)"
          >
            <img 
              :src="destination.image" 
              :alt="destination.name"
              class="w-full h-80 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
              <h3 class="font-display font-bold text-xl mb-2">{{ destination.name }}</h3>
              <p class="text-white/90 text-sm">{{ destination.properties }} properties</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-neutral-800 mb-4">
            Why Choose WanderStay?
          </h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            We make travel booking simple, secure, and rewarding
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.id"
            class="text-center p-8 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors duration-200"
          >
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-xl text-neutral-800 mb-4">{{ feature.title }}</h3>
            <p class="text-neutral-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search form data
const searchForm = ref({
  destination: '',
  checkIn: '',
  checkOut: '',
  guests: '2'
})

// Featured hotels data
const featuredHotels = ref([
  {
    id: 1,
    name: 'Ocean View Resort',
    location: 'Maldives',
    price: 450,
    rating: 4.9,
    badge: 'Luxury',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Mountain Lodge',
    location: 'Swiss Alps, Switzerland',
    price: 320,
    rating: 4.8,
    badge: 'Featured',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'City Center Hotel',
    location: 'New York, USA',
    price: 280,
    rating: 4.7,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
  }
])

// Popular destinations data
const popularDestinations = ref([
  {
    id: 1,
    name: 'Paris',
    properties: '1,200+',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=500&fit=crop'
  },
  {
    id: 2,
    name: 'Tokyo',
    properties: '800+',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop'
  },
  {
    id: 3,
    name: 'Bali',
    properties: '650+',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=500&fit=crop'
  },
  {
    id: 4,
    name: 'London',
    properties: '900+',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=500&fit=crop'
  }
])

// Features data
const features = ref([
  {
    id: 1,
    title: 'Best Price Guarantee',
    description: 'Find the same hotel for less? We\'ll match the price and give you an extra 5% off.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 2,
    title: '24/7 Customer Support',
    description: 'Our travel experts are available around the clock to help you with any questions.',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    id: 3,
    title: 'Secure Booking',
    description: 'Your personal and payment information is protected with industry-standard encryption.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  }
])

// Methods
const handleSearch = () => {
  console.log('Searching with:', searchForm.value)
  router.push('/search')
}

const goToHotel = (id: number) => {
  router.push(`/hotel/${id}`)
}

const searchDestination = (destination: string) => {
  searchForm.value.destination = destination
  handleSearch()
}
</script>

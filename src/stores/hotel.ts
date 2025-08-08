import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export interface Hotel {
  id: number
  name: string
  location: string
  price: number
  rating: number
  badge: string
  image: string
  description?: string
  amenities?: string[]
  rooms?: any[]
  coordinates?: { lat: number; lng: number }
  reviews?: any[]
  images?: string[]
}

export interface SearchFilters {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  priceRange: [number, number]
  rating: number
  amenities: string[]
  sortBy: 'price' | 'rating' | 'distance'
}

export const useHotelStore = defineStore('hotel', () => {
  // State
  const hotels = ref<Hotel[]>([])
  const featuredHotels = ref<Hotel[]>([])
  const searchResults = ref<Hotel[]>([])
  const selectedHotel = ref<Hotel | null>(null)
  const searchFilters = ref<SearchFilters>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
    sortBy: 'rating',
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Popular destinations
  const popularDestinations = ref([
    {
      id: 1,
      name: 'Paris',
      properties: '1,200+',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=500&fit=crop',
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    {
      id: 2,
      name: 'Tokyo',
      properties: '800+',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop',
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    {
      id: 3,
      name: 'Bali',
      properties: '650+',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=500&fit=crop',
      coordinates: { lat: -8.3405, lng: 115.092 },
    },
    {
      id: 4,
      name: 'London',
      properties: '900+',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=500&fit=crop',
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
  ])

  // Computed
  const filteredHotels = computed(() => {
    let filtered = [...searchResults.value]

    // Filter by price range
    filtered = filtered.filter(
      (hotel) =>
        hotel.price >= searchFilters.value.priceRange[0] &&
        hotel.price <= searchFilters.value.priceRange[1],
    )

    // Filter by rating
    if (searchFilters.value.rating > 0) {
      filtered = filtered.filter((hotel) => hotel.rating >= searchFilters.value.rating)
    }

    // Sort
    switch (searchFilters.value.sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'distance':
        // TODO: Implement distance sorting based on coordinates
        break
    }

    return filtered
  })

  // Actions
  const fetchHotels = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      hotels.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching hotels:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFeaturedHotels = async () => {
    loading.value = true
    error.value = null

    try {
      // Try to fetch from Supabase first
      const { data, error: supabaseError } = await supabase
        .from('hotels')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(6)

      if (supabaseError) {
        console.warn('Supabase error, falling back to mock data:', supabaseError.message)
        throw supabaseError
      }

      if (data && data.length > 0) {
        // Transform data to match interface
        featuredHotels.value = data.map((hotel) => ({
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          price: 250, // Default price, could be calculated from rooms
          rating: hotel.rating || 4.5,
          badge: hotel.badge || 'Featured',
          image:
            hotel.images?.[0] ||
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
          coordinates: { lat: hotel.latitude || 0, lng: hotel.longitude || 0 },
          description: hotel.description || '',
          amenities: hotel.amenities || [],
        }))
      } else {
        // No featured hotels found, use mock data
        throw new Error('No featured hotels found')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching featured hotels, using mock data:', err)

      // Fallback to mock data
      featuredHotels.value = [
        {
          id: 1,
          name: 'Ocean View Resort',
          location: 'Maldives',
          price: 450,
          rating: 4.9,
          badge: 'Luxury',
          image:
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop',
          coordinates: { lat: 3.2028, lng: 73.2207 },
          description:
            'Luxury overwater resort with stunning ocean views and world-class amenities.',
          amenities: ['Private Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Room Service'],
        },
        {
          id: 2,
          name: 'Mountain Lodge',
          location: 'Swiss Alps, Switzerland',
          price: 320,
          rating: 4.8,
          badge: 'Featured',
          image:
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&h=300&fit=crop',
          coordinates: { lat: 46.8182, lng: 8.2275 },
          description: 'Cozy mountain retreat with breathtaking alpine views and rustic charm.',
          amenities: ['Fireplace', 'Spa', 'Restaurant', 'Ski Access', 'WiFi', 'Balcony'],
        },
        {
          id: 3,
          name: 'City Center Hotel',
          location: 'New York, USA',
          price: 280,
          rating: 4.7,
          badge: 'Popular',
          image:
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
          coordinates: { lat: 40.7128, lng: -74.006 },
          description:
            'Modern hotel in the heart of Manhattan with easy access to major attractions.',
          amenities: ['Gym', 'Business Center', 'Restaurant', 'Bar', 'WiFi', 'Concierge'],
        },
      ]
    } finally {
      loading.value = false
    }
  }

  const searchHotels = async (filters: Partial<SearchFilters>) => {
    loading.value = true
    error.value = null

    try {
      // Update search filters
      Object.assign(searchFilters.value, filters)

      // Mock search - replace with actual API call
      const mockResults = featuredHotels.value.filter((hotel) => {
        if (filters.destination) {
          return hotel.location.toLowerCase().includes(filters.destination.toLowerCase())
        }
        return true
      })

      searchResults.value = mockResults

      // Cache results for offline use
      const { cacheSearchResults } = useAppStore()
      cacheSearchResults(mockResults)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error searching hotels:', err)
    } finally {
      loading.value = false
    }
  }

  const getHotelById = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      // Check featured hotels first
      const hotel = featuredHotels.value.find((h) => h.id === id)
      if (hotel) {
        selectedHotel.value = hotel
        return hotel
      }

      // Fetch from Supabase
      const { data, error: supabaseError } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (supabaseError) throw supabaseError

      selectedHotel.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error fetching hotel:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateSearchFilters = (filters: Partial<SearchFilters>) => {
    Object.assign(searchFilters.value, filters)
  }

  const clearSearch = () => {
    searchResults.value = []
    searchFilters.value = {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      priceRange: [0, 1000],
      rating: 0,
      amenities: [],
      sortBy: 'rating',
    }
  }

  return {
    // State
    hotels,
    featuredHotels,
    searchResults,
    selectedHotel,
    searchFilters,
    loading,
    error,
    popularDestinations,

    // Computed
    filteredHotels,

    // Actions
    fetchHotels,
    fetchFeaturedHotels,
    searchHotels,
    getHotelById,
    updateSearchFilters,
    clearSearch,
  }
})

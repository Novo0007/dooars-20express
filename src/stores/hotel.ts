import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/stores/app'

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
      // Fetch featured hotels with their rooms data
      const { data, error: supabaseError } = await supabase
        .from('hotels')
        .select(
          `
          *,
          rooms (
            id,
            type,
            price,
            max_guests,
            available_count,
            is_active
          )
        `,
        )
        .eq('is_active', true)
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(6)

      if (supabaseError) {
        console.warn('Supabase error:', supabaseError.message)
        throw supabaseError
      }

      if (data && data.length > 0) {
        // Transform data to match interface with real room prices
        featuredHotels.value = data.map((hotel) => {
          const roomPrices = hotel.rooms?.filter((r) => r.is_active).map((r) => r.price) || []
          const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 3000

          return {
            id: hotel.id,
            name: hotel.name,
            location: hotel.location,
            price: minPrice, // Use actual minimum room price
            rating: hotel.rating || 4.5,
            badge: hotel.badge || 'Featured',
            image:
              hotel.images?.[0] ||
              'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
            coordinates: { lat: hotel.latitude || 0, lng: hotel.longitude || 0 },
            description: hotel.description || '',
            amenities: hotel.amenities || [],
            rooms: hotel.rooms || [],
          }
        })
      } else {
        // No featured hotels found, fetch regular hotels
        console.log('No featured hotels found, fetching regular hotels')
        const { data: regularHotels, error: regularError } = await supabase
          .from('hotels')
          .select(
            `
            *,
            rooms (
              id,
              type,
              price,
              max_guests,
              available_count,
              is_active
            )
          `,
          )
          .eq('is_active', true)
          .order('rating', { ascending: false })
          .limit(6)

        if (!regularError && regularHotels) {
          featuredHotels.value = regularHotels.map((hotel) => {
            const roomPrices = hotel.rooms?.filter((r) => r.is_active).map((r) => r.price) || []
            const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 3000

            return {
              id: hotel.id,
              name: hotel.name,
              location: hotel.location,
              price: minPrice,
              rating: hotel.rating || 4.5,
              badge: hotel.badge || '',
              image:
                hotel.images?.[0] ||
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop',
              coordinates: { lat: hotel.latitude || 0, lng: hotel.longitude || 0 },
              description: hotel.description || '',
              amenities: hotel.amenities || [],
              rooms: hotel.rooms || [],
            }
          })
        } else {
          featuredHotels.value = []
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      error.value = errorMessage
      console.error('Error fetching featured hotels:', errorMessage)
      featuredHotels.value = []
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

      // Build query based on filters
      let query = supabase
        .from('hotels')
        .select(
          `
          *,
          rooms (
            id,
            type,
            price,
            max_guests,
            available_count,
            is_active
          )
        `,
        )
        .eq('is_active', true)

      // Apply destination filter
      if (filters.destination) {
        query = query.ilike('location', `%${filters.destination}%`)
      }

      // Apply price range filter
      if (filters.priceRange && filters.priceRange.length === 2) {
        // Get hotels that have rooms within the price range
        query = query.in(
          'id',
          await supabase
            .from('rooms')
            .select('hotel_id')
            .gte('price', filters.priceRange[0])
            .lte('price', filters.priceRange[1])
            .eq('is_active', true)
            .then(({ data }) => data?.map((r) => r.hotel_id) || []),
        )
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price':
          query = query.order('id') // Will sort by lowest room price later
          break
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        case 'distance':
          // TODO: Implement distance-based sorting using coordinates
          query = query.order('created_at', { ascending: false })
          break
        default:
          query = query.order('rating', { ascending: false })
      }

      const { data, error: supabaseError } = await query.limit(20)

      if (supabaseError) throw supabaseError

      // Transform data to match interface and calculate prices
      const transformedResults =
        data?.map((hotel) => {
          const roomPrices = hotel.rooms?.filter((r) => r.is_active).map((r) => r.price) || []
          const minPrice = roomPrices.length > 0 ? Math.min(...roomPrices) : 3000

          return {
            id: hotel.id,
            name: hotel.name,
            location: hotel.location,
            price: minPrice,
            rating: hotel.rating || 4.5,
            badge: hotel.badge || (hotel.featured ? 'Featured' : ''),
            image:
              hotel.images?.[0] ||
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
            coordinates: { lat: hotel.latitude || 0, lng: hotel.longitude || 0 },
            description: hotel.description || '',
            amenities: hotel.amenities || [],
            rooms: hotel.rooms || [],
          }
        }) || []

      // Sort by price if needed (after transformation)
      if (filters.sortBy === 'price') {
        transformedResults.sort((a, b) => a.price - b.price)
      }

      searchResults.value = transformedResults

      // Cache results for offline use
      const { cacheSearchResults } = useAppStore()
      cacheSearchResults(transformedResults)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error searching hotels:', err)

      // Fallback to empty results instead of mock data
      searchResults.value = []
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

      // Fetch from Supabase with rooms data
      const { data, error: supabaseError } = await supabase
        .from('hotels')
        .select(
          `
          *,
          rooms (
            id,
            type,
            price,
            description,
            amenities,
            max_guests,
            available_count,
            is_active,
            images
          )
        `,
        )
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (supabaseError) throw supabaseError

      // Transform the data to match the interface
      const transformedHotel = {
        id: data.id,
        name: data.name,
        location: data.location,
        rating: data.rating || 4.5,
        badge: data.badge || '',
        image:
          data.images?.[0] ||
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
        coordinates: { lat: data.latitude || 0, lng: data.longitude || 0 },
        description: data.description || '',
        amenities: data.amenities || [],
        rooms: data.rooms || [],
      }

      selectedHotel.value = transformedHotel
      return transformedHotel
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

<template>
  <div class="relative">
    <div
      ref="mapContainer"
      :style="{ width: width, height: height }"
      class="rounded-lg overflow-hidden shadow-medium border border-neutral-200 dark:border-neutral-700"
    ></div>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
    >
      <div class="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300">
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span class="text-sm font-medium">Loading map...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'

interface MapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    title?: string
    description?: string
    icon?: string
  }>
  width?: string
  height?: string
  showControls?: boolean
}

const props = withDefaults(defineProps<MapProps>(), {
  center: () => [51.505, -0.09], // London default
  zoom: 13,
  markers: () => [],
  width: '100%',
  height: '400px',
  showControls: true,
})

const emit = defineEmits<{
  markerClick: [marker: any]
  mapReady: [map: L.Map]
}>()

const mapContainer = ref<HTMLElement>()
const loading = ref(true)
let map: L.Map | null = null
let markerGroup: L.LayerGroup | null = null

// Custom hotel icon
const createHotelIcon = () => {
  return L.divIcon({
    html: `
      <div class="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
        </svg>
      </div>
    `,
    className: 'custom-hotel-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

const initializeMap = async () => {
  if (!mapContainer.value) return

  try {
    // Create map
    map = L.map(mapContainer.value, {
      zoomControl: props.showControls,
      attributionControl: true,
    }).setView(props.center, props.zoom)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Create marker group
    markerGroup = L.layerGroup().addTo(map)

    // Add markers
    updateMarkers()

    // Emit map ready event
    emit('mapReady', map)

    loading.value = false
  } catch (error) {
    console.error('Failed to initialize map:', error)
    loading.value = false
  }
}

const updateMarkers = () => {
  if (!map || !markerGroup) return

  // Clear existing markers
  markerGroup.clearLayers()

  // Add new markers
  props.markers.forEach((markerData, index) => {
    const marker = L.marker(markerData.position, {
      icon: createHotelIcon(),
    }).addTo(markerGroup!)

    // Add popup if title or description provided
    if (markerData.title || markerData.description) {
      const popupContent = `
        <div class="text-center">
          ${markerData.title ? `<h3 class="font-semibold text-neutral-800 mb-1">${markerData.title}</h3>` : ''}
          ${markerData.description ? `<p class="text-sm text-neutral-600">${markerData.description}</p>` : ''}
        </div>
      `
      marker.bindPopup(popupContent)
    }

    // Add click handler
    marker.on('click', () => {
      emit('markerClick', { ...markerData, index })
    })
  })

  // Fit map to markers if multiple markers exist
  if (props.markers.length > 1) {
    const group = new L.featureGroup(markerGroup.getLayers())
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

// Watch for changes in markers
watch(() => props.markers, updateMarkers, { deep: true })

// Watch for center changes
watch(
  () => props.center,
  (newCenter) => {
    if (map) {
      map.setView(newCenter, props.zoom)
    }
  },
)

onMounted(async () => {
  await nextTick()
  initializeMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
/* Fix for missing Leaflet images */
.leaflet-default-icon-path {
  background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png');
}

/* Custom marker styles */
.custom-hotel-marker {
  background: transparent !important;
  border: none !important;
}

/* Dark mode styles for map */
.dark .leaflet-popup-content-wrapper {
  background: #374151;
  color: #f3f4f6;
}

.dark .leaflet-popup-tip {
  background: #374151;
}

.dark .leaflet-control-attribution {
  background: rgba(55, 65, 81, 0.8);
  color: #d1d5db;
}
</style>

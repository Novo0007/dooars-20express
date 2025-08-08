<template>
  <div class="relative">
    <!-- Main carousel -->
    <div class="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-700">
      <div 
        class="flex transition-transform duration-500 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="w-full h-full flex-shrink-0 relative"
        >
          <img
            :src="image"
            :alt="`${title} - Image ${index + 1}`"
            class="w-full h-full object-cover"
            @load="onImageLoad"
            @error="onImageError"
          />
          
          <!-- Image overlay with info -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div class="text-white">
              <div class="text-sm opacity-90">{{ index + 1 }} / {{ images.length }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation arrows -->
      <button
        v-if="images.length > 1"
        @click="previousImage"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200"
        :disabled="currentIndex === 0"
        :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="images.length > 1"
        @click="nextImage"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200"
        :disabled="currentIndex === images.length - 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentIndex === images.length - 1 }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Fullscreen button -->
      <button
        @click="openFullscreen"
        class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>

      <!-- Dots indicator -->
      <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click="currentIndex = index"
          class="w-2 h-2 rounded-full transition-all duration-200"
          :class="index === currentIndex ? 'bg-white' : 'bg-white/50'"
        />
      </div>
    </div>

    <!-- Thumbnail strip -->
    <div v-if="images.length > 1" class="flex space-x-2 mt-4 overflow-x-auto pb-2">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="currentIndex = index"
        class="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200"
        :class="index === currentIndex 
          ? 'border-primary-500 shadow-lg' 
          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
      >
        <img
          :src="image"
          :alt="`Thumbnail ${index + 1}`"
          class="w-full h-full object-cover"
        />
        <div
          v-if="index !== currentIndex"
          class="absolute inset-0 bg-black/20"
        />
      </button>
    </div>

    <!-- Fullscreen modal -->
    <div
      v-if="showFullscreen"
      class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      @click="closeFullscreen"
    >
      <div class="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4">
        <img
          :src="images[currentIndex]"
          :alt="`${title} - Fullscreen`"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
        
        <!-- Fullscreen navigation -->
        <button
          v-if="images.length > 1 && currentIndex > 0"
          @click.stop="previousImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-4"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          v-if="images.length > 1 && currentIndex < images.length - 1"
          @click.stop="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-4"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Close button -->
        <button
          @click="closeFullscreen"
          class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image counter -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  images: string[]
  title?: string
  autoplay?: boolean
  autoplayInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Gallery',
  autoplay: false,
  autoplayInterval: 5000
})

const currentIndex = ref(0)
const showFullscreen = ref(false)
let autoplayTimer: NodeJS.Timeout | null = null

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else if (props.autoplay) {
    currentIndex.value = 0
  }
}

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else if (props.autoplay) {
    currentIndex.value = props.images.length - 1
  }
}

const openFullscreen = () => {
  showFullscreen.value = true
  document.body.style.overflow = 'hidden'
}

const closeFullscreen = () => {
  showFullscreen.value = false
  document.body.style.overflow = 'auto'
}

const onImageLoad = () => {
  // Handle successful image load
}

const onImageError = (event: Event) => {
  // Handle image load error
  const img = event.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop' // Fallback image
}

const startAutoplay = () => {
  if (props.autoplay && props.images.length > 1) {
    autoplayTimer = setInterval(nextImage, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!showFullscreen.value) return
  
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
    case 'Escape':
      event.preventDefault()
      closeFullscreen()
      break
  }
}

onMounted(() => {
  startAutoplay()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopAutoplay()
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* Custom scrollbar for thumbnail strip */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>

<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
    >
      <span class="text-lg">{{ currentLocale.flag }}</span>
      <span class="hidden sm:block">{{ currentLocale.name }}</span>
      <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-medium border border-neutral-200 dark:border-neutral-700 py-2 z-50"
      @click.stop
    >
      <button
        v-for="locale in supportedLocales"
        :key="locale.code"
        @click="selectLanguage(locale.code)"
        class="w-full flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
        :class="{ 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400': locale.code === currentLanguage }"
      >
        <span class="text-lg">{{ locale.flag }}</span>
        <span>{{ locale.name }}</span>
        <svg v-if="locale.code === currentLanguage" class="w-4 h-4 ml-auto text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales } from '../i18n'
import { useAppStore } from '../stores/app'

const { locale } = useI18n()
const appStore = useAppStore()

const isOpen = ref(false)

const currentLanguage = computed(() => locale.value)
const currentLocale = computed(() => 
  supportedLocales.find(l => l.code === currentLanguage.value) || supportedLocales[0]
)

const selectLanguage = (languageCode: string) => {
  locale.value = languageCode
  appStore.setLanguage(languageCode)
  isOpen.value = false
}

const handleClickOutside = (event: Event) => {
  if (!event.target) return
  const target = event.target as Element
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

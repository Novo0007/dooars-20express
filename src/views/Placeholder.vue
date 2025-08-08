<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft p-12">
        <div class="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        
        <h1 class="text-3xl font-display font-bold text-neutral-800 mb-4">
          {{ pageTitle }} Coming Soon
        </h1>
        
        <p class="text-lg text-neutral-600 mb-8">
          This page is under construction. We're working hard to bring you an amazing {{ pageTitle.toLowerCase() }} experience.
        </p>
        
        <div class="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h3 class="font-semibold text-primary-800 mb-2">Want to help us build this feature?</h3>
          <p class="text-primary-700 text-sm">
            Continue prompting with specific requirements for this page and we'll implement it for you!
          </p>
        </div>
        
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  return route.meta?.title as string || 'Page'
})
</script>

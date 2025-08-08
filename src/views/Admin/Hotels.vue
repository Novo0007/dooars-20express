<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Hotel Management
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400">Manage hotel listings and properties</p>
      </div>

      <!-- Coming Soon Notice -->
      <div class="text-center py-20">
        <div
          class="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-primary-600 dark:text-primary-400"
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
        </div>
        <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Hotel Management Coming Soon
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          Comprehensive hotel management tools are being developed.
        </p>
        <router-link
          to="/admin"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
        >
          Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Admin Hotels placeholder
</script>

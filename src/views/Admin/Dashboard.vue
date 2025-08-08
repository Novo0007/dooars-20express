<template>
  <div class="min-h-screen bg-white dark:bg-neutral-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Admin Dashboard
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          Welcome to the Dooars Express admin panel
        </p>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Admin Dashboard Coming Soon
        </h3>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
          We're working on building comprehensive admin tools for hotel management, booking
          oversight, and analytics.
        </p>

        <!-- Quick Links -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
          <router-link
            to="/admin/hotels"
            class="block p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="text-2xl mb-2">🏨</div>
            <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Hotel Management
            </h4>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              Add, edit, and manage hotel listings
            </p>
          </router-link>

          <router-link
            to="/admin/bookings"
            class="block p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="text-2xl mb-2">📅</div>
            <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Booking Management
            </h4>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              View and manage all bookings
            </p>
          </router-link>

          <router-link
            to="/admin/users"
            class="block p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 border border-neutral-200 dark:border-neutral-700"
          >
            <div class="text-2xl mb-2">👥</div>
            <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              User Management
            </h4>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              Manage user accounts and roles
            </p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Admin Dashboard placeholder
</script>

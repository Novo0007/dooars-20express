<template>
  <div id="app">
    <TheNavigation />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import TheNavigation from './components/TheNavigation.vue'
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
  transition: background-color 0.3s ease;
}

:root.dark #app {
  background-color: #0f172a;
}
</style>

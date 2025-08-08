<template>
  <div id="app">
    <TheNavigation />
    <OfflineIndicator />
    <router-view />
    <LiveChatWidget />
    <PWAInstallPrompt />
    <AuthDebug />
  </div>
</template>

<script setup lang="ts">
import TheNavigation from './components/TheNavigation.vue'
import LiveChatWidget from './components/LiveChatWidget.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import OfflineIndicator from './components/OfflineIndicator.vue'
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

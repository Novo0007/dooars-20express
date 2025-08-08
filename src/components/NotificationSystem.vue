<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <transition-group
        name="notification"
        tag="div"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'p-4 rounded-lg shadow-lg border transform transition-all duration-300',
            getNotificationClasses(notification.type)
          ]"
        >
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <component :is="getIcon(notification.type)" :class="getIconClasses(notification.type)" />
            </div>
            <div class="flex-1">
              <h4 v-if="notification.title" class="font-semibold text-sm">{{ notification.title }}</h4>
              <p class="text-sm" :class="{ 'mt-1': notification.title }">{{ notification.message }}</p>
            </div>
            <button
              @click="removeNotification(notification.id)"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

// Simple SVG icon components
const CheckCircleIcon = defineComponent({
  props: ['class'],
  render() {
    return h('svg', {
      class: this.class,
      fill: 'currentColor',
      viewBox: '0 0 20 20'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        'clip-rule': 'evenodd'
      })
    ])
  }
})

const ExclamationTriangleIcon = defineComponent({
  props: ['class'],
  render() {
    return h('svg', {
      class: this.class,
      fill: 'currentColor',
      viewBox: '0 0 20 20'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z',
        'clip-rule': 'evenodd'
      })
    ])
  }
})

const XCircleIcon = defineComponent({
  props: ['class'],
  render() {
    return h('svg', {
      class: this.class,
      fill: 'currentColor',
      viewBox: '0 0 20 20'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z',
        'clip-rule': 'evenodd'
      })
    ])
  }
})

const InformationCircleIcon = defineComponent({
  props: ['class'],
  render() {
    return h('svg', {
      class: this.class,
      fill: 'currentColor',
      viewBox: '0 0 20 20'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z',
        'clip-rule': 'evenodd'
      })
    ])
  }
})

const XMarkIcon = defineComponent({
  props: ['class'],
  render() {
    return h('svg', {
      class: this.class,
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M6 18L18 6M6 6l12 12'
      })
    ])
  }
})

import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { notifications, removeNotification } = notificationStore

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'error': return XCircleIcon
    case 'info': return InformationCircleIcon
    default: return InformationCircleIcon
  }
}

const getNotificationClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
    case 'error':
      return 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
    case 'info':
      return 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    default:
      return 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
  }
}

const getIconClasses = (type: string) => {
  switch (type) {
    case 'success': return 'w-5 h-5 text-green-500 dark:text-green-400'
    case 'warning': return 'w-5 h-5 text-yellow-500 dark:text-yellow-400'
    case 'error': return 'w-5 h-5 text-red-500 dark:text-red-400'
    case 'info': return 'w-5 h-5 text-blue-500 dark:text-blue-400'
    default: return 'w-5 h-5 text-gray-500 dark:text-gray-400'
  }
}

const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '0'
  element.style.transform = 'translateX(100%)'
  
  requestAnimationFrame(() => {
    element.style.opacity = '1'
    element.style.transform = 'translateX(0)'
  })
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '0'
  element.style.transform = 'translateX(100%)'
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

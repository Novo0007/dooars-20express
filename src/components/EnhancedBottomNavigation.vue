<template>
  <div class="md:hidden">
    <!-- Main Bottom Navigation -->
    <nav
      class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-700 z-50 safe-area-inset"
    >
      <div class="flex items-center justify-around py-1">
        <!-- Home -->
        <NavigationItem
          to="/"
          :active="isRouteActive('/')"
          :icon="HomeIcon"
          :label="$t('nav.home')"
        />

        <!-- Search -->
        <NavigationItem
          to="/search"
          :active="isRouteActive('/search')"
          :icon="SearchIcon"
          :label="$t('nav.search')"
        />

        <!-- Bookings -->
        <NavigationItem
          to="/booking-history"
          :active="isRouteActive('/booking-history')"
          :icon="CalendarIcon"
          :label="$t('nav.bookings')"
          :badge="pendingBookingsCount"
        />

        <!-- Favorites -->
        <NavigationItem
          to="/favorites"
          :active="isRouteActive('/favorites')"
          :icon="HeartIcon"
          :label="$t('nav.favorites')"
          :filled="isRouteActive('/favorites')"
        />

        <!-- Profile -->
        <NavigationItem
          :to="authStore.isAuthenticated ? '/profile' : '/login'"
          :active="isRouteActive('/profile') || isRouteActive('/login')"
          :icon="ProfileIcon"
          :label="authStore.isAuthenticated ? $t('nav.profile') : $t('nav.login')"
          :avatar="authStore.user?.profile?.avatar_url"
          :initials="
            authStore.isAuthenticated ? authStore.userDisplayName.charAt(0).toUpperCase() : ''
          "
        />
      </div>
    </nav>

    <!-- Content spacer -->
    <div class="h-16 safe-area-inset-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

// Navigation Item Component
const NavigationItem = defineComponent({
  props: {
    to: String,
    active: Boolean,
    icon: Function,
    label: String,
    badge: Number,
    filled: Boolean,
    avatar: String,
    initials: String,
  },
  setup(props) {
    return () =>
      h(
        'router-link',
        {
          to: props.to,
          class: [
            'flex flex-col items-center justify-center p-3 min-h-[64px] min-w-[64px] transition-all duration-200 ease-in-out',
            props.active
              ? 'text-primary-600 dark:text-primary-400 transform scale-105'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300',
          ],
        },
        [
          // Icon container with badge and indicator
          h('div', { class: 'relative mb-1' }, [
            // Avatar or Icon
            props.avatar
              ? h('img', {
                  src: props.avatar,
                  alt: props.label,
                  class: 'w-6 h-6 rounded-full object-cover',
                })
              : props.initials
                ? h(
                    'div',
                    {
                      class:
                        'w-6 h-6 rounded-full bg-primary-600 dark:bg-primary-400 flex items-center justify-center text-white text-xs font-semibold',
                    },
                    props.initials,
                  )
                : h(props.icon!, {
                    class: [
                      'w-6 h-6 transition-transform duration-200',
                      props.active ? 'scale-110' : '',
                      props.filled && props.active ? 'fill-current' : '',
                    ],
                  }),

            // Active indicator dot
            props.active &&
              h('div', {
                class:
                  'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full',
              }),

            // Badge for notifications
            props.badge &&
              props.badge > 0 &&
              h(
                'div',
                {
                  class:
                    'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium',
                },
                props.badge > 9 ? '9+' : props.badge.toString(),
              ),
          ]),

          // Label
          h(
            'span',
            {
              class: [
                'text-xs font-medium transition-colors duration-200',
                props.active ? 'text-primary-600 dark:text-primary-400' : '',
              ],
            },
            props.label,
          ),
        ],
      )
  },
})

// Icon Components
const HomeIcon = defineComponent({
  props: ['class'],
  render() {
    return h(
      'svg',
      {
        class: this.class,
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        }),
      ],
    )
  },
})

const SearchIcon = defineComponent({
  props: ['class'],
  render() {
    return h(
      'svg',
      {
        class: this.class,
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
        }),
      ],
    )
  },
})

const CalendarIcon = defineComponent({
  props: ['class'],
  render() {
    return h(
      'svg',
      {
        class: this.class,
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        }),
      ],
    )
  },
})

const HeartIcon = defineComponent({
  props: ['class'],
  render() {
    return h(
      'svg',
      {
        class: this.class,
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        }),
      ],
    )
  },
})

const ProfileIcon = defineComponent({
  props: ['class'],
  render() {
    return h(
      'svg',
      {
        class: this.class,
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        }),
      ],
    )
  },
})

// Helper functions
const isRouteActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const pendingBookingsCount = computed(() => {
  // This would come from your booking store
  // For now, return 0, but implement based on your logic
  return 0
})
</script>

<style scoped>
/* Safe area handling */
.safe-area-inset {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-inset-bottom {
  height: env(safe-area-inset-bottom);
}

/* Smooth transitions */
.router-link {
  -webkit-tap-highlight-color: transparent;
}

/* Backdrop blur support fallback */
@supports not (backdrop-filter: blur(12px)) {
  nav {
    @apply bg-white dark:bg-neutral-900;
  }
}

/* Focus states for accessibility */
.router-link:focus {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2 rounded-lg;
}

/* Animation for active states */
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.router-link-exact-active .icon {
  animation: bounce-in 0.3s ease-out;
}
</style>

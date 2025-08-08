import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Placeholder from '../views/Placeholder.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: { title: 'Search Hotels' }
    },
    {
      path: '/hotel/:id',
      name: 'hotel-details',
      component: Placeholder,
      meta: { title: 'Hotel Details' }
    },
    {
      path: '/booking',
      name: 'booking',
      component: Placeholder,
      meta: { title: 'Booking' }
    },
    {
      path: '/login',
      name: 'login',
      component: Placeholder,
      meta: { title: 'Login' }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Placeholder,
      meta: { title: 'Sign Up' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Placeholder,
      meta: { title: 'My Profile' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Placeholder,
      meta: { title: 'Admin Dashboard' }
    }
  ]
})

export default router

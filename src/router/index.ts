import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { hasToken } from '../services/token.service'
import Home from '../views/Home.vue'

import AuthRoutes from './auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { clientAuth: true }
  },
  ...AuthRoutes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.clientAuth && !hasToken()) {
    next('/login')
  }
  next()
})

export default router

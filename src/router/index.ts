import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { hasToken } from '../services/token.service'
import Home from '../views/Home.vue'

import AuthRoutes from './auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { clientAuth: true },
    children: [
      {
        path: '/contacts',
        name: 'Contacts',
        component: () => import(/* webpackChunkName: "about" */ '../views/Contact.vue')
      },
      {
        path: '/rooms/:name',
        name: 'Room',
        component: () => import(/* webpackChunkName: "about" */ '../views/Room.vue')
      },
      {
        path: '/messages/:username',
        name: 'Message',
        component: () => import(/* webpackChunkName: "about" */ '../views/PrivateMessage.vue')
      }
    ]
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

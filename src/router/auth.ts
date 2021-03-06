import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/ResetPassword.vue')
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Confirm.vue')
  }
]

export default routes

import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'

const routes = [
  { path: '/', component: () => import('@/login.vue'), meta: { noAuth: true } },
  { path: '/dashboard', component: () => import('@/dashboard.vue'), meta: { requiresAuth: true } },
  // { path: '/files/:id', component: () => import('@/FileView.vue'), meta: { requiresAuth: true } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

let fetched = false
router.beforeEach(async (to) => {
  const auth = useAuth()
  // On first navigation, try restoring session
  if (!fetched) {
    fetched = true
    await auth.fetchMe()
  }
  if (to.meta.requiresAuth && !auth.user) {
    return { path: '/', query: { redirect: to.fullPath } }
  } else if (to.meta.noAuth && auth.user) {
    return { path: '/dashboard' }
  }
})

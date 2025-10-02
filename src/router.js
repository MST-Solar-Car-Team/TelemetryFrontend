import { createRouter, createWebHistory } from 'vue-router'
import Login from './login.vue'
import Dashboard from './dashboard.vue'

// You can later switch components to lazy-loaded if needed:
// const Dashboard = () => import('./dashboard.vue')

const routes = [
  { path: '/', component: Login, meta: { noAuth: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(), // Uses normal history API (clean URLs)
  routes,
})

router.beforeEach((to, _from, next) => {
  const authed = !!localStorage.getItem("token");
  if (to.meta.requiresAuth && !authed) next({ path: "/" });
  else if (to.meta.noAuth && authed) next({ path: "/dashboard" });
  else next();
});


export default router
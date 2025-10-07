import { defineStore } from 'pinia'
import { http } from '@/lib/http'

export const useAuth = defineStore('auth', {
  state: () => ({ user: null, loading: false }),
  actions: {
    async fetchMe() {
      this.loading = true
      try {
        this.user = (await http.get('/me')).data // GET /api/me
      } finally {
        this.loading = false
      }
    },
    async login(username, password) {
      await http.post('/login', { username, password }) // POST /api/login
      await this.fetchMe()
    },
    async logout() {
      await http.post('/logout', {})
      this.user = null
    }
  }
})

import { defineStore } from 'pinia'
import { http } from '@/lib/http'

export const useAuth = defineStore('auth', {
  state: () => ({ user: null, loading: false, error: null }),
  actions: {
    async fetchMe() {
      this.loading = true
      this.error = null
      try {
        this.user = (await http.get('/me')).data // GET /api/me
      } catch (error) {
        this.user = null
        const status = error.response?.status
        if (!error.response || status >= 500) {
          this.error = 'Could not connect to authentication server.'
          console.error('Failed to reach /api/me', error)
        } else if (status !== 401) {
          console.error('Failed to fetch /api/me', error)
        }
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
      this.error = null
    }
  }
})

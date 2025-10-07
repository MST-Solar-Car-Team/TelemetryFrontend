import axios from 'axios'

export const http = axios.create({
  // With Vite proxy in dev, same-origin is fine:
  baseURL: '/api',
  withCredentials: true
})

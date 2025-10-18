import axios from 'axios'

export const http = axios.create({
  // With Vite proxy in dev, same-origin is fine:
  baseURL: '/api',
  withCredentials: true
})

export async function fetchArrow(url, params = {}) {
  const res = await http.get(url, { params, responseType: 'arraybuffer' })
  return new Uint8Array(res.data) // Arrow IPC bytes
}
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      // Sends /api/* to your Express (running on 3000)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Important so cookie path/domain remain valid
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    allowedHosts: ['code.imseo.dev', 'vite.imseo.dev', '0.0.0.0', 'localhost', '127.0.0.1'],
    host: '0.0.0.0', // Change this to a valid IP address if needed
    port: 5173
  },
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/housing-calculation/ on GitHub Pages
  base: '/housing-calculation/',
  plugins: [react()],
})

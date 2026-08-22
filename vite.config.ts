import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: https://acreandoak.github.io/granny-obituary-builder/
  base: process.env.GITHUB_PAGES === 'true' ? '/granny-obituary-builder/' : '/',
})

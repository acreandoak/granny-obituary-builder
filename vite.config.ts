import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const pagesBase = '/granny-obituary-builder/'

function prefixPublicAssetsInBooklet() {
  return {
    name: 'prefix-public-assets-in-booklet',
    closeBundle() {
      if (process.env.GITHUB_PAGES !== 'true') return
      const file = path.resolve('dist/default-booklet.json')
      if (!fs.existsSync(file)) return
      let text = fs.readFileSync(file, 'utf8')
      for (const folder of ['photos', 'cutouts', 'scans', 'stock']) {
        text = text.split(`"/${folder}/`).join(`"${pagesBase}${folder}/`)
      }
      fs.writeFileSync(file, text)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), prefixPublicAssetsInBooklet()],
  // GitHub Pages project site: https://acreandoak.github.io/granny-obituary-builder/
  base: process.env.GITHUB_PAGES === 'true' ? pagesBase : '/',
})

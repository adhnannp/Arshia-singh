import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const input = Object.fromEntries(
  readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .map(file => [file.replace(/\.html$/, ''), resolve(rootDir, file)])
)

export default defineConfig({
  base: './',

  build: {
    rollupOptions: {
      input
    }
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
})
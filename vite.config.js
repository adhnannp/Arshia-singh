import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        story: resolve(__dirname, 'story.html'),
        custom: resolve(__dirname, 'custom.html'),
        newpage: resolve(__dirname, 'new.html'),
        product1: resolve(__dirname, 'product-1.html'),
        product2: resolve(__dirname, 'product-2.html'),
        product3: resolve(__dirname, 'product-3.html'),
      }
    }
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
})
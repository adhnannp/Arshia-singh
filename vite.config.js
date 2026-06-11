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
        productDetail: resolve(__dirname, 'product-detail.html'),
        matchingMoods: resolve(__dirname, 'matching-moods.html'),
        flowState: resolve(__dirname, 'flow-state.html'),
        powerLayers: resolve(__dirname, 'power-layers.html'),
        topTier: resolve(__dirname, 'top-tier.html'),
        sixYardsOfGood: resolve(__dirname, 'six-yards-of-good.html'),
        customMadeForMoments: resolve(__dirname, 'custom-made-for-moments.html'),
        naturalLuxury: resolve(__dirname, 'natural-luxury.html'),
        printedStories: resolve(__dirname, 'printed-stories.html'),
        modernClassics: resolve(__dirname, 'modern-classics.html'),
      }
    }
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
})
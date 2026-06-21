import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:      resolve(__dirname, 'index.html'),
        products:  resolve(__dirname, 'products.html'),
        services:  resolve(__dirname, 'services.html'),
        book:      resolve(__dirname, 'book.html'),
        thankyou:  resolve(__dirname, 'thank-you.html'),
      },
    },
  },
})

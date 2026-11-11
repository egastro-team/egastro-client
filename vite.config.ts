/// <reference types="vitest/config" />
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Java REST API (Spring Boot) during local development
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
        // Proxied calls are same-origin for the browser, so CORS does not apply. Drop the
        // Origin header: otherwise the backend rejects any dev port outside its allow-list
        // (3000/5173) with 403 "Invalid CORS request", e.g. when Vite falls back to :5174.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/storage-polyfill.ts', './src/test/setup.ts'],
    css: true,
  },
})

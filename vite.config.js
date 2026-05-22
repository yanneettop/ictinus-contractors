import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    // Pre-compress assets with gzip and brotli for faster serving
    compression({ algorithm: 'gzip', exclude: [/\.(br)$/], threshold: 1024 }),
    compression({ algorithm: 'brotliCompress', exclude: [/\.(gz)$/], threshold: 1024 }),
  ],
  base: '/',
  server: {
    port: parseInt(process.env.PORT) || 5173,
  },
  build: {
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Remove console.log in production
        drop_debugger: true,
        passes: 2,
      },
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'motion': ['motion'],
        },
      },
    },
    // Generate source maps for debugging but keep them separate
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // CSS code splitting
    cssCodeSplit: true,
    // Asset inlining threshold (4kb) — small images get inlined as base64
    assetsInlineLimit: 4096,
    // Chunk size warning
    chunkSizeWarningLimit: 250,
  },
})

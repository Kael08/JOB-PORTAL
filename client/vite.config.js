import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Чистим выходную директорию при каждой сборке
    emptyOutDir: true,
    // Увеличиваем размер чанков для более стабильных хешей
    chunkSizeWarningLimit: 1000,
    // Гарантируем уникальные хеши при каждой сборке
    rollupOptions: {
      output: {
        // Используем более длинные хеши для лучшего cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})

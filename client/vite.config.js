import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Генерируем уникальную версию для каждой сборки
const buildVersion = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Плагин для инъекции версии сборки в HTML
    {
      name: 'inject-build-version',
      transformIndexHtml(html) {
        return html.replace(/__BUILD_VERSION__/g, buildVersion);
      }
    }
  ],
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

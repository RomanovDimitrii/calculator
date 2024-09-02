import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  },
  test: {
    environment: 'jsdom' // необходимо для корректной работы тестов
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});

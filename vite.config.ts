import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ghPages from 'vite-plugin-github-pages';

export default defineConfig({
  plugins: [react(), ghPages()],
  base: 'https://RomanovDimitrii.github.io/calculator'
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

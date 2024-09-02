import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://RomanovDimitrii.github.io/calculator',
  root: 'src',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  }
});

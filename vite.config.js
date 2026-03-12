import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    port: 8000,
    host: '0.0.0.0', // 允许外部访问
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});

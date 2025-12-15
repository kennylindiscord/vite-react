// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Frontend requests to /api/... will be forwarded to the backend (http://localhost:4000)
      '/api': 'http://localhost:4000',
    },
  },
});


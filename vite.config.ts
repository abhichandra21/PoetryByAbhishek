import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    sourcemap: true,
    // Optimize bundle size per section 5 requirements
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          // Separate chunk for Framer Motion to lazy-load (section 12 risk mitigation)
          framer: ['framer-motion']
        }
      }
    }
  }
});
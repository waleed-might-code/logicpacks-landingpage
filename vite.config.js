import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  build: {
    // The Three.js scene is heavy; split heavy libs into their own cache-friendly
    // chunks so a copy tweak doesn't invalidate the whole vendor bundle.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});

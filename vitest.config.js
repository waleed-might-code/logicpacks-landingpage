import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest config for unit + component tests (jsdom).
// Playwright e2e specs live under tests/e2e and are run separately via
// `npm run test:e2e` — they are excluded here so the two runners don't overlap.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/unit/**/*.test.{js,jsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    css: false,
  },
});

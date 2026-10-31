import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';

export default defineConfig({
  plugins: [react()],
  // Docs links public/setup.md only once that file is in the build.
  define: { __HAS_SETUP__: JSON.stringify(existsSync('public/setup.md')) },
  server: { port: 5180, strictPort: true },
});

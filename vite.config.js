import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'build', // Specify the output directory here
  },
  plugins: [react(), tailwindcss()],
});

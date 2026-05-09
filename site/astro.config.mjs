// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://wiggjamie9-afk.github.io',
  base: '/jamie-wigg/',
  vite: {
    plugins: [tailwindcss()]
  }
});
// @ts-check
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

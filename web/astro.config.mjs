// @ts-check
import netlify from '@astrojs/netlify';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

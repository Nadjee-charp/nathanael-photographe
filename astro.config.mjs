// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nathanaelcharpentier.com',
  // Demo GitHub Pages : BASE_PATH=/nathanael-photographe — production : non defini (racine)
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // pages de service : ni dans le plan du site, ni dans Google
      filter: (page) => !/\/(merci|thank-you|404)\/?$/.test(page),
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: 'auto' },
});

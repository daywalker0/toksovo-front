import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2025-09-18',

  app: {
    baseURL: '/toksovo-front/',
    buildAssetsDir: '/_nuxt/', // <- важно, чтобы пути были короче
  },

  // Модули
  modules: ['@pinia/nuxt'],

  // Глобальные стили
  css: ['@/assets/styles/main.scss'],

  // PostCSS
  postcss: {
    plugins: {
      autoprefixer: {},
      'postcss-import': {},
      'postcss-pxtorem': {
        rootValue: 16,
        propList: ['*'],
      },
    },
  },

  // Алиасы для Vite
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
        '@assets': path.resolve(__dirname, 'assets'),
        '@components': path.resolve(__dirname, 'components'),
        '@composables': path.resolve(__dirname, 'composables'),
        '@pages': path.resolve(__dirname, 'pages'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/variables.scss" as *;
          `,
        },
      },
    },
  },
});

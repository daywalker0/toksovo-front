import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2025-09-18',

  // GitHub Pages
  app: {
    // baseURL: '/toksovo-front/', // отключено для локального тестирования
  },

  ssr: false,
  target: 'static',
  nitro: {
    preset: 'static',
  },

  modules: ['@pinia/nuxt'],

  css: ['@/assets/styles/main.scss'],

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

  vite: {
    build: {
      assetsDir: '_nuxt',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
        '@assets': path.resolve(__dirname, 'assets'),
        '@components': path.resolve(__dirname, 'components'),
        '@composables': path.resolve(__dirname, 'composables'),
        '@pages': path.resolve(__dirname, 'pages'),
      },
    },
  },
});

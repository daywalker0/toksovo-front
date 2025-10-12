import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2025-09-18',

  // Базовый URL для GitHub Pages
  app: {
    baseURL: '/toksovo-front/', // обязательно с /
  },

  // Отключаем SSR
  ssr: false,

  // Статическая сборка
  target: 'static',
  nitro: {
    preset: 'static',
    prerender: {
      // отключаем сканирование сайта
      crawl: false,
      routes: [],
    },
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
      // Папка для ассетов
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

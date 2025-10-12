import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2025-09-18',

  // Базовый URL для GitHub Pages
  app: {
    baseURL: '/toksovo-front/', // обязательно с /
    head: {
      title: 'ПОИНТ ТОКСОВО',
      titleTemplate: '%s - Жилой комплекс в Токсово',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Современный жилой комплекс ПОИНТ ТОКСОВО в Токсово. Квартиры, планировки, инфраструктура. Удобное расположение рядом с природой.',
        },
        {
          name: 'keywords',
          content: 'Токсово, жилой комплекс, квартиры, новостройки, Ленинградская область',
        },
        { property: 'og:title', content: 'ПОИНТ ТОКСОВО - Жилой комплекс в Токсово' },
        {
          property: 'og:description',
          content:
            'Современный жилой комплекс ПОИНТ ТОКСОВО в Токсово. Квартиры, планировки, инфраструктура.',
        },
        { property: 'og:type', content: 'website' },
      ],
    },
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

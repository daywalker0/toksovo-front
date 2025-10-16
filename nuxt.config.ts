import { defineNuxtConfig } from 'nuxt/config';
import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  compatibilityDate: '2025-09-18',
  runtimeConfig: {
    public: {
      YANDEX_MAPS_API_KEY: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
    },
  },
  // Базовый URL для GitHub Pages
  app: {
    baseURL: '/toksovo-front/',
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
      routes: [],
    },
  },

  modules: ['@pinia/nuxt'],

  plugins: [{ src: '~/plugins/maps', mode: 'client' }],

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
        '@': fileURLToPath(new URL('.', import.meta.url)),
        '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./components', import.meta.url)),
        '@composables': fileURLToPath(new URL('./composables', import.meta.url)),
        '@pages': fileURLToPath(new URL('./pages', import.meta.url)),
      },
    },
  },
});

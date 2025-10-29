import { defineNuxtConfig } from 'nuxt/config';
import path from 'path';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

export default defineNuxtConfig({
  compatibilityDate: '2025-09-18',
  runtimeConfig: {
    public: {
      YANDEX_MAPS_API_KEY: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
      apiUrl: process.env.NUXT_PUBLIC_API_URL,
      apiToken: process.env.NUXT_PUBLIC_API_TOKEN
    },
  },
  app: {
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

  ssr: false,

  nitro: {
    preset: 'static',
    prerender: {
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
      assetsDir: '_nuxt',
    },
    plugins: [
      // @ts-ignore
      viteImagemin({
        plugins: {
          // @ts-ignore
          jpg: imageminMozjpeg({ quality: 80 }),
          // @ts-ignore
          png: imageminPngquant({ quality: [0.7, 0.8] }),
        },
        makeWebp: {
          plugins: {
            // @ts-ignore
            jpg: imageminWebp({ quality: 80 }),
            // @ts-ignore
            png: imageminWebp({ quality: 80, lossless: false }),
          },
        },
      }),
    ],
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

import { defineNuxtPlugin } from '#app';
import plugin from 'vue-yandex-maps';

const settings = {
  apiKey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || 'f95ebb9f-42ae-4c53-be82-de5a3c134a71',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1',
};

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(plugin, settings);
});

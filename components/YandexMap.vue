<template>
  <div class="yandex-map-wrapper">
    <!-- Контейнер карты -->
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const props = defineProps({
  center: {
    type: Array,
    default: () => [55.76, 37.64], // Москва по умолчанию
  },
  zoom: {
    type: Number,
    default: 10,
  },
  controls: {
    type: Array,
    default: () => ['zoomControl', 'geolocationControl'], // пример
  },
});

const emits = defineEmits(['ready', 'error']);

const mapContainer = ref(null);
const mapInstance = ref(null);
const ymapsRef = ref(null);
const isMapReady = ref(false);

/** helper: загружает скрипт ymaps и ждёт ready */
async function loadYandexMaps(apiKey) {
  if (typeof window === 'undefined')
    throw new Error('Yandex Maps must be loaded on client side only');
  if (window.ymaps) {
    return window.ymaps;
  }

  // динамическая вставка скрипта
  const src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${encodeURIComponent(apiKey)}`;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(null);
    s.onerror = e => reject(new Error('Failed to load Yandex Maps script'));
    document.head.appendChild(s);
  });
  // ymaps загружается на window
  // ждём ymaps.ready
  return await new Promise(resolve => {
    window.ymaps.ready(() => resolve(window.ymaps));
  });
}

/** создаёт карту и базовые контролы */
function createMap(ymaps, container, center, zoom, controls = []) {
  const map = new ymaps.Map(
    container,
    {
      center,
      zoom,
      controls: [],
    },
    {
      autoFitToViewport: 'always',
      minZoom: 15,
    }
  );

  // добавить контролы, если нужно
  if (controls.includes('zoomControl')) map.controls.add('zoomControl');
  if (controls.includes('typeSelector')) map.controls.add('typeSelector');
  if (controls.includes('geolocationControl')) map.controls.add('geolocationControl');

  return map;
}

/** lifecycle */
onMounted(async () => {
  // SSR safe: работать только в браузере
  if (!process.client) return;

  try {
    // получаем apiKey из runtimeConfig.public
    const runtimeConfig = useRuntimeConfig();
    const apiKey =
      runtimeConfig.public.YANDEX_MAPS_API_KEY ||
      process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY ||
      'f95ebb9f-42ae-4c53-be82-de5a3c134a71' ||
      '';

    // Отладочная информация
    console.log('Runtime config:', runtimeConfig.public);
    console.log('Process env:', process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY);
    console.log('Final API key:', apiKey);

    if (!apiKey) {
      console.error(
        'API ключ Яндекс.Карт не найден. Установите NUXT_PUBLIC_YANDEX_MAPS_API_KEY в .env файле'
      );
      return;
    }

    ymapsRef.value = await loadYandexMaps(apiKey);

    // ждём, что DOM готов
    await nextTick();

    if (!mapContainer.value) {
      console.error('Контейнер карты не найден');
      return;
    }

    mapInstance.value = createMap(
      ymapsRef.value,
      mapContainer.value,
      props.center,
      props.zoom,
      props.controls
    );

    // ждём полной инициализации карты
    await new Promise(resolve => {
      mapInstance.value.events.add('ready', () => {
        isMapReady.value = true;
        resolve();
      });
    });

    emit('ready', { map: mapInstance.value, ymaps: ymapsRef.value });
  } catch (error) {
    console.error('Ошибка при инициализации карты:', error);
    emit('error', error);
  }
});

onBeforeUnmount(() => {
  try {
    if (mapInstance.value) {
      mapInstance.value.destroy();
      mapInstance.value = null;
    }
  } catch (e) {
    // ignore
  }
});
</script>

<style scoped>
.yandex-map-wrapper {
  position: relative;
  width: 100%;
  filter: grayscale(100%) brightness(100%) contrast(100%);
  height: 100%;
}

/* контейнер карты занимает весь блок */
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ymaps-2-1-79-controls__control) {
  inset: 340px auto auto 97% !important;
}
</style>

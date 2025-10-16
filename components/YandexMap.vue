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
  markers: {
    type: Array,
    default: () => [], // [{ id, coords: [lat, lon], hint, balloon, iconUrl, size:[w,h] }]
  },
  controls: {
    type: Array,
    default: () => ['zoomControl', 'geolocationControl'], // пример
  },
});

const emits = defineEmits(['marker-clicked', 'ready', 'error']);

const mapContainer = ref(null);
const mapInstance = ref(null);
const ymapsRef = ref(null);
const markersCollection = new Map(); // id -> placemark
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
    }
  );

  // добавить контролы, если нужно
  if (controls.includes('zoomControl')) map.controls.add('zoomControl');
  if (controls.includes('typeSelector')) map.controls.add('typeSelector');
  if (controls.includes('geolocationControl')) map.controls.add('geolocationControl');

  return map;
}

/** добавляет placemark на карту */
function addPlacemark(ymaps, id, marker) {
  if (!mapInstance.value || !isMapReady.value) {
    console.warn('Карта не готова для добавления маркеров');
    return;
  }

  // marker: { id, coords, hint, balloon, iconUrl, size:[w,h] }
  const options = {
    hintContent: marker.hint || '',
    balloonContent: marker.balloon || '',
  };

  if (marker.iconUrl) {
    options.iconLayout = 'default#image';
    options.iconImageHref = marker.iconUrl;
    options.iconImageSize = marker.size || [30, 42];
    options.iconImageOffset = marker.offset || [-15, -42];
  }

  const placemark = new ymaps.Placemark(
    marker.coords,
    {
      hintContent: marker.hint || '',
      balloonContent: marker.balloon || '',
    },
    options
  );

  // событие клика
  placemark.events.add('click', () => {
    // emit наружу
    emit('marker-clicked', marker);
    // открыть балун
    placemark.balloon.open();
  });

  try {
    mapInstance.value.geoObjects.add(placemark);
    markersCollection.set(id, placemark);
  } catch (error) {
    console.error('Ошибка при добавлении маркера:', error);
  }
}

/** удаляет все маркеры */
function clearPlacemarks() {
  if (!mapInstance.value || !isMapReady.value) {
    markersCollection.clear();
    return;
  }

  try {
    markersCollection.forEach(placemark => {
      mapInstance.value.geoObjects.remove(placemark);
    });
    markersCollection.clear();
  } catch (error) {
    console.error('Ошибка при очистке маркеров:', error);
    markersCollection.clear();
  }
}

/** lifecycle */
onMounted(async () => {
  // SSR safe: работать только в браузере
  if (!process.client) return;

  try {
    // получаем apiKey из runtimeConfig.public
    const runtimeConfig = useRuntimeConfig();
    const apiKey = runtimeConfig.public.YANDEX_MAPS_API_KEY || '';

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

    // добавить начальные маркеры только после готовности карты
    props.markers.forEach(m => {
      const id = m.id ?? `${m.coords.join(',')}-${Math.random().toString(36).slice(2, 6)}`;
      addPlacemark(ymapsRef.value, id, m);
    });

    emit('ready', { map: mapInstance.value, ymaps: ymapsRef.value });
  } catch (error) {
    console.error('Ошибка при инициализации карты:', error);
    emit('error', error);
  }
});

onBeforeUnmount(() => {
  try {
    clearPlacemarks();
    if (mapInstance.value) {
      mapInstance.value.destroy();
      mapInstance.value = null;
    }
  } catch (e) {
    // ignore
  }
});

// следим за props.markers и синхронизируем (упрощённо)
watch(
  () => props.markers,
  newVal => {
    if (!ymapsRef.value || !mapInstance.value || !isMapReady.value) return;

    try {
      // простая стратегия: пересоздать коллекцию
      clearPlacemarks();
      newVal.forEach(m => {
        const id = m.id ?? `${m.coords.join(',')}-${Math.random().toString(36).slice(2, 6)}`;
        addPlacemark(ymapsRef.value, id, m);
      });
    } catch (error) {
      console.error('Ошибка при обновлении маркеров:', error);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.yandex-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* контейнер карты занимает весь блок */
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
</style>

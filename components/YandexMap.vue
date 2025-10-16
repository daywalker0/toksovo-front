<template>
  <div class="yandex-map-wrapper">
    <!-- Твоя верхняя панель — любой HTML/CSS -->
    <div class="top-panel">
      <slot name="top-panel">
        <!-- пример содержимого панели -->
        <div class="panel-inner">
          <button @click="fitAll">Показать все маркеры</button>
          <input v-model="searchQuery" placeholder="Поиск..." @keydown.enter="search" />
        </div>
      </slot>
    </div>

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

// реактивные переменные для примера панели
const searchQuery = ref('');

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

/** подогнать карту по всем маркерам */
function fitBoundsToAll() {
  if (!mapInstance.value || !isMapReady.value || !ymapsRef.value) return;

  const geoObjects = Array.from(markersCollection.values());
  if (!geoObjects.length) return;

  try {
    const collection = new ymapsRef.value.GeoObjectCollection();
    geoObjects.forEach(p => collection.add(p));
    const bounds = collection.getBounds();
    if (bounds) {
      mapInstance.value.setBounds(bounds, { checkZoomRange: true, zoomMargin: 20 });
    }
  } catch (error) {
    console.error('Ошибка при подгонке карты:', error);
  }
}

/** expose for template */
function fitAll() {
  fitBoundsToAll();
}

function search() {
  if (!mapInstance.value || !isMapReady.value) return;

  // простой пример: находим первый маркер по hint, центрируем
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return;

  try {
    for (const [id, placemark] of markersCollection.entries()) {
      const data = placemark.properties.getAll();
      const hint = (data.hintContent || '').toLowerCase();
      if (hint.includes(q)) {
        const coords = placemark.geometry.getCoordinates();
        mapInstance.value.setCenter(coords, Math.max(mapInstance.value.getZoom(), 12));
        placemark.balloon.open();
        return;
      }
    }
  } catch (error) {
    console.error('Ошибка при поиске:', error);
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

/* верхняя панель — фиксированная поверх карты */
.top-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 12px;
  z-index: 999; /* над картой */
  display: flex;
  justify-content: center;
  pointer-events: none; /* чтобы панель не блокировала события по умолчанию */
}

.top-panel .panel-inner {
  pointer-events: auto; /* контент панели интерактивен */
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  gap: 8px;
  align-items: center;
}

/* контейнер карты занимает весь оставшийся блок */
.map-container {
  width: 100%;
  height: 100vh; /* можно переопределить при использовании */
  border-radius: 8px;
  overflow: hidden;
}
</style>

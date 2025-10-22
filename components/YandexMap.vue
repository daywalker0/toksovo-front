<template>
  <div class="yandex-map-wrapper">
    <div ref="mapContainer" class="map-container"></div>

    <!-- Кастомные кнопки зума -->
    <div v-if="showZoomControls" class="custom-zoom">
      <button class="button-zoom button-plus" @click="zoomIn">+</button>
      <button class="button-zoom button-minus" @click="zoomOut">−</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  center: Array,
  zoom: Number,
  locations: {
    type: Array,
    default: () => [],
  },
  activeCategories: {
    type: Array,
    default: () => [],
  },
  disableInteraction: {
    type: Boolean,
    default: false,
  },
  showZoomControls: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['ready', 'error']);

const mapContainer = ref(null);
let map = null;
let ymaps = null;

// Список всех маркеров (по id)
const allMarkers = new Map();

onMounted(async () => {
  if (!process.client) return;

  const apiKey = 'f95ebb9f-42ae-4c53-be82-de5a3c134a71';

  try {
    // Ждем, пока контейнер появится в DOM и получит свои размеры
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 60; // 3 секунды максимум (60 * 50ms)

      const checkContainer = () => {
        // Проверяем наличие ref и его размеры
        if (
          mapContainer.value &&
          mapContainer.value.offsetWidth > 0 &&
          mapContainer.value.offsetHeight > 0
        ) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(
            new Error('Map container failed to initialize: element not found or has no dimensions')
          );
        } else {
          attempts++;
          setTimeout(checkContainer, 50);
        }
      };

      // Начинаем проверку после nextTick
      nextTick(() => {
        checkContainer();
      });
    });

    ymaps = await new Promise((resolve, reject) => {
      if (window.ymaps) return resolve(window.ymaps);
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${apiKey}`;
      script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
      script.onerror = reject;
      document.head.appendChild(script);
    });

    map = new ymaps.Map(mapContainer.value, {
      center: props.center,
      zoom: props.zoom,
      controls: [],
    });

    map.behaviors.disable('scrollZoom');
    map.options.set('minZoom', 10);
    map.options.set('maxZoom', 19);

    // Отключаем взаимодействие, если нужно (для превью)
    if (props.disableInteraction) {
      map.behaviors.disable(['drag', 'dblClickZoom', 'multiTouch']);
    }

    createPlacemarksFromLocations();
    updateVisibleMarkers();

    emit('ready', { map, ymaps });
  } catch (err) {
    emit('error', err);
  }
});

// при изменении locations пересоздаём плейсмарки
watch(
  () => props.locations,
  newLocs => {
    recreatePlacemarks(newLocs);
    updateVisibleMarkers();
  },
  { deep: true }
);

// при изменении активных категорий обновляем отображение
watch(
  () => props.activeCategories,
  () => updateVisibleMarkers(),
  { deep: true }
);

function createPlacemarksFromLocations() {
  props.locations.forEach(loc => {
    if (!allMarkers.has(loc.id)) {
      const placemark = createPlacemarkFor(loc);
      allMarkers.set(loc.id, { id: loc.id, category: loc.category, placemark, added: false });
    }
  });
}

function recreatePlacemarks(newLocs) {
  const newIds = new Set(newLocs.map(l => l.id));

  for (const [id, data] of allMarkers.entries()) {
    if (!newIds.has(id)) {
      if (data.added) map.geoObjects.remove(data.placemark);
      allMarkers.delete(id);
    }
  }

  newLocs.forEach(loc => {
    if (!allMarkers.has(loc.id)) {
      const placemark = createPlacemarkFor(loc);
      allMarkers.set(loc.id, { id: loc.id, category: loc.category, placemark, added: false });
    }
  });
}

function createPlacemarkFor(loc) {
  const iconSize = 40; // размер круга
  const iconInnerSize = 20; // размер иконки внутри
  const iconOffset = (iconSize - iconInnerSize) / 2;

  const bgColor = loc.color || '#4C5E36'; // цвет круга
  // предполагаем, что loc.icon — это строка SVG, где fill="white" для внутренних элементов
  const innerSvg = loc.icon || '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2}" fill="${bgColor}" />
      <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2 - 0.5}" fill="none" stroke="white" stroke-opacity="0.3"/>
      <g transform="translate(${iconOffset}, ${iconOffset}) scale(${iconInnerSize / 20})">
        ${innerSvg}
      </g>
    </svg>
  `;

  const placemark = new ymaps.Placemark(
    loc.coords,
    {
      hintContent: loc.name || loc.title || 'Локация',
    },
    {
      iconLayout: 'default#image',
      iconImageHref: 'data:image/svg+xml;base64,' + btoa(svg),
      iconImageSize: [iconSize, iconSize],
      iconImageOffset: [-iconSize / 2, -iconSize / 2],
    }
  );

  placemark.events.add('click', () => {
    map.setCenter(loc.coords, 17, { duration: 300 });
  });

  return placemark;
}

function updateVisibleMarkers() {
  if (!map) return;

  allMarkers.forEach(markerData => {
    const shouldBeVisible = props.activeCategories.includes(markerData.category);
    if (shouldBeVisible && !markerData.added) {
      map.geoObjects.add(markerData.placemark);
      markerData.added = true;
    } else if (!shouldBeVisible && markerData.added) {
      map.geoObjects.remove(markerData.placemark);
      markerData.added = false;
    }
  });
}

// --- Кастомный зум ---
function zoomIn() {
  if (!map) return;
  map.setZoom(Math.min(map.getZoom() + 1, 19), { duration: 200 });
}
function zoomOut() {
  if (!map) return;
  map.setZoom(Math.max(map.getZoom() - 1, 1), { duration: 200 });
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.yandex-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
}

.custom-zoom {
  position: absolute;
  right: 20px;
  top: 50%;
  display: flex;
  flex-direction: column;
  z-index: 10;
  transform: translateY(-50%);

  @media (max-width: $breakpoint-x) {
    top: auto;
    bottom: 10%;
  }
}

.button-zoom {
  width: 40px;
  height: 40px;
  background: #fff;
  border: none;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: color 0.2s ease;

  &:hover {
    color: #ff6b35;
  }
}

.button-plus {
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
}

.button-minus {
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}
</style>

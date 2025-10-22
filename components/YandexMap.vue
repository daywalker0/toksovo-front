<template>
  <div class="yandex-map-wrapper">
    <div ref="mapContainer" class="map-container"></div>

    <!-- Отладочная информация для мобильных устройств -->
    <div v-if="debugInfo" class="debug-info">
      <div class="debug-item">Статус: {{ debugInfo.status }}</div>
      <div class="debug-item">Размеры: {{ debugInfo.dimensions }}</div>
      <div class="debug-item">Ошибка: {{ debugInfo.error || 'Нет' }}</div>
    </div>

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

// Отладочная информация для мобильных устройств
const debugInfo = ref(null);

onMounted(async () => {
  if (!process.client) return;

  const apiKey = 'f95ebb9f-42ae-4c53-be82-de5a3c134a71';

  // Показываем отладочную информацию на мобильных устройствах
  const isMobile = window.innerWidth <= 599;
  if (isMobile) {
    debugInfo.value = {
      status: 'Инициализация...',
      dimensions: 'Проверка...',
      error: null
    };
  }

  try {
    // Ждем, пока контейнер появится в DOM и получит свои размеры
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100; // Увеличиваем время ожидания для мобильных устройств

      const checkContainer = () => {
        // Принудительно устанавливаем размеры для мобильных устройств
        if (isMobile && mapContainer.value) {
          const parentElement = mapContainer.value.parentElement;
          if (parentElement) {
            const parentWidth = parentElement.offsetWidth || window.innerWidth;
            const parentHeight = parentElement.offsetHeight || window.innerHeight;
            
            mapContainer.value.style.width = `${parentWidth}px`;
            mapContainer.value.style.height = `${parentHeight}px`;
            mapContainer.value.style.minHeight = `${parentHeight}px`;
          }
        }
        
        // Проверяем наличие ref и его размеры
        if (
          mapContainer.value &&
          mapContainer.value.offsetWidth > 0 &&
          mapContainer.value.offsetHeight > 0
        ) {
          console.log('Map container ready:', {
            width: mapContainer.value.offsetWidth,
            height: mapContainer.value.offsetHeight
          });
          
          if (isMobile && debugInfo.value) {
            debugInfo.value.status = 'Контейнер готов';
            debugInfo.value.dimensions = `${mapContainer.value.offsetWidth}x${mapContainer.value.offsetHeight}`;
          }
          
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error('Map container failed to initialize:', {
            element: mapContainer.value,
            width: mapContainer.value?.offsetWidth,
            height: mapContainer.value?.offsetHeight,
            parentElement: mapContainer.value?.parentElement,
            parentWidth: mapContainer.value?.parentElement?.offsetWidth,
            parentHeight: mapContainer.value?.parentElement?.offsetHeight
          });
          
          if (isMobile && debugInfo.value) {
            debugInfo.value.status = 'Ошибка контейнера';
            debugInfo.value.error = `Контейнер: ${mapContainer.value ? 'найден' : 'не найден'}, Размеры: ${mapContainer.value?.offsetWidth || 0}x${mapContainer.value?.offsetHeight || 0}`;
          }
          
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
      script.onload = () => {
        console.log('Yandex Maps script loaded');
        if (isMobile && debugInfo.value) {
          debugInfo.value.status = 'Скрипт загружен';
        }
        window.ymaps.ready(() => {
          console.log('Yandex Maps ready');
          if (isMobile && debugInfo.value) {
            debugInfo.value.status = 'API готово';
          }
          resolve(window.ymaps);
        });
      };
      script.onerror = (error) => {
        console.error('Yandex Maps script error:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });

    console.log('Creating map with container:', mapContainer.value);
    console.log('Container dimensions:', {
      width: mapContainer.value.offsetWidth,
      height: mapContainer.value.offsetHeight
    });

    map = new ymaps.Map(mapContainer.value, {
      center: props.center,
      zoom: props.zoom,
      controls: [],
    });

    console.log('Map created successfully:', map);

    if (isMobile && debugInfo.value) {
      debugInfo.value.status = 'Карта создана';
    }

    map.behaviors.disable('scrollZoom');
    map.options.set('minZoom', 10);
    map.options.set('maxZoom', 19);

    // Отключаем взаимодействие, если нужно (для превью)
    if (props.disableInteraction) {
      map.behaviors.disable(['drag', 'dblClickZoom', 'multiTouch']);
    }

    createPlacemarksFromLocations();
    updateVisibleMarkers();

    // Принудительно обновляем размеры карты для мобильных устройств
    setTimeout(() => {
      if (map && mapContainer.value) {
        // Принудительно устанавливаем размеры для мобильных устройств
        if (isMobile) {
          const parentElement = mapContainer.value.parentElement;
          if (parentElement) {
            const parentWidth = parentElement.offsetWidth || window.innerWidth;
            const parentHeight = parentElement.offsetHeight || window.innerHeight;
            
            mapContainer.value.style.width = `${parentWidth}px`;
            mapContainer.value.style.height = `${parentHeight}px`;
            mapContainer.value.style.minHeight = `${parentHeight}px`;
          }
        }
        
        map.container.fitToViewport();
        console.log('Map container fitted to viewport');
        
        if (isMobile && debugInfo.value) {
          debugInfo.value.status = 'Карта готова';
          debugInfo.value.dimensions = `${mapContainer.value.offsetWidth}x${mapContainer.value.offsetHeight}`;
        }
      }
    }, 100);

    emit('ready', { map, ymaps });
  } catch (err) {
    console.error('Map initialization error:', err);
    emit('error', err);
    
    // Добавляем fallback для мобильных устройств
    if (mapContainer.value) {
      mapContainer.value.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #f0f0f0;
          color: #666;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <p>Карта временно недоступна</p>
            <p style="font-size: 14px; margin-top: 10px;">Попробуйте обновить страницу</p>
          </div>
        </div>
      `;
    }
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
  
  @media (max-width: 599px) {
    width: 100vw !important;
    height: 100vh !important;
    min-height: 100vh !important;
    position: relative;
  }
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

.debug-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 1000;
  max-width: 200px;
}

.debug-item {
  margin-bottom: 5px;
  
  &:last-child {
    margin-bottom: 0;
  }
}
</style>

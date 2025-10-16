<template>
  <div class="yandex-map-wrapper">
    <!-- Контейнер карты -->
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const mapContainer = ref(null);

onMounted(async () => {
  if (!process.client) return;

  await nextTick();
  if (!mapContainer.value) return;

  const apiKey = 'f95ebb9f-42ae-4c53-be82-de5a3c134a71'; // проверь ключ

  // Загружаем скрипт Yandex Maps
  await new Promise((resolve, reject) => {
    if (window.ymaps) return resolve(window.ymaps);
    const s = document.createElement('script');
    s.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${apiKey}`;
    s.onload = () => {
      window.ymaps.ready(() => resolve(window.ymaps));
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });

  const ymaps = window.ymaps;

  const map = new ymaps.Map(mapContainer.value, {
    center: [60.193412, 30.52625],
    zoom: 16,
    controls: ['zoomControl'],
  });

  map.behaviors.disable('scrollZoom');

  const placemark1 = new ymaps.Placemark([60.193413, 30.52626], {
    hintContent: 'Маркер 1',
    balloonContent: 'Здесь первый маркер',
  });

  const placemark2 = new ymaps.Placemark([60.193415, 30.52628], {
    hintContent: 'Маркер 2',
    balloonContent: 'Здесь второй маркер',
  });

  map.geoObjects.add(placemark1);
  map.geoObjects.add(placemark2);
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}

.yandex-map-wrapper {
  position: relative;
  width: 100%;
  filter: grayscale(100%) brightness(100%) contrast(100%);
  height: 100%;
}

:deep(.ymaps-2-1-79-controls__control) {
  inset: 340px auto auto 97% !important;
}
</style>

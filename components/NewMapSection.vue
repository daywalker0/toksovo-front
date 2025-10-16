<template>
  <div>
    <YandexMap
      :center="mapCenter"
      :zoom="mapZoom"
      :markers="mapMarkers"
      @marker-clicked="onMarkerClicked"
      @ready="onMapReady"
      @error="onMapError"
    >
      <template #top-panel>
        <!-- Твоя кастомная панель -->
        <div class="panel-inner-custom">
          <button @click="addRandomMarker">Добавить маркер</button>
          <button @click="clear">Очистить</button>
        </div>
      </template>
    </YandexMap>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import YandexMap from '~/components/YandexMap.vue';

// Props для настройки карты
const props = defineProps({
  center: {
    type: Array,
    default: () => [60.193412, 30.52625], // Координаты Токсово по умолчанию
  },
  zoom: {
    type: Number,
    default: 1, // Увеличение для Токсово
  },
  markers: {
    type: Array,
    default: () => [],
  },
});

// Настройки карты
const mapCenter = props.center;
const mapZoom = props.zoom;

// Объединяем переданные маркеры с дефолтными
const defaultMarkers = [
  {
    id: 'toksovo-center',
    coords: [60.15, 30.5],
    hint: 'Центр Токсово',
    balloon: '<b>Токсово</b><br>Ленинградская область',
    iconUrl: '', // можно оставить пустым
  },
  {
    id: 'point-toksovo',
    coords: [60.16, 30.52],
    hint: 'ЖК ПОИНТ ТОКСОВО',
    balloon: '<b>ЖК ПОИНТ ТОКСОВО</b><br>Современный жилой комплекс',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    size: [32, 32],
  },
];

const mapMarkers = ref([...defaultMarkers, ...props.markers]);

function onMarkerClicked(marker) {
  console.log('Клик по маркеру:', marker);
}

function onMapReady({ map, ymaps }) {
  console.log('Карта готова', map, ymaps);
}

function onMapError(error) {
  console.error('Ошибка карты:', error);
}

function addRandomMarker() {
  // Добавляем маркер в районе Токсово
  const lat = 60.1 + Math.random() * 0.1; // ±0.05 градуса от центра Токсово
  const lon = 30.4 + Math.random() * 0.2; // ±0.1 градуса от центра Токсово
  mapMarkers.value.push({
    id: 'm' + Math.random().toString(36).slice(2, 6),
    coords: [lat, lon],
    hint: 'Новый маркер',
    balloon: 'Добавлен программно в районе Токсово',
  });
}

function clear() {
  mapMarkers.value = [];
}
</script>

<style>
.panel-inner-custom {
  background: rgba(255, 255, 255, 0.95);
  padding: 6px;
  border-radius: 8px;
  display: flex;
  gap: 8px;
}
</style>

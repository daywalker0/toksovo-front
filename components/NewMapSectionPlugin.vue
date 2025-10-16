<template>
  <client-only>
    <div class="map-container">
      <YandexMap
        :coordinates="[37.617644, 55.755819]"
        :zoom="9"
        :settings="mapSettings"
        width="100%"
        height="100vh"
      >
        <YandexMarker :coordinates="[37.617644, 55.755819]" marker-id="0" />
      </YandexMap>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { YandexMap, YandexMarker } from 'vue-yandex-maps';

const mapSettings = {
  location: {
    center: [37.617644, 55.755819],
    zoom: 9,
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

/* Простые стили для карты */
.map-container :deep(.ymaps-2-1-79-map) {
  width: 100% !important;
  height: 100vh !important;
}

.map-container :deep(.ymaps-2-1-79-map > div) {
  width: 100% !important;
  height: 100vh !important;
}

.map-container :deep(.ymaps-2-1-79-map-bg) {
  width: 100% !important;
  height: 100vh !important;
}

.map-container :deep(.ymaps-2-1-79-islets_map-lang-ru) {
  width: 100% !important;
  height: 100vh !important;
}
</style>

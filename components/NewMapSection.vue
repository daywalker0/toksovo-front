<template>
  <div class="map">
    <!-- Панель категорий -->
    <div class="map__sidebar">
      <div class="map__sidebar-content">
        <h3 class="map__sidebar-title" @click="toggleSidebar">
          Локации
          <span class="map__m" :class="{ 'map__m--open': isSidebarOpen }">
            <svg
              width="11"
              height="8"
              viewBox="0 0 11 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.71429 0.497991C5.11466 -0.0105564 5.88534 -0.0105563 6.28572 0.497991L10.7209 6.13141C11.2373 6.78739 10.7701 7.75 9.93517 7.75L1.06483 7.75C0.229947 7.75 -0.237333 6.78739 0.279119 6.13141L4.71429 0.497991Z"
                fill="#4C5E36"
              />
            </svg>
          </span>
        </h3>
        <ul v-show="isSidebarOpen" class="map__categories">
          <li v-for="cat in categories" :key="cat.name" class="map__category">
            <div class="map__category-name">
              <img :src="cat.icon" alt="" class="map__icon" />
              <AnimatedLink
                :text="cat.name"
                customClass="map__category-name-link"
                hoverColor="#ff6b35"
              />
            </div>
            <span class="map__category-count">{{ cat.count }}</span>
          </li>
        </ul>
      </div>
    </div>

    <YandexMap
      :center="mapCenter"
      :zoom="mapZoom"
      :controls="['zoomControl']"
      @ready="onMapReady"
      @error="onMapError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import YandexMap from '~/components/YandexMap.vue';
import AnimatedLink from './Common/AnimatedLink.vue';
import culture from '@/assets/img/icons/locations/culture.svg';
import medicine from '@/assets/img/icons/locations/med.svg';
import education from '@/assets/img/icons/locations/education.svg';
import finance from '@/assets/img/icons/locations/finance.svg';
import torg from '@/assets/img/icons/locations/torg.svg';
import food from '@/assets/img/icons/locations/food.svg';
import sport from '@/assets/img/icons/locations/sport.svg';
import services from '@/assets/img/icons/locations/services.svg';

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
});

// Настройки карты
const mapCenter = props.center;
const mapZoom = props.zoom;

// Состояние сайдбара
const isSidebarOpen = ref(true);

// Категории локаций
const categories = [
  { name: 'Культура и отдых', count: 12, icon: culture, category: 'culture' },
  { name: 'Медицина', count: 7, icon: medicine, category: 'medicine' },
  { name: 'Образование', count: 9, icon: education, category: 'education' },
  { name: 'Финансы', count: 4, icon: finance, category: 'finance' },
  { name: 'Торговля', count: 23, icon: torg, category: 'torg' },
  { name: 'Еда', count: 19, icon: food, category: 'food' },
  { name: 'Спорт', count: 8, icon: sport, category: 'sport' },
  { name: 'Услуги', count: 20, icon: services, category: 'services' },
];

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function onMapReady({ map, ymaps }) {
  console.log('Карта готова', map, ymaps);
}

function onMapError(error) {
  console.error('Ошибка карты:', error);
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.map {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }
  font-family: 'Akrobat';

  &__sidebar {
    position: absolute;
    top: 44px;
    left: 44px;
    border-radius: 7px;
    z-index: 20;
    border: 1px solid $utility-color-1;
    background-color: $bg-color-2;
    min-width: 305px;
    color: $accent-color-green;
  }

  &__sidebar-content {
    padding: 24px;
  }

  &__sidebar-title {
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    transition: color 0.2s ease;
    font-size: 22px;
  }

  &__m {
    display: inline-block;
    font-size: 12px;
    transition: transform 0.3s ease;
    color: #666;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__categories {
    list-style: none;
    margin: 0;
    padding: 0;
    transition:
      opacity 0.3s ease,
      max-height 0.3s ease;
    overflow: hidden;
    margin-top: 20px;
  }

  &__category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    line-height: 140%;
    padding: 8px 0;
    width: 100%;

    // Меняем цвет счетчика при наведении на название категории
    .map__category-name:hover ~ .map__category-count {
      color: $accent-color-orange;
      transition: color 0.3s ease;
    }
  }

  &__category-name {
    display: flex;
    align-items: center;

    &-link {
      margin-left: 10px;
    }

    &:hover {
      .map__icon {
        filter: hue-rotate(20deg) saturate(2) brightness(1.2);
        transition: filter 0.3s ease;
      }
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
  }
}
</style>

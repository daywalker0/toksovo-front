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
              <span>{{ cat.name }}</span>
            </div>
            <span class="map__category-count">{{ cat.count }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Контейнер карты -->
    <div class="map__container">
      <div class="map__content" :style="{ transform: `scale(${zoom})` }">
        <img :src="mapBgImg" alt="Map" class="map__image" />

        <!-- Пины -->
        <div
          v-for="pin in pins"
          :key="pin.id"
          class="map__pin"
          :style="{
            top: `${pin.y}%`,
            left: `${pin.x}%`,
            transform: `translate(-50%, -100%)`,
          }"
          @click="selectPin(pin)"
        >
          <img :src="pin.icon" :alt="pin.category" class="map__pin-icon" />
        </div>
      </div>
    </div>

    <!-- Кнопки масштабирования -->
    <div class="map__controls">
      <button class="map__button button-plus" @click="zoomIn">+</button>
      <button class="map__button button-minus" @click="zoomOut">–</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import mapBgImg from '@/assets/img/map-bg.png';
import culture from '../assets/img/icons/locations/culture.svg';
import medicine from '../assets/img/icons/locations/med.svg';
import education from '../assets/img/icons/locations/education.svg';
import finance from '../assets/img/icons/locations/finance.svg';
import torg from '../assets/img/icons/locations/torg.svg';
import food from '../assets/img/icons/locations/food.svg';
import sport from '../assets/img/icons/locations/sport.svg';
import services from '../assets/img/icons/locations/services.svg';

// import culturePin from "../assets/img/icons/locations/pins/culture.svg";
// import medicinePin from "../assets/img/icons/locations/pins/medicine.svg";
// import educationPin from "../assets/img/icons/locations/pins/education.svg";
import financePin from '../assets/img/icons/locations/pins/finance.svg';
import torgPin from '../assets/img/icons/locations/pins/torg.svg';
import foodPin from '../assets/img/icons/locations/pins/food.svg';
import sportPin from '../assets/img/icons/locations/pins/sport.svg';
import servicesPin from '../assets/img/icons/locations/pins/services.svg';

const zoom = ref(1);

const isSidebarOpen = ref(true);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.2, 2);
}
function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.2, 1);
}

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

const pins = [
  { id: 0, x: 47, y: 16, icon: sportPin, category: 'sport' },
  { id: 1, x: 48, y: 42, icon: torgPin, category: 'torg' },
  { id: 2, x: 53, y: 41, icon: financePin, category: 'finance' },
  { id: 3, x: 54, y: 43, icon: servicesPin, category: 'services' },
  { id: 4, x: 46, y: 50, icon: torgPin, category: 'torg' },
  { id: 5, x: 38, y: 59, icon: foodPin, category: 'food' },
];

function selectPin(pin) {
  alert(`Вы выбрали: ${pin.category}`);
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
  }

  &__category-name {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    transform-origin: center center;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  .map__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) brightness(100%) contrast(100%);
    position: relative;
  }

  &__pin {
    position: absolute;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $accent-color-green;
    border-radius: 50%;
    transform-origin: center center;
    border: 1px solid rgba(250, 250, 250, 0.3);
  }

  &__pin-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }

  &__controls {
    position: absolute;
    top: 0;
    right: 1rem;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 20;
    gap: 1px;
  }

  &__button {
    width: 40px;
    height: 40px;
    background: #fff;
    border: none;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transition: 0.2s ease;

    &:hover {
      transition: 0.2s ease;
      color: #ff6b35;
    }
  }

  .button-plus {
    border-bottom: 1px solid #d9d9d9;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
  }

  .button-minus {
    border-top: 1px solid #d9d9d9;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
  }
}
</style>

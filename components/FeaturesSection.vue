<template>
  <section class="tabs-slider-section section">
    <div class="tabs-slider-section__container container">
      <TitleNew text="Особенности" class="tabs-slider-section__title" />
      
      <!-- Табы -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="setActiveTab(tab.id)"
        >
          {{ tab.title }}
        </button>
      </div>

      <!-- Контент табов -->
      <div class="tab-content">
        <div
          v-for="tab in tabs"
          :key="`content-${tab.id}`"
          :class="['tab-pane', { active: activeTab === tab.id }]"
        >
          <DefaultSlider
            :slides="getTabSlides(tab.id)"
            :slides-per-view="4"
            :space-between="45"
            :show-navigation="true"
            :hide-navigation-on-mobile="true"
            :breakpoints="customBreakpoints"
          >
            <template #slide="{ slide }">
              <div class="custom-slide">
                <div class="slide-image" :style="{ backgroundImage: `url(${slide.image})` }">
                  <div class="slide-text">{{ slide.text }}</div>
                </div>
              </div>
            </template>
          </DefaultSlider>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import TitleNew from './Common/TitleNew.vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import slideImg from '@/assets/img/features-slide-bg.jpg'

const activeTab = ref(1);

// Определяем табы
const tabs = ref([
  { id: 1, title: 'Природа и локация' },
  { id: 2, title: 'Отдых и оздоровление' },
  { id: 3, title: 'Спорт и активность' },
  { id: 4, title: 'Интерьеры' },
  { id: 5, title: 'Инфраструктура' }
]);

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};

// Кастомные breakpoints чтобы всегда показывать нужное количество слайдов
const customBreakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 8
  },
  428: {
    slidesPerView: 2,
    spaceBetween: 8
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 20
  },
  1240: {
    slidesPerView: 4,
    spaceBetween: 45
  }
};

// Моковые данные для слайдов
const getTabSlides = (tabId) => {
  const mockSlides = [
    {
      id: 1,
      image: slideImg,
      text: 'Подогреваемые бассейны во дворе'
    },
    {
      id: 2,
      image: slideImg,
      text: 'Банный комплекс'
    },
    {
      id: 3,
      image: slideImg,
      text: 'Зоны отдыха с шезлонгами'
    },
    {
      id: 4,
      image: slideImg,
      text: 'Зона барбекю'
    },
    {
      id: 5,
      image: slideImg,
      text: 'Зоны отдыха с шезлонгами'
    },
    {
      id: 6,
      image: slideImg,
      text: 'Банный комплекс'
    }
  ];

  switch (tabId) {
    case 1:
      return mockSlides.slice(0, 6);
    case 2:
      return mockSlides.slice(0, 4);
    case 3:
      return mockSlides.slice(1, 5);
    case 4:
      return mockSlides.slice(2, 6);
    case 5:
      return mockSlides.slice(0, 5);
    default:
      return mockSlides.slice(0, 4);
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

::v-deep(.slide) {
  border: none;
  padding: 0;
  outline: none;

  &:hover {
    transition: none;
    border: none;
  }
}

.tabs-slider-section {
  margin-bottom: 200px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-x) {
    gap: 12px;
    margin-bottom: 30px;
  }
}

.tab-button {
  padding: 14px 20px;
  border: 1px solid $utility-color-1;
  border-radius: 50px;
  background: transparent;
  color: $text-color-secondary;
  font-family: 'Akrobat';
  font-size: 18px;
  font-weight: 700;
  line-height: 110%;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  text-transform: uppercase;

  &:hover {
    border-color: $text-color-primary;
    background-color: $text-color-primary;
    color: $text-color-white;
  }

  &.active {
    border-color: $text-color-primary;
    background-color: $text-color-primary;
    color: $text-color-white;
  }
}

.tab-content {
  position: relative;
}

.tab-pane {
  display: none;
  
  &.active {
    display: block;
  }
}

// Стили для слайдов
.custom-slide {
  height: 407px;
  cursor: pointer;
  border-radius: 7px;
  overflow: hidden;
  transition: transform 0.3s ease;
  width: 100%;
}

.slide-image {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-start;
  padding: 24px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
    z-index: 1;
  }
}

.slide-text {
  position: relative;
  z-index: 2;
  color: $text-color-white;
  font-family: 'Akrobat';
  font-size: 22px;
  font-weight: 700;
  line-height: 110%;
  max-height: 4.4em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  text-transform: uppercase;

  @media (max-width: $breakpoint-x) {
    font-size: 18px;
  }
}
</style>
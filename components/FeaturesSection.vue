<template>
  <section class="tabs-slider-section section">
    <div class="tabs-slider-section__container container">
      <TitleNew :text="title" class="tabs-slider-section__title" />
      
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
            :slides="tab.peculiarities"
            :slides-per-view="4"
            :space-between="45"
            :show-navigation="true"
            :hide-navigation-on-mobile="true"
            :breakpoints="customBreakpoints"
          >
            <template #slide="{ slide }">
              <div class="custom-slide">
                <div class="slide-image" :style="{ backgroundImage: `url(${getMediaUrl(slide.image)})` }">
                  <div class="slide-text">{{ slide.title }}</div>
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

const { getMediaUrl } = useMedia()

const props = defineProps({
  data: Object
})

const title = computed(() => props.data.title)
const tabs = computed(() => props.data.osobennostis)

const activeTab = ref(tabs.value[0].id);

const customBreakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 8
  },
  599: {
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

const setActiveTab = (tabId) => {
  activeTab.value = tabId;
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

::v-deep(.slide) {
  border: none;
  padding: 0;
  outline: none;
  flex-shrink: 0;

  &:hover {
    border: none;
  }
}

::v-deep(.swiper-slide) {
  transition: none !important;
}

.tabs-slider-section {
  margin: 120px 0px;

  &__container {
    @media (max-width: $breakpoint-x) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  @media (max-width: $breakpoint-sm) {
    margin-bottom: 120px;
  }

  @media (max-width: $breakpoint-x) {
    margin-top: 60px;
    margin-bottom: 60px;
  }

  &__title {
    @media (max-width: $breakpoint-sm) {
      margin-bottom: 32px;
    }
    @media (max-width: $breakpoint-x) {
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
    }
  }
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-sm) {
    gap: 8px;
    margin-bottom: 32px;
  }

  @media (max-width: $breakpoint-x) {
    flex-wrap: nowrap;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    justify-content: flex-start;
    padding-left: 20px;
    padding-right: 20px;
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
  white-space: nowrap;
  text-transform: uppercase;
  transition: all 0.3s ease;

  @media (max-width: $breakpoint-sm) {
    font-size: 13px;
    line-height: 140%;
    padding: 10px 16px;
  }

  
  @media (max-width: $breakpoint-x) {
    font-size: 14px;
    line-height: 140%;
    padding: 13px 16px;
  }

  &:hover:not(.active) {
    border-radius: 7px;
    border-color: $text-color-primary;
    background-color: $text-color-primary;
    color: $text-color-white;
    @media (max-width: $breakpoint-x) {
      border-color: $utility-color-1;
      background-color: transparent;
      color: $text-color-secondary;
    }
  }

  &.active {
    border-color: $text-color-primary;
    background-color: $text-color-primary;
    color: $text-color-white;
  }
}

.tab-content {
  position: relative;
  @media (max-width: $breakpoint-x) {
    padding-left: 20px;
    padding-right: 20px;
  }
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
  border-radius: 7px;
  overflow: hidden;
  width: 100%;

  @media (max-width: $breakpoint-x) {
    height: 338px;
  }
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
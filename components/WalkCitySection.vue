<template>
  <div class="walk-city-section section horizontal-section">
    <div class="walk-city-section__container container">
      <div class="walk-city-section__title-wrapper">
        <h2 class="walk-city-section__title">{{ title }}</h2>
      </div>
      
      <DefaultSlider
        v-if="isDesktop"
        :slides="slides"
        :slides-per-view="4"
        :space-between="45"
        :show-navigation="false"
        :show-pagination="false"
        :breakpoints="desktopBreakpoints"
        class="walk-city-section__slider"
      >
        <template #slide="{ slide }">
          <div class="custom-card">
            <div class="slide-image" :style="{ backgroundImage: `url(${slide.image?.startsWith('http') ? slide.image : getMediaUrl(slide.image)})` }">
              <div class="slide-text">{{ slide.title }}</div>
            </div>
          </div>
        </template>
      </DefaultSlider>

      <div v-else class="walk-city-section__grid">
        <div
          v-for="slide in slides"
          :key="slide.id"
          class="custom-card"
        >
          <div class="slide-image" :style="{ backgroundImage: `url(${slide.image?.startsWith('http') ? slide.image : getMediaUrl(slide.image)})` }">
            <div class="slide-text">{{ slide.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';

const { getMediaUrl } = useMedia();

const props = defineProps({
  data: Object
});

const isDesktop = ref(false);

const checkScreenSize = () => {
  isDesktop.value = window.innerWidth > 1024;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const title = computed(() => {
  return props.data?.title || 'Все для лучшей жизни';
});

const slides = computed(() => {
  const hardcodedSlides = [
    {
      id: 1,
      title: 'Пример слайда 1',
      image: 'https://via.placeholder.com/300x407/4C5E36/ffffff?text=Slide+1'
    },
    {
      id: 2,
      title: 'Пример слайда 2',
      image: 'https://via.placeholder.com/300x407/4C5E36/ffffff?text=Slide+2'
    },
    {
      id: 3,
      title: 'Пример слайда 3',
      image: 'https://via.placeholder.com/300x407/4C5E36/ffffff?text=Slide+3'
    },
    {
      id: 4,
      title: 'Пример слайда 4',
      image: 'https://via.placeholder.com/300x407/4C5E36/ffffff?text=Slide+4'
    },
    {
      id: 5,
      title: 'Пример слайда 5',
      image: 'https://via.placeholder.com/300x407/4C5E36/ffffff?text=Slide+5'
    },
    {
      id: 6,
      title: 'Пример слайда 6',
      image: 'https://via.placeholder.com/300x407/4C5E36/ffffff?text=Slide+6'
    }
  ];

  if (!props.data) return hardcodedSlides;

  const normalizeSlide = (item, index) => {
    const image = item.image || item.bg_image || item.background_image;
    
    return {
      id: item.id || index + 1,
      title: item.title || item.name || '',
      image: image ? getMediaUrl(image) : ''
    };
  };

  if (props.data.card && Array.isArray(props.data.card) && props.data.card.length > 0) {
    return props.data.card.map(normalizeSlide);
  }

  const possibleArrayFields = [
    'peculiarities',
    'slider',
    'items',
    'cards',
    'benefit_cards',
    'benefits',
    'life_benefit_card'
  ];

  for (const field of possibleArrayFields) {
    if (props.data[field] && Array.isArray(props.data[field]) && props.data[field].length > 0) {
      return props.data[field].map(normalizeSlide);
    }
  }
  
  if (props.data.osobennostis && Array.isArray(props.data.osobennostis)) {
    const allSlides = props.data.osobennostis.flatMap(tab => tab.peculiarities || []);
    if (allSlides.length > 0) {
      return allSlides.map(normalizeSlide);
    }
  }
  
  return hardcodedSlides;
});

const desktopBreakpoints = {
  1024: {
    slidesPerView: 4,
    spaceBetween: 45
  }
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

.walk-city-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: #F8F3ED;
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: $breakpoint-lg) {
    height: 100%;
    width: 100%;
    flex-shrink: initial;
  }

  &__container {
    position: relative;
    height: 100%;
    width: 100%;

    @media (max-width: $breakpoint-lg) {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: $breakpoint-x) {
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  &__title-wrapper {
    width: 70%;
    margin-top: 97px;
    margin-bottom: 97px;

    @media (max-width: $breakpoint-lg) {
      margin-top: 40px;
      margin-bottom: 40px;
      width: 100%;
    }

    @media (max-width: $breakpoint-x) {
      width: 100%;
      margin-top: 40px;
      margin-bottom: 20px;
    }
  }

  &__title {
    width: 100%;
    text-align: left;
    font-size: 118px;
    font-weight: 400;
    line-height: 0.8;
    color: $text-color-primary;
    margin: 0;
    font-family: inherit;

    @media (max-width: $breakpoint-lg) {
      font-size: 88px;
    }

    @media (max-width: $breakpoint-md) {
      font-size: 68px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 45px;
      white-space: normal;
    }
  }

  &__slider {
    position: relative;

    @media (max-width: $breakpoint-x) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 45px;
    position: relative;

    @media (max-width: 1023px) {
      gap: 20px;
    }

    @media (max-width: 768px) {
      gap: 8px;
    }

    @media (max-width: $breakpoint-x) {
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.custom-card {
  height: 407px;
  border-radius: 7px;
  overflow: hidden;
  width: 100%;

  @media (max-width: $breakpoint-x) {
    height: 338px;
  }

  @media (max-width: $breakpoint-x) {
    height: 250px;
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

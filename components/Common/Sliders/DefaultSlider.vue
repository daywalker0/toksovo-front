<template>
  <div class="default-slider">
    <div class="slider-container">
      <Swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :space-between="spaceBetween"
        :pagination="paginationConfig"
        :loop="loop"
        :breakpoints="breakpoints"
        :navigation="navigation"
        :effect="effect"
        class="default-swiper"
        onSlideChange
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="(slide, index) in slides"
          :key="getSlideKey(slide, index)"
          class="slide"
        >
          <!-- Слот для кастомной верстки слайда -->
          <slot name="slide" :slide="slide" :index="index" :active="activeIndex === index">
            <!-- Дефолтная верстка, если слот не передан -->
            <div class="default-slide-content">
              <div class="month">{{ slide.month }}</div>
              <div class="year">{{ slide.year }}</div>
            </div>
          </slot>
        </SwiperSlide>

        <div class="slider--controls">
          <!-- Прогрессбар -->

          <!-- Навигационные стрелки -->
          <div class="custom-navigation" v-if="showNavigation">
            <button class="nav-button prev" @click="slidePrev">
              <slot name="prev-button">
                <svg
                  width="9"
                  height="16"
                  viewBox="0 0 9 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.15141 0.0727358L8.03516 0.956484L1.43391 7.55773C1.31641 7.67648 1.25141 7.83273 1.25141 8.00023C1.25141 8.16773 1.31641 8.32398 1.43391 8.44273L8.03516 15.044L7.15141 15.9277L0.550155 9.32648C0.196404 8.97273 0.00140572 8.50148 0.00140572 8.00023C0.00140572 7.49898 0.196404 7.02898 0.550155 6.67398L7.15141 0.0727358Z"
                    fill="#2C322C"
                  />
                </svg>
              </slot>
            </button>
            <button class="nav-button next" @click="slideNext">
              <slot name="next-button">
                <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                  <path
                    d="M1.84859 15.9273L0.964844 15.0435L7.56609 8.44227C7.68359 8.32352 7.74859 8.16727 7.74859 7.99977C7.74859 7.83227 7.68359 7.67602 7.56609 7.55727L0.964844 0.956015L1.84859 0.0722656L8.44985 6.67352C8.8036 7.02727 8.99859 7.49852 8.99859 7.99977C8.99859 8.50102 8.8036 8.97102 8.44985 9.32602L1.84859 15.9273Z"
                    fill="#2C322C"
                  />
                </svg>
              </slot>
            </button>
          </div>
        </div>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  Pagination,
  Autoplay,
  Navigation,
  EffectFade,
  EffectCube,
  EffectCoverflow,
} from 'swiper/modules';

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';

// Props
const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => [],
  },
  slidesPerView: {
    type: [Number, String],
    default: 1,
  },
  spaceBetween: {
    type: Number,
    default: 45,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: [Boolean, Object],
    default: () => ({ delay: 4000, disableOnInteraction: false }),
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  paginationType: {
    type: String,
    default: 'text', // 'text', 'number', 'dot', 'default'
    validator: value => ['text', 'number', 'dot', 'default'].includes(value),
  },
  showNavigation: {
    type: Boolean,
    default: false,
  },
  effect: {
    type: String,
    default: 'slide', // 'slide', 'fade', 'cube', 'coverflow'
    validator: value => ['slide', 'fade', 'cube', 'coverflow'].includes(value),
  },
  breakpoints: {
    type: Object,
    default: () => ({
      640: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 45,
      },
    }),
  },
  modules: {
    type: Array,
    default: () => [Pagination, Autoplay],
  },
});

const activeIndex = ref(0);
let swiperInstance = null;

const onSwiper = swiper => {
  swiperInstance = swiper;
};

const onSlideChange = swiper => {
  activeIndex.value = swiper.realIndex;
};

const slidePrev = () => {
  if (swiperInstance) {
    swiperInstance.slidePrev();
  }
};

const slideNext = () => {
  if (swiperInstance) {
    swiperInstance.slideNext();
  }
};

const getSlideKey = (slide, index) => {
  return slide.id || slide.month || `slide-${index}`;
};

// Computed
const autoplayConfig = computed(() => {
  return props.autoplay === true ? { delay: 4000, disableOnInteraction: false } : props.autoplay;
});

const paginationConfig = computed(() => {
  return props.paginationType === 'default'
    ? {
        clickable: true,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
      }
    : false;
});

const navigation = computed(() => {
  return props.showNavigation
    ? {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    : false;
});
</script>

<style lang="scss" scoped>
.default-slider {
  width: 100%;
  margin: 0 auto;
}

.slider-container {
  position: relative;
  height: 100%;
}

.default-swiper {
  width: 100%;
  position: static;
}

.slide {
  height: 100%;
  min-height: 300px;
  border: 1px solid $utility-color-1;
  border-radius: 7px;
  padding: 20px;
}

.slider {
  &--controls {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    align-items: center;
    gap: 32px;
  }
}

/* Дефолтная верстка слайда */
.default-slide-content {
  text-align: center;
  color: white;
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.month {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.year {
  font-size: 1.5rem;
  font-weight: 400;
  opacity: 0.9;
}

/* Кастомная пагинация */
.custom-pagination {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.pagination-bullet {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-bullet:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.pagination-bullet.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Кастомная навигация */
.custom-navigation {
  width: 100px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.nav-button {
  width: 44px;
  height: 44px;
  border: 1px solid $text-color-primary;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;

  &:hover {
    background-color: $accent-color-orange;
    border: 1px solid $accent-color-orange;
    transition: 0.3s;

    svg path {
      fill: $text-color-white;
    }
  }
  &.disabled {
  }
}

:deep(.swiper-pagination) {
  bottom: 10px !important;
}

:deep(.swiper-pagination-bullet) {
  background: #ccc;
  opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
  background: #667eea;
  opacity: 1;
}

/* Адаптивность */
@media (max-width: 768px) {
  .default-slider {
    padding: 0 15px;
  }

  .default-swiper {
    height: 250px;
  }

  .month {
    font-size: 2rem;
  }

  .year {
    font-size: 1.2rem;
  }

  .custom-pagination {
    padding: 10px;
  }

  .pagination-bullet {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
}
</style>

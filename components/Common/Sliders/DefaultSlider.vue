<template>
  <div class="default-slider">
    <div class="slider-container">
      <Swiper
        :modules="modules"
        :slides-per-view="effectiveSlidesPerView"
        :space-between="effectiveSpaceBetween"
        :centered-slides="effectiveCenteredSlides"
        :pagination="paginationConfig"
        :autoplay="autoplayConfig"
        :breakpoints="breakpoints"
        :navigation="navigation"
        :effect="effect"
        class="default-swiper"
        :class="{ 'mobile-swiper': isMobile && mobileSlideWidth }"
        onSlideChange
        @swiper="onSwiper"
        @slide-change="onSlideChange"
        @resize="onResize"
        @breakpoint="onBreakpoint"
      >
        <SwiperSlide
          v-for="(slide, index) in slides"
          :key="getSlideKey(slide, index)"
          class="slide"
          :style="slideStyle"
        >
          <slot name="slide" :slide="slide" :index="index" :active="activeIndex === index">
            <div class="default-slide-content">
              <div class="month">{{ slide.month }}</div>
              <div class="year">{{ slide.year }}</div>
            </div>
          </slot>
        </SwiperSlide>

        <div class="slider--controls" v-if="shouldShowNavigation || shouldShowPagination">
          <div class="custom-progressbar" v-if="shouldShowPagination">
            <span class="swiper-pagination-progressbar-fill"></span>
          </div>

          <div class="custom-navigation" v-if="shouldShowNavigation">
            <button
              class="nav-button prev"
              :class="{ disabled: isPrevDisabled }"
              :disabled="isPrevDisabled"
              @click="slidePrev"
            >
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
            <button
              class="nav-button next"
              :class="{ disabled: isNextDisabled }"
              :disabled="isNextDisabled"
              @click="slideNext"
            >
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';

// Инициализируем isMobile сразу правильно
const isMobile = ref(process.client ? window.innerWidth <= 599 : false);

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
  centeredSlides: {
    type: Boolean,
    default: false,
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
    default: 'progressbar',
    validator: value => ['text', 'progressbar', 'number', 'dot', 'default'].includes(value),
  },
  showNavigation: {
    type: Boolean,
    default: false,
  },
  effect: {
    type: String,
    default: 'slide',
    validator: value => ['slide', 'fade', 'cube', 'coverflow'].includes(value),
  },
  breakpoints: {
    type: Object,
    default: () => ({
      0: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      428: {
        slidesPerView: 1,
        spaceBetween: 8,
      },
      599: {
        slidesPerView: 2,
        spaceBetween: 8,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    }),
  },
  modules: {
    type: Array,
    default: () => [Pagination, Autoplay],
  },
  hideNavigationOnMobile: {
    type: Boolean,
    default: false,
  },
});

const activeIndex = ref(0);
let swiperInstance = null;
const totalSlides = computed(() => props.slides.length);

const isPrevDisabled = ref(true);
const isNextDisabled = ref(true);

const onSwiper = swiper => {
  swiperInstance = swiper;
  updateNavigationState();
};

const onSlideChange = swiper => {
  activeIndex.value = swiper.realIndex;
  updateNavigationState();
};

const updateNavigationState = () => {
  if (swiperInstance) {
    const currentIndex = swiperInstance.realIndex ?? swiperInstance.activeIndex ?? 0;
    const visible = getCurrentSlidesPerView();
    const lastStartIndex = Math.max(0, totalSlides.value - visible);

    isPrevDisabled.value = currentIndex <= 0;
    isNextDisabled.value = currentIndex >= lastStartIndex;
  }
};

const slidePrev = () => {
  if (swiperInstance && !isPrevDisabled.value) {
    swiperInstance.slidePrev();
  }
};

const slideNext = () => {
  if (swiperInstance && !isNextDisabled.value) {
    swiperInstance.slideNext();
  }
};

const getSlideKey = (slide, index) => {
  return slide.id || slide.month || `slide-${index}`;
};

// Computed
const autoplayConfig = computed(() => {
  // Отключаем автоплей на мобильных устройствах
  if (isMobile.value) return false;

  if (props.autoplay === false) return false;
  return props.autoplay === true ? { delay: 4000, disableOnInteraction: false } : props.autoplay;
});

const paginationConfig = computed(() => {
  return props.paginationType === 'progressbar'
    ? {
        type: 'progressbar',
        el: '.custom-progressbar',
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

// Helpers to determine current slidesPerView considering breakpoints and responsive changes
const getCurrentSlidesPerView = () => {
  if (!swiperInstance) return Number(props.slidesPerView) || 1;
  // Swiper resolves breakpoints and stores params in params.slidesPerView
  const resolved = swiperInstance.params?.slidesPerView;
  const val = typeof resolved === 'number' ? resolved : Number(props.slidesPerView) || 1;
  // Cap to total slides to avoid negative lastStartIndex
  return Math.max(1, Math.min(val, totalSlides.value));
};

const onResize = () => {
  updateNavigationState();
};

const onBreakpoint = () => {
  updateNavigationState();
};

// Вычисляем параметры для мобилки
const mobileConfig = computed(() => {
  if (!isMobile.value) {
    return null;
  }

  // Если указана фиксированная ширина слайда - используем auto режим
  if (props.mobileSlideWidth) {
    return {
      slidesPerView: 'auto',
      spaceBetween: 8,
      centeredSlides: false,
    };
  }

  // Иначе - один слайд на весь экран
  return {
    slidesPerView: 1,
    spaceBetween: 16,
    centeredSlides: false,
  };
});

// Объединяем конфиг с мобильными параметрами
const effectiveSlidesPerView = computed(() => {
  return mobileConfig.value ? mobileConfig.value.slidesPerView : props.slidesPerView;
});

const effectiveSpaceBetween = computed(() => {
  return mobileConfig.value ? mobileConfig.value.spaceBetween : props.spaceBetween;
});

const effectiveCenteredSlides = computed(() => {
  return mobileConfig.value ? mobileConfig.value.centeredSlides : props.centeredSlides;
});

// Показывать ли навигацию
const shouldShowNavigation = computed(() => {
  if (isMobile.value && props.hideNavigationOnMobile) {
    return false;
  }
  return props.showNavigation;
});

// Показывать ли прогресс-бар (на десктопе - да, на мобильных - нет)
const shouldShowPagination = computed(() => {
  // Скрываем прогресс-бар на мобильных
  if (isMobile.value) {
    return false;
  }
  // На десктопе показываем, если showPagination=true
  return props.showPagination;
});

// Стиль для слайда с фиксированной шириной на мобильных
const slideStyle = computed(() => {
  if (isMobile.value && props.mobileSlideWidth) {
    return {
      width: `${props.mobileSlideWidth}px`,
      flexShrink: '0',
    };
  }
  return {};
});

onMounted(() => {
  const checkMobile = () => {
    const newIsMobile = window.innerWidth <= 599;
    // Обновляем только если значение изменилось
    if (isMobile.value !== newIsMobile) {
      isMobile.value = newIsMobile;
    }
  };

  window.addEventListener('resize', checkMobile);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
  });
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

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
  height: auto;
  border: 1px solid $utility-color-1;
  border-radius: 7px;
  padding: 20px;
  transition: 0.3s;

  &:hover {
    border: 1px solid $text-color-white;
    background-color: $text-color-white;
    transition: 0.3s;
  }

  :deep(img) {
    width: 100%;
    aspect-ratio: 1 / 1 !important;
    object-fit: cover;
    display: block;
  }

  :deep(.card-img) {
    aspect-ratio: 1 / 1 !important;
    height: auto !important;
  }
}

.slider {
  &--controls {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    align-items: center;
    gap: 32px;

    @media (max-width: $breakpoint-x) {
      justify-content: center;
    }
  }
}
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
    cursor: not-allowed;
    opacity: 0.1;
    pointer-events: none;
  }
}

.custom-progressbar {
  flex: 1;
  height: 1px;
  background: $utility-color-1;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  min-width: 200px;

  @media (max-width: $breakpoint-x) {
    display: none;
  }
}

:deep(.swiper-pagination-progressbar-fill) {
  background: $text-color-primary;
  border-radius: 3px;
  height: 2px;
  min-width: 0;
}

:deep(.swiper-pagination-progressbar) {
  display: block !important;
  opacity: 1 !important;
}

.mobile-swiper {
  @media (max-width: $breakpoint-x) {
    overflow: visible;
  }
}
</style>

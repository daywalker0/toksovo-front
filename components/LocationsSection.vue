<template>
  <div class="locations-section section">
    <div class="locations-section__container container">
      <TextBlockSection :text="title" :subtitle="subtitle" />

      <!-- Мобильная версия - слайдер -->
      <div v-if="isMobile" class="mobile-slider">
        <DefaultSlider
          :slides="slides"
          :slides-per-view="2"
          :space-between="8"
          :show-navigation="true"
          :hide-navigation-on-mobile="true"
        >
          <template #slide="{ slide }">
            <div class="card mobile-card">
              <img class="card-img" :src="slide.image" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">{{ slide.name }}</div>
                  <div class="card-content--distance">{{ slide.distance }}</div>
                </div>
                <div v-if="slide.subtitle" class="card-content__subtitle">
                  {{ slide.subtitle }}
                </div>
              </div>
            </div>
          </template>
        </DefaultSlider>
      </div>

      <!-- Десктопная версия - параллакс -->
      <div v-else class="parallax-block" ref="parallaxSection">
        <div class="parallax-container">
          <!-- Левая колонка -->
          <div class="parallax-column left-column" ref="leftColumn">
            <div v-for="(location, index) in locationsByColumn.left" :key="`left-${index}`" class="card">
              <img class="card-img" :src="location.image" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">{{ location.name }}</div>
                  <div class="card-content--distance">{{ location.distance }}</div>
                </div>
                <div v-if="location.subtitle" class="card-content__subtitle">{{ location.subtitle }}</div>
              </div>
            </div>
          </div>

          <!-- Центральная колонка -->
          <div class="parallax-column center-column" ref="centerColumn">
            <div v-for="(location, index) in locationsByColumn.center" :key="`center-${index}`" class="card">
              <img class="card-img" :src="location.image" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">{{ location.name }}</div>
                  <div class="card-content--distance">{{ location.distance }}</div>
                </div>
                <div v-if="location.subtitle" class="card-content__subtitle">{{ location.subtitle }}</div>
              </div>
            </div>
          </div>

          <!-- Правая колонка -->
          <div class="parallax-column right-column" ref="rightColumn">
            <div v-for="(location, index) in locationsByColumn.right" :key="`right-${index}`" class="card">
              <img class="card-img" :src="location.image" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">{{ location.name }}</div>
                  <div class="card-content--distance">{{ location.distance }}</div>
                </div>
                <div v-if="location.subtitle" class="card-content__subtitle">{{ location.subtitle }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import TextBlockSection from './TextBlockSection.vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

const { getMediaUrl } = useMedia();

const title = computed(() => props.data?.title || 'Локации рядом');
const subtitle = computed(() => props.data?.subtitle || props.data?.description || '');

const parallaxSection = ref(null);
const leftColumn = ref(null);
const centerColumn = ref(null);
const rightColumn = ref(null);

const isMobile = ref(false);

// Получаем локации по колонкам из API
const locationsByColumn = computed(() => {
  const locations = props.data?.location_card || props.data?.locations || [];
  
  if (!Array.isArray(locations) || locations.length === 0) {
    return {
      left: [],
      center: [],
      right: []
    };
  }

  // Группируем по колонкам
  const grouped = {
    left: [],
    center: [],
    right: []
  };
  
  locations.forEach((loc, index) => {
    // Если есть явное указание колонки - используем его
    // Иначе автоматически распределяем: 0,3,6,... -> left, 1,4,7,... -> center, 2,5,8,... -> right
    const column = loc.column || ['left', 'center', 'right'][index % 3];
    
    const item = {
      image: getMediaUrl(loc.image),
      name: loc.name || loc.title,
      distance: loc.distance,
      subtitle: loc.description || loc.subtitle || '', // description из Strapi
    };
    
    if (grouped[column]) {
      grouped[column].push(item);
    } else {
      grouped.center.push(item); // если колонка неизвестна, в центр
    }
  });
  
  return grouped;
});

// Массив всех слайдов для мобильной версии (все локации в один массив)
const slides = computed(() => {
  const cols = locationsByColumn.value;
  return [...cols.left, ...cols.center, ...cols.right];
});

let triggers = [];
let resizeTimer = null;

const destroyParallax = () => {
  triggers.forEach(tween => {
    tween.scrollTrigger?.kill();
    tween.kill();
  });
  triggers = [];
};

const initParallax = () => {
  if (isMobile.value) return;

  if (!parallaxSection.value || !leftColumn.value || !centerColumn.value || !rightColumn.value) {
    return;
  }

  destroyParallax();

  const isSm = window.innerWidth <= 768;

  if (isSm) {
    // Для sm и ниже: 2 колонки - левая колонка ниже, правая выше
    gsap.set(leftColumn.value, {
      y: 300,
      force3D: true,
    });
    gsap.set(rightColumn.value, {
      y: 0,
      force3D: true,
    });
  } else {
    // Для md и больше: 3 колонки
    gsap.set(centerColumn.value, {
      y: 0,
      force3D: true,
    });
    gsap.set(leftColumn.value, {
      y: 100,
      force3D: true,
    });
    gsap.set(rightColumn.value, {
      y: 200,
      force3D: true,
    });
  }

  if (isSm) {
    // Для sm и ниже: анимация двух колонок
    const leftTween = gsap.to(leftColumn.value, {
      y: -500,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    triggers.push(leftTween);

    const rightTween = gsap.to(rightColumn.value, {
      y: -300,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    triggers.push(rightTween);
  } else {
    // Для md и больше: анимация трех колонок
    const centerTween = gsap.to(centerColumn.value, {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    triggers.push(centerTween);

    const leftTween = gsap.to(leftColumn.value, {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    triggers.push(leftTween);

    const rightTween = gsap.to(rightColumn.value, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    triggers.push(rightTween);
  }
};

onMounted(async () => {
  await nextTick();

  const checkMobile = () => (isMobile.value = window.innerWidth <= 599);
  checkMobile();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      checkMobile();
      if (!isMobile.value) {
        initParallax();
        ScrollTrigger.refresh();
      } else {
        destroyParallax();
      }
    }, 150);
  });

  gsap.registerPlugin(ScrollTrigger);

  if (!isMobile.value) {
    initParallax();
  }
});

onBeforeUnmount(() => {
  clearTimeout(resizeTimer);
  destroyParallax();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.locations-section {
  padding: 0 0 60px;

  @media (max-width: $breakpoint-sm) {
    padding: 60px 0 120px;
  }

  @media (max-width: $breakpoint-x) {
    padding: 40px 0 60px;
  }

  // Убираем боковые паддинги у контента заголовка "Локации рядом" на мобилке
  @media (max-width: $breakpoint-x) {
    :deep(.text-block-section) {
      padding: 0;
    }
    :deep(.text-block-section .content) {
      padding: 0;
    }
  }
}

.parallax-block {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;

  @media (max-width: $breakpoint-sm) {
    margin: 0px 0 -250px;
    min-height: 1200px;
    align-items: flex-start;
  }
}

.parallax-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  gap: 43px;
  position: relative;

  @media (max-width: $breakpoint-lg) {
    gap: 36px;
  }

  @media (max-width: $breakpoint-md) {
    gap: 20px;
  }

  @media (max-width: $breakpoint-sm) {
    gap: 40px;
    max-width: 100%;
    width: 100%;
    padding: 0 40px;
    align-items: flex-start;
  }

  @media (max-width: 600px) {
    gap: 20px;
    padding: 0 20px;
  }
}

.parallax-column {
  flex: 1;
  opacity: 1;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;

  @media (max-width: $breakpoint-sm) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  &.center-column {
    @media (max-width: $breakpoint-sm) {
      display: none;
    }
  }
}

.card {
  margin-bottom: 80px;
  width: 366px;
  flex-shrink: 0;

  @media (max-width: 1200px) {
    width: 300px;
    margin-bottom: 50px;
  }

  @media (max-width: $breakpoint-md) {
    width: 260px;
    margin-bottom: 40px;
  }

  @media (max-width: $breakpoint-sm) {
    width: 100%;
    margin-bottom: 40px;
  }
}

.card-img {
  width: 100%;
  height: 488px;
  aspect-ratio: 3 / 4;
  object-fit: cover;

  @media (max-width: $breakpoint-md) {
    height: auto;
  }
}

.mobile-slider {
  .card-img {
    aspect-ratio: 1 / 1;
    height: auto;
  }
}

.card-content {
  margin-top: 20px;

  @media (max-width: $breakpoint-x) {
    margin-top: 0;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    font-family: 'Akrobat';
    line-height: 1.2;
    gap: 1rem;
    margin-bottom: 4px;

    @media (max-width: 1280px) {
      font-size: 24px;
    }

    @media (max-width: $breakpoint-lg) {
      font-size: 20px;
    }

    @media (max-width: $breakpoint-x) {
      margin-top: 12px;
    }
  }

  &__subtitle {
    font-family: 'Akrobat';
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
    opacity: 0.8;
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: none;

    @media (max-width: 1280px) {
      font-size: 16px;
    }

    @media (max-width: $breakpoint-lg) {
      font-size: 14px;
    }
  }

  &--distance {
    font-family: 'Bona Nova SC';
    font-size: 20px;
    font-weight: 400;
    line-height: 80%;
    white-space: nowrap;

    @media (max-width: 1280px) {
      font-size: 20px;
    }

    @media (max-width: $breakpoint-lg) {
      font-size: 16px;
    }
  }
}

// Мобильный слайдер
.mobile-slider {
  margin-top: 40px;

  @media (max-width: $breakpoint-x) {
    ::v-deep(.default-slider) {
      overflow: visible;
    }

    ::v-deep(.slider-container) {
      overflow: visible;
    }

    ::v-deep(.default-swiper) {
      overflow: visible;
    }

    // Убираем стили слайдов для мобильной версии
    ::v-deep(.slide) {
      border: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      
      &:hover {
        border: none !important;
        background: transparent !important;
      }
    }
  }

  .mobile-card {
    width: 100%;
    margin: 0;

    .card-img {
      width: 100%;
      aspect-ratio: 1 / 1;
      height: auto;
      object-fit: cover;
    }
  }
}

</style>

<template>
  <div class="locations-section section">
    <div class="locations-section__container container">
      <!-- <TitleNew text="Локации рядом" /> -->

      <!-- Мобильная версия - слайдер -->
      <div v-if="isMobile" class="mobile-slider">
        <DefaultSlider
          :slides="slides"
          :slides-per-view="'auto'"
          :space-between="16"
          :centered-slides="true"
          :autoplay="false"
          :show-pagination="false"
          :show-navigation="false"
          :hide-navigation-on-mobile="true"
          :breakpoints="{}"
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
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>

            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Конный клуб</div>
                  <div class="card-content--distance">3 км</div>
                </div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Экотропа</div>
                  <div class="card-content--distance">10 км</div>
                </div>
                <div class="card-content__subtitle">«Малиновая гора»</div>
              </div>
            </div>
          </div>

          <!-- Центральная колонка -->
          <div class="parallax-column center-column" ref="centerColumn">
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Песочный пляж</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Учебно-тренировочный центр</div>
                  <div class="card-content--distance">3,4 км</div>
                </div>
                <div class="card-content__subtitle">«Кавголово»</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Парк семейного отдыха</div>
                  <div class="card-content--distance">11 км</div>
                </div>
                <div class="card-content__subtitle">«Зубровник»</div>
              </div>
            </div>
          </div>

          <!-- Правая колонка -->
          <div class="parallax-column right-column" ref="rightColumn">
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Песочный пляж</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Учебно-тренировочный центр</div>
                  <div class="card-content--distance">3,4 км</div>
                </div>
                <div class="card-content__subtitle">«Кавголово»</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" loading="lazy" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Парк семейного отдыха</div>
                  <div class="card-content--distance">11 км</div>
                </div>
                <div class="card-content__subtitle">«Зубровник»</div>
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import TitleNew from './Common/TitleNew.vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import locationCardImg from '@/assets/img/location-card.png';

const parallaxSection = ref(null);
const leftColumn = ref(null);
const centerColumn = ref(null);
const rightColumn = ref(null);

const isMobile = ref(false);

// Массив всех слайдов для мобильной версии
const slides = ref([
  {
    image: locationCardImg,
    name: 'Ресторан «ЛетоБар»',
    distance: '0,9 км',
    subtitle: 'на прилегающей территории',
  },
  {
    image: locationCardImg,
    name: 'Песочный пляж',
    distance: '0,9 км',
    subtitle: 'на прилегающей территории',
  },
  {
    image: locationCardImg,
    name: 'Ресторан «ЛетоБар»',
    distance: '0,9 км',
    subtitle: 'на прилегающей территории',
  },
  {
    image: locationCardImg,
    name: 'Конный клуб',
    distance: '3 км',
    subtitle: '',
  },
  {
    image: locationCardImg,
    name: 'Учебно-тренировочный центр',
    distance: '3,4 км',
    subtitle: '«Кавголово»',
  },
  {
    image: locationCardImg,
    name: 'Ресторан «ЛетоБар»',
    distance: '0,9 км',
    subtitle: 'на прилегающей территории',
  },
  {
    image: locationCardImg,
    name: 'Экотропа',
    distance: '10 км',
    subtitle: '«Малиновая гора»',
  },
  {
    image: locationCardImg,
    name: 'Парк семейного отдыха',
    distance: '11 км',
    subtitle: '«Зубровник»',
  },
  {
    image: locationCardImg,
    name: 'Ресторан «ЛетоБар»',
    distance: '0,9 км',
    subtitle: 'на прилегающей территории',
  },
]);

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
        markers: false, // Поставить true для отладки
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
        markers: false, // Поставить true для отладки
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
  padding: 60px 0;

  @media (max-width: $breakpoint-sm) {
    padding: 60px 0 120px;
  }

  @media (max-width: $breakpoint-x) {
    padding: 40px 0 60px;
  }

  &__title {
    max-width: 508px;
    text-align: center;
    margin: 0 auto;
  }
}

.parallax-block {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 100px 0;
  overflow: visible;

  @media (max-width: $breakpoint-sm) {
    margin: 180px 0 -300px;
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
    font-size: 28px;
    font-weight: 700;
    text-transform: uppercase;
    font-family: 'Akrobat';
    line-height: 80%;
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

  // Переопределяем стили слайдера
  :deep(.default-swiper) {
    overflow: visible;

    .swiper-slide {
      width: 80% !important;
      transition: transform 0.3s ease;
      border: none !important;
      padding: 0 !important;
      background-color: transparent !important;

      &:hover {
        border: none !important;
        background-color: transparent !important;
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

<template>
  <div class="locations-section section">
    <div class="locations-section__container container">
      <TitleNew text="Локации рядом" />

      <!-- Мобильная версия - слайдер -->
      <div
        v-if="isMobile"
        class="mobile-slider"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div class="slider-wrapper">
          <div class="card">
            <img class="card-img" :src="slides[currentIndex].image" alt="card" />
            <div class="card-content">
              <div class="card-content--distance">{{ slides[currentIndex].distance }}</div>
              <div class="card-content__title">
                <div class="card-content--name">{{ slides[currentIndex].name }}</div>
              </div>
              <div v-if="slides[currentIndex].subtitle" class="card-content__subtitle">
                {{ slides[currentIndex].subtitle }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Десктопная версия - параллакс -->
      <div v-else class="parallax-block" ref="parallaxSection">
        <div class="parallax-container">
          <!-- Левая колонка -->
          <div class="parallax-column left-column" ref="leftColumn">
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>

            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Конный клуб</div>
                  <div class="card-content--distance">3 км</div>
                </div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" />
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
              <img class="card-img" :src="locationCardImg" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Песочный пляж</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Учебно-тренировочный центр</div>
                  <div class="card-content--distance">3,4 км</div>
                </div>
                <div class="card-content__subtitle">«Кавголово»</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" />
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
              <img class="card-img" :src="locationCardImg" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" :src="locationCardImg" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
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
import locationCardImg from '@/assets/img/location-card.png';

const parallaxSection = ref(null);
const leftColumn = ref(null);
const centerColumn = ref(null);
const rightColumn = ref(null);

const isMobile = ref(false);
const currentIndex = ref(0);
const isAnimating = ref(false);

// Touch события для свайпа
const touchStartX = ref(0);
const touchEndX = ref(0);
const touchStartY = ref(0);
const touchEndY = ref(0);

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

// Обработчики свайпа
const handleTouchStart = e => {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
};

const handleTouchMove = e => {
  touchEndX.value = e.touches[0].clientX;
  touchEndY.value = e.touches[0].clientY;
};

const handleTouchEnd = () => {
  if (isAnimating.value) return;

  const diffX = touchStartX.value - touchEndX.value;
  const diffY = touchStartY.value - touchEndY.value;

  // Проверяем, что горизонтальный свайп больше вертикального
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Минимальная дистанция свайпа - 50px
    if (Math.abs(diffX) > 50) {
      isAnimating.value = true;

      if (diffX > 0) {
        // Свайп влево - следующий слайд
        currentIndex.value = (currentIndex.value + 1) % slides.value.length;
      } else {
        // Свайп вправо - предыдущий слайд
        currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
      }

      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    }
  }

  // Сбрасываем значения
  touchStartX.value = 0;
  touchEndX.value = 0;
  touchStartY.value = 0;
  touchEndY.value = 0;
};

let triggers = [];
let resizeTimer = null;

onMounted(async () => {
  await nextTick();

  const checkMobile = () => (isMobile.value = window.innerWidth <= 599);
  checkMobile();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      checkMobile();
    }, 150);
  });

  gsap.registerPlugin(ScrollTrigger);

  if (isMobile.value) return;

  if (!parallaxSection.value || !leftColumn.value || !centerColumn.value || !rightColumn.value) {
    console.error('LocationsSection: refs not initialized');
    return;
  }

  // Начальные позиции:
  // Центр - самая высокая (0)
  // Левая - ниже центральной (150px)
  // Правая - еще ниже левой (300px)
  gsap.set(centerColumn.value, {
    y: 0,
    force3D: true,
  });
  gsap.set(leftColumn.value, {
    y: 150,
    force3D: true,
  });
  gsap.set(rightColumn.value, {
    y: 300,
    force3D: true,
  });

  // Центральная колонка (медленно вниз)
  const centerTween = gsap.to(centerColumn.value, {
    y: 350,
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

  // Левая колонка (средняя скорость вверх)
  const leftTween = gsap.to(leftColumn.value, {
    y: -400,
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

  // Правая колонка (быстро вверх)
  const rightTween = gsap.to(rightColumn.value, {
    y: -700,
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
});

onBeforeUnmount(() => {
  clearTimeout(resizeTimer);
  triggers.forEach(tween => {
    tween.scrollTrigger?.kill();
    tween.kill();
  });
  triggers = [];
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.locations-section {
  padding: 60px 0 260px;

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
    gap: 15px;
    max-width: 800px;
  }
}

.parallax-column {
  flex: 1;
  opacity: 1;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
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
    width: 240px;
    margin-bottom: 40px;
  }

  @media (max-width: $breakpoint-sm) {
    width: 180px;
    margin-bottom: 30px;
  }
}

.card-img {
  width: 100%;
  height: 488px;
  object-fit: cover;

  @media (max-width: $breakpoint-sm) {
    height: 300px;
    margin-bottom: 8px;
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

    @media (max-width: 1240px) {
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

    @media (max-width: 1240px) {
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

    @media (max-width: 1240px) {
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
  display: flex;
  flex-direction: column;
  align-items: center;

  .slider-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    touch-action: pan-y;
    user-select: none;

    .card {
      width: 100%;
      max-width: 366px;
      margin: 0;
      animation: fadeIn 0.3s ease;

      @media (max-width: $breakpoint-x) {
        max-width: 100%;
      }
    }

    .card-img {
      height: 488px;
      pointer-events: none;

      @media (max-width: $breakpoint-x) {
        height: 400px;
      }

      @media (max-width: $breakpoint-xs) {
        height: 338px;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

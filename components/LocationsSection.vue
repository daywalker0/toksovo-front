<template>
  <div class="locations-section section">
    <div class="locations-section__container">
      <TitleNew text="Локации рядом" />

      <!-- Слайдер -->
      <div class="slider-container" ref="sliderContainer">
        <div class="slider-wrapper" ref="sliderWrapper">
          <div
            v-for="(location, index) in locations"
            :key="index"
            class="slide"
            :class="{ active: currentSlide === index }"
          >
            <div class="slide-content">
              <img class="slide-img" :src="location.image" alt="location" />
              <div class="slide-info">
                <h3 class="slide-title">{{ location.name }}</h3>
                <p class="slide-distance">{{ location.distance }}</p>
                <p class="slide-subtitle" v-if="location.subtitle">{{ location.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Индикаторы -->
        <div class="slider-indicators">
          <button
            v-for="(_, index) in locations"
            :key="index"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TitleNew from './Common/TitleNew.vue';
import locationCardImg from '@/assets/img/location-card.png';

// Данные локаций
const locations = ref([
  {
    name: 'Ресторан «ЛетоБар»',
    distance: '0,9 км',
    subtitle: 'на прилегающей территории',
    image: locationCardImg,
  },
  {
    name: 'Конный клуб',
    distance: '3 км',
    subtitle: '',
    image: locationCardImg,
  },
  {
    name: 'Экотропа',
    distance: '10 км',
    subtitle: '«Малиновая гора»',
    image: locationCardImg,
  },
  {
    name: 'Песочный пляж',
    distance: '0,9 км',
    subtitle: 'на прилегающей территории',
    image: locationCardImg,
  },
  {
    name: 'Учебно-тренировочный центр',
    distance: '3,4 км',
    subtitle: '«Кавголово»',
    image: locationCardImg,
  },
  {
    name: 'Парк семейного отдыха',
    distance: '11 км',
    subtitle: '«Зубровник»',
    image: locationCardImg,
  },
]);

const sliderContainer = ref(null);
const sliderWrapper = ref(null);
const currentSlide = ref(0);
const isAnimating = ref(false);

// Переход к следующему слайду
const goToNextSlide = () => {
  if (isAnimating.value) return;

  isAnimating.value = true;
  const nextIndex = (currentSlide.value + 1) % locations.value.length;
  currentSlide.value = nextIndex;

  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

// Переход к предыдущему слайду
const goToPrevSlide = () => {
  if (isAnimating.value) return;

  isAnimating.value = true;
  const prevIndex = (currentSlide.value - 1 + locations.value.length) % locations.value.length;
  currentSlide.value = prevIndex;

  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

// Переход к конкретному слайду
const goToSlide = index => {
  if (isAnimating.value || index === currentSlide.value) return;

  isAnimating.value = true;
  currentSlide.value = index;

  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

// Поддержка свайпов
let startX = 0;
let startY = 0;

const handleTouchStart = e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
};

const handleTouchEnd = e => {
  if (!startX || !startY) return;

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const diffX = startX - endX;
  const diffY = startY - endY;

  // Проверяем, что это горизонтальный свайп
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) {
      goToNextSlide();
    } else {
      goToPrevSlide();
    }
  }

  startX = 0;
  startY = 0;
};

onMounted(() => {
  if (sliderContainer.value) {
    sliderContainer.value.addEventListener('touchstart', handleTouchStart, { passive: true });
    sliderContainer.value.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.locations-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }

  &__container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 120px 0 0;

    @media (max-width: $breakpoint-sm) {
      padding: 40px 0 0;
    }
  }
}

.slider-container {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.slider-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  transition: transform 0.3s ease;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.slide-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 60px 40px 40px;
  color: white;

  @media (max-width: $breakpoint-sm) {
    padding: 40px 20px 20px;
  }
}

.slide-title {
  font-family: 'Akrobat', sans-serif;
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 10px 0;
  line-height: 1.1;

  @media (max-width: $breakpoint-lg) {
    font-size: 36px;
  }

  @media (max-width: $breakpoint-sm) {
    font-size: 28px;
  }
}

.slide-distance {
  font-family: 'Bona Nova SC', serif;
  font-size: 24px;
  font-weight: 400;
  margin: 0 0 10px 0;
  opacity: 0.9;

  @media (max-width: $breakpoint-sm) {
    font-size: 20px;
  }
}

.slide-subtitle {
  font-family: 'Akrobat', sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  opacity: 0.8;

  @media (max-width: $breakpoint-sm) {
    font-size: 16px;
  }
}

.slider-indicators {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;

  @media (max-width: $breakpoint-sm) {
    bottom: 20px;
    gap: 8px;
  }
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background: white;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: $breakpoint-sm) {
    width: 10px;
    height: 10px;
  }
}
</style>

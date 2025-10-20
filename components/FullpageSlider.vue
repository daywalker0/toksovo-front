<template>
  <div class="sections-container" :data-slider-id="sliderId">
    <!-- Мобильная версия - Swiper слайдер -->
    <div v-if="isMobile" class="mobile-slider">
      <swiper
        :modules="modules"
        :slides-per-view="'auto'"
        :space-between="8"
        :centered-slides="true"
        class="mobile-swiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide v-for="(section, index) in sections" :key="index" class="mobile-swiper-slide">
          <div class="mobile-slide" :style="{ backgroundImage: `url(${section.image})` }"></div>
        </swiper-slide>
      </swiper>
    </div>

    <!-- Десктопная версия -->
    <template v-else>
      <!-- Превью навигация -->
      <div v-if="isIndicatorVisible && isInSlider" class="previews">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="thumb"
          :class="{ active: index === currentSection }"
          :data-section="index"
          :data-current="currentSection"
          :data-slider-id="sliderId"
          @click="scrollToSection(index)"
        >
          <img :src="section.image" loading="eager" />
        </div>
      </div>

      <!-- Секции -->
      <section
        v-for="(section, index) in sections"
        :key="index"
        :id="`section-${sliderId}-${index}`"
        class="fullscreen-section"
        :class="{
          'section-active': currentSection === index,
          'section-prev': currentSection === index - 1,
          'section-next': currentSection === index + 1,
        }"
      >
        <div class="section-bg" :style="{ backgroundImage: `url(${section.image})` }"></div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, toRefs, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const { sections } = toRefs(props);

// Генерируем уникальный ID для каждого слайдера
const sliderId = ref(`slider-${Math.random().toString(36).substr(2, 9)}`);

const currentSection = ref(0);
const isIndicatorVisible = ref(false);
const isInSlider = ref(false);
const isMobile = ref(false);

const modules = [];

let observer;
let scrollTriggers = [];

// Обработчик изменения слайда в Swiper
const onSlideChange = swiper => {
  currentSection.value = swiper.activeIndex;
};

const scrollToSection = index => {
  if (isMobile.value) {
    // На мобилке просто меняем currentSection (swiper обработает сам)
    if (index >= 0 && index < sections.value.length) {
      currentSection.value = index;
    }
  } else {
    // На десктопе используем scrollIntoView
    const targetElement = document.getElementById(`section-${sliderId.value}-${index}`);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Обновляем текущую секцию
      currentSection.value = index;
    }
  }
};

onMounted(async () => {
  // Явно устанавливаем первый слайд
  currentSection.value = 0;

  await nextTick();

  // Проверка мобильного устройства
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 599;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // На мобилке не инициализируем GSAP
  if (isMobile.value) {
    return;
  }

  // Динамически импортируем GSAP
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  // Создаем отдельный observer для определения активности слайдера (только для десктопа)
  if (!isMobile.value) {
    const sliderObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isInSlider.value = entry.isIntersecting;
          if (entry.isIntersecting) {
            isIndicatorVisible.value = true;
          } else {
            isIndicatorVisible.value = false;
          }
        });
      },
      { threshold: 0.3 }
    );

    // Наблюдаем за контейнером слайдера
    const sliderContainer = document.querySelector(`[data-slider-id="${sliderId.value}"]`);
    if (sliderContainer) {
      sliderObserver.observe(sliderContainer);
    }
  }

  // Создаем observer для определения текущей секции (только для десктопа)
  if (!isMobile.value) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = parseInt(entry.target.dataset.section || 0);
            currentSection.value = index;
          }
        });
      },
      {
        threshold: [0.5],
        rootMargin: '0px',
      }
    );
  }

  // Создаем ScrollTrigger анимацию для каждой секции
  sections.value.forEach((_, index) => {
    const element = document.getElementById(`section-${sliderId.value}-${index}`);
    if (!element) return;

    // Добавляем data-section для observer (только для десктопа)
    if (!isMobile.value && observer) {
      element.dataset.section = index;
      observer.observe(element);
    }

    const bgElement = element.querySelector('.section-bg');
    if (!bgElement) return;

    // Устанавливаем начальные значения
    gsap.set(bgElement, {
      scale: 1,
      opacity: 1,
      force3D: true,
    });

    // Последний элемент остается без анимации
    const isLastSection = index === sections.value.length - 1;
    if (isLastSection) return;

    // Анимация при скролле вверх (секция уходит)
    const trigger = gsap.to(bgElement, {
      scale: 0.5,
      opacity: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    scrollTriggers.push(trigger);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 599;
  });

  if (observer) observer.disconnect();

  // Очищаем все ScrollTriggers
  scrollTriggers.forEach(trigger => {
    if (trigger.scrollTrigger) {
      trigger.scrollTrigger.kill();
    }
    trigger.kill();
  });
  scrollTriggers = [];
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.sections-container {
  position: relative;
  overflow: hidden;
}

.fullscreen-section {
  height: 100vh;
  width: 100%;
  position: relative;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.section-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1);
  opacity: 1;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.section-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
  transition: all 0.8s ease;
}

.section-active .section-overlay {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%);
}

.section-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 20px;
  transform: translateY(50px);
  opacity: 0;
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.section-active .section-content {
  transform: translateY(0);
  opacity: 1;
}

/* Анимация контента для вертикальных переходов */
.slide-in-down .section-content,
.slide-in-up .section-content {
  animation: contentSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
}

.slide-out-up .section-content,
.slide-out-down .section-content {
  animation: contentSlideOut 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite alternate;
}

.section-description {
  font-size: 1.2rem;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  opacity: 0.9;
}

@keyframes titleGlow {
  0% {
    text-shadow:
      2px 2px 4px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(255, 255, 255, 0.1);
  }
  100% {
    text-shadow:
      2px 2px 4px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(255, 255, 255, 0.3);
  }
}

.previews {
  position: fixed;
  bottom: 44px;
  left: 44px;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.thumb {
  position: relative;
  width: 66px;
  height: 88px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.thumb:hover {
  transform: scale(1.05);
}

.thumb.active {
  transform: scale(1.1);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb.active::after {
  content: '';
  position: absolute;
  top: 10px;
  left: -10px;
  width: 86px;
  height: 68px;
  border: 1px solid #ffffff;
  border-radius: 6px;
  z-index: 10;
  pointer-events: none;
}

// Мобильная версия с Swiper
.mobile-slider {
  width: 100%;
  padding: 20px 0;
}

.mobile-swiper {
  width: 100%;
  height: 340px;
}

.mobile-swiper-slide {
  width: 340px !important;
  height: 340px;
}

.mobile-slide {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

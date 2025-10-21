<template>
  <div class="sections-container" :data-slider-id="sliderId">
    <!-- Мобильная версия - DefaultSlider -->
    <div v-if="isMobile" class="mobile-slider">
      <DefaultSlider
        :slides="mobileSlides"
        :slides-per-view="1.1"
        :space-between="8"
        :centered-slides="true"
        :show-navigation="false"
        :hide-navigation-on-mobile="true"
        :breakpoints="fullpageBreakpoints"
      >
        <template #slide="{ slide, active }">
          <div class="mobile-slide" :style="{ backgroundImage: `url(${slide.image})` }"></div>
        </template>
      </DefaultSlider>
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
          @click.prevent.stop="scrollToSection(index)"
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
import { ref, onMounted, onUnmounted, toRefs, nextTick, computed, watch } from 'vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';

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
const isProgrammaticScroll = ref(false); // Флаг программной прокрутки
// Computed свойство для мобильных слайдов
const mobileSlides = computed(() => {
  return sections.value.map((section, index) => ({
    id: index,
    image: section.image,
    title: section.title || '',
    description: section.description || ''
  }));
});

// Кастомные breakpoints для FullpageSlider (адаптированные под NewsSection, но с 1 слайдом)
const fullpageBreakpoints = computed(() => ({
  0: {
    slidesPerView: 1.1, // Показываем 1 слайд + части предыдущего и следующего
    spaceBetween: 8,
    centeredSlides: true,
  },
  428: {
    slidesPerView: 1.1, // Показываем 1 слайд + части предыдущего и следующего
    spaceBetween: 8,
    centeredSlides: true,
  },
  599: {
    slidesPerView: 1.1, // Показываем 1 слайд + части предыдущего и следующего
    spaceBetween: 8,
    centeredSlides: true,
  },
}));

let observer;
let scrollTriggers = [];
let scrollTimeout = null;
let handleUserScroll = null;

// Обработчик изменения слайда (не нужен для упрощенной версии)

const scrollToSection = index => {
  if (isMobile.value) {
    if (index >= 0 && index < sections.value.length) {
      currentSection.value = index;
    }
  } else {
    if (isProgrammaticScroll.value) {
      return;
    }

    const targetElement = document.getElementById(`section-${sliderId.value}-${index}`);

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop;

      if (Math.abs(scrollTop - targetPosition) < 10) {
        return;
      }

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      isProgrammaticScroll.value = true;
      currentSection.value = index;

      window.scrollTo({
        top: targetPosition,
        behavior: 'instant',
      });

      scrollTimeout = setTimeout(() => {
        isProgrammaticScroll.value = false;
      }, 300);
    }
  }
};

onMounted(async () => {
  currentSection.value = 0;

  await nextTick();

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 599;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  if (isMobile.value) {
    return;
  }

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  handleUserScroll = () => {
    if (isProgrammaticScroll.value) {
      setTimeout(() => {
        isProgrammaticScroll.value = false;
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
          scrollTimeout = null;
        }
      }, 100);
    }
  };

  if (!isMobile.value) {
    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchstart', handleUserScroll, { passive: true });
  }

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

    const sliderContainer = document.querySelector(`[data-slider-id="${sliderId.value}"]`);
    if (sliderContainer) {
      sliderObserver.observe(sliderContainer);
    }
  }

  if (!isMobile.value) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (isProgrammaticScroll.value) return;

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

    if (!isMobile.value && observer) {
      element.dataset.section = index;
      observer.observe(element);
    }

    const bgElement = element.querySelector('.section-bg');
    if (!bgElement) return;

    gsap.set(bgElement, {
      scale: 1,
      opacity: 1,
      force3D: true,
    });

    const isLastSection = index === sections.value.length - 1;
    if (isLastSection) return;

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

  if (handleUserScroll) {
    window.removeEventListener('wheel', handleUserScroll);
    window.removeEventListener('touchstart', handleUserScroll);
  }

  if (observer) observer.disconnect();

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }

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
  user-select: none;
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
  pointer-events: none;
  user-select: none;
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

// Мобильная версия с DefaultSlider
.mobile-slider {
  width: 100%;

  // Показываем части соседних слайдов (как в NewsSection)
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

.mobile-slide {
  width: 100%;
  height: 340px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0;
}
</style>

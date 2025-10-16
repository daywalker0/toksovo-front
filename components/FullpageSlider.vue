<template>
  <div class="sections-container" :data-slider-id="sliderId">
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
        <img :src="section.image" />
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, toRefs } from 'vue';

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
const previousCurrentSection = ref(0); // Отслеживаем предыдущую текущую секцию
const isIndicatorVisible = ref(false);
const isInSlider = ref(false);
let lastUpdateTime = 0;

let observer;

const scrollToSection = index => {
  // Простая навигация через scrollIntoView
  const targetElement = document.getElementById(`section-${sliderId.value}-${index}`);

  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Обновляем текущую секцию
    currentSection.value = index;
  } else {
  }
};

onMounted(() => {
  // Инициализируем currentSection
  currentSection.value = 0;

  // Создаем отдельный observer для определения активности слайдера
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

  // Создаем observer для секций - только для определения активности слайдера
  observer = new IntersectionObserver(
    entries => {
      // Этот observer только для определения, что слайдер активен
      // Не обновляем currentSection здесь
    },
    {
      threshold: 0.3, // Срабатывает при 30% видимости
      rootMargin: '0px',
    }
  );

  // Наблюдаем за всеми секциями
  sections.value.forEach((_, index) => {
    const element = document.getElementById(`section-${sliderId.value}-${index}`);
    if (element) {
      observer.observe(element);
    } else {
    }
  });

  // Добавляем обработчик скролла для более точного отслеживания
  let scrollTimeout;
  const handleScroll = () => {
    if (!isInSlider.value) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Находим секцию, которая больше всего видна
      let maxVisibleRatio = 0;
      let mostVisibleIndex = 0;

      sections.value.forEach((_, index) => {
        const element = document.getElementById(`section-${sliderId.value}-${index}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibleRatio = visibleHeight / window.innerHeight;

          if (visibleRatio > maxVisibleRatio) {
            maxVisibleRatio = visibleRatio;
            mostVisibleIndex = index;
          }
        }
      });

      // Обновляем только если новая секция видна значительно больше
      const now = Date.now();
      if (
        maxVisibleRatio > 0.3 &&
        mostVisibleIndex !== currentSection.value &&
        now - lastUpdateTime > 100
      ) {
        // Не чаще чем раз в 100мс
        previousCurrentSection.value = currentSection.value; // Сохраняем предыдущую секцию
        currentSection.value = mostVisibleIndex;
        lastUpdateTime = now;
      }
    }, 16); // Уменьшаем задержку для быстрого отклика (60fps)

    // Анимация для предыдущей секции
    updatePreviousSectionAnimation();
  };

  // Функция для анимации текущей секции при её уходе
  const updatePreviousSectionAnimation = () => {
    const currentIndex = currentSection.value;
    const previousIndex = previousCurrentSection.value;

    // Анимируем текущую секцию, когда она начинает уходить вверх
    const currentElement = document.getElementById(`section-${sliderId.value}-${currentIndex}`);
    if (currentElement) {
      const rect = currentElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Вычисляем прогресс анимации на основе позиции текущей секции
      // Анимация начинается когда низ текущей секции достигает низа экрана
      let scrollProgress = 0;

      if (rect.bottom <= 0) {
        // Секция полностью ушла вверх
        scrollProgress = 1;
      } else if (rect.bottom <= windowHeight) {
        // Анимация начинается когда низ текущей секции достигает низа экрана
        // Прогресс от 0 (низ секции на дне экрана) до 1 (секция полностью ушла вверх)
        const startPoint = windowHeight; // Начинаем когда низ секции на дне экрана
        const endPoint = 0; // Заканчиваем когда низ секции ушел вверх

        scrollProgress = (startPoint - rect.bottom) / (startPoint - endPoint);
      }

      // Ограничиваем прогресс от 0 до 1
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      // Масштабируем от 1.0 до 0.5 и прозрачность от 1.0 до 0.5
      const scale = 1.0 - scrollProgress * 0.5; // от 1.0 до 0.5
      const opacity = 1.0 - scrollProgress * 0.5; // от 1.0 до 0.5

      const bgElement = currentElement.querySelector('.section-bg');
      if (bgElement) {
        bgElement.style.transform = `scale(${scale})`;
        bgElement.style.opacity = opacity;
        bgElement.style.transition = 'none'; // Убираем задержку для мгновенной реакции
      }
    }

    // Также анимируем предыдущую секцию, если она есть
    if (previousIndex >= 0 && previousIndex !== currentIndex) {
      const previousElement = document.getElementById(`section-${sliderId.value}-${previousIndex}`);
      if (previousElement) {
        const rect = previousElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let scrollProgress = 0;

        if (rect.bottom <= 0) {
          scrollProgress = 1;
        } else if (rect.bottom <= windowHeight) {
          const startPoint = windowHeight;
          const endPoint = 0;
          scrollProgress = (startPoint - rect.bottom) / (startPoint - endPoint);
        }

        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        const scale = 1.0 - scrollProgress * 0.5;
        const opacity = 1.0 - scrollProgress * 0.5;

        const bgElement = previousElement.querySelector('.section-bg');
        if (bgElement) {
          bgElement.style.transform = `scale(${scale})`;
          bgElement.style.opacity = opacity;
          bgElement.style.transition = 'none';
        }
      }
    }

    // Убираем логику сброса анимации - теперь финальные значения opacity и scale сохраняются
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
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
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
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
</style>

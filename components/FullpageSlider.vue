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
const isIndicatorVisible = ref(false);
const isTransitioning = ref(false);
const isInSlider = ref(false);

let observer;

const scrollToSection = index => {
  if (isTransitioning.value || index === currentSection.value) return;

  isTransitioning.value = true;

  // Определяем направление анимации
  const direction = index > currentSection.value ? 'down' : 'up';

  // Применяем классы для анимации к фоновым изображениям
  const currentElement = document.getElementById(
    `section-${sliderId.value}-${currentSection.value}`
  );
  const targetElement = document.getElementById(`section-${sliderId.value}-${index}`);

  if (currentElement && targetElement) {
    const currentBg = currentElement.querySelector('.section-bg');
    const targetBg = targetElement.querySelector('.section-bg');

    if (currentBg && targetBg) {
      // Добавляем классы для анимации к фоновым изображениям
      currentBg.classList.add(direction === 'down' ? 'slide-out-up' : 'slide-out-down');
      targetBg.classList.add(direction === 'down' ? 'slide-in-down' : 'slide-in-up');
    }

    // Обновляем текущую секцию
    currentSection.value = index;

    // Убираем классы анимации после завершения
    setTimeout(() => {
      if (currentBg) currentBg.classList.remove('slide-out-up', 'slide-out-down');
      if (targetBg) targetBg.classList.remove('slide-in-down', 'slide-in-up');
      isTransitioning.value = false;
    }, 1000);
  }
};

onMounted(() => {
  // Инициализируем currentSection
  currentSection.value = 0;
  console.log('Slider initialized with currentSection:', currentSection.value);

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

  // Создаем observer для секций
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Парсим ID с учетом нового формата: section-${sliderId}-${index}
        const idParts = entry.target.id.split('-');
        const sectionIndex = parseInt(idParts[idParts.length - 1]);

        // Проверяем, что индекс валидный
        if (isNaN(sectionIndex) || sectionIndex < 0 || sectionIndex >= sections.value.length) {
          console.warn('Invalid section index:', sectionIndex, 'for ID:', entry.target.id);
          return;
        }

        // Проверяем, полностью ли секция в viewport
        if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
          if (!isTransitioning.value) {
            currentSection.value = sectionIndex;
            console.log('Active section changed to:', sectionIndex);
          }
        }
      });
    },
    {
      threshold: [0, 0.8], // Срабатывает при 0% и 80% видимости
      rootMargin: '0px', // Убираем отступы для более точного определения
    }
  );

  // Наблюдаем за всеми секциями
  sections.value.forEach((_, index) => {
    const element = document.getElementById(`section-${sliderId.value}-${index}`);
    if (element) observer.observe(element);
  });

  // Добавляем обработчик скролла для плавного перехода
  let scrollTimeout;
  const handleScroll = () => {
    if (isTransitioning.value || !isInSlider.value) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Проверяем, что скролл происходит в области этого слайдера
      const sliderRect = sliderContainer?.getBoundingClientRect();
      if (!sliderRect) return;

      const isInViewport = sliderRect.top <= 0 && sliderRect.bottom >= window.innerHeight;
      if (!isInViewport) return;

      const scrollY = window.scrollY;
      const sectionHeight = window.innerHeight;
      const newSection = Math.round(scrollY / sectionHeight);

      if (
        newSection !== currentSection.value &&
        newSection >= 0 &&
        newSection < sections.value.length
      ) {
        scrollToSection(newSection);
      }
    }, 100);
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

<style scoped>
.sections-container {
  position: relative;
  overflow: hidden;
}

.fullscreen-section {
  height: 100vh;
  width: 100%;
  position: relative;
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
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: scale(1.1);
}

.section-active .section-bg {
  transform: scale(1);
}

/* Анимации для вертикальных переходов фоновых изображений */
.section-bg.slide-out-up {
  animation: slideOutUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.section-bg.slide-out-down {
  animation: slideOutDown 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.section-bg.slide-in-down {
  animation: slideInDown 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.section-bg.slide-in-up {
  animation: slideInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes slideOutUp {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%) scale(0.95);
    opacity: 0;
  }
}

@keyframes slideOutDown {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
}

@keyframes slideInDown {
  0% {
    transform: translateY(-100%) scale(0.95);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideInUp {
  0% {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
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

@keyframes contentSlideIn {
  0% {
    transform: translateY(80px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes contentSlideOut {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-30px);
    opacity: 0;
  }
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

/* Параллакс эффект для фона */
.section-bg::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: inherit;
  background-size: cover;
  background-position: center;
  filter: blur(1px);
  opacity: 0.3;
  transition: all 1.5s ease;
}

.section-active .section-bg::before {
  transform: scale(1.05);
  opacity: 0.1;
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
  border: 3px solid #ffffff;
  border-radius: 6px;
  z-index: 10;
  pointer-events: none;
}
</style>

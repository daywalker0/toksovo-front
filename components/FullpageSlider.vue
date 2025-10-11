<template>
  <div ref="sliderWrapper" class="fullpage" @wheel="onWheel">
    <!-- Секции -->
    <div
      v-for="(section, index) in sections"
      :key="index"
      :ref="el => (sectionsRefs[index] = el)"
      class="section"
      :style="{
        backgroundImage: `url(${section.img})`,
        transform: index === 0 ? `scale(${firstSectionScale})` : 'scale(1)',
      }"
    >
      <!-- Если нужно вывести контент внутри секции -->
      <slot name="section" :section="section" :index="index"></slot>
    </div>

    <!-- Превью навигация -->
    <div v-if="isInSlider" class="previews">
      <div
        v-for="(section, index) in sections"
        :key="index"
        class="thumb"
        :class="{ active: index === currentIndex }"
        @click="goToSection(index)"
      >
        <img :src="section.img" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// ✅ Пропсы
const props = defineProps({
  sections: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const sectionsRefs = ref([]);
const sliderWrapper = ref(null);
const currentIndex = ref(0);
const isInSlider = ref(false);
const firstSectionScale = ref(0.95);
let isScrolling = false;
let lastScrollTs = 0;
let hasAnchoredOnEnter = false;
let scrollAccumulator = 0;

function onWheel(e) {
  if (isScrolling) return;

  const wrapperEl = sliderWrapper.value;
  if (!wrapperEl) return;

  const rect = wrapperEl.getBoundingClientRect();
  const sliderIsActive = rect.top <= 0 && rect.bottom > 0;
  if (!sliderIsActive) {
    // Если слайдер неактивен, разрешаем нативный скролл и сбрасываем аккумулятор
    scrollAccumulator = 0; // Сбрасываем аккумулятор, когда слайдер неактивен
    return;
  }

  const now = Date.now();
  const throttleOk = now - lastScrollTs > 600; // Увеличен антидребезг для лучшей отзывчивости

  const atFirst = currentIndex.value === 0;
  const atLast = currentIndex.value === props.sections.length - 1;

  const scrollingUpAtBoundary = e.deltaY < 0 && atFirst;
  const scrollingDownAtBoundary = e.deltaY > 0 && atLast;

  if (!scrollingUpAtBoundary && !scrollingDownAtBoundary) {
    e.preventDefault();
    scrollAccumulator += e.deltaY;

    const threshold = 100; // Увеличенный порог для тачпадов
    if (!isScrolling && Math.abs(scrollAccumulator) >= threshold && throttleOk) {
      if (scrollAccumulator > 0 && !atLast) {
        currentIndex.value++;
        goToSection(currentIndex.value);
        lastScrollTs = now;
      } else if (scrollAccumulator < 0 && !atFirst) {
        currentIndex.value--;
        goToSection(currentIndex.value);
        lastScrollTs = now;
      }
      scrollAccumulator = 0;
    }
  } else {
    scrollAccumulator = 0;
  }
}

function goToSection(index) {
  isScrolling = true;
  currentIndex.value = index;

  // Устанавливаем масштаб только для секций, отличных от первой
  if (index !== 0) {
    firstSectionScale.value = 1;
  }

  if (index === 0) {
    // Для первого слайда - обычный скролл, чтобы можно было увидеть анимацию
    sectionsRefs.value[index].scrollIntoView({ behavior: 'smooth' });
  } else {
    // Для остальных слайдов - якорный переход (мгновенный)
    sectionsRefs.value[index].scrollIntoView({ behavior: 'instant' });
  }

  setTimeout(() => {
    isScrolling = false;
    const atFirst = currentIndex.value === 0;
    const atLast = currentIndex.value === props.sections.length - 1;
  }, 800); // Соответствует времени антидребезга или чуть больше
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        isInSlider.value = entry.isIntersecting;
        if (entry.isIntersecting && !hasAnchoredOnEnter && !isScrolling) {
          anchorToNearestSection();
          hasAnchoredOnEnter = true;
        }
        if (!entry.isIntersecting) {
          hasAnchoredOnEnter = false;
        }
      });
    },
    { threshold: 0.3 }
  );

  if (sliderWrapper.value) observer.observe(sliderWrapper.value);

  // Добавляем обработчик скролла для анимации масштабирования
  window.addEventListener('scroll', handleScrollAnimation, { passive: true });
  window.addEventListener('resize', handleScrollAnimation);
  handleScrollAnimation(); // Начальная проверка

  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener('scroll', handleScrollAnimation);
    window.removeEventListener('resize', handleScrollAnimation);
  });
});

function anchorToNearestSection() {
  if (!sectionsRefs.value.length) return;
  let nearestIndex = 0;
  let minAbsTop = Infinity;
  sectionsRefs.value.forEach((el, idx) => {
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const absTop = Math.abs(top);
    if (absTop < minAbsTop) {
      minAbsTop = absTop;
      nearestIndex = idx;
    }
  });
  goToSection(nearestIndex);
}

function handleScrollAnimation() {
  if (!sliderWrapper.value || !sectionsRefs.value[0]) return;

  const wrapperRect = sliderWrapper.value.getBoundingClientRect();
  const firstSectionRect = sectionsRefs.value[0].getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Проверяем, находится ли слайдер в области видимости
  const sliderIsVisible = wrapperRect.top <= 0 && wrapperRect.bottom > 0;

  if (sliderIsVisible) {
    // Вычисляем прогресс анимации для первой секции
    const sectionTop = firstSectionRect.top;
    const sectionBottom = firstSectionRect.bottom;

    // Начинаем анимацию когда секция начинает появляться в viewport
    // Прогресс от 0 до 1, когда секция входит в viewport
    const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / windowHeight));

    // Применяем масштабирование от 0.95 до 1 на основе прогресса
    firstSectionScale.value = 0.95 + 0.05 * progress;
  } else {
    // Если слайдер не в области видимости, возвращаем начальный масштаб
    firstSectionScale.value = 0.95;
  }
}
</script>

<style lang="scss" scoped>
.fullpage {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.section {
  height: 100vh;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease-out;
}

.previews {
  position: fixed;
  bottom: 44px;
  left: 44px;
  display: flex;
  flex-direction: column;
}

.thumb {
  position: relative;
  width: 66px;
  height: 88px;
  cursor: pointer;
  border-radius: 6px;
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
  border: 2px solid white;
  border-radius: 6px;
}
</style>

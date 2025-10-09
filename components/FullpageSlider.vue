<template>
  <div ref="sliderWrapper" class="fullpage" @wheel="onWheel">
    <!-- Секции -->
    <div
      v-for="(section, index) in sections"
      :key="index"
      :ref="el => (sectionsRefs[index] = el)"
      class="section"
      :style="{ backgroundImage: `url(${section.img})` }"
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
let isScrolling = false;
let lastScrollTs = 0;
let hasAnchoredOnEnter = false;
let scrollAccumulator = 0;

function lockBodyScroll(locked) {
  if (locked) {
    if (document.body.style.overflow !== 'hidden') {
      document.body.style.overflow = 'hidden';
    }
  } else {
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }
  }
}

function onWheel(e) {
  if (isScrolling) return;

  const wrapperEl = sliderWrapper.value;
  if (!wrapperEl) return;

  const rect = wrapperEl.getBoundingClientRect();
  const sliderIsActive = rect.top <= 0 && rect.bottom > 0;
  if (!sliderIsActive) {
    // Если слайдер неактивен, разрешаем нативный скролл и сбрасываем аккумулятор
    lockBodyScroll(false);
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
    lockBodyScroll(true);
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
    lockBodyScroll(false);
    scrollAccumulator = 0;
  }
}

function goToSection(index) {
  isScrolling = true;
  currentIndex.value = index;
  sectionsRefs.value[index].scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    isScrolling = false;
    const atFirst = currentIndex.value === 0;
    const atLast = currentIndex.value === props.sections.length - 1;
    if (atFirst || atLast) {
      lockBodyScroll(false);
    }
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
          lockBodyScroll(true);
        }
        if (!entry.isIntersecting) {
          hasAnchoredOnEnter = false;
          lockBodyScroll(false);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (sliderWrapper.value) observer.observe(sliderWrapper.value);

  onUnmounted(() => {
    observer.disconnect();
    lockBodyScroll(false); // Убедимся, что скролл разблокирован при размонтировании
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

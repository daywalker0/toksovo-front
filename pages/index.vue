<template>
  <Header />
  <HeroSection />
  <EnvironmentSection />
  <PrivateHousingSection />
  <LocationsSection />

  <!-- Горизонтальный контейнер -->
  <div ref="horizontalWrapper" class="horizontal-wrapper">
    <NatureSection />
    <WalkCitySection />
  </div>

  <MasterPlanSection />
  <FullpageSlider />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Header from '@/components/Common/Header.vue';
import HeroSection from '@/components/HeroSection.vue';
import EnvironmentSection from '@/components/EnvironmentSection.vue';
import PrivateHousingSection from '@/components/PrivateHousingSection.vue';
import LocationsSection from '@/components/LocationsSection.vue';
import NatureSection from '@/components/NatureSection.vue';
import WalkCitySection from '@/components/WalkCitySection.vue';
import MasterPlanSection from '@/components/MasterPlanSection.vue';

const horizontalWrapper = ref(null);
let currentIndex = 0;
let isScrolling = false;
let sections = [];

const scrollToSection = index => {
  if (!sections[index]) return;
  isScrolling = true;
  sections[index].scrollIntoView({ behavior: 'smooth', inline: 'start' });
  setTimeout(() => (isScrolling = false), 800);
};

const onWheel = e => {
  if (!horizontalWrapper.value) return;

  const rect = horizontalWrapper.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Проверяем, что хотя бы часть горизонтального контейнера видна
  const isInViewport = rect.bottom > 0 && rect.top < windowHeight;
  if (!isInViewport) return;

  if (isScrolling) return;

  // Горизонтальный скролл влево/вправо
  if (e.deltaY > 0) {
    // скролл вниз
    if (currentIndex < sections.length - 1) {
      e.preventDefault();
      currentIndex++;
      scrollToSection(currentIndex);
    }
    // если последний слайд, позволяем естественный вертикальный скролл
  } else if (e.deltaY < 0) {
    // скролл вверх
    if (currentIndex > 0) {
      e.preventDefault();
      currentIndex--;
      scrollToSection(currentIndex);
    }
    // если первый слайд, вертикальный скролл тоже естественный
  }
};

onMounted(() => {
  if (!horizontalWrapper.value) return;

  sections = horizontalWrapper.value.querySelectorAll(':scope > *');

  window.addEventListener('wheel', onWheel, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheel);
});
</script>

<style scoped>
.horizontal-wrapper {
  display: flex;
  width: 100%; /* 100% ширины контейнера */
  height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
}

.horizontal-wrapper > * {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
}
</style>

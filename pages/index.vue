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

  // NatureSection (first slide)
  if (currentIndex === 0) {
    if (e.deltaY > 0) {
      e.preventDefault();
      currentIndex = 1;
      scrollToSection(currentIndex);
    }
    // скролл вверх оставляем естественным → ничего не делаем
    return;
  }

  // WalkCitySection (second slide)
  if (currentIndex === 1) {
    if (e.deltaY < 0) {
      e.preventDefault();
      currentIndex = 0;
      scrollToSection(currentIndex);
    }
    // скролл вниз оставляем естественным → ничего не делаем
    return;
  }
};

onMounted(() => {
  if (!horizontalWrapper.value) return;

  sections = horizontalWrapper.value.querySelectorAll(':scope > *');

  // Слушаем wheel на window
  window.addEventListener('wheel', onWheel, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheel);
});
</script>

<style scoped>
.horizontal-wrapper {
  display: flex;
  width: 200vw;
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

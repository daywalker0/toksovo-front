<template>
  <Header />
  <HeroSection />
  <EnvironmentSection />
  <PrivateHousingSection />
  <LocationsSection />

  <div ref="horizontalWrapper" class="horizontal-wrapper">
    <NatureSection />
    <WalkCitySection />
  </div>

  <!-- <MasterPlanSection /> -->
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
  setTimeout(() => {
    isScrolling = false;
  }, 800);
};

const onWheel = e => {
  if (!horizontalWrapper.value) return;

  const rect = horizontalWrapper.value.getBoundingClientRect();
  const offset = 20;
  const isAtTop = rect.top >= -offset && rect.top <= offset;

  if (!isAtTop) return; // контейнер ещё не достиг верхней позиции → вертикальный скролл работает

  // Если скроллим вверх на первой секции, не блокируем вертикальный скролл
  if (e.deltaY < 0 && currentIndex === 0) return;

  e.preventDefault(); // блокируем вертикальный скролл внутри контейнера

  if (isScrolling) return;

  if (e.deltaY > 0 && currentIndex < sections.length - 1) {
    currentIndex += 1;
    scrollToSection(currentIndex);
  } else if (e.deltaY < 0 && currentIndex > 0) {
    currentIndex -= 1;
    scrollToSection(currentIndex);
  }
};

onMounted(() => {
  if (!horizontalWrapper.value) return;

  // получаем секции внутри контейнера
  sections = horizontalWrapper.value.querySelectorAll(':scope > *');

  // слушаем wheel на window, чтобы поймать скролл
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

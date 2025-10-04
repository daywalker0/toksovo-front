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

  <TextBlockSection :title="sectionNewStyle.title" :subtitle="sectionNewStyle.subtitle" />
  <FullpageSlider :sections="sectionNewStyle.sliderImages" />

  <TextBlockSection :title="sectionFirstSteps.title" :subtitle="sectionFirstSteps.subtitle" />
  <FullpageSlider :sections="sectionFirstSteps.sliderImages" />

  <TextBlockSection :title="sectionLiveNearby.title" :subtitle="sectionLiveNearby.subtitle" />
  <MapSection />

  <TextBlockSection :title="sectionLiveOwnSpace.title" :subtitle="sectionLiveOwnSpace.subtitle" />
  <AppsLayoutsSection :apartments="apartments" />
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
import FullpageSlider from '@/components/FullpageSlider.vue';
import TextBlockSection from '@/components/TextBlockSection.vue';
import MapSection from '@/components/MapSection.vue';
import AppsLayoutsSection from '@/components/AppsLayoutsSection.vue';

import liveInStyleItem1 from '@/assets/img/live-in-style-item-1.png';
import liveInStyleItem2 from '@/assets/img/live-in-style-item-2.png';
import liveInStyleItem3 from '@/assets/img/live-in-style-item-3.png';

import firstStepsItem1 from '@/assets/img/first-steps-item-1.png';
import firstStepsItem2 from '@/assets/img/first-steps-item-2.png';
import firstStepsItem3 from '@/assets/img/first-steps-item-3.png';

const sectionNewStyle = {
  title: 'Жить в стиле',
  subtitle: `Современная архитектура комплекса сочетает лаконичные формы и натуральные материалы.
    Большие окна наполняют квартиры светом,
    а фасады гармонично вписываются в природное окружение.
    Каждый дом продуман так, чтобы создавать ощущение уюта и спокойствия.`,
  sliderImages: [{ img: liveInStyleItem1 }, { img: liveInStyleItem2 }, { img: liveInStyleItem3 }],
};

const sectionFirstSteps = {
  title: 'Жить с первых шагов',
  subtitle: `Лобби встречает жителей тёплой атмосферой и современным дизайном.
    Натуральные материалы, спокойные линии и продуманное освещение.
    Здесь начинается настроение дома — с комфорта и стиля уже на входе.`,
  sliderImages: [{ img: firstStepsItem1 }, { img: firstStepsItem2 }, { img: firstStepsItem3 }],
};

const sectionLiveNearby = {
  title: 'Жить там где все рядом',
  subtitle: `Инфраструктура района создана для жизни без лишних забот.
    Рядом с домом — магазины, парки и места для отдыха.
    Всё необходимое находится на расстоянии прогулки,
    чтобы комфорт начинался не только дома, но и вокруг него.`,
};

const sectionLiveOwnSpace = {
  title: 'Жить в своем пространстве',
  subtitle: `Продуманные планировки объединяют уют и функциональность.
    Пространство организовано так, чтобы каждый метр работал на комфорт.
    Здесь легко найти решение под свой ритм жизни и привычки.`,
};

const apartments = [
  {
    name: '1-К. №14',
    area: 21.8,
    floors: '2–9',
    price: '5 312 660',
    features: ['Просторная кухня гостиная', 'Дополнительная гардеробная'],
    imgs: [firstStepsItem1, firstStepsItem1, firstStepsItem1, firstStepsItem1],
    area1: '15,54', // добавить
    area2: '10,43', // добавить
  },
  {
    name: '1-К. №14',
    area: 21.8,
    floors: '2–9',
    price: '5 312 660',
    features: ['Просторная кухня гостиная', 'Дополнительная гардеробная'],
    imgs: [firstStepsItem1, firstStepsItem1, firstStepsItem1, firstStepsItem1],
    area1: '15,54', // добавить
    area2: '10,43', // добавить
  },
];

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

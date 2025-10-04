<template>
  <Header />
  <HeroSection />
  <EnvironmentSection />
  <PrivateHousingSection />
  <LocationsSection />

  <!-- Горизонтальный контейнер -->
  <div ref="horizontalWrapper" class="horizontal-wrapper">
    <div class="horizontal-container">
      <NatureSection />
      <WalkCitySection />
    </div>
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

  <ConstructionSection />
  <NewsSection />
  <ProjectsSection />
  <ChooseYouAppsSection />

  <Footer />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
import ConstructionSection from '@/components/ConstructionSection.vue';
import NewsSection from '@/components/NewsSection.vue';
import ProjectsSection from '@/components/ProjectsSection.vue';
import ChooseYouAppsSection from '@/components/ChooseYouAppsSection.vue';
import Footer from '@/components/Footer.vue';

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
    area1: '15,54',
    area2: '10,43',
  },
  {
    name: '1-К. №14',
    area: 21.8,
    floors: '2–9',
    price: '5 312 660',
    features: ['Просторная кухня гостиная', 'Дополнительная гардеробная'],
    imgs: [firstStepsItem1, firstStepsItem1, firstStepsItem1, firstStepsItem1],
    area1: '15,54',
    area2: '10,43',
  },
];

const horizontalWrapper = ref(null);

gsap.registerPlugin(ScrollTrigger);

const initHorizontalScroll = () => {
  if (!horizontalWrapper.value) {
    return;
  }

  const horizontalContainer = horizontalWrapper.value.querySelector('.horizontal-container');
  const horizontalSections = gsap.utils.toArray('.horizontal-container > *');

  if (horizontalSections.length === 0) {
    console.error('No horizontal sections found');
    return;
  }

  const totalWidth = horizontalSections.length * 100;

  gsap.set(horizontalContainer, {
    width: `${totalWidth}vw`,
  });

  // Создаем timeline с четкими шагами для каждой секции
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: horizontalWrapper.value,
      start: 'top top',
      end: () => `+=${window.innerHeight * (horizontalSections.length + 1)}`, // Высота окна × количество секций + 1
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      markers: false,
    },
  });

  // Добавляем паузы между анимациями для фиксации
  horizontalSections.forEach((_, index) => {
    if (index === 0) return; // Первая секция уже видна

    const position = `-${index * 100}vw`;

    // Добавляем паузу перед анимацией (25% времени)
    tl.to(horizontalContainer, {
      duration: 0.25,
      ease: 'power1.inOut',
    });

    // Анимация перехода к следующей секции (50% времени)
    tl.to(horizontalContainer, {
      x: position,
      duration: 0.5,
      ease: 'power1.inOut',
    });

    // Пауза на секции (25% времени)
    tl.to(horizontalContainer, {
      duration: 0.25,
      ease: 'power1.inOut',
    });
  });

  ScrollTrigger.refresh();
};

onMounted(() => {
  // Ждем следующего тика для гарантии, что DOM полностью обновлен
  nextTick(() => {
    initHorizontalScroll();
  });
});

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style scoped>
.horizontal-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.horizontal-container {
  display: flex;
  height: 100vh;
  position: relative;
}

.horizontal-container > * {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
}
</style>

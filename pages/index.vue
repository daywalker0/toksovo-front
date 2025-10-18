<template>
  <div>
    <AppHeader :active-section="activeSection" />
    <section id="hero">
      <HeroSection />
    </section>
    <div class="main-sections">
      <section id="about">
        <TextBlockSection :text="sectionEnvironment.text" :subtitle="sectionEnvironment.subtitle" />
        <EnvironmentSection />
        <LocationsSection />
      </section>

      <!-- Горизонтальный контейнер -->
      <div ref="horizontalWrapper" class="horizontal-wrapper">
        <div class="horizontal-container">
          <NatureSection />
          <WalkCitySection />
        </div>
      </div>

      <MasterPlanSection />

      <section id="architecture">
        <TextBlockSection :text="sectionNewStyle.text" :subtitle="sectionNewStyle.subtitle" />
        <FullpageSlider :sections="sectionNewStyle.sliderImages" />

        <TextBlockSection :text="sectionFirstSteps.text" :subtitle="sectionFirstSteps.subtitle" />
        <FullpageSlider :sections="sectionFirstSteps.sliderImages" />
      </section>

      <section id="infrastructure">
        <TextBlockSection :text="sectionLiveNearby.text" :subtitle="sectionLiveNearby.subtitle" />
        <NewMapSection :zoom="16" />
      </section>

      <section id="layouts">
        <TextBlockSection
          :text="sectionLiveOwnSpace.text"
          :subtitle="sectionLiveOwnSpace.subtitle"
        />
        <AppsLayoutsSection :apartments="apartments" />
      </section>

      <ConstructionSection />
      <NewsSection />
      <ProjectsSection />
      <ChooseYouAppsSection />

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Функция для обновления hash в URL
const updateUrlHash = () => {
  const sections = [
    { id: 'hero', element: document.getElementById('hero') },
    { id: 'about', element: document.getElementById('about') },
    { id: 'master-plan', element: document.getElementById('master-plan') },
    { id: 'architecture', element: document.getElementById('architecture') },
    { id: 'infrastructure', element: document.getElementById('infrastructure') },
    { id: 'layouts', element: document.getElementById('layouts') },
    { id: 'construction', element: document.getElementById('construction') },
    { id: 'news', element: document.getElementById('news') },
  ];

  let currentSection = null;
  let maxVisibleRatio = 0;

  sections.forEach(({ id, element }) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Простая логика: секция активна если её верхняя часть видна
      const isVisible = rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5;

      if (isVisible) {
        currentSection = id;
      }
    }
  });

  if (currentSection && activeSection.value !== currentSection) {
    activeSection.value = currentSection;
    const newUrl = `${window.location.pathname}#${currentSection}`;
    window.history.replaceState(null, '', newUrl);
  }
};
import AppHeader from '~/components/Common/AppHeader.vue';
import HeroSection from '@/components/HeroSection.vue';
import EnvironmentSection from '@/components/EnvironmentSection.vue';
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
import AppLoader from '@/components/Common/AppLoader.vue';

import liveInStyleItem1 from '@/assets/img/live-in-style-item-1.png';
import liveInStyleItem2 from '@/assets/img/live-in-style-item-2.png';
import liveInStyleItem3 from '@/assets/img/live-in-style-item-3.png';

import firstStepsItem1 from '@/assets/img/first-steps-item-1.png';
import firstStepsItem2 from '@/assets/img/first-steps-item-2.png';
import firstStepsItem3 from '@/assets/img/first-steps-item-3.png';

const activeSection = ref('hero');

const sectionEnvironment = {
  text: 'Спокойствие свежесть природа',
  subtitle: `Утро встречает вас чистым воздухом и спокойствием — прогулка, кофе на террасе или время с
    семьёй. Днём вы легко погружаетесь в деловую жизнь города, ведь вся инфраструктура
    и удобства находятся неподалёку. Вечером же Токсово возвращает ощущение свободы, когда можно
    насладиться тишиной, уединением и красотой природы.`,
};

const sectionNewStyle = {
  text: 'Жить в стиле',
  subtitle: `Современная архитектура комплекса сочетает лаконичные формы и натуральные материалы.
    Большие окна наполняют квартиры светом,
    а фасады гармонично вписываются в природное окружение.
    Каждый дом продуман так, чтобы создавать ощущение уюта и спокойствия.`,
  sliderImages: [
    { image: liveInStyleItem1 },
    { image: liveInStyleItem2 },
    { image: liveInStyleItem3 },
  ],
};

const sectionFirstSteps = {
  text: 'Жить с первых шагов',
  subtitle: `Лобби встречает жителей тёплой атмосферой и современным дизайном.
    Натуральные материалы, спокойные линии и продуманное освещение.
    Здесь начинается настроение дома — с комфорта и стиля уже на входе.`,
  sliderImages: [
    { image: firstStepsItem1 },
    { image: firstStepsItem2 },
    { image: firstStepsItem3 },
  ],
};

const sectionLiveNearby = {
  text: 'Жить там, где все рядом',
  subtitle: `Инфраструктура района создана для жизни без лишних забот.
    Рядом с домом — магазины, парки и места для отдыха.
    Всё необходимое находится на расстоянии прогулки,
    чтобы комфорт начинался не только дома, но и вокруг него.`,
};

const sectionLiveOwnSpace = {
  text: 'Жить в своем пространстве',
  subtitle: `Продуманные планировки объединяют уют и функциональность.
    Пространство организовано так, чтобы каждый метр работал на комфорт.
    Здесь легко найти решение под свой ритм жизни и привычки.`,
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
let horizontalScrollTrigger = null;

gsap.registerPlugin(ScrollTrigger);

const initHorizontalScroll = () => {
  if (!horizontalWrapper.value) return;

  const container = horizontalWrapper.value.querySelector('.horizontal-container');
  if (!container) return;

  const sections = gsap.utils.toArray('.horizontal-container > *');
  if (sections.length === 0) return;

  // Уничтожаем предыдущий trigger
  if (horizontalScrollTrigger) {
    horizontalScrollTrigger.scrollTrigger?.kill();
    horizontalScrollTrigger.kill();
  }

  // Явно устанавливаем ширину контейнера
  const sectionWidth = window.innerWidth;
  const totalWidth = sectionWidth * sections.length;

  gsap.set(container, {
    width: totalWidth,
    x: 0,
    force3D: true,
  });

  // Вычисляем точное расстояние движения
  // У нас 2 секции, нужно проскроллить 1 ширину экрана чтобы показать вторую
  const scrollDistance = totalWidth - sectionWidth;

  // Используем timeline для добавления пауз
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: horizontalWrapper.value,
      start: 'center center',
      end: () => `+=${scrollDistance * 2.5}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // Пауза при входе - 35% времени
  tl.to({}, { duration: 0.35, ease: 'none' }, 0);

  // Основное горизонтальное движение - 30% времени
  tl.to(
    container,
    {
      x: -scrollDistance,
      ease: 'none',
      duration: 0.3,
    },
    0.35
  );

  // Пауза при выходе - 35% времени
  tl.to({}, { duration: 0.35, ease: 'none' }, 0.65);

  horizontalScrollTrigger = tl;
};

onMounted(() => {
  // Ждем следующего тика для гарантии, что DOM полностью обновлен
  nextTick(() => {
    initHorizontalScroll();

    // Обработка resize для пересчета горизонтального скролла
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initHorizontalScroll();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    // Добавляем обработчик скролла для обновления hash
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateUrlHash, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Обработка hash при загрузке страницы
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          activeSection.value = window.location.hash.replace('#', '');
        }, 500);
      }
    }

    // Обработчик изменения hash
    const handleHashChange = () => {
      if (window.location.hash) {
        const newSection = window.location.hash.replace('#', '');
        activeSection.value = newSection;
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Обработчик для очистки при размонтировании
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', handleResize);
    });
  });
});

onBeforeUnmount(() => {
  if (horizontalScrollTrigger) {
    horizontalScrollTrigger.scrollTrigger?.kill();
    horizontalScrollTrigger.kill();
    horizontalScrollTrigger = null;
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.main-sections {
  position: relative;
  z-index: 100;
  background: rgba(248, 243, 237, 1);
}
.horizontal-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }
}

.horizontal-container {
  display: flex;
  height: 100vh;
  position: relative;
  will-change: transform;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }

  > * {
    width: 100vw;
    height: 100vh;
    flex-shrink: 0;

    @media (max-width: $breakpoint-x) {
      height: 100svh;
    }
  }
}

.content-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>

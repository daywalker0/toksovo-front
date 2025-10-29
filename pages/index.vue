<template>
  <div>
    <AppHeader :active-section="activeSection" />
    
    <section id="hero">
      <HeroSection 
        :title="heroBlock?.title"
        :description="heroBlock?.description"
        :image="heroBlock?.image"
      />
    </section>
    
    <div class="main-sections">
      <section id="about">
        <TextBlockSection 
          :text="calmNatureBlock?.title" 
          :subtitle="calmNatureBlock?.subtitle" 
        />
        <EnvironmentSection v-if="environmentBlock?.slider?.length" :data="environmentBlock" />
        <LocationsSection v-if="locationsBlock?.location_card?.length" :data="locationsBlock" />
      </section>

      <div ref="horizontalWrapper" class="horizontal-wrapper">
        <div class="horizontal-container">
          <NatureSection :data="natureLivingBlock1" />
          <WalkCitySection :data="natureLivingBlock2" />
        </div>
      </div>

      <MasterPlanSection :data="genplanBlock" />

      <section id="architecture">
        <TextBlockSection 
          :text="styleLivingBlock?.title" 
          :subtitle="styleLivingBlock?.subtitle" 
        />
        <FullpageSlider :sections="styleLivingBlock?.slider || []" />
        
        <TextBlockSection 
          :text="firstStepsBlock?.title" 
          :subtitle="firstStepsBlock?.subtitle" 
        />
        <FullpageSlider :sections="firstStepsBlock?.slider || []" />
      </section>

      <section id="infrastructure">
        <TextBlockSection 
          :text="mapBlock?.title" 
          :subtitle="mapBlock?.subtitle" 
        />
        <MapSection :zoom="16" :data="mapBlock" />
      </section>

      <section id="layouts" v-if="layoutsBlock?.kvartiries?.length">
        <TextBlockSection
          :text="layoutsBlock?.title"
          :subtitle="layoutsBlock?.description"
        />
        <AppsLayoutsSection :data="layoutsBlock" />
      </section>

      <FeaturesSection :data="featuresBlock" />

      <ConstructionSection :data="constructionBlock" />
      <NewsSection :data="newsBlock" />
      <ProjectsSection :data="projectsBlock" />
      
      <ChooseYouAppsSection />

      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AppHeader from '~/components/Common/AppHeader.vue';
import Footer from '@/components/Footer.vue';

const mainStore = useMainStore()
await mainStore.fetchMainData()

const heroBlock = computed(() => mainStore.getHeroBlock)
const calmNatureBlock = computed(() => mainStore.getCalmNatureBlock)
const environmentBlock = computed(() => mainStore.getEnvironmentBlock)
const locationsBlock = computed(() => mainStore.getLocationsBlock)
const natureLivingBlock1 = computed(() => mainStore.getNatureLivingBlock.life_benefit_card[0])
const natureLivingBlock2 = computed(() => mainStore.getNatureLivingBlock.life_benefit_card[1])
const genplanBlock = computed(() => mainStore.getGenplanBlock)
const styleLivingBlock = computed(() => mainStore.getStyleLivingBlock)
const firstStepsBlock = computed(() => mainStore.getFirstStepsBlock)
const mapBlock = computed(() => mainStore.getMapBlock)
const layoutsBlock = computed(() => mainStore.getLayoutsBlock)
const featuresBlock = computed(() => mainStore.getFeaturesBlock)
const constructionBlock = computed(() => mainStore.getConstructionBlock)
const newsBlock = computed(() => mainStore.getNewsBlock)
const projectsBlock = computed(() => mainStore.getProjectsBlock)

const updateActiveSection = () => {
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

  sections.forEach(({ id, element }) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isVisible = rect.top <= windowHeight * 0.1 && rect.bottom >= windowHeight * 0.9;

      if (isVisible) {
        currentSection = id;
      }
    }
  });

  // Если ни одна секция не соответствует строгим критериям, проверяем hero
  if (!currentSection) {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      const rect = heroElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Hero считается активным если он видим на экране (даже в нижней части)
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        currentSection = 'hero';
      }
    }
  }

  if (currentSection && activeSection.value !== currentSection) {
    activeSection.value = currentSection;
    // Не обновляем URL при прокрутке
  }
};

const activeSection = ref('hero');
const handleScroll = ref(null);
const handleResize = ref(null);

const horizontalWrapper = ref(null);
let horizontalScrollTrigger = null;

gsap.registerPlugin(ScrollTrigger);

const initHorizontalScroll = () => {
  if (window.innerWidth <= 1280) {
    if (horizontalScrollTrigger) {
      horizontalScrollTrigger.scrollTrigger?.kill();
      horizontalScrollTrigger.kill();
      horizontalScrollTrigger = null;
    }
    return;
  }

  const root = horizontalWrapper.value;
  if (!root) return;

  const container = root.querySelector('.horizontal-container');
  if (!container) return;

  // убить прошлый tween/trigger только этого блока
  if (horizontalScrollTrigger) {
    horizontalScrollTrigger.scrollTrigger?.kill();
    horizontalScrollTrigger.kill();
    horizontalScrollTrigger = null;
  }

  const getDistance = () => Math.max(0, container.scrollWidth - window.innerWidth);

  gsap.set(container, { x: 0 });

  horizontalScrollTrigger = gsap.to(container, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${getDistance()}`,
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    },
  });
};

onMounted(() => {
  nextTick(() => {
    initHorizontalScroll();

    const isMobile = window.innerWidth <= 599;
    const refreshDelays = isMobile ? [500, 2000] : [100, 300, 500, 1000, 2000, 3000, 4000];
    refreshDelays.forEach(delay => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, delay);
    });

    window.addEventListener('load', () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    });

    let resizeTimeout;
    handleResize.value = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initHorizontalScroll();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize.value);

    let isScrolling = false;
    handleScroll.value = () => {
      if (isScrolling) return;
      isScrolling = true;

      setTimeout(() => {
        updateActiveSection();
        isScrolling = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll.value, { passive: true });
  });
});

onBeforeUnmount(() => {
  // Очистка горизонтального скролла
  if (horizontalScrollTrigger) {
    horizontalScrollTrigger.scrollTrigger?.kill();
    horizontalScrollTrigger.kill();
    horizontalScrollTrigger = null;
  }
  
  // Очистка ScrollTrigger
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Очистка event listeners
  if (handleScroll.value) {
    window.removeEventListener('scroll', handleScroll.value);
  }
  if (handleResize.value) {
    window.removeEventListener('resize', handleResize.value);
  }
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

  @media (max-width: $breakpoint-lg) {
    height: auto;
    overflow: visible;
  }

  @media (max-width: $breakpoint-x) {
    width: 100%;
    height: auto;
    overflow: visible;
  }
}

.horizontal-container {
  display: flex;
  height: 100vh;
  position: relative;
  will-change: transform;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);

  @media (max-width: $breakpoint-lg) {
    height: auto;
    flex-direction: column;
  }

  @media (max-width: $breakpoint-x) {
    height: auto;
    flex-direction: column;
    transform: none;
    will-change: auto;
  }

  > * {
    width: 100vw;
    height: 100vh;
    flex-shrink: 0;

    @media (max-width: $breakpoint-lg) {
      height: 100%;
      width: 100%;
    }

    @media (max-width: $breakpoint-x) {
      height: auto;
      width: 100%;
    }
  }
}

.content-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>

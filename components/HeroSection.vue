<template>
  <div class="hero-section section" ref="sectionEl">
    <div class="hero-section__container container">
      <div class="hero-section__content">
        <h1 class="hero-section__title" aria-label="Поинт Токсово">
          {{ titleText }}
        </h1>
        <div
          class="subtitle-text hero-section__subtitle"
          aria-label="комфорт, который становится частью вашего дня"
        >
          <span class="subtitle-animated">{{ subtitleText }}</span>
        </div>
      </div>
    </div>
    <div class="hero-section__parallax-container" ref="parallaxContainer">
      <div class="hero-section__sky" ref="skyEl">
        <img :src="bgSkyImg" alt="Небо на фоне" loading="eager" />
      </div>
      <div class="hero-section__bg" ref="renderEl">
        <img :src="heroBgImg" alt="Жилой комплекс Поинт Токсово" loading="eager" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import bgSkyImg from '@/assets/img/bg-sky.jpg';
import heroBgImg from '@/assets/img/hero-bg.png';

const titleText = 'Поинт Токсово';
const subtitleText = 'комфорт, который становится частью вашего дня';

const sectionEl = ref(null);
const renderEl = ref(null);
const skyEl = ref(null);

let gsap, ScrollTrigger;
let tl;

onMounted(async () => {
  const m = await import('gsap');
  const s = await import('gsap/ScrollTrigger');
  gsap = m.gsap || m.default || m;
  ScrollTrigger = s.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth <= 599;
  const startScale = isMobile ? 3.1 : 2.3;

  const titleEl = sectionEl.value?.querySelector('.hero-section__title');
  const subtitleEl = sectionEl.value?.querySelector('.hero-section__subtitle');

  gsap.set(renderEl.value, {
    transformOrigin: isMobile ? '50% 60%' : '50% 50%',
    scale: startScale,
    force3D: true,
    willChange: 'transform',
  });

  if (titleEl) {
    gsap.set(titleEl, {
      y: 0,
      opacity: 1,
      force3D: true,
    });
  }

  if (subtitleEl) {
    gsap.set(subtitleEl, {
      y: 0,
      opacity: 1,
      force3D: true,
    });
  }

  tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: sectionEl.value,
      start: 'top top',
      end: 'bottom bottom+=1000',
      scrub: isMobile ? 0.5 : true,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
    },
  });

  tl.to(
    renderEl.value,
    {
      scale: 1,
      duration: 1,
      ease: 'none',
    },
    0
  );

  if (subtitleEl) {
    tl.to(
      subtitleEl,
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power1.out',
      },
      0.2
    );
  }

  ScrollTrigger.create({
    trigger: sectionEl.value,
    start: 'top top',
    end: 'bottom top',
    onLeave: () => {
      if (renderEl.value) renderEl.value.style.opacity = '0';
      if (skyEl.value) skyEl.value.style.opacity = '0';
    },
    onEnterBack: () => {
      if (renderEl.value) renderEl.value.style.opacity = '1';
      if (skyEl.value) skyEl.value.style.opacity = '1';
    },
  });
});

onBeforeUnmount(() => {
  tl?.scrollTrigger?.kill();
  tl?.kill();
  ScrollTrigger?.getAll().forEach(st => st.kill());
  ScrollTrigger?.refresh();
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.hero-section {
  position: relative;
  min-height: 160vh; // соответствует длине анимации
  overflow: hidden;

  &__container {
    position: relative;
    z-index: 2; // контент над фоном
    min-height: 160vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  &__content {
    margin: 0 auto;
    padding-top: 100px;
    max-width: 660px;
    text-align: center;
    position: relative;
    z-index: 1;

    @media (max-width: $breakpoint-x) {
      padding-top: 100px;
      max-width: 90%;
    }
  }

  &__title {
    font-size: 120px;
    font-weight: 400;
    line-height: 0.8;
    margin: 0;
    color: $text-color-primary;
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: none;

    @media (max-width: $breakpoint-lg) {
      font-size: 100px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 60px;
      line-height: 0.9;
    }
  }

  &__subtitle {
    font-size: 36px;
    line-height: 110%;
    max-width: 460px;
    margin: 0 auto;
    padding-top: 30px;
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: none;

    @media (max-width: $breakpoint-lg) {
      font-size: 30px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 22px;
      max-width: 250px;
      padding-top: 20px;
    }
  }

  &__sky {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    backface-visibility: hidden;
    transform: translateZ(0);
    transition: opacity 0.3s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      will-change: transform;
    }
  }

  &__bg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    z-index: 1;
    transform-origin: center bottom;
    pointer-events: none;
    backface-visibility: hidden;
    will-change: transform;
    transition: opacity 0.3s ease;

    @media (max-width: $breakpoint-x) {
      transform-origin: 50% 60%;
    }

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center bottom;
      display: block;
    }
  }
}

.char {
  display: inline-block;
  opacity: 0;
  transform: translateY(110%);
  transform-origin: bottom;
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay);
  will-change: transform, opacity;

  @media (max-width: $breakpoint-x) {
    transform: translateY(60%);
    animation-duration: 0.4s;
  }
}

.word {
  display: inline-block;
  white-space: nowrap; // keep letters of a word together
  overflow: hidden; // clip letters so they slide in from below
}

.subtitle-animated {
  display: inline-block;
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: none;
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .char {
    opacity: 1;
    transform: none;
  }

  .subtitle-animated {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>

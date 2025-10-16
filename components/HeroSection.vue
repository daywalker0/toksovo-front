<template>
  <div class="hero-section section" ref="sectionEl">
    <div class="hero-section__container container">
      <div class="hero-section__content">
        <h1 class="hero-section__title" aria-label="Поинт Токсово">
          <span class="word">
            <span
              v-for="(ch, i) in firstWordLetters"
              :key="`t1-${i}`"
              class="char"
              :style="{ '--delay': `${titleStartDelay + i * letterDelay}s` }"
              v-text="ch"
            />
          </span>
          <br />
          <span class="word">
            <span
              v-for="(ch, i) in secondWordLetters"
              :key="`t2-${i}`"
              class="char"
              :style="{
                '--delay': `${titleStartDelay + (firstWordLetters.length + i) * letterDelay}s`,
              }"
              v-text="ch"
            />
          </span>
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
        <img :src="bgSkyImg" />
      </div>
      <div class="hero-section__bg" ref="renderEl">
        <img :src="heroBgImg" />
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

const letterDelay = 0.05; // seconds per letter
const titleStartDelay = 0.3; // initial delay before title starts

const sectionEl = ref(null);
const renderEl = ref(null);
const skyEl = ref(null);

let gsap, ScrollTrigger;
let st;

onMounted(async () => {
  // SSR-safe импорт
  const m = await import('gsap');
  const s = await import('gsap/ScrollTrigger');
  gsap = m.gsap || m.default || m;
  ScrollTrigger = s.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth <= 599;
  const startScale = isMobile ? 3.1 : 2.3; // ваш стартовый масштаб

  // начальные значения
  gsap.set(renderEl.value, { transformOrigin: '50% 50%', scale: startScale });
  // sky фиксированный фон, без анимации

  st = gsap.to(renderEl.value, {
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionEl.value,
      start: 'top top',
      end: '+=100vh', // глубина анимации; при необходимости поменяйте
      scrub: 1,
    },
  });
});

onBeforeUnmount(() => {
  st?.scrollTrigger?.kill();
  st?.kill();
  ScrollTrigger?.refresh();
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.hero-section {
  position: relative;
  min-height: 150vh; // пространство для скролла
  overflow: hidden;

  &__container {
    position: relative;
    z-index: 2; // контент над фоном
    min-height: 200vh;
    display: flex;
    align-items: flex-start;
  }

  // Фиксированный неанимируемый фон
  &__sky {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  // Фиксированный слой, который масштабируется к 0
  &__bg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    z-index: 1;
    transform-origin: center bottom;
    pointer-events: none;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center bottom;
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
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 1.5s; // Задержка после заголовка
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: none;

  @media (max-width: $breakpoint-x) {
    transform: translateY(20px);
    animation-duration: 0.6s;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .char {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .subtitle-animated {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>

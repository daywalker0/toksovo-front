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
          <span
            v-for="(ch, i) in subtitleLetters"
            :key="`s-${i}`"
            class="char"
            :class="{ space: ch === ' ' }"
            :style="{ '--delay': `${subtitleStartDelay + i * letterDelay}s` }"
            v-html="ch === ' ' ? '&nbsp;' : ch"
          />
        </div>
      </div>
    </div>
    <div class="hero-section__sky" ref="skyEl">
      <img :src="bgSkyImg" />
    </div>
    <div class="hero-section__bg" ref="renderEl">
      <img :src="heroBgImg" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import bgSkyImg from '@/assets/img/bg-sky.jpg';
import heroBgImg from '@/assets/img/hero-bg.png';

const titleText = 'Поинт Токсово';
const subtitleText = 'комфорт, который становится частью вашего дня';

const letterDelay = 0.05; // seconds per letter
const titleStartDelay = 0.3; // initial delay before title starts

const titleLetters = computed(() => Array.from(titleText));
const [firstWord, secondWord] = titleText.split(' ');
const firstWordLetters = computed(() => Array.from(firstWord));
const secondWordLetters = computed(() => Array.from(secondWord));
const subtitleLetters = computed(() => Array.from(subtitleText));

const subtitleStartDelay = computed(
  () => titleStartDelay + titleLetters.value.length * letterDelay + 0.2
);

// GSAP ScrollTrigger pin + zoom-out
const sectionEl = ref(null);
const renderEl = ref(null);
const skyEl = ref(null);

let gsapInstance = null;
let scrollTrigger = null;
let timeline = null;

onMounted(async () => {
  try {
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    gsapInstance = gsap;

    // Адаптивные параметры для мобильных устройств
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 599;
    const renderStartScale = isMobile ? 3.1 : 3.6;
    const skyStartScale = isMobile ? 1.1 : 1.2;

    // Устанавливаем рендер внизу секции с большим масштабом
    gsap.set(renderEl.value, {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      transformOrigin: 'center bottom',
      scale: renderStartScale,
      zIndex: 1,
    });

    gsap.set(skyEl.value, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      transformOrigin: 'center bottom',
      scale: skyStartScale,
      zIndex: 0,
    });

    timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top top',
        end: () => `+=${typeof window !== 'undefined' ? window.innerHeight : 1000}`,
        scrub: 0.3,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      },
    });

    timeline
      .to(
        renderEl.value,
        {
          scale: 1,
          ease: 'power2.out',
        },
        0
      )
      .to(
        skyEl.value,
        {
          scale: 1,
          ease: 'power2.out',
        },
        0
      );
  } catch (e) {
    console.error(e);
  }
});

onBeforeUnmount(() => {
  try {
    if (timeline) timeline.kill();
    if (scrollTrigger) scrollTrigger.kill();
  } catch {}
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.hero-section {
  position: relative;
  background: none;
  min-height: 200vh;
  overflow: hidden;

  @media (max-width: $breakpoint-x) {
    min-height: 100svh;
  }

  &__container {
    min-height: 200vh;

    @media (max-width: $breakpoint-x) {
      min-height: 100svh;
    }
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

    @media (max-width: $breakpoint-lg) {
      font-size: 30px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 22px;
      max-width: 250px;
      padding-top: 20px;
    }
  }

  &__bg {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    transform-origin: center bottom;
    will-change: transform;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center bottom;

      @media (max-width: $breakpoint-x) {
        object-position: center 70%;
      }
    }
  }

  &__sky {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
    pointer-events: none;
    height: 200vh;
    transform-origin: center bottom;
    will-change: transform;

    @media (max-width: $breakpoint-x) {
      height: 200vh;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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

.space {
  width: 0.5ch;
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
}
</style>

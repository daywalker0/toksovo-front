<template>
  <div class="hero-section-wrapper">
    <div class="hero-section section" ref="sectionEl">
      <div class="hero-section__container container">
        <div class="hero-section__content">
          <h1 class="hero-section__title" :aria-label="titleText">
            {{ titleText }}
          </h1>
          <div class="subtitle-text hero-section__subtitle" :aria-label="subtitleText">
            <span class="subtitle-animated">{{ subtitleText }}</span>
          </div>
          <NuxtLink to="tel:+3337767" class="hero-section__button">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.08543 1.0413C2.83739 0.291733 4.09819 0.501343 4.63054 1.38577L4.63427 1.39193L5.86141 3.48902C6.22277 4.11943 6.13161 4.92984 5.5925 5.46724L5.38895 5.67013C6.1096 6.80047 7.2044 7.91876 8.31099 8.58948L8.51329 8.41024C9.05244 7.88458 9.85721 7.79821 10.4844 8.15544L10.4889 8.15801L12.5655 9.36558C13.0797 9.61167 13.3502 10.0872 13.4057 10.562C13.461 11.0364 13.3091 11.5513 12.9399 11.9194L12.2402 12.6169C11.5136 13.3411 10.3309 13.6616 9.32167 13.2043C7.99315 12.6614 6.00064 11.637 4.18468 9.82681C2.36399 8.0119 1.33769 5.96374 0.798488 4.71082C0.338495 3.70779 0.655475 2.53176 1.37693 1.80572L2.06928 1.05806C2.07455 1.05237 2.07994 1.04678 2.08543 1.0413ZM2.91645 1.85718L2.2265 2.60225C2.22123 2.60794 2.21584 2.61353 2.21035 2.61901C1.77358 3.05438 1.62827 3.72879 1.86096 4.23135C1.86321 4.23622 1.86538 4.24108 1.86749 4.24598C2.37871 5.43504 3.33463 7.33535 5.00936 9.00477C6.68706 10.6771 8.53712 11.6284 9.77441 12.1329C9.78235 12.1361 9.7902 12.1396 9.79798 12.1431C10.3022 12.3751 10.9787 12.2303 11.4155 11.7949L12.1153 11.0973C12.2125 11.0004 12.2647 10.8468 12.2472 10.6963C12.2308 10.5554 12.1609 10.4589 12.053 10.41C12.0351 10.4019 12.0175 10.3928 12.0005 10.3829L9.90391 9.16379C9.7202 9.06019 9.48461 9.08593 9.32451 9.24553C9.31642 9.25358 9.30814 9.2614 9.29958 9.26894L8.77478 9.73398C8.59402 9.89412 8.33288 9.92648 8.11833 9.81526C6.545 8.99972 5.00982 7.40006 4.14657 5.86341C4.01898 5.63629 4.05837 5.35237 4.24301 5.16834L4.76782 4.64521C4.92793 4.48561 4.95375 4.25076 4.84984 4.06763L3.62898 1.9814C3.46281 1.70884 3.09916 1.68397 2.91645 1.85718Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.48235 4.51767C9.18987 4.22519 8.7381 4.12035 8.41863 4.22682C8.08621 4.33762 7.72691 4.15795 7.61612 3.82556C7.50528 3.49315 7.68495 3.13385 8.01737 3.02304C8.83991 2.74886 9.78386 3.02468 10.3796 3.62042C10.9753 4.21617 11.2512 5.16012 10.977 5.98266C10.8662 6.31508 10.5069 6.49475 10.1745 6.38391C9.84204 6.27312 9.66241 5.91382 9.77321 5.5814C9.87968 5.26193 9.77484 4.81016 9.48235 4.51767Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.0537 2.94624C10.0188 1.91132 8.51445 1.5471 7.16648 1.91001C6.84915 1.99544 6.52267 1.80746 6.43724 1.49014C6.3518 1.17281 6.53979 0.846315 6.85712 0.76088C8.60327 0.290757 10.55 0.759569 11.8952 2.10475C13.2404 3.44993 13.7092 5.3967 13.2391 7.14285C13.1537 7.46018 12.8271 7.64817 12.5099 7.56273C12.1925 7.47729 12.0045 7.15082 12.09 6.83349C12.4529 5.48552 12.0886 3.98114 11.0537 2.94624Z"
                fill="white"
              />
            </svg>
            333 77 67</NuxtLink
          >
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
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import bgSkyImg from '@/assets/img/bg-sky.jpg';
import heroBgImg from '@/assets/img/hero-bg.png';

const props = defineProps({
  title: String,
  description: String,
});

const titleText = computed(() => props.title);
const subtitleText = computed(() => props.description);

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
  const titleEl = sectionEl.value?.querySelector('.hero-section__title');
  const subtitleEl = sectionEl.value?.querySelector('.hero-section__subtitle');

  // Отключаем анимацию на мобильных устройствах (599px и менее)
  if (isMobile) {
    // Просто устанавливаем финальные значения без анимации
    if (renderEl.value) {
      gsap.set(renderEl.value, {
        scale: 3,
        y: -150,
        force3D: true,
        willChange: 'transform',
      });
    }

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

    return;
  }

  // Закомментированный код анимации для мобилки (можно вернуть позже)
  /*
  if (isMobile) {
    // Мобильная версия
    tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top top',
        end: '+=100%',
        scrub: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(
      renderEl.value,
      {
        scale: 2.5,
        duration: 5,
        ease: 'none',
      },
      0
    );
  } else {
  */

  const startScale = 2.3;

  // Общая установка для renderEl
  gsap.set(renderEl.value, {
    scale: startScale,
    y: '60%',
    force3D: true,
    willChange: 'transform',
  });

  // Десктоп версия
  tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: sectionEl.value,
      start: 'top top',
      end: 'bottom bottom+=500',
      scrub: true,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
    },
  });

  tl.to(
    renderEl.value,
    {
      y: 0,
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
  // */

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

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
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

.hero-section-wrapper {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 300vh;
  overflow: hidden;
  @media (max-width: $breakpoint-x) {
    position: static;
    height: auto;
  }
}

.hero-section {
  position: relative;
  min-height: 300vh;
  overflow: hidden;
  @media (max-width: $breakpoint-x) {
    min-height: 100vh;
  }

  &__container {
    position: relative;
    z-index: 2;
    min-height: 150vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    @media (max-width: $breakpoint-x) {
      min-height: 100vh;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    font-size: 24px;
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
    @media (max-width: $breakpoint-x) {
      position: absolute;
      width: 100%;
      height: 100%;
    }
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
      position: absolute;
      z-index: 10;
    }

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center bottom;
      display: block;
    }
  }
  &__button {
    background-color: $accent-color-orange;
    color: $text-color-white;
    font-family: 'Akrobat', sans-serif;
    font-size: 22px;
    font-weight: 700;
    line-height: 140%;
    text-transform: uppercase;
    text-decoration: none;
    padding: 8px 20px;
    border-radius: 100px;
    border: 1px solid $accent-color-orange;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    margin-top: 30px;
    & svg {
      margin-top: 2px;
    }
    &:hover {
      border-radius: 7px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 16px;
      padding: 12px 24px;
    }
  }
}

.hero-section__parallax-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
  white-space: nowrap;
  overflow: hidden;
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

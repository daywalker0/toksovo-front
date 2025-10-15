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

// Pure JavaScript scroll animation
const sectionEl = ref(null);
const renderEl = ref(null);
const skyEl = ref(null);
const parallaxContainer = ref(null);

let scrollHandler = null;
let animationId = null;
let currentContainerY = 0;
let currentRenderScale = 0;
let currentSkyScale = 0;
let targetContainerY = 0;
let targetRenderScale = 0;
let targetSkyScale = 0;

onMounted(() => {
  // Адаптивные параметры
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 599;
  const renderStartScale = isMobile ? 3.1 : 3.6;
  const skyStartScale = isMobile ? 1.1 : 1.2;

  // Устанавливаем начальные позиции
  if (renderEl.value) {
    renderEl.value.style.position = 'absolute';
    renderEl.value.style.bottom = '0';
    renderEl.value.style.left = '0';
    renderEl.value.style.right = '0';
    renderEl.value.style.transformOrigin = 'center bottom';
    renderEl.value.style.transform = `scale(${renderStartScale})`;
    renderEl.value.style.zIndex = '1';
  }

  if (skyEl.value) {
    skyEl.value.style.position = 'absolute';
    skyEl.value.style.top = '0';
    skyEl.value.style.left = '0';
    skyEl.value.style.right = '0';
    skyEl.value.style.transformOrigin = 'center bottom';
    skyEl.value.style.transform = `scale(${skyStartScale})`;
    skyEl.value.style.zIndex = '0';
  }

  // Инициализируем текущие значения
  currentContainerY = 0;
  currentRenderScale = renderStartScale;
  currentSkyScale = skyStartScale;
  targetContainerY = 0;
  targetRenderScale = renderStartScale;
  targetSkyScale = skyStartScale;

  // Функция плавной анимации
  const animate = () => {
    console.log('animate() called');
    const lerpFactor = 0.15; // Скорость плавности (0.1 = медленно, 0.3 = быстро)

    // Плавно приближаемся к целевому значению
    currentContainerY += (targetContainerY - currentContainerY) * lerpFactor;
    currentRenderScale += (targetRenderScale - currentRenderScale) * lerpFactor;
    currentSkyScale += (targetSkyScale - currentSkyScale) * lerpFactor;

    // Применяем изменения
    if (parallaxContainer.value) {
      parallaxContainer.value.style.transform = `translate3d(0px, ${currentContainerY}px, 0px)`;
    }
    if (renderEl.value) {
      // Рендер остается прижатым к низу, компенсируя движение контейнера
      const renderY = -currentContainerY;
      renderEl.value.style.transform = `translate3d(0px, ${renderY}px, 0px) scale(${currentRenderScale})`;
    }
    if (skyEl.value) {
      skyEl.value.style.transform = `translate3d(0px, 0px, 0px) scale(${currentSkyScale})`;
    }

    // Отладка анимации
    if (Math.abs(targetContainerY - currentContainerY) > 0.1) {
      console.log('Animating:', currentContainerY, '->', targetContainerY);
    }

    // Продолжаем анимацию если есть разница
    if (
      Math.abs(targetContainerY - currentContainerY) > 0.001 ||
      Math.abs(targetRenderScale - currentRenderScale) > 0.001 ||
      Math.abs(targetSkyScale - currentSkyScale) > 0.001
    ) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Анимация завершена
      animationId = null;
    }
  };

  // Функция обработки скролла
  const handleScroll = () => {
    if (!sectionEl.value) return;

    const rect = sectionEl.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = windowHeight;

    // Вычисляем прогресс (0 = начало, 1 = конец)
    let progress = 0;

    // Если секция видна и находится в области анимации
    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      // Прогресс от 0 до 1 при скролле вниз
      progress = Math.abs(rect.top) / sectionHeight;
      progress = Math.min(progress, 1);
    } else if (rect.bottom < windowHeight) {
      // Если секция полностью прокручена - анимация завершена
      progress = 1;
    }

    // Вычисляем целевые значения
    // Контейнер двигается вниз (от 0 до -580px)
    targetContainerY = -580 * progress;

    // Масштабы уменьшаются (от большого к нормальному)
    targetRenderScale = renderStartScale - (renderStartScale - 1) * progress;
    targetSkyScale = skyStartScale - (skyStartScale - 1) * progress;

    // Отладка
    console.log(
      'Progress:',
      progress,
      'ContainerY:',
      targetContainerY,
      'RenderScale:',
      targetRenderScale
    );

    // Запускаем плавную анимацию
    if (!animationId) {
      console.log('Starting animation');
      animationId = requestAnimationFrame(animate);
    }
  };

  // Добавляем обработчик скролла
  scrollHandler = handleScroll;
  window.addEventListener('scroll', scrollHandler, { passive: true });
  window.addEventListener('resize', scrollHandler, { passive: true });

  // Вызываем сразу для начальной позиции
  handleScroll();
});

onBeforeUnmount(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('resize', scrollHandler);
  }
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
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

  &__parallax-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    will-change: transform;
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

<template>
  <div class="nature-section section horizontal-section" ref="natureSection">
    <!-- Overlay для смены цвета снизу вверх -->
    <div class="color-overlay" ref="colorOverlay"></div>

    <div class="nature-section__container container">
      <div class="nature-section__content">
        <!-- Десктопная версия заголовка -->
        <h2 v-if="!isMobile" class="nature-section__title">
          <span class="title-word title-word--right">Жить</span>
          <span class="title-word title-word--left">среди</span>
          <span class="title-word title-word--right">природы</span>
        </h2>

        <!-- Мобильная версия заголовка -->
        <h2 v-else class="nature-section__title">Жить среди природы</h2>

        <div class="nature-section__subtitle subtitle-text">
          Жилой комплекс окружён лесами, озёрами и экотропами, где можно гулять в любое время года.
          Утренние пробежки, прогулки с детьми и пикники на свежем воздухе становятся частью
          повседневной жизни. Природа буквально в нескольких шагах от дома.
        </div>
        <div class="nature-section__image">
          <img :src="natureImg" alt="nature-img-1" loading="lazy" />
          <!-- Overlay с картинкой WalkCitySection ВНУТРИ блока -->
          <div class="image-overlay-wrapper" ref="imageOverlay">
            <img :src="walkCityImg" alt="walk-city-img" loading="lazy" class="overlay-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import natureImg from '@/assets/img/nature-img-1.jpg';
import walkCityImg from '@/assets/img/walk-city-img.jpg';

gsap.registerPlugin(ScrollTrigger);

const isMobile = ref(false);
const natureSection = ref(null);
const colorOverlay = ref(null);
const imageOverlay = ref(null);
let pinTrigger = null;
let colorAnimation = null; // это будет timeline с обеими анимациями

const initPinning = () => {
  // Только для мобилки и только если элементы существуют
  if (!isMobile.value || !natureSection.value || !colorOverlay.value || !imageOverlay.value) return;

  // Убиваем предыдущие triggers если есть
  if (pinTrigger) {
    pinTrigger.kill();
  }
  if (colorAnimation) {
    colorAnimation.scrollTrigger?.kill();
    colorAnimation.kill();
    colorAnimation = null;
  }

  // Фиксируем секцию когда её низ достигает низа экрана
  pinTrigger = ScrollTrigger.create({
    trigger: natureSection.value,
    start: 'bottom bottom', // когда низ секции достигает низа viewport
    end: '+=100%', // держим зафиксированной на протяжении 100% viewport
    pin: true,
    pinSpacing: true, // создаем пространство, чтобы WalkCitySection не наползала
    markers: true, // для дебага
    id: 'nature-pin',
  });

  // Создаем единый timeline для синхронных анимаций (только на мобилке)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: natureSection.value,
      start: 'bottom bottom',
      end: '+=100%',
      scrub: true,
      markers: true,
      id: 'nature-transition',
    },
  });

  // Анимация фона - проходит полную высоту секции
  tl.fromTo(
    colorOverlay.value,
    {
      clipPath: 'inset(100% 0% 0% 0%)', // начинается скрытым снизу
    },
    {
      clipPath: 'inset(0% 0% 0% 0%)', // полностью видим
      ease: 'none',
    },
    0 // начинается в момент 0
  );

  // Анимация картинки - проходит ТО ЖЕ расстояние (полную высоту блока)
  tl.fromTo(
    imageOverlay.value,
    {
      clipPath: 'inset(100% 0% 0% 0%)', // начинается скрытой снизу
    },
    {
      clipPath: 'inset(-40% 0% 0% 0%)', // полностью видна
      ease: 'none',
    },
    0 // начинается в момент 0 (одновременно с colorOverlay)
  );

  colorAnimation = tl;
};

onMounted(() => {
  const checkMobile = () => {
    const wasMobile = isMobile.value;
    isMobile.value = window.innerWidth <= 599;

    if (wasMobile !== isMobile.value) {
      if (pinTrigger) {
        pinTrigger.kill();
        pinTrigger = null;
      }
      if (colorAnimation) {
        colorAnimation.scrollTrigger?.kill();
        colorAnimation.kill();
        colorAnimation = null;
      }

      if (isMobile.value) {
        nextTick(() => {
          initPinning();
        });
      }
    }
  };

  checkMobile();

  if (isMobile.value) {
    nextTick(() => {
      initPinning();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    });
  }

  window.addEventListener('resize', checkMobile);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
    if (pinTrigger) {
      pinTrigger.kill();
    }
    if (colorAnimation) {
      colorAnimation.scrollTrigger?.kill();
      colorAnimation.kill();
    }
  });
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
.nature-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: $accent-color-green;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
    align-items: stretch;
  }
  display: flex;
  align-items: center;
  overflow: hidden;

  &__container {
    position: relative;
    height: 100%;
    z-index: 3;

    @media (max-width: $breakpoint-x) {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  &__content {
    margin-top: 200px;
    margin-left: 0px;
    position: static;
    z-index: 4;

    @media (max-width: $breakpoint-lg) {
      margin-left: 80px;
    }

    @media (max-width: $breakpoint-x) {
      margin-top: 0;
      margin-left: 0;
      display: flex;
      flex-direction: column;
      padding: 20px 0;
      height: 100%;
    }
  }

  &__title {
    color: $text-color-light;
    position: relative;
    z-index: 10;
    line-height: 80%;
    margin: 0;
    text-align: center;
    max-width: 510px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    @media (max-width: $breakpoint-x) {
      font-size: 50px;
      max-width: 100%;
      text-align: left;
      line-height: 90%;
    }

    .title-word {
      display: block;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;

      &--right {
        text-align: right;
        margin-left: auto;
        max-width: 70%;

        &:last-child {
          margin-left: 80%;
          max-width: 120%;
        }
      }

      &--left {
        text-align: left;
        margin-right: auto;
        max-width: 80%;
      }
    }
  }

  &__subtitle {
    max-width: 396px;
    position: absolute;
    bottom: 46px;
    left: 44px;
    color: $text-color-light;
    opacity: 0.8;
    font-family: 'Akrobat';
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: none;
    font-weight: 500;
    font-size: 20px;
    line-height: 140%;

    @media (max-width: $breakpoint-lg) {
      font-size: 18px;
    }

    @media (max-width: $breakpoint-x) {
      position: static;
      max-width: 100%;
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 30px;
      text-align: left;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 60%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    @media (max-width: $breakpoint-x) {
      position: relative; // чтобы overlay внутри позиционировался правильно
      width: 100%;
      height: auto;
      flex: 1;
      min-height: 400px;

      img {
        height: 100%;
      }
    }
  }
}

// Overlay для эффекта смены цвета (заливает только фон, не картинку)
.color-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 40%; // левая часть (текстовая область)
  height: 100%; // на всю высоту секции
  background-color: $accent-color-brown;
  z-index: 1;
  pointer-events: none;

  @media (max-width: $breakpoint-x) {
    width: 100%;
  }
}

// Overlay для картинки ВНУТРИ блока nature-section__image (только на мобилке)
.image-overlay-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;

  // На десктопе картинка не нужна - она уже в image-overlay-wrapper внутри блока
  @media (max-width: $breakpoint-x) {
    // Только на мобилке меняем картинку внутри блока nature-section__image
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .overlay-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
}
</style>

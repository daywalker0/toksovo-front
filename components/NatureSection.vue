<template>
  <div class="nature-section section horizontal-section" ref="natureSection">
    <div class="nature-section__container container">
      <div class="nature-section__content">
        <h2 v-if="!isMobile" class="nature-section__title">
          <span class="title-word title-word--right">Жить</span>
          <span class="title-word title-word--left">среди</span>
          <span class="title-word title-word--right">природы</span>
        </h2>

        <h2 v-else class="nature-section__title">Жить среди природы</h2>

        <div class="nature-section__subtitle subtitle-text">
          Жилой комплекс окружён лесами, озёрами и экотропами, где можно гулять в любое время года.
          Утренние пробежки, прогулки с детьми и пикники на свежем воздухе становятся частью
          повседневной жизни. Природа буквально в нескольких шагах от дома.
        </div>
        <div class="nature-section__image">
          <img :src="natureImg" alt="nature-img-1" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import natureImg from '@/assets/img/nature-img-1.jpg';

const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 1024;
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
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
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    height: 90svh;
    width: 100%;
    flex-shrink: initial;
  }

  @media (max-width: $breakpoint-x) {
    height: 100svh;
    align-items: stretch;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  &__container {
    position: relative;
    height: 100%;
    z-index: 3;

    @media (max-width: $breakpoint-md) {
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

    @media (max-width: $breakpoint-md) {
      margin-top: 0;
      margin-left: 0;
      display: flex;
      flex-direction: column;
      padding: 40px 20px;
      height: 100%;
      align-items: center;
      text-align: center;
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

    @media (max-width: $breakpoint-md) {
      font-size: 50px;
      max-width: 500px;
      margin-bottom: 20px;
      line-height: 90%;
      text-align: center;
    }

    @media (max-width: $breakpoint-x) {
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

    @media (max-width: $breakpoint-md) {
      position: static;
      max-width: 490px;
      font-size: 16px;
      margin-bottom: 60px;
      text-align: center;
    }

    @media (max-width: $breakpoint-x) {
      margin-top: 20px;
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

    @media (max-width: $breakpoint-md) {
      position: static;
      width: 100vw;
      margin-left: -20px;
      margin-right: -20px;
      height: auto;
      flex: 1;
      min-height: 450px;

      img {
        height: 100%;
      }
    }
  }
}
</style>

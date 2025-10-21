<template>
  <div class="walk-city-section section horizontal-section">
    <div class="walk-city-section__container container">
      <div class="walk-city-section__content">
        <h2 v-if="!isMobile" class="walk-city-section__title">
          <span class="title-word title-word--right">Гулять</span>
          <span class="title-word title-word--left">без</span>
          <span class="title-word title-word--right">города</span>
        </h2>

        <h2 v-else class="walk-city-section__title">Гулять без города</h2>

        <div class="walk-city-section__subtitle subtitle-text">
          Здесь не нужны долгие поездки ради отдыха: рядом парки, оздоровительные маршруты и
          живописные тропы. Можно после работы пройтись вдоль озера, покататься на велосипеде или
          встретить закат на смотровой площадке. Всё лучшее для активного и спокойного отдыха уже
          рядом.
        </div>
        <div class="walk-city-section__image">
          <img :src="walkCityImg" alt="nature-img-1" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import walkCityImg from '@/assets/img/walk-city-img.jpg';

const isMobile = ref(process.client ? window.innerWidth <= 1280 : false);

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 1280;
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

.walk-city-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: $accent-color-brown;
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: $breakpoint-lg) {
    height: 100%;
    width: 100%;
    flex-shrink: initial;
  }
  &__container {
    position: relative;
    height: 100%;

    @media (max-width: $breakpoint-lg) {
      display: flex;
      flex-direction: column;
    }
  }

  &__content {
    margin-top: 200px;
    margin-left: 0px;
    position: static;
    z-index: 3;

    @media (max-width: 1366px) {
      margin-top: 50px;
      margin-left: 50px;
    }

    @media (max-width: $breakpoint-lg) {
      margin-top: 0;
      margin-left: 0;
      display: flex;
      flex-direction: column;
      padding: 40px 20px 0;
      height: 100%;
      align-items: center;
      text-align: center;
    }

    @media (max-width: $breakpoint-x) {
      align-items: flex-start;
      text-align: start;
      padding: 20px 0;
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

    @media (max-width: $breakpoint-lg) {
      font-size: 50px;
      max-width: 350px;
      line-height: 90%;
      margin-bottom: 20px;
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
        margin-left: 70%;
        max-width: 100%;

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
      position: static;
      max-width: 490px;
      font-size: 16px;
      margin-bottom: 30px;
      text-align: center;
    }

    @media (max-width: $breakpoint-x) {
      margin-bottom: 28px;
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

      @media (max-width: $breakpoint-x) {
        object-position: center;
        height: 450px !important;
      }
      @media (max-width: $breakpoint-xs) {
        object-position: bottom;
        height: 450px !important;
      }
    }

    @media (max-width: $breakpoint-lg) {
      position: static;
      width: 100vw;
      margin-left: -20px;
      margin-right: -20px;
      margin-bottom: -20px;
      height: auto;
      max-height: 400px;
      flex: 1;
      min-height: 450px;
      aspect-ratio: 4 / 3;

      img {
        height: 100%;
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }
    }
  }
}
</style>

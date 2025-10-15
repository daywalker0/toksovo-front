<template>
  <div class="walk-city-section section horizontal-section">
    <div class="walk-city-section__container container">
      <div class="walk-city-section__content">
        <h2 class="walk-city-section__title">
          <span class="title-word title-word--right">Гулять</span>
          <span class="title-word title-word--left">без</span>
          <span class="title-word title-word--right">города</span>
        </h2>
        <div class="walk-city-section__subtitle subtitle-text">
          Здесь не нужны долгие поездки ради отдыха: рядом парки, оздоровительные маршруты и
          живописные тропы. Можно после работы пройтись вдоль озера, покататься на велосипеде или
          встретить закат на смотровой площадке. Всё лучшее для активного и спокойного отдыха уже
          рядом.
        </div>
      </div>
    </div>

    <div class="walk-city-section__image">
      <img :src="walkCityImg" alt="nature-img-1" />
    </div>
  </div>
</template>

<script setup>
import walkCityImg from '@/assets/img/walk-city-img.jpg';
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.walk-city-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: $accent-color-brown;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }
  display: flex;
  align-items: center;
  overflow: hidden;

  &__container {
    position: relative;
    height: 100%;
  }

  &__content {
    margin-top: 200px;
    margin-left: 0px;
    position: static;
    z-index: 3;

    @media (max-width: $breakpoint-lg) {
      margin-left: 80px;
    }
  }

  &__title {
    color: $text-color-light;
    line-height: 80%;
    margin: 0;
    text-align: center;
    max-width: 510px;
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .title-word {
      display: block;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;

      &--right {
        text-align: right;
        margin-left: 80%;
        max-width: 100%;

        &:last-child {
          margin-left: 41%;
          max-width: 100%;
        }
      }

      &--left {
        text-align: left;
        margin-right: auto;
        max-width: 60%;
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
    font-weight: 500;
    font-size: 20px;
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: none;
    line-height: 140%;

    @media (max-width: $breakpoint-lg) {
      font-size: 18px;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 65%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }
  }
}
</style>

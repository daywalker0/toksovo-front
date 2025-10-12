<template>
  <div class="walk-city-section section horizontal-section">
    <div class="walk-city-section__container container">
      <div class="walk-city-section__content">
        <h2 class="walk-city-section__title">Гулять без города</h2>
        <div class="walk-city-section__subtitle subtitle-text">
          Здесь не нужны долгие поездки ради отдыха: рядом парки, оздоровительные маршруты и
          живописные тропы. Можно после работы пройтись вдоль озера, покататься на велосипеде или
          встретить закат на смотровой площадке. Всё лучшее для активного и спокойного отдыха уже
          рядом.
        </div>
      </div>
    </div>

    <div class="walk-city-section__image">
      <img src="../assets/img/walk-city-img.jpg" alt="nature-img-1" />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.walk-city-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: $accent-color-brown;
  display: flex;
  align-items: center;
  overflow: hidden;

  &__container {
    position: relative;
    height: 100%;
  }

  &__content {
    margin-top: 200px;
    margin-left: 250px;
    position: static;
    z-index: 3;
  }

  &__title {
    color: $text-color-light;
    line-height: 80%;
    margin: 0;
    text-align: center;
    max-width: 510px;
    position: relative;
    z-index: 10;
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
    line-height: 140%;
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

<template>
  <div class="nature-section section horizontal-section">
    <div class="nature-section__container container">
      <div class="nature-section__content">
        <h2 class="nature-section__title">Жить среди природы</h2>
        <div class="nature-section__subtitle subtitle-text">
          Жилой комплекс окружён лесами, озёрами и экотропами, где можно гулять в любое время года.
          Утренние пробежки, прогулки с детьми и пикники на свежем воздухе становятся частью
          повседневной жизни. Природа буквально в нескольких шагах от дома.
        </div>
      </div>
    </div>

    <div class="nature-section__image">
      <img src="../assets/img/nature-img-1.jpg" alt="nature-img-1" />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.nature-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: $accent-color-green;
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
    max-width: 500px;
    text-align: center;
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
    width: 60%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: none;
      object-position: center;
      display: block;
    }
  }
}
</style>

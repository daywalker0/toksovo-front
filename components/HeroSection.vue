<template>
  <div class="hero-section section">
    <div class="hero-section__container container">
      <div class="hero-section__content">
        <h1 class="hero-section__title">Поинт Токсово</h1>
        <div class="subtitle-text hero-section__subtitle">
          комфорт, который становится частью вашего дня
        </div>
      </div>
    </div>
    <div class="hero-section__bg">
      <img src="../assets/img/hero-bg.png" />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  background: url('../assets/img/bg-sky.jpg') top center/100% auto no-repeat;
  min-height: 100vh;

  &__container {
    min-height: 100vh;
  }

  &__content {
    margin: 0 auto;
    padding-top: 100px;
    max-width: 660px;
    text-align: center;
  }

  &__subtitle {
    font-size: 36px;
    line-height: 110%;
    max-width: 460px;
    margin: 0 auto;
    padding-top: 30px;
  }

  &__bg {
    position: absolute;
    bottom: 0;
    // transform: scale(2.9);
  }
}
</style>

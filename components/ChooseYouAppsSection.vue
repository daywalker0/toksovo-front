<template>
  <div class="choose-your-apps-section section">
    <section class="sec sec--light">
      <div class="content">
        <button class="button light">Генплан</button>
        <div class="content--center">
          <img :src="chooseYourLife" alt="preview" />
          <div class="text">Выберите свою квартиру для жизни</div>
        </div>
        <button class="button light">Каталог квартир</button>
      </div>
    </section>

    <section class="sec sec--dark">
      <div class="content">
        <button class="button dark">Генплан</button>
        <div class="content--center">
          <img :src="chooseYourLife" alt="preview" />
          <div class="text">Выберите свою квартиру для жизни</div>
        </div>
        <button class="button dark">Каталог квартир</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import chooseYourLife from '@/assets/img/choose-your-life.jpg';
</script>

<style lang="scss" scoped>
.choose-your-apps-section {
  height: 200vh;
  position: relative;
}

.sec {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  &--light {
    background: $bg-color-1;
    z-index: 1;
  }
  &--dark {
    background: $accent-color-brown;
    z-index: 2;
  }
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;

  &--center {
    max-width: 650px;
    height: 450px;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      pointer-events: none;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

.text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: $text-color-white;
  font-size: 46px;
  text-align: center;
  max-width: 400px;
  z-index: 2;
}
</style>

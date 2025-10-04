<template>
  <div class="choose-your-apps-section section">
    <section class="sec sec--light">
      <div class="content">
        <button class="button light">Генплан</button>
        <div class="content--center">
          <img :src="chooseYourLife" alt="preview" />
          <div class="text dark">Выберите свою квартиру для жизни</div>
        </div>
        <button class="button light">Каталог квартир</button>
      </div>
    </section>

    <section class="sec sec--dark">
      <div class="content">
        <button class="button dark">Генплан</button>
        <div class="content--center">
          <img :src="chooseYourLife" alt="preview" />
          <h2 class="text light">Выберите свою квартиру для жизни</h2>
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
  height: 200vh; /* чтобы был скролл */
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

    img {
      height: 100%;
    }
  }
}

.btn.light {
  color: #000;
  border-color: #000;
}

.btn.dark {
  color: #fff;
  border-color: #fff;
}

.text.dark {
  color: #000;
}

.text.light {
  color: #fff;
}
</style>

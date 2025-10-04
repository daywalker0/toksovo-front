<template>
  <div class="choose-your-apps-section section" ref="section">
    <div class="background-wrapper">
      <div class="background background-light"></div>
      <div class="background background-dark" ref="darkBg"></div>
    </div>

    <section class="sticky-content">
      <div class="content">
        <button class="button" :class="{ light: !isOnDarkBg, dark: isOnDarkBg }">Генплан</button>
        <div class="content--center">
          <img :src="chooseYourLife" alt="preview" />
          <div class="text">Выберите свою квартиру для жизни</div>
        </div>
        <button class="button" :class="{ light: !isOnDarkBg, dark: isOnDarkBg }">
          Каталог квартир
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import chooseYourLife from '@/assets/img/choose-your-life.jpg';

const section = ref(null);
const darkBg = ref(null);
const isOnDarkBg = ref(false);

const handleScroll = () => {
  if (!section.value || !darkBg.value) return;

  const darkBgRect = darkBg.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const darkBgProgress = 1 - darkBgRect.top / windowHeight;

  isOnDarkBg.value = darkBgProgress > 0.5;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  handleScroll(); // начальная проверка
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
</script>

<style lang="scss" scoped>
.choose-your-apps-section {
  height: 200vh;
  position: relative;
}

.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200vh;
  overflow: hidden;
}

.background {
  position: absolute;
  width: 100%;
  height: 100vh;
  left: 0;

  &.background-light {
    top: 0;
    background: $bg-color-1;
    z-index: 1;
  }

  &.background-dark {
    top: 100vh;
    background: $accent-color-brown;
    z-index: 2;
    animation: slideBackground linear forwards;
    animation-timeline: scroll();
  }
}

@keyframes slideBackground {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100vh);
  }
}

.sticky-content {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
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

.button {
  &.dark {
    color: $text-color-white;
    border: 1px solid $text-color-white;
  }
}
</style>

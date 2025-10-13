<template>
  <div class="choose-your-apps-section section" ref="section">
    <div class="background-wrapper">
      <div class="background background-light"></div>
      <div class="background background-dark" ref="darkBg"></div>
    </div>

    <section class="sticky-content">
      <div class="content" ref="content">
        <button
          class="button button-left"
          :class="{ light: !isOnDarkBg, dark: isOnDarkBg }"
          :style="{ opacity: buttonsOpacity }"
        >
          Генплан
        </button>

        <div
          class="content--center"
          ref="imageContainer"
          :style="{ transform: `scale(${imageScale})` }"
        >
          <div class="image-overlay" :style="{ opacity: overlayOpacity }"></div>
          <img :src="chooseYourLife" alt="preview" />
          <div class="text" :style="{ opacity: textOpacity }">Выберите свою квартиру для жизни</div>
        </div>

        <button
          class="button button-right"
          :class="{ light: !isOnDarkBg, dark: isOnDarkBg }"
          :style="{ opacity: buttonsOpacity }"
        >
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
const imageContainer = ref(null);
const content = ref(null);
const isOnDarkBg = ref(false);
const textOpacity = ref(0);
const buttonsOpacity = ref(0);
const overlayOpacity = ref(0);
const imageScale = ref(0.95);

const handleScroll = () => {
  if (!section.value || !darkBg.value || !imageContainer.value || !content.value) return;

  const sectionRect = section.value.getBoundingClientRect();
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Прогресс скролла секции (0 - начало, 1 - конец)
  const sectionProgress = Math.max(
    0,
    Math.min(1, -sectionRect.top / (sectionRect.height - windowHeight))
  );

  // Разделяем на 4 фазы:
  // Фаза 0 (0 - 0.1): масштабирование картинки от 0.95 до 1
  // Фаза 1 (0.1 - 0.4): уменьшение картинки
  // Фаза 2 (0.4 - 0.6): появление текста и кнопок
  // Фаза 3 (0.6 - 1): анимация смены цвета

  if (sectionProgress <= 0.1) {
    // ===== ФАЗА 0: масштабирование картинки =====
    const scaleProgress = sectionProgress / 0.1; // 0 -> 1

    // Масштабирование от 0.95 до 1
    imageScale.value = 0.95 + 0.05 * scaleProgress;

    // Картинка на весь экран
    imageContainer.value.style.width = '100vw';
    imageContainer.value.style.height = '100vh';
    imageContainer.value.style.maxWidth = 'none';
    imageContainer.value.style.transform = `scale(${imageScale.value})`;

    // Текст и кнопки скрыты
    textOpacity.value = 0;
    buttonsOpacity.value = 0;
    overlayOpacity.value = 0;

    // Фон светлый
    darkBg.value.style.transform = 'translateY(0)';
    isOnDarkBg.value = false;
  } else if (sectionProgress > 0.1 && sectionProgress <= 0.4) {
    // ===== ФАЗА 1: ТОЛЬКО уменьшение картинки =====
    const shrinkProgress = (sectionProgress - 0.1) / 0.3; // 0 -> 1

    // Размеры картинки: от 100vw x 100vh до 650px x 450px
    const currentWidth =
      100 -
      (100 - (650 / (typeof window !== 'undefined' ? window.innerWidth : 1200)) * 100) *
        shrinkProgress;
    const currentHeight = 100 - (100 - (450 / windowHeight) * 100) * shrinkProgress;

    // Картинка центрирована и игнорирует padding
    imageContainer.value.style.width = `${currentWidth}vw`;
    imageContainer.value.style.height = `${currentHeight}vh`;
    imageContainer.value.style.maxWidth = 'none';
    imageContainer.value.style.transform = 'scale(1)'; // убираем scale

    // Текст и кнопки скрыты
    textOpacity.value = 0;
    buttonsOpacity.value = 0;

    // Затемнение картинки скрыто
    overlayOpacity.value = 0;

    // Фон светлый - темный фон на своей позиции (внизу)
    darkBg.value.style.transform = 'translateY(0)';
    isOnDarkBg.value = false;
  } else if (sectionProgress > 0.4 && sectionProgress <= 0.6) {
    // ===== ФАЗА 2: появление текста и кнопок =====

    // Картинка в финальном размере
    imageContainer.value.style.width = '650px';
    imageContainer.value.style.height = '450px';
    imageContainer.value.style.maxWidth = '650px';

    // Прогресс второй фазы (0 -> 1)
    const phase2Progress = (sectionProgress - 0.4) / 0.2;

    // Появление текста (с начала фазы 2 до 50% фазы 2)
    if (phase2Progress <= 0.5) {
      textOpacity.value = phase2Progress / 0.5;
    } else {
      textOpacity.value = 1;
    }

    // Появление кнопок (с 20% до 100% фазы 2)
    if (phase2Progress < 0.2) {
      buttonsOpacity.value = 0;
    } else if (phase2Progress >= 0.2 && phase2Progress <= 1) {
      buttonsOpacity.value = (phase2Progress - 0.2) / 0.8;
    } else {
      buttonsOpacity.value = 1;
    }

    // Затемнение картинки появляется вместе с текстом
    if (phase2Progress <= 0.5) {
      overlayOpacity.value = phase2Progress / 0.5;
    } else {
      overlayOpacity.value = 1;
    }

    // Фон светлый - темный фон на своей позиции (внизу)
    darkBg.value.style.transform = 'translateY(0)';
    isOnDarkBg.value = false;
  } else {
    // ===== ФАЗА 3: ТОЛЬКО анимация смены цвета =====

    // Картинка в финальном размере
    imageContainer.value.style.width = '650px';
    imageContainer.value.style.height = '450px';
    imageContainer.value.style.maxWidth = '650px';

    // Текст и кнопки полностью видны
    textOpacity.value = 1;
    buttonsOpacity.value = 1;

    // Затемнение картинки полностью видно
    overlayOpacity.value = 1;

    // Прогресс третьей фазы (0 -> 1)
    const phase3Progress = (sectionProgress - 0.6) / 0.4;

    // Плавное поднятие фона от 0 до -100vh
    // Фон на top: 200vh, поднимается до 100vh (покрывает sticky-content)
    const bgTranslateY = -100 * phase3Progress;
    darkBg.value.style.transform = `translateY(${bgTranslateY}vh)`;

    // Смена цвета текста/кнопок (когда фон начинает покрывать экран)
    isOnDarkBg.value = phase3Progress > 0.4;
  }
};

onMounted(() => {
  // Инициализируем начальное состояние темного фона
  if (darkBg.value) {
    darkBg.value.style.transform = 'translateY(0)';
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // начальная проверка
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.choose-your-apps-section {
  height: 300vh;
  margin-top: 200px;
  position: relative;

  @media (max-width: $breakpoint-sm) {
    margin-top: 100px;
  }
}

.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300vh;
  overflow: hidden;
}

.background {
  position: absolute;
  width: 100%;
  height: 200vh;
  left: 0;

  &.background-light {
    top: 0;
    background: $bg-color-1;
    z-index: 3;
  }

  &.background-dark {
    top: 200vh;
    background: $accent-color-brown;
    z-index: 2;
    transform: translateY(0);
    transition: transform 0.05s ease-out;
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
  overflow: hidden;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 40px;
  padding: 0 40px;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    align-items: center;
  }

  &--center {
    width: 100vw;
    height: 100vh;
    max-width: none;
    position: absolute;
    transform: translate(-50%, -50%);
    overflow: hidden;
    transition:
      width 0.05s ease-out,
      height 0.05s ease-out;

    @media (max-width: $breakpoint-sm) {
      width: 100%;
      height: 300px;
      max-width: 100%;
      order: 2;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

.image-overlay {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: $text-color-white;
  font-size: 40px;
  text-align: center;
  max-width: 400px;
  z-index: 2;
  transition: opacity 0.3s ease-out;

  @media (max-width: $breakpoint-lg) {
    font-size: 38px;
  }

  @media (max-width: $breakpoint-sm) {
    opacity: 1 !important;
  }
}

.button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease-out;
  flex-shrink: 0;

  &.button-left {
    left: 115px;
  }

  &.button-right {
    right: 115px;
  }

  &.dark {
    color: $text-color-white;
    border: 1px solid $text-color-white;
  }

  @media (min-width: 769px) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: $breakpoint-sm) {
    position: static !important;
    transform: none !important;
    margin: 0;
    width: 200px;
    opacity: 1 !important;

    &.button-left {
      left: auto !important;
      order: 1;
    }

    &.button-right {
      right: auto !important;
      order: 3;
    }
  }
}
</style>

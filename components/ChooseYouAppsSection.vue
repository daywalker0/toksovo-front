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

        <div class="content--center" ref="imageContainer">
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

const handleScroll = () => {
  if (!section.value || !darkBg.value || !imageContainer.value || !content.value) return;

  const sectionRect = section.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Прогресс скролла секции (0 - начало, 1 - конец)
  const sectionProgress = Math.max(
    0,
    Math.min(1, -sectionRect.top / (sectionRect.height - windowHeight))
  );

  // Разделяем на 3 фазы:
  // Фаза 1 (0 - 0.3): уменьшение картинки
  // Фаза 2 (0.3 - 0.5): появление текста и кнопок
  // Фаза 3 (0.5 - 1): анимация смены цвета (длинная, медленная)

  if (sectionProgress <= 0.3) {
    // ===== ФАЗА 1: ТОЛЬКО уменьшение картинки =====
    const shrinkProgress = sectionProgress / 0.3; // 0 -> 1

    // Размеры картинки: от 100vw x 100vh до 650px x 450px
    const currentWidth = 100 - (100 - (650 / window.innerWidth) * 100) * shrinkProgress;
    const currentHeight = 100 - (100 - (450 / windowHeight) * 100) * shrinkProgress;

    // Картинка центрирована и игнорирует padding
    imageContainer.value.style.width = `${currentWidth}vw`;
    imageContainer.value.style.height = `${currentHeight}vh`;
    imageContainer.value.style.maxWidth = 'none';

    // Текст и кнопки скрыты
    textOpacity.value = 0;
    buttonsOpacity.value = 0;

    // Затемнение картинки скрыто
    overlayOpacity.value = 0;

    // Фон светлый - темный фон на своей позиции (внизу)
    darkBg.value.style.transform = 'translateY(0)';
    isOnDarkBg.value = false;
  } else if (sectionProgress > 0.3 && sectionProgress <= 0.5) {
    // ===== ФАЗА 2: появление текста и кнопок =====

    // Картинка в финальном размере
    imageContainer.value.style.width = '650px';
    imageContainer.value.style.height = '450px';
    imageContainer.value.style.maxWidth = '650px';

    // Прогресс второй фазы (0 -> 1)
    const phase2Progress = (sectionProgress - 0.3) / 0.2;

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
    const phase3Progress = (sectionProgress - 0.5) / 0.5;

    // Плавное поднятие фона от 0 до -50vh
    const bgTranslateY = -50 * phase3Progress;
    darkBg.value.style.transform = `translateY(${bgTranslateY}vh)`;

    // Смена цвета текста/кнопок (когда фон достигает середины экрана)
    isOnDarkBg.value = phase3Progress > 0.5;
  }
};

onMounted(() => {
  // Инициализируем начальное состояние темного фона
  if (darkBg.value) {
    darkBg.value.style.transform = 'translateY(0)';
  }

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
    top: 150vh;
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

  &--center {
    width: 100vw;
    height: 100vh;
    max-width: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    transition:
      width 0.05s ease-out,
      height 0.05s ease-out;

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
  font-size: 46px;
  text-align: center;
  max-width: 400px;
  z-index: 2;
  transition: opacity 0.3s ease-out;
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
}
</style>

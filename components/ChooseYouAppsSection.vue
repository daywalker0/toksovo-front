<template>
  <div class="choose-your-apps-section section" ref="section">
    <!-- Мобильная версия -->
    <div v-if="isMobile" class="mobile-version">
      <div class="mobile-background" :style="{ backgroundImage: `url(${chooseYourLife})` }">
        <div class="mobile-overlay"></div>
      </div>
      <div class="mobile-content">
        <div class="mobile-text">Выберите свою квартиру для жизни</div>
        <div class="mobile-buttons">
          <button class="mobile-button" @click="scrollToMasterPlan">
            <span class="button-title">Генплан</span>
            <div class="button-action">
              <span>Перейти</span>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 5 L17 12 L9 19"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </button>
          <button class="mobile-button">
            <span class="button-title">Каталог квартир</span>
            <div class="button-action">
              <span>Перейти</span>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 5 L17 12 L9 19"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Десктопная версия -->
    <template v-else>
      <div class="background-wrapper">
        <div class="background background-light"></div>
        <div class="background background-dark" ref="darkBg"></div>
      </div>

      <section class="sticky-content">
        <div class="content" ref="content">
          <div class="button-block button-block-left">
            <button
              class="button button-left"
              :class="{ light: !isOnDarkBg, dark: isOnDarkBg }"
              :style="{ opacity: buttonsOpacity }"
              @click="scrollToMasterPlan"
            >
              Генплан
            </button>
          </div>

          <div
            class="content--center"
            ref="imageContainer"
            :style="{ transform: `scale(${imageScale})` }"
          >
            <div class="image-overlay" :style="{ opacity: overlayOpacity }"></div>
            <img :src="chooseYourLife" alt="preview" loading="eager" />
            <div class="text" :style="{ opacity: textOpacity }">
              Выберите свою квартиру для жизни
            </div>
          </div>

          <div class="button-block button-block-right">
            <button
              class="button button-right"
              :class="{ light: !isOnDarkBg, dark: isOnDarkBg }"
              :style="{ opacity: buttonsOpacity }"
            >
              Каталог квартир
            </button>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import chooseYourLife from '@/assets/img/choose-your-life.jpg';

const { scrollTo } = useLenis();

const section = ref(null);
const darkBg = ref(null);
const imageContainer = ref(null);
const content = ref(null);
const isOnDarkBg = ref(false);
const textOpacity = ref(0);
const buttonsOpacity = ref(0);
const overlayOpacity = ref(0);
const imageScale = ref(0.95);
const isMobile = ref(false);
const isMd = ref(
  typeof window !== 'undefined' ? window.innerWidth <= 1024 && window.innerWidth > 768 : false
);

const scrollToMasterPlan = () => {
  scrollTo('#master-plan', {
    offset: -100,
    duration: 1.2,
    onComplete: () => {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    },
  });
};

const handleScroll = () => {
  // На мобилке не обрабатываем скролл
  if (isMobile.value) return;
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
    imageContainer.value.style.height = isMobile.value ? '100svh' : '100vh';
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

    // Размеры картинки: от 100vw x 100vh до 350px/650px x 450px
    const targetWidth = isMd.value ? 350 : 650;
    const currentWidth =
      100 -
      (100 - (targetWidth / (typeof window !== 'undefined' ? window.innerWidth : 1200)) * 100) *
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
    if (isMobile.value) {
      imageContainer.value.style.width = '100%';
      imageContainer.value.style.height = '300px';
      imageContainer.value.style.maxWidth = '100%';
    } else {
      const targetWidth = isMd.value ? '350px' : '650px';
      imageContainer.value.style.width = targetWidth;
      imageContainer.value.style.height = '450px';
      imageContainer.value.style.maxWidth = targetWidth;
    }

    // Прогресс второй фазы (0 -> 1)
    const phase2Progress = (sectionProgress - 0.4) / 0.2;

    // Для мобильных устройств делаем анимацию более ранней
    const textStartProgress = isMobile.value ? 0.3 : 0.5;
    const buttonsStartProgress = isMobile.value ? 0.1 : 0.2;

    // Появление текста
    if (phase2Progress <= textStartProgress) {
      textOpacity.value = phase2Progress / textStartProgress;
    } else {
      textOpacity.value = 1;
    }

    // Появление кнопок
    if (phase2Progress < buttonsStartProgress) {
      buttonsOpacity.value = 0;
    } else if (phase2Progress >= buttonsStartProgress && phase2Progress <= 1) {
      buttonsOpacity.value = (phase2Progress - buttonsStartProgress) / (1 - buttonsStartProgress);
    } else {
      buttonsOpacity.value = 1;
    }

    // Затемнение картинки появляется вместе с текстом
    const overlayStartProgress = isMobile.value ? 0.3 : 0.5;
    if (phase2Progress <= overlayStartProgress) {
      overlayOpacity.value = phase2Progress / overlayStartProgress;
    } else {
      overlayOpacity.value = 1;
    }

    // Фон светлый - темный фон на своей позиции (внизу)
    darkBg.value.style.transform = 'translateY(0)';
    isOnDarkBg.value = false;
  } else {
    // ===== ФАЗА 3: ТОЛЬКО анимация смены цвета =====

    // Картинка в финальном размере
    if (isMobile.value) {
      imageContainer.value.style.width = '100%';
      imageContainer.value.style.height = '300px';
      imageContainer.value.style.maxWidth = '100%';
    } else {
      const targetWidth = isMd.value ? '350px' : '650px';
      imageContainer.value.style.width = targetWidth;
      imageContainer.value.style.height = '450px';
      imageContainer.value.style.maxWidth = targetWidth;
    }

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
  // Проверка мобильного устройства
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
    isMd.value = window.innerWidth <= 1024 && window.innerWidth > 599;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Инициализируем начальное состояние темного фона
  if (darkBg.value && !isMobile.value) {
    darkBg.value.style.transform = 'translateY(0)';
  }

  if (typeof window !== 'undefined' && !isMobile.value) {
    let isHandlingScroll = false;
    const throttledHandleScroll = () => {
      if (isHandlingScroll) return;
      isHandlingScroll = true;

      requestAnimationFrame(() => {
        handleScroll();
        isHandlingScroll = false;
      });
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 768;
    });
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

  @media (max-width: $breakpoint-sm) {
    height: 100svh;
    margin-top: 0;
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
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  overflow: hidden;

  @media (max-width: $breakpoint-sm) {
    position: relative;
    height: 100svh;
  }
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 50%;
  padding: 0 40px;

  @media (max-width: $breakpoint-lg) {
    gap: 75%;
  }

  @media (max-width: $breakpoint-md) {
    gap: 50%;
  }

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    align-items: center;
  }
}

.content--center {
    width: 100vw;
    height: 100vh;
    max-width: none;
    position: absolute;
    transform: translate(-50%, -50%);
    overflow: hidden;
    transition:
      width 0.05s ease-out,
      height 0.05s ease-out;

    @media (max-width: $breakpoint-md) {
      max-width: 350px;
    }

    @media (max-width: $breakpoint-sm) {
      width: 100%;
      height: 300px;
      max-width: 100%;
      order: 2;
    }

    @media (max-width: $breakpoint-sm) {
      height: 100svh;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      display: block;
    }
  }

.button-block {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100vh;

  @media (max-width: $breakpoint-sm) {
    height: auto;
    flex: none;
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

  @media (max-width: $breakpoint-md) {
    min-width: 300px;
  }

  @media (max-width: $breakpoint-sm) {
    opacity: 1 !important;
  }
}

.button {
  transition: all 0.3s ease-out;
  flex-shrink: 0;

  &::before {
    display: none;
  }

  &.dark {
    color: $text-color-white;
    border: 1px solid $text-color-white;
  }

  &.light {
    color: $text-color-primary;
    border: 1px solid $text-color-primary;
  }

  &:hover {
    border-radius: 7px;
    background-color: $accent-color-orange;
    border: 1px solid $accent-color-orange;
    color: $text-color-white;
  }

  @media (max-width: $breakpoint-sm) {
    width: 200px;
    opacity: 1 !important;
  }
}

// Мобильная версия
.mobile-version {
  width: 100%;
  height: 100svh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.mobile-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.mobile-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.mobile-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 40px 20px 20px;
}

.mobile-text {
  color: $text-color-white;
  font-size: 40px;
  text-align: center;
  line-height: 120%;
  max-width: 300px;
  margin: 0 auto;
}

.mobile-buttons {
  display: flex;
  gap: 8px;
  margin-top: 40px;
}

.mobile-button {
  flex: 1;
  min-height: 166px;
  aspect-ratio: 1;
  background: transparent;
  border: 1px solid $text-color-white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: $text-color-white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .button-title {
    font-size: 20px;
    font-weight: 700;
    font-family: 'Akrobat';
    text-align: left;
    line-height: 120%;
  }

  .button-action {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    font-family: 'Akrobat';
    font-weight: 600;
    margin-top: auto;

    svg {
      width: 12px;
      height: 12px;
    }
  }
}
</style>

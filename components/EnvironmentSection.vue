<template>
  <section class="environment-section" ref="sectionRef">
    <!-- Старая реализация для десктопа -->
    <div class="environment-section__gallery" ref="galleryRef" v-if="!isMobile">
      <div v-for="(img, i) in slides" :key="i" class="gallery-item">
        <img :src="img" alt="" />
      </div>
    </div>

    <!-- Новая реализация для мобильных -->
    <template v-if="isMobile">
      <!-- Фоновое изображение -->
      <div class="environment-section__bg">
        <img :src="currentSlide" alt="Environment background" />
      </div>

      <!-- Белый блок с контентом -->
      <div class="environment-section__content">
        <div class="content-block">
          <h2 class="content-title">{{ activeItem?.title || 'Заголовок' }}</h2>
          <p class="content-text">{{ activeItem?.content || 'Описание' }}</p>

          <!-- Кнопки навигации -->
          <div class="navigation-buttons">
            <button
              class="nav-button nav-button--prev"
              @click="goToPrevSlide"
              :disabled="isAnimating"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 5 L7 12 L15 19"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <button
              class="nav-button nav-button--next"
              @click="goToNextSlide"
              :disabled="isAnimating"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5 L17 12 L9 19"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Контент для десктопа -->
    <div class="environment-content" ref="contentRef" v-if="!isMobile">
      <div class="controls-block">
        <div class="controls-block__wrap">
          <div class="accordion">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="accordion-item"
              :class="{ active: activeIndex === index }"
            >
              <div class="accordion-header" @click="toggleItem(index)">
                <div class="icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="#E6DFD8" stroke-width="3" />
                    <mask id="path-2-inside-1_306_1521" fill="white">
                      <path
                        d="M8 0C9.26248 1.5055e-08 10.507 0.298792 11.6319 0.871948C12.7568 1.4451 13.7301 2.27635 14.4721 3.29772C15.2142 4.31909 15.704 5.50158 15.9015 6.74852C16.099 7.99546 15.9986 9.27144 15.6085 10.4721L12.7629 9.54756C13.0071 8.79592 13.07 7.99716 12.9463 7.21658C12.8227 6.43599 12.5161 5.69575 12.0516 5.05637C11.587 4.41699 10.9778 3.89663 10.2736 3.53784C9.56941 3.17904 8.79031 2.992 8 2.992V0Z"
                      />
                    </mask>
                    <path
                      d="M8 0C9.26248 1.5055e-08 10.507 0.298792 11.6319 0.871948C12.7568 1.4451 13.7301 2.27635 14.4721 3.29772C15.2142 4.31909 15.704 5.50158 15.9015 6.74852C16.099 7.99546 15.9986 9.27144 15.6085 10.4721L12.7629 9.54756C13.0071 8.79592 13.07 7.99716 12.9463 7.21658C12.8227 6.43599 12.5161 5.69575 12.0516 5.05637C11.587 4.41699 10.9778 3.89663 10.2736 3.53784C9.56941 3.17904 8.79031 2.992 8 2.992V0Z"
                      stroke="#4C5E36"
                      stroke-width="6"
                      mask="url(#path-2-inside-1_306_1521)"
                    />
                  </svg>
                </div>
                <span>{{ item.title }}</span>
              </div>
              <div v-show="activeIndex === index" class="accordion-content">
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Две половины для клика по стрелкам -->
      <div class="image-control" v-if="isContentVisible" @mousemove="onMouseMove">
        <div
          class="image-half left"
          @click="goToPrevSlide"
          @mouseenter="hoverSide = 'left'"
          @mouseleave="hoverSide = null"
        />
        <div
          class="image-half right"
          @click="goToNextSlide"
          @mouseenter="hoverSide = 'right'"
          @mouseleave="hoverSide = null"
        />

        <div
          v-if="hoverSide"
          class="custom-cursor"
          :class="hoverSide"
          :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
        >
          <svg
            v-if="hoverSide === 'left'"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M15 5 L7 12 L15 19"
              fill="none"
              stroke="#4C5E36"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 5 L17 12 L9 19"
              fill="none"
              stroke="#4C5E36"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrivateHousingData } from '@/composables/usePrivateHousingData';
import imgSlide from '../assets/img/private-housing-section.jpg';

gsap.registerPlugin(ScrollTrigger);

// Определяем мобильное устройство
const isMobile = ref(false);

// Используем композабл для данных
const {
  items,
  activeIndex,
  activeItem,
  cursorX,
  cursorY,
  hoverSide,
  toggleItem: originalToggleItem,
  onMouseMove: handleMouseMove,
} = usePrivateHousingData();

const sectionRef = ref(null);
const galleryRef = ref(null);
const contentRef = ref(null);
const isContentVisible = ref(false);
const currentIndex = ref(0);
const isAnimating = ref(false);

// Функция для прямой установки активного индекса
const setActiveIndex = index => {
  activeIndex.value = index;
};

// Обёртка для toggleItem, чтобы синхронизировать с currentIndex
const toggleItem = index => {
  originalToggleItem(index);
  if (currentIndex.value !== index && !isAnimating.value) {
    const direction = index > currentIndex.value ? 'right' : 'left';
    animateSlide(index, direction);
  }
};

// Слайды
const slides = computed(() => {
  if (!items.value || !Array.isArray(items.value)) {
    return [imgSlide, imgSlide, imgSlide, imgSlide, imgSlide];
  }
  return items.value.map(item => item.image);
});

// Текущий слайд для мобильных
const currentSlide = computed(() => {
  return slides.value[currentIndex.value] || slides.value[0];
});

const onMouseMove = e => {
  handleMouseMove(e);
};

// Переход к следующему слайду
const goToNextSlide = () => {
  if (isAnimating.value) return;

  if (isMobile.value) {
    // Простая логика для мобильных
    isAnimating.value = true;
    const nextIndex = (currentIndex.value + 1) % slides.value.length;
    currentIndex.value = nextIndex;
    activeIndex.value = nextIndex;
    setTimeout(() => {
      isAnimating.value = false;
    }, 300);
  } else {
    // Оригинальная логика для десктопа
    const nextIndex = (currentIndex.value + 1) % slides.value.length;
    animateSlide(nextIndex, 'right');
    setActiveIndex(nextIndex);
  }
};

// Переход к предыдущему слайду
const goToPrevSlide = () => {
  if (isAnimating.value) return;

  if (isMobile.value) {
    // Простая логика для мобильных
    isAnimating.value = true;
    const prevIndex = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
    currentIndex.value = prevIndex;
    activeIndex.value = prevIndex;
    setTimeout(() => {
      isAnimating.value = false;
    }, 300);
  } else {
    // Оригинальная логика для десктопа
    const prevIndex = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
    animateSlide(prevIndex, 'left');
    setActiveIndex(prevIndex);
  }
};

// Анимация смены слайда для десктопа
const animateSlide = (newIndex, direction) => {
  if (isAnimating.value) return;

  isAnimating.value = true;

  // Обновляем индекс и активный элемент
  currentIndex.value = newIndex;
  setActiveIndex(newIndex);

  // Обновляем галерею - меняем центральную картинку
  if (galleryRef.value) {
    const galleryItems = galleryRef.value.querySelectorAll('.gallery-item');
    const centerIndex = Math.floor(galleryItems.length / 2);
    const centerItem = galleryItems[centerIndex];
    const centerImg = centerItem?.querySelector('img');

    if (centerImg) {
      centerImg.src = slides.value[newIndex];
    }
  }

  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};

onMounted(async () => {
  // Определяем мобильное устройство
  const checkMobile = () => {
    isMobile.value = typeof window !== 'undefined' && window.innerWidth <= 599;
  };

  checkMobile();

  // Слушаем изменения размера окна
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkMobile);
  }

  // Если мобильное устройство, не инициализируем GSAP
  if (isMobile.value) {
    currentIndex.value = 0;
    setActiveIndex(0);
    return;
  }

  // Оригинальная инициализация для десктопа
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 100));

  const section = sectionRef.value;
  const gallery = galleryRef.value;
  const content = contentRef.value;

  if (!section || !gallery || !content) return;

  const galleryItems = gallery.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  const centerIndex = Math.floor(galleryItems.length / 2);
  const centerItem = galleryItems[centerIndex];
  const centerImg = centerItem?.querySelector('img');

  if (!centerItem || !centerImg) return;

  // Синхронизируем начальное состояние: всё начинается с индекса 0
  currentIndex.value = 0;

  // Устанавливаем активный элемент аккордеона на 0
  setActiveIndex(0);

  // Скрываем контент
  gsap.set(content, {
    y: 40,
    scale: 0.8,
    display: 'none',
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'center center',
      end: '+=2000',
      scrub: true,
      pin: !isMobile.value,
    },
  });

  // Уезжают соседи в стороны (кроме центрального)
  tl.to(
    galleryItems,
    {
      x: i => {
        if (i < centerIndex) return '-150%';
        if (i > centerIndex) return '150%';
        return '0%'; // Центральный элемент остается на месте
      },
      ease: 'power2.inOut',
      duration: 1,
    },
    0
  );

  // Центральный блок растёт
  tl.to(
    centerItem,
    {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      x: 0, // Явно фиксируем позицию по X
      ease: 'power2.inOut',
      duration: 1.2,
    },
    0.2
  );

  tl.to(
    centerImg,
    {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      x: 0, // Явно фиксируем позицию по X
      ease: 'power2.inOut',
      duration: 1.2,
    },
    0.2
  );

  // Контент появляется на 80% анимации увеличения картинки
  tl.to(
    content,
    {
      display: 'flex',
      y: 0,
      scale: 1,
      ease: 'power3.out',
      duration: 1.2,
    },
    0.96 // 80% от 1.2 (длительность анимации увеличения картинки)
  );

  // Курсоры появляются сразу при появлении контента
  tl.call(
    () => {
      isContentVisible.value = true;
    },
    null,
    0.96
  );
});

// Очистка слушателя при размонтировании
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 599;
    });
  }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.environment-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: block;

    @media (min-width: 600px) {
      display: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 40px;
    display: flex;
    justify-content: center;

    @media (max-width: $breakpoint-x) {
      padding: 10px;
      bottom: 0;
    }

    @media (min-width: 600px) {
      display: none;
    }
  }
}

.content-block {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: $breakpoint-x) {
    padding: 20px 15px;
    max-width: 100%;
    border-radius: 8px;
  }
}

.content-title {
  font-family: 'Akrobat', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: $accent-color-green;
  margin: 0 0 20px 0;
  text-transform: uppercase;

  @media (max-width: $breakpoint-x) {
    font-size: 24px;
    margin: 0 0 15px 0;
  }
}

.content-text {
  font-family: 'Akrobat', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 140%;
  color: $text-color-primary;
  margin: 0 0 30px 0;

  @media (max-width: $breakpoint-x) {
    font-size: 16px;
    margin: 0 0 20px 0;
  }
}

.navigation-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.nav-button {
  width: 48px;
  height: 48px;
  border: 2px solid $accent-color-green;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: $accent-color-green;

  &:hover:not(:disabled) {
    background: $accent-color-green;
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

// Стили для десктопной версии
.environment-section__gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  height: 100%;
  width: 100%;
  position: relative;

  @media (max-width: $breakpoint-x) {
    display: none;
  }
}

.gallery-item {
  flex: 0 0 auto;
  width: 131px;
  height: 198px;
  border-radius: 0;
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    display: block;
  }

  // Центральный слайд (третий)
  &:nth-child(3) {
    width: 400px;
    height: 600px;
    z-index: 3;
  }

  &:nth-child(2),
  &:nth-child(4) {
    width: 262px;
    height: 394px;
    z-index: 2;
  }
}

.environment-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  display: flex;
  align-items: flex-end;
  padding: 44px;
  pointer-events: none;

  @media (max-width: $breakpoint-x) {
    display: none;
  }

  .controls-block {
    height: 384px;
    width: 421px;
    border-radius: 7px;
    position: relative;
    z-index: 5;
    background-color: #fff;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &__wrap {
      padding: 36px;
    }
  }

  .accordion {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .accordion-item {
    font-family: 'Akrobat';
    padding-bottom: 8px;
  }

  .accordion-item.active {
    padding: 0 0 30px;
  }

  .accordion-item.active:not(:first-child) {
    padding: 30px 0;
  }

  .accordion-header {
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease;
    color: $text-color-primary;
    font-size: 24px;
    font-weight: 700;
    width: fit-content;
    opacity: 0.5;
    display: flex;
    align-items: center;
    &:hover {
      opacity: 1;
    }
    .icon {
      width: 0;
      opacity: 0;
      margin-right: 0;
    }
  }

  .accordion-item.active .accordion-header {
    font-size: 28px;
    opacity: 1;
    color: $accent-color-green;
    .icon {
      opacity: 1;
      width: fit-content;
      margin-right: 12px;
    }
  }

  .accordion-content p {
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
    opacity: 0.8;
    color: $text-color-primary;
    margin-top: 10px;
  }

  .accordion-content {
    animation: fadeIn 0.3s ease;
  }

  .image-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    pointer-events: none;
    cursor: none;

    .image-half {
      width: 50%;
      height: 100%;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: none;
    }
  }

  .custom-cursor {
    position: absolute;
    width: 48px;
    height: 48px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .custom-cursor svg {
    display: block;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

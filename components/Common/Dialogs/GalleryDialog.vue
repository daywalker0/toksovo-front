<template>
  <Transition name="gallery">
    <div
      v-if="modelValue"
      class="gallery-overlay"
      @click="closeOnOverlay && $emit('update:modelValue', false)"
    >
      <div class="gallery-content" @click.stop>
        <!-- Заголовок с информацией и кнопкой закрытия -->
        <div class="gallery-header">
          <div class="gallery-info">
            <h3 class="gallery-title">{{ slide?.title }}</h3>
            <p class="gallery-year">{{ slide?.year }}</p>
          </div>
          <button
            class="gallery-close"
            @click="$emit('update:modelValue', false)"
            aria-label="Закрыть галерею"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 0.824833L13.1752 0L7 6.17517L0.824833 0L0 0.824833L6.17517 7L0 13.1752L0.824833 14L7 7.82483L13.1752 14L14 13.1752L7.82483 7L14 0.824833Z"
                fill="#F8F3ED"
              />
            </svg>
          </button>
        </div>

        <!-- Галерея изображений -->
        <div class="gallery-main">
          <div class="gallery-slider" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(image, index) in slide?.gallery || []" :key="index" class="gallery-slide">
              <img :src="image.src" :alt="image.alt" class="gallery-image" />
            </div>
          </div>
        </div>

        <!-- Контролы -->
        <div class="gallery-controls">
          <!-- Прогресс бар (90% ширины) -->
          <div class="gallery-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>

          <!-- Кнопки навигации (10% ширины) -->
          <div class="gallery-navigation">
            <button
              class="nav-button prev"
              :class="{ disabled: isPrevDisabled }"
              :disabled="isPrevDisabled"
              @click="goToPrev"
            >
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                <path
                  d="M7.15141 0.0727358L8.03516 0.956484L1.43391 7.55773C1.31641 7.67648 1.25141 7.83273 1.25141 8.00023C1.25141 8.16773 1.31641 8.32398 1.43391 8.44273L8.03516 15.044L7.15141 15.9277L0.550155 9.32648C0.196404 8.97273 0.00140572 8.50148 0.00140572 8.00023C0.00140572 7.49898 0.196404 7.02898 0.550155 6.67398L7.15141 0.0727358Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              class="nav-button next"
              :class="{ disabled: isNextDisabled }"
              :disabled="isNextDisabled"
              @click="goToNext"
            >
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
                <path
                  d="M1.84859 15.9273L0.964844 15.0435L7.56609 8.44227C7.68359 8.32352 7.74859 8.16727 7.74859 7.99977C7.74859 7.83227 7.68359 7.67602 7.56609 7.55727L0.964844 0.956015L1.84859 0.0722656L8.44985 6.67352C8.8036 7.02727 8.99859 7.49852 8.99859 7.99977C8.99859 8.50102 8.8036 8.97102 8.44985 9.32602L1.84859 15.9273Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  slide: {
    type: Object,
    default: null,
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const currentIndex = ref(0);
const totalSlides = computed(() => props.slide?.gallery?.length || 0);
const slidesPerView = 3; // Показываем 3 слайда одновременно

const isPrevDisabled = computed(() => currentIndex.value <= 0);
const isNextDisabled = computed(() => {
  // Если слайдов меньше чем slidesPerView, то кнопка "вперед" отключена
  if (totalSlides.value <= slidesPerView) return true;
  return currentIndex.value >= totalSlides.value - slidesPerView;
});

const progressPercentage = computed(() => {
  if (totalSlides.value === 0) return 0;
  // Если слайдов меньше чем slidesPerView, прогресс всегда 100%
  if (totalSlides.value <= slidesPerView) return 100;
  return ((currentIndex.value + slidesPerView) / totalSlides.value) * 100;
});

const goToPrev = () => {
  if (!isPrevDisabled.value) {
    currentIndex.value = Math.max(0, currentIndex.value - 1);
  }
};

const goToNext = () => {
  if (!isNextDisabled.value) {
    currentIndex.value = Math.min(totalSlides.value - slidesPerView, currentIndex.value + 1);
  }
};

// Обработка клавиатуры
const handleKeydown = event => {
  if (!props.modelValue) return;

  switch (event.key) {
    case 'Escape':
      emit('update:modelValue', false);
      break;
    case 'ArrowLeft':
      goToPrev();
      break;
    case 'ArrowRight':
      goToNext();
      break;
  }
};

// Функции для блокировки скролла
const lockScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px'; // Компенсация для скроллбара
  }
};

const unlockScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
};

// Следим за изменениями modelValue
watch(
  () => props.modelValue,
  newValue => {
    if (newValue) {
      currentIndex.value = 0;
      lockScroll(); // Блокируем скролл при открытии
    } else {
      unlockScroll(); // Разблокируем скролл при закрытии
    }
  }
);

// Следим за изменениями слайдов
watch(
  () => props.slide?.gallery?.length,
  () => {
    currentIndex.value = 0;
  }
);

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown);
  }
  unlockScroll(); // Убеждаемся что скролл разблокирован при размонтировании
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.gallery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.gallery-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 44px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  margin-top: 50px;
}

.gallery-close {
  width: 48px;
  height: 48px;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: transparent;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    svg {
      transform: rotate(90deg) scale(0.8, 0.8);
    }
  }
}

.gallery-main {
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  background: #f8f8f8;
  padding: 20px;
  overflow: hidden;
  position: relative;
}

.gallery-slider {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
  gap: 16px;
}

.gallery-slide {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-width: 200px;
}

.gallery-image {
  height: 100%;
  width: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-controls {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px 44px;
  background: white;
  border-top: 1px solid #e5e5e5;
}

.gallery-progress {
  flex: 1;
  height: 1px;
  background: #e5e5e5;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: #e5e5e5;
  border-radius: 3px;
}

.progress-fill {
  height: 100%;
  background: #333;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.gallery-navigation {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100px;
}

.nav-button {
  width: 44px;
  height: 44px;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: transparent;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(.disabled) {
    background: #f5f5f5;
    border-color: #999;
  }

  &.disabled {
    opacity: 0.1;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.gallery-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gallery-title {
  font-size: 28px;
  font-weight: 400;
  margin: 0;
  color: #333;
}

.gallery-year {
  font-size: 16px;
  margin: 0;
  color: #666;
}

/* Анимации */
.gallery-enter-active,
.gallery-leave-active {
  transition: opacity 0.4s ease;
}

.gallery-enter-from,
.gallery-leave-to {
  opacity: 0;
}

.gallery-enter-active .gallery-content,
.gallery-leave-active .gallery-content {
  transition:
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.4s ease;
}

.gallery-enter-from .gallery-content {
  transform: translateY(100%);
  opacity: 0;
}

.gallery-leave-to .gallery-content {
  transform: translateY(100%);
  opacity: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .gallery-content {
    margin: 20px;
    height: 95%;
  }

  .gallery-header {
    padding: 20px;
  }

  .gallery-title {
    font-size: 24px;
  }

  .gallery-year {
    font-size: 14px;
  }

  .gallery-main {
    padding: 16px;
  }

  .gallery-slide {
    min-width: 150px;
  }

  .gallery-slider {
    gap: 12px;
  }

  .gallery-controls {
    padding: 20px;
    gap: 16px;
  }

  .gallery-navigation {
    width: 80px;
    gap: 8px;
  }

  .nav-button {
    width: 36px;
    height: 36px;
  }
}
</style>

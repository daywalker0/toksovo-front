<template>
  <Transition name="dialog">
    <div
      v-if="modelValue"
      class="dialog-overlay"
      @click="closeOnOverlay && $emit('update:modelValue', false)"
    >
      <div class="dialog-content" @click.stop>
        <!-- Слот для контента -->
        <slot></slot>
      </div>

      <button
        v-if="showCloseButton"
        class="dialog-close"
        @click="$emit('update:modelValue', false)"
        aria-label="Закрыть"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M14 0.824833L13.1752 0L7 6.17517L0.824833 0L0 0.824833L6.17517 7L0 13.1752L0.824833 14L7 7.82483L13.1752 14L14 13.1752L7.82483 7L14 0.824833Z"
            fill="#F8F3ED"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';

const props = defineProps({
  // Двусторонняя привязка для отображения/скрытия
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Показывать ли кнопку закрытия
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  // Закрывать ли при клике на overlay
  closeOnOverlay: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:modelValue']);

// Переменные для хранения состояния скролла
let scrollY = 0;
let scrollLocked = false;

// Функция для блокировки скролла
const lockScroll = () => {
  if (scrollLocked) return;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }
  scrollLocked = true;
};

// Функция для разблокировки скролла
const unlockScroll = () => {
  if (!scrollLocked) return;

  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    // Плавное восстановление позиции скролла
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollY,
        behavior: 'instant', // Мгновенное восстановление без анимации
      });
    });
  }
  scrollLocked = false;
};

// Следим за изменениями modelValue
watch(
  () => props.modelValue,
  newValue => {
    if (newValue) {
      lockScroll();
    } else {
      // Задержка перед разблокировкой скролла, чтобы анимация закрытия завершилась
      setTimeout(() => {
        unlockScroll();
      }, 400); // 400ms = время анимации закрытия
    }
  }
);

// Разблокируем скролл при уничтожении компонента
onUnmounted(() => {
  unlockScroll();
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 32px;
  border-radius: 10px;
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dialog-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 30px;
  height: 30px;
  border: 1px solid $text-color-white;
  border-radius: 50px;
  background: transparent;
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
    transform: scale(0.9);

    svg {
      transform: rotate(90deg);
    }
  }
}

/* Анимации */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.4s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-active .dialog-content,
.dialog-leave-active .dialog-content {
  transition:
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.4s ease;
}

.dialog-enter-from .dialog-content {
  transform: translateY(100%);
  opacity: 0;
}

.dialog-leave-to .dialog-content {
  transform: translateY(100%);
  opacity: 0;
}
</style>

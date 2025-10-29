<template>
  <Transition name="video-dialog">
    <div
      v-if="modelValue"
      class="video-overlay"
      @click="handleOverlayClick"
    >
      <button
        class="video-close"
        @click="closeDialog"
        aria-label="Закрыть видео"
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
            fill="#2C322C"
          />
        </svg>
      </button>

      <div class="video-content" @click.stop>
        <div class="video-player" ref="playerContainer">
          <video
            :src="video?.url"
            controls
            autoplay
            class="video-native"
          >
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
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
  video: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const playerContainer = ref(null);

const closeDialog = () => {
  emit('update:modelValue', false);
};

const handleOverlayClick = () => {
  closeDialog();
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.modelValue) {
    closeDialog();
  }
};

const { stop: stopScroll, start: startScroll } = useLenis();

const lockScroll = () => {
  stopScroll();
};

const unlockScroll = () => {
  startScroll();
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      lockScroll();
      if (process.client) {
        const header = document.querySelector('.header');
        if (header) {
          header.style.transform = 'translateY(-100%)';
          header.style.transition = 'transform 0.3s ease';
        }
      }
    } else {
      unlockScroll();
      if (process.client) {
        const header = document.querySelector('.header');
        if (header) {
          header.style.transform = '';
        }
      }
    }
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
  unlockScroll();
  if (process.client) {
    const header = document.querySelector('.header');
    if (header) {
      header.style.transform = '';
    }
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;

  @media (max-width: 599px) {
    padding: 0;
    align-items: stretch;
  }
}

.video-content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 599px) {
    max-width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

.video-close {
  position: fixed;
  top: 44px;
  right: 44px;
  width: 48px;
  height: 48px;
  border: 1px solid $text-color-primary;
  border-radius: 50%;
  background: $bg-color-1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2001;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    svg {
      transform: rotate(90deg) scale(0.8, 0.8);
    }
  }

  @media (max-width: 599px) {
    position: absolute;
    top: calc(20px + env(safe-area-inset-top));
    right: 20px;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    
    svg path {
      fill: white;
    }
    
    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
}

.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}

.video-native {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.video-dialog-enter-active,
.video-dialog-leave-active {
  transition: opacity 0.3s ease;
}

.video-dialog-enter-from,
.video-dialog-leave-to {
  opacity: 0;
}

.video-dialog-enter-active .video-content,
.video-dialog-leave-active .video-content {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.video-dialog-enter-from .video-content {
  transform: scale(0.9);
}

.video-dialog-leave-to .video-content {
  transform: scale(0.9);
}
</style>


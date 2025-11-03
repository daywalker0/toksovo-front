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
          <iframe
            v-if="isEmbedVideo"
            :src="embedUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="video-embed"
          ></iframe>
          
          <video
            v-else
            :src="videoUrl"
            controls
            autoplay
            class="video-native"
            @error="handleVideoError"
            @loadedmetadata="handleVideoLoaded"
            preload="metadata"
          >
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>
        <div v-if="videoError && !isEmbedVideo" class="video-error">
          <p>Не удалось загрузить видео</p>
          <p class="error-url">{{ videoUrl }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useMedia } from '@/composables/useMedia';

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
const videoError = ref(false);
const { getMediaUrl } = useMedia();

const videoUrl = computed(() => {
  if (!props.video?.url) return '';

  if (props.video?.linkVideo === true) {
    return props.video.url;
  }
  
  return getMediaUrl(props.video.url);
});

const isDirectVideoFile = computed(() => {
  if (props.video?.linkVideo !== undefined) {
    return !props.video.linkVideo;
  }
  
  const url = videoUrl.value;
  if (!url) return false;
  
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.avi', '.mov', '.m4v', '.mkv'];
  const urlLower = url.toLowerCase();
  return videoExtensions.some(ext => urlLower.includes(ext));
});

const isEmbedVideo = computed(() => {
  const url = videoUrl.value;
  if (!url) return false;
  
  if (props.video?.linkVideo !== undefined) {
    return props.video.linkVideo;
  }
  
  if (isDirectVideoFile.value) {
    return false;
  }
  
  const videoHosts = [
    'youtube.com',
    'youtu.be',
    'rutube.ru',
    'vimeo.com',
    'dailymotion.com',
    'vk.com/video',
    'ok.ru/video',
    'twitch.tv',
  ];
  
  const isKnownHost = videoHosts.some(host => url.includes(host));
  
  if (isKnownHost) {
    return true;
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  
  return false;
});

const embedUrl = computed(() => {
  const url = videoUrl.value;
  if (!url) return '';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
    else if (url.includes('youtu.be/')) {
      const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (shortMatch) {
        videoId = shortMatch[1];
      }
    }
    else if (url.includes('youtube.com/embed/')) {
      return url.split('?')[0] + '?autoplay=1';
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  }
  
  if (url.includes('rutube.ru')) {
    let videoId = '';
    
    const videoMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9_-]+)/);
    if (videoMatch) {
      videoId = videoMatch[1];
    }
    else if (url.includes('rutube.ru/play/embed/')) {
      const embedMatch = url.match(/rutube\.ru\/play\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch) {
        videoId = embedMatch[1];
      } else {
        return url.split('?')[0] + '?autoplay=1';
      }
    }
    
    if (videoId) {
      return `https://rutube.ru/play/embed/${videoId}?autoplay=1`;
    }
  }
  
  if (url.includes('vimeo.com')) {
    let videoId = '';
    
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      videoId = vimeoMatch[1];
    }
    else if (url.includes('player.vimeo.com/video/')) {
      const embedMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/);
      if (embedMatch) {
        videoId = embedMatch[1];
      } else {
        return url.split('?')[0] + '?autoplay=1';
      }
    }
    
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
  }
  
  if (url.includes('dailymotion.com')) {
    let videoId = '';
    
    const dmMatch = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    if (dmMatch) {
      videoId = dmMatch[1];
    }
    else if (url.includes('dailymotion.com/embed/video/')) {
      const embedMatch = url.match(/dailymotion\.com\/embed\/video\/([a-zA-Z0-9]+)/);
      if (embedMatch) {
        videoId = embedMatch[1];
      } else {
        return url.split('?')[0] + '?autoplay=1';
      }
    }
    
    if (videoId) {
      return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
    }
  }
  
  if (!isDirectVideoFile.value) {
    return url.includes('?') ? url + '&autoplay=1' : url + '?autoplay=1';
  }
  
  return url;
});

const handleVideoError = (event) => {
  if (process.dev) {
    // eslint-disable-next-line no-console
    console.error('Video loading error:', event);
  }
  videoError.value = true;
};

const handleVideoLoaded = () => {
  videoError.value = false;
};

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
      videoError.value = false;
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

watch(
  () => props.video,
  () => {
    videoError.value = false;
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

.video-embed {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
  background: #000;
  
  @media (max-width: 599px) {
    min-height: 100%;
  }
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

.video-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  z-index: 10;

  p {
    margin: 8px 0;
  }

  .error-url {
    font-size: 12px;
    opacity: 0.7;
    word-break: break-all;
    max-width: 400px;
  }
}
</style>


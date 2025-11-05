<template>
  <section class="video-reviews-section" id="videos">
    <div class="video-container container">
      <TitleNew :text="props.data?.title || 'Видео-обзоры'" class="section-title" />
      
      <div class="video-main">
        <Swiper
          :modules="[Navigation]"
          :slides-per-view="1.43"
          :space-between="16"
          :navigation="{
            prevEl: prevButtonRef,
            nextEl: nextButtonRef,
          }"
          @swiper="onSwiper"
          @slide-change="onSlideChange"
          class="video-swiper"
        >
          <SwiperSlide
            v-for="slide in videoSlides"
            :key="slide.id"
            class="video-slide"
          >
            <div class="video-card" @click="handleVideoClick(slide)">
              <div class="video-thumbnail">
                <img 
                  :src="slide.thumbnail || getVideoThumbnail(slide.url)" 
                  :alt="slide.title"
                  class="thumbnail-image"
                />
                <div class="play-button">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="30" fill="#FF6B00"/>
                    <path d="M24 18L42 30L24 42V18Z" fill="white" stroke="white" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div class="video-controls">
        <div class="video-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <div class="video-navigation">
          <button
            ref="prevButtonRef"
            class="nav-button prev"
            :class="{ disabled: isPrevDisabled }"
            :disabled="isPrevDisabled"
          >
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
              <path
                d="M7.15141 0.0727358L8.03516 0.956484L1.43391 7.55773C1.31641 7.67648 1.25141 7.83273 1.25141 8.00023C1.25141 8.16773 1.31641 8.32398 1.43391 8.44273L8.03516 15.044L7.15141 15.9277L0.550155 9.32648C0.196404 8.97273 0.00140572 8.50148 0.00140572 8.00023C0.00140572 7.49898 0.196404 7.02898 0.550155 6.67398L7.15141 0.0727358Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            ref="nextButtonRef"
            class="nav-button next"
            :class="{ disabled: isNextDisabled }"
            :disabled="isNextDisabled"
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

    <VideoDialog 
      v-model="isDialogOpen" 
      :video="selectedVideo"
    />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import TitleNew from '~/components/Common/TitleNew.vue';
import VideoDialog from '~/components/Common/Dialogs/VideoDialog.vue';
import { useMedia } from '@/composables/useMedia';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

const isDialogOpen = ref(false);
const selectedVideo = ref(null);
const currentIndex = ref(0);
const prevButtonRef = ref(null);
const nextButtonRef = ref(null);
const swiperInstance = ref(null);
const { getMediaUrl } = useMedia();

const videoSlides = computed(() => {
  const rawVideos = props.data?.videos || props.data?.items || [];
  if (Array.isArray(rawVideos) && rawVideos.length) {
    return rawVideos.map((item, index) => {
      // Возможные поля из Strapi для видео и превью
      const title = item.title || item.name || '';
      const description = item.description || item.subtitle || '';
      const videoMedia = item.video || item.file || item.url;
      const thumbMedia = item.video_main || item.thumbnail || item.preview || item.image || item.poster;

      const url = getMediaUrl(videoMedia);
      const thumbnail = getMediaUrl(thumbMedia);

      return {
        id: item.id || index + 1,
        title,
        description,
        url,
        thumbnail,
        // duration может прийти с бэка, иначе опционально
        duration: item.duration || ''
      };
    }).filter(v => v.url);
  }
  return [];
});

const totalSlides = computed(() => videoSlides.value.length);
const visibleSlidesCount = 1.43;

const isPrevDisabled = computed(() => currentIndex.value <= 0);
const isNextDisabled = computed(() => {
  if (totalSlides.value <= visibleSlidesCount) return true;
  return currentIndex.value >= totalSlides.value - visibleSlidesCount;
});

const progressPercentage = computed(() => {
  if (totalSlides.value === 0) return 0;
  if (totalSlides.value <= visibleSlidesCount) return 100;
  return ((currentIndex.value + visibleSlidesCount) / totalSlides.value) * 100;
});

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const onSlideChange = (swiper) => {
  currentIndex.value = swiper.activeIndex;
};

const getVideoThumbnail = (url) => {
  if (!url) return '';
  // Поддержка превью для YouTube ссылок
  try {
    const ytIdMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    if (ytIdMatch && ytIdMatch[1]) {
      return `https://img.youtube.com/vi/${ytIdMatch[1]}/hqdefault.jpg`;
    }
  } catch (e) {
    // no-op
  }
  return '';
};

const handleVideoClick = (video) => {
  selectedVideo.value = video;
  isDialogOpen.value = true;
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.video-reviews-section {
  padding: 0px 0 60px;
  background: $bg-color-1;

  @media (max-width: $breakpoint-x) {
    padding: 40px 0 20px;
  }
}

.video-container {
  max-width: 1920px;
  margin: 0 auto;
}

.section-title {
  margin-bottom: 60px;
  text-align: left;

  @media (max-width: $breakpoint-x) {
    margin-bottom: 40px;
  }
}

.video-main {
  width: 100%;
  overflow: visible;
  position: relative;
}

.video-swiper {
  width: 100%;
  overflow: visible;
}

.video-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 12px;
  overflow: hidden;
  background: #000;

  @media (max-width: $breakpoint-x) {
    border-radius: 8px;
  }
}

.thumbnail-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));

  svg {
    width: 60px;
    height: 60px;
  }

  @media (max-width: $breakpoint-x) {
    svg {
      width: 38px;
      height: 38px;
    }
  }
}

.video-card:hover .play-button {
  transform: translate(-50%, -50%) scale(1.1);
}

.video-controls {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 24px;

  @media (max-width: $breakpoint-x) {
    display: none;
  }
}

.video-progress {
  flex: 1;
  height: 1px;
  background: $utility-color-1;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: $utility-color-1;
}

.progress-fill {
  height: 100%;
  background: $text-color-primary;
  transition: width 0.3s ease;
}

.video-navigation {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100px;

  @media (max-width: $breakpoint-x) {
    width: auto;
    gap: 8px;
  }
}

.nav-button {
  width: 44px;
  height: 44px;
  border: 1px solid $text-color-primary;
  border-radius: 50%;
  background: transparent;
  color: $text-color-primary;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(.disabled) {
    background: $accent-color-orange;
    border-color: $accent-color-orange;

    svg path {
      fill: $text-color-white;
    }
  }

  @media (max-width: $breakpoint-x) {
    width: 36px;
    height: 36px;

    &:hover {
      background-color: transparent;
      border: 1px solid $text-color-primary;

      svg path {
        fill: $text-color-primary;
      }
    }
  }

  &.disabled {
    opacity: 0.1;
    cursor: not-allowed;
    pointer-events: none;
  }
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  display: none;
}
</style>


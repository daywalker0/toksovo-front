<template>
  <section v-if="projectsSlides.length > 0" class="projects-section section" id="projects">
    <div class="projects-section__container container">
      <TitleNew :text="title" class="projects-section__title" />

      <DefaultSlider
        :slides="projectsSlides"
        :slides-per-view="2"
        :space-between="45"
        :show-navigation="true"
        :hide-navigation-on-mobile="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]">
            <div class="image-container">
              <img :src="slide.image" :alt="slide.title" class="slide-image" loading="lazy" />
            </div>
            <div class="content">
              <div class="content__body">
                <div class="content--header">
                <div>{{ slide.rented }}</div>
                <div>{{ slide.city }}</div>
              </div>

              <div class="content--title">
                {{ slide.title }}
              </div>

              <div class="content--info">
                <div v-if="slide.houses" class="content--info_text">
                  <span>{{ slide.houses }} дома</span>
                </div>
                <div v-if="slide.apps" class="content--info_text">
                  <div v-if="slide.houses" class="content--info_dot"></div>
                  <span>{{ slide.apps }} квартир</span>
                </div>
                <div v-if="slide.floors" class="content--info_text">
                  <div v-if="slide.apps" class="content--info_dot"></div>
                  <span>{{ slide.floors }} этажей</span>
                </div>
              </div>
              </div>

              <div class="content__actions">
                <button
                  v-if="slide.hasVideo && slide.videoUrl"
                  @click.stop="openDialogVideo(slide)"
                  class="content--button button"
                >
                  Видео
                </button>
              </div>
            </div>
          </div>
        </template>
      </DefaultSlider>
    </div>
    <VideoDialog 
      v-model="showDialogVideo" 
      :video="selectedVideo"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import VideoDialog from './Common/Dialogs/VideoDialog.vue';
import TitleNew from './Common/TitleNew.vue';
import { useMedia } from '~/composables/useMedia';
import { useProjectsApi } from '~/composables/useProjectsApi';

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

const { getMediaUrl } = useMedia();
const { fetchAllProjects } = useProjectsApi();

const showDialogVideo = ref(false);
const selectedVideo = ref(null);
const projects = ref([]);

const projectVideos = {
  default: 'https://rutube.ru/video/36fc5c318c469a404d7254f66ddfdfef/',
};

const title = computed(() => props.data?.title || 'Другие проекты');

const projectsSlides = computed(() => {
  if (!Array.isArray(projects.value) || projects.value.length === 0) {
    return [];
  }
  
  return projects.value.map(project => {
    let houses = null;
    let apps = null;
    let floors = null;
    
    if (project.project_features && Array.isArray(project.project_features)) {
      project.project_features.forEach(feature => {
        const value = feature.value || '';
        const lowerValue = value.toLowerCase();
        
        if (lowerValue.includes('дом')) {
          const match = value.match(/(\d+)/);
          if (match) houses = parseInt(match[1]);
        } else if (lowerValue.includes('квартир')) {
          const match = value.match(/(\d+)/);
          if (match) apps = parseInt(match[1]);
        } else if (lowerValue.includes('этаж')) {
          const match = value.match(/(\d+)/);
          if (match) floors = parseInt(match[1]);
        }
      });
    }
    
    const linkVideo = project.link_video !== undefined ? project.link_video : true;
    let videoUrl = '';
    let hasVideo = false;
    
    const videoField = project.video || project.popup_video || project.url_video;
    
    if (videoField) {
      hasVideo = true;
      if (linkVideo) {
        if (typeof videoField === 'object' && videoField.url) {
          videoUrl = videoField.url;
        } else {
          videoUrl = videoField;
        }
      } else {
        videoUrl = getMediaUrl(videoField);
      }
    } else {
      const projectId = project.id || project.title || project.name || '';
      const fallbackVideo = projectVideos[project.title] || 
                           projectVideos[project.name] ||
                           projectVideos[projectId] ||
                           projectVideos.default;
      
      if (fallbackVideo && fallbackVideo !== projectVideos.default) {
        hasVideo = true;
        videoUrl = fallbackVideo;
      } else if (fallbackVideo === projectVideos.default) {
        videoUrl = '';
      }
    }
    
    return {
      id: project.id || project.title || project.name || '',
      title: project.title || project.name || '',
      city: project.location || project.city || '',
      rented: project.date || project.rented || project.delivery_date || '',
      image: getMediaUrl(project.cover_image || project.image),
      houses,
      apps,
      floors,
      link: project.link || '#',
      videoUrl: videoUrl,
      linkVideo: linkVideo,
      hasVideo: hasVideo,
    };
  });
});

const openDialogVideo = (slide) => {
  if (slide && slide.videoUrl) {
    selectedVideo.value = {
      url: slide.videoUrl,
      title: slide.title || 'Видео проекта',
      linkVideo: slide.linkVideo !== undefined ? slide.linkVideo : true,
    };
    showDialogVideo.value = true;
  }
};

const equalizeSlideHeights = () => {
  if (!process.client) return;

  const slides = document.querySelectorAll('.projects-section .swiper-slide');
  if (!slides.length) return;

  slides.forEach(slide => {
    slide.style.height = '';
  });

  let maxHeight = 0;
  slides.forEach(slide => {
    maxHeight = Math.max(maxHeight, slide.offsetHeight);
  });

  if (maxHeight > 0) {
    slides.forEach(slide => {
      slide.style.height = `${maxHeight}px`;
    });
  }
};

const scheduleEqualizeSlideHeights = () => {
  nextTick(() => {
    requestAnimationFrame(equalizeSlideHeights);
  });
};

const bindImageLoadEqualize = () => {
  if (!process.client) return;

  document
    .querySelectorAll('.projects-section .slide-image')
    .forEach(img => {
      if (img.complete) return;
      img.addEventListener('load', scheduleEqualizeSlideHeights, { once: true });
    });
};

let slidesResizeObserver = null;

const observeSlidesResize = () => {
  if (!process.client) return;

  const wrapper = document.querySelector('.projects-section .swiper-wrapper');
  if (!wrapper || slidesResizeObserver) return;

  slidesResizeObserver = new ResizeObserver(scheduleEqualizeSlideHeights);
  slidesResizeObserver.observe(wrapper);
};

onMounted(async () => {
  try {
    projects.value = await fetchAllProjects();
  } catch {
    projects.value = [];
  }

  scheduleEqualizeSlideHeights();
  bindImageLoadEqualize();
  observeSlidesResize();
  window.addEventListener('resize', scheduleEqualizeSlideHeights);

  setTimeout(scheduleEqualizeSlideHeights, 150);
  setTimeout(scheduleEqualizeSlideHeights, 500);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleEqualizeSlideHeights);
  slidesResizeObserver?.disconnect();
  slidesResizeObserver = null;
});

watch(projectsSlides, () => {
  scheduleEqualizeSlideHeights();
  bindImageLoadEqualize();
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.projects-section {
  ::v-deep(.default-swiper .swiper-wrapper) {
    align-items: stretch;
  }

  ::v-deep(.swiper-slide) {
    display: flex;
    height: auto;
    align-self: stretch;
  }

  ::v-deep(.slide) {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    overflow: hidden;

  @media (min-width: 600px) {
    padding: 24px !important;
    border: 1px solid rgba(44, 50, 44, 0.2) !important;
    border-radius: 12px !important;
    transition:
      border-color 0.3s ease,
      background-color 0.3s ease;

    &:hover {
      border: 1px solid $text-color-white !important;
      background-color: $text-color-white !important;
    }

    @media (max-width: $breakpoint-x) {
      &:hover {
        border: 1px solid rgba(44, 50, 44, 0.2) !important;
        background-color: transparent !important;
      }
    }
  }

  @media (max-width: $breakpoint-x) {
    padding: 0 !important;
    border: none !important;
  }
  }

  margin-bottom: 60px;
  @media (max-width: $breakpoint-x) {

    ::v-deep(.default-slider) {
      overflow: visible;
    }

    ::v-deep(.slider-container) {
      overflow: visible;
    }

    ::v-deep(.default-swiper) {
      overflow: visible;
    }
  }
  &__title {
    margin: 0 auto;
    margin-bottom: 40px;
    font-size: 88px;

    @media (max-width: $breakpoint-x) {
      margin-bottom: 20px;
    }
  }
}

.custom-slide {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 100%;
  min-width: 0;
}

.content {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  flex: 1;
  min-height: 0;
  min-width: 0;

  &__body {
    flex: 0 0 auto;
    min-width: 0;
  }

  &__actions {
    margin-top: auto;
    padding-top: 24px;
    min-height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;

    @media (max-width: $breakpoint-x) {
      padding-top: 16px;
    }
  }

  @media (max-width: $breakpoint-x) {
    margin-top: 12px;
  }

  &--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 100%;
    min-width: 0;

    > div {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    @media (max-width: $breakpoint-md) {
      font-size: 14px;
    }

    @media (max-width: $breakpoint-x) {
      flex-direction: column-reverse;
      gap: 4px;
      align-items: flex-start;
      font-size: 14px;
      margin-bottom: 14px;
    }
  }

  &--title {
    margin-bottom: 16px;
    font-size: 32px;
    line-height: 80%;
    overflow-wrap: anywhere;

    @media (max-width: $breakpoint-lg) {
      font-size: 28px;
    }

    @media (max-width: $breakpoint-md) {
      font-size: 24px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 20px;
      margin-bottom: 8px;
    }
  }

  &--info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 0;
    font-family: 'Akrobat';
    font-size: 18px;
    line-height: 140%;
    margin-bottom: 0;

    @media (max-width: $breakpoint-lg) {
      font-size: 16px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 14px;
    }

    &_text {
      display: flex;
      align-items: center;
    }
    &_dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: $text-color-secondary;
      margin: 0 8px;
    }
  }
  &--button {
    margin: 0;
    flex-shrink: 0;
    align-self: flex-start;
    transition: 0.3s;
    min-height: 48px;
    padding: 12px 24px;

    &::before {
      display: none;
    }

    &:hover {
      border-radius: 7px;
      background-color: $accent-color-orange;
      border: 1px solid $accent-color-orange;
      color: $text-color-white;
      transition: 0.3s;
    }

    @media (max-width: $breakpoint-x) {
      &:hover {
        border-radius: 50px;
        background-color: transparent;
        color: inherit;
        border-color: inherit;
        transition: none;
      }
    }
  }
}

.image-container {
  width: 100%;
  height: 300px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;

  @media (max-width: $breakpoint-lg) {
    height: 250px;
  }

  @media (max-width: $breakpoint-md) {
    height: 200px;
  }

  @media (max-width: $breakpoint-x) {
    height: 180px;
  }

  @media (max-width: 599px) {
    height: auto;
    aspect-ratio: 1 / 1;
  }

  img,
  .slide-image {
    width: 100%;
    height: 100%;
    aspect-ratio: unset;
    object-fit: cover;
    display: block;
  }
}


</style>

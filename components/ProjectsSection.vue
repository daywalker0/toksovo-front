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

              <button 
                v-if="slide.hasVideo && slide.videoUrl" 
                @click="openDialogVideo(slide)" 
                class="content--button button"
              >
                Видео
              </button>
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
import { ref, computed, onMounted } from 'vue';
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

onMounted(async () => {
  try {
    projects.value = await fetchAllProjects();
  } catch {
    projects.value = [];
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

::v-deep(.slide) {
  min-height: 0 !important;

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

.projects-section {
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
  height: 500px;
  display: flex;
  flex-direction: column;
  min-height: 450px;
  width: 100%;

  @media (max-width: $breakpoint-lg) {
    height: auto;
  }

  @media (max-width: $breakpoint-sm) {
    min-height: 340px;
  }

  @media (max-width: $breakpoint-x) {
    height: auto;
    min-height: auto;
    width: 100%;
  }
}

.content {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  flex: 1;

  @media (max-width: $breakpoint-md) {
      justify-content: space-between;
    }

  @media (max-width: $breakpoint-x) {
    margin-top: 12px;
  }

  &--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 100%;

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
    align-items: center;
    font-family: 'Akrobat';
    font-size: 18px;
    line-height: 140%;
    margin-bottom: 50px;

    @media (max-width: $breakpoint-lg) {
      font-size: 16px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 14px;
      margin-bottom: 16px;
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
    margin-top: auto;
    margin-bottom: 0;
    transition: 0.3s;
    min-height: 48px;
    padding: 12px 24px;

    &::before {
      display: none;
    }

    @media (max-width: $breakpoint-md) {
      margin-top: 20px;
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}


</style>

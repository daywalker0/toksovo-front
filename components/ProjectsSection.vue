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

              <button @click="openDialogVideo()" class="content--button button">Видео</button>
            </div>
          </div>
        </template>
      </DefaultSlider>
    </div>
    <Dialog v-model="showDialogVideo" :close-on-overlay="true" class="video-dialog">
      <div class="video-dialog-content">ВИДЕО</div>
    </Dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import Dialog from './Common/Dialogs/Dialog.vue';
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
const projects = ref([]);

// Заголовок секции
const title = computed(() => props.data?.title || 'Другие проекты');

// Получаем проекты из API
const projectsSlides = computed(() => {
  if (!Array.isArray(projects.value) || projects.value.length === 0) {
    return [];
  }
  
  return projects.value.map(project => {
    // Парсим project_features для извлечения houses, apps, floors
    let houses = null;
    let apps = null;
    let floors = null;
    
    if (project.project_features && Array.isArray(project.project_features)) {
      project.project_features.forEach(feature => {
        const value = feature.value || '';
        const lowerValue = value.toLowerCase();
        
        if (lowerValue.includes('дом')) {
          // Извлекаем число из строки типа "2 дома"
          const match = value.match(/(\d+)/);
          if (match) houses = parseInt(match[1]);
        } else if (lowerValue.includes('квартир')) {
          // Извлекаем число из строки типа "65 квартир"
          const match = value.match(/(\d+)/);
          if (match) apps = parseInt(match[1]);
        } else if (lowerValue.includes('этаж')) {
          // Извлекаем число из строки типа "6 этажей"
          const match = value.match(/(\d+)/);
          if (match) floors = parseInt(match[1]);
        }
      });
    }
    
    return {
      title: project.title || project.name || '',
      city: project.location || project.city || '',
      rented: project.date || project.rented || project.delivery_date || '',
      image: getMediaUrl(project.cover_image || project.image),
      houses,
      apps,
      floors,
      link: project.link || '#',
    };
  });
});

const openDialogVideo = () => {
  showDialogVideo.value = true;
};

// Загружаем проекты при монтировании
onMounted(async () => {
  try {
    projects.value = await fetchAllProjects();
  } catch (error) {
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

::v-deep(.dialog-content) {
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 118px;
}
.projects-section {
  @media (max-width: $breakpoint-x) {
    margin-bottom: 60px;

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
    margin-bottom: 80px;
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

    @media (max-width: $breakpoint-md) {
      margin-top: 20px;
    }

    &:hover {
      background-color: $accent-color-orange;
      color: white;
      border-color: $accent-color-orange;
      transition: 0.3s;
    }

    @media (max-width: $breakpoint-x) {
      &:hover {
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* Стили для видео диалога */
::v-deep(.video-dialog) {
  .dialog-content {
    max-width: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 170px;

    @media (max-width: $breakpoint-lg) {
      height: 30%;
      margin: 0 50px;
    }

    @media (max-width: $breakpoint-x) {
      border-radius: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      height: 214px;
    }
  }

  .dialog-close {
    top: 20px;
    right: 20px;
  }
}

.video-dialog-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;


  @media (max-width: $breakpoint-x) {
    font-size: 40px;
  }
}

</style>

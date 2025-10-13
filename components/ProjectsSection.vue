<template>
  <section class="projects-section section" id="projects">
    <div class="projects-section__container container">
      <TitleNew text="Другие проекты" class="projects-section__title" />
      <DefaultSlider
        :slides="projectsSlides"
        :slides-per-view="2"
        :space-between="45"
        :show-navigation="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]">
            <div class="image-container">
              <img :src="slide.image" :alt="slide.title" class="slide-image" />
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
    <Dialog v-model="showDialogVideo">
      <div>ВИДЕО</div>
    </Dialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import projectItem1 from '@/assets/img/project-item-1.jpg';
import projectItem2 from '@/assets/img/project-item-2.jpg';
import projectItem3 from '@/assets/img/project-item-3.jpg';
import Dialog from './Common/Dialogs/Dialog.vue';
import TitleNew from './Common/TitleNew.vue';

const showDialogVideo = ref(false);

const projectsSlides = [
  {
    title: 'ЖК «Северный меридиан»',
    city: 'г. Бугры',
    rented: 'Сдача: IV кв. 2025',
    image: projectItem1,
    houses: null,
    apps: 339,
    floors: 9,
    link: '#',
  },
  {
    title: 'ЖК «Октябрьский 78»',
    city: 'г. Всеволжск',
    rented: 'Дом сдан в 2023',
    image: projectItem2,
    link: '#',
    houses: 2,
    apps: 80,
    floors: 6,
  },
  {
    title: 'ЖК «Октябрьский 78»',
    city: 'г. Всеволжск',
    rented: 'Дом сдан в 2022',
    image: projectItem3,
    link: '#',
    houses: null,
    apps: 65,
    floors: 6,
  },
  {
    title: 'ЖК «Северный меридиан»',
    city: 'г. Бугры',
    rented: 'Сдача: IV кв. 2025',
    image: projectItem1,
    houses: null,
    apps: 339,
    floors: 9,
    link: '#',
  },
];

const openDialogVideo = () => {
  showDialogVideo.value = true;
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
::v-deep(.dialog-content) {
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 118px;
}
.projects-section {
  &__title {
    margin: 0 auto;
    margin-bottom: 60px;
    font-size: 88px;
  }
}

.custom-slide {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 500px;

  @media (max-width: $breakpoint-sm) {
    min-height: 390px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  flex: 1;

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

    @media (max-width: $breakpoint-sm) {
      font-size: 20px;
    }
  }

  &--info {
    display: flex;
    align-items: center;
    font-family: 'Akrobat';
    font-size: 18px;
    line-height: 140%;

    @media (max-width: $breakpoint-lg) {
      font-size: 16px;
    }

    @media (max-width: $breakpoint-md) {
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
    margin-top: auto;
    transition: 0.3s;
    margin-bottom: 0;
    min-height: 48px;
    padding: 12px 24px;

    &:hover {
      background-color: $accent-color-orange;
      color: white;
      border-color: $accent-color-orange;
      transition: 0.3s;
    }
  }
}

.image-container {
  height: 373px;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: $breakpoint-lg) {
    height: 300px;
  }

  @media (max-width: $breakpoint-md) {
    height: 250px;
  }

  @media (max-width: $breakpoint-sm) {
    height: 200px;
  }
}
</style>

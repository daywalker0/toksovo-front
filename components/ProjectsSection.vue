<template>
  <section class="projects-section section">
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
::v-deep(.swiper-slide) {
  height: 680px !important;
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
  &__container {
  }
  &__title {
    margin: 0 auto;
    margin-bottom: 60px;
    font-size: 88px;
  }
}

.custom-slide {
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  max-height: 200px;
  height: 100%;

  &--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 100%;
  }

  &--title {
    margin-bottom: 16px;
    font-size: 32px;
    line-height: 80%;
  }

  &--info {
    display: flex;
    align-items: center;
    font-family: 'Akrobat';
    font-size: 18px;
    line-height: 140%;
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
  }
}

.image-container {
  min-width: 373px;
  img {
    width: 100%;
  }
}
</style>

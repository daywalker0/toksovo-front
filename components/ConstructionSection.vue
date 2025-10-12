<template>
  <section class="construction-section section" id="construction">
    <div class="construction-section__container container">
      <TitleNew text="ход строительства" class="construction-section__title" />
      <DefaultSlider
        :slides="constructionSlides"
        :slides-per-view="2"
        :space-between="45"
        :show-navigation="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]" @click="openGallery(slide)">
            <div class="image-container">
              <img :src="slide.image" :alt="slide.title" class="slide-image" />
            </div>
            <div class="content">
              <div class="content--title">{{ slide.title }}</div>
              <div class="content--year">{{ slide.year }}</div>
            </div>
          </div>
        </template>
      </DefaultSlider>
    </div>

    <!-- Галерея -->
    <GalleryDialog v-model="isGalleryOpen" :slide="selectedSlide" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import constrImg from '@/assets/img/constr-img.jpg';
import TitleNew from './Common/TitleNew.vue';
import GalleryDialog from './Common/Dialogs/GalleryDialog.vue';
import testImg from '@/assets/img/live-in-style-item-1.png';
import galleryTestImg from '@/assets/img/gallery-test-img.png';

const isGalleryOpen = ref(false);
const selectedSlide = ref(null);

const constructionSlides = [
  {
    title: 'Сентябрь',
    year: '2024',
    image: constrImg,
    gallery: [
      { src: galleryTestImg, alt: 'Сентябрь 1' },
      { src: testImg, alt: 'Сентябрь 2' },
      { src: galleryTestImg, alt: 'Сентябрь 3' },
      { src: testImg, alt: 'Сентябрь 4' },
    ],
  },
  {
    title: 'Август',
    year: '2024',
    image: testImg,
    gallery: [
      { src: galleryTestImg, alt: 'Август 1' },
      { src: testImg, alt: 'Август 2' },
      { src: galleryTestImg, alt: 'Август 3' },
    ],
  },
  {
    title: 'Июль',
    year: '2024',
    image: constrImg,
    gallery: [
      { src: galleryTestImg, alt: 'Июль 1' },
      { src: testImg, alt: 'Июль 2' },
      { src: galleryTestImg, alt: 'Июль 3' },
      { src: testImg, alt: 'Июль 4' },
      { src: galleryTestImg, alt: 'Июль 5' },
    ],
  },
  {
    title: 'Июнь',
    year: '2024',
    image: testImg,
    gallery: [
      { src: galleryTestImg, alt: 'Июнь 1' },
      { src: testImg, alt: 'Июнь 2' },
    ],
  },
];

const openGallery = slide => {
  selectedSlide.value = slide;
  isGalleryOpen.value = true;
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.construction-section {
  &__container {
    padding-bottom: 120px;
  }
  &__title {
    margin: 0 auto;
    margin-bottom: 60px;
    font-size: 88px;
  }
}

.custom-slide {
  cursor: pointer;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  color: $text-color-primary;

  &--title {
    font-size: 28px;
  }
  &--year {
    font-size: 16px;
  }
}

.image-container {
  height: 373px;
  img {
    height: 100%;
    object-fit: cover;
  }
}

.image-container {
  min-width: 373px;
  img {
    width: 100%;
  }
}
</style>

<template>
  <section class="construction-section section">
    <div class="construction-section__container container">
      <Title :config="[
          { word: 'ход строительства', x: 60 },
        ]"
        class="construction-section__title" 
      />
      <DefaultSlider
        :slides="constructionSlides"
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
              <div class="content--title">{{ slide.title }}</div>
              <div class="content--year">{{ slide.year }}</div>
            </div>
          </div>
        </template>
      </DefaultSlider>
    </div>
  </section>
</template>

<script setup>
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import constrImg from '@/assets/img/constr-img.jpg';
import Title from './Common/Title.vue';

const constructionSlides = [
  { title: 'Сентябрь', year: '2024', image: constrImg },
  { title: 'Август', year: '2024', image: constrImg },
  { title: 'Июль', year: '2024', image: constrImg },
  { title: 'Июнь', year: '2024', image: constrImg },
];
</script>

<style lang="scss" scoped>
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
  min-width: 373px;
  img {
    width: 100%;
  }
}
</style>

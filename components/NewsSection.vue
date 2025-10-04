<template>
  <section class="news-section section">
    <div class="news-section__container container">
      <h2 class="news-section__title">Другие новости</h2>
      <DefaultSlider
        :slides="newsSlides"
        :slides-per-view="2"
        :space-between="20"
        :show-navigation="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]">
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

const newsSlides = [
  { title: 'Сентябрь', year: '2024' },
  { title: 'Август', year: '2024' },
  { title: 'Июль', year: '2024' },
  { title: 'Июнь', year: '2024' },
];
</script>

<style lang="scss" scoped>
.news-section {
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
</style>

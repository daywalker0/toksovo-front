<template>
  <section class="news-section section">
    <div class="news-section__container container">
      <TitleNew text="Новости" class="news-section__title" />
      <DefaultSlider
        :slides="newsSlides"
        :slides-per-view="2"
        :space-between="45"
        :show-navigation="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]">
            <div class="content">
              <div class="content--text">{{ slide.text }}</div>
              <div class="content--date">
                <div class="date">
                  <span>{{ slide.number }}</span>
                  {{ slide.month }}
                </div>
                <div class="year">
                  {{ slide.year }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </DefaultSlider>
    </div>
  </section>
</template>

<script setup>
import TitleNew from './Common/TitleNew.vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';

const newsSlides = [
  {
    text: 'ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности',
    year: '2024',
    number: '17',
    month: 'сентября',
  },
  {
    text: 'Короткая новость',
    year: '2024',
    number: '17',
    month: 'сентября',
  },
  {
    text: `ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции
      в своей деятельности утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности`,
    year: '2024',
    number: '17',
    month: 'сентября',
  },
  {
    text: 'Короткая новость',
    year: '2024',
    number: '17',
    month: 'сентября',
  },
];
</script>

<style lang="scss" scoped>
::v-deep(.swiper-slide) {
  height: 300px !important;
}

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
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  color: $text-color-primary;
  font-family: 'Akrobat';

  &--date {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    line-height: 100%;
    font-size: 16px;
    font-family: 'Bona Nova SC';
    margin-top: 40px;
  }
  &--text {
    font-size: 22px;
    font-weight: 500;
    line-height: 140%;
    max-height: 11.625rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
}
.date {
  span {
    font-size: 46px;
    line-height: 80%;
  }
}

.custom-slide {
  height: 100%;
}
</style>

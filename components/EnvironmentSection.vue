<template>
  <div class="environment-section section">
    <div class="environment-section__container container">
      <Title :config="[
          { word: 'Спокойствие', x: 60 },
          { word: 'свежесть', x: 700 },
          { word: 'природа', x: 510 }
        ]" 
      />
      <div class="subtitle-text environment-section__subtitle">
        Утро встречает вас чистым воздухом и спокойствием — прогулка, кофе на террасе или время с
        семьёй. Днём вы легко погружаетесь в деловую жизнь города, ведь вся инфраструктура
        и удобства находятся неподалёку. Вечером же Токсово возвращает ощущение свободы, когда можно
        насладиться тишиной, уединением и красотой природы.
      </div>

      <div class="environment-section__slider-wrapper">
        <Swiper
          :slides-per-view="5"
          :centered-slides="true"
          :space-between="32"
          :initial-slide="2"
          :speed="600"
          :watch-slides-progress="true"
          pagination
          class="environment-section__slider"
        >
          <SwiperSlide v-for="(slide, index) in slides" :key="index">
            <img :src="slide" alt="" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import imgSlide from '../assets/img/private-housing-section.jpg';
import { Autoplay } from 'swiper/modules';
import Title from './Common/Title.vue';

const slides = [imgSlide, imgSlide, imgSlide, imgSlide, imgSlide];
</script>

<style lang="scss" scoped>
:deep(.swiper-wrapper) {
  justify-content: center;
  align-items: center;
}

.environment-section {
  padding: 80px 0;
  &__title {
    margin: 0 auto;
    width: fit-content;
    text-align: center;
  }
  &__subtitle {
    max-width: 395px;
    margin: 60px auto 80px;
  }
  &__slider {
    height: 590px;
  }
}

.environment-section__slider-wrapper {
  width: 100%;

  .environment-section__slider {
    width: 100%;
    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
      display: none !important;
    }
    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      transition:
        width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: width, height, transform;
      transform-origin: right;
    }

    .swiper-slide-next,
    .swiper-slide-active ~ .swiper-slide {
      transform-origin: left;
    }

    .swiper-slide img {
      width: 100%;
      height: 100%;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      object-fit: cover;
      border-radius: 8px;
    }

    // Реальные размеры карточек — DevTools покажет разные ширины, gap будет корректным
    .swiper-slide {
      width: 131px !important;
      height: 198px;
      align-self: center;
    }

    .swiper-slide-prev,
    .swiper-slide-next {
      width: 262px !important;
      height: 394px;
    }

    .swiper-slide-active {
      width: 394px !important;
      height: 590px;
      z-index: 2;
    }

  }
}
</style>

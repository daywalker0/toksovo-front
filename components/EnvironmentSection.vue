<template>
  <div class="environment-section section">
    <div class="environment-section__container container">
      <h2 class="environment-section__title">
        Спокойствие <br />
        свежесть <br />
        природа
      </h2>
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
          effect="coverflow"
          :coverflow-effect="{
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }"
          :modules="[Autoplay, EffectCoverflow]"
          navigation
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
import 'swiper/css/effect-coverflow';
import imgSlide from '../assets/img/private-housing-section.jpg';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

const slides = [imgSlide, imgSlide, imgSlide, imgSlide, imgSlide];
</script>

<style lang="scss" scoped>
:deep(.swiper-wrapper) {
  justify-content: center;
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
    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s;
    }

    .swiper-slide img {
      width: 100%;
      max-width: 394px;
      height: 100%;
      transition: 0.5s;
      object-fit: cover;
    }

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
    }
  }
}
</style>

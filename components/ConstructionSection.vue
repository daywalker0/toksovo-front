<template>
  <section class="construction-section section" id="construction">
    <div class="construction-section__container container">
      <TitleNew text="Ход строительства" class="construction-section__title" />

      <!-- Десктопная версия - слайдер -->
      <DefaultSlider
        v-if="!isMobile"
        :slides="constructionSlides"
        :slides-per-view="2"
        :space-between="45"
        :show-navigation="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]" @click="openGallery(slide)">
            <div class="image-container">
              <img :src="slide.image" :alt="slide.title" class="slide-image" loading="lazy" />
            </div>
            <div class="content">
              <div class="content--title">{{ slide.title }}</div>
              <div class="content--year">{{ slide.year }}</div>
            </div>
          </div>
        </template>
      </DefaultSlider>

      <!-- Мобильная версия - две колонки -->
      <div v-else class="construction-grid">
        <div
          v-for="(slide, index) in visibleSlides"
          :key="index"
          class="custom-slide"
          @click="openGallery(slide)"
        >
          <div class="image-container">
            <img :src="slide.image" :alt="slide.title" class="slide-image" loading="lazy" />
          </div>
          <div class="content">
            <div class="content--title">{{ slide.title }}</div>
            <div class="content--year">{{ slide.year }}</div>
          </div>
        </div>
      </div>

      <!-- Кнопка "Показать еще" -->
      <button v-if="isMobile && hasMoreSlides" class="show-more-btn" @click="showMoreSlides">
        Показать еще {{ remainingSlides }} {{ monthsWord }}
      </button>
    </div>

    <!-- Галерея -->
    <GalleryDialog v-model="isGalleryOpen" :slide="selectedSlide" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import constrImg1 from '@/assets/img/hod-stroitelstva/hod1.jfif';
import constrImg2 from '@/assets/img/hod-stroitelstva/hod2.jfif';
import constrImg3 from '@/assets/img/hod-stroitelstva/hod3.jfif';
import constrImg4 from '@/assets/img/hod-stroitelstva/hod4.jpg';
import constrImg5 from '@/assets/img/hod-stroitelstva/hod5.jpg';
import TitleNew from './Common/TitleNew.vue';
import GalleryDialog from './Common/Dialogs/GalleryDialog.vue';
import testImg from '@/assets/img/live-in-style-item-1.png';
import galleryTestImg from '@/assets/img/gallery-test-img.png';

const isGalleryOpen = ref(false);
const selectedSlide = ref(null);
const isMobile = ref(false);
const visibleCount = ref(6); // Начальное количество видимых слайдов

const constructionSlides = [
  {
    title: 'Октябрь',
    year: '2025',
    image: constrImg1,
    gallery: [
      { src: galleryTestImg, alt: 'Сентябрь 1' },
      { src: testImg, alt: 'Сентябрь 2' },
      { src: galleryTestImg, alt: 'Сентябрь 3' },
      { src: testImg, alt: 'Сентябрь 4' },
    ],
  },
  {
    title: 'Сентябрь',
    year: '2025',
    image: constrImg2,
    gallery: [
      { src: galleryTestImg, alt: 'Сентябрь 1' },
      { src: testImg, alt: 'Сентябрь 2' },
      { src: galleryTestImg, alt: 'Сентябрь 3' },
      { src: testImg, alt: 'Сентябрь 4' },
    ],
  },
  {
    title: 'Август',
    year: '2025',
    image: constrImg3,
    gallery: [
      { src: galleryTestImg, alt: 'Сентябрь 1' },
      { src: testImg, alt: 'Сентябрь 2' },
      { src: galleryTestImg, alt: 'Сентябрь 3' },
      { src: testImg, alt: 'Сентябрь 4' },
    ],
  },
  {
    title: 'Июль',
    year: '2025',
    image: constrImg4,
    gallery: [
      { src: galleryTestImg, alt: 'Сентябрь 1' },
      { src: testImg, alt: 'Сентябрь 2' },
      { src: galleryTestImg, alt: 'Сентябрь 3' },
      { src: testImg, alt: 'Сентябрь 4' },
    ],
  },
  {
    title: 'Июнь',
    year: '2025',
    image: constrImg5,
    gallery: [
      { src: galleryTestImg, alt: 'Сентябрь 1' },
      { src: testImg, alt: 'Сентябрь 2' },
      { src: galleryTestImg, alt: 'Сентябрь 3' },
      { src: testImg, alt: 'Сентябрь 4' },
    ],
  },
];

// Максимум 10 слайдов
const limitedSlides = computed(() => constructionSlides.slice(0, 10));

// Видимые слайды
const visibleSlides = computed(() => limitedSlides.value.slice(0, visibleCount.value));

// Есть ли еще слайды
const hasMoreSlides = computed(() => visibleCount.value < limitedSlides.value.length);

// Количество оставшихся слайдов
const remainingSlides = computed(() => limitedSlides.value.length - visibleCount.value);

// Склонение слова "месяц"
const monthsWord = computed(() => {
  const count = remainingSlides.value;
  if (count === 1) return 'месяц';
  if (count >= 2 && count <= 4) return 'месяца';
  return 'месяцев';
});

const showMoreSlides = () => {
  visibleCount.value = Math.min(visibleCount.value + 4, limitedSlides.value.length);
};

const openGallery = slide => {
  selectedSlide.value = slide;
  isGalleryOpen.value = true;
};

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 599;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
  });
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.construction-section {
  &__container {
    padding-bottom: 120px;

    @media (max-width: $breakpoint-x) {
      padding-bottom: 60px;
    }
  }
  &__title {
    margin: 0 auto;
    margin-bottom: 60px;
    font-size: 88px;

    @media (max-width: $breakpoint-x) {
      margin-bottom: 20px;
    }
  }
}

// Мобильная версия - грид
.construction-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 8px;
  margin-bottom: 30px;
}

// Кнопка "Показать еще"
.show-more-btn {
  border-radius: 50px;
  background-color: transparent;
  border: 1px solid $utility-color-1;
  padding: 12px 20px;
  font-family: 'Akrobat';
  font-weight: 700;
  color: $text-color-primary;
  font-size: 14px;
  text-transform: uppercase;
  line-height: 140%;
  width: 100%;
  margin: 0 auto;
  display: block;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: $text-color-primary;
    border-color: $text-color-primary;
    color: $text-color-white;
  }
}

.custom-slide {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  color: $text-color-primary;

  @media (max-width: $breakpoint-x) {
    margin-top: 12px;
    align-items: flex-end;
    gap: 5px;
    justify-content: flex-start;
  }

  &--title {
    font-size: 28px;

    @media (max-width: $breakpoint-lg) {
      font-size: 24px;
    }

    @media (max-width: $breakpoint-md) {
      font-size: 20px;
      line-height: 85%;
    }

    @media (max-width: $breakpoint-sm) {
      font-size: 18px;
    }
  }

  &--year {
    font-size: 16px;

    @media (max-width: $breakpoint-md) {
      font-size: 14px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 12px;
    }
  }
}

.image-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

</style>

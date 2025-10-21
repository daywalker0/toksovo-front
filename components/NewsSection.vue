<template>
  <section class="news-section section" id="news">
    <div class="news-section__container container">
      <!-- <TitleNew text="Новости" class="news-section__title" /> -->
      <DefaultSlider
        :slides="newsSlides"
        :slides-per-view="2"
        :space-between="45"
        :show-navigation="true"
        :hide-navigation-on-mobile="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]" @click="handleNewsClick(slide.id)">
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
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNewsStore } from '~/stores/news';
import TitleNew from './Common/TitleNew.vue';
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';

const router = useRouter();
const newsStore = useNewsStore();

const handleNewsClick = newsId => {
  router.push(`/news/${newsId}`);
};

// Получаем новости из store
const newsSlides = computed(() => {
  const news = newsStore.getLatestNews(4);
  // Убеждаемся, что возвращается массив
  return Array.isArray(news) ? news : [];
});

// Загружаем новости при монтировании компонента
onMounted(async () => {
  if (!newsStore.isNewsLoaded) {
    await newsStore.fetchNews();
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

::v-deep(.swiper-slide) {
  height: 300px !important;
}

::v-deep(.slide) {
  min-height: 0 !important;
}

.news-section {
  &__container {
    padding-bottom: 120px;

    @media (max-width: $breakpoint-x) {
      padding-bottom: 60px;
    }
  }
  &__title {
    margin: 0 auto;
    margin-bottom: 40px;
    font-size: 88px;

    @media (max-width: $breakpoint-x) {
      margin-bottom: 20px;
    }
  }

  @media (max-width: $breakpoint-x) {
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
    align-items: flex-end;
    justify-content: space-between;
    font-weight: 400;
    line-height: 100%;
    font-size: 16px;
    font-family: 'Bona Nova SC';
    margin-top: 40px;

    @media (max-width: $breakpoint-x) {
      font-size: 14px;
    }

    span {
      @media (max-width: $breakpoint-x) {
        font-size: 36px;
      }
    }
  }
  &--text {
    font-size: 22px;
    font-weight: 500;
    line-height: 140%;
    max-height: 11.625rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    line-clamp: 6;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;

    @media (max-width: $breakpoint-x) {
      font-size: 18px;
    }
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
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  @media (max-width: $breakpoint-x) {
    min-height: 200px;
    width: 100%;
  }
}

</style>

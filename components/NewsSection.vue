<template>
  <section class="news-section section" id="news">
    <div class="news-section__container container">
      <TitleNew :text="title || 'Новости'" class="news-section__title" />
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

const props = defineProps({
  data: Object
})

const title = computed(() => props.data?.title)

const router = useRouter();
const newsStore = useNewsStore();

const handleNewsClick = documentId => {
  router.push(`/news/${documentId}`);
};

// Получаем новости: сначала проверяем, есть ли они в props.data (из Strapi блока),
// если нет - загружаем из store
const newsSlides = computed(() => {
  // Если в блоке есть связанные новости - используем их
  if (props.data?.novostis && Array.isArray(props.data.novostis) && props.data.novostis.length > 0) {
    return props.data.novostis.map(news => ({
      ...news, // Сначала копируем все поля
      numericId: news.id,
      id: news.documentId, // Перезаписываем id на documentId
      documentId: news.documentId,
      text: news.title || news.text,
      number: news.day || new Date(news.createdAt).getDate().toString(),
      month: news.month || new Date(news.createdAt).toLocaleDateString('ru-RU', { month: 'long' }),
      year: news.year || new Date(news.createdAt).getFullYear().toString(),
    }));
  }
  
  // Иначе используем новости из store
  const news = newsStore.getLatestNews(4);
  return Array.isArray(news) ? news : [];
});

// Загружаем новости при монтировании компонента только если их нет в блоке
onMounted(async () => {
  // Если новостей нет в блоке - загружаем из API
  const hasNewsInBlock = props.data?.novostis && Array.isArray(props.data.novostis) && props.data.novostis.length > 0;
  
  if (!hasNewsInBlock && !newsStore.isNewsLoaded) {
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
    padding-bottom: 60px;
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

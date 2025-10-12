<template>
  <div class="news-page">
    <AppHeader />
    <div class="container">
      <!-- Контент новости -->
      <article v-if="newsItem" class="news-article">
        <div class="news-article__header">
          <button @click="$router.back()" class="back-button">
            <div class="back-button__icon">
              <svg
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.50637 0.450573L6.125 1.0692L1.50412 5.69007C1.42187 5.7732 1.37637 5.88257 1.37637 5.99982C1.37637 6.11707 1.42187 6.22645 1.50412 6.30957L6.125 10.9304L5.50637 11.5491L0.885499 6.9282C0.637874 6.68057 0.501375 6.3507 0.501375 5.99982C0.501375 5.64895 0.637874 5.31995 0.885499 5.07145L5.50637 0.450573Z"
                  fill="#2C322C"
                />
              </svg>
            </div>
            <div class="back-button__text">
              <span>На главную</span>
            </div>
          </button>
        </div>

        <div class="news-article__content">
          <h2 class="news-article__title">{{ newsItem.title || newsItem.text }}</h2>

          <div class="news-article__meta">
            <div class="news-article__date">
              <span class="date-number">{{ newsItem.number }}</span>
              <span class="date-month">{{ newsItem.month }}</span>
              <span class="date-year">{{ newsItem.year }}</span>
            </div>
          </div>

          <div class="news-article__text">
            <p v-for="(paragraph, index) in newsItem.fullText" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </article>

      <!-- Загрузка -->
      <div v-else-if="loading" class="news-page__loading">
        <p>Загрузка новости...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="news-page__error">
        <p>{{ error }}</p>
        <button @click="$router.push('/')" class="home-button">Вернуться на главную</button>
      </div>

      <!-- Новость не найдена -->
      <div v-else class="news-page__error">
        <p>Новость не найдена</p>
        <button @click="$router.push('/')" class="home-button">Вернуться на главную</button>
      </div>
    </div>

    <!-- Другие новости -->
    <section v-if="newsItem" class="other-news-section">
      <div class="other-news-section__container container">
        <TitleNew text="Другие новости" class="other-news-section__title" />
        <DefaultSlider
          :slides="otherNews"
          :slides-per-view="2"
          :space-between="45"
          :show-navigation="true"
          :show-pagination="true"
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

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNewsStore } from '~/stores/news';
import TitleNew from '~/components/Common/TitleNew.vue';
import DefaultSlider from '~/components/Common/Sliders/DefaultSlider.vue';
import AppHeader from '~/components/Common/AppHeader.vue';
import Footer from '~/components/Footer.vue';

const route = useRoute();
const router = useRouter();
const newsStore = useNewsStore();

// Получаем данные из store
const newsItem = computed(() => newsStore.currentNews);
const loading = computed(() => newsStore.loading);
const error = computed(() => newsStore.error);

// Получаем другие новости (исключая текущую)
const otherNews = computed(() => {
  const currentId = newsItem.value?.id;
  return newsStore.getLatestNews(6).filter(news => news.id !== currentId);
});

// Обработчик клика на новость
const handleNewsClick = newsId => {
  router.push(`/news/${newsId}`);
};

// SEO мета-теги
useHead(() => {
  const newsItem = newsStore.currentNews;
  return {
    title: newsItem ? `${newsItem.title} - Новости` : 'Новости',
    meta: [
      {
        name: 'description',
        content: newsItem ? newsItem.text : 'Читайте последние новости',
      },
      {
        property: 'og:title',
        content: newsItem ? newsItem.title : 'Новости',
      },
      {
        property: 'og:description',
        content: newsItem ? newsItem.text : 'Читайте последние новости',
      },
      {
        property: 'og:type',
        content: 'article',
      },
    ],
  };
});

onMounted(async () => {
  const newsId = route.params.id;
  await newsStore.fetchNewsById(newsId);
});
</script>

<style lang="scss" scoped>
.news-page {
  min-height: 100vh;
  background: $bg-color-1;
  display: flex;
  flex-direction: column;
  padding-top: 0; /* Убираем отступ сверху, так как есть хедер */
}

.container {
  padding-top: 40px; /* Отступ сверху для контента */
  flex: 1; /* Занимает все доступное пространство */
  display: flex;
  flex-direction: column;
}

.news-page__header {
  margin-bottom: 40px;
}

.back-button {
  background: none;
  border: none;
  color: $text-color-primary;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Akrobat';
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 20px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;

  &__icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid $utility-color-1;
    margin-right: 8px;
  }

  &:hover {
    color: darken($text-color-primary, 20%);
  }
}

.news-article {
  max-width: 800px;
  margin: 95px auto 150px auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-article__meta {
  margin-bottom: 44px;
}

.news-article__date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Bona Nova SC';
  font-size: 16px;
  color: $text-color-primary;

  .date-number {
    font-size: 46px;
    line-height: 80%;
    font-weight: 400;
  }

  .date-month {
    font-size: 16px;
    font-weight: 400;
  }

  .date-year {
    font-size: 16px;
    font-weight: 400;
  }
}

.news-article__content {
  display: flex;
  flex-direction: column;
  flex: 1; /* Занимает все доступное пространство */

  .news-article__title {
    font-size: 48px;
    font-weight: 400;
    color: $text-color-primary;
    margin: 0 0 44px 0;
    line-height: 1;
    font-family: 'Bona Nova SC';
  }

  .news-article__text {
    font-size: 24px;
    font-weight: 500;
    line-height: 140%;
    color: $text-color-primary;
    font-family: 'Akrobat';
    flex: 1; /* Занимает оставшееся пространство */

    p {
      margin: 0 0 20px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.news-page__loading,
.news-page__error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: $text-color-primary;
}

.home-button {
  background: $accent-color-orange;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background: darken($accent-color-orange, 10%);
  }
}

/* Блок "Другие новости" */
.other-news-section {
  padding: 0 0 60px 0;

  &__title {
    margin: 0 auto;
    margin-bottom: 60px;
    font-size: 88px;
  }
}

/* Стили для слайдов новостей (копируем из NewsSection) */
::v-deep(.swiper-slide) {
  height: 300px !important;
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
    line-clamp: 6;
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
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .news-page {
    padding: 0; /* Убираем отступы, так как используем flex */
  }

  .container {
    padding-top: 20px; /* Уменьшаем отступ на мобильных */
  }

  .news-article {
    padding: 20px;
    margin: 0 20px 100px 20px; /* Уменьшенный отступ снизу на мобильных */
  }

  .news-article__content .news-article__title {
    font-size: 24px;
  }

  .news-article__content .news-article__text {
    font-size: 16px;
  }

  .other-news-section {
    padding: 40px 0 40px 0; /* Уменьшенный отступ на мобильных */

    &__title {
      font-size: 48px;
      margin-bottom: 40px;
    }
  }
}
</style>

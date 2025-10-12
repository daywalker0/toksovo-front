<template>
  <div class="news-page">
    <div class="container">
      <!-- Заголовок страницы -->
      <div class="news-page__header">
        <button @click="$router.back()" class="back-button">← Назад к новостям</button>
        <h1 class="news-page__title">Новости</h1>
      </div>

      <!-- Контент новости -->
      <article v-if="newsItem" class="news-article">
        <div class="news-article__meta">
          <div class="news-article__date">
            <span class="date-number">{{ newsItem.number }}</span>
            <span class="date-month">{{ newsItem.month }}</span>
            <span class="date-year">{{ newsItem.year }}</span>
          </div>
        </div>

        <div class="news-article__content">
          <h2 class="news-article__title">{{ newsItem.title || newsItem.text }}</h2>
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
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNewsStore } from '~/stores/news';

const route = useRoute();
const newsStore = useNewsStore();

// Получаем данные из store
const newsItem = computed(() => newsStore.currentNews);
const loading = computed(() => newsStore.loading);
const error = computed(() => newsStore.error);

onMounted(async () => {
  const newsId = route.params.id;
  await newsStore.fetchNewsById(newsId);
});
</script>

<style lang="scss" scoped>
.news-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 0;
}

.news-page__header {
  margin-bottom: 40px;
}

.back-button {
  background: none;
  border: none;
  color: $accent-color-orange;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  transition: color 0.3s ease;

  &:hover {
    color: color.adjust($accent-color-orange, $lightness: -10%);
  }
}

.news-page__title {
  font-size: 48px;
  font-weight: 900;
  color: $text-color-primary;
  margin: 0;
  font-family: 'Akrobat';
}

.news-article {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.news-article__meta {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
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
  .news-article__title {
    font-size: 32px;
    font-weight: 700;
    color: $text-color-primary;
    margin: 0 0 30px 0;
    line-height: 1.3;
    font-family: 'Akrobat';
  }

  .news-article__text {
    font-size: 18px;
    line-height: 1.6;
    color: $text-color-primary;

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
    background: color.adjust($accent-color-orange, $lightness: -10%);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .news-page {
    padding: 20px 0;
  }

  .news-article {
    padding: 20px;
    margin: 0 20px;
  }

  .news-page__title {
    font-size: 32px;
  }

  .news-article__content .news-article__title {
    font-size: 24px;
  }

  .news-article__content .news-article__text {
    font-size: 16px;
  }
}
</style>

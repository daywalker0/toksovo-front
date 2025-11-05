import { defineStore } from 'pinia';
import { useNewsApi } from '~/composables/useNewsApi';

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [],
    currentNews: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Получить все новости
    getAllNews: state => state.news,

    // Получить новость по documentId (Strapi использует documentId)
    getNewsById: state => (documentId) => {
      return state.news.find(news => news.documentId === documentId || news.id === documentId);
    },

    // Получить последние новости (для слайдера)
    getLatestNews:
      state =>
      (limit = 4) => {
        // Функция для получения месяца в родительном падеже
        const getMonthGenitive = (date) => {
          const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
          ];
          return months[date.getMonth()];
        };

        // Преобразуем данные в нужный формат для слайдера
        const result = state.news.slice(0, limit).map(news => {
          // Используем date если есть, иначе createdAt
          const dateToUse = news.date ? new Date(news.date) : new Date(news.createdAt);
          
          // ВАЖНО: id должен быть documentId для навигации!
          return {
            ...news, // Сначала копируем все поля
            numericId: news.id, // Сохраняем числовой id отдельно
            id: news.documentId, // Перезаписываем id на documentId (для навигации)
            documentId: news.documentId, // Явно сохраняем documentId
            text: news.title || news.text || news.description,
            description: news.description,
            number: dateToUse.getDate().toString(),
            month: getMonthGenitive(dateToUse),
            year: dateToUse.getFullYear().toString(),
          };
        });
        
        return result;
      },

    // Проверить, загружены ли новости
    isNewsLoaded: state => state.news.length > 0,
  },

  actions: {
    // Загрузить все новости
    async fetchNews() {
      this.loading = true;
      this.error = null;

      try {
        // Пытаемся загрузить из API
        const newsApi = useNewsApi();
        const apiNews = await newsApi.fetchAllNews();

        // Проверяем, что API вернул массив
        if (Array.isArray(apiNews) && apiNews.length > 0) {
          this.news = apiNews;
        } else {
          throw new Error('API вернул пустой массив');
        }
      } catch (apiError) {
        this.news = [];
      } finally {
        this.loading = false;
      }
    },

    // Загрузить конкретную новость по documentId
    async fetchNewsById(documentId) {
      this.loading = true;
      this.error = null;

      try {
        // Сначала проверяем, есть ли новость уже в store
        const existingNews = this.getNewsById(documentId);
        if (existingNews) {
          this.currentNews = existingNews;
          this.loading = false;
          return existingNews;
        }

        // Пытаемся загрузить конкретную новость из API
        try {
          const newsApi = useNewsApi();
          const apiNews = await newsApi.fetchNewsById(documentId);

          // Проверяем, что API вернул объект
          if (apiNews && typeof apiNews === 'object') {
            this.currentNews = apiNews;

            // Добавляем в общий список, если его там нет
            const existingInList = this.news.find(news => news.documentId === documentId);
            if (!existingInList) {
              this.news.push(apiNews);
            }

            return apiNews;
          } else {
            throw new Error('API вернул неверный формат данных');
          }
        } catch (apiError) {
          // Пробуем загрузить все новости, если их еще нет
          if (!this.isNewsLoaded) {
            await this.fetchNews();
          }

          const news = this.getNewsById(documentId);
          if (news) {
            this.currentNews = news;
            return news;
          } else {
            throw new Error('Новость не найдена');
          }
        }
      } catch (error) {
        this.error = error.message || 'Ошибка загрузки новости';
        return null;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentNews() {
      this.currentNews = null;
    },

    // Очистить ошибки
    clearError() {
      this.error = null;
    },

    // Обновить новости (для будущей интеграции с админкой)
    updateNews(newsData) {
      this.news = newsData;
    },

    // Добавить новую новость
    addNews(newsItem) {
      this.news.unshift(newsItem);
    },

    // Обновить существующую новость
    updateNewsItem(id, updatedData) {
      const index = this.news.findIndex(news => news.id === id);
      if (index !== -1) {
        this.news[index] = { ...this.news[index], ...updatedData };
      }
    },

    // Удалить новость
    removeNews(id) {
      this.news = this.news.filter(news => news.id !== id);
    },

    // Синхронизация с админкой
    async syncWithAdmin() {
      try {
        const newsApi = useNewsApi();
        const apiNews = await newsApi.fetchAllNews();
        this.news = apiNews;
        return true;
      } catch (error) {
        return false;
      }
    },

    async updateNewsViaApi(id, newsData) {
      try {
        const newsApi = useNewsApi();
        const updatedNews = await newsApi.updateNews(id, newsData);
        this.updateNewsItem(id, updatedNews);
        return updatedNews;
      } catch (error) {
        throw error;
      }
    },

    async createNewsViaApi(newsData) {
      try {
        const newsApi = useNewsApi();
        const newNews = await newsApi.createNews(newsData);
        this.addNews(newNews);
        return newNews;
      } catch (error) {
        throw error;
      }
    },

    async deleteNewsViaApi(id) {
      try {
        const newsApi = useNewsApi();
        await newsApi.deleteNews(id);
        this.removeNews(id);
        return true;
      } catch (error) {
        throw error;
      }
    },
  },
});

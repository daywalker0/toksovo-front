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

    // Получить новость по ID
    getNewsById: state => id => {
      return state.news.find(news => news.id === id);
    },

    // Получить последние новости (для слайдера)
    getLatestNews:
      state =>
      (limit = 4) => {
        return state.news.slice(0, limit);
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
        this.news = apiNews;
      } catch (apiError) {
        console.warn('API недоступен, используем моковые данные:', apiError);

        // Fallback на моковые данные
        const mockNews = [
          {
            id: '1',
            title:
              'ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности',
            text: 'ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности',
            fullText: [
              'ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности. Данная политика направлена на обеспечение соблюдения принципов равенства и справедливости во всех аспектах деятельности компании.',
              'Политика включает в себя комплекс мер по предотвращению дискриминации по любым признакам, включая пол, возраст, национальность, религиозные убеждения и другие характеристики. Компания обязуется создавать равные возможности для всех сотрудников и партнеров.',
              'В рамках противодействия коррупции ООО СЗ «Меридиан» внедряет строгие процедуры контроля и отчетности, обеспечивает прозрачность принятия решений и регулярно проводит обучение персонала по вопросам этики и антикоррупционного законодательства.',
              'Данные меры являются частью общей стратегии компании по построению честного и прозрачного бизнеса, соответствующего высоким стандартам корпоративной этики.',
            ],
            year: '2024',
            number: '17',
            month: 'сентября',
            createdAt: '2024-09-17T10:00:00Z',
            updatedAt: '2024-09-17T10:00:00Z',
          },
          {
            id: '2',
            title: 'Короткая новость',
            text: 'Короткая новость',
            fullText: [
              'Это пример короткой новости с полным текстом. Здесь может быть размещена дополнительная информация о событии, его детали и последствия.',
              'Короткие новости часто содержат важную информацию, которая требует более подробного освещения для полного понимания ситуации.',
            ],
            year: '2024',
            number: '17',
            month: 'сентября',
            createdAt: '2024-09-17T11:00:00Z',
            updatedAt: '2024-09-17T11:00:00Z',
          },
          {
            id: '3',
            title:
              'ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности',
            text: 'ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности',
            fullText: [
              'ООО СЗ «Меридиан» утвердило политику по недопущению дискриминации и по противодействию коррупции в своей деятельности. Данная политика является важным шагом в развитии корпоративной культуры компании.',
              'Политика включает в себя комплекс мер по предотвращению дискриминации по любым признакам, включая пол, возраст, национальность, религиозные убеждения и другие характеристики. Компания обязуется создавать равные возможности для всех сотрудников и партнеров.',
              'В рамках противодействия коррупции ООО СЗ «Меридиан» внедряет строгие процедуры контроля и отчетности, обеспечивает прозрачность принятия решений и регулярно проводит обучение персонала по вопросам этики и антикоррупционного законодательства.',
              'Данные меры являются частью общей стратегии компании по построению честного и прозрачного бизнеса, соответствующего высоким стандартам корпоративной этики.',
              'Компания также планирует регулярно пересматривать и обновлять данную политику в соответствии с изменениями в законодательстве и лучшими практиками в области корпоративного управления.',
            ],
            year: '2024',
            number: '17',
            month: 'сентября',
            createdAt: '2024-09-17T12:00:00Z',
            updatedAt: '2024-09-17T12:00:00Z',
          },
          {
            id: '4',
            title: 'Короткая новость',
            text: 'Короткая новость',
            fullText: [
              'Это еще один пример короткой новости с полным текстом. Здесь может быть размещена дополнительная информация о событии, его детали и последствия.',
              'Короткие новости часто содержат важную информацию, которая требует более подробного освещения для полного понимания ситуации.',
              'В данном случае мы демонстрируем, как может выглядеть полная версия новости с расширенным содержанием.',
            ],
            year: '2024',
            number: '17',
            month: 'сентября',
            createdAt: '2024-09-17T13:00:00Z',
            updatedAt: '2024-09-17T13:00:00Z',
          },
        ];

        // Имитируем задержку API
        await new Promise(resolve => setTimeout(resolve, 500));

        this.news = mockNews;
      } finally {
        this.loading = false;
      }
    },

    // Загрузить конкретную новость по ID
    async fetchNewsById(id) {
      this.loading = true;
      this.error = null;

      try {
        // Сначала проверяем, есть ли новость уже в store
        const existingNews = this.getNewsById(id);
        if (existingNews) {
          this.currentNews = existingNews;
          this.loading = false;
          return existingNews;
        }

        // Пытаемся загрузить конкретную новость из API
        try {
          const newsApi = useNewsApi();
          const apiNews = await newsApi.fetchNewsById(id);
          this.currentNews = apiNews;

          // Добавляем в общий список, если его там нет
          const existingInList = this.news.find(news => news.id === id);
          if (!existingInList) {
            this.news.push(apiNews);
          }

          return apiNews;
        } catch (apiError) {
          console.warn('API недоступен, загружаем все новости:', apiError);

          // Fallback: загружаем все новости
          if (!this.isNewsLoaded) {
            await this.fetchNews();
          }

          // Ищем новость после загрузки
          const news = this.getNewsById(id);
          if (news) {
            this.currentNews = news;
            return news;
          } else {
            throw new Error('Новость не найдена');
          }
        }
      } catch (error) {
        this.error = error.message || 'Ошибка загрузки новости';
        console.error('Ошибка загрузки новости:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Очистить текущую новость
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
        console.error('Ошибка синхронизации с админкой:', error);
        return false;
      }
    },

    // Обновить новость через API (для админки)
    async updateNewsViaApi(id, newsData) {
      try {
        const newsApi = useNewsApi();
        const updatedNews = await newsApi.updateNews(id, newsData);
        this.updateNewsItem(id, updatedNews);
        return updatedNews;
      } catch (error) {
        console.error('Ошибка обновления новости через API:', error);
        throw error;
      }
    },

    // Создать новость через API (для админки)
    async createNewsViaApi(newsData) {
      try {
        const newsApi = useNewsApi();
        const newNews = await newsApi.createNews(newsData);
        this.addNews(newNews);
        return newNews;
      } catch (error) {
        console.error('Ошибка создания новости через API:', error);
        throw error;
      }
    },

    // Удалить новость через API (для админки)
    async deleteNewsViaApi(id) {
      try {
        const newsApi = useNewsApi();
        await newsApi.deleteNews(id);
        this.removeNews(id);
        return true;
      } catch (error) {
        console.error('Ошибка удаления новости через API:', error);
        throw error;
      }
    },
  },
});

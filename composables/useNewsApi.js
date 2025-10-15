// Composable для работы с API новостей
import { apiConfig, getApiUrl, getHeaders } from '~/config/api';

export const useNewsApi = () => {
  // Получить все новости
  const fetchAllNews = async () => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.news), {
        method: 'GET',
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      throw new Error('Не удалось загрузить новости');
    }
  };

  // Получить новость по ID
  const fetchNewsById = async id => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.newsById(id)), {
        method: 'GET',
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Ошибка загрузки новости:', error);
      throw new Error('Не удалось загрузить новость');
    }
  };

  // Получить последние новости
  const fetchLatestNews = async (limit = 4) => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.latestNews), {
        method: 'GET',
        headers: getHeaders(),
        query: { limit },
      });
      return response;
    } catch (error) {
      console.error('Ошибка загрузки последних новостей:', error);
      throw new Error('Не удалось загрузить последние новости');
    }
  };

  // Создать новую новость (для админки)
  const createNews = async newsData => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.news), {
        method: 'POST',
        headers: getHeaders(),
        body: newsData,
      });
      return response;
    } catch (error) {
      console.error('Ошибка создания новости:', error);
      throw new Error('Не удалось создать новость');
    }
  };

  // Обновить новость (для админки)
  const updateNews = async (id, newsData) => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.newsById(id)), {
        method: 'PUT',
        headers: getHeaders(),
        body: newsData,
      });
      return response;
    } catch (error) {
      console.error('Ошибка обновления новости:', error);
      throw new Error('Не удалось обновить новость');
    }
  };

  // Удалить новость (для админки)
  const deleteNews = async id => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.newsById(id)), {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Ошибка удаления новости:', error);
      throw new Error('Не удалось удалить новость');
    }
  };

  return {
    fetchAllNews,
    fetchNewsById,
    fetchLatestNews,
    createNews,
    updateNews,
    deleteNews,
  };
};

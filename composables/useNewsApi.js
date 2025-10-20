import { apiConfig, getApiUrl, getHeaders } from '~/config/api';

export const useNewsApi = () => {
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

  const fetchNewsById = async id => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.newsById(id)), {
        method: 'GET',
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
      throw new Error('Не удалось загрузить новость');
    }
  };

  const fetchLatestNews = async (limit = 4) => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.latestNews), {
        method: 'GET',
        headers: getHeaders(),
        query: { limit },
      });
      return response;
    } catch (error) {
      throw new Error('Не удалось загрузить последние новости');
    }
  };

  const createNews = async newsData => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.news), {
        method: 'POST',
        headers: getHeaders(),
        body: newsData,
      });
      return response;
    } catch (error) {
      throw new Error('Не удалось создать новость');
    }
  };

  const updateNews = async (id, newsData) => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.newsById(id)), {
        method: 'PUT',
        headers: getHeaders(),
        body: newsData,
      });
      return response;
    } catch (error) {
      throw new Error('Не удалось обновить новость');
    }
  };

  const deleteNews = async id => {
    try {
      const response = await $fetch(getApiUrl(apiConfig.endpoints.newsById(id)), {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response;
    } catch (error) {
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

// Конфигурация API для новостей
export const apiConfig = {
  // Базовый URL API
  baseURL: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api',

  // Эндпоинты для новостей
  endpoints: {
    news: '/news',
    newsById: id => `/news/${id}`,
    latestNews: '/news/latest',
  },

  // Настройки по умолчанию
  defaults: {
    newsLimit: 10,
    timeout: 10000, // 10 секунд
  },

  // Заголовки для запросов
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// Функция для получения полного URL
export const getApiUrl = endpoint => {
  return `${apiConfig.baseURL}${endpoint}`;
};

// Функция для получения заголовков с дополнительными параметрами
export const getHeaders = (additionalHeaders = {}) => {
  return {
    ...apiConfig.headers,
    ...additionalHeaders,
  };
};

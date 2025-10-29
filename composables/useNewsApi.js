export const useNewsApi = () => {
  const { get } = useApi()

  const fetchAllNews = async () => {
    try {
      const response = await get('/api/novostis?populate=*')
      // Strapi возвращает { data: [...], meta: {} }
      return response.data || []
    } catch (error) {
      console.error('❌ Ошибка загрузки новостей:', error)
      throw new Error('Не удалось загрузить новости')
    }
  }

  const fetchNewsById = async (documentId) => {
    try {
      const response = await get(`/api/novostis/${documentId}?populate=*`)
      // Strapi возвращает { data: {...}, meta: {} }
      return response.data || null
    } catch (error) {
      console.error('❌ Ошибка загрузки новости:', error)
      throw new Error('Не удалось загрузить новость')
    }
  }

  const fetchLatestNews = async (limit = 4) => {
    try {
      const response = await get(`/api/novostis?populate=*&pagination[limit]=${limit}&sort=createdAt:desc`)
      // Strapi возвращает { data: [...], meta: {} }
      return response.data || []
    } catch (error) {
      console.error('❌ Ошибка загрузки последних новостей:', error)
      throw new Error('Не удалось загрузить последние новости')
    }
  }

  return {
    fetchAllNews,
    fetchNewsById,
    fetchLatestNews,
  }
}

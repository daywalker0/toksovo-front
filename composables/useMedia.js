/**
 * Composable для работы с медиафайлами из Strapi
 * Автоматически добавляет baseURL к относительным путям
 */
export const useMedia = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl || ''

  /**
   * Получить полный URL для медиафайла
   * @param {string|object} media - Путь к файлу или объект медиа из Strapi
   * @returns {string} - Полный URL к файлу
   */
  const getMediaUrl = (media) => {
    if (!media) return ''

    // Если передан объект медиа из Strapi (новый формат)
    if (typeof media === 'object') {
      // Strapi v4 формат: { url: '...', formats: {...} }
      const url = media.url || media.path || ''
      return getFullUrl(url)
    }

    // Если передана строка
    return getFullUrl(media)
  }

  /**
   * Получить полный URL из строки пути
   * @param {string} path - Путь к файлу
   * @returns {string} - Полный URL
   */
  const getFullUrl = (path) => {
    if (!path) return ''

    // Если путь уже абсолютный (начинается с http:// или https://)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }

    // Если путь относительный, добавляем baseURL
    // Убираем лишние слеши
    const cleanBase = baseUrl.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    
    return `${cleanBase}${cleanPath}`
  }

  /**
   * Получить URL для конкретного формата изображения из Strapi
   * @param {object} media - Объект медиа из Strapi
   * @param {string} format - Формат изображения (thumbnail, small, medium, large)
   * @returns {string} - URL к изображению
   */
  const getImageFormat = (media, format = 'medium') => {
    if (!media || typeof media !== 'object') return getMediaUrl(media)

    // Если есть formats, берем нужный формат
    if (media.formats && media.formats[format]) {
      return getFullUrl(media.formats[format].url)
    }

    // Иначе возвращаем оригинал
    return getMediaUrl(media)
  }

  /**
   * Получить srcset для responsive изображений
   * @param {object} media - Объект медиа из Strapi
   * @returns {string} - srcset строка
   */
  const getSrcSet = (media) => {
    if (!media || typeof media !== 'object' || !media.formats) {
      return ''
    }

    const srcset = []
    const formats = media.formats

    // Добавляем все доступные форматы
    if (formats.thumbnail) {
      srcset.push(`${getFullUrl(formats.thumbnail.url)} ${formats.thumbnail.width}w`)
    }
    if (formats.small) {
      srcset.push(`${getFullUrl(formats.small.url)} ${formats.small.width}w`)
    }
    if (formats.medium) {
      srcset.push(`${getFullUrl(formats.medium.url)} ${formats.medium.width}w`)
    }
    if (formats.large) {
      srcset.push(`${getFullUrl(formats.large.url)} ${formats.large.width}w`)
    }

    // Добавляем оригинал
    if (media.url && media.width) {
      srcset.push(`${getFullUrl(media.url)} ${media.width}w`)
    }

    return srcset.join(', ')
  }

  return {
    getMediaUrl,
    getImageFormat,
    getSrcSet,
  }
}


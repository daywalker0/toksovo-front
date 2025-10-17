/**
 * Композабл для работы с Lenis smooth scroll
 * @returns {Object} API для управления скроллом
 */
export const useLenis = () => {
  const nuxtApp = useNuxtApp();
  const lenis = nuxtApp.$lenis;

  /**
   * Программный скролл к элементу или позиции
   * @param {string|number|HTMLElement} target - Селектор, позиция или элемент
   * @param {Object} options - Опции скролла
   * @param {number} options.offset - Смещение в пикселях
   * @param {number} options.duration - Длительность анимации
   * @param {Function} options.easing - Функция easing
   * @param {Function} options.onComplete - Callback при завершении
   */
  const scrollTo = (target, options = {}) => {
    if (lenis?.scrollTo) {
      lenis.scrollTo(target, options);
    }
  };

  /**
   * Остановка скролла (для модальных окон, меню и т.д.)
   */
  const stop = () => {
    if (lenis?.stop) {
      lenis.stop();
    }
  };

  /**
   * Возобновление скролла
   */
  const start = () => {
    if (lenis?.start) {
      lenis.start();
    }
  };

  /**
   * Получить инстанс Lenis для прямой работы
   * @returns {Lenis|null}
   */
  const getInstance = () => {
    return lenis?.getInstance?.() || lenis?.instance || null;
  };

  /**
   * Проверка, запущен ли скролл
   * @returns {boolean}
   */
  const isRunning = () => {
    const instance = getInstance();
    return instance ? !instance.isStopped : false;
  };

  /**
   * Получить текущую позицию скролла
   * @returns {number}
   */
  const getScroll = () => {
    const instance = getInstance();
    return instance?.scroll || window.scrollY || 0;
  };

  /**
   * Скролл к верху страницы
   * @param {Object} options - Опции скролла
   */
  const scrollToTop = (options = {}) => {
    scrollTo(0, {
      duration: 1.5,
      ...options,
    });
  };

  /**
   * Скролл к низу страницы
   * @param {Object} options - Опции скролла
   */
  const scrollToBottom = (options = {}) => {
    if (typeof document !== 'undefined') {
      scrollTo(document.body.scrollHeight, {
        duration: 1.5,
        ...options,
      });
    }
  };

  return {
    scrollTo,
    stop,
    start,
    getInstance,
    isRunning,
    getScroll,
    scrollToTop,
    scrollToBottom,
  };
};


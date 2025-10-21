import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default defineNuxtPlugin(() => {
  // Регистрируем ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;

  // Инициализируем Lenis только на клиенте
  if (process.client) {
    // Создаем инстанс Lenis
    lenis = new Lenis({
      duration: 1.5, // Длительность инерции для еще большей плавности
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing функция для плавности
      orientation: 'vertical', // Вертикальный скролл
      gestureOrientation: 'vertical', // Жесты
      smoothWheel: true, // Плавный скролл колесом мыши
      smoothTouch: false, // Оставляем нативный скролл на touch устройствах (для лучшей производительности)
      wheelMultiplier: 1, // Чувствительность колеса мыши
      touchMultiplier: 2, // Чувствительность touch
      infinite: false, // Отключаем бесконечный скролл
      autoResize: true, // Автоматическое обновление при изменении размера
      lerp: 0.08, // Увеличенная плавность интерполяции (меньше = плавнее)
      normalizeWheel: true, // Нормализация скорости колеса для плавности
    });

    // Интеграция с GSAP ScrollTrigger
    // Обновляем ScrollTrigger при каждом кадре Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Добавляем Lenis в ticker GSAP для синхронизации
    gsap.ticker.add(time => {
      lenis.raf(time * 1000); // Передаем время в миллисекундах
    });

    // Отключаем задержку GSAP ticker для максимальной плавности
    gsap.ticker.lagSmoothing(0);

    // Экспортируем метод для программного скролла
    const scrollTo = (target, options = {}) => {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      });
    };

    // Метод для остановки скролла (для модальных окон)
    const stop = () => {
      if (lenis) {
        lenis.stop();
      }
    };

    // Метод для возобновления скролла
    const start = () => {
      if (lenis) {
        lenis.start();
      }
    };

    // Метод для получения инстанса
    const getInstance = () => lenis;

    // Cleanup при размонтировании
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (lenis) {
          lenis.destroy();
        }
      });
    }

    // Предоставляем API через provide
    return {
      provide: {
        lenis: {
          instance: lenis,
          scrollTo,
          stop,
          start,
          getInstance,
        },
      },
    };
  }

  // Fallback для SSR (хотя у нас SSR отключен)
  return {
    provide: {
      lenis: {
        instance: null,
        scrollTo: () => {},
        stop: () => {},
        start: () => {},
        getInstance: () => null,
      },
    },
  };
});

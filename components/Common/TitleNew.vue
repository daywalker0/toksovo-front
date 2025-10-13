<template>
  <div class="title-new" ref="titleRef">
    <div class="title-lines">
      <div v-for="(line, lineIndex) in lines" :key="lineIndex" class="title-line">
        <span
          v-for="(char, charIndex) in line"
          :key="charIndex"
          class="title-char"
          :style="{ '--char-index': charIndex }"
        >
          {{ char === ' ' ? '\u00A0' : char }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  maxWidth: {
    type: Number,
    default: 600,
  },
});

const titleRef = ref(null);
const lines = ref([]);
let scrollTrigger = null;

const splitTextIntoLines = (text, maxWidth) => {
  if (!process.client || !titleRef.value) return [text];

  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  // Создаем временный элемент для измерения
  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.visibility = 'hidden';
  tempElement.style.whiteSpace = 'nowrap';
  tempElement.style.fontSize = '118px';
  tempElement.style.fontWeight = '400';
  tempElement.style.fontFamily = 'inherit';
  document.body.appendChild(tempElement);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    tempElement.textContent = testLine;
    const width = tempElement.offsetWidth;

    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = word;
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  document.body.removeChild(tempElement);
  return lines;
};

const updateLines = () => {
  if (props.text) {
    lines.value = splitTextIntoLines(props.text, props.maxWidth);
  }
};

const initAnimation = () => {
  if (!titleRef.value || process.server) return;

  gsap.registerPlugin(ScrollTrigger);

  // Убиваем предыдущую анимацию если есть
  if (scrollTrigger) {
    scrollTrigger.kill();
  }

  const chars = titleRef.value.querySelectorAll('.title-char');
  const lineElements = titleRef.value.querySelectorAll('.title-line');

  if (chars.length === 0) return;

  // Определяем смещение в зависимости от размера экрана
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const initialY = isSmallMobile ? 40 : isMobile ? 60 : 100;

  // Устанавливаем начальное состояние - все буквы скрыты и смещены вниз
  gsap.set(chars, {
    clipPath: 'inset(100% 0 0 0)',
    y: initialY,
    scale: 1,
    transformOrigin: 'center center',
  });

  // Создаем timeline для анимации
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: titleRef.value,
      start: 'top 80%', // Начинаем анимацию
      end: 'top 20%', // Заканчиваем анимацию
      scrub: 0.3, // Очень отзывчивая привязка к скроллу для пошагового эффекта
      markers: false,
      invalidateOnRefresh: true,
      refreshPriority: -1, // Приоритет обновления
      onUpdate: self => {
        // Дополнительная логика при обновлении скролла
        const progress = self.progress;
        // Можно добавить дополнительные эффекты на основе прогресса
      },
    },
  });

  // Сначала скрываем все строки
  tl.set(lineElements, {
    opacity: 0,
    y: 0,
  });

  // Анимация для каждой строки последовательно
  let previousLineEnd = 0;

  lines.value.forEach((line, lineIndex) => {
    const lineElement = lineElements[lineIndex];
    const lineChars = lineElement.querySelectorAll('.title-char');

    // Начало анимации текущей строки - после окончания предыдущей
    const lineStart = previousLineEnd;

    // Сначала показываем строку
    tl.to(
      lineElement,
      {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      },
      lineStart
    );

    // Анимируем каждую букву отдельно как ступеньку
    lineChars.forEach((char, charIndex) => {
      const charStart = lineStart + 0.1 + charIndex * 0.15; // Каждая буква через 0.15 секунды

      tl.to(
        char,
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          duration: 0.8, // Короткая анимация для каждой буквы
          ease: 'power2.out',
        },
        charStart
      );
    });

    // Обновляем время окончания текущей строки для следующей
    const lineDuration = 0.1 + lineChars.length * 0.15 + 0.8; // Время на все буквы + анимация последней
    previousLineEnd = lineStart + lineDuration + 0.2; // Небольшая пауза между строками
  });

  scrollTrigger = tl.scrollTrigger;
};

// Оптимизированный обработчик ресайза
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateLines();
    nextTick(() => {
      setTimeout(() => {
        initAnimation();
      }, 50);
    });
  }, 150);
};

onMounted(() => {
  nextTick(() => {
    updateLines();
    setTimeout(() => {
      initAnimation();
    }, 100);
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
  }
});

// Обновляем при изменении текста
watch(
  () => props.text,
  () => {
    updateLines();
    nextTick(() => {
      setTimeout(() => {
        initAnimation();
      }, 100);
    });
  }
);

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimeout);
  }

  if (scrollTrigger) {
    scrollTrigger.kill();
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.title-new {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  min-height: 200px; /* Увеличиваем высоту для анимации */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.title-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
}

.title-line {
  font-size: 118px;
  font-weight: 400;
  line-height: 0.8;
  color: $text-color-primary;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 8px 0; /* Увеличиваем отступы для анимации */
  position: relative;
  /* Изначально скрыты для анимации */
  opacity: 0;
  transform: translateY(0);
  /* Ограничиваем ширину строки чтобы скрыть буквы снизу */
  width: 100%;
  overflow: hidden;

  @media (max-width: $breakpoint-lg) {
    font-size: 88px;
  }
}

.title-char {
  display: inline-block;
  clip-path: inset(100% 0 0 0); /* Начальное состояние - обрезано снизу */
  transform: translateY(100px); /* Начальное смещение вниз */
  will-change: clip-path, transform;
  /* Убедимся что буквы не обрезаются */
  overflow: visible;
  position: relative;
  backface-visibility: hidden; /* Улучшает производительность */
  /* Оптимизация для скролла */
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .title-new {
    min-height: 200px;
    max-width: 90%;
  }

  .title-line {
    font-size: 72px;
    transform: translateY(0);
  }

  .title-char {
    clip-path: inset(100% 0 0 0); /* Начальное состояние - обрезано снизу */
    transform: translateY(60px); /* Меньшее смещение для мобильных */
  }
}
</style>

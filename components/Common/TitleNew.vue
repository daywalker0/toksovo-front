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

  // Устанавливаем начальное состояние - все буквы скрыты
  gsap.set(chars, {
    y: 100,
    opacity: 0,
    scale: 0.8,
    transformOrigin: 'center center',
  });

  // Создаем timeline для анимации
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: titleRef.value,
      start: 'top 85%',
      end: 'top 15%',
      scrub: 1.8, // Еще более плавная привязка к скроллу
      markers: false,
      invalidateOnRefresh: true,
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

    // Анимируем буквы в строке с более медленной последовательностью
    tl.to(
      lineChars,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.8, // Увеличиваем длительность еще больше
        stagger: {
          amount: 1.2, // Увеличиваем общее время stagger
          from: 'start',
        },
        ease: 'back.out(1.4)', // Более мягкий bounce
      },
      lineStart + 0.1 // Небольшая задержка после появления строки
    );

    // Обновляем время окончания текущей строки для следующей
    const lineDuration = 1.8 + 1.2; // Длительность анимации + stagger
    previousLineEnd = lineStart + lineDuration + 0.5; // Увеличиваем паузу между строками
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
  max-width: 600px;
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
}

.title-char {
  display: inline-block;
  transform: translateY(100px) scale(0.8); /* Начальное положение и масштаб */
  opacity: 0; /* Буквы изначально прозрачные */
  will-change: transform, opacity;
  /* Убедимся что буквы не обрезаются */
  overflow: visible;
  position: relative;
  backface-visibility: hidden; /* Улучшает производительность */
}

/* Адаптивность */
@media (max-width: 768px) {
  .title-new {
    min-height: 200px;
    max-width: 90%;
  }

  .title-line {
    font-size: 48px;
    transform: translateY(0);
  }

  .title-char {
    transform: translateY(60px) scale(0.8); /* Меньшее смещение для мобильных */
  }
}

@media (max-width: 480px) {
  .title-new {
    min-height: 150px;
  }

  .title-line {
    font-size: 32px;
    transform: translateY(0);
  }

  .title-char {
    transform: translateY(40px) scale(0.8);
  }
}

/* Для очень высоких заголовков */
@media (max-height: 600px) {
  .title-new {
    min-height: 250px;
  }
}
</style>

<template>
  <div class="title-new" ref="titleRef">
    <div class="title-lines">
      <div v-for="(line, index) in lines" :key="index" class="title-line">
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

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

const splitTextIntoLines = (text, maxWidth) => {
  if (!titleRef.value) return [text];

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

    if (tempElement.offsetWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      // Если текущая строка не пустая, сохраняем её
      if (currentLine) {
        lines.push(currentLine);

        // Проверяем, не является ли следующее слово слишком коротким для отдельной строки
        const isShortWord = word.length <= 2; // слова длиной 1-2 символа

        if (isShortWord && i < words.length - 1) {
          // Если слово короткое и есть следующее слово, объединяем их
          const nextWord = words[i + 1];
          const combinedWords = `${word} ${nextWord}`;
          tempElement.textContent = combinedWords;

          if (tempElement.offsetWidth <= maxWidth) {
            currentLine = combinedWords;
            i++; // Пропускаем следующее слово, так как мы его уже использовали
          } else {
            currentLine = word;
          }
        } else {
          currentLine = word;
        }
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

onMounted(() => {
  nextTick(() => {
    updateLines();
  });
});

// Обновляем при изменении текста
watch(
  () => props.text,
  () => {
    updateLines();
  }
);

// Обновляем при изменении размера окна
const handleResize = () => {
  updateLines();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.title-new {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.title-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.title-line {
  font-size: 118px;
  font-weight: 400;
  line-height: 1;
  color: $text-color-primary;
  white-space: nowrap;
}

/* Адаптивность */
@media (max-width: 768px) {
  .title-line {
    font-size: 48px;
  }
}

@media (max-width: 480px) {
  .title-line {
    font-size: 32px;
  }
}
</style>

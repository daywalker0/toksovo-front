<template>
  <div
    class="title-wrapper"
    :style="{ '--title-height': config.length * 90 + 'px' }"
    ref="titleWrapper"
  >
    <div class="title title-text" :style="{ '--lines-count': config.length }">
      <span
        v-for="(item, index) in config"
        :key="index"
        class="title__word"
        :style="{
          left: item.x + 'px',
          top: index * 90 + 'px',
        }"
      >
        {{ item.word }}
      </span>
    </div>
    <div class="title__spacer" :style="{ height: config.length * 90 + 'px' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const titleWrapper = ref(null);

const { config } = defineProps({
  config: {
    type: Array,
    default: () => [], // [{ word, x }]
  },
});

onMounted(async () => {
  await nextTick();

  if (!titleWrapper.value) {
    return;
  }

  // Получаем элементы через querySelector
  const titleWords = titleWrapper.value.querySelectorAll('.title__word');

  if (titleWords.length === 0) {
    return;
  }

  const screenWidth = process.client ? window.innerWidth || 1200 : 1200;

  // стартовое положение — за экраном
  gsap.set(titleWords, {
    x: i => {
      if (i === 0) return -screenWidth; // первая строка слева
      if (i === 1) return screenWidth; // вторая справа
      if (i === 2) return -screenWidth - 100; // третья опять слева
      return i % 2 === 0 ? -screenWidth : screenWidth;
    },
    opacity: 0,
  });

  // scroll-trigger
  ScrollTrigger.create({
    trigger: titleWrapper.value,
    start: 'top 80%', // Анимация начинается когда блок еще не полностью виден
    end: 'bottom 20%',
    onEnter: () => {
      gsap.to(titleWords, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.3, // Задержка между строками
        ease: 'power3.out',
      });
    },
    onLeave: () => {
      gsap.to(titleWords, {
        x: i => {
          if (i === 0) return -screenWidth; // первая строка уходит влево
          if (i === 1) return screenWidth; // вторая строка уходит вправо
          if (i === 2) return -screenWidth - 100; // третья строка уходит влево с отступом
          return i % 2 === 0 ? -screenWidth : screenWidth;
        },
        opacity: 0,
        duration: 0.8,
        stagger: 0.2, // Задержка между строками при исчезновении
        ease: 'power2.in',
      });
    },
    onEnterBack: () => {
      gsap.to(titleWords, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: -0.25, // Отрицательный stagger - обратный порядок (3-я, 2-я, 1-я)
        ease: 'power2.out',
      });
    },
    onLeaveBack: () => {
      gsap.to(titleWords, {
        x: i => {
          if (i === 0) return -screenWidth; // первая строка уходит влево
          if (i === 1) return screenWidth; // вторая строка уходит вправо
          if (i === 2) return -screenWidth - 100; // третья строка уходит влево с отступом
          return i % 2 === 0 ? -screenWidth : screenWidth;
        },
        opacity: 0,
        duration: 0.6,
        stagger: -0.15, // Отрицательный stagger - обратный порядок (3-я, 2-я, 1-я)
        ease: 'power2.in',
      });
    },
  });
});
</script>

<style lang="scss" scoped>
.title-wrapper {
  position: relative;
  width: 100%;
}

.title {
  position: absolute;
  width: 1200px;
  height: calc((var(--lines-count) - 1) * 90px + 90px);
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  overflow: visible;
  z-index: 10;

  &__word {
    position: absolute;
    white-space: nowrap;
    will-change: transform;
    pointer-events: none;
    transform-origin: center center;
  }

  &__spacer {
    height: 1px;
    opacity: 0;
  }
}
</style>

<template>
  <div class="fullpage-container" @wheel.prevent="onWheel">
    <section
      v-for="(section, index) in sections"
      :key="index"
      class="fullpage-section"
      :style="{ backgroundImage: `url(${section.img})` }"
    >
      <div class="slider-indicator">
        <span v-for="(s, i) in sections" :key="i" :class="{ active: currentIndex === i }"></span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import liveInStyleItem from '../assets/img/live-in-style-item.jpg';

const sections = [{ img: liveInStyleItem }, { img: liveInStyleItem }, { img: liveInStyleItem }];

const currentIndex = ref(0);
let isScrolling = false;

const scrollToSection = index => {
  if (index < 0 || index >= sections.length) return;
  isScrolling = true;
  currentIndex.value = index;
  const top = window.innerHeight * index;
  window.scrollTo({ top, behavior: 'smooth' });
  setTimeout(() => (isScrolling = false), 700);
};

const onWheel = e => {
  if (isScrolling) return;

  if (e.deltaY > 0 && currentIndex.value < sections.length - 1) {
    scrollToSection(currentIndex.value + 1);
  } else if (e.deltaY < 0 && currentIndex.value > 0) {
    scrollToSection(currentIndex.value - 1);
  }
};
</script>

<style lang="scss" scoped>
.fullpage-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.fullpage-section {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.slider-indicator {
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-indicator span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

.slider-indicator span.active {
  background: white;
  transform: scale(1.2);
}
</style>

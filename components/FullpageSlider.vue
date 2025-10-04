<template>
  <div ref="sliderWrapper" class="fullpage" @wheel="onWheel">
    <!-- Секции -->
    <div
      v-for="(section, index) in sections"
      :key="index"
      ref="sectionsRefs"
      class="section"
      :style="{ backgroundImage: `url(${section.img})` }"
    >
      <!-- Если нужно вывести контент внутри секции -->
      <slot name="section" :section="section" :index="index"></slot>
    </div>

    <!-- Превью навигация -->
    <div v-if="isInSlider" class="previews">
      <div
        v-for="(section, index) in sections"
        :key="index"
        class="thumb"
        :class="{ active: index === currentIndex }"
        @click="goToSection(index)"
      >
        <img :src="section.img" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// ✅ Пропсы
const props = defineProps({
  sections: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const sectionsRefs = ref([]);
const sliderWrapper = ref(null);
const currentIndex = ref(0);
const isInSlider = ref(false);
let isScrolling = false;

function onWheel(e) {
  if (isScrolling) return;

  if (e.deltaY > 0 && currentIndex.value < props.sections.length - 1) {
    e.preventDefault();
    currentIndex.value++;
    goToSection(currentIndex.value);
  } else if (e.deltaY < 0 && currentIndex.value > 0) {
    e.preventDefault();
    currentIndex.value--;
    goToSection(currentIndex.value);
  }
}

function goToSection(index) {
  isScrolling = true;
  currentIndex.value = index;
  sectionsRefs.value[index].scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    isScrolling = false;
  }, 800);
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        isInSlider.value = entry.isIntersecting;
      });
    },
    { threshold: 0.3 }
  );

  if (sliderWrapper.value) observer.observe(sliderWrapper.value);

  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<style lang="scss" scoped>
.fullpage {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.section {
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.previews {
  position: fixed;
  bottom: 44px;
  left: 44px;
  display: flex;
  flex-direction: column;
}

.thumb {
  position: relative;
  width: 66px;
  height: 88px;
  cursor: pointer;
  border-radius: 6px;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb.active::after {
  content: '';
  position: absolute;
  top: 10px;
  left: -10px;
  width: 86px;
  height: 68px;
  border: 2px solid white;
  border-radius: 6px;
}
</style>

<template>
  <div class="title-wrapper" :style="{ '--title-height': (config.length * 90) + 'px' }">
    <div class="title title-text" :style="{ '--lines-count': config.length }">
      <span
        v-for="(item, index) in config"
        :key="index"
        class="title__word"
        :style="{ left: item.x + 'px !important', top: index * 90 + 'px !important' }"
      >
        {{ item.word }}
      </span>
    </div>
    <!-- Невидимый элемент для создания отступа -->
    <div class="title__spacer" :style="{ height: (config.length * 90) + 'px' }"></div>
  </div>
</template>
  
<script setup>
const { config } = defineProps({
  config: {
    type: Array,
    default: () => [] // [{ line, x }] - y автоматически рассчитывается по индексу
  }
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
  padding-bottom: calc((var(--lines-count) - 1) * 90px + 90px);
  margin: 0;
  z-index: 999;
  overflow: visible;
  transform: translateZ(0);
  backface-visibility: hidden;
  isolation: isolate;
  left: 50%;
  top: 0;
  transform: translateX(-50%) translateZ(0);

  &__word {
    position: absolute !important;
    white-space: nowrap !important;
    transform: translateZ(0) !important;
    will-change: transform;
    backface-visibility: hidden;
    perspective: 1000px;
    transform-style: preserve-3d;
    pointer-events: none;
  }

  &__spacer {
    position: relative;
    width: 1px;
    pointer-events: none;
    opacity: 0;
  }

  @media (max-width: 1200px) {
    width: 1200px !important;
    left: 50% !important;
    top: 0 !important;
    transform: translateX(-50%) translateZ(0) !important;
  }

  @media (max-width: 768px) {
    width: 1200px !important;
    left: 50% !important;
    top: 0 !important;
    transform: translateX(-50%) translateZ(0) !important;
  }

  @media (max-width: 480px) {
    width: 1200px !important;
    left: 50% !important;
    top: 0 !important;
    transform: translateX(-50%) translateZ(0) !important;
  }
}
</style>
  
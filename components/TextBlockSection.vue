<template>
  <div class="text-block-section section">
    <div class="content">
      <TitleNew :text="text" />
      <p class="subtitle-text subtitle-text-section">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import TitleNew from './Common/TitleNew.vue';

const props = defineProps({
  subtitle: {
    type: String,
    required: false,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;
.text-block-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  padding-top: 120px;
  padding-bottom: 80px;
  max-width: 940px;
  position: relative;
  z-index: 2;

  @media (max-width: $breakpoint-sm) {
    padding-top: 40px;
    padding-bottom: 0px;
  }
}

.content {
  padding: 20px;
  width: 100%;
  position: relative;
}

.subtitle-text-section {
  max-width: 422px;
  text-align: start;
  margin: 60px auto 0;
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: none;

  @media (max-width: $breakpoint-sm) {
    margin: 40px auto 0;
  }

  @media (max-width: $breakpoint-x) {
    max-width: 100%;
    margin: 40px 0 0;
    text-align: start;
  }
}
</style>

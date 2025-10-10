<template>
  <div class="text-block-section section">
    <div class="content">
      <Title :config="config"/>
      <p class="subtitle-text subtitle-text-section">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import Title from './Common/Title.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
    default: '',
  },
  config: {
    type: Array,
    required: true, 
  }
});
</script>

<style scoped lang="scss">
.text-block-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  padding-top: 120px;
  max-width: 450px;
  padding-bottom: 80px;
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
}
</style>

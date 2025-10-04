<template>
  <div class="text-block-section section">
    <div class="content">
      <h2 class="title-text">{{ title }}</h2>
      <p class="subtitle-text subtitle-text-section">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
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
});
</script>

<style scoped lang="scss">
.text-block-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  text-align: center;
  background-size: cover;
  background-position: center;
  padding-top: 120px;
  padding-bottom: 80px;
}

.content {
  max-width: 800px;
  padding: 20px;
}

.subtitle-text-section {
  max-width: 422px;
  text-align: start;
  margin: 60px auto 0;
}
</style>

<template>
  <div>
    <section
      v-for="(section, index) in sections"
      :key="index"
      class="fullpage-section"
      :style="{ backgroundImage: `url(${section.img})` }"
    >
      <div class="section-content">
        <h1>Секция {{ index + 1 }}</h1>
      </div>
    </section>
  </div>
</template>

<script setup>
import liveInStyleItem from '../assets/img/live-in-style-item.jpg';

const sections = [{ img: liveInStyleItem }, { img: liveInStyleItem }, { img: liveInStyleItem }];
</script>

<style scoped lang="scss">
.fullpage-section {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start; /* для плавного прилипания, если контейнер будет snap */
}

body {
  margin: 0;
}

.section-content {
  color: white;
  font-size: 3rem;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
}
</style>

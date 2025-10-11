<template>
  <section class="environment-section" ref="sectionRef">
    <div class="environment-section__gallery" ref="galleryRef">
      <div v-for="(img, i) in slides" :key="i" class="gallery-item">
        <img :src="img" alt="" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imgSlide from '../assets/img/private-housing-section.jpg';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref(null);
const galleryRef = ref(null);
const slides = [imgSlide, imgSlide, imgSlide, imgSlide, imgSlide];

onMounted(async () => {
  await nextTick();

  const section = sectionRef.value;
  const gallery = galleryRef.value;
  const items = gallery.querySelectorAll('.gallery-item');
  const centerIndex = Math.floor(items.length / 2);
  const centerItem = items[centerIndex];
  const centerImg = centerItem.querySelector('img');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'center center',
      end: '+=2000',
      scrub: true,
      pin: true,
    },
  });

  // Уезжают соседи в стороны
  tl.to(
    items,
    {
      x: i => {
        if (i < centerIndex) return '-150%';
        if (i > centerIndex) return '150%';
        return '0%';
      },
      opacity: i => (i === centerIndex ? 1 : 0),
      ease: 'power2.inOut',
      duration: 1,
    },
    0
  );

  // Центральный блок просто растёт
  tl.to(
    centerItem,
    {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      ease: 'power2.inOut',
      duration: 1.2,
    },
    0.2
  );

  tl.to(
    centerImg,
    {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      ease: 'power2.inOut',
      duration: 1.2,
    },
    0.2
  );
});
</script>

<style scoped lang="scss">
.environment-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  padding: 0;
  margin: 0;

  &__gallery {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    height: 100%;
    width: 100%;
    position: relative;
  }
}

.gallery-item {
  flex: 0 0 auto;
  width: 200px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    display: block;
  }

  &:nth-child(3) {
    width: 400px;
    height: 600px;
    z-index: 2;
  }
}
</style>

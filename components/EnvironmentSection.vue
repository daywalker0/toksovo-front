<template>
  <section class="environment-section" ref="sectionRef" @mousemove="onMouseMove">
    <div class="environment-section__gallery" ref="galleryRef">
      <div v-for="(img, i) in slides" :key="i" class="gallery-item">
        <img :src="i === Math.floor(slides.length / 2) ? activeItem.image : img" alt="" />
      </div>
    </div>

    <div class="environment-content" ref="contentRef">
      <div class="controls-block">
        <div class="controls-block__wrap">
          <div class="accordion">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="accordion-item"
              :class="{ active: activeIndex === index }"
            >
              <div class="accordion-header" @click="toggleItem(index)">
                <div class="icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="#E6DFD8" stroke-width="3" />
                    <mask id="path-2-inside-1_306_1521" fill="white">
                      <path
                        d="M8 0C9.26248 1.5055e-08 10.507 0.298792 11.6319 0.871948C12.7568 1.4451 13.7301 2.27635 14.4721 3.29772C15.2142 4.31909 15.704 5.50158 15.9015 6.74852C16.099 7.99546 15.9986 9.27144 15.6085 10.4721L12.7629 9.54756C13.0071 8.79592 13.07 7.99716 12.9463 7.21658C12.8227 6.43599 12.5161 5.69575 12.0516 5.05637C11.587 4.41699 10.9778 3.89663 10.2736 3.53784C9.56941 3.17904 8.79031 2.992 8 2.992V0Z"
                      />
                    </mask>
                    <path
                      d="M8 0C9.26248 1.5055e-08 10.507 0.298792 11.6319 0.871948C12.7568 1.4451 13.7301 2.27635 14.4721 3.29772C15.2142 4.31909 15.704 5.50158 15.9015 6.74852C16.099 7.99546 15.9986 9.27144 15.6085 10.4721L12.7629 9.54756C13.0071 8.79592 13.07 7.99716 12.9463 7.21658C12.8227 6.43599 12.5161 5.69575 12.0516 5.05637C11.587 4.41699 10.9778 3.89663 10.2736 3.53784C9.56941 3.17904 8.79031 2.992 8 2.992V0Z"
                      stroke="#4C5E36"
                      stroke-width="6"
                      mask="url(#path-2-inside-1_306_1521)"
                    />
                  </svg>
                </div>
                <span>{{ item.title }}</span>
              </div>
              <div v-show="activeIndex === index" class="accordion-content">
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Две половины для клика по стрелкам -->
      <div class="image-control">
        <div
          class="image-half left"
          @click="goToPrevSlide"
          @mouseenter="hoverSide = 'left'"
          @mouseleave="hoverSide = null"
        />
        <div
          class="image-half right"
          @click="goToNextSlide"
          @mouseenter="hoverSide = 'right'"
          @mouseleave="hoverSide = null"
        />

        <!-- Фоновые картинки -->
        <div class="slides-wrapper" ref="slidesWrapper">
          <img
            v-for="(slide, idx) in slides"
            :key="idx"
            :src="slide"
            :class="['slide-bg', { active: idx === currentIndex }]"
            alt="bg"
          />
        </div>

        <div
          v-if="hoverSide"
          class="custom-cursor"
          :class="hoverSide"
          :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
        >
          <svg
            v-if="hoverSide === 'left'"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M15 5 L7 12 L15 19"
              fill="none"
              stroke="#4C5E36"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 5 L17 12 L9 19"
              fill="none"
              stroke="#4C5E36"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrivateHousingData } from '@/composables/usePrivateHousingData';
import imgSlide from '../assets/img/private-housing-section.jpg';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref(null);
const galleryRef = ref(null);
const contentRef = ref(null);
const slidesWrapper = ref(null);
const isContentVisible = ref(false);
const currentIndex = ref(0);
const isAnimating = ref(false);

// Используем композабл для данных
const {
  items,
  activeIndex,
  activeItem,
  cursorX,
  cursorY,
  hoverSide,
  toggleItem: originalToggleItem,
  onMouseMove: handleMouseMove,
} = usePrivateHousingData();

// Обёртка для toggleItem, чтобы синхронизировать с currentIndex
const toggleItem = index => {
  originalToggleItem(index);
  if (currentIndex.value !== index && !isAnimating.value) {
    const direction = index > currentIndex.value ? 'right' : 'left';
    animateSlide(index, direction);
  }
};

// Слайды
const slides = computed(() => {
  if (!items.value || !Array.isArray(items.value)) {
    return [imgSlide, imgSlide, imgSlide, imgSlide, imgSlide];
  }
  return items.value.map(item => item.image);
});

const onMouseMove = e => {
  const el = sectionRef.value;
  if (!el) return;
  handleMouseMove(e);
};

// Переход к следующему слайду
const goToNextSlide = () => {
  if (isAnimating.value) return;

  const nextIndex = (currentIndex.value + 1) % slides.value.length;
  animateSlide(nextIndex, 'right');

  // Синхронизируем аккордеон
  originalToggleItem(nextIndex);
};

// Переход к предыдущему слайду
const goToPrevSlide = () => {
  if (isAnimating.value) return;

  const prevIndex = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
  animateSlide(prevIndex, 'left');

  // Синхронизируем аккордеон
  originalToggleItem(prevIndex);
};

// Анимация смены слайда
const animateSlide = (newIndex, direction) => {
  if (!slidesWrapper.value) return;

  isAnimating.value = true;

  const allSlides = slidesWrapper.value.querySelectorAll('.slide-bg');
  const currentSlide = allSlides[currentIndex.value];
  const nextSlide = allSlides[newIndex];

  if (!currentSlide || !nextSlide) {
    isAnimating.value = false;
    return;
  }

  // Делаем следующий слайд видимым
  gsap.set(nextSlide, {
    opacity: 1,
    x: direction === 'right' ? '100%' : '-100%',
    zIndex: 2,
  });

  // Анимируем оба слайда одновременно с более плавным easing
  gsap.to(currentSlide, {
    x: direction === 'right' ? '-100%' : '100%',
    duration: 0.9,
    ease: 'power3.inOut',
  });

  gsap.to(nextSlide, {
    x: '0%',
    duration: 0.9,
    ease: 'power3.inOut',
    onComplete: () => {
      // Сбрасываем позиции после анимации
      gsap.set(currentSlide, { x: '0%', opacity: 0, zIndex: 0 });
      gsap.set(nextSlide, { x: '0%', zIndex: 1 });

      currentIndex.value = newIndex;
      isAnimating.value = false;
    },
  });
};

onMounted(async () => {
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 100));

  const section = sectionRef.value;
  const gallery = galleryRef.value;
  const content = contentRef.value;

  if (!section || !gallery || !content) return;

  const galleryItems = gallery.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  const centerIndex = Math.floor(galleryItems.length / 2);
  const centerItem = galleryItems[centerIndex];
  const centerImg = centerItem?.querySelector('img');

  if (!centerItem || !centerImg) return;

  // Скрываем контент
  gsap.set(content, {
    opacity: 0,
    y: 20,
    scale: 0.98,
  });

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
    galleryItems,
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

  // Центральный блок растёт
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

  // Контент появляется плавно
  tl.to(
    content,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      ease: 'power2.out',
      duration: 0.8,
      onComplete: () => {
        isContentVisible.value = true;
      },
    },
    1.4
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
  width: 131px;
  height: 198px;
  border-radius: 0;
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

  // Центральный слайд (третий)
  &:nth-child(3) {
    width: 400px;
    height: 600px;
    z-index: 3;
  }

  &:nth-child(2),
  &:nth-child(4) {
    width: 262px;
    height: 394px;
    z-index: 2;
  }
}

.environment-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  display: flex;
  align-items: flex-end;
  padding: 44px;
  pointer-events: none;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);

  .controls-block {
    height: 384px;
    width: 421px;
    border-radius: 7px;
    position: relative;
    z-index: 5;
    background-color: #fff;
    pointer-events: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    transform: translateZ(0);

    &__wrap {
      padding: 36px;
    }
  }

  .accordion {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .accordion-item {
    font-family: 'Akrobat';
    padding-bottom: 8px;
  }

  .accordion-item.active {
    padding: 0 0 30px;
  }

  .accordion-item.active:not(:first-child) {
    padding: 30px 0;
  }

  .accordion-header {
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.3s ease;
    color: $text-color-primary;
    font-size: 24px;
    font-weight: 700;
    width: fit-content;
    opacity: 0.5;
    display: flex;
    align-items: center;
    &:hover {
      opacity: 1;
    }
    .icon {
      margin-right: 12px;
      width: 0;
      opacity: 0;
    }
  }

  .accordion-item.active .accordion-header {
    font-size: 28px;
    opacity: 1;
    color: $accent-color-green;
    .icon {
      opacity: 1;
      width: fit-content;
    }
  }

  .accordion-content p {
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
    opacity: 0.8;
    color: $text-color-primary;
    margin-top: 10px;
  }

  .accordion-content {
    animation: fadeIn 0.3s ease;
  }

  .image-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    pointer-events: none;
    cursor: none;

    .image-half {
      width: 50%;
      height: 100%;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: none;
    }
  }

  .slides-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }

  .slide-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    pointer-events: none;
    will-change: transform;

    &.active {
      opacity: 1;
      z-index: 1;
    }
  }

  .custom-cursor {
    position: absolute;
    width: 48px;
    height: 48px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .custom-cursor svg {
    display: block;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

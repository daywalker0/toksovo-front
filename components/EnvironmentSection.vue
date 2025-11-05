<template>
  <section class="environment-section" ref="sectionRef">
    <div class="environment-section__gallery" ref="galleryRef" v-if="!isMobile">
      <div v-for="(img, i) in slides" :key="i" class="gallery-item">
        <img :src="img" alt="Приватная застройка" loading="lazy" />
      </div>
    </div>

    <template v-else>
      <div class="environment-section__bg">
        <img
          :key="'current-' + currentIndex"
          :src="currentSlide"
          alt="Environment background"
          class="slide-image slide-current"
          loading="eager"
        />
        <img
          v-if="nextSlideIndex !== null"
          :key="'next-' + nextSlideIndex"
          :src="slides[nextSlideIndex]"
          alt="Next slide"
          class="slide-image slide-next"
          :class="slideDirection === 'right' ? 'from-right' : 'from-left'"
          loading="eager"
        />
      </div>
      <div class="environment-section__gradient"></div>
      <div class="environment-section__content">
        <div class="content-block">
          <!-- Круговой прогресс-бар -->
          <div class="progress-circle">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <!-- Фоновый круг -->
              <circle cx="8" cy="8" r="6.5" stroke="#E6DFD8" stroke-width="3" fill="none" />
              <!-- Прогресс круг -->
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="#4C5E36"
                stroke-width="3"
                fill="none"
                :stroke-dasharray="progressCircle.circumference"
                :stroke-dashoffset="progressCircle.offset"
                stroke-linecap="round"
                style="
                  transform: rotate(-90deg);
                  transform-origin: center;
                  will-change: stroke-dashoffset;
                "
              />
            </svg>
          </div>

          <h2 class="content-title">{{ activeItem?.title || 'Заголовок' }}</h2>
          <p class="content-text">{{ activeItem?.content || 'Описание' }}</p>

          <div class="navigation-buttons">
            <button
              class="nav-button nav-button--prev"
              @click="() => goToPrevSlide(false)"
              :disabled="isAnimating"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 5 L7 12 L15 19"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <button
              class="nav-button nav-button--next"
              @click="() => goToNextSlide(false)"
              :disabled="isAnimating"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 5 L17 12 L9 19"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <div class="environment-content" ref="contentRef" v-if="!isMobile">
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
                    <circle cx="8" cy="8" r="6.5" stroke="#E6DFD8" stroke-width="3" fill="none" />
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="#4C5E36"
                      stroke-width="3"
                      fill="none"
                      :stroke-dasharray="progressCircle.circumference"
                      :stroke-dashoffset="
                        activeIndex === index ? progressCircle.offset : progressCircle.circumference
                      "
                      stroke-linecap="round"
                      style="
                        transform: rotate(-90deg);
                        transform-origin: center;
                        will-change: stroke-dashoffset;
                      "
                    />
                  </svg>
                </div>
                <AnimatedLink
                  :text="item.title"
                  customClass="accordion-header__text"
                  :disableAnimation="activeIndex === index"
                  :disablePointer="activeIndex === index"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="image-control" v-if="isContentVisible" @mousemove="onMouseMove">
        <div
          class="image-half left"
          @click="() => goToPrevSlide(false)"
          @mouseenter="hoverSide = 'left'"
          @mouseleave="hoverSide = null"
        />
        <div
          class="image-half right"
          @click="() => goToNextSlide(false)"
          @mouseenter="hoverSide = 'right'"
          @mouseleave="hoverSide = null"
        />

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
import { ref, computed, toRef, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrivateHousingData } from '@/composables/usePrivateHousingData';
import AnimatedLink from './Common/AnimatedLink.vue';

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

gsap.registerPlugin(ScrollTrigger);

const isMobile = ref(false);

const {
  items,
  activeIndex,
  activeItem,
  cursorX,
  cursorY,
  hoverSide,
  toggleItem: originalToggleItem,
  onMouseMove: handleMouseMove,
} = usePrivateHousingData(toRef(props, 'data'));

const sectionRef = ref(null);
const galleryRef = ref(null);
const contentRef = ref(null);
const isContentVisible = ref(false);
const currentIndex = ref(0);
const nextSlideIndex = ref(null);
const slideDirection = ref('right'); // 'right' или 'left'
const isAnimating = ref(false);
const tlRef = ref(null);
const autoplayInterval = ref(null);
const progressAnimationId = ref(null);
const progressStartTime = ref(null);
const progressValue = ref(0);
const setActiveIndex = i => (activeIndex.value = i);
const resizeTimer = ref(null);

// Функции управления прогрессом
const animateProgress = timestamp => {
  if (!progressStartTime.value) {
    progressStartTime.value = timestamp;
  }

  const elapsed = timestamp - progressStartTime.value;
  const duration = 5000;
  const progress = Math.min((elapsed / duration) * 100, 100);

  progressValue.value = progress;

  if (progress < 100) {
    progressAnimationId.value = requestAnimationFrame(animateProgress);
  }
};

const startProgress = () => {
  stopProgress();
  progressValue.value = 0;
  progressStartTime.value = null;
  progressAnimationId.value = requestAnimationFrame(animateProgress);
};

const stopProgress = () => {
  if (progressAnimationId.value) {
    cancelAnimationFrame(progressAnimationId.value);
    progressAnimationId.value = null;
  }
  progressStartTime.value = null;
  progressValue.value = 0;
};

// Функции управления автовоспроизведением
const startAutoplay = () => {
  stopAutoplay();
  startProgress(); // Запускаем прогресс

  autoplayInterval.value = setInterval(() => {
    if (!isAnimating.value) {
      goToNextSlide(true);
      startProgress();
    }
  }, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
  stopProgress();
};

const toggleItem = index => {
  originalToggleItem(index);

  if (currentIndex.value !== index && !isAnimating.value) {
    // Сразу перезапускаем таймер
    startAutoplay();

    if (isMobile.value) {
      // Для мобайла используем ту же логику
      isAnimating.value = true;
      const direction = index > currentIndex.value ? 'right' : 'left';
      slideDirection.value = direction;
      nextSlideIndex.value = index;
      activeIndex.value = index;

      setTimeout(() => {
        currentIndex.value = index;
        nextSlideIndex.value = null;
        isAnimating.value = false;
      }, 600);
    } else {
      const direction = index > currentIndex.value ? 'right' : 'left';
      animateSlide(index, direction);
    }
  } else if (currentIndex.value === index) {
    // Если кликаем на уже активный элемент, просто обновляем галерею
    updateGalleryImages();
  }
};
const slides = computed(() => {
  if (!items.value || !Array.isArray(items.value))
    return [];
  return items.value.map(it => it.image);
});

const currentSlide = computed(() => slides.value[currentIndex.value] || slides.value[0]);

// Вычисляем stroke-dashoffset для прогресс круга
const progressCircle = computed(() => {
  const radius = 6.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressValue.value / 100) * circumference;
  return {
    circumference,
    offset,
  };
});

const onMouseMove = e => {
  handleMouseMove(e);
};

const goToNextSlide = (isAutomatic = false) => {
  if (isAnimating.value) return;

  // Перезапускаем таймер сразу при ручном клике
  if (!isAutomatic) {
    startAutoplay();
  }

  // Переключаем активный элемент аккордеона
  const nextActiveIndex = (activeIndex.value + 1) % items.value.length;
  setActiveIndex(nextActiveIndex);

  if (isMobile.value) {
    isAnimating.value = true;
    slideDirection.value = 'right';
    nextSlideIndex.value = nextActiveIndex;

    setTimeout(() => {
      currentIndex.value = nextActiveIndex;
      nextSlideIndex.value = null;
      isAnimating.value = false;
    }, 600);
  } else {
    currentIndex.value = nextActiveIndex;
    animateSlide(nextActiveIndex, 'right');
  }
};

const goToPrevSlide = (isAutomatic = false) => {
  if (isAnimating.value) return;

  // Перезапускаем таймер сразу при ручном клике
  if (!isAutomatic) {
    startAutoplay();
  }

  // Переключаем активный элемент аккордеона
  const prevActiveIndex = (activeIndex.value - 1 + items.value.length) % items.value.length;
  setActiveIndex(prevActiveIndex);

  if (isMobile.value) {
    isAnimating.value = true;
    slideDirection.value = 'left';
    nextSlideIndex.value = prevActiveIndex;

    setTimeout(() => {
      currentIndex.value = prevActiveIndex;
      nextSlideIndex.value = null;
      isAnimating.value = false;
    }, 600);
  } else {
    currentIndex.value = prevActiveIndex;
    animateSlide(prevActiveIndex, 'left');
  }
};

const updateGalleryImages = () => {
  if (!galleryRef.value) return;
  
  const galleryItems = galleryRef.value.querySelectorAll('.gallery-item');
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      // Центральный слайд показывает активный элемент аккордеона
      // Боковые слайды показывают соседние элементы
      const centerIndex = Math.floor(galleryItems.length / 2);
      let imageIndex;
      
      if (index === centerIndex) {
        // Центральный элемент - активный элемент аккордеона
        imageIndex = activeIndex.value;
      } else {
        // Боковые элементы - соседние к активному
        const offset = index - centerIndex;
        imageIndex = (activeIndex.value + offset + items.value.length) % items.value.length;
      }
      
      img.src = slides.value[imageIndex];
    }
  });
};

const animateSlide = (newIndex, direction) => {
  if (isAnimating.value) return;
  isAnimating.value = true;

  currentIndex.value = newIndex;
  setActiveIndex(newIndex);

  // Анимация работает только когда контент виден (секция на полном экране)
  if (galleryRef.value && isContentVisible.value) {
    const galleryItems = galleryRef.value.querySelectorAll('.gallery-item');
    const centerIndex = Math.floor(galleryItems.length / 2);
    const centerItem = galleryItems[centerIndex];
    const centerImg = centerItem?.querySelector('img');

    if (centerImg) {
      // Создаем временное изображение для анимации
      const tempImg = document.createElement('img');
      tempImg.src = slides.value[activeIndex.value]; // Центральный слайд показывает активный элемент
      tempImg.style.position = 'absolute';
      tempImg.style.top = '0';
      tempImg.style.left = '0';
      tempImg.style.width = '100%';
      tempImg.style.height = '100%';
      tempImg.style.objectFit = 'cover';

      // Устанавливаем начальную позицию в зависимости от направления
      const startX = direction === 'right' ? '100%' : '-100%';
      gsap.set(tempImg, { x: startX });

      // Делаем centerItem относительным для позиционирования
      const originalPosition = centerItem.style.position;
      centerItem.style.position = 'relative';
      centerItem.style.overflow = 'hidden';
      centerItem.appendChild(tempImg);

      // Анимируем новое изображение (заезжает поверх текущего)
      gsap.to(tempImg, {
        x: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          updateGalleryImages();
          centerItem.removeChild(tempImg);
          centerItem.style.position = originalPosition;
          isAnimating.value = false;
        },
      });
    } else {
      isAnimating.value = false;
    }
  } else if (galleryRef.value && !isContentVisible.value) {
    // Если секция не развернута, просто меняем изображение без анимации
    const galleryItems = galleryRef.value.querySelectorAll('.gallery-item');
    const centerIndex = Math.floor(galleryItems.length / 2);

    updateGalleryImages();
    isAnimating.value = false;
  } else {
    setTimeout(() => {
      isAnimating.value = false;
    }, 600);
  }
};


const S = { w: 131, h: 198, z: 1 };
const M = { w: 262, h: 394, z: 2 };
const L = { w: 394, h: 590, z: 3 };
const layout = [S, M, L, M, S];

function destroy() {
  tlRef.value?.scrollTrigger?.kill();
  tlRef.value?.kill();
  ScrollTrigger.getAll().forEach(st => st.kill());
}

async function build() {
  await nextTick();

  const section = sectionRef.value;
  const gallery = galleryRef.value;
  const content = contentRef.value;
  if (!section || !gallery || !content) return;

  const itemsEls = gallery.querySelectorAll('.gallery-item');
  if (!itemsEls.length) return;

  const centerIndex = Math.floor(itemsEls.length / 2);
  const centerItem = itemsEls[centerIndex];
  const centerImg = centerItem?.querySelector('img');
  if (!centerItem || !centerImg) return;

  // стартовые размеры S-M-L-M-S
  itemsEls.forEach((el, i) => {
    const s = layout[i] || S;
    gsap.set(el, {
      width: `${s.w}px`,
      height: `${s.h}px`,

      zIndex: s.z,
    });
    const img = el.querySelector('img');
    img && gsap.set(img, { width: '100%', height: '100%', objectFit: 'cover' });
  });

  gsap.set(content, { y: 40, autoAlpha: 0 });

  const others = Array.from(itemsEls).filter((_, i) => i !== centerIndex);
  const growStart = 0.3;
  const growDur = 1.2;
  const contentAt = growStart + growDur * 0.8;

  const tl = gsap.timeline({
    defaults: { ease: 'power1.out' },
    scrollTrigger: {
      trigger: section,
      start: 'center center',
      end: '+=2000',
      scrub: 1,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      anticipatePin: 1,
      onUpdate: self => {
        const wasVisible = isContentVisible.value;
        isContentVisible.value = self.progress > 0.6;

        if (!wasVisible && isContentVisible.value) {
          startAutoplay();
        }
        if (wasVisible && !isContentVisible.value) {
          stopAutoplay();
        }
      },
      onLeave: () => {
        isContentVisible.value = true;
      },
      onEnterBack: () => {
        isContentVisible.value = true;
      },
      onLeaveBack: () => {
        isContentVisible.value = false;
        stopAutoplay();
      },
    },
  });

  tl.to({}, { duration: 0.1 }, 0);

  tl.fromTo(
    others,
    {
      width: (i, el) => {
        const idx = Array.from(itemsEls).indexOf(el);
        const s = layout[idx] || S;
        return `${s.w}px`;
      },
      height: (i, el) => {
        const idx = Array.from(itemsEls).indexOf(el);
        const s = layout[idx] || S;
        return `${s.h}px`;
      },
    },
    {
      width: '131px',
      height: '199px',
      duration: 0.8,
      immediateRender: false,
      overwrite: 'auto',
    },
    0.1
  );

  tl.fromTo(
    centerItem,
    { width: `${L.w}px`, height: `${L.h}px` },
    {
      width: '100vw',
      height: '100vh',
      duration: growDur,
      immediateRender: false,
      overwrite: 'auto',
      force3D: true,
    },
    growStart
  );

  tl.fromTo(
    content,
    { y: 40, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, ease: 'power1.out', duration: 0.8, immediateRender: false },
    contentAt
  );

  tlRef.value = tl;
  
  // Обновляем изображения в галерее после создания
  updateGalleryImages();
}

onMounted(async () => {
  const checkMobile = () => (isMobile.value = window.innerWidth <= 599);
  checkMobile();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer.value);
    resizeTimer.value = setTimeout(() => {
      checkMobile();
      destroy();
      if (!isMobile.value) build();
      else {
        ScrollTrigger.refresh();
      }
    }, 150);
  });

  if (!isMobile.value) {
    build();
  } else {
    startAutoplay();
  }
});

onBeforeUnmount(() => {
  clearTimeout(resizeTimer.value);
  stopAutoplay();
  destroy();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.environment-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: block;
    overflow: hidden;

    @media (min-width: 600px) {
      display: none;
    }

    .slide-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .slide-current {
      z-index: 1;
    }

    .slide-next {
      z-index: 2;

      @media (max-width: $breakpoint-x) {
        z-index: 10;
      }

      &.from-right {
        @media (max-width: $breakpoint-x) {
          animation: slideInFromRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      }

      &.from-left {
        @media (max-width: $breakpoint-x) {
          animation: slideInFromLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      }
    }
  }

  &__gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 450px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    z-index: 15;
    pointer-events: none;

    @media (min-width: 600px) {
      display: none;
    }
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    padding: 40px;
    display: flex;
    justify-content: center;

    @media (max-width: $breakpoint-x) {
      padding: 10px;
      bottom: 0;
      z-index: 20;
    }

    @media (min-width: 600px) {
      display: none;
    }
  }
}

.content-block {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: $breakpoint-x) {
    padding: 20px 15px;
    max-width: 100%;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    background: transparent;
    box-shadow: none;
  }
}

.progress-circle {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    display: block;
  }

  circle {
    transition: stroke-dashoffset 0.1s linear;
  }

  @media (max-width: $breakpoint-x) {
    margin-bottom: 12px;
    circle:nth-child(2) {
      stroke: $accent-color-orange;
    }
  }
}

.content-title {
  font-family: 'Akrobat', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: $accent-color-green;
  margin: 0 0 20px 0;
  text-transform: uppercase;

  @media (max-width: $breakpoint-x) {
    font-size: 22px;
    font-weight: 700;
    line-height: 100%;
    color: white;
    margin: 0 0 6px 0;
    width: 100%;
    text-align: center;
  }
}

.content-text {
  font-family: 'Akrobat', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 140%;
  color: $text-color-primary;
  margin: 0 0 30px 0;

  @media (max-width: $breakpoint-x) {
    font-size: 14px;
    font-weight: 600;
    line-height: 140%;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    max-width: 340px;
    margin: 0 auto;
  }
}

.navigation-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px
}

.nav-button {
  width: 48px;
  height: 48px;
  border: 2px solid $accent-color-green;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: $accent-color-green;

  @media (max-width: $breakpoint-x) {
    width: 32px;
    height: 32px;
    border: none;
    background: white;
    color: #000;
  }

  &:hover:not(:disabled) {
    background: $accent-color-green;
    color: white;
    transform: scale(1.05);
    
    @media (max-width: $breakpoint-x) {
      background: white;
      color: #000;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
    
    @media (max-width: $breakpoint-x) {
      width: 16px;
      height: 16px;
    }
  }
}

// Стили для десктопной версии
.environment-section__gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  height: 100%;
  width: 100%;
  position: relative;

  @media (max-width: $breakpoint-x) {
    display: none;
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
    position: relative;
  }

  // Центральный слайд (третий) - позиционирование для анимации
  &:nth-child(3) {
    width: 400px;
    height: 600px;
    z-index: 3;
    will-change: width, height;
    transform: translateZ(0);
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
  padding: 0 44px 44px;
  pointer-events: none;

  @media (max-width: $breakpoint-x) {
    display: none;
  }

  .controls-block {
    height: auto;
    min-height: 200px;
    width: 421px;
    border-radius: 7px;
    position: relative;
    z-index: 5;
    background-color: #fff;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    @media (max-width: 1366px) {
      width: 365px;
    }

    &__wrap {
      padding: 36px;
      @media (max-width: 1366px) {
        padding: 26px;
      }
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
    padding-bottom: 8px;
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

    @media (max-width: 1366px) {
      font-size: 20px;
    }

    &:hover {
      opacity: 1;
    }
    .icon {
      width: 0;
      opacity: 0;
      margin-right: 0;
    }
  }

  .accordion-item.active .accordion-header {
    font-size: 28px;
    opacity: 1;
    color: $accent-color-green;
    cursor: auto !important;

    @media (max-width: 1366px) {
      font-size: 23px;
    }

    .icon {
      opacity: 1;
      width: fit-content;
      margin-right: 12px;
    }
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

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>

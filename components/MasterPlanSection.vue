<template>
  <section ref="sectionRef" class="enhanced-section" id="master-plan">
    <div class="sticky-container" :class="{ 'mobile-version': isMobile }">
      <div
        class="background-image"
        :class="{ 'mobile-scrollable': isMobile }"
        ref="scrollContainer"
        @click="handleBackgroundClick"
      >
        <div class="image-wrapper" ref="imageWrapper">
          <img :src="genPlanImg" alt="Генеральный план" loading="eager" />

          <div v-if="showPins && isMobile" class="pins-container pins-container--mobile">
            <div
              v-for="(pin, index) in pins"
              :key="index"
              class="pin"
              :class="{
                'pin--active': pin.active,
                'pin--hover': pin.active && hoveredPinIndex === index,
              }"
              :style="getMobilePinStyle(pin)"
              @click.stop="pin.active && handlePinClick(pin, index)"
            >
              <div class="pin-dot">{{ pin.id }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isMobile" ref="overlayTopRef" class="overlay-bar overlay-top"></div>
      <div v-if="!isMobile" ref="overlayBottomRef" class="overlay-bar overlay-bottom"></div>
      <div v-if="!isMobile" ref="overlayLeftRef" class="overlay-bar overlay-left"></div>
      <div v-if="!isMobile" ref="overlayRightRef" class="overlay-bar overlay-right"></div>

      <div v-if="!isMobile" ref="textLeftRef" class="text-left">{{ title1 }}</div>
      <div v-if="!isMobile" ref="textRightRef" class="text-right">{{ title2 }}</div>

      <div v-if="showPins && !isMobile" class="pins-container">
        <div
          v-for="(pin, index) in pins"
          :key="index"
          class="pin"
          :class="{
            'pin--active': pin.active,
            'pin--hover': pin.active && hoveredPinIndex === index,
          }"
          :style="{
            top: `${pin.y}%`,
            left: `${pin.x}%`,
            transform: `translate(-50%, -50%)`,
          }"
          @mouseenter="pin.active && handlePinEnter(pin, index)"
          @mouseleave="handlePinLeave"
        >
          <div class="pin-dot">{{ pin.id }}</div>
        </div>
      </div>

      <div
        v-if="hoveredPin && showPins"
        class="pin-info-panel"
        :style="panelStyle"
        :data-position="getOptimalPanelPosition(hoveredPin).position"
        @mouseenter="handlePanelEnter"
        @mouseleave="handlePanelLeave"
        @click.stop
      >
        <button
          v-if="isMobile"
          class="pin-info-close"
          @click="handleBackgroundClick"
          aria-label="Закрыть"
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path
              d="M14 0.824833L13.1752 0L7 6.17517L0.824833 0L0 0.824833L6.17517 7L0 13.1752L0.824833 14L7 7.82483L13.1752 14L14 13.1752L7.82483 7L14 0.824833Z"
              fill="#2C322C"
            />
          </svg>
        </button>

        <div class="pin-info-header">Корпус {{ hoveredPin.buildingNumber }}</div>
        <ul class="pin-info-list">
          <li v-for="(offer, i) in hoveredPin.offers" :key="i" class="pin-info-item">
            <span class="pin-info-type">{{ offer.type }}</span>
            <span class="pin-info-price">от {{ offer.price }}</span>
          </li>
        </ul>
        <button class="button button--orange pin-info-cta" @click="handleCatalogClick">
          Каталог квартир
        </button>
      </div>

      <button
        v-if="showFilterButton && !isMobile"
        class="button button--orange button--filter"
        @click="handleFilterClick"
      >
        Подбор по параметрам
      </button>

      <div v-if="isMobile" class="mobile-navigation">
        <button class="mobile-nav-btn mobile-nav-btn--left" @click="scrollLeft">
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path
              d="M7.15141 0.0727358L8.03516 0.956484L1.43391 7.55773C1.31641 7.67648 1.25141 7.83273 1.25141 8.00023C1.25141 8.16773 1.31641 8.32398 1.43391 8.44273L8.03516 15.044L7.15141 15.9277L0.550155 9.32648C0.196404 8.97273 0.00140572 8.50148 0.00140572 8.00023C0.00140572 7.49898 0.196404 7.02898 0.550155 6.67398L7.15141 0.0727358Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div class="mobile-nav-text">Перемещайтесь по генплану</div>
        <button class="mobile-nav-btn mobile-nav-btn--right" @click="scrollRight">
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path
              d="M1.84859 15.9273L0.964844 15.0435L7.56609 8.44227C7.68359 8.32352 7.74859 8.16727 7.74859 7.99977C7.74859 7.83227 7.68359 7.67602 7.56609 7.55727L0.964844 0.956015L1.84859 0.0722656L8.44985 6.67352C8.8036 7.02727 8.99859 7.49852 8.99859 7.99977C8.99859 8.50102 8.8036 8.97102 8.44985 9.32602L1.84859 15.9273Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import genPlanImg from '@/assets/img/gen-plan.jfif';

const props = defineProps({
  data: Object
})

const title1 = computed(() => props.data.title_1)
const title2 = computed(() => props.data.title_2)

const sectionRef = ref(null);
const overlayTopRef = ref(null);
const overlayBottomRef = ref(null);
const overlayLeftRef = ref(null);
const overlayRightRef = ref(null);
const textLeftRef = ref(null);
const textRightRef = ref(null);
const scrollContainer = ref(null);
const imageWrapper = ref(null);
const isMobile = ref(process.client ? window.innerWidth <= 599 : false);
const showPins = ref(false);
const showFilterButton = ref(false);
const hoveredPin = ref(null);
const hoveredPinIndex = ref(null);
const isPanelHovered = ref(false);
let closeTimeoutId = null;

// Данные для пинов
const pins = ref([
  { id: 1, x: 12, y: 28, label: 'Объект 1', active: true },
  { id: 2, x: 16, y: 18, label: 'Парк', active: false },
  { id: 3, x: 26, y: 29, label: 'Школа', active: true },
  { id: 4, x: 37, y: 18, label: 'Торговый центр', active: true },
  { id: 5, x: 51, y: 16, label: 'Больница', active: false },
  { id: 6, x: 62, y: 14, label: 'Спорткомплекс', active: true },
  { id: 7, x: 35, y: 47, label: 'Детский сад', active: false },
  { id: 8, x: 52, y: 43, label: 'Библиотека', active: true },
  { id: 9, x: 58, y: 30, label: 'Кафе', active: false },
  { id: 10, x: 75, y: 27, label: 'Аптека', active: true },
  { id: 11, x: 50, y: 75, label: 'Банк', active: false },
  { id: 12, x: 67, y: 60, label: 'Почта', active: true },
  { id: 13, x: 75, y: 45, label: 'Автосервис', active: false },
  { id: 14, x: 87, y: 38, label: 'Салон красоты', active: true },
]);

const defaultOffers = [
  { type: 'Студия', price: '5 415 000 руб.' },
  { type: '1-комн.', price: '6 890 000 руб.' },
  { type: '2-комн.', price: '8 240 000 руб.' },
  { type: '3-комн.', price: '10 990 000 руб.' },
];

const handlePinEnter = (pin, index) => {
  // Не показываем панель, если пины скрыты
  if (!showPins.value) return;

  hoveredPinIndex.value = index;
  hoveredPin.value = {
    ...pin,
    buildingNumber: (index ?? 0) + 1,
    offers: defaultOffers,
  };
};

const handlePinLeave = () => {
  // небольшая задержка, чтобы дать время на переход курсора в панель
  if (closeTimeoutId) {
    clearTimeout(closeTimeoutId);
    closeTimeoutId = null;
  }
  closeTimeoutId = setTimeout(() => {
    if (!isPanelHovered.value) {
      hoveredPinIndex.value = null;
      hoveredPin.value = null;
    }
    closeTimeoutId = null;
  }, 120);
};

// Клик по пину на мобильных
const handlePinClick = (pin, index) => {
  // Если кликнули на тот же пин - закрываем панель
  if (hoveredPinIndex.value === index && hoveredPin.value) {
    hoveredPinIndex.value = null;
    hoveredPin.value = null;
  } else {
    // Иначе открываем панель для нового пина
    hoveredPinIndex.value = index;
    hoveredPin.value = {
      ...pin,
      buildingNumber: (index ?? 0) + 1,
      offers: defaultOffers,
    };
  }
};

// Клик по фону на мобильных - закрываем панель
const handleBackgroundClick = () => {
  if (isMobile.value) {
    hoveredPinIndex.value = null;
    hoveredPin.value = null;
  }
};

// Стили для пинов на мобильных (привязаны к изображению)
const getMobilePinStyle = pin => {
  return {
    top: `${pin.y}%`,
    left: `${pin.x}%`,
    transform: 'translate(-50%, -50%)',
  };
};

const handlePanelEnter = () => {
  // Не даем панели оставаться, если пины скрыты
  if (!showPins.value) {
    hoveredPin.value = null;
    hoveredPinIndex.value = null;
    return;
  }

  isPanelHovered.value = true;
  if (closeTimeoutId) {
    clearTimeout(closeTimeoutId);
    closeTimeoutId = null;
  }
};

const handlePanelLeave = () => {
  isPanelHovered.value = false;
  if (closeTimeoutId) {
    clearTimeout(closeTimeoutId);
    closeTimeoutId = null;
  }
  // закрываем, если курсор ушел с панели и пина
  hoveredPinIndex.value = null;
  hoveredPin.value = null;
};

// Функция для определения оптимальной позиции плашки
const getOptimalPanelPosition = pin => {
  if (!pin) return { position: 'right', x: 0, y: 0 };

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Адаптивные размеры панели
  const isMobile = viewportWidth <= 768;
  const panelWidth = isMobile ? 280 : 300;
  const panelHeight = isMobile ? 180 : 200;
  const offset = isMobile ? 20 : 40;

  // Конвертируем проценты в пиксели
  const pinX = (pin.x / 100) * viewportWidth;
  const pinY = (pin.y / 100) * viewportHeight;

  // Проверяем доступное место справа
  const rightSpace = viewportWidth - pinX;
  const canFitRight = rightSpace >= panelWidth + offset;

  // Проверяем доступное место слева
  const leftSpace = pinX;
  const canFitLeft = leftSpace >= panelWidth + offset;

  // Проверяем доступное место сверху
  const topSpace = pinY;
  const canFitTop = topSpace >= panelHeight + offset;

  // Проверяем доступное место снизу
  const bottomSpace = viewportHeight - pinY;
  const canFitBottom = bottomSpace >= panelHeight + offset;

  // Логика выбора позиции с приоритетом
  if (canFitRight && canFitBottom) {
    return { position: 'right', x: pinX + offset, y: pinY };
  } else if (canFitLeft && canFitBottom) {
    return { position: 'left', x: pinX - panelWidth - offset, y: pinY };
  } else if (canFitRight && canFitTop) {
    return { position: 'right-top', x: pinX + offset, y: pinY - panelHeight };
  } else if (canFitLeft && canFitTop) {
    return { position: 'left-top', x: pinX - panelWidth - offset, y: pinY - panelHeight };
  } else if (canFitRight) {
    return { position: 'right', x: pinX + offset, y: pinY };
  } else if (canFitLeft) {
    return { position: 'left', x: pinX - panelWidth - offset, y: pinY };
  } else {
    // Fallback - центрируем по вертикали и горизонтали
    const centerX = Math.max(10, Math.min(viewportWidth - panelWidth - 10, pinX - panelWidth / 2));
    const centerY = Math.max(
      10,
      Math.min(viewportHeight - panelHeight - 10, pinY - panelHeight / 2)
    );
    return { position: 'right', x: centerX, y: centerY };
  }
};

const panelStyle = computed(() => {
  if (!hoveredPin.value) return {};

  const position = getOptimalPanelPosition(hoveredPin.value);

  return {
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: 'translateY(-50%)',
  };
});

const handleCatalogClick = () => {
  // TODO: Реализовать переход в каталог квартир
};

const handleFilterClick = () => {
  // TODO: Реализовать открытие фильтра
};

// Мобильные стили и функции
const mobileImageStyle = computed(() => {
  return {};
});

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -window.innerWidth * 0.5,
      behavior: 'smooth',
    });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: window.innerWidth * 0.5,
      behavior: 'smooth',
    });
  }
};

const checkMobile = () => {
  const newIsMobile = window.innerWidth <= 599;
  if (isMobile.value !== newIsMobile) {
    isMobile.value = newIsMobile;
    // На мобильных показываем пины сразу
    if (isMobile.value) {
      showPins.value = true;
    }
  }
};

onMounted(async () => {
  if (process.client) {
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile.value) {
      showPins.value = true;

      await nextTick();
      if (scrollContainer.value) {
        const scrollWidth = scrollContainer.value.scrollWidth;
        const clientWidth = scrollContainer.value.clientWidth;
        const centerScroll = (scrollWidth - clientWidth) / 2;
        scrollContainer.value.scrollLeft = centerScroll;
      }

      return;
    }

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    gsap.registerPlugin(ScrollTrigger);

    await nextTick();

    if (!sectionRef.value || !overlayTopRef.value) {
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const centerX = vw / 2;
    const centerY = vh / 2;

    const initialW = 422;
    const initialH = 563;
    const textGap = 120;
    const textTop = '44%';

    const updateElements = (w, h) => {
      const left = centerX - w / 2;
      const right = centerX + w / 2;
      const top = centerY - h / 2;
      const bottom = centerY + h / 2;

      // Округляем до целых пикселей
      const topRound = Math.round(top);
      const bottomRound = Math.round(bottom);
      const leftRound = Math.round(left);
      const rightRound = Math.round(right);
      const hRound = Math.round(h) + 2;

      if (overlayTopRef.value) {
        gsap.set(overlayTopRef.value, { height: topRound });
      }
      if (overlayBottomRef.value) {
        gsap.set(overlayBottomRef.value, { top: bottomRound, height: vh - bottomRound });
      }
      if (overlayLeftRef.value) {
        gsap.set(overlayLeftRef.value, {
          width: leftRound,
          top: topRound - 1,
          height: hRound,
        });
      }
      if (overlayRightRef.value) {
        gsap.set(overlayRightRef.value, {
          left: rightRound,
          width: vw - rightRound,
          top: topRound - 1,
          height: hRound,
        });
      }

      if (textLeftRef.value) {
        const textRight = Math.round(vw - leftRound + textGap);
        gsap.set(textLeftRef.value, {
          right: textRight,
          left: 'auto',
          top: textTop,
          transform: 'translate(0, 0)',
        });
      }
      if (textRightRef.value) {
        const textLeft = Math.round(rightRound + textGap);
        gsap.set(textRightRef.value, {
          left: textLeft,
          right: 'auto',
          top: textTop,
          transform: 'translate(0, 0)',
        });
      }
    };

    updateElements(422, 563);

    const state = { w: 422, h: 563 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '+=100%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (self.progress > 0.8 && !showPins.value) {
            showPins.value = true;
            showFilterButton.value = true;
          } else if (self.progress <= 0.8 && showPins.value) {
            showPins.value = false;
            showFilterButton.value = false;
            // Скрываем панель когда пины скрываются
            hoveredPin.value = null;
            hoveredPinIndex.value = null;
            // Очищаем таймеры
            if (closeTimeoutId) {
              clearTimeout(closeTimeoutId);
              closeTimeoutId = null;
            }
          }
        },
        onComplete: () => {
          showPins.value = true;
          showFilterButton.value = true;
        },
      },
    });

    tl.fromTo(
      state,
      {
        w: 422,
        h: 563,
      },
      {
        w: vw,
        h: vh,
        duration: 1,
        ease: 'none',
        immediateRender: true,
        onUpdate: () => {
          updateElements(state.w, state.h);
        },
      },
      0
    );
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', checkMobile);
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.enhanced-section {
  height: 200vh;
  position: relative;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
    min-height: 100svh;
  }
}

.sticky-container {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e6dfd8;

  @media (max-width: $breakpoint-x) {
    position: relative;
    height: 100svh;
    min-height: 100svh;
  }
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  backface-visibility: hidden;
  transform: translateZ(0);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  &.mobile-scrollable {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;

    // Скрываем скроллбар но оставляем функциональность
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: inline-block;

  @media (max-width: $breakpoint-x) {
    width: auto;
    height: 100%;
    min-width: 400%;
    display: block;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;

    @media (max-width: $breakpoint-x) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
}

.overlay-bar {
  position: absolute;
  background: #e6dfd8;
  z-index: 1;
  backface-visibility: hidden;
  will-change: width, height, top, left;
  transform: translateZ(0);
  image-rendering: crisp-edges;
  outline: 1px solid transparent;
}

.overlay-top {
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
}

.overlay-bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
}

.overlay-left {
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.overlay-right {
  top: 0;
  right: 0;
  width: 0;
  height: 0;
}

.text-left,
.text-right {
  position: absolute;
  z-index: 2;
  color: $text-color-primary;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 400;
  letter-spacing: 0.1em;
  opacity: 0.9;
  pointer-events: none;
  backface-visibility: hidden;
  white-space: nowrap;
  will-change: transform;

  @media (max-width: $breakpoint-lg) {
    font-size: 98px;
  }

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

/* Стили для пинов */
.pins-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: all;

  &--mobile {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    pointer-events: all;
  }
}

.pin {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: center center;
}

.pin-dot {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $accent-color-orange;
  color: $text-color-white;
  border-radius: 50%;
  box-sizing: border-box;
  font-family: 'Akrobat';
  font-weight: 900;
  font-size: 18px;
  line-height: 100%;
  transition: background 0.3s;
}

.pin:not(.pin--active) .pin-dot {
  background: rgba(44, 50, 44, 0.2);

  @media (min-width: 600px) {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  @media (max-width: 599px) {
    background: rgba(44, 50, 44, 0.6);
  }
}

/* Неактивные пины не кликабельны визуально */
.pin:not(.pin--active) {
  cursor: default;
}

/* Выделение пина при наведении */
.pin.pin--hover .pin-dot {
  background: #ffe8cc;
  border: 2px solid #ff8a00;
  color: #ff8a00;
  transition: background 0.3s;
}

.pin-info-panel {
  position: absolute;
  z-index: 5;
  min-width: 240px;
  max-width: 300px;
  background: #ffffff;
  color: $text-color-primary;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 24px;
  font-family: 'Akrobat';

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    left: -16px;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: #ffffff;
  }

  &[data-position='left']::before {
    left: auto;
    right: -16px;
    border-right-color: transparent;
    border-left-color: #ffffff;
  }

  &[data-position='right-top']::before,
  &[data-position='left-top']::before {
    top: auto;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    border-right-color: transparent;
    border-left-color: transparent;
    border-top-color: #ffffff;
  }
}

.pin-info-header {
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.pin-info-list {
  list-style: none;
  margin: 0 0 12px 0;
  padding: 0;
}

.pin-info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 18px;
  line-height: 140%;
  font-weight: 700;
}

.pin-info-item:last-child {
  border-bottom: none;
}

.pin-info-price {
  color: $text-color-primary;
}

.pin-info-cta {
  width: 100%;
  margin-top: 8px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

.button--orange {
  background-color: $accent-color-orange;
  color: $text-color-white;
  font-family: 'Akrobat';
  text-transform: uppercase;
  font-weight: 700;
  border: none;
  font-size: 18px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background-color: $text-color-primary;
    transition: left 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: $text-color-white;

    &::before {
      left: 0;
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.button--filter {
  position: absolute;
  bottom: 48px;
  left: 44px;
  z-index: 4;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .text-left,
  .text-right {
    font-size: 2.5rem;
  }

  .text-content {
    width: 400px; /* Меньше на мобильных */
  }

  .pin-label {
    font-size: 10px;
    padding: 2px 6px;
  }

  .button--filter {
    bottom: 1rem;
    left: 1rem;
    padding: 12px 20px;
    font-size: 14px;
  }

  .pin-info-panel {
    min-width: 200px;
    max-width: 280px;
    padding: 20px;
    font-size: 14px;
    border-radius: 12px;

    &::before {
      display: none;
    }
  }

  .pin-info-header {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .pin-info-item {
    font-size: 14px;
    padding: 2px 0;
  }

  .pin-info-cta {
    font-size: 14px;
    padding: 8px 16px;
  }

  .pin-info-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: transform 0.2s ease;

    &:active {
      transform: scale(0.9);
    }

    svg {
      width: 10px;
      height: 10px;
    }
  }
}

.mobile-navigation {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(44, 50, 44, 0.4);
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
  border-radius: 7px;
  border: 1px solid $text-color-primary;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-nav-text {
  font-family: 'Akrobat';
  font-size: 14px;
  font-weight: 600;
  line-height: 140%;
  color: $text-color-white;
  white-space: nowrap;
}

.mobile-nav-btn {
  width: 6px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  color: $text-color-white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 9px;
    height: 16px;
  }
}

.mobile-version {
  overflow: visible;

  .pins-container {
    z-index: 3;
  }
}
</style>

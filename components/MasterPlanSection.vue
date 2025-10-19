<template>
  <section ref="sectionRef" class="enhanced-section" id="master-plan">
    <div class="sticky-container">
      <!-- Фиксированное изображение с пинами под всем -->
      <div class="background-image">
        <img :src="genPlanImg" alt="Master plan" />
      </div>

      <!-- 4 блока создающих рамку вокруг отверстия -->
      <div ref="overlayTopRef" class="overlay-bar overlay-top"></div>
      <div ref="overlayBottomRef" class="overlay-bar overlay-bottom"></div>
      <div ref="overlayLeftRef" class="overlay-bar overlay-left"></div>
      <div ref="overlayRightRef" class="overlay-bar overlay-right"></div>

      <!-- Тексты по бокам отверстия -->
      <div ref="textLeftRef" class="text-left">Ген.</div>
      <div ref="textRightRef" class="text-right">План</div>

      <!-- Пинсы которые появляются после раскрытия -->
      <div v-if="showPins" class="pins-container">
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

        <!-- Инфо-панель справа от выбранного пина -->
        <div
          v-if="hoveredPin"
          class="pin-info-panel"
          :style="panelStyle"
          :data-position="getOptimalPanelPosition(hoveredPin).position"
          @mouseenter="handlePanelEnter"
          @mouseleave="handlePanelLeave"
        >
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
      </div>

      <!-- Кнопка подбора по параметрам -->
      <button
        v-if="showFilterButton"
        class="button button--orange button--filter"
        @click="handleFilterClick"
      >
        Подбор по параметрам
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import genPlanImg from '@/assets/img/gen-plan.jpg';

const sectionRef = ref(null);
const overlayTopRef = ref(null);
const overlayBottomRef = ref(null);
const overlayLeftRef = ref(null);
const overlayRightRef = ref(null);
const textLeftRef = ref(null);
const textRightRef = ref(null);
const showPins = ref(false);
const showFilterButton = ref(false);
const hoveredPin = ref(null);
const hoveredPinIndex = ref(null);
const isPanelHovered = ref(false);
let closeTimeoutId = null;

// Данные для пинов
const pins = ref([
  { id: 1, x: 13, y: 22, label: 'Объект 1', active: true },
  { id: 2, x: 18, y: 15, label: 'Парк', active: false },
  { id: 3, x: 30, y: 20, label: 'Школа', active: true },
  { id: 4, x: 38, y: 15, label: 'Торговый центр', active: true },
  { id: 5, x: 50, y: 12, label: 'Больница', active: false },
  { id: 6, x: 62, y: 9, label: 'Спорткомплекс', active: true },
  { id: 7, x: 35, y: 40, label: 'Детский сад', active: false },
  { id: 8, x: 50, y: 35, label: 'Библиотека', active: true },
  { id: 9, x: 60, y: 25, label: 'Кафе', active: false },
  { id: 10, x: 75, y: 20, label: 'Аптека', active: true },
  { id: 11, x: 50, y: 65, label: 'Банк', active: false },
  { id: 12, x: 67, y: 48, label: 'Почта', active: true },
  { id: 13, x: 75, y: 40, label: 'Автосервис', active: false },
  { id: 14, x: 87, y: 32, label: 'Салон красоты', active: true },
]);

const defaultOffers = [
  { type: 'Студия', price: '5 415 000 руб.' },
  { type: '1-комн.', price: '6 890 000 руб.' },
  { type: '2-комн.', price: '8 240 000 руб.' },
  { type: '3-комн.', price: '10 990 000 руб.' },
];

const handlePinEnter = (pin, index) => {
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

const handlePanelEnter = () => {
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
  console.log('Переход в каталог квартир');
};

const handleFilterClick = () => {
  console.log('Клик по кнопке подбора по параметрам');
  // Здесь можно добавить логику для открытия фильтра или модального окна
};

onMounted(async () => {
  if (process.client) {
    // Динамически импортируем GSAP только на клиенте
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    gsap.registerPlugin(ScrollTrigger);

    // Ждем следующий тик для гарантии что DOM готов
    await nextTick();

    // Проверяем что элементы существуют
    if (!sectionRef.value || !overlayTopRef.value) {
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const centerX = vw / 2;
    const centerY = vh / 2;

    // Начальные размеры отверстия
    const initialW = 422;
    const initialH = 563;
    const initialLeft = centerX - initialW / 2;
    const initialRight = centerX + initialW / 2;
    const initialTop = centerY - initialH / 2;
    const initialBottom = centerY + initialH / 2;

    const textGap = 120; // увеличенный отступ
    const textTop = '44%'; // позиция по вертикали

    // Функция для обновления всех элементов
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

      // Обновляем 4 блока
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

      // Позиционируем текст
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

    // Устанавливаем начальные значения сразу
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
          // Показываем пины когда завершено на 80%
          if (self.progress > 0.8 && !showPins.value) {
            showPins.value = true;
            showFilterButton.value = true;
          } else if (self.progress <= 0.8 && showPins.value) {
            showPins.value = false;
            showFilterButton.value = false;
          }
        },
        onComplete: () => {
          showPins.value = true;
          showFilterButton.value = true;
        },
      },
    });

    // Анимируем размер отверстия
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

    // Текст не меняет прозрачность и не "наезжает": его раздвигает расширяющийся контейнер
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.enhanced-section {
  height: 200vh; /* Достаточно места для скролла */
  position: relative;
  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }
}

.sticky-container {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }
  justify-content: center;
  overflow: hidden;
  background: #e6dfd8;
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
}

.overlay-bar {
  position: absolute;
  background: #e6dfd8;
  z-index: 1;
  backface-visibility: hidden;
  will-change: width, height, top, left;
  transform: translateZ(0);
  image-rendering: crisp-edges;
  outline: 1px solid transparent; /* предотвращает моргание границ */
}

.overlay-top {
  top: 0;
  left: 0;
  width: 100%;
  height: 0; /* анимируется */
}

.overlay-bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0; /* анимируется */
}

.overlay-left {
  top: 0; /* анимируется */
  left: 0;
  width: 0; /* анимируется */
  height: 0; /* анимируется */
}

.overlay-right {
  top: 0; /* анимируется */
  right: 0;
  width: 0; /* анимируется */
  height: 0; /* анимируется */
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
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
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

/* Инфо-панель для пина */
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

  /* Стрелочка, указывающая на пин */
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 8px solid transparent;
  }

  /* Стрелочка справа (по умолчанию) */
  &::before {
    left: -16px;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: #ffffff;
  }

  /* Стрелочка слева */
  &[data-position='left']::before {
    left: auto;
    right: -16px;
    border-right-color: transparent;
    border-left-color: #ffffff;
  }

  /* Стрелочка сверху */
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

/* Кнопка подбора по параметрам */
.button--orange {
  background-color: $accent-color-orange;
  color: $text-color-white;
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
    transform: translateY(-2px);
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

/* Адаптивность */
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

  /* Адаптивные стили для плашки пина */
  .pin-info-panel {
    min-width: 200px;
    max-width: 280px;
    padding: 16px;
    font-size: 14px;
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

  /* Уменьшенные стрелочки на мобильных */
  .pin-info-panel::before {
    border-width: 6px;
  }

  .pin-info-panel::before {
    left: -12px;
  }

  .pin-info-panel[data-position='left']::before {
    right: -12px;
  }

  .pin-info-panel[data-position='right-top']::before,
  .pin-info-panel[data-position='left-top']::before {
    bottom: -12px;
  }
}
</style>

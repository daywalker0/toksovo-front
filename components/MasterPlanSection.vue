<template>
  <section ref="sectionRef" class="enhanced-section">
    <div class="sticky-container">
      <!-- Текстовый контент -->
      <div ref="textContentRef" class="text-content">
        <div ref="textLeftRef" class="text-left">Ген.</div>
        <div ref="textRightRef" class="text-right">План</div>
      </div>

      <!-- Анимируемая картинка -->
      <div ref="imageMaskRef" class="image-mask">
        <img src="../assets/img/gen-plan.jpg" alt="Main image" class="reveal-image" />
      </div>

      <!-- Пинсы которые появляются после раскрытия -->
      <div v-if="showPins" class="pins-container">
        <div
          v-for="(pin, index) in pins"
          :key="index"
          class="pin"
          :class="{ 'pin--active': pin.active, 'pin--hover': pin.active && hoveredPinIndex === index }"
          :style="{
            top: `${pin.y}%`,
            left: `${pin.x}%`,
            transform: `translate(-50%, -50%)`
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
      <button v-if="showFilterButton" class="button button--orange button--filter" @click="handleFilterClick">
        Подбор по параметрам
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';

const sectionRef = ref(null);
const imageMaskRef = ref(null);
const textLeftRef = ref(null);
const textRightRef = ref(null);
const textContentRef = ref(null);
const showPins = ref(false);
const showFilterButton = ref(false);
const hoveredPin = ref(null);
const hoveredPinIndex = ref(null);
const isPanelHovered = ref(false);
let closeTimeoutId = null;

// Данные для пинов
const pins = ref([
  { id: 1, x: 30, y: 40, label: 'Объект 1', active: true },
  { id: 2, x: 15, y: 25, label: 'Парк', active: false },
  { id: 3, x: 45, y: 20, label: 'Школа', active: true },
  { id: 4, x: 70, y: 35, label: 'Торговый центр', active: true },
  { id: 5, x: 25, y: 60, label: 'Больница', active: false },
  { id: 6, x: 55, y: 70, label: 'Спорткомплекс', active: true },
  { id: 7, x: 80, y: 15, label: 'Детский сад', active: false },
  { id: 8, x: 10, y: 45, label: 'Библиотека', active: true },
  { id: 9, x: 65, y: 55, label: 'Кафе', active: false },
  { id: 10, x: 35, y: 80, label: 'Аптека', active: true },
  { id: 11, x: 75, y: 25, label: 'Банк', active: false },
  { id: 12, x: 20, y: 75, label: 'Почта', active: true },
  { id: 13, x: 50, y: 85, label: 'Автосервис', active: false },
  { id: 14, x: 85, y: 60, label: 'Салон красоты', active: true },
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

const panelStyle = computed(() => {
  if (!hoveredPin.value) return {};
  const offsetX = 40; // отступ справа от пина
  const offsetY = 100; // опустить панель ниже пина
  return {
    top: `calc(${hoveredPin.value.y}% + ${offsetY}px)`,
    left: `calc(${hoveredPin.value.x}% + ${offsetX}px)`,
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
    if (!sectionRef.value || !imageMaskRef.value) {
      console.error('Элементы не найдены');
      return;
    }

    // Быстрые сеттеры для синхронных обновлений без лагов
    const setLeftX = textLeftRef.value ? gsap.quickSetter(textLeftRef.value, 'x', 'px') : null;
    const setRightX = textRightRef.value ? gsap.quickSetter(textRightRef.value, 'x', 'px') : null;
    const setMaskW = imageMaskRef.value ? gsap.quickSetter(imageMaskRef.value, 'width', 'px') : null;
    const setMaskH = imageMaskRef.value ? gsap.quickSetter(imageMaskRef.value, 'height', 'px') : null;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top', // Анимация начинается когда секция в самом верху
        end: '+=100%', // Анимация занимает 100% высоты секции
        scrub: 1,
        markers: false,
        onEnter: () => {
          console.log('Секция вошла в поле зрения');
        },
        onUpdate: self => {
          console.log('ScrollTrigger progress:', self.progress);
          // Показываем пины и кнопку фильтра когда анимация завершена на 90%
          if (self.progress > 0.9 && !showPins.value) {
            showPins.value = true;
            showFilterButton.value = true;
            console.log('Пины и кнопка фильтра показаны по прогрессу');
          } else if (self.progress <= 0.9 && showPins.value) {
            showPins.value = false;
            showFilterButton.value = false;
            console.log('Пины и кнопка фильтра скрыты по прогрессу');
          }
          // Остальные апдейты выполняются в твине state.t ниже
        },
        onComplete: () => {
          // Убеждаемся что пины и кнопка фильтра показаны после завершения анимации
          showPins.value = true;
          showFilterButton.value = true;
        },
        onLeave: () => {
          console.log('Секция покинула поле зрения');
        },
      },
    });

    // Начальное состояние - показываем прямоугольник 422x563px в центре
    gsap.set(imageMaskRef.value, {
      width: '422px',
      height: '563px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      scale: 1,
      opacity: 1,
    });

    // Начальные состояния текста: контейнер совпадает с маской, элементы по краям
    if (textContentRef.value) {
      gsap.set(textContentRef.value, {
        width: '422px',
        height: '563px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
    }
    if (textLeftRef.value && textRightRef.value) {
      gsap.set([textLeftRef.value, textRightRef.value], { xPercent: 0 });
    }

    // Общий драйвер анимации, который синхронно обновляет размеры маски и позиции текста
    const state = { t: 0 };
    tl.to(state, {
      t: 1,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const w = gsap.utils.interpolate(422, vw, state.t);
        const h = gsap.utils.interpolate(563, vh, state.t);
        const gapPx = 24;
        if (setMaskW) setMaskW(w);
        if (setMaskH) setMaskH(h);
        if (setLeftX && setRightX) {
          setLeftX(-(w / 2 + gapPx));
          setRightX(w / 2 + gapPx);
        }
      },
    });

    // Текст не меняет прозрачность и не "наезжает": его раздвигает расширяющийся контейнер

  }
});
</script>

<style lang="scss" scoped>
.enhanced-section {
  height: 200vh; /* Достаточно места для скролла */
  position: relative;
}

.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e6dfd8;
}

.text-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0; /* Текст под прямоугольником */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1100px;
  color: $text-color-primary;
  font-size: 118px;
  font-weight: 400;
  pointer-events: none
}

.text-left,
.text-right {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  letter-spacing: 0.1em;
  opacity: 0.9;
  will-change: transform;
}

.image-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 422px;
  height: 563px;
  z-index: 2; /* Прямоугольник выше текста, чтобы текст был под ним */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Fallback стили на случай если GSAP не загрузится */
}

.reveal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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
  transition: background .3s;
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
  background: #FFE8CC;
  border: 2px solid #FF8A00;
  color: #FF8A00;
  transition: background .3s;
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

  &:hover {
    background-color: #e66418; /* примерно на 10% темнее $accent-color-orange (#ff7c20) */
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.button--filter {
  position: absolute;
  bottom: 48px;
  left: 44px;
  z-index: 10;
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
}
</style>

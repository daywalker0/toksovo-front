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
          :class="{ 'pin--active': pin.active }"
          :style="{
            top: `${pin.y}%`,
            left: `${pin.x}%`,
            transform: `translate(-50%, -50%)`
          }"
          @click="handlePinClick(pin)"
        >
          <div class="pin-dot">{{ pin.id }}</div>
          <div class="pin-label">{{ pin.label }}</div>
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
import { ref, onMounted, nextTick } from 'vue';

const sectionRef = ref(null);
const imageMaskRef = ref(null);
const textLeftRef = ref(null);
const textRightRef = ref(null);
const textContentRef = ref(null);
const showPins = ref(false);
const showFilterButton = ref(false);

// Данные для пинов
const pins = ref([
  { id: 1, x: 30, y: 40, label: 'Объект 1', active: true },
  { id: 1, x: 15, y: 25, label: 'Парк', active: false },
  { id: 1, x: 45, y: 20, label: 'Школа', active: true },
  { id: 1, x: 70, y: 35, label: 'Торговый центр', active: true },
  { id: 1, x: 25, y: 60, label: 'Больница', active: false },
  { id: 1, x: 55, y: 70, label: 'Спорткомплекс', active: true },
  { id: 1, x: 80, y: 15, label: 'Детский сад', active: false },
  { id: 1, x: 10, y: 45, label: 'Библиотека', active: true },
  { id: 1, x: 65, y: 55, label: 'Кафе', active: false },
  { id: 1, x: 35, y: 80, label: 'Аптека', active: true },
  { id: 1, x: 75, y: 25, label: 'Банк', active: false },
  { id: 1, x: 20, y: 75, label: 'Почта', active: true },
  { id: 1, x: 50, y: 85, label: 'Автосервис', active: false },
  { id: 1, x: 85, y: 60, label: 'Салон красоты', active: true },
]);

const handlePinClick = pin => {
  console.log('Клик по пину:', pin.label);
  // Здесь можно добавить логику для показа модального окна или другой реакции
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

.pin:hover {
  transform: translate(-50%, -50%) scale(1.1);
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
  font-family: 'Akrobat';
  font-weight: 900;
  font-size: 18px;
  line-height: 100%;
}

.pin:not(.pin--active) .pin-dot {
  background: rgba(44, 50, 44, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.pin-label {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pin:hover .pin-label {
  opacity: 1;
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
.button--filter {
  position: absolute;
  bottom: 48px;
  left: 44px;
  z-index: 10;
  background-color: $accent-color-orange;
  color: $text-color-white;
  border: none;
  font-size: 18px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;

  &:hover {
    background-color: darken($accent-color-orange, 10%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
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

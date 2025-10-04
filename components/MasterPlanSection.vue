<template>
  <section ref="sectionRef" class="enhanced-section">
    <div class="sticky-container">
      <!-- Текстовый контент -->
      <div class="text-content">
        <h1># ГЕН.</h1>
        <h2>Айх то мёк</h2>
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
          :style="{ left: pin.x + '%', top: pin.y + '%' }"
          @click="handlePinClick(pin)"
        >
          <div class="pin-dot"></div>
          <div class="pin-label">{{ pin.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (process.client) {
  gsap.registerPlugin(ScrollTrigger);
}

const sectionRef = ref(null);
const imageMaskRef = ref(null);
const showPins = ref(false);

// Данные для пинов
const pins = ref([
  { x: 30, y: 40, label: 'Объект 1' },
  { x: 60, y: 25, label: 'Объект 2' },
  { x: 45, y: 65, label: 'Объект 3' },
  { x: 75, y: 50, label: 'Объект 4' },
]);

const handlePinClick = pin => {
  console.log('Клик по пину:', pin.label);
  // Здесь можно добавить логику для показа модального окна или другой реакции
};

onMounted(() => {
  if (process.client) {
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
          // Показываем пины когда анимация завершена на 90%
          if (self.progress > 0.9 && !showPins.value) {
            showPins.value = true;
          } else if (self.progress <= 0.9 && showPins.value) {
            showPins.value = false;
          }
        },
        onLeave: () => {
          console.log('Секция покинула поле зрения');
        },
      },
    });

    // Начальное состояние - картинка скрыта
    gsap.set(imageMaskRef.value, {
      clipPath: 'inset(50% 0%)',
      scale: 0.9,
      opacity: 0.8,
    });

    // Анимация раскрытия картинки
    tl.to(imageMaskRef.value, {
      clipPath: 'inset(0% 0%)',
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    });

    // Анимация текста (немного исчезает при раскрытии)
    tl.to(
      '.text-content',
      {
        opacity: 0.3,
        scale: 0.95,
        duration: 0.5,
      },
      0
    );
  }
});
</script>

<style scoped>
.enhanced-section {
  height: 200vh; /* Достаточно места для скролла */
  position: relative;
}

.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh; /* Занимает весь экран */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000; /* Черный фон как на скриншоте */
}

.text-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  text-transform: uppercase;
}

.text-content h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.text-content h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  opacity: 0.9;
  letter-spacing: 0.2em;
}

.image-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pin:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.pin-dot {
  width: 12px;
  height: 12px;
  background: #ff0000;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #ff0000;
  animation: pulse 2s infinite;
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

/* Адаптивность */
@media (max-width: 768px) {
  .text-content h1 {
    font-size: 2.5rem;
  }

  .text-content h2 {
    font-size: 1.2rem;
  }

  .pin-label {
    font-size: 10px;
    padding: 2px 6px;
  }
}
</style>

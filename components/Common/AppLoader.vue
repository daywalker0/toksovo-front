<template>
  <Transition name="loader-fade">
    <div v-if="loading" class="app-loader">
      <div class="loader-content">
        <!-- Анимированный лоадер -->
        <div class="spinner">
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
        </div>

        <!-- Текст загрузки -->
        <p class="loader-text">Загрузка...</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.app-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.loader-content {
  text-align: center;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.spinner-circle {
  width: 12px;
  height: 12px;
  background: #007bff;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner-circle:nth-child(1) {
  animation-delay: -0.32s;
}
.spinner-circle:nth-child(2) {
  animation-delay: -0.16s;
}
.spinner-circle:nth-child(3) {
  animation-delay: -0.08s;
}
.spinner-circle:nth-child(4) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loader-text {
  color: #333;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

/* Анимации появления/исчезновения */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>

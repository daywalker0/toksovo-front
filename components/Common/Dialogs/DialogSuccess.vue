<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="success-dialog">
      <div class="success-icon">
        <svg width="54" height="51" viewBox="0 0 54 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.7353 21.007C16.721 20.0072 15.1997 20.0072 14.1853 21.007C13.1712 22.0067 13.1712 23.5063 14.1853 24.5062L24.5815 35.5035C25.0887 36.0035 25.8493 36.2533 26.3565 36.2533C27.1172 36.2533 27.8778 36.0035 28.1315 35.2537L52.9808 4.5109C53.7415 3.51113 53.7415 1.76155 52.4737 1.01172C51.713 0.261901 50.1917 0.261902 49.1773 1.5116L44.106 7.76012C39.5418 3.26119 32.9492 0.511835 26.3565 0.511835C12.4104 0.511835 1 11.7592 1 25.506C1 39.2527 12.4104 50.5 26.3565 50.5C40.3027 50.5 51.713 39.2527 51.713 25.506C51.713 23.2565 51.4595 21.007 50.6988 18.7575C50.1917 17.5078 48.9238 16.758 47.656 17.008C46.3882 17.2578 45.6275 18.7575 45.881 20.0072C46.3882 21.7568 46.6417 23.7563 46.6417 25.506C46.6417 36.5033 37.5133 45.5012 26.3565 45.5012C15.1997 45.5012 6.0713 36.5033 6.0713 25.506C6.0713 14.5085 15.1997 5.51065 26.3565 5.51065C31.935 5.51065 37.0063 7.76012 41.0633 11.7592L26.3565 30.0048L17.7353 21.007Z" fill="#4C5E36"/>
        </svg>
      </div>
      
      <h2 class="success-title">Спасибо за заявку!</h2>
      
      <p class="success-text">
        Мы свяжемся с вами в течении одного рабочего дня.
      </p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue';

defineProps<{ modelValue: boolean }>();
defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
}>();
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.success-dialog {
  max-width: 460px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: start;

  @media (max-width: $breakpoint-x) {
    max-width: 100%;
    align-items: center;
  }
}

.success-icon {
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-title {
  font-size: 46px;
  line-height: 90%;
  font-weight: 400;
  color: #2C322C;
  margin-bottom: 20px;
  font-family: 'Bona Nova SC';
  max-width: 50%;
  @media (max-width: $breakpoint-x) {
    max-width: 100%;
    text-align: center;
  }
}

.success-text {
  font-size: 22px;
  line-height: 140%;
  font-weight: 500;
  color: #2C322C;
  font-family: 'Akrobat';
  max-width: 80%;
  @media (max-width: $breakpoint-x) {
    max-width: 100%;
    text-align: center;
  }
}

:deep(.dialog-overlay:has(.success-dialog)) {
  @media (max-width: $breakpoint-x) {
    align-items: flex-end !important;
    padding: 0 !important;
    height: 100vh !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
  }
}

:deep(.dialog-content:has(.success-dialog)) {
  @media (max-width: $breakpoint-x) {
    max-width: 100% !important;
    width: 100% !important;
    height: calc(100vh - env(safe-area-inset-bottom)) !important;
    max-height: calc(100vh - env(safe-area-inset-bottom)) !important;
    margin: 0 !important;
    border-radius: 0 !important;
    padding: calc(40px + env(safe-area-inset-top)) 20px calc(20px + env(safe-area-inset-bottom))
      20px !important;
    background: $bg-color-1 !important;
  }
}

/* Позиционирование кнопки закрытия - только мобильная версия */
@media (max-width: 599px) {
  :deep(.dialog-close) {
    position: absolute !important;
    top: calc(20px + env(safe-area-inset-top)) !important;
    right: 20px !important;
    width: 40px !important;
    height: 40px !important;
    z-index: 10 !important;
    border: 1px solid #2c322c !important;

    svg path {
      fill: #2c322c !important;
    }
  }
}
</style>


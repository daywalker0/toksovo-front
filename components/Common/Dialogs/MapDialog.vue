<template>
  <Transition name="map-dialog">
    <div v-if="modelValue" class="map-dialog" @click.self="closeDialog">
      <div class="map-dialog__container">
        <!-- Кнопка закрытия -->
        <button class="map-dialog__close" @click="closeDialog" aria-label="Закрыть карту">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M14 0.824833L13.1752 0L7 6.17517L0.824833 0L0 0.824833L6.17517 7L0 13.1752L0.824833 14L7 7.82483L13.1752 14L14 13.1752L7.82483 7L14 0.824833Z"
              fill="#F8F3ED"
            />
          </svg>
        </button>

        <!-- Карта -->
        <div class="map-dialog__map">
          <YandexMap
            v-if="modelValue"
            key="dialog-map"
            :center="center"
            :zoom="zoom"
            :locations="locations"
            :activeCategories="activeCategories"
            :showZoomControls="true"
          />
        </div>

        <!-- Фильтры внизу -->
        <div class="map-dialog__filters">
          <div class="map-dialog__filter-tabs">
            <!-- Кнопка "Актив" (все) -->
            <button
              class="map-dialog__filter-btn"
              :class="{ active: filterMode === 'all' }"
              @click="handleAllActive"
            >
              <span>Актив (По умолчанию все)</span>
            </button>

            <!-- Кнопка "Выкл" (все выкл) -->
            <button
              class="map-dialog__filter-btn"
              :class="{ active: filterMode === 'none' }"
              @click="handleAllInactive"
            >
              <span>Выкл</span>
            </button>

            <!-- Категории -->
            <button
              v-for="cat in categories"
              :key="cat.key"
              class="map-dialog__filter-btn"
              :class="{ active: cat.active, custom: filterMode === 'custom' }"
              @click="handleToggleCategory(cat)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import YandexMap from '~/components/YandexMap.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  center: {
    type: Array,
    required: true,
  },
  zoom: {
    type: Number,
    default: 15,
  },
  locations: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  activeCategories: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'toggle-category', 'all-active', 'all-inactive']);

const filterMode = ref('all'); // 'all', 'none', 'custom'

const closeDialog = () => {
  emit('update:modelValue', false);
};

const handleAllActive = () => {
  filterMode.value = 'all';
  emit('all-active');
};

const handleAllInactive = () => {
  filterMode.value = 'none';
  emit('all-inactive');
};

const handleToggleCategory = cat => {
  filterMode.value = 'custom';
  emit('toggle-category', cat);
};

// Определяем режим при изменении категорий
watch(
  () => props.activeCategories,
  newVal => {
    if (newVal.length === props.categories.length) {
      filterMode.value = 'all';
    } else if (newVal.length === 0) {
      filterMode.value = 'none';
    } else {
      filterMode.value = 'custom';
    }
  },
  { immediate: true }
);

// Блокируем скролл body при открытии и скрываем хедер
watch(
  () => props.modelValue,
  isOpen => {
    if (process.client) {
      const header = document.querySelector('.header');
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        if (header) {
          header.style.display = 'none';
        }
      } else {
        document.body.style.overflow = '';
        if (header) {
          header.style.display = '';
        }
      }
    }
  }
);
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.map-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100svh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &__container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10002;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $accent-color-brown;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(44, 50, 44, 1);
      transform: rotate(90deg);
    }

    svg {
      transition: transform 0.3s ease;
    }
  }

  &__map {
    flex: 1;
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  &__filters {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: transparent;
    padding: 0 0 40px 20px;
    z-index: 10001;

    // Градиент справа, показывающий что есть еще контент
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 60px;
      background: linear-gradient(to left, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
      pointer-events: none;
    }
  }

  &__filter-tabs {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    padding-right: 16px; // Добавляем отступ справа для последних элементов
    scroll-behavior: smooth; // Плавная прокрутка
    -webkit-overflow-scrolling: touch; // Плавный свайп на iOS

    // Скрываем скроллбар но оставляем функциональность
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }

  &__filter-btn {
    padding: 8px 16px;
    border-radius: 50px;
    background: $utility-color-1;
    border: 2px solid transparent;
    color: $text-color-primary;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Akrobat';
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    flex-shrink: 0;

    &.active {
      background: $accent-color-orange;
      color: $text-color-white;
      border-color: $accent-color-orange;
    }

    &:hover:not(.active) {
      border-color: $accent-color-orange;
    }
  }
}

// Анимации
.map-dialog-enter-active,
.map-dialog-leave-active {
  transition: opacity 0.3s ease;
}

.map-dialog-enter-from,
.map-dialog-leave-to {
  opacity: 0;
}

.map-dialog-enter-active .map-dialog__container,
.map-dialog-leave-active .map-dialog__container {
  transition: transform 0.3s ease;
}

.map-dialog-enter-from .map-dialog__container,
.map-dialog-leave-to .map-dialog__container {
  transform: scale(0.95);
}
</style>

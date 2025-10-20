<template>
  <div class="apartments-section section">
    <div class="apartments-section__container container">
      <!-- Левая часть с информацией -->
      <div class="info-block">
        <div class="info-block__wrap">
          <div class="apartment-title">{{ currentApartment.name }}</div>

          <!-- Информация о квартире -->
          <div class="apartment-info">
            <div class="info-row">
              <div class="info-item">
                <div class="info-label">Площадь</div>
                <div class="info-value">{{ currentApartment.area }} М²</div>
              </div>
              <div class="info-item">
                <div class="info-label">Этажность</div>
                <div class="info-value">{{ currentApartment.floors }}</div>
              </div>
            </div>
            <div class="info-item info-item-price">
              <div class="info-label">Стоимость</div>
              <div class="info-value">{{ currentApartment.price }} ₽</div>
            </div>
          </div>

          <!-- Особенности квартиры -->
          <div class="apartment-features">
            <div class="apartment-features--title info-label">Особенности квартиры</div>
            <ul>
              <li v-for="(feat, i) in currentApartment.features" :key="i">
                {{ feat }}
              </li>
            </ul>
          </div>

          <button class="more-btn">ПОДРОБНЕЕ</button>
        </div>
      </div>

      <!-- Правая часть с изображениями -->
      <div class="gallery-block">
        <!-- Переключение типов квартир -->

        <div class="apps-switcher">
          <div
            v-for="(apps, index) in apartmentTypes"
            :key="apps.id"
            class="apps-switcher--item"
            :class="{ active: currentType === apps.id }"
            @click="switchApartmentType(apps.id)"
          >
            <template v-if="apps.id === 0"> Студии </template>
            <template v-else>
              {{ apps.id }}
            </template>
          </div>
        </div>

        <!-- Главное изображение с навигацией -->
        <div class="main-image-wrapper">
          <!-- Стрелка назад -->
          <button
            class="nav-arrow nav-arrow--prev"
            :class="{ invisible: currentImageIndex === 0 }"
            @click="currentImageIndex > 0 && switchImage(currentImageIndex - 1)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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

          <div class="main-image">
            <img :src="currentApartment.images[currentImageIndex]" :alt="currentApartment.title" />
          </div>

          <!-- Стрелка вперед -->
          <button
            class="nav-arrow nav-arrow--next"
            :class="{ invisible: currentImageIndex >= currentApartment.images.length - 1 }"
            @click="
              currentImageIndex < currentApartment.images.length - 1 &&
              switchImage(currentImageIndex + 1)
            "
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import appsItem1 from '@/assets/img/apps-item-1.png';

defineProps({
  apartments: {
    type: Array,
    required: true,
  },
});

const currentType = ref(0); // текущий выбранный тип квартиры
const currentImageIndex = ref(0); // текущее изображение в слайдере

// Типы квартир с данными
const apartmentTypes = ref([
  {
    id: 0,
    name: 'Cтудии',
    area: '15.8',
    floors: '2-9',
    price: '312 660',
    features: ['Просторная кухня гостинная', 'Дополнительная гардеробная'],
      images: [appsItem1, appsItem1, appsItem1],
  },
  {
    id: 1,
    name: '1-К. №14',
    area: '31.8',
    floors: '2-9',
    price: '312 660',
    features: ['Просторная кухня гостинная', 'Дополнительная гардеробная'],
      images: [appsItem1, appsItem1, appsItem1],
  },
  {
    id: 2,
    name: '2-К. №15',
    area: '41.02',
    floors: '2-8',
    price: '285 400',
    features: ['Компактная планировка', 'Балкон с панорамным видом', 'Современная отделка'],
      images: [appsItem1, appsItem1, appsItem1],
  },
  {
    id: 3,
    name: '3К. №16',
    area: '51.75',
    floors: '3-10',
    price: '345 200',
    features: ['Большая гостиная', 'Две спальни', 'Отдельная кухня', 'Два санузла'],
      images: [appsItem1, appsItem1, appsItem1],
  },
]);

// Текущие данные квартиры в зависимости от выбранного типа
const currentApartment = computed(() => {
  return apartmentTypes.value[currentType.value];
});

// Функция переключения типа квартиры
const switchApartmentType = typeIndex => {
  currentType.value = typeIndex;
  currentImageIndex.value = 0; // сбрасываем на первое изображение при смене типа
};

// Функция переключения изображения
const switchImage = index => {
  currentImageIndex.value = index;
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.apartments-section {
  min-height: 100vh;

  @media (max-width: $breakpoint-x) {
    min-height: 100svh;
  }

  &__container {
    height: 100%;
    padding-bottom: 120px;
    display: flex;
    gap: 160px;

    @media (max-width: $breakpoint-sm) {
      gap: 40px;
    }

    @media (max-width: $breakpoint-x) {
      flex-direction: column;
      gap: 40px;
      padding-bottom: 60px;
    }
  }
}

.info-block {
  width: 420px;
  background-color: $bg-color-2;
  border-radius: 7px;
  min-height: 760px;

  @media (max-width: $breakpoint-x) {
    width: 100%;
    min-height: auto;
    order: 2;
  }

  &__wrap {
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 100%;
    min-height: 760px;

    @media (max-width: $breakpoint-x) {
      min-height: auto;
      padding: 20px;
    }
  }
}

.gallery-block {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;

  @media (max-width: $breakpoint-x) {
    order: 1;
    width: 100%;
    margin-top: 20px;
  }
}

.apartment-number {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

.apartment-title {
  font-size: 42px;
  padding-bottom: 38px;
  width: 100%;
  margin-bottom: 12px;

  @media (max-width: $breakpoint-lg) {
    padding-bottom: 24px;
    font-size: 36px;
  }

  @media (max-width: $breakpoint-x) {
    font-size: 28px;
    padding-bottom: 0;
    margin-bottom: 20px;
  }
}

.apartment-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.info-row {
  display: flex;
  gap: 40px;
  border-bottom: 1px solid $utility-color-1;
  padding-bottom: 24px;
  margin-bottom: 12px;
  width: 100%;

  @media (max-width: $breakpoint-lg) {
    gap: 20px;
    padding-bottom: 16px;
    margin-bottom: 8px;
  }

  @media (max-width: $breakpoint-x) {
    flex-direction: column;
    gap: 0;
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid $utility-color-1;
  padding-bottom: 24px;
  margin-bottom: 12px;

  @media (max-width: $breakpoint-lg) {
    padding-bottom: 16px;
    margin-bottom: 8px;
  }

  .info-row & {
    border-top: 1px solid $utility-color-1;
    padding-top: 12px;
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
    flex: 1;

    @media (max-width: $breakpoint-x) {
      width: 100%;
      border-bottom: 1px solid $utility-color-1;
      padding-bottom: 13px;
      margin-bottom: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-top: none;
    }
  }

  @media (max-width: $breakpoint-x) {
    width: 100%;
    margin-bottom: 0;
  }
}

.info-item-price {
  padding-bottom: 48px;
  border-bottom: none;

  @media (max-width: $breakpoint-lg) {
    padding-bottom: 24px;
  }

  @media (max-width: $breakpoint-x) {
    width: 100%;
    padding-top: 12px;
    padding-bottom: 13px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.info-label {
  font-size: 16px;
  font-family: 'Akrobat';
  margin-bottom: 8px;
  color: $text-color-secondary;
  @media (max-width: $breakpoint-lg) {
    font-size: 14px;
  }
  @media (max-width: $breakpoint-x) {
    margin-bottom: 0;
  }
}

.info-value {
  font-size: 32px;
  color: $text-color-primary;
  @media (max-width: $breakpoint-lg) {
    font-size: 26px;
  }
  @media (max-width: $breakpoint-x) {
    font-size: 20px;
  }
}

.info-value.price {
  color: #dc2626;
  font-weight: 700;
}

.apartment-features {
  border-top: 1px solid $utility-color-1;
  width: 100%;
  padding-top: 12px;
  margin-bottom: 100px;
  min-height: 200px; // Фиксируем минимальную высоту для секции особенностей
  &--title {
    margin-bottom: 20px;
  }

  @media (max-width: $breakpoint-lg) {
    margin-bottom: 30px;
  }

  @media (max-width: $breakpoint-x) {
    margin-bottom: 20px;
    min-height: auto;
  }
}

.apartment-features ul {
  list-style: decimal;
  font-size: 22px;
  font-family: 'Akrobat';
  padding: 0 20px;
  @media (max-width: $breakpoint-lg) {
    font-size: 18px;
  }
}

.apartment-features li {
  margin-bottom: 12px;
}

.apps-switcher {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;

  &--item {
    min-width: 54px;
    height: 54px;
    border-radius: 50px;
    border: 1px solid $utility-color-1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-color-secondary;
    font-size: 18px;
    font-family: 'Akrobat';
    font-weight: 700;
    transition: 0.3s;
    padding: 14px 16px;
    cursor: pointer;
    background-color: transparent;

    @media (max-width: $breakpoint-lg) {
      min-width: 41px;
      height: 41px;
      font-size: 14px;
    }

    &:hover {
      background-color: $text-color-primary;
      border-color: $text-color-primary;
      color: $text-color-white;
      transition: 0.3s;
    }
    &.active {
      background-color: $text-color-primary;
      border-color: $text-color-primary;
      color: $text-color-white;
    }
  }
}

.layouts-section {
  margin-top: 1rem;
}

.layouts-table {
  width: 100%;
  margin-bottom: 0.5rem;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.table-row.header {
  font-weight: 600;
  background-color: #f3f4f6;
}

.table-cell {
  flex: 1;
  padding: 0.75rem 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.table-cell:first-child {
  text-align: left;
  flex: 0.5;
  font-weight: 600;
  cursor: default;
}

.table-cell.active {
  background-color: #000;
  color: white;
}

.table-cell:not(:first-child):hover {
  background-color: #e5e7eb;
}

.layouts-note {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

.more-btn {
  border-radius: 50px;
  background-color: $accent-color-orange;
  padding: 14px;
  font-family: 'Akrobat';
  font-weight: 700;
  color: $text-color-white;
  font-size: 18px;
  width: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  @media (max-width: $breakpoint-x) {
    font-size: 14px;
  }

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
}

.main-image-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media (max-width: $breakpoint-x) {
    gap: 12px;
    height: 340px;
  }
}

.main-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1240px) {
    max-height: 400px;
  }

  @media (max-width: $breakpoint-lg) {
    max-height: 350px;
  }

  @media (max-width: $breakpoint-md) {
    max-height: 300px;
  }
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;

  @media (max-width: 1240px) {
    max-height: 400px;
  }

  @media (max-width: $breakpoint-lg) {
    max-height: 350px;
  }

  @media (max-width: $breakpoint-md) {
    max-height: 300px;
  }

  @media (max-width: $breakpoint-x) {
    object-fit: cover;
    height: 100%;
  }
}

.nav-arrow {
  width: 54px;
  height: 54px;
  min-width: 54px;
  border-radius: 50%;
  border: 1px solid $utility-color-1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $text-color-secondary;
  transition: 0.3s;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
  flex-shrink: 0;

  &:hover {
    background-color: $text-color-primary;
    border-color: $text-color-primary;
    color: $text-color-white;
    transition: 0.3s;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &--prev {
    order: -1;
  }

  &--next {
    order: 1;
  }

  @media (max-width: $breakpoint-lg) {
    width: 41px;
    height: 41px;
    min-width: 41px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: $breakpoint-x) {
    width: 41px;
    height: 41px;
    min-width: 41px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &.invisible {
    visibility: hidden;
    pointer-events: none;
  }
}
</style>

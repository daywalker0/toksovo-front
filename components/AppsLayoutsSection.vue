<template>
  <div class="apartments-section section">
    <div class="apartments-section__container container">
      <!-- Левая часть с информацией -->
      <div class="info-block">
        <div class="info-block__wrap">
          <div class="apartment-title">{{ currentApartment.name }}</div>

          <!-- Информация о квартире -->
          <div class="apartment-info">
            <div class="info-item">
              <div class="info-label">Площадь</div>
              <div class="info-value">{{ currentApartment.area }} М²</div>
            </div>
            <div class="info-item">
              <div class="info-label">Этажность</div>
              <div class="info-value">{{ currentApartment.floors }}</div>
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

        <!-- Главное изображение -->
        <div class="main-image">
          <img :src="currentApartment.images[currentImageIndex]" :alt="currentApartment.title" />
        </div>

        <!-- Миниатюры для слайдера -->
        <div class="thumbnails">
          <span>Другие планировки:</span>
          <div class="thumbnails-slider">
            <div
              v-for="(image, index) in currentApartment.images"
              :key="index"
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="switchImage(index)"
            >
              <img :src="image" :alt="`Планировка ${index + 1}`" />
            </div>
          </div>
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

<style lang="scss" scoped>@use '@/assets/styles/variables.scss' as *;

.apartments-section {
  min-height: 100vh;
  background-color: #ffffff;

  &__container {
    height: 100%;
    padding-bottom: 120px;
    display: flex;
    gap: 160px;
  }
}

.info-block {
  width: 420px;
  background-color: $bg-color-2;
  border-radius: 7px;
  min-height: 600px; // Фиксируем минимальную высоту

  &__wrap {
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 100%;
    min-height: 600px; // Фиксируем минимальную высоту для внутреннего контейнера
  }
}

.gallery-block {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

.apartment-number {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

.apartment-title {
  font-size: 42px;
  padding-bottom: 48px;
  width: 100%;
  border-bottom: 1px solid $utility-color-1;
  margin-bottom: 12px;
}

.apartment-info {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid $utility-color-1;
  padding-bottom: 24px;
  margin-bottom: 12px;
}

.info-item-price {
  padding-bottom: 48px;
}

.info-label {
  font-size: 16px;
  font-family: 'Akrobat';
  margin-bottom: 8px;
  color: $text-color-secondary;
}

.info-value {
  font-size: 32px;
  color: $text-color-primary;
}

.info-value.price {
  color: #dc2626;
  font-weight: 700;
}

.apartment-features {
  margin-bottom: 100px;
  min-height: 200px; // Фиксируем минимальную высоту для секции особенностей
  &--title {
    margin-bottom: 20px;
  }
}

.apartment-features ul {
  list-style: decimal;
  font-size: 22px;
  font-family: 'Akrobat';
  padding: 0 20px;
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
  transition: 0.3s;
}

.more-btn:hover {
  background-color: #333;
  transition: 0.3s;
}

.main-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.main-image img {
  max-width: 100%;
  height: 100%;
}

.thumbnails {
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    margin-bottom: 8px;
    font-size: 16px;
    font-family: 'Akrobat';
    color: $text-color-secondary;
  }
}

.thumbnails-slider {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  flex: 0 0 180px;
  height: 120px;
  border-radius: 0.375rem;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail.active {
}

.thumbnail:hover {
  border-color: #666;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

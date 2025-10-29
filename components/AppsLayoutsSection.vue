<template>
  <div class="apartments-section section">
    <div class="apartments-section__container container">
      <div class="info-block">
        <div class="info-block__wrap">
          <div class="apartment-title">{{ currentApartment.name }}</div>

          <div class="apartment-info">
            <div class="info-row">
              <div class="info-item">
                <div class="info-label">Площадь</div>
                <div class="info-value">{{ currentApartment.area }}</div>
              </div>
            </div>
            <div class="info-item info-item-price">
              <div class="info-label">Стоимость</div>
              <div class="info-value">{{ currentApartment.price }}</div>
            </div>
          </div>

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

      <div class="gallery-block">
        <div class="apps-switcher">
          <div
            v-for="(category, index) in apartmentCategories"
            :key="category.id"
            class="apps-switcher--item"
            :class="{ active: currentCategory === category.id }"
            @click="switchCategory(category.id)"
          >
            {{ category.name }}
          </div>
        </div>

        <div class="main-image-wrapper">
          <button
            class="nav-arrow nav-arrow--prev"
            :class="{ invisible: currentApartmentIndex === 0 }"
            @click="currentApartmentIndex > 0 && switchApartment(currentApartmentIndex - 1)"
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
            <img :src="currentApartment.image" :alt="currentApartment.name" />
          </div>

          <!-- Стрелка вперед (только на мобильных) -->
          <button
            class="nav-arrow nav-arrow--next"
            :class="{
              invisible: currentApartmentIndex >= currentCategoryData.apartments.length - 1,
            }"
            @click="
              currentApartmentIndex < currentCategoryData.apartments.length - 1 &&
              switchApartment(currentApartmentIndex + 1)
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

        <div class="thumbnails-wrapper">
          <div
            v-for="(apartment, index) in currentCategoryData.apartments"
            :key="apartment.id"
            class="thumbnail"
            :class="{ active: currentApartmentIndex === index }"
            @click="switchApartment(index)"
          >
            <img :src="apartment.image" :alt="`${apartment.name} thumbnail`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

const { getMediaUrl } = useMedia();

const currentCategory = ref(0); // текущая выбранная категория (Студии, 1, 2, 3)
const currentApartmentIndex = ref(0); // текущая квартира в категории
const currentImageIndex = ref(0); // текущее изображение в слайдере

// Категории квартир из API
const apartmentCategories = computed(() => {
  const apartments = props.data?.plan_slider || props.data?.kvartiries || [];
  
  if (!Array.isArray(apartments) || apartments.length === 0) {
    return [];
  }

  // Группируем квартиры по категориям (студии, 1-комн, 2-комн и т.д.)
  const grouped = {};
  
  apartments.forEach(apt => {
    const categoryName = apt.type || apt.category || 'Другие';
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    
    const mappedFeatures = (apt.apartment_features || apt.features || []).map(f => 
      typeof f === 'string' ? f : f.value || f.title || f.name || ''
    );
    
    grouped[categoryName].push({
      id: apt.id || apt.documentId,
      name: apt.plan_name || apt.name || apt.title,
      area: apt.square || apt.area?.toString() || '0',
      price: apt.price?.toString() || '0',
      features: mappedFeatures,
      image: getMediaUrl(apt.image),
      floors: apt.floor || apt.floors || '',
    });
  });
  
  // Преобразуем в массив категорий
  return Object.keys(grouped).map((name, index) => ({
    id: index,
    name: name,
    apartments: grouped[name],
  }));
});

// Текущая категория квартир
const currentCategoryData = computed(() => {
  return apartmentCategories.value[currentCategory.value] || apartmentCategories.value[0];
});

// Текущая квартира в выбранной категории
const currentApartment = computed(() => {
  return currentCategoryData.value.apartments[currentApartmentIndex.value];
});

// Функция переключения категории квартир
const switchCategory = categoryIndex => {
  currentCategory.value = categoryIndex;
  currentApartmentIndex.value = 0; // сбрасываем на первую квартиру в категории
  currentImageIndex.value = 0; // сбрасываем на первое изображение
};

// Функция переключения квартиры в категории
const switchApartment = apartmentIndex => {
  currentApartmentIndex.value = apartmentIndex;
  currentImageIndex.value = 0; // сбрасываем на первое изображение
};

// Функция переключения изображения
const switchImage = imageIndex => {
  currentImageIndex.value = imageIndex;
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.apartments-section {
  min-height: auto;

  &__container {
    height: 100%;
    padding-bottom: 120px;
    display: flex;
    gap: 160px;

    @media (max-width: $breakpoint-x) {
      flex-direction: column;
      gap: 12px;
      padding-bottom: 60px;
    }
  }
}

.info-block {
  width: 420px;
  background-color: $bg-color-2;
  border-radius: 7px;

  @media (max-width: 1080px) {
    flex: 1.4;
  }
  @media (max-width: $breakpoint-x) {
    width: 100%;
    min-height: auto;
    order: 2;
  }

  &__wrap {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;

    @media (max-width: $breakpoint-md) {
      justify-content: flex-start;
    }

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

  @media (max-width: $breakpoint-md) {
    justify-content: flex-start;
  }

  @media (max-width: $breakpoint-x) {
    order: 1;
    width: 100%;
    margin-top: 20px;
    min-height: auto;
  }
}

.apartment-number {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}
.apartments-section__container {
  max-width: 1440px;
  margin: 0px auto;
}
@media (max-width: 920px) {
  .apartments-section__container {
    gap: 0;
  }
}
.apartment-title {
  font-size: 42px;
  padding-bottom: 32px;
  width: 100%;

  @media (max-width: 1366px) {
    padding-bottom: 0;
  }

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

  @media (max-width: 1366px) {
    padding-bottom: 0;
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
  min-height: 200px;

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
  margin-bottom: 20px;
  position: relative;
  z-index: 10;

  @media (max-width: $breakpoint-x) {
    margin-bottom: 12px;
  }

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
    position: relative;
    z-index: 11;

    @media (max-width: $breakpoint-lg) {
      min-width: 41px;
      height: 41px;
      font-size: 14px;
    }

    @media (max-width: $breakpoint-x) {
      min-width: 48px;
      height: 48px;
      font-size: 16px;
      padding: 13px 16px;
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
  margin-top: auto;

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
  overflow: hidden;
  gap: 20px;
  flex: 1;

  @media (max-width: $breakpoint-md) {
    flex: 1;
  }

  @media (max-width: $breakpoint-x) {
    gap: 12px;
    flex: none;
    min-height: auto;
    aspect-ratio: 1 / 1;
  }
}

.main-image {
  width: 100%;
  height: 100%;
  max-height: 470px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1280px) {
    max-height: 400px;
  }

  @media (max-width: $breakpoint-sm) {
    max-height: 350px;
  }

  @media (max-width: $breakpoint-md) {
    max-height: none;
    flex: 1;
  }

  @media (max-width: $breakpoint-md) {
    height: 340px;
    width: 340px;
  }
}

.main-image img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;

  // @media (max-width: 1280px) {
  //   max-height: 400px;
  // }

  // @media (max-width: $breakpoint-lg) {
  //   max-height: 350px;
  // }

  @media (max-width: $breakpoint-md) {
    max-height: none;
    width: 100%;
    height: 100%;
    min-height: 500px;
    object-fit: contain;
  }

  @media (max-width: $breakpoint-x) {
    height: 100%;
    min-height: auto;
  }
}

.nav-arrow {
  position: absolute;
  top: 50%;

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

  @media (min-width: 600px) {
    display: none;
  }

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
    left: 0;
  }

  &--next {
    order: 1;
    right: 0;
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
    display: flex;
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

.thumbnails-wrapper {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;

  @media (max-width: $breakpoint-x) {
    display: none;
  }
}

.thumbnail {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;

  @media (max-width: $breakpoint-lg) {
    width: 100px;
    height: 100px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &:hover {
    opacity: 1;
    border-color: $utility-color-1;
  }

  &.active {
    opacity: 1;
    border-color: $text-color-primary;
  }
}
</style>

<template>
  <div class="private-housing-section section" @mousemove="onMouseMove">
    <div class="private-housing-section__container container">
      <div class="controls-block">
        <div class="controls-block__wrap">
          <div class="accordion">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="accordion-item"
              :class="{ active: activeIndex === index }"
            >
              <div class="accordion-header" @click="toggleItem(index)">
                <div class="icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="#E6DFD8" stroke-width="3" />
                    <mask id="path-2-inside-1_306_1521" fill="white">
                      <path
                        d="M8 0C9.26248 1.5055e-08 10.507 0.298792 11.6319 0.871948C12.7568 1.4451 13.7301 2.27635 14.4721 3.29772C15.2142 4.31909 15.704 5.50158 15.9015 6.74852C16.099 7.99546 15.9986 9.27144 15.6085 10.4721L12.7629 9.54756C13.0071 8.79592 13.07 7.99716 12.9463 7.21658C12.8227 6.43599 12.5161 5.69575 12.0516 5.05637C11.587 4.41699 10.9778 3.89663 10.2736 3.53784C9.56941 3.17904 8.79031 2.992 8 2.992V0Z"
                      />
                    </mask>
                    <path
                      d="M8 0C9.26248 1.5055e-08 10.507 0.298792 11.6319 0.871948C12.7568 1.4451 13.7301 2.27635 14.4721 3.29772C15.2142 4.31909 15.704 5.50158 15.9015 6.74852C16.099 7.99546 15.9986 9.27144 15.6085 10.4721L12.7629 9.54756C13.0071 8.79592 13.07 7.99716 12.9463 7.21658C12.8227 6.43599 12.5161 5.69575 12.0516 5.05637C11.587 4.41699 10.9778 3.89663 10.2736 3.53784C9.56941 3.17904 8.79031 2.992 8 2.992V0Z"
                      stroke="#4C5E36"
                      stroke-width="6"
                      mask="url(#path-2-inside-1_306_1521)"
                    />
                  </svg>
                </div>

                <span>{{ item.title }}</span>
              </div>
              <div v-show="activeIndex === index" class="accordion-content">
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Две половины для клика по стрелкам -->
      <div class="image-control">
        <div class="image-half left" @click="prevItem">
          <div class="arrow">◀</div>
        </div>
        <div class="image-half right" @click="nextItem">
          <div class="arrow">▶</div>
        </div>

        <!-- Картинка активного item -->
        <img
          class="private-housing-section--bg"
          :src="activeItem.image"
          alt="bg"
          key="activeItem.image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import privateHousingSection1 from '@/assets/img/private-housing-section.jpg';
import privateHousingSection2 from '@/assets/img/live-in-style-item-2.png';

const items = ref([
  {
    title: 'Приватный формат жилья',
    content:
      'Пространство, где каждое утро начинается в тишине и уединении. Здесь вы можете наслаждаться личным комфортом без лишнего шума и суеты города.',
    image: privateHousingSection1,
  },
  {
    title: 'Экология: лес и озеро',
    content:
      'Описание экологических преимуществ - близость к лесу и озеру, чистый воздух и природное окружение.',
    image: privateHousingSection2,
  },
  {
    title: 'Чистовая отделка',
    content: 'Информация о чистовой отделке помещений по стандартам ХОВЕР.',
    image: privateHousingSection1,
  },
  {
    title: 'Инфраструктура',
    content: 'Описание доступной инфраструктуры района и жилого комплекса.',
    image: privateHousingSection2,
  },
  {
    title: '4 этажа',
    content: 'Характеристики четырехэтажного здания, преимущества такой этажности.',
    image: privateHousingSection1,
  },
]);

const activeIndex = ref(0);

const activeItem = computed(() => items.value[activeIndex.value]);

const toggleItem = index => {
  activeIndex.value = activeIndex.value === index ? -1 : index;
};

const nextItem = () => {
  activeIndex.value = (activeIndex.value + 1) % items.value.length;
};

const prevItem = () => {
  activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length;
};

const cursorX = ref(0);
const cursorY = ref(0);

const onMouseMove = e => {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
};
</script>

<style lang="scss" scoped>
.private-housing-section {
  position: relative;
  height: 840px;
  &__container {
    display: flex;
    align-items: flex-end;
    padding: 44px;
    height: 100%;
  }
  &--bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 840px;
    width: 100%;
    object-fit: cover;
    z-index: 0;
    transition: all 0.5s ease;
  }
}

.controls-block {
  height: 384px;
  width: 421px;
  border-radius: 7px;
  position: relative;
  z-index: 5;
  background-color: #fff;

  &__wrap {
    padding: 36px;
  }
}

.accordion {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.accordion-item {
  font-family: 'Akrobat';
  padding-bottom: 8px;
}

.accordion-item.active {
  padding: 0 0 30px;
}

.accordion-item.active:not(:first-child) {
  padding: 30px 0;
}

.accordion-header {
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: $text-color-primary;
  font-size: 24px;
  font-weight: 700;
  width: fit-content;
  opacity: 0.5;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 1;
  }
  .icon {
    margin-right: 12px;
    width: 0;
    opacity: 0;
  }
}

.accordion-item.active .accordion-header {
  font-size: 28px;
  opacity: 1;
  color: $accent-color-green;
  .icon {
    opacity: 1;
    width: fit-content;
  }
}

.accordion-content p {
  font-weight: 600;
  font-size: 18px;
  line-height: 140%;
  opacity: 0.8;
  color: $text-color-primary;
  margin-top: 10px;
}

.accordion-content {
  animation: fadeIn 0.3s ease;
}

.image-control {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;

  .image-half {
    width: 50%;
    height: 100%;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: none;
  }
}

.image-half.left {
  cursor: url('../assets/img/cursors/arrow-left-cursor.svg'), auto;
}

.image-half.right {
  cursor: url('../assets/img/cursors/arrow-right-cursor.svg'), auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

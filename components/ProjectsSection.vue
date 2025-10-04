<template>
  <section class="projects-section section">
    <div class="projects-section__container container">
      <h2 class="projects-section__title">Другие проекты</h2>
      <DefaultSlider
        :slides="projectsSlides"
        :slides-per-view="2"
        :space-between="20"
        :show-navigation="true"
      >
        <template #slide="{ slide, active }">
          <div :class="['custom-slide', { active }]">
            <div class="image-container">
              <img :src="slide.image" :alt="slide.title" class="slide-image" />
            </div>
            <div class="content">
              <div class="content--header">
                <div>{{ slide.rented }}</div>
                <div>{{ slide.city }}</div>
              </div>

              <div class="content--title">
                {{ slide.title }}
              </div>

              <div class="content--info">
                <div v-if="slide.houses">
                  <span>{{ slide.housese }} дома</span>
                </div>
                <div v-if="slide.apps">
                  <div class="content--info_dot"></div>
                  <span>{{ slide.apps }} квартир</span>
                </div>
                <div v-if="slide.floors">
                  <div class="content--info_dot"></div>
                  <span>{{ slide.floors }} этажей</span>
                </div>
              </div>

              <div class="content--link-block">
                <a :href="slide.link" class="content--link">Видео</a>
              </div>
            </div>
          </div>
        </template>
      </DefaultSlider>
    </div>
  </section>
</template>

<script setup>
import DefaultSlider from './Common/Sliders/DefaultSlider.vue';
import projectItem1 from '@/assets/img/project-item-1.jpg';
import projectItem2 from '@/assets/img/project-item-2.jpg';
import projectItem3 from '@/assets/img/project-item-3.jpg';

const projectsSlides = [
  {
    title: 'ЖК «Северный меридиан»',
    city: 'г. Бугры',
    rented: 'Сдача: IV кв. 2025',
    image: projectItem1,
    houses: null,
    apps: 339,
    floors: 9,
    link: '#',
  },
  {
    title: 'ЖК «Октябрьский 78»',
    city: 'г. Всеволжск',
    rented: 'Дом сдан в 2023',
    image: projectItem2,
    link: '#',
    houses: 2,
    apps: 80,
    floors: 6,
  },
  {
    title: 'ЖК «Октябрьский 78»',
    city: 'г. Всеволжск',
    rented: 'Дом сдан в 2022',
    image: projectItem3,
    link: '#',
    houses: null,
    apps: 65,
    floors: 6,
  },
  {
    title: 'ЖК «Северный меридиан»',
    city: 'г. Бугры',
    rented: 'Сдача: IV кв. 2025',
    image: projectItem1,
    houses: null,
    apps: 339,
    floors: 9,
    link: '#',
  },
];
</script>

<style lang="scss" scoped>
.projects-section {
  &__container {
    padding-bottom: 120px;
  }
  &__title {
    margin: 0 auto;
    margin-bottom: 60px;
    font-size: 88px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  margin-top: 24px;

  &--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &--title {
    margin-bottom: 12px;
  }

  &--info {
    display: flex;
    align-items: center;
    &_dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: $text-color-secondary;
    }
  }
}
</style>

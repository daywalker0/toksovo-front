<template>
  <div class="locations-section section">
    <div class="locations-section__container container">
      <TitleNew text="Локации рядом" />

      <div class="parallax-block" ref="parallaxSection">
        <div class="parallax-container">
          <!-- Левая колонка -->
          <div class="parallax-column left-column" ref="leftColumn">
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>

            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Конный клуб</div>
                  <div class="card-content--distance">3 км</div>
                </div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Экотропа</div>
                  <div class="card-content--distance">10 км</div>
                </div>
                <div class="card-content__subtitle">«Малиновая гора»</div>
              </div>
            </div>
          </div>

          <!-- Центральная колонка -->
          <div class="parallax-column center-column" ref="centerColumn">
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Песочный пляж</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Учебно-тренировочный центр</div>
                  <div class="card-content--distance">3,4 км</div>
                </div>
                <div class="card-content__subtitle">«Кавголово»</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Парк семейного отдыха</div>
                  <div class="card-content--distance">11 км</div>
                </div>
                <div class="card-content__subtitle">«Зубровник»</div>
              </div>
            </div>
          </div>

          <!-- Правая колонка -->
          <div class="parallax-column right-column" ref="rightColumn">
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
            <div class="card">
              <img class="card-img" src="../assets/img/location-card.png" alt="card" />
              <div class="card-content">
                <div class="card-content__title">
                  <div class="card-content--name">Ресторан «ЛетоБар»</div>
                  <div class="card-content--distance">0,9 км</div>
                </div>
                <div class="card-content__subtitle">на прилегающей территории</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ref, onMounted } from 'vue';
import TitleNew from './Common/TitleNew.vue';

const parallaxSection = ref(null);
const leftColumn = ref(null);
const centerColumn = ref(null);
const rightColumn = ref(null);

onMounted(() => {
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger);

    // Начальные позиции
    gsap.set(centerColumn.value, { y: -150 }); // центр выше
    gsap.set([leftColumn.value, rightColumn.value], { y: 200 }); // боковые ниже

    // Левая колонка (сильнее вверх)
    gsap.to(leftColumn.value, {
      y: -400,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Центральная колонка (вниз)
    gsap.to(centerColumn.value, {
      y: 250,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Правая колонка (сильнее вверх)
    gsap.to(rightColumn.value, {
      y: -400,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxSection.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
});
</script>

<style scoped lang="scss">
.locations-section {
  padding: 120px 0 260px;
  &__title {
    max-width: 508px;
    text-align: center;
    margin: 0 auto;
  }
}

.parallax-block {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 170px;
}

.parallax-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  gap: 40px;
  position: relative;
}

.parallax-column {
  flex: 1;
  opacity: 1;
}

.card {
  margin-bottom: 80px;
}

.card-img {
  width: 100%;
  height: 563px;
  object-fit: cover;
}

.card-content {
  margin-top: 20px;
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28px;
    font-weight: 700;
    text-transform: uppercase;
    font-family: 'Akrobat';
  }

  &__subtitle {
    font-family: 'Akrobat';
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
    opacity: 0.8;
  }

  &--name {
  }
  &--distance {
    font-family: 'Bona Nova SC';
    font-size: 22px;
    font-weight: 400;
    line-height: 80%;
  }
}
</style>

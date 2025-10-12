<template>
  <div class="error-page">
    <div class="error-page__container">
      <div class="error-page__content">
        <!-- Анимированная цифра 404 -->
        <div class="error-page__number">
          <span class="error-page__digit" ref="digit1">4</span>
          <span class="error-page__digit" ref="digit2">0</span>
          <span class="error-page__digit" ref="digit3">4</span>
        </div>

        <!-- Заголовок -->
        <h1 class="error-page__title">Страница не найдена</h1>

        <!-- Описание -->
        <p class="error-page__description">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>

        <!-- Кнопки действий -->
        <div class="error-page__actions">
          <NuxtLink to="/" class="error-page__button error-page__button--primary">
            <svg
              class="error-page__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12L5 10M5 10L3 8L5 10H21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Вернуться на главную
          </NuxtLink>

          <button @click="goBack" class="error-page__button error-page__button--secondary">
            <svg
              class="error-page__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Назад
          </button>
        </div>

        <!-- Дополнительная информация -->
        <div class="error-page__info">
          <p class="error-page__help">
            Если вы считаете, что это ошибка, пожалуйста,
            <a href="mailto:info@toksovo.ru" class="error-page__link">свяжитесь с нами</a>
          </p>
        </div>
      </div>

      <!-- Декоративные элементы -->
      <div class="error-page__decoration">
        <div class="error-page__shape error-page__shape--1"></div>
        <div class="error-page__shape error-page__shape--2"></div>
        <div class="error-page__shape error-page__shape--3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

// Мета-информация для страницы
useHead({
  title: '404 - Страница не найдена | Токсово',
  meta: [
    {
      name: 'description',
      content: 'Страница не найдена. Вернитесь на главную страницу сайта Токсово.',
    },
  ],
});

const digit1 = ref(null);
const digit2 = ref(null);
const digit3 = ref(null);

// Функция для возврата назад
const goBack = () => {
  if (process.client && window.history.length > 1) {
    window.history.back();
  } else {
    navigateTo('/');
  }
};

// Анимация появления цифр
onMounted(() => {
  const tl = gsap.timeline();

  // Анимация цифр
  tl.fromTo(
    digit1.value,
    { scale: 0, rotation: -180, opacity: 0 },
    { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
  )
    .fromTo(
      digit2.value,
      { scale: 0, rotation: 180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    )
    .fromTo(
      digit3.value,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    );

  // Анимация декоративных элементов
  gsap.fromTo(
    '.error-page__shape',
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 0.1,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power2.out',
    }
  );
});
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;

  &__container {
    position: relative;
    z-index: 2;
    max-width: 600px;
    width: 100%;
  }

  &__content {
    text-align: center;
    color: white;
  }

  &__number {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__digit {
    font-size: 8rem;
    font-weight: 900;
    line-height: 1;
    color: white;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    display: inline-block;

    @media (max-width: 768px) {
      font-size: 6rem;
    }

    @media (max-width: 480px) {
      font-size: 4rem;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__description {
    font-size: 1.2rem;
    margin-bottom: 3rem;
    opacity: 0.9;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 1rem;

    &--primary {
      background: white;
      color: #667eea;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }
    }

    &--secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__info {
    opacity: 0.8;
  }

  &__help {
    font-size: 0.9rem;
    margin: 0;
  }

  &__link {
    color: white;
    text-decoration: underline;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  &__shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);

    &--1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: 10%;
      animation: float 6s ease-in-out infinite;
    }

    &--2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 15%;
      animation: float 8s ease-in-out infinite reverse;
    }

    &--3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation: float 10s ease-in-out infinite;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// Адаптивность
@media (max-width: 768px) {
  .error-page {
    padding: 1rem;
  }
}
</style>

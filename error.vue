<template>
  <div class="error-page">
    <AppHeader class="error-page__header" />
    
    <div class="error-page__bg"></div>
    
    <div class="error-page__content">
      <h1 class="error-page__number">404</h1>
      <p class="error-page__text">
        Страницы не существует, либо ее удалили. Перейдите на главную
      </p>
      <NuxtLink to="/" class="error-page__button">
        На главную
      </NuxtLink>
    </div>
    
    <Footer class="error-page__footer" />
  </div>
</template>

<script setup>
import AppHeader from '~/components/Common/AppHeader.vue';
import Footer from '~/components/Footer.vue';

defineProps({
  error: Object
});

useHead({
  title: '404 - Страница не найдена | Токсово',
  meta: [
    {
      name: 'description',
      content: 'Страница не найдена. Вернитесь на главную страницу сайта Токсово.',
    },
  ],
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: $breakpoint-x) {
    min-height: 100svh;
  }

  &__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: transparent;
  }

  &__bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image: url('@/assets/img/bg-sky.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 20px 40px;
    position: relative;
    z-index: 10;
  }

  &__number {
    font-size: 138px;
    line-height: 80%;
    font-weight: 400;
    color: $text-color-primary;
    margin: 0 0 30px 0;
    font-family: 'Bona Nova SC', sans-serif;

    @media (max-width: $breakpoint-md) {
      font-size: 100px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 80px;
    }
  }

  &__text {
    font-size: 30px;
    font-weight: 500;
    line-height: 110%;
    color: $text-color-primary;
    margin: 0 0 30px 0;
    font-family: 'Akrobat', sans-serif;
    max-width: 600px;

    @media (max-width: $breakpoint-md) {
      font-size: 24px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 20px;
    }
  }

  &__button {
    background-color: $accent-color-orange;
    color: $text-color-white;
    font-family: 'Akrobat', sans-serif;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 100px;
    border: 1px solid $accent-color-orange;
    transition: all 0.3s ease;
    display: inline-block;

    &:hover {
      border-radius: 7px;
    }

    @media (max-width: $breakpoint-x) {
      font-size: 16px;
      padding: 12px 24px;
    }
  }

  &__footer {
    position: relative;
    z-index: 10;
    background: transparent;
  }
}
</style>


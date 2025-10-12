<template>
  <div class="privacy-page">
    <AppHeader />

    <main class="privacy-content">
      <div class="container">
        <button @click="router.push('/')" class="back-button">
          <div class="back-button__icon">
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.50637 0.450573L6.125 1.0692L1.50412 5.69007C1.42187 5.7732 1.37637 5.88257 1.37637 5.99982C1.37637 6.11707 1.42187 6.22645 1.50412 6.30957L6.125 10.9304L5.50637 11.5491L0.885499 6.9282C0.637874 6.68057 0.501375 6.3507 0.501375 5.99982C0.501375 5.64895 0.637874 5.31995 0.885499 5.07145L5.50637 0.450573Z"
                fill="#2C322C"
              />
            </svg>
          </div>
          <div class="back-button__text">
            <span>На главную</span>
          </div>
        </button>

        <h1 class="privacy-title">Политика конфиденциальности</h1>

        <div class="privacy-text">
          <section class="privacy-section">
            <h2>1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок
              обработки персональных данных пользователей сайта ПОИНТ ТОКСОВО (далее — «Сайт»).
            </p>
            <p>
              Используя Сайт, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны с
              условиями Политики, пожалуйста, не используйте Сайт.
            </p>
          </section>

          <section class="privacy-section">
            <h2>2. Сбор персональных данных</h2>
            <p>Мы собираем следующие категории персональных данных:</p>
            <ul>
              <li>Имя и фамилия</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты (при предоставлении)</li>
              <li>Информация о предпочтениях в недвижимости</li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>3. Цели обработки персональных данных</h2>
            <p>Мы используем ваши персональные данные для:</p>
            <ul>
              <li>Предоставления информации о жилом комплексе ПОИНТ ТОКСОВО</li>
              <li>Организации обратных звонков</li>
              <li>Отправки коммерческих предложений</li>
              <li>Улучшения качества обслуживания</li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>4. Передача персональных данных</h2>
            <p>
              Мы не передаем ваши персональные данные третьим лицам, за исключением случаев,
              предусмотренных законодательством Российской Федерации.
            </p>
          </section>

          <section class="privacy-section">
            <h2>5. Защита персональных данных</h2>
            <p>
              Мы принимаем все необходимые меры для защиты ваших персональных данных от
              несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
          </section>

          <section class="privacy-section">
            <h2>6. Ваши права</h2>
            <p>Вы имеете право:</p>
            <ul>
              <li>Получать информацию об обработке ваших персональных данных</li>
              <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>
                Обратиться в уполномоченный орган по защите прав субъектов персональных данных
              </li>
            </ul>
          </section>

          <section class="privacy-section">
            <h2>7. Cookies</h2>
            <p>
              Сайт использует файлы cookies для улучшения функциональности и анализа посещаемости.
              Вы можете отключить cookies в настройках вашего браузера.
            </p>
          </section>

          <section class="privacy-section">
            <h2>8. Изменения в Политике</h2>
            <p>
              Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия
              Политики всегда доступна на данной странице.
            </p>
          </section>

          <section class="privacy-section">
            <h2>9. Контактная информация</h2>
            <p>По вопросам обработки персональных данных вы можете обратиться к нам:</p>
            <ul>
              <li>Телефон: +7 (333) 77-67</li>
              <li>Email: info@pointtoksovo.ru</li>
            </ul>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '~/components/Common/AppHeader.vue';
import Footer from '~/components/Footer.vue';

const router = useRouter();

// Meta для SEO
useHead({
  title: 'Политика конфиденциальности - ПОИНТ ТОКСОВО',
  meta: [
    {
      name: 'description',
      content:
        'Политика конфиденциальности жилого комплекса ПОИНТ ТОКСОВО. Защита персональных данных пользователей.',
    },
    { name: 'keywords', content: 'политика конфиденциальности, защита данных, ПОИНТ ТОКСОВО' },
  ],
});

// Текущая дата для "Последнее обновление"
const currentDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.privacy-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.privacy-content {
  padding: 120px 0 80px;
  background-color: white;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.privacy-title {
  font-size: 48px;
  font-weight: 400;
  color: $text-color-primary;
  margin-bottom: 44px;
  text-align: start;
  font-family: 'Bona Nova SC';
}

.back-button {
  background: none;
  border: none;
  color: $text-color-primary;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Akrobat';
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 24px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;

  &__icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid $utility-color-1;
    margin-right: 8px;
  }
}

.privacy-text {
  line-height: 1.6;
  color: $text-color-primary;
}

.last-updated {
  font-style: italic;
  color: $text-color-secondary;
  margin-bottom: 40px;
  text-align: center;
}

.privacy-section {
  margin-bottom: 40px;

  h2 {
    font-size: 30px;
    font-weight: 400;
    color: $text-color-primary;
    margin-bottom: 12px;
    font-family: 'Bona Nova SC';
  }

  p {
    font-size: 20px;
    margin-bottom: px;
    line-height: 1.4;
    font-family: 'Akrobat';
  }

  ul {
    margin: 16px 0;
    padding-left: 20px;

    li {
      font-size: 16px;
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .privacy-content {
    padding: 100px 0 60px;
  }

  .privacy-title {
    font-size: 36px;
    margin-bottom: 30px;
  }

  .privacy-section {
    margin-bottom: 30px;

    h2 {
      font-size: 20px;
      margin-bottom: 16px;
    }

    p,
    li {
      font-size: 14px;
    }
  }
}
</style>

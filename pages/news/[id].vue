<template>
  <div class="news-page">
    <AppHeader />
    <!-- Фиксированный блок социальных сетей -->
    <div class="social-share-fixed">
      <!-- Уведомление о копировании -->
      <div v-if="showCopyNotification" class="copy-notification">
        <div class="copy-notification__content">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13.3333 4L6 11.3333L2.66667 8"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Ссылка скопирована!</span>
        </div>
      </div>

      <button class="social-share__button" @click="copyLink">
        <div class="social-share__icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.5795 3.4199C13.1307 1.97115 10.7013 1.97115 9.25257 3.4199L7.92196 4.75056C7.59651 5.076 7.06885 5.076 6.7434 4.75056C6.41801 4.42511 6.41801 3.89748 6.7434 3.57204L8.07407 2.24139C10.1737 0.141765 13.6583 0.141765 15.758 2.24139C17.8576 4.34103 17.8576 7.82567 15.758 9.92528L14.4273 11.2559C14.1018 11.5813 13.5742 11.5813 13.2488 11.2559C12.9233 10.9305 12.9233 10.4028 13.2488 10.0774L14.5795 8.74678C16.0282 7.298 16.0282 4.86867 14.5795 3.4199ZM12.0886 5.91073C12.414 6.23617 12.414 6.76384 12.0886 7.08928L7.08863 12.0893C6.76318 12.4147 6.23551 12.4147 5.91007 12.0893C5.58468 11.7638 5.58468 11.2362 5.91007 10.9107L10.9101 5.91073C11.2355 5.58534 11.7632 5.58534 12.0886 5.91073ZM4.7499 6.74406C5.07535 7.0695 5.07535 7.59717 4.7499 7.92262L3.41925 9.25323C1.97049 10.702 1.97049 13.1313 3.41925 14.5801C4.86801 16.0288 7.29735 16.0288 8.74613 14.5801L10.0767 13.2494C10.4022 12.924 10.9298 12.924 11.2553 13.2494C11.5807 13.5749 11.5807 14.1025 11.2553 14.4279L9.92463 15.7586C7.82502 17.8582 4.34037 17.8582 2.24074 15.7586C0.141109 13.659 0.141109 10.1743 2.24074 8.07473L3.57138 6.74406C3.89682 6.41867 4.42446 6.41867 4.7499 6.74406Z"
              fill="#2C322C"
            />
          </svg>
        </div>
        <span class="social-share__text">Скопировать ссылку</span>
      </button>
      <button class="social-share__button" @click="shareEmail">
        <div class="social-share__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.68172 4.16667C3.53902 4.16667 2.50065 5.18967 2.50065 6.64367V13.3563C2.50065 14.8103 3.53902 15.8333 4.68172 15.8333H15.3996C16.5459 15.8333 17.5624 14.8136 17.4978 13.3942C17.4972 13.3816 17.4969 13.3689 17.4969 13.3563V6.64367C17.4969 5.18967 16.4585 4.16667 15.3159 4.16667H4.68172ZM0.833984 6.64367C0.833984 4.41952 2.47508 2.5 4.68172 2.5H15.3159C17.5225 2.5 19.1636 4.41952 19.1636 6.64367V13.3384C19.2558 15.5885 17.5961 17.5 15.3996 17.5H4.68172C2.47508 17.5 0.833984 15.5805 0.833984 13.3563V6.64367Z"
              fill="#2C322C"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.27449 6.25594C4.50141 5.85555 5.00996 5.71489 5.41037 5.94183L9.30935 8.15144C9.76074 8.39417 10.2382 8.39417 10.6896 8.15144L14.5886 5.94183C14.989 5.71489 15.4976 5.85555 15.7245 6.25594C15.9514 6.65633 15.8108 7.16489 15.4103 7.39183L11.5041 9.60555L11.4908 9.61294C10.5397 10.1292 9.45924 10.1292 8.50818 9.61294L8.49485 9.60555L4.58862 7.39183C4.18822 7.16489 4.04757 6.65633 4.27449 6.25594Z"
              fill="#2C322C"
            />
          </svg>
        </div>
        <span class="social-share__text">E-mail</span>
      </button>
      <button class="social-share__button" @click="shareVK">
        <div class="social-share__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_396_889)">
              <mask
                id="mask0_396_889"
                style="mask-type: luminance"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="20"
              >
                <path d="M19.9016 0.098999H0.0996094V19.901H19.9016V0.098999Z" fill="white" />
              </mask>
              <g mask="url(#mask0_396_889)">
                <path
                  d="M0.0996094 9.60395C0.0996094 5.12328 0.0996094 2.88294 1.49158 1.49097C2.88355 0.098999 5.12389 0.098999 9.60456 0.098999H10.3966C14.8773 0.098999 17.1176 0.098999 18.5096 1.49097C19.9016 2.88294 19.9016 5.12328 19.9016 9.60395V10.396C19.9016 14.8767 19.9016 17.117 18.5096 18.509C17.1176 19.901 14.8773 19.901 10.3966 19.901H9.60456C5.12389 19.901 2.88355 19.901 1.49158 18.509C0.0996094 17.117 0.0996094 14.8767 0.0996094 10.396V9.60395Z"
                  fill="#2C322C"
                />
                <path
                  d="M10.6361 14.3647C6.12291 14.3647 3.54867 11.2707 3.44141 6.12216H5.70214C5.7764 9.90103 7.44303 11.5017 8.76315 11.8317V6.12216H10.8919V9.38121C12.1956 9.24095 13.565 7.75583 14.0271 6.12216H16.1559C15.8011 8.13537 14.3159 9.6205 13.2598 10.2311C14.3159 10.7261 16.0074 12.0215 16.651 14.3647H14.3077C13.8044 12.7971 12.5504 11.5842 10.8919 11.4192V14.3647H10.6361Z"
                  fill="#F8F3ED"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_396_889">
                <rect width="20" height="19.802" fill="white" transform="translate(0 0.098999)" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <span class="social-share__text">ВКонтакте</span>
      </button>
      <button class="social-share__button" @click="shareWhatsApp">
        <div class="social-share__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_396_884)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.0519 2.90667C15.1802 1.03333 12.6919 0.000833333 10.041 0C4.57854 0 0.132708 4.445 0.130208 9.91C0.129375 11.6567 0.586042 13.3617 1.45354 14.865L0.046875 20L5.30021 18.6217C6.74771 19.4117 8.37771 19.8275 10.036 19.8283H10.0402C15.5019 19.8283 19.9485 15.3825 19.951 9.9175C19.9527 7.27 18.9227 4.77917 17.0519 2.90667ZM10.041 18.1542H10.0377C8.55937 18.1542 7.11021 17.7567 5.84521 17.0058L5.54437 16.8275L2.42688 17.645L3.25938 14.605L3.06354 14.2933C2.23854 12.9817 1.80354 11.4658 1.80438 9.91C1.80604 5.36833 5.50188 1.67333 10.0452 1.67333C12.2452 1.67333 14.3135 2.53167 15.8685 4.08833C17.4235 5.64583 18.2794 7.715 18.2785 9.91583C18.276 14.4592 14.581 18.1542 10.041 18.1542ZM14.5594 11.985C14.3119 11.8608 13.0944 11.2617 12.8669 11.1792C12.6402 11.0967 12.4752 11.055 12.3094 11.3025C12.1435 11.55 11.6702 12.1083 11.5252 12.2742C11.381 12.4392 11.236 12.46 10.9885 12.3358C10.741 12.2117 9.94271 11.9508 8.99687 11.1067C8.26104 10.45 7.76354 9.63917 7.61938 9.39083C7.47521 9.1425 7.60438 9.00917 7.72771 8.88583C7.83938 8.775 7.97521 8.59667 8.09938 8.45167C8.22438 8.30833 8.26521 8.205 8.34854 8.03917C8.43104 7.87417 8.39021 7.72917 8.32771 7.605C8.26521 7.48167 7.77021 6.2625 7.56438 5.76667C7.36354 5.28333 7.15938 5.34917 7.00688 5.34167C6.86271 5.33417 6.69771 5.33333 6.53188 5.33333C6.36688 5.33333 6.09854 5.395 5.87188 5.64333C5.64521 5.89167 5.00521 6.49083 5.00521 7.70917C5.00521 8.92833 5.89271 10.1058 6.01604 10.2708C6.13938 10.4358 7.76187 12.9375 10.246 14.01C10.8369 14.265 11.2985 14.4175 11.6577 14.5317C12.251 14.72 12.791 14.6933 13.2177 14.63C13.6935 14.5592 14.6827 14.0308 14.8894 13.4525C15.096 12.8742 15.096 12.3775 15.0335 12.275C14.9719 12.1708 14.8069 12.1092 14.5594 11.985Z"
                fill="#2C322C"
              />
            </g>
            <defs>
              <clipPath id="clip0_396_884">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <span class="social-share__text">WhatsApp</span>
      </button>
      <button class="social-share__button" @click="shareTelegram">
        <div class="social-share__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.0065 5.10666C16.7781 7.49999 15.7931 13.31 15.2915 15.99C15.0798 17.125 14.6615 17.505 14.2565 17.5417C13.3781 17.6217 12.7098 16.96 11.8581 16.4017C10.5265 15.5283 9.77313 14.985 8.4798 14.1317C6.9848 13.1467 7.95313 12.605 8.80647 11.72C9.02813 11.4883 12.9031 7.96499 12.9781 7.64666C12.9881 7.60666 12.9965 7.45833 12.9081 7.37833C12.8198 7.29833 12.6881 7.32666 12.5948 7.34833C12.4615 7.37833 10.3331 8.78499 6.2098 11.57C5.60646 11.985 5.05813 12.1867 4.56813 12.1767C4.02813 12.165 2.98813 11.87 2.2148 11.62C1.26646 11.3117 0.513131 11.1483 0.578131 10.6267C0.613131 10.3533 0.98813 10.075 1.7048 9.78999C6.11813 7.86666 9.0598 6.59999 10.5331 5.98666C14.7381 4.23833 15.6115 3.93332 16.1798 3.92499C16.3048 3.92332 16.5848 3.95333 16.7665 4.09999C16.9198 4.22333 16.9615 4.39166 16.9815 4.50999C17.0015 4.62833 17.0265 4.89666 17.0065 5.10666Z"
              fill="#2C322C"
            />
          </svg>
        </div>
        <span class="social-share__text">Telegram</span>
      </button>
    </div>

    <div class="container">
      <!-- Контент новости -->
      <article v-if="newsItem" class="news-article">
        <div class="news-article__header">
          <button @click="$router.push('/')" class="back-button">
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
        </div>

        <div class="news-article__content">
          <h2 class="news-article__title">{{ newsItem.title || newsItem.text }}</h2>

          <div class="news-article__meta">
            <div class="news-article__date">
              <span class="date-number">{{ newsItem.number }}</span>
              <span class="date-month">{{ newsItem.month }}</span>
              <span class="date-year">{{ newsItem.year }}</span>
            </div>
          </div>

          <div class="news-article__text">
            <p v-for="(paragraph, index) in newsItem.fullText" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </article>

      <!-- Загрузка -->
      <div v-else-if="loading" class="news-page__loading">
        <p>Загрузка новости...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="news-page__error">
        <p>{{ error }}</p>
        <button @click="$router.push('/')" class="home-button">Вернуться на главную</button>
      </div>

      <!-- Новость не найдена -->
      <div v-else class="news-page__error">
        <p>Новость не найдена</p>
        <button @click="$router.push('/')" class="home-button">Вернуться на главную</button>
      </div>
    </div>

    <!-- Другие новости -->
    <section v-if="newsItem" class="other-news-section">
      <div class="other-news-section__container container">
        <TitleNew text="Другие новости" class="other-news-section__title" />
        <DefaultSlider
          :slides="otherNews"
          :slides-per-view="2"
          :space-between="45"
          :show-navigation="true"
          :show-pagination="true"
        >
          <template #slide="{ slide, active }">
            <div :class="['custom-slide', { active }]" @click="handleNewsClick(slide.id)">
              <div class="content">
                <div class="content--text">{{ slide.text }}</div>
                <div class="content--date">
                  <div class="date">
                    <span>{{ slide.number }}</span>
                    {{ slide.month }}
                  </div>
                  <div class="year">
                    {{ slide.year }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DefaultSlider>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNewsStore } from '~/stores/news';
import TitleNew from '~/components/Common/TitleNew.vue';
import DefaultSlider from '~/components/Common/Sliders/DefaultSlider.vue';
import AppHeader from '~/components/Common/AppHeader.vue';
import Footer from '~/components/Footer.vue';

const route = useRoute();
const router = useRouter();
const newsStore = useNewsStore();

// Получаем данные из store
const newsItem = computed(() => newsStore.currentNews);
const loading = computed(() => newsStore.loading);
const error = computed(() => newsStore.error);

// Получаем другие новости (исключая текущую)
const otherNews = computed(() => {
  const currentId = newsItem.value?.id;
  return newsStore.getLatestNews(6).filter(news => news.id !== currentId);
});

// Обработчик клика на новость
const handleNewsClick = newsId => {
  router.push(`/news/${newsId}`);
};

// Обработчики социальных сетей
const showCopyNotification = ref(false);

const copyLink = async () => {
  try {
    if (process.client && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
    showCopyNotification.value = true;
    setTimeout(() => {
      showCopyNotification.value = false;
    }, 2000);
  } catch (err) {
    console.error('Ошибка копирования ссылки:', err);
  }
};

const shareEmail = () => {
  if (!process.client) return;
  const subject = encodeURIComponent(newsItem.value?.title || 'Новость');
  const body = encodeURIComponent(`${newsItem.value?.title}\n\n${window.location.href}`);
  window.open(`mailto:?subject=${subject}&body=${body}`);
};

const shareVK = () => {
  if (!process.client) return;
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(newsItem.value?.title || '');
  window.open(`https://vk.com/share.php?url=${url}&title=${title}`, '_blank');
};

const shareWhatsApp = () => {
  if (!process.client) return;
  const text = encodeURIComponent(`${newsItem.value?.title}\n\n${window.location.href}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
};

const shareTelegram = () => {
  if (!process.client) return;
  const text = encodeURIComponent(`${newsItem.value?.title}\n\n${window.location.href}`);
  window.open(`https://t.me/share/url?url=${window.location.href}&text=${text}`, '_blank');
};

// SEO мета-теги
useHead(() => {
  const newsItem = newsStore.currentNews;
  return {
    title: newsItem ? `${newsItem.title} - Новости` : 'Новости',
    meta: [
      {
        name: 'description',
        content: newsItem ? newsItem.text : 'Читайте последние новости',
      },
      {
        property: 'og:title',
        content: newsItem ? newsItem.title : 'Новости',
      },
      {
        property: 'og:description',
        content: newsItem ? newsItem.text : 'Читайте последние новости',
      },
      {
        property: 'og:type',
        content: 'article',
      },
    ],
  };
});

onMounted(async () => {
  const newsId = route.params.id;
  await newsStore.fetchNewsById(newsId);
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.news-page {
  min-height: 100vh;
  background: $bg-color-1;
  display: flex;

  @media (max-width: $breakpoint-x) {
    min-height: 100svh;
  }
  flex-direction: column;
  padding-top: 0; /* Убираем отступ сверху, так как есть хедер */
}

.container {
  padding-top: 40px; /* Отступ сверху для контента */
  flex: 1; /* Занимает все доступное пространство */
  display: flex;
  flex-direction: column;
}

.news-page__header {
  margin-bottom: 40px;
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
  margin-bottom: 20px;
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

.news-article {
  max-width: 800px;
  margin: 95px auto 150px auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-article__meta {
  margin-bottom: 44px;
}

.news-article__date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Bona Nova SC';
  font-size: 16px;
  color: $text-color-primary;

  .date-number {
    font-size: 46px;
    line-height: 80%;
    font-weight: 400;
  }

  .date-month {
    font-size: 16px;
    font-weight: 400;
  }

  .date-year {
    font-size: 16px;
    font-weight: 400;
  }
}

.news-article__content {
  display: flex;
  flex-direction: column;
  flex: 1; /* Занимает все доступное пространство */
}

.social-share-fixed {
  position: fixed;
  left: 20px;
  top: 340px;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.copy-notification {
  position: absolute;
  top: -60px;
  left: 0;
  z-index: 1001;
  animation: slideDown 0.3s ease-out;

  &__content {
    background: $accent-color-orange;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Akrobat';
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.social-share-fixed {
  .social-share__button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid $utility-color-1;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 0 12px;

    &:hover {
      width: 190px;
      border-radius: 25px;
      background: $accent-color-orange;
      border-color: $accent-color-orange;

      .social-share__text {
        opacity: 1;
        transform: translateX(0);
      }

      svg path {
        fill: white;
      }

      // Специальные стили для иконки ВКонтакте
      svg g path:first-child {
        fill: white;
      }

      svg g path:last-child {
        fill: white;
      }
    }
  }

  .social-share__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .social-share__text {
    margin-left: 8px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Akrobat';
    color: white;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
    white-space: nowrap;
  }
}

.news-article__content {
  .news-article__title {
    font-size: 48px;
    font-weight: 400;
    color: $text-color-primary;
    margin: 0 0 44px 0;
    line-height: 1;
    font-family: 'Bona Nova SC';
  }

  .news-article__text {
    font-size: 24px;
    font-weight: 500;
    line-height: 140%;
    color: $text-color-primary;
    font-family: 'Akrobat';
    flex: 1; /* Занимает оставшееся пространство */

    p {
      margin: 0 0 20px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.news-page__loading,
.news-page__error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: $text-color-primary;
}

.home-button {
  background: $accent-color-orange;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

/* Блок "Другие новости" */
.other-news-section {
  padding: 0 0 60px 0;

  &__title {
    margin: 0 auto;
    margin-bottom: 60px;
    font-size: 88px;
  }
}

/* Стили для слайдов новостей (копируем из NewsSection) */
::v-deep(.swiper-slide) {
  height: 300px !important;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  color: $text-color-primary;
  font-family: 'Akrobat';

  &--date {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    line-height: 100%;
    font-size: 16px;
    font-family: 'Bona Nova SC';
    margin-top: 40px;
  }
  &--text {
    font-size: 22px;
    font-weight: 500;
    line-height: 140%;
    max-height: 11.625rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    line-clamp: 6;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
}

.date {
  span {
    font-size: 46px;
    line-height: 80%;
  }
}

.custom-slide {
  height: 100%;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .news-page {
    padding: 0; /* Убираем отступы, так как используем flex */
  }

  .container {
    padding-top: 20px; /* Уменьшаем отступ на мобильных */
  }

  .news-article {
    padding: 20px;
    margin: 0 20px 100px 20px; /* Уменьшенный отступ снизу на мобильных */
  }

  .news-article__content .news-article__title {
    font-size: 24px;
  }

  .news-article__content .news-article__text {
    font-size: 16px;
  }

  .other-news-section {
    padding: 40px 0 40px 0; /* Уменьшенный отступ на мобильных */

    &__title {
      font-size: 48px;
      margin-bottom: 40px;
    }
  }

  .social-share-fixed {
    left: 10px;
    gap: 8px;

    .social-share__button {
      width: 40px;
      height: 40px;
    }
  }

  .news-article__content .news-article__title {
    font-size: 32px;
  }
}
</style>

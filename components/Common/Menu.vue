<template>
  <nav :class="['menu', { 'menu--open': isOpen }]" ref="menuRef" @mousemove="onMouseMove">
    <div
      class="menu__overlay"
      @click="closeMenu"
      @mouseenter="hoverOverlay = true"
      @mouseleave="hoverOverlay = false"
    ></div>

    <div class="menu__content">
      <div class="center-column">
        <ul class="menu__list">
          <li class="menu__item" v-for="item in menuItems" :key="item.id">
            <a
              :href="item.link"
              class="menu__link"
              :class="{ 'menu__link--active': isActiveSection(item.link) }"
              @click.prevent="scrollToSection(item.link)"
              @mouseenter="isHoveringActiveElement = true"
              @mouseleave="isHoveringActiveElement = false"
            >
              <span v-if="isActiveSection(item.link)" class="menu__arrow"
                ><svg
                  width="15"
                  height="30"
                  viewBox="0 0 15 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.62786 29.27L0.0371094 27.6792L11.9194 15.797C12.1309 15.5832 12.2479 15.302 12.2479 15.0005C12.2479 14.699 12.1309 14.4177 11.9194 14.204L0.0371094 2.32171L1.62786 0.730957L13.5101 12.6132C14.1469 13.25 14.4979 14.0982 14.4979 15.0005C14.4979 15.9027 14.1469 16.7487 13.5101 17.3877L1.62786 29.27Z"
                    fill="#F8F3ED"
                  />
                </svg>
              </span>
              <span class="menu__link-text">
                <span class="menu__link-text-inner">
                  <span
                    v-for="(letter, index) in item.title.split('')"
                    :key="`original-${index}`"
                    class="menu__link-letter"
                    :style="{ '--letter-delay': `${index * 0.02}s` }"
                  >
                    {{ letter === ' ' ? '\u00A0' : letter }}
                  </span>
                </span>
                <span class="menu__link-text-inner menu__link-text-inner--hover">
                  <span
                    v-for="(letter, index) in item.title.split('')"
                    :key="`hover-${index}`"
                    class="menu__link-letter"
                    :style="{ '--letter-delay': `${index * 0.02}s` }"
                  >
                    {{ letter === ' ' ? '\u00A0' : letter }}
                  </span>
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div class="right-column">
        <div class="left-column__declaration menu--doc-link">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            @mouseenter="isHoveringActiveElement = true"
            @mouseleave="isHoveringActiveElement = false"
            >Проектная декларация</a
          >
        </div>

        <a
          href="/constructionDecision.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="right-column__constr menu--doc-link"
          @mouseenter="isHoveringActiveElement = true"
          @mouseleave="isHoveringActiveElement = false"
        >
          РАЗРЕШЕНИЕ НА СТРОИТЕЛЬСТВО
        </a>
      </div>
    </div>
    <div
      v-if="isOpen && showCustomCursor"
      class="menu__cursor"
      :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
        <path
          d="M14 0.824833L13.1752 0L7 6.17517L0.824833 0L0 0.824833L6.17517 7L0 13.1752L0.824833 14L7 7.82483L13.1752 14L14 13.1752L7.82483 7L14 0.824833Z"
          fill="#4C5E36"
        />
      </svg>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  activeSection: {
    type: String,
    default: 'hero',
  },
});

const emit = defineEmits(['menu-closed']);

const isOpen = ref(false);
const menuRef = ref(null);
const hoverOverlay = ref(false);
const isHoveringActiveElement = ref(false);
const showCustomCursor = ref(false);
const menuOpenTime = ref(0);
const cursorX = ref(0);
const cursorY = ref(0);

const menuItems = [
  { id: 1, title: 'ГЛАВНАЯ', link: '#hero' },
  { id: 2, title: 'О ПРОЕКТЕ', link: '#about' },
  { id: 3, title: 'ГЕНПЛАН', link: '#master-plan' },
  { id: 4, title: 'АРХИТЕКТУРА И ЛОББИ', link: '#architecture' },
  { id: 5, title: 'ИНФРАСТРУКТУРА', link: '#infrastructure' },
  { id: 6, title: 'ПЛАНИРОВКИ', link: '#layouts' },
  { id: 7, title: 'ХОД СТРОИТЕЛЬСТВА', link: '#construction' },
  { id: 8, title: 'НОВОСТИ', link: '#news' },
];

const openMenu = () => {
  isOpen.value = true;
  menuOpenTime.value = Date.now();

  if (typeof document !== 'undefined') {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  // Принудительно применяем начальные стили для анимации открытия
  if (menuRef.value) {
    const menuContent = menuRef.value.querySelector('.menu__content');
    const menuOverlay = menuRef.value.querySelector('.menu__overlay');
    const menuList = menuRef.value.querySelector('.menu__list');
    const menuDocLinks = menuRef.value.querySelectorAll('.menu--doc-link');

    if (menuContent) {
      // Устанавливаем начальное состояние
      menuContent.style.transform = 'translateY(-150%)';
      menuContent.style.transition = 'none';

      // Принудительно перерисовываем
      menuContent.offsetHeight;

      // Запускаем анимацию с плавным easing
      menuContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      menuContent.style.transform = 'translateY(0)';
    }

    if (menuOverlay) {
      menuOverlay.style.opacity = '0';
      menuOverlay.style.transition = 'none';
      menuOverlay.offsetHeight;
      menuOverlay.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
      menuOverlay.style.opacity = '1';
    }

    if (menuList) {
      // Анимируем каждый пункт меню отдельно с задержкой
      const menuItems = menuList.querySelectorAll('.menu__item');
      menuItems.forEach((item, index) => {
        const link = item.querySelector('.menu__link');
        if (link) {
          link.style.opacity = '0';
          link.style.transform = 'translateX(-50px)';
          link.style.transition = 'none';
          link.offsetHeight;

          // Каждый элемент появляется с задержкой 0.08s после предыдущего
          const delay = 0.3 + index * 0.08;
          link.style.transition = `opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`;
          link.style.opacity = '1';
          link.style.transform = 'translateX(0)';

          // Восстанавливаем активную секцию после анимации
          setTimeout(
            () => {
              if (link.classList.contains('menu__link--active')) {
                link.style.opacity = '0.5';
              }
            },
            delay * 1000 + 500
          );
        }
      });
    }

    menuDocLinks.forEach(link => {
      link.style.opacity = '0';
      link.style.transform = 'translateX(-30px)';
      link.style.transition = 'none';
      link.offsetHeight;
      link.style.transition =
        'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.3s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.3s';
      link.style.opacity = '1';
      link.style.transform = 'translateX(0)';
    });
  }
};

const closeMenu = () => {
  // Сначала запускаем анимацию закрытия
  if (menuRef.value) {
    menuRef.value.classList.add('menu--closing');

    // Принудительно применяем стили для анимации закрытия
    const menuContent = menuRef.value.querySelector('.menu__content');
    const menuOverlay = menuRef.value.querySelector('.menu__overlay');
    const menuList = menuRef.value.querySelector('.menu__list');
    const menuDocLinks = menuRef.value.querySelectorAll('.menu--doc-link');

    // Анимация элементов меню (исчезают первыми)
    if (menuList) {
      const menuItems = menuList.querySelectorAll('.menu__item');
      menuItems.forEach((item, index) => {
        const link = item.querySelector('.menu__link');
        if (link) {
          // Элементы исчезают в обратном порядке (снизу вверх)
          const reverseIndex = menuItems.length - 1 - index;
          const delay = reverseIndex * 0.05; // Плавнее исчезают

          link.style.transition = `opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`;
          link.style.opacity = '0';
          link.style.transform = 'translateX(-50px)';
        }
      });
    }

    menuDocLinks.forEach(link => {
      link.style.transition =
        'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      link.style.opacity = '0';
      link.style.transform = 'translateX(-30px)';
    });

    // Анимация фона (исчезает вторым)
    if (menuOverlay) {
      setTimeout(() => {
        menuOverlay.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        menuOverlay.style.opacity = '0';
      }, 100);
    }

    // Анимация контента (поднимается последним)
    if (menuContent) {
      setTimeout(() => {
        menuContent.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        menuContent.style.transform = 'translateY(-150%)';
      }, 200);
    }
  }

  // Ждем завершения анимации, затем закрываем меню
  setTimeout(() => {
    isOpen.value = false;
    showCustomCursor.value = false;
    if (menuRef.value) {
      menuRef.value.classList.remove('menu--closing');
    }

    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Эмитим событие о закрытии меню
    emit('menu-closed');
  }, 800); // Ждем 0.8 секунды для завершения всей анимации (0.2s задержка + 0.6s анимация)
};

const isActiveSection = link => {
  const sectionId = link.replace('#', '');
  return props.activeSection === sectionId;
};

const scrollToSection = link => {
  if (link.startsWith('#')) {
    const targetId = link.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Обновляем URL hash
      const newUrl = `${window.location.pathname}#${targetId}`;
      window.history.replaceState(null, '', newUrl);

      closeMenu(); // Закрываем меню после клика
    }
  }
};

const onMouseMove = e => {
  const el = menuRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  cursorX.value = e.clientX - rect.left;
  cursorY.value = e.clientY - rect.top;
  const timeSinceOpen = Date.now() - menuOpenTime.value;
  showCustomCursor.value =
    isOpen.value && hoverOverlay.value && !isHoveringActiveElement.value && timeSinceOpen > 300;
};

// Экспортируем методы для использования в родительском компоненте
defineExpose({
  openMenu,
  closeMenu,
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.menu {
  font-family: 'Akrobat', sans-serif;
  color: $text-color-light;
  text-transform: uppercase;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  visibility: hidden;

  @media (max-width: $breakpoint-x) {
    height: 100svh;
  }

  &--open {
    visibility: visible;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;

    .menu--open & {
      opacity: 1;
      cursor: none; /* use DOM-based cursor */
    }
  }

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 270px); /* Высота экрана минус высота хедера */
    background: $accent-color-brown;
    transform: translateY(-100%);
    overflow-y: auto;
    padding: 26px 44px 44px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    @media (max-width: $breakpoint-xl) {
      height: calc(100vh - 170px); /* Высота экрана минус высота хедера */
    }

    @media (max-width: $breakpoint-lg) {
      height: calc(100vh - 60px); /* Меньше отступ для средних экранов */
      padding: 20px 30px 30px;
    }

    @media (max-width: $breakpoint-x) {
      height: calc(100vh - 50px); /* Еще меньше отступ для мобильных */
      padding: 15px 20px 20px;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__item {
    margin-bottom: 14px;
  }

  &__link {
    font-size: 40px;
    font-weight: 700;
    line-height: 120%;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transform: translateX(-50px);
    text-decoration: none;
    color: inherit;

    &--active {
      opacity: 0.5 !important;
    }

    &:hover {
      .menu__link-text-inner {
        .menu__link-letter {
          transform: translateY(-100%);
        }
      }

      .menu__link-text-inner--hover {
        .menu__link-letter {
          transform: translateY(0);
        }
      }
    }
  }

  &__link-text {
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  &__link-text-inner {
    display: block;

    &--hover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }

  &__link-letter {
    display: inline-block;
    transition: transform 0.2s cubic-bezier(0, 0, 0.1, 3);
    transform: translateY(0);
    transition-delay: var(--letter-delay, 0s);

    .menu__link-text-inner--hover & {
      transform: translateY(100%);
    }
  }
}

.menu__arrow {
  font-size: 40px;
  font-weight: 700;
  line-height: 100%;
}

.menu__cursor {
  position: fixed;
  width: 48px;
  height: 48px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1001; /* above overlay */
}

.right-column {
  width: 100%;
  display: flex;
  justify-content: space-between;
  &--top {
    display: flex;
    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
  }
}

.center-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: -20px;
}

.menu--doc-link {
  font-size: 14px;
  font-weight: 600;
  line-height: 120%;
  opacity: 0;
  transform: translateX(-30px);
}
</style>

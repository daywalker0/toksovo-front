<template>
  <nav :class="['menu', { 'menu--open': isOpen }]" ref="menuRef" @mousemove="onMouseMove">
    <div
      class="menu__overlay"
      @click="closeMenu"
      @mouseenter="hoverOverlay = true"
      @mouseleave="hoverOverlay = false"
    ></div>

    <div class="menu__content">
      <div class="left-column">
        <div class="left-column__btn-choose">
          <a href="#">Выбрать квартиру</a>
        </div>

        <div class="left-column__declaration menu--doc-link">
          <a href="#" target="_blank" rel="noopener noreferrer">Проектная декларация</a>
        </div>
      </div>

      <div class="center-column">
        <div class="menu-logo">
          <a @click="router.push('/')" href="#" style="cursor: pointer">
            <svg width="196" height="40" viewBox="0 0 196 40" fill="none">
              <path
                d="M102.831 15.8734H114.417V19.2811H110.498V39.7273H106.749V19.2811H102.831V15.8734ZM119.528 34.2408C119.528 35.1042 119.704 35.7118 120.057 36.064C120.409 36.4162 120.88 36.5922 121.471 36.5922C122.061 36.5922 122.533 36.4162 122.885 36.064C123.237 35.7118 123.413 35.1042 123.413 34.2408V21.3598C123.413 20.4965 123.237 19.8886 122.885 19.5367C122.533 19.1845 122.061 19.0086 121.471 19.0086C120.88 19.0086 120.409 19.1845 120.057 19.5367C119.704 19.8886 119.528 20.4965 119.528 21.3598V34.2408ZM115.78 21.5983C115.78 19.6673 116.268 18.1849 117.245 17.1513C118.222 16.1176 119.631 15.6007 121.471 15.6007C123.311 15.6007 124.719 16.1176 125.696 17.1513C126.673 18.1849 127.162 19.6673 127.162 21.5983V34.0024C127.162 35.9334 126.673 37.4158 125.696 38.4494C124.719 39.483 123.311 40 121.471 40C119.631 40 118.222 39.483 117.245 38.4494C116.268 37.4158 115.78 35.9334 115.78 34.0024V21.5983ZM134.454 30.2197L133.295 32.4007V39.7273H129.547V15.8734H133.295V26.2669L138.271 15.8734H141.951L136.737 26.5053L141.951 39.7273H138.1L134.454 30.2197ZM154.491 30.8332V34.0024C154.491 35.9334 154.02 37.4158 153.077 38.4494C152.134 39.483 150.743 40 148.903 40C147.063 40 145.671 39.483 144.728 38.4494C143.786 37.4158 143.314 35.9334 143.314 34.0024V21.5983C143.314 19.6673 143.786 18.1849 144.728 17.1513C145.671 16.1176 147.063 15.6007 148.903 15.6007C150.743 15.6007 152.134 16.1176 153.077 17.1513C154.02 18.1849 154.491 19.6673 154.491 21.5983V23.9156H150.948V21.3598C150.948 20.4965 150.771 19.8886 150.419 19.5367C150.067 19.1845 149.596 19.0086 149.005 19.0086C148.414 19.0086 147.943 19.1845 147.591 19.5367C147.239 19.8886 147.063 20.4965 147.063 21.3598V34.2408C147.063 35.1042 147.239 35.7062 147.591 36.047C147.943 36.3877 148.414 36.5582 149.005 36.5582C149.596 36.5582 150.067 36.3877 150.419 36.047C150.771 35.7062 150.948 35.1042 150.948 34.2408V30.8332H154.491ZM160.284 34.2408C160.284 35.1042 160.461 35.7118 160.813 36.064C161.165 36.4162 161.636 36.5922 162.227 36.5922C162.818 36.5922 163.289 36.4162 163.641 36.064C163.993 35.7118 164.169 35.1042 164.169 34.2408V21.3598C164.169 20.4965 163.993 19.8886 163.641 19.5367C163.289 19.1845 162.818 19.0086 162.227 19.0086C161.636 19.0086 161.165 19.1845 160.813 19.5367C160.461 19.8886 160.284 20.4965 160.284 21.3598V34.2408ZM156.536 21.5983C156.536 19.6673 157.025 18.1849 158.001 17.1513C158.978 16.1176 160.387 15.6007 162.227 15.6007C164.067 15.6007 165.476 16.1176 166.453 17.1513C167.429 18.1849 167.918 19.6673 167.918 21.5983V34.0024C167.918 35.9334 167.429 37.4158 166.453 38.4494C165.476 39.483 164.067 40 162.227 40C160.387 40 158.978 39.483 158.001 38.4494C157.025 37.4158 156.536 35.9334 156.536 34.0024V21.5983ZM175.96 15.8734C177.914 15.8734 179.328 16.3277 180.203 17.2365C181.077 18.1452 181.515 19.5197 181.515 21.3598V22.2117C181.515 23.4385 181.321 24.4494 180.935 25.2446C180.549 26.0396 179.936 26.6303 179.095 27.0165C180.118 27.4027 180.839 28.0332 181.259 28.9079C181.679 29.7824 181.889 30.8558 181.889 32.1282V34.0705C181.889 35.9107 181.412 37.3136 180.458 38.279C179.504 39.2446 178.084 39.7273 176.199 39.7273H170.303V15.8734H175.96ZM174.052 28.993V36.3197H176.199C176.835 36.3197 177.318 36.1493 177.647 35.8085C177.976 35.4677 178.141 34.8543 178.141 33.9684V31.8895C178.141 30.7763 177.954 30.0153 177.579 29.6064C177.204 29.1974 176.585 28.993 175.721 28.993H174.052ZM174.052 19.2811V25.5853H175.517C176.221 25.5853 176.772 25.4036 177.17 25.0402C177.567 24.6766 177.766 24.0177 177.766 23.0637V21.7347C177.766 20.8713 177.613 20.2467 177.306 19.8605C176.999 19.4743 176.517 19.2811 175.858 19.2811H174.052ZM187.512 34.2408C187.512 35.1042 187.688 35.7118 188.04 36.064C188.392 36.4162 188.864 36.5922 189.455 36.5922C190.045 36.5922 190.517 36.4162 190.869 36.064C191.221 35.7118 191.397 35.1042 191.397 34.2408V21.3598C191.397 20.4965 191.221 19.8886 190.869 19.5367C190.517 19.1845 190.045 19.0086 189.455 19.0086C188.864 19.0086 188.392 19.1845 188.04 19.5367C187.688 19.8886 187.512 20.4965 187.512 21.3598V34.2408ZM183.764 21.5983C183.764 19.6673 184.252 18.1849 185.229 17.1513C186.206 16.1176 187.614 15.6007 189.455 15.6007C191.295 15.6007 192.703 16.1176 193.68 17.1513C194.657 18.1849 195.145 19.6673 195.145 21.5983V34.0024C195.145 35.9334 194.657 37.4158 193.68 38.4494C192.703 39.483 191.295 40 189.455 40C187.614 40 186.206 39.483 185.229 38.4494C184.252 37.4158 183.764 35.9334 183.764 34.0024V21.5983Z"
                fill="#F8F3ED"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.693359 36.7175V39.7325H4.36458V36.1151L0.693359 36.7175ZM8.02687 39.7325H11.7068V17.748L8.02687 20.5059V39.7325ZM15.3782 14.7531V27.3728L19.0496 25.9994V12.1112L15.3782 14.7531ZM26.351 39.7325L26.3916 3.0615L22.7128 -3.8147e-06V29.6297L15.3782 31.4112V39.7325H26.351Z"
                fill="#F8F3ED"
              />
              <path
                d="M42.8989 15.8734C44.7846 15.8734 46.1874 16.3731 47.1074 17.3728C48.0276 18.3723 48.4875 19.8376 48.4875 21.7687V24.8696C48.4875 26.8007 48.0276 28.2661 47.1074 29.2657C46.1874 30.2652 44.7846 30.7651 42.8989 30.7651H41.1268V39.7273H37.3784V15.8734H42.8989ZM41.1268 19.2811V27.3573H42.8989C43.4895 27.3573 43.944 27.1983 44.262 26.8802C44.5801 26.5622 44.7391 25.9716 44.7391 25.1083V21.5302C44.7391 20.6669 44.5801 20.0763 44.262 19.7581C43.944 19.44 43.4895 19.2811 42.8989 19.2811H41.1268ZM53.6674 34.2408C53.6674 35.1042 53.8434 35.7118 54.1956 36.064C54.5477 36.4162 55.0191 36.5922 55.6097 36.5922C56.2004 36.5922 56.6719 36.4162 57.024 36.064C57.376 35.7118 57.5522 35.1042 57.5522 34.2408V21.3598C57.5522 20.4965 57.376 19.8886 57.024 19.5367C56.6719 19.1845 56.2004 19.0086 55.6097 19.0086C55.0191 19.0086 54.5477 19.1845 54.1956 19.5367C53.8434 19.8886 53.6674 20.4965 53.6674 21.3598V34.2408ZM49.9188 21.5983C49.9188 19.6673 50.4073 18.1849 51.3842 17.1513C52.3611 16.1176 53.7696 15.6007 55.6097 15.6007C57.4499 15.6007 58.8584 16.1176 59.8353 17.1513C60.8123 18.1849 61.3006 19.6673 61.3006 21.5983V34.0024C61.3006 35.9334 60.8123 37.4158 59.8353 38.4494C58.8584 39.483 57.4499 40 55.6097 40C53.7696 40 52.3611 39.483 51.3842 38.4494C50.4073 37.4158 49.9188 35.9334 49.9188 34.0024V21.5983ZM63.72 15.8734H67.4684V39.7273H63.72V15.8734ZM73.5344 22.4502V39.7273H70.1607V15.8734H74.8634L78.714 30.1517V15.8734H82.0537V39.7273H78.2029L73.5344 22.4502ZM83.7234 15.8734H95.3097V19.2811H91.3909V39.7273H87.6422V19.2811H83.7234V15.8734Z"
                fill="#F8F3ED"
              />
            </svg>
          </a>
        </div>
        <ul class="menu__list">
          <li class="menu__item" v-for="item in menuItems" :key="item.id">
            <a
              :href="item.link"
              class="menu__link"
              :class="{ 'menu__link--active': isActiveSection(item.link) }"
              @click.prevent="scrollToSection(item.link)"
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
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>

      <div class="right-column">
        <div class="right-column--top">
          <div class="menu__tel">
            <a href="tel:+3337767">
              <div class="menu__tel--icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.08555 1.04129C2.83751 0.291722 4.09831 0.501332 4.63066 1.38576L4.6344 1.39191L5.86154 3.48901C6.22289 4.11942 6.13174 4.92983 5.59262 5.46723L5.38907 5.67012C6.10972 6.80046 7.20452 7.91875 8.31111 8.58947L8.51341 8.41023C9.05256 7.88457 9.85733 7.79819 10.4845 8.15543L10.489 8.15799L12.5656 9.36557C13.0798 9.61166 13.3504 10.0872 13.4058 10.562C13.4611 11.0364 13.3093 11.5513 12.94 11.9194L12.2403 12.6169C11.5138 13.3411 10.331 13.6616 9.32179 13.2043C7.99327 12.6614 6.00076 11.637 4.1848 9.82679C2.36411 8.01189 1.33782 5.96373 0.798611 4.7108C0.338617 3.70778 0.655597 2.53175 1.37706 1.80571L2.0694 1.05805C2.07468 1.05236 2.08006 1.04677 2.08555 1.04129ZM2.91657 1.85717L2.22662 2.60224C2.22135 2.60793 2.21596 2.61352 2.21047 2.61899C1.77371 3.05436 1.62839 3.72877 1.86109 4.23134C1.86333 4.2362 1.8655 4.24107 1.86761 4.24597C2.37883 5.43503 3.33475 7.33534 5.00948 9.00476C6.68719 10.6771 8.53725 11.6284 9.77454 12.1329C9.78247 12.1361 9.79033 12.1396 9.7981 12.1431C10.3023 12.3751 10.9788 12.2302 11.4156 11.7949L12.1154 11.0973C12.2126 11.0004 12.2649 10.8468 12.2473 10.6963C12.2309 10.5554 12.161 10.4589 12.0532 10.41C12.0352 10.4018 12.0176 10.3928 12.0006 10.3829L9.90404 9.16378C9.72032 9.06018 9.48474 9.08592 9.32463 9.24552C9.31654 9.25357 9.30826 9.26139 9.2997 9.26893L8.7749 9.73397C8.59414 9.89411 8.333 9.92647 8.11845 9.81524C6.54513 8.99971 5.00995 7.40005 4.14669 5.86339C4.0191 5.63628 4.05849 5.35235 4.24314 5.16833L4.76794 4.6452C4.92805 4.4856 4.95387 4.25075 4.84996 4.06762L3.6291 1.98139C3.46293 1.70883 3.09928 1.68396 2.91657 1.85717Z"
                    fill="#F8F3ED"
                  />
                </svg>
              </div>
              <span>333 77 67</span>
            </a>
          </div>
          <div class="menu__close" @click="closeMenu">
            <span>ЗАКРЫТЬ</span>
            <div class="menu__close-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M14 0.824833L13.1752 0L7 6.17517L0.824833 0L0 0.824833L6.17517 7L0 13.1752L0.824833 14L7 7.82483L13.1752 14L14 13.1752L7.82483 7L14 0.824833Z"
                  fill="#F8F3ED"
                />
              </svg>
            </div>
          </div>
        </div>

        <a
          href="/constructionDecision.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="right-column__constr menu--doc-link"
        >
          РАЗРЕШЕНИЕ НА СТРОИТЕЛЬСТВО
        </a>
      </div>
    </div>
    <div
      v-if="isOpen && hoverOverlay"
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

const isOpen = ref(false);
const menuRef = ref(null);
const hoverOverlay = ref(false);
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
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

const closeMenu = () => {
  isOpen.value = false;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
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

  &--open {
    visibility: visible;
  }

  &__tel {
    margin-right: 20px;
    a {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

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
    height: 70vh;
    background: $accent-color-brown;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
    padding: 26px 44px 44px;
    display: flex;
    justify-content: space-between;

    .menu--open & {
      transform: translateY(0);
    }
  }

  &__close {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 55px 0 40px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__item {
    margin-bottom: 20px;
  }

  &__link {
    font-size: 40px;
    font-weight: 700;
    line-height: 100%;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;

    &--active {
      opacity: 0.5;
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

.left-column {
  &__btn-choose {
    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
  }
}

.right-column {
  align-items: flex-end;
  &--top {
    display: flex;
    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
  }
}

.left-column,
.center-column,
.right-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-logo {
  margin: 0 auto;
}
.menu--doc-link {
  font-size: 14px;
  font-weight: 600;
  line-height: 120%;
}
</style>

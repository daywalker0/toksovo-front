<template>
  <div class="map">
    <!-- Десктопная версия с сайдбаром -->
    <div v-if="!isMobile" class="map__sidebar">
      <div class="map__sidebar-content">
        <h3 class="map__sidebar-title" @click="isSidebarOpen = !isSidebarOpen">
          Локации
          <span class="map__m" :class="{ 'map__m--open': !isSidebarOpen }">
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path
                d="M4.71429 0.497991C5.11466 -0.0105564 5.88534 -0.0105563 6.28572 0.497991L10.7209 6.13141C11.2373 6.78739 10.7701 7.75 9.93517 7.75L1.06483 7.75C0.229947 7.75 -0.237333 6.78739 0.279119 6.13141L4.71429 0.497991Z"
                fill="#4C5E36"
              />
            </svg>
          </span>
        </h3>

        <ul v-show="isSidebarOpen" class="map__categories">
          <li
            v-for="cat in categories"
            :key="cat.key"
            class="map__category"
            :class="{ inactive: !cat.active }"
            @click="toggleCategory(cat)"
            @mouseenter="handleCategoryMouseEnter(cat.key)"
            @mouseleave="handleCategoryMouseLeave"
          >
            <div class="map__category-name">
              <div
                v-html="categoryIcon(cat.key, hoveredCategory === cat.key)"
                class="map__icon"
                :class="{
                  'map__icon--inactive': !cat.active,
                  'map__icon--hovered': hoveredCategory === cat.key,
                }"
              />
              <AnimatedLink
                :text="cat.name"
                customClass="map__category-name-link"
                hoverColor="#ff6b35"
                :forceHover="hoveredCategory === cat.key"
                :disableAnimation="!cat.active"
              />
            </div>

            <span
              class="map__category-count"
              :class="{ 'map__category-count--hovered': hoveredCategory === cat.key }"
            >
              {{ totalCountByCategory[cat.key] || 0 }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Мобильная версия - превью с оверлеем -->
    <div v-if="isMapReady && isMobile" class="map__mobile-preview" @click="openMapDialog">
      <YandexMap
        key="mobile-map"
        :center="mapCenter"
        :zoom="mapZoom"
        :locations="locations"
        :activeCategories="activeCategoryKeys"
        :disableInteraction="true"
      />
      <div class="map__mobile-overlay">
        <div class="map__mobile-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z"
              fill="white"
            />
            <path
              d="M12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V13C11 13.2652 11.1054 13.5196 11.2929 13.7071C11.4804 13.8946 11.7348 14 12 14C12.2652 14 12.5196 13.8946 12.7071 13.7071C12.8946 13.5196 13 13.2652 13 13V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7Z"
              fill="white"
            />
          </svg>
        </div>
        <div class="map__mobile-text">Нажмите для просмотра карты</div>
      </div>
    </div>

    <!-- Десктопная карта -->
    <YandexMap
      v-if="isMapReady && !isMobile"
      key="desktop-map"
      :center="mapCenter"
      :zoom="mapZoom"
      :locations="locations"
      :activeCategories="activeCategoryKeys"
      @ready="onMapReady"
      @error="onMapError"
    />

    <!-- Мобильный диалог с картой -->
    <MapDialog
      v-model="isMapDialogOpen"
      :center="mapCenter"
      :zoom="mapZoom"
      :locations="locations"
      :categories="categories"
      :activeCategories="activeCategoryKeys"
      @toggle-category="toggleCategory"
      @all-active="handleAllActive"
      @all-inactive="handleAllInactive"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import YandexMap from '~/components/YandexMap.vue';
import AnimatedLink from './Common/AnimatedLink.vue';
import MapDialog from './Common/Dialogs/MapDialog.vue';

const cultureBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_110)">
<path d="M17.5 12.5V2.5C17.5 1.83696 17.2366 1.20107 16.7678 0.732233C16.2989 0.263392 15.663 0 15 0L11.6667 0V0.833333C11.6667 1.27536 11.4911 1.69928 11.1785 2.01184C10.866 2.32441 10.442 2.5 10 2.5C9.55797 2.5 9.13405 2.32441 8.82149 2.01184C8.50893 1.69928 8.33333 1.27536 8.33333 0.833333V0H5C4.33696 0 3.70107 0.263392 3.23223 0.732233C2.76339 1.20107 2.5 1.83696 2.5 2.5V12.5H5.83333V14.1667H2.5V20H8.33333V19.1667C8.33333 18.7246 8.50893 18.3007 8.82149 17.9882C9.13405 17.6756 9.55797 17.5 10 17.5C10.442 17.5 10.866 17.6756 11.1785 17.9882C11.4911 18.3007 11.6667 18.7246 11.6667 19.1667V20H17.5V14.1667H14.1667V12.5H17.5ZM11.6667 14.1667H8.33333V12.5H11.6667V14.1667Z" fill="#4C5E36"/>
</g>
<defs>
<clipPath id="clip0_886_110">
<rect width="20" height="20" fill="#4C5E36"/>
</clipPath>
</defs>
</svg>
`;
const medicineBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 4.16671H13.3333V0.833374H6.66667V4.16671H2.5C1.83696 4.16671 1.20107 4.4301 0.732233 4.89894C0.263392 5.36778 0 6.00367 0 6.66671L0 19.1667H20V6.66671C20 6.00367 19.7366 5.36778 19.2678 4.89894C18.7989 4.4301 18.163 4.16671 17.5 4.16671ZM8.33333 2.50004H11.6667V4.16671H8.33333V2.50004ZM13.3333 12.5H10.8333V15H9.16667V12.5H6.66667V10.8334H9.16667V8.33337H10.8333V10.8334H13.3333V12.5Z" fill="#4C5E36"/>
</svg>
`;
const educationBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 6.66668V16.6667H18.3333V7.74168L11.7667 11.9767C11.2408 12.3183 10.6271 12.5001 10 12.5001C9.3729 12.5001 8.75924 12.3183 8.23333 11.9767L0 6.66668L8.23333 1.35585C8.75954 1.01506 9.37308 0.83374 10 0.83374C10.6269 0.83374 11.2405 1.01506 11.7667 1.35585L20 6.66668ZM10 14.1667C9.05365 14.166 8.12763 13.892 7.33333 13.3775L3.33333 10.8V17.0117L3.5775 17.2558C3.65583 17.3334 5.53917 19.1667 10 19.1667C14.4608 19.1667 16.3442 17.3334 16.4225 17.2558L16.6667 17.0117V10.8L12.6667 13.3775C11.8724 13.892 10.9464 14.166 10 14.1667Z" fill="#4C5E36"/>
</svg>
`;
const torgBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_118)">
<path d="M17.4508 6.66667C17.035 2.9225 13.8542 0 10 0C6.14583 0 2.965 2.9225 2.54916 6.66667H-0.0175018L1.58083 17.8542C1.75583 19.0775 2.81916 20 4.05583 20H15.9442C17.18 20 18.2442 19.0775 18.4192 17.8542L20.0175 6.66667H17.4508ZM10 1.66667C12.9325 1.66667 15.36 3.845 15.7667 6.66667H4.23333C4.64 3.845 7.0675 1.66667 10 1.66667ZM6.66666 16.6667H5V10H6.66666V16.6667ZM10.8333 16.6667H9.16666V10H10.8333V16.6667ZM15 16.6667H13.3333V10H15V16.6667Z" fill="#4C5E36"/>
</g>
<defs>
<clipPath id="clip0_886_118">
<rect width="20" height="20" fill="#4C5E36"/>
</clipPath>
</defs>
</svg>
`;
const foodBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_122)">
<path d="M15.5075 0.676624C15.2991 0.394337 15.0069 0.185028 14.6726 0.0785176C14.3382 -0.0279924 13.9788 -0.0262688 13.6455 0.0834429C13.3123 0.193155 13.0221 0.405257 12.8164 0.689529C12.6107 0.973801 12.5 1.31574 12.5 1.66662V20H14.1667V16.3883C18.1667 12.0116 20.3333 6.79662 15.5075 0.676624ZM10 -4.31517e-05V7.49996C10 8.163 9.73661 8.79888 9.26776 9.26772C8.79892 9.73657 8.16304 9.99996 7.5 9.99996H6.66666V20H5V9.99996H4.16666C3.50362 9.99996 2.86774 9.73657 2.3989 9.26772C1.93006 8.79888 1.66666 8.163 1.66666 7.49996V-4.31517e-05H3.33333V7.49996C3.33333 7.72097 3.42113 7.93293 3.57741 8.08921C3.73369 8.24549 3.94565 8.33329 4.16666 8.33329H5V-4.31517e-05H6.66666V8.33329H7.5C7.72101 8.33329 7.93297 8.24549 8.08925 8.08921C8.24553 7.93293 8.33333 7.72097 8.33333 7.49996V-4.31517e-05H10Z" fill="#4C5E36"/>
</g>
<defs>
<clipPath id="clip0_886_122">
<rect width="20" height="20" fill="#4C5E36"/>
</clipPath>
</defs>
</svg>
`;
const sportBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_126)">
<path d="M19.2675 5.93501L17.2558 3.9225L18.9225 2.25584L17.7442 1.0775L16.0775 2.74417L14.0658 0.732505C13.8337 0.500314 13.5581 0.316127 13.2547 0.190464C12.9514 0.0648005 12.6263 0.00012207 12.2979 0.00012207C11.9696 0.00012207 11.6445 0.0648005 11.3411 0.190464C11.0378 0.316127 10.7622 0.500314 10.53 0.732505L8.17333 3.08917L11.9525 6.86917L6.86917 11.9525L3.08917 8.17334L0.7325 10.53C0.263823 10.9988 0.000534058 11.6346 0.000534058 12.2975C0.000534058 12.9604 0.263823 13.5962 0.7325 14.065L2.74417 16.0775L1.0775 17.7442L2.25583 18.9225L3.9225 17.2558L5.93417 19.2675C6.16632 19.4997 6.44194 19.6839 6.74528 19.8095C7.04862 19.9352 7.37374 19.9999 7.70208 19.9999C8.03042 19.9999 8.35555 19.9352 8.65889 19.8095C8.96223 19.6839 9.23785 19.4997 9.47 19.2675L11.8267 16.9108L8.0475 13.1308L13.1308 8.0475L16.91 11.8267L19.2667 9.47001C19.7353 9.00119 19.9986 8.36542 19.9986 7.7025C19.9986 7.03959 19.7362 6.40382 19.2675 5.93501Z" fill="#4C5E36"/>
</g>
<defs>
<clipPath id="clip0_886_126">
<rect width="20" height="20" fill="#4C5E36"/>
</clipPath>
</defs>
</svg>
`;
const servicesBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_130)">
<path d="M15 2.5V3.33333H20V5H15V6.66667H20V8.33333H15V10H20V11.6667H15V13.3333H20V15H15V20H13.3333V2.5C13.3333 1.83696 13.5967 1.20107 14.0656 0.732233C14.5344 0.263392 15.1703 0 15.8333 0L20 0V1.66667H15.8333C15.6123 1.66667 15.4004 1.75446 15.2441 1.91074C15.0878 2.06702 15 2.27899 15 2.5ZM11.6667 16.6667C11.6697 17.3453 11.4646 18.0086 11.079 18.5671C10.6934 19.1256 10.1459 19.5525 9.51024 19.7902C8.87458 20.028 8.18131 20.0651 7.52387 19.8967C6.86642 19.7283 6.27641 19.3624 5.83333 18.8483C5.484 19.2502 5.04326 19.5622 4.5482 19.7582C4.05314 19.9542 3.51824 20.0284 2.98853 19.9745C2.45882 19.9207 1.94978 19.7404 1.50427 19.4488C1.05876 19.1572 0.68981 18.7629 0.428465 18.299C0.16712 17.8351 0.0210296 17.3153 0.00248921 16.7831C-0.0160511 16.251 0.0935008 15.7222 0.321925 15.2413C0.55035 14.7603 0.890963 14.3413 1.3151 14.0194C1.73924 13.6975 2.23448 13.4822 2.75917 13.3917L4.92667 8.33333L3.5525 5.12583C2.85625 3.50673 2.4981 1.76246 2.5 0L4.16667 0C4.16454 1.53689 4.47647 3.058 5.08333 4.47L5.83333 6.22L6.58333 4.47C7.19019 3.058 7.50213 1.53689 7.5 0H9.16667C9.16857 1.76246 8.81042 3.50673 8.11417 5.12583L6.74 8.33333L8.90667 13.3917C9.67814 13.5264 10.3776 13.9284 10.8822 14.5272C11.3869 15.1261 11.6646 15.8835 11.6667 16.6667ZM5 16.6667C5 16.337 4.90225 16.0148 4.71912 15.7407C4.53598 15.4666 4.27568 15.253 3.97114 15.1269C3.6666 15.0007 3.33148 14.9677 3.00818 15.032C2.68488 15.0963 2.38791 15.2551 2.15482 15.4882C1.92173 15.7212 1.763 16.0182 1.69869 16.3415C1.63438 16.6648 1.66739 16.9999 1.79353 17.3045C1.91968 17.609 2.1333 17.8693 2.40738 18.0525C2.68147 18.2356 3.0037 18.3333 3.33333 18.3333C3.77536 18.3333 4.19928 18.1577 4.51184 17.8452C4.82441 17.5326 5 17.1087 5 16.6667ZM5.83333 14.485C6.19387 14.0695 6.65206 13.7502 7.16667 13.5558L5.83333 10.4483L4.5 13.5558C5.01461 13.7502 5.4728 14.0695 5.83333 14.485ZM10 16.6667C10 16.337 9.90225 16.0148 9.71912 15.7407C9.53598 15.4666 9.27568 15.253 8.97114 15.1269C8.6666 15.0007 8.33148 14.9677 8.00818 15.032C7.68488 15.0963 7.38791 15.2551 7.15482 15.4882C6.92173 15.7212 6.763 16.0182 6.69869 16.3415C6.63438 16.6648 6.66739 16.9999 6.79353 17.3045C6.91968 17.609 7.1333 17.8693 7.40738 18.0525C7.68147 18.2356 8.0037 18.3333 8.33333 18.3333C8.77536 18.3333 9.19928 18.1577 9.51184 17.8452C9.8244 17.5326 10 17.1087 10 16.6667Z" fill="#4C5E36"/>
</g>
<defs>
<clipPath id="clip0_886_130">
<rect width="20" height="20" fill="#4C5E36"/>
</clipPath>
</defs>
</svg>
`;
const financeBlack = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 2.5H2.5C1.83696 2.5 1.20107 2.76339 0.732233 3.23223C0.263392 3.70107 0 4.33696 0 5V6.66667H20V5C20 4.33696 19.7366 3.70107 19.2678 3.23223C18.7989 2.76339 18.163 2.5 17.5 2.5Z" fill="#4C5E36"/>
<path d="M0 17.5H20V8.33333H0V17.5ZM5.83333 12.9167C5.83333 13.1639 5.76002 13.4056 5.62267 13.6111C5.48532 13.8167 5.2901 13.9769 5.06169 14.0715C4.83328 14.1661 4.58195 14.1909 4.33947 14.1426C4.09699 14.0944 3.87427 13.9754 3.69945 13.8005C3.52463 13.6257 3.40558 13.403 3.35735 13.1605C3.30912 12.9181 3.33387 12.6667 3.42848 12.4383C3.52309 12.2099 3.68331 12.0147 3.88887 11.8773C4.09443 11.74 4.33611 11.6667 4.58333 11.6667C4.91485 11.6667 5.2328 11.7984 5.46722 12.0328C5.70164 12.2672 5.83333 12.5851 5.83333 12.9167Z" fill="#4C5E36"/>
</svg>
`;

const cultureWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_110)">
<path d="M17.5 12.5V2.5C17.5 1.83696 17.2366 1.20107 16.7678 0.732233C16.2989 0.263392 15.663 0 15 0L11.6667 0V0.833333C11.6667 1.27536 11.4911 1.69928 11.1785 2.01184C10.866 2.32441 10.442 2.5 10 2.5C9.55797 2.5 9.13405 2.32441 8.82149 2.01184C8.50893 1.69928 8.33333 1.27536 8.33333 0.833333V0H5C4.33696 0 3.70107 0.263392 3.23223 0.732233C2.76339 1.20107 2.5 1.83696 2.5 2.5V12.5H5.83333V14.1667H2.5V20H8.33333V19.1667C8.33333 18.7246 8.50893 18.3007 8.82149 17.9882C9.13405 17.6756 9.55797 17.5 10 17.5C10.442 17.5 10.866 17.6756 11.1785 17.9882C11.4911 18.3007 11.6667 18.7246 11.6667 19.1667V20H17.5V14.1667H14.1667V12.5H17.5ZM11.6667 14.1667H8.33333V12.5H11.6667V14.1667Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_886_110">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
`;
const medicineWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 4.16671H13.3333V0.833374H6.66667V4.16671H2.5C1.83696 4.16671 1.20107 4.4301 0.732233 4.89894C0.263392 5.36778 0 6.00367 0 6.66671L0 19.1667H20V6.66671C20 6.00367 19.7366 5.36778 19.2678 4.89894C18.7989 4.4301 18.163 4.16671 17.5 4.16671ZM8.33333 2.50004H11.6667V4.16671H8.33333V2.50004ZM13.3333 12.5H10.8333V15H9.16667V12.5H6.66667V10.8334H9.16667V8.33337H10.8333V10.8334H13.3333V12.5Z" fill="white"/>
</svg>
`;
const educationWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 6.66668V16.6667H18.3333V7.74168L11.7667 11.9767C11.2408 12.3183 10.6271 12.5001 10 12.5001C9.3729 12.5001 8.75924 12.3183 8.23333 11.9767L0 6.66668L8.23333 1.35585C8.75954 1.01506 9.37308 0.83374 10 0.83374C10.6269 0.83374 11.2405 1.01506 11.7667 1.35585L20 6.66668ZM10 14.1667C9.05365 14.166 8.12763 13.892 7.33333 13.3775L3.33333 10.8V17.0117L3.5775 17.2558C3.65583 17.3334 5.53917 19.1667 10 19.1667C14.4608 19.1667 16.3442 17.3334 16.4225 17.2558L16.6667 17.0117V10.8L12.6667 13.3775C11.8724 13.892 10.9464 14.166 10 14.1667Z" fill="white"/>
</svg>
`;
const torgWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_118)">
<path d="M17.4508 6.66667C17.035 2.9225 13.8542 0 10 0C6.14583 0 2.965 2.9225 2.54916 6.66667H-0.0175018L1.58083 17.8542C1.75583 19.0775 2.81916 20 4.05583 20H15.9442C17.18 20 18.2442 19.0775 18.4192 17.8542L20.0175 6.66667H17.4508ZM10 1.66667C12.9325 1.66667 15.36 3.845 15.7667 6.66667H4.23333C4.64 3.845 7.0675 1.66667 10 1.66667ZM6.66666 16.6667H5V10H6.66666V16.6667ZM10.8333 16.6667H9.16666V10H10.8333V16.6667ZM15 16.6667H13.3333V10H15V16.6667Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_886_118">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
`;
const foodWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_122)">
<path d="M15.5075 0.676624C15.2991 0.394337 15.0069 0.185028 14.6726 0.0785176C14.3382 -0.0279924 13.9788 -0.0262688 13.6455 0.0834429C13.3123 0.193155 13.0221 0.405257 12.8164 0.689529C12.6107 0.973801 12.5 1.31574 12.5 1.66662V20H14.1667V16.3883C18.1667 12.0116 20.3333 6.79662 15.5075 0.676624ZM10 -4.31517e-05V7.49996C10 8.163 9.73661 8.79888 9.26776 9.26772C8.79892 9.73657 8.16304 9.99996 7.5 9.99996H6.66666V20H5V9.99996H4.16666C3.50362 9.99996 2.86774 9.73657 2.3989 9.26772C1.93006 8.79888 1.66666 8.163 1.66666 7.49996V-4.31517e-05H3.33333V7.49996C3.33333 7.72097 3.42113 7.93293 3.57741 8.08921C3.73369 8.24549 3.94565 8.33329 4.16666 8.33329H5V-4.31517e-05H6.66666V8.33329H7.5C7.72101 8.33329 7.93297 8.24549 8.08925 8.08921C8.24553 7.93293 8.33333 7.72097 8.33333 7.49996V-4.31517e-05H10Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_886_122">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
`;
const sportWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_126)">
<path d="M19.2675 5.93501L17.2558 3.9225L18.9225 2.25584L17.7442 1.0775L16.0775 2.74417L14.0658 0.732505C13.8337 0.500314 13.5581 0.316127 13.2547 0.190464C12.9514 0.0648005 12.6263 0.00012207 12.2979 0.00012207C11.9696 0.00012207 11.6445 0.0648005 11.3411 0.190464C11.0378 0.316127 10.7622 0.500314 10.53 0.732505L8.17333 3.08917L11.9525 6.86917L6.86917 11.9525L3.08917 8.17334L0.7325 10.53C0.263823 10.9988 0.000534058 11.6346 0.000534058 12.2975C0.000534058 12.9604 0.263823 13.5962 0.7325 14.065L2.74417 16.0775L1.0775 17.7442L2.25583 18.9225L3.9225 17.2558L5.93417 19.2675C6.16632 19.4997 6.44194 19.6839 6.74528 19.8095C7.04862 19.9352 7.37374 19.9999 7.70208 19.9999C8.03042 19.9999 8.35555 19.9352 8.65889 19.8095C8.96223 19.6839 9.23785 19.4997 9.47 19.2675L11.8267 16.9108L8.0475 13.1308L13.1308 8.0475L16.91 11.8267L19.2667 9.47001C19.7353 9.00119 19.9986 8.36542 19.9986 7.7025C19.9986 7.03959 19.7362 6.40382 19.2675 5.93501Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_886_126">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
`;
const servicesWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_886_130)">
<path d="M15 2.5V3.33333H20V5H15V6.66667H20V8.33333H15V10H20V11.6667H15V13.3333H20V15H15V20H13.3333V2.5C13.3333 1.83696 13.5967 1.20107 14.0656 0.732233C14.5344 0.263392 15.1703 0 15.8333 0L20 0V1.66667H15.8333C15.6123 1.66667 15.4004 1.75446 15.2441 1.91074C15.0878 2.06702 15 2.27899 15 2.5ZM11.6667 16.6667C11.6697 17.3453 11.4646 18.0086 11.079 18.5671C10.6934 19.1256 10.1459 19.5525 9.51024 19.7902C8.87458 20.028 8.18131 20.0651 7.52387 19.8967C6.86642 19.7283 6.27641 19.3624 5.83333 18.8483C5.484 19.2502 5.04326 19.5622 4.5482 19.7582C4.05314 19.9542 3.51824 20.0284 2.98853 19.9745C2.45882 19.9207 1.94978 19.7404 1.50427 19.4488C1.05876 19.1572 0.68981 18.7629 0.428465 18.299C0.16712 17.8351 0.0210296 17.3153 0.00248921 16.7831C-0.0160511 16.251 0.0935008 15.7222 0.321925 15.2413C0.55035 14.7603 0.890963 14.3413 1.3151 14.0194C1.73924 13.6975 2.23448 13.4822 2.75917 13.3917L4.92667 8.33333L3.5525 5.12583C2.85625 3.50673 2.4981 1.76246 2.5 0L4.16667 0C4.16454 1.53689 4.47647 3.058 5.08333 4.47L5.83333 6.22L6.58333 4.47C7.19019 3.058 7.50213 1.53689 7.5 0H9.16667C9.16857 1.76246 8.81042 3.50673 8.11417 5.12583L6.74 8.33333L8.90667 13.3917C9.67814 13.5264 10.3776 13.9284 10.8822 14.5272C11.3869 15.1261 11.6646 15.8835 11.6667 16.6667ZM5 16.6667C5 16.337 4.90225 16.0148 4.71912 15.7407C4.53598 15.4666 4.27568 15.253 3.97114 15.1269C3.6666 15.0007 3.33148 14.9677 3.00818 15.032C2.68488 15.0963 2.38791 15.2551 2.15482 15.4882C1.92173 15.7212 1.763 16.0182 1.69869 16.3415C1.63438 16.6648 1.66739 16.9999 1.79353 17.3045C1.91968 17.609 2.1333 17.8693 2.40738 18.0525C2.68147 18.2356 3.0037 18.3333 3.33333 18.3333C3.77536 18.3333 4.19928 18.1577 4.51184 17.8452C4.82441 17.5326 5 17.1087 5 16.6667ZM5.83333 14.485C6.19387 14.0695 6.65206 13.7502 7.16667 13.5558L5.83333 10.4483L4.5 13.5558C5.01461 13.7502 5.4728 14.0695 5.83333 14.485ZM10 16.6667C10 16.337 9.90225 16.0148 9.71912 15.7407C9.53598 15.4666 9.27568 15.253 8.97114 15.1269C8.6666 15.0007 8.33148 14.9677 8.00818 15.032C7.68488 15.0963 7.38791 15.2551 7.15482 15.4882C6.92173 15.7212 6.763 16.0182 6.69869 16.3415C6.63438 16.6648 6.66739 16.9999 6.79353 17.3045C6.91968 17.609 7.1333 17.8693 7.40738 18.0525C7.68147 18.2356 8.0037 18.3333 8.33333 18.3333C8.77536 18.3333 9.19928 18.1577 9.51184 17.8452C9.8244 17.5326 10 17.1087 10 16.6667Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_886_130">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
`;
const financeWhite = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 2.5H2.5C1.83696 2.5 1.20107 2.76339 0.732233 3.23223C0.263392 3.70107 0 4.33696 0 5V6.66667H20V5C20 4.33696 19.7366 3.70107 19.2678 3.23223C18.7989 2.76339 18.163 2.5 17.5 2.5Z" fill="white"/>
<path d="M0 17.5H20V8.33333H0V17.5ZM5.83333 12.9167C5.83333 13.1639 5.76002 13.4056 5.62267 13.6111C5.48532 13.8167 5.2901 13.9769 5.06169 14.0715C4.83328 14.1661 4.58195 14.1909 4.33947 14.1426C4.09699 14.0944 3.87427 13.9754 3.69945 13.8005C3.52463 13.6257 3.40558 13.403 3.35735 13.1605C3.30912 12.9181 3.33387 12.6667 3.42848 12.4383C3.52309 12.2099 3.68331 12.0147 3.88887 11.8773C4.09443 11.74 4.33611 11.6667 4.58333 11.6667C4.91485 11.6667 5.2328 11.7984 5.46722 12.0328C5.70164 12.2672 5.83333 12.5851 5.83333 12.9167Z" fill="white"/>
</svg>
`;

const mapCenter = [60.193412, 30.52625];
const mapZoom = 15;

const isSidebarOpen = ref(true);
const hoveredCategory = ref(null);
// Инициализируем isMobile сразу правильно для SSR/CSR
const isMobile = ref(process.client ? window.innerWidth <= 599 : false);
const isMapDialogOpen = ref(false);
const isMapReady = ref(false);

// категории: без хардкодного count
const categories = ref([
  { name: 'Культура и отдых', key: 'culture', icon: cultureBlack, active: true },
  { name: 'Медицина', key: 'medicine', icon: medicineBlack, active: true },
  { name: 'Образование', key: 'education', icon: educationBlack, active: true },
  { name: 'Финансы', key: 'finance', icon: financeBlack, active: true },
  { name: 'Торговля', key: 'torg', icon: torgBlack, active: true },
  { name: 'Еда', key: 'food', icon: foodBlack, active: true },
  { name: 'Спорт', key: 'sport', icon: sportBlack, active: true },
  { name: 'Услуги', key: 'services', icon: servicesBlack, active: true },
]);

// locations — список всех локаций (несколько с одинаковой category)
// пример: id, coords, category
const locations = ref([
  { id: 1, coords: [60.1925, 30.5285], category: 'culture', icon: cultureWhite, color: '#4C5E36' },
  { id: 2, coords: [60.1931, 30.529], category: 'culture', icon: cultureWhite, color: '#4C5E36' },
  {
    id: 3,
    coords: [60.1932, 30.5318],
    category: 'medicine',
    icon: medicineWhite,
    color: '#4C5E36',
  },
  {
    id: 4,
    coords: [60.194, 30.533],
    category: 'education',
    icon: educationWhite,
    color: '#4C5E36',
  },
  { id: 5, coords: [60.1941, 30.5342], category: 'finance', icon: financeWhite, color: '#4C5E36' },
  { id: 6, coords: [60.1939, 30.5346], category: 'food', icon: foodWhite, color: '#4C5E36' },
  { id: 7, coords: [60.1964, 30.5326], category: 'sport', icon: sportWhite, color: '#4C5E36' },
  {
    id: 8,
    coords: [60.1954, 30.5326],
    category: 'services',
    icon: servicesWhite,
    color: '#4C5E36',
  },
  { id: 9, coords: [60.1974, 30.5326], category: 'torg', icon: torgWhite, color: '#4C5E36' },
  // <- добавляй реальные локации сюда
]);

function toggleCategory(cat) {
  cat.active = !cat.active;
}

const activeCategoryKeys = computed(() => categories.value.filter(c => c.active).map(c => c.key));

const totalCountByCategory = computed(() => {
  const mapCounts = {};
  categories.value.forEach(c => (mapCounts[c.key] = 0));
  locations.value.forEach(loc => {
    mapCounts[loc.category] = (mapCounts[loc.category] || 0) + 1;
  });
  return mapCounts;
});

const categoryIcon = computed(() => {
  return (categoryKey, isHovered = false) => {
    const category = categories.value.find(cat => cat.key === categoryKey);
    if (!category) return '';

    // Если категория неактивна - возвращаем серую иконку
    if (!category.active) {
      return getGrayIcon(categoryKey);
    }

    // Если наведена - возвращаем оранжевую иконку
    if (isHovered) {
      return getOrangeIcon(categoryKey);
    }

    // По умолчанию - черная иконка
    return category.icon;
  };
});

// Функции для получения иконок разных цветов
function getOrangeIcon(categoryKey) {
  const orangeIcons = {
    culture: cultureBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
    medicine: medicineBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
    education: educationBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
    finance: financeBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
    torg: torgBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
    food: foodBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
    sport: sportBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
    services: servicesBlack.replace(/fill="black"/g, 'fill="#ff6b35"'),
  };
  return orangeIcons[categoryKey] || '';
}

function getGrayIcon(categoryKey) {
  const grayIcons = {
    culture: cultureBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
    medicine: medicineBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
    education: educationBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
    finance: financeBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
    torg: torgBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
    food: foodBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
    sport: sportBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
    services: servicesBlack.replace(/fill="black"/g, 'fill="#D5D6D5"'),
  };
  return grayIcons[categoryKey] || '';
}
function handleCategoryMouseEnter(key) {
  hoveredCategory.value = key;
}
function handleCategoryMouseLeave() {
  hoveredCategory.value = null;
}

function onMapReady(payload) {
  console.log('map ready', payload);
}
function onMapError(err) {
  console.error('map error', err);
}

function openMapDialog() {
  isMapDialogOpen.value = true;
}

function handleAllActive() {
  categories.value.forEach(cat => {
    cat.active = true;
  });
}

function handleAllInactive() {
  categories.value.forEach(cat => {
    cat.active = false;
  });
}

// Проверка мобильного устройства
const checkMobile = () => {
  if (process.client) {
    isMobile.value = window.innerWidth <= 599;
  }
};

onMounted(() => {
  checkMobile();
  // Устанавливаем флаг готовности карты после определения типа устройства
  isMapReady.value = true;

  if (process.client) {
    window.addEventListener('resize', checkMobile);
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', checkMobile);
  }
});
</script>
<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.map {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
  font-family: 'Akrobat';

  @media (max-width: $breakpoint-x) {
    height: auto;
    padding: 20px;
  }

  &__sidebar {
    position: absolute;
    top: 44px;
    left: 44px;
    border-radius: 7px;
    z-index: 20;
    border: 1px solid $utility-color-1;
    background-color: $bg-color-2;
    min-width: 305px;
    color: $accent-color-green;

    @media (max-width: $breakpoint-x) {
      display: none;
    }
  }

  &__mobile-preview {
    position: relative;
    width: 100%;
    height: 454px;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;

    @media (min-width: calc($breakpoint-x + 1px)) {
      display: none;
    }
  }

  &__mobile-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 10;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  &__mobile-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s ease-in-out infinite;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__mobile-text {
    color: $text-color-white;
    font-size: 18px;
    font-weight: 700;
    font-family: 'Akrobat';
    text-align: center;
  }

  &__sidebar-content {
    padding: 24px;
  }

  &__sidebar-title {
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: color 0.2s ease;
    font-size: 22px;
  }

  &__m {
    display: inline-block;
    font-size: 12px;
    transition: transform 0.3s ease;
    color: #666;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__categories {
    list-style: none;
    margin: 0;
    padding: 0;
    transition:
      opacity 0.3s ease,
      max-height 0.3s ease;
    overflow: hidden;
    margin-top: 20px;
  }

  &__category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    line-height: 140%;
    padding: 8px 0;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      .map__category-count {
        color: $accent-color-orange;
      }

      .map__category-name-link {
        color: $accent-color-orange;
      }
    }
  }

  &__category-name {
    display: flex;
    align-items: center;

    &-link {
      margin-left: 10px;
      transition: color 0.3s ease;
    }
  }

  &__icon {
    width: 20px;
    height: 20px;

    &--inactive {
      opacity: 0.5;
    }

    &--hovered:not(.map__icon--inactive) {
      filter: invert(44%) sepia(85%) saturate(1352%) hue-rotate(345deg) brightness(101%)
        contrast(101%);
    }
  }

  &__category-count {
    transition: color 0.3s ease;
    font-weight: 700;

    &--hovered {
      color: #ff6b35;
    }
  }
}

.map__category.inactive {
  .map__category-name-link {
    color: #c0c1c0;
  }

  .map__category-count {
    color: #c0c1c0;
  }
}

:deep(.animated-link) {
  color: inherit;

  .animated-link__text-inner--hover .animated-link__letter {
    color: inherit;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
</style>

<template>
  <div class="yandex-map-wrapper">
    <!-- Контейнер карты -->
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import torg from '@/assets/img/icons/locations/torg.svg';

const mapContainer = ref(null);

onMounted(async () => {
  if (!process.client) return;

  await nextTick();
  if (!mapContainer.value) return;

  const apiKey = 'f95ebb9f-42ae-4c53-be82-de5a3c134a71'; // проверь ключ

  // Загружаем скрипт Yandex Maps
  await new Promise((resolve, reject) => {
    if (window.ymaps) return resolve(window.ymaps);
    const s = document.createElement('script');
    s.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${apiKey}`;
    s.onload = () => {
      window.ymaps.ready(() => resolve(window.ymaps));
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });

  const ymaps = window.ymaps;

  const map = new ymaps.Map(mapContainer.value, {
    center: [60.193412, 30.52625],
    zoom: 16,
    controls: ['zoomControl'],
  });

  map.behaviors.disable('scrollZoom');

  const placemark1 = new ymaps.Placemark(
    [60.1925, 30.5285],
    {
      hintContent: 'Маркер с кружком',
      balloonContent: 'Здесь маркер',
    },
    {
      iconLayout: 'default#image',
      iconImageHref:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="20" fill="#4C5E36"/>
<rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" stroke-opacity="0.3"/>
<g clip-path="url(#clip0_162_440)">
<path d="M24.9567 11.6091C24.7692 11.355 24.5062 11.1666 24.2053 11.0708C23.9044 10.9749 23.581 10.9765 23.281 11.0752C22.981 11.1739 22.7199 11.3648 22.5348 11.6207C22.3496 11.8765 22.25 12.1843 22.25 12.5001V29.0001H23.75V25.7496C27.35 21.8106 29.3 17.1171 24.9567 11.6091ZM20 11.0001V17.7501C20 18.3468 19.7629 18.9191 19.341 19.3411C18.919 19.763 18.3467 20.0001 17.75 20.0001H17V29.0001H15.5V20.0001H14.75C14.1533 20.0001 13.581 19.763 13.159 19.3411C12.7371 18.9191 12.5 18.3468 12.5 17.7501V11.0001H14V17.7501C14 17.949 14.079 18.1397 14.2197 18.2804C14.3603 18.4211 14.5511 18.5001 14.75 18.5001H15.5V11.0001H17V18.5001H17.75C17.9489 18.5001 18.1397 18.4211 18.2803 18.2804C18.421 18.1397 18.5 17.949 18.5 17.7501V11.0001H20Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_162_440">
<rect width="18" height="18" fill="white" transform="translate(11 11)"/>
</clipPath>
</defs>
</svg>

      `),
      iconImageSize: [40, 40],
      iconImageOffset: [-30, -30],
    }
  );
  const placemark2 = new ymaps.Placemark(
    [60.1932, 30.5318],
    {
      hintContent: 'Маркер с кружком',
      balloonContent: 'Здесь маркер',
    },
    {
      iconLayout: 'default#image',
      iconImageHref:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="20" fill="#4C5E36"/>
          <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" stroke-opacity="0.3"/>
          <g clip-path="url(#clip0_162_437)">
          <path d="M26.7058 17C26.3315 13.6302 23.4688 11 20 11C16.5313 11 13.6685 13.6302 13.2943 17H10.9843L12.4228 27.0687C12.5803 28.1698 13.5373 29 14.6503 29H25.3498C26.462 29 27.4198 28.1698 27.5773 27.0687L29.0158 17H26.7058ZM20 12.5C22.6393 12.5 24.824 14.4605 25.19 17H14.81C15.176 14.4605 17.3608 12.5 20 12.5ZM17 26H15.5V20H17V26ZM20.75 26H19.25V20H20.75V26ZM24.5 26H23V20H24.5V26Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_162_437">
          <rect width="18" height="18" fill="white" transform="translate(11 11)"/>
          </clipPath>
          </defs>
        </svg>
      `),
      iconImageSize: [40, 40],
      iconImageOffset: [-30, -30],
    }
  );
  const placemark3 = new ymaps.Placemark(
    [60.194, 30.533],
    {
      hintContent: 'Маркер с кружком',
      balloonContent: 'Здесь маркер',
    },
    {
      iconLayout: 'default#image',
      iconImageHref:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="20" fill="#4C5E36"/>
          <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" stroke-opacity="0.3"/>
          <g clip-path="url(#clip0_162_437)">
          <path d="M26.7058 17C26.3315 13.6302 23.4688 11 20 11C16.5313 11 13.6685 13.6302 13.2943 17H10.9843L12.4228 27.0687C12.5803 28.1698 13.5373 29 14.6503 29H25.3498C26.462 29 27.4198 28.1698 27.5773 27.0687L29.0158 17H26.7058ZM20 12.5C22.6393 12.5 24.824 14.4605 25.19 17H14.81C15.176 14.4605 17.3608 12.5 20 12.5ZM17 26H15.5V20H17V26ZM20.75 26H19.25V20H20.75V26ZM24.5 26H23V20H24.5V26Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_162_437">
          <rect width="18" height="18" fill="white" transform="translate(11 11)"/>
          </clipPath>
          </defs>
        </svg>
      `),
      iconImageSize: [40, 40],
      iconImageOffset: [-30, -30],
    }
  );
  const placemark4 = new ymaps.Placemark(
    [60.1941, 30.5342],
    {
      hintContent: 'Маркер с кружком',
      balloonContent: 'Здесь маркер',
    },
    {
      iconLayout: 'default#image',
      iconImageHref:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="20" fill="#4C5E36"/>
<rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" stroke-opacity="0.3"/>
<path d="M26.75 13.25H13.25C12.6533 13.25 12.081 13.4871 11.659 13.909C11.2371 14.331 11 14.9033 11 15.5V17H29V15.5C29 14.9033 28.7629 14.331 28.341 13.909C27.919 13.4871 27.3467 13.25 26.75 13.25Z" fill="white"/>
<path d="M11 26.75H29V18.5H11V26.75ZM16.25 22.625C16.25 22.8475 16.184 23.065 16.0604 23.25C15.9368 23.435 15.7611 23.5792 15.5555 23.6644C15.35 23.7495 15.1238 23.7718 14.9055 23.7284C14.6873 23.685 14.4868 23.5778 14.3295 23.4205C14.1722 23.2632 14.065 23.0627 14.0216 22.8445C13.9782 22.6262 14.0005 22.4 14.0856 22.1945C14.1708 21.9889 14.315 21.8132 14.5 21.6896C14.685 21.566 14.9025 21.5 15.125 21.5C15.4234 21.5 15.7095 21.6185 15.9205 21.8295C16.1315 22.0405 16.25 22.3266 16.25 22.625Z" fill="white"/>
</svg>

      `),
      iconImageSize: [40, 40],
      iconImageOffset: [-30, -30],
    }
  );
  const placemark5 = new ymaps.Placemark(
    [60.1939, 30.5346],
    {
      hintContent: 'Маркер с кружком',
      balloonContent: 'Здесь маркер',
    },
    {
      iconLayout: 'default#image',
      iconImageHref:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="20" fill="#4C5E36"/>
<rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" stroke-opacity="0.3"/>
<g clip-path="url(#clip0_162_434)">
<path d="M24.4999 13.25V14H28.9999V15.5H24.4999V17H28.9999V18.5H24.4999V20H28.9999V21.5H24.4999V23H28.9999V24.5H24.4999V29H22.9999V13.25C22.9999 12.6533 23.237 12.081 23.659 11.659C24.0809 11.2371 24.6532 11 25.2499 11H28.9999V12.5H25.2499C25.051 12.5 24.8603 12.579 24.7196 12.7197C24.579 12.8603 24.4999 13.0511 24.4999 13.25ZM21.4999 26C21.5026 26.6108 21.3181 27.2077 20.971 27.7104C20.624 28.2131 20.1313 28.5972 19.5592 28.8112C18.9871 29.0252 18.3631 29.0586 17.7714 28.9071C17.1797 28.7555 16.6487 28.4262 16.2499 27.9635C15.9355 28.3251 15.5389 28.606 15.0933 28.7824C14.6478 28.9587 14.1664 29.0255 13.6896 28.9771C13.2129 28.9286 12.7547 28.7664 12.3538 28.5039C11.9528 28.2415 11.6208 27.8866 11.3856 27.4691C11.1503 27.0516 11.0189 26.5837 11.0022 26.1048C10.9855 25.6259 11.0841 25.15 11.2897 24.7171C11.4953 24.2843 11.8018 23.9071 12.1835 23.6175C12.5653 23.3278 13.011 23.134 13.4832 23.0525L15.4339 18.5L14.1972 15.6133C13.5706 14.1561 13.2482 12.5862 13.2499 11L14.7499 11C14.748 12.3832 15.0288 13.7522 15.5749 15.023L16.2499 16.598L16.9249 15.023C17.4711 13.7522 17.7519 12.3832 17.7499 11H19.2499C19.2517 12.5862 18.9293 14.1561 18.3027 15.6133L17.0659 18.5L19.0159 23.0525C19.7103 23.1737 20.3397 23.5356 20.794 24.0745C21.2482 24.6135 21.4981 25.2952 21.4999 26ZM15.4999 26C15.4999 25.7033 15.412 25.4133 15.2471 25.1666C15.0823 24.92 14.8481 24.7277 14.574 24.6142C14.2999 24.5007 13.9983 24.4709 13.7073 24.5288C13.4163 24.5867 13.1491 24.7296 12.9393 24.9393C12.7295 25.1491 12.5866 25.4164 12.5288 25.7074C12.4709 25.9983 12.5006 26.2999 12.6141 26.574C12.7277 26.8481 12.9199 27.0824 13.1666 27.2472C13.4133 27.412 13.7033 27.5 13.9999 27.5C14.3978 27.5 14.7793 27.342 15.0606 27.0607C15.3419 26.7794 15.4999 26.3978 15.4999 26ZM16.2499 24.0365C16.5744 23.6626 16.9868 23.3752 17.4499 23.2003L16.2499 20.4035L15.0499 23.2003C15.5131 23.3752 15.9255 23.6626 16.2499 24.0365ZM19.9999 26C19.9999 25.7033 19.912 25.4133 19.7471 25.1666C19.5823 24.92 19.3481 24.7277 19.074 24.6142C18.7999 24.5007 18.4983 24.4709 18.2073 24.5288C17.9163 24.5867 17.6491 24.7296 17.4393 24.9393C17.2295 25.1491 17.0866 25.4164 17.0288 25.7074C16.9709 25.9983 17.0006 26.2999 17.1141 26.574C17.2277 26.8481 17.4199 27.0824 17.6666 27.2472C17.9133 27.412 18.2033 27.5 18.4999 27.5C18.8978 27.5 19.2793 27.342 19.5606 27.0607C19.8419 26.7794 19.9999 26.3978 19.9999 26Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_162_434">
<rect width="18" height="18" fill="white" transform="translate(11 11)"/>
</clipPath>
</defs>
</svg>

      `),
      iconImageSize: [40, 40],
      iconImageOffset: [-30, -30],
    }
  );
  const placemark6 = new ymaps.Placemark(
    [60.1964, 30.5326],
    {
      hintContent: 'Маркер с кружком',
      balloonContent: 'Здесь маркер',
    },
    {
      iconLayout: 'default#image',
      iconImageHref:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="20" fill="#4C5E36"/>
<rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="white" stroke-opacity="0.3"/>
<g clip-path="url(#clip0_162_428)">
<path d="M28.3408 16.3414L26.5303 14.5301L28.0303 13.0301L26.9698 11.9696L25.4698 13.4696L23.6593 11.6591C23.4503 11.4502 23.2023 11.2844 22.9293 11.1713C22.6563 11.0582 22.3636 11 22.0681 11C21.7726 11 21.48 11.0582 21.207 11.1713C20.934 11.2844 20.6859 11.4502 20.477 11.6591L18.356 13.7801L21.7573 17.1821L17.1823 21.7571L13.7803 18.3559L11.6593 20.4769C11.2374 20.8988 11.0005 21.471 11.0005 22.0676C11.0005 22.6643 11.2374 23.2365 11.6593 23.6584L13.4698 25.4696L11.9698 26.9696L13.0303 28.0301L14.5303 26.5301L16.3408 28.3406C16.5497 28.5496 16.7977 28.7154 17.0708 28.8285C17.3438 28.9416 17.6364 28.9998 17.9319 28.9998C18.2274 28.9998 18.52 28.9416 18.793 28.8285C19.066 28.7154 19.3141 28.5496 19.523 28.3406L21.644 26.2196L18.2428 22.8176L22.8178 18.2426L26.219 21.6439L28.34 19.5229C28.7618 19.101 28.9988 18.5288 28.9988 17.9321C28.9988 17.3355 28.7626 16.7633 28.3408 16.3414Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_162_428">
<rect width="18" height="18" fill="white" transform="translate(11 11)"/>
</clipPath>
</defs>
</svg>

      `),
      iconImageSize: [40, 40],
      iconImageOffset: [-30, -30],
    }
  );

  map.geoObjects.add(placemark1);
  map.geoObjects.add(placemark2);
  map.geoObjects.add(placemark3);
  map.geoObjects.add(placemark4);
  map.geoObjects.add(placemark5);
  map.geoObjects.add(placemark6);
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}

.yandex-map-wrapper {
  position: relative;
  width: 100%;
  filter: grayscale(100%) brightness(100%) contrast(100%);
  height: 100%;
}

:deep(.ymaps-2-1-79-controls__control) {
  inset: 340px auto auto 97% !important;
}
</style>

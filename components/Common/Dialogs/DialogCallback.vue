<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="callback-dialog">
      <div class="callback-dialog__intro">
        <h2 class="callback-title">Заказать обратный звонок</h2>

        <p class="callback-description">
          Хотите узнать подробнее?<br />
          Оставьте ваши контакты, мы перезвоним вам
        </p>
      </div>

      <form class="callback-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="form-input"
              placeholder="Имя"
              required
            />
          </div>

          <div class="form-group">
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="+7 (___) ___-__-__"
              required
              @input="formatPhone"
            />
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input v-model="form.agreement" type="checkbox" class="checkbox-input" required />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                Соглашаюсь на получение обратного звонка и с
                <a href="/privacy" class="privacy-link" target="_blank" rel="noopener noreferrer"
                  >политикой конфиденциальности</a
                >
              </span>
            </label>
          </div>

          <button type="submit" class="submit-button" :disabled="!isFormValid">ОТПРАВИТЬ</button>
        </form>

      <div class="callback-dialog__gallery">
        <div class="callback-gallery">
          <div class="callback-gallery__viewport">
          <Swiper
            :modules="[Navigation]"
            :slides-per-view="1"
            :space-between="0"
            :touch-start-prevent-default="false"
            :touch-move-stop-propagation="false"
            :navigation="{
              prevEl: prevButtonRef,
              nextEl: nextButtonRef,
            }"
            class="callback-gallery-swiper"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
          >
            <SwiperSlide
              v-for="(image, index) in callbackGalleryImages"
              :key="index"
              class="callback-gallery__slide"
            >
              <img :src="image" :alt="`Фото ${index + 1}`" class="callback-gallery__image" loading="lazy" />
            </SwiperSlide>
          </Swiper>

          <button
            ref="prevButtonRef"
            type="button"
            class="callback-gallery__nav prev"
            :class="{ disabled: isPrevDisabled }"
            :disabled="isPrevDisabled"
            aria-label="Предыдущее фото"
          >
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.15141 0.0727358L8.03516 0.956484L1.43391 7.55773C1.31641 7.67648 1.25141 7.83273 1.25141 8.00023C1.25141 8.16773 1.31641 8.32398 1.43391 8.44273L8.03516 15.044L7.15141 15.9277L0.550155 9.32648C0.196404 8.97273 0.00140572 8.50148 0.00140572 8.00023C0.00140572 7.49898 0.196404 7.02898 0.550155 6.67398L7.15141 0.0727358Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            ref="nextButtonRef"
            type="button"
            class="callback-gallery__nav next"
            :class="{ disabled: isNextDisabled }"
            :disabled="isNextDisabled"
            aria-label="Следующее фото"
          >
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.84859 15.9273L0.964844 15.0435L7.56609 8.44227C7.68359 8.32352 7.74859 8.16727 7.74859 7.99977C7.74859 7.83227 7.68359 7.67602 7.56609 7.55727L0.964844 0.956015L1.84859 0.0722656L8.44985 6.67352C8.8036 7.02727 8.99859 7.49852 8.99859 7.99977C8.99859 8.50102 8.8036 8.97102 8.44985 9.32602L1.84859 15.9273Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div class="callback-gallery__caption">
            <p class="callback-gallery__caption-title">
              Приглашаем Вас посетить шоу-рум на объекте
            </p>
            <p class="callback-gallery__caption-subtitle">
              проведем полную презентацию комплекса и территории
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Dialog from './Dialog.vue';
import galleryPopupZvonok from '@/assets/img/galerry-popup-zvonok.jpg';

const config = useRuntimeConfig();

// TODO: заменить на реальные фото из CMS
const callbackGalleryImages = [galleryPopupZvonok, galleryPopupZvonok, galleryPopupZvonok];

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'sent', payload: { leadId?: number; contactId?: number }): void;
  (e: 'success'): void;
}>();

const API_URL = config.public.apiUrl;

const form = ref({
  name: '',
  phone: '',
  agreement: false,
});

const isLoading = ref(false);
const errorMsg = ref<string | null>(null);
const isSent = ref(false);

const prevButtonRef = ref<HTMLElement | null>(null);
const nextButtonRef = ref<HTMLElement | null>(null);
const swiperInstance = ref<SwiperInstance | null>(null);
const currentIndex = ref(0);

const totalSlides = computed(() => callbackGalleryImages.length);
const isPrevDisabled = computed(() => currentIndex.value <= 0);
const isNextDisabled = computed(() => currentIndex.value >= totalSlides.value - 1);

const onSwiper = (swiper: SwiperInstance) => {
  swiperInstance.value = swiper;
};

const onSlideChange = (swiper: SwiperInstance) => {
  currentIndex.value = swiper.activeIndex;
};

watch(
  () => props.modelValue,
  async isOpen => {
    if (!isOpen) return;

    currentIndex.value = 0;
    await nextTick();
    swiperInstance.value?.slideTo(0);
  }
);

function cleanPhone(input: string): string {
  let digits = (input || '').replace(/\D+/g, '');
  if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.slice(1);
  return digits;
}

const isPhoneValid = computed(() => {
  const digits = cleanPhone(form.value.phone);
  return digits.length === 11 && digits.startsWith('7');
});

const isFormValid = computed(
  () => form.value.name.trim() !== '' && isPhoneValid.value && form.value.agreement === true
);

const formatPhone = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let digits = target.value.replace(/\D+/g, '');

  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  let out = '+7';
  if (digits.length) out += ' (' + digits.slice(0, 3);
  if (digits.length >= 3) out += ') ' + digits.slice(3, 6);
  if (digits.length >= 6) out += '-' + digits.slice(6, 8);
  if (digits.length >= 8) out += '-' + digits.slice(8, 10);

  form.value.phone = out;
};

const handleSubmit = async () => {
  if (!isFormValid.value || isLoading.value) return;
  isLoading.value = true;
  errorMsg.value = null;
  isSent.value = false;

  try {
    const payload = {
      name: form.value.name.trim(),
      phone: cleanPhone(form.value.phone),
    };

    const data = await $fetch('/api/amocrm/leads', {
      baseURL: API_URL,
      method: 'POST',
      body: payload,
    });

    const ok = (data as any)?.ok ?? true;
    if (!ok) {
      const amoErr =
        (data as any)?.error?.title ||
        (data as any)?.error?.message ||
        'Не удалось отправить заявку';
      throw new Error(amoErr);
    }

    isSent.value = true;
    emit('sent', { leadId: (data as any)?.leadId, contactId: (data as any)?.contactId });
    emit('success');

    form.value = { name: '', phone: '', agreement: false };
  } catch (e: any) {
    errorMsg.value = e?.message || 'Ошибка отправки. Попробуйте ещё раз.';
  } finally {
    isLoading.value = false;
  }
};

defineExpose({ isLoading, isSent, errorMsg, isFormValid, formatPhone, handleSubmit, form });
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

@mixin callback-stacked-layout {
  display: flex;
  flex-direction: column;
  min-height: auto;
  column-gap: 0;
  row-gap: 24px;

  .callback-dialog__intro {
    order: 1;
  }

  .callback-dialog__gallery {
    order: 2;
    display: block;
    width: 100%;
    padding-right: 0;
  }

  .callback-form {
    order: 3;
  }
}

.callback-dialog {
  display: grid;
  grid-template-columns: minmax(280px, 460px) minmax(260px, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'intro gallery'
    'form gallery';
  align-items: stretch;
  width: 100%;
  min-height: 0;
  column-gap: clamp(24px, 3vw, 40px);
  row-gap: 0;

  @media (max-width: $breakpoint-md) {
    @include callback-stacked-layout;
    row-gap: 32px;
  }

  @media (max-width: $breakpoint-sm) {
    row-gap: 28px;
  }

  @media (max-width: $breakpoint-x) {
    row-gap: 16px;

    .callback-form {
      order: 2;
    }

    .callback-dialog__gallery {
      order: 3;
    }
  }

  &__intro {
    grid-area: intro;
    min-width: 0;
  }

  &__gallery {
    grid-area: gallery;
    display: flex;
    min-width: 0;
    min-height: 100%;
    align-items: stretch;

    @media (min-width: calc($breakpoint-md + 1px)) {
      align-self: stretch;
    }
  }
}

.callback-title {
  font-size: 46px;
  font-weight: 400;
  line-height: 90%;
  text-align: left;
  margin-bottom: 20px;
  font-family: 'Bona Nova SC';

  @media (max-width: $breakpoint-md) {
    font-size: 40px;
    margin-bottom: 16px;
  }

  @media (max-width: $breakpoint-sm) {
    font-size: 36px;
    margin-bottom: 14px;
  }

  @media (max-width: $breakpoint-x) {
    font-size: 28px;
    margin-bottom: 8px;
    padding-right: 44px;
  }
}

.callback-description {
  text-align: left;
  line-height: 1.4;
  margin-bottom: 60px;
  font-weight: 500;
  font-size: 22px;
  font-family: 'Akrobat';

  @media (max-width: $breakpoint-md) {
    font-size: 20px;
    margin-bottom: 0;
  }

  @media (max-width: $breakpoint-sm) {
    font-size: 19px;
  }

  @media (max-width: $breakpoint-x) {
    font-size: 16px;
    line-height: 1.3;

    br {
      display: none;
    }
  }
}

.callback-form {
  grid-area: form;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  @media (max-width: $breakpoint-sm) {
    gap: 18px;
  }

  @media (max-width: $breakpoint-x) {
    gap: 14px;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid $utility-color-1;
  border-radius: 0;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Akrobat';
  line-height: 1.4;
  background: transparent;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-bottom-color: $accent-color-orange;
  }

  &::placeholder {
    color: #999;
    font-family: 'Akrobat';
    font-weight: 600;
    font-size: 22px;
    line-height: 1.4;
  }

  @media (max-width: $breakpoint-md) {
    font-size: 17px;

    &::placeholder {
      font-size: 20px;
    }
  }

  @media (max-width: $breakpoint-x) {
    padding: 10px 0;
    font-size: 16px;

    &::placeholder {
      font-size: 16px;
    }
  }
}

.checkbox-group {
  margin: 10px 0;

  @media (max-width: $breakpoint-x) {
    margin: 4px 0;
  }
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  display: none;

  &:checked + .checkbox-custom {
    background-color: #007bff;
    border-color: #007bff;

    &::after {
      content: '✓';
      color: white;
      font-size: 10px;
    }
  }
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1px solid #ddd;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.3s ease;
}

.checkbox-text {
  color: $text-color-secondary;
  font-family: 'Akrobat', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;

  @media (max-width: $breakpoint-x) {
    font-size: 13px;
    line-height: 1.35;
  }
}

.privacy-link {
  color: $accent-color-green;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.submit-button {
  background-color: $accent-color-orange;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  text-transform: uppercase;
  font-family: 'Akrobat';
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.02);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: #ccc;
    color: #999;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: $breakpoint-x) {
    padding: 12px 20px;
    font-size: 16px;
  }
}

.callback-gallery {
  width: 100%;
  max-width: 506px;

  @media (min-width: calc($breakpoint-md + 1px)) {
    max-width: none;
    height: 100%;
    min-height: 506px;
  }

  @media (max-width: $breakpoint-md) {
    max-width: none;
    margin-inline: auto;
  }

  &__viewport {
    position: relative;
    width: 100%;
    max-width: 506px;
    aspect-ratio: 1 / 1;
    height: auto;
    flex: none;
    overflow: hidden;
    border-radius: 8px;

    @media (min-width: calc($breakpoint-md + 1px)) {
      width: 100%;
      max-width: none;
      height: 100%;
      min-height: 506px;
      aspect-ratio: unset;
      flex: 1 1 auto;
    }

    @media (max-width: $breakpoint-md) {
      max-width: none;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      border-radius: 8px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
    }
  }

  &__caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    z-index: 4;
    padding: 0 16px;
    pointer-events: none;
  }

  &__caption-title {
    margin: 0 0 4px;
    font-family: 'Akrobat', sans-serif;
    font-size: 18px;
    font-weight: 700;
    line-height: 140%;
    color: #ffffff;
  }

  &__caption-subtitle {
    margin: 0;
    font-family: 'Akrobat', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 120%;
    color: #f8f3ed;
  }

  @media (max-width: $breakpoint-md) {
    &__caption {
      bottom: 18px;
    }

    &__caption-title {
      font-size: 17px;
    }

    &__caption-subtitle {
      font-size: 15px;
    }
  }

  @media (max-width: $breakpoint-x) {
    &__viewport {
      aspect-ratio: unset;
      width: 100%;
      height: clamp(140px, 38vw, 200px);
      max-height: 200px;
    }

    &__caption {
      bottom: 10px;
      padding: 0 10px;
    }

    &__caption-title {
      font-size: 13px;
      margin-bottom: 2px;
    }

    &__caption-subtitle {
      font-size: 12px;
      line-height: 1.15;
    }
  }

  &__slide {
    height: 100%;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 8px;
  }

  &__nav {
    position: absolute;
    top: 50%;
    z-index: 3;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: $text-color-white;
    color: $text-color-primary;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    svg path {
      fill: $text-color-primary;
    }

    &.prev {
      left: 16px;
    }

    &.next {
      right: 16px;
    }

    @media (max-width: $breakpoint-md) {
      width: 40px;
      height: 40px;
    }

    @media (max-width: $breakpoint-x) {
      width: 36px;
      height: 36px;

      &.prev {
        left: 12px;
      }

      &.next {
        right: 12px;
      }
    }

    &:hover:not(.disabled) {
      opacity: 0.85;
    }

    &.disabled {
      opacity: 0.3;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}

:deep(.callback-gallery-swiper) {
  width: 100%;
  height: 100%;
}

:deep(.callback-gallery-swiper .swiper-wrapper) {
  height: 100%;
}

:deep(.callback-gallery-swiper .swiper-slide) {
  height: 100%;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  display: none;
}

:deep(.dialog-overlay:has(.callback-dialog)) {
  @media (max-width: $breakpoint-x) {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-end !important;
    align-items: stretch !important;
    padding: 0 !important;
    height: 100% !important;
    height: 100dvh !important;
    overflow: hidden !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
  }
}

:deep(.dialog-content:has(.callback-dialog)) {
  max-width: 1080px !important;
  width: min(1080px, calc(100vw - 80px)) !important;
  padding: 40px !important;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    width: min(640px, calc(100vw - 32px)) !important;
    max-width: calc(100vw - 32px) !important;
    padding: 32px 24px !important;
    max-height: calc(100vh - 32px) !important;
    max-height: calc(100dvh - 32px) !important;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  @media (max-width: $breakpoint-sm) {
    width: calc(100vw - 24px) !important;
    max-width: calc(100vw - 24px) !important;
    padding: 28px 20px !important;
  }

  @media (max-width: $breakpoint-x) {
    flex-shrink: 0;
    width: 100% !important;
    max-width: 100% !important;
    max-height: calc(100dvh - env(safe-area-inset-top)) !important;
    margin: 0 !important;
    margin-top: auto !important;
    border-radius: 16px 16px 0 0 !important;
    padding: calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom)) 24px !important;
    background: $bg-color-1 !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y;
  }
}

@media (max-width: $breakpoint-x) {
  :deep(.dialog-overlay:has(.callback-dialog) .dialog-close) {
    top: calc(12px + env(safe-area-inset-top)) !important;
    right: 12px !important;
    width: 40px !important;
    height: 40px !important;
    border: 1px solid #2c322c !important;
    background: transparent !important;

    svg path {
      fill: #2c322c !important;
    }
  }
}
</style>

<style lang="scss">
@use '@/assets/styles/variables.scss' as *;

.dialog-overlay:has(.callback-dialog) {
  @media (min-width: calc($breakpoint-x + 1px)) {
    .dialog-content {
      max-width: 1080px !important;
      width: min(1080px, calc(100vw - 80px)) !important;
      padding: 40px !important;
    }
  }

  @media (max-width: $breakpoint-md) {
    .dialog-content {
      width: min(640px, calc(100vw - 32px)) !important;
      max-width: calc(100vw - 32px) !important;
      padding: 32px 24px !important;
    }
  }

  @media (max-width: $breakpoint-sm) {
    .dialog-content {
      width: calc(100vw - 24px) !important;
      max-width: calc(100vw - 24px) !important;
      padding: 28px 20px !important;
    }
  }

  @media (max-width: $breakpoint-x) {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-end !important;
    align-items: stretch !important;
    padding: 0 !important;
    height: 100% !important;
    height: 100dvh !important;
    overflow: hidden !important;

    .dialog-content {
      flex-shrink: 0;
      width: 100% !important;
      max-width: 100% !important;
      max-height: calc(100dvh - env(safe-area-inset-top)) !important;
      margin-top: auto !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      touch-action: pan-y;
      padding: calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom)) 24px !important;
    }
  }
}
</style>

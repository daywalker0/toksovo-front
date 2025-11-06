<template>
  <Dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="callback-dialog">
      <h2 class="callback-title">Заказать обратный звонок</h2>

      <p class="callback-description">
        Хотите узнать подробнее?<br />
        Оставьте ваши контакты, мы перезвоним вам
      </p>

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
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Dialog from './Dialog.vue';
const config = useRuntimeConfig();

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'sent', payload: { leadId?: number; contactId?: number }): void;
}>();

/** URL эндпоинта Strapi */
const API_URL = config.public.apiUrl;

const form = ref({
  name: '',
  phone: '',
  agreement: false,
});

const isLoading = ref(false);
const errorMsg = ref<string | null>(null);
const isSent = ref(false);

/** Оставляем только цифры, 8XXXXXXXXXX → 7XXXXXXXXXX */
function cleanPhone(input: string): string {
  let digits = (input || '').replace(/\D+/g, '');
  if (digits.length === 11 && digits.startsWith('8')) digits = '7' + digits.slice(1);
  return digits;
}

/** Валидация телефона по цифрам */
const isPhoneValid = computed(() => {
  const digits = cleanPhone(form.value.phone);
  return digits.length === 11 && digits.startsWith('7');
});

/** Форма валидна когда все поля ок */
const isFormValid = computed(
  () => form.value.name.trim() !== '' && isPhoneValid.value && form.value.agreement === true
);

/** Маска +7 (XXX) XXX-XX-XX */
const formatPhone = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let digits = target.value.replace(/\D+/g, '');

  // убираем ведущую 7/8, т.к. мы добавим +7 сами
  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  let out = '+7';
  if (digits.length) out += ' (' + digits.slice(0, 3);
  if (digits.length >= 3) out += ') ' + digits.slice(3, 6);
  if (digits.length >= 6) out += '-' + digits.slice(6, 8);
  if (digits.length >= 8) out += '-' + digits.slice(8, 10);

  form.value.phone = out;
};

/** Отправка в Strapi → amoCRM (через ваш кастомный контроллер) */
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

    // ✅ Через $fetch с baseURL
    const data = await $fetch('/api/amocrm/leads', {
      baseURL: API_URL,
      method: 'POST',
      body: payload,
    });

    // Ожидаем, что контроллер вернёт { ok: true, leadId, contactId } — подстройте под свой ответ
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
    emit('update:modelValue', false);

    // сброс формы
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

.callback-dialog {
  max-width: 460px;
  width: 100%;

  @media (max-width: $breakpoint-x) {
    max-width: 100%;
  }
}

.callback-title {
  font-size: 46px;
  font-weight: 400;
  line-height: 90%;
  text-align: left;
  margin-bottom: 20px;
  font-family: 'Bona Nova SC';
}

.callback-description {
  text-align: left;
  line-height: 1.4;
  margin-bottom: 60px;
  font-weight: 500;
  font-size: 22px;
  font-family: 'Akrobat';
}

.callback-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
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

  &::-webkit-input-placeholder {
    color: #999;
    font-family: 'Akrobat';
    font-weight: 600;
    font-size: 22px;
    line-height: 1.4;
  }

  &::-moz-placeholder {
    color: #999;
    font-family: 'Akrobat';
    font-weight: 600;
    font-size: 22px;
    line-height: 1.4;
  }

  &:-ms-input-placeholder {
    color: #999;
    font-family: 'Akrobat';
    font-weight: 600;
    font-size: 22px;
    line-height: 1.4;
  }

  &::placeholder {
    color: #999;
    font-family: 'Akrobat';
    font-weight: 600;
    font-size: 22px;
    line-height: 1.4;
  }
}

.checkbox-group {
  margin: 10px 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  line-height: 1.4;
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
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
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
}

/* Стили для кнопки закрытия - только мобильная версия */
@media (max-width: 599px) {
  :deep(.dialog-close) {
    border: 1px solid #2c322c !important;

    svg path {
      fill: #2c322c !important;
    }
  }
}

:deep(.dialog-overlay:has(.callback-dialog)) {
  @media (max-width: $breakpoint-x) {
    align-items: flex-end !important;
    padding: 0 !important;
    height: 100vh !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
  }
}

:deep(.dialog-content:has(.callback-dialog)) {
  @media (max-width: $breakpoint-x) {
    max-width: 100% !important;
    width: 100% !important;
    height: calc(100vh - env(safe-area-inset-bottom)) !important;
    max-height: calc(100vh - env(safe-area-inset-bottom)) !important;
    margin: 0 !important;
    border-radius: 0 !important;
    padding: calc(40px + env(safe-area-inset-top)) 20px calc(20px + env(safe-area-inset-bottom))
      20px !important;
    background: $bg-color-1 !important;
  }
}

/* Позиционирование кнопки закрытия - только мобильная версия */
@media (max-width: 599px) {
  :deep(.dialog-close) {
    position: absolute !important;
    top: calc(20px + env(safe-area-inset-top)) !important;
    right: 20px !important;
    width: 40px !important;
    height: 40px !important;
    z-index: 10 !important;
  }
}
</style>

<style lang="scss">
/* Глобальные стили для диалога обратного звонка */
@use '@/assets/styles/variables.scss' as *;

.dialog-overlay:has(.callback-dialog) {
  @media (max-width: $breakpoint-x) {
    align-items: flex-end !important;
    padding: 0 !important;
  }
}
</style>

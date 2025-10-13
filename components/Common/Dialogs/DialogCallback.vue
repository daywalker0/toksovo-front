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

<script setup>
import { ref, computed } from 'vue';
import Dialog from './Dialog.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const form = ref({
  name: '',
  phone: '',
  agreement: false,
});

// Computed свойство для проверки, можно ли отправить форму
const isFormValid = computed(() => {
  return (
    form.value.name.trim() !== '' && form.value.phone.trim() !== '' && form.value.agreement === true
  );
});

const formatPhone = event => {
  let value = event.target.value.replace(/\D/g, '');

  if (value.startsWith('7') || value.startsWith('8')) {
    value = value.substring(1);
  }

  let formattedValue = '+7 (';

  if (value.length > 0) {
    formattedValue += value.substring(0, 3);
  }
  if (value.length > 3) {
    formattedValue += ') ' + value.substring(3, 6);
  }
  if (value.length > 6) {
    formattedValue += '-' + value.substring(6, 8);
  }
  if (value.length > 8) {
    formattedValue += '-' + value.substring(8, 10);
  }

  form.value.phone = formattedValue;
};

const handleSubmit = () => {
  // Проверяем валидность формы перед отправкой
  if (!isFormValid.value) {
    return;
  }

  emit('update:modelValue', false);

  form.value = {
    name: '',
    phone: '',
    agreement: false,
  };
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.callback-dialog {
  max-width: 460px;
  width: 100%;
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
</style>

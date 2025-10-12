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
          <label for="name" class="form-label">Имя</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
            placeholder="Введите ваше имя"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">Телефон</label>
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
              <a href="#" class="privacy-link">политикой конфиденциальности</a>
            </span>
          </label>
        </div>

        <button type="submit" class="submit-button">ОТПРАВИТЬ</button>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
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
  emit('update:modelValue', false);

  form.value = {
    name: '',
    phone: '',
    agreement: false,
  };
};
</script>

<style lang="scss" scoped>@use '@/assets/styles/variables.scss' as *;

.callback-dialog {
  max-width: 460px;
  width: 100%;
}

.callback-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: #333;
  text-transform: uppercase;
}

.callback-description {
  text-align: center;
  color: #666;
  line-height: 1.4;
  margin-bottom: 24px;
  font-size: 14px;
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
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #999;
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
  color: #666;
}

.privacy-link {
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.submit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    transform: translateY(1px);
  }
}
</style>

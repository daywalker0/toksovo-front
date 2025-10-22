import { ref, computed } from 'vue';
import fourEt from '@/assets/img/environment/4et.jpg'
import ecol from '@/assets/img/environment/ecol.jpg'
import inf from '@/assets/img/environment/inf.jpg'
import otd from '@/assets/img/environment/otd.jpg'
import privat from '@/assets/img/environment/privat.jpg'

export function usePrivateHousingData() {
  const items = ref([
    {
      title: 'Приватный формат жилья',
      content:
        'Пространство, где каждое утро начинается в тишине и уединении. Здесь вы можете наслаждаться личным комфортом без лишнего шума и суеты города.',
      image: privat,
    },
    {
      title: 'Экология: лес и озеро',
      content:
        'Описание экологических преимуществ - близость к лесу и озеру, чистый воздух и природное окружение.',
      image: ecol,
    },
    {
      title: 'Чистовая отделка',
      content: 'Информация о чистовой отделке помещений по стандартам ХОВЕР.',
      image: otd,
    },
    {
      title: 'Инфраструктура',
      content: 'Описание доступной инфраструктуры района и жилого комплекса.',
      image: inf,
    },
    {
      title: '4 этажа',
      content: 'Характеристики четырехэтажного здания, преимущества такой этажности.',
      image: fourEt,
    },
  ]);

  const activeIndex = ref(0);
  const activeItem = computed(() => {
    if (!items.value || !Array.isArray(items.value) || items.value.length === 0) {
      return {
        title: 'Приватный формат жилья',
        content: 'Пространство, где каждое утро начинается в тишине и уединении.',
        image: privateHousingSection1,
      };
    }
    return items.value[activeIndex.value] || items.value[0];
  });
  const cursorX = ref(0);
  const cursorY = ref(0);
  const hoverSide = ref(null);

  const toggleItem = index => {
    // Если кликаем на активный элемент, не закрываем его
    if (activeIndex.value === index) {
      return;
    }
    // Иначе переключаем на новый элемент
    activeIndex.value = index;
  };

  const nextItem = () => {
    if (!items.value || !Array.isArray(items.value) || items.value.length === 0) return;
    activeIndex.value = (activeIndex.value + 1) % items.value.length;
  };

  const prevItem = () => {
    if (!items.value || !Array.isArray(items.value) || items.value.length === 0) return;
    activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length;
  };

  const onMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.value = e.clientX - rect.left;
    cursorY.value = e.clientY - rect.top;
  };

  return {
    items,
    activeIndex,
    activeItem,
    cursorX,
    cursorY,
    hoverSide,
    toggleItem,
    nextItem,
    prevItem,
    onMouseMove,
  };
}

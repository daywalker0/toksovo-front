import { ref, computed } from 'vue';
import privateHousingSection1 from '@/assets/img/private-housing-section.jpg';
import privateHousingSection2 from '@/assets/img/live-in-style-item-2.png';

export function usePrivateHousingData() {
  const items = ref([
    {
      title: 'Приватный формат жилья',
      content:
        'Пространство, где каждое утро начинается в тишине и уединении. Здесь вы можете наслаждаться личным комфортом без лишнего шума и суеты города.',
      image: privateHousingSection1,
    },
    {
      title: 'Экология: лес и озеро',
      content:
        'Описание экологических преимуществ - близость к лесу и озеру, чистый воздух и природное окружение.',
      image: privateHousingSection2,
    },
    {
      title: 'Чистовая отделка',
      content: 'Информация о чистовой отделке помещений по стандартам ХОВЕР.',
      image: privateHousingSection1,
    },
    {
      title: 'Инфраструктура',
      content: 'Описание доступной инфраструктуры района и жилого комплекса.',
      image: privateHousingSection2,
    },
    {
      title: '4 этажа',
      content: 'Характеристики четырехэтажного здания, преимущества такой этажности.',
      image: privateHousingSection1,
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
    activeIndex.value = activeIndex.value === index ? -1 : index;
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

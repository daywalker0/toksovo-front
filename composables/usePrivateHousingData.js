import { ref, computed } from 'vue';

export function usePrivateHousingData(externalData = null) {
  const { getMediaUrl } = useMedia();

  // Получаем данные из API
  const items = computed(() => {
    if (!externalData?.value?.items || !Array.isArray(externalData.value.items) || externalData.value.items.length === 0) {
      return [];
    }
    
    return externalData.value.items.map(item => ({
      title: item.title || '',
      content: item.content || item.description || '',
      image: getMediaUrl(item.image),
    }));
  });

  const activeIndex = ref(0);
  const activeItem = computed(() => {
    const itemsList = items.value;
    if (!itemsList || !Array.isArray(itemsList) || itemsList.length === 0) {
      return null;
    }
    return itemsList[activeIndex.value] || itemsList[0];
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

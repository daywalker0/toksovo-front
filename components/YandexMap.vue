<template>
  <div class="yandex-map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <div v-if="showZoomControls" class="custom-zoom">
      <button class="button-zoom button-plus" @click="zoomIn">+</button>
      <button class="button-zoom button-minus" @click="zoomOut">−</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  center: Array,
  zoom: Number,
  locations: {
    type: Array,
    default: () => [],
  },
  activeCategories: {
    type: Array,
    default: () => [],
  },
  disableInteraction: {
    type: Boolean,
    default: false,
  },
  showZoomControls: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['ready', 'error']);

const mapContainer = ref(null);
let map = null;
let ymaps = null;
const allMarkers = new Map();

onMounted(async () => {
  if (!process.client) return;

  if (!document.getElementById('yandex-map-marker-styles')) {
    const style = document.createElement('style');
    style.id = 'yandex-map-marker-styles';
    style.textContent = `
      .custom-marker-wrapper {
        position: relative;
        display: inline-block;
        cursor: pointer !important;
        z-index: 1;
      }
      .custom-marker-icon {
        display: block;
        width: 40px;
        height: 40px;
        position: relative;
        z-index: 4;
        transition: transform 0.2s ease;
        cursor: pointer !important;
      }
      .custom-marker-icon img {
        width: 100%;
        height: 100%;
        display: block;
        cursor: pointer !important;
      }
      .custom-marker-wrapper:hover .custom-marker-icon {
        transform: scale(1.05);
      }
      .custom-marker-label {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%) scaleX(0);
        transform-origin: left center;
        background: white;
        padding: 8px 12px 8px 48px;
        border-radius: 50px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        white-space: nowrap;
        max-width: 300px;
        width: auto;
        overflow: hidden;
        pointer-events: none;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
      }
      .custom-marker-label span {
        display: block;
        font-family: 'Akrobat', sans-serif;
        font-size: 16px;
        font-weight: 700;
        line-height: 140%;
        color: #4C5E36;
        opacity: 1;
      }
      .custom-marker-label.visible {
        transform: translateY(-50%) scaleX(1);
        pointer-events: auto;
      }
      .custom-marker-wrapper:hover .custom-marker-label {
        transform: translateY(-50%) scaleX(1) !important;
        pointer-events: auto !important;
      }
      .ymaps-2-1-79-hint,
      .ymaps-2-1-79-placemark-hint,
      .ymaps-2-1-79-hint__content,
      .ymaps-2-1-79-hint__text {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  const apiKey = 'f95ebb9f-42ae-4c53-be82-de5a3c134a71';

  const isMobile = window.innerWidth <= 599;

  try {
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100;

      const checkContainer = () => {
        if (isMobile && mapContainer.value) {
          const parentElement = mapContainer.value.parentElement;
          if (parentElement) {
            const parentWidth = parentElement.offsetWidth || window.innerWidth;
            const parentHeight = parentElement.offsetHeight || window.innerHeight;
            
            mapContainer.value.style.width = `${parentWidth}px`;
            mapContainer.value.style.height = `${parentHeight}px`;
            mapContainer.value.style.minHeight = `${parentHeight}px`;
          }
        }
        
        if (
          mapContainer.value &&
          mapContainer.value.offsetWidth > 0 &&
          mapContainer.value.offsetHeight > 0
        ) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(
            new Error('Map container failed to initialize: element not found or has no dimensions')
          );
        } else {
          attempts++;
          setTimeout(checkContainer, 50);
        }
      };

      nextTick(() => {
        checkContainer();
      });
    });

    ymaps = await new Promise((resolve, reject) => {
      if (window.ymaps) return resolve(window.ymaps);
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${apiKey}`;
      script.onload = () => {
        window.ymaps.ready(() => {
          resolve(window.ymaps);
        });
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.head.appendChild(script);
    });

    map = new ymaps.Map(mapContainer.value, {
      center: props.center,
      zoom: props.zoom,
      controls: [],
      suppressMapOpenBlock: true,
    });

    map.behaviors.disable('scrollZoom');
    map.options.set('minZoom', 10);
    map.options.set('maxZoom', 19);

    if (props.disableInteraction) {
      map.behaviors.disable(['drag', 'dblClickZoom', 'multiTouch']);
    }

    createPlacemarksFromLocations();
    updateVisibleMarkers();

    setTimeout(() => {
      if (map && mapContainer.value) {
        if (isMobile) {
          const parentElement = mapContainer.value.parentElement;
          if (parentElement) {
            const parentWidth = parentElement.offsetWidth || window.innerWidth;
            const parentHeight = parentElement.offsetHeight || window.innerHeight;
            
            mapContainer.value.style.width = `${parentWidth}px`;
            mapContainer.value.style.height = `${parentHeight}px`;
            mapContainer.value.style.minHeight = `${parentHeight}px`;
          }
        }
        
        map.container.fitToViewport();
      }
    }, 100);

    emit('ready', { map, ymaps });
  } catch (err) {
    emit('error', err);
    
    if (mapContainer.value) {
      mapContainer.value.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #f0f0f0;
          color: #666;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <p>Карта временно недоступна</p>
            <p style="font-size: 14px; margin-top: 10px;">Попробуйте обновить страницу</p>
          </div>
        </div>
      `;
    }
  }
});

watch(
  () => props.locations,
  newLocs => {
    recreatePlacemarks(newLocs);
    updateVisibleMarkers();
  },
  { deep: true }
);

watch(
  () => props.activeCategories,
  () => updateVisibleMarkers(),
  { deep: true }
);

function createPlacemarksFromLocations() {
  props.locations.forEach(loc => {
    if (!allMarkers.has(loc.id)) {
      const placemark = createPlacemarkFor(loc);
      allMarkers.set(loc.id, { id: loc.id, category: loc.category, placemark, added: false });
    }
  });
}

function recreatePlacemarks(newLocs) {
  const newIds = new Set(newLocs.map(l => l.id));

  for (const [id, data] of allMarkers.entries()) {
    if (!newIds.has(id)) {
      if (data.added) map.geoObjects.remove(data.placemark);
      allMarkers.delete(id);
    }
  }

  newLocs.forEach(loc => {
    if (!allMarkers.has(loc.id)) {
      const placemark = createPlacemarkFor(loc);
      allMarkers.set(loc.id, { id: loc.id, category: loc.category, placemark, added: false });
    }
  });
}

function createPlacemarkFor(loc) {
  const iconSize = 40;
  const iconInnerSize = 20;
  const iconOffset = (iconSize - iconInnerSize) / 2;
  const bgColor = loc.color || '#4C5E36';
  const innerSvg = loc.icon || '';
  const markerName = loc.name || loc.title || 'Локация';
  const markerId = `marker-${loc.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2}" fill="${bgColor}" />
      <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2 - 0.5}" fill="none" stroke="white" stroke-opacity="0.3"/>
      <g transform="translate(${iconOffset}, ${iconOffset}) scale(${iconInnerSize / 20})">
        ${innerSvg}
      </g>
    </svg>
  `;

  const CustomLayout = ymaps.templateLayoutFactory.createClass(
    `<div class="custom-marker-wrapper" data-marker-id="${markerId}" data-name="${markerName.replace(/"/g, '&quot;')}" style="position: relative; display: inline-block; cursor: pointer; z-index: 1;">
      <div class="custom-marker-icon" style="display: block; width: 40px; height: 40px; position: relative; z-index: 4; transition: transform 0.2s ease;">
        <img src="data:image/svg+xml;base64,${btoa(svg)}" alt="" style="width: 100%; height: 100%; display: block;" />
      </div>
      <div class="custom-marker-label" data-marker-id="${markerId}" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%) scaleX(0); transform-origin: left center; background: white; padding: 8px 12px 8px 48px; border-radius: 50px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); white-space: nowrap; max-width: 300px; width: auto; overflow: hidden; pointer-events: none; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1;">
        <span style="display: block; font-family: 'Akrobat', sans-serif; font-size: 16px; font-weight: 700; line-height: 140%; color: #4C5E36; opacity: 1;">${markerName}</span>
      </div>
    </div>`,
    {
      build: function() {
        CustomLayout.superclass.build.call(this);
        const layoutInstance = this;
        
        setTimeout(() => {
          const parentElement = layoutInstance.getParentElement();
          if (!parentElement) return;
          
          let wrapper = parentElement.querySelector('.custom-marker-wrapper');
          if (!wrapper && parentElement.classList?.contains('custom-marker-wrapper')) {
            wrapper = parentElement;
          }
          if (!wrapper) wrapper = parentElement;
          
          const labelEl = wrapper.querySelector?.('.custom-marker-label');
          
          if (labelEl) {
            layoutInstance._labelEl = labelEl;
            layoutInstance._wrapper = wrapper;
            
            const handleMouseEnter = (e) => {
              e.stopPropagation();
              labelEl.classList.add('visible');
              labelEl.style.transform = 'translateY(-50%) scaleX(1)';
              labelEl.style.pointerEvents = 'auto';
            };
            
            const handleMouseLeave = (e) => {
              e.stopPropagation();
              labelEl.classList.remove('visible');
              labelEl.style.transform = 'translateY(-50%) scaleX(0)';
              labelEl.style.pointerEvents = 'none';
            };
            
            wrapper.addEventListener('mouseenter', handleMouseEnter);
            wrapper.addEventListener('mouseleave', handleMouseLeave);
            labelEl.addEventListener('mouseenter', handleMouseEnter);
            labelEl.addEventListener('mouseleave', handleMouseLeave);
            
            layoutInstance._handlers = { 
              handleMouseEnter, 
              handleMouseLeave,
              wrapper,
              labelEl
            };
          }
        }, 100);
      },
      
      clear: function() {
        if (this._handlers) {
          const { handleMouseEnter, handleMouseLeave, wrapper, labelEl } = this._handlers;
          if (wrapper) {
            wrapper.removeEventListener('mouseenter', handleMouseEnter);
            wrapper.removeEventListener('mouseleave', handleMouseLeave);
          }
          if (labelEl) {
            labelEl.removeEventListener('mouseenter', handleMouseEnter);
            labelEl.removeEventListener('mouseleave', handleMouseLeave);
          }
        }
        CustomLayout.superclass.clear.call(this);
      }
    }
  );

  const placemark = new ymaps.Placemark(
    loc.coords,
    {},
    {
      iconLayout: CustomLayout,
      iconShape: {
        type: 'Rectangle',
        coordinates: [[-30, -30], [30, 30]]
      },
      hasHint: false,
      hasBalloon: false,
    }
  );

  const showLabel = () => {
    const layout = placemark.options.get('iconLayout');
    let labelEl = layout?._labelEl || mapContainer.value?.querySelector(`.custom-marker-label[data-marker-id="${markerId}"]`);
    
    if (labelEl) {
      labelEl.classList.add('visible');
      labelEl.style.transform = 'translateY(-50%) scaleX(1)';
      labelEl.style.pointerEvents = 'auto';
    }
  };

  const hideLabel = () => {
    const layout = placemark.options.get('iconLayout');
    let labelEl = layout?._labelEl || mapContainer.value?.querySelector(`.custom-marker-label[data-marker-id="${markerId}"]`);
    
    if (labelEl) {
      labelEl.classList.remove('visible');
      labelEl.style.transform = 'translateY(-50%) scaleX(0)';
      labelEl.style.pointerEvents = 'none';
    }
  };

  placemark.events.add('mouseenter', showLabel);
  placemark.events.add('mouseleave', hideLabel);

  placemark.events.add('click', () => {
    map.setCenter(loc.coords, 17, { duration: 300 });
  });

  return placemark;
}

function updateVisibleMarkers() {
  if (!map) return;

  allMarkers.forEach(markerData => {
    const shouldBeVisible = props.activeCategories.includes(markerData.category);
    if (shouldBeVisible && !markerData.added) {
      map.geoObjects.add(markerData.placemark);
      markerData.added = true;
    } else if (!shouldBeVisible && markerData.added) {
      map.geoObjects.remove(markerData.placemark);
      markerData.added = false;
    }
  });
}

function zoomIn() {
  if (!map) return;
  map.setZoom(Math.min(map.getZoom() + 1, 19), { duration: 200 });
}
function zoomOut() {
  if (!map) return;
  map.setZoom(Math.max(map.getZoom() - 1, 1), { duration: 200 });
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.yandex-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
  
  @media (max-width: 599px) {
    width: 100vw !important;
    height: calc(100vh + env(safe-area-inset-bottom)) !important;
    min-height: calc(100vh + env(safe-area-inset-bottom)) !important;
    position: relative;
  }

  :deep(.ymaps-2-1-79-copyright),
  :deep(.ymaps-2-1-79-map-copyrights-promo),
  :deep(.ymaps-2-1-79-copyrights-promo),
  :deep(.ymaps-2-1-79-copyrights-promo__link),
  :deep(.ymaps-2-1-79-copyrights-promo__text),
  :deep(.ymaps-2-1-79-hint),
  :deep(.ymaps-2-1-79-placemark-hint),
  :deep(.ymaps-2-1-79-hint__content),
  :deep(.ymaps-2-1-79-hint__text) {
    display: none !important;
  }
}

.custom-zoom {
  position: absolute;
  right: 20px;
  top: 50%;
  display: flex;
  flex-direction: column;
  z-index: 10;
  transform: translateY(-50%);

  @media (max-width: $breakpoint-x) {
    top: auto;
    bottom: 10%;
  }
}

.button-zoom {
  width: 40px;
  height: 40px;
  background: #fff;
  border: none;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: color 0.2s ease;

  &:hover {
    color: #ff6b35;
  }
}

.button-plus {
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
}

.button-minus {
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}

:deep(.custom-marker-wrapper),
:deep(.custom-marker-icon),
:deep(.custom-marker-icon img) {
  cursor: pointer !important;
}

:deep(.custom-marker-wrapper) {
  position: relative;
  display: inline-block;
  cursor: pointer;
  z-index: 1;
}

:deep(.custom-marker-icon) {
  display: block;
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 4;
  transition: transform 0.2s ease;
  
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}

:deep(.custom-marker-wrapper:hover .custom-marker-icon) {
  transform: scale(1.05);
}

:deep(.custom-marker-label) {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleX(0);
  transform-origin: left center;
  background: white;
  padding: 8px 12px 8px 48px;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  max-width: 300px;
  width: auto;
  overflow: hidden;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  
  span {
    display: block;
    font-family: 'Akrobat', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 140%;
    color: #4C5E36;
    opacity: 1;
  }
  
  &.visible {
    transform: translateY(-50%) scaleX(1);
    pointer-events: auto;
  }
}

</style>

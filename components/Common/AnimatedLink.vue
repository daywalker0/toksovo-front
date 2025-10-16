<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :target="target"
    :rel="rel"
    :class="[
      'animated-link',
      customClass,
      {
        'animated-link--no-animation': disableAnimation,
        'animated-link--no-pointer': disablePointer,
      },
    ]"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot v-if="iconPosition === 'left'" name="icon"></slot>
    <span class="animated-link__text">
      <span class="animated-link__text-inner">
        <span
          v-for="(letter, index) in text.split('')"
          :key="`original-${index}`"
          class="animated-link__letter"
          :style="{ '--letter-delay': `${index * 0.02}s` }"
        >
          {{ letter === ' ' ? '\u00A0' : letter }}
        </span>
      </span>
      <span class="animated-link__text-inner animated-link__text-inner--hover">
        <span
          v-for="(letter, index) in text.split('')"
          :key="`hover-${index}`"
          class="animated-link__letter"
          :style="{ '--letter-delay': `${index * 0.02}s` }"
        >
          {{ letter === ' ' ? '\u00A0' : letter }}
        </span>
      </span>
    </span>
    <slot v-if="iconPosition === 'right'" name="icon"></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    default: null,
  },
  to: {
    type: String,
    default: null,
  },
  target: {
    type: String,
    default: null,
  },
  rel: {
    type: String,
    default: null,
  },
  customClass: {
    type: String,
    default: '',
  },
  hoverColor: {
    type: String,
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: value => ['left', 'right'].includes(value),
  },
  disableAnimation: {
    type: Boolean,
    default: false,
  },
  disablePointer: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const tag = computed(() => {
  if (props.href) return 'a';
  if (props.to) return 'router-link';
  return 'span';
});

const handleClick = event => {
  emit('click', event);
};
</script>

<style lang="scss" scoped>
.animated-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  gap: 8px;

  &--no-pointer {
    cursor: auto;
  }

  &__text {
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  &__text-inner {
    display: block;

    &--hover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }

  &__letter {
    display: inline-block;
    transition: transform 0.3s cubic-bezier(0.76, 0, 0.024, 1);
    transform: translateY(0);
    transition-delay: var(--letter-delay, 0s);

    .animated-link__text-inner--hover & {
      transform: translateY(100%);
    }
  }

  // Быстрое появление при hover (только если анимация не отключена)
  &:hover:not(.animated-link--no-animation) {
    .animated-link__text-inner {
      .animated-link__letter {
        transform: translateY(-100%);
        transition: transform 0.3s cubic-bezier(0.76, 0, 0.024, 1);
        transition-delay: var(--letter-delay, 0s);
      }
    }

    .animated-link__text-inner--hover {
      .animated-link__letter {
        transform: translateY(0);
        transition: transform 0.3s cubic-bezier(0.76, 0, 0.024, 1);
        transition-delay: var(--letter-delay, 0s);
        color: v-bind('hoverColor || "inherit"');
      }
    }
  }
}
</style>

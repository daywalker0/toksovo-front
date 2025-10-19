<template>
  <div class="title-new" ref="titleRef">
    <div
      class="title-lines"
      :data-text-split="true"
      :data-mode="mode"
      :letters-slide-up="mode === 'letters-slide-up' ? '' : null"
      :letters-fade-in="mode === 'letters-fade-in' ? '' : null"
      :letters-slide-down="mode === 'letters-slide-down' ? '' : null"
      :letters-fade-in-random="mode === 'letters-fade-in-random' ? '' : null"
      :words-slide-up="mode === 'words-slide-up' ? '' : null"
      :words-rotate-in="mode === 'words-rotate-in' ? '' : null"
      :words-slide-from-right="mode === 'words-slide-from-right' ? '' : null"
      :scrub-each-word="mode === 'scrub-each-word' ? '' : null"
    >
      <div v-for="(line, lineIndex) in wordsPerLine" :key="lineIndex" class="title-line">
        <span v-for="(word, wIdx) in line" :key="wIdx" class="word">
          <span v-for="(ch, cIdx) in wordToChars(word)" :key="cIdx" class="char">
            {{ ch === ' ' ? '\u00A0' : ch }}
          </span>
          <!-- пробел между словами в строке -->
          <span v-if="wIdx < line.length - 1" class="char">&nbsp;</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const props = defineProps({
  text: { type: String, required: true },
  maxWidth: { type: Number, default: 600 },
  mode: {
    type: String,
    default: 'letters-slide-up',
  },
});

const titleRef = ref(null);
const wordsPerLine = ref([]);
const timelines = [];
const triggers = [];

function wordToChars(word) {
  return [...word];
}

function splitTextIntoLines(text, maxWidth) {
  if (!titleRef.value) return [[text]];
  const measure = document.createElement('span');
  measure.style.position = 'absolute';
  measure.style.visibility = 'hidden';
  measure.style.whiteSpace = 'nowrap';
  measure.style.fontSize =
    getComputedStyle(titleRef.value).getPropertyValue('--title-fs') || '118px';
  measure.style.fontWeight = '400';
  measure.style.fontFamily = 'inherit';
  document.body.appendChild(measure);

  const words = text.split(' ');
  const lines = [];
  let current = '';

  // Используем реальную ширину контейнера на мобилке
  const isMobile = window.innerWidth <= 599;
  const effectiveMaxWidth = isMobile
    ? Math.min(maxWidth, titleRef.value.offsetWidth - 40)
    : maxWidth;

  for (let i = 0; i < words.length; i++) {
    const candidate = current ? `${current} ${words[i]}` : words[i];
    measure.textContent = candidate;
    if (measure.offsetWidth <= effectiveMaxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = words[i];
    }
  }
  if (current) lines.push(current);
  document.body.removeChild(measure);
  return lines.map(l => l.split(' '));
}

function updateLines() {
  wordsPerLine.value = splitTextIntoLines(props.text, props.maxWidth);
}

function killAll() {
  timelines.splice(0).forEach(tl => tl.kill());
  triggers.splice(0).forEach(tr => tr.kill());
}

function createScrollTrigger(triggerElement, tl) {
  // tl должен быть создан без { paused: true }
  const st = ScrollTrigger.create({
    trigger: triggerElement,
    start: 'top 100%',
    end: 'bottom 70%',
    scrub: true, // привязка ко скроллу
    animation: tl, // ScrollTrigger управляет таймлайном
    invalidateOnRefresh: true,
    onLeaveBack: () => tl.progress(0),
  });
  triggers.push(st);
}

function initAnimation() {
  if (!titleRef.value || !process.client) return;
  gsap.registerPlugin(ScrollTrigger);
  killAll();

  const textSplit = titleRef.value.querySelector('[data-text-split]');
  if (!textSplit) return;

  gsap.set(textSplit, { opacity: 1 });

  const $$ = sel => Array.from(titleRef.value.querySelectorAll(sel));

  const makeTL = (selector, vars, opt = {}) => {
    const elements = $$(selector);
    elements.forEach(el => {
      const targets = el.querySelectorAll(opt.target || '.char');
      if (targets.length === 0) return;

      // Устанавливаем начальное состояние ДО анимации
      const fromVars = { ...vars }; // например { opacity: 0, yPercent: 150 }
      gsap.set(targets, fromVars);

      // Создаём таймлайн
      const tl = gsap.timeline({ paused: true });
      tl.to(targets, {
        ...Object.fromEntries(
          Object.entries(vars).filter(([k]) => k !== 'opacity' && k !== 'yPercent')
        ),
        opacity: 1,
        yPercent: 0,
        ease: vars.ease || 'power1.out',
        stagger: vars.stagger || 0.05,
        duration: vars.duration || 0.3,
      });

      createScrollTrigger(el, tl);
      timelines.push(tl);
    });
  };

  makeTL(
    '[words-slide-up]',
    {
      opacity: 0,
      yPercent: 150,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: { amount: 0.5 },
    },
    { target: '.word' }
  );

  makeTL(
    '[words-rotate-in]',
    {
      rotationX: -90,
      duration: 0.6,
      ease: 'power2.out',
      stagger: { amount: 0.6 },
    },
    { target: '.word' }
  );

  makeTL(
    '[words-slide-from-right]',
    {
      opacity: 0,
      x: '1em',
      duration: 0.6,
      ease: 'power2.out',
      stagger: { amount: 0.2 },
    },
    { target: '.word' }
  );

  makeTL('[letters-slide-up]', {
    yPercent: 150,
    duration: 0.2,
    ease: 'power1.out',
    stagger: { amount: 0.6 },
  });

  makeTL('[letters-slide-down]', {
    yPercent: -120,
    duration: 0.3,
    ease: 'power1.out',
    stagger: { amount: 0.7 },
  });

  makeTL('[letters-fade-in]', {
    opacity: 0,
    duration: 0.2,
    ease: 'power1.out',
    stagger: { amount: 0.8 },
  });

  makeTL('[letters-fade-in-random]', {
    opacity: 0,
    duration: 0.05,
    ease: 'power1.out',
    stagger: { amount: 0.4, from: 'random' },
  });

  $$('[scrub-each-word]').forEach(el => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        end: 'top center',
        scrub: true,
      },
    });
    tl.from(el.querySelectorAll('.word'), {
      opacity: 0.2,
      duration: 0.2,
      ease: 'power1.out',
      stagger: { each: 0.4 },
    });
    timelines.push(tl);
  });
}

let resizeT;
function handleResize() {
  clearTimeout(resizeT);
  resizeT = setTimeout(async () => {
    updateLines();
    await nextTick();
    initAnimation();
  }, 150);
}

onMounted(async () => {
  if (!process.client) return;

  // Задержка для гарантии, что все тяжелые компоненты уже инициализированы
  setTimeout(async () => {
    updateLines();
    await nextTick();
    initAnimation();
  }, 300);

  window.addEventListener('resize', handleResize);
});

watch(
  () => [props.text, props.maxWidth, props.mode],
  async () => {
    if (!process.client) return;
    updateLines();
    await nextTick();
    initAnimation();
  }
);

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  clearTimeout(resizeT);
  killAll();
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.title-new {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  --title-fs: 118px;

  @media (max-width: $breakpoint-lg) {
    --title-fs: 88px;
  }
  @media (max-width: $breakpoint-x) {
    --title-fs: 45px;
    min-height: 0;
  }
}

.title-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  opacity: 0; /* скрываем до gsap.set */
}

.title-line {
  font-size: var(--title-fs);
  font-weight: 400;
  line-height: 0.8;
  color: $text-color-primary;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 8px 0;
  overflow: hidden;

  @media (max-width: $breakpoint-x) {
    justify-content: flex-start;
    line-height: 60%;
  }
}

.word {
  display: inline-block;
  will-change: transform, opacity;
  perspective: 1000px;
}

.char {
  display: inline-block;
  will-change: transform, opacity;
  backface-visibility: hidden;
}
</style>

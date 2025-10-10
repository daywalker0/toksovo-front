<template>
  <div class="hero-section section">
    <div class="hero-section__container container">
      <div class="hero-section__content">
        <h1 class="hero-section__title" aria-label="Поинт Токсово">
          <span class="word">
            <span
              v-for="(ch, i) in firstWordLetters"
              :key="`t1-${i}`"
              class="char"
              :style="{ '--delay': `${titleStartDelay + i * letterDelay}s` }"
              v-text="ch"
            />
          </span>
          <br />
          <span class="word">
            <span
              v-for="(ch, i) in secondWordLetters"
              :key="`t2-${i}`"
              class="char"
              :style="{ '--delay': `${titleStartDelay + (firstWordLetters.length + i) * letterDelay}s` }"
              v-text="ch"
            />
          </span>
        </h1>
        <div class="subtitle-text hero-section__subtitle" aria-label="комфорт, который становится частью вашего дня">
          <span
            v-for="(ch, i) in subtitleLetters"
            :key="`s-${i}`"
            class="char"
            :class="{ space: ch === ' ' }"
            :style="{ '--delay': `${subtitleStartDelay + i * letterDelay}s` }"
            v-html="ch === ' ' ? '&nbsp;' : ch"
          />
        </div>
      </div>
    </div>
    <div class="hero-section__bg">
      <img src="../assets/img/hero-bg.png" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const titleText = 'Поинт Токсово'
const subtitleText = 'комфорт, который становится частью вашего дня'

const letterDelay = 0.05 // seconds per letter
const titleStartDelay = 0.3 // initial delay before title starts

const titleLetters = computed(() => Array.from(titleText))
const [firstWord, secondWord] = titleText.split(' ')
const firstWordLetters = computed(() => Array.from(firstWord))
const secondWordLetters = computed(() => Array.from(secondWord))
const subtitleLetters = computed(() => Array.from(subtitleText))

const subtitleStartDelay = computed(
  () => titleStartDelay + titleLetters.value.length * letterDelay + 0.2
)
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  background: url('../assets/img/bg-sky.jpg') top center/100% auto no-repeat;
  min-height: 100vh;

  &__container {
    min-height: 100vh;
  }

  &__content {
    margin: 0 auto;
    padding-top: 100px;
    max-width: 660px;
    text-align: center;
  }

  &__subtitle {
    font-size: 36px;
    line-height: 110%;
    max-width: 460px;
    margin: 0 auto;
    padding-top: 30px;
  }

  &__bg {
    position: absolute;
    bottom: 0;
    // transform: scale(2.9);
  }
}

.char {
  display: inline-block;
  opacity: 0;
  transform: translateY(110%);
  transform-origin: bottom;
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay);
  will-change: transform, opacity;
}

.word {
  display: inline-block;
  white-space: nowrap; // keep letters of a word together
  overflow: hidden; // clip letters so they slide in from below
}

.space {
  width: 0.5ch;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .char {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>

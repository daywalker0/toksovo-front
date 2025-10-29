import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginImport from 'eslint-plugin-import'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      '.nuxt/**',
      'dist/**',
      'node_modules/**',
      '.output/**',
      'pages/index.vue',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  pluginImport.flatConfigs.recommended,
  {
    files: ['pages/**/*.vue'],
    rules: {
      'no-await-in-top-level': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        allowAwaitOutsideFunction: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Nuxt auto-imports
        $fetch: 'readonly',
        useRuntimeConfig: 'readonly',
        navigateTo: 'readonly',
        defineNuxtPlugin: 'readonly',
        useNuxtApp: 'readonly',
        useHead: 'readonly',
        defineStore: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onBeforeMount: 'readonly',
        onUnmounted: 'readonly',
        onBeforeUnmount: 'readonly',
        nextTick: 'readonly',
        // Project composables
        useApi: 'readonly',
        useMedia: 'readonly',
        useLenis: 'readonly',
      },
    },
    rules: {
      // базовые правила
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-useless-catch': 'warn',
      'no-empty': 'warn',
      'no-dupe-keys': 'error',

      // Vue
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/attributes-order': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/max-attributes-per-line': 'off',

      // import
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/extensions': 'off',
      
      // code style
      'consistent-return': 'off',
      'no-irregular-whitespace': 'off',
      'no-underscore-dangle': 'off',
      'arrow-body-style': 'off',
    },
  },
  prettier,
])

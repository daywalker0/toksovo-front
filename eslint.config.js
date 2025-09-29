import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginImport from 'eslint-plugin-import'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      // базовые правила
      'no-unused-vars': 'warn',
      'no-console': 'warn',

      // Vue
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off', // Hero.vue, Footer.vue и т.д.
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      }],

      // import
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'consistent-return': 'off',
      'no-irregular-whitespace': 'off',
      'no-underscore-dangle': 'off',
      'import/extensions': 'off',
      'arrow-body-style': 'off',
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  pluginImport.flatConfigs.recommended,
  prettier,
])

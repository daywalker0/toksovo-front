# ПОИНТ ТОКСОВО

Официальный сайт жилого комплекса ПОИНТ ТОКСОВО в Токсово, Ленинградская область.

## Технологии

- **Nuxt 3** - Vue.js фреймворк для SSR и статической генерации
- **Vue 3** - прогрессивный JavaScript фреймворк
- **GSAP** - библиотека анимаций
- **Lenis** - плавная прокрутка
- **Swiper** - современные слайдеры
- **Pinia** - state management
- **Sass** - препроцессор CSS

## Установка

```bash
npm install
```

## Разработка

Запуск dev-сервера на `http://localhost:3000`:

```bash
npm run dev
```

## Production

Сборка для продакшена:

```bash
npm run generate
```

Результат сборки находится в папке `.output/public/`

## Структура проекта

- `assets/` - статические ресурсы (стили, шрифты, изображения)
- `components/` - Vue компоненты
- `composables/` - переиспользуемые composition функции
- `pages/` - страницы приложения
- `stores/` - Pinia stores
- `plugins/` - Nuxt плагины
- `public/` - публичные файлы (favicon, robots.txt)

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
NUXT_PUBLIC_YANDEX_MAPS_API_KEY=your_api_key
NUXT_PUBLIC_API_URL=your_api_url
NUXT_PUBLIC_API_TOKEN=your_api_token
```

## Лицензия

© 2025 ПОИНТ ТОКСОВО. Все права защищены.

# Настройка API для проекта Toksovo Front

## Конфигурация Strapi API

Этот проект использует **Strapi** в качестве бэкенда.

### Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Strapi API Configuration
NUXT_PUBLIC_API_URL=http://85.193.87.116:1338
NUXT_PUBLIC_API_TOKEN=your_strapi_api_token_here

# Yandex Maps API Key
NUXT_PUBLIC_YANDEX_MAPS_API_KEY=your_yandex_maps_key_here
```

### API Endpoints

#### Главная страница
- **GET** `/api/glavnaya?populate=deep,3` - получить все данные главной страницы с блоками

#### Новости
- **GET** `/api/novostis` - получить все новости
- **GET** `/api/novostis/:documentId` - получить конкретную новость по documentId
- **GET** `/api/novostis?populate=*&pagination[limit]=4&sort=createdAt:desc` - получить последние 4 новости

#### Проекты
- **GET** `/api/proekties` - получить все проекты
- **GET** `/api/proekties/:documentId` - получить конкретный проект по documentId

### Блоки на главной странице

Strapi возвращает данные в следующем формате:

```json
{
  "data": {
    "id": 10,
    "documentId": "emeflqp7p1t3cn3srb0ue4wp",
    "title": "Поинт Токсово – квартиры от застройщика",
    "blocks": [
      {
        "__component": "blocks.glavnyj-blok-s-renderom",
        "id": 9,
        "title": "Поинт Токсово",
        "description": "Дома у озера с пляжем..."
      },
      {
        "__component": "blocks.novosti",
        "id": 8,
        "title": "Новости"
      }
    ]
  },
  "meta": {}
}
```

### Доступные блоки

1. **glavnyj-blok-s-renderom** — главный блок с рендером
2. **cpokojstvie-svezhest-priroda** — спокойствие свежесть природа
3. **lokaczii-ryadom** — локации рядом
4. **zhit-sredi-prirody** — жить среди природы
5. **genplan** — генплан
6. **zhit-v-stile** — жить в стиле
7. **zhit-s-pervyh-shagov** — жить с первых шагов
8. **karta-s-pinami-infrastruktury** — карта с пинами инфраструктуры
9. **tipovye-planirovki** — типовые планировки
10. **osobennosti** — особенности
11. **hod-stroitelstva** — ход строительства
12. **novosti** — новости
13. **drugie-proekty** — другие проекты

### Структура данных новостей

Strapi возвращает новости в формате:

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123...",
      "title": "Заголовок новости",
      "description": "Краткое описание",
      "content": "Полный текст новости",
      "createdAt": "2024-09-17T10:00:00Z",
      "updatedAt": "2024-09-17T10:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 4
    }
  }
}
```

### Важные замечания

1. **documentId vs id**: Strapi использует `documentId` для идентификации документов в API. В URL-ах используйте `documentId`.

2. **populate**: Для получения связанных данных используйте параметр `populate`:
   - `populate=*` - получить все связи первого уровня
   - `populate=deep,3` - получить все связи до 3 уровня вложенности

3. **Фильтрация и сортировка**:
   - Сортировка: `sort=createdAt:desc`
   - Лимит: `pagination[limit]=4`
   - Пагинация: `pagination[page]=1&pagination[pageSize]=10`

4. **Авторизация**: Все запросы к API должны содержать заголовок:
   ```
   Authorization: Bearer YOUR_API_TOKEN
   ```

### Использование в коде

#### useApi composable

```javascript
const { get } = useApi()
const response = await get('/api/novostis?populate=*')
// response.data содержит массив новостей
```

#### useNewsApi composable

```javascript
const newsApi = useNewsApi()

// Получить все новости
const allNews = await newsApi.fetchAllNews()

// Получить новость по documentId
const news = await newsApi.fetchNewsById('abc123...')

// Получить последние новости
const latestNews = await newsApi.fetchLatestNews(4)
```

### Troubleshooting

1. **Ошибка 401 Unauthorized**: Проверьте правильность токена в `.env`
2. **Ошибка 404 Not Found**: Проверьте правильность эндпоинта и documentId
3. **Пустой ответ**: Убедитесь, что используете `populate` параметр для получения связанных данных
4. **CORS ошибки**: Убедитесь, что CORS настроен правильно на сервере Strapi


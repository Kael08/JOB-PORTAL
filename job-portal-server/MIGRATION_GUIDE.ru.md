# Руководство по миграции с Express на NestJS

## Обзор изменений

Проект был полностью переписан с Express на NestJS с улучшенной архитектурой и структурой кода.

## Что изменилось

### 1. Структура проекта

**Старая структура (Express):**
```
├── index.js          # Весь код в одном файле
├── package.json
└── .env
```

**Новая структура (NestJS):**
```
src/
├── common/           # Общие компоненты (фильтры, интерсепторы)
├── config/           # Конфигурация
├── database/         # Модуль базы данных
├── modules/          # Функциональные модули
│   ├── jobs/        # Модуль вакансий
│   └── applications/# Модуль заявок
├── app.module.ts    # Главный модуль
└── main.ts          # Точка входа
```

### 2. Технологические изменения

| Аспект | Было (Express) | Стало (NestJS) |
|--------|---------------|----------------|
| Язык | JavaScript | TypeScript |
| Архитектура | Монолитный файл | Модульная |
| Валидация | Ручная | Автоматическая (class-validator) |
| Обработка ошибок | try-catch везде | Централизованная |
| Dependency Injection | Нет | Да |
| Типизация | Нет | Полная |

### 3. API Endpoints

API endpoints остались теми же, изменений не требуется со стороны фронтенда:

- ✅ `GET /all-jobs` - работает
- ✅ `GET /all-jobs/:id` - работает
- ✅ `GET /myJobs/:email` - работает
- ✅ `POST /post-job` - работает
- ✅ `PATCH /update-job/:id` - работает
- ✅ `DELETE /job/:id` - работает
- ✅ `POST /job/:id/apply` - работает
- ✅ `GET /job/:id/applications` - работает

### 4. Переменные окружения

Переменные окружения остались теми же:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*
```

## Шаги миграции

### 1. Резервное копирование

Старый Express файл (`index.js`) можно сохранить для справки, но он больше не используется.

### 2. Установка зависимостей

```bash
cd job-portal-server
npm install
```

### 3. Проверка переменных окружения

Убедитесь, что ваш `.env` файл содержит все необходимые переменные.

### 4. Сборка проекта

```bash
npm run build
```

### 5. Запуск

**Режим разработки:**
```bash
npm run start:dev
```

**Production режим:**
```bash
npm run start:prod
```

## Преимущества новой архитектуры

### 1. Модульность
- Каждая функция изолирована в своем модуле
- Легко добавлять новые функции
- Проще тестировать

### 2. Типизация
- Полная типизация TypeScript
- Меньше ошибок на этапе разработки
- Лучшая поддержка IDE

### 3. Валидация
```typescript
// Автоматическая валидация с помощью декораторов
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  jobTitle: string;
}
```

### 4. Dependency Injection
```typescript
// Автоматическое внедрение зависимостей
constructor(
  @Inject(DATABASE_POOL) private readonly pool: Pool,
) {}
```

### 5. Обработка ошибок
- Централизованная обработка через фильтры
- Единообразные ответы об ошибках
- Логирование в одном месте

### 6. Интерсепторы
- Автоматическое преобразование snake_case → camelCase
- Добавление поля `_id` для совместимости
- Легко добавить логирование, кэширование и т.д.

## Сравнение кода

### Старый код (Express)

```javascript
app.post("/post-job", async (req, res) => {
  try {
    const { jobTitle, companyName, ... } = req.body;

    // Валидация вручную
    if (!jobTitle) {
      return res.status(400).json({ message: "Job title required" });
    }

    // SQL запрос
    const query = `INSERT INTO jobs ...`;
    const result = await pool.query(query, values);

    // Преобразование вручную
    const camelCase = toCamelCase(result.rows[0]);

    res.json(camelCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
```

### Новый код (NestJS)

```typescript
// DTO с автоматической валидацией
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;
}

// Контроллер
@Post('post-job')
async create(@Body() createJobDto: CreateJobDto) {
  return this.jobsService.create(createJobDto);
  // Валидация, обработка ошибок и преобразование - автоматически!
}

// Сервис
async create(createJobDto: CreateJobDto): Promise<Job> {
  const query = `INSERT INTO jobs ...`;
  const result = await this.pool.query(query, values);
  return result.rows[0]; // camelCase конверсия - автоматически через interceptor
}
```

## Добавление новых функций

### Старый способ (Express)

Добавить новый endpoint в `index.js` (файл становится огромным)

### Новый способ (NestJS)

1. Создать новый модуль:
```bash
nest g module feature-name
nest g controller feature-name
nest g service feature-name
```

2. Добавить DTO для валидации
3. Реализовать бизнес-логику в сервисе
4. Добавить endpoints в контроллер

## Возможные проблемы и решения

### Проблема: Ошибка подключения к БД

**Решение:**
- Проверьте настройки в `.env`
- Убедитесь, что PostgreSQL запущен
- Проверьте права доступа пользователя БД

### Проблема: TypeScript ошибки при сборке

**Решение:**
```bash
npm run build
```
Исправьте ошибки типов в коде

### Проблема: CORS ошибки

**Решение:**
Обновите `CORS_ORIGIN` в `.env` файле

## Обратная совместимость

Проект полностью обратно совместим с фронтендом. Все API endpoints работают так же, как и раньше.

## Поддержка

Все комментарии в коде теперь на русском языке для упрощения понимания и поддержки.

## Рекомендации

1. ✅ Используйте `npm run start:dev` для разработки
2. ✅ Проверяйте типы перед коммитом
3. ✅ Добавляйте комментарии на русском
4. ✅ Следуйте модульной архитектуре
5. ✅ Используйте DTO для всех входящих данных

## Дальнейшие улучшения

Рекомендуемые улучшения для будущих версий:

1. Добавить аутентификацию (JWT)
2. Добавить Swagger документацию
3. Добавить unit и e2e тесты
4. Добавить Redis для кэширования
5. Добавить миграции БД (TypeORM или Prisma)
6. Добавить GraphQL API
7. Добавить Docker контейнеризацию

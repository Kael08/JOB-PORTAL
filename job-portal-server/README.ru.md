# Job Portal API - NestJS

Современный REST API для портала вакансий, построенный на NestJS и PostgreSQL.

## 📋 Содержание

- [Описание](#описание)
- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Установка](#установка)
- [Конфигурация](#конфигурация)
- [Запуск](#запуск)
- [API Endpoints](#api-endpoints)
- [Архитектура](#архитектура)

## 📖 Описание

Это серверная часть приложения Job Portal, переписанная с Express на NestJS для улучшения структуры кода, масштабируемости и поддерживаемости.

### Основные возможности:

- ✅ CRUD операции для вакансий
- ✅ Подача заявок на вакансии
- ✅ Фильтрация вакансий по email пользователя
- ✅ Валидация данных с помощью class-validator
- ✅ Глобальная обработка ошибок
- ✅ Автоматическое преобразование snake_case в camelCase
- ✅ Настройка CORS для работы с фронтендом
- ✅ Пул соединений PostgreSQL

## 🛠 Технологии

- **NestJS** v10.3 - прогрессивный Node.js фреймворк
- **TypeScript** v5.3 - типизированный JavaScript
- **PostgreSQL** v8.13 - реляционная база данных
- **class-validator** - валидация DTO
- **pg** - драйвер PostgreSQL

## 📁 Структура проекта

```
src/
├── common/                    # Общие компоненты
│   ├── filters/              # Фильтры исключений
│   │   └── http-exception.filter.ts
│   └── interceptors/         # Интерсепторы
│       └── camel-case.interceptor.ts
├── config/                   # Конфигурация
│   └── database.config.ts   # Настройки БД
├── database/                 # Модуль базы данных
│   └── database.module.ts   # Пул соединений PostgreSQL
├── modules/                  # Функциональные модули
│   ├── jobs/                # Модуль вакансий
│   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── create-job.dto.ts
│   │   │   └── update-job.dto.ts
│   │   ├── entities/       # Сущности
│   │   │   └── job.entity.ts
│   │   ├── jobs.controller.ts  # Контроллер
│   │   ├── jobs.service.ts     # Сервис
│   │   └── jobs.module.ts      # Модуль
│   └── applications/        # Модуль заявок
│       ├── dto/
│       │   └── create-application.dto.ts
│       ├── entities/
│       │   └── application.entity.ts
│       ├── applications.controller.ts
│       ├── applications.service.ts
│       └── applications.module.ts
├── app.controller.ts        # Главный контроллер
├── app.module.ts            # Главный модуль
└── main.ts                  # Точка входа

```

## 🚀 Установка

### Требования:

- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm или yarn

### Шаги установки:

1. Установите зависимости:

```bash
npm install
```

2. Создайте базу данных PostgreSQL и выполните SQL из файла `init.sql`:

```bash
psql -U postgres -d job_portal -f init.sql
```

## ⚙️ Конфигурация

Создайте файл `.env` в корне проекта:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Origins
CORS_ORIGIN=http://localhost:5173
```

## 🏃 Запуск

### Режим разработки (с hot-reload):

```bash
npm run start:dev
```

### Режим production:

```bash
# Сборка проекта
npm run build

# Запуск
npm run start:prod
```

### Отладка:

```bash
npm run start:debug
```

Сервер запустится на `http://localhost:5000`

## 📚 API Endpoints

### Вакансии (Jobs)

#### Получить все вакансии
```http
GET /all-jobs
```

#### Получить вакансию по ID
```http
GET /all-jobs/:id
```

#### Получить вакансии пользователя
```http
GET /myJobs/:email
```

#### Создать вакансию
```http
POST /post-job
Content-Type: application/json

{
  "jobTitle": "Frontend Developer",
  "companyName": "Tech Company",
  "companyLogo": "https://example.com/logo.png",
  "minPrice": "50000",
  "maxPrice": "80000",
  "salaryType": "Yearly",
  "jobLocation": "Moscow",
  "postingDate": "2024-01-15",
  "experienceLevel": "Middle",
  "employmentType": "Full-time",
  "description": "Описание вакансии...",
  "postedBy": "user@example.com",
  "skills": ["React", "TypeScript", "CSS"]
}
```

#### Обновить вакансию
```http
PATCH /update-job/:id
Content-Type: application/json

{
  "jobTitle": "Senior Frontend Developer",
  "maxPrice": "100000"
}
```

#### Удалить вакансию
```http
DELETE /job/:id
```

### Заявки (Applications)

#### Подать заявку на вакансию
```http
POST /job/:id/apply
Content-Type: application/json

{
  "resumeLink": "https://example.com/resume.pdf"
}
```

#### Получить заявки на вакансию
```http
GET /job/:id/applications
```

## 🏗 Архитектура

### Слои приложения:

1. **Контроллеры (Controllers)** - обрабатывают HTTP запросы и валидируют входящие данные
2. **Сервисы (Services)** - содержат бизнес-логику
3. **Сущности (Entities)** - описывают структуру данных
4. **DTO (Data Transfer Objects)** - валидация и типизация входящих/исходящих данных
5. **Модули (Modules)** - объединяют компоненты в функциональные единицы

### Особенности архитектуры:

- **Dependency Injection** - автоматическое внедрение зависимостей
- **Модульность** - каждая функция изолирована в своем модуле
- **Валидация** - автоматическая валидация данных с помощью декораторов
- **Интерсепторы** - преобразование данных перед отправкой клиенту
- **Фильтры** - централизованная обработка ошибок
- **Глобальный пул соединений БД** - оптимальная работа с PostgreSQL

### Преобразование данных:

Все данные из БД автоматически преобразуются из `snake_case` в `camelCase` для совместимости с фронтендом. Также добавляется поле `_id` для совместимости с MongoDB-подобным API.

Пример:
```javascript
// БД (snake_case)
{ job_title: "Developer", company_name: "Tech Co" }

// API ответ (camelCase)
{ jobTitle: "Developer", companyName: "Tech Co", _id: 1 }
```

## 🔧 Разработка

### Форматирование кода:

```bash
npm run format
```

### Линтинг:

```bash
npm run lint
```

### Тестирование:

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

## 📝 Миграция с Express

Проект был полностью переписан с Express на NestJS со следующими улучшениями:

1. ✅ Четкая модульная структура
2. ✅ Типизация TypeScript везде
3. ✅ Валидация данных с помощью декораторов
4. ✅ Dependency Injection
5. ✅ Централизованная обработка ошибок
6. ✅ Автоматическое преобразование данных
7. ✅ Лучшая масштабируемость и поддерживаемость
8. ✅ Комментарии на русском языке

## 🤝 Вклад в проект

При добавлении новых функций придерживайтесь следующей структуры:

1. Создайте новый модуль в `src/modules/`
2. Добавьте DTO для валидации
3. Создайте сервис с бизнес-логикой
4. Создайте контроллер для обработки запросов
5. Добавьте комментарии на русском языке

## 📄 Лицензия

ISC

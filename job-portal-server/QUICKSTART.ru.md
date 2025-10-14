# Быстрый старт

## Установка и запуск за 5 минут

### 1. Установите зависимости

```bash
cd job-portal-server
npm install
```

### 2. Настройте базу данных

Создайте базу данных PostgreSQL и выполните SQL из `init.sql`:

```bash
# Войдите в PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE job_portal;

# Выполните SQL из файла
\i init.sql
```

Или выполните напрямую:

```bash
psql -U postgres -d job_portal -f init.sql
```

### 3. Настройте переменные окружения

Скопируйте `.env.example` в `.env` и настройте:

```bash
cp .env.example .env
```

Откройте `.env` и установите:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=ваш_пароль_здесь
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Запустите сервер

**Режим разработки (с автоматической перезагрузкой):**

```bash
npm run start:dev
```

**Production режим:**

```bash
npm run build
npm run start:prod
```

### 5. Проверьте работу

Откройте браузер и перейдите на:

```
http://localhost:5000
```

Вы должны увидеть:

```json
{
  "message": "Hello Developer! Job Portal API работает на NestJS с PostgreSQL",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Доступные команды

```bash
# Разработка
npm run start:dev        # Запуск с hot-reload
npm run start:debug      # Запуск с отладкой

# Production
npm run build            # Сборка проекта
npm run start:prod       # Запуск production версии

# Качество кода
npm run format           # Форматирование кода
npm run lint             # Линтинг

# Тестирование
npm run test             # Unit тесты
npm run test:e2e         # E2E тесты
npm run test:cov         # Покрытие кода
```

## Тестирование API

### Получить все вакансии

```bash
curl http://localhost:5000/all-jobs
```

### Создать вакансию

```bash
curl -X POST http://localhost:5000/post-job \
  -H "Content-Type: application/json" \
  -d '{
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
    "description": "Описание вакансии",
    "postedBy": "user@example.com",
    "skills": ["React", "TypeScript"]
  }'
```

## Решение проблем

### Ошибка: Cannot connect to database

**Решение:**
1. Убедитесь, что PostgreSQL запущен
2. Проверьте настройки в `.env`
3. Проверьте, что база данных существует

```bash
psql -U postgres -l
```

### Ошибка: Port 5000 is already in use

**Решение:**
Измените порт в `.env`:

```env
PORT=5001
```

### Ошибка: Module not found

**Решение:**
Переустановите зависимости:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Структура проекта

```
src/
├── common/              # Общие компоненты
├── config/              # Конфигурация
├── database/            # Модуль БД
├── modules/             # Бизнес-модули
│   ├── jobs/           # Вакансии
│   └── applications/   # Заявки
├── app.module.ts       # Главный модуль
└── main.ts             # Точка входа
```

## Дополнительная документация

- [README.ru.md](./README.ru.md) - Полная документация
- [MIGRATION_GUIDE.ru.md](./MIGRATION_GUIDE.ru.md) - Руководство по миграции
- [init.sql](./init.sql) - SQL схема базы данных

## Поддержка

Все файлы содержат подробные комментарии на русском языке. Изучите код для лучшего понимания архитектуры.

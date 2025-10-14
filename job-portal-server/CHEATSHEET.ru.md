# Шпаргалка по проекту Job Portal (NestJS)

## 🚀 Быстрые команды

### Запуск
```bash
npm run start:dev      # Разработка (hot-reload)
npm run start:prod     # Production
```

### Сборка
```bash
npm run build         # Собрать проект
```

### Проверка кода
```bash
npm run lint          # Проверить код
npm run format        # Отформатировать код
```

---

## 📂 Где что находится

### Добавить новую вакансию endpoint
📁 `src/modules/jobs/jobs.controller.ts` - Добавить метод с декоратором
📁 `src/modules/jobs/jobs.service.ts` - Добавить бизнес-логику

### Изменить валидацию данных
📁 `src/modules/jobs/dto/create-job.dto.ts` - Добавить правила валидации

### Изменить обработку ошибок
📁 `src/common/filters/http-exception.filter.ts` - Глобальный обработчик

### Изменить формат ответа API
📁 `src/common/interceptors/camel-case.interceptor.ts` - Преобразование данных

### Настроить БД
📁 `src/config/database.config.ts` - Конфигурация подключения
📁 `src/database/database.module.ts` - Пул соединений

---

## 🔧 Частые задачи

### Добавить новый модуль

1. Создать структуру:
```bash
mkdir -p src/modules/my-feature/{dto,entities}
```

2. Создать файлы:
- `my-feature.module.ts`
- `my-feature.controller.ts`
- `my-feature.service.ts`
- `dto/create-my-feature.dto.ts`
- `entities/my-feature.entity.ts`

3. Добавить в `app.module.ts`:
```typescript
imports: [
  // ...
  MyFeatureModule,
]
```

### Добавить новый endpoint

В контроллере:
```typescript
@Get('new-endpoint')
async myNewEndpoint() {
  return this.myService.doSomething();
}
```

### Добавить валидацию

В DTO:
```typescript
export class MyDto {
  @IsString()
  @IsNotEmpty()
  myField: string;
}
```

### Работа с БД

В сервисе:
```typescript
constructor(
  @Inject(DATABASE_POOL) private pool: Pool,
) {}

async myQuery() {
  const result = await this.pool.query('SELECT * FROM table');
  return result.rows;
}
```

---

## 🐛 Решение проблем

### Ошибка компиляции TypeScript
```bash
npm run build
# Посмотреть ошибки и исправить типы
```

### Сервер не запускается
```bash
# Проверить .env файл
cat .env

# Проверить PostgreSQL
psql -U postgres -l
```

### CORS ошибки
Изменить в `src/main.ts`:
```typescript
app.enableCors({
  origin: ['http://your-frontend-url'],
  // ...
});
```

### Порт занят
Изменить в `.env`:
```
PORT=5001
```

---

## 📋 API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/` | Проверка работы API |
| GET | `/all-jobs` | Все вакансии |
| GET | `/all-jobs/:id` | Вакансия по ID |
| GET | `/myJobs/:email` | Вакансии пользователя |
| POST | `/post-job` | Создать вакансию |
| PATCH | `/update-job/:id` | Обновить вакансию |
| DELETE | `/job/:id` | Удалить вакансию |
| POST | `/job/:id/apply` | Подать заявку |
| GET | `/job/:id/applications` | Заявки на вакансию |

---

## 🗂️ Структура модуля

Каждый модуль должен иметь:

```
my-module/
├── dto/                    # Валидация данных
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── entities/               # Структура данных
│   └── *.entity.ts
├── *.controller.ts         # HTTP endpoints
├── *.service.ts            # Бизнес-логика
└── *.module.ts             # Модуль NestJS
```

---

## 💡 Полезные декораторы

### Контроллер
```typescript
@Controller('path')        // Базовый путь
@Get('route')             // GET запрос
@Post('route')            // POST запрос
@Patch('route')           // PATCH запрос
@Delete('route')          // DELETE запрос
@Param('id')              // URL параметр
@Body()                   // Тело запроса
@Query('param')           // Query параметр
```

### Валидация
```typescript
@IsString()               // Строка
@IsNumber()               // Число
@IsNotEmpty()             // Не пустое
@IsOptional()             // Необязательное
@IsEmail()                // Email
@IsUrl()                  // URL
@IsArray()                // Массив
@Min(0)                   // Минимум
@Max(100)                 // Максимум
```

### Инъекция зависимостей
```typescript
@Injectable()             // Сервис
@Inject(TOKEN)            // Инъекция
@Global()                 // Глобальный модуль
```

---

## 📝 Комментарии в коде

Всегда добавляйте JSDoc комментарии:

```typescript
/**
 * Краткое описание функции
 * @param param1 - Описание параметра
 * @returns Описание возвращаемого значения
 * @throws NotFoundException если не найдено
 */
async myFunction(param1: string): Promise<Result> {
  // Код функции
}
```

---

## 🔍 Отладка

### Логирование
```typescript
console.log('Debug:', data);
console.error('Error:', error);
```

### Отладчик VS Code
Запустить:
```bash
npm run start:debug
```

Добавить breakpoint в коде и запустить отладчик в VS Code (F5)

---

## 📦 Зависимости

### Основные
- `@nestjs/common` - Базовые компоненты NestJS
- `@nestjs/core` - Ядро NestJS
- `@nestjs/config` - Конфигурация
- `pg` - PostgreSQL драйвер
- `class-validator` - Валидация
- `class-transformer` - Трансформация данных

### Разработка
- `@nestjs/cli` - CLI для NestJS
- `typescript` - TypeScript компилятор
- `eslint` - Линтер
- `prettier` - Форматтер

---

## 🎓 Полезные ссылки

- **Документация NestJS:** https://docs.nestjs.com/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **class-validator:** https://github.com/typestack/class-validator
- **PostgreSQL:** https://www.postgresql.org/docs/

---

## ⚡ Git workflow

```bash
# Проверить изменения
git status

# Добавить файлы
git add .

# Коммит
git commit -m "feat: добавлена новая функция"

# Пуш
git push origin main
```

### Типы коммитов
- `feat:` - Новая функция
- `fix:` - Исправление бага
- `docs:` - Документация
- `style:` - Форматирование
- `refactor:` - Рефакторинг
- `test:` - Тесты
- `chore:` - Обслуживание

---

## 📊 Мониторинг

### Проверить работу API
```bash
curl http://localhost:5000
```

### Проверить endpoint
```bash
curl http://localhost:5000/all-jobs
```

### Проверить БД
```bash
psql -U postgres -d job_portal -c "SELECT COUNT(*) FROM jobs;"
```

---

**Эта шпаргалка содержит самые часто используемые команды и паттерны проекта.**

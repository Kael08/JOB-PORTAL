# Инструкция по деплою с очисткой кеша

## Проблема
После деплоя на сервер функционал работает только доли секунды, а потом перестает отвечать. Это происходит из-за кеша старых файлов.

## Решение

### Вариант 1: Использование скриптов npm (Рекомендуется)

#### Полная очистка и пересборка:
```bash
npm run deploy
```

#### Очистка кеша перед сборкой:
```bash
npm run build:clean
```

#### Очистка кеша и перезапуск:
```bash
npm run restart:prod
```

#### Только очистка кеша:
```bash
npm run clean
```

### Вариант 2: Использование скриптов деплоя

#### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Windows (PowerShell):
```powershell
.\deploy.ps1
```

### Вариант 3: Ручная очистка

```bash
# Удаление скомпилированных файлов
rm -rf dist

# Удаление кеша TypeScript
rm -f tsconfig.tsbuildinfo

# Удаление кеша node_modules
rm -rf node_modules/.cache

# Пересборка
npm run build

# Запуск
npm run start:prod
```

## Что очищается:

1. **dist/** - скомпилированные JavaScript файлы
2. **tsconfig.tsbuildinfo** - кеш TypeScript компилятора
3. **node_modules/.cache** - кеш модулей Node.js

## Рекомендации:

1. **Всегда используйте `npm run deploy`** перед деплоем на продакшн
2. **Останавливайте старый процесс** перед запуском нового:
   ```bash
   # Найти процесс
   ps aux | grep node
   # Или
   lsof -i :5000
   
   # Убить процесс
   kill -9 <PID>
   ```
3. **Используйте process manager** (PM2, forever, systemd) для автоматического перезапуска:
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name job-portal
   pm2 restart job-portal
   ```

## Автоматический деплой с PM2:

```bash
# Установка PM2
npm install -g pm2

# Деплой
npm run deploy

# Запуск с PM2
pm2 start dist/main.js --name job-portal

# Или перезапуск существующего процесса
pm2 restart job-portal
```


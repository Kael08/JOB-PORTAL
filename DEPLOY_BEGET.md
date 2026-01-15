# Инструкция по деплою на Beget

## ⚠️ ВАЖНО: Исправления применены в коде
- ✅ Исправлен `client/index.html` - редирект теперь происходит ПОСЛЕ загрузки React
- ✅ Исправлен `client/src/main.jsx` - добавлена обработка редиректа после монтирования
- ✅ Исправлен `job-portal` (nginx конфиг) - убран `internal` из location = /index.html

---

## Шаг 1: Подготовка (на локальной машине)

### 1.1. Бэкап базы данных (если нужно)
```bash
# На старом сервере (если есть доступ)
pg_dump -h <DB_HOST> -U <DB_USER> -d <DB_NAME> > backup_$(date +%Y%m%d).sql
```

### 1.2. Коммит изменений в Git
```bash
git add .
git commit -m "Fix: исправлена проблема с кликабельностью - редирект после монтирования React"
git push origin main
```

---

## Шаг 2: Удаление старого сервера сайта на Beget

1. Войдите в панель управления Beget
2. Перейдите в раздел **"Управление серверами"** или **"VPS"**
3. Найдите сервер с Ubuntu, на котором размещен сайт
4. **ОСТОРОЖНО**: Убедитесь, что это именно сервер сайта, а НЕ сервер БД
5. Удалите или остановите сервер
6. **Сохраните данные** (если Beget предлагает):
   - IP-адрес (может понадобиться)
   - Данные для SSH доступа

---

## Шаг 3: Создание нового сервера на Beget

1. В панели Beget создайте **новый VPS сервер**
2. Выберите:
   - **ОС**: Ubuntu 20.04 или 22.04 LTS
   - **Конфигурация**: минимум 1 CPU, 1GB RAM (рекомендуется 2GB)
3. Запишите:
   - **IP-адрес сервера**
   - **Логин** (обычно `root` или `beget`)
   - **Пароль** (или SSH ключ)

---

## Шаг 4: Подключение и настройка нового сервера

### 4.1. Подключение по SSH
```bash
ssh root@<IP_АДРЕС_СЕРВЕРА>
# или
ssh beget@<IP_АДРЕС_СЕРВЕРА>
```

### 4.2. Обновление системы
```bash
sudo apt update && sudo apt upgrade -y
```

### 4.3. Установка необходимых пакетов
```bash
sudo apt install -y nginx git curl

# Установка Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка версий
node --version  # должно быть v18.x или выше
npm --version
nginx -v
```

### 4.4. Установка PM2 для управления Node.js процессами
```bash
sudo npm install -g pm2
```

### 4.5. Установка certbot для SSL сертификатов
```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## Шаг 5: Настройка проекта

### 5.1. Создание пользователя для проекта (опционально, но рекомендуется)
```bash
sudo useradd -m -s /bin/bash job-portal
sudo su - job-portal
```

### 5.2. Клонирование проекта
```bash
cd ~
git clone <URL_ВАШЕГО_GIT_РЕПОЗИТОРИЯ> job-portal
cd job-portal
```

**Если репозиторий приватный**, используйте SSH ключ или токен:
```bash
git clone git@github.com:username/repo.git job-portal
# или
git clone https://username:token@github.com/username/repo.git job-portal
```

---

## Шаг 6: Настройка бэкенда (NestJS)

### 6.1. Установка зависимостей
```bash
cd ~/job-portal/server
npm install
```

### 6.2. Создание .env файла
```bash
nano .env
```

Вставьте следующее (замените на ваши реальные данные):
```env
DATABASE_HOST=<IP_ИЛИ_ХОСТ_СЕРВЕРА_БД>
DATABASE_PORT=5432
DATABASE_USER=<ПОЛЬЗОВАТЕЛЬ_БД>
DATABASE_PASSWORD=<ПАРОЛЬ_БД>
DATABASE_NAME=<ИМЯ_БД>
PORT=5000
NODE_ENV=production
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

### 6.3. Сборка проекта
```bash
npm run build
```

### 6.4. Запуск через PM2
```bash
# Запуск приложения
pm2 start dist/main.js --name job-portal-api

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска при перезагрузке сервера
pm2 startup
# Выполните команду, которую выведет PM2 (обычно что-то вроде sudo env PATH=...)
```

### 6.5. Проверка работы бэкенда
```bash
pm2 status
pm2 logs job-portal-api
```

Должен быть статус `online`. Проверьте логи на ошибки.

---

## Шаг 7: Настройка фронтенда (React/Vite)

### 7.1. Установка зависимостей
```bash
cd ~/job-portal/client
npm install
```

### 7.2. Создание .env файла
```bash
nano .env
```

Вставьте:
```env
VITE_API_URL=https://rabota.elistory.ru/api
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

### 7.3. Сборка проекта
```bash
npm run build
```

После сборки файлы будут в папке `dist/`.

### 7.4. Проверка сборки
```bash
ls -la dist/
```

Должны быть файлы: `index.html`, `assets/`, `images/`, и т.д.

---

## Шаг 8: Настройка Nginx

### 8.1. Копирование конфига
```bash
sudo cp ~/job-portal/job-portal /etc/nginx/sites-available/rabota.elistory.ru
```

### 8.2. Редактирование конфига (если нужно изменить пути)
```bash
sudo nano /etc/nginx/sites-available/rabota.elistory.ru
```

**ВАЖНО**: Проверьте путь в строке 31:
```nginx
root /home/job-portal/client/dist;
```

Если вы используете другого пользователя, измените путь соответственно:
- Если пользователь `root`: `root /root/job-portal/client/dist;`
- Если пользователь `beget`: `root /home/beget/job-portal/client/dist;`

### 8.3. Создание символической ссылки
```bash
sudo ln -s /etc/nginx/sites-available/rabota.elistory.ru /etc/nginx/sites-enabled/
```

### 8.4. Удаление дефолтного конфига (если есть)
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 8.5. Проверка конфигурации
```bash
sudo nginx -t
```

Должно быть: `syntax is ok`, `test is successful`

### 8.6. Перезагрузка Nginx
```bash
sudo systemctl reload nginx
# или
sudo systemctl restart nginx
```

---

## Шаг 9: Настройка SSL сертификата (Let's Encrypt)

### 9.1. Получение сертификата
```bash
sudo certbot --nginx -d rabota.elistory.ru
```

Следуйте инструкциям:
- Введите email для уведомлений
- Согласитесь с условиями
- Выберите редирект HTTP → HTTPS (рекомендуется: 2)

### 9.2. Проверка автообновления
```bash
sudo certbot renew --dry-run
```

---

## Шаг 10: Настройка DNS

1. В панели управления доменом найдите настройки DNS
2. Убедитесь, что есть A-запись:
   ```
   rabota.elistory.ru → <IP_АДРЕС_НОВОГО_СЕРВЕРА>
   ```
3. Если нужно изменить, обновите A-запись на новый IP

**Время распространения DNS**: 5-30 минут (иногда до 24 часов)

---

## Шаг 11: Проверка работы сайта

### 11.1. Проверка доступности
```bash
curl -I https://rabota.elistory.ru
```

Должен вернуть статус `200 OK`.

### 11.2. Проверка в браузере
1. Откройте `https://rabota.elistory.ru`
2. Откройте консоль разработчика (F12)
3. Проверьте:
   - Нет ошибок в консоли
   - Все ресурсы загружаются (Network tab)
   - Кнопки кликабельны
   - API запросы работают

### 11.3. Проверка логов
```bash
# Логи Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Логи PM2
pm2 logs job-portal-api
```

---

## Шаг 12: Настройка автозапуска и мониторинга

### 12.1. Проверка автозапуска PM2
```bash
pm2 startup
pm2 save
```

### 12.2. Настройка мониторинга (опционально)
```bash
pm2 monit
```

---

## Возможные проблемы и решения

### Проблема: Сайт не открывается
**Решение**:
1. Проверьте статус Nginx: `sudo systemctl status nginx`
2. Проверьте статус PM2: `pm2 status`
3. Проверьте логи: `sudo tail -f /var/log/nginx/error.log`
4. Проверьте файрвол: `sudo ufw status`

### Проблема: 502 Bad Gateway
**Решение**:
1. Проверьте, запущен ли бэкенд: `pm2 status`
2. Проверьте порт 5000: `sudo netstat -tlnp | grep 5000`
3. Перезапустите бэкенд: `pm2 restart job-portal-api`

### Проблема: SSL сертификат не работает
**Решение**:
1. Проверьте DNS: `nslookup rabota.elistory.ru`
2. Проверьте порты 80 и 443: `sudo ufw allow 80 && sudo ufw allow 443`
3. Перевыпустите сертификат: `sudo certbot renew --force-renewal`

### Проблема: Кнопки не кликабельны
**Решение**:
1. Очистите кеш браузера (Ctrl+Shift+Delete)
2. Проверьте консоль браузера на ошибки JavaScript
3. Проверьте, что файлы в `dist/` актуальные: `ls -la ~/job-portal/client/dist/`
4. Пересоберите фронтенд: `cd ~/job-portal/client && npm run build`

---

## Полезные команды

```bash
# Перезапуск бэкенда
pm2 restart job-portal-api

# Перезапуск Nginx
sudo systemctl restart nginx

# Пересборка фронтенда
cd ~/job-portal/client && npm run build

# Обновление проекта из Git
cd ~/job-portal && git pull && cd server && npm install && npm run build && cd ../client && npm install && npm run build && pm2 restart job-portal-api

# Просмотр логов
pm2 logs job-portal-api --lines 100
sudo tail -f /var/log/nginx/error.log
```

---

## Контрольный список

- [ ] Старый сервер удален/остановлен
- [ ] Новый сервер создан и настроен
- [ ] Node.js и npm установлены
- [ ] Проект склонирован из Git
- [ ] Бэкенд собран и запущен через PM2
- [ ] Фронтенд собран
- [ ] Nginx настроен и перезагружен
- [ ] SSL сертификат установлен
- [ ] DNS настроен на новый IP
- [ ] Сайт открывается в браузере
- [ ] Кнопки кликабельны
- [ ] API запросы работают
- [ ] Логи не показывают ошибок

---

## После деплоя

1. **Проверьте работу сайта** в течение нескольких дней
2. **Мониторьте логи** на наличие ошибок
3. **Следите за производительностью** через `pm2 monit`
4. **Делайте регулярные бэкапы** базы данных

---

**Удачи с деплоем! 🚀**

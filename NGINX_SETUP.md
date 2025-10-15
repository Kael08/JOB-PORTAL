# Инструкция по настройке nginx для поддомена rabota.elistory.ru

## Шаг 1: Настройка DNS (на аккаунте с доменом elistory.ru)

Чтобы поддомен `rabota.elistory.ru` указывал на ваш сервер, нужно добавить A-запись в DNS:

1. Войдите в панель управления Beget на аккаунте, где находится домен `elistory.ru`
2. Перейдите в раздел "DNS-записи" или "Управление DNS"
3. Добавьте новую A-запись:
   - **Тип записи**: A
   - **Имя**: rabota (или rabota.elistory.ru)
   - **Значение/IP**: 217.26.25.78
   - **TTL**: 3600 (или оставьте по умолчанию)

Пример:
```
Тип | Имя   | Значение       | TTL
A   | rabota| 217.26.25.78   | 3600
```

**Внимание**: Изменения DNS могут занять от нескольких минут до 24 часов.

---

## Шаг 2: Установка конфигурации nginx на вашем сервере (217.26.25.78)

### 2.1 Копирование файла конфигурации

Скопируйте файл `nginx-job-portal.conf` на сервер в директорию nginx:

```bash
# На вашем сервере Beget
sudo cp nginx-job-portal.conf /etc/nginx/sites-available/job-portal

# Создайте символическую ссылку для активации конфигурации
sudo ln -s /etc/nginx/sites-available/job-portal /etc/nginx/sites-enabled/
```

**Альтернативный вариант** (если используется другая структура директорий):
```bash
sudo cp nginx-job-portal.conf /etc/nginx/conf.d/job-portal.conf
```

### 2.2 Проверка конфигурации

Перед перезагрузкой nginx проверьте корректность конфигурации:

```bash
sudo nginx -t
```

Должно вывести:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2.3 Перезагрузка nginx

После успешной проверки перезагрузите nginx:

```bash
sudo systemctl reload nginx
# или
sudo service nginx reload
```

---

## Шаг 3: Проверка работы

После настройки DNS (когда изменения вступят в силу) проверьте работу:

1. Откройте браузер и перейдите на `http://rabota.elistory.ru`
2. Проверьте API: `http://rabota.elistory.ru/api/health` (если есть такой endpoint)

Проверить, что DNS работает, можно командой:
```bash
nslookup rabota.elistory.ru
# или
ping rabota.elistory.ru
```

Должен вернуться IP: 217.26.25.78

---

## Шаг 4: Настройка HTTPS (опционально, но рекомендуется)

После успешной настройки HTTP рекомендуется настроить HTTPS с помощью Let's Encrypt:

```bash
# Установка certbot (если еще не установлен)
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Получение SSL-сертификата
sudo certbot --nginx -d rabota.elistory.ru

# Автообновление сертификата (если еще не настроено)
sudo certbot renew --dry-run
```

Certbot автоматически обновит конфигурацию nginx и перенаправит HTTP на HTTPS.

---

## Troubleshooting

### Проблема: Сайт не открывается по поддомену

1. **Проверьте DNS**:
   ```bash
   nslookup rabota.elistory.ru
   ```
   Должен вернуться IP 217.26.25.78

2. **Проверьте, что nginx запущен**:
   ```bash
   sudo systemctl status nginx
   ```

3. **Проверьте логи nginx**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

4. **Проверьте, что backend работает**:
   ```bash
   curl http://localhost:5000
   ```

### Проблема: 502 Bad Gateway

Это означает, что nginx не может подключиться к backend (Node.js на порту 5000):

1. Проверьте, что Node.js приложение запущено:
   ```bash
   ps aux | grep node
   # или если используете pm2
   pm2 list
   ```

2. Проверьте, что приложение слушает на порту 5000:
   ```bash
   sudo netstat -tlnp | grep 5000
   # или
   sudo ss -tlnp | grep 5000
   ```

3. Перезапустите backend:
   ```bash
   # Если используете pm2
   pm2 restart job-portal-server

   # Если запускали вручную, найдите процесс и перезапустите
   ```

### Проблема: Frontend загружается, но API не работает

Проверьте настройки CORS в backend приложении. В файле сервера должно быть:

```javascript
app.use(cors({
    origin: ['http://rabota.elistory.ru', 'https://rabota.elistory.ru'],
    credentials: true
}));
```

---

## Структура проекта на сервере

Убедитесь, что структура директорий соответствует конфигурации:

```
/home/job-portal/
├── job-portal-client/
│   └── dist/           # Собранные статические файлы React
│       ├── index.html
│       ├── assets/
│       └── ...
└── job-portal-server/  # Node.js backend приложение
    ├── server.js
    └── ...
```

Backend должен быть запущен на порту 5000.

---

## Полезные команды

```bash
# Перезагрузка nginx
sudo systemctl reload nginx

# Перезапуск nginx
sudo systemctl restart nginx

# Просмотр логов nginx в реальном времени
sudo tail -f /var/log/nginx/error.log

# Проверка синтаксиса конфигурации
sudo nginx -t

# Просмотр активных процессов Node.js
ps aux | grep node

# Если используете pm2
pm2 list
pm2 logs
pm2 restart all
```

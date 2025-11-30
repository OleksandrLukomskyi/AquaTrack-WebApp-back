# Быстрый старт AquaTrack

## ✅ Чеклист для запуска

### Шаг 1: Установка зависимостей

- [ ] `cd AquaTrack-WebApp-backend && npm install`
- [ ] `cd AquaTrack-WebApp-frontend && npm install`

### Шаг 2: Настройка MongoDB

- [ ] Создать аккаунт на MongoDB Atlas (или использовать локальный MongoDB)
- [ ] Получить connection string
- [ ] Добавить IP в whitelist (для разработки: `0.0.0.0/0`)

### Шаг 3: Создание .env файла

- [ ] Скопировать содержимое ниже в файл `.env` в папке `AquaTrack-WebApp-backend`
- [ ] Заполнить все обязательные поля

### Шаг 4: Генерация JWT секретов

Выполните в терминале для генерации безопасных секретов:

```bash
node -e "console.log('ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Шаг 5: Настройка Frontend

- [ ] Открыть `AquaTrack-WebApp-frontend/src/api/axiosInstance.js`
- [ ] Раскомментировать: `baseURL: 'http://localhost:3000',`
- [ ] Закомментировать: `baseURL: 'https://aquatrack-webapp-backend.onrender.com',`

### Шаг 6: Запуск

- [ ] Backend: `cd AquaTrack-WebApp-backend && npm run dev`
- [ ] Frontend: `cd AquaTrack-WebApp-frontend && npm run dev`

---

## 📝 Шаблон .env файла

Создайте файл `.env` в папке `AquaTrack-WebApp-backend`:

```env
PORT=3000
NODE_ENV=development

MONGODB_USER=ваш_username
MONGODB_PASSWORD=ваш_пароль
MONGODB_URL=cluster0.xxxxx.mongodb.net
MONGODB_DB=aquatrack

ACCESS_SECRET=сгенерированный_секрет_минимум_32_символа
REFRESH_SECRET=сгенерированный_секрет_минимум_32_символа
JWT_SECRET=сгенерированный_секрет_минимум_32_символа
JWT_ACC_EXPIRES_IN=15m
JWT_REF_EXPIRES_IN=30d

FRONTEND_HOST=http://localhost:4000
BACKEND_HOST=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUD_NAME=
API_KEY=
API_SECRET=
ENABLE_CLOUDINARY=false

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ваш_email@gmail.com
SMTP_PASSWORD=пароль_приложения_gmail
SMTP_FROM=ваш_email@gmail.com

APP_DOMAIN_PHOTO=http://localhost:3000
```

---

## 🔍 Проверка работы

1. Backend должен запуститься на `http://localhost:3000`
2. Frontend должен запуститься на `http://localhost:4000`
3. Swagger документация доступна на `http://localhost:3000/api-docs`
4. Откройте браузер и перейдите на `http://localhost:4000`

---

## ⚠️ Минимальные требования для работы

**Обязательно:**

- ✅ MongoDB (локальный или Atlas)
- ✅ JWT секреты (ACCESS_SECRET, REFRESH_SECRET, JWT_SECRET)

**Опционально (можно оставить пустыми):**

- ⚪ Google OAuth (для входа через Google)
- ⚪ Cloudinary (для загрузки файлов)
- ⚪ SMTP (для сброса пароля по email)

---

## 🆘 Если что-то не работает

1. **Ошибка подключения к MongoDB:**

   - Проверьте правильность данных в `.env`
   - Убедитесь, что IP добавлен в whitelist MongoDB Atlas

2. **Ошибка с токенами:**

   - Убедитесь, что все три JWT секрета установлены и достаточно длинные

3. **CORS ошибки:**

   - Проверьте, что `FRONTEND_HOST=http://localhost:4000` в `.env`
   - Убедитесь, что фронтенд запущен на порту 4000

4. **Проблемы с зависимостями:**
   - Удалите `node_modules` и `package-lock.json`
   - Выполните `npm install` заново

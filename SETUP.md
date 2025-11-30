# Инструкция по запуску проекта AquaTrack

## Что нужно для запуска

### 1. Установка зависимостей

#### Backend:

```bash
cd AquaTrack-WebApp-backend
npm install
```

#### Frontend:

```bash
cd AquaTrack-WebApp-frontend
npm install
```

### 2. Настройка переменных окружения

#### Backend (.env файл)

Создайте файл `.env` в папке `AquaTrack-WebApp-backend` со следующим содержимым:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_USER=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
MONGODB_URL=your_mongodb_cluster_url
MONGODB_DB=your_database_name

# JWT Configuration
ACCESS_SECRET=your_access_token_secret_key_min_32_chars
REFRESH_SECRET=your_refresh_token_secret_key_min_32_chars
JWT_ACC_EXPIRES_IN=15m
JWT_REF_EXPIRES_IN=30d

# Frontend/Backend Hosts
FRONTEND_HOST=http://localhost:4000
BACKEND_HOST=http://localhost:3000

# Google OAuth Configuration (опционально)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Configuration (опционально, для загрузки файлов)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
ENABLE_CLOUDINARY=false

# SMTP Configuration (для отправки email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password
SMTP_FROM=your_email@gmail.com

# Дополнительные переменные (если используются)
APP_DOMAIN_PHOTO=http://localhost:3000
JWT_SECRET=your_jwt_secret_key_min_32_chars
```

**Важно:**

- Замените все значения `your_*` на реальные данные
- Для JWT секретов используйте длинные случайные строки (минимум 32 символа)
- MongoDB URL должен быть в формате: `cluster0.xxxxx.mongodb.net` (без `mongodb+srv://` и параметров)

#### Frontend

В файле `src/api/axiosInstance.js` уже настроен URL бэкенда.
Для локальной разработки раскомментируйте строку:

```javascript
baseURL: 'http://localhost:3000',
```

и закомментируйте строку с production URL.

### 3. Настройка MongoDB

#### Вариант 1: MongoDB Atlas (облачный)

1. Зарегистрируйтесь на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте кластер (бесплатный tier доступен)
3. Создайте пользователя базы данных
4. Добавьте IP адрес в whitelist (для разработки можно использовать `0.0.0.0/0`)
5. Получите connection string и используйте его части в `.env`:
   - `MONGODB_USER` - имя пользователя
   - `MONGODB_PASSWORD` - пароль
   - `MONGODB_URL` - часть URL между `@` и `/` (например: `cluster0.xxxxx.mongodb.net`)
   - `MONGODB_DB` - имя базы данных

#### Вариант 2: Локальный MongoDB

1. Установите MongoDB локально
2. Измените строку подключения в `src/db/initMongoConnection.js` на:
   ```javascript
   await mongoose.connect(`mongodb://localhost:27017/${db}`);
   ```

### 4. Настройка SMTP (для отправки email)

Для работы сброса пароля нужно настроить SMTP:

1. **Gmail:**

   - Включите двухфакторную аутентификацию
   - Создайте "Пароль приложения" в настройках Google аккаунта
   - Используйте этот пароль в `SMTP_PASSWORD`

2. **Другие провайдеры:**
   - Используйте соответствующие настройки SMTP вашего провайдера

### 5. Запуск проекта

#### Backend:

```bash
cd AquaTrack-WebApp-backend
npm run dev
```

Сервер запустится на `http://localhost:3000`

#### Frontend:

```bash
cd AquaTrack-WebApp-frontend
npm run dev
```

Приложение запустится на `http://localhost:4000`

### 6. Проверка работы

1. Откройте браузер и перейдите на `http://localhost:4000`
2. Проверьте, что бэкенд отвечает на `http://localhost:3000/api-docs` (Swagger документация)
3. Попробуйте зарегистрировать нового пользователя

## Возможные проблемы

### Ошибка подключения к MongoDB

- Проверьте правильность данных в `.env`
- Убедитесь, что IP адрес добавлен в whitelist MongoDB Atlas
- Проверьте интернет соединение

### Ошибка с JWT токенами

- Убедитесь, что `ACCESS_SECRET` и `REFRESH_SECRET` установлены и достаточно длинные
- Проверьте, что `JWT_SECRET` также установлен (если используется)

### CORS ошибки

- Убедитесь, что `FRONTEND_HOST` в `.env` соответствует URL фронтенда
- Проверьте настройки CORS в `server.js`

### Проблемы с отправкой email

- Проверьте настройки SMTP
- Для Gmail убедитесь, что используется "Пароль приложения", а не обычный пароль
- Проверьте, что `ENABLE_CLOUDINARY` установлен в `false`, если Cloudinary не используется

## Дополнительные настройки (опционально)

### Google OAuth

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Включите Google+ API
3. Создайте OAuth 2.0 credentials
4. Добавьте redirect URI: `http://localhost:3000/api/users/oauth/google/callback`
5. Используйте Client ID и Client Secret в `.env`

### Cloudinary (для загрузки файлов)

1. Зарегистрируйтесь на [Cloudinary](https://cloudinary.com/)
2. Получите Cloud Name, API Key и API Secret
3. Установите `ENABLE_CLOUDINARY=true` в `.env`
4. Добавьте соответствующие данные в `.env`

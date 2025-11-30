# AquaTrack-WebApp-backend

Backend приложение для отслеживания потребления воды.

## Требования

- Node.js (версия 18 или выше)
- MongoDB (локальная или облачная MongoDB Atlas)
- npm или yarn

## Установка

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd AquaTrack-WebApp-backend
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` в корне проекта на основе примера ниже:

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
ACCESS_SECRET=your_access_token_secret_key
REFRESH_SECRET=your_refresh_token_secret_key
JWT_ACC_EXPIRES_IN=15m
JWT_REF_EXPIRES_IN=30d

# Frontend/Backend Hosts
FRONTEND_HOST=http://localhost:4000
BACKEND_HOST=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Configuration (optional, for file uploads)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
ENABLE_CLOUDINARY=false

# SMTP Configuration (for email sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password
SMTP_FROM=your_email@gmail.com
```

## Запуск проекта

### Режим разработки (с автоперезагрузкой):

```bash
npm run dev
```

### Продакшн режим:

```bash
npm start
```

### Сборка документации Swagger:

```bash
npm run build-docs
```

### Просмотр документации:

```bash
npm run preview-docs
```

## API Документация

После запуска сервера, Swagger документация будет доступна по адресу:

- `http://localhost:3000/api-docs`

## Структура проекта

```
src/
├── constants/      # Константы приложения
├── controllers/    # Контроллеры (обработчики запросов)
├── db/            # Модели базы данных и подключение
├── middleware/     # Промежуточное ПО (auth, error handling)
├── routers/        # Маршруты API
├── services/       # Бизнес-логика
├── utils/          # Вспомогательные утилиты
├── validation/     # Схемы валидации (Joi)
└── index.js        # Точка входа приложения
```

## Основные функции

- ✅ Регистрация и аутентификация пользователей
- ✅ JWT токены (access и refresh)
- ✅ Google OAuth авторизация
- ✅ Сброс пароля через email
- ✅ Отслеживание потребления воды
- ✅ Загрузка файлов (Cloudinary)
- ✅ Swagger документация

## Переменные окружения

Все необходимые переменные окружения должны быть указаны в файле `.env`. Убедитесь, что файл `.env` добавлен в `.gitignore` и не попадает в репозиторий.

## Примечания

- Для работы с MongoDB используйте MongoDB Atlas или локальный MongoDB
- Для отправки email используйте SMTP настройки вашего почтового провайдера
- Для Google OAuth создайте проект в Google Cloud Console
- Cloudinary опционален, если не используется загрузка файлов

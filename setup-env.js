// Скрипт для создания .env файла из шаблона
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTemplate = `PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Заполните данные вашего MongoDB подключения
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_URL=
MONGODB_DB=aquatrack

# JWT Configuration (уже сгенерированы)
ACCESS_SECRET=6b9ddbbbd0813fe3d1b6d99704da1b152db232c8f32b1b89a8d4e3a21a21c518
REFRESH_SECRET=4bf7e918b7d6bc4a260b198c41b57eb4fb962e0f210c739afa56c4a2d4e94772
JWT_SECRET=72056d48531aefbae1cc0e16398dc263ebedb37f65f9eef00cde4f4d5458d67b
JWT_ACC_EXPIRES_IN=15m
JWT_REF_EXPIRES_IN=30d

# Frontend/Backend Hosts
FRONTEND_HOST=http://localhost:4000
BACKEND_HOST=http://localhost:3000

# Google OAuth Configuration (опционально)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary Configuration (опционально)
CLOUD_NAME=
API_KEY=
API_SECRET=
ENABLE_CLOUDINARY=false

# SMTP Configuration (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

# Дополнительные переменные
APP_DOMAIN_PHOTO=http://localhost:3000
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  Файл .env уже существует!');
  console.log(
    'Если хотите перезаписать, удалите существующий файл и запустите скрипт снова.',
  );
  process.exit(0);
}

try {
  fs.writeFileSync(envPath, envTemplate, 'utf8');
  console.log('✅ Файл .env успешно создан!');
  console.log('📝 Теперь заполните данные MongoDB в файле .env');
  console.log('   Обязательно заполните:');
  console.log('   - MONGODB_USER');
  console.log('   - MONGODB_PASSWORD');
  console.log('   - MONGODB_URL');
} catch (error) {
  console.error('❌ Ошибка при создании .env файла:', error.message);
  process.exit(1);
}

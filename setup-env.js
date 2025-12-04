// Скрипт для создания .env файла из шаблона
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTemplate = `PORT=3000
NODE_ENV=development


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

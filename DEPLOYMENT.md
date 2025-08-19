# Деплой King of Tokyo Bot на Vercel

Этот документ описывает процесс деплоя Telegram бота на Vercel.

## Предварительные требования

1. **Аккаунт на Vercel** - [vercel.com](https://vercel.com)
2. **Telegram Bot Token** - полученный от @BotFather
3. **Git репозиторий** с кодом бота

## Шаги деплоя

### 1. Подготовка проекта

Убедитесь, что у вас есть все необходимые файлы:
- `vercel.json` - конфигурация Vercel
- `api/webhook.js` - API endpoint для вебхуков
- `scripts/setup-webhook.js` - скрипт настройки вебхука

### 2. Деплой на Vercel

#### Вариант A: Через Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой проекта
vercel

# Следуйте инструкциям в терминале
```

#### Вариант B: Через GitHub

1. Загрузите код в GitHub репозиторий
2. Зайдите на [vercel.com](https://vercel.com)
3. Нажмите "New Project"
4. Выберите ваш репозиторий
5. Настройте переменные окружения (см. ниже)
6. Нажмите "Deploy"

### 3. Настройка переменных окружения

В настройках проекта на Vercel добавьте следующие переменные:

```
BOT_TOKEN=your_telegram_bot_token_here
WEBHOOK_URL=https://your-app-name.vercel.app/api/webhook
```

### 4. Настройка вебхука

После успешного деплоя настройте вебхук в Telegram:

```bash
# Обновите WEBHOOK_URL в .env файле
echo "WEBHOOK_URL=https://your-app-name.vercel.app/api/webhook" >> .env

# Запустите скрипт настройки вебхука
npm run setup-webhook
```

Или выполните вручную:

```javascript
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: false });

// Установка вебхука
bot.setWebhook('https://your-app-name.vercel.app/api/webhook')
  .then(() => console.log('Webhook установлен!'))
  .catch(console.error);
```

## Структура проекта для Vercel

```
king-of-tokio-bot/
├── api/
│   └── webhook.js          # API endpoint для вебхуков
├── src/
│   ├── handlers/
│   ├── data/
│   ├── utils/
│   ├── bot.js
│   ├── config.js
│   └── index.js
├── scripts/
│   └── setup-webhook.js    # Скрипт настройки вебхука
├── vercel.json             # Конфигурация Vercel
├── package.json
└── .env                    # Переменные окружения (не в Git)
```

## Проверка работы

1. Отправьте команду `/start` вашему боту
2. Проверьте логи в Vercel Dashboard
3. Убедитесь, что бот отвечает на команды

## Устранение неполадок

### Бот не отвечает

1. Проверьте, что вебхук установлен правильно:
   ```bash
   npm run setup-webhook
   ```

2. Проверьте логи в Vercel Dashboard

3. Убедитесь, что переменные окружения настроены правильно

### Ошибки деплоя

1. Проверьте синтаксис в `vercel.json`
2. Убедитесь, что все зависимости указаны в `package.json`
3. Проверьте, что путь к API endpoint правильный

### Проблемы с вебхуком

1. Проверьте URL вебхука в настройках бота
2. Убедитесь, что HTTPS настроен правильно
3. Проверьте, что endpoint возвращает статус 200

## Полезные команды

```bash
# Локальная разработка
npm run dev

# Настройка вебхука
npm run setup-webhook

# Проверка статуса вебхука
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

## Мониторинг

- **Vercel Dashboard** - логи и метрики
- **Telegram Bot API** - статус вебхука
- **Vercel Analytics** - производительность

## Обновление бота

При внесении изменений в код:

1. Закоммитьте изменения в Git
2. Запушьте в репозиторий
3. Vercel автоматически пересоберет и задеплоит проект
4. При необходимости перенастройте вебхук

## Безопасность

- Никогда не коммитьте `.env` файл
- Используйте переменные окружения Vercel
- Регулярно обновляйте зависимости
- Мониторьте логи на подозрительную активность

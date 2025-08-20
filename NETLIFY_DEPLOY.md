# 🚀 Развертывание King of Tokyo Bot в Netlify

Это руководство поможет вам развернуть Telegram-бота в Netlify Functions.

## 📋 Предварительные требования

1. **Аккаунт Netlify**: [netlify.com](https://netlify.com)
2. **Аккаунт GitHub/GitLab/Bitbucket** для хранения кода
3. **Telegram Bot Token** от [@BotFather](https://t.me/BotFather)

## 🔧 Шаги для развертывания

### 1. Подготовка репозитория

Убедитесь, что ваш код загружен в Git-репозиторий:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Создание сайта в Netlify

1. Войдите в [Netlify Dashboard](https://app.netlify.com)
2. Нажмите **"New site from Git"**
3. Выберите ваш Git-провайдер (GitHub, GitLab, Bitbucket)
4. Выберите репозиторий `king-of-tokio-bot`
5. Настройки сборки:
   - **Build command**: `npm install` (или оставьте пустым)
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`
6. Нажмите **"Deploy site"**

### 3. Настройка переменных окружения

1. В Netlify Dashboard перейдите в **Site settings**
2. Выберите **Build & deploy** → **Environment variables**
3. Добавьте переменные:
   - `BOT_TOKEN`: ваш токен от BotFather
   - `BOT_USERNAME`: имя вашего бота (например, `king_of_tokyo_bot`)
   - `NETLIFY_URL`: URL вашего сайта (например, `https://amazing-bot-123456.netlify.app`)

### 4. Получение URL сайта

После развертывания Netlify предоставит вам URL вида:
```
https://random-name-123456.netlify.app
```

Рекомендуется изменить название сайта:
1. Перейдите в **Site settings** → **General**
2. Нажмите **"Change site name"**
3. Введите удобное имя (например, `king-of-tokyo-bot-123456`)

### 5. Настройка Webhook

После развертывания настройте webhook Telegram:

```bash
# Локально
NETLIFY_URL=https://your-site-name.netlify.app npm run netlify-webhook
```

Или вручную через curl:

```bash
curl -F "url=https://your-site-name.netlify.app/.netlify/functions/update" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

### 6. Проверка работы

1. **Проверьте функцию**: Перейдите в **Functions** в Netlify Dashboard
2. **Тестирование бота**: Найдите вашего бота в Telegram и отправьте `/start`
3. **Просмотр логов**: В Netlify Functions можно увидеть логи выполнения

## 🛠️ Структура проекта для Netlify

```
king-of-tokio-bot/
├── netlify/
│   └── functions/
│       └── update.js          # Основная функция для webhook
├── public/
│   └── index.html            # Статическая страница (опционально)
├── src/                      # Исходный код бота
├── scripts/
│   └── setup-netlify-webhook.js  # Скрипт настройки webhook
├── netlify.toml              # Конфигурация Netlify
├── package.json
└── README.md
```

## 🔍 Отладка

### Просмотр логов
1. Netlify Dashboard → **Functions** → **update**
2. Кликните на выполнение функции для просмотра логов

### Проверка webhook
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### Типичные проблемы

1. **"Function not found"**
   - Убедитесь, что файл `netlify/functions/update.js` существует
   - Проверьте правильность путей в `netlify.toml`

2. **"Environment variable not found"**
   - Проверьте настройки переменных окружения в Netlify Dashboard
   - Убедитесь, что переменные корректно прописаны

3. **"Webhook timeout"**
   - Функция должна отвечать быстро (до 10 секунд)
   - Проверьте логи на ошибки

## 📱 Команды бота

После успешного развертывания ваш бот поддерживает:

- `/start` - Приветствие
- `/help` - Справка по командам
- `/random2` - Быстрый выбор персонажей
- `/characters` - Список всех персонажей
- `/expansions` - Доступные расширения

## 🎯 Полезные ссылки

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Travis Horn's Guide](https://travishorn.com/building-a-telegram-bot-with-netlify)

## 💡 Советы

1. **Мониторинг**: Используйте Netlify Analytics для отслеживания использования
2. **Ограничения**: Netlify Free tier предоставляет 125,000 вызовов функций в месяц
3. **Производительность**: Функции автоматически масштабируются
4. **Безопасность**: Переменные окружения зашифрованы и безопасны

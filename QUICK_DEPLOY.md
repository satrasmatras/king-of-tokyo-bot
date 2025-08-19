# 🚀 Быстрый деплой на Vercel

## 1. Подготовка

```bash
# Убедитесь, что все файлы добавлены в Git
git add .
git commit -m "Prepare for Vercel deployment"
```

## 2. Деплой через Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин и деплой
vercel login
vercel

# Следуйте инструкциям в терминале
```

## 3. Настройка переменных окружения

В Vercel Dashboard → Settings → Environment Variables добавьте:

```
BOT_TOKEN=your_telegram_bot_token
WEBHOOK_URL=https://your-app-name.vercel.app/api/webhook
```

## 4. Настройка вебхука

```bash
# Добавьте WEBHOOK_URL в .env
echo "WEBHOOK_URL=https://your-app-name.vercel.app/api/webhook" >> .env

# Настройте вебхук
npm run setup-webhook
```

## 5. Проверка

Отправьте `/start` вашему боту - он должен ответить!

## Альтернативный способ через GitHub

1. Загрузите код в GitHub
2. Зайдите на [vercel.com](https://vercel.com)
3. "New Project" → выберите репозиторий
4. Настройте переменные окружения
5. Deploy

---

📖 Подробная инструкция: [DEPLOYMENT.md](./DEPLOYMENT.md)

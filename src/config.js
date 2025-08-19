require('dotenv').config();

const config = {
  bot: {
    token: process.env.BOT_TOKEN,
    username: process.env.BOT_USERNAME,
    webhookUrl: process.env.WEBHOOK_URL
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

// Проверка обязательных переменных окружения
if (!config.bot.token) {
  throw new Error('BOT_TOKEN is required in .env file');
}

module.exports = config;

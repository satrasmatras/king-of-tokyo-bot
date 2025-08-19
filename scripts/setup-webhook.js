const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

async function setupWebhook() {
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
  
  try {
    // URL вебхука на Vercel
    const webhookUrl = process.env.WEBHOOK_URL || 'https://your-app-name.vercel.app/api/webhook';
    
    console.log('🔧 Настройка вебхука...');
    console.log(`📡 URL: ${webhookUrl}`);
    
    // Устанавливаем вебхук
    const result = await bot.setWebhook(webhookUrl);
    
    if (result) {
      console.log('✅ Вебхук успешно установлен!');
      
      // Получаем информацию о вебхуке
      const webhookInfo = await bot.getWebhookInfo();
      console.log('📊 Информация о вебхуке:');
      console.log(`   URL: ${webhookInfo.url}`);
      console.log(`   Последняя ошибка: ${webhookInfo.last_error_message || 'Нет'}`);
      console.log(`   Последнее обновление: ${webhookInfo.last_error_date || 'Нет'}`);
    } else {
      console.log('❌ Ошибка при установке вебхука');
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Запускаем настройку
setupWebhook();

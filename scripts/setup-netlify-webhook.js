const axios = require('axios').default;
require('dotenv').config();

async function setupWebhook() {
  try {
    const botToken = process.env.BOT_TOKEN;
    const siteUrl = process.env.NETLIFY_URL || 'https://your-site-name.netlify.app';
    const webhookUrl = `${siteUrl}/.netlify/functions/update`;

    console.log('🔧 Настройка webhook для Netlify...');
    console.log(`📡 URL: ${webhookUrl}`);
    console.log(`🤖 Token: ${botToken ? 'Установлен' : 'НЕ УСТАНОВЛЕН'}`);

    if (!botToken) {
      console.error('❌ BOT_TOKEN не найден в переменных окружения');
      console.error('💡 Создайте файл .env с BOT_TOKEN=your_bot_token');
      return;
    }

    // Устанавливаем webhook
    console.log('📤 Отправка запроса на установку webhook...');
    
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      { url: webhookUrl }
    );

    if (response.data.ok) {
      console.log('✅ Webhook успешно установлен!');

      // Получаем информацию о webhook
      const webhookInfo = await axios.get(
        `https://api.telegram.org/bot${botToken}/getWebhookInfo`
      );

      if (webhookInfo.data.ok) {
        const info = webhookInfo.data.result;
        console.log('📊 Информация о webhook:');
        console.log(`   URL: ${info.url}`);
        console.log(`   Последняя ошибка: ${info.last_error_message || 'Нет'}`);
        console.log(`   Последнее обновление: ${info.last_error_date || 'Нет'}`);
        console.log(`   Ожидающие обновления: ${info.pending_update_count || 0}`);
      }
    } else {
      console.error('❌ Ошибка при установке webhook:', response.data.description);
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    if (error.response) {
      console.error('🔍 Детали ошибки:', error.response.data);
    }
  }
}

// Запускаем настройку
setupWebhook();

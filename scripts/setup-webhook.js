const https = require('https');
require('dotenv').config();

async function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          resolve(data);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.data) {
      req.write(options.data);
    }
    
    req.end();
  });
}

async function setupWebhook() {
  try {
    // URL вебхука на Vercel
    const webhookUrl = process.env.WEBHOOK_URL || 'https://your-app-name.vercel.app/api/webhook';
    
    console.log('🔧 Настройка вебхука...');
    console.log(`📡 URL: ${webhookUrl}`);
    console.log(`🤖 Token: ${process.env.BOT_TOKEN ? 'Установлен' : 'НЕ УСТАНОВЛЕН'}`);
    
    if (!process.env.BOT_TOKEN) {
      console.error('❌ BOT_TOKEN не найден в переменных окружения');
      return;
    }
    
    const botToken = process.env.BOT_TOKEN;
    
    // Устанавливаем вебхук через Telegram API
    const setWebhookUrl = `https://api.telegram.org/bot${botToken}/setWebhook`;
    const webhookData = JSON.stringify({ url: webhookUrl });
    
    console.log('📤 Отправка запроса на установку вебхука...');
    
    const result = await makeRequest(setWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(webhookData)
      },
      data: webhookData
    });
    
    if (result.ok) {
      console.log('✅ Вебхук успешно установлен!');
      
      // Получаем информацию о вебхуке
      const getWebhookUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
      const webhookInfo = await makeRequest(getWebhookUrl, {
        method: 'GET'
      });
      
      if (webhookInfo.ok) {
        console.log('📊 Информация о вебхуке:');
        console.log(`   URL: ${webhookInfo.result.url}`);
        console.log(`   Последняя ошибка: ${webhookInfo.result.last_error_message || 'Нет'}`);
        console.log(`   Последнее обновление: ${webhookInfo.result.last_error_date || 'Нет'}`);
        console.log(`   Ожидающие обновления: ${webhookInfo.result.pending_update_count || 0}`);
      }
    } else {
      console.log('❌ Ошибка при установке вебхука:', result.description);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.error('🔍 Детали ошибки:', error);
  }
}

// Запускаем настройку
setupWebhook();

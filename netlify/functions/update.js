const sendMessage = require("../../sendMessage");
const messageParts = require("../../messageParts");
const { commandHandlers } = require("../../commandHandlers");

exports.handler = async (event) => {
  console.log("📥 Received an update from Telegram!");
  console.log("🔑 BOT_TOKEN доступен:", !!process.env.BOT_TOKEN);

  // Устанавливаем CORS заголовки
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Обработка OPTIONS запросов (preflight)
  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ OPTIONS запрос обработан');
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Обрабатываем только POST запросы
  if (event.httpMethod !== 'POST') {
    console.log('❌ Неподдерживаемый метод:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const update = JSON.parse(event.body);
    console.log('📨 Получено обновление от Telegram:', !!update);

    // Проверяем, что это валидное обновление от Telegram
    if (!update || (!update.message && !update.callback_query)) {
      console.log('❌ Невалидное обновление');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid update' })
      };
    }

    console.log('✅ Обрабатываем обновление...');

    // Обрабатываем сообщения
    if (update.message) {
      console.log('💬 Обрабатываем сообщение');
      await handleMessage(update.message);
    }

    // Обрабатываем callback queries
    if (update.callback_query) {
      console.log('🔘 Обрабатываем callback query');
      await handleCallbackQuery(update.callback_query);
    }

    console.log('✅ Обновление обработано успешно');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };

  } catch (error) {
    console.error('❌ Ошибка в webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Обработка сообщений
async function handleMessage(message) {
  if (!message.text) {
    return;
  }

  const { command, botName, extra } = messageParts(message.text);
  const chatId = message.chat.id;

  // Проверяем, адресовано ли сообщение нашему боту
  const BOT_USERNAME = process.env.BOT_USERNAME || 'king_of_tokyo_bot';
  if (botName && botName !== BOT_USERNAME) {
    return; // Сообщение адресовано другому боту
  }

  console.log(`🤖 Команда: ${command}, extra: ${extra}`);

  // Обрабатываем команды
  if (command && commandHandlers[command]) {
    await commandHandlers[command](chatId, extra);
  } else if (command) {
    await sendMessage(chatId, "Я не понимаю эту команду. Используйте /help для справки.");
  } else {
    // Обычное сообщение без команды
    await sendMessage(chatId, "Привет! Используйте /start для начала работы или /help для справки.");
  }
}

// Обработка callback queries (пока базовая реализация)
async function handleCallbackQuery(callbackQuery) {
  console.log('🔘 Callback query:', callbackQuery.data);
  // TODO: Добавить обработку интерактивных элементов позже
}
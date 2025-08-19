const TelegramBot = require('node-telegram-bot-api');
const MessageHandler = require('../src/handlers/messageHandler');

// Проверяем наличие токена
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден в переменных окружения');
  throw new Error('BOT_TOKEN is required');
}

// Инициализация бота без polling
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const messageHandler = new MessageHandler(bot);

console.log('🤖 Бот инициализирован с токеном:', process.env.BOT_TOKEN ? 'Установлен' : 'НЕ УСТАНОВЛЕН');

// Настройка обработчиков событий
function setupEventHandlers() {
  // Обработка команды /start
  bot.onText(/\/start/, async (msg) => {
    try {
      await messageHandler.handleStart(msg);
    } catch (error) {
      console.error('Ошибка при обработке команды /start:', error);
      await handleError(msg.chat.id, error);
    }
  });

  // Обработка команды /help
  bot.onText(/\/help/, async (msg) => {
    try {
      await messageHandler.handleHelp(msg);
    } catch (error) {
      console.error('Ошибка при обработке команды /help:', error);
      await handleError(msg.chat.id, error);
    }
  });

  // Обработка команды /random
  bot.onText(/\/random/, async (msg) => {
    try {
      await messageHandler.handleRandom(msg);
    } catch (error) {
      console.error('Ошибка при обработке команды /random:', error);
      await handleError(msg.chat.id, error);
    }
  });

  // Обработка команды /random2
  bot.onText(/\/random2/, async (msg) => {
    try {
      await messageHandler.handleRandom2(msg);
    } catch (error) {
      console.error('Ошибка при обработке команды /random2:', error);
      await handleError(msg.chat.id, error);
    }
  });

  // Обработка команды /characters
  bot.onText(/\/characters/, async (msg) => {
    try {
      await messageHandler.handleCharacters(msg);
    } catch (error) {
      console.error('Ошибка при обработке команды /characters:', error);
      await handleError(msg.chat.id, error);
    }
  });

  // Обработка команды /expansions
  bot.onText(/\/expansions/, async (msg) => {
    try {
      await messageHandler.handleExpansions(msg);
    } catch (error) {
      console.error('Ошибка при обработке команды /expansions:', error);
      await handleError(msg.chat.id, error);
    }
  });

  // Обработка callback кнопок
  bot.on('callback_query', async (callbackQuery) => {
    try {
      const data = callbackQuery.data;
      
      if (data.startsWith('expansion_')) {
        await messageHandler.handleExpansionSelection(callbackQuery);
      } else if (data === 'continue_to_players') {
        await messageHandler.handleContinueToPlayers(callbackQuery);
      } else if (data.startsWith('players_')) {
        await messageHandler.handlePlayersSelection(callbackQuery);
      } else if (data.startsWith('options_')) {
        await messageHandler.handleOptionsSelection(callbackQuery);
      }
      
      // Отвечаем на callback query
      await bot.answerCallbackQuery(callbackQuery.id);
    } catch (error) {
      console.error('Ошибка при обработке callback query:', error);
      await handleError(callbackQuery.message.chat.id, error);
    }
  });

  // Обработка всех остальных сообщений
  bot.on('message', async (msg) => {
    try {
      // Игнорируем команды, которые уже обработаны
      if (msg.text && !msg.text.startsWith('/')) {
        await messageHandler.handleMessage(msg);
      }
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
      await handleError(msg.chat.id, error);
    }
  });

  // Обработка ошибок
  bot.on('error', (error) => {
    console.error('Ошибка бота:', error);
  });

  bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error);
  });
}

// Обработка ошибок
async function handleError(chatId, error) {
  try {
    const errorMessage = `
❌ *Произошла ошибка*

К сожалению, произошла ошибка при обработке вашего запроса. Попробуйте еще раз или используйте команду /help для получения справки.

Ошибка: ${error.message}
    `;
    await bot.sendMessage(chatId, errorMessage.trim(), { parse_mode: 'Markdown' });
  } catch (sendError) {
    console.error('Ошибка при отправке сообщения об ошибке:', sendError);
  }
}

// Настройка обработчиков при первом запуске
setupEventHandlers();

// API endpoint для Vercel
module.exports = async (req, res) => {
  console.log('📥 Получен запрос:', req.method, req.url);
  console.log('🔑 BOT_TOKEN доступен:', !!process.env.BOT_TOKEN);
  
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка OPTIONS запросов (preflight)
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS запрос обработан');
    res.status(200).end();
    return;
  }

  // Обрабатываем только POST запросы
  if (req.method !== 'POST') {
    console.log('❌ Неподдерживаемый метод:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Обрабатываем вебхук от Telegram
    const update = req.body;
    console.log('📨 Получено обновление от Telegram:', update ? 'Да' : 'Нет');
    
    // Проверяем, что это валидное обновление от Telegram
    if (!update || !update.message && !update.callback_query) {
      console.log('❌ Невалидное обновление');
      res.status(400).json({ error: 'Invalid update' });
      return;
    }

    console.log('✅ Обрабатываем обновление...');
    
    // Эмулируем событие для бота
    if (update.message) {
      console.log('💬 Обрабатываем сообщение');
      bot.emit('message', update.message);
    }
    
    if (update.callback_query) {
      console.log('🔘 Обрабатываем callback query');
      bot.emit('callback_query', update.callback_query);
    }

    // Отвечаем успехом
    console.log('✅ Обновление обработано успешно');
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('❌ Ошибка в webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const TelegramBot = require('node-telegram-bot-api');
const MessageHandler = require('./handlers/messageHandler');
const config = require('./config');

class Bot {
  constructor() {
    this.bot = new TelegramBot(config.bot.token, { polling: true });
    this.messageHandler = new MessageHandler(this.bot);
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Обработка команды /start
    this.bot.onText(/\/start/, async (msg) => {
      try {
        await this.messageHandler.handleStart(msg);
      } catch (error) {
        console.error('Ошибка при обработке команды /start:', error);
        await this.handleError(msg.chat.id, error);
      }
    });

    // Обработка команды /help
    this.bot.onText(/\/help/, async (msg) => {
      try {
        await this.messageHandler.handleHelp(msg);
      } catch (error) {
        console.error('Ошибка при обработке команды /help:', error);
        await this.handleError(msg.chat.id, error);
      }
    });

    // Обработка команды /random
    this.bot.onText(/\/random/, async (msg) => {
      try {
        await this.messageHandler.handleRandom(msg);
      } catch (error) {
        console.error('Ошибка при обработке команды /random:', error);
        await this.handleError(msg.chat.id, error);
      }
    });

    // Обработка команды /random2
    this.bot.onText(/\/random2/, async (msg) => {
      try {
        await this.messageHandler.handleRandom2(msg);
      } catch (error) {
        console.error('Ошибка при обработке команды /random2:', error);
        await this.handleError(msg.chat.id, error);
      }
    });

    // Обработка команды /characters
    this.bot.onText(/\/characters/, async (msg) => {
      try {
        await this.messageHandler.handleCharacters(msg);
      } catch (error) {
        console.error('Ошибка при обработке команды /characters:', error);
        await this.handleError(msg.chat.id, error);
      }
    });

    // Обработка команды /expansions
    this.bot.onText(/\/expansions/, async (msg) => {
      try {
        await this.messageHandler.handleExpansions(msg);
      } catch (error) {
        console.error('Ошибка при обработке команды /expansions:', error);
        await this.handleError(msg.chat.id, error);
      }
    });

    // Обработка callback кнопок
    this.bot.on('callback_query', async (callbackQuery) => {
      try {
        const data = callbackQuery.data;
        
        if (data.startsWith('expansion_')) {
          await this.messageHandler.handleExpansionSelection(callbackQuery);
        } else if (data === 'continue_to_players') {
          await this.messageHandler.handleContinueToPlayers(callbackQuery);
        } else if (data.startsWith('players_')) {
          await this.messageHandler.handlePlayersSelection(callbackQuery);
        } else if (data.startsWith('options_')) {
          await this.messageHandler.handleOptionsSelection(callbackQuery);
        }
        
        // Отвечаем на callback query
        await this.bot.answerCallbackQuery(callbackQuery.id);
      } catch (error) {
        console.error('Ошибка при обработке callback query:', error);
        await this.handleError(callbackQuery.message.chat.id, error);
      }
    });

    // Обработка всех остальных сообщений
    this.bot.on('message', async (msg) => {
      try {
        // Игнорируем команды, которые уже обработаны
        if (msg.text && !msg.text.startsWith('/')) {
          await this.messageHandler.handleMessage(msg);
        }
      } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
        await this.handleError(msg.chat.id, error);
      }
    });

    // Обработка ошибок
    this.bot.on('error', (error) => {
      console.error('Ошибка бота:', error);
    });

    // Обработка polling ошибок
    this.bot.on('polling_error', (error) => {
      console.error('Ошибка polling:', error);
    });
  }



  // Обработка ошибок
  async handleError(chatId, error) {
    const errorMessage = `
❌ Произошла ошибка при обработке запроса.

Попробуйте еще раз или обратитесь к администратору.

Ошибка: ${error.message}
    `;
    
    try {
      await this.bot.sendMessage(chatId, errorMessage.trim());
    } catch (sendError) {
      console.error('Не удалось отправить сообщение об ошибке:', sendError);
    }
  }

  // Запуск бота
  start() {
    console.log('🤖 King of Tokio Bot запускается...');
    console.log(`📱 Бот: @${config.bot.username || 'не указан'}`);
    console.log('✅ Бот успешно запущен и готов к работе!');
    
    // Отправляем информацию о запуске
    this.bot.getMe().then((botInfo) => {
      console.log(`🤖 Информация о боте:`);
      console.log(`   Имя: ${botInfo.first_name}`);
      console.log(`   Username: @${botInfo.username}`);
      console.log(`   ID: ${botInfo.id}`);
    }).catch((error) => {
      console.error('Ошибка при получении информации о боте:', error);
    });
  }

  // Остановка бота
  stop() {
    console.log('🛑 Остановка бота...');
    this.bot.stopPolling();
    console.log('✅ Бот остановлен');
  }
}

module.exports = Bot;

const axios = require('axios').default;

// Функция для отправки ответа на callback query
const answerCallbackQuery = async (callbackQueryId, text = '') => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  
  if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN не найден');
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text: text
    });
  } catch (error) {
    console.error('❌ Ошибка ответа на callback query:', error.message);
  }
};

// Функция для редактирования сообщения с inline клавиатурой
const editMessageText = async (chatId, messageId, text, replyMarkup = null) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  
  if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN не найден');
    return;
  }

  try {
    const data = {
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: 'Markdown'
    };

    if (replyMarkup) {
      data.reply_markup = replyMarkup;
    }

    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, data);
    console.log('✅ Сообщение отредактировано:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка редактирования сообщения:', error.response?.data || error.message);
    throw error;
  }
};

// Создание inline клавиатуры для выбора расширений
const createExpansionKeyboard = (selectedExpansions) => {
  const expansionNames = {
    core: "🎮 Базовая игра",
    powerUp: "⚡ Power Up!",
    halloween: "🎃 Halloween",
    anubis: "🏺 Анубис"
  };

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: selectedExpansions.has('core') ? "✅ Базовая игра" : "❌ Базовая игра",
          callback_data: "expansion_core"
        },
        {
          text: selectedExpansions.has('powerUp') ? "✅ Power Up!" : "❌ Power Up!",
          callback_data: "expansion_powerUp"
        }
      ],
      [
        {
          text: selectedExpansions.has('halloween') ? "✅ Halloween" : "❌ Halloween",
          callback_data: "expansion_halloween"
        },
        {
          text: selectedExpansions.has('anubis') ? "✅ Анубис" : "❌ Анубис",
          callback_data: "expansion_anubis"
        }
      ],
      [
        { text: "🎯 Продолжить", callback_data: "continue_to_players" }
      ]
    ]
  };

  return keyboard;
};

// Создание inline клавиатуры для выбора количества игроков
const createPlayersKeyboard = () => {
  return {
    inline_keyboard: [
      [
        { text: "2 игрока", callback_data: "players_2" },
        { text: "3 игрока", callback_data: "players_3" }
      ],
      [
        { text: "4 игрока", callback_data: "players_4" },
        { text: "5 игроков", callback_data: "players_5" }
      ],
      [
        { text: "6 игроков", callback_data: "players_6" }
      ]
    ]
  };
};

// Создание inline клавиатуры для выбора количества вариантов
const createOptionsKeyboard = (playersCount) => {
  return {
    inline_keyboard: [
      [
        { text: "1 вариант", callback_data: `options_${playersCount}_1` },
        { text: "2 варианта", callback_data: `options_${playersCount}_2` }
      ]
    ]
  };
};

module.exports = {
  answerCallbackQuery,
  editMessageText,
  createExpansionKeyboard,
  createPlayersKeyboard,
  createOptionsKeyboard
};

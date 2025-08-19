const CharacterRandomizer = require('../utils/characterRandomizer');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.randomizer = new CharacterRandomizer();
    this.expansionStates = new Map(); // Хранилище состояний для каждого чата
  }

  // Получение состояния расширений для чата
  getExpansionState(chatId) {
    if (!this.expansionStates.has(chatId)) {
      this.expansionStates.set(chatId, {
        selectedExpansions: new Set(['core', 'powerUp', 'halloween', 'anubis']) // Все расширения выбраны по умолчанию
      });
    }
    return this.expansionStates.get(chatId);
  }

  // Очистка состояния для чата
  clearExpansionState(chatId) {
    this.expansionStates.delete(chatId);
  }

  // Обработка команды /start
  async handleStart(msg) {
    const chatId = msg.chat.id;
    const welcomeMessage = `
🤖 Добро пожаловать в King of Tokio Bot!

Я ваш помощник для выбора персонажей в игре King of Tokyo. Вот что я умею:

🎲 *Рандомайзер персонажей:*
/random - интерактивный выбор персонажей для группы
/random2 - быстрый выбор персонажей для группы
/characters - полный список всех персонажей
/expansions - доступные расширения игры

💡 *Советы:*
• Используйте /random для выбора персонажей для группы игроков
• Команда /characters покажет всех доступных персонажей
• /expansions поможет узнать, какие дополнения у вас есть

Начните с выбора персонажа! 🐉
    `;
    
    await this.bot.sendMessage(chatId, welcomeMessage.trim(), { parse_mode: 'Markdown' });
  }

  // Обработка команды /help
  async handleHelp(msg) {
    const chatId = msg.chat.id;
    const helpMessage = `
📖 *Справка по командам King of Tokyo Bot*

🎮 *Основные команды:*
/start - приветствие и основная информация
/help - показать эту справку

🎲 *Рандомайзер персонажей:*
/random - интерактивный выбор персонажей для группы
/random2 - быстрый выбор персонажей для группы
/characters - полный список всех персонажей
/expansions - доступные расширения игры

💡 *Советы:*
• Используйте /random для выбора персонажей для группы игроков
• Команда /characters покажет всех доступных персонажей
• /expansions поможет узнать, какие дополнения у вас есть
    `;
    
    await this.bot.sendMessage(chatId, helpMessage.trim(), { parse_mode: 'Markdown' });
  }



  // Обработка команды /expansions
  async handleExpansions(msg) {
    const chatId = msg.chat.id;
    const expansionsList = this.randomizer.getExpansionsList();
    
    const message = `
📚 *Доступные расширения:*

${expansionsList}

Используйте команды рандомайзера для выбора персонажей!
    `;
    
    await this.bot.sendMessage(chatId, message.trim(), { parse_mode: 'Markdown' });
  }

  // Обработка выбора расширений
  async handleExpansionSelection(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const expansion = callbackQuery.data.split('_')[1];
    
    // Получаем текущее состояние выбранных расширений
    const currentState = this.getExpansionState(chatId);
    
    // Переключаем состояние выбранного расширения
    if (currentState.selectedExpansions.has(expansion)) {
      currentState.selectedExpansions.delete(expansion);
    } else {
      currentState.selectedExpansions.add(expansion);
    }
    
    // Обновляем сообщение с новым состоянием
    const message = `
🎲 *Рандомайзер персонажей*

Выберите расширения для рандомайзера:
    `;
    
    const keyboard = {
      inline_keyboard: [
        [
          { 
            text: currentState.selectedExpansions.has('core') ? "✅ Базовая игра" : "❌ Базовая игра", 
            callback_data: "expansion_core" 
          },
          { 
            text: currentState.selectedExpansions.has('powerUp') ? "✅ Power Up!" : "❌ Power Up!", 
            callback_data: "expansion_powerUp" 
          }
        ],
        [
          { 
            text: currentState.selectedExpansions.has('halloween') ? "✅ Halloween" : "❌ Halloween", 
            callback_data: "expansion_halloween" 
          },
          { 
            text: currentState.selectedExpansions.has('anubis') ? "✅ Анубис" : "❌ Анубис", 
            callback_data: "expansion_anubis" 
          }
        ],

        [
          { text: "🎯 Продолжить", callback_data: "continue_to_players" }
        ]
      ]
    };
    
    await this.bot.editMessageText(message.trim(), {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  // Обработка перехода к выбору игроков
  async handleContinueToPlayers(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    
    const currentState = this.getExpansionState(chatId);
    
    if (currentState.selectedExpansions.size === 0) {
      // Если ничего не выбрано, выбираем базовую игру по умолчанию
      currentState.selectedExpansions.add('core');
    }
    
    const selectedExpansionsList = Array.from(currentState.selectedExpansions).map(exp => {
      const names = {
        core: "Базовая игра",
        powerUp: "Power Up!",
        halloween: "Halloween",
        anubis: "Анубис"
      };
      return names[exp] || exp;
    }).join(", ");
    
    const message = `
🎲 *Рандомайзер персонажей*

✅ Выбранные расширения: ${selectedExpansionsList}

Выберите количество игроков:
    `;
    
    const keyboard = {
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
    
    await this.bot.editMessageText(message.trim(), {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  // Обработка выбора количества игроков
  async handlePlayersSelection(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const playersCount = parseInt(callbackQuery.data.split('_')[1]);
    
    const message = `
👥 *Выбрано ${playersCount} игроков*

Теперь выберите количество вариантов персонажей для каждого игрока:
    `;
    
    const keyboard = {
      inline_keyboard: [
        [
          { text: "1 вариант", callback_data: `options_${playersCount}_1` },
          { text: "2 варианта", callback_data: `options_${playersCount}_2` }
        ]
      ]
    };
    
    await this.bot.editMessageText(message.trim(), {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  // Обработка выбора количества вариантов
  async handleOptionsSelection(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const [, playersCount, optionsCount] = callbackQuery.data.split('_');
    
    const players = parseInt(playersCount);
    const options = parseInt(optionsCount);
    
    // Получаем выбранные расширения
    const currentState = this.getExpansionState(chatId);
    const selectedExpansions = Array.from(currentState.selectedExpansions);
    
    // Фильтруем персонажей по выбранным расширениям
    let availableCharacters = this.randomizer.availableCharacters.filter(character => {
      if (!character.expansion) {
        return selectedExpansions.includes('core');
      }
      return selectedExpansions.includes(character.expansion.toLowerCase());
    });
    
    // Если персонажей не хватает, используем всех
    if (availableCharacters.length < players * options) {
      availableCharacters = this.randomizer.availableCharacters;
    }
    
    const usedCharacters = new Set();
    const playerAssignments = [];
    
    for (let i = 0; i < players; i++) {
      const playerOptions = [];
      
      // Получаем уникальных персонажей для игрока
      for (let j = 0; j < options; j++) {
        let availableChars = availableCharacters.filter(char => !usedCharacters.has(char.name));
        
        if (availableChars.length === 0) {
          // Если персонажей не хватает, начинаем заново
          usedCharacters.clear();
          availableChars = availableCharacters;
        }
        
        const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
        playerOptions.push(randomChar);
        usedCharacters.add(randomChar.name);
      }
      
      playerAssignments.push(playerOptions);
    }
    
    // Формируем сообщение с результатами
    const selectedExpansionsList = selectedExpansions.map(exp => {
      const names = {
        core: "Базовая игра",
        powerUp: "Power Up!",
        halloween: "Halloween",
        anubis: "Анубис"
      };
      return names[exp] || exp;
    }).join(", ");
    
    let message = `🎲 *Рандомайзер персонажей*\n\n`;
    message += `✅ Расширения: ${selectedExpansionsList}\n`;
    message += `👥 Игроков: ${players}\n`;
    message += `🎯 Вариантов на игрока: ${options}\n\n`;
    
    playerAssignments.forEach((playerOptions, index) => {
      message += `*Игрок ${index + 1}:*\n`;
      playerOptions.forEach((character, charIndex) => {
        const expansion = character.expansion ? ` (${character.expansion})` : '';
        message += `${charIndex + 1}. ${character.name}${expansion} - ${character.description}\n`;
      });
      message += `\n`;
    });
    
    message += `Удачной игры! 🐉`;
    
    // Очищаем состояние после завершения
    this.clearExpansionState(chatId);
    
    await this.bot.editMessageText(message.trim(), {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown'
    });
  }

  // Обработка неизвестных команд
  async handleUnknown(msg) {
    const chatId = msg.chat.id;
    const unknownMessage = `
❓ Неизвестная команда!

Используйте /help для просмотра доступных команд.
    `;
    
    await this.bot.sendMessage(chatId, unknownMessage.trim());
  }

  // Обработка команды /random
  async handleRandom(msg) {
    const chatId = msg.chat.id;
    
    // Получаем текущее состояние выбранных расширений
    const currentState = this.getExpansionState(chatId);
    
    const message = `
🎲 *Рандомайзер персонажей*

Выберите расширения для рандомайзера:
    `;
    
    const keyboard = {
      inline_keyboard: [
        [
          { 
            text: currentState.selectedExpansions.has('core') ? "✅ Базовая игра" : "❌ Базовая игра", 
            callback_data: "expansion_core" 
          },
          { 
            text: currentState.selectedExpansions.has('powerUp') ? "✅ Power Up!" : "❌ Power Up!", 
            callback_data: "expansion_powerUp" 
          }
        ],
        [
          { 
            text: currentState.selectedExpansions.has('halloween') ? "✅ Halloween" : "❌ Halloween", 
            callback_data: "expansion_halloween" 
          },
          { 
            text: currentState.selectedExpansions.has('anubis') ? "✅ Анубис" : "❌ Анубис", 
            callback_data: "expansion_anubis" 
          }
        ],

        [
          { text: "🎯 Продолжить", callback_data: "continue_to_players" }
        ]
      ]
    };
    
    await this.bot.sendMessage(chatId, message.trim(), { 
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  // Обработка команды /random2
  async handleRandom2(msg) {
    const chatId = msg.chat.id;
    
    // Получаем текущее состояние выбранных расширений
    const currentState = this.getExpansionState(chatId);
    
    const message = `
🎲 *Быстрый выбор персонажа*

Выберите количество игроков:
    `;
    
    const keyboard = {
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
    
    await this.bot.sendMessage(chatId, message.trim(), { 
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  // Обработка команды /characters
  async handleCharacters(msg) {
    const chatId = msg.chat.id;
    const charactersList = this.randomizer.getCharactersList();
    
    let message = `📋 *Все доступные персонажи:*\n\n`;
    
    Object.entries(charactersList).forEach(([expansion, characters]) => {
      const expansionNames = {
        core: "🎮 Базовая игра (Core Characters)",

        halloween: "🎃 Halloween",
        powerUp: "⚡ Power Up!",
        anubis: "🏺 Анубис"
      };
      
      message += `*${expansionNames[expansion] || expansion}:*\n`;
      characters.forEach((character, index) => {
        message += `${index + 1}. ${character}\n`;
      });
      message += `\n`;
    });
    
    message += `Используйте /random или /random2 для случайного выбора!`;
    
    await this.bot.sendMessage(chatId, message.trim(), { parse_mode: 'Markdown' });
  }



  // Обработка обычных сообщений
  async handleMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    console.log(`Получено сообщение от ${msg.from.username || msg.from.first_name}: ${text}`);
    
    // Здесь можно добавить логику обработки обычных сообщений
    const response = `Вы написали: "${text}"\n\nИспользуйте /help для просмотра команд.`;
    await this.bot.sendMessage(chatId, response);
  }
}

module.exports = MessageHandler;

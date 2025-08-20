const CharacterRandomizer = require('./src/utils/characterRandomizer');
const sendMessage = require('./sendMessage');

const randomizer = new CharacterRandomizer();

// Состояние для каждого чата (в реальном приложении лучше использовать базу данных)
const chatStates = new Map();

const getChatState = (chatId) => {
  if (!chatStates.has(chatId)) {
    chatStates.set(chatId, {
      selectedExpansions: new Set(['core', 'powerUp', 'halloween', 'anubis'])
    });
  }
  return chatStates.get(chatId);
};

const clearChatState = (chatId) => {
  chatStates.delete(chatId);
};

const commandHandlers = {
  start: async (chatId) => {
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

    await sendMessage(chatId, welcomeMessage.trim(), { parse_mode: 'Markdown' });
  },

  help: async (chatId) => {
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

    await sendMessage(chatId, helpMessage.trim(), { parse_mode: 'Markdown' });
  },

  characters: async (chatId) => {
    const charactersList = randomizer.formatCharactersList();
    const message = `
📚 *Список всех персонажей:*

${charactersList}

Используйте команды рандомайзера для выбора персонажей!
    `;

    await sendMessage(chatId, message.trim(), { parse_mode: 'Markdown' });
  },

  expansions: async (chatId) => {
    const expansionsList = randomizer.getExpansionsList();
    const message = `
📚 *Доступные расширения:*

${expansionsList}

Используйте команды рандомайзера для выбора персонажей!
    `;

    await sendMessage(chatId, message.trim(), { parse_mode: 'Markdown' });
  },

  random2: async (chatId) => {
    // Быстрый рандомайзер - выбираем 2-6 игроков и 1-2 варианта
    const players = Math.floor(Math.random() * 5) + 2; // 2-6 игроков
    const options = Math.floor(Math.random() * 2) + 1; // 1-2 варианта

    const currentState = getChatState(chatId);
    const selectedExpansions = Array.from(currentState.selectedExpansions);

    // Фильтруем персонажей по выбранным расширениям
    let availableCharacters = randomizer.availableCharacters.filter(character => {
      if (!character.expansion) {
        return selectedExpansions.includes('core');
      }
      return selectedExpansions.includes(character.expansion.toLowerCase());
    });

    if (availableCharacters.length < players * options) {
      availableCharacters = randomizer.availableCharacters;
    }

    const usedCharacters = new Set();
    const playerAssignments = [];

    for (let i = 0; i < players; i++) {
      const playerOptions = [];

      for (let j = 0; j < options; j++) {
        let availableChars = availableCharacters.filter(char => !usedCharacters.has(char.name));

        if (availableChars.length === 0) {
          usedCharacters.clear();
          availableChars = availableCharacters;
        }

        const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
        playerOptions.push(randomChar);
        usedCharacters.add(randomChar.name);
      }

      playerAssignments.push(playerOptions);
    }

    const selectedExpansionsList = selectedExpansions.map(exp => {
      const names = {
        core: "Базовая игра",
        powerUp: "Power Up!",
        halloween: "Halloween",
        anubis: "Анубис"
      };
      return names[exp] || exp;
    }).join(", ");

    let message = `🎲 *Быстрый рандомайзер персонажей*\n\n`;
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

    await sendMessage(chatId, message.trim(), { parse_mode: 'Markdown' });
  },

  echo: async (chatId, extra) => {
    await sendMessage(chatId, extra || "ECHO!");
  }
};

module.exports = { commandHandlers, getChatState, clearChatState };

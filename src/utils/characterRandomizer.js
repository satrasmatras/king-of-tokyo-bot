const { getAllCharacters, getCharactersByExpansion, getAvailableExpansions } = require('../data/characters');

class CharacterRandomizer {
  constructor() {
    this.availableCharacters = getAllCharacters();
    this.availableExpansions = getAvailableExpansions();
  }

  // Перемешивание массива (алгоритм Фишера-Йейтса)
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Получение случайных персонажей
  getRandomCharacters(count = 1, expansions = null) {
    let charactersToChooseFrom = this.availableCharacters;

    // Если указаны конкретные расширения, фильтруем персонажей
    if (expansions && expansions.length > 0) {
      charactersToChooseFrom = this.availableCharacters.filter(character => {
        // Базовые персонажи не имеют поля expansion
        if (!character.expansion) {
          return expansions.includes('base');
        }
        return expansions.includes(character.expansion.toLowerCase());
      });
    }

    // Проверяем, что у нас достаточно персонажей
    if (charactersToChooseFrom.length < count) {
      count = charactersToChooseFrom.length;
    }

    // Перемешиваем и берем нужное количество
    const shuffled = this.shuffleArray(charactersToChooseFrom);
    return shuffled.slice(0, count);
  }

  // Получение персонажей с исключениями
  getRandomCharactersWithExclusions(count = 1, exclusions = [], expansions = null) {
    let charactersToChooseFrom = this.availableCharacters;

    // Фильтруем по расширениям
    if (expansions && expansions.length > 0) {
      charactersToChooseFrom = charactersToChooseFrom.filter(character => {
        if (!character.expansion) {
          return expansions.includes('base');
        }
        return expansions.includes(character.expansion.toLowerCase());
      });
    }

    // Исключаем указанных персонажей
    charactersToChooseFrom = charactersToChooseFrom.filter(character => 
      !exclusions.includes(character.name)
    );

    // Проверяем, что у нас достаточно персонажей
    if (charactersToChooseFrom.length < count) {
      count = charactersToChooseFrom.length;
    }

    const shuffled = this.shuffleArray(charactersToChooseFrom);
    return shuffled.slice(0, count);
  }

  // Получение списка всех персонажей по расширениям
  getCharactersList() {
    const result = {};
    
    this.availableExpansions.forEach(expansion => {
      const characters = this.availableCharacters.filter(character => {
        if (expansion === 'core') {
          return !character.expansion;
        }
        return character.expansion && character.expansion.toLowerCase() === expansion;
      });
      
      result[expansion] = characters.map(char => char.name);
    });

    return result;
  }

  // Получение информации о персонаже
  getCharacterInfo(characterName) {
    return this.availableCharacters.find(character => 
      character.name.toLowerCase() === characterName.toLowerCase()
    );
  }

  // Форматирование персонажа для вывода
  formatCharacter(character) {
    const expansion = character.expansion ? ` (${character.expansion})` : '';
    return `
🎭 *${character.name}*${expansion}
📝 ${character.description}
    `.trim();
  }

  // Форматирование списка персонажей
  formatCharactersList(characters) {
    if (characters.length === 0) {
      return "❌ Персонажи не найдены";
    }

    return characters.map((character, index) => {
      const expansion = character.expansion ? ` (${character.expansion})` : '';
      return `${index + 1}. *${character.name}*${expansion} - ${character.description}`;
    }).join('\n');
  }

  // Получение доступных расширений для выбора
  getExpansionsList() {
    const expansionNames = {
      core: "🎮 Базовая игра (Core Characters)",
      halloween: "🎃 Halloween",
      powerUp: "⚡ Power Up!",
      anubis: "🏺 Анубис"
    };

    return this.availableExpansions.map(expansion => 
      `• ${expansionNames[expansion] || expansion}`
    ).join('\n');
  }
}

module.exports = CharacterRandomizer;

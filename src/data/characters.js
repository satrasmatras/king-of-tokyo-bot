const characters = {
  core: [
    {
      name: "Алиеноид",
      description: "Инопланетный захватчик"
    },
    {
      name: "Кибер-Кролик/Кибер-Кот",
      description: "Роботизированный кролик (оригинал) или кот (поздние издания)"
    },
    {
      name: "Гигазавр",
      description: "Гигантская рептилия, вдохновленная Годзиллой"
    },
    {
      name: "Король",
      description: "Гигантская обезьяна, вдохновленная Кинг Конгом"
    },
    {
      name: "Кракен/Космический Пингвин",
      description: "Гигантское морское чудовище (оригинал) или пингвин из космоса (поздние издания)"
    },
    {
      name: "Меха-Дракон",
      description: "Механический дракон"
    },

    {
      name: "Малыш Гигазавр",
      description: "Уменьшенная версия Гигазавра, доступна в эксклюзиве Target и Monster Box"
    }
  ],
  halloween: [
    {
      name: "Буги-Вуги",
      description: "Хэллоуинский монстр",
      expansion: "Halloween"
    },
    {
      name: "Тыквенный Джек",
      description: "Хэллоуинский монстр",
      expansion: "Halloween"
    }
  ],
  powerUp: [
    {
      name: "Пандакай",
      description: "Из расширения Power Up!",
      expansion: "Power Up!"
    }
  ],
  anubis: [
    {
      name: "Анубис",
      description: "Бог смерти и загробного мира",
      expansion: "Anubis"
    }
  ]
};

// Функция для получения всех персонажей
function getAllCharacters() {
  const allCharacters = [];
  
  Object.values(characters).forEach(expansion => {
    expansion.forEach(character => {
      allCharacters.push(character);
    });
  });
  
  return allCharacters;
}

// Функция для получения персонажей по расширению
function getCharactersByExpansion(expansion) {
  return characters[expansion] || [];
}

// Функция для получения доступных расширений
function getAvailableExpansions() {
  return Object.keys(characters);
}

module.exports = {
  characters,
  getAllCharacters,
  getCharactersByExpansion,
  getAvailableExpansions
};

const characters = {
  core: [
    {
      name: "Алиеноид",
      emoji: "👽"
    },
    {
      name: "Кибер-Кролик/Кибер-Кот",
      emoji: "🤖"
    },
    {
      name: "Гигазавр",
      emoji: "🦖"
    },
    {
      name: "Король",
      emoji: "🦍"
    },
    {
      name: "Кракен/Космический Пингвин",
      emoji: "🐧"
    },
    {
      name: "Меха-Дракон",
      emoji: "🐉"
    },
    {
      name: "Малыш Гигазавр",
      emoji: "🥚"
    }
  ],
  halloween: [
    {
      name: "Буги-Вуги",
      expansion: "Halloween",
      emoji: "👻"
    },
    {
      name: "Тыквенный Джек",
      expansion: "Halloween",
      emoji: "🎃"
    }
  ],
  powerUp: [
    {
      name: "Пандакай",
      expansion: "Power Up!",
      emoji: "🐼"
    }
  ],
  anubis: [
    {
      name: "Анубис",
      expansion: "Anubis",
      emoji: "🐕"
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

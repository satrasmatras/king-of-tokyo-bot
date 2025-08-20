const messageParts = (text) => {
  if (!text || !text.startsWith('/')) {
    return {
      command: null,
      botName: null,
      extra: text
    };
  }

  // Удаляем начальный '/'
  text = text.substring(1);

  // Разделяем на части
  const parts = text.split(' ');
  const commandPart = parts[0]; // команда@бот
  const extra = parts.slice(1).join(' ') || null;

  // Проверяем, есть ли @ в команде
  if (commandPart.includes('@')) {
    const [command, botName] = commandPart.split('@');
    return { command, botName, extra };
  }

  return {
    command: commandPart,
    botName: null,
    extra
  };
};

module.exports = messageParts;

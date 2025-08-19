const Bot = require('./bot');

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  process.exit(1);
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанное отклонение промиса:', reason);
  process.exit(1);
});

// Обработка сигнала завершения
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал SIGINT, завершение работы...');
  if (bot) {
    bot.stop();
  }
  process.exit(0);
});

// Обработка сигнала завершения (альтернативный)
process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал SIGTERM, завершение работы...');
  if (bot) {
    bot.stop();
  }
  process.exit(0);
});

// Создание и запуск бота
let bot;

try {
  console.log('🚀 Запуск King of Tokio Bot...');
  bot = new Bot();
  bot.start();
} catch (error) {
  console.error('❌ Ошибка при запуске бота:', error);
  process.exit(1);
}

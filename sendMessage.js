const axios = require('axios').default;

const sendMessage = async (chatId, text, options = {}) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  
  if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN не найден в переменных окружения');
    throw new Error('BOT_TOKEN is required');
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const data = {
    chat_id: chatId,
    text: text,
    ...options
  };

  try {
    const response = await axios.post(url, data);
    console.log('✅ Сообщение отправлено:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendMessage;

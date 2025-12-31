const { replyHumanlike } = require('../utils/helpers');

/**
 * Command: !ping
 * Membalas dengan "Pong! 🏓" untuk mengecek apakah bot masih aktif
 * 
 * @param {Object} message - Message object dari whatsapp-web.js
 * @param {Object} client - WhatsApp Client instance
 */
const pingCommand = async (message, client) => {
    await replyHumanlike(message, client, 'Pong! 🏓');
};

module.exports = pingCommand;

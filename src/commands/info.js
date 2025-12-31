const { replyHumanlike } = require('../utils/helpers');

/**
 * Command: !info
 * Menampilkan informasi grup (nama dan jumlah peserta)
 * Hanya berfungsi di dalam grup
 * 
 * @param {Object} message - Message object dari whatsapp-web.js
 * @param {Object} client - WhatsApp Client instance
 */
const infoCommand = async (message, client) => {
    // Cek dulu apakah grup, baru lakukan delay typing
    // Ini hemat resource, jangan typing kalau ujungnya ditolak
    const chat = await message.getChat();

    if (chat.isGroup) {
        const infoText = `
Info Grup:
Nama: ${ chat.name }
Jumlah Peserta: ${ chat.participants.length }
        `;
        await replyHumanlike(message, client, infoText);
    } else {
        await replyHumanlike(message, client, 'Perintah ini hanya bisa digunakan di dalam grup!');
    }
};

module.exports = infoCommand;

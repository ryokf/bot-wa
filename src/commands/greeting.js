import { replyHumanlike } from '../utils/helpers.js';

/**
 * Command: halo bot
 * Membalas sapaan dari user dengan sapaan balik
 * 
 * @param {Object} message - Message object dari whatsapp-web.js
 * @param {Object} client - WhatsApp Client instance
 */
const greetingCommand = async (message, client) => {
    // Kirim sebagai pesan biasa (false pada parameter terakhir)
    await replyHumanlike(message, client, 'Halo juga! Ada yang bisa saya bantu?', false);
};

export default greetingCommand;

import { pingCommand, greetingCommand, infoCommand } from '../commands/index.js';

/**
 * Message Handler
 * Menangani pesan masuk dan routing ke command yang sesuai
 * 
 * @param {Object} message - Message object dari whatsapp-web.js
 * @param {Object} client - WhatsApp Client instance
 */
const handleMessage = async (message, client) => {
    // Log pesan masuk
    console.log(`[${ message.from }] berkata: ${ message.body }`);

    const msg = message.body.toLowerCase();

    // Route ke command yang sesuai
    if (msg === '!ping') {
        await pingCommand(message, client);
    }
    else if (msg.includes('halo bot')) {
        await greetingCommand(message, client);
    }
    else if (msg === '!info') {
        await infoCommand(message, client);
    }
    // Tambahkan command lain di sini sesuai kebutuhan
};

export default handleMessage;

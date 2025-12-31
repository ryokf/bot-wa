import { pingCommand, greetingCommand, infoCommand } from '../commands/index.js';
import { isAdmin } from '../config/admin.config.js';
import adminCommand from '../commands/admin.js';

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

    // ===== ADMIN AI ASSISTANT =====
    // Jika pengirim adalah admin, route semua pesan ke AI Assistant
    if (isAdmin(message.from)) {
        console.log('[Permission] Admin detected, routing to AI Assistant');
        await adminCommand(message, client);
        return;
    }

    // ===== REGULAR COMMANDS (Non-Admin) =====
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

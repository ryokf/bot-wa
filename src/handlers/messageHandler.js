import { pingCommand, greetingCommand, infoCommand } from '../commands/index.js';
import { isAdmin } from '../config/admin.config.js';
import adminCommand from '../commands/admin.js';

/**
 * Message Handler (PERSONAL ASSISTANT MODE)
 * Bot merespons admin langsung tanpa prefix
 * Prioritas: Specific commands → Admin AI Assistant
 * 
 * @param {Object} message - Message object dari whatsapp-web.js
 * @param {Object} client - WhatsApp Client instance
 */
const handleMessage = async (message, client) => {
    // Log pesan masuk
    console.log(`[${ message.from }] berkata: ${ message.body }`);

    const msg = message.body.toLowerCase();

    // ===== PRIORITAS 1: SPECIFIC COMMANDS =====
    // Cek perintah spesifik dulu (untuk semua user)
    if (msg === '!ping') {
        await pingCommand(message, client);
        return;
    }

    if (msg.includes('halo bot')) {
        await greetingCommand(message, client);
        return;
    }

    if (msg === '!info') {
        await infoCommand(message, client);
        return;
    }

    // ===== PRIORITAS 2: ADMIN AI ASSISTANT =====
    // Jika pengirim adalah admin, route ke AI Assistant (TANPA PREFIX)
    if (isAdmin(message.from)) {
        console.log('[Permission] Admin detected, routing to AI Assistant');
        await adminCommand(message, client);
        return;
    }

    // ===== NON-ADMIN: IGNORE =====
    // Jika bukan admin dan bukan command spesifik, abaikan
    console.log('[Handler] Non-admin message ignored');
};

export default handleMessage;


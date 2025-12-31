/**
 * Central export untuk semua commands
 * Memudahkan import di message handler
 */
import pingCommand from './ping.js';
import greetingCommand from './greeting.js';
import infoCommand from './info.js';

export {
    pingCommand,
    greetingCommand,
    infoCommand
};

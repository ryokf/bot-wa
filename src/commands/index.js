/**
 * Central export untuk semua commands
 * Memudahkan import di message handler
 */
const pingCommand = require('./ping');
const greetingCommand = require('./greeting');
const infoCommand = require('./info');

module.exports = {
    pingCommand,
    greetingCommand,
    infoCommand
};

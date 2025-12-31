const qrcode = require('qrcode-terminal');
const { createClient } = require('./config/client.config');
const handleMessage = require('./handlers/messageHandler');

// Buat instance WhatsApp Client
const client = createClient();

// Event: Generate QR Code
client.on('qr', (qr) => {
    console.log('Scan QR Code ini sekarang:');
    qrcode.generate(qr, { small: true });
});

// Event: Bot Siap
client.on('ready', () => {
    console.log('✅ Client is ready! Bot sudah online dengan fitur Anti-Ban.');
});

// Event: Autentikasi Gagal
client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
});

// Event: Menerima Pesan
client.on('message', async (message) => {
    await handleMessage(message, client);
});

// Jalankan Bot
console.log('Menghubungkan ke WhatsApp...');
client.initialize();
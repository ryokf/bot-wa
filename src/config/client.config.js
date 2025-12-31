const { Client, LocalAuth } = require('whatsapp-web.js');

/**
 * Konfigurasi WhatsApp Client dengan fitur Anti-Ban
 * Menggunakan LocalAuth untuk menyimpan sesi
 * Puppeteer dikonfigurasi dengan User Agent asli untuk menghindari deteksi bot
 */
const clientConfig = {
    authStrategy: new LocalAuth(),
    puppeteer: {
        // Path Chrome M1 (sesuaikan dengan sistem Anda)
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',

        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            // ANTI-BAN: Menggunakan User Agent Chrome Mac asli agar tidak terdeteksi sebagai "HeadlessChrome"
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
    }
};

/**
 * Factory function untuk membuat instance WhatsApp Client
 * @returns {Client} Instance WhatsApp Client yang sudah dikonfigurasi
 */
const createClient = () => {
    return new Client(clientConfig);
};

module.exports = { createClient, clientConfig };

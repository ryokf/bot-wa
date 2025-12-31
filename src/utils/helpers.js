/**
 * HELPER FUNCTION: RANDOM DELAY
 * Fungsi ini membuat jeda waktu acak antara min dan max milidetik
 * Tujuannya agar pola balasan tidak robotik (selalu instan)
 * 
 * @param {number} min - Minimum delay dalam milidetik
 * @param {number} max - Maximum delay dalam milidetik
 * @returns {Promise} Promise yang resolve setelah delay acak
 */
const randomDelay = (min, max) => {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));
};

/**
 * LOGIKA ANTI-BAN (HUMANIZING)
 * Fungsi pembungkus untuk membalas pesan seolah-olah manusia
 * Langkah: Ambil chat -> Set status 'Typing' -> Tunggu acak -> Kirim
 * 
 * @param {Object} message - Message object dari whatsapp-web.js
 * @param {Object} client - WhatsApp Client instance
 * @param {string} textResponse - Teks yang akan dikirim
 * @param {boolean} isReply - True untuk reply, false untuk send message biasa
 */
const replyHumanlike = async (message, client, textResponse, isReply = true) => {
    try {
        const chat = await message.getChat();

        // 1. Aktifkan indikator "Sedang mengetik..." di HP lawan bicara
        await chat.sendStateTyping();

        // 2. Delay acak antara 1.5 detik sampai 4 detik
        // (Semakin panjang teks, harusnya delay semakin lama, tapi ini simulasi dasar)
        await randomDelay(1500, 4000);

        // 3. Kirim pesan
        if (isReply) {
            await message.reply(textResponse);
        } else {
            await client.sendMessage(message.from, textResponse);
        }

        // 4. Hapus status typing (opsional, biasanya hilang sendiri setelah kirim)
        await chat.clearState();

    } catch (error) {
        console.error('Gagal mengirim pesan:', error);
    }
};

module.exports = { randomDelay, replyHumanlike };

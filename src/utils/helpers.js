/**
 * HELPER FUNCTION: RANDOM DELAY
 * Fungsi ini membuat jeda waktu acak antara min dan max milidetik
 * Tujuannya agar pola balasan tidak robotik (selalu instan)
 * 
 * @param {number} min - Minimum delay dalam milidetik (default dari .env)
 * @param {number} max - Maximum delay dalam milidetik (default dari .env)
 * @returns {Promise} Promise yang resolve setelah delay acak
 */
export const randomDelay = (min = null, max = null) => {
    const minDelay = min || parseInt(process.env.MIN_DELAY) || 1500;
    const maxDelay = max || parseInt(process.env.MAX_DELAY) || 4000;
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay)));
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
export const replyHumanlike = async (message, client, textResponse, isReply = true) => {
    try {
        const chat = await message.getChat();

        // 1. Aktifkan indikator "Sedang mengetik..." di HP lawan bicara
        await chat.sendStateTyping();

        // 2. Delay acak menggunakan nilai dari .env (MIN_DELAY dan MAX_DELAY)
        await randomDelay();

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

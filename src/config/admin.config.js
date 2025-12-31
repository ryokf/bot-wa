/**
 * ADMIN CONFIGURATION
 * Daftar nomor WhatsApp yang memiliki akses ke AI Assistant
 * SECURITY: Hanya nomor di list ini yang bisa menggunakan function calling
 */

/**
 * Admin Phone Numbers
 * Format: '62812345678@c.us' (WhatsApp ID format)
 * 
 * CARA MENDAPATKAN WHATSAPP ID:
 * 1. Kirim pesan ke bot dari nomor admin
 * 2. Lihat console log: [6281234567890@c.us] berkata: ...
 * 3. Copy ID tersebut dan masukkan ke array di bawah
 */
export const ADMIN_PHONE_NUMBERS = [
    // Tambahkan nomor admin di sini
    // Contoh: '6281234567890@c.us',

    // TEMPORARY: Allow all for testing (REMOVE IN PRODUCTION!)
    '*' // Uncomment this to allow all users (NOT RECOMMENDED)
    // '6289647767389@c.us',
];

/**
 * Check if a phone number is admin
 * @param {string} phoneNumber - WhatsApp ID (format: 6281234567890@c.us)
 * @returns {boolean} True if admin
 */
export const isAdmin = (phoneNumber) => {
    // If wildcard is enabled, allow all
    if (ADMIN_PHONE_NUMBERS.includes('*')) {
        return true;
    }

    return ADMIN_PHONE_NUMBERS.includes(phoneNumber);
};

/**
 * Add admin phone number
 * @param {string} phoneNumber - WhatsApp ID to add
 * @returns {boolean} True if added, false if already exists
 */
export const addAdmin = (phoneNumber) => {
    if (isAdmin(phoneNumber)) {
        return false; // Already admin
    }

    ADMIN_PHONE_NUMBERS.push(phoneNumber);
    return true;
};

/**
 * Remove admin phone number
 * @param {string} phoneNumber - WhatsApp ID to remove
 * @returns {boolean} True if removed, false if not found
 */
export const removeAdmin = (phoneNumber) => {
    const index = ADMIN_PHONE_NUMBERS.indexOf(phoneNumber);

    if (index === -1) {
        return false; // Not found
    }

    ADMIN_PHONE_NUMBERS.splice(index, 1);
    return true;
};

/**
 * Get all admin phone numbers
 * @returns {Array<string>} Array of admin phone numbers
 */
export const getAllAdmins = () => {
    return [...ADMIN_PHONE_NUMBERS];
};

/**
 * Get admin count
 * @returns {number} Number of admins
 */
export const getAdminCount = () => {
    return ADMIN_PHONE_NUMBERS.filter(num => num !== '*').length;
};

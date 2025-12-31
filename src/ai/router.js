import gemini from '../config/gemini.config.js';
import { FUNCTION_SCHEMAS } from './function.schemas.js';

/**
 * AI ROUTER (WITH TIME CONTEXT)
 * Menentukan tool mana yang harus digunakan berdasarkan pertanyaan user
 * Menggunakan Gemini AI dengan konteks waktu saat ini
 */

/**
 * Route user message to appropriate function
 * @param {string} userMessage - Pertanyaan dari admin
 * @returns {Promise<Object>} Routing decision { needsTool, toolName, params }
 */
export const routeToFunction = async (userMessage) => {
    // Get current date for context
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDay = now.getDate();

    const prompt = `
Kamu adalah AI Router untuk sistem bisnis air bersih.

INFORMASI WAKTU SAAT INI:
- Tanggal hari ini: ${ currentDate }
- Tahun: ${ currentYear }
- Bulan: ${ currentMonth }
- Hari: ${ currentDay }

TOOLS YANG TERSEDIA:
${ JSON.stringify(FUNCTION_SCHEMAS, null, 2) }

PERTANYAAN USER:
"${ userMessage }"

INSTRUKSI:
1. Analisis pertanyaan user dengan cermat
2. Tentukan apakah pertanyaan ini membutuhkan data dari database atau tidak

3. Jika TIDAK butuh data (misal: sapaan, terima kasih, obrolan biasa):
   Return: { "needsTool": false }
   
4. Jika BUTUH data dari database:
   a. Pilih tool yang PALING SESUAI dari daftar di atas
   b. Extract parameter yang dibutuhkan:
      - Untuk pertanyaan tentang waktu, tentukan startDate dan endDate
      - Jika user bilang "bulan ini", gunakan:
        startDate = "${ currentYear }-${ String(currentMonth).padStart(2, '0') }-01"
        endDate = "${ currentDate }"
      - Jika user bilang "tahun ini", gunakan:
        startDate = "${ currentYear }-01-01"
        endDate = "${ currentDate }"
      - Jika user bilang bulan tertentu (misal "Januari"), gunakan tahun ini:
        startDate = "${ currentYear }-01-01"
        endDate = "${ currentYear }-01-31"
      - Jika tidak disebutkan waktu, gunakan 1 tahun terakhir:
        startDate = "${ currentYear - 1 }-${ String(currentMonth).padStart(2, '0') }-${ String(currentDay).padStart(2, '0') }"
        endDate = "${ currentDate }"
   
   Return: { "needsTool": true, "toolName": "nama_tool", "params": { ... } }

CONTOH RESPONSE:

Pertanyaan: "Halo, apa kabar?"
Response: { "needsTool": false }

Pertanyaan: "Siapa aja yang nunggak?"
Response: { "needsTool": true, "toolName": "fetch_invoices", "params": { "status": "Unpaid" } }

Pertanyaan: "Berapa total pemasukan bulan ini?"
Response: { "needsTool": true, "toolName": "fetch_transactions", "params": { "startDate": "${ currentYear }-${ String(currentMonth).padStart(2, '0') }-01", "endDate": "${ currentDate }" } }

Pertanyaan: "Bulan apa paling boros air tahun ini?"
Response: { "needsTool": true, "toolName": "fetch_readings", "params": { "startDate": "${ currentYear }-01-01", "endDate": "${ currentDate }" } }

PENTING:
- Response HARUS dalam format JSON yang valid
- Jangan tambahkan penjelasan di luar JSON
- Untuk tanggal, gunakan format YYYY-MM-DD
- Gunakan informasi waktu saat ini untuk menghitung rentang tanggal yang akurat

RESPONSE (JSON only):
`;

    try {
        const response = await gemini(prompt);

        // Handle null response (API error)
        if (!response) {
            return {
                needsTool: false,
                error: 'Gemini API returned null (quota exceeded or error)'
            };
        }

        // Clean response (remove markdown code blocks if any)
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith('```json')) {
            cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (cleanResponse.startsWith('```')) {
            cleanResponse = cleanResponse.replace(/```\n?/g, '');
        }

        const routing = JSON.parse(cleanResponse);

        // Validate response structure
        if (typeof routing.needsTool !== 'boolean') {
            throw new Error('Invalid routing response: needsTool must be boolean');
        }

        if (routing.needsTool && !routing.toolName) {
            throw new Error('Invalid routing response: toolName required when needsTool is true');
        }

        return routing;
    } catch (error) {
        console.error('Router Error:', error);
        // Fallback: assume needs tool and let executor handle error
        return {
            needsTool: false,
            error: error.message
        };
    }
};

/**
 * Validate routing decision
 * @param {Object} routing - Routing decision object
 * @returns {boolean} True if valid
 */
export const isValidRouting = (routing) => {
    if (!routing || typeof routing !== 'object') return false;
    if (typeof routing.needsTool !== 'boolean') return false;
    if (routing.needsTool && !routing.toolName) return false;
    return true;
};

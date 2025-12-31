import gemini from '../config/gemini.config.js';
import { FUNCTION_SCHEMAS } from './function.schemas.js';

/**
 * AI ROUTER (WITH FORECASTING INTELLIGENCE)
 * Menentukan tool mana yang harus digunakan berdasarkan pertanyaan user
 * Mendukung context bridging untuk prediksi masa depan
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

⚠️ ATURAN FORECASTING (SANGAT PENTING):
Jika user meminta PREDIKSI, PROYEKSI, RAMALAN, atau data MASA DEPAN:
- Contoh kata kunci: "proyeksi 2026", "prediksi tahun depan", "ramalan", "forecast", "estimasi masa depan"
- Kamu HARUS mengaktifkan tool untuk mengambil data HISTORIS (1-2 tahun ke belakang)
- Data historis ini akan digunakan AI untuk menganalisis tren dan membuat proyeksi
- Contoh: User tanya "Proyeksi 2026" → panggil fetch_readings dengan startDate: "2024-01-01", endDate: "${ currentDate }"
- JANGAN jawab "data tidak tersedia" - ambil data masa lalu sebagai bahan analisis!

🧠 CHAIN OF THOUGHT (Proses Berpikir):
Sebelum memutuskan, pikirkan:
1. Apakah pertanyaan ini tentang masa depan/prediksi?
   → Jika YA: Saya butuh data historis untuk analisis tren (needsTool: true)
2. Apakah pertanyaan ini membutuhkan data dari database?
   → Jika YA: Tentukan tool dan parameter yang tepat
3. Apakah ini hanya sapaan/basa-basi?
   → Jika YA: needsTool: false

INSTRUKSI:
1. Analisis pertanyaan user dengan cermat
2. Tentukan apakah pertanyaan ini membutuhkan data dari database atau tidak

3. Jika TIDAK butuh data (misal: sapaan, terima kasih, obrolan biasa):
   Return: { "needsTool": false }
   
4. Jika BUTUH data dari database (termasuk untuk PREDIKSI):
   a. Pilih tool yang PALING SESUAI dari daftar di atas
   b. Extract parameter yang dibutuhkan:
   
      UNTUK PREDIKSI/PROYEKSI MASA DEPAN:
      - Ambil data historis 1-2 tahun sebagai bahan analisis
      - startDate = "${ currentYear - 1 }-01-01" atau "${ currentYear - 2 }-01-01"
      - endDate = "${ currentDate }"
      
      UNTUK PERTANYAAN WAKTU NORMAL:
      - "bulan ini": startDate = "${ currentYear }-${ String(currentMonth).padStart(2, '0') }-01", endDate = "${ currentDate }"
      - "tahun ini": startDate = "${ currentYear }-01-01", endDate = "${ currentDate }"
      - Tidak disebutkan: startDate = "${ currentYear - 1 }-${ String(currentMonth).padStart(2, '0') }-${ String(currentDay).padStart(2, '0') }", endDate = "${ currentDate }"
   
   Return: { "needsTool": true, "toolName": "nama_tool", "params": { ... } }

CONTOH RESPONSE:

Pertanyaan: "Halo, apa kabar?"
Reasoning: Sapaan biasa, tidak butuh data
Response: { "needsTool": false }

Pertanyaan: "Siapa aja yang nunggak?"
Reasoning: Butuh data tagihan unpaid dari database
Response: { "needsTool": true, "toolName": "fetch_invoices", "params": { "status": "Unpaid" } }

Pertanyaan: "Berapa total pemasukan bulan ini?"
Reasoning: Butuh data transaksi bulan ini
Response: { "needsTool": true, "toolName": "fetch_transactions", "params": { "startDate": "${ currentYear }-${ String(currentMonth).padStart(2, '0') }-01", "endDate": "${ currentDate }" } }

Pertanyaan: "Proyeksi pemakaian air tahun 2026?"
Reasoning: Prediksi masa depan, butuh data historis 2024-2025 untuk analisis tren
Response: { "needsTool": true, "toolName": "fetch_readings", "params": { "startDate": "2024-01-01", "endDate": "${ currentDate }" } }

Pertanyaan: "Ramalan pendapatan tahun depan?"
Reasoning: Prediksi masa depan, butuh data historis transaksi untuk analisis
Response: { "needsTool": true, "toolName": "fetch_transactions", "params": { "startDate": "${ currentYear - 1 }-01-01", "endDate": "${ currentDate }" } }

Pertanyaan: "Berikan proyeksi data kedepan pada tahun 2026"
Reasoning: Prediksi masa depan, butuh data historis pemakaian air untuk analisis tren
Response: { "needsTool": true, "toolName": "fetch_readings", "params": { "startDate": "2024-01-01", "endDate": "${ currentDate }" } }

PENTING:
- Response HARUS dalam format JSON yang valid
- Jangan tambahkan penjelasan di luar JSON
- Untuk tanggal, gunakan format YYYY-MM-DD
- Gunakan informasi waktu saat ini untuk menghitung rentang tanggal yang akurat
- SELALU ambil data historis untuk pertanyaan prediksi/proyeksi/ramalan

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

import gemini from '../config/gemini.config.js';
import { FUNCTION_SCHEMAS } from './function.schemas.js';

/**
 * AI ROUTER
 * Menentukan tool mana yang harus digunakan berdasarkan pertanyaan user
 * Menggunakan Gemini AI untuk memilih fungsi yang tepat
 */

/**
 * Route user message to appropriate function
 * @param {string} userMessage - Pertanyaan dari admin
 * @returns {Promise<Object>} Routing decision { needsTool, toolName, params }
 */
export const routeToFunction = async (userMessage) => {
    const prompt = `
Kamu adalah AI Router untuk sistem bisnis air bersih.

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
   - Pilih tool yang PALING SESUAI dari daftar di atas
   - Extract parameter yang dibutuhkan dari pertanyaan user
   Return: { "needsTool": true, "toolName": "nama_tool", "params": {} }

CONTOH RESPONSE:
Pertanyaan: "Halo, apa kabar?"
Response: { "needsTool": false }

Pertanyaan: "Siapa aja yang nunggak bulan ini?"
Response: { "needsTool": true, "toolName": "get_unpaid_invoices", "params": {} }

Pertanyaan: "Berapa total pemasukan bulan Januari 2025?"
Response: { "needsTool": true, "toolName": "get_invoice_summary", "params": { "period": "Januari 2025" } }

PENTING:
- Response HARUS dalam format JSON yang valid
- Jangan tambahkan penjelasan di luar JSON
- Jika ragu, lebih baik set needsTool: true

RESPONSE (JSON only):
`;

    try {
        const response = await gemini(prompt);

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

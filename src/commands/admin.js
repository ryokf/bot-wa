import { routeToFunction } from '../ai/router.js';
import { executeFunction } from '../ai/executor.js';
import gemini from '../config/gemini.config.js';
import { replyHumanlike } from '../utils/helpers.js';

/**
 * ADMIN COMMAND (PERSONAL ASSISTANT MODE)
 * AI-powered assistant untuk admin - merespons langsung tanpa prefix
 * Dengan smart filtering untuk menghindari respons pada pesan pendek
 */

const adminCommand = async (message, client) => {
    // Ambil pesan mentah (tanpa potong prefix)
    const userMessage = message.body.trim();

    // ===== FILTER 1: IGNORE PESAN PENDEK (Basa-basi) =====
    // Abaikan pesan < 4 karakter (misal: "Ok", "Y", "Wkwk", "Siap")
    if (userMessage.length < 4) {
        console.log('[Filter] Message too short, ignoring:', userMessage);
        return;
    }

    // ===== FILTER 2: IGNORE COMMON SHORT REPLIES =====
    const ignoredPhrases = ['ok', 'oke', 'siap', 'baik', 'ya', 'tidak', 'gak', 'nggak'];
    if (ignoredPhrases.includes(userMessage.toLowerCase())) {
        console.log('[Filter] Common short reply, ignoring:', userMessage);
        return;
    }

    try {
        // Step 1: Route to function (AI memilih tool yang tepat)
        console.log('[AI Router] Analyzing message:', userMessage);
        const routing = await routeToFunction(userMessage);
        console.log('[AI Router] Routing decision:', routing);

        // Check for routing errors
        if (routing.error) {
            await replyHumanlike(message, client,
                `Maaf, terjadi kesalahan saat memproses pertanyaan Anda: ${ routing.error }`
            );
            return;
        }

        // Step 2: Handle based on routing decision
        if (!routing.needsTool) {
            // Casual chat, no database access needed
            console.log('[AI] No tool needed, responding with casual chat');
            const response = await gemini(userMessage);

            // Null check untuk API error
            if (!response) {
                await replyHumanlike(message, client,
                    'Maaf, AI sedang tidak tersedia. Silakan coba lagi nanti.'
                );
                return;
            }

            await replyHumanlike(message, client, response);
            return;
        }

        // Step 3: Execute function to get data
        console.log(`[Executor] Executing tool: ${ routing.toolName }`);
        const data = await executeFunction(routing.toolName, routing.params || {});
        console.log(`[Executor] Tool executed successfully, data length:`,
            Array.isArray(data) ? data.length : typeof data
        );

        // Step 4: Context injection & final response
        const finalPrompt = `
PERTANYAAN ADMIN:
"${ userMessage }"

DATA DARI DATABASE (${ routing.toolName }):
${ JSON.stringify(data, null, 2) }

INSTRUKSI:
Jawab pertanyaan admin menggunakan data di atas dengan gaya profesional dan to-the-point.
Gunakan format yang mudah dibaca (bullet points, numbering, dll).
Jika data kosong atau null, beritahu admin dengan sopan.
Berikan insight atau rekomendasi jika relevan.
`;

        console.log('[AI] Generating final response with context');
        const response = await gemini(finalPrompt);

        // Null check
        if (!response) {
            await replyHumanlike(message, client,
                'Maaf, AI sedang tidak tersedia. Silakan coba lagi nanti.'
            );
            return;
        }

        // Step 5: Send response
        await replyHumanlike(message, client, response);
        console.log('[AI] Response sent successfully');

    } catch (error) {
        console.error('[Admin Command Error]:', error);

        // Send error message to admin
        await replyHumanlike(message, client,
            `Maaf, terjadi kesalahan: ${ error.message }\n\nSilakan coba lagi atau hubungi developer.`
        );
    }
};

export default adminCommand;


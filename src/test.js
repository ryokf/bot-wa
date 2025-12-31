import { routeToFunction } from './ai/router.js';
import { executeFunction } from './ai/executor.js';
import gemini from './config/gemini.config.js';

/**
 * TEST FILE - AI Assistant Simulator
 * Mensimulasikan admin command tanpa perlu WhatsApp
 */

/**
 * Simulate Admin Command
 * Fungsi ini mensimulasikan flow lengkap admin command
 */
const testAdminCommand = async (userQuestion) => {
    console.log('\n' + '='.repeat(80));
    console.log('🤖 AI ASSISTANT TEST');
    console.log('='.repeat(80));
    console.log(`\n📝 PERTANYAAN: "${ userQuestion }"\n`);

    try {
        // Step 1: Route to function (AI memilih tool yang tepat)
        console.log('⚙️  [STEP 1] AI Router analyzing...');
        const routing = await routeToFunction(userQuestion);
        console.log('✅ Routing decision:', JSON.stringify(routing, null, 2));

        // Check for routing errors
        if (routing.error) {
            console.log('❌ Routing error:', routing.error);
            return;
        }

        // Step 2: Handle based on routing decision
        if (!routing.needsTool) {
            // Casual chat, no database access needed
            console.log('\n💬 [STEP 2] No tool needed, casual chat mode');
            const response = await gemini(userQuestion);
            console.log('\n' + '='.repeat(80));
            console.log('📤 FINAL RESPONSE:');
            console.log('='.repeat(80));
            console.log(response);
            console.log('='.repeat(80) + '\n');
            return;
        }

        // Step 3: Execute function to get data
        console.log(`\n💾 [STEP 3] Executing tool: ${ routing.toolName }`);
        console.log('Parameters:', JSON.stringify(routing.params || {}, null, 2));

        const data = await executeFunction(routing.toolName, routing.params || {});
        console.log(`✅ Data fetched: ${ Array.isArray(data) ? data.length + ' records' : typeof data }`);

        // Step 4: Context injection & final response
        console.log('\n🧠 [STEP 4] AI analyzing data and generating response...');

        const finalPrompt = `
PERTANYAAN ADMIN:
"${ userQuestion }"

DATA DARI DATABASE (${ routing.toolName }):
${ JSON.stringify(data, null, 2) }

INSTRUKSI:
Jawab pertanyaan admin menggunakan data di atas dengan gaya profesional dan to-the-point.
Gunakan format yang mudah dibaca (bullet points, numbering, dll).
Jika data kosong atau null, beritahu admin dengan sopan.
Berikan insight atau rekomendasi jika relevan.
`;

        const response = await gemini(finalPrompt);

        // Step 5: Display response
        console.log('\n' + '='.repeat(80));
        console.log('📤 FINAL RESPONSE:');
        console.log('='.repeat(80));
        console.log(response);
        console.log('='.repeat(80) + '\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
};

// =============================================================================
// CONTOH PERTANYAAN - Uncomment salah satu untuk test
// =============================================================================

// 1. Pertanyaan tentang tagihan
// await testAdminCommand("Siapa aja yang nunggak?");

// 2. Pertanyaan tentang keuangan
// await testAdminCommand("Berapa total pemasukan bulan ini?");

// 3. Pertanyaan tentang pemakaian air
await testAdminCommand("Berikan saya proyeksi data kedepan pada tahun 2026");

// 4. Pertanyaan tentang customer
// await testAdminCommand("Berapa jumlah customer yang punya hutang?");

// 5. Pertanyaan tentang keluhan
// await testAdminCommand("Keluhan apa yang paling sering muncul?");

// 6. Casual chat
// await testAdminCommand("Halo, apa kabar?");

// =============================================================================
// CUSTOM QUESTION - Ganti dengan pertanyaan Anda sendiri
// =============================================================================
// await testAdminCommand("pertanyaan Anda di sini");
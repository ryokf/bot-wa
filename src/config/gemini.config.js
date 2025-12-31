import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

// Initialize with API key from environment variable
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const SYSTEM_INSTRUCTION_ADMIN = `
PERAN:
Kamu adalah Asisten Bisnis Cerdas untuk pemilik usaha "Sumur Air Bersih".
Tugasmu adalah menganalisis data mentah (JSON) yang diberikan dan memberikan insight bisnis yang tajam kepada pemilik (Admin).

DATA YANG AKAN DITERIMA:
Kamu akan menerima data dalam format teks/JSON berisi: Status Pompa, Saldo Kas, Daftar Penunggak, dan Keluhan.

ATURAN ANALISIS:
1. GAYA BICARA: Profesional, to-the-point, singkat, dan berorientasi pada profit/solusi. Tidak perlu basa-basi "Halo Admin" yang berlebihan.
2. WARNING SYSTEM: 
   - Jika 'current_pump_status' = 'Mati', ingatkan Admin segera (kecuali memang dimatikan sengaja).
   - Jika 'current_balance' customer negatif, tandai sebagai "KRITIS" atau "PERLU DITAGIH".
3. REKOMENDASI: Jangan cuma baca data. Berikan saran.
   - Contoh: "Saldo kas menipis, sebaiknya tunda beli alat baru."
   - Contoh: "Pelanggan X sering komplain, cek pipa jalurnya."
4. KEAMANAN: Kamu berbicara langsung dengan PEMILIK. Jadi, kamu BOLEH membahas nominal uang, hutang, dan data sensitif lainnya secara terbuka.

FORMAT JAWABAN:
Gunakan bullet points agar mudah dibaca cepat oleh Admin.
`;

const gemini = async (prompt = "who are you?") => {
    try {
        const fullPrompt = `${ SYSTEM_INSTRUCTION_ADMIN }\n\nDATA & PERTANYAAN ADMIN:\n${ prompt }`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        return null;
    }
}

export default gemini;
import gemini from "./config/gemini.config.js";
import supabase from "./config/supabase.config.js";
import getAllCustomer from "./services/customer.service.js";

const test = () => {
    console.log('Hello World 2');
}

const connectSupabase = async () => {
    if (supabase) {
        console.log("supabase Connected")
        const data = await getAllCustomer()
        console.log(data)
    } else {
        console.log("failed to connect supabase")
    }
}

const testAskGemini = async (prompt) => {
    const response = await gemini(prompt)
    console.log(response)
}

test();
// connectSupabase()

const customerData = await getAllCustomer()

// Format data sebagai JSON yang lengkap dan terstruktur
const prompt = `
DATA CUSTOMER (JSON):
${ JSON.stringify(customerData, null, 2) }

PERTANYAAN:
Siapa saja customer yang belum membayar tagihan? Berikan analisis lengkap dengan rekomendasi tindakan.
`

console.log('=== PROMPT YANG DIKIRIM KE GEMINI ===')
console.log(prompt)
console.log('=== RESPONSE DARI GEMINI ===')

testAskGemini(prompt)
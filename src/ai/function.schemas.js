/**
 * FUNCTION SCHEMAS (WITH FORECASTING SUPPORT)
 * Simplified catalog - AI melakukan semua perhitungan dari data mentah
 * Mendukung analisis tren dan proyeksi masa depan
 */

export const FUNCTION_SCHEMAS = [
    // ===== TRANSACTIONS (Keuangan) =====
    {
        name: 'fetch_transactions',
        description: `Mengambil data transaksi keuangan MENTAH. 
        
Gunakan ini untuk SEMUA pertanyaan tentang keuangan:
- Total pemasukan/pengeluaran
- Bulan dengan pemasukan/pengeluaran tertinggi/terendah
- Rata-rata transaksi
- Trend keuangan dan analisis pola
- Kategori pengeluaran terbesar
- Profit/loss
- PREDIKSI/PROYEKSI pendapatan masa depan (ambil data historis 1-2 tahun untuk analisis tren)
- Ramalan keuangan tahun depan
- Dan pertanyaan analitis lainnya

AI HARUS menghitung sendiri dari data mentah (SUM, AVG, MAX, MIN, GROUP BY, dll).
Untuk prediksi masa depan, gunakan data historis sebagai bahan analisis tren.`,
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai format YYYY-MM-DD. Untuk prediksi, ambil 1-2 tahun historis.'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir format YYYY-MM-DD. Default: hari ini.'
                }
            },
            required: []
        }
    },

    // ===== METER READINGS (Pemakaian Air) =====
    {
        name: 'fetch_readings',
        description: `Mengambil data pencatatan meteran air MENTAH.

Gunakan ini untuk SEMUA pertanyaan tentang pemakaian air:
- Bulan dengan pemakaian tertinggi/terendah
- Customer yang paling boros/hemat
- Rata-rata pemakaian per bulan
- Trend pemakaian dan pola musiman
- Total pemakaian periode tertentu
- Perbandingan antar customer
- PROYEKSI/RAMALAN pemakaian masa depan (ambil data historis 1-2 tahun untuk analisis tren)
- Prediksi konsumsi air tahun depan
- Dan pertanyaan analitis lainnya

AI HARUS menghitung sendiri dari data mentah.
Untuk prediksi masa depan, gunakan data historis sebagai bahan analisis tren dan pola musiman.`,
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai format YYYY-MM-DD. Untuk prediksi, ambil 1-2 tahun historis.'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir format YYYY-MM-DD. Default: hari ini.'
                }
            },
            required: []
        }
    },

    // ===== INVOICES (Tagihan) =====
    {
        name: 'fetch_invoices',
        description: `Mengambil data tagihan MENTAH.

Gunakan ini untuk SEMUA pertanyaan tentang tagihan:
- Siapa yang nunggak/belum bayar
- Total tagihan unpaid/paid
- Tagihan overdue (lewat jatuh tempo)
- Rata-rata tagihan per customer
- Periode dengan tagihan tertinggi
- Trend pembayaran
- Dan pertanyaan analitis lainnya

AI HARUS menghitung sendiri dari data mentah.`,
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['Unpaid', 'Paid', 'Cancelled', null],
                    description: 'Filter by status. Null untuk semua status.'
                },
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai format YYYY-MM-DD (optional)'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir format YYYY-MM-DD (optional)'
                }
            },
            required: []
        }
    },

    // ===== CUSTOMERS (Pelanggan) =====
    {
        name: 'fetch_customers',
        description: `Mengambil data pelanggan MENTAH.

Gunakan ini untuk SEMUA pertanyaan tentang pelanggan:
- Jumlah customer aktif/inactive
- Customer dengan hutang terbanyak
- Customer dengan deposit terbesar
- Total hutang/deposit semua customer
- Statistik customer
- Dan pertanyaan analitis lainnya

AI HARUS menghitung sendiri dari data mentah.`,
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    // ===== COMPLAINTS (Keluhan) =====
    {
        name: 'fetch_complaints',
        description: `Mengambil data keluhan MENTAH.

Gunakan ini untuk SEMUA pertanyaan tentang keluhan:
- Jumlah keluhan open/resolved
- Tipe keluhan terbanyak
- Customer yang paling sering komplain
- Trend keluhan
- Dan pertanyaan analitis lainnya

AI HARUS menghitung sendiri dari data mentah.`,
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['Open', 'In Progress', 'Resolved', null],
                    description: 'Filter by status. Null untuk semua status.'
                }
            },
            required: []
        }
    },

    // ===== SYSTEM STATUS (Status Sistem) =====
    {
        name: 'get_system_status',
        description: `Mendapatkan status sistem (pompa air, saldo kas, pengaturan).

Gunakan ini ketika admin bertanya tentang:
- Status pompa (hidup/mati)
- Saldo kas
- Pengaturan sistem

Data ini sudah dihitung di backend (bukan raw data).`,
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    }
];

/**
 * Get schema by function name
 */
export const getSchemaByName = (functionName) => {
    return FUNCTION_SCHEMAS.find(schema => schema.name === functionName) || null;
};

/**
 * Get all function names
 */
export const getAllFunctionNames = () => {
    return FUNCTION_SCHEMAS.map(schema => schema.name);
};

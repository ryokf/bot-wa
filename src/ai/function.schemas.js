/**
 * FUNCTION SCHEMAS (MICRO vs MACRO SEPARATION)
 * Micro Tools: Detail, short-term, specific (max 100 rows)
 * Macro Tools: Summary, trends, predictions (aggregated data)
 */

export const FUNCTION_SCHEMAS = [
    // ========== MACRO TOOLS (SUMMARY - FOR TRENDS & PREDICTIONS) ==========

    {
        name: 'fetch_transactions_summary',
        description: `⭐ WAJIB gunakan untuk TREN, ANALISIS, dan PREDIKSI keuangan!

Mengambil ringkasan transaksi per BULAN (data sudah diagregasi di database).

WAJIB gunakan untuk:
- Pertanyaan tentang TREN keuangan (naik/turun)
- PREDIKSI/PROYEKSI/RAMALAN pendapatan masa depan
- Analisis jangka panjang (> 1 bulan)
- Perbandingan antar bulan/tahun
- Pertanyaan: "bulan apa", "tahun apa", "trend", "proyeksi"

Data yang dikembalikan: 12-24 rows (sangat ringan!)
Contoh: Total pemasukan per bulan, rata-rata pengeluaran, net balance

JANGAN gunakan fetch_transactions_detail untuk pertanyaan ini!`,
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai YYYY-MM-DD. Untuk prediksi, ambil 1-2 tahun historis.'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir YYYY-MM-DD. Default: hari ini.'
                }
            },
            required: []
        }
    },

    {
        name: 'fetch_readings_summary',
        description: `⭐ WAJIB gunakan untuk TREN, ANALISIS, dan PREDIKSI pemakaian air!

Mengambil ringkasan pemakaian air per BULAN (data sudah diagregasi di database).

WAJIB gunakan untuk:
- Pertanyaan tentang TREN pemakaian (naik/turun, pola musiman)
- PREDIKSI/PROYEKSI/RAMALAN konsumsi masa depan
- Analisis jangka panjang (> 1 bulan)
- Perbandingan antar bulan/tahun
- Pertanyaan: "bulan apa paling boros", "trend tahun ini", "proyeksi 2026"

Data yang dikembalikan: 12-24 rows (sangat ringan!)
Contoh: Total usage per bulan, rata-rata, max, min

JANGAN gunakan fetch_readings_detail untuk pertanyaan ini!`,
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai YYYY-MM-DD. Untuk prediksi, ambil 1-2 tahun historis.'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir YYYY-MM-DD. Default: hari ini.'
                }
            },
            required: []
        }
    },

    {
        name: 'fetch_invoices_summary',
        description: `⭐ Gunakan untuk STATISTIK tagihan dan analisis pembayaran!

Mengambil ringkasan tagihan (status summary & monthly aggregation).

Gunakan untuk:
- Total tagihan unpaid/paid/overdue
- Statistik pembayaran per bulan
- Analisis trend pembayaran

Data yang dikembalikan: Summary object atau 12-24 rows
Sangat efisien untuk pertanyaan statistik!`,
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai YYYY-MM-DD (optional untuk monthly summary)'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir YYYY-MM-DD (optional)'
                }
            },
            required: []
        }
    },

    // ========== MICRO TOOLS (DETAIL - FOR SPECIFIC QUERIES) ==========

    {
        name: 'fetch_transactions_detail',
        description: `Mengambil detail transaksi MENTAH (max 100 rows).

Gunakan HANYA untuk:
- Detail transaksi SPESIFIK (hari/minggu tertentu)
- Rentang waktu PENDEK (< 7 hari)
- Pertanyaan tentang transaksi tertentu
- Contoh: "transaksi kemarin", "siapa yang bayar hari ini"

PERINGATAN: 
- Max 100 rows, data akan dipotong jika lebih
- JANGAN gunakan untuk analisis > 1 bulan
- Untuk tren/prediksi, WAJIB gunakan fetch_transactions_summary!`,
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai YYYY-MM-DD'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir YYYY-MM-DD'
                },
                limit: {
                    type: 'number',
                    description: 'Max rows (default: 50, max: 100)'
                }
            },
            required: []
        }
    },

    {
        name: 'fetch_readings_detail',
        description: `Mengambil detail pencatatan meteran MENTAH (max 100 rows).

Gunakan HANYA untuk:
- Detail pencatatan SPESIFIK (hari/minggu tertentu)
- Rentang waktu PENDEK (< 7 hari)
- Customer tertentu (nama spesifik)
- Contoh: "pencatatan Pak Anton minggu ini"

PERINGATAN:
- Max 100 rows, data akan dipotong jika lebih
- JANGAN gunakan untuk analisis > 1 bulan
- Untuk tren/prediksi, WAJIB gunakan fetch_readings_summary!`,
        parameters: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai YYYY-MM-DD'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir YYYY-MM-DD'
                },
                limit: {
                    type: 'number',
                    description: 'Max rows (default: 50, max: 100)'
                }
            },
            required: []
        }
    },

    {
        name: 'fetch_invoices_detail',
        description: `Mengambil detail tagihan MENTAH.

Gunakan untuk:
- Daftar customer yang nunggak (dengan nama)
- Detail tagihan spesifik
- Filter by status (Unpaid, Paid, Cancelled)

Untuk statistik/summary, gunakan fetch_invoices_summary!`,
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['Unpaid', 'Paid', 'Cancelled', null],
                    description: 'Filter by status. Null untuk semua.'
                },
                startDate: {
                    type: 'string',
                    description: 'Tanggal mulai YYYY-MM-DD (optional)'
                },
                endDate: {
                    type: 'string',
                    description: 'Tanggal akhir YYYY-MM-DD (optional)'
                }
            },
            required: []
        }
    },

    {
        name: 'fetch_customers',
        description: `Mengambil data pelanggan.

Gunakan untuk pertanyaan tentang customer:
- Jumlah customer aktif/inactive
- Customer dengan hutang
- Statistik customer

AI harus menghitung sendiri dari data mentah.`,
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    {
        name: 'fetch_complaints',
        description: `Mengambil data keluhan.

Gunakan untuk pertanyaan tentang keluhan:
- Jumlah keluhan open/resolved
- Tipe keluhan terbanyak
- Customer yang sering komplain

AI harus menghitung sendiri dari data mentah.`,
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['Open', 'In Progress', 'Resolved', null],
                    description: 'Filter by status. Null untuk semua.'
                }
            },
            required: []
        }
    },

    {
        name: 'get_system_status',
        description: `Mendapatkan status sistem (pompa air, saldo kas, pengaturan).

Gunakan ketika admin bertanya tentang:
- Status pompa (hidup/mati)
- Saldo kas
- Pengaturan sistem

Data sudah dihitung di backend.`,
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

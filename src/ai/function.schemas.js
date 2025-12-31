/**
 * FUNCTION SCHEMAS
 * Daftar semua tools yang tersedia untuk AI dengan deskripsi lengkap
 * Format ini akan dikirim ke Gemini agar AI tahu tools apa yang bisa digunakan
 */

export const FUNCTION_SCHEMAS = [
    // ===== INVOICES =====
    {
        name: 'get_unpaid_invoices',
        description: 'Mendapatkan daftar tagihan yang belum dibayar. Gunakan ini ketika admin bertanya tentang tunggakan, hutang, tagihan yang belum lunas, atau siapa yang nunggak.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'get_overdue_invoices',
        description: 'Mendapatkan tagihan yang sudah lewat jatuh tempo. Gunakan ini ketika admin bertanya tentang tagihan yang terlambat atau overdue.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'get_invoice_summary',
        description: 'Mendapatkan ringkasan tagihan berdasarkan periode. Gunakan ini ketika admin bertanya tentang total tagihan, pendapatan, atau statistik tagihan.',
        parameters: {
            type: 'object',
            properties: {
                period: {
                    type: 'string',
                    description: 'Periode dalam format "Januari 2025". Kosongkan untuk all time.'
                }
            },
            required: []
        }
    },

    // ===== SYSTEM STATUS =====
    {
        name: 'get_system_status',
        description: 'Mendapatkan status pompa air dan saldo kas. Gunakan ini ketika admin bertanya tentang kondisi pompa, mesin, status sistem, atau uang kas.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'update_pump_status',
        description: 'Mengubah status pompa (Hidup/Mati/Maintenance). Gunakan ini ketika admin minta nyalakan, matikan, atau maintenance pompa.',
        parameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['Hidup', 'Mati', 'Maintenance'],
                    description: 'Status baru untuk pompa'
                }
            },
            required: ['status']
        }
    },

    // ===== COMPLAINTS =====
    {
        name: 'get_open_complaints',
        description: 'Mendapatkan daftar keluhan yang belum diselesaikan. Gunakan ini ketika admin bertanya tentang komplain, masalah pelanggan, atau keluhan yang pending.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'get_complaints_summary',
        description: 'Mendapatkan ringkasan keluhan berdasarkan status dan tipe. Gunakan ini untuk statistik atau overview keluhan.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    // ===== TRANSACTIONS =====
    {
        name: 'get_recent_transactions',
        description: 'Mendapatkan transaksi keuangan terbaru. Gunakan ini ketika admin bertanya tentang transaksi terakhir atau aktivitas keuangan.',
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Jumlah data yang diambil (default: 10)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_financial_summary',
        description: 'Mendapatkan ringkasan keuangan (pemasukan vs pengeluaran). Gunakan ini ketika admin bertanya tentang laporan keuangan, profit, atau cashflow.',
        parameters: {
            type: 'object',
            properties: {
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

    // ===== CUSTOMERS =====
    {
        name: 'get_customers_with_debt',
        description: 'Mendapatkan pelanggan yang memiliki hutang (saldo negatif). Gunakan ini ketika admin bertanya siapa yang punya hutang atau saldo minus.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'get_customer_summary',
        description: 'Mendapatkan ringkasan data pelanggan (total, aktif, hutang, dll). Gunakan ini untuk overview atau statistik pelanggan.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'get_active_customers',
        description: 'Mendapatkan daftar pelanggan yang masih aktif. Gunakan ini ketika admin bertanya tentang pelanggan aktif.',
        parameters: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    // ===== METER READINGS =====
    {
        name: 'get_recent_readings',
        description: 'Mendapatkan pencatatan meteran terbaru. Gunakan ini ketika admin bertanya tentang pencatatan terakhir atau pemakaian air.',
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Jumlah data yang diambil (default: 10)'
                }
            },
            required: []
        }
    },
    {
        name: 'get_readings_by_period',
        description: 'Mendapatkan pencatatan meteran berdasarkan bulan dan tahun. Gunakan ini untuk melihat pemakaian air periode tertentu.',
        parameters: {
            type: 'object',
            properties: {
                month: {
                    type: 'number',
                    description: 'Bulan (1-12)'
                },
                year: {
                    type: 'number',
                    description: 'Tahun (e.g., 2025)'
                }
            },
            required: ['month', 'year']
        }
    }
];

/**
 * Get schema by function name
 * @param {string} functionName - Name of the function
 * @returns {Object|null} Function schema or null if not found
 */
export const getSchemaByName = (functionName) => {
    return FUNCTION_SCHEMAS.find(schema => schema.name === functionName) || null;
};

/**
 * Get all function names
 * @returns {Array<string>} Array of function names
 */
export const getAllFunctionNames = () => {
    return FUNCTION_SCHEMAS.map(schema => schema.name);
};

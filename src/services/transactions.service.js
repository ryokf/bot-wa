import supabase from '../config/supabase.config.js';

/**
 * TRANSACTIONS SERVICE (MICRO TOOL - DETAIL)
 * Hanya fetch data mentah dengan HARD LIMIT
 * Untuk pertanyaan detail spesifik jangka pendek (< 7 hari)
 * 
 * PERINGATAN: Max 100 rows untuk menghindari token explosion
 */

/**
 * Fetch Transactions (Raw Data with Limit)
 * Mengambil data transaksi mentah dengan batasan
 * 
 * @param {string} startDate - Format: YYYY-MM-DD (optional)
 * @param {string} endDate - Format: YYYY-MM-DD (optional)
 * @param {number} limit - Max rows (default: 50, max: 100)
 * @returns {Promise<Object>} { data, limited, message }
 */
export const fetchTransactions = async (startDate = null, endDate = null, limit = 50) => {
    // Hard limit: never more than 100 rows
    const safeLimit = Math.min(limit, 100);

    let query = supabase
        .from('transactions')
        .select(`
            transaction_date,
            type,
            category,
            amount,
            description,
            customer:customers(name, phone)
        `)  // Only essential columns, no IDs or timestamps
        .order('transaction_date', { ascending: false })
        .limit(safeLimit);

    // Apply date filters if provided
    if (startDate) {
        query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
        query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
        data: data || [],
        limited: data?.length === safeLimit,
        message: data?.length === safeLimit ?
            'Data dipotong karena terlalu banyak. Gunakan rentang waktu lebih pendek atau gunakan summary tool untuk analisis tren.' : null
    };
};

/**
 * Fetch All Transactions (DEPRECATED - Use with caution)
 * @deprecated Use fetchTransactions with date range instead
 */
export const fetchAllTransactions = async () => {
    console.warn('[DEPRECATED] fetchAllTransactions: Use fetchTransactions with date range instead');
    return fetchTransactions(null, null, 100);
};

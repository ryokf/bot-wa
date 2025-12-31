import supabase from '../config/supabase.config.js';

/**
 * TRANSACTIONS SERVICE (REFACTORED)
 * Hanya fetch data mentah - AI yang akan menghitung
 */

/**
 * Fetch Transactions (Raw Data)
 * Mengambil data transaksi mentah berdasarkan rentang waktu
 * AI akan melakukan semua perhitungan (sum, avg, max, min, group by, dll)
 * 
 * @param {string} startDate - Format: YYYY-MM-DD (optional)
 * @param {string} endDate - Format: YYYY-MM-DD (optional)
 * @returns {Promise<Array>} Raw transaction data
 */
export const fetchTransactions = async (startDate = null, endDate = null) => {
    let query = supabase
        .from('transactions')
        .select(`
            id,
            type,
            category,
            amount,
            description,
            transaction_date,
            created_at,
            customer:customers(
                id,
                name,
                phone
            )
        `)
        .order('transaction_date', { ascending: false });

    // Apply date filters if provided
    if (startDate) {
        query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
        query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
};

/**
 * Fetch All Transactions
 * Mengambil SEMUA transaksi tanpa filter
 * Gunakan dengan hati-hati untuk dataset besar
 * 
 * @returns {Promise<Array>} All transaction data
 */
export const fetchAllTransactions = async () => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data || [];
};

import supabase from '../config/supabase.config.js';

/**
 * TRANSACTIONS SERVICE
 * Menyediakan fungsi-fungsi untuk mengakses data transaksi keuangan
 */

/**
 * Tool 12: Get Recent Transactions
 * Mendapatkan transaksi terbaru
 * @param {number} limit - Jumlah data yang diambil (default: 10)
 * @returns {Promise<Array>} Array of transactions
 */
export const getRecentTransactions = async (limit = 10) => {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            id,
            type,
            category,
            amount,
            description,
            transaction_date,
            customer:customers(name)
        `)
        .order('transaction_date', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
};

/**
 * Tool 13: Get Financial Summary
 * Mendapatkan ringkasan keuangan (pemasukan vs pengeluaran)
 * @param {string} startDate - Format: YYYY-MM-DD (optional)
 * @param {string} endDate - Format: YYYY-MM-DD (optional)
 * @returns {Promise<Object>} Financial summary
 */
export const getFinancialSummary = async (startDate = null, endDate = null) => {
    let query = supabase
        .from('transactions')
        .select('type, amount, category, transaction_date');

    if (startDate) {
        query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
        query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    const summary = {
        period: startDate && endDate ? `${ startDate } to ${ endDate }` : 'All Time',
        total_income: data.filter(t => t.type === 'IN').reduce((sum, t) => sum + Number(t.amount), 0),
        total_expense: data.filter(t => t.type === 'OUT').reduce((sum, t) => sum + Number(t.amount), 0),
        net_balance: 0,
        income_by_category: {},
        expense_by_category: {}
    };

    summary.net_balance = summary.total_income - summary.total_expense;

    // Group by category
    data.forEach(trans => {
        const category = trans.category || 'Uncategorized';
        if (trans.type === 'IN') {
            if (!summary.income_by_category[category]) {
                summary.income_by_category[category] = 0;
            }
            summary.income_by_category[category] += Number(trans.amount);
        } else {
            if (!summary.expense_by_category[category]) {
                summary.expense_by_category[category] = 0;
            }
            summary.expense_by_category[category] += Number(trans.amount);
        }
    });

    return summary;
};

/**
 * Tool 14: Get Transactions by Type
 * Mendapatkan transaksi berdasarkan tipe (IN/OUT)
 * @param {string} type - 'IN' | 'OUT'
 * @param {number} limit - Jumlah data yang diambil (default: 20)
 * @returns {Promise<Array>} Array of transactions
 */
export const getTransactionsByType = async (type, limit = 20) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', type)
        .order('transaction_date', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
};

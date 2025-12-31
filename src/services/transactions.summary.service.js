import supabase from '../config/supabase.config.js';

/**
 * TRANSACTIONS SUMMARY SERVICE (MACRO TOOL)
 * Menyediakan data transaksi yang sudah diagregasi per bulan
 * Untuk pertanyaan tentang tren, analisis, dan prediksi
 * 
 * Token Savings: ~99% (12 rows vs 1000+ rows)
 */

/**
 * Get Transactions Monthly Summary
 * Agregasi transaksi per bulan (database yang hitung, bukan AI)
 * 
 * @param {string} startDate - Format: YYYY-MM-DD
 * @param {string} endDate - Format: YYYY-MM-DD
 * @returns {Promise<Array>} Monthly summary data
 */
export const getTransactionsSummary = async (startDate = null, endDate = null) => {
    // Build query for monthly aggregation
    let query = supabase
        .from('transactions')
        .select('transaction_date, type, amount');

    // Apply date filters
    if (startDate) query = query.gte('transaction_date', startDate);
    if (endDate) query = query.lte('transaction_date', endDate);

    const { data, error } = await query;

    if (error) throw error;

    // Aggregate by month in JavaScript (since we can't use SQL functions directly)
    const monthlyData = {};

    data.forEach(transaction => {
        const date = new Date(transaction.transaction_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${ year }-${ String(month).padStart(2, '0') }`;

        if (!monthlyData[key]) {
            monthlyData[key] = {
                year,
                month,
                total_income: 0,
                total_expense: 0,
                net_balance: 0,
                transaction_count: 0
            };
        }

        if (transaction.type === 'IN') {
            monthlyData[key].total_income += Number(transaction.amount);
            monthlyData[key].net_balance += Number(transaction.amount);
        } else {
            monthlyData[key].total_expense += Number(transaction.amount);
            monthlyData[key].net_balance -= Number(transaction.amount);
        }

        monthlyData[key].transaction_count++;
    });

    // Convert to array and sort
    return Object.values(monthlyData).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });
};

/**
 * Get Transactions Yearly Summary
 * Agregasi transaksi per tahun
 * 
 * @param {number} startYear - Starting year
 * @param {number} endYear - Ending year
 * @returns {Promise<Array>} Yearly summary data
 */
export const getTransactionsYearlySummary = async (startYear, endYear) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('transaction_date, type, amount')
        .gte('transaction_date', `${ startYear }-01-01`)
        .lte('transaction_date', `${ endYear }-12-31`);

    if (error) throw error;

    // Aggregate by year
    const yearlyData = {};

    data.forEach(transaction => {
        const year = new Date(transaction.transaction_date).getFullYear();

        if (!yearlyData[year]) {
            yearlyData[year] = {
                year,
                total_income: 0,
                total_expense: 0,
                net_balance: 0,
                transaction_count: 0
            };
        }

        if (transaction.type === 'IN') {
            yearlyData[year].total_income += Number(transaction.amount);
            yearlyData[year].net_balance += Number(transaction.amount);
        } else {
            yearlyData[year].total_expense += Number(transaction.amount);
            yearlyData[year].net_balance -= Number(transaction.amount);
        }

        yearlyData[year].transaction_count++;
    });

    return Object.values(yearlyData).sort((a, b) => a.year - b.year);
};

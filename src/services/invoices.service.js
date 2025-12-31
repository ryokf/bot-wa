import supabase from '../config/supabase.config.js';

/**
 * INVOICES SERVICE (REFACTORED)
 * Hanya fetch data mentah - AI yang akan menghitung
 */

/**
 * Fetch Invoices (Raw Data)
 * Mengambil data tagihan mentah berdasarkan status dan rentang waktu
 * AI akan melakukan perhitungan: total unpaid, paid, overdue, dll
 * 
 * @param {string} status - 'Unpaid' | 'Paid' | 'Cancelled' | null (all)
 * @param {string} startDate - Format: YYYY-MM-DD (optional)
 * @param {string} endDate - Format: YYYY-MM-DD (optional)
 * @returns {Promise<Array>} Raw invoice data
 */
export const fetchInvoices = async (status = null, startDate = null, endDate = null) => {
    let query = supabase
        .from('invoices')
        .select(`
            id,
            invoice_number,
            period,
            amount,
            admin_fee,
            total_amount,
            status,
            due_date,
            created_at,
            customer:customers(
                id,
                name,
                phone,
                address,
                current_balance
            )
        `)
        .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
        query = query.eq('status', status);
    }

    // Apply date filters if provided
    if (startDate) {
        query = query.gte('created_at', startDate);
    }
    if (endDate) {
        query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
};

/**
 * Fetch All Invoices
 * Mengambil SEMUA tagihan tanpa filter
 * 
 * @returns {Promise<Array>} All invoice data
 */
export const fetchAllInvoices = async () => {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            customer:customers(name, phone, current_balance)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

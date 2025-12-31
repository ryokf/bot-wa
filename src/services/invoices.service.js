import supabase from '../config/supabase.config.js';

/**
 * INVOICES SERVICE
 * Menyediakan fungsi-fungsi untuk mengakses data tagihan
 */

/**
 * Tool 1: Get Unpaid Invoices
 * Mendapatkan daftar semua tagihan yang belum dibayar
 * @returns {Promise<Array>} Array of unpaid invoices with customer data
 */
export const getUnpaidInvoices = async () => {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            id,
            invoice_number,
            period,
            amount,
            admin_fee,
            total_amount,
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
        .eq('status', 'Unpaid')
        .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Tool 2: Get Paid Invoices
 * Mendapatkan daftar tagihan yang sudah dibayar
 * @param {number} limit - Jumlah data yang diambil (default: 10)
 * @returns {Promise<Array>} Array of paid invoices
 */
export const getPaidInvoices = async (limit = 10) => {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            id,
            invoice_number,
            period,
            total_amount,
            created_at,
            customer:customers(name, phone)
        `)
        .eq('status', 'Paid')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
};

/**
 * Tool 3: Get Invoice Summary by Period
 * Mendapatkan ringkasan tagihan berdasarkan periode (bulan & tahun)
 * @param {string} period - Format: "Januari 2025"
 * @returns {Promise<Object>} Summary object
 */
export const getInvoiceSummary = async (period) => {
    const { data, error } = await supabase
        .from('invoices')
        .select('status, total_amount, amount, admin_fee');

    if (error) throw error;

    // Filter by period if provided
    const filteredData = period
        ? data.filter(inv => inv.period === period)
        : data;

    const summary = {
        period: period || 'All Time',
        total_invoices: filteredData.length,
        total_unpaid: filteredData.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + Number(i.total_amount), 0),
        total_paid: filteredData.filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.total_amount), 0),
        count_unpaid: filteredData.filter(i => i.status === 'Unpaid').length,
        count_paid: filteredData.filter(i => i.status === 'Paid').length,
        total_water_revenue: filteredData.reduce((sum, i) => sum + Number(i.amount), 0),
        total_admin_fee: filteredData.reduce((sum, i) => sum + Number(i.admin_fee), 0)
    };

    return summary;
};

/**
 * Tool 4: Get Overdue Invoices
 * Mendapatkan tagihan yang sudah lewat jatuh tempo
 * @returns {Promise<Array>} Array of overdue invoices
 */
export const getOverdueInvoices = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('invoices')
        .select(`
            id,
            invoice_number,
            period,
            total_amount,
            due_date,
            customer:customers(name, phone, address, current_balance)
        `)
        .eq('status', 'Unpaid')
        .lt('due_date', today)
        .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Tool 5: Get Customer Invoices
 * Mendapatkan semua tagihan dari customer tertentu
 * @param {string} customerId - UUID customer
 * @returns {Promise<Array>} Array of customer invoices
 */
export const getCustomerInvoices = async (customerId) => {
    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

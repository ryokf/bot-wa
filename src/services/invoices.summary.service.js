import supabase from '../config/supabase.config.js';

/**
 * INVOICES SUMMARY SERVICE (MACRO TOOL)
 * Menyediakan data tagihan yang sudah diagregasi
 * Untuk pertanyaan tentang statistik tagihan
 * 
 * Token Savings: ~95% (summary vs all invoices)
 */

/**
 * Get Invoices Summary by Status
 * Agregasi tagihan berdasarkan status
 * 
 * @returns {Promise<Object>} Status summary
 */
export const getInvoicesSummary = async () => {
    const { data, error } = await supabase
        .from('invoices')
        .select('status, total_amount, due_date');

    if (error) throw error;

    const summary = {
        total_invoices: data.length,
        unpaid: {
            count: 0,
            total_amount: 0
        },
        paid: {
            count: 0,
            total_amount: 0
        },
        overdue: {
            count: 0,
            total_amount: 0
        },
        cancelled: {
            count: 0,
            total_amount: 0
        }
    };

    const today = new Date().toISOString().split('T')[0];

    data.forEach(invoice => {
        const amount = Number(invoice.total_amount);
        const status = invoice.status.toLowerCase();

        // Count by status
        if (status === 'unpaid') {
            summary.unpaid.count++;
            summary.unpaid.total_amount += amount;

            // Check if overdue
            if (invoice.due_date < today) {
                summary.overdue.count++;
                summary.overdue.total_amount += amount;
            }
        } else if (status === 'paid') {
            summary.paid.count++;
            summary.paid.total_amount += amount;
        } else if (status === 'cancelled') {
            summary.cancelled.count++;
            summary.cancelled.total_amount += amount;
        }
    });

    return summary;
};

/**
 * Get Invoices Monthly Summary
 * Agregasi tagihan per bulan
 * 
 * @param {string} startDate - Format: YYYY-MM-DD
 * @param {string} endDate - Format: YYYY-MM-DD
 * @returns {Promise<Array>} Monthly summary
 */
export const getInvoicesMonthlySummary = async (startDate = null, endDate = null) => {
    let query = supabase
        .from('invoices')
        .select('created_at, status, total_amount');

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data, error } = await query;

    if (error) throw error;

    // Aggregate by month
    const monthlyData = {};

    data.forEach(invoice => {
        const date = new Date(invoice.created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${ year }-${ String(month).padStart(2, '0') }`;

        if (!monthlyData[key]) {
            monthlyData[key] = {
                year,
                month,
                total_invoices: 0,
                total_amount: 0,
                paid_count: 0,
                paid_amount: 0,
                unpaid_count: 0,
                unpaid_amount: 0
            };
        }

        const amount = Number(invoice.total_amount);
        monthlyData[key].total_invoices++;
        monthlyData[key].total_amount += amount;

        if (invoice.status.toLowerCase() === 'paid') {
            monthlyData[key].paid_count++;
            monthlyData[key].paid_amount += amount;
        } else if (invoice.status.toLowerCase() === 'unpaid') {
            monthlyData[key].unpaid_count++;
            monthlyData[key].unpaid_amount += amount;
        }
    });

    return Object.values(monthlyData).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });
};

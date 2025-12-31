import supabase from '../config/supabase.config.js';

/**
 * METER READINGS SERVICE
 * Menyediakan fungsi-fungsi untuk mengakses data pencatatan meteran
 */

/**
 * Tool 15: Get Recent Meter Readings
 * Mendapatkan pencatatan meteran terbaru
 * @param {number} limit - Jumlah data yang diambil (default: 10)
 * @returns {Promise<Array>} Array of meter readings
 */
export const getRecentReadings = async (limit = 10) => {
    const { data, error } = await supabase
        .from('meter_readings')
        .select(`
            id,
            period_month,
            period_year,
            reading_date,
            previous_value,
            current_value,
            usage_amount,
            notes,
            customer:customers(name, phone, meter_number)
        `)
        .order('reading_date', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
};

/**
 * Tool 16: Get Readings by Period
 * Mendapatkan pencatatan meteran berdasarkan periode
 * @param {number} month - Bulan (1-12)
 * @param {number} year - Tahun (e.g., 2025)
 * @returns {Promise<Array>} Array of meter readings
 */
export const getReadingsByPeriod = async (month, year) => {
    const { data, error } = await supabase
        .from('meter_readings')
        .select(`
            *,
            customer:customers(name, phone, address, meter_number)
        `)
        .eq('period_month', month)
        .eq('period_year', year)
        .order('reading_date', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Tool 17: Get Customer Readings
 * Mendapatkan riwayat pencatatan meteran customer tertentu
 * @param {string} customerId - UUID customer
 * @param {number} limit - Jumlah data yang diambil (default: 12)
 * @returns {Promise<Array>} Array of customer readings
 */
export const getCustomerReadings = async (customerId, limit = 12) => {
    const { data, error } = await supabase
        .from('meter_readings')
        .select('*')
        .eq('customer_id', customerId)
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
};

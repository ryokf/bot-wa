import supabase from '../config/supabase.config.js';

/**
 * METER READINGS SERVICE (MICRO TOOL - DETAIL)
 * Hanya fetch data mentah dengan HARD LIMIT
 * Untuk pertanyaan detail spesifik jangka pendek
 * 
 * PERINGATAN: Max 100 rows untuk menghindari token explosion
 */

/**
 * Fetch Readings (Raw Data with Limit)
 * Mengambil data pencatatan meteran mentah dengan batasan
 * 
 * @param {string} startDate - Format: YYYY-MM-DD (optional)
 * @param {string} endDate - Format: YYYY-MM-DD (optional)
 * @param {number} limit - Max rows (default: 50, max: 100)
 * @returns {Promise<Object>} { data, limited, message }
 */
export const fetchReadings = async (startDate = null, endDate = null, limit = 50) => {
    // Hard limit: never more than 100 rows
    const safeLimit = Math.min(limit, 100);

    let query = supabase
        .from('meter_readings')
        .select(`
            period_month,
            period_year,
            reading_date,
            usage_amount,
            customer:customers(name, phone, meter_number)
        `)  // Only essential columns
        .order('reading_date', { ascending: false })
        .limit(safeLimit);

    // Apply date filters if provided
    if (startDate) {
        query = query.gte('reading_date', startDate);
    }
    if (endDate) {
        query = query.lte('reading_date', endDate);
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
 * Fetch Readings by Customer
 * Mengambil riwayat pencatatan meteran untuk customer tertentu
 * 
 * @param {string} customerId - UUID customer
 * @param {number} limit - Jumlah data (default: 12, max: 50)
 * @returns {Promise<Array>} Customer reading history
 */
export const fetchReadingsByCustomer = async (customerId, limit = 12) => {
    const safeLimit = Math.min(limit, 50);

    const { data, error } = await supabase
        .from('meter_readings')
        .select('period_month, period_year, usage_amount, reading_date')
        .eq('customer_id', customerId)
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false })
        .limit(safeLimit);

    if (error) throw error;
    return data || [];
};

/**
 * Fetch All Readings (DEPRECATED - Use with caution)
 * @deprecated Use fetchReadings with date range instead
 */
export const fetchAllReadings = async () => {
    console.warn('[DEPRECATED] fetchAllReadings: Use fetchReadings with date range instead');
    return fetchReadings(null, null, 100);
};

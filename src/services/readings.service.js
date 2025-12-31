import supabase from '../config/supabase.config.js';

/**
 * METER READINGS SERVICE (REFACTORED)
 * Hanya fetch data mentah - AI yang akan menghitung
 */

/**
 * Fetch Readings (Raw Data)
 * Mengambil data pencatatan meteran mentah berdasarkan rentang waktu
 * AI akan melakukan analisis: usage tertinggi, terendah, rata-rata, trend, dll
 * 
 * @param {string} startDate - Format: YYYY-MM-DD (optional)
 * @param {string} endDate - Format: YYYY-MM-DD (optional)
 * @returns {Promise<Array>} Raw meter reading data
 */
export const fetchReadings = async (startDate = null, endDate = null) => {
    let query = supabase
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
            created_at,
            customer:customers(
                id,
                name,
                phone,
                address,
                meter_number
            )
        `)
        .order('reading_date', { ascending: false });

    // Apply date filters if provided
    if (startDate) {
        query = query.gte('reading_date', startDate);
    }
    if (endDate) {
        query = query.lte('reading_date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
};

/**
 * Fetch Readings by Customer
 * Mengambil riwayat pencatatan meteran untuk customer tertentu
 * 
 * @param {string} customerId - UUID customer
 * @param {number} limit - Jumlah data (optional, default: all)
 * @returns {Promise<Array>} Customer reading history
 */
export const fetchReadingsByCustomer = async (customerId, limit = null) => {
    let query = supabase
        .from('meter_readings')
        .select('*')
        .eq('customer_id', customerId)
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
};

/**
 * Fetch All Readings
 * Mengambil SEMUA pencatatan meteran
 * 
 * @returns {Promise<Array>} All reading data
 */
export const fetchAllReadings = async () => {
    const { data, error } = await supabase
        .from('meter_readings')
        .select(`
            *,
            customer:customers(name, phone, meter_number)
        `)
        .order('reading_date', { ascending: false });

    if (error) throw error;
    return data || [];
};

import supabase from '../config/supabase.config.js';

/**
 * COMPLAINTS SERVICE (REFACTORED)
 * Hanya fetch data mentah - AI yang akan menghitung
 */

/**
 * Fetch Complaints (Raw Data)
 * Mengambil data keluhan berdasarkan status
 * AI akan melakukan analisis: count by status, by type, trend, dll
 * 
 * @param {string} status - 'Open' | 'In Progress' | 'Resolved' | null (all)
 * @returns {Promise<Array>} Raw complaint data
 */
export const fetchComplaints = async (status = null) => {
    let query = supabase
        .from('complaints')
        .select(`
            id,
            type,
            description,
            status,
            reported_at,
            resolved_at,
            technician_notes,
            customer:customers(
                id,
                name,
                phone,
                address
            )
        `)
        .order('reported_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
};

/**
 * Fetch All Complaints
 * Mengambil SEMUA keluhan
 * 
 * @returns {Promise<Array>} All complaint data
 */
export const fetchAllComplaints = async () => {
    const { data, error } = await supabase
        .from('complaints')
        .select(`
            *,
            customer:customers(name, phone, address)
        `)
        .order('reported_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

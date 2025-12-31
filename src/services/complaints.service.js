import supabase from '../config/supabase.config.js';

/**
 * COMPLAINTS SERVICE
 * Menyediakan fungsi-fungsi untuk mengakses data keluhan pelanggan
 */

/**
 * Tool 9: Get Open Complaints
 * Mendapatkan daftar keluhan yang belum diselesaikan
 * @returns {Promise<Array>} Array of open complaints
 */
export const getOpenComplaints = async () => {
    const { data, error } = await supabase
        .from('complaints')
        .select(`
            id,
            type,
            description,
            status,
            reported_at,
            technician_notes,
            customer:customers(
                id,
                name,
                phone,
                address
            )
        `)
        .in('status', ['Open', 'In Progress'])
        .order('reported_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

/**
 * Tool 10: Get All Complaints
 * Mendapatkan semua keluhan (termasuk yang sudah resolved)
 * @param {number} limit - Jumlah data yang diambil (default: 20)
 * @returns {Promise<Array>} Array of complaints
 */
export const getAllComplaints = async (limit = 20) => {
    const { data, error } = await supabase
        .from('complaints')
        .select(`
            id,
            type,
            description,
            status,
            reported_at,
            resolved_at,
            customer:customers(name, phone)
        `)
        .order('reported_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
};

/**
 * Tool 11: Get Complaints Summary
 * Mendapatkan ringkasan keluhan berdasarkan status
 * @returns {Promise<Object>} Summary object
 */
export const getComplaintsSummary = async () => {
    const { data, error } = await supabase
        .from('complaints')
        .select('status, type');

    if (error) throw error;

    const summary = {
        total: data.length,
        open: data.filter(c => c.status === 'Open').length,
        in_progress: data.filter(c => c.status === 'In Progress').length,
        resolved: data.filter(c => c.status === 'Resolved').length,
        by_type: {}
    };

    // Group by type
    data.forEach(complaint => {
        if (!summary.by_type[complaint.type]) {
            summary.by_type[complaint.type] = 0;
        }
        summary.by_type[complaint.type]++;
    });

    return summary;
};

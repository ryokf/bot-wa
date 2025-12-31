import supabase from "../config/supabase.config.js";

/**
 * CUSTOMER SERVICE (REFACTORED)
 * Hanya fetch data mentah - AI yang akan menghitung
 */

/**
 * Fetch All Customers (Raw Data)
 * Mengambil semua data pelanggan
 * AI akan melakukan analisis: total debt, credit, active/inactive count, dll
 * 
 * @returns {Promise<Array>} All customer data
 */
export const fetchAllCustomers = async () => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
    return data || [];
};

/**
 * Fetch Customers by Status
 * Mengambil pelanggan berdasarkan status
 * 
 * @param {string} status - 'active' | 'inactive' | 'suspended'
 * @returns {Promise<Array>} Filtered customer data
 */
export const fetchCustomersByStatus = async (status) => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('status', status)
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Fetch Customer by Phone
 * Mencari pelanggan berdasarkan nomor telepon
 * 
 * @param {string} phone - Nomor telepon
 * @returns {Promise<Object|null>} Customer object or null
 */
export const fetchCustomerByPhone = async (phone) => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
    }
    return data;
};

// Export default for backward compatibility
export default fetchAllCustomers;
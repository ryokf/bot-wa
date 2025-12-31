import supabase from "../config/supabase.config.js";

/**
 * CUSTOMER SERVICE
 * Menyediakan fungsi-fungsi untuk mengakses data pelanggan
 */

/**
 * Tool 18: Get All Customers
 * Mendapatkan daftar semua pelanggan
 * @returns {Promise<Array>} Array of all customers
 */
const getAllCustomer = async () => {
    const { data, error } = await supabase.from('customers').select('*')
    if (error) {
        console.log(error)
    }
    return data
}

/**
 * Tool 19: Get Customers with Negative Balance
 * Mendapatkan pelanggan yang memiliki hutang (saldo negatif)
 * @returns {Promise<Array>} Array of customers with debt
 */
export const getCustomersWithDebt = async () => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .lt('current_balance', 0)
        .order('current_balance', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Tool 20: Get Active Customers
 * Mendapatkan pelanggan yang masih aktif
 * @returns {Promise<Array>} Array of active customers
 */
export const getActiveCustomers = async () => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
};

/**
 * Tool 21: Get Customer by Phone
 * Mencari pelanggan berdasarkan nomor telepon
 * @param {string} phone - Nomor telepon
 * @returns {Promise<Object|null>} Customer object or null
 */
export const getCustomerByPhone = async (phone) => {
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

/**
 * Tool 22: Get Customer Summary
 * Mendapatkan ringkasan data pelanggan
 * @returns {Promise<Object>} Customer summary
 */
export const getCustomerSummary = async () => {
    const { data, error } = await supabase
        .from('customers')
        .select('status, current_balance');

    if (error) throw error;

    const summary = {
        total_customers: data.length,
        active: data.filter(c => c.status === 'active').length,
        inactive: data.filter(c => c.status === 'inactive').length,
        suspended: data.filter(c => c.status === 'suspended').length,
        with_debt: data.filter(c => Number(c.current_balance) < 0).length,
        total_debt: data
            .filter(c => Number(c.current_balance) < 0)
            .reduce((sum, c) => sum + Math.abs(Number(c.current_balance)), 0),
        with_credit: data.filter(c => Number(c.current_balance) > 0).length,
        total_credit: data
            .filter(c => Number(c.current_balance) > 0)
            .reduce((sum, c) => sum + Number(c.current_balance), 0)
    };

    return summary;
};

export default getAllCustomer
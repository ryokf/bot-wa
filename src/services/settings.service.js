import supabase from '../config/supabase.config.js';

/**
 * SETTINGS SERVICE
 * Menyediakan fungsi-fungsi untuk mengakses pengaturan sistem & status pompa
 */

/**
 * Tool 6: Get System Status
 * Mendapatkan status pompa dan saldo kas
 * @returns {Promise<Object>} System status object
 */
export const getSystemStatus = async () => {
    // Get app settings (including pump status)
    const { data: settings, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .single();

    if (settingsError) throw settingsError;

    // Calculate cash balance from transactions
    const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('type, amount');

    if (transError) throw transError;

    const cashBalance = (transactions || []).reduce((sum, t) => {
        return t.type === 'IN' ? sum + Number(t.amount) : sum - Number(t.amount);
    }, 0);

    return {
        company_name: settings.company_name,
        pump_status: settings.current_pump_status,
        admin_fee: settings.admin_fee,
        cash_balance: cashBalance,
        notification_enabled: settings.is_notification_enabled
    };
};

/**
 * Tool 7: Update Pump Status
 * Mengubah status pompa (Hidup/Mati/Maintenance)
 * @param {string} newStatus - 'Hidup' | 'Mati' | 'Maintenance'
 * @returns {Promise<Object>} Updated settings
 */
export const updatePumpStatus = async (newStatus) => {
    const validStatuses = ['Hidup', 'Mati', 'Maintenance'];

    if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status. Must be one of: ${ validStatuses.join(', ') }`);
    }

    const { data, error } = await supabase
        .from('app_settings')
        .update({ current_pump_status: newStatus })
        .eq('id', 1)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Tool 8: Get Pricing Tiers
 * Mendapatkan daftar aturan tarif air
 * @returns {Promise<Array>} Array of pricing tiers
 */
export const getPricingTiers = async () => {
    const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('min_usage', { ascending: true });

    if (error) throw error;
    return data || [];
};

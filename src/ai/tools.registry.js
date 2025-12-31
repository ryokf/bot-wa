/**
 * TOOLS REGISTRY (MICRO vs MACRO)
 * Maps function names to actual service implementations
 * Updated to include summary (macro) tools
 */

// Import MACRO tools (Summary Services)
import { getTransactionsSummary } from '../services/transactions.summary.service.js';
import { getReadingsSummary } from '../services/readings.summary.service.js';
import { getInvoicesSummary, getInvoicesMonthlySummary } from '../services/invoices.summary.service.js';

// Import MICRO tools (Detail Services)
import { fetchTransactions } from '../services/transactions.service.js';
import { fetchReadings, fetchReadingsByCustomer } from '../services/readings.service.js';
import { fetchInvoices } from '../services/invoices.service.js';
import { fetchAllCustomers, fetchCustomersByStatus, fetchCustomerByPhone } from '../services/customer.service.js';
import { fetchComplaints } from '../services/complaints.service.js';
import { getSystemStatus, updatePumpStatus } from '../services/settings.service.js';

/**
 * TOOLS REGISTRY
 * Key: Function name (as defined in schemas)
 * Value: Actual function implementation
 */
export const TOOLS_REGISTRY = {
    // ========== MACRO TOOLS (SUMMARY) ==========
    'fetch_transactions_summary': getTransactionsSummary,
    'fetch_readings_summary': getReadingsSummary,
    'fetch_invoices_summary': async (params) => {
        // If date params provided, use monthly summary
        if (params?.startDate || params?.endDate) {
            return getInvoicesMonthlySummary(params.startDate, params.endDate);
        }
        // Otherwise use status summary
        return getInvoicesSummary();
    },

    // ========== MICRO TOOLS (DETAIL) ==========
    'fetch_transactions_detail': fetchTransactions,
    'fetch_readings_detail': fetchReadings,
    'fetch_invoices_detail': fetchInvoices,

    // ========== OTHER TOOLS ==========
    'fetch_customers': fetchAllCustomers,
    'fetch_complaints': fetchComplaints,
    'get_system_status': getSystemStatus,
    'update_pump_status': updatePumpStatus
};

/**
 * Get tool function by name
 * @param {string} toolName - Name of the tool
 * @returns {Function|null} Tool function or null if not found
 */
export const getToolByName = (toolName) => {
    return TOOLS_REGISTRY[toolName] || null;
};

/**
 * Check if tool exists
 * @param {string} toolName - Name of the tool
 * @returns {boolean} True if tool exists
 */
export const toolExists = (toolName) => {
    return toolName in TOOLS_REGISTRY;
};

/**
 * Get all registered tool names
 * @returns {Array<string>} List of tool names
 */
export const getAllToolNames = () => {
    return Object.keys(TOOLS_REGISTRY);
};

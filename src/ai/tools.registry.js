/**
 * TOOLS REGISTRY (REFACTORED)
 * Simplified mapping - hanya 6 main tools + system status
 */

import * as invoicesService from '../services/invoices.service.js';
import * as settingsService from '../services/settings.service.js';
import * as complaintsService from '../services/complaints.service.js';
import * as transactionsService from '../services/transactions.service.js';
import * as readingsService from '../services/readings.service.js';
import * as customerService from '../services/customer.service.js';

/**
 * Tool Registry Map (Simplified)
 * Dari 22 tools → 7 tools
 */
export const TOOL_REGISTRY = {
    // Main data fetchers (raw data)
    'fetch_transactions': transactionsService.fetchTransactions,
    'fetch_readings': readingsService.fetchReadings,
    'fetch_invoices': invoicesService.fetchInvoices,
    'fetch_customers': customerService.fetchAllCustomers,
    'fetch_complaints': complaintsService.fetchComplaints,

    // System status (computed data - OK to keep)
    'get_system_status': settingsService.getSystemStatus,
    'update_pump_status': settingsService.updatePumpStatus,
};

/**
 * Check if tool exists
 */
export const toolExists = (toolName) => {
    return toolName in TOOL_REGISTRY;
};

/**
 * Get tool function
 */
export const getTool = (toolName) => {
    return TOOL_REGISTRY[toolName] || null;
};

/**
 * Get all available tool names
 */
export const getAllToolNames = () => {
    return Object.keys(TOOL_REGISTRY);
};

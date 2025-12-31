/**
 * TOOLS REGISTRY
 * Mapping antara nama fungsi dengan implementasi aktual
 * Ini adalah "peta" yang menghubungkan AI routing dengan database functions
 */

import * as invoicesService from '../services/invoices.service.js';
import * as settingsService from '../services/settings.service.js';
import * as complaintsService from '../services/complaints.service.js';
import * as transactionsService from '../services/transactions.service.js';
import * as readingsService from '../services/readings.service.js';
import * as customerService from '../services/customer.service.js';

/**
 * Tool Registry Map
 * Key: function name (yang dipilih AI)
 * Value: actual function implementation
 */
export const TOOL_REGISTRY = {
    // Invoices
    'get_unpaid_invoices': invoicesService.getUnpaidInvoices,
    'get_paid_invoices': invoicesService.getPaidInvoices,
    'get_invoice_summary': invoicesService.getInvoiceSummary,
    'get_overdue_invoices': invoicesService.getOverdueInvoices,
    'get_customer_invoices': invoicesService.getCustomerInvoices,

    // Settings
    'get_system_status': settingsService.getSystemStatus,
    'update_pump_status': settingsService.updatePumpStatus,
    'get_pricing_tiers': settingsService.getPricingTiers,

    // Complaints
    'get_open_complaints': complaintsService.getOpenComplaints,
    'get_all_complaints': complaintsService.getAllComplaints,
    'get_complaints_summary': complaintsService.getComplaintsSummary,

    // Transactions
    'get_recent_transactions': transactionsService.getRecentTransactions,
    'get_financial_summary': transactionsService.getFinancialSummary,
    'get_transactions_by_type': transactionsService.getTransactionsByType,

    // Meter Readings
    'get_recent_readings': readingsService.getRecentReadings,
    'get_readings_by_period': readingsService.getReadingsByPeriod,
    'get_customer_readings': readingsService.getCustomerReadings,

    // Customers
    'get_all_customers': customerService.default,
    'get_customers_with_debt': customerService.getCustomersWithDebt,
    'get_active_customers': customerService.getActiveCustomers,
    'get_customer_by_phone': customerService.getCustomerByPhone,
    'get_customer_summary': customerService.getCustomerSummary
};

/**
 * Check if tool exists
 * @param {string} toolName - Name of the tool
 * @returns {boolean} True if tool exists
 */
export const toolExists = (toolName) => {
    return toolName in TOOL_REGISTRY;
};

/**
 * Get tool function
 * @param {string} toolName - Name of the tool
 * @returns {Function|null} Tool function or null
 */
export const getTool = (toolName) => {
    return TOOL_REGISTRY[toolName] || null;
};

/**
 * Get all available tool names
 * @returns {Array<string>} Array of tool names
 */
export const getAllToolNames = () => {
    return Object.keys(TOOL_REGISTRY);
};

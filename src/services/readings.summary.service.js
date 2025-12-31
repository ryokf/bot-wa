import supabase from '../config/supabase.config.js';

/**
 * READINGS SUMMARY SERVICE (MACRO TOOL)
 * Menyediakan data pemakaian air yang sudah diagregasi per bulan
 * Untuk pertanyaan tentang tren, analisis, dan prediksi
 * 
 * Token Savings: ~99% (12 rows vs 1000+ rows)
 */

/**
 * Get Readings Monthly Summary
 * Agregasi pemakaian air per bulan (database yang hitung, bukan AI)
 * 
 * @param {string} startDate - Format: YYYY-MM-DD
 * @param {string} endDate - Format: YYYY-MM-DD
 * @returns {Promise<Array>} Monthly summary data
 */
export const getReadingsSummary = async (startDate = null, endDate = null) => {
    // Build query for monthly aggregation
    let query = supabase
        .from('meter_readings')
        .select('period_year, period_month, usage_amount, customer_id');

    // Apply date filters
    if (startDate) query = query.gte('reading_date', startDate);
    if (endDate) query = query.lte('reading_date', endDate);

    const { data, error } = await query;

    if (error) throw error;

    // Aggregate by month
    const monthlyData = {};

    data.forEach(reading => {
        const key = `${ reading.period_year }-${ String(reading.period_month).padStart(2, '0') }`;

        if (!monthlyData[key]) {
            monthlyData[key] = {
                year: reading.period_year,
                month: reading.period_month,
                total_usage: 0,
                max_usage: 0,
                min_usage: Infinity,
                readings_count: 0,
                unique_customers: new Set()
            };
        }

        const usage = Number(reading.usage_amount);
        monthlyData[key].total_usage += usage;
        monthlyData[key].max_usage = Math.max(monthlyData[key].max_usage, usage);
        monthlyData[key].min_usage = Math.min(monthlyData[key].min_usage, usage);
        monthlyData[key].readings_count++;
        monthlyData[key].unique_customers.add(reading.customer_id);
    });

    // Convert to array and calculate averages
    return Object.values(monthlyData).map(item => ({
        year: item.year,
        month: item.month,
        total_usage: item.total_usage,
        avg_usage: item.total_usage / item.readings_count,
        max_usage: item.max_usage,
        min_usage: item.min_usage === Infinity ? 0 : item.min_usage,
        customer_count: item.unique_customers.size,
        readings_count: item.readings_count
    })).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });
};

/**
 * Get Readings Yearly Summary
 * Agregasi pemakaian air per tahun
 * 
 * @param {number} startYear - Starting year
 * @param {number} endYear - Ending year
 * @returns {Promise<Array>} Yearly summary data
 */
export const getReadingsYearlySummary = async (startYear, endYear) => {
    const { data, error } = await supabase
        .from('meter_readings')
        .select('period_year, usage_amount, customer_id')
        .gte('period_year', startYear)
        .lte('period_year', endYear);

    if (error) throw error;

    // Aggregate by year
    const yearlyData = {};

    data.forEach(reading => {
        const year = reading.period_year;

        if (!yearlyData[year]) {
            yearlyData[year] = {
                year,
                total_usage: 0,
                max_usage: 0,
                min_usage: Infinity,
                readings_count: 0,
                unique_customers: new Set()
            };
        }

        const usage = Number(reading.usage_amount);
        yearlyData[year].total_usage += usage;
        yearlyData[year].max_usage = Math.max(yearlyData[year].max_usage, usage);
        yearlyData[year].min_usage = Math.min(yearlyData[year].min_usage, usage);
        yearlyData[year].readings_count++;
        yearlyData[year].unique_customers.add(reading.customer_id);
    });

    return Object.values(yearlyData).map(item => ({
        year: item.year,
        total_usage: item.total_usage,
        avg_usage: item.total_usage / item.readings_count,
        max_usage: item.max_usage,
        min_usage: item.min_usage === Infinity ? 0 : item.min_usage,
        customer_count: item.unique_customers.size,
        readings_count: item.readings_count
    })).sort((a, b) => a.year - b.year);
};

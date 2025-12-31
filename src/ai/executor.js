import { TOOL_REGISTRY, toolExists, getTool } from './tools.registry.js';

/**
 * FUNCTION EXECUTOR
 * Menjalankan fungsi yang dipilih oleh AI Router
 * Handles parameter passing dan error handling
 */

/**
 * Execute a tool function
 * @param {string} toolName - Name of the tool to execute
 * @param {Object} params - Parameters for the tool (default: {})
 * @returns {Promise<any>} Result from the tool execution
 */
export const executeFunction = async (toolName, params = {}) => {
    // Validate tool exists
    if (!toolExists(toolName)) {
        throw new Error(`Tool "${ toolName }" not found in registry. Available tools: ${ Object.keys(TOOL_REGISTRY).join(', ') }`);
    }

    // Get the tool function
    const toolFunction = getTool(toolName);

    try {
        // Execute the function with parameters
        // Handle both single parameter and multiple parameters
        const paramValues = Object.values(params);

        let result;
        if (paramValues.length === 0) {
            // No parameters
            result = await toolFunction();
        } else if (paramValues.length === 1) {
            // Single parameter
            result = await toolFunction(paramValues[0]);
        } else {
            // Multiple parameters - spread them
            result = await toolFunction(...paramValues);
        }

        return result;
    } catch (error) {
        console.error(`Error executing tool "${ toolName }":`, error);
        throw new Error(`Failed to execute ${ toolName }: ${ error.message }`);
    }
};

/**
 * Execute multiple tools in sequence
 * @param {Array<Object>} toolCalls - Array of { toolName, params }
 * @returns {Promise<Array>} Array of results
 */
export const executeMultipleTools = async (toolCalls) => {
    const results = [];

    for (const call of toolCalls) {
        try {
            const result = await executeFunction(call.toolName, call.params);
            results.push({
                toolName: call.toolName,
                success: true,
                data: result
            });
        } catch (error) {
            results.push({
                toolName: call.toolName,
                success: false,
                error: error.message
            });
        }
    }

    return results;
};

/**
 * Safe execute - returns null on error instead of throwing
 * @param {string} toolName - Name of the tool
 * @param {Object} params - Parameters
 * @returns {Promise<any|null>} Result or null on error
 */
export const safeExecute = async (toolName, params = {}) => {
    try {
        return await executeFunction(toolName, params);
    } catch (error) {
        console.error(`Safe execute failed for ${ toolName }:`, error);
        return null;
    }
};

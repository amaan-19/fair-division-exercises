/**
 * Factory Functions and Global Utilities
 * Clean API for creating and managing flowcharts
 */

class FlowchartFactory {
    static create(containerId, algorithmName, customData = null) {
        const data = customData || ALGORITHM_FLOWCHART_DATA[algorithmName];
        if (!data) {
            console.error(`No template found for algorithm: ${algorithmName}`);
            return null;
        }

        // Add container ID to data for proper element targeting
        data.containerId = containerId;

        return new EnhancedFlowchart(containerId, data);
    }

    static addAlgorithmData(algorithmName, data) {
        ALGORITHM_FLOWCHART_DATA[algorithmName] = data;
    }

    static getAvailableAlgorithms() {
        return Object.keys(ALGORITHM_FLOWCHART_DATA);
    }

    static validateAlgorithmData(data) {
        const required = ['algorithm', 'steps'];
        return required.every(field => data.hasOwnProperty(field));
    }
}
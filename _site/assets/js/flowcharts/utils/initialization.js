/**
 * DOM Initialization and Auto-Discovery
 * Handles automatic flowchart creation and setup
 */

class FlowchartInitializer {
    static initialize() {
        console.log('DOM loaded, looking for enhanced flowcharts...');

        const flowchartElements = document.querySelectorAll('[data-enhanced-flowchart]');
        console.log(`Found ${flowchartElements.length} enhanced flowchart elements`);

        flowchartElements.forEach(element => {
            const algorithmName = element.dataset.enhancedFlowchart;
            const containerId = element.id;

            console.log(`Initializing flowchart: ${containerId} -> ${algorithmName}`);

            if (containerId && algorithmName) {
                const flowchart = FlowchartFactory.create(containerId, algorithmName);
                if (flowchart) {
                    element.enhancedFlowchart = flowchart;
                }
            } else {
                console.warn('Missing id or algorithm name for element:', element);
            }
        });
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', FlowchartInitializer.initialize);
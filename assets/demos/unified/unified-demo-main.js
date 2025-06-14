/**
 * Unified Fair Division Demo - Main Initialization File
 * 
 * This file initializes the entire unified demo system when the page loads.
 * It coordinates the startup sequence and handles any initialization errors.
 */

// Global system instance
let unifiedDemo = null;

/**
 * Initialize the unified demo system
 */
async function initializeUnifiedDemo() {
    try {
        console.log('Starting unified demo initialization...');

        // Create the main system
        unifiedDemo = new UnifiedDemoSystem();

        // Initialize the core system
        await unifiedDemo.initialize();

        // Register available algorithms
        await registerAlgorithms();

        // System is ready
        console.log('Unified demo initialization complete');

        // Make system available globally for debugging
        window.unifiedDemo = unifiedDemo;

        // Emit a global ready event
        document.dispatchEvent(new CustomEvent('unifiedDemoReady', {
            detail: { system: unifiedDemo }
        }));

    } catch (error) {
        console.error('Failed to initialize unified demo:', error);
        handleInitializationError(error);
    }
}

/**
 * Register all available algorithms with the system
 */
async function registerAlgorithms() {
    try {
        console.log('Registering algorithms...');

        // Register Divide-and-Choose algorithm
        if (typeof DivideAndChooseAlgorithm !== 'undefined') {
            const divideAndChoose = new DivideAndChooseAlgorithm();
            unifiedDemo.registerAlgorithm(divideAndChoose);
            console.log('Registered: Divide-and-Choose');
        } else {
            console.warn('DivideAndChooseAlgorithm class not found');
        }

        // Register Austin's Moving Knife (when implemented)
        if (typeof AustinsMovingKnifeAlgorithm !== 'undefined') {
            const austinsMovingKnife = new AustinsMovingKnifeAlgorithm();
            unifiedDemo.registerAlgorithm(austinsMovingKnife);
            console.log('Registered: Austin\'s Moving Knife');
        }

        // Register Steinhaus Lone-Divider (when implemented)
        if (typeof SteinhausLoneDividerAlgorithm !== 'undefined') {
            const steinhausLoneDivider = new SteinhausLoneDividerAlgorithm();
            unifiedDemo.registerAlgorithm(steinhausLoneDivider);
            console.log('Registered: Steinhaus Lone-Divider');
        }

        const algorithmCount = unifiedDemo.algorithms.size;
        console.log(`Algorithm registration complete. ${algorithmCount} algorithms available.`);

    } catch (error) {
        console.error('Error during algorithm registration:', error);
        throw error;
    }
}

/**
 * Handle initialization errors gracefully
 */
function handleInitializationError(error) {
    console.error('Initialization error details:', error);

    // Try to show user-friendly error message
    const container = document.querySelector('.unified-demo-container');
    if (container) {
        container.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #e53e3e;">
                <h2>Demo Loading Error</h2>
                <p>There was an error initializing the fair division demo.</p>
                <details style="margin-top: 1rem; text-align: left;">
                    <summary style="cursor: pointer; color: #3182ce;">Technical Details</summary>
                    <pre style="background: #f7fafc; padding: 1rem; border-radius: 4px; margin-top: 0.5rem; overflow-x: auto;">${error.message}</pre>
                </details>
                <p style="margin-top: 1rem;">
                    <button onclick="window.location.reload()" style="background: #3182ce; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        Try Again
                    </button>
                </p>
            </div>
        `;
    }
}

/**
 * Check if all required classes are available
 */
function checkDependencies() {
    const requiredClasses = [
        'UnifiedDemoSystem',
        'UnifiedGameState',
        'BaseAlgorithm',
        'UnifiedUIManager'
    ];

    const missing = [];

    for (const className of requiredClasses) {
        if (typeof window[className] === 'undefined') {
            missing.push(className);
        }
    }

    if (missing.length > 0) {
        throw new Error(`Missing required classes: ${missing.join(', ')}`);
    }

    console.log('All required dependencies are available');
}

/**
 * Main initialization when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async function () {
    try {
        console.log('DOM loaded, starting unified demo...');

        // Check that all required classes loaded
        checkDependencies();

        // Initialize the system
        await initializeUnifiedDemo();

    } catch (error) {
        console.error('Failed to start unified demo:', error);
        handleInitializationError(error);
    }
});

/**
 * Handle page unload cleanup
 */
window.addEventListener('beforeunload', function () {
    if (unifiedDemo && typeof unifiedDemo.destroy === 'function') {
        unifiedDemo.destroy();
    }
});

/**
 * Utility functions for debugging
 */
window.debugUnifiedDemo = {
    getSystem: () => unifiedDemo,
    getSystemStatus: () => unifiedDemo ? unifiedDemo.getSystemStatus() : null,
    restart: async () => {
        if (unifiedDemo) {
            unifiedDemo.destroy();
        }
        await initializeUnifiedDemo();
    }
};
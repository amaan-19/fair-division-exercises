/**
 * Widget Registry for Demo Dashboard
 */

class WidgetRegistry {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.widgets = new Map();
        this.categories = new Map();

        // Widget metadata for educational organization
        this.metadata = new Map();

        // Performance tracking
        this.creationStats = {
            totalCreated: 0,
            creationTimes: new Map(),
            failures: new Map()
        };

        // Register built-in widget categories
        this.initializeCategories();
        this.registerWidgets();
    }

    WIDGETS = [
        {'algorithm-selector': new AlgorithmSelectorWidget()},
    ]

    /**
     * Initialize standard widget categories for educational platform
     */
    initializeCategories() {
        this.registerCategory('algorithm', {
            name: 'Algorithm Widgets',
            description: 'Widgets for algorithm selection and control',
            icon: '⚙️',
            priority: 1
        });

        this.registerCategory('visualization', {
            name: 'Visualization Widgets',
            description: 'Interactive algorithm visualizations',
            icon: '📊',
            priority: 2
        });

        this.registerCategory('interaction', {
            name: 'Interaction Widgets',
            description: 'User input and control widgets',
            icon: '🎛️',
            priority: 3
        });

        this.registerCategory('educational', {
            name: 'Educational Widgets',
            description: 'Learning support and guidance widgets',
            icon: '📚',
            priority: 4
        });

        this.registerCategory('analysis', {
            name: 'Analysis Widgets',
            description: 'Complexity and performance analysis',
            icon: '📈',
            priority: 5
        });
    }

    /**
     * Register a widget category
     */
    registerCategory(id, config) {
        this.categories.set(id, {
            id,
            ...config,
            widgets: []
        });

        if (this.eventBus) {
            this.eventBus.emit('widget-category-registered', { categoryId: id, config });
        }
    }

    registerWidgets() {
        for (const widget of this.WIDGETS) {
            this.widgets.set(widget);
        }
        this.eventBus.emit('widgets-registered');
    }

    getRegisteredWidgets () {
        const availableWidgets = this.WIDGETS.keys();
        for (const name in availableWidgets) {
            console.log(name);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WidgetRegistry;
} else {
    window.WidgetRegistry = WidgetRegistry;
}
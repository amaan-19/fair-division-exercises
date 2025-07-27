/**
 * Widget Registry for Demo Dashboard
 * Fixed version with proper syntax and working methods
 */

class WidgetRegistry {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.widgets = new Map();
        this.categories = new Map();
        this.factories = new Map(); // For widget factory functions

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

        // Register built-in widgets
        this.registerBuiltInWidgets();
    }

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

        console.log('✅ Widget categories initialized');
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

    /**
     * Register a widget factory function
     */
    registerFactory(type, factoryFunction, metadata = {}) {
        this.factories.set(type, {
            factory: factoryFunction,
            metadata: {
                name: metadata.name || type,
                description: metadata.description || '',
                category: metadata.category || 'general',
                ...metadata
            },
            registeredAt: Date.now()
        });

        console.log(`✅ Widget factory registered: ${type}`);

        if (this.eventBus) {
            this.eventBus.emit('widget-factory-registered', { type, metadata });
        }
    }

    /**
     * Create a widget instance
     */
    createWidget(type, id, config = {}) {
        const factory = this.factories.get(type);
        if (!factory) {
            throw new Error(`Unknown widget type: ${type}. Available types: ${Array.from(this.factories.keys()).join(', ')}`);
        }

        try {
            const widget = factory.factory(id, config);
            console.log(`✅ Widget created: ${id} (${type})`);
            return widget;
        } catch (error) {
            console.error(`❌ Failed to create widget ${type}:`, error);
            throw error;
        }
    }

    /**
     * Check if widget type exists
     */
    hasWidgetType(type) {
        return this.factories.has(type);
    }

    /**
     * Get all available widget types
     */
    getAllWidgetTypes() {
        return Array.from(this.factories.keys());
    }

    /**
     * Register built-in widgets with simple placeholders
     */
    registerBuiltInWidgets() {
        console.log('Registering built-in widgets...');

        // Algorithm Selector Widget
        this.registerFactory('algorithm-selector', (id, config) => {
            return {
                id,
                type: 'algorithm-selector',
                render() {
                    const div = document.createElement('div');
                    div.className = 'widget algorithm-selector-widget';
                    div.innerHTML = `
                        <h3>🔧 Algorithm Selector</h3>
                        <select style="width: 100%; padding: 8px; margin-top: 8px;">
                            <option>Divide and Choose</option>
                            <option>Austin's Moving Knife</option>
                            <option>Selfridge-Conway</option>
                        </select>
                        <p style="margin-top: 8px; font-size: 0.9em; color: #666;">
                            Select an algorithm to begin demonstration
                        </p>
                    `;
                    return div;
                }
            };
        }, {
            name: 'Algorithm Selector',
            description: 'Dropdown for selecting algorithms',
            category: 'algorithm'
        });

        // Cake Visualization Widget
        this.registerFactory('cake-visualization', (id, config) => {
            return {
                id,
                type: 'cake-visualization',
                render() {
                    const div = document.createElement('div');
                    div.className = 'widget cake-visualization-widget';
                    div.innerHTML = `
                        <h3>🍰 Cake Visualization</h3>
                        <div style="
                            height: 300px;
                            background: linear-gradient(45deg, #ffeaa7, #fab1a0);
                            border: 2px solid #e17055;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-top: 12px;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="font-size: 3em;">🍰</div>
                            <div style="
                                position: absolute;
                                bottom: 10px;
                                left: 10px;
                                background: rgba(0,0,0,0.7);
                                color: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                font-size: 0.8em;
                            ">Interactive cake diagram</div>
                        </div>
                    `;
                    return div;
                }
            };
        }, {
            name: 'Cake Visualization',
            description: 'Interactive cake cutting visualization',
            category: 'visualization'
        });

        // Instructions Widget
        this.registerFactory('instructions', (id, config) => {
            return {
                id,
                type: 'instructions',
                render() {
                    const div = document.createElement('div');
                    div.className = 'widget instructions-widget';
                    div.innerHTML = `
                        <h3>📖 Instructions</h3>
                        <div style="line-height: 1.6; color: #4a5568;">
                            <p><strong>Getting Started:</strong></p>
                            <ol style="margin-left: 20px;">
                                <li>Select an algorithm from the dropdown above</li>
                                <li>Follow the step-by-step guidance</li>
                                <li>Interact with the cake visualization</li>
                                <li>Observe fairness properties</li>
                            </ol>
                            <p style="margin-top: 12px; font-size: 0.9em; color: #666; font-style: italic;">
                                Detailed instructions will appear here based on your selected algorithm.
                            </p>
                        </div>
                    `;
                    return div;
                }
            };
        }, {
            name: 'Instructions',
            description: 'Step-by-step algorithm guidance',
            category: 'educational'
        });

        // Player Input Widget
        this.registerFactory('player-input', (id, config) => {
            return {
                id,
                type: 'player-input',
                render() {
                    const div = document.createElement('div');
                    div.className = 'widget player-input-widget';
                    div.innerHTML = `
                        <h3>👤 Player Input</h3>
                        <div style="margin-top: 12px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">
                                Player 1 Cut Position:
                            </label>
                            <input type="range" min="0" max="100" value="50"
                                   style="width: 100%; margin-bottom: 8px;">
                            <div style="text-align: center; font-size: 0.9em; color: #666;">
                                50%
                            </div>

                            <label style="display: block; margin: 16px 0 8px 0; font-weight: 500;">
                                Player 2 Preferences:
                            </label>
                            <select style="width: 100%; padding: 6px;">
                                <option>Left piece preferred</option>
                                <option>Right piece preferred</option>
                                <option>No preference</option>
                            </select>
                        </div>
                    `;
                    return div;
                }
            };
        }, {
            name: 'Player Input',
            description: 'User controls and preferences',
            category: 'interaction'
        });

        // Action Buttons Widget
        this.registerFactory('action-buttons', (id, config) => {
            return {
                id,
                type: 'action-buttons',
                render() {
                    const div = document.createElement('div');
                    div.className = 'widget action-buttons-widget';
                    div.innerHTML = `
                        <h3>🎯 Actions</h3>
                        <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                            <button style="
                                background: #3182ce;
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 500;
                            ">▶️ Start Algorithm</button>

                            <button style="
                                background: #38a169;
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 500;
                            ">➡️ Next Step</button>

                            <button style="
                                background: #e53e3e;
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 6px;
                                cursor: pointer;
                                font-weight: 500;
                            ">🔄 Reset</button>
                        </div>
                    `;
                    return div;
                }
            };
        }, {
            name: 'Action Buttons',
            description: 'Algorithm control buttons',
            category: 'interaction'
        });

        if (this.eventBus) {
            this.eventBus.emit('widgets-registered');
        }

        console.log('✅ Built-in widgets registered successfully');
    }

    /**
     * Get registered widgets info
     */
    getRegisteredWidgets() {
        const widgets = Array.from(this.factories.keys());
        console.log('Available widget types:', widgets);
        return widgets;
    }

    /**
     * Get all categories
     */
    getCategories() {
        return Array.from(this.categories.values());
    }

    /**
     * Get widgets by category
     */
    getWidgetsByCategory(categoryId) {
        const category = this.categories.get(categoryId);
        if (!category) return [];

        return Array.from(this.factories.entries())
            .filter(([type, factory]) => factory.metadata.category === categoryId)
            .map(([type, factory]) => ({ type, ...factory.metadata }));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WidgetRegistry;
} else {
    window.WidgetRegistry = WidgetRegistry;
}
/**
 * Widget Registry for Fair Division Dashboard
 *
 * Manages widget factories, creation, and lifecycle for the modular dashboard system.
 * Supports dynamic loading, dependency management, and educational widget categorization.
 */

class WidgetRegistry {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.factories = new Map();
        this.widgets = new Map();
        this.categories = new Map();
        this.dependencies = new Map();
        this.loadedScripts = new Set();

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
     * Register a widget factory
     * @param {string} type - Widget type identifier
     * @param {function} factory - Factory function that creates widget instances
     * @param {object} metadata - Widget metadata for organization and discovery
     */
    registerFactory(type, factory, metadata = {}) {
        if (typeof factory !== 'function') {
            throw new Error(`Widget factory for ${type} must be a function`);
        }

        // Validate factory function
        this.validateFactory(factory, type);

        const widgetMetadata = {
            type,
            name: metadata.name || type,
            description: metadata.description || '',
            category: metadata.category || 'generic',
            version: metadata.version || '1.0.0',
            author: metadata.author || 'Unknown',
            dependencies: metadata.dependencies || [],
            educational: metadata.educational || {},
            complexity: metadata.complexity || 'basic',
            tags: metadata.tags || [],
            icon: metadata.icon || '🔧',
            registeredAt: Date.now(),
            ...metadata
        };

        // Store factory and metadata
        this.factories.set(type, factory);
        this.metadata.set(type, widgetMetadata);

        // Store dependencies for loading order
        if (widgetMetadata.dependencies.length > 0) {
            this.dependencies.set(type, widgetMetadata.dependencies);
        }

        // Add to category
        const category = this.categories.get(widgetMetadata.category);
        if (category) {
            category.widgets.push(type);
        }

        console.log(`Widget factory registered: ${type} (${widgetMetadata.name})`);

        if (this.eventBus) {
            this.eventBus.emit('widget-factory-registered', {
                type,
                metadata: widgetMetadata
            });
        }
    }

    /**
     * Validate factory function meets requirements
     */
    validateFactory(factory, type) {
        // Test factory with dummy parameters
        try {
            const testWidget = factory('test-id', { test: true });
            if (!(testWidget instanceof Widget)) {
                throw new Error(`Factory for ${type} must return a Widget instance`);
            }
        } catch (error) {
            console.warn(`Factory validation warning for ${type}:`, error.message);
        }
    }

    /**
     * Create a widget instance
     * @param {string} id - Unique widget instance ID
     * @param {string} type - Widget type
     * @param {object} config - Widget configuration
     * @returns {Widget} Widget instance
     */
    async createWidget(id, type, config = {}) {
        const startTime = performance.now();

        try {
            // Check if widget already exists
            if (this.widgets.has(id)) {
                throw new Error(`Widget with ID ${id} already exists`);
            }

            // Check if factory is registered
            if (!this.factories.has(type)) {
                // Try to auto-load widget if script URL provided
                if (config.scriptUrl) {
                    await this.loadWidgetScript(config.scriptUrl);
                    if (!this.factories.has(type)) {
                        throw new Error(`Factory for widget type ${type} not found after loading script`);
                    }
                } else {
                    throw new Error(`No factory registered for widget type: ${type}`);
                }
            }

            // Check and load dependencies
            await this.ensureDependencies(type);

            // Get factory and metadata
            const factory = this.factories.get(type);
            const metadata = this.metadata.get(type);

            // Merge configuration with metadata defaults
            const finalConfig = {
                ...metadata.defaultConfig,
                ...config,
                type,
                metadata
            };

            // Create widget instance
            const widget = factory(id, finalConfig);

            if (!(widget instanceof Widget)) {
                throw new Error(`Factory for ${type} must return a Widget instance`);
            }

            // Store widget instance
            this.widgets.set(id, widget);

            // Track creation stats
            const creationTime = performance.now() - startTime;
            this.creationStats.totalCreated++;
            this.creationStats.creationTimes.set(type,
                (this.creationStats.creationTimes.get(type) || []).concat(creationTime)
            );

            console.log(`Widget created: ${id} (${type}) in ${creationTime.toFixed(2)}ms`);

            if (this.eventBus) {
                this.eventBus.emit('widget-created', {
                    widgetId: id,
                    type,
                    config: finalConfig,
                    creationTime
                });
            }

            return widget;

        } catch (error) {
            // Track failure stats
            this.creationStats.failures.set(type,
                (this.creationStats.failures.get(type) || 0) + 1
            );

            console.error(`Failed to create widget ${id} (${type}):`, error);

            if (this.eventBus) {
                this.eventBus.emit('widget-creation-failed', {
                    widgetId: id,
                    type,
                    error: error.message
                });
            }

            throw error;
        }
    }

    /**
     * Ensure widget dependencies are loaded
     */
    async ensureDependencies(type) {
        const dependencies = this.dependencies.get(type) || [];

        for (const depType of dependencies) {
            if (!this.factories.has(depType)) {
                const depMetadata = this.metadata.get(depType);
                if (depMetadata && depMetadata.scriptUrl) {
                    await this.loadWidgetScript(depMetadata.scriptUrl);
                } else {
                    throw new Error(`Dependency ${depType} not available for widget ${type}`);
                }
            }
        }
    }

    /**
     * Load widget script dynamically
     */
    async loadWidgetScript(scriptUrl) {
        if (this.loadedScripts.has(scriptUrl)) {
            return; // Already loaded
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => {
                this.loadedScripts.add(scriptUrl);
                resolve();
            };
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${scriptUrl}`));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Get a widget instance by ID
     */
    getWidget(id) {
        return this.widgets.get(id);
    }

    /**
     * Remove a widget from registry
     */
    removeWidget(id) {
        const widget = this.widgets.get(id);
        if (widget) {
            // Destroy widget if it has destroy method
            if (typeof widget.destroy === 'function') {
                widget.destroy();
            }

            this.widgets.delete(id);

            if (this.eventBus) {
                this.eventBus.emit('widget-removed', { widgetId: id });
            }

            return true;
        }
        return false;
    }

    /**
     * Get all widgets of a specific type
     */
    getWidgetsByType(type) {
        return Array.from(this.widgets.values()).filter(w => w.type === type);
    }

    /**
     * Get all widgets in a category
     */
    getWidgetsByCategory(category) {
        const categoryData = this.categories.get(category);
        if (!categoryData) return [];

        return Array.from(this.widgets.values()).filter(w =>
            categoryData.widgets.includes(w.type)
        );
    }

    /**
     * Get widget metadata
     */
    getMetadata(type) {
        return this.metadata.get(type);
    }

    /**
     * Get all registered widget types
     */
    getRegisteredTypes() {
        return Array.from(this.factories.keys());
    }

    /**
     * Get all widget categories
     */
    getCategories() {
        return Array.from(this.categories.values()).sort((a, b) => a.priority - b.priority);
    }

    /**
     * Search widgets by criteria
     */
    searchWidgets(criteria = {}) {
        const { category, tags, complexity, educational, text } = criteria;

        return Array.from(this.metadata.entries())
            .filter(([type, metadata]) => {
                // Category filter
                if (category && metadata.category !== category) return false;

                // Tags filter
                if (tags && tags.length > 0) {
                    const hasTag = tags.some(tag => metadata.tags.includes(tag));
                    if (!hasTag) return false;
                }

                // Complexity filter
                if (complexity && metadata.complexity !== complexity) return false;

                // Educational level filter
                if (educational && metadata.educational.level !== educational) return false;

                // Text search
                if (text) {
                    const searchText = text.toLowerCase();
                    const searchableText = [
                        metadata.name,
                        metadata.description,
                        ...metadata.tags
                    ].join(' ').toLowerCase();

                    if (!searchableText.includes(searchText)) return false;
                }

                return true;
            })
            .map(([type, metadata]) => ({ type, metadata }));
    }

    /**
     * Get widget creation statistics
     */
    getStats() {
        const avgCreationTimes = new Map();

        this.creationStats.creationTimes.forEach((times, type) => {
            const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
            avgCreationTimes.set(type, avg);
        });

        return {
            totalFactories: this.factories.size,
            totalWidgets: this.widgets.size,
            totalCreated: this.creationStats.totalCreated,
            averageCreationTimes: Object.fromEntries(avgCreationTimes),
            failures: Object.fromEntries(this.creationStats.failures),
            categories: this.categories.size,
            loadedScripts: this.loadedScripts.size
        };
    }

    /**
     * Validate all registered widgets
     */
    validateRegistry() {
        const issues = [];

        // Check for missing dependencies
        this.dependencies.forEach((deps, type) => {
            deps.forEach(dep => {
                if (!this.factories.has(dep)) {
                    issues.push(`Widget ${type} depends on missing widget ${dep}`);
                }
            });
        });

        // Check for circular dependencies
        const visited = new Set();
        const checking = new Set();

        const checkCircular = (type) => {
            if (checking.has(type)) {
                issues.push(`Circular dependency detected involving ${type}`);
                return;
            }
            if (visited.has(type)) return;

            checking.add(type);
            const deps = this.dependencies.get(type) || [];
            deps.forEach(checkCircular);
            checking.delete(type);
            visited.add(type);
        };

        this.factories.forEach((_, type) => checkCircular(type));

        return issues;
    }

    /**
     * Export registry configuration for persistence
     */
    exportConfig() {
        const config = {
            categories: Array.from(this.categories.entries()),
            metadata: Array.from(this.metadata.entries()),
            dependencies: Array.from(this.dependencies.entries()),
            stats: this.getStats()
        };

        return JSON.stringify(config, null, 2);
    }

    /**
     * Import registry configuration
     */
    importConfig(configJson) {
        try {
            const config = JSON.parse(configJson);

            // Import categories
            if (config.categories) {
                config.categories.forEach(([id, categoryConfig]) => {
                    this.categories.set(id, categoryConfig);
                });
            }

            // Import metadata (factories need to be registered separately)
            if (config.metadata) {
                config.metadata.forEach(([type, metadata]) => {
                    this.metadata.set(type, metadata);
                });
            }

            // Import dependencies
            if (config.dependencies) {
                config.dependencies.forEach(([type, deps]) => {
                    this.dependencies.set(type, deps);
                });
            }

            console.log('Registry configuration imported successfully');

        } catch (error) {
            console.error('Failed to import registry configuration:', error);
            throw error;
        }
    }

    /**
     * Clear all widgets and reset registry
     */
    clear() {
        // Destroy all widgets
        this.widgets.forEach((widget, id) => {
            if (typeof widget.destroy === 'function') {
                widget.destroy();
            }
        });

        this.widgets.clear();

        if (this.eventBus) {
            this.eventBus.emit('widget-registry-cleared');
        }
    }

    /**
     * Destroy registry and cleanup
     */
    destroy() {
        this.clear();
        this.factories.clear();
        this.metadata.clear();
        this.dependencies.clear();
        this.categories.clear();
        this.loadedScripts.clear();

        console.log('Widget registry destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WidgetRegistry;
} else {
    window.WidgetRegistry = WidgetRegistry;
}
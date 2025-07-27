/**
 * Widget Dashboard System - Fixed Version
 */
class Dashboard {
    constructor(containerId) {
        this.containerId = containerId;
        // State tracking
        this.container = null;
        this.layout = null
        this.widgets = new Map();
        this.isInitialized = false;
        console.log(`Dashboard constructor called`);
    }

    /**
     * Initialize dashboard with widget factory support
     */
    async initialize(layout) {
        console.log('Initializing dashboard...');

        try {
            // 1. Initialize container
            await this.initializeContainer();

            // 2. Initialize event bus
            await this.initializeEventBus();

            // 3. Initialize widget registry
            await this.initializeWidgetRegistry();

            // 4. Initialize layout manager
            await this.initializeLayoutManager(layout);

            this.isInitialized = true;
            this.eventBus.emit('dashboard-ready');
            console.log('Dashboard initialized successfully');

        } catch (error) {
            console.error('Failed to initialize Dashboard:', error);
            throw error;
        }
    }

    /**
     * Initialize DOM container
     */
    async initializeContainer() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            throw new Error(`Container not found: ${this.containerId}`);
        }
        console.log('Container initialized');
    }

    /**
     * Initialize event bus
     */
    async initializeEventBus() {
        this.eventBus = new EventBus();
        console.log('Event system initialized');
    }

    /**
     * Initialize layout management system - FIXED VERSION
     */
    async initializeLayoutManager(layout) {
        const layoutOptions = {
            enableResponsive: true,
            enablePersistence: true,
            defaultLayout: 'standard',
            mobileBreakpoint: 768,
            tabletBreakpoint: 1024
        };

        this.layoutManager = new LayoutManager(this.container, this.eventBus, layoutOptions);

        // Apply the layout through layout manager
        await this.layoutManager.applyLayout(layout, {
            includeDefaultWidgets: false // Don't let layout manager handle widgets
        });

        // Handle widget creation ourselves
        await this.createDefaultWidgets(layout);

        console.log(`Layout system initialized. ${layout} layout applied.`);
    }

    /**
     * Create default widgets for a layout - NEW METHOD
     */
    async createDefaultWidgets(layoutName) {
        const layout = this.layoutManager.getLayout(layoutName);
        if (!layout || !layout.defaultWidgets) {
            console.log('No default widgets to create');
            return;
        }

        console.log('Creating default widgets...');

        // Create widgets for each region
        for (const [regionName, widgets] of Object.entries(layout.defaultWidgets)) {
            const region = this.layoutManager.getRegion(regionName);
            if (!region) {
                console.warn(`Region not found: ${regionName}`);
                continue;
            }

            // Create each widget in the region
            for (const widgetConfig of widgets) {
                try {
                    await this.createAndPlaceWidget(widgetConfig.type, regionName, widgetConfig.config);
                } catch (error) {
                    console.error(`Failed to create widget ${widgetConfig.type} in ${regionName}:`, error);
                }
            }
        }
    }

    /**
     * Create and place a widget in a region - NEW METHOD
     */
    async createAndPlaceWidget(widgetType, regionName, config = {}) {
        if (!this.widgetRegistry.hasWidgetType(widgetType)) {
            console.warn(`Widget type not found: ${widgetType}, skipping`);
            return null;
        }

        const widgetId = `${widgetType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        try {
            // Create widget instance
            const widget = this.widgetRegistry.createWidget(widgetType, widgetId, config);

            // Get the region element
            const region = this.layoutManager.getRegion(regionName);
            if (!region) {
                throw new Error(`Region not found: ${regionName}`);
            }

            // Initialize widget if it has an initialize method
            if (typeof widget.initialize === 'function') {
                await widget.initialize(region, { eventBus: this.eventBus });
            }

            // Render widget
            let widgetElement;
            if (typeof widget.render === 'function') {
                widgetElement = widget.render();
            } else {
                // Create a basic wrapper if widget doesn't have render method
                widgetElement = document.createElement('div');
                widgetElement.className = `widget ${widgetType}-widget`;
                widgetElement.setAttribute('data-widget-id', widgetId);
                widgetElement.innerHTML = `<p>Widget: ${widgetType}</p>`;
            }

            if (widgetElement) {
                widgetElement.setAttribute('data-widget-id', widgetId);
                widgetElement.setAttribute('data-widget-type', widgetType);

                // Add to region using layout manager
                this.layoutManager.addWidgetToRegion(widgetElement, regionName);

                // Store widget reference
                this.widgets.set(widgetId, widget);

                console.log(`✅ Widget created and placed: ${widgetId} (${widgetType}) in ${regionName}`);

                return widget;
            }
        } catch (error) {
            console.error(`❌ Failed to create widget ${widgetType}:`, error);
            throw error;
        }
    }

    /**
     * Apply layout
     */
    async applyLayout(layout) {
        this.layout = layout;
    }

    /**
     * Initialize widget registry
     */
    async initializeWidgetRegistry() {
        this.widgetRegistry = new WidgetRegistry(this.eventBus);
        console.log('Widget registry initialized');
        this.widgetRegistry.getRegisteredWidgets();
    }

    /**
     * Add widget with factory validation
     */
    async addWidget(type, config = {}) {
        if (!this.widgetRegistry.hasWidgetType(type)) {
            throw new Error(`Unknown widget type: ${type}. Available types: ${this.widgetRegistry.getAllWidgetTypes().join(', ')}`);
        }

        const widgetId = config.id || `${type}-${Date.now()}`;

        try {
            // Create widget instance
            const widget = this.widgetRegistry.createWidget(type, widgetId, config);

            // Initialize widget
            if (typeof widget.initialize === 'function') {
                await widget.initialize();
            }

            // Render widget
            if (typeof widget.render === 'function') {
                const element = widget.render();
                if (element && config.container) {
                    config.container.appendChild(element);
                }
            }

            // Store widget reference
            this.widgets.set(widgetId, widget);

            // Emit widget added event
            this.eventBus.emit('widget-added', {
                widgetId,
                type,
                widget
            });

            console.log(`Widget added successfully: ${widgetId} (${type})`);
            return widget;

        } catch (error) {
            console.error(`Failed to add widget ${type}:`, error);

            // Emit error event
            this.eventBus.emit('widget-creation-failed', {
                type,
                widgetId,
                error: error.message
            });

            throw error;
        }
    }

    /**
     * Remove widget
     */
    removeWidget(widgetId) {
        const widget = this.widgets.get(widgetId);
        if (!widget) {
            console.warn(`Widget not found: ${widgetId}`);
            return false;
        }

        try {
            // Destroy widget
            if (typeof widget.destroy === 'function') {
                widget.destroy();
            }

            // Remove from registry
            this.widgets.delete(widgetId);

            // Emit widget removed event
            this.eventBus.emit('widget-removed', { widgetId });

            console.log(`Widget removed successfully: ${widgetId}`);
            return true;

        } catch (error) {
            console.error(`Failed to remove widget ${widgetId}:`, error);
            return false;
        }
    }

    /**
     * Get dashboard statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            widgetCount: this.widgets.size,
            currentLayout: this.layout,
            containerReady: !!this.container
        };
    }

    /**
     * Destroy dashboard and cleanup
     */
    destroy() {
        // Destroy all widgets
        for (const [widgetId, widget] of this.widgets) {
            if (typeof widget.destroy === 'function') {
                widget.destroy();
            }
        }

        // Clear widgets
        this.widgets.clear();

        // Destroy layout manager
        if (this.layoutManager) {
            this.layoutManager.destroy();
        }

        this.isInitialized = false;
        console.log('Dashboard destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
} else {
    window.Dashboard = Dashboard;
}
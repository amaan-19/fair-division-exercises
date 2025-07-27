/**
 * Widget Dashboard System
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
     * Initialize layout management system
     */
    async initializeLayoutManager(layout) {
        this.layoutManager = new LayoutManager(this.container, this.eventBus);
        await this.applyLayout(layout);
        await this.layoutManager.placeDefaultWidgets(layout);
        console.log(`Layout system initialized. ${layout} layout applied.`);
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
        console.log('Widget registery initialized');
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

            console.log(`Widget removed: ${widgetId}`);
            return true;

        } catch (error) {
            console.error(`Error removing widget ${widgetId}:`, error);
            return false;
        }
    }

    /**
     * Get widget by ID
     */
    getWidget(widgetId) {
        return this.widgets.get(widgetId);
    }

    /**
     * Get all widgets of a specific type
     */
    getWidgetsByType(type) {
        return Array.from(this.widgets.values()).filter(widget => widget.type === type);
    }

    /**
     * Check if dashboard is ready for operations
     */
    isReady() {
        return this.isInitialized && this.widgetRegistry.isReady;
    }

    /**
     * Get dashboard status for debugging
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            registryReady: this.widgetRegistry.isReady,
            widgetCount: this.widgets.size,
            availableWidgetTypes: this.widgetRegistry.getAllWidgetTypes(),
            registeredLayouts: this.layoutManager ? this.layoutManager.getRegisteredLayouts() : []
        };
    }
}

// Export for use by other modules
window.Dashboard = Dashboard;
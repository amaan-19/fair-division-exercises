/**
 * Barebones Widget Base Class
 *
 * Minimal foundation for dashboard widgets with essential structure only.
 * Provides basic lifecycle hooks and properties that you can extend as needed.
 */

class Widget {
    constructor(id, config = {}) {
        // Essential identity
        this.id = id;
        this.type = config.type || 'generic';

        // Core configuration with safe defaults
        this.config = {
            ...config,
            educational: config.educational || {}
        };

        // DOM references
        this.element = null;
        this.container = null;

        // State management
        this.state = {};

        // Lifecycle flags
        this.isInitialized = false;
        this.isDestroyed = false;

        // Event system placeholder
        this.eventBus = null;
        this.subscriptions = [];

        // Educational context (safe access)
        this.learningObjectives = (this.config.educational && this.config.educational.objectives) || [];
    }

    // ===== LIFECYCLE METHODS =====
    // Override these in your specific widget implementations

    /**
     * Initialize the widget - called once when widget is created
     * @param {HTMLElement} container - Parent container element
     * @param {Object} context - Dashboard context (eventBus, etc.)
     */
    async initialize(container, context = {}) {
        if (this.isInitialized) {
            throw new Error(`Widget ${this.id} is already initialized`);
        }

        this.container = container;
        this.eventBus = context.eventBus || null;

        // Call subclass initialization
        await this.onInitialize();

        this.isInitialized = true;
    }

    /**
     * Override this in subclasses for custom initialization logic
     */
    async onInitialize() {
        // Default implementation - override in subclasses
    }

    /**
     * Render the widget - called when widget needs to be displayed
     */
    render() {
        if (!this.isInitialized) {
            throw new Error(`Widget ${this.id} must be initialized before rendering`);
        }

        // Call subclass render implementation
        this.onRender();
    }

    /**
     * Override this in subclasses for custom render logic
     */
    onRender() {
        // Default implementation - override in subclasses
        if (!this.element) {
            this.element = this.createElement();
            if (this.container) {
                this.container.appendChild(this.element);
            }
        }
    }

    /**
     * Update the widget with new data/state
     * @param {Object} data - New data to update widget with
     */
    update(data = {}) {
        if (!this.isInitialized) {
            console.warn(`Cannot update widget ${this.id}: not initialized`);
            return;
        }

        // Store previous state
        const previousState = { ...this.state };

        // Update state
        Object.assign(this.state, data);

        // Call subclass update implementation
        this.onUpdate(data, previousState);
    }

    /**
     * Override this in subclasses for custom update logic
     */
    onUpdate(data, previousState) {
        // Default implementation - override in subclasses
    }

    /**
     * Destroy the widget and cleanup resources
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }

        // Call subclass cleanup
        this.onDestroy();

        // Cleanup event subscriptions
        this.subscriptions.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.subscriptions = [];

        // Remove from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }

        // Clear references
        this.element = null;
        this.container = null;
        this.eventBus = null;

        this.isDestroyed = true;
    }

    /**
     * Override this in subclasses for custom cleanup logic
     */
    onDestroy() {
        // Default implementation - override in subclasses
    }

    // ===== BASIC UTILITY METHODS =====

    /**
     * Create the widget's DOM element - override in subclasses
     */
    createElement() {
        const element = document.createElement('div');
        element.className = `widget widget-${this.type}`;
        element.id = `widget-${this.id}`;
        element.textContent = `Widget: ${this.id}`;
        return element;
    }

    /**
     * Set widget state and optionally trigger update
     */
    setState(newState, shouldUpdate = true) {
        const previousState = { ...this.state };
        Object.assign(this.state, newState);

        if (shouldUpdate) {
            this.onUpdate(newState, previousState);
        }
    }

    /**
     * Get current widget state
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * Subscribe to an event - implement based on your event system
     */
    subscribe(event, handler) {
        if (this.eventBus && this.eventBus.on) {
            const unsubscribe = this.eventBus.on(event, handler);
            this.subscriptions.push(unsubscribe);
            return unsubscribe;
        }
        console.warn(`No event bus available for widget ${this.id}`);
    }

    // ===== BASIC CHECKS =====

    /**
     * Check if widget is ready for use
     */
    isReady() {
        return this.isInitialized && !this.isDestroyed && this.element;
    }

    /**
     * Get basic widget info
     */
    getInfo() {
        return {
            id: this.id,
            type: this.type,
            isInitialized: this.isInitialized,
            isDestroyed: this.isDestroyed,
            hasElement: !!this.element
        };
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Widget;
} else if (typeof window !== 'undefined') {
    window.Widget = Widget;
}
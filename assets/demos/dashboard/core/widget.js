/**
 * Base Widget Class for Fair Division Dashboard
 *
 * Foundation class for all dashboard widgets, providing:
 * - Lifecycle management
 * - Event handling
 * - State management
 * - Educational context tracking
 */

class Widget {
    constructor(id, config = {}) {
        this.id = id;
        this.type = config.type || 'generic';
        this.config = {
            title: config.title || this.id,
            resizable: config.resizable || false,
            collapsible: config.collapsible !== false, // Default true
            removable: config.removable || false,
            educational: config.educational || {},
            ...config
        };

        // Core properties
        this.element = null;
        this.container = null;
        this.eventBus = null;
        this.state = {};
        this.subscriptions = [];

        // Lifecycle state
        this.isInitialized = false;
        this.isVisible = true;
        this.isEnabled = true;
        this.isCollapsed = false;

        // Educational tracking
        this.interactionCount = 0;
        this.lastInteraction = null;
        this.learningObjectives = config.educational.objectives || [];

        // Performance tracking
        this.renderCount = 0;
        this.lastRenderTime = 0;

        // Bind methods to preserve context
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);
        this.handleInteraction = this.handleInteraction.bind(this);
    }

    // ===== LIFECYCLE METHODS =====

    /**
     * Initialize the widget
     * @param {HTMLElement} container - Container element
     * @param {EventBus} eventBus - Global event bus
     * @param {Object} context - Dashboard context
     */
    async initialize(container, eventBus, context = {}) {
        if (this.isInitialized) {
            console.warn(`Widget ${this.id} already initialized`);
            return;
        }

        this.container = container;
        this.eventBus = eventBus;
        this.dashboardContext = context;

        try {
            // Create widget element
            this.element = this.createElement();
            this.container.appendChild(this.element);

            // Setup core functionality
            this.setupEventListeners();
            this.setupEducationalTracking();

            // Call implementation-specific initialization
            await this.onInitialize();

            // Initial render
            this.render();

            this.isInitialized = true;
            this.emit('widget-initialized', {
                widgetId: this.id,
                type: this.type,
                config: this.config
            });

        } catch (error) {
            console.error(`Failed to initialize widget ${this.id}:`, error);
            throw error;
        }
    }

    /**
     * Override this method in subclasses for custom initialization
     */
    async onInitialize() {
        // Default implementation - override in subclasses
    }

    /**
     * Create the widget's DOM element structure
     */
    createElement() {
        const element = document.createElement('div');
        element.className = `widget widget-${this.type} widget-${this.id}`;
        element.id = `widget-${this.id}`;
        element.setAttribute('data-widget-id', this.id);
        element.setAttribute('data-widget-type', this.type);

        // Accessibility attributes
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', this.config.title);

        return element;
    }

    /**
     * Setup core event listeners
     */
    setupEventListeners() {
        // Listen for global dashboard events that might affect this widget
        this.subscribe('dashboard-theme-changed', (data) => {
            this.onThemeChanged(data.theme);
        });

        this.subscribe('dashboard-layout-changed', (data) => {
            this.onLayoutChanged(data.layout);
        });

        this.subscribe('algorithm-changed', (data) => {
            this.onAlgorithmChanged(data);
        });

        // Widget-specific event namespace
        this.subscribe(`widget-${this.id}-update`, (data) => {
            this.update(data);
        });
    }

    /**
     * Setup educational interaction tracking
     */
    setupEducationalTracking() {
        if (this.element) {
            this.element.addEventListener('click', this.handleInteraction);
            this.element.addEventListener('change', this.handleInteraction);
            this.element.addEventListener('input', this.handleInteraction);
        }
    }

    /**
     * Handle user interactions for educational tracking
     */
    handleInteraction(event) {
        this.interactionCount++;
        this.lastInteraction = {
            type: event.type,
            timestamp: Date.now(),
            target: event.target.tagName,
            value: event.target.value || null
        };

        this.emit('widget-interaction', {
            widgetId: this.id,
            interaction: this.lastInteraction,
            totalInteractions: this.interactionCount
        });
    }

    /**
     * Render the widget content
     */
    render() {
        if (!this.element) {
            console.warn(`Cannot render widget ${this.id}: element not created`);
            return;
        }

        const startTime = performance.now();

        try {
            // Create widget structure if first render
            if (this.renderCount === 0) {
                this.element.innerHTML = this.getTemplate();
                this.setupWidgetControls();
                this.setupWidgetContent();
            }

            // Update content
            this.updateContent();

            // Track rendering performance
            this.renderCount++;
            this.lastRenderTime = performance.now() - startTime;

            this.emit('widget-rendered', {
                widgetId: this.id,
                renderCount: this.renderCount,
                renderTime: this.lastRenderTime
            });

        } catch (error) {
            console.error(`Error rendering widget ${this.id}:`, error);
            this.element.innerHTML = this.getErrorTemplate(error);
        }
    }

    /**
     * Get the widget HTML template
     */
    getTemplate() {
        return `
            <div class="widget-header">
                <div class="widget-title-section">
                    <h3 class="widget-title">${this.config.title}</h3>
                    ${this.config.subtitle ? `<p class="widget-subtitle">${this.config.subtitle}</p>` : ''}
                </div>
                <div class="widget-controls">
                    ${this.config.collapsible ? `
                        <button class="widget-control widget-collapse" 
                                title="${this.isCollapsed ? 'Expand' : 'Collapse'}"
                                aria-label="${this.isCollapsed ? 'Expand widget' : 'Collapse widget'}">
                            ${this.isCollapsed ? '▼' : '▲'}
                        </button>
                    ` : ''}
                    ${this.config.removable ? `
                        <button class="widget-control widget-remove" 
                                title="Remove widget"
                                aria-label="Remove widget">
                            ✕
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="widget-content ${this.isCollapsed ? 'collapsed' : ''}" 
                 ${this.isCollapsed ? 'aria-hidden="true"' : ''}>
                <div class="widget-body">
                    ${this.getContentTemplate()}
                </div>
                ${this.config.educational.showObjectives && this.learningObjectives.length > 0 ? `
                    <div class="widget-educational">
                        <h4>Learning Objectives:</h4>
                        <ul>
                            ${this.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Get content template - override in subclasses
     */
    getContentTemplate() {
        return `<p>Base widget content - override getContentTemplate() in ${this.type} widget</p>`;
    }

    /**
     * Get error template for failed renders
     */
    getErrorTemplate(error) {
        return `
            <div class="widget-error">
                <h3>Widget Error</h3>
                <p>Failed to render widget: ${this.id}</p>
                <details>
                    <summary>Error Details</summary>
                    <pre>${error.message}</pre>
                </details>
            </div>
        `;
    }

    /**
     * Setup widget control handlers
     */
    setupWidgetControls() {
        // Collapse/expand button
        const collapseBtn = this.element.querySelector('.widget-collapse');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => this.toggleCollapse());
        }

        // Remove button
        const removeBtn = this.element.querySelector('.widget-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => this.requestRemoval());
        }
    }

    /**
     * Setup widget-specific content - override in subclasses
     */
    setupWidgetContent() {
        // Default implementation - override in subclasses
    }

    /**
     * Update widget content during re-renders
     */
    updateContent() {
        // Default implementation - override in subclasses
        const body = this.element.querySelector('.widget-body');
        if (body && this.renderCount > 1) {
            // Only update content on subsequent renders if needed
            // Subclasses should override this method
        }
    }

    /**
     * Update widget with new data
     * @param {Object} data - Update data
     */
    update(data = {}) {
        if (!this.isInitialized) {
            console.warn(`Cannot update widget ${this.id}: not initialized`);
            return;
        }

        // Store previous state for comparison
        const previousState = { ...this.state };

        // Update state
        Object.assign(this.state, data);

        // Handle special update flags
        if (data.forceRender || this.shouldRerender(previousState, this.state)) {
            this.render();
        }

        // Call implementation-specific update handler
        this.onUpdate(data, previousState);

        this.emit('widget-updated', {
            widgetId: this.id,
            data,
            previousState,
            currentState: this.state
        });
    }

    /**
     * Implementation-specific update handler - override in subclasses
     */
    onUpdate(data, previousState) {
        // Default implementation - override in subclasses
    }

    /**
     * Determine if widget should re-render based on state changes
     */
    shouldRerender(previousState, currentState) {
        // Simple deep comparison - can be optimized in subclasses
        return JSON.stringify(previousState) !== JSON.stringify(currentState);
    }

    /**
     * Destroy the widget and cleanup
     */
    destroy() {
        if (!this.isInitialized) return;

        try {
            // Call implementation-specific cleanup
            this.onDestroy();

            // Unsubscribe from all events
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

            this.isInitialized = false;

        } catch (error) {
            console.error(`Error destroying widget ${this.id}:`, error);
        }
    }

    /**
     * Implementation-specific cleanup - override in subclasses
     */
    onDestroy() {
        // Default implementation - override in subclasses
    }

    // ===== EVENT SYSTEM =====

    /**
     * Subscribe to an event
     */
    subscribe(event, handler, priority = 0) {
        if (!this.eventBus) {
            console.warn(`Widget ${this.id} trying to subscribe before initialization`);
            return;
        }

        const unsubscribe = this.eventBus.on(event, handler, priority);
        this.subscriptions.push(unsubscribe);
        return unsubscribe;
    }

    /**
     * Emit an event
     */
    emit(event, data = {}) {
        if (!this.eventBus) {
            console.warn(`Widget ${this.id} trying to emit before initialization`);
            return;
        }

        // Add widget context to event data
        const eventData = {
            ...data,
            source: this.id,
            sourceType: this.type,
            timestamp: Date.now()
        };

        this.eventBus.emit(event, eventData);
    }

    // ===== STATE MANAGEMENT =====

    /**
     * Set widget state
     */
    setState(newState, options = {}) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };

        if (!options.silent) {
            this.emit('widget-state-changed', {
                widgetId: this.id,
                oldState,
                newState: this.state
            });
        }

        if (options.render !== false && this.shouldRerender(oldState, this.state)) {
            this.render();
        }
    }

    /**
     * Get widget state
     */
    getState() {
        return { ...this.state };
    }

    // ===== WIDGET CONTROL METHODS =====

    /**
     * Toggle widget collapse state
     */
    toggleCollapse() {
        this.setCollapse(!this.isCollapsed);
    }

    /**
     * Set widget collapse state
     */
    setCollapse(collapsed) {
        if (!this.config.collapsible) return;

        this.isCollapsed = collapsed;

        const content = this.element?.querySelector('.widget-content');
        const button = this.element?.querySelector('.widget-collapse');

        if (content) {
            content.classList.toggle('collapsed', collapsed);
            content.setAttribute('aria-hidden', collapsed.toString());
        }

        if (button) {
            button.innerHTML = collapsed ? '▼' : '▲';
            button.title = collapsed ? 'Expand' : 'Collapse';
            button.setAttribute('aria-label', collapsed ? 'Expand widget' : 'Collapse widget');
        }

        this.emit('widget-collapsed', {
            widgetId: this.id,
            collapsed
        });
    }

    /**
     * Set widget visibility
     */
    setVisibility(visible) {
        this.isVisible = visible;

        if (this.element) {
            this.element.style.display = visible ? '' : 'none';
            this.element.setAttribute('aria-hidden', (!visible).toString());
        }

        this.emit('widget-visibility-changed', {
            widgetId: this.id,
            visible
        });
    }

    /**
     * Set widget enabled state
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;

        if (this.element) {
            this.element.classList.toggle('widget-disabled', !enabled);

            // Disable all interactive elements
            const interactiveElements = this.element.querySelectorAll('input, button, select, textarea');
            interactiveElements.forEach(el => {
                el.disabled = !enabled;
            });
        }

        this.emit('widget-enabled-changed', {
            widgetId: this.id,
            enabled
        });
    }

    /**
     * Request removal of this widget
     */
    requestRemoval() {
        this.emit('widget-removal-requested', {
            widgetId: this.id,
            widget: this
        });
    }

    // ===== EVENT HANDLERS =====

    /**
     * Handle theme changes
     */
    onThemeChanged(theme) {
        if (this.element) {
            this.element.setAttribute('data-theme', theme);
        }
    }

    /**
     * Handle layout changes
     */
    onLayoutChanged(layout) {
        // Default implementation - override in subclasses if needed
    }

    /**
     * Handle algorithm changes
     */
    onAlgorithmChanged(data) {
        // Default implementation - override in subclasses if needed
    }

    // ===== UTILITY METHODS =====

    /**
     * Get widget dimensions
     */
    getDimensions() {
        if (!this.element) return { width: 0, height: 0 };

        const rect = this.element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
        };
    }

    /**
     * Check if widget is ready for interaction
     */
    isReady() {
        return this.isInitialized && this.element && this.eventBus && this.isEnabled;
    }

    /**
     * Get educational analytics data
     */
    getAnalytics() {
        return {
            widgetId: this.id,
            type: this.type,
            interactionCount: this.interactionCount,
            lastInteraction: this.lastInteraction,
            renderCount: this.renderCount,
            averageRenderTime: this.lastRenderTime,
            learningObjectives: this.learningObjectives,
            isVisible: this.isVisible,
            isEnabled: this.isEnabled
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Widget;
} else {
    window.Widget = Widget;
}
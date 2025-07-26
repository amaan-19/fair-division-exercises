/**
 * Fair Division Dashboard - Main Controller
 *
 * Orchestrates the modular dashboard system, managing widgets, layouts, and algorithms
 * for the educational fair division platform. Provides a unified API for educational
 * algorithm demonstrations with academic rigor and extensibility.
 */

class Dashboard {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.config = {
            layout: 'standard',
            theme: 'academic',
            enablePersistence: true,
            enableResponsive: true,
            enableAnalytics: true,
            debug: false,
            autoLoadWidgets: true,
            maxWidgets: 50,
            ...config
        };

        // Core systems - initialized in order
        this.eventBus = null;
        this.widgetRegistry = null;
        this.layoutManager = null;

        // State management
        this.widgets = new Map();
        this.algorithms = new Map();
        this.currentAlgorithm = null;
        this.isInitialized = false;
        this.container = null;

        // Educational context
        this.sessionData = {
            startTime: Date.now(),
            interactions: 0,
            algorithmsUsed: new Set(),
            learningObjectives: [],
            completedObjectives: new Set()
        };

        // Performance tracking
        this.performanceMetrics = {
            initTime: 0,
            widgetCreationTimes: new Map(),
            layoutSwitchTimes: new Map(),
            errorCount: 0
        };

        // Algorithm compatibility bridge
        this.compatibilityBridge = null;

        // Bind methods
        this.handleWidgetCreationRequest = this.handleWidgetCreationRequest.bind(this);
        this.handleAlgorithmSelection = this.handleAlgorithmSelection.bind(this);
        this.handleWidgetRemovalRequest = this.handleWidgetRemovalRequest.bind(this);

        // Register widget factories
        this.processQueuedWidgetRegistrations();
    }

    // ===== INITIALIZATION =====

    /**
     * Initialize the dashboard system
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('Dashboard already initialized');
            return;
        }

        const startTime = performance.now();

        try {
            console.log('Initializing Fair Division Dashboard...');

            // 1. Get container element
            await this.initializeContainer();

            // 2. Initialize core systems
            await this.initializeCoreServices();

            // 3. Setup event handlers
            this.setupEventHandlers();

            // 4. Initialize algorithm compatibility
            this.initializeAlgorithmCompatibility();

            // 5. Apply initial layout
            await this.applyInitialLayout();

            // 6. Load saved state if persistence enabled
            if (this.config.enablePersistence) {
                await this.loadPersistedState();
            }

            // Global widget registration queue
            const widgetRegistrationQueue = [];

            // Public widget registration API
            window.FairDivisionDashboard = {
                widgetRegistrationQueue: widgetRegistrationQueue,

                registerWidget: function(type, factory, metadata = {}) {
                    // If dashboard instance exists and is ready, register immediately
                    if (window.dashboardInstance && window.dashboardInstance.widgetRegistry) {
                        try {
                            window.dashboardInstance.widgetRegistry.registerWidget(type, factory, metadata);
                            console.log(`Widget registered immediately: ${type}`);
                            return true;
                        } catch (error) {
                            console.error(`Failed to register widget ${type}:`, error);
                            return false;
                        }
                    } else {
                        // Queue for later registration
                        console.log(`Dashboard not ready, queueing widget registration: ${type}`);
                        widgetRegistrationQueue.push({ type, factory, metadata });
                        return true;
                    }
                },

                getInstance: function() {
                    return window.dashboardInstance;
                }
            };

            // Mark as initialized
            this.isInitialized = true;
            this.performanceMetrics.initTime = performance.now() - startTime;

            console.log(`Dashboard initialized in ${this.performanceMetrics.initTime.toFixed(2)}ms`);

        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showInitializationError(error);
            throw error;
        }
    }

    /**
     * Initialize the container element
     */
    async initializeContainer() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            throw new Error(`Container element not found: ${this.containerId}`);
        }

        // Clear loading message
        this.container.innerHTML = '';

        // Set initial classes and attributes
        this.container.className = 'dashboard-container initializing';
        this.container.setAttribute('data-dashboard-version', '2.0');
        this.container.setAttribute('data-theme', this.config.theme);
        console.log('Container initialized!');
    }

    /**
     * Initialize core services in dependency order
     */
    async initializeCoreServices() {
        // 1. Event Bus - foundation for all communication
        this.eventBus = new EventBus({
            debug: this.config.debug,
            enablePersistence: this.config.enableAnalytics
        });

        // Add educational middleware
        this.eventBus.use(EventBus.QueryTrackingMiddleware);
        if (this.config.debug) {
            this.eventBus.use(EventBus.DebugMiddleware);
        }
        if (this.config.enableAnalytics) {
            this.eventBus.use(EventBus.PerformanceMiddleware());
        }

        console.log('Event Bus initialized!');

        // 2. Widget Registry - manages widget factories and instances
        this.widgetRegistry = new WidgetRegistry(this.eventBus);
        console.log('Initialized widget registery!');

        // 3. Layout Manager - handles layout and regions
        this.layoutManager = new LayoutManager(this.eventBus, {
            enablePersistence: this.config.enablePersistence,
            enableResponsive: this.config.enableResponsive
        });
        console.log('Initialized layout manager!');

        // Set container for layout manager
        this.layoutManager.setContainer(this.container);

        this.eventBus.emit('core-services-active');

        console.log('Core services initialized');
    }

    /**
     * Setup global event handlers
     */
    setupEventHandlers() {
        // Widget lifecycle events
        this.eventBus.on('widget-creation-requested', this.handleWidgetCreationRequest);
        this.eventBus.on('widget-removal-requested', this.handleWidgetRemovalRequest);
        this.eventBus.on('widget-interaction', this.handleWidgetInteraction.bind(this));

        // Algorithm events
        this.eventBus.on('algorithm-selection-changed', this.handleAlgorithmSelection);
        this.eventBus.on('algorithm-step-completed', this.handleAlgorithmStep.bind(this));

        // Layout events
        this.eventBus.on('layout-default-widgets-requested', this.handleDefaultWidgetRequest.bind(this));
        this.eventBus.on('widget-drop-requested', this.handleWidgetDrop.bind(this));

        // Educational events
        this.eventBus.on('learning-objective-completed', this.handleLearningObjective.bind(this));
        this.eventBus.on('widget-state-changed', this.trackStateChange.bind(this));

        // Error handling
        this.eventBus.on('widget-creation-failed', this.handleWidgetError.bind(this));
        this.eventBus.on('layout-apply-failed', this.handleLayoutError.bind(this));

        // Persistence events
        if (this.config.enablePersistence) {
            this.eventBus.on('widget-added', this.saveState.bind(this));
            this.eventBus.on('widget-removed', this.saveState.bind(this));
            this.eventBus.on('layout-applied', this.saveState.bind(this));
        }

        console.log('Event handlers configured');
    }

    /**
     * Initialize algorithm compatibility bridge
     */
    initializeAlgorithmCompatibility() {
        // Create compatibility layer for existing unified system algorithms
        this.compatibilityBridge = {
            // Bridge old algorithm registration to new system
            registerLegacyAlgorithm: (algorithmId, config) => {
                console.log(`Bridging legacy algorithm: ${algorithmId}`);
                // Convert old config format to new widget-based approach
                this.registerAlgorithm(algorithmId, this.convertLegacyConfig(config));
            },

            // Provide legacy API compatibility
            getLegacyAPI: () => ({
                register: this.compatibilityBridge.registerLegacyAlgorithm
            })
        };

        // Expose compatibility API globally for legacy algorithms
        window.FairDivisionCore = this.compatibilityBridge.getLegacyAPI();
    }

    /**
     * Apply the initial layout
     */
    async applyInitialLayout() {
        const layoutName = this.config.layout ||
            this.layoutManager.loadLayoutPreference() ||
            'standard';

        await this.layoutManager.applyLayout(layoutName);
        this.container.classList.remove('initializing');
        this.container.classList.add('ready');
    }

    // ===== WIDGET MANAGEMENT =====

    /**
     * Add a widget to the dashboard
     */
    async addWidget(id, type, config = {}, regionName = null) {
        try {
            const startTime = performance.now();

            // Validate parameters
            if (this.widgets.has(id)) {
                throw new Error(`Widget with ID ${id} already exists`);
            }

            if (this.widgets.size >= this.config.maxWidgets) {
                throw new Error(`Maximum widget limit reached (${this.config.maxWidgets})`);
            }

            // Create widget instance
            const widget = await this.widgetRegistry.createWidget(id, type, config);

            // Determine target region
            if (!regionName) {
                regionName = this.determineOptimalRegion(type, config);
            }

            const region = this.layoutManager.getRegion(regionName);
            if (!region) {
                throw new Error(`Region not found: ${regionName}`);
            }

            // Initialize widget
            await widget.initialize(region, this.eventBus, {
                dashboard: this,
                layoutManager: this.layoutManager,
                widgetRegistry: this.widgetRegistry
            });

            // Add to layout
            this.layoutManager.addWidgetToRegion(widget.element, regionName);

            // Store widget
            this.widgets.set(id, {
                widget,
                type,
                config,
                region: regionName,
                addedAt: Date.now()
            });

            // Track performance
            const creationTime = performance.now() - startTime;
            this.performanceMetrics.widgetCreationTimes.set(id, creationTime);

            console.log(`Widget added: ${id} (${type}) in region ${regionName} - ${creationTime.toFixed(2)}ms`);

            this.eventBus.emit('widget-added', {
                widgetId: id,
                type,
                regionName,
                creationTime
            });

            return widget;

        } catch (error) {
            console.error(`Failed to add widget ${id}:`, error);
            this.performanceMetrics.errorCount++;

            this.eventBus.emit('widget-add-failed', {
                widgetId: id,
                type,
                error: error.message
            });

            throw error;
        }
    }

    /**
     * Remove a widget from the dashboard
     */
    removeWidget(id) {
        const widgetData = this.widgets.get(id);
        if (!widgetData) {
            console.warn(`Widget not found: ${id}`);
            return false;
        }

        try {
            // Remove from layout
            this.layoutManager.removeWidgetFromRegion(widgetData.widget.element);

            // Remove from registry
            this.widgetRegistry.removeWidget(id);

            // Remove from dashboard
            this.widgets.delete(id);

            console.log(`Widget removed: ${id}`);

            this.eventBus.emit('widget-removed', { widgetId: id });

            return true;

        } catch (error) {
            console.error(`Failed to remove widget ${id}:`, error);
            this.performanceMetrics.errorCount++;
            return false;
        }
    }

    /**
     * Get a widget by ID
     */
    getWidget(id) {
        const widgetData = this.widgets.get(id);
        return widgetData ? widgetData.widget : null;
    }

    /**
     * Get all widgets of a specific type
     */
    getWidgetsByType(type) {
        return Array.from(this.widgets.values())
            .filter(data => data.type === type)
            .map(data => data.widget);
    }

    /**
     * Determine optimal region for widget placement
     */
    determineOptimalRegion(type, config) {
        // Use widget metadata to suggest placement
        const metadata = this.widgetRegistry.getMetadata(type);
        if (metadata && metadata.preferredRegion) {
            return metadata.preferredRegion;
        }

        // Use category-based heuristics
        switch (metadata?.category) {
            case 'algorithm':
                return 'header';
            case 'visualization':
                return this.layoutManager.hasRegion('visualization') ? 'visualization' : 'main';
            case 'interaction':
            case 'educational':
                return 'sidebar';
            case 'analysis':
                return this.layoutManager.hasRegion('mainRight') ? 'mainRight' : 'sidebar';
            default:
                return 'main';
        }
    }

    // ===== ALGORITHM MANAGEMENT =====

    /**
     * Register an algorithm with the dashboard
     */
    registerAlgorithm(algorithmId, config) {
        try {
            // Validate algorithm configuration
            this.validateAlgorithmConfig(algorithmId, config);

            // Store algorithm
            this.algorithms.set(algorithmId, {
                id: algorithmId,
                config,
                registeredAt: Date.now()
            });

            console.log(`Algorithm registered: ${algorithmId}`);

            this.eventBus.emit('algorithm-registered', {
                algorithmId,
                config
            });

            return true;

        } catch (error) {
            console.error(`Failed to register algorithm ${algorithmId}:`, error);
            this.performanceMetrics.errorCount++;
            return false;
        }
    }

    /**
     * Validate algorithm configuration
     */
    validateAlgorithmConfig(algorithmId, config) {
        if (!config.metadata) {
            throw new Error('Algorithm must have metadata');
        }

        const { name, description, playerCount } = config.metadata;
        if (!name || !description || !playerCount) {
            throw new Error('Algorithm metadata must include name, description, and playerCount');
        }

        if (playerCount < 2 || playerCount > 4) {
            throw new Error('Player count must be between 2 and 4');
        }
    }

    /**
     * Convert legacy algorithm config to new format
     */
    convertLegacyConfig(legacyConfig) {
        // Convert old unified system config to new widget-based config
        return {
            metadata: {
                name: legacyConfig.name || legacyConfig.metadata?.name,
                description: legacyConfig.description || legacyConfig.metadata?.description,
                playerCount: legacyConfig.playerCount || legacyConfig.metadata?.playerCount,
                goodsType: legacyConfig.goodsType || 'divisible',
                complexity: legacyConfig.complexity || {}
            },
            requiredWidgets: this.inferRequiredWidgets(legacyConfig),
            steps: legacyConfig.steps || [],
            handlers: {
                onInit: legacyConfig.onInit,
                onStart: legacyConfig.onStart,
                onMakeCut: legacyConfig.onMakeCut,
                onReset: legacyConfig.onReset
            }
        };
    }

    /**
     * Infer required widgets from legacy config
     */
    inferRequiredWidgets(legacyConfig) {
        const widgets = ['algorithm-selector', 'cake-visualization', 'instructions'];

        if (legacyConfig.playerCount >= 2) {
            widgets.push('player-input', 'action-buttons');
        }

        if (legacyConfig.complexity) {
            widgets.push('query-tracker');
        }

        return widgets;
    }

    // ===== LAYOUT MANAGEMENT =====

    /**
     * Switch to a different layout
     */
    async setLayout(layoutName, options = {}) {
        try {
            const startTime = performance.now();

            // Apply new layout
            await this.layoutManager.applyLayout(layoutName, {
                preserveWidgets: options.preserveWidgets !== false,
                ...options
            });

            // Track performance
            const switchTime = performance.now() - startTime;
            this.performanceMetrics.layoutSwitchTimes.set(layoutName, switchTime);

            console.log(`Layout switched to: ${layoutName} in ${switchTime.toFixed(2)}ms`);

            this.eventBus.emit('dashboard-layout-changed', {
                layoutName,
                switchTime
            });

        } catch (error) {
            console.error(`Failed to switch layout to ${layoutName}:`, error);
            this.performanceMetrics.errorCount++;
            throw error;
        }
    }

    /**
     * Get available layouts
     */
    getAvailableLayouts() {
        return this.layoutManager.getLayouts();
    }

    /**
     * Get current layout info
     */
    getCurrentLayout() {
        return this.layoutManager.getCurrentLayout();
    }

    // ===== EVENT HANDLERS =====

    /**
     * Handle widget creation requests
     */
    async handleWidgetCreationRequest(data) {
        const { widgetId, type, config, regionName } = data;
        try {
            await this.addWidget(widgetId, type, config, regionName);
        } catch (error) {
            console.error('Widget creation request failed:', error);
        }
    }

    /**
     * Handle widget removal requests
     */
    handleWidgetRemovalRequest(data) {
        const { widgetId } = data;
        this.removeWidget(widgetId);
    }

    /**
     * Handle algorithm selection changes
     */
    handleAlgorithmSelection(data) {
        const { algorithmId } = data;
        this.sessionData.algorithmsUsed.add(algorithmId);
        this.currentAlgorithm = algorithmId;

        console.log(`Algorithm selected: ${algorithmId}`);

        this.eventBus.emit('dashboard-algorithm-changed', {
            algorithmId,
            algorithm: this.algorithms.get(algorithmId)
        });
    }

    /**
     * Handle widget interactions for analytics
     */
    handleWidgetInteraction(data) {
        this.sessionData.interactions++;

        if (this.config.enableAnalytics) {
            // Track educational interactions
            this.trackEducationalInteraction(data);
        }
    }

    /**
     * Handle default widget placement requests from layouts
     */
    async handleDefaultWidgetRequest(data) {
        const { placements, layout } = data;

        for (const placement of placements) {
            const { region, widget } = placement;
            const widgetId = `${widget.type}-${region}-${Date.now()}`;

            try {
                await this.addWidget(widgetId, widget.type, widget.config, region);
            } catch (error) {
                console.warn(`Failed to place default widget ${widget.type} in ${region}:`, error);
            }
        }
    }

    /**
     * Handle widget drag-and-drop
     */
    handleWidgetDrop(data) {
        const { widgetId, targetRegion } = data;
        const widgetData = this.widgets.get(widgetId);

        if (widgetData && widgetData.region !== targetRegion) {
            this.layoutManager.moveWidget(
                widgetData.widget.element,
                widgetData.region,
                targetRegion
            );

            widgetData.region = targetRegion;

            this.eventBus.emit('widget-moved', {
                widgetId,
                fromRegion: widgetData.region,
                toRegion: targetRegion
            });
        }
    }

    /**
     * Handle algorithm step completion
     */
    handleAlgorithmStep(data) {
        // Track educational progress
        if (data.learningObjectives) {
            data.learningObjectives.forEach(objective => {
                this.sessionData.completedObjectives.add(objective);
            });
        }
    }

    /**
     * Handle learning objective completion
     */
    handleLearningObjective(data) {
        this.sessionData.completedObjectives.add(data.objective);

        this.eventBus.emit('dashboard-learning-progress', {
            completed: data.objective,
            totalCompleted: this.sessionData.completedObjectives.size,
            session: this.getSessionSummary()
        });
    }

    // ===== UTILITY METHODS =====

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `fd-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Track educational interactions
     */
    trackEducationalInteraction(data) {
        // Implementation for educational analytics
        // This could integrate with learning management systems
    }

    /**
     * Track state changes for analytics
     */
    trackStateChange(data) {
        if (this.config.enableAnalytics) {
            // Track significant state changes for learning analytics
        }
    }

    /**
     * Handle widget errors
     */
    handleWidgetError(data) {
        this.performanceMetrics.errorCount++;
        console.warn('Widget error:', data);
    }

    /**
     * Handle layout errors
     */
    handleLayoutError(data) {
        this.performanceMetrics.errorCount++;
        console.error('Layout error:', data);
    }

    /**
     * Show initialization error
     */
    showInitializationError(error) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="dashboard-error">
                    <h2>Dashboard Initialization Failed</h2>
                    <p>Unable to start the Fair Division Dashboard.</p>
                    <details>
                        <summary>Error Details</summary>
                        <pre>${error.message}</pre>
                    </details>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    // ===== PERSISTENCE =====

    /**
     * Save current dashboard state
     */
    saveState() {
        if (!this.config.enablePersistence || typeof localStorage === 'undefined') {
            return;
        }

        try {
            const state = {
                layout: this.getCurrentLayout()?.name,
                widgets: Array.from(this.widgets.entries()).map(([id, data]) => ({
                    id,
                    type: data.type,
                    config: data.config,
                    region: data.region
                })),
                currentAlgorithm: this.currentAlgorithm,
                sessionData: this.sessionData,
                savedAt: Date.now()
            };

            localStorage.setItem('fair-division-dashboard-state', JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save dashboard state:', error);
        }
    }

    /**
     * Load persisted dashboard state
     */
    async loadPersistedState() {
        if (typeof localStorage === 'undefined') return;

        try {
            const savedState = localStorage.getItem('fair-division-dashboard-state');
            if (!savedState) return;

            const state = JSON.parse(savedState);

            // Restore session data
            if (state.sessionData) {
                this.sessionData = {
                    ...this.sessionData,
                    ...state.sessionData,
                    startTime: Date.now() // Reset start time
                };
            }

            // Restore current algorithm
            if (state.currentAlgorithm) {
                this.currentAlgorithm = state.currentAlgorithm;
            }

            console.log('Dashboard state loaded from persistence');

        } catch (error) {
            console.warn('Failed to load persisted state:', error);
        }
    }

    /**
     * Load default widgets for the platform
     */
    async loadDefaultWidgets() {
        // This will be triggered by layout default widgets
        // Individual widgets will be loaded as needed
        console.log('Auto-loading default widgets enabled');
    }

    // ===== PUBLIC API =====

    /**
     * Get dashboard statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            widgetCount: this.widgets.size,
            algorithmCount: this.algorithms.size,
            currentLayout: this.getCurrentLayout()?.name,
            currentAlgorithm: this.currentAlgorithm,
            sessionData: this.getSessionSummary(),
            performance: this.performanceMetrics,
            widgetRegistry: this.widgetRegistry.getStats(),
            layoutManager: this.layoutManager.getStats()
        };
    }

    /**
     * Get session summary
     */
    getSessionSummary() {
        return {
            duration: Date.now() - this.sessionData.startTime,
            interactions: this.sessionData.interactions,
            algorithmsUsed: Array.from(this.sessionData.algorithmsUsed),
            learningObjectivesCompleted: Array.from(this.sessionData.completedObjectives),
            widgetsCreated: this.widgets.size
        };
    }

    /**
     * Export dashboard configuration
     */
    exportConfig() {
        return {
            layout: this.getCurrentLayout()?.name,
            widgets: this.widgetRegistry.exportConfig(),
            algorithms: Array.from(this.algorithms.entries()),
            config: this.config,
            stats: this.getStats()
        };
    }

    /**
     * Check if dashboard is ready
     */
    isReady() {
        return this.isInitialized && this.eventBus && this.widgetRegistry && this.layoutManager;
    }

    /**
     * Destroy dashboard and cleanup
     */
    destroy() {
        console.log('Destroying dashboard...');

        // Save state before destroying
        if (this.config.enablePersistence) {
            this.saveState();
        }

        // Destroy all widgets
        this.widgets.forEach((data, id) => {
            this.removeWidget(id);
        });

        // Destroy core systems
        if (this.layoutManager) {
            this.layoutManager.destroy();
        }

        if (this.widgetRegistry) {
            this.widgetRegistry.destroy();
        }

        if (this.eventBus) {
            this.eventBus.destroy();
        }

        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
            this.container.className = 'dashboard-container destroyed';
        }

        // Clear references
        this.widgets.clear();
        this.algorithms.clear();
        this.isInitialized = false;

        console.log('Dashboard destroyed');
    }

    processQueuedWidgetRegistrations() {
        if (window.FairDivisionDashboard && window.FairDivisionDashboard.widgetRegistrationQueue) {
            window.FairDivisionDashboard.widgetRegistrationQueue.forEach(({ type, factory, metadata }) => {
                try {
                    this.widgetRegistry.registerWidget(type, factory, metadata);
                    console.log(`Successfully registered queued widget: ${type}`);
                } catch (error) {
                    console.error(`Failed to register queued widget ${type}:`, error);
                }
            });
            // Clear the queue
            window.FairDivisionDashboard.widgetRegistrationQueue = [];
        }
    }
}

// When dashboard is initialized (modify your dashboard initialization code):
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize dashboard
        window.dashboardInstance = new Dashboard('unified-demo-container');

        // Make sure the instance is available for widget registration
        window.FairDivisionDashboard.dashboardInstance = window.dashboardInstance;

        console.log('Dashboard initialized and available for widget registration');

    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
} else {
    window.Dashboard = Dashboard;
}
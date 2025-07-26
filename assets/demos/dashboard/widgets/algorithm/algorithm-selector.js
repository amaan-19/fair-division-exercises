/**
 * Algorithm Selector Widget
 *
 * Enhanced dropdown for selecting fair division algorithms with educational categorization,
 * algorithm metadata display, and seamless integration with the modular dashboard system.
 */

class AlgorithmSelectorWidget extends Widget {
    constructor(id, config = {}) {
        super(id, {
            type: 'algorithm-selector',
            title: config.title || 'Algorithm Selection',
            category: 'algorithm',
            resizable: false,
            collapsible: false,
            ...config
        });

        // Algorithm selector specific state
        this.state = {
            selectedAlgorithm: null,
            availableAlgorithms: new Map(),
            categories: new Map(),
            isLoading: false,
            showMetadata: config.showMetadata !== false,
            showComplexity: config.showComplexity !== false
        };

        // Educational context
        this.learningObjectives = [
            'Understand different approaches to fair division',
            'Compare algorithm complexities and properties',
            'Select appropriate algorithms for different scenarios'
        ];

        // Performance tracking
        this.selectionHistory = [];
    }

    /**
     * Widget-specific initialization
     */
    async onInitialize() {
        // Listen for algorithm registration events
        this.subscribe('algorithm-registered', this.handleAlgorithmRegistered.bind(this));
        this.subscribe('dashboard-algorithm-changed', this.handleGlobalAlgorithmChange.bind(this));

        // Listen for widget registry updates
        this.subscribe('widget-registry-cleared', this.handleRegistryCleared.bind(this));

        // Load existing algorithms from dashboard
        this.loadExistingAlgorithms();
    }

    /**
     * Get widget content template
     */
    getContentTemplate() {
        return `
            <div class="algorithm-selector-container">
                <div class="selector-header">
                    <div class="algorithm-info" id="${this.id}-algorithm-info">
                        <h3 class="algorithm-name" id="${this.id}-algorithm-name">
                            Select Algorithm
                        </h3>
                        <p class="algorithm-description" id="${this.id}-algorithm-description">
                            Choose an algorithm to begin demonstration
                        </p>
                        ${this.state.showComplexity ? `
                            <div class="algorithm-complexity" id="${this.id}-complexity" style="display: none;">
                                <span class="complexity-badge">
                                    <span class="complexity-label">Complexity:</span>
                                    <span class="complexity-value" id="${this.id}-complexity-value">-</span>
                                </span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="selector-controls">
                    <div class="dropdown-container">
                        <select class="algorithm-dropdown" id="${this.id}-dropdown">
                            <option value="">Select an algorithm...</option>
                        </select>
                        <div class="dropdown-icon">▼</div>
                    </div>
                    
                    ${this.state.showMetadata ? `
                        <button class="metadata-toggle" id="${this.id}-metadata-toggle" 
                                title="Show algorithm details" style="display: none;">
                            ℹ️
                        </button>
                    ` : ''}
                </div>

                <div class="algorithm-metadata" id="${this.id}-metadata" style="display: none;">
                    <div class="metadata-content">
                        <div class="metadata-section">
                            <h4>Algorithm Properties</h4>
                            <div class="properties-grid" id="${this.id}-properties">
                                <!-- Properties will be populated dynamically -->
                            </div>
                        </div>
                        
                        <div class="metadata-section">
                            <h4>Educational Context</h4>
                            <div class="educational-info" id="${this.id}-educational">
                                <!-- Educational info will be populated dynamically -->
                            </div>
                        </div>
                    </div>
                </div>

                ${this.state.isLoading ? `
                    <div class="loading-indicator">
                        <div class="loading-spinner"></div>
                        <span>Loading algorithms...</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Setup widget-specific content after render
     */
    setupWidgetContent() {
        // Get DOM elements
        this.dropdown = this.element.querySelector(`#${this.id}-dropdown`);
        this.algorithmName = this.element.querySelector(`#${this.id}-algorithm-name`);
        this.algorithmDescription = this.element.querySelector(`#${this.id}-algorithm-description`);
        this.complexityDisplay = this.element.querySelector(`#${this.id}-complexity`);
        this.complexityValue = this.element.querySelector(`#${this.id}-complexity-value`);
        this.metadataToggle = this.element.querySelector(`#${this.id}-metadata-toggle`);
        this.metadataPanel = this.element.querySelector(`#${this.id}-metadata`);
        this.propertiesGrid = this.element.querySelector(`#${this.id}-properties`);
        this.educationalInfo = this.element.querySelector(`#${this.id}-educational`);

        // Setup event listeners
        this.setupEventListeners();

        // Initial population
        this.populateDropdown();
    }

    /**
     * Setup event listeners for the widget
     */
    setupEventListeners() {
        // Dropdown selection change
        if (this.dropdown) {
            this.dropdown.addEventListener('change', (e) => {
                this.handleAlgorithmSelection(e.target.value);
            });
        }

        // Metadata toggle
        if (this.metadataToggle) {
            this.metadataToggle.addEventListener('click', () => {
                this.toggleMetadata();
            });
        }

        // Keyboard navigation support
        if (this.dropdown) {
            this.dropdown.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handleAlgorithmSelection(e.target.value);
                }
            });
        }
    }

    /**
     * Load existing algorithms from the dashboard
     */
    loadExistingAlgorithms() {
        if (!this.dashboardContext || !this.dashboardContext.dashboard) return;

        const dashboard = this.dashboardContext.dashboard;
        const algorithms = dashboard.algorithms;

        if (algorithms && algorithms.size > 0) {
            this.setState({ isLoading: true });

            algorithms.forEach((algorithmData, algorithmId) => {
                this.addAlgorithm(algorithmId, algorithmData.config);
            });

            this.setState({ isLoading: false });
            this.populateDropdown();
        }
    }

    /**
     * Add an algorithm to the selector
     */
    addAlgorithm(algorithmId, config) {
        // Categorize algorithm
        const category = this.determineCategory(config);

        if (!this.state.categories.has(category.id)) {
            this.state.categories.set(category.id, category);
        }

        // Store algorithm data
        this.state.availableAlgorithms.set(algorithmId, {
            id: algorithmId,
            config,
            category: category.id,
            addedAt: Date.now()
        });

        // Update dropdown if already rendered
        if (this.dropdown) {
            this.populateDropdown();
        }
    }

    /**
     * Determine algorithm category based on config
     */
    determineCategory(config) {
        const goodsType = config.metadata?.goodsType || 'divisible';
        const playerCount = config.metadata?.playerCount || 2;

        // Define categories based on existing system
        const categoryMap = {
            'divisible': {
                id: 'divisible',
                name: 'Divisible Goods (Continuous)',
                description: 'Algorithms for infinitely divisible resources',
                icon: '🍰',
                priority: 1
            },
            'discrete-items': {
                id: 'discrete-items',
                name: 'Indivisible Goods (Discrete Items)',
                description: 'Algorithms for discrete, indivisible items',
                icon: '📦',
                priority: 2
            },
            'linear-arrangement': {
                id: 'linear-arrangement',
                name: 'Indivisible Goods (Linear Arrangement)',
                description: 'Algorithms for linearly arranged indivisible goods',
                icon: '📏',
                priority: 3
            }
        };

        return categoryMap[goodsType] || categoryMap['divisible'];
    }

    /**
     * Populate the dropdown with available algorithms
     */
    populateDropdown() {
        if (!this.dropdown) return;

        // Clear existing options except placeholder
        this.dropdown.innerHTML = '<option value="">Select an algorithm...</option>';

        // Group algorithms by category
        const categorizedAlgorithms = new Map();

        this.state.availableAlgorithms.forEach((algorithmData, algorithmId) => {
            const categoryId = algorithmData.category;
            if (!categorizedAlgorithms.has(categoryId)) {
                categorizedAlgorithms.set(categoryId, []);
            }
            categorizedAlgorithms.get(categoryId).push(algorithmData);
        });

        // Sort categories by priority
        const sortedCategories = Array.from(this.state.categories.values())
            .sort((a, b) => a.priority - b.priority);

        // Create optgroups for each category
        sortedCategories.forEach(category => {
            const algorithms = categorizedAlgorithms.get(category.id);
            if (!algorithms || algorithms.length === 0) return;

            const optgroup = document.createElement('optgroup');
            optgroup.label = category.name;

            // Sort algorithms within category by name
            algorithms.sort((a, b) =>
                (a.config.metadata?.name || a.id).localeCompare(b.config.metadata?.name || b.id)
            );

            algorithms.forEach(algorithmData => {
                const option = document.createElement('option');
                option.value = algorithmData.id;
                option.textContent = algorithmData.config.metadata?.name || algorithmData.id;

                // Add complexity info as title
                if (algorithmData.config.complexity) {
                    const complexity = algorithmData.config.complexity;
                    option.title = `Complexity: ${complexity.theoretical?.total || 'Unknown'} queries`;
                }

                optgroup.appendChild(option);
            });

            this.dropdown.appendChild(optgroup);
        });

        console.log(`Algorithm dropdown populated with ${this.state.availableAlgorithms.size} algorithms`);
    }

    /**
     * Handle algorithm selection
     */
    handleAlgorithmSelection(algorithmId) {
        if (!algorithmId) {
            this.clearSelection();
            return;
        }

        const algorithmData = this.state.availableAlgorithms.get(algorithmId);
        if (!algorithmData) {
            console.warn(`Algorithm not found: ${algorithmId}`);
            return;
        }

        // Update internal state
        this.setState({
            selectedAlgorithm: algorithmId
        });

        // Track selection for educational analytics
        this.selectionHistory.push({
            algorithmId,
            timestamp: Date.now(),
            sessionInteraction: this.interactionCount
        });

        // Update display
        this.updateAlgorithmDisplay(algorithmData);

        // Show metadata controls
        this.showMetadataControls(algorithmData);

        // Emit algorithm selection event
        this.emit('algorithm-selection-changed', {
            algorithmId,
            algorithmData,
            source: this.id
        });

        console.log(`Algorithm selected: ${algorithmId}`);
    }

    /**
     * Update the algorithm display information
     */
    updateAlgorithmDisplay(algorithmData) {
        const config = algorithmData.config;
        const metadata = config.metadata || {};

        // Update name and description
        if (this.algorithmName) {
            this.algorithmName.textContent = metadata.name || algorithmData.id;
        }

        if (this.algorithmDescription) {
            this.algorithmDescription.textContent = metadata.description || 'Algorithm description not available';
        }

        // Update complexity display
        if (this.complexityDisplay && this.complexityValue && config.complexity) {
            const complexity = config.complexity;
            let complexityText = '';

            if (complexity.theoretical) {
                const total = complexity.theoretical.total;
                const optimal = complexity.optimal ? ' (Optimal)' : '';
                complexityText = `${total} queries${optimal}`;
            } else {
                complexityText = 'Unknown';
            }

            this.complexityValue.textContent = complexityText;
            this.complexityDisplay.style.display = 'block';

            // Add optimality class
            this.complexityDisplay.className = `algorithm-complexity ${complexity.optimal ? 'optimal' : 'suboptimal'}`;
        }
    }

    /**
     * Show metadata controls and update metadata panel
     */
    showMetadataControls(algorithmData) {
        if (this.metadataToggle) {
            this.metadataToggle.style.display = 'inline-block';
        }

        // Populate metadata panel
        this.updateMetadataPanel(algorithmData);
    }

    /**
     * Update the metadata panel with algorithm information
     */
    updateMetadataPanel(algorithmData) {
        const config = algorithmData.config;
        const metadata = config.metadata || {};

        // Update properties grid
        if (this.propertiesGrid) {
            this.propertiesGrid.innerHTML = '';

            const properties = [
                { label: 'Player Count', value: metadata.playerCount || 'Unknown' },
                { label: 'Goods Type', value: this.formatGoodsType(metadata.goodsType) },
                { label: 'Fairness Properties', value: this.formatFairnessProperties(config) },
                { label: 'Author', value: metadata.author || 'System' },
                { label: 'Version', value: metadata.version || '1.0.0' }
            ];

            properties.forEach(prop => {
                const propElement = document.createElement('div');
                propElement.className = 'property-item';
                propElement.innerHTML = `
                    <span class="property-label">${prop.label}:</span>
                    <span class="property-value">${prop.value}</span>
                `;
                this.propertiesGrid.appendChild(propElement);
            });
        }

        // Update educational info
        if (this.educationalInfo) {
            const educational = config.educational || {};
            this.educationalInfo.innerHTML = `
                <div class="educational-item">
                    <strong>Learning Level:</strong> ${educational.level || 'General'}
                </div>
                <div class="educational-item">
                    <strong>Key Concepts:</strong> ${educational.concepts?.join(', ') || 'Fair division, Algorithm analysis'}
                </div>
                <div class="educational-item">
                    <strong>Complexity Class:</strong> ${config.complexity?.bounds || 'Standard'}
                </div>
            `;
        }
    }

    /**
     * Format goods type for display
     */
    formatGoodsType(goodsType) {
        const typeMap = {
            'divisible': 'Divisible (Continuous)',
            'discrete-items': 'Indivisible Items',
            'linear-arrangement': 'Linear Arrangement'
        };
        return typeMap[goodsType] || goodsType || 'Divisible';
    }

    /**
     * Format fairness properties for display
     */
    formatFairnessProperties(config) {
        const properties = [];

        if (config.fairness) {
            if (config.fairness.proportional) properties.push('Proportional');
            if (config.fairness.envyFree) properties.push('Envy-free');
            if (config.fairness.efficient) properties.push('Efficient');
        } else {
            // Default assumptions
            properties.push('Proportional');
        }

        return properties.length > 0 ? properties.join(', ') : 'Standard fairness';
    }

    /**
     * Toggle metadata panel visibility
     */
    toggleMetadata() {
        if (!this.metadataPanel) return;

        const isVisible = this.metadataPanel.style.display !== 'none';
        this.metadataPanel.style.display = isVisible ? 'none' : 'block';

        if (this.metadataToggle) {
            this.metadataToggle.textContent = isVisible ? 'ℹ️' : '✖️';
            this.metadataToggle.title = isVisible ? 'Show algorithm details' : 'Hide algorithm details';
        }

        this.emit('metadata-toggled', {
            visible: !isVisible,
            algorithmId: this.state.selectedAlgorithm
        });
    }

    /**
     * Clear algorithm selection
     */
    clearSelection() {
        this.setState({
            selectedAlgorithm: null
        });

        if (this.dropdown) {
            this.dropdown.value = '';
        }

        if (this.algorithmName) {
            this.algorithmName.textContent = 'Select Algorithm';
        }

        if (this.algorithmDescription) {
            this.algorithmDescription.textContent = 'Choose an algorithm to begin demonstration';
        }

        if (this.complexityDisplay) {
            this.complexityDisplay.style.display = 'none';
        }

        if (this.metadataToggle) {
            this.metadataToggle.style.display = 'none';
        }

        if (this.metadataPanel) {
            this.metadataPanel.style.display = 'none';
        }

        this.emit('algorithm-selection-cleared', { source: this.id });
    }

    // ===== EVENT HANDLERS =====

    /**
     * Handle algorithm registration from dashboard
     */
    handleAlgorithmRegistered(data) {
        const { algorithmId, config } = data;
        this.addAlgorithm(algorithmId, config);
    }

    /**
     * Handle global algorithm changes (from other sources)
     */
    handleGlobalAlgorithmChange(data) {
        const { algorithmId } = data;

        // Update selection if different from current
        if (algorithmId !== this.state.selectedAlgorithm) {
            if (this.dropdown) {
                this.dropdown.value = algorithmId || '';
            }
            this.handleAlgorithmSelection(algorithmId);
        }
    }

    /**
     * Handle widget registry cleared
     */
    handleRegistryCleared() {
        this.state.availableAlgorithms.clear();
        this.state.categories.clear();
        this.clearSelection();
        this.populateDropdown();
    }

    // ===== PUBLIC API =====

    /**
     * Programmatically select an algorithm
     */
    selectAlgorithm(algorithmId) {
        if (this.dropdown) {
            this.dropdown.value = algorithmId;
        }
        this.handleAlgorithmSelection(algorithmId);
    }

    /**
     * Get currently selected algorithm
     */
    getSelectedAlgorithm() {
        return this.state.selectedAlgorithm;
    }

    /**
     * Get available algorithms
     */
    getAvailableAlgorithms() {
        return Array.from(this.state.availableAlgorithms.keys());
    }

    /**
     * Get selection history for analytics
     */
    getSelectionHistory() {
        return [...this.selectionHistory];
    }

    // ===== WIDGET LIFECYCLE =====

    /**
     * Widget-specific update handler
     */
    onUpdate(data, previousState) {
        // Handle external state updates
        if (data.selectedAlgorithm && data.selectedAlgorithm !== previousState.selectedAlgorithm) {
            this.selectAlgorithm(data.selectedAlgorithm);
        }

        if (data.algorithms) {
            // Refresh algorithm list
            this.loadExistingAlgorithms();
        }
    }

    /**
     * Widget cleanup
     */
    onDestroy() {
        // Clear any pending timeouts or intervals
        // Remove additional event listeners if any
        console.log(`Algorithm selector widget ${this.id} destroyed`);
    }
}

// ===== WIDGET FACTORY AND REGISTRATION =====

/**
 * Factory function for creating Algorithm Selector widgets
 */
function createAlgorithmSelectorWidget(id, config = {}) {
    return new AlgorithmSelectorWidget(id, config);
}

function selfRegister() {
    // Register factory function
            const registry = window.WidgetRegistry || window.FairDivisionDashboard?.widgetRegistry;
            if (registry && typeof registry.registerFactory === 'function') {
                registry.registerFactory('algorithm-selector', createAlgorithmSelectorWidget, {
                    name: 'Algorithm Selector',
                    description: 'Dropdown for selecting fair division algorithms with educational metadata',
                    category: 'algorithm',
                    version: '1.0.0',
                    author: 'Fair Division Platform',
                    tags: ['selection', 'algorithm', 'educational'],
                    complexity: 'basic',
                    educational: {
                        level: 'undergraduate',
                        concepts: ['algorithm-selection', 'complexity-analysis']
                    },
                    preferredRegion: 'header',
                    icon: '🔧'
                });

                console.log('Algorithm Selector widget registered');
            }
}

// Auto-register with widget registry when available
this.eventBus.on('core-services-active', this.selfRegister());

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AlgorithmSelectorWidget, createAlgorithmSelectorWidget };
}
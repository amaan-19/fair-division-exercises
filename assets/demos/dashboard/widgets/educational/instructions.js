/**
 * Instructions Widget
 *
 * Dynamic instruction display widget for guiding users through fair division algorithms.
 * Provides contextual, step-by-step guidance with educational enhancements and accessibility features.
 */

class InstructionsWidget extends Widget {
    constructor(id, config = {}) {
        super(id, {
            type: 'instructions',
            title: config.title || 'Instructions',
            category: 'educational',
            resizable: false,
            collapsible: true,
            ...config
        });

        // Instructions-specific state
        this.state = {
            currentStep: 0,
            totalSteps: 0,
            currentAlgorithm: null,
            instructions: [],
            showProgress: config.showProgress !== false,
            showStepNumbers: config.showStepNumbers !== false,
            enableHistory: config.enableHistory !== false,
            animateTransitions: config.animateTransitions !== false
        };

        // Educational features
        this.learningObjectives = [
            'Follow step-by-step algorithm procedures',
            'Understand algorithm decision points',
            'Learn algorithm-specific terminology'
        ];

        // History tracking for educational analysis
        this.instructionHistory = [];
        this.stepDurations = [];
        this.lastStepStartTime = null;

        // Animation control
        this.animationQueue = [];
        this.isAnimating = false;
    }

    /**
     * Widget-specific initialization
     */
    async onInitialize() {
        // Listen for algorithm and step changes
        this.subscribe('algorithm-selection-changed', this.handleAlgorithmChanged.bind(this));
        this.subscribe('algorithm-step-changed', this.handleStepChanged.bind(this));
        this.subscribe('algorithm-reset', this.handleAlgorithmReset.bind(this));

        // Listen for instruction update requests
        this.subscribe('instructions-update-requested', this.handleInstructionUpdate.bind(this));
        this.subscribe('step-advance-requested', this.handleStepAdvance.bind(this));

        // Load default instructions
        this.loadDefaultInstructions();
    }

    /**
     * Get widget content template
     */
    getContentTemplate() {
        return `
            <div class="instructions-container">
                ${this.state.showProgress ? `
                    <div class="progress-header">
                        <div class="step-progress" id="${this.id}-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="${this.id}-progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="step-counter" id="${this.id}-step-counter">
                                <span class="current-step">1</span> / <span class="total-steps">1</span>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <div class="instruction-content" id="${this.id}-content">
                    <div class="step-indicator" id="${this.id}-step-indicator">
                        Ready to begin
                    </div>
                    
                    <div class="instruction-text" id="${this.id}-text">
                        <p class="instruction-message">Select an algorithm from the dropdown above to start.</p>
                    </div>

                    <div class="instruction-details" id="${this.id}-details" style="display: none;">
                        <div class="educational-context" id="${this.id}-educational">
                            <!-- Educational context will be populated dynamically -->
                        </div>
                        
                        <div class="algorithm-context" id="${this.id}-algorithm-context">
                            <!-- Algorithm-specific context will be populated dynamically -->
                        </div>
                    </div>
                </div>

                <div class="instruction-controls" id="${this.id}-controls" style="display: none;">
                    <button class="instruction-btn secondary" id="${this.id}-prev-btn" disabled>
                        ← Previous
                    </button>
                    <button class="instruction-btn primary" id="${this.id}-next-btn">
                        Next →
                    </button>
                    <button class="instruction-btn help" id="${this.id}-help-btn" title="Show additional help">
                        ?
                    </button>
                </div>

                ${this.state.enableHistory ? `
                    <div class="instruction-history" id="${this.id}-history" style="display: none;">
                        <h4>Step History</h4>
                        <div class="history-list" id="${this.id}-history-list">
                            <!-- History items will be populated dynamically -->
                        </div>
                    </div>
                ` : ''}

                <div class="instruction-footer">
                    <div class="help-text">
                        <small>💡 Tip: Click on highlighted terms for definitions</small>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup widget-specific content after render
     */
    setupWidgetContent() {
        // Get DOM elements
        this.progressFill = this.element.querySelector(`#${this.id}-progress-fill`);
        this.stepCounter = this.element.querySelector(`#${this.id}-step-counter`);
        this.stepIndicator = this.element.querySelector(`#${this.id}-step-indicator`);
        this.instructionText = this.element.querySelector(`#${this.id}-text`);
        this.instructionDetails = this.element.querySelector(`#${this.id}-details`);
        this.educationalContext = this.element.querySelector(`#${this.id}-educational`);
        this.algorithmContext = this.element.querySelector(`#${this.id}-algorithm-context`);
        this.controls = this.element.querySelector(`#${this.id}-controls`);
        this.prevBtn = this.element.querySelector(`#${this.id}-prev-btn`);
        this.nextBtn = this.element.querySelector(`#${this.id}-next-btn`);
        this.helpBtn = this.element.querySelector(`#${this.id}-help-btn`);
        this.historyPanel = this.element.querySelector(`#${this.id}-history`);
        this.historyList = this.element.querySelector(`#${this.id}-history-list`);

        // Setup event listeners
        this.setupEventListeners();

        // Initial render
        this.renderCurrentInstruction();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousStep());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }

        // Help button
        if (this.helpBtn) {
            this.helpBtn.addEventListener('click', () => this.toggleHelp());
        }

        // Keyboard navigation
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && !this.prevBtn?.disabled) {
                this.previousStep();
            } else if (e.key === 'ArrowRight' && !this.nextBtn?.disabled) {
                this.nextStep();
            } else if (e.key === 'h' || e.key === 'H') {
                this.toggleHelp();
            }
        });

        // Make element focusable for keyboard navigation
        if (!this.element.hasAttribute('tabindex')) {
            this.element.setAttribute('tabindex', '0');
        }
    }

    /**
     * Load default instructions for no algorithm selected
     */
    loadDefaultInstructions() {
        this.state.instructions = [
            {
                step: 0,
                title: 'Welcome to Fair Division Algorithms',
                content: 'Select an algorithm from the dropdown above to start learning about fair division procedures.',
                educational: {
                    concepts: ['algorithm-selection', 'fair-division'],
                    level: 'introductory'
                },
                help: 'Fair division algorithms help divide resources fairly among multiple parties. Each algorithm has different properties and guarantees.'
            }
        ];

        this.setState({
            currentStep: 0,
            totalSteps: 1
        });
    }

    /**
     * Render the current instruction
     */
    renderCurrentInstruction() {
        const instruction = this.getCurrentInstruction();
        if (!instruction) return;

        // Update step indicator
        if (this.stepIndicator) {
            this.stepIndicator.textContent = instruction.title || `Step ${this.state.currentStep + 1}`;
            this.stepIndicator.className = `step-indicator ${instruction.type || 'info'}`;
        }

        // Update instruction text with animation
        if (this.instructionText) {
            if (this.state.animateTransitions && !this.isAnimating) {
                this.animateTextChange(instruction.content);
            } else {
                this.instructionText.innerHTML = this.formatInstructionContent(instruction.content);
            }
        }

        // Update progress if enabled
        this.updateProgress();

        // Update controls
        this.updateControls();

        // Update educational context
        this.updateEducationalContext(instruction);

        // Track step timing
        this.trackStepTiming();

        // Emit step change event
        this.emit('instruction-step-displayed', {
            step: this.state.currentStep,
            instruction,
            algorithmId: this.state.currentAlgorithm
        });
    }

    /**
     * Get current instruction object
     */
    getCurrentInstruction() {
        return this.state.instructions[this.state.currentStep] || this.state.instructions[0];
    }

    /**
     * Format instruction content with educational enhancements
     */
    formatInstructionContent(content) {
        if (!content) return '';

        // Convert markdown-like formatting
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');

        // Add educational term highlighting (adapt from existing system)
        formatted = this.highlightEducationalTerms(formatted);

        return `<p class="instruction-message">${formatted}</p>`;
    }

    /**
     * Highlight educational terms for interactive learning
     */
    highlightEducationalTerms(content) {
        const terms = {
            'proportional': 'Each player receives at least 1/n of the total value by their own valuation',
            'envy-free': 'No player prefers another player\'s allocation to their own',
            'cut': 'A division point in the resource being divided',
            'evaluation': 'Determining the value of a piece according to a player\'s preferences',
            'divider': 'The player who makes the initial cut in divide-and-choose',
            'chooser': 'The player who selects their preferred piece'
        };

        Object.entries(terms).forEach(([term, definition]) => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            content = content.replace(regex,
                `<span class="educational-term" title="${definition}" data-term="${term}">${term}</span>`
            );
        });

        return content;
    }

    /**
     * Animate text changes for smooth transitions
     */
    animateTextChange(newContent) {
        if (!this.instructionText || this.isAnimating) return;

        this.isAnimating = true;

        // Fade out
        this.instructionText.style.transition = 'opacity 0.2s ease-out';
        this.instructionText.style.opacity = '0';

        setTimeout(() => {
            // Update content
            this.instructionText.innerHTML = this.formatInstructionContent(newContent);

            // Fade in
            this.instructionText.style.opacity = '1';

            setTimeout(() => {
                this.isAnimating = false;
                this.instructionText.style.transition = '';
            }, 200);
        }, 200);
    }

    /**
     * Update progress display
     */
    updateProgress() {
        if (!this.state.showProgress) return;

        const progressPercentage = this.state.totalSteps > 0
            ? ((this.state.currentStep + 1) / this.state.totalSteps) * 100
            : 0;

        if (this.progressFill) {
            this.progressFill.style.width = `${progressPercentage}%`;
        }

        if (this.stepCounter) {
            const currentElement = this.stepCounter.querySelector('.current-step');
            const totalElement = this.stepCounter.querySelector('.total-steps');

            if (currentElement) currentElement.textContent = this.state.currentStep + 1;
            if (totalElement) totalElement.textContent = this.state.totalSteps;
        }
    }

    /**
     * Update navigation controls
     */
    updateControls() {
        if (!this.controls) return;

        const hasMultipleSteps = this.state.totalSteps > 1;
        const isFirstStep = this.state.currentStep === 0;
        const isLastStep = this.state.currentStep >= this.state.totalSteps - 1;

        // Show/hide controls based on step count
        this.controls.style.display = hasMultipleSteps ? 'flex' : 'none';

        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = isFirstStep;
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = isLastStep;
            this.nextBtn.textContent = isLastStep ? 'Complete' : 'Next →';
        }
    }

    /**
     * Update educational context display
     */
    updateEducationalContext(instruction) {
        if (!instruction.educational || !this.educationalContext) return;

        const educational = instruction.educational;

        this.educationalContext.innerHTML = `
            <div class="context-item">
                <strong>Learning Level:</strong> ${educational.level || 'General'}
            </div>
            <div class="context-item">
                <strong>Key Concepts:</strong> ${educational.concepts?.join(', ') || 'Algorithm execution'}
            </div>
            ${educational.objectives ? `
                <div class="context-item">
                    <strong>Step Objective:</strong> ${educational.objectives}
                </div>
            ` : ''}
        `;

        // Show details if there's educational content
        if (this.instructionDetails) {
            this.instructionDetails.style.display = 'block';
        }
    }

    /**
     * Track step timing for educational analytics
     */
    trackStepTiming() {
        const now = Date.now();

        if (this.lastStepStartTime) {
            const duration = now - this.lastStepStartTime;
            this.stepDurations.push({
                step: this.state.currentStep - 1,
                duration,
                timestamp: now
            });
        }

        this.lastStepStartTime = now;
    }

    /**
     * Navigate to previous step
     */
    previousStep() {
        if (this.state.currentStep > 0) {
            this.setState({
                currentStep: this.state.currentStep - 1
            });
            this.renderCurrentInstruction();
            this.addToHistory('previous');
        }
    }

    /**
     * Navigate to next step
     */
    nextStep() {
        if (this.state.currentStep < this.state.totalSteps - 1) {
            this.setState({
                currentStep: this.state.currentStep + 1
            });
            this.renderCurrentInstruction();
            this.addToHistory('next');
        } else {
            // Last step - emit completion event
            this.emit('instruction-sequence-completed', {
                algorithmId: this.state.currentAlgorithm,
                totalSteps: this.state.totalSteps,
                duration: this.getTotalDuration()
            });
        }
    }

    /**
     * Toggle help display
     */
    toggleHelp() {
        const instruction = this.getCurrentInstruction();
        if (!instruction || !instruction.help) return;

        // Create or toggle help popup
        let helpPopup = this.element.querySelector('.help-popup');

        if (helpPopup) {
            helpPopup.remove();
        } else {
            helpPopup = document.createElement('div');
            helpPopup.className = 'help-popup';
            helpPopup.innerHTML = `
                <div class="help-content">
                    <button class="help-close">×</button>
                    <h4>Additional Help</h4>
                    <p>${instruction.help}</p>
                </div>
            `;

            this.element.appendChild(helpPopup);

            // Close button
            helpPopup.querySelector('.help-close').addEventListener('click', () => {
                helpPopup.remove();
            });
        }
    }

    /**
     * Add action to history
     */
    addToHistory(action) {
        if (!this.state.enableHistory) return;

        this.instructionHistory.push({
            step: this.state.currentStep,
            action,
            timestamp: Date.now(),
            instruction: this.getCurrentInstruction()?.title
        });

        this.updateHistoryDisplay();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        if (!this.historyList) return;

        const recentHistory = this.instructionHistory.slice(-5); // Show last 5 actions

        this.historyList.innerHTML = recentHistory.map(item => `
            <div class="history-item">
                <span class="history-action">${item.action}</span>
                <span class="history-step">Step ${item.step + 1}</span>
                <span class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
        `).join('');
    }

    /**
     * Get total session duration
     */
    getTotalDuration() {
        if (this.stepDurations.length === 0) return 0;
        return this.stepDurations.reduce((total, step) => total + step.duration, 0);
    }

    // ===== EVENT HANDLERS =====

    /**
     * Handle algorithm change
     */
    handleAlgorithmChanged(data) {
        const { algorithmId, algorithmData } = data;

        if (algorithmId && algorithmData) {
            this.loadAlgorithmInstructions(algorithmId, algorithmData);
        } else {
            this.loadDefaultInstructions();
        }

        this.setState({
            currentAlgorithm: algorithmId,
            currentStep: 0
        });

        this.renderCurrentInstruction();
    }

    /**
     * Load instructions for a specific algorithm
     */
    loadAlgorithmInstructions(algorithmId, algorithmData) {
        const config = algorithmData.config;

        // Extract instructions from algorithm config
        let instructions = [];

        if (config.steps && config.steps.length > 0) {
            // Convert algorithm steps to instruction format
            instructions = config.steps.map((step, index) => ({
                step: index,
                title: step.title || `Step ${index + 1}`,
                content: step.instructions || step.description || 'Proceed with the algorithm step.',
                type: step.type || 'action',
                educational: {
                    concepts: step.concepts || [],
                    level: config.educational?.level || 'undergraduate',
                    objectives: step.objectives
                },
                help: step.help || step.tooltip,
                algorithmSpecific: true
            }));
        } else {
            // Create default instructions for algorithms without step definitions
            instructions = [
                {
                    step: 0,
                    title: `${config.metadata?.name || algorithmId} Setup`,
                    content: `You are about to run the ${config.metadata?.name || algorithmId} algorithm. This algorithm divides resources among ${config.metadata?.playerCount || 2} players.`,
                    educational: {
                        concepts: ['algorithm-setup', 'fair-division'],
                        level: config.educational?.level || 'undergraduate'
                    },
                    help: config.metadata?.description
                },
                {
                    step: 1,
                    title: 'Begin Algorithm',
                    content: 'Click the Start button to begin the algorithm demonstration.',
                    educational: {
                        concepts: ['algorithm-execution'],
                        level: config.educational?.level || 'undergraduate'
                    }
                }
            ];
        }

        this.state.instructions = instructions;
        this.setState({
            totalSteps: instructions.length
        });
    }

    /**
     * Handle step change from external source
     */
    handleStepChanged(data) {
        const { step } = data;
        if (typeof step === 'number' && step >= 0 && step < this.state.totalSteps) {
            this.setState({
                currentStep: step
            });
            this.renderCurrentInstruction();
        }
    }

    /**
     * Handle algorithm reset
     */
    handleAlgorithmReset() {
        this.setState({
            currentStep: 0
        });
        this.renderCurrentInstruction();
        this.stepDurations = [];
        this.lastStepStartTime = Date.now();
    }

    /**
     * Handle instruction update requests
     */
    handleInstructionUpdate(data) {
        const { content, step } = data;

        if (step !== undefined && this.state.instructions[step]) {
            this.state.instructions[step].content = content;
            if (step === this.state.currentStep) {
                this.renderCurrentInstruction();
            }
        } else if (content) {
            // Update current step content
            const currentInstruction = this.getCurrentInstruction();
            if (currentInstruction) {
                currentInstruction.content = content;
                this.renderCurrentInstruction();
            }
        }
    }

    /**
     * Handle step advance requests
     */
    handleStepAdvance() {
        this.nextStep();
    }

    // ===== PUBLIC API =====

    /**
     * Update instruction content
     */
    updateInstruction(content, step = null) {
        this.emit('instructions-update-requested', { content, step });
    }

    /**
     * Advance to next step
     */
    advanceStep() {
        this.nextStep();
    }

    /**
     * Go to specific step
     */
    goToStep(step) {
        if (step >= 0 && step < this.state.totalSteps) {
            this.setState({
                currentStep: step
            });
            this.renderCurrentInstruction();
            this.addToHistory(`jump-to-${step}`);
        }
    }

    /**
     * Get current step number
     */
    getCurrentStep() {
        return this.state.currentStep;
    }

    /**
     * Get step analytics
     */
    getStepAnalytics() {
        return {
            currentStep: this.state.currentStep,
            totalSteps: this.state.totalSteps,
            stepDurations: [...this.stepDurations],
            totalDuration: this.getTotalDuration(),
            history: [...this.instructionHistory]
        };
    }

    // ===== WIDGET LIFECYCLE =====

    /**
     * Widget-specific update handler
     */
    onUpdate(data, previousState) {
        if (data.instructions && data.instructions !== previousState.instructions) {
            this.renderCurrentInstruction();
        }

        if (data.currentStep !== undefined && data.currentStep !== previousState.currentStep) {
            this.renderCurrentInstruction();
        }
    }

    /**
     * Widget cleanup
     */
    onDestroy() {
        // Clean up any timers or intervals
        this.stepDurations = [];
        this.instructionHistory = [];
        console.log(`Instructions widget ${this.id} destroyed`);
    }
}

// ===== WIDGET FACTORY AND REGISTRATION =====

/**
 * Factory function for creating Instructions widgets
 */
function createInstructionsWidget(id, config = {}) {
    return new InstructionsWidget(id, config);
}

// Auto-register with widget registry when available
if (typeof window !== 'undefined') {
    // Try immediate registration if dashboard is already available
    const tryRegister = () => {
        if (window.Dashboard && window.Dashboard.getInstance) {
            const dashboard = window.Dashboard.getInstance();
            if (dashboard && dashboard.widgetRegistry) {
                dashboard.widgetRegistry.registerFactory('instructions', createInstructionsWidget, {
                    name: 'Instructions',
                    description: 'Dynamic instruction display for algorithm guidance',
                    category: 'educational',
                    version: '1.0.0',
                    author: 'Fair Division Platform',
                    tags: ['instructions', 'guidance', 'educational', 'steps'],
                    complexity: 'basic',
                    educational: {
                        level: 'undergraduate',
                        concepts: ['algorithm-execution', 'step-guidance']
                    },
                    preferredRegion: 'sidebar',
                    icon: '📋'
                });

                console.log('✓ Instructions widget registered');
                return true;
            }
        }
        return false;
    };

    // Try immediate registration
    if (!tryRegister()) {
        // Listen for dashboard ready event
        window.addEventListener('dashboard-ready', () => {
            tryRegister();
        });

        // Fallback: wait for DOM and try again
        document.addEventListener('DOMContentLoaded', () => {
            if (!tryRegister()) {
                // Try again after a short delay
                setTimeout(() => {
                    if (!tryRegister()) {
                        console.warn('Failed to register Instructions widget - Dashboard not found');
                    }
                }, 100);
            }
        });
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InstructionsWidget, createInstructionsWidget };
}
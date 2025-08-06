/**
 * Enhanced Flowchart System - Main Controller
 * Handles orchestration and high-level logic
 */

class EnhancedFlowchart {
    constructor(containerId, algorithmData) {
        this.container = document.getElementById(containerId);
        this.data = algorithmData;
        this.queryCount = { cut: 0, evalQueries: 0 };
        this.currentStep = 0;
        this.isAnimating = false;
        this.runningTotals = { cut: 0, evalQueries: 0 };

        // Initialize components
        this.templateManager = new FlowchartTemplateManager();
        this.animator = new FlowchartAnimator(this);
        this.queryManager = new QueryManager(this);
        this.stateManager = new FlowchartStateManager(this);

        if (this.container) {
            console.log('Initializing enhanced flowchart for:', containerId);
            this.init();
            this.container.enhancedFlowchart = this;
        } else {
            console.error('Container not found:', containerId);
        }
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.stateManager.initializeEmptyState();
    }

    render() {
        const renderedHTML = this.templateManager.renderFlowchart(this.data);
        this.container.innerHTML = renderedHTML;
        console.log('Enhanced flowchart rendered with empty initial state');
    }

    // Delegate animation methods to animator
    async animateSteps(speed = 1000) {
        return this.animator.animateSteps(speed);
    }

    resetAnimation() {
        this.stateManager.resetAnimation();
    }

    // Delegate event handling
    attachEventListeners() {
        this.container.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('query-badge-enhanced')) {
                this.queryManager.highlightQueries(e.target);
            }
        }, true);

        this.container.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('query-badge-enhanced')) {
                this.queryManager.unhighlightQueries();
            }
        }, true);

        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('query-badge-enhanced')) {
                this.queryManager.animateQuery(e.target);
            }
        });
    }
}
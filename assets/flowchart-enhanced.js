// Enhanced Flowchart System for Fair Division Algorithms

class EnhancedFlowchart {
    constructor(containerId, algorithmData) {
        this.container = document.getElementById(containerId);
        this.data = algorithmData;
        this.queryCount = { cut: 0, evalQueries: 0 }; // Changed from eval to evalQueries
        this.currentStep = 0;
        this.isAnimating = false;
        this.runningTotals = { cut: 0, evalQueries: 0 }; // Changed from eval to evalQueries

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
        this.initializeEmptyState();
    }

    render() {
        const { algorithm, steps, complexity } = this.data;

        this.container.innerHTML = `
            <div class="algorithm-flowchart-enhanced">
                <div class="flowchart-header-enhanced">
                    <div class="flowchart-title-enhanced">${algorithm.name}</div>
                </div>
                
                <div class="flowchart-content-enhanced">
                    <div class="flowchart-steps-enhanced">
                        ${this.renderSteps(steps)}
                    </div>
                    
                    <div class="complexity-sidebar-enhanced empty-state">
                        <div class="sidebar-title-enhanced">Query Complexity</div>
                        <div class="query-metric-enhanced cut-metric">
                            <span class="metric-label-enhanced">Cut Queries:</span>
                            <span class="metric-value-enhanced" id="cut-count-${this.container.id}">0</span>
                        </div>
                        <div class="query-metric-enhanced eval-metric">
                            <span class="metric-label-enhanced">Eval Queries:</span>
                            <span class="metric-value-enhanced" id="eval-count-${this.container.id}">0</span>
                        </div>
                        <div class="total-complexity-enhanced">
                            <span class="total-label-enhanced">Total:</span>
                            <span class="total-value-enhanced" id="total-count-${this.container.id}">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        console.log('Enhanced flowchart rendered with empty initial state');
    }

    renderSteps(steps) {
        return steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            let stepHtml = this.renderStep(step, index);
            let connectorHtml = '';

            if (!isLast) {
                if (step.branches) {
                    connectorHtml = this.renderBranches(step.branches);
                } else {
                    connectorHtml = this.renderConnector();
                }
            }

            return stepHtml + connectorHtml;
        }).join('');
    }

    renderStep(step, index) {
        const queryBadge = this.renderQueryBadge(step.queries);
        const tooltip = this.renderTooltip(step.queries);

        return `
            <div class="flow-step-enhanced step-${step.type}" data-step="${index}">
                <div class="step-content-enhanced">
                    <div class="step-text">
                        ${step.title ? `<strong>${step.title}:</strong><br>` : ''}
                        ${step.description}
                    </div>
                </div>
                ${queryBadge}
                ${tooltip}
            </div>
        `;
    }

    renderQueryBadge(queries) {
        if (!queries || (!queries.cut && !queries.evalQueries)) return '';

        const cut = queries.cut || 0;
        const evalQueries = queries.evalQueries || 0;

        let badgeClass = '';
        let badgeText = '';

        if (cut > 0 && evalQueries > 0) {
            badgeClass = 'mixed';
            badgeText = `${cut}+${evalQueries}`;
        } else if (cut > 0) {
            badgeClass = 'cut';
            badgeText = `C${cut}`;
        } else if (evalQueries > 0) {
            badgeClass = 'eval';
            badgeText = `E${evalQueries}`;
        }

        return `<div class="query-badge-enhanced ${badgeClass}" data-queries='${JSON.stringify(queries)}'>${badgeText}</div>`;
    }

    renderTooltip(queries) {
        if (!queries || (!queries.cut && !queries.evalQueries)) return '';

        const parts = [];
        if (queries.cut) parts.push(`${queries.cut} Cut Query${queries.cut > 1 ? 's' : ''}`);
        if (queries.evalQueries) parts.push(`${queries.evalQueries} Eval Query${queries.evalQueries > 1 ? 's' : ''}`);

        return `<div class="query-tooltip-enhanced">${parts.join(' + ')}</div>`;
    }

    renderConnector() {
        return `
            <div class="flow-connector-enhanced">
                <div class="connector-line-enhanced">
                    <div class="connector-arrow-enhanced"></div>
                </div>
            </div>
        `;
    }

    renderBranches(branches) {
        const branchHtml = branches.map(branch => `
            <div class="flow-branch-enhanced">
                <div class="branch-label-enhanced branch-${branch.condition.toLowerCase()}">
                    ${branch.label}
                    ${branch.probability ? `<br><small>${branch.probability}</small>` : ''}
                </div>
                <div class="branch-steps-enhanced">
                    ${this.renderBranchSteps(branch.steps)}
                </div>
            </div>
        `).join('');

        return `
            <div class="flow-branches-enhanced">
                <div class="branch-connector-enhanced"></div>
                ${branchHtml}
            </div>
        `;
    }

    renderBranchSteps(steps) {
        return steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const stepHtml = this.renderStep(step, `branch-${index}`);
            const connectorHtml = isLast ? '' : this.renderConnector();

            return stepHtml + connectorHtml;
        }).join('');
    }

    getOptimalityText(optimality) {
        const texts = {
            'optimal': 'Optimal',
            'suboptimal': 'Suboptimal',
            'unknown': 'Unknown'
        };
        return texts[optimality.toLowerCase()] || '❓ Unknown';
    }

    initializeEmptyState() {
        const allSteps = this.container.querySelectorAll('.flow-step-enhanced');
        const allConnectors = this.container.querySelectorAll('.flow-connector-enhanced');
        const branches = this.container.querySelectorAll('.flow-branches-enhanced');
        const flowchartContainer = this.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.container.querySelector('.flowchart-steps-enhanced');

        // Hide all steps
        allSteps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px) scale(0.95)';
            step.style.visibility = 'hidden';
        });

        allConnectors.forEach(connector => {
            connector.style.opacity = '0';
            connector.style.visibility = 'hidden';
        });

        branches.forEach(branch => {
            branch.style.opacity = '0';
            branch.style.visibility = 'hidden';
        });

        // Start with minimal container size
        if (flowchartContainer) {
            flowchartContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            flowchartContainer.style.minHeight = '200px'; // Minimal height
            flowchartContainer.style.overflow = 'hidden';
        }

        // Start with collapsed steps container
        if (stepsContainer) {
            stepsContainer.style.transition = 'all 0.6s ease';
            stepsContainer.style.minHeight = '0px';
            stepsContainer.style.maxHeight = '80px'; // Just enough for "ready" state
        }

        this.updateQueryCounterDisplay(0, 0, 0);
        this.showReadyState();
    }

    showReadyState() {
        const sidebar = this.container.querySelector('.complexity-sidebar-enhanced');
        if (sidebar) {
            sidebar.className = 'complexity-sidebar-enhanced ready-state';

            let readyIndicator = sidebar.querySelector('.ready-indicator');
            if (!readyIndicator) {
                readyIndicator = document.createElement('div');
                readyIndicator.className = 'ready-indicator';
                readyIndicator.innerHTML = 'Ready to animate';
                readyIndicator.style.cssText = `
                    text-align: center;
                    color: #3182ce;
                    font-weight: 600;
                    font-size: 0.8rem;
                    margin-top: 1rem;
                    padding: 0.5rem;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #3182ce;
                `;
                sidebar.appendChild(readyIndicator);
            }
        }
    }

    async animateSteps(speed = 1000) {
        if (this.isAnimating) {
            console.log('Animation already in progress');
            return;
        }

        console.log('Starting progressive animation with growing container');
        this.isAnimating = true;

        this.initializeEmptyState();
        this.resetSidebarToAnimationState();
        this.runningTotals = { cut: 0, evalQueries: 0 };

        // Start growing the container
        await this.startContainerGrowth();

        const mainSteps = this.container.querySelectorAll('.flowchart-steps-enhanced > .flow-step-enhanced');
        const mainConnectors = this.container.querySelectorAll('.flowchart-steps-enhanced > .flow-connector-enhanced');

        // Calculate expected height based on steps
        const expectedHeight = this.calculateExpectedHeight(mainSteps.length);
        await this.growContainerToHeight(expectedHeight);

        // Animate main flow steps
        for (let i = 0; i < mainSteps.length; i++) {
            const step = mainSteps[i];

            // Grow container for this step
            await this.growForStep(i, mainSteps.length);

            step.style.visibility = 'visible';
            step.style.opacity = '1';
            step.style.transform = 'translateY(0) scale(1)';
            step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

            await this.processStepQueries(step, speed);

            const nextElement = mainSteps[i].nextElementSibling;
            const hasBranches = nextElement && nextElement.classList.contains('flow-branches-enhanced');

            if (hasBranches) {
                // Grow container significantly for branches
                await this.growForBranches();

                setTimeout(() => {
                    nextElement.style.visibility = 'visible';
                    nextElement.style.opacity = '1';
                }, 600);

                await new Promise(resolve => setTimeout(resolve, speed));
                await this.animateBranchesWithCounting(nextElement, speed);
            } else {
                if (i < mainConnectors.length) {
                    setTimeout(() => {
                        const connector = mainConnectors[i];
                        if (connector) {
                            connector.style.visibility = 'visible';
                            connector.style.opacity = '1';
                        }
                    }, 400);
                }

                await new Promise(resolve => setTimeout(resolve, speed));
            }
        }

        // Final container adjustment
        await this.finalizeContainerSize();

        this.isAnimating = false;
        console.log('Progressive animation with growth completed');
        this.showCompletionState();
    }

    // NEW METHOD: Start container growth
    async startContainerGrowth() {
        const flowchartContainer = this.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            // Add growing animation class
            flowchartContainer.classList.add('growing-animation');

            // Start with minimal size
            flowchartContainer.style.minHeight = '200px';
            flowchartContainer.style.transform = 'scale(0.95)';

            // Begin growth
            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
                flowchartContainer.style.minHeight = '300px';
            }, 100);
        }

        if (stepsContainer) {
            stepsContainer.style.maxHeight = '120px';
        }

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // NEW METHOD: Calculate expected height
    calculateExpectedHeight(stepCount) {
        const baseHeight = 300; // Header + sidebar minimum
        const stepHeight = 140; // Approximate height per step including connector
        const branchHeight = 200; // Additional height for branches

        let totalHeight = baseHeight + (stepCount * stepHeight);

        // Add extra height if algorithm has branches
        if (this.data.steps.some(step => step.branches)) {
            totalHeight += branchHeight;
        }

        return Math.min(totalHeight, 1200); // Cap at reasonable max
    }

// NEW METHOD: Grow container to specific height
    async growContainerToHeight(targetHeight) {
        const flowchartContainer = this.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            flowchartContainer.style.minHeight = `${targetHeight}px`;
        }

        if (stepsContainer) {
            stepsContainer.style.maxHeight = `${targetHeight - 100}px`;
        }

        await new Promise(resolve => setTimeout(resolve, 400));
    }

// NEW METHOD: Grow for individual step
    async growForStep(stepIndex, totalSteps) {
        const flowchartContainer = this.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer && stepsContainer) {
            const progressRatio = (stepIndex + 1) / totalSteps;
            const currentHeight = parseInt(flowchartContainer.style.minHeight) || 300;
            const growthIncrement = 80; // Grow by 80px per step
            const newHeight = currentHeight + growthIncrement;

            flowchartContainer.style.minHeight = `${newHeight}px`;
            stepsContainer.style.maxHeight = `${newHeight - 100}px`;

            // Add a subtle scale pulse for each growth
            flowchartContainer.style.transform = 'scale(1.01)';
            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
            }, 200);
        }

        await new Promise(resolve => setTimeout(resolve, 200));
    }

// NEW METHOD: Grow for branches
    async growForBranches() {
        const flowchartContainer = this.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer && stepsContainer) {
            const currentHeight = parseInt(flowchartContainer.style.minHeight) || 500;
            const branchHeight = currentHeight + 300; // Significant growth for branches

            flowchartContainer.style.minHeight = `${branchHeight}px`;
            stepsContainer.style.maxHeight = `${branchHeight - 100}px`;

            // Dramatic scale effect for branches
            flowchartContainer.style.transform = 'scale(1.02)';
            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
            }, 400);
        }

        await new Promise(resolve => setTimeout(resolve, 400));
    }

// NEW METHOD: Finalize container size
    async finalizeContainerSize() {
        const flowchartContainer = this.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            // Remove height constraints to let content determine size
            flowchartContainer.style.minHeight = 'auto';
            flowchartContainer.style.maxHeight = 'none';
            flowchartContainer.classList.remove('growing-animation');

            // Final "completion" scale effect
            flowchartContainer.style.transform = 'scale(1.01)';
            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
            }, 300);
        }

        if (stepsContainer) {
            stepsContainer.style.maxHeight = 'none';
        }

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    async processStepQueries(step, speed) {
        const badge = step.querySelector('.query-badge-enhanced');
        if (badge && badge.dataset.queries) {
            try {
                const queries = JSON.parse(badge.dataset.queries);

                if (queries.cut) this.runningTotals.cut += parseInt(queries.cut) || 0;
                if (queries.evalQueries) this.runningTotals.evalQueries += parseInt(queries.evalQueries) || 0;

                setTimeout(() => {
                    badge.style.animation = 'queryPulse 0.8s ease-in-out';
                    badge.addEventListener('animationend', () => {
                        badge.style.animation = '';
                    }, { once: true });
                }, 300);

                await this.animateCounterUpdate(this.runningTotals.cut, this.runningTotals.evalQueries);
                this.highlightUpdatedMetrics(queries);

            } catch (e) {
                console.error('Error parsing query data:', e);
            }
        }
    }

    async animateCounterUpdate(newCut, newEvalQueries) {
        const cutElement = this.container.querySelector(`#cut-count-${this.container.id}`);
        const evalElement = this.container.querySelector(`#eval-count-${this.container.id}`);
        const totalElement = this.container.querySelector(`#total-count-${this.container.id}`);

        if (cutElement && evalElement && totalElement) {
            cutElement.style.animation = 'numberUpdate 0.6s ease-out';
            evalElement.style.animation = 'numberUpdate 0.6s ease-out';
            totalElement.style.animation = 'numberUpdate 0.6s ease-out';

            cutElement.textContent = newCut;
            evalElement.textContent = newEvalQueries;
            totalElement.textContent = newCut + newEvalQueries;

            await new Promise(resolve => setTimeout(resolve, 600));
        }
    }

    highlightUpdatedMetrics(queries) {
        if (queries.cut) {
            const cutMetric = this.container.querySelector('.cut-metric');
            if (cutMetric) {
                cutMetric.style.animation = 'metricHighlight 1s ease-out';
                setTimeout(() => { cutMetric.style.animation = ''; }, 1000);
            }
        }
        if (queries.evalQueries) {
            const evalMetric = this.container.querySelector('.eval-metric');
            if (evalMetric) {
                evalMetric.style.animation = 'metricHighlight 1s ease-out';
                setTimeout(() => { evalMetric.style.animation = ''; }, 1000);
            }
        }
    }

    async animateBranchesWithCounting(branchContainer, speed) {
        const branches = branchContainer.querySelectorAll('.flow-branch-enhanced');

        console.log(`Animating ${branches.length} branches with progressive counting`);

        for (let branchIndex = 0; branchIndex < branches.length; branchIndex++) {
            const branch = branches[branchIndex];
            const branchSteps = branch.querySelectorAll('.flow-step-enhanced');
            const branchConnectors = branch.querySelectorAll('.flow-connector-enhanced');

            console.log(`Branch ${branchIndex}: animating ${branchSteps.length} steps`);

            const branchStartTotals = { ...this.runningTotals };

            for (let i = 0; i < branchSteps.length; i++) {
                const step = branchSteps[i];

                step.style.visibility = 'visible';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0) scale(1)';
                step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

                await this.processStepQueries(step, speed);

                if (i < branchConnectors.length) {
                    setTimeout(() => {
                        const connector = branchConnectors[i];
                        if (connector) {
                            connector.style.visibility = 'visible';
                            connector.style.opacity = '1';
                        }
                    }, 400);
                }

                await new Promise(r => setTimeout(r, speed));
            }

            if (branchIndex < branches.length - 1) {
                this.runningTotals = branchStartTotals;
            }
        }
    }

    resetSidebarToAnimationState() {
        const sidebar = this.container.querySelector('.complexity-sidebar-enhanced');
        if (sidebar) {
            sidebar.className = 'complexity-sidebar-enhanced animating-state';

            const readyIndicator = sidebar.querySelector('.ready-indicator');
            if (readyIndicator) {
                readyIndicator.remove();
            }
        }
    }

    showCompletionState() {
        const sidebar = this.container.querySelector('.complexity-sidebar-enhanced');
        if (sidebar) {
            sidebar.className = 'complexity-sidebar-enhanced complete-state';

            const completionIndicator = document.createElement('div');
            completionIndicator.className = 'completion-indicator';
            completionIndicator.innerHTML = '✅ Animation complete';
            completionIndicator.style.cssText = `
                text-align: center;
                color: #38a169;
                font-weight: 600;
                font-size: 0.8rem;
                margin-top: 1rem;
                padding: 0.5rem;
                background: white;
                border-radius: 6px;
                border: 1px solid #38a169;
            `;
            sidebar.appendChild(completionIndicator);
        }
    }

    updateQueryCounterDisplay(cut, evalQueries, total) {
        const cutElement = this.container.querySelector(`#cut-count-${this.container.id}`);
        const evalElement = this.container.querySelector(`#eval-count-${this.container.id}`);
        const totalElement = this.container.querySelector(`#total-count-${this.container.id}`);

        if (cutElement) cutElement.textContent = cut;
        if (evalElement) evalElement.textContent = evalQueries;
        if (totalElement) totalElement.textContent = total;
    }

    resetAnimation() {
        console.log('Resetting to small container state');
        this.isAnimating = false;
        this.runningTotals = { cut: 0, evalQueries: 0 };

        // Reset container size immediately
        const flowchartContainer = this.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            flowchartContainer.classList.remove('growing-animation');
            flowchartContainer.style.transition = 'all 0.4s ease';
            flowchartContainer.style.minHeight = '200px';
            flowchartContainer.style.maxHeight = 'none';
            flowchartContainer.style.transform = 'scale(0.98)';

            // Quick scale back to normal
            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
            }, 100);
        }

        if (stepsContainer) {
            stepsContainer.style.maxHeight = '80px';
            stepsContainer.style.transition = 'all 0.4s ease';
        }

        // Remove completion indicator
        const completionIndicator = this.container.querySelector('.completion-indicator');
        if (completionIndicator) {
            completionIndicator.remove();
        }

        // Reset to empty state after container reset
        setTimeout(() => {
            this.initializeEmptyState();
        }, 200);
    }

    attachEventListeners() {
        this.container.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('query-badge-enhanced')) {
                this.highlightQueries(e.target);
            }
        }, true);

        this.container.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('query-badge-enhanced')) {
                this.unhighlightQueries();
            }
        }, true);

        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('query-badge-enhanced')) {
                this.animateQuery(e.target);
            }
        });
    }

    highlightQueries(badge) {
        try {
            const queries = JSON.parse(badge.dataset.queries);
            this.updateQueryCounter(queries, true);
        } catch (e) {
            console.error('Error parsing query data:', e);
        }
    }

    unhighlightQueries() {
        this.resetQueryCounter();
    }

    animateQuery(badge) {
        badge.style.animation = 'none';
        badge.offsetHeight;
        badge.style.animation = 'queryPulse 0.8s ease-in-out';

        const queries = JSON.parse(badge.dataset.queries || '{}');
        if (queries.cut) {
            const cutMetric = this.container.querySelector('.cut-metric');
            if (cutMetric) {
                cutMetric.style.animation = 'metricPulse 0.8s ease-in-out';
                setTimeout(() => { cutMetric.style.animation = ''; }, 800);
            }
        }
        if (queries.evalQueries) {
            const evalMetric = this.container.querySelector('.eval-metric');
            if (evalMetric) {
                evalMetric.style.animation = 'metricPulse 0.8s ease-in-out';
                setTimeout(() => { evalMetric.style.animation = ''; }, 800);
            }
        }
    }

    updateQueryCounter(queries, highlight = false) {
        const cutElement = this.container.querySelector(`#cut-count-${this.container.id}`);
        const evalElement = this.container.querySelector(`#eval-count-${this.container.id}`);

        if (highlight && cutElement && evalElement) {
            cutElement.style.color = queries.cut ? '#dc2626' : '#6b7280';
            evalElement.style.color = queries.evalQueries ? '#7c3aed' : '#6b7280';
            cutElement.style.fontWeight = queries.cut ? '900' : '700';
            evalElement.style.fontWeight = queries.evalQueries ? '900' : '700';
        } else {
            this.resetQueryCounter();
        }
    }

    resetQueryCounter() {
        const cutElement = this.container.querySelector(`#cut-count-${this.container.id}`);
        const evalElement = this.container.querySelector(`#eval-count-${this.container.id}`);

        if (cutElement) {
            cutElement.style.color = '#374151';
            cutElement.style.fontWeight = '700';
        }
        if (evalElement) {
            evalElement.style.color = '#374151';
            evalElement.style.fontWeight = '700';
        }
    }
}

// Algorithm data templates
const ALGORITHM_FLOWCHART_DATA = {
    'divide-and-choose': {
        algorithm: { name: 'Divide-and-Choose Procedure' },
        complexity: {
            cut: 1,
            evalQueries: 1,
            total: 2,
            display: 'Total Complexity: 2 queries (Optimal)',
            optimality: 'optimal'
        },
        steps: [
            {
                type: 'start',
                title: 'Start',
                description: 'Two players want to fairly divide a cake'
            },
            {
                type: 'query',
                title: 'Player 1 (Divider)',
                description: 'Cut the cake into two pieces you value equally',
                queries: { cut: 1 }
            },
            {
                type: 'query',
                title: 'Player 2 (Chooser)',
                description: 'Evaluate both pieces and choose your preferred piece',
                queries: { evalQueries: 1 }
            },
            {
                type: 'action',
                description: 'Player 1 receives the remaining piece'
            },
            {
                type: 'end',
                title: 'Result',
                description: 'Proportional and envy-free division achieved<br><small>Both players receive ≥50% by their valuation</small>'
            }
        ]
    },
    'austins-moving-knife': {
        algorithm: { name: 'Austin\'s Moving Knife Procedure' },
        complexity: {
            cut: 0,
            evalQueries: '∞',
            total: '∞',
            display: 'Complexity: Continuous queries (Envy-free)',
            optimality: 'suboptimal'
        },
        steps: [
            {
                type: 'start',
                title: 'Start',
                description: 'Two players and one knife moving across the cake from left to right'
            },
            {
                type: 'query',
                title: 'Continuous Evaluation',
                description: 'Both players continuously evaluate the value of the left piece as the knife moves',
                queries: { evalQueries: Infinity }
            },
            {
                type: 'decision',
                title: 'Stop Condition',
                description: 'Does any player call "stop" when the left piece equals exactly 50% of their total valuation?'
            },
            {
                type: 'action',
                title: 'Division',
                description: 'The player who called "stop" takes the left piece, the other player takes the right piece'
            },
            {
                type: 'end',
                title: 'Result',
                description: 'Envy-free division achieved<br><small>Each player gets exactly 50% by their own valuation</small>'
            }
        ]
    },
    'steinhaus-lone-divider': {
        algorithm: { name: 'Steinhaus Lone-Divider Procedure' },
        complexity: {
            cut: '2-4',
            evalQueries: '3-6',
            total: '5-10',
            display: 'Complexity: 5-10 queries (Variable)',
            optimality: 'unknown'
        },
        steps: [
            {
                type: 'start',
                title: 'Start',
                description: 'Three players participate: one chosen as the divider, two as choosers'
            },
            {
                type: 'query',
                title: 'Phase 1: Division',
                description: 'The divider cuts the cake into 3 pieces they value equally (requires 2 cuts)',
                queries: { cut: 2 }
            },
            {
                type: 'query',
                title: 'Phase 2: Evaluation',
                description: 'Each chooser evaluates all 3 pieces and identifies which ones are acceptable (≥1/3 value)',
                queries: { evalQueries: 6 }
            },
            {
                type: 'decision',
                title: 'Conflict Check',
                description: 'Does at least one non-divider see ≥2 acceptable pieces?',
                branches: [
                    {
                        condition: 'YES',
                        label: 'Yes - Sequential Selection',
                        probability: '~60%',
                        steps: [
                            {
                                type: 'action',
                                title: 'Step 3a: First Choice',
                                description: 'Player with more acceptable pieces (or Player 3 if tied) chooses first from all pieces'
                            },
                            {
                                type: 'action',
                                title: 'Step 4a: Second Choice',
                                description: 'Other non-divider chooses from remaining two pieces'
                            },
                            {
                                type: 'action',
                                title: 'Step 5a: Final Allocation',
                                description: 'Divider (Player 1) receives the last remaining piece'
                            }
                        ]
                    },
                    {
                        condition: 'NO',
                        label: 'No - Reconstruction Required',
                        probability: '~40%',
                        steps: [
                            {
                                type: 'action',
                                title: 'Step 3b: Give Divider Unacceptable Piece',
                                description: 'Player 1 receives a piece that both other players find unacceptable'
                            },
                            {
                                type: 'action',
                                title: 'Step 4b: Cake Reconstruction',
                                description: 'Reassemble the remaining two pieces into a single cake'
                            },
                            {
                                type: 'query',
                                title: 'Step 5b: Divide-and-Choose',
                                description: 'Players 2 & 3 use standard divide-and-choose on the reconstructed cake',
                                queries: { cut: 1, evalQueries: 1 }
                            }
                        ]
                    }
                ]
            },
            {
                type: 'end',
                title: 'Result',
                description: 'All players guaranteed ≥1/3 of their subjective valuation<br><small>Proportional but not necessarily envy-free</small>'
            }
        ]
    },
    'selfridge-conway': {
        algorithm: { name: 'Selfridge-Conway Procedure' },
        complexity: {
            cut: '2-5',
            evalQueries: '5-12',
            total: '7-17',
            display: 'Complexity: 7-17 queries (Variable)',
            optimality: 'unknown'
        },
        steps: [
            {
                type: 'start',
                title: 'Start',
                description: 'Three players participate: Player 1 begins'
            },
            {
                type: 'query',
                title: 'Phase 1: Division',
                description: 'Player 1 cuts the cake into 3 pieces they value equally (requires 2 cuts)',
                queries: { cut: 2 }
            },
            {
                type: 'query',
                title: 'Phase 2: Evaluation',
                description: 'Player 2 evaluates the two largest pieces in their view to determine if a trimming is needed',
                queries: { evalQueries: 2 }
            }
        ]
    }
};

function createEnhancedFlowchart(containerId, algorithmName, customData = null) {
    const data = customData || ALGORITHM_FLOWCHART_DATA[algorithmName];
    if (!data) {
        console.error(`No template found for algorithm: ${algorithmName}`);
        return null;
    }

    return new EnhancedFlowchart(containerId, data);
}

function animateAlgorithm(containerId, speed = 1000) {
    const container = document.getElementById(containerId);
    if (container && container.enhancedFlowchart) {
        const animateBtn = event?.target;
        if (animateBtn) {
            animateBtn.disabled = true;
            animateBtn.innerHTML = '⏳ Building flowchart...';
        }

        container.enhancedFlowchart.animateSteps(speed).then(() => {
            if (animateBtn) {
                animateBtn.disabled = false;
                animateBtn.innerHTML = '▶️ Animate Steps';
            }
        }).catch(error => {
            console.error('Animation error:', error);
            if (animateBtn) {
                animateBtn.disabled = false;
                animateBtn.innerHTML = '❌ Error - Try Again';
                setTimeout(() => {
                    animateBtn.innerHTML = '▶️ Animate Steps';
                }, 2000);
            }
        });
    } else {
        console.error('Enhanced flowchart not found for container:', containerId);
    }
}

function resetAlgorithm(containerId) {
    const container = document.getElementById(containerId);
    if (container && container.enhancedFlowchart) {
        container.enhancedFlowchart.resetAnimation();

        const resetBtn = event?.target;
        if (resetBtn) {
            const originalText = resetBtn.innerHTML;
            resetBtn.innerHTML = '✅ Reset';
            setTimeout(() => {
                resetBtn.innerHTML = originalText;
            }, 1000);
        }
    } else {
        console.error('Enhanced flowchart not found for container:', containerId);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, looking for enhanced flowcharts...');

    const style = document.createElement('style');
    style.textContent = animationCSS;
    document.head.appendChild(style);

    const flowchartElements = document.querySelectorAll('[data-enhanced-flowchart]');
    console.log(`Found ${flowchartElements.length} enhanced flowchart elements`);

    flowchartElements.forEach(element => {
        const algorithmName = element.dataset.enhancedFlowchart;
        const containerId = element.id;

        console.log(`Initializing flowchart: ${containerId} -> ${algorithmName}`);

        if (containerId && algorithmName) {
            const flowchart = createEnhancedFlowchart(containerId, algorithmName);
            if (flowchart) {
                element.enhancedFlowchart = flowchart;
            }
        } else {
            console.warn('Missing id or algorithm name for element:', element);
        }
    });
});

const animationCSS = `
@keyframes queryPulse {
    0% { 
        transform: scale(1); 
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    50% { 
        transform: scale(1.15); 
        box-shadow: 0 4px 16px rgba(229, 62, 62, 0.4);
    }
    100% { 
        transform: scale(1); 
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
}

@keyframes metricPulse {
    0% { 
        transform: scale(1); 
        background-color: white;
    }
    50% { 
        transform: scale(1.05); 
        background-color: #ebf8ff;
    }
    100% { 
        transform: scale(1); 
        background-color: white;
    }
}
`;

// Make functions globally available
window.EnhancedFlowchart = EnhancedFlowchart;
window.createEnhancedFlowchart = createEnhancedFlowchart;
window.ALGORITHM_FLOWCHART_DATA = ALGORITHM_FLOWCHART_DATA;
window.animateAlgorithm = animateAlgorithm;
window.resetAlgorithm = resetAlgorithm;
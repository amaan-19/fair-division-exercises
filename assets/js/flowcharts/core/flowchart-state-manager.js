/**
 * State Manager - Handles all state transitions and UI states
 */

class FlowchartStateManager {
    constructor(flowchart) {
        this.flowchart = flowchart;
    }

    initializeEmptyState() {
        const allSteps = this.flowchart.container.querySelectorAll('.flow-step-enhanced');
        const allConnectors = this.flowchart.container.querySelectorAll('.flow-connector-enhanced');
        const branches = this.flowchart.container.querySelectorAll('.flow-branches-enhanced');
        const flowchartContainer = this.flowchart.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.flowchart.container.querySelector('.flowchart-steps-enhanced');

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
            flowchartContainer.style.minHeight = '200px';
            flowchartContainer.style.overflow = 'hidden';
        }

        // Start with collapsed steps container
        if (stepsContainer) {
            stepsContainer.style.transition = 'all 0.6s ease';
            stepsContainer.style.minHeight = '0px';
            stepsContainer.style.maxHeight = '80px';
        }

        this.flowchart.queryManager.updateQueryCounterDisplay(0, 0, 0);
        this.showReadyState();
    }

    showReadyState() {
        const sidebar = this.flowchart.container.querySelector('.complexity-sidebar-enhanced');
        if (sidebar) {
            sidebar.className = 'complexity-sidebar-enhanced ready-state';

            let readyIndicator = sidebar.querySelector('.ready-indicator');
            if (!readyIndicator) {
                readyIndicator = document.createElement('div');
                readyIndicator.className = 'ready-indicator';
                readyIndicator.innerHTML = 'Ready to animate';
                sidebar.appendChild(readyIndicator);
            }
        }
    }

    resetSidebarToAnimationState() {
        const sidebar = this.flowchart.container.querySelector('.complexity-sidebar-enhanced');
        if (sidebar) {
            sidebar.className = 'complexity-sidebar-enhanced animating-state';

            const readyIndicator = sidebar.querySelector('.ready-indicator');
            if (readyIndicator) {
                readyIndicator.remove();
            }
        }
    }

    showCompletionState() {
        const sidebar = this.flowchart.container.querySelector('.complexity-sidebar-enhanced');
        if (sidebar) {
            sidebar.className = 'complexity-sidebar-enhanced complete-state';

            const completionIndicator = document.createElement('div');
            completionIndicator.className = 'completion-indicator';
            completionIndicator.innerHTML = '✅ Animation complete';
            sidebar.appendChild(completionIndicator);
        }
    }

    resetAnimation() {
        console.log('Resetting to small container state');
        this.flowchart.isAnimating = false;
        this.flowchart.runningTotals = { cut: 0, evalQueries: 0 };

        // Reset container size immediately
        const flowchartContainer = this.flowchart.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.flowchart.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            flowchartContainer.classList.remove('growing-animation');
            flowchartContainer.style.transition = 'all 0.4s ease';
            flowchartContainer.style.minHeight = '200px';
            flowchartContainer.style.maxHeight = 'none';
            flowchartContainer.style.transform = 'scale(0.98)';

            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
            }, 100);
        }

        if (stepsContainer) {
            stepsContainer.style.maxHeight = '80px';
            stepsContainer.style.transition = 'all 0.4s ease';
        }

        // Remove completion indicator
        const completionIndicator = this.flowchart.container.querySelector('.completion-indicator');
        if (completionIndicator) {
            completionIndicator.remove();
        }

        // Reset to empty state after container reset
        setTimeout(() => {
            this.initializeEmptyState();
        }, 200);
    }
}
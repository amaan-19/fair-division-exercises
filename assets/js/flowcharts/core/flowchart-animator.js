/**
 * Animation Controller - Handles all animation logic
 * Separated for better maintainability
 */

class FlowchartAnimator {
    constructor(flowchart) {
        this.flowchart = flowchart;
        this.containerManager = new ContainerGrowthManager(flowchart);
    }

    async animateSteps(speed = 1000) {
        if (this.flowchart.isAnimating) {
            console.log('Animation already in progress');
            return;
        }

        console.log('Starting progressive animation with growing container');
        this.flowchart.isAnimating = true;

        this.flowchart.stateManager.initializeEmptyState();
        this.flowchart.stateManager.resetSidebarToAnimationState();
        this.flowchart.runningTotals = { cut: 0, evalQueries: 0 };

        // Start growing the container
        await this.containerManager.startContainerGrowth();

        const mainSteps = this.flowchart.container.querySelectorAll('.flowchart-steps-enhanced > .flow-step-enhanced');
        const mainConnectors = this.flowchart.container.querySelectorAll('.flowchart-steps-enhanced > .flow-connector-enhanced');

        // Calculate expected height based on steps
        const expectedHeight = this.containerManager.calculateExpectedHeight(mainSteps.length);
        await this.containerManager.growContainerToHeight(expectedHeight);

        // Animate main flow steps
        for (let i = 0; i < mainSteps.length; i++) {
            const step = mainSteps[i];

            // Grow container for this step
            await this.containerManager.growForStep(i, mainSteps.length);

            step.style.visibility = 'visible';
            step.style.opacity = '1';
            step.style.transform = 'translateY(0) scale(1)';
            step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

            await this.flowchart.queryManager.processStepQueries(step, speed);

            const nextElement = mainSteps[i].nextElementSibling;
            const hasBranches = nextElement && nextElement.classList.contains('flow-branches-enhanced');

            if (hasBranches) {
                // Grow container significantly for branches
                await this.containerManager.growForBranches();

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
        await this.containerManager.finalizeContainerSize();

        this.flowchart.isAnimating = false;
        console.log('Progressive animation with growth completed');
        this.flowchart.stateManager.showCompletionState();
    }

    async animateBranchesWithCounting(branchContainer, speed) {
        const branches = branchContainer.querySelectorAll('.flow-branch-enhanced');

        console.log(`Animating ${branches.length} branches with progressive counting`);

        for (let branchIndex = 0; branchIndex < branches.length; branchIndex++) {
            const branch = branches[branchIndex];
            const branchSteps = branch.querySelectorAll('.flow-step-enhanced');
            const branchConnectors = branch.querySelectorAll('.flow-connector-enhanced');

            console.log(`Branch ${branchIndex}: animating ${branchSteps.length} steps`);

            const branchStartTotals = { ...this.flowchart.runningTotals };

            for (let i = 0; i < branchSteps.length; i++) {
                const step = branchSteps[i];

                step.style.visibility = 'visible';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0) scale(1)';
                step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

                await this.flowchart.queryManager.processStepQueries(step, speed);

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
                this.flowchart.runningTotals = branchStartTotals;
            }
        }
    }
}
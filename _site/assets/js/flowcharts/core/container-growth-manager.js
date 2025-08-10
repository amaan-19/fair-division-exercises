/**
 * Container Growth Manager - Handles all container sizing logic
 */

class ContainerGrowthManager {
    constructor(flowchart) {
        this.flowchart = flowchart;
    }

    async startContainerGrowth() {
        const flowchartContainer = this.flowchart.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.flowchart.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            flowchartContainer.classList.add('growing-animation');
            flowchartContainer.style.minHeight = '200px';
            flowchartContainer.style.transform = 'scale(0.95)';

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

    calculateExpectedHeight(stepCount) {
        const baseHeight = 300;
        const stepHeight = 140;
        const branchHeight = 200;

        let totalHeight = baseHeight + (stepCount * stepHeight);

        if (this.flowchart.data.steps.some(step => step.branches)) {
            totalHeight += branchHeight;
        }

        return Math.min(totalHeight, 1200);
    }

    async growContainerToHeight(targetHeight) {
        const flowchartContainer = this.flowchart.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.flowchart.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            flowchartContainer.style.minHeight = `${targetHeight}px`;
        }

        if (stepsContainer) {
            stepsContainer.style.maxHeight = `${targetHeight - 100}px`;
        }

        await new Promise(resolve => setTimeout(resolve, 400));
    }

    async growForStep(stepIndex, totalSteps) {
        const flowchartContainer = this.flowchart.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.flowchart.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer && stepsContainer) {
            const currentHeight = parseInt(flowchartContainer.style.minHeight) || 300;
            const growthIncrement = 80;
            const newHeight = currentHeight + growthIncrement;

            flowchartContainer.style.minHeight = `${newHeight}px`;
            stepsContainer.style.maxHeight = `${newHeight - 100}px`;

            flowchartContainer.style.transform = 'scale(1.01)';
            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
            }, 200);
        }

        await new Promise(resolve => setTimeout(resolve, 200));
    }

    async growForBranches() {
        const flowchartContainer = this.flowchart.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.flowchart.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer && stepsContainer) {
            const currentHeight = parseInt(flowchartContainer.style.minHeight) || 500;
            const branchHeight = currentHeight + 300;

            flowchartContainer.style.minHeight = `${branchHeight}px`;
            stepsContainer.style.maxHeight = `${branchHeight - 100}px`;

            flowchartContainer.style.transform = 'scale(1.02)';
            setTimeout(() => {
                flowchartContainer.style.transform = 'scale(1)';
            }, 400);
        }

        await new Promise(resolve => setTimeout(resolve, 400));
    }

    async finalizeContainerSize() {
        const flowchartContainer = this.flowchart.container.querySelector('.algorithm-flowchart-enhanced');
        const stepsContainer = this.flowchart.container.querySelector('.flowchart-steps-enhanced');

        if (flowchartContainer) {
            flowchartContainer.style.minHeight = 'auto';
            flowchartContainer.style.maxHeight = 'none';
            flowchartContainer.classList.remove('growing-animation');

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
}
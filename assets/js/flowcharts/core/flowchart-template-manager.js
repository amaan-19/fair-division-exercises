/**
 * Template Manager - Handles all HTML generation
 * Separated from main controller for clarity
 */

class FlowchartTemplateManager {
    constructor() {
        this.templates = new Map();
        this.loadTemplates();
    }

    loadTemplates() {
        // Define all HTML templates here
        this.templates.set('flowchart', this.getFlowchartTemplate());
        this.templates.set('step', this.getStepTemplate());
        this.templates.set('connector', this.getConnectorTemplate());
        this.templates.set('branch', this.getBranchTemplate());
        this.templates.set('queryBadge', this.getQueryBadgeTemplate());
        this.templates.set('tooltip', this.getTooltipTemplate());
    }

    renderFlowchart(data) {
        const { algorithm, steps } = data;
        const template = this.templates.get('flowchart');

        return template
            .replace('{{ALGORITHM_NAME}}', algorithm.name)
            .replace('{{STEPS_CONTENT}}', this.renderSteps(steps))
            .replace('{{CONTAINER_ID}}', data.containerId || 'default');
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
                    connectorHtml = this.templates.get('connector');
                }
            }

            return stepHtml + connectorHtml;
        }).join('');
    }

    renderStep(step, index) {
        const queryBadge = this.renderQueryBadge(step.queries);
        const tooltip = this.renderTooltip(step.queries);

        const template = this.templates.get('step');
        return template
            .replace('{{STEP_INDEX}}', index)
            .replace('{{STEP_TYPE}}', step.type)
            .replace('{{STEP_TITLE}}', step.title ? `<strong>${step.title}:</strong><br>` : '')
            .replace('{{STEP_DESCRIPTION}}', step.description)
            .replace('{{QUERY_BADGE}}', queryBadge)
            .replace('{{TOOLTIP}}', tooltip);
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

        const template = this.templates.get('queryBadge');
        return template
            .replace('{{BADGE_CLASS}}', badgeClass)
            .replace('{{BADGE_TEXT}}', badgeText)
            .replace('{{QUERIES_DATA}}', JSON.stringify(queries));
    }

    renderTooltip(queries) {
        if (!queries || (!queries.cut && !queries.evalQueries)) return '';

        const parts = [];
        if (queries.cut) parts.push(`${queries.cut} Cut Query${queries.cut > 1 ? 's' : ''}`);
        if (queries.evalQueries) parts.push(`${queries.evalQueries} Eval Query${queries.evalQueries > 1 ? 's' : ''}`);

        const template = this.templates.get('tooltip');
        return template.replace('{{TOOLTIP_CONTENT}}', parts.join(' + '));
    }

    renderBranches(branches) {
        const branchHtml = branches.map(branch => {
            const template = this.templates.get('branch');
            return template
                .replace('{{BRANCH_CONDITION}}', branch.condition.toLowerCase())
                .replace('{{BRANCH_LABEL}}', branch.label)
                .replace('{{BRANCH_PROBABILITY}}', branch.probability ? `<br><small>${branch.probability}</small>` : '')
                .replace('{{BRANCH_STEPS}}', this.renderBranchSteps(branch.steps));
        }).join('');

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
            const connectorHtml = isLast ? '' : this.templates.get('connector');

            return stepHtml + connectorHtml;
        }).join('');
    }

    // Template definitions
    getFlowchartTemplate() {
        return `
            <div class="algorithm-flowchart-enhanced">
                <div class="flowchart-header-enhanced">
                    <div class="flowchart-title-enhanced">{{ALGORITHM_NAME}}</div>
                </div>

                <div class="flowchart-content-enhanced">
                    <div class="flowchart-steps-enhanced">
                        {{STEPS_CONTENT}}
                    </div>

                    <div class="complexity-sidebar-enhanced empty-state">
                        <div class="sidebar-title-enhanced">Query Complexity</div>
                        <div class="query-metric-enhanced cut-metric">
                            <span class="metric-label-enhanced">Cut Queries:</span>
                            <span class="metric-value-enhanced" id="cut-count-{{CONTAINER_ID}}">0</span>
                        </div>
                        <div class="query-metric-enhanced eval-metric">
                            <span class="metric-label-enhanced">Eval Queries:</span>
                            <span class="metric-value-enhanced" id="eval-count-{{CONTAINER_ID}}">0</span>
                        </div>
                        <div class="total-complexity-enhanced">
                            <span class="total-label-enhanced">Total:</span>
                            <span class="total-value-enhanced" id="total-count-{{CONTAINER_ID}}">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStepTemplate() {
        return `
            <div class="flow-step-enhanced step-{{STEP_TYPE}}" data-step="{{STEP_INDEX}}">
                <div class="step-content-enhanced">
                    <div class="step-text">
                        {{STEP_TITLE}}
                        {{STEP_DESCRIPTION}}
                    </div>
                </div>
                {{QUERY_BADGE}}
                {{TOOLTIP}}
            </div>
        `;
    }

    getConnectorTemplate() {
        return `
            <div class="flow-connector-enhanced">
                <div class="connector-line-enhanced">
                    <div class="connector-arrow-enhanced"></div>
                </div>
            </div>
        `;
    }

    getBranchTemplate() {
        return `
            <div class="flow-branch-enhanced">
                <div class="branch-label-enhanced branch-{{BRANCH_CONDITION}}">
                    {{BRANCH_LABEL}}
                    {{BRANCH_PROBABILITY}}
                </div>
                <div class="branch-steps-enhanced">
                    {{BRANCH_STEPS}}
                </div>
            </div>
        `;
    }

    getQueryBadgeTemplate() {
        return `<div class="query-badge-enhanced {{BADGE_CLASS}}" data-queries='{{QUERIES_DATA}}'>{{BADGE_TEXT}}</div>`;
    }

    getTooltipTemplate() {
        return `<div class="query-tooltip-enhanced">{{TOOLTIP_CONTENT}}</div>`;
    }
}
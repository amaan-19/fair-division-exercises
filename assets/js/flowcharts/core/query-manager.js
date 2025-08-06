/**
 * Query Manager - Handles all Robertson-Webb query logic
 * Educational focus on complexity analysis
 */

class QueryManager {
    constructor(flowchart) {
        this.flowchart = flowchart;
    }

    async processStepQueries(step, speed) {
        const badge = step.querySelector('.query-badge-enhanced');
        if (badge && badge.dataset.queries) {
            try {
                const queries = JSON.parse(badge.dataset.queries);

                if (queries.cut) this.flowchart.runningTotals.cut += parseInt(queries.cut) || 0;
                if (queries.evalQueries) this.flowchart.runningTotals.evalQueries += parseInt(queries.evalQueries) || 0;

                setTimeout(() => {
                    badge.style.animation = 'queryPulse 0.8s ease-in-out';
                    badge.addEventListener('animationend', () => {
                        badge.style.animation = '';
                    }, { once: true });
                }, 300);

                await this.animateCounterUpdate(this.flowchart.runningTotals.cut, this.flowchart.runningTotals.evalQueries);
                this.highlightUpdatedMetrics(queries);

            } catch (e) {
                console.error('Error parsing query data:', e);
            }
        }
    }

    async animateCounterUpdate(newCut, newEvalQueries) {
        const cutElement = this.flowchart.container.querySelector(`#cut-count-${this.flowchart.container.id}`);
        const evalElement = this.flowchart.container.querySelector(`#eval-count-${this.flowchart.container.id}`);
        const totalElement = this.flowchart.container.querySelector(`#total-count-${this.flowchart.container.id}`);

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
            const cutMetric = this.flowchart.container.querySelector('.cut-metric');
            if (cutMetric) {
                cutMetric.style.animation = 'metricPulse 0.8s ease-in-out';
                setTimeout(() => { cutMetric.style.animation = ''; }, 800);
            }
        }
        if (queries.evalQueries) {
            const evalMetric = this.flowchart.container.querySelector('.eval-metric');
            if (evalMetric) {
                evalMetric.style.animation = 'metricPulse 0.8s ease-in-out';
                setTimeout(() => { evalMetric.style.animation = ''; }, 800);
            }
        }
    }

    highlightUpdatedMetrics(queries) {
        if (queries.cut) {
            const cutMetric = this.flowchart.container.querySelector('.cut-metric');
            if (cutMetric) {
                cutMetric.style.animation = 'metricHighlight 1s ease-out';
                setTimeout(() => { cutMetric.style.animation = ''; }, 1000);
            }
        }
        if (queries.evalQueries) {
            const evalMetric = this.flowchart.container.querySelector('.eval-metric');
            if (evalMetric) {
                evalMetric.style.animation = 'metricHighlight 1s ease-out';
                setTimeout(() => { evalMetric.style.animation = ''; }, 1000);
            }
        }
    }

    updateQueryCounter(queries, highlight = false) {
        const cutElement = this.flowchart.container.querySelector(`#cut-count-${this.flowchart.container.id}`);
        const evalElement = this.flowchart.container.querySelector(`#eval-count-${this.flowchart.container.id}`);

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
        const cutElement = this.flowchart.container.querySelector(`#cut-count-${this.flowchart.container.id}`);
        const evalElement = this.flowchart.container.querySelector(`#eval-count-${this.flowchart.container.id}`);

        if (cutElement) {
            cutElement.style.color = '#374151';
            cutElement.style.fontWeight = '700';
        }
        if (evalElement) {
            evalElement.style.color = '#374151';
            evalElement.style.fontWeight = '700';
        }
    }

    updateQueryCounterDisplay(cut, evalQueries, total) {
        const cutElement = this.flowchart.container.querySelector(`#cut-count-${this.flowchart.container.id}`);
        const evalElement = this.flowchart.container.querySelector(`#eval-count-${this.flowchart.container.id}`);
        const totalElement = this.flowchart.container.querySelector(`#total-count-${this.flowchart.container.id}`);

        if (cutElement) cutElement.textContent = cut;
        if (evalElement) evalElement.textContent = evalQueries;
        if (totalElement) totalElement.textContent = total;
    }
}
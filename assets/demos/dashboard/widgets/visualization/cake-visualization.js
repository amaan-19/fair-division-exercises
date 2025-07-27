/**
 * CakeVisualizationWidget - Distilled from Unified Demo System
 *
 * Extracts and modularizes the essential SVG cake visualization logic
 * from the existing unified system into a clean Widget-based architecture.
 */

class CakeVisualizationWidget extends Widget {
    constructor(id, config = {}) {
        super(id, {
            type: 'cake-visualization',
            title: config.title || 'Cake Visualization',
            ...config
        });

        // Visualization state extracted from unified system
        this.state = {
            cutPositions: [],
            knifePositions: { left: null, right: null },
            showDualKnives: false,
            pieces: [],
            selectedPiece: null,
            visualizationMode: config.visualizationMode || 'horizontal' // or 'circular'
        };

        // SVG dimensions and layout (from existing system)
        this.dimensions = {
            width: 600,
            height: 300,
            margin: { top: 40, right: 40, bottom: 60, left: 40 }
        };

        // Colors and styling from DEMO_CONFIG
        this.playerColors = ['#3182ce', '#e53e3e', '#38a169', '#d69e2e'];

        // Cake regions from existing system
        this.regionColors = {
            blue: '#4299e1',
            red: '#f56565',
            green: '#48bb78',
            orange: '#ed8936',
            pink: '#ed64a6',
            purple: '#9f7aea'
        };

        this.regionBounds = {
            blue: { start: 0, end: 75 },
            red: { start: 75, end: 100 },
            green: { start: 18.75, end: 75 },
            orange: { start: 75, end: 100 },
            pink: { start: 0, end: 18.75 },
            purple: { start: 18.75, end: 100 }
        };

        // SVG element references
        this.svg = null;
        this.cakeGroup = null;
        this.cutLinesGroup = null;
        this.knivesGroup = null;
        this.overlaysGroup = null;
    }

    // ===== WIDGET LIFECYCLE OVERRIDES =====

    async onInitialize() {
        // Subscribe to key events from other widgets
        this.subscribe('cut-position-changed', (data) => {
            this.updateCutPosition(data.position, data.index);
        });

        this.subscribe('knife-position-changed', (data) => {
            this.updateKnifePosition(data.position, data.side);
        });

        this.subscribe('algorithm-step-changed', (data) => {
            this.handleAlgorithmStep(data);
        });

        this.subscribe('algorithm-reset', () => {
            this.resetVisualization();
        });
    }

    onRender() {
        if (!this.element) {
            this.element = this.createElement();
            if (this.container) {
                this.container.appendChild(this.element);
            }
        }

        this.createSVGStructure();
        this.renderCake();
    }

    onUpdate(data, previousState) {
        // Re-render if visualization mode changed
        if (data.visualizationMode && data.visualizationMode !== previousState.visualizationMode) {
            this.renderCake();
        }

        // Update specific elements if positions changed
        if (data.cutPositions !== previousState.cutPositions) {
            this.updateCutLines();
        }

        if (data.knifePositions !== previousState.knifePositions) {
            this.updateKnives();
        }
    }

    // ===== DOM CREATION =====

    createElement() {
        const element = document.createElement('div');
        element.className = 'widget widget-cake-visualization';
        element.id = `widget-${this.id}`;

        element.innerHTML = `
            <div class="cake-visualization-container">
                <div class="visualization-controls">
                    <div class="view-controls">
                        <button class="view-btn ${this.state.visualizationMode === 'horizontal' ? 'active' : ''}"
                                data-mode="horizontal">Horizontal</button>
                        <button class="view-btn ${this.state.visualizationMode === 'circular' ? 'active' : ''}"
                                data-mode="circular">Circular</button>
                    </div>
                </div>
                <div class="svg-container">
                    <!-- SVG will be created here -->
                </div>
                <div class="visualization-info">
                    <div class="cut-info">Cuts: <span class="cut-count">0</span></div>
                    <div class="piece-info">Pieces: <span class="piece-count">1</span></div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        return element;
    }

    setupEventListeners() {
        // View mode buttons
        const viewButtons = this.element.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setVisualizationMode(mode);
            });
        });
    }

    // ===== SVG CREATION (distilled from unified system) =====

    createSVGStructure() {
        const container = this.element.querySelector('.svg-container');
        if (!container) return;

        // Clear existing SVG
        container.innerHTML = '';

        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('class', 'cake-svg');
        this.svg.setAttribute('viewBox', `0 0 ${this.dimensions.width} ${this.dimensions.height}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // Create organized groups
        this.cakeGroup = this.createSVGGroup('cake-group');
        this.cutLinesGroup = this.createSVGGroup('cut-lines-group');
        this.knivesGroup = this.createSVGGroup('knives-group');
        this.overlaysGroup = this.createSVGGroup('overlays-group');

        // Add to SVG in correct order
        this.svg.appendChild(this.cakeGroup);
        this.svg.appendChild(this.cutLinesGroup);
        this.svg.appendChild(this.knivesGroup);
        this.svg.appendChild(this.overlaysGroup);

        container.appendChild(this.svg);
    }

    createSVGGroup(className) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', className);
        return group;
    }

    // ===== CAKE RENDERING (core logic from unified system) =====

    renderCake() {
        if (!this.cakeGroup) return;

        // Clear existing cake
        this.cakeGroup.innerHTML = '';

        if (this.state.visualizationMode === 'horizontal') {
            this.renderHorizontalCake();
        } else {
            this.renderCircularCake();
        }

        // Update overlays
        this.updateCutLines();
        this.updateKnives();
        this.updatePieces();
    }

    renderHorizontalCake() {
        const { width, height, margin } = this.dimensions;
        const cakeWidth = width - margin.left - margin.right;
        const cakeHeight = 80;
        const cakeY = (height - cakeHeight) / 2;

        // Cake base (simplified from unified system)
        const cakeBase = this.createRect(
            margin.left, cakeY, cakeWidth, cakeHeight,
            '#f5f5f0', '#2d3748', 2
        );
        cakeBase.setAttribute('rx', '4');
        this.cakeGroup.appendChild(cakeBase);

        // Colored regions (extracted from DEMO_CONFIG)
        Object.entries(this.regionBounds).forEach(([regionName, bounds]) => {
            const regionX = margin.left + (bounds.start / 100) * cakeWidth;
            const regionWidth = ((bounds.end - bounds.start) / 100) * cakeWidth;

            const regionRect = this.createRect(
                regionX, cakeY, regionWidth, cakeHeight,
                this.regionColors[regionName], 'none', 0
            );
            regionRect.setAttribute('opacity', '0.7');
            regionRect.setAttribute('data-region', regionName);
            this.cakeGroup.appendChild(regionRect);
        });

        // Percentage markers
        this.addPercentageMarkers(cakeWidth, cakeY, cakeHeight);
    }

    renderCircularCake() {
        const { width, height } = this.dimensions;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Outer circle
        const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerCircle.setAttribute('cx', centerX);
        outerCircle.setAttribute('cy', centerY);
        outerCircle.setAttribute('r', radius);
        outerCircle.setAttribute('fill', '#f5f5f0');
        outerCircle.setAttribute('stroke', '#2d3748');
        outerCircle.setAttribute('stroke-width', '2');
        this.cakeGroup.appendChild(outerCircle);

        // Colored pie slices
        Object.entries(this.regionBounds).forEach(([regionName, bounds]) => {
            const startAngle = (bounds.start / 100) * 2 * Math.PI - Math.PI / 2;
            const endAngle = (bounds.end / 100) * 2 * Math.PI - Math.PI / 2;

            const slice = this.createPieSlice(centerX, centerY, radius, startAngle, endAngle);
            slice.setAttribute('fill', this.regionColors[regionName]);
            slice.setAttribute('opacity', '0.7');
            slice.setAttribute('data-region', regionName);
            this.cakeGroup.appendChild(slice);
        });
    }

    // ===== SVG HELPER METHODS =====

    createRect(x, y, width, height, fill, stroke, strokeWidth) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', fill);
        if (stroke !== 'none') {
            rect.setAttribute('stroke', stroke);
            rect.setAttribute('stroke-width', strokeWidth);
        }
        return rect;
    }

    createPieSlice(centerX, centerY, radius, startAngle, endAngle) {
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        return path;
    }

    addPercentageMarkers(cakeWidth, cakeY, cakeHeight) {
        const { margin } = this.dimensions;
        const markers = [0, 25, 50, 75, 100];

        markers.forEach(percent => {
            const x = margin.left + (percent / 100) * cakeWidth;

            // Tick mark
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', x);
            tick.setAttribute('y1', cakeY + cakeHeight);
            tick.setAttribute('x2', x);
            tick.setAttribute('y2', cakeY + cakeHeight + 8);
            tick.setAttribute('stroke', '#4a5568');
            tick.setAttribute('stroke-width', 1);
            this.cakeGroup.appendChild(tick);

            // Label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', cakeY + cakeHeight + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-family', 'Inter, sans-serif');
            label.setAttribute('font-size', '12');
            label.setAttribute('fill', '#4a5568');
            label.textContent = `${percent}%`;
            this.cakeGroup.appendChild(label);
        });
    }

    // ===== UPDATE METHODS (core functionality from unified system) =====

    updateCutPosition(position, index = null) {
        const newCutPositions = [...this.state.cutPositions];

        if (index !== null && index < newCutPositions.length) {
            newCutPositions[index] = position;
        } else {
            newCutPositions.push(position);
        }

        this.setState({ cutPositions: newCutPositions });
        this.updateInfo();
    }

    updateCutLines() {
        if (!this.cutLinesGroup) return;

        this.cutLinesGroup.innerHTML = '';

        this.state.cutPositions.forEach((position, index) => {
            if (this.state.visualizationMode === 'horizontal') {
                this.addHorizontalCutLine(position, index);
            } else {
                this.addCircularCutLine(position, index);
            }
        });
    }

    addHorizontalCutLine(position, index) {
        const { width, height, margin } = this.dimensions;
        const cakeWidth = width - margin.left - margin.right;
        const cakeHeight = 80;
        const cakeY = (height - cakeHeight) / 2;

        const x = margin.left + (position / 100) * cakeWidth;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', cakeY - 10);
        line.setAttribute('x2', x);
        line.setAttribute('y2', cakeY + cakeHeight + 10);
        line.setAttribute('stroke', this.playerColors[index % this.playerColors.length]);
        line.setAttribute('stroke-width', 3);
        line.setAttribute('stroke-linecap', 'round');
        this.cutLinesGroup.appendChild(line);
    }

    addCircularCutLine(position, index) {
        const { width, height } = this.dimensions;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        const angle = (position / 100) * 2 * Math.PI - Math.PI / 2;
        const x2 = centerX + (radius + 15) * Math.cos(angle);
        const y2 = centerY + (radius + 15) * Math.sin(angle);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', this.playerColors[index % this.playerColors.length]);
        line.setAttribute('stroke-width', 3);
        line.setAttribute('stroke-linecap', 'round');
        this.cutLinesGroup.appendChild(line);
    }

    // Knife visualization (from unified system's updateSingleKnife, updateKnifePositions)
    updateKnifePosition(position, side = 'single') {
        const knifePositions = { ...this.state.knifePositions };

        if (side === 'single' || side === 'left') {
            knifePositions.left = position;
        }
        if (side === 'right') {
            knifePositions.right = position;
        }

        this.setState({ knifePositions });
    }

    updateKnives() {
        if (!this.knivesGroup) return;

        this.knivesGroup.innerHTML = '';

        const { left, right } = this.state.knifePositions;

        if (left !== null) {
            this.addKnife(left, 'left');
        }
        if (right !== null && this.state.showDualKnives) {
            this.addKnife(right, 'right');
        }
    }

    addKnife(position, side) {
        const { width, height, margin } = this.dimensions;
        const cakeWidth = width - margin.left - margin.right;
        const cakeHeight = 80;
        const cakeY = (height - cakeHeight) / 2;

        const x = margin.left + (position / 100) * cakeWidth;

        // Knife line
        const knife = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        knife.setAttribute('x1', x);
        knife.setAttribute('y1', cakeY - 20);
        knife.setAttribute('x2', x);
        knife.setAttribute('y2', cakeY + cakeHeight + 20);
        knife.setAttribute('stroke', side === 'left' ? '#2b6cb0' : '#c53030');
        knife.setAttribute('stroke-width', 4);
        knife.setAttribute('stroke-linecap', 'round');
        knife.setAttribute('opacity', '0.8');
        this.knivesGroup.appendChild(knife);

        // Knife handle
        const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        handle.setAttribute('cx', x);
        handle.setAttribute('cy', cakeY - 30);
        handle.setAttribute('r', 6);
        handle.setAttribute('fill', side === 'left' ? '#2b6cb0' : '#c53030');
        this.knivesGroup.appendChild(handle);
    }

    updatePieces() {
        // Calculate and update piece information
        const pieces = this.calculatePieces();
        this.setState({ pieces });
        this.updateInfo();
    }

    calculatePieces() {
        const positions = [0, ...this.state.cutPositions, 100].sort((a, b) => a - b);
        const pieces = [];

        for (let i = 0; i < positions.length - 1; i++) {
            pieces.push({
                start: positions[i],
                end: positions[i + 1],
                width: positions[i + 1] - positions[i]
            });
        }

        return pieces;
    }

    // ===== CONTROL METHODS =====

    setVisualizationMode(mode) {
        if (mode !== this.state.visualizationMode) {
            this.setState({ visualizationMode: mode });

            // Update button states
            this.element.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
        }
    }

    showDualKnives() {
        this.setState({ showDualKnives: true });
    }

    hideDualKnives() {
        this.setState({ showDualKnives: false });
    }

    resetVisualization() {
        this.setState({
            cutPositions: [],
            knifePositions: { left: null, right: null },
            showDualKnives: false,
            pieces: [],
            selectedPiece: null
        });
    }

    updateInfo() {
        const cutCount = this.element.querySelector('.cut-count');
        const pieceCount = this.element.querySelector('.piece-count');

        if (cutCount) cutCount.textContent = this.state.cutPositions.length;
        if (pieceCount) pieceCount.textContent = this.state.pieces.length;
    }

    // ===== EVENT HANDLERS =====

    handleAlgorithmStep(data) {
        // Handle algorithm-specific visualization updates
        switch (data.action) {
            case 'cut':
                this.updateCutPosition(data.position);
                break;
            case 'move-knife':
                this.updateKnifePosition(data.position, data.side);
                break;
            case 'show-dual-knives':
                this.showDualKnives();
                break;
            case 'hide-dual-knives':
                this.hideDualKnives();
                break;
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CakeVisualizationWidget;
} else if (typeof window !== 'undefined') {
    window.CakeVisualizationWidget = CakeVisualizationWidget;
}

// Note: Widget registration would happen in a proper widget registry system
// For now, the widget is available globally as CakeVisualizationWidget
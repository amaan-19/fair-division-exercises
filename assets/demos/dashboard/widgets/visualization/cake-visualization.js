/**
 * Cake Visualization Widget - cake-visualization.js
 *
 * File Location: assets/demos/dashboard/widgets/visualization/cake-visualization.js
 *
 * SVG-based visualization widget for divisible goods (cake cutting) algorithms.
 * Provides interactive visualization of cuts, pieces, player valuations, and algorithm progress.
 * Adapted from the existing unified system with enhanced modularity and educational features.
 */

class CakeVisualizationWidget extends Widget {
    constructor(id, config = {}) {
        super(id, {
            type: 'cake-visualization',
            title: config.title || 'Cake Visualization',
            category: 'visualization',
            resizable: true,
            collapsible: false,
            ...config
        });

        // Visualization-specific state
        this.state = {
            currentAlgorithm: null,
            playerCount: 2,
            cutPositions: [],
            pieces: [],
            selectedPiece: null,
            showPlayerValues: config.showPlayerValues !== false,
            showCutLines: config.showCutLines !== false,
            enableInteraction: config.enableInteraction !== false,
            animateCuts: config.animateCuts !== false,
            visualizationMode: 'horizontal' // 'horizontal' or 'circular'
        };

        // SVG dimensions and layout
        this.dimensions = {
            width: 600,
            height: 300,
            margin: { top: 40, right: 40, bottom: 60, left: 40 }
        };

        // Player colors (adapted from existing system)
        this.playerColors = [
            '#3182ce', // Blue
            '#e53e3e', // Red
            '#38a169', // Green
            '#d69e2e'  // Orange
        ];

        // Cake region colors (from existing DEMO_CONFIG)
        this.regionColors = {
            blue: '#4299e1',
            red: '#f56565',
            green: '#48bb78',
            orange: '#ed8936',
            pink: '#ed64a6',
            purple: '#9f7aea'
        };

        // Region bounds (from existing DEMO_CONFIG.BOUNDS)
        this.regionBounds = {
            blue: { start: 0, end: 75 },
            red: { start: 75, end: 100 },
            green: { start: 18.75, end: 75 },
            orange: { start: 75, end: 100 },
            pink: { start: 0, end: 18.75 },
            purple: { start: 18.75, end: 100 }
        };

        // Educational context
        this.learningObjectives = [
            'Visualize fair division algorithm procedures',
            'Understand cut placement and piece formation',
            'Analyze player valuations and preferences'
        ];

        // SVG elements (will be populated after render)
        this.svg = null;
        this.cakeGroup = null;
        this.cutLinesGroup = null;
        this.overlaysGroup = null;
        this.labelsGroup = null;

        // Animation control
        this.animationDuration = 500;
        this.currentAnimations = [];
    }

    /**
     * Widget-specific initialization
     */
    async onInitialize() {
        // Listen for algorithm changes
        this.subscribe('algorithm-selection-changed', this.handleAlgorithmChanged.bind(this));
        this.subscribe('algorithm-step-changed', this.handleStepChanged.bind(this));
        this.subscribe('algorithm-reset', this.handleAlgorithmReset.bind(this));

        // Listen for cut and piece events
        this.subscribe('cut-position-changed', this.handleCutPositionChanged.bind(this));
        this.subscribe('piece-selection-requested', this.handlePieceSelectionRequested.bind(this));
        this.subscribe('player-values-updated', this.handlePlayerValuesUpdated.bind(this));

        // Listen for visualization requests
        this.subscribe('visualization-update-requested', this.handleVisualizationUpdate.bind(this));
        this.subscribe('cut-made', this.handleCutMade.bind(this));
    }

    /**
     * Get widget content template
     */
    getContentTemplate() {
        return `
            <div class="cake-visualization-container">
                <div class="visualization-header">
                    <div class="visualization-controls">
                        <div class="view-controls">
                            <button class="view-btn ${this.state.visualizationMode === 'horizontal' ? 'active' : ''}" 
                                    id="${this.id}-horizontal-view" data-mode="horizontal">
                                Horizontal View
                            </button>
                            <button class="view-btn ${this.state.visualizationMode === 'circular' ? 'active' : ''}" 
                                    id="${this.id}-circular-view" data-mode="circular">
                                Circular View
                            </button>
                        </div>
                        
                        <div class="display-options">
                            <label class="option-toggle">
                                <input type="checkbox" id="${this.id}-show-values" 
                                       ${this.state.showPlayerValues ? 'checked' : ''}>
                                <span>Show Values</span>
                            </label>
                            <label class="option-toggle">
                                <input type="checkbox" id="${this.id}-show-cuts" 
                                       ${this.state.showCutLines ? 'checked' : ''}>
                                <span>Show Cuts</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="visualization-main" id="${this.id}-main">
                    <div class="svg-container" id="${this.id}-svg-container">
                        <!-- SVG will be created dynamically -->
                    </div>
                    
                    <div class="visualization-info" id="${this.id}-info">
                        <div class="algorithm-status" id="${this.id}-status">
                            <span class="status-text">Ready to begin</span>
                        </div>
                        
                        ${this.state.showPlayerValues ? `
                            <div class="player-values-display" id="${this.id}-player-values">
                                <!-- Player values will be populated dynamically -->
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="piece-info-panel" id="${this.id}-piece-info" style="display: none;">
                    <h4>Piece Information</h4>
                    <div class="piece-details" id="${this.id}-piece-details">
                        <!-- Piece details will be populated when piece is selected -->
                    </div>
                </div>

                <div class="educational-overlay" id="${this.id}-educational" style="display: none;">
                    <div class="overlay-content">
                        <h4>Algorithm Visualization</h4>
                        <p id="${this.id}-educational-text">
                            This visualization shows how the algorithm divides the cake among players.
                        </p>
                        <button class="overlay-close" id="${this.id}-educational-close">
                            Got it!
                        </button>
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
        this.svgContainer = this.element.querySelector(`#${this.id}-svg-container`);
        this.statusDisplay = this.element.querySelector(`#${this.id}-status`);
        this.playerValuesDisplay = this.element.querySelector(`#${this.id}-player-values`);
        this.pieceInfoPanel = this.element.querySelector(`#${this.id}-piece-info`);
        this.pieceDetails = this.element.querySelector(`#${this.id}-piece-details`);
        this.educationalOverlay = this.element.querySelector(`#${this.id}-educational`);
        this.educationalText = this.element.querySelector(`#${this.id}-educational-text`);

        // Setup event listeners
        this.setupEventListeners();

        // Create initial SVG
        this.createSVG();

        // Render initial cake
        this.renderCake();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // View mode buttons
        const horizontalBtn = this.element.querySelector(`#${this.id}-horizontal-view`);
        const circularBtn = this.element.querySelector(`#${this.id}-circular-view`);

        if (horizontalBtn) {
            horizontalBtn.addEventListener('click', () => this.setVisualizationMode('horizontal'));
        }

        if (circularBtn) {
            circularBtn.addEventListener('click', () => this.setVisualizationMode('circular'));
        }

        // Display option toggles
        const showValuesToggle = this.element.querySelector(`#${this.id}-show-values`);
        const showCutsToggle = this.element.querySelector(`#${this.id}-show-cuts`);

        if (showValuesToggle) {
            showValuesToggle.addEventListener('change', (e) => {
                this.setState({ showPlayerValues: e.target.checked });
                this.updatePlayerValuesDisplay();
            });
        }

        if (showCutsToggle) {
            showCutsToggle.addEventListener('change', (e) => {
                this.setState({ showCutLines: e.target.checked });
                this.updateCutLinesVisibility();
            });
        }

        // Educational overlay close
        const educationalClose = this.element.querySelector(`#${this.id}-educational-close`);
        if (educationalClose) {
            educationalClose.addEventListener('click', () => {
                this.hideEducationalOverlay();
            });
        }

        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Create SVG element and groups
     */
    createSVG() {
        if (!this.svgContainer) return;

        // Clear existing SVG
        this.svgContainer.innerHTML = '';

        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('class', 'cake-svg');
        this.svg.setAttribute('viewBox', `0 0 ${this.dimensions.width} ${this.dimensions.height}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // Create groups for organized rendering
        this.cakeGroup = this.createSVGGroup('cake-group');
        this.cutLinesGroup = this.createSVGGroup('cut-lines-group');
        this.overlaysGroup = this.createSVGGroup('overlays-group');
        this.labelsGroup = this.createSVGGroup('labels-group');

        // Add groups to SVG in order
        this.svg.appendChild(this.cakeGroup);
        this.svg.appendChild(this.cutLinesGroup);
        this.svg.appendChild(this.overlaysGroup);
        this.svg.appendChild(this.labelsGroup);

        // Add SVG to container
        this.svgContainer.appendChild(this.svg);

        console.log('SVG visualization created');
    }

    /**
     * Create SVG group element
     */
    createSVGGroup(className) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', className);
        return group;
    }

    /**
     * Render the cake visualization
     */
    renderCake() {
        if (!this.cakeGroup) return;

        // Clear existing cake
        this.cakeGroup.innerHTML = '';

        if (this.state.visualizationMode === 'horizontal') {
            this.renderHorizontalCake();
        } else {
            this.renderCircularCake();
        }

        // Update cut lines and overlays
        this.updateCutLines();
        this.updatePieceOverlays();
    }

    /**
     * Render horizontal cake visualization
     */
    renderHorizontalCake() {
        const { width, height, margin } = this.dimensions;
        const cakeWidth = width - margin.left - margin.right;
        const cakeHeight = 60;
        const cakeY = (height - cakeHeight) / 2;

        // Create cake base rectangle
        const cakeBase = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        cakeBase.setAttribute('x', margin.left);
        cakeBase.setAttribute('y', cakeY);
        cakeBase.setAttribute('width', cakeWidth);
        cakeBase.setAttribute('height', cakeHeight);
        cakeBase.setAttribute('fill', '#f5f5f0');
        cakeBase.setAttribute('stroke', '#2d3748');
        cakeBase.setAttribute('stroke-width', '2');
        cakeBase.setAttribute('rx', '4');
        this.cakeGroup.appendChild(cakeBase);

        // Render colored regions (adapted from existing system)
        Object.entries(this.regionBounds).forEach(([regionName, bounds]) => {
            const regionX = margin.left + (bounds.start / 100) * cakeWidth;
            const regionWidth = ((bounds.end - bounds.start) / 100) * cakeWidth;

            const regionRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            regionRect.setAttribute('x', regionX);
            regionRect.setAttribute('y', cakeY);
            regionRect.setAttribute('width', regionWidth);
            regionRect.setAttribute('height', cakeHeight);
            regionRect.setAttribute('fill', this.regionColors[regionName]);
            regionRect.setAttribute('opacity', '0.7');
            regionRect.setAttribute('data-region', regionName);

            this.cakeGroup.appendChild(regionRect);
        });

        // Add percentage markers
        this.addPercentageMarkers(cakeWidth, cakeY, cakeHeight);
    }

    /**
     * Render circular cake visualization (pie chart style)
     */
    renderCircularCake() {
        const { width, height } = this.dimensions;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Create outer circle
        const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerCircle.setAttribute('cx', centerX);
        outerCircle.setAttribute('cy', centerY);
        outerCircle.setAttribute('r', radius);
        outerCircle.setAttribute('fill', '#f5f5f0');
        outerCircle.setAttribute('stroke', '#2d3748');
        outerCircle.setAttribute('stroke-width', '2');
        this.cakeGroup.appendChild(outerCircle);

        // Render colored regions as pie slices
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

    /**
     * Create pie slice path
     */
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

    /**
     * Add percentage markers to horizontal cake
     */
    addPercentageMarkers(cakeWidth, cakeY, cakeHeight) {
        const markers = [0, 25, 50, 75, 100];

        markers.forEach(percent => {
            const x = this.dimensions.margin.left + (percent / 100) * cakeWidth;

            // Marker line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', cakeY - 5);
            line.setAttribute('x2', x);
            line.setAttribute('y2', cakeY + cakeHeight + 5);
            line.setAttribute('stroke', '#718096');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('opacity', '0.5');
            this.labelsGroup.appendChild(line);

            // Marker text
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', cakeY + cakeHeight + 20);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#4a5568');
            text.textContent = `${percent}%`;
            this.labelsGroup.appendChild(text);
        });
    }

    /**
     * Update cut lines visualization
     */
    updateCutLines() {
        if (!this.cutLinesGroup) return;

        // Clear existing cut lines
        this.cutLinesGroup.innerHTML = '';

        if (!this.state.showCutLines) return;

        // Render cut lines based on current positions
        this.state.cutPositions.forEach((position, index) => {
            this.renderCutLine(position, index);
        });
    }

    /**
     * Render a single cut line
     */
    renderCutLine(position, index) {
        const { width, height, margin } = this.dimensions;

        if (this.state.visualizationMode === 'horizontal') {
            const cakeWidth = width - margin.left - margin.right;
            const x = margin.left + (position / 100) * cakeWidth;
            const cakeY = (height - 60) / 2;

            // Cut line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', cakeY - 10);
            line.setAttribute('x2', x);
            line.setAttribute('y2', cakeY + 70);
            line.setAttribute('stroke', this.playerColors[index % this.playerColors.length]);
            line.setAttribute('stroke-width', '3');
            line.setAttribute('data-cut-index', index);
            this.cutLinesGroup.appendChild(line);

            // Cut label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', cakeY - 15);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '12');
            label.setAttribute('font-weight', 'bold');
            label.setAttribute('fill', this.playerColors[index % this.playerColors.length]);
            label.textContent = `Cut ${index + 1}`;
            this.cutLinesGroup.appendChild(label);

        } else {
            // Circular mode - render as radial lines
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 3;
            const angle = (position / 100) * 2 * Math.PI - Math.PI / 2;

            const x1 = centerX + (radius * 0.8) * Math.cos(angle);
            const y1 = centerY + (radius * 0.8) * Math.sin(angle);
            const x2 = centerX + (radius * 1.2) * Math.cos(angle);
            const y2 = centerY + (radius * 1.2) * Math.sin(angle);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', this.playerColors[index % this.playerColors.length]);
            line.setAttribute('stroke-width', '3');
            line.setAttribute('data-cut-index', index);
            this.cutLinesGroup.appendChild(line);
        }
    }

    /**
     * Update piece overlays for selection
     */
    updatePieceOverlays() {
        if (!this.overlaysGroup) return;

        // Clear existing overlays
        this.overlaysGroup.innerHTML = '';

        // Create piece overlays based on current cuts
        this.createPieceOverlays();
    }

    /**
     * Create interactive piece overlays
     */
    createPieceOverlays() {
        if (!this.state.enableInteraction) return;

        const pieces = this.calculatePieces();

        pieces.forEach((piece, index) => {
            const overlay = this.createPieceOverlay(piece, index);
            if (overlay) {
                this.overlaysGroup.appendChild(overlay);
            }
        });
    }

    /**
     * Calculate pieces based on current cuts
     */
    calculatePieces() {
        const pieces = [];
        const positions = [0, ...this.state.cutPositions.sort((a, b) => a - b), 100];

        for (let i = 0; i < positions.length - 1; i++) {
            pieces.push({
                start: positions[i],
                end: positions[i + 1],
                index: i
            });
        }

        return pieces;
    }

    /**
     * Create overlay for piece selection
     */
    createPieceOverlay(piece, index) {
        const { width, height, margin } = this.dimensions;

        if (this.state.visualizationMode === 'horizontal') {
            const cakeWidth = width - margin.left - margin.right;
            const cakeY = (height - 60) / 2;
            const x = margin.left + (piece.start / 100) * cakeWidth;
            const pieceWidth = ((piece.end - piece.start) / 100) * cakeWidth;

            const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            overlay.setAttribute('x', x);
            overlay.setAttribute('y', cakeY);
            overlay.setAttribute('width', pieceWidth);
            overlay.setAttribute('height', 60);
            overlay.setAttribute('fill', 'transparent');
            overlay.setAttribute('stroke', 'transparent');
            overlay.setAttribute('stroke-width', '2');
            overlay.setAttribute('class', 'piece-overlay');
            overlay.setAttribute('data-piece-index', index);
            overlay.style.cursor = 'pointer';

            // Add interaction events
            overlay.addEventListener('mouseenter', () => {
                overlay.setAttribute('fill', 'rgba(49, 130, 206, 0.2)');
                overlay.setAttribute('stroke', '#3182ce');
            });

            overlay.addEventListener('mouseleave', () => {
                if (this.state.selectedPiece !== index) {
                    overlay.setAttribute('fill', 'transparent');
                    overlay.setAttribute('stroke', 'transparent');
                }
            });

            overlay.addEventListener('click', () => {
                this.selectPiece(index, piece);
            });

            return overlay;
        }

        return null; // Circular mode piece selection not implemented yet
    }

    /**
     * Handle piece selection
     */
    selectPiece(index, piece) {
        this.setState({ selectedPiece: index });

        // Update visual selection
        this.updatePieceSelection(index);

        // Show piece information
        this.showPieceInfo(piece, index);

        // Emit selection event
        this.emit('piece-selected', {
            pieceIndex: index,
            piece,
            source: this.id
        });

        console.log(`Piece ${index} selected:`, piece);
    }

    /**
     * Update visual indication of selected piece
     */
    updatePieceSelection(selectedIndex) {
        const overlays = this.overlaysGroup.querySelectorAll('.piece-overlay');

        overlays.forEach((overlay, index) => {
            if (index === selectedIndex) {
                overlay.setAttribute('fill', 'rgba(49, 130, 206, 0.3)');
                overlay.setAttribute('stroke', '#3182ce');
                overlay.setAttribute('stroke-width', '3');
            } else {
                overlay.setAttribute('fill', 'transparent');
                overlay.setAttribute('stroke', 'transparent');
                overlay.setAttribute('stroke-width', '2');
            }
        });
    }

    /**
     * Show piece information panel
     */
    showPieceInfo(piece, index) {
        if (!this.pieceInfoPanel || !this.pieceDetails) return;

        // Calculate piece value for each player
        const pieceValues = this.calculatePieceValues(piece);

        this.pieceDetails.innerHTML = `
            <div class="piece-summary">
                <h5>Piece ${index + 1}</h5>
                <p><strong>Range:</strong> ${piece.start.toFixed(1)}% - ${piece.end.toFixed(1)}%</p>
                <p><strong>Size:</strong> ${(piece.end - piece.start).toFixed(1)}%</p>
            </div>
            <div class="piece-values">
                <h6>Player Valuations:</h6>
                ${pieceValues.map((value, playerIndex) => `
                    <div class="player-value-item">
                        <span class="player-color" style="background-color: ${this.playerColors[playerIndex]}"></span>
                        <span>Player ${playerIndex + 1}: ${value.toFixed(1)} points</span>
                    </div>
                `).join('')}
            </div>
        `;

        this.pieceInfoPanel.style.display = 'block';
    }

    /**
     * Calculate piece values for all players
     */
    calculatePieceValues(piece) {
        // This would integrate with the existing player value system
        // For now, return placeholder values
        const values = [];
        for (let i = 0; i < this.state.playerCount; i++) {
            // Simplified calculation - would use actual player valuations
            values.push((piece.end - piece.start));
        }
        return values;
    }

    /**
     * Set visualization mode
     */
    setVisualizationMode(mode) {
        if (mode === this.state.visualizationMode) return;

        this.setState({ visualizationMode: mode });

        // Update view buttons
        const buttons = this.element.querySelectorAll('.view-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Re-render cake
        this.renderCake();

        this.emit('visualization-mode-changed', { mode, source: this.id });
    }

    /**
     * Update cut lines visibility
     */
    updateCutLinesVisibility() {
        if (this.cutLinesGroup) {
            this.cutLinesGroup.style.display = this.state.showCutLines ? 'block' : 'none';
        }
    }

    /**
     * Update player values display
     */
    updatePlayerValuesDisplay() {
        if (!this.playerValuesDisplay) return;

        if (!this.state.showPlayerValues) {
            this.playerValuesDisplay.style.display = 'none';
            return;
        }

        this.playerValuesDisplay.style.display = 'block';

        // This would integrate with actual player values
        // For now, show placeholder
        this.playerValuesDisplay.innerHTML = `
            <h5>Player Valuations</h5>
            <div class="values-grid">
                ${Array.from({ length: this.state.playerCount }, (_, i) => `
                    <div class="player-values">
                        <div class="player-header">
                            <span class="player-color" style="background-color: ${this.playerColors[i]}"></span>
                            <span>Player ${i + 1}</span>
                        </div>
                        <div class="player-value-total">Total: 100 points</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Show educational overlay
     */
    showEducationalOverlay(content) {
        if (!this.educationalOverlay || !this.educationalText) return;

        this.educationalText.textContent = content;
        this.educationalOverlay.style.display = 'flex';
    }

    /**
     * Hide educational overlay
     */
    hideEducationalOverlay() {
        if (this.educationalOverlay) {
            this.educationalOverlay.style.display = 'none';
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update SVG viewBox if needed
        if (this.svg && this.svgContainer) {
            const containerRect = this.svgContainer.getBoundingClientRect();
            const aspectRatio = this.dimensions.width / this.dimensions.height;

            // Maintain aspect ratio
            if (containerRect.width / containerRect.height > aspectRatio) {
                this.svg.style.height = '100%';
                this.svg.style.width = 'auto';
            } else {
                this.svg.style.width = '100%';
                this.svg.style.height = 'auto';
            }
        }
    }

    // ===== EVENT HANDLERS =====

    /**
     * Handle algorithm change
     */
    handleAlgorithmChanged(data) {
        const { algorithmId, algorithmData } = data;

        this.setState({
            currentAlgorithm: algorithmId,
            playerCount: algorithmData?.config?.metadata?.playerCount || 2,
            cutPositions: [],
            pieces: [],
            selectedPiece: null
        });

        // Reset visualization
        this.renderCake();
        this.updatePlayerValuesDisplay();

        // Update status
        this.updateStatus(`Algorithm: ${algorithmData?.config?.metadata?.name || algorithmId}`);

        console.log(`Visualization updated for algorithm: ${algorithmId}`);
    }

    /**
     * Handle step change
     */
    handleStepChanged(data) {
        const { step, stepData } = data;

        // Update visualization based on algorithm step
        if (stepData && stepData.visualizationUpdate) {
            this.handleVisualizationUpdate(stepData.visualizationUpdate);
        }
    }

    /**
     * Handle algorithm reset
     */
    handleAlgorithmReset() {
        this.setState({
            cutPositions: [],
            pieces: [],
            selectedPiece: null
        });

        this.renderCake();
        this.updateStatus('Algorithm reset - ready to begin');
    }

    /**
     * Handle cut position changes
     */
    handleCutPositionChanged(data) {
        const { position, cutIndex } = data;

        // Update cut positions array
        const newCutPositions = [...this.state.cutPositions];
        if (cutIndex !== undefined) {
            newCutPositions[cutIndex] = position;
        } else {
            newCutPositions.push(position);
        }

        this.setState({ cutPositions: newCutPositions });

        // Update visualization
        this.updateCutLines();
        this.updatePieceOverlays();

        // Animate cut if enabled
        if (this.state.animateCuts) {
            this.animateCutPlacement(position, newCutPositions.length - 1);
        }
    }

    /**
     * Handle piece selection requests
     */
    handlePieceSelectionRequested(data) {
        const { pieceIndex } = data;

        if (pieceIndex >= 0 && pieceIndex < this.calculatePieces().length) {
            const pieces = this.calculatePieces();
            this.selectPiece(pieceIndex, pieces[pieceIndex]);
        }
    }

    /**
     * Handle player values updates
     */
    handlePlayerValuesUpdated(data) {
        // Update player values display
        this.updatePlayerValuesDisplay();

        // Recalculate piece values if a piece is selected
        if (this.state.selectedPiece !== null) {
            const pieces = this.calculatePieces();
            const selectedPiece = pieces[this.state.selectedPiece];
            if (selectedPiece) {
                this.showPieceInfo(selectedPiece, this.state.selectedPiece);
            }
        }
    }

    /**
     * Handle visualization update requests
     */
    handleVisualizationUpdate(data) {
        const { type, ...updateData } = data;

        switch (type) {
            case 'add-cut':
                this.handleCutPositionChanged({ position: updateData.position });
                break;

            case 'highlight-piece':
                if (updateData.pieceIndex !== undefined) {
                    this.highlightPiece(updateData.pieceIndex, updateData.duration);
                }
                break;

            case 'show-animation':
                this.showEducationalAnimation(updateData);
                break;

            case 'update-status':
                this.updateStatus(updateData.message);
                break;

            default:
                console.warn(`Unknown visualization update type: ${type}`);
        }
    }

    /**
     * Handle cut made event
     */
    handleCutMade(data) {
        const { position, player } = data;

        // Add cut with animation
        this.handleCutPositionChanged({ position });

        // Show educational message
        const playerName = `Player ${player || 'Unknown'}`;
        this.updateStatus(`${playerName} made a cut at ${position.toFixed(1)}%`);

        // Emit query tracking for educational purposes
        this.emit('cut-query-made', {
            position,
            player,
            timestamp: Date.now(),
            source: this.id
        });
    }

    // ===== ANIMATION METHODS =====

    /**
     * Animate cut placement
     */
    animateCutPlacement(position, cutIndex) {
        if (!this.state.animateCuts || !this.cutLinesGroup) return;

        const cutLine = this.cutLinesGroup.querySelector(`[data-cut-index="${cutIndex}"]`);
        if (!cutLine) return;

        // Start with invisible line
        cutLine.style.opacity = '0';
        cutLine.style.transform = 'scaleY(0)';
        cutLine.style.transformOrigin = 'center bottom';
        cutLine.style.transition = `all ${this.animationDuration}ms ease-out`;

        // Animate in
        setTimeout(() => {
            cutLine.style.opacity = '1';
            cutLine.style.transform = 'scaleY(1)';
        }, 50);

        // Track animation
        this.currentAnimations.push({
            element: cutLine,
            type: 'cut-placement',
            startTime: Date.now()
        });
    }

    /**
     * Highlight a specific piece
     */
    highlightPiece(pieceIndex, duration = 2000) {
        const overlay = this.overlaysGroup.querySelector(`[data-piece-index="${pieceIndex}"]`);
        if (!overlay) return;

        // Add highlight effect
        overlay.setAttribute('fill', 'rgba(72, 187, 120, 0.4)');
        overlay.setAttribute('stroke', '#38a169');
        overlay.setAttribute('stroke-width', '3');

        // Remove highlight after duration
        setTimeout(() => {
            if (this.state.selectedPiece !== pieceIndex) {
                overlay.setAttribute('fill', 'transparent');
                overlay.setAttribute('stroke', 'transparent');
                overlay.setAttribute('stroke-width', '2');
            }
        }, duration);
    }

    /**
     * Show educational animation
     */
    showEducationalAnimation(animationData) {
        const { message, duration = 3000 } = animationData;

        this.showEducationalOverlay(message);

        // Auto-hide after duration
        setTimeout(() => {
            this.hideEducationalOverlay();
        }, duration);
    }

    // ===== UTILITY METHODS =====

    /**
     * Update status display
     */
    updateStatus(message) {
        if (this.statusDisplay) {
            const statusText = this.statusDisplay.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = message;
            }
        }
    }

    /**
     * Clear all animations
     */
    clearAnimations() {
        this.currentAnimations.forEach(animation => {
            if (animation.element) {
                animation.element.style.transition = '';
                animation.element.style.transform = '';
                animation.element.style.opacity = '';
            }
        });
        this.currentAnimations = [];
    }

    /**
     * Get visualization bounds for external calculations
     */
    getVisualizationBounds() {
        const { width, height, margin } = this.dimensions;

        return {
            x: margin.left,
            y: (height - 60) / 2,
            width: width - margin.left - margin.right,
            height: 60,
            totalWidth: width,
            totalHeight: height
        };
    }

    // ===== PUBLIC API =====

    /**
     * Add a cut at specified position
     */
    addCut(position, player = null) {
        this.emit('cut-position-changed', { position, player, source: this.id });
    }

    /**
     * Clear all cuts
     */
    clearCuts() {
        this.setState({ cutPositions: [], selectedPiece: null });
        this.renderCake();
    }

    /**
     * Set player count
     */
    setPlayerCount(count) {
        if (count >= 2 && count <= 4) {
            this.setState({ playerCount: count });
            this.updatePlayerValuesDisplay();
        }
    }

    /**
     * Get current visualization state
     */
    getVisualizationState() {
        return {
            mode: this.state.visualizationMode,
            playerCount: this.state.playerCount,
            cutPositions: [...this.state.cutPositions],
            selectedPiece: this.state.selectedPiece,
            pieces: this.calculatePieces()
        };
    }

    /**
     * Export visualization as SVG string
     */
    exportSVG() {
        if (!this.svg) return null;

        const serializer = new XMLSerializer();
        return serializer.serializeToString(this.svg);
    }

    // ===== WIDGET LIFECYCLE =====

    /**
     * Widget-specific update handler
     */
    onUpdate(data, previousState) {
        // Handle state updates
        if (data.visualizationMode && data.visualizationMode !== previousState.visualizationMode) {
            this.renderCake();
        }

        if (data.playerCount && data.playerCount !== previousState.playerCount) {
            this.updatePlayerValuesDisplay();
        }

        if (data.cutPositions && JSON.stringify(data.cutPositions) !== JSON.stringify(previousState.cutPositions)) {
            this.updateCutLines();
            this.updatePieceOverlays();
        }
    }

    /**
     * Handle theme changes
     */
    onThemeChanged(theme) {
        // Update SVG styling based on theme
        if (this.svg) {
            this.svg.setAttribute('data-theme', theme);
        }
    }

    /**
     * Widget cleanup
     */
    onDestroy() {
        // Clear animations
        this.clearAnimations();

        // Remove window event listener
        window.removeEventListener('resize', this.handleResize.bind(this));

        // Clear SVG references
        this.svg = null;
        this.cakeGroup = null;
        this.cutLinesGroup = null;
        this.overlaysGroup = null;
        this.labelsGroup = null;

        console.log(`Cake visualization widget ${this.id} destroyed`);
    }
}

// ===== WIDGET FACTORY AND REGISTRATION =====

/**
 * Factory function for creating Cake Visualization widgets
 */
function createCakeVisualizationWidget(id, config = {}) {
    return new CakeVisualizationWidget(id, config);
}

// Auto-register with widget registry when available
if (typeof window !== 'undefined') {
    // Try immediate registration if dashboard is already available
    const tryRegister = () => {
        if (window.Dashboard && window.Dashboard.getInstance) {
            const dashboard = window.Dashboard.getInstance();
            if (dashboard && dashboard.widgetRegistry) {
                dashboard.widgetRegistry.registerFactory('cake-visualization', createCakeVisualizationWidget, {
                    name: 'Cake Visualization',
                    description: 'Interactive SVG visualization for divisible goods algorithms',
                    category: 'visualization',
                    version: '1.0.0',
                    author: 'Fair Division Platform',
                    tags: ['visualization', 'cake', 'divisible-goods', 'interactive'],
                    complexity: 'intermediate',
                    educational: {
                        level: 'undergraduate',
                        concepts: ['cake-cutting', 'fair-division', 'algorithm-visualization']
                    },
                    preferredRegion: 'visualization',
                    defaultConfig: {
                        showPlayerValues: true,
                        showCutLines: true,
                        enableInteraction: true,
                        animateCuts: true
                    },
                    icon: '🍰'
                });

                console.log('✓ Cake Visualization widget registered');
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
                        console.warn('Failed to register Cake Visualization widget - Dashboard not found');
                    }
                }, 100);
            }
        });
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CakeVisualizationWidget, createCakeVisualizationWidget };
}
/**
 * Interactive Steinhaus Lone-Divider Algorithm Demo
 * 
 * This demonstrates the Steinhaus lone-divider fair division algorithm
 * where one player divides into three pieces and the other two choose.
 * 
 * Architecture:
 * - Configuration: All constants and settings
 * - GameState: Centralized state management  
 * - CalculationEngine: Pure calculation functions
 * - UIManager: All UI interactions and updates
 * - GameController: Orchestrates the game flow
 */

// ===== CONFIGURATION =====

const CONFIG = {
    CANVAS: { WIDTH: 800, HEIGHT: 400 },
    PHASES: { INITIAL_DIVISION: 1, NON_DIVIDER_ANALYSIS: 2, RECONSTRUCTION: 3 },
    STEPS: { CUTTING: 1, ANALYSIS: 2, PLAYER3_SELECT: 2, PLAYER2_SELECT: 3, RECONSTRUCTION_SETUP: 4, RECONSTRUCTION_CUT: 5, COMPLETE: 6 },
    ALGORITHM: { PROPORTIONAL_THRESHOLD: 100 / 3, EQUAL_VALUE_TOLERANCE: 1.0, RECONSTRUCTION_TOLERANCE: 0.1 },
    VALIDATION: { REQUIRED_TOTAL: 100, MIN_VALUE: 0, MAX_VALUE: 100 },
    TIMING: { SELECTION_DELAY: 1000, TRANSITION_DELAY: 500 },
    MESSAGES: {
        STEP_1: "Step 1: Player 1 (Divider) creates three equal-value pieces",
        STEP_2_CASE_A: "Step 2: Case A - Non-dividers pick in order",
        STEP_2_CASE_B: "Step 2: Case B - Removing unacceptable piece",
        STEP_3_RECONSTRUCTION: "Step 3: Divide-and-Choose Reconstruction",
        STEP_3_PLAYER2: "Step 3: Player 2 selects from remaining pieces",
        COMPLETE: "Algorithm Complete! View Results Below.",
        INSTRUCTIONS_1: "<strong>Instructions:</strong> Player 1, use the sliders below to position two vertical cuts to create three pieces that you value equally.",
        INSTRUCTIONS_PLAYER3: "<strong>Instructions:</strong> Player 3, click on your preferred piece!",
        INSTRUCTIONS_PLAYER2: "<strong>Instructions:</strong> Player 2, click on your preferred piece from the remaining options!",
        INSTRUCTIONS_RECONSTRUCTION: "<strong>Reconstruction Phase:</strong> Player {0}, the gray area shows the removed piece. The remaining cake is now treated as your \"whole\" (100%) for divide-and-choose.",
        INSTRUCTIONS_CHOOSER: "<strong>Choose Phase:</strong> Player {0} (chooser), click on the piece you prefer!",
        INSTRUCTIONS_CONTINUE: "<strong>Next Phase:</strong> Click Continue to proceed to Divide-and-Choose reconstruction.",
        PHASE_1: "Phase 1: Initial Division",
        PHASE_2: "Phase 2: Non-Divider Analysis",
        PHASE_3: "Phase 3: Reconstructing Remaining Pieces"
    }
};

const REGIONS = {
    blue: { start: 0, end: 600 },
    pink: { start: 0, end: 150 },
    green: { start: 150, end: 600 },
    red: { start: 600, end: 800 },
    orange: { start: 600, end: 800 },
    purple: { start: 150, end: 800 }
};

const DEFAULT_VALUATIONS = {
    player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
    player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 },
    player3: { blue: 30, red: 10, green: 15, orange: 5, pink: 25, purple: 15 }
};

// ===== UTILITY FUNCTIONS =====

const Utils = {
    clamp(value, min, max) { return Math.min(Math.max(value, min), max); },
    formatNumber(num, decimals = 1) { return Number(num).toFixed(decimals); },
    getColorNames() { return Object.keys(REGIONS); },
    setElementDisplay(element, show) { if (element) element.style.display = show ? 'block' : 'none'; },
    formatMessage(template, ...args) { return template.replace(/{(\d+)}/g, (match, index) => args[index] || match); }
};

// ===== GAME STATE =====

class GameState {
    constructor() { this.reset(); }

    reset() {
        this.step = CONFIG.STEPS.CUTTING;
        this.phase = CONFIG.PHASES.INITIAL_DIVISION;
        this.cutPositions = [267, 533];
        this.pieceValues = { p1: [0, 0, 0], p2: [0, 0, 0], p3: [0, 0, 0] };
        this.acceptablePieces = { p2: [], p3: [] };
        this.selectedPiece = null;
        this.finalAllocation = {};
        this.algorithmCase = null;
        this.playerValues = JSON.parse(JSON.stringify(DEFAULT_VALUATIONS));

        this.reconstructionState = {
            active: false, remainingPieces: [], combinedCake: { start: 0, end: 0 },
            cutPosition: 50, selectedPiece: null, divider: null, chooser: null, dividerValue: 0, chooserValue: 0
        };
    }

    updatePlayerValues() {
        const colors = Utils.getColorNames();
        ['player1', 'player2', 'player3'].forEach((player, idx) => {
            const prefix = `p${idx + 1}`;
            for (let color of colors) {
                const element = document.getElementById(`${prefix}-${color}`);
                if (element) {
                    this.playerValues[player][color] = Utils.clamp(parseInt(element.value) || 0, 0, 100);
                }
            }
        });
    }

    validateTotals() {
        const results = {};
        ['player1', 'player2', 'player3'].forEach((player, idx) => {
            const total = Object.values(this.playerValues[player]).reduce((sum, value) => sum + value, 0);
            results[`p${idx + 1}`] = { total, valid: total === CONFIG.VALIDATION.REQUIRED_TOTAL };
        });
        return results;
    }

    isValid() {
        const validation = this.validateTotals();
        return validation.p1.valid && validation.p2.valid && validation.p3.valid;
    }
}

// ===== CALCULATION ENGINE =====

class CalculationEngine {
    static calculatePieceValues(cut1, cut2, playerValues) {
        const cuts = [0, cut1, cut2, CONFIG.CANVAS.WIDTH].sort((a, b) => a - b);
        const pieceValues = { p1: [], p2: [], p3: [] };

        for (let pieceIdx = 0; pieceIdx < 3; pieceIdx++) {
            const pieceStart = cuts[pieceIdx];
            const pieceEnd = cuts[pieceIdx + 1];

            ['player1', 'player2', 'player3'].forEach((player, playerIdx) => {
                let total = 0;
                const prefs = playerValues[player];

                for (const [color, bounds] of Object.entries(REGIONS)) {
                    const regionWidth = bounds.end - bounds.start;
                    let overlapWidth = 0;

                    if (pieceEnd > bounds.start && pieceStart < bounds.end) {
                        const overlapStart = Math.max(pieceStart, bounds.start);
                        const overlapEnd = Math.min(pieceEnd, bounds.end);
                        overlapWidth = overlapEnd - overlapStart;
                    }

                    const overlapPercent = (overlapWidth / regionWidth) * 100;
                    total += (overlapPercent / 100) * prefs[color];
                }

                pieceValues[`p${playerIdx + 1}`][pieceIdx] = total;
            });
        }

        return pieceValues;
    }

    static analyzeAcceptablePieces(pieceValues) {
        const threshold = CONFIG.ALGORITHM.PROPORTIONAL_THRESHOLD;
        const acceptablePieces = { p2: [], p3: [] };

        for (let i = 0; i < 3; i++) {
            if (pieceValues.p2[i] >= threshold) acceptablePieces.p2.push(i);
            if (pieceValues.p3[i] >= threshold) acceptablePieces.p3.push(i);
        }

        return acceptablePieces;
    }

    static determineAlgorithmCase(acceptablePieces) {
        const p2Count = acceptablePieces.p2.length;
        const p3Count = acceptablePieces.p3.length;
        return (p2Count >= 2 || p3Count >= 2) ? 'A' : 'B';
    }

    static checkDividerEquality(dividerValues) {
        const maxDiff = Math.max(
            Math.abs(dividerValues[0] - dividerValues[1]),
            Math.abs(dividerValues[1] - dividerValues[2]),
            Math.abs(dividerValues[0] - dividerValues[2])
        );
        return maxDiff < CONFIG.ALGORITHM.EQUAL_VALUE_TOLERANCE;
    }

    static calculateReconstructionPieceValue(pieceStart, pieceEnd, playerValues) {
        const values = { p1: 0, p2: 0, p3: 0 };

        ['player1', 'player2', 'player3'].forEach((player, playerIdx) => {
            let total = 0;
            const prefs = playerValues[player];

            for (const [color, bounds] of Object.entries(REGIONS)) {
                const regionWidth = bounds.end - bounds.start;
                let overlapWidth = 0;

                if (pieceEnd > bounds.start && pieceStart < bounds.end) {
                    const overlapStart = Math.max(pieceStart, bounds.start);
                    const overlapEnd = Math.min(pieceEnd, bounds.end);
                    overlapWidth = overlapEnd - overlapStart;
                }

                const overlapPercent = (overlapWidth / regionWidth) * 100;
                total += (overlapPercent / 100) * prefs[color];
            }

            values[`p${playerIdx + 1}`] = total;
        });

        return values;
    }

    static findUnacceptablePiece(acceptablePieces) {
        for (let i = 0; i < 3; i++) {
            if (!acceptablePieces.p2.includes(i) && !acceptablePieces.p3.includes(i)) {
                return i;
            }
        }
        return null;
    }
}

// ===== UI MANAGER =====

class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.elements = this.cacheElements();
        this.bindEvents();
    }

    cacheElements() {
        const elementIds = [
            'stepIndicator', 'phaseIndicator', 'instructions', 'gameArea',
            'cutSlider1', 'cutSlider2', 'cutPosition1', 'cutPosition2',
            'cutLine1', 'cutLine2', 'piece1', 'piece2', 'piece3',
            'piece1Value', 'piece2Value', 'piece3Value',
            'makeCutsButton', 'continueButton', 'resetButton',
            'sliderContainer', 'pieceInfo', 'controls', 'algorithmInfo',
            'caseAnalysis', 'warning', 'results', 'resultText',
            'proportionalResult', 'algorithmPath',
            'reconstructionInterface', 'reconstructionSlider', 'reconstructionCutPosition',
            'makeReconstructionCutButton', 'dividerValues', 'chooserValues',
            'reconstructionCutLine', 'reconstructionLeftPiece', 'reconstructionRightPiece',
            'p1-total', 'p2-total', 'p3-total', 'p2-values', 'p3-values'
        ];

        const elements = {};
        elementIds.forEach(id => elements[id] = document.getElementById(id));
        return elements;
    }

    bindEvents() {
        this.elements['cutSlider1']?.addEventListener('input', () => this.handleSliderChange());
        this.elements['cutSlider2']?.addEventListener('input', () => this.handleSliderChange());
        this.elements.makeCutsButton?.addEventListener('click', () => this.handleMakeCuts());
        this.elements.continueButton?.addEventListener('click', () => this.handleContinue());
        this.elements.resetButton?.addEventListener('click', () => this.handleReset());
        this.elements.reconstructionSlider?.addEventListener('input', () => this.handleReconstructionSliderChange());
        this.elements.makeReconstructionCutButton?.addEventListener('click', () => this.handleMakeReconstructionCut());
        this.bindValuationInputs();
    }

    bindValuationInputs() {
        const colors = Utils.getColorNames();
        const players = ['p1', 'p2', 'p3'];

        players.forEach(player => {
            colors.forEach(color => {
                const element = document.getElementById(`${player}-${color}`);
                if (element) {
                    element.addEventListener('input', () => this.handleValuationChange());
                }
            });
        });
    }

    handleValuationChange() {
        this.gameState.updatePlayerValues();
        this.updateValidationDisplay();
        if (this.gameState.step === CONFIG.STEPS.CUTTING) {
            this.updateGameValues();
        }
    }

    handleSliderChange() {
        this.updateGameValues();
    }

    handleMakeCuts() {
        if (this.gameState.step !== CONFIG.STEPS.CUTTING || !this.gameState.isValid()) return;
        this.transitionToAnalysis();
    }

    handleContinue() {
        if (this.gameState.algorithmCase === 'B' && this.gameState.reconstructionState.active) {
            this.startReconstruction();
        } else {
            this.showResults();
        }
    }

    handleReset() {
        this.gameState.reset();
        this.resetUI();
        this.updateValidationDisplay();
        this.updateGameValues();
    }

    handleReconstructionSliderChange() {
        this.updateReconstructionValues();
    }

    handleMakeReconstructionCut() {
        this.makeReconstructionCut();
    }

    updateGameValues() {
        const cut1 = parseFloat(this.elements.cutSlider1.value);
        const cut2 = parseFloat(this.elements.cutSlider2.value);

        if (cut1 >= cut2) {
            if (event && event.target.id === 'cutSlider1') {
                this.elements.cutSlider2.value = cut1 + 10;
            } else {
                this.elements.cutSlider1.value = cut2 - 10;
            }
            return this.updateGameValues();
        }

        this.gameState.cutPositions = [cut1, cut2];
        this.updateCutLines();
        this.updatePositionDisplays();
        this.calculateAndDisplayValues();
        this.checkDividerEquality();
    }

    updateCutLines() {
        const [cut1, cut2] = this.gameState.cutPositions;
        this.elements.cutLine1.setAttribute('x1', cut1);
        this.elements.cutLine1.setAttribute('x2', cut1);
        this.elements.cutLine2.setAttribute('x1', cut2);
        this.elements.cutLine2.setAttribute('x2', cut2);
    }

    updatePositionDisplays() {
        const [cut1, cut2] = this.gameState.cutPositions;
        this.elements.cutPosition1.textContent = `${(cut1 / CONFIG.CANVAS.WIDTH * 100).toFixed(1)}%`;
        this.elements.cutPosition2.textContent = `${(cut2 / CONFIG.CANVAS.WIDTH * 100).toFixed(1)}%`;
    }

    calculateAndDisplayValues() {
        const [cut1, cut2] = this.gameState.cutPositions;
        this.gameState.pieceValues = CalculationEngine.calculatePieceValues(cut1, cut2, this.gameState.playerValues);

        for (let i = 0; i < 3; i++) {
            this.elements[`piece${i + 1}Value`].textContent = `Value: ${Utils.formatNumber(this.gameState.pieceValues.p1[i])}`;
        }

        this.elements['p2-values'].textContent =
            `P1: ${Utils.formatNumber(this.gameState.pieceValues.p2[0])} | P2: ${Utils.formatNumber(this.gameState.pieceValues.p2[1])} | P3: ${Utils.formatNumber(this.gameState.pieceValues.p2[2])}`;
        this.elements['p3-values'].textContent =
            `P1: ${Utils.formatNumber(this.gameState.pieceValues.p3[0])} | P2: ${Utils.formatNumber(this.gameState.pieceValues.p3[1])} | P3: ${Utils.formatNumber(this.gameState.pieceValues.p3[2])}`;
    }

    checkDividerEquality() {
        const isEqual = CalculationEngine.checkDividerEquality(this.gameState.pieceValues.p1);
        Utils.setElementDisplay(this.elements.warning, !isEqual);
    }

    updateValidationDisplay() {
        const validation = this.gameState.validateTotals();

        ['p1', 'p2', 'p3'].forEach(player => {
            const totalEl = this.elements[`${player}-total`];
            if (totalEl) {
                const isValid = validation[player].valid;
                totalEl.innerHTML = `Total: <span class="${isValid ? 'valid' : 'error'}">${validation[player].total}</span>`;
            }
        });

        if (this.elements.makeCutsButton) {
            this.elements.makeCutsButton.disabled = !this.gameState.isValid();
        }
    }

    transitionToAnalysis() {
        this.gameState.step = CONFIG.STEPS.ANALYSIS;
        this.gameState.phase = CONFIG.PHASES.NON_DIVIDER_ANALYSIS;

        Utils.setElementDisplay(this.elements.sliderContainer, false);
        Utils.setElementDisplay(this.elements.makeCutsButton, false);
        Utils.setElementDisplay(this.elements.warning, false);

        this.showPieceOverlays();
        this.gameState.acceptablePieces = CalculationEngine.analyzeAcceptablePieces(this.gameState.pieceValues);
        this.highlightAcceptablePieces();
        this.gameState.algorithmCase = CalculationEngine.determineAlgorithmCase(this.gameState.acceptablePieces);

        this.elements.phaseIndicator.textContent = CONFIG.MESSAGES.PHASE_2;

        if (this.gameState.algorithmCase === 'A') {
            this.handleCaseA();
        } else {
            this.handleCaseB();
        }
    }

    showPieceOverlays() {
        const [cut1, cut2] = this.gameState.cutPositions;
        const cuts = [0, cut1, cut2, CONFIG.CANVAS.WIDTH].sort((a, b) => a - b);

        for (let i = 0; i < 3; i++) {
            const piece = this.elements[`piece${i + 1}`];
            piece.setAttribute('x', cuts[i]);
            piece.setAttribute('width', cuts[i + 1] - cuts[i]);
            Utils.setElementDisplay(piece, true);
        }
    }

    highlightAcceptablePieces() {
        for (let i = 0; i < 3; i++) {
            const piece = this.elements[`piece${i + 1}`];
            const isP2Acceptable = this.gameState.acceptablePieces.p2.includes(i);
            const isP3Acceptable = this.gameState.acceptablePieces.p3.includes(i);

            if (isP2Acceptable || isP3Acceptable) {
                piece.classList.add('acceptable');
            }
        }
    }

    handleCaseA() {
        this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_2_CASE_A;
        Utils.setElementDisplay(this.elements.algorithmInfo, true);

        const p2Count = this.gameState.acceptablePieces.p2.length;
        const p3Count = this.gameState.acceptablePieces.p3.length;

        let caseText = '<strong>Case A:</strong> ';
        if (p2Count >= 2) caseText += `Player 2 sees ${p2Count} acceptable pieces. `;
        if (p3Count >= 2) caseText += `Player 3 sees ${p3Count} acceptable pieces. `;
        caseText += '<br><br>Player 3 picks first, then Player 2, then Player 1 gets the remaining piece.';

        this.elements.caseAnalysis.innerHTML = caseText;
        this.elements.instructions.innerHTML = CONFIG.MESSAGES.INSTRUCTIONS_PLAYER3;

        for (let i = 0; i < 3; i++) {
            this.elements[`piece${i + 1}`].onclick = () => this.selectPiecePlayer3(i);
        }
    }

    handleCaseB() {
        this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_2_CASE_B;
        Utils.setElementDisplay(this.elements.algorithmInfo, true);

        const unacceptablePiece = CalculationEngine.findUnacceptablePiece(this.gameState.acceptablePieces);

        let caseText = '<strong>Case B:</strong> Both non-dividers see at most 1 acceptable piece each.<br><br>';

        if (unacceptablePiece !== null) {
            caseText += `Piece ${unacceptablePiece + 1} is unacceptable to both non-dividers, so it goes to Player 1 (divider).<br><br>`;
            caseText += '<strong>Next:</strong> The remaining pieces will be combined and divided using Divide-and-Choose between the two non-dividers.';

            this.gameState.finalAllocation.p1 = unacceptablePiece;
            const remainingPieces = [0, 1, 2].filter(i => i !== unacceptablePiece);
            this.gameState.reconstructionState.remainingPieces = remainingPieces;
            this.gameState.reconstructionState.active = true;

            if (Math.random() < 0.5) {
                this.gameState.reconstructionState.divider = 'p2';
                this.gameState.reconstructionState.chooser = 'p3';
            } else {
                this.gameState.reconstructionState.divider = 'p3';
                this.gameState.reconstructionState.chooser = 'p2';
            }

            caseText += `<br><br>Player ${this.gameState.reconstructionState.divider.slice(1)} will divide, Player ${this.gameState.reconstructionState.chooser.slice(1)} will choose.`;

            this.elements[`piece${unacceptablePiece + 1}`].classList.add('selected');
            this.elements[`piece${unacceptablePiece + 1}`].style.opacity = '0.7';

            this.elements.instructions.innerHTML = CONFIG.MESSAGES.INSTRUCTIONS_CONTINUE;
            Utils.setElementDisplay(this.elements.continueButton, true);
        } else {
            caseText += 'Complex case detected. For this demo, we\'ll proceed with a simplified allocation.';
            this.gameState.finalAllocation = { p1: 0, p2: 1, p3: 2 };

            for (let i = 0; i < 3; i++) {
                this.elements[`piece${i + 1}`].classList.add('selected');
            }

            this.elements.instructions.innerHTML = '<strong>Algorithm Complete:</strong> Click Continue to see the final results.';
            Utils.setElementDisplay(this.elements.continueButton, true);
        }

        this.elements.caseAnalysis.innerHTML = caseText;
    }

    selectPiecePlayer3(pieceIndex) {
        if (this.gameState.step !== CONFIG.STEPS.ANALYSIS) return;

        for (let i = 0; i < 3; i++) {
            this.elements[`piece${i + 1}`].classList.remove('selected');
        }

        this.elements[`piece${pieceIndex + 1}`].classList.add('selected');
        this.gameState.finalAllocation.p3 = pieceIndex;

        const availablePieces = [0, 1, 2].filter(i => i !== pieceIndex);

        this.gameState.step = CONFIG.STEPS.PLAYER2_SELECT;
        this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_3_PLAYER2;
        this.elements.instructions.innerHTML = CONFIG.MESSAGES.INSTRUCTIONS_PLAYER2;

        for (let i = 0; i < 3; i++) {
            const piece = this.elements[`piece${i + 1}`];
            if (availablePieces.includes(i)) {
                piece.onclick = () => this.selectPiecePlayer2(i);
                piece.style.cursor = 'pointer';
            } else {
                piece.onclick = null;
                piece.style.cursor = 'not-allowed';
                piece.style.opacity = '0.5';
            }
        }
    }

    selectPiecePlayer2(pieceIndex) {
        if (this.gameState.step !== CONFIG.STEPS.PLAYER2_SELECT) return;

        this.elements[`piece${pieceIndex + 1}`].classList.add('selected');
        this.gameState.finalAllocation.p2 = pieceIndex;

        const remainingPiece = [0, 1, 2].find(i =>
            i !== this.gameState.finalAllocation.p2 && i !== this.gameState.finalAllocation.p3
        );
        this.gameState.finalAllocation.p1 = remainingPiece;

        setTimeout(() => this.showResults(), CONFIG.TIMING.SELECTION_DELAY);
    }

    startReconstruction() {
        this.gameState.step = CONFIG.STEPS.RECONSTRUCTION_SETUP;
        Utils.setElementDisplay(this.elements.continueButton, false);

        this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_3_RECONSTRUCTION;
        this.elements.phaseIndicator.textContent = CONFIG.MESSAGES.PHASE_3;

        const [cut1, cut2] = this.gameState.cutPositions;
        const cuts = [0, cut1, cut2, CONFIG.CANVAS.WIDTH].sort((a, b) => a - b);
        const remainingPieces = this.gameState.reconstructionState.remainingPieces;
        const removedPiece = this.gameState.finalAllocation.p1;

        let minX = CONFIG.CANVAS.WIDTH, maxX = 0;
        for (const pieceIdx of remainingPieces) {
            minX = Math.min(minX, cuts[pieceIdx]);
            maxX = Math.max(maxX, cuts[pieceIdx + 1]);
        }

        this.gameState.reconstructionState.combinedCake = { start: minX, end: maxX };

        // Visual gap setup
        for (let i = 0; i < 3; i++) {
            const piece = this.elements[`piece${i + 1}`];
            if (i === removedPiece) {
                piece.style.fill = 'rgba(128,128,128,0.8)';
                piece.style.stroke = '#ff0000';
                piece.style.strokeWidth = '4';
                piece.style.strokeDasharray = '10,10';
                piece.setAttribute('title', 'REMOVED - No cake here');
            } else {
                piece.style.border = '3px solid #ffa500';
                piece.style.strokeWidth = '4';
                piece.style.stroke = '#ffa500';
            }
        }

        Utils.setElementDisplay(this.elements.reconstructionInterface, true);

        const reconstructionSlider = this.elements.reconstructionSlider;
        reconstructionSlider.min = minX;
        reconstructionSlider.max = maxX;
        reconstructionSlider.value = (minX + maxX) / 2;  // Start in middle of actual range

        // Store gap information for slider logic
        reconstructionSlider.dataset.gapStart = cuts[removedPiece];
        reconstructionSlider.dataset.gapEnd = cuts[removedPiece + 1];
        reconstructionSlider.dataset.actualMin = minX;
        reconstructionSlider.dataset.actualMax = maxX;

        const reconstructionCutLine = this.elements.reconstructionCutLine;
        const initialCutX = (minX + maxX) / 2;
        reconstructionCutLine.setAttribute('x1', initialCutX);
        reconstructionCutLine.setAttribute('x2', initialCutX);
        Utils.setElementDisplay(reconstructionCutLine, true);

        const dividerNum = this.gameState.reconstructionState.divider.slice(1);
        this.elements.instructions.innerHTML = Utils.formatMessage(CONFIG.MESSAGES.INSTRUCTIONS_RECONSTRUCTION, dividerNum);

        this.updateReconstructionValues();
    }

    updateReconstructionValues() {
        const slider = this.elements.reconstructionSlider;
        const cutX = parseFloat(slider.value);

        const gapStart = parseFloat(slider.dataset.gapStart);
        const gapEnd = parseFloat(slider.dataset.gapEnd);
        const minX = parseFloat(slider.dataset.actualMin);
        const maxX = parseFloat(slider.dataset.actualMax);

        this.elements.reconstructionCutLine.setAttribute('x1', cutX);
        this.elements.reconstructionCutLine.setAttribute('x2', cutX);

        let cutPercent, leftValues, rightValues;

        if (cutX >= gapStart && cutX <= gapEnd) {
            // Calculate what percentage through the remaining cake this represents
            const leftPieceLength = gapStart - minX;
            const totalRemainingLength = (gapStart - minX) + (maxX - gapEnd);
            cutPercent = (leftPieceLength / totalRemainingLength) * 100;

            leftValues = CalculationEngine.calculateReconstructionPieceValue(minX, gapStart, this.gameState.playerValues);
            rightValues = CalculationEngine.calculateReconstructionPieceValue(gapEnd, maxX, this.gameState.playerValues);
        } else if (cutX < gapStart) {
            const positionInLeft = Math.max(0, cutX - minX); // Prevent negative
            const leftPieceLength = gapStart - minX;
            const rightPieceLength = maxX - gapEnd;
            const totalRemainingLength = leftPieceLength + rightPieceLength;
            cutPercent = (positionInLeft / totalRemainingLength) * 100;

            leftValues = CalculationEngine.calculateReconstructionPieceValue(minX, cutX, this.gameState.playerValues);
            const restOfLeftPiece = CalculationEngine.calculateReconstructionPieceValue(cutX, gapStart, this.gameState.playerValues);
            const entireRightPiece = CalculationEngine.calculateReconstructionPieceValue(gapEnd, maxX, this.gameState.playerValues);

            rightValues = {
                p1: restOfLeftPiece.p1 + entireRightPiece.p1,
                p2: restOfLeftPiece.p2 + entireRightPiece.p2,
                p3: restOfLeftPiece.p3 + entireRightPiece.p3
            };
        } else {
            const leftPieceLength = gapStart - minX;
            const rightPieceLength = maxX - gapEnd;
            const totalRemainingLength = leftPieceLength + rightPieceLength;
            const positionInRight = cutX - gapEnd;
            cutPercent = ((leftPieceLength + positionInRight) / totalRemainingLength) * 100;

            const entireLeftPiece = CalculationEngine.calculateReconstructionPieceValue(minX, gapStart, this.gameState.playerValues);
            const partOfRightPiece = CalculationEngine.calculateReconstructionPieceValue(gapEnd, cutX, this.gameState.playerValues);

            leftValues = {
                p1: entireLeftPiece.p1 + partOfRightPiece.p1,
                p2: entireLeftPiece.p2 + partOfRightPiece.p2,
                p3: entireLeftPiece.p3 + partOfRightPiece.p3
            };

            rightValues = CalculationEngine.calculateReconstructionPieceValue(cutX, maxX, this.gameState.playerValues);
        }

        this.elements.reconstructionCutPosition.textContent = `${cutPercent.toFixed(1)}%`;
        this.displayReconstructionValues(leftValues, rightValues);
    }

    displayReconstructionValues(leftValues, rightValues) {
        const gapStart = parseFloat(this.elements.reconstructionSlider.dataset.gapStart);
        const gapEnd = parseFloat(this.elements.reconstructionSlider.dataset.gapEnd);
        const minX = parseFloat(this.elements.reconstructionSlider.dataset.actualMin);
        const maxX = parseFloat(this.elements.reconstructionSlider.dataset.actualMax);

        const totalRemainingValues = {
            p1: CalculationEngine.calculateReconstructionPieceValue(minX, gapStart, this.gameState.playerValues).p1 +
                CalculationEngine.calculateReconstructionPieceValue(gapEnd, maxX, this.gameState.playerValues).p1,
            p2: CalculationEngine.calculateReconstructionPieceValue(minX, gapStart, this.gameState.playerValues).p2 +
                CalculationEngine.calculateReconstructionPieceValue(gapEnd, maxX, this.gameState.playerValues).p2,
            p3: CalculationEngine.calculateReconstructionPieceValue(minX, gapStart, this.gameState.playerValues).p3 +
                CalculationEngine.calculateReconstructionPieceValue(gapEnd, maxX, this.gameState.playerValues).p3
        };

        const divider = this.gameState.reconstructionState.divider;
        const chooser = this.gameState.reconstructionState.chooser;

        const dividerScale = 100 / totalRemainingValues[divider];
        const chooserScale = 100 / totalRemainingValues[chooser];

        const scaledLeftDivider = leftValues[divider] * dividerScale;
        const scaledRightDivider = rightValues[divider] * dividerScale;
        const scaledLeftChooser = leftValues[chooser] * chooserScale;
        const scaledRightChooser = rightValues[chooser] * chooserScale;

        this.elements.dividerValues.textContent = `Left: ${scaledLeftDivider.toFixed(1)} | Right: ${scaledRightDivider.toFixed(1)}`;
        this.elements.chooserValues.textContent = `Left: ${scaledLeftChooser.toFixed(1)} | Right: ${scaledRightChooser.toFixed(1)}`;
    }

    makeReconstructionCut() {
        const slider = this.elements.reconstructionSlider;
        const cutX = parseFloat(slider.value);

        const gapStart = parseFloat(slider.dataset.gapStart);
        const gapEnd = parseFloat(slider.dataset.gapEnd);
        const minX = parseFloat(slider.dataset.actualMin);
        const maxX = parseFloat(slider.dataset.actualMax);

        Utils.setElementDisplay(this.elements.reconstructionSlider, false);
        Utils.setElementDisplay(this.elements.makeReconstructionCutButton, false);

        const leftPiece = this.elements.reconstructionLeftPiece;
        const rightPiece = this.elements.reconstructionRightPiece;

        // Clear any previous styling
        leftPiece.style.fill = 'rgba(0, 255, 0, 0.6)';
        rightPiece.style.fill = 'rgba(255, 0, 255, 0.6)';

        if (cutX >= gapStart && cutX <= gapEnd) {
            // Cut is in the gap - pieces are naturally separated
            leftPiece.setAttribute('x', minX);
            leftPiece.setAttribute('width', gapStart - minX);
            rightPiece.setAttribute('x', gapEnd);
            rightPiece.setAttribute('width', maxX - gapEnd);
        } else if (cutX < gapStart) {
            // Cut is in the first remaining segment
            leftPiece.setAttribute('x', minX);
            leftPiece.setAttribute('width', cutX - minX);

            // Right piece consists of two visual segments
            // Show only the first segment, use pattern/hatching to indicate the second
            rightPiece.setAttribute('x', cutX);
            rightPiece.setAttribute('width', gapStart - cutX);

            // Add visual indication that there's more cake after the gap
            rightPiece.style.fill = 'url(#discontinuousPattern)';

            // Create the pattern if it doesn't exist
            this.createDiscontinuousPattern();

            // Add text indicator for the second segment
            this.addSegmentIndicator(gapEnd, maxX - gapEnd, 'Part of right piece');

        } else { // cutX > gapEnd
            // Cut is in the second remaining segment

            // Left piece consists of two visual segments  
            // Show the first segment normally
            leftPiece.setAttribute('x', minX);
            leftPiece.setAttribute('width', gapStart - minX);
            leftPiece.style.fill = 'url(#discontinuousPattern)';

            // Add text indicator for the second part of left piece
            this.addSegmentIndicator(gapEnd, cutX - gapEnd, 'Part of left piece');

            // Right piece is just the remainder
            rightPiece.setAttribute('x', cutX);
            rightPiece.setAttribute('width', maxX - cutX);
        }

        Utils.setElementDisplay(leftPiece, true);
        Utils.setElementDisplay(rightPiece, true);

        leftPiece.onclick = () => this.selectReconstructionPiece('left', cutX);
        rightPiece.onclick = () => this.selectReconstructionPiece('right', cutX);

        const chooserNum = this.gameState.reconstructionState.chooser.slice(1);
        this.elements.instructions.innerHTML = Utils.formatMessage(CONFIG.MESSAGES.INSTRUCTIONS_CHOOSER, chooserNum);

        this.gameState.step = CONFIG.STEPS.RECONSTRUCTION_CUT;
    }

    // Helper method to create visual pattern for discontinuous pieces
    createDiscontinuousPattern() {
        const svg = document.querySelector('svg');
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            svg.appendChild(defs);
        }

        if (!defs.querySelector('#discontinuousPattern')) {
            const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
            pattern.setAttribute('id', 'discontinuousPattern');
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', '10');
            pattern.setAttribute('height', '10');

            const rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect1.setAttribute('width', '10');
            rect1.setAttribute('height', '10');
            rect1.setAttribute('fill', 'rgba(255, 0, 255, 0.6)');

            const rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect2.setAttribute('width', '5');
            rect2.setAttribute('height', '5');
            rect2.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');

            pattern.appendChild(rect1);
            pattern.appendChild(rect2);
            defs.appendChild(pattern);
        }
    }

    // Helper method to add text indicators for hidden segments
    addSegmentIndicator(x, width, text) {
        const svg = document.querySelector('svg');

        // Remove any existing indicators
        const existingIndicators = svg.querySelectorAll('.segment-indicator');
        existingIndicators.forEach(indicator => indicator.remove());

        // Add new indicator
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute('x', x + width / 2);
        textElement.setAttribute('y', CONFIG.CANVAS.HEIGHT / 2 - 30);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('class', 'segment-indicator');
        textElement.setAttribute('fill', '#666');
        textElement.setAttribute('font-size', '12');
        textElement.textContent = text;

        // Add a background rectangle for better visibility
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute('x', x);
        bgRect.setAttribute('y', CONFIG.CANVAS.HEIGHT / 2 - 10);
        bgRect.setAttribute('width', width);
        bgRect.setAttribute('height', 20);
        bgRect.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
        bgRect.setAttribute('stroke', '#999');
        bgRect.setAttribute('stroke-dasharray', '3,3');
        bgRect.setAttribute('class', 'segment-indicator');

        svg.appendChild(bgRect);
        svg.appendChild(textElement);
    }

    selectReconstructionPiece(side, cutX) {
        if (this.gameState.step !== CONFIG.STEPS.RECONSTRUCTION_CUT) return;

        const leftPiece = this.elements.reconstructionLeftPiece;
        const rightPiece = this.elements.reconstructionRightPiece;

        const gapStart = parseFloat(this.elements.reconstructionSlider.dataset.gapStart);
        const gapEnd = parseFloat(this.elements.reconstructionSlider.dataset.gapEnd);
        const minX = parseFloat(this.elements.reconstructionSlider.dataset.actualMin);
        const maxX = parseFloat(this.elements.reconstructionSlider.dataset.actualMax);

        leftPiece.classList.remove('selected');
        rightPiece.classList.remove('selected');

        let leftValues, rightValues;

        if (cutX >= gapStart && cutX <= gapEnd) {
            leftValues = CalculationEngine.calculateReconstructionPieceValue(minX, gapStart, this.gameState.playerValues);
            rightValues = CalculationEngine.calculateReconstructionPieceValue(gapEnd, maxX, this.gameState.playerValues);
        } else if (cutX < gapStart) {
            leftValues = CalculationEngine.calculateReconstructionPieceValue(minX, cutX, this.gameState.playerValues);
            const restOfLeftPiece = CalculationEngine.calculateReconstructionPieceValue(cutX, gapStart, this.gameState.playerValues);
            const entireRightPiece = CalculationEngine.calculateReconstructionPieceValue(gapEnd, maxX, this.gameState.playerValues);
            rightValues = {
                p1: restOfLeftPiece.p1 + entireRightPiece.p1,
                p2: restOfLeftPiece.p2 + entireRightPiece.p2,
                p3: restOfLeftPiece.p3 + entireRightPiece.p3
            };
        } else {
            const entireLeftPiece = CalculationEngine.calculateReconstructionPieceValue(minX, gapStart, this.gameState.playerValues);
            const partOfRightPiece = CalculationEngine.calculateReconstructionPieceValue(gapEnd, cutX, this.gameState.playerValues);
            leftValues = {
                p1: entireLeftPiece.p1 + partOfRightPiece.p1,
                p2: entireLeftPiece.p2 + partOfRightPiece.p2,
                p3: entireLeftPiece.p3 + partOfRightPiece.p3
            };
            rightValues = CalculationEngine.calculateReconstructionPieceValue(cutX, maxX, this.gameState.playerValues);
        }

        if (side === 'left') {
            leftPiece.classList.add('selected');
            this.gameState.reconstructionState.chooserValue = leftValues[this.gameState.reconstructionState.chooser];
            this.gameState.reconstructionState.dividerValue = rightValues[this.gameState.reconstructionState.divider];
        } else {
            rightPiece.classList.add('selected');
            this.gameState.reconstructionState.chooserValue = rightValues[this.gameState.reconstructionState.chooser];
            this.gameState.reconstructionState.dividerValue = leftValues[this.gameState.reconstructionState.divider];
        }

        setTimeout(() => this.showResults(), CONFIG.TIMING.SELECTION_DELAY);
    }

    showResults() {
        this.gameState.step = CONFIG.STEPS.COMPLETE;
        this.elements.stepIndicator.textContent = CONFIG.MESSAGES.COMPLETE;
        Utils.setElementDisplay(this.elements.instructions, false);
        Utils.setElementDisplay(this.elements.reconstructionInterface, false);

        Utils.setElementDisplay(this.elements.results, true);

        let p1Final, p2Final, p3Final;

        if (this.gameState.reconstructionState.active) {
            // Case B: Get values from reconstruction
            const unacceptablePiece = this.gameState.finalAllocation.p1;
            p1Final = this.gameState.pieceValues.p1[unacceptablePiece];

            if (this.gameState.reconstructionState.divider === 'p2') {
                p2Final = this.gameState.reconstructionState.dividerValue;
                p3Final = this.gameState.reconstructionState.chooserValue;
            } else {
                p3Final = this.gameState.reconstructionState.dividerValue;
                p2Final = this.gameState.reconstructionState.chooserValue;
            }
        } else {
            // Case A: Get values from direct allocation
            p1Final = this.gameState.pieceValues.p1[this.gameState.finalAllocation.p1];
            p2Final = this.gameState.pieceValues.p2[this.gameState.finalAllocation.p2];
            p3Final = this.gameState.pieceValues.p3[this.gameState.finalAllocation.p3];
        }

        // Simple results display - just show total cake value for each player
        const resultText =
            `Player 1: ${Utils.formatNumber(p1Final)}% value<br>` +
            `Player 2: ${Utils.formatNumber(p2Final)}% value<br>` +
            `Player 3: ${Utils.formatNumber(p3Final)}% value`;

        this.elements.resultText.innerHTML = resultText;

        // Check if allocation is proportional (each player gets ≥33.3%)
        const threshold = CONFIG.ALGORITHM.PROPORTIONAL_THRESHOLD - CONFIG.ALGORITHM.EQUAL_VALUE_TOLERANCE; // Add small tolerance for floating-point precision issues
        const proportional = p1Final >= threshold && p2Final >= threshold && p3Final >= threshold;

        this.elements.proportionalResult.textContent = proportional ?
            'All players get ≥33.3% value' : 'Some players get <33.3% value';
        this.elements.proportionalResult.style.color = proportional ? '#38a169' : '#e53e3e';

        const algorithmPath = this.gameState.algorithmCase === 'A' ?
            'Case A: Sequential selection' : 'Case B: Unacceptable piece removal + Divide-and-Choose';
        this.elements.algorithmPath.textContent = algorithmPath;

        Utils.setElementDisplay(this.elements.resetButton, true);
    }

    resetUI() {
        this.elements.stepIndicator.textContent = CONFIG.MESSAGES.STEP_1;
        this.elements.phaseIndicator.textContent = CONFIG.MESSAGES.PHASE_1;
        this.elements.instructions.innerHTML = CONFIG.MESSAGES.INSTRUCTIONS_1;

        this.elements.cutSlider1.value = 267;
        this.elements.cutSlider2.value = 533;

        Utils.setElementDisplay(this.elements.sliderContainer, true);
        Utils.setElementDisplay(this.elements.makeCutsButton, true);
        Utils.setElementDisplay(this.elements.continueButton, false);
        Utils.setElementDisplay(this.elements.resetButton, false);
        Utils.setElementDisplay(this.elements.results, false);
        Utils.setElementDisplay(this.elements.instructions, true);
        Utils.setElementDisplay(this.elements.algorithmInfo, false);
        Utils.setElementDisplay(this.elements.reconstructionInterface, false);
        Utils.setElementDisplay(this.elements.reconstructionCutLine, false);
        Utils.setElementDisplay(this.elements.reconstructionLeftPiece, false);
        Utils.setElementDisplay(this.elements.reconstructionRightPiece, false);

        for (let i = 1; i <= 3; i++) {
            const piece = this.elements[`piece${i}`];
            Utils.setElementDisplay(piece, false);
            piece.classList.remove('selected', 'acceptable');
            piece.style.opacity = '1';
            piece.style.cursor = 'pointer';
            piece.style.filter = 'none';
            piece.style.border = '';
            piece.onclick = null;
        }

        const reconstructionSlider = this.elements.reconstructionSlider;
        if (reconstructionSlider) {
            delete reconstructionSlider.dataset.gapStart;
            delete reconstructionSlider.dataset.gapEnd;
            delete reconstructionSlider.dataset.actualMin;
            delete reconstructionSlider.dataset.actualMax;
        }
    }
}

// ===== GAME CONTROLLER =====

class GameController {
    constructor() {
        this.gameState = new GameState();
        this.uiManager = new UIManager(this.gameState);
        this.initialize();
    }

    initialize() {
        this.setInitialValues();
        this.uiManager.updateValidationDisplay();
        this.uiManager.updateGameValues();
        console.log('Steinhaus Lone-Divider demo initialized successfully');
    }

    setInitialValues() {
        const colors = Utils.getColorNames();
        ['player1', 'player2', 'player3'].forEach((player, idx) => {
            const playerKey = `p${idx + 1}`;
            colors.forEach(color => {
                const element = document.getElementById(`${playerKey}-${color}`);
                if (element && this.gameState.playerValues[player][color] !== undefined) {
                    element.value = this.gameState.playerValues[player][color];
                }
            });
        });
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function () {
    try {
        window.gameController = new GameController();
    } catch (error) {
        console.error('Failed to initialize Steinhaus demo:', error);
    }
});
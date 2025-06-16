/**
 * Divide-and-Choose Algorithm Implementation
 * 
 * This is the production implementation of the Divide-and-Choose algorithm
 * using the unified architecture. It preserves all functionality from the
 * original demo while gaining the benefits of the shared calculation engine.
 */

class DivideAndChooseAlgorithm extends BaseAlgorithm {
    constructor() {
        super({
            id: 'divide-and-choose',
            name: 'Divide-and-Choose',
            description: 'The fundamental fair division procedure for two players',
            playerCount: 2,
            type: 'discrete',
            properties: ['proportional', 'envy-free', 'strategy-proof'],
            complexity: 'low',
            estimatedDuration: 3000,
            steps: ['setup', 'cutting', 'choosing', 'complete']
        });

        // Initialize calculation engine
        this.calculationEngine = new SharedCalculationEngine();

        // Algorithm-specific constants
        this.CANVAS_WIDTH = 800;
        this.DEFAULT_CUT_POSITION = 50; // percentage
        this.MIN_CUT_POSITION = 0;
        this.MAX_CUT_POSITION = 100;

        // Role assignments
        this.DIVIDER = 'player1';
        this.CHOOSER = 'player2';
    }

    // ===== REQUIRED ABSTRACT METHOD IMPLEMENTATIONS =====

    /**
     * Initialize algorithm with game state
     */
    async initialize(gameState) {
        console.log(`${this.name}: Initializing...`);

        // Set default algorithm state
        gameState.setAlgorithmState(this.id, 'cutPosition', this.DEFAULT_CUT_POSITION);
        gameState.setAlgorithmState(this.id, 'cutX', this.percentageToPixels(this.DEFAULT_CUT_POSITION));
        gameState.setAlgorithmState(this.id, 'selectedPiece', null);
        gameState.setAlgorithmState(this.id, 'divider', this.DIVIDER);
        gameState.setAlgorithmState(this.id, 'chooser', this.CHOOSER);
        gameState.setAlgorithmState(this.id, 'isReady', false);

        // Calculate initial piece values
        await this.updatePieceValues(gameState);

        console.log(`${this.name}: Initialized with cut at ${this.DEFAULT_CUT_POSITION}%`);
    }

    /**
     * Execute the complete algorithm
     */
    async execute(gameState) {
        console.log(`${this.name}: Executing complete algorithm...`);

        // Validate we have necessary state
        const cutPosition = gameState.getAlgorithmState(this.id, 'cutPosition');
        if (cutPosition === null || cutPosition === undefined) {
            throw new Error('Cut position not set');
        }

        // Get current analysis from calculation engine
        const analysis = await this.getCurrentAnalysis(gameState);

        // Player 2 (chooser) selects their preferred piece
        const chooserValues = analysis.playerValues[this.CHOOSER];
        const selectedPiece = chooserValues.left >= chooserValues.right ? 'left' : 'right';

        // Store selection
        gameState.setAlgorithmState(this.id, 'selectedPiece', selectedPiece);

        // Create final allocation
        const allocation = {
            [this.DIVIDER]: selectedPiece === 'left' ? 'right' : 'left',
            [this.CHOOSER]: selectedPiece
        };

        // Calculate final player values
        const finalPlayerValues = {
            [this.DIVIDER]: analysis.playerValues[this.DIVIDER][allocation[this.DIVIDER]],
            [this.CHOOSER]: analysis.playerValues[this.CHOOSER][allocation[this.CHOOSER]]
        };

        // Create comprehensive result
        const result = {
            // Core algorithm results
            playerValues: finalPlayerValues,
            allocation,
            selectedPiece,

            // Detailed analysis data
            cutPosition,
            cutX: analysis.cutPosition,
            pieceValues: analysis.playerValues, // Full piece-by-piece values
            distributions: analysis.distributions,

            // Algorithm metadata
            divider: this.DIVIDER,
            chooser: this.CHOOSER,

            // Enhanced analysis
            fairnessAnalysis: this.calculationEngine.analyzeFairness(
                allocation,
                analysis.playerValues,
                this.playerCount
            ),

            // Performance and optimization data
            optimizationData: await this.getOptimizationAnalysis(gameState),
            calculationStats: this.calculationEngine.getCacheStats()
        };

        console.log(`${this.name}: Execution complete. ${this.CHOOSER} selected ${selectedPiece} piece`);
        return result;
    }

    /**
     * Execute a single step of the algorithm
     */
    async executeStep(stepIndex, gameState) {
        const stepName = this.steps[stepIndex];
        console.log(`${this.name}: Executing step ${stepIndex}: ${stepName}`);

        switch (stepName) {
            case 'setup':
                return await this.executeSetupStep(gameState);
            case 'cutting':
                return await this.executeCuttingStep(gameState);
            case 'choosing':
                return await this.executeChoosingStep(gameState);
            case 'complete':
                return await this.executeCompleteStep(gameState);
            default:
                throw new Error(`Unknown step: ${stepName}`);
        }
    }

    /**
     * Validate inputs for this algorithm
     */
    validateInputs(gameState) {
        // Start with standard validation
        const baseValidation = this.standardInputValidation(gameState);
        if (!baseValidation.isValid) {
            return baseValidation;
        }

        const errors = [...baseValidation.errors];
        const warnings = [...baseValidation.warnings];

        // Algorithm-specific validation
        const player1Values = gameState.getPlayerValues(this.DIVIDER);
        const player2Values = gameState.getPlayerValues(this.CHOOSER);

        if (!player1Values || !player2Values) {
            errors.push('Divide-and-Choose requires exactly 2 players');
            return { isValid: false, errors, warnings };
        }

        // Check for problematic scenarios using calculation engine
        try {
            // Test if either player can make reasonable cuts
            const optimal1 = this.calculationEngine.findOptimalCutForPlayer(player1Values);
            const optimal2 = this.calculationEngine.findOptimalCutForPlayer(player2Values);

            if (optimal1.difference > 15) {
                warnings.push(`${this.DIVIDER} cannot create well-balanced pieces (difference: ${this.formatNumber(optimal1.difference)})`);
            }

            if (optimal2.difference > 15) {
                warnings.push(`${this.CHOOSER} would struggle as divider (difference: ${this.formatNumber(optimal2.difference)})`);
            }

            // Check for identical preferences
            const isIdentical = Object.keys(player1Values).every(color =>
                player1Values[color] === player2Values[color]
            );

            if (isIdentical) {
                warnings.push('Players have identical preferences - algorithm will be trivial');
            }

            // Test some cut positions for reasonable outcomes
            const testPositions = [25, 50, 75];
            let hasGoodOutcome = false;

            testPositions.forEach(position => {
                const analysis = this.calculationEngine.calculateDivideAndChooseValues(
                    this.percentageToPixels(position),
                    { [this.DIVIDER]: player1Values, [this.CHOOSER]: player2Values }
                );

                const minValue = Math.min(
                    analysis.playerValues[this.DIVIDER].left,
                    analysis.playerValues[this.DIVIDER].right,
                    analysis.playerValues[this.CHOOSER].left,
                    analysis.playerValues[this.CHOOSER].right
                );

                if (minValue >= 35) { // Reasonable minimum
                    hasGoodOutcome = true;
                }
            });

            if (!hasGoodOutcome) {
                warnings.push('These valuations may lead to very unequal outcomes');
            }

        } catch (error) {
            console.warn('Error in enhanced validation:', error);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Get UI controls required for this algorithm
     */
    getRequiredControls() {
        return [
            {
                type: 'slider',
                id: 'cut-position-slider',
                label: 'Cut Position',
                min: this.MIN_CUT_POSITION,
                max: this.MAX_CUT_POSITION,
                value: this.DEFAULT_CUT_POSITION,
                step: 0.5,
                unit: '%',
                description: `Position where ${this.DIVIDER} cuts the cake`,
                realTimeUpdate: true,
                showOptimalHint: true
            },
            {
                type: 'display',
                id: 'piece-values-display',
                label: 'Current Piece Values',
                description: 'Real-time values for both pieces as cut position changes'
            },
            {
                type: 'button',
                id: 'make-cut-button',
                label: 'Make Cut',
                variant: 'primary',
                description: 'Proceed to choosing phase',
                enabled: true
            },
            {
                type: 'button',
                id: 'find-optimal-button',
                label: 'Find Optimal Cut',
                variant: 'secondary',
                description: 'Find the cut position that creates equal-valued pieces'
            },
            {
                type: 'button',
                id: 'step-through-button',
                label: 'Step Through',
                variant: 'secondary',
                description: 'Execute algorithm step by step'
            }
        ];
    }

    // ===== STEP IMPLEMENTATION METHODS =====

    /**
     * Setup step - initialize the cutting phase
     */
    async executeSetupStep(gameState) {
        await this.updatePieceValues(gameState);

        return {
            stepName: 'setup',
            stepIndex: 0,
            description: `${this.DIVIDER} (divider) prepares to cut the cake into two pieces they value equally`,
            instructions: 'Use the cut position slider to create two pieces you value equally. Watch the piece values update in real-time.',
            nextAction: 'Adjust cut position and click "Make Cut" when ready',

            uiUpdates: {
                showCutSlider: true,
                showPieceValues: true,
                highlightPlayer: this.DIVIDER,
                enableOptimalHint: true,
                showInstructions: true
            },

            currentState: {
                cutPosition: gameState.getAlgorithmState(this.id, 'cutPosition'),
                analysis: await this.getCurrentAnalysis(gameState)
            }
        };
    }

    /**
     * Cutting step - player 1 finalizes their cut
     */
    async executeCuttingStep(gameState) {
        const cutPosition = gameState.getAlgorithmState(this.id, 'cutPosition');
        const analysis = await this.getCurrentAnalysis(gameState);
        const optimization = await this.getOptimizationAnalysis(gameState);

        // Mark cut as finalized
        gameState.setAlgorithmState(this.id, 'cutFinalized', true);

        return {
            stepName: 'cutting',
            stepIndex: 1,
            description: `${this.DIVIDER} cuts the cake at ${this.formatNumber(cutPosition)}%`,
            instructions: `Cut finalized! ${this.CHOOSER} will now choose their preferred piece.`,
            nextAction: `${this.CHOOSER}: Click on the piece you prefer`,

            cutData: {
                position: cutPosition,
                pixelPosition: analysis.cutPosition,
                dividerValues: analysis.playerValues[this.DIVIDER],
                isOptimal: optimization.isOptimal,
                qualityScore: optimization.qualityScore
            },

            uiUpdates: {
                showCutLine: true,
                showPieceOverlays: true,
                disableCutSlider: true,
                highlightPlayer: this.CHOOSER,
                showPieceSelection: true,
                message: optimization.isOptimal ?
                    'Excellent cut! Pieces are well-balanced.' :
                    `Could improve balance by ${optimization.improvementSuggestion}`
            },

            analysis
        };
    }

    /**
     * Choosing step - player 2 selects their preferred piece
     */
    async executeChoosingStep(gameState) {
        const analysis = await this.getCurrentAnalysis(gameState);
        const chooserValues = analysis.playerValues[this.CHOOSER];

        // Determine optimal choice for chooser
        const optimalChoice = chooserValues.left >= chooserValues.right ? 'left' : 'right';
        const choiceAdvantage = Math.abs(chooserValues.left - chooserValues.right);

        // Store the selection
        gameState.setAlgorithmState(this.id, 'selectedPiece', optimalChoice);

        return {
            stepName: 'choosing',
            stepIndex: 2,
            description: `${this.CHOOSER} chooses the ${optimalChoice} piece`,
            instructions: `${this.CHOOSER} selected the ${optimalChoice} piece, worth ${this.formatNumber(chooserValues[optimalChoice])} points to them.`,
            nextAction: 'View final allocation and fairness analysis',

            choiceData: {
                selectedPiece: optimalChoice,
                chooserValue: chooserValues[optimalChoice],
                alternativeValue: chooserValues[optimalChoice === 'left' ? 'right' : 'left'],
                advantage: choiceAdvantage,
                reasoning: choiceAdvantage > 0.1 ?
                    `Clear preference (${this.formatNumber(choiceAdvantage)} point advantage)` :
                    'Nearly indifferent between pieces'
            },

            uiUpdates: {
                highlightSelectedPiece: optimalChoice,
                showChoiceReasoning: true,
                highlightPlayer: this.CHOOSER,
                message: `${this.CHOOSER} chose the ${optimalChoice} piece (${this.formatNumber(chooserValues[optimalChoice])} points)`
            },

            analysis
        };
    }

    /**
     * Complete step - show final results and analysis
     */
    async executeCompleteStep(gameState) {
        const result = await this.execute(gameState);

        return {
            stepName: 'complete',
            stepIndex: 3,
            description: 'Divide-and-Choose algorithm complete',
            instructions: 'Final allocation determined. Both players are guaranteed at least 50% of their subjective value.',
            nextAction: 'Review results or start a new experiment',

            result,

            summary: {
                dividerFinalValue: result.playerValues[this.DIVIDER],
                chooserFinalValue: result.playerValues[this.CHOOSER],
                fairnessAchieved: result.fairnessAnalysis.summary.satisfiedProperties,
                algorithmSuccess: result.fairnessAnalysis.proportional.satisfied
            },

            uiUpdates: {
                showFinalAllocation: true,
                showFairnessAnalysis: true,
                showResults: true,
                enableReset: true,
                message: 'Algorithm complete! Both players achieved proportional fairness.'
            }
        };
    }

    // ===== ALGORITHM-SPECIFIC METHODS =====

    /**
     * Update piece values based on current cut position
     */
    async updatePieceValues(gameState) {
        const cutPosition = gameState.getAlgorithmState(this.id, 'cutPosition') || this.DEFAULT_CUT_POSITION;
        const cutX = this.percentageToPixels(cutPosition);

        // Update pixel position in state
        gameState.setAlgorithmState(this.id, 'cutX', cutX);

        // Get fresh analysis
        const analysis = await this.getCurrentAnalysis(gameState);

        // Emit event for UI updates
        this.emit('piece-values:updated', {
            cutPosition,
            cutX,
            analysis,
            timestamp: Date.now()
        });

        return analysis;
    }

    /**
     * Get current analysis from calculation engine
     */
    async getCurrentAnalysis(gameState) {
        const cutPosition = gameState.getAlgorithmState(this.id, 'cutPosition') || this.DEFAULT_CUT_POSITION;
        const cutX = this.percentageToPixels(cutPosition);

        const allPlayerValues = {
            [this.DIVIDER]: gameState.getPlayerValues(this.DIVIDER),
            [this.CHOOSER]: gameState.getPlayerValues(this.CHOOSER)
        };

        return this.calculationEngine.calculateDivideAndChooseValues(cutX, allPlayerValues);
    }

    /**
     * Get optimization analysis for current state
     */
    async getOptimizationAnalysis(gameState) {
        const dividerValues = gameState.getPlayerValues(this.DIVIDER);
        const currentPosition = gameState.getAlgorithmState(this.id, 'cutPosition') || this.DEFAULT_CUT_POSITION;

        // Find optimal cut for divider
        const optimal = this.calculationEngine.findOptimalCutForPlayer(dividerValues);
        const optimalPosition = this.pixelsToPercentage(optimal.position);

        // Calculate current quality
        const currentAnalysis = await this.getCurrentAnalysis(gameState);
        const currentDifference = Math.abs(
            currentAnalysis.playerValues[this.DIVIDER].left -
            currentAnalysis.playerValues[this.DIVIDER].right
        );

        const isOptimal = currentDifference <= optimal.difference + 0.5;
        const qualityScore = Math.max(0, 100 - currentDifference * 5); // 0-100 scale

        return {
            currentPosition,
            currentDifference,
            optimalPosition,
            optimalDifference: optimal.difference,
            isOptimal,
            qualityScore,
            improvementAvailable: !isOptimal,
            improvementSuggestion: !isOptimal ?
                `moving to ${this.formatNumber(optimalPosition)}%` : null,
            analysis: optimal
        };
    }

    /**
     * Update cut position with validation and events
     */
    async updateCutPosition(newPosition, gameState) {
        const clampedPosition = this.clamp(newPosition, this.MIN_CUT_POSITION, this.MAX_CUT_POSITION);
        const oldPosition = gameState.getAlgorithmState(this.id, 'cutPosition');

        if (Math.abs(clampedPosition - oldPosition) > 0.1) { // Avoid micro-updates
            // Update state
            gameState.setAlgorithmState(this.id, 'cutPosition', clampedPosition);
            gameState.setAlgorithmState(this.id, 'cutX', this.percentageToPixels(clampedPosition));

            // Get fresh analysis
            const analysis = await this.getCurrentAnalysis(gameState);
            const optimization = await this.getOptimizationAnalysis(gameState);

            // Emit comprehensive event
            this.emit('cut-position:changed', {
                oldPosition,
                newPosition: clampedPosition,
                analysis,
                optimization,
                timestamp: Date.now()
            });
        }

        return clampedPosition;
    }

    /**
     * Find and apply optimal cut position
     */
    async findOptimalCut(gameState) {
        const optimization = await this.getOptimizationAnalysis(gameState);
        const optimalPosition = optimization.optimalPosition;

        // Update to optimal position
        await this.updateCutPosition(optimalPosition, gameState);

        this.emit('optimal-cut:applied', {
            position: optimalPosition,
            improvement: optimization.currentDifference - optimization.optimalDifference,
            analysis: optimization.analysis
        });

        return optimalPosition;
    }

    /**
     * Simulate piece selection (for analysis/preview)
     */
    async simulateChoice(gameState, piece = null) {
        const analysis = await this.getCurrentAnalysis(gameState);
        const chooserValues = analysis.playerValues[this.CHOOSER];

        // Use provided piece or determine optimal choice
        const selectedPiece = piece || (chooserValues.left >= chooserValues.right ? 'left' : 'right');

        // Calculate what would happen
        const allocation = {
            [this.DIVIDER]: selectedPiece === 'left' ? 'right' : 'left',
            [this.CHOOSER]: selectedPiece
        };

        const finalValues = {
            [this.DIVIDER]: analysis.playerValues[this.DIVIDER][allocation[this.DIVIDER]],
            [this.CHOOSER]: analysis.playerValues[this.CHOOSER][allocation[this.CHOOSER]]
        };

        return {
            selectedPiece,
            allocation,
            finalValues,
            chooserAdvantage: Math.abs(chooserValues.left - chooserValues.right),
            isOptimalChoice: selectedPiece === (chooserValues.left >= chooserValues.right ? 'left' : 'right')
        };
    }

    /**
     * Get detailed educational analysis
     */
    async getEducationalAnalysis(gameState) {
        const analysis = await this.getCurrentAnalysis(gameState);
        const optimization = await this.getOptimizationAnalysis(gameState);
        const simulation = await this.simulateChoice(gameState);

        return {
            currentState: {
                cutPosition: gameState.getAlgorithmState(this.id, 'cutPosition'),
                pieceValues: analysis.playerValues,
                distributions: analysis.distributions
            },

            optimization: {
                currentQuality: optimization.qualityScore,
                canImprove: optimization.improvementAvailable,
                suggestion: optimization.improvementSuggestion,
                optimalPosition: optimization.optimalPosition
            },

            prediction: {
                likelyChoice: simulation.selectedPiece,
                chooserAdvantage: simulation.chooserAdvantage,
                finalOutcome: simulation.finalValues
            },

            insights: this.generateInsights(analysis, optimization, simulation)
        };
    }

    /**
     * Generate educational insights
     */
    generateInsights(analysis, optimization, simulation) {
        const insights = [];

        // Cut quality insights
        if (optimization.qualityScore >= 90) {
            insights.push({
                type: 'success',
                message: 'Excellent cut! The pieces are very well balanced for the divider.',
                detail: `Difference: only ${this.formatNumber(optimization.currentDifference)} points`
            });
        } else if (optimization.qualityScore >= 70) {
            insights.push({
                type: 'good',
                message: 'Good cut. The pieces are reasonably balanced.',
                detail: `Could improve by ${optimization.improvementSuggestion}`
            });
        } else {
            insights.push({
                type: 'warning',
                message: 'This cut creates unbalanced pieces for the divider.',
                detail: `Much better balance available by ${optimization.improvementSuggestion}`
            });
        }

        // Choice prediction insights
        const advantage = simulation.chooserAdvantage;
        if (advantage > 5) {
            insights.push({
                type: 'info',
                message: `The chooser has a clear preference for the ${simulation.selectedPiece} piece.`,
                detail: `${this.formatNumber(advantage)} point advantage over the other piece`
            });
        } else if (advantage < 1) {
            insights.push({
                type: 'info',
                message: 'The chooser is nearly indifferent between the pieces.',
                detail: 'Both pieces have similar value to them'
            });
        }

        // Fairness insights
        const minValue = Math.min(...Object.values(simulation.finalValues));
        if (minValue >= 50) {
            insights.push({
                type: 'success',
                message: 'Both players will achieve proportional fairness (≥50%).',
                detail: `Minimum value: ${this.formatNumber(minValue)}`
            });
        } else {
            insights.push({
                type: 'warning',
                message: 'One player may receive less than 50% value.',
                detail: `Minimum value: ${this.formatNumber(minValue)}`
            });
        }

        return insights;
    }

    // ===== UTILITY METHODS =====

    /**
     * Convert percentage to pixel position
     */
    percentageToPixels(percentage) {
        return (percentage / 100) * this.CANVAS_WIDTH;
    }

    /**
     * Convert pixel position to percentage
     */
    pixelsToPercentage(pixels) {
        return (pixels / this.CANVAS_WIDTH) * 100;
    }

    /**
     * Check if current cut creates balanced pieces for divider
     */
    async isBalancedCut(gameState, tolerance = 2.0) {
        const analysis = await this.getCurrentAnalysis(gameState);
        const dividerValues = analysis.playerValues[this.DIVIDER];
        const difference = Math.abs(dividerValues.left - dividerValues.right);
        return difference <= tolerance;
    }

    /**
     * Get algorithm-specific debug information
     */
    getAlgorithmDebugInfo(gameState) {
        return {
            algorithmId: this.id,
            algorithmName: this.name,
            currentStep: this.currentStep,
            state: {
                cutPosition: gameState.getAlgorithmState(this.id, 'cutPosition'),
                cutX: gameState.getAlgorithmState(this.id, 'cutX'),
                selectedPiece: gameState.getAlgorithmState(this.id, 'selectedPiece'),
                isReady: gameState.getAlgorithmState(this.id, 'isReady')
            },
            calculationEngine: this.calculationEngine.getDebugInfo(),
            performance: this.calculationEngine.getCacheStats()
        };
    }

}

// ===== FACTORY AND REGISTRATION =====

/**
 * Factory function to create the Divide-and-Choose algorithm
 */
function createDivideAndChooseAlgorithm() {
    return new DivideAndChooseAlgorithm();
}

async function runTest() {
    console.clear();
    console.log('Testing your changes...');

    const verification = new DivideAndChooseVerification();
    const success = await verification.runFullVerification();

    if (success) {
        alert('✅ All tests passed! Your changes work correctly.');
    } else {
        alert('⚠️ Some tests failed. Check the console for details.');
    }
}
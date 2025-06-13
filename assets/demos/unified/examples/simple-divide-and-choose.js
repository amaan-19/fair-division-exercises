/**
 * Example Algorithm Integration with Shared Calculation Engine
 * 
 * This shows how to update our example SimpleDivideAndChooseAlgorithm
 * to use the SharedCalculationEngine instead of its own calculations.
 */

class IntegratedDivideAndChooseAlgorithm extends BaseAlgorithm {
    constructor() {
        super({
            id: 'integrated-divide-and-choose',
            name: 'Integrated Divide-and-Choose',
            description: 'Divide-and-Choose using the shared calculation engine',
            playerCount: 2,
            type: 'discrete',
            properties: ['proportional', 'envy-free', 'strategy-proof'],
            complexity: 'low',
            estimatedDuration: 3000,
            steps: ['setup', 'cutting', 'choosing', 'complete']
        });

        // Initialize the shared calculation engine
        this.calculationEngine = new SharedCalculationEngine();

        // Algorithm-specific state
        this.cutPosition = 50; // percentage
        this.selectedPiece = null;
        this.divider = 'player1';
        this.chooser = 'player2';
    }

    /**
     * Calculate piece values using the shared calculation engine
     */
    calculatePieceValues(cutPositionPercent, gameState) {
        // Convert percentage to pixel position
        const cutX = (cutPositionPercent / 100) * 800;

        // Get all player values from game state
        const allPlayerValues = {
            player1: gameState.getPlayerValues('player1'),
            player2: gameState.getPlayerValues('player2')
        };

        // Use shared calculation engine - ONE LINE replaces 50+ lines!
        const result = this.calculationEngine.calculateDivideAndChooseValues(cutX, allPlayerValues);

        // Transform to match our expected format
        return {
            player1: {
                left: result.playerValues.player1.left,
                right: result.playerValues.player1.right
            },
            player2: {
                left: result.playerValues.player2.left,
                right: result.playerValues.player2.right
            },
            // Include additional data from calculation engine
            metadata: result.metadata,
            distributions: result.distributions
        };
    }

    /**
     * Use engine's optimized search
     */
    findOptimalCutForDivider(gameState) {
        const player1Values = gameState.getPlayerValues('player1');

        // Use shared calculation engine's optimization
        const optimal = this.calculationEngine.findOptimalCutForPlayer(player1Values);

        return {
            position: optimal.positionPercentage, // Convert back to percentage
            difference: optimal.difference,
            pieceValues: {
                player1: {
                    left: optimal.leftValue,
                    right: optimal.rightValue
                }
            },
            isOptimal: optimal.isOptimal
        };
    }

    /**
     * Enhanced execute method using calculation engine features
     */
    async execute(gameState) {
        console.log(`${this.name}: Executing with calculation engine...`);

        // Get current cut position
        this.cutPosition = gameState.getAlgorithmState(this.id, 'cutPosition') || 50;
        const cutX = (this.cutPosition / 100) * 800;

        // Get all player values
        const allPlayerValues = {
            player1: gameState.getPlayerValues('player1'),
            player2: gameState.getPlayerValues('player2')
        };

        // Use calculation engine for complete analysis
        const analysisResult = this.calculationEngine.calculateDivideAndChooseValues(cutX, allPlayerValues);

        // Player 2 chooses their preferred piece
        const p2LeftValue = analysisResult.playerValues.player2.left;
        const p2RightValue = analysisResult.playerValues.player2.right;
        this.selectedPiece = p2LeftValue >= p2RightValue ? 'left' : 'right';

        // Create allocation
        const allocation = {
            [this.divider]: this.selectedPiece === 'left' ? 'right' : 'left',
            [this.chooser]: this.selectedPiece
        };

        // Get final player values based on allocation
        const finalPlayerValues = {
            [this.divider]: analysisResult.playerValues.player1[allocation[this.divider]],
            [this.chooser]: analysisResult.playerValues.player2[allocation[this.chooser]]
        };

        // Use calculation engine for fairness analysis
        const fairnessAnalysis = this.calculationEngine.analyzeFairness(
            allocation,
            analysisResult.playerValues,
            this.playerCount
        );

        const result = {
            playerValues: finalPlayerValues,
            allocation,
            pieceValues: analysisResult.playerValues, // Full piece-by-piece values
            cutPosition: this.cutPosition,
            cutX: cutX,
            selectedPiece: this.selectedPiece,

            // Enhanced data from calculation engine
            distributions: analysisResult.distributions,
            metadata: analysisResult.metadata,
            fairnessAnalysis, // Detailed fairness properties

            // Performance data
            calculationStats: this.calculationEngine.getCacheStats()
        };

        console.log(`${this.name}: Execution complete with enhanced analysis`);
        return result;
    }

    /**
     * Enhanced step execution with richer feedback
     */
    async executeCuttingStep(gameState) {
        const cutPosition = gameState.getAlgorithmState(this.id, 'cutPosition') || 50;
        const cutX = (cutPosition / 100) * 800;

        // Get comprehensive analysis from calculation engine
        const allPlayerValues = {
            player1: gameState.getPlayerValues('player1'),
            player2: gameState.getPlayerValues('player2')
        };

        const analysis = this.calculationEngine.calculateDivideAndChooseValues(cutX, allPlayerValues);

        // Check if this is a good cut for the divider
        const optimal = this.calculationEngine.findOptimalCutForPlayer(gameState.getPlayerValues('player1'));
        const isGoodCut = Math.abs(analysis.playerValues.player1.left - analysis.playerValues.player1.right) < 2.0;

        return {
            stepName: 'cutting',
            description: `Player 1 cuts the cake at ${this.formatNumber(cutPosition)}%`,
            cutPosition,
            cutX,
            pieceValues: analysis.playerValues.player1,

            // Enhanced feedback from calculation engine
            distributions: analysis.distributions,
            isOptimalCut: isGoodCut,
            optimalPosition: optimal.positionPercentage,
            improvement: !isGoodCut ? `Could improve by moving to ${this.formatNumber(optimal.positionPercentage)}%` : null,

            nextAction: 'Player 2 will now choose their preferred piece',
            uiUpdates: {
                showCutLine: true,
                showPieceValues: true,
                showDistributions: true, // New: show region distributions
                highlightPlayer: 'player1',
                showOptimizationHint: !isGoodCut,
                message: `Cut made! Left: ${this.formatNumber(analysis.playerValues.player1.left)}, Right: ${this.formatNumber(analysis.playerValues.player1.right)}${isGoodCut ? ' (Good cut!)' : ' (Could be improved)'}`
            }
        };
    }

    /**
     * Enhanced validation using calculation engine
     */
    validateInputs(gameState) {
        // Use standard validation first
        const baseValidation = this.standardInputValidation(gameState);
        if (!baseValidation.isValid) {
            return baseValidation;
        }

        const errors = [...baseValidation.errors];
        const warnings = [...baseValidation.warnings];

        // Use calculation engine to check for problematic scenarios
        try {
            const player1Values = gameState.getPlayerValues('player1');
            const player2Values = gameState.getPlayerValues('player2');

            // Check if any cuts would work well
            const optimal1 = this.calculationEngine.findOptimalCutForPlayer(player1Values);
            const optimal2 = this.calculationEngine.findOptimalCutForPlayer(player2Values);

            if (optimal1.difference > 10) {
                warnings.push('Player 1 cannot create well-balanced pieces with these valuations');
            }

            if (optimal2.difference > 10) {
                warnings.push('Player 2 would have difficulty with these valuations if they were the divider');
            }

            // Check for extreme scenarios using calculation engine
            const testCuts = [200, 400, 600]; // Test a few positions
            let hasReasonableOutcomes = false;

            testCuts.forEach(cutX => {
                const result = this.calculationEngine.calculateDivideAndChooseValues(cutX, {
                    player1: player1Values,
                    player2: player2Values
                });

                // Check if both players can get reasonable value
                const minP1 = Math.min(result.playerValues.player1.left, result.playerValues.player1.right);
                const minP2 = Math.min(result.playerValues.player2.left, result.playerValues.player2.right);

                if (minP1 >= 40 && minP2 >= 40) {
                    hasReasonableOutcomes = true;
                }
            });

            if (!hasReasonableOutcomes) {
                warnings.push('These valuations may lead to very unequal outcomes');
            }

        } catch (error) {
            console.warn('Validation error with calculation engine:', error);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Get detailed analysis of current state
     */
    getDetailedAnalysis(gameState) {
        const cutPosition = gameState.getAlgorithmState(this.id, 'cutPosition') || 50;
        const cutX = (cutPosition / 100) * 800;

        const allPlayerValues = {
            player1: gameState.getPlayerValues('player1'),
            player2: gameState.getPlayerValues('player2')
        };

        // Get comprehensive analysis
        const analysis = this.calculationEngine.calculateDivideAndChooseValues(cutX, allPlayerValues);
        const optimal = this.calculationEngine.findOptimalCutForPlayer(gameState.getPlayerValues('player1'));

        return {
            currentAnalysis: analysis,
            optimalForDivider: optimal,
            regionBreakdown: this.getRegionBreakdown(analysis.distributions),
            recommendations: this.generateRecommendations(analysis, optimal)
        };
    }

    /**
     * Get region-by-region breakdown
     */
    getRegionBreakdown(distributions) {
        const breakdown = {};

        Object.keys(this.calculationEngine.getRegionInfo()).forEach(color => {
            breakdown[color] = {
                leftPiece: this.formatNumber(distributions.left[color]),
                rightPiece: this.formatNumber(distributions.right[color]),
                description: this.calculationEngine.getRegionInfo(color).description
            };
        });

        return breakdown;
    }

    /**
     * Generate recommendations based on analysis
     */
    generateRecommendations(analysis, optimal) {
        const recommendations = [];

        const p1Left = analysis.playerValues.player1.left;
        const p1Right = analysis.playerValues.player1.right;
        const difference = Math.abs(p1Left - p1Right);

        if (difference > 5) {
            recommendations.push({
                type: 'improvement',
                message: `Player 1 could improve balance by moving cut to ${this.formatNumber(optimal.positionPercentage)}%`,
                impact: `Would reduce difference from ${this.formatNumber(difference)} to ${this.formatNumber(optimal.difference)}`
            });
        }

        if (difference < 1) {
            recommendations.push({
                type: 'success',
                message: 'Excellent cut! Pieces are very well balanced for Player 1.'
            });
        }

        // Check Player 2's perspective
        const p2Left = analysis.playerValues.player2.left;
        const p2Right = analysis.playerValues.player2.right;
        const p2Preference = p2Left > p2Right ? 'left' : 'right';
        const p2Advantage = Math.abs(p2Left - p2Right);

        recommendations.push({
            type: 'prediction',
            message: `Player 2 will likely choose the ${p2Preference} piece (advantage: ${this.formatNumber(p2Advantage)} points)`
        });

        return recommendations;
    }

    /**
     * Update cut position with real-time feedback
     */
    updateCutPosition(newPosition, gameState) {
        const clampedPosition = this.clamp(newPosition, 5, 95);

        if (clampedPosition !== this.cutPosition) {
            this.cutPosition = clampedPosition;
            gameState.setAlgorithmState(this.id, 'cutPosition', clampedPosition);

            // Get real-time analysis
            const analysis = this.getDetailedAnalysis(gameState);

            // Emit enhanced event with calculation engine data
            this.emit('cut-position:changed', {
                newPosition: clampedPosition,
                analysis: analysis.currentAnalysis,
                optimal: analysis.optimalForDivider,
                recommendations: analysis.recommendations
            });
        }

        return clampedPosition;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IntegratedDivideAndChooseAlgorithm };
}
/**
 * Shared Calculation Engine
 * 
 * This provides all the geometric and mathematical calculations needed by fair division algorithms.
 * It handles region overlap calculations, piece value computations, and fairness analysis.
 */

class SharedCalculationEngine {
    constructor() {
        // Canvas dimensions for calculations
        this.canvas = { width: 800, height: 400 };

        // Region definitions based on the geometric cake layout
        this.regions = {
            blue: {
                x1: 0, y1: 0, x2: 600, y2: 150,
                description: 'Top area spanning most of the width'
            },
            red: {
                x1: 600, y1: 0, x2: 800, y2: 250,
                description: 'Top-right area'
            },
            orange: {
                x1: 600, y1: 250, x2: 800, y2: 350,
                description: 'Right area below red'
            },
            purple: {
                x1: 150, y1: 350, x2: 800, y2: 400,
                description: 'Bottom area spanning most of the width'
            },
            pink: {
                x1: 0, y1: 150, x2: 150, y2: 400,
                description: 'Left area below blue'
            },
            green: {
                x1: 150, y1: 150, x2: 600, y2: 350,
                description: 'Center area'
            }
        };

        // Calculation cache for performance
        this.cache = new Map();
        this.cacheMaxSize = 1000;
        this.cacheHits = 0;
        this.cacheMisses = 0;

        console.log('SharedCalculationEngine: Initialized with', Object.keys(this.regions).length, 'regions');
    }

    // ===== REGION CALCULATIONS =====

    /**
     * Calculate how much of each region falls within a rectangular piece
     * @param {Object} piece - Rectangle definition {x1, y1, x2, y2}
     * @returns {Object} - Percentage of each region within the piece
     */
    calculateRegionDistribution(piece) {
        const cacheKey = `region-dist-${piece.x1}-${piece.y1}-${piece.x2}-${piece.y2}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const distribution = {};

        Object.entries(this.regions).forEach(([colorName, region]) => {
            const percentage = this.calculateRegionOverlap(piece, region);
            distribution[colorName] = percentage;
        });

        this.setCache(cacheKey, distribution);
        return distribution;
    }

    /**
     * Calculate what percentage of a region overlaps with a piece
     * @param {Object} piece - Rectangle {x1, y1, x2, y2}
     * @param {Object} region - Rectangle {x1, y1, x2, y2}
     * @returns {number} - Percentage (0-100) of region within piece
     */
    calculateRegionOverlap(piece, region) {
        // Calculate intersection rectangle
        const intersectionX1 = Math.max(piece.x1, region.x1);
        const intersectionY1 = Math.max(piece.y1, region.y1);
        const intersectionX2 = Math.min(piece.x2, region.x2);
        const intersectionY2 = Math.min(piece.y2, region.y2);

        // Check if there's actually an intersection
        if (intersectionX1 >= intersectionX2 || intersectionY1 >= intersectionY2) {
            return 0; // No overlap
        }

        // Calculate areas
        const intersectionArea = (intersectionX2 - intersectionX1) * (intersectionY2 - intersectionY1);
        const regionArea = (region.x2 - region.x1) * (region.y2 - region.y1);

        // Return percentage
        return (intersectionArea / regionArea) * 100;
    }

    // ===== VERTICAL CUT CALCULATIONS =====

    /**
     * Calculate piece distributions for a single vertical cut
     * @param {number} cutX - X-coordinate of the cut line
     * @returns {Object} - {left: {color: percentage}, right: {color: percentage}}
     */
    calculateVerticalCutDistribution(cutX) {
        const cacheKey = `vertical-cut-${cutX}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        // Define left and right pieces
        const leftPiece = { x1: 0, y1: 0, x2: cutX, y2: this.canvas.height };
        const rightPiece = { x1: cutX, y1: 0, x2: this.canvas.width, y2: this.canvas.height };

        const result = {
            left: this.calculateRegionDistribution(leftPiece),
            right: this.calculateRegionDistribution(rightPiece)
        };

        this.setCache(cacheKey, result);
        return result;
    }

    /**
     * Calculate piece distributions for two vertical cuts (3 pieces)
     * @param {number} cut1X - X-coordinate of first cut
     * @param {number} cut2X - X-coordinate of second cut
     * @returns {Object} - {piece1: {}, piece2: {}, piece3: {}}
     */
    calculateDualVerticalCutDistribution(cut1X, cut2X) {
        // Ensure cuts are in order
        const leftCut = Math.min(cut1X, cut2X);
        const rightCut = Math.max(cut1X, cut2X);

        const cacheKey = `dual-cut-${leftCut}-${rightCut}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        // Define three pieces
        const piece1 = { x1: 0, y1: 0, x2: leftCut, y2: this.canvas.height };
        const piece2 = { x1: leftCut, y1: 0, x2: rightCut, y2: this.canvas.height };
        const piece3 = { x1: rightCut, y1: 0, x2: this.canvas.width, y2: this.canvas.height };

        const result = {
            piece1: this.calculateRegionDistribution(piece1),
            piece2: this.calculateRegionDistribution(piece2),
            piece3: this.calculateRegionDistribution(piece3)
        };

        this.setCache(cacheKey, result);
        return result;
    }

    // ===== PLAYER VALUE CALCULATIONS =====

    /**
     * Calculate how much a player values a piece given region distribution
     * @param {Object} regionDistribution - {color: percentage} from calculateRegionDistribution
     * @param {Object} playerValues - {color: points} player's valuations
     * @returns {number} - Total value for this player
     */
    calculatePlayerValue(regionDistribution, playerValues) {
        let totalValue = 0;

        Object.entries(regionDistribution).forEach(([color, percentage]) => {
            const colorValue = playerValues[color] || 0;
            totalValue += (percentage / 100) * colorValue;
        });

        return totalValue;
    }

    /**
     * Calculate values for all players for a set of pieces
     * @param {Object} pieceDistributions - {pieceId: regionDistribution}
     * @param {Object} allPlayerValues - {playerId: {color: points}}
     * @returns {Object} - {playerId: {pieceId: value}}
     */
    calculateAllPlayerValues(pieceDistributions, allPlayerValues) {
        const result = {};

        Object.keys(allPlayerValues).forEach(playerId => {
            result[playerId] = {};

            Object.entries(pieceDistributions).forEach(([pieceId, distribution]) => {
                result[playerId][pieceId] = this.calculatePlayerValue(
                    distribution,
                    allPlayerValues[playerId]
                );
            });
        });

        return result;
    }

    // ===== ALGORITHM-SPECIFIC HELPERS =====

    /**
     * Calculate values for Divide-and-Choose algorithm
     * @param {number} cutX - Cut position
     * @param {Object} allPlayerValues - Player valuations
     * @returns {Object} - Complete analysis for divide-and-choose
     */
    calculateDivideAndChooseValues(cutX, allPlayerValues) {
        const distributions = this.calculateVerticalCutDistribution(cutX);
        const playerValues = this.calculateAllPlayerValues(distributions, allPlayerValues);

        return {
            cutPosition: cutX,
            cutPercentage: (cutX / this.canvas.width) * 100,
            distributions,
            playerValues,
            metadata: {
                leftPieceSize: cutX / this.canvas.width,
                rightPieceSize: (this.canvas.width - cutX) / this.canvas.width
            }
        };
    }

    /**
     * Calculate values for Steinhaus Lone-Divider algorithm  
     * @param {number} cut1X - First cut position
     * @param {number} cut2X - Second cut position
     * @param {Object} allPlayerValues - Player valuations
     * @returns {Object} - Complete analysis for lone-divider
     */
    calculateSteinhausValues(cut1X, cut2X, allPlayerValues) {
        const distributions = this.calculateDualVerticalCutDistribution(cut1X, cut2X);
        const playerValues = this.calculateAllPlayerValues(distributions, allPlayerValues);

        const leftCut = Math.min(cut1X, cut2X);
        const rightCut = Math.max(cut1X, cut2X);

        return {
            cutPositions: [leftCut, rightCut],
            cutPercentages: [
                (leftCut / this.canvas.width) * 100,
                (rightCut / this.canvas.width) * 100
            ],
            distributions,
            playerValues,
            metadata: {
                pieceSizes: [
                    leftCut / this.canvas.width,
                    (rightCut - leftCut) / this.canvas.width,
                    (this.canvas.width - rightCut) / this.canvas.width
                ]
            }
        };
    }

    // ===== OPTIMIZATION HELPERS =====

    /**
     * Find optimal cut position for a player to create equal-valued pieces
     * @param {Object} playerValues - Player's valuations
     * @param {number} precision - Search precision (default 0.5)
     * @returns {Object} - {position, leftValue, rightValue, difference}
     */
    findOptimalCutForPlayer(playerValues, precision = 0.5) {
        let bestPosition = this.canvas.width / 2;
        let smallestDifference = Infinity;
        let bestResult = null;

        for (let cutX = 10; cutX < this.canvas.width - 10; cutX += precision) {
            const result = this.calculateDivideAndChooseValues(cutX, { player: playerValues });
            const leftValue = result.playerValues.player.left;
            const rightValue = result.playerValues.player.right;
            const difference = Math.abs(leftValue - rightValue);

            if (difference < smallestDifference) {
                smallestDifference = difference;
                bestPosition = cutX;
                bestResult = {
                    position: cutX,
                    positionPercentage: (cutX / this.canvas.width) * 100,
                    leftValue,
                    rightValue,
                    difference,
                    isOptimal: difference < 0.1
                };
            }
        }

        return bestResult;
    }

    // ===== FAIRNESS ANALYSIS =====

    /**
     * Analyze fairness properties of an allocation
     * @param {Object} allocation - {playerId: pieceId}
     * @param {Object} playerValues - {playerId: {pieceId: value}}
     * @param {number} playerCount - Number of players
     * @returns {Object} - Fairness analysis
     */
    analyzeFairness(allocation, playerValues, playerCount) {
        const analysis = {
            proportional: this.checkProportionality(playerValues, playerCount),
            envyFree: this.checkEnvyFreeness(allocation, playerValues),
            equitable: this.checkEquitability(playerValues),
            efficient: this.calculateEfficiency(playerValues)
        };

        analysis.summary = {
            satisfiedProperties: Object.values(analysis).filter(prop =>
                typeof prop === 'boolean' ? prop : prop.satisfied
            ).length,
            totalProperties: 4,
            overallScore: this.calculateOverallFairnessScore(analysis)
        };

        return analysis;
    }

    /**
     * Check if allocation is proportional
     */
    checkProportionality(playerValues, playerCount) {
        const threshold = (100 / playerCount) - 0.1; // Small tolerance
        const results = {};

        Object.entries(playerValues).forEach(([playerId, values]) => {
            const playerTotal = Object.values(values).reduce((sum, val) => sum + val, 0);
            results[playerId] = {
                value: playerTotal,
                threshold,
                satisfied: playerTotal >= threshold
            };
        });

        return {
            satisfied: Object.values(results).every(r => r.satisfied),
            details: results,
            type: 'proportional'
        };
    }

    /**
     * Check if allocation is envy-free
     */
    checkEnvyFreeness(allocation, playerValues) {
        const envyMatrix = {};
        const players = Object.keys(allocation);

        players.forEach(player => {
            envyMatrix[player] = {};
            const ownPiece = allocation[player];
            const ownValue = playerValues[player][ownPiece];

            players.forEach(otherPlayer => {
                if (player === otherPlayer) {
                    envyMatrix[player][otherPlayer] = { envies: false, difference: 0 };
                } else {
                    const otherPiece = allocation[otherPlayer];
                    const otherValue = playerValues[player][otherPiece];
                    const envies = otherValue > ownValue + 0.1; // Small tolerance

                    envyMatrix[player][otherPlayer] = {
                        envies,
                        difference: otherValue - ownValue
                    };
                }
            });
        });

        const hasEnvy = Object.values(envyMatrix).some(playerEnvies =>
            Object.values(playerEnvies).some(relation => relation.envies)
        );

        return {
            satisfied: !hasEnvy,
            envyMatrix,
            type: 'envy-free'
        };
    }

    /**
     * Check if allocation is equitable (equal values)
     */
    checkEquitability(playerValues) {
        const playerTotals = Object.entries(playerValues).map(([playerId, values]) => ({
            playerId,
            total: Object.values(values).reduce((sum, val) => sum + val, 0)
        }));

        if (playerTotals.length < 2) {
            return { satisfied: true, type: 'equitable', reason: 'Single player' };
        }

        const firstTotal = playerTotals[0].total;
        const maxDifference = Math.max(...playerTotals.map(p => Math.abs(p.total - firstTotal)));

        return {
            satisfied: maxDifference < 1.0,
            maxDifference,
            playerTotals,
            type: 'equitable'
        };
    }

    /**
     * Calculate efficiency (total utility as percentage of maximum possible)
     */
    calculateEfficiency(playerValues) {
        const totalUtility = Object.values(playerValues).reduce((sum, playerVals) =>
            sum + Object.values(playerVals).reduce((pSum, val) => pSum + val, 0), 0
        );

        const playerCount = Object.keys(playerValues).length;
        const maxPossibleUtility = playerCount * 100;
        const efficiency = (totalUtility / maxPossibleUtility) * 100;

        return {
            satisfied: efficiency >= 90, // Arbitrary threshold for "efficient"
            efficiency,
            totalUtility,
            maxPossibleUtility,
            type: 'efficient'
        };
    }

    /**
     * Calculate overall fairness score
     */
    calculateOverallFairnessScore(analysis) {
        let score = 0;
        let maxScore = 0;

        Object.entries(analysis).forEach(([key, value]) => {
            if (typeof value === 'object' && value.type) {
                maxScore += 100;
                if (value.satisfied) {
                    score += 100;
                } else if (key === 'efficient') {
                    score += value.efficiency || 0;
                }
            }
        });

        return maxScore > 0 ? (score / maxScore) * 100 : 0;
    }

    // ===== CACHE MANAGEMENT =====

    /**
     * Get value from cache
     */
    getFromCache(key) {
        if (this.cache.has(key)) {
            this.cacheHits++;
            return this.cache.get(key);
        }
        this.cacheMisses++;
        return null;
    }

    /**
     * Store value in cache
     */
    setCache(key, value) {
        if (this.cache.size >= this.cacheMaxSize) {
            // Remove oldest entries (simple LRU)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    /**
     * Clear all cached calculations
     */
    clearCache() {
        this.cache.clear();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        const total = this.cacheHits + this.cacheMisses;
        return {
            size: this.cache.size,
            maxSize: this.cacheMaxSize,
            hits: this.cacheHits,
            misses: this.cacheMisses,
            hitRate: total > 0 ? (this.cacheHits / total) * 100 : 0
        };
    }

    // ===== UTILITY METHODS =====

    /**
     * Get region information
     */
    getRegionInfo(colorName = null) {
        if (colorName) {
            return this.regions[colorName] ? { ...this.regions[colorName] } : null;
        }
        return JSON.parse(JSON.stringify(this.regions));
    }

    /**
     * Get canvas dimensions
     */
    getCanvasDimensions() {
        return { ...this.canvas };
    }

    /**
     * Validate a piece definition
     */
    validatePiece(piece) {
        const required = ['x1', 'y1', 'x2', 'y2'];
        const missing = required.filter(prop => typeof piece[prop] !== 'number');

        if (missing.length > 0) {
            return { valid: false, errors: [`Missing properties: ${missing.join(', ')}`] };
        }

        const errors = [];
        if (piece.x1 >= piece.x2) errors.push('x1 must be less than x2');
        if (piece.y1 >= piece.y2) errors.push('y1 must be less than y2');
        if (piece.x1 < 0 || piece.x2 > this.canvas.width) errors.push('X coordinates out of canvas bounds');
        if (piece.y1 < 0 || piece.y2 > this.canvas.height) errors.push('Y coordinates out of canvas bounds');

        return { valid: errors.length === 0, errors };
    }

    /**
     * Get debug information
     */
    getDebugInfo() {
        return {
            regions: Object.keys(this.regions).length,
            canvas: this.canvas,
            cache: this.getCacheStats(),
            calculations: {
                regionOverlapSupported: true,
                verticalCutsSupported: true,
                optimizationSupported: true,
                fairnessAnalysisSupported: true
            }
        };
    }
}


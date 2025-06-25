/**
 * Fair Division Demo System - Core 
 * 
 * Main system that manages algorithms, state, and provides the API
 */

class FairDivisionCore {
    constructor() {
        this.algorithms = new Map();
        this.currentAlgorithm = null;
        this.currentStep = 0;
        this.state = this.createInitialState();
        this.eventCleanup = [];

        this.initializeUI();
    }

    createInitialState() {
        return {
            cutPosition: 0,
            cutPosition2: 0, 
            playerValues: {
                player1: { blue: 20, red: 15, green: 25, orange: 10, pink: 15, purple: 15 },
                player2: { blue: 15, red: 25, green: 20, orange: 20, pink: 10, purple: 10 },
                player3: { blue: 30, red: 10, green: 15, orange: 5, pink: 25, purple: 15 },
            },
            algorithmData: {}
        };
    }

    initializeUI() {
        // Set up core event listeners
        this.setupCoreEvents();

        // Initialize UI state
        this.updateAlgorithmSelector();
        this.updateCutLine();
        this.updatePlayerValueDisplays();
    }

    setupCoreEvents() {
        // Algorithm selector
        const selector = document.getElementById('algorithm-selector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.switchAlgorithm(e.target.value);
            });
        }

        // Start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.currentAlgorithm) {
                    this.currentAlgorithm.config.onStart(this.state, this.createAPI());
                }
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAlgorithm();
            });
        }

        // Cut slider
        const cutSlider = document.getElementById('cut-slider');
        if (cutSlider) {
            cutSlider.addEventListener('input', (e) => {
                this.state.cutPosition = parseFloat(e.target.value);
                this.updateCutLine();
                this.updatePlayerValueDisplays();
                if (this.currentAlgorithm) {
                    this.currentAlgorithm.config.onPlayerValueChange?.(this.state, this.createAPI());
                }
            });
        }

        // Player value inputs
        this.setupPlayerValueEvents();
    }

    // Monitor changes in color valuations
    setupPlayerValueEvents() {
        const colors = ['blue', 'red', 'green', 'orange', 'pink', 'purple'];
        ['p1', 'p2', 'p3'].forEach(player => {
            colors.forEach(color => {
                const input = document.getElementById(`${player}-${color}`);
                if (input) {
                    input.addEventListener('input', (e) => {
                        const playerKey = player === 'p1' ? 'player1' : player === 'p2' ? 'player2' : 'player3';
                        this.state.playerValues[playerKey][color] = parseInt(e.target.value) || 0;

                        // Check if values sum to 100
                        const total = colors.reduce((sum, clr) => sum + (this.state.playerValues[playerKey][clr] || 0), 0);
                        if (total !== 100) {
                            console.error(`Error: ${playerKey} values must sum to 100. Current total: ${total}`);
                            const errorElement = document.getElementById(`${player}-error`);
                            if (errorElement) {
                                errorElement.textContent = `Total must be 100 (currently ${total})`;
                                errorElement.style.display = 'block';
                            }
                        } else {
                            const errorElement = document.getElementById(`${player}-error`);
                            if (errorElement) {
                                errorElement.style.display = 'none';
                            }
                        }

                        this.updatePlayerValueDisplays();
                        if (this.currentAlgorithm) {
                            this.currentAlgorithm.config.onPlayerValueChange?.(this.state, this.createAPI());
                        }
                    });
                }
            });
        });
    }

    // Registers algorithm at runtime
    register(id, config) {
        this.algorithms.set(id, { id, config });
        this.updateAlgorithmSelector();
        console.log(`Algorithm registered: ${config.name}`);
    }


    switchAlgorithm(id) {
        if (!id) return;

        const algorithm = this.algorithms.get(id);
        if (!algorithm) return;

        // Cleanup current algorithm
        this.cleanupCurrentAlgorithm();

        // Switch to new algorithm
        this.currentAlgorithm = algorithm;
        this.currentStep = 0;
        this.state = this.createInitialState();

        // Show/hide UI elements based on player count
        const api = this.createAPI();
        if (algorithm.config.playerCount === 3) {
            api.showPlayer3Section();
        } else {
            api.hidePlayer3Section();
        }

        // Initialize new algorithm
        this.initializeAlgorithm();
    }

    cleanupCurrentAlgorithm() {
        if (!this.currentAlgorithm) return;

        // Clean up event listeners
        this.eventCleanup.forEach(cleanup => cleanup());
        this.eventCleanup = [];

        // Call algorithm cleanup if exists
        if (this.currentAlgorithm.config.onReset) {
            this.currentAlgorithm.config.onReset(this.state, this.createAPI());
        }
    }

    initializeAlgorithm() {
        if (!this.currentAlgorithm) return;

        const config = this.currentAlgorithm.config;

        // Update UI for algorithm
        document.getElementById('algorithm-name').textContent = config.name;
        document.getElementById('algorithm-description').textContent = config.description;

        // Reset start button text and state
        this.resetStartButton();

        // Enter first step
        if (config.steps && config.steps.length > 0) {
            this.enterStep(0);
        }
    }

    resetStartButton() {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.textContent = 'Start';
            startBtn.disabled = false;
            startBtn.style.display = '';
            startBtn.classList.remove('loading');
        }
    }

    enterStep(stepIndex) {
        if (!this.currentAlgorithm || !this.currentAlgorithm.config.steps) return;

        const step = this.currentAlgorithm.config.steps[stepIndex];
        if (!step) return;

        this.currentStep = stepIndex;

        // Update UI for step
        const api = this.createAPI();
        api.updateUI({
            stepTitle: step.title,
            instructions: step.instructions,
            enabledControls: step.enabledControls || []
        });

        // Call step enter handler
        if (step.onStepEnter) {
            step.onStepEnter(this.state, api);
        }
    }

    exitStep(stepIndex) {
        if (!this.currentAlgorithm || !this.currentAlgorithm.config.steps) return;

        const step = this.currentAlgorithm.config.steps[stepIndex];
        if (!step) return;

        this.currentStep = stepIndex;

        const api = this.createAPI();

        if (step.onStepExit) {
            step.onStepExit(this.state, api);
        }
    }

    resetSlider() {
        const cutSlider = document.getElementById('cut-slider');
        cutSlider.value = 0;
    }

    resetAlgorithm() {
        if (!this.currentAlgorithm) return;

        this.state = this.createInitialState();
        this.currentStep = 0;
        this.updateCutLine();
        this.updateSecondCutLine();
        this.updatePlayerValueDisplays();
        this.resetSlider();

        // Hide results
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
            resultsEl.style.display = 'none';
        }

        // Reset algorithm-specific UI elements
        const api = this.createAPI();
        api.hideSteinhausThreePieces();
        api.hideDualCutSliders();

        // Re-initialize algorithm
        this.initializeAlgorithm();
    }

    createAPI() {
        const self = this; // capture the correct this context
        return {
            /**
             * GENERAL PURPOSE API METHODS
             */

            // Step control
            requestStepProgression: () => {
                if (this.currentAlgorithm && this.currentAlgorithm.config.steps) {
                    const thisStep = this.currentStep;
                    this.exitStep(thisStep);
                    const nextStep = thisStep + 1;
                    if (nextStep < this.currentAlgorithm.config.steps.length) {
                        this.enterStep(nextStep);
                    }
                }
            },

            // current step getter
            getCurrentStep: () => this.currentStep,

            // sets state of the start button
            setStartButtonState: (state) => {
                const startBtn = document.getElementById('start-btn');
                if (startBtn) {
                    switch (state) {
                        case 'disabled':
                            startBtn.disabled = true;
                            startBtn.classList.remove('loading');
                            break;
                        case 'enabled':
                            startBtn.disabled = false;
                            startBtn.classList.remove('loading');
                            break;
                        case 'hidden':
                            startBtn.style.display = 'none';
                            break;
                        case 'visible':
                            startBtn.style.display = '';
                            break;
                    }
                }
            },

            // UI control
            updateUI: ({ stepTitle, instructions, enabledControls = [] }) => {
                if (stepTitle) {
                    const el = document.getElementById('step-indicator');
                    if (el) el.textContent = stepTitle;
                }

                if (instructions) {
                    const el = document.getElementById('instructions');
                    if (el) el.innerHTML = instructions;
                }

                this.updateControlStates(enabledControls);
            },

            showResults: (config) => {
                const resultsEl = document.getElementById('results');
                const contentEl = document.getElementById('result-content');

                if (contentEl && config.text) {
                    contentEl.innerHTML = config.text;
                }

                if (resultsEl) {
                    resultsEl.style.display = 'block';
                }
            },

            // Event handling
            addEventListener: (eventType, handler) => {
                if (eventType === 'pieceClick') {
                    const leftPiece = document.getElementById('left-piece');
                    const rightPiece = document.getElementById('right-piece');

                    const leftHandler = () => handler('left');
                    const rightHandler = () => handler('right');

                    if (leftPiece) leftPiece.addEventListener('click', leftHandler);
                    if (rightPiece) rightPiece.addEventListener('click', rightHandler);

                    this.eventCleanup.push(() => {
                        if (leftPiece) leftPiece.removeEventListener('click', leftHandler);
                        if (rightPiece) rightPiece.removeEventListener('click', rightHandler);
                    });
                }
            },

            // Utilities
            calculateRegionValues: (cutPosition) => {
                return this.calculateRegionValues(cutPosition);
            },

            calculatePlayerValue: (regionValues, playerValues) => {
                return this.calculatePlayerValue(regionValues, playerValues);
            },

            // Austin's algorithm specific API extensions
            addStopButtons: () => {
                const controlsEl = document.querySelector('.action-buttons');
                if (controlsEl && !document.getElementById('player1-stop')) {
                    // Hide normal start button during moving knife phase
                    const startBtn = document.getElementById('start-btn');
                    if (startBtn) startBtn.style.display = 'none';

                    const p1StopBtn = document.createElement('button');
                    p1StopBtn.id = 'player1-stop';
                    p1StopBtn.className = 'btn btn-primary';
                    p1StopBtn.textContent = 'Player 1: STOP!';
                    p1StopBtn.style.marginRight = '10px';
                    p1StopBtn.onclick = () => {
                        if (self.currentAlgorithm && self.currentAlgorithm.config.onPlayerStop) {
                            self.currentAlgorithm.config.onPlayerStop(1, self.state, self.createAPI());
                        }
                    };

                    const p2StopBtn = document.createElement('button');
                    p2StopBtn.id = 'player2-stop';
                    p2StopBtn.className = 'btn btn-primary';
                    p2StopBtn.textContent = 'Player 2: STOP!';
                    p2StopBtn.onclick = () => {
                        if (self.currentAlgorithm && self.currentAlgorithm.config.onPlayerStop) {
                            self.currentAlgorithm.config.onPlayerStop(2, self.state, self.createAPI());
                        }
                    };

                    controlsEl.appendChild(p1StopBtn);
                    controlsEl.appendChild(p2StopBtn);
                }
            },

            removeStopButtons: () => {
                const p1Stop = document.getElementById('player1-stop');
                const p2Stop = document.getElementById('player2-stop');
                if (p1Stop) p1Stop.remove();
                if (p2Stop) p2Stop.remove();

                // Show start button again
                const startBtn = document.getElementById('start-btn');
                if (startBtn) startBtn.style.display = '';
            },

            updateSingleKnife: (cutX) => {
                const cutLine = document.getElementById('cut-line');
                if (cutLine) {
                    cutLine.setAttribute('x1', cutX.toString());
                    cutLine.setAttribute('x2', cutX.toString());
                }
            },

            showDualKnives: () => {
                // Show the left knife
                let leftKnife = document.getElementById('left-knife');
                if (leftKnife) {
                    leftKnife.style.display = 'block';
                }

                // Keep the existing right knife (red) - that's our cut-line
                const rightKnife = document.getElementById('cut-line');
                if (rightKnife) {
                    rightKnife.style.display = 'block';
                }
            },

            hideDualKnives: () => {
                const leftKnife = document.getElementById('left-knife');
                if (leftKnife) leftKnife.style.display = 'none';
            },

            updateKnifePositions: (leftX, rightX) => {
                const leftKnife = document.getElementById('left-knife');
                const rightKnife = document.getElementById('cut-line');

                if (leftKnife) {
                    leftKnife.setAttribute('x1', leftX.toString());
                    leftKnife.setAttribute('x2', leftX.toString());
                }

                if (rightKnife) {
                    rightKnife.setAttribute('x1', rightX.toString());
                    rightKnife.setAttribute('x2', rightX.toString());
                }
            },

            showTwoPieceOverlays: (cutPosition) => {
                const svg = document.querySelector('.game-svg');

                // convert cutPosition to pixel value
                const finalPos = (cutPosition / 100) * 800;

                // Left piece (0 to cutPosition)
                let leftPiece = document.getElementById('left-piece');
                leftPiece.setAttribute('x', '0');
                leftPiece.setAttribute('y', '0');
                leftPiece.setAttribute('width', finalPos.toString());
                leftPiece.setAttribute('height', '400');
                leftPiece.setAttribute('fill', 'rgba(49,130,206,0.2)');
                leftPiece.setAttribute('stroke', '#3182ce');
                leftPiece.setAttribute('stroke-width', '3');
                leftPiece.style.display = 'block';

                // Right piece (cutPosition to 800)
                let rightPiece = document.getElementById('right-piece');
                rightPiece.setAttribute('x', finalPos.toString());
                rightPiece.setAttribute('y', '0');
                rightPiece.setAttribute('width', (800 - finalPos).toString());
                rightPiece.setAttribute('height', '400');
                rightPiece.setAttribute('fill', 'rgba(72,187,120,0.2)');
                rightPiece.setAttribute('stroke', '#38a169');
                rightPiece.setAttribute('stroke-width', '3');
                rightPiece.style.display = 'block';
            },

            showThreePieceOverlays: (leftPos, rightPos) => {
                const svg = document.querySelector('.game-svg');

                // Left piece (0 to leftPos)
                let leftPiece = document.getElementById('austin-left-piece');
                if (!leftPiece) {
                    leftPiece = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    leftPiece.id = 'austin-left-piece';
                    svg.appendChild(leftPiece);
                }
                leftPiece.setAttribute('x', '0');
                leftPiece.setAttribute('y', '0');
                leftPiece.setAttribute('width', leftPos.toString());
                leftPiece.setAttribute('height', '400');
                leftPiece.setAttribute('fill', 'rgba(49,130,206,0.2)');
                leftPiece.setAttribute('stroke', '#3182ce');
                leftPiece.setAttribute('stroke-width', '3');
                leftPiece.style.display = 'block';

                // Middle piece (leftPos to rightPos)
                let middlePiece = document.getElementById('austin-middle-piece');
                if (!middlePiece) {
                    middlePiece = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    middlePiece.id = 'austin-middle-piece';
                    svg.appendChild(middlePiece);
                }
                middlePiece.setAttribute('x', leftPos.toString());
                middlePiece.setAttribute('y', '0');
                middlePiece.setAttribute('width', (rightPos - leftPos).toString());
                middlePiece.setAttribute('height', '400');
                middlePiece.setAttribute('fill', 'rgba(255,193,7,0.2)');
                middlePiece.setAttribute('stroke', '#ffc107');
                middlePiece.setAttribute('stroke-width', '3');
                middlePiece.style.display = 'block';

                // Right piece (rightPos to 800)
                let rightPiece = document.getElementById('austin-right-piece');
                if (!rightPiece) {
                    rightPiece = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rightPiece.id = 'austin-right-piece';
                    svg.appendChild(rightPiece);
                }
                rightPiece.setAttribute('x', rightPos.toString());
                rightPiece.setAttribute('y', '0');
                rightPiece.setAttribute('width', (800 - rightPos).toString());
                rightPiece.setAttribute('height', '400');
                rightPiece.setAttribute('fill', 'rgba(72,187,120,0.2)');
                rightPiece.setAttribute('stroke', '#38a169');
                rightPiece.setAttribute('stroke-width', '3');
                rightPiece.style.display = 'block';
            },

            hideThreePieceOverlays: () => {
                const pieces = ['austin-left-piece', 'austin-middle-piece', 'austin-right-piece'];
                pieces.forEach(id => {
                    const piece = document.getElementById(id);
                    if (piece) piece.style.display = 'none';
                });
            },

            addOtherPlayerStopButton: (controllingPlayer) => {
                const controlsEl = document.querySelector('.action-buttons');
                const otherPlayer = controllingPlayer === 1 ? 2 : 1;

                if (controlsEl && !document.getElementById('other-player-stop')) {

                    const p1Stop = document.getElementById('player1-stop');
                    const p2Stop = document.getElementById('player2-stop');
                    if (p1Stop) p1Stop.remove();
                    if (p2Stop) p2Stop.remove();

                    const stopBtn = document.createElement('button');
                    stopBtn.id = 'other-player-stop';
                    stopBtn.className = 'btn btn-primary';
                    stopBtn.textContent = `Player ${otherPlayer}: STOP!`;
                    stopBtn.onclick = () => {
                        if (self.currentAlgorithm && self.currentAlgorithm.config.onOtherPlayerStop) {
                            self.currentAlgorithm.config.onOtherPlayerStop(self.state, self.createAPI());
                        }
                    };

                    controlsEl.appendChild(stopBtn);
                }
            },

            removeOtherPlayerStopButton: () => {
                const stopBtn = document.getElementById('other-player-stop');
                if (stopBtn) stopBtn.remove();
            },

            showMakeCutButton: () => {
                const makeCutBtn = document.getElementById('make-cut-btn');
                if (makeCutBtn) {
                    makeCutBtn.style.display = 'block';
                    // Add event listener for make cut
                    const handler = () => {
                        if (this.currentAlgorithm && this.currentAlgorithm.config.onMakeCut) {
                            this.currentAlgorithm.config.onMakeCut(this.state, this.createAPI());
                        }
                    };
                    makeCutBtn.addEventListener('click', handler);

                    // Store cleanup function
                    this.eventCleanup.push(() => {
                        makeCutBtn.removeEventListener('click', handler);
                    });
                }
            },

            hideMakeCutButton: () => {
                const makeCutBtn = document.getElementById('make-cut-btn');
                if (makeCutBtn) {
                    makeCutBtn.style.display = 'none';
                }
            },

            // Steinhaus-specific API extensions
            showPlayer3Section: () => {
                const player3Section = document.getElementById('player3-section');
                if (player3Section) player3Section.style.display = 'block';
            },

            hidePlayer3Section: () => {
                const player3Section = document.getElementById('player3-section');
                if (player3Section) player3Section.style.display = 'none';
            },

            showDualCutSliders: () => {
                const slider2 = document.getElementById('cut-control-2');
                const cutLine2 = document.getElementById('cut-line-2');
                if (slider2) slider2.style.display = 'block';
                if (cutLine2) cutLine2.style.display = 'block';

                // Set up event listeners for second slider
                const cutSlider2 = document.getElementById('cut-slider-2');
                if (cutSlider2) {
                    const handler = (e) => {
                        self.state.cutPosition2 = parseFloat(e.target.value);
                        self.updateSecondCutLine();
                        if (self.currentAlgorithm && self.currentAlgorithm.config.onCutChange) {
                            self.currentAlgorithm.config.onCutChange(self.state, self.createAPI());
                        }
                    };
                    cutSlider2.addEventListener('input', handler);
                    self.eventCleanup.push(() => {
                        cutSlider2.removeEventListener('input', handler);
                    });
                }
            },

            hideDualCutSliders: () => {
                const slider2 = document.getElementById('cut-control-2');
                const cutLine2 = document.getElementById('cut-line-2');
                if (slider2) slider2.style.display = 'none';
                if (cutLine2) cutLine2.style.display = 'none';
            },

            showSteinhausThreePieces: () => {
                const cut1 = (self.state.cutPosition / 100) * 800;
                const cut2 = (self.state.cutPosition2 / 100) * 800;
                const cuts = [0, Math.min(cut1, cut2), Math.max(cut1, cut2), 800];

                ['steinhaus-piece-1', 'steinhaus-piece-2', 'steinhaus-piece-3'].forEach((id, index) => {
                    const piece = document.getElementById(id);
                    if (piece) {
                        piece.setAttribute('x', cuts[index].toString());
                        piece.setAttribute('width', (cuts[index + 1] - cuts[index]).toString());
                        piece.style.display = 'block';
                    }
                });
            },

            hideSteinhausThreePieces: () => {
                ['steinhaus-piece-1', 'steinhaus-piece-2', 'steinhaus-piece-3'].forEach(id => {
                    const piece = document.getElementById(id);
                    if (piece) piece.style.display = 'none';
                });
            },

            enableThreePieceSelection: (handler) => {
                ['steinhaus-piece-1', 'steinhaus-piece-2', 'steinhaus-piece-3'].forEach((id, index) => {
                    const piece = document.getElementById(id);
                    if (piece) {
                        const clickHandler = () => handler(index);
                        piece.addEventListener('click', clickHandler);
                        piece.style.cursor = 'pointer';
                        piece.style.stroke = '#3182ce';
                        piece.style.strokeWidth = '3';

                        self.eventCleanup.push(() => {
                            piece.removeEventListener('click', clickHandler);
                        });
                    }
                });
            },

            enableRemainingPieceSelection: (handler) => {
                const selectedPiece = self.state.algorithmData.finalAllocation?.player3;

                ['steinhaus-piece-1', 'steinhaus-piece-2', 'steinhaus-piece-3'].forEach((id, index) => {
                    const piece = document.getElementById(id);
                    if (piece) {
                        if (index === selectedPiece) {
                            // Disable selected piece
                            piece.style.opacity = '0.5';
                            piece.style.cursor = 'not-allowed';
                        } else {
                            // Enable remaining pieces
                            const clickHandler = () => handler(index);
                            piece.addEventListener('click', clickHandler);
                            piece.style.cursor = 'pointer';
                            piece.style.stroke = '#38a169';
                            piece.style.strokeWidth = '3';

                            self.eventCleanup.push(() => {
                                piece.removeEventListener('click', clickHandler);
                            });
                        }
                    }
                });
            },
        };
    }

    updateControlStates(enabledControls) {
        const controlMap = {
            'cutSlider': 'cut-slider',
            'cutSlider2': 'cut-slider-2',  // Add this mapping
            'startButton': 'start-btn',
            'makeCutButton': 'make-cut-btn',
            'resetButton': 'reset-btn',
            'pieceSelection': ['left-piece', 'right-piece']
        };

        // Get all control elements that could be disabled
        const allControlElements = [
            'cut-slider', 'cut-slider-2', 'start-btn', 'make-cut-btn', 'reset-btn',
            'left-piece', 'right-piece'
        ];

        // Disable all controls first
        allControlElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.disabled = true;
                el.style.cursor = 'not-allowed';
                el.style.opacity = '0.5';
            }
        });

        // Enable specified controls
        enabledControls.forEach(control => {
            const ids = Array.isArray(controlMap[control]) ? controlMap[control] : [controlMap[control]];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.disabled = false;
                    el.style.cursor = '';
                    el.style.opacity = '';
                }
            });
        });

        // Special handling for piece selection
        if (enabledControls.includes('pieceSelection')) {
            ['left-piece', 'right-piece'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.cursor = 'pointer';
                    el.style.stroke = '#3182ce';
                    el.style.strokeWidth = '3';
                    el.style.fill = 'rgba(49, 130, 206, 0.1)';
                }
            });
        } else {
            ['left-piece', 'right-piece'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.cursor = 'default';
                    el.style.stroke = 'rgba(0,0,0,0)';
                    el.style.fill = 'rgba(0,0,0,0)';
                }
            });
        }
    }

    updateAlgorithmSelector() {
        const selector = document.getElementById('algorithm-selector');
        if (!selector) return;

        selector.innerHTML = '<option value="">Choose Algorithm...</option>';

        for (const [id, algorithm] of this.algorithms) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = algorithm.config.name;
            selector.appendChild(option);
        }
    }

    updateCutLine() {
        const cutLine = document.getElementById('cut-line');
        if (cutLine) {
            const cutX = (this.state.cutPosition / 100) * 800;
            cutLine.setAttribute('x1', cutX.toString());
            cutLine.setAttribute('x2', cutX.toString());
        }

        const cutValue = document.getElementById('cut-value');
        if (cutValue) {
            cutValue.textContent = `${this.state.cutPosition.toFixed(1)}%`;
        }
    }

    updateSecondCutLine() {
        const cutLine2 = document.getElementById('cut-line-2');
        if (cutLine2) {
            const cutX = (this.state.cutPosition2 / 100) * 800;
            cutLine2.setAttribute('x1', cutX.toString());
            cutLine2.setAttribute('x2', cutX.toString());
        }

        const cutValue2 = document.getElementById('cut-value-2');
        if (cutValue2) {
            cutValue2.textContent = `${this.state.cutPosition2.toFixed(1)}%`;
        }
    }

    updatePlayerValueDisplays() {
        if (!this.currentAlgorithm) return;

        if (this.currentAlgorithm.config.playerCount === 2) {
            // Two-player algorithm (Divide-and-Choose, Austin's)
            const regionValues = this.calculateRegionValues(this.state.cutPosition);

            ['player1', 'player2'].forEach((player, index) => {
                const playerNum = index + 1;
                const leftValue = this.calculatePlayerValue(regionValues.left, this.state.playerValues[player]);
                const rightValue = this.calculatePlayerValue(regionValues.right, this.state.playerValues[player]);

                const display = document.getElementById(`player${playerNum}-values`);
                if (display) {
                    display.textContent = `Left: ${leftValue.toFixed(1)} | Right: ${rightValue.toFixed(1)}`;
                }
            });
        } else if (this.currentAlgorithm.config.playerCount === 3) {
            // Three-player algorithm (Steinhaus)
            if (this.currentAlgorithm.config.calculateValues) {
                const values = this.currentAlgorithm.config.calculateValues(this.state);

                ['player1', 'player2', 'player3'].forEach((player, index) => {
                    const playerNum = index + 1;
                    const display = document.getElementById(`player${playerNum}-values`);
                    if (display && values[player]) {
                        const vals = values[player];
                        display.textContent = `Left: ${vals[0].toFixed(1)} | Center: ${vals[1].toFixed(1)} | Right: ${vals[2].toFixed(1)}`;
                    }
                });
            }
        }
    }

    calculateRegionValues(cutPosition) {
        const cutX = (cutPosition / 100) * 800;
        const regions = {
            blue: { start: 0, end: 600 },
            red: { start: 600, end: 800 },
            green: { start: 150, end: 600 },
            orange: { start: 600, end: 800 },
            pink: { start: 0, end: 150 },
            purple: { start: 150, end: 800 }
        };

        const leftValues = {}, rightValues = {};

        for (const [color, bounds] of Object.entries(regions)) {
            if (cutX <= bounds.start) {
                leftValues[color] = 0;
                rightValues[color] = 100;
            } else if (cutX >= bounds.end) {
                leftValues[color] = 100;
                rightValues[color] = 0;
            } else {
                const total = bounds.end - bounds.start;
                const left = cutX - bounds.start;
                leftValues[color] = (left / total) * 100;
                rightValues[color] = 100 - leftValues[color];
            }
        }

        return { left: leftValues, right: rightValues };
    }

    calculatePlayerValue(regionValues, playerValues) {
        return Object.entries(regionValues)
            .reduce((total, [color, percentage]) => {
                return total + (percentage / 100) * (playerValues[color] || 0);
            }, 0);
    }
}

// Global instance
let demoSystem = null;
const registrationQueue = [];

// Make registration available immediately when script loads
window.FairDivisionCore = {
    register: function (id, config) {
        console.log(`Waiting for DOM, queueing registration: ${id}`);
        registrationQueue.push({ id, config });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, initializing system...');
    demoSystem = new FairDivisionCore();

    // Process any queued registrations
    console.log(`Processing ${registrationQueue.length} queued registrations`);
    registrationQueue.forEach(({ id, config }) => {
        console.log(`Processing queued registration: ${id}`);
        demoSystem.register(id, config);
    });
    registrationQueue.length = 0; // Clear the queue

    console.log('Fair Division Demo System ready');
});
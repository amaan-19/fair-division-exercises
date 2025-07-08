/**
 * Selfridge-Conway Procedure Plug-in
 */

// ===== ALGORITHM STEPS =====
const SELFRIDGE_CONWAY_STEPS = [
    {
        id: 'initial-division',
        title: 'Step 1: Divider creates three equal pieces',
        instructions: `Player 1, use both sliders to create three pieces you value equally.`,

        onStepEnter: (state, api) => {
            Logger.debug('Entered initial division step');

            // Show both cut controls for three pieces
            api.showElement('cut-control');
            api.showElement('cut-control-2');
            api.showElement('make-cut-btn');
            api.hideElement('start-btn');

            // Enable sliders
            api.enableElement('cut-slider');
            api.enableElement('cut-slider-2');

            api.updatePlayerValueDisplays();
            api.setAlgorithmData();
        },

        onStepExit: (state, api) => {
            Logger.debug('Exiting ini')
        }
    }
]
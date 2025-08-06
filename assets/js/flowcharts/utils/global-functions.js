/**
 * Global Animation Functions and Event Handlers
 * Maintains backward compatibility with existing API
 */

function animateAlgorithm(containerId, speed = 1000) {
    const container = document.getElementById(containerId);
    if (container && container.enhancedFlowchart) {
        const animateBtn = event?.target;
        if (animateBtn) {
            animateBtn.disabled = true;
            animateBtn.innerHTML = '⏳ Building flowchart...';
        }

        container.enhancedFlowchart.animateSteps(speed).then(() => {
            if (animateBtn) {
                animateBtn.disabled = false;
                animateBtn.innerHTML = '▶️ Animate Steps';
            }
        }).catch(error => {
            console.error('Animation error:', error);
            if (animateBtn) {
                animateBtn.disabled = false;
                animateBtn.innerHTML = '❌ Error - Try Again';
                setTimeout(() => {
                    animateBtn.innerHTML = '▶️ Animate Steps';
                }, 2000);
            }
        });
    } else {
        console.error('Enhanced flowchart not found for container:', containerId);
    }
}

function resetAlgorithm(containerId) {
    const container = document.getElementById(containerId);
    if (container && container.enhancedFlowchart) {
        container.enhancedFlowchart.resetAnimation();

        const resetBtn = event?.target;
        if (resetBtn) {
            const originalText = resetBtn.innerHTML;
            resetBtn.innerHTML = '✅ Reset';
            setTimeout(() => {
                resetBtn.innerHTML = originalText;
            }, 1000);
        }
    } else {
        console.error('Enhanced flowchart not found for container:', containerId);
    }
}

// Legacy support functions
function createEnhancedFlowchart(containerId, algorithmName, customData = null) {
    return FlowchartFactory.create(containerId, algorithmName, customData);
}
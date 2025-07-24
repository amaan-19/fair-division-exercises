// Function to sort glossary terms alphabetically
function sortGlossaryTerms() {
    const grid = document.getElementById('glossary-grid');
    if (!grid) return;

    // Get all term cards
    const termCards = Array.from(grid.querySelectorAll('.term-card'));

    // Sort cards by the term name (case-insensitive)
    termCards.sort((a, b) => {
        const nameA = a.querySelector('.term-name').textContent.trim().toLowerCase();
        const nameB = b.querySelector('.term-name').textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB);
    });

    // Clear the grid and re-append cards in sorted order
    grid.innerHTML = '';
    termCards.forEach(card => grid.appendChild(card));
}

// Run the sorting function when the page loads
document.addEventListener('DOMContentLoaded', sortGlossaryTerms);
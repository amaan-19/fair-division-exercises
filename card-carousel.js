// Algorithm Cards Carousel JavaScript
// For Fair Division Algorithms website

class AlgorithmCarousel {
    constructor() {
        this.track = document.getElementById('algorithm-track');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('indicators');

        this.currentSlide = 0;
        this.cards = [];
        this.cardWidth = 350; // Fixed card width
        this.gap = 32; // 2rem gap
        this.visibleCards = 1;

        this.init();
    }

    init() {
        if (!this.track) return;

        this.cards = Array.from(this.track.children);
        this.calculateVisibleCards();
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            this.calculateVisibleCards();
            this.updateCarousel();
        });
    }

    calculateVisibleCards() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const cardTotalWidth = this.cardWidth + this.gap;

        // Calculate how many cards can fit
        this.visibleCards = Math.floor((containerWidth + this.gap) / cardTotalWidth);

        // Ensure at least 1 card is visible
        this.visibleCards = Math.max(1, this.visibleCards);

        // Don't show more cards than we have
        this.visibleCards = Math.min(this.visibleCards, this.cards.length);
    }

    createIndicators() {
        if (!this.indicators) return;

        this.indicators.innerHTML = '';

        const totalSlides = Math.max(1, this.cards.length - this.visibleCards + 1);

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(dot);
        }
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;

            const diff = startX - currentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            isDragging = false;
        });
    }

    updateCarousel() {
        if (!this.track || this.cards.length === 0) return;

        // Calculate transform
        const translateX = -this.currentSlide * (this.cardWidth + this.gap);
        this.track.style.transform = `translateX(${translateX}px)`;

        // Update button states
        this.updateButtons();

        // Update indicators
        this.updateIndicators();
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }

        if (this.nextBtn) {
            const maxSlide = Math.max(0, this.cards.length - this.visibleCards);
            this.nextBtn.disabled = this.currentSlide >= maxSlide;
        }
    }

    updateIndicators() {
        if (!this.indicators) return;

        const dots = this.indicators.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        const maxSlide = Math.max(0, this.cards.length - this.visibleCards);

        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }

    goToSlide(slideIndex) {
        const maxSlide = Math.max(0, this.cards.length - this.visibleCards);
        this.currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
        this.updateCarousel();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a page with the carousel
    if (document.getElementById('algorithm-carousel')) {
        new AlgorithmCarousel();
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmCarousel;
}
// Algorithm Cards Carousel JavaScript
// For Fair Division Algorithms website - Multi-Carousel Support

class AlgorithmCarousel {
    constructor(carouselId) {
        this.carouselId = carouselId;
        this.carousel = document.getElementById(carouselId);

        if (!this.carousel) return;

        this.track = this.carousel.querySelector('.algorithm-track');
        this.prevBtn = this.carousel.querySelector('.carousel-btn:first-of-type');
        this.nextBtn = this.carousel.querySelector('.carousel-btn:last-of-type');
        this.indicators = this.carousel.querySelector('.carousel-indicators');

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

        // Determine how many cards should be visible based on container width
        if (containerWidth >= 1000) {
            this.visibleCards = 3; // Show 3 cards on large screens (lowered threshold)
        } else if (containerWidth >= 680) {
            this.visibleCards = 2; // Show 2 cards on medium screens
        } else {
            this.visibleCards = 1; // Show 1 card on small screens
        }

        // Don't show more cards than we have
        this.visibleCards = Math.min(this.visibleCards, this.cards.length);

        // Calculate dynamic card width and gap to fit perfectly
        if (this.visibleCards > 1) {
            // Use smaller gaps and add padding to prevent cards from being too wide
            const gapSize = 24; // Reduced gap size
            const containerPadding = 40; // Add some padding to the container
            const totalGaps = (this.visibleCards - 1) * gapSize;
            const availableWidth = containerWidth - totalGaps - containerPadding;
            this.cardWidth = Math.max(280, Math.min(360, availableWidth / this.visibleCards)); // Min 280px, max 360px
            this.gap = gapSize;
        } else {
            // Single card takes most of the width with some padding
            this.cardWidth = Math.min(350, containerWidth - 40);
            this.gap = 0;
        }
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

        // Update card widths dynamically
        this.cards.forEach(card => {
            card.style.width = `${this.cardWidth}px`;
            card.style.minWidth = `${this.cardWidth}px`;
            card.style.maxWidth = `${this.cardWidth}px`;
        });

        // Calculate transform
        const translateX = -this.currentSlide * (this.cardWidth + this.gap);
        this.track.style.transform = `translateX(${translateX}px)`;
        this.track.style.gap = `${this.gap}px`;

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

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize multiple carousels
    const carouselIds = ['divisible-carousel', 'indivisible-carousel'];

    carouselIds.forEach(carouselId => {
        const carouselElement = document.getElementById(carouselId);
        if (carouselElement) {
            new AlgorithmCarousel(carouselId);
        }
    });

    // Fallback for single carousel (backward compatibility)
    if (document.getElementById('algorithm-carousel') && !document.getElementById('divisible-carousel')) {
        new AlgorithmCarousel('algorithm-carousel');
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmCarousel;
}
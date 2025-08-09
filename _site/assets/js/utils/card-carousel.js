// Algorithm Cards Carousel JavaScript - IMPROVED VERSION
// Optimized for three-card display with proper sliding

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
        this.visibleCards = 1;

        // Card dimensions (matching CSS)
        this.cardWidth = 340;
        this.cardMargin = 24;
        this.totalCardWidth = this.cardWidth + this.cardMargin;

        this.init();
    }

    init() {
        if (!this.track) return;

        this.cards = Array.from(this.track.children);
        this.calculateVisibleCards();
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();

        // Recalculate on window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateVisibleCards();
                this.updateCarousel();
            }, 150);
        });
    }

    calculateVisibleCards() {
        // Get the actual container width (excluding padding for nav buttons)
        const containerRect = this.carousel.getBoundingClientRect();
        const containerWidth = containerRect.width; // Account for nav button padding

        // Determine visible cards based on breakpoints
        if (window.innerWidth >= 1200) {
            this.visibleCards = Math.min(3, this.cards.length);
            this.cardWidth = 320;
            this.cardMargin = 30;
        } else if (window.innerWidth >= 769) {
            this.visibleCards = Math.min(2, this.cards.length);
            this.cardWidth = 320;
            this.cardMargin = 20;
        } else {
            this.visibleCards = 1;
            this.cardWidth = containerWidth;
            this.cardMargin = 0;
        }

        this.totalCardWidth = this.cardWidth + this.cardMargin;

        // Ensure current slide is valid after resize
        const maxSlide = Math.max(0, this.cards.length - this.visibleCards);
        this.currentSlide = Math.min(this.currentSlide, maxSlide);
    }

    createIndicators() {
        if (!this.indicators) return;

        this.indicators.innerHTML = '';

        // Calculate total number of possible slide positions
        const totalSlides = Math.max(1, this.cards.length - this.visibleCards + 1);

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === this.currentSlide ? 'active' : ''}`;
            dot.setAttribute('data-slide', i);
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(dot);
        }
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        this.carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            isDragging = true;
            // Temporarily disable transitions for smooth dragging
            this.track.style.transition = 'none';
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;

            // Optional: Add visual feedback during drag
            const diff = currentX - startX;
            const currentTransform = -this.currentSlide * this.totalCardWidth;
            this.track.style.transform = `translateX(${currentTransform + diff * 0.3}px)`;
        }, { passive: true });

        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;

            const diff = startX - currentX;
            const timeDiff = Date.now() - startTime;
            const velocity = Math.abs(diff) / timeDiff;

            // Re-enable transitions
            this.track.style.transition = '';

            // Determine if swipe was significant enough
            const threshold = velocity > 0.3 ? 30 : 80;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            } else {
                // Return to current position if swipe wasn't significant
                this.updateCarousel();
            }

            isDragging = false;
        });

        // Mouse drag support for desktop
        let mouseStartX = 0;
        let isMouseDragging = false;

        this.track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.track.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;

            const diff = e.clientX - mouseStartX;
            const currentTransform = -this.currentSlide * this.totalCardWidth;
            this.track.style.transform = `translateX(${currentTransform + diff * 0.3}px)`;
        });

        document.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;

            const diff = mouseStartX - e.clientX;
            const threshold = 50;

            this.track.style.cursor = '';

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            } else {
                this.updateCarousel();
            }

            isMouseDragging = false;
        });
    }

    updateCarousel() {
        if (!this.track || this.cards.length === 0) return;

        // Update card styles to match current breakpoint
        this.cards.forEach((card, index) => {
            card.style.width = `${this.cardWidth}px`;
            card.style.minWidth = `${this.cardWidth}px`;
            card.style.maxWidth = `${this.cardWidth}px`;

            // Set margin except for last card
            card.style.marginRight = index === this.cards.length - 1 ? '0' : `${this.cardMargin}px`;
        });

        // Calculate and apply transform
        const translateX = -this.currentSlide * this.totalCardWidth;
        this.track.style.transform = `translateX(${translateX}px)`;

        // Update button states
        this.updateButtons();

        // Update indicators
        this.updateIndicators();

        // Update ARIA attributes for accessibility
        this.updateAriaAttributes();
    }

    updateButtons() {
        const maxSlide = Math.max(0, this.cards.length - this.visibleCards);

        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.prevBtn.setAttribute('aria-disabled', this.currentSlide === 0);
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide >= maxSlide;
            this.nextBtn.setAttribute('aria-disabled', this.currentSlide >= maxSlide);
        }
    }

    updateIndicators() {
        if (!this.indicators) return;

        const dots = this.indicators.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            const isActive = index === this.currentSlide;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-pressed', isActive);
        });
    }

    updateAriaAttributes() {
        // Update live region for screen readers
        const liveRegion = this.carousel.querySelector('.sr-only') ||
                          this.createLiveRegion();

        const maxSlide = Math.max(0, this.cards.length - this.visibleCards);
        liveRegion.textContent = `Showing slide ${this.currentSlide + 1} of ${maxSlide + 1}`;
    }

    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        this.carousel.appendChild(liveRegion);
        return liveRegion;
    }

    nextSlide() {
        const maxSlide = Math.max(0, this.cards.length - this.visibleCards);

        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
            this.updateCarousel();
            this.announceSlideChange('next');
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
            this.announceSlideChange('previous');
        }
    }

    goToSlide(slideIndex) {
        const maxSlide = Math.max(0, this.cards.length - this.visibleCards);
        const newSlide = Math.max(0, Math.min(slideIndex, maxSlide));

        if (newSlide !== this.currentSlide) {
            this.currentSlide = newSlide;
            this.updateCarousel();
            this.announceSlideChange('goto');
        }
    }

    announceSlideChange(action) {
        // For screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = `Moved to slide ${this.currentSlide + 1}`;

        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }

    // Public method to refresh carousel (useful for dynamic content)
    refresh() {
        this.cards = Array.from(this.track.children);
        this.calculateVisibleCards();
        this.createIndicators();
        this.updateCarousel();
    }

    // Public method to go to a specific card by ID
    goToCard(cardId) {
        const cardIndex = this.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
            const slideIndex = Math.min(cardIndex, this.cards.length - this.visibleCards);
            this.goToSlide(slideIndex);
        }
    }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
    // Initialize multiple carousels
    const carouselIds = ['divisible-carousel', 'indivisible-carousel'];
    const carouselInstances = {};

    carouselIds.forEach(carouselId => {
        const carouselElement = document.getElementById(carouselId);
        if (carouselElement) {
            try {
                carouselInstances[carouselId] = new AlgorithmCarousel(carouselId);
                console.log(`✓ Initialized carousel: ${carouselId}`);
            } catch (error) {
                console.error(`✗ Failed to initialize carousel ${carouselId}:`, error);
            }
        }
    });

    // Fallback for single carousel (backward compatibility)
    if (document.getElementById('algorithm-carousel') &&
        !document.getElementById('divisible-carousel')) {
        try {
            carouselInstances['algorithm-carousel'] = new AlgorithmCarousel('algorithm-carousel');
            console.log('✓ Initialized legacy algorithm-carousel');
        } catch (error) {
            console.error('✗ Failed to initialize legacy carousel:', error);
        }
    }

    // Make carousel instances globally available for debugging
    window.carouselInstances = carouselInstances;
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmCarousel;
}
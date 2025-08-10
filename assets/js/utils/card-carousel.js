// Simple Algorithm Carousel - Clean & Bug-Free Implementation

class AlgorithmCarousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;

        this.track = this.carousel.querySelector('.algorithm-track');
        this.cards = Array.from(this.track.children);
        this.controls = this.carousel.parentElement.querySelector('.carousel-controls');

        // Get navigation buttons
        this.prevBtn = this.controls?.querySelector('.carousel-btn:first-of-type');
        this.nextBtn = this.controls?.querySelector('.carousel-btn:last-of-type');
        this.indicators = this.controls?.querySelector('.carousel-indicators');

        // Simple state
        this.currentSlide = 0;
        this.cardsPerView = 3; // Always show 3 cards on desktop
        this.totalSlides = Math.max(0, this.cards.length - this.cardsPerView);

        this.init();
    }

    init() {
        if (!this.track || this.cards.length === 0) return;

        this.setupCards();
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();
        this.handleResize();

        console.log(`✓ Carousel initialized: ${this.cards.length} cards, ${this.totalSlides + 1} positions`);
    }

    setupCards() {
        // Simple: Set width and margin for each card
        this.cards.forEach((card, index) => {
            // Calculate width: (100% - total gaps) / 3 cards
            card.style.width = `calc((100% - 4rem) / 3)`;
            card.style.marginRight = index < this.cards.length - 1 ? '2rem' : '0';
            card.style.flexShrink = '0';
        });
    }

    createIndicators() {
        if (!this.indicators) return;

        this.indicators.innerHTML = '';

        // Create dots for each slide position
        for (let i = 0; i <= this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === this.currentSlide ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(dot);
        }
    }

    bindEvents() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateCardsPerView();
                this.updateCarousel();
            }, 150);
        });
    }

    updateCardsPerView() {
        // Update cards per view based on screen size
        if (window.innerWidth <= 768) {
            this.cardsPerView = 1; // Mobile
        } else if (window.innerWidth <= 1024) {
            this.cardsPerView = 2; // Tablet
        } else {
            this.cardsPerView = 3; // Desktop
        }

        // Recalculate total slides
        this.totalSlides = Math.max(0, this.cards.length - this.cardsPerView);

        // Ensure current slide is valid
        this.currentSlide = Math.min(this.currentSlide, this.totalSlides);
    }

    updateCarousel() {
        // Simple calculation: move by card width + gap
        const cardWidth = this.cards[0]?.offsetWidth || 0;
        const gap = 32; // 2rem gap
        const moveDistance = (cardWidth + gap) * this.currentSlide;

        // Apply transform
        this.track.style.transform = `translateX(-${moveDistance}px)`;

        // Update navigation states
        this.updateNavigation();
        this.updateIndicators();
    }

    updateNavigation() {
        // Enable/disable buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide >= this.totalSlides;
        }
    }

    updateIndicators() {
        if (!this.indicators) return;

        const dots = this.indicators.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }

    goToSlide(slideIndex) {
        this.currentSlide = Math.max(0, Math.min(slideIndex, this.totalSlides));
        this.updateCarousel();
    }
}

// Initialize carousels when page loads
document.addEventListener('DOMContentLoaded', () => {
    const carouselElements = document.querySelectorAll('.algorithm-carousel');
    const carousels = {};

    carouselElements.forEach(carousel => {
        if (carousel.id) {
            carousels[carousel.id] = new AlgorithmCarousel(carousel.id);
        }
    });

    // Make available globally for debugging
    window.algorithmCarousels = carousels;
    console.log(`✓ Initialized ${Object.keys(carousels).length} carousels`);
});
---
layout: default
title: Home
---

<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        <h1 class="serif">Fair Division Algorithms</h1>
        <p class="hero-subtitle">An interactive educational platform for exploring mathematical procedures that divide resources fairly among multiple parties</p>
    </div>
</section>

<!-- Main Content -->
<div class="main-content">
    <section class="section-header">
        <h2 class="section-title serif">Available Algorithms</h2>
        <p class="section-subtitle">Learn about different fair division procedures through interactive demonstrations and mathematical analysis</p>
    </section>

    <div class="algorithm-grid">
        <article class="algorithm-card fade-in">
            <div class="difficulty-badge difficulty-beginner">Beginner</div>
            <h3 class="algorithm-title serif">Divide-and-Choose Algorithm</h3>
            <p class="algorithm-description">
                The fundamental fair division procedure for two players. One player divides the resource into two pieces they value equally, and the other player chooses their preferred piece.
            </p>
            <div class="algorithm-meta">
                <div class="meta-item">
                    <span class="meta-label">Players:</span> 2
                </div>
                <div class="meta-item">
                    <span class="meta-label">Properties:</span> Proportional, Envy-free
                </div>
                <div class="meta-item">
                    <span class="meta-label">Type:</span> Discrete
                </div>
            </div>
            <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="learn-button">
                Study Algorithm →
            </a>
        </article>

        <article class="algorithm-card fade-in" style="animation-delay: 0.1s;">
            <div class="difficulty-badge difficulty-intermediate">Intermediate</div>
            <h3 class="algorithm-title serif">Austin's Moving-Knife</h3>
            <p class="algorithm-description">
                An elegant continuous procedure for three players using a moving knife. Players strategically call "stop" when they believe they can secure a fair share.
            </p>
            <div class="algorithm-meta">
                <div class="meta-item">
                    <span class="meta-label">Players:</span> 3
                </div>
                <div class="meta-item">
                    <span class="meta-label">Properties:</span> Proportional
                </div>
                <div class="meta-item">
                    <span class="meta-label">Type:</span> Continuous
                </div>
            </div>
            <a href="#" class="learn-button" style="background: var(--text-muted); cursor: not-allowed;">
                Coming Soon
            </a>
        </article>
    </div>

<!-- Features Section -->
<section class="features-section">
    <div class="features-container">
        <div class="section-header">
            <h2 class="section-title serif">Educational Approach</h2>
            <p class="section-subtitle">Multiple learning modalities for comprehensive understanding</p>
        </div>

        <div class="features-grid">
            <div class="feature-card fade-in">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Interactive Python</h3>
                <p class="feature-description">Execute algorithms directly in your browser with Pyodide. Experiment with parameters and see real-time results.</p>
            </div>

            <div class="feature-card fade-in" style="animation-delay: 0.1s;">
                <div class="feature-icon">📊</div>
                <h3 class="feature-title">Visual Analysis</h3>
                <p class="feature-description">Dynamic visualizations and step-by-step breakdowns make complex algorithms accessible and intuitive.</p>
            </div>

            <div class="feature-card fade-in" style="animation-delay: 0.2s;">
                <div class="feature-icon">📐</div>
                <h3 class="feature-title">Mathematical Rigor</h3>
                <p class="feature-description">Detailed proofs of fairness properties and algorithmic guarantees provide theoretical foundation.</p>
            </div>

            <div class="feature-card fade-in" style="animation-delay: 0.3s;">
                <div class="feature-icon">🎯</div>
                <h3 class="feature-title">Practice Problems</h3>
                <p class="feature-description">Carefully designed exercises with step-by-step solutions reinforce learning and build intuition.</p>
            </div>

            <div class="feature-card fade-in" style="animation-delay: 0.4s;">
                <div class="feature-icon">📚</div>
                <h3 class="feature-title">Academic References</h3>
                <p class="feature-description">Curated bibliography linking to seminal papers and current research in fair division theory.</p>
            </div>

            <div class="feature-card fade-in" style="animation-delay: 0.5s;">
                <div class="feature-icon">🌍</div>
                <h3 class="feature-title">Real Applications</h3>
                <p class="feature-description">Explore connections to estate division, resource allocation, and dispute resolution in practice.</p>
            </div>
        </div>
    </div>
</section>
---
layout: default
title: Home
---

<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        <h1 class="serif">Fair Division Algorithms</h1>
        <p class="hero-subtitle">An interactive educational platform for exploring mathematical procedures that divide resources fairly among multiple parties</p>
        <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="cta-button">
            Explore Algorithms →
        </a>
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

        <article class="algorithm-card fade-in" style="animation-delay: 0.2s;">
            <div class="difficulty-badge difficulty-intermediate">Advanced</div>
            <h3 class="algorithm-title serif">Selfridge-Conway Algorithm</h3>
            <p class="algorithm-description">
                The first discrete algorithm to achieve envy-free division among three players, featuring the ingenious "trimming" technique for handling complex preference structures.
            </p>
            <div class="algorithm-meta">
                <div class="meta-item">
                    <span class="meta-label">Players:</span> 3
                </div>
                <div class="meta-item">
                    <span class="meta-label">Properties:</span> Envy-free
                </div>
                <div class="meta-item">
                    <span class="meta-label">Type:</span> Discrete, Finite
                </div>
            </div>
            <a href="#" class="learn-button" style="background: var(--text-muted); cursor: not-allowed;">
                Coming Soon
            </a>
        </article>
    </div>

    <!-- Demo Section -->
    <section class="demo-section fade-in" style="animation-delay: 0.3s;">
        <h3 class="demo-title serif">Interactive Demonstration</h3>
        <p class="demo-description">
            See the Divide-and-Choose algorithm in action with live Python execution
        </p>

        <div class="code-block">
<span style="color: #6b7280;"># Define player preferences</span>
<span style="color: #4f46e5;">player1_values</span> = {"left": 0.45, "right": 0.55}
<span style="color: #4f46e5;">player2_values</span> = {"left": 0.75, "right": 0.25}

<span style="color: #6b7280;"># Player 1 cuts at midpoint</span>
<span style="color: #4f46e5;">cut_point</span> = 0.5

<span style="color: #6b7280;"># Player 2 chooses preferred piece</span>
<span style="color: #f59e0b;">if</span> player2_values["left"] >= player2_values["right"]:
    choice = "left"
        </div>

        <div class="code-output">
=== Divide-and-Choose Simulation ===

Player 1 valuations: Left = 0.45, Right = 0.55
Player 2 valuations: Left = 0.75, Right = 0.25

Player 1 cuts at position 0.5
Player 2 chooses the left piece

Final allocation:
  Player 1 receives: 55.0% of total value
  Player 2 receives: 75.0% of total value

Fairness Properties:
  ✓ Proportional (both ≥50%): True
  ✓ Envy-free: By construction
        </div>

        <div style="text-align: center; margin-top: 1.5rem;">
            <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="cta-button">
                Try Interactive Demo →
            </a>
        </div>
    </section>
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
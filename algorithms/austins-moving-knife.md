---
layout: default
title: Austin's Moving Knife
permalink: /algorithms/austins-moving-knife/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Austin's Moving Knife</h1>
      <p class="algorithm-subtitle">A simple, but powerful extension of "Divide-and-Choose"</p>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">2 Players</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Austin's procedure introduces a moving-knife mechanism to making a fair cake division. The procedure builds on Divide-and-Choose by guaranteeing exact divisions for two parties, rather than merely a proportional one.</p>
    <a href="https://en.wikipedia.org/wiki/Austin_moving-knife_procedures" target="_blank" class="algorithm-link">Read more →</a>
    
    <div class="procedure-steps">
      <h3>How It Works</h3>
      <div class="step-list">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            Beginning at the left end of the cake, a <strong>referee</strong> moves the knife across the cake while ensuring it remains parallel to the starting edge of the cake.
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <strong>Either player</strong> is free to request the <strong>referee</strong> to "stop" at the point that which they believe the piece to the left of the knife has a value of exactly $\frac{1}{2}$.
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            Whichever player, say <strong>Player 1</strong>, requests the knife to "stop" first, introduces a second moving knife to the left edge of the cake, and gains control of both knives. 
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <strong>Player 1</strong> proceeds by moving both knives in parallel across the cake such that (1) their personal valuation of the piece between the knives remains the same, (2) by the time the right knife reaches the end of the cake, the left knife must line up with the original stopping position of the right knife.
          </div>
        </div>
        <div class="step">
          <div class="step-number">5</div>
          <div class="step-content">
            While <strong>Player 1</strong> moves the knives, <strong>Player 2</strong> requests the knives to "stop" at the point where they believe the division is exactly $\frac{1}{2}$. Pieces are then randomly assigned to the players.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Demo -->
  <section class="content-block">
    <h2>Interactive Demo</h2>
    <p>Let's visualize this algorithm! Click play to see the algorithm in action.</p>
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin: 20px 0; min-height: 800px;">
      <iframe 
        src="{{ '/assets/demos/austins-demo.html' | relative_url }}" 
        width="100%" 
        height="1400" 
        frameborder="0"
        style="display: block; border: none;">
        <p>Your browser does not support iframes. <a href="{{ '/assets/demos/divide-and-choose-demo.html' | relative_url }}">View the demo directly</a>.</p>
      </iframe>
    </div>
  </section>

  <!-- Mathematical Analysis -->
  <section class="content-block">
    <h2>Mathematical Insight</h2>
  </section>

  <section class="content-block">
    <h2>Fairness Properties</h2>
    <p>Austin's procedure satisfies three fundamental fairness properties:</p>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="nav-button secondary">← Back to Divide-and-Choose</a>
  </footer>
</div>
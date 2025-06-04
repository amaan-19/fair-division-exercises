---
layout: default
title: Divide-and-Choose
permalink: /algorithms/divide-and-choose/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card - Fixed Structure -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Divide-and-Choose</h1>
      <p class="algorithm-subtitle">The fundamental fair division procedure for two players</p>
      
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">2 Players</span>
        <span class="meta-badge type-badge">Discrete</span>
        <span class="meta-badge difficulty-badge">Quick-learn</span>
      </div>

      <div class="algorithm-stats">
        <div class="stat-item">
          <span class="stat-value">O(1)</span>
          <span class="stat-label">Time Complexity</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">100%</span>
          <span class="stat-label">Proportional</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">✓</span>
          <span class="stat-label">Envy-Free</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>The divide-and-choose algorithm is the most basic and intuitive fair division procedure. Despite its simplicity, it provides strong mathematical guarantees about fairness for two-player scenarios.</p>
    <a href="https://en.wikipedia.org/wiki/Divide_and_choose" target="_blank" class="algorithm-link">Read more →</a>
    
    <div class="procedure-steps">
      <h3>How It Works</h3>
      <div class="step-list">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <strong>Player 1 (Divider)</strong> cuts the resource into two pieces that they value equally
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <strong>Player 2 (Chooser)</strong> selects their preferred piece from the two options
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <strong>Player 1</strong> receives the remaining piece
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Demo -->
  <section class="content-block">
    <h2>Interactive Demo</h2>
    <p>Try the algorithm yourself! Draw a line to divide the geometric pattern, then see how Player 2 responds.</p>
    
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin: 20px 0; min-height: 800px;">
      <iframe 
        src="{{ '/assets/demos/divide-and-choose-demo.html' | relative_url }}" 
        width="100%" 
        height="1550" 
        frameborder="0"
        style="display: block; border: none;">
        <p>Your browser does not support iframes. <a href="{{ '/assets/demos/divide-and-choose-demo.html' | relative_url }}">View the demo directly</a>.</p>
      </iframe>
    </div>
  </section>

  <!-- Mathematical Properties -->
  <section class="content-block">
    <h2>Mathematical Properties</h2>
    
    <div class="properties-grid">
      <div class="property-card">
        <h4>Proportionality</h4>
        <p>Both players receive at least 50% of their subjective valuation of the resource.</p>
        <div class="proof-sketch">
          <strong>Why:</strong> Player 1 cuts equally (≥50%), Player 2 chooses their preferred piece (≥50%).
        </div>
      </div>
      
      <div class="property-card">
        <h4>Envy-Freeness</h4>
        <p>Neither player prefers the other's allocation to their own.</p>
        <div class="proof-sketch">
          <strong>Why:</strong> Player 1 values both pieces equally, Player 2 chose their preferred piece.
        </div>
      </div>
      
      <div class="property-card">
        <h4>Strategy-Proofness</h4>
        <p>Truth-telling is optimal for both players.</p>
        <div class="proof-sketch">
          <strong>Why:</strong> Deviating from honest play can only hurt the deviating player.
        </div>
      </div>
    </div>
  </section>

  <!-- Limitations -->
  <section class="content-block">
    <h2>Limitations</h2>
    <ul>
      <li>Limited to exactly two players</li>
      <li>May not achieve Pareto efficiency</li>
      <li>Requires divisible resources</li>
      <li>Assumes players can accurately assess values</li>
    </ul>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/' | relative_url }}" class="nav-button secondary">← Back to Algorithms</a>
    <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}" class="nav-button primary disabled">Next: Austin's Moving-Knife →</a>
  </footer>
</div>
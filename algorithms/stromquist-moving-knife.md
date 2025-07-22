---
layout: default
title: Stromquist Moving Knife Procedure
permalink: /algorithms/stromquist-moving-knife/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Stromquist Moving Knife Procedure</h1>
      <p class="algorithm-subtitle">The first envy-free moving knife procedure for three players</p>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">3 Players</span>
        <span class="meta-badge type-badge">Continuous</span>
        <span class="meta-badge complexity-badge">$\infty$ RW Queries</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>The Stromquist moving knife procedure, introduced by Walter Stromquist in 1980, was the first envy-free moving knife procedure devised for three players. This procedure was the first envy-free moving knife procedure devised for three players. It represents a landmark achievement in fair division theory, solving a problem that had remained unsolved for several decades.</p>
    <p>The procedure uses <strong>four knives simultaneously</strong>—one sword controlled by a referee and three knives controlled by the players—but requires only <strong>two cuts</strong>, ensuring each player receives a single connected piece. It requires four knives but only two cuts, so each player receives a single connected piece.</p>
  </section>

  <!-- Flowchart -->
  <section class="content-block">
    <h2>Algorithm Flowchart</h2>
    <div id="enhanced-stromquist" data-enhanced-flowchart="stromquist-moving-knife"></div>

    <div class="animation-controls">
      <button class="animation-btn primary" 
        onclick="animateAlgorithm('enhanced-stromquist', 1500)">
        ▶️ Animate Steps
      </button>
      <button class="animation-btn secondary" 
        onclick="resetAlgorithm('enhanced-stromquist')">
        🔄 Reset
      </button>
    </div>
  </section>

  <!-- Fairness Properties -->
  <section class="content-block">
    <h2>Fairness Properties</h2>

    <div class="properties-grid">
      <div class="property-card">
        <h4>Envy-Free</h4>
        <p><strong>Guaranteed:</strong> Following this strategy each person gets the largest or one of the largest pieces by their own valuation and therefore the division is envy-free.</p>
        
        <div class="proof-sketch">
          <div class="proof-sketch-header" onclick="toggleProof('envy-free-proof')">
            <span><strong>Proof Sketch</strong></span>
            <span class="proof-toggle">▶</span>
          </div>
          <div id="envy-free-proof" class="proof-sketch-content" style="display: none;">
            <p><strong>For the "Quieters" (non-shouting players):</strong> Each of them receives a piece that contains their own knife, so they do not envy each other. Additionally, because they remained quiet, the piece they receive is larger in their eyes than Left, so they also don't envy the shouter.</p>
            <p><strong>For the "Shouter":</strong> The shouter receives Left, which is equal to the piece they could receive by remaining silent and larger than the third piece, hence the shouter does not envy any of the quieters.</p>
          </div>
        </div>
      </div>

      <div class="property-card">
        <h4>Strategy-Proof</h4>
        <p><strong>Guaranteed:</strong> Truthful play (following the prescribed strategy) is optimal for each player, regardless of what others do.</p>
      </div>
    </div>
  </section>

  <!-- Historical Significance -->
  <section class="content-block">
    <h2>Historical Significance</h2>

    <p>The Stromquist procedure holds a unique place in fair division history:</p>
    
    <ul>
      <li><strong>Breakthrough Result:</strong> This problem was unsolved for several tens of years, until Stromquist (1980) suggested the following division protocol</li>
      <li><strong>First Envy-Free Solution:</strong> Solved the long-standing problem of envy-free division for three players with connected pieces</li>
      <li><strong>Methodological Innovation:</strong> Introduced the multi-knife coordination approach that influenced subsequent algorithms</li>
      <li><strong>Theoretical Foundation:</strong> Provided key insights that led to later impossibility results and complexity understanding</li>
    </ul>

    <div class="property-card">
      <h4>Theoretical Impact</h4>
      <p>Stromquist's work went beyond this single procedure. His later research (Stromquist, 2008) proved that <strong>finite protocols cannot achieve envy-free division</strong> with connected pieces for three or more players—establishing fundamental limits in computational fair division.</p>
    </div>
  </section>

</div>

<!-- Navigation -->
<footer class="algorithm-navigation">
  <a href="{{ '/algorithms/selfridge-conway/' | relative_url }}" class="nav-button secondary">← Selfridge-Conway</a>
  <a href="{{ '/algorithms/banach-knaster-last-diminisher/' | relative_url }}" class="nav-button primary">Banach-Knaster →</a>
</footer>

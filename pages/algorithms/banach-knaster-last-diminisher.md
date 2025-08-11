---
layout: default
title: Banach-Knaster's Last-Diminisher
permalink: /algorithms/banach-knaster-last-diminisher/
---

<div class="algorithm-page">

  <!-- Algorithm Header -->
  <h1>Banach-Knaster Last-Diminisher</h1>
  <div class="algorithm-meta">
    <span class="meta-badge players-badge">N Players</span>
    <span class="meta-badge type-badge">Discrete</span>
    <span class="meta-badge complexity-badge">$O(n^2)$ RW Queries</span>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>The Banach-Knaster procedure guarantees each of n participants receives at least 1/n of a divisible good according to their own valuation, operating through rounds where players can trim a proposed piece to their desired share, with the last person to make a trim receiving that piece.</p>
    <a href="https://en.wikipedia.org/wiki/Last_diminisher" target="_blank" class="algorithm-link">Read more →</a>
  </section>

  <!-- Flowchart -->
  <section class="content-block">
    <h2>Algorithm Flowchart</h2>
    <div id="enhanced-banach-knaster" data-enhanced-flowchart="banach-knaster-last-diminisher"></div>

    <div class="animation-controls">
      <button class="animation-btn primary" 
        onclick="animateAlgorithm('enhanced-banach-knaster', 1200)">
        ▶️ Animate Steps
      </button>
      <button class="animation-btn secondary" 
        onclick="resetAlgorithm('enhanced-banach-knaster')">
        🔄 Reset
      </button>
    </div>
  </section>

  <!-- Fairness Properties -->
  <section class="content-block">
    <h2>Fairness Properties</h2>
    <p>Banach and Knaster's procedure satisfies one fairness property:</p>

    <h3>Proportionality</h3>
    <p>Both players receive at least 50% of their subjective valuation of the resource.</p>
    <div class="proof-sketch">
      
    </div>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/algorithms/stromquist-moving-knife/' | relative_url }}" class="nav-button secondary">← Back to Stromquist</a>
    <a href="{{ '/algorithms/brams-taylor/' | relative_url }}" class="nav-button primary"> Next: Brams-Taylor →</a>
  </footer>
</div>
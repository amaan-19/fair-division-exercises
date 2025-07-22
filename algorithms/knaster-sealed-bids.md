---
layout: default
title: Knaster's Procedure of Sealed Bids
permalink: /algorithms/knaster-sealed-bids/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Knaster's Procedure of Sealed Bids</h1>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">N Players</span>
        <span class="meta-badge type-badge">Discrete Items</span>
        <span class="meta-badge mechanism-badge">Auction</span>
        <span class="meta-badge complexity-badge">O(N) Rounds</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Knaster's sealed bid procedure enables fair division of indivisible goods through a truthful auction mechanism combined with monetary transfers to ensure proportional outcomes.</p>
  </section>

  <!-- Flowchart -->
  <div id="enhanced-knaster" data-enhanced-flowchart="knaster-sealed-bids"></div>
  <div class="animation-controls">
    <button class="animation-btn primary" onclick="animateAlgorithm('enhanced-knaster', 1000)">▶️ Animate Steps</button>
    <button class="animation-btn secondary" onclick="resetAlgorithm('enhanced-knaster')">🔄 Reset</button>
  </div>

  <!-- Fairness Properties -->
  <section class="content-block">
    <h2>Fairness Properties</h2>

    <h3>Proportional with Monetary Transfer</h3>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> Each player receives utility ≥ $\frac{1}{n}$ of their total valuation when bidding truthfully.</p>
      
      <p><strong>Proof Sketch:</strong> If player $i$ bids truthfully ($b_i^j = v_i^j$), their final utility is:</p>
      <p>$$U_i = \sum_{j \in S_i} v_i^j - \sum_{j \in S_i} b_i^j + \frac{\sum_k payment_k}{n}$$</p>
      
      <p>The redistribution mechanism ensures this equals at least $\frac{1}{n} \sum_j v_i^j$.</p>
    </div>

    <h3>Strategy-Proof</h3>
    <div class="proof-sketch">
      <p><strong>Intuition:</strong> Bidding true valuations is a dominant strategy because overbidding risks overpaying, while underbidding risks losing valuable items.</p>
    </div>

  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/' | relative_url }}" class="nav-button secondary">← Back to Algorithms</a>
    <a href="{{ '/algorithms/lucas-method-of-markers/' | relative_url }}" class="nav-button primary">Next: Lucas' Marker Method →</a>
  </footer>

</div>
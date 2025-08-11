---
layout: default
title: Lucas' Method of Markers
permalink: /algorithms/lucas-method-of-markers/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <h1>Lucas' Method of Markers</h1>
  <div class="algorithm-meta">
    <span class="meta-badge players-badge">N Players</span>
    <span class="meta-badge type-badge">Linear Arrangement</span>
    <span class="meta-badge mechanism-badge">Marker Placement</span>
    <span class="meta-badge complexity-badge">O(N²) Operations</span>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Developed by William F. Lucas in the 1990s, the Method of Markers provides a fair division procedure for goods that can be arranged in a linear fashion. This applies to both continuous resources (like a gold chain to be cut) and collections of discrete indivisible items (like books arranged on a shelf). The algorithm builds on ideas from the Last-Diminisher procedure but adapts them for indivisible or semi-divisible goods.</p>

    <p>Each player places markers to indicate segments they would accept as fair, with the algorithm ensuring everyone receives a proportional share according to their own valuation.</p>
  </section>

  <div id="enhanced-lucas" data-enhanced-flowchart="lucas-method-markers"></div>
  <div class="animation-controls">
    <button class="animation-btn primary" onclick="animateAlgorithm('enhanced-lucas', 1000)">▶️ Animate Steps</button>
    <button class="animation-btn secondary" onclick="resetAlgorithm('enhanced-lucas')">🔄 Reset</button>
  </div>

  <!-- Mathematical Framework -->
  <section class="content-block">
    <h2>Mathematical Framework</h2>

    <p><strong>Formal Setup:</strong> Let $G$ be the set of goods arranged linearly, and let $v_i: \mathcal{P}(G) \rightarrow \mathbb{R}_+$ be player $i$'s valuation function where $\mathcal{P}(G)$ represents all possible subsets (segments) of $G$.</p>

    <p><strong>Marker Constraint:</strong> For each player $i$, their markers $m_i^1 < m_i^2 < \ldots < m_i^{n-1}$ must satisfy:
    $$v_i(\text{segment}_j) \geq \frac{v_i(G)}{n} \text{ for all segments } j \in \{1, 2, \ldots, n\}$$</p>

    <p><strong>Allocation Function:</strong> The algorithm produces allocation $A = (A_1, A_2, \ldots, A_n)$ where $A_i$ is the segment received by player $i$.</p>
  </section>

  <!-- Fairness Properties -->
  <section class="content-block">
    <h2>Fairness Properties</h2>

    <h3>Proportionality</h3>
    <p>Every player receives at least their proportional share according to their own valuation.</p>
    <div class="proof-sketch">
      <div class="proof-sketch-header" onclick="toggleProof('proportionality-proof')">
        <span><strong>Formal Statement:</strong> $\forall i, v_i(A_i) \geq \frac{v_i(G)}{n}$</span>
        <span class="proof-toggle">▼</span>
      </div>
      <div id="proportionality-proof" class="proof-sketch-content">
        <p><strong>Proof:</strong> By the marker placement constraint, each player values every segment they create as worth at least $\frac{1}{n}$ of the total.</p>
        
        <p>When player $i$ is selected in any round, they receive a segment that:</p>
        <ul>
          <li>Ends at one of their own markers, and</li>
          <li>Contains at least one complete segment they originally marked</li>
        </ul>
        
        <p>Since player $i$ valued this segment as $\geq \frac{v_i(G)}{n}$ when placing markers, and they may receive additional goods beyond their marker, we have $v_i(A_i) \geq \frac{v_i(G)}{n}$.</p>
      </div>
    </div>

    <h3>Strategy-Proofness</h3>
    <p>Truth-telling when placing markers is a dominant strategy.</p>
    <div class="proof-sketch">
      <div class="proof-sketch-header" onclick="toggleProof('strategy-proof')">
        <span><strong>Intuition:</strong> Misreporting preferences cannot improve outcomes</span>
        <span class="proof-toggle">▼</span>
      </div>
      <div id="strategy-proof" class="proof-content">
        <p>Players cannot benefit from placing markers dishonestly:</p>
        <ul>
          <li><strong>Over-claiming:</strong> Placing markers to claim segments worth less than $\frac{1}{n}$ risks receiving an inadequate allocation</li>
          <li><strong>Under-claiming:</strong> Being overly conservative may result in receiving less desirable segments</li>
          <li><strong>Optimal strategy:</strong> Place markers to create segments of exactly equal value $\frac{v_i(G)}{n}$</li>
        </ul>
      </div>
    </div>

    <h3>Remainder Efficiency</h3>
    <p>The algorithm may leave surplus goods that are distributed to the remaining players, improving overall efficiency.</p>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/algorithms/knaster-sealed-bids/' | relative_url }}" class="nav-button secondary">← Knaster's Sealed Bids</a>
    <a href="{{ '/' | relative_url }}" class="nav-button primary">To Algorithms →</a>
  </footer>

</div>


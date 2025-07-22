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
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Knaster's sealed bid procedure enables fair division of indivisible goods through a truthful auction mechanism combined with monetary transfers to ensure proportional outcomes.</p>
  </section>

  <!-- Algorithm Steps -->
  <section class="content-block">
    <div class="procedure-steps">
      <h3>Procedure</h3>
      <div class="step-list">

        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <strong>Sealed Bidding Round:</strong> Each player $i$ submits sealed bids $b_i^j$ for each item $j$, representing their valuation.
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <strong>Allocation Phase:</strong> Each item is awarded to the highest bidder. Player $i$ receives items $S_i = \{j : b_i^j = \max_k b_k^j\}$.
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <strong>Payment Calculation:</strong> Each player pays their winning bids: $payment_i = \sum_{j \in S_i} b_i^j$.
          </div>
        </div>

        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <strong>Redistribution:</strong> Total payments are divided equally: each player receives $\frac{\sum_i payment_i}{n}$ back.
          </div>
        </div>

      </div>
    </div>
  </section>

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

    <h3>Truthfulness (Strategy-Proof)</h3>
    <div class="proof-sketch">
      <p><strong>Intuition:</strong> Bidding true valuations is a dominant strategy because overbidding risks overpaying, while underbidding risks losing valuable items.</p>
    </div>

  </section>

</div>
﻿---
layout: default
title: Divide-and-Choose
permalink: /algorithms/divide-and-choose/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Divide-and-Choose</h1>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">2 Players</span>
        <span class="meta-badge type-badge">Discrete</span>
        <span class="meta-badge complexity-badge">2 RW Queries</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>The divide-and-choose algorithm is the most fundamental fair division procedure. The algorithm exploits the <strong>zero-sum nature</strong> of the division problem.</p>
    <p>Let $S$ be the total resource and $v_i(S) = 100$ for each player $i$. For any partition $\{A, B\}$ where $A \cup B = S$ and $A \cap B = \emptyset$:</p>
  
    $$v_i(A) + v_i(B) = v_i(S) = 100$$
  
    <p>Player 1 uses this constraint by creating pieces such that $v_1(A) \approx v_1(B) \approx 50$, guaranteeing they cannot receive less than 50% regardless of Player 2's choice. Player 2 then optimizes: $v_2(\text{chosen piece}) = \max(v_2(A), v_2(B)) \geq 50$.</p>
    <a href="https://en.wikipedia.org/wiki/Divide_and_choose" target="_blank" class="algorithm-link">Read more →</a>
  </section>

  <!-- Flowchart -->
  <section class="content-block">
    <h2>Algorithm Flowchart</h2>
    <div class="iframe-container">
      <iframe 
        src="{{ '/assets/flowcharts/divide-and-choose-procedure.html' | relative_url }}" 
        width="100%" 
        height="680" 
        frameborder="0"
        style="border: 1px solid #e2e8f0; border-radius: 8px;">
        <p>Your browser does not support iframes. <a href="{{ '/assets/flowcharts/divide-and-choose-procedure.html' | relative_url }}">View the flowchart directly</a>.</p>
      </iframe>
    </div>
  </section>

  <!-- Fairness Properties -->

  <section class="content-block">
    <h2>Fairness Properties</h2>
    <p>The Divide-and-Choose algorithm satisfies three fundamental fairness properties:</p>

    <h3>Proportionality</h3>
    <p>Both players receive at least 50% of their subjective valuation of the resource.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> $\forall i \in \{1,2\}, v_i(\text{piece}_i) \geq 50$</p>
    
      <p><strong>Proof:</strong> Player 1 chooses cut position to maximize $\min(v_1(\text{left}), v_1(\text{right}))$.</p>

      <p>Since $v_1(\text{left}) + v_1(\text{right}) = 100$, we have 
      $$\min(v_1(\text{left}), v_1(\text{right})) \leq 50 \leq \max(v_1(\text{left}), v_1(\text{right}))$$</p> 
      <p>Player 1 can achieve $\min(v_1(\text{left}), v_1(\text{right})) \geq 50$ by positioning the cut appropriately.</p> 

      <p>Player 2 chooses their preferred piece, so $v_2(\text{piece}_2) = \max(v_2(\text{left}), v_2(\text{right})) \geq 50$.</p>
    </div>
    <h3>Envy-Freeness</h3>
    <p>Neither player prefers the other's allocation to their own.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> $\forall i,j \in \{1,2\}, v_i(\text{piece}_i) \geq v_i(\text{piece}_j)$</p>
    
      <p><strong>Proof:</strong> Player 1 made the cut such that $v_1(\text{left}) = v_1(\text{right})$ (or as close as possible), so Player 1 cannot prefer the other piece. Player 2 chose their preferred piece by definition. Thus:</p> 
      <p>$$v_2(\text{piece}_2) = \max(v_2(\text{left}), v_2(\text{right})) \geq v_2(\text{piece}_1)$$</p>
    </div>
    <h3>Strategy-Proofness</h3>
    <p>Truth-telling is optimal for both players.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> Truth-telling is a dominant strategy for both players.</p>
    
      <p><strong>Proof by contradiction:</strong></p>
    
      <p><em>Player 1:</em> Suppose Player 1's true valuations are $v_1$ but they report $v_1'$ and cut accordingly. This may not optimize $\min(v_1(\text{left}), v_1(\text{right}))$ under their true valuations, so misreporting cannot improve their outcome.</p>
    
      <p><em>Player 2:</em> Given two pieces, choosing the piece with lower value according to their true valuations $v_2$ gives a worse outcome than choosing the piece with higher value. Therefore, misrepresenting preferences cannot improve Player 2's outcome.</p>
    </div>

    <a href="/theory/fairness-properties/" target="_blank" class="algorithm-link">Learn more about fairness properties →</a>
  </section>

  <!-- Complexity Analysis -->
  <section class="content-block">
    <h2>Computational Complexity</h2>
    <p>Under the Robertson-Webb query model, Divide-and-Choose achieves optimal query complexity for two-player proportional division:</p>
    <ol>
      <li><strong>Cut Query:</strong> Player 1 makes a cut creating two pieces of equal value</li>
      <li><strong>Eval Query:</strong> Player 2 evaluates and selects their preferred piece</li>
    </ol>
    <p>This 2-query bound is provably optimal - any algorithm guaranteeing proportional division for 2 players must use at least 2 queries.</p>
    <a href="/analysis/" target="_blank" class="algorithm-link">Compare with other procedures →</a>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/' | relative_url }}" class="nav-button secondary">← Back to Algorithms</a>
    <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}" class="nav-button primary">Next: Austin's Moving-Knife →</a>
  </footer>
</div>
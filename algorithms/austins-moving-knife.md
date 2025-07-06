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
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">2 Players</span>
        <span class="meta-badge type-badge">Continuous</span>
        <span class="meta-badge complexity-badge">$\infty$ RW</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Austin's procedure introduces a moving-knife mechanism to making a fair cake division. The procedure builds on Divide-and-Choose by guaranteeing exact divisions for two parties, rather than merely a proportional one.</p>
    <p>Austin's procedure relies on the <strong>intermediate value theorem</strong> to guarantee exact divisions. Let $f(x)$ represent Player 1's valuation of the cake from position 0 to position $x$, where the cake spans $[0,1]$. Since Player 1's valuation function is continuous and $f(0) = 0$ while $f(1) = 100$, there exists some position $x^* \in (0,1)$ such that $f(x^*) = 50$.</p>
    <p>During the knife-moving phase, the player in control maintains two knives at positions $L(t)$ and $R(t)$ such that their valuation of the piece between the knives remains constant:</p>
    $$v_1([L(t), R(t)]) = k \text{ for all } t$$
    <p>where $k$ is the value that player assigned to the initial piece when they first called "stop". The constraint that $L(T) = R(0)$ when $R(T) = 1$ ensures the entire cake is partitioned into exactly three pieces with valuations that sum to 100.</p>
    <a href="https://en.wikipedia.org/wiki/Austin_moving-knife_procedures" target="_blank" class="algorithm-link">Read more →</a>
  </section>

  <!-- Flowchart -->
  <section class="content-block">
    <h2>Algorithm Flowchart</h2>
    <div class="iframe-container">
      <iframe 
        src="{{ '/assets/flowcharts/austin-moving-knife.html' | relative_url }}" 
        width="100%" 
        height="1160" 
        frameborder="0"
        style="border: 1px solid #e2e8f0; border-radius: 8px;">
        <p>Your browser does not support iframes. <a href="{{ '/assets/flowcharts/austin-moving-knife.html' | relative_url }}">View the flowchart directly</a>.</p>
      </iframe>
    </div>
  </section>

  <!-- Fairness Properties -->

  <section class="content-block">
    <h2>Fairness Properties</h2>
    <p>Austin's procedure satisfies four fundamental fairness properties:</p>

    <h3>Equitable</h3>
    <p>Both players receive exactly 50% of their subjective valuation of the resource.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> $\forall i \in \{1,2\}, v_i(\text{piece}_i) = 50$</p>

      <p><strong>Proof:</strong> When the first player calls "stop" in the initial phase, they believe the left piece has value exactly 50. During the two-knife phase, Player 1 maintains the middle piece at constant value $k$, while the constraint $L(T) = R(0)$ ensures the three pieces have values $(50-k, k, 50)$ according to Player 1.</p>

      <p>Player 2 calls "stop" when they believe the division creates pieces worth exactly 50 each according to their valuation. Since pieces are randomly assigned, both players receive exactly 50% in expectation according to their own valuations.</p>
    </div>

    <h3>Exact</h3>
    <p>The division achieves perfect equality rather than just proportionality.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> The procedure produces pieces such that each player values their piece at exactly $\frac{100}{2} = 50$</p>
      <p><strong>Proof:</strong> Unlike divide-and-choose which only guarantees $v_i(\text{piece}_i) \geq 50$, Austin's procedure allows each player to specify exactly when they believe a 50-50 division has been achieved. The intermediate value theorem guarantees such points exist, and the procedure terminates only when a player declares the division to be exact according to their valuation.</p>
    </div>

    <h3>Envy-free</h3>
    <p>Neither player prefers the other's allocation to their own.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> $\forall i,j \in \{1,2\}, v_i(\text{piece}_i) \geq v_i(\text{piece}_j)$</p>
      <p><strong>Proof:</strong> When Player 2 calls "stop" in the final phase, they believe both pieces have equal value according to their valuation: $v_2(\text{piece}_A) = v_2(\text{piece}_B) = 50$. Therefore, Player 2 cannot envy either piece.</p>

      <p>For Player 1, the two-knife constraint ensures they value both final pieces equally at the moment of division. Since $v_1(\text{piece}_A) = v_1(\text{piece}_B)$, Player 1 also cannot experience envy regardless of the random assignment.</p>
    </div>

    <h3>Strategy-proof</h3>
    <p>Truth-telling is optimal for both players throughout the procedure.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> Honest revelation of preferences is a dominant strategy for both players.</p>

      <p><strong>Proof by contradiction:</strong></p>

      <p><em>Phase 1:</em> If a player calls "stop" before they truly believe the left piece is worth 50, they risk receiving less than 50% if chosen to control the knives. If they wait too long, the other player will call "stop" first and gain control.</p>

      <p><em>Phase 2 (Player 1):</em> Misrepresenting valuations while moving the knives cannot improve the outcome, as Player 1 must maintain truthful valuations to satisfy the geometric constraints of the procedure.</p>

      <p><em>Phase 2 (Player 2):</em> Calling "stop" before truly believing in a 50-50 division risks receiving a piece worth less than 50% according to their true valuation. Waiting longer allows Player 1 to potentially create a division more favorable to Player 1.</p>
    </div>

    <a href="/theory/fairness-properties/" target="_blank" class="algorithm-link">Learn more about fairness properties →</a>
  </section>

  <!-- Complexity Analysis -->
  <section class="content-block">
    <h2>Computational Complexity</h2>
    <a href="/analysis/" target="_blank" class="algorithm-link">Compare with other procedures →</a>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/algorithms/divide-and-choose/' | relative_url }}" class="nav-button secondary">← Back to Divide-and-Choose</a>
    <a href="{{ '/algorithms/steinhaus-lone-divider/' | relative_url }}" class="nav-button primary">Next: Steinhaus' Lone-Divider →</a>
  </footer>
</div>
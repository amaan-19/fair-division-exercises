---
layout: default
title: Selfridge-Conway Procedure
permalink: /algorithms/selfridge-conway/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Selfridge-Conway Procedure</h1>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">3 Players</span>
        <span class="meta-badge type-badge">Discrete</span>
        <span class="meta-badge complexity-badge">7-17 RW Queries</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Though neither Selfridge or Conway every actually published this fundamental envy-free procedure for three players, they both discovered it independently, laying the way for the publication of more complex envy-free procedures.</p>
    <a href="https://en.wikipedia.org/wiki/Selfridge%E2%80%93Conway_procedure" target="_blank" class="algorithm-link">Read more →</a>
  </section>

  <!-- Flowchart -->
  <section class="content-block">
    <h2>Algorithm Flowchart</h2>
    <div id="enhanced-selfridge-conway" data-enhanced-flowchart="selfridge-conway"></div>

    <div class="animation-controls">
      <button class="animation-btn primary" 
        onclick="animateAlgorithm('enhanced-selfridge-conway', 1200)">
        ▶️ Animate Steps
      </button>
      <button class="animation-btn secondary" 
        onclick="resetAlgorithm('enhanced-selfridge-conway')">
        🔄 Reset
      </button>
    </div>
  </section>

  <!-- Fairness Properties -->
  <section class="content-block">
    <h2>Fairness Properties</h2>
    <p>The Selfridge-Conway procedure satisfies one fundamental fairness property:</p>

    <h3>Envy-freeness</h3>
    <p>No player prefers any other player's final allocation to their own.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> $\forall i,j \in \{1,2,3\}, v_i(\text{allocation}_i) \geq v_i(\text{allocation}_j)$</p>
    
      <p><strong>Proof Structure:</strong> We prove envy-freeness by analyzing each phase separately and showing that no envy is created in either phase.</p>

      <p><strong>Phase 1 Analysis (Main Pieces):</strong></p>
      <ul>
        <li><strong>Player 1 (Divider):</strong> Cannot envy others because they created three pieces they value equally. Regardless of which piece they receive, it equals 1/3 of their total valuation.</li>
        <li><strong>Player 2 (Trimmer):</strong> Cannot envy others because after trimming, they ensured at least two pieces were tied for largest in their view. Player 2 either chooses first (if Player 3 took the trimmed piece) or gets one of their top two pieces.</li>
        <li><strong>Player 3 (First Chooser):</strong> Cannot envy others because they chose first from all available pieces, selecting their most preferred option.</li>
      </ul>

      <p><strong>Key Constraint:</strong> If Player 3 doesn't choose the trimmed piece, Player 2 must take it. This ensures Player 2 still gets a piece they consider tied for best.</p>

      <p><strong>Phase 2 Analysis (Trimmings):</strong> Let $T$ be the player who received the trimmed piece and $NT$ be the other non-divider.</p>
      <ul>
        <li><strong>Player $T$:</strong> Chooses first from the trimming pieces, so they get their preferred share of the trimmings.</li>
        <li><strong>Player 1 (Divider):</strong> Has "irrevocable advantage" over player $T$. Since the trimmed piece plus trimmings equals an original piece that Player 1 valued at 1/3, Player 1 will never envy player $T$ regardless of how the trimmings are divided.</li>
        <li><strong>Player $NT$:</strong> Cut the trimmings into three equal pieces from their perspective, so they cannot envy the piece they receive.</li>
      </ul>

      <p><strong>Domination Principle:</strong> The crucial insight is that Player 1 "dominates" player $T$ with respect to the trimmings. Player 1 would not envy player $T$ even if player $T$ received all the trimmings, because trimmed piece + trimmings = original piece ≤ 1/3 in Player 1's valuation.</p>

      <p><strong>Conclusion:</strong> Since no player envies any other in either phase, and the phases exhaust all the cake, the final allocation is envy-free.</p>
    </div>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/algorithms/steinhaus-lone-divider/' | relative_url }}" class="nav-button secondary">← Back to Steinhaus</a>
    <a href="{{ '/algorithms/banach-knaster-last-diminisher/' | relative_url }}" class="nav-button primary">Next: Stromquist →</a>
  </footer>

</div>
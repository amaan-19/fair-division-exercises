---
layout: default
title: Banach-Knaster's Last-Diminisher
permalink: /algorithms/banach-knaster-last-diminisher/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Banach-Knaster Last-Diminisher</h1>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">N Players</span>
        <span class="meta-badge type-badge">Discrete</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>The Banach-Knaster procedure guarantees each of n participants receives at least 1/n of a divisible good according to their own valuation, operating through rounds where players can trim a proposed piece to their desired share, with the last person to make a trim receiving that piece.</p>
    <a href="https://en.wikipedia.org/wiki/Last_diminisher" target="_blank" class="algorithm-link">Read more →</a>
    <div class="procedure-steps">
      <h3>How It Works</h3>
      <div class="step-list">
        <h4>Round 1:</h4>
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <strong>Player 1</strong> makes a cut such that they value the piece as exactly $\frac{1}{N}$ of the cake.
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            The piece is then passed sequentially to <strong>Players 2, 3, ..., N</strong>. Each player, depending on their personal valuation of the piece, chooses to either (a) trim the piece such that they value it at exactly $\frac{1}{N}$ of the cake, or (b) pass it along unchanged.
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            Once the piece has been evaluated by each player, whoever made the <strong>final</strong> trim recieves the piece from that round and all trimmings are returned to the cake.
          </div>
        </div>

        <h4>Rounds 2, 3, ..., N:</h4>
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            The <strong>first remaining player</strong> makes a cut such that they value the piece as exactly $\frac{1}{N-1}$ of the cake.
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            The piece is then passed sequentially to all <strong>remaining players</strong>. Each player, depending on their personal valuation of the piece, chooses to either (a) trim the piece such that they value it at exactly $\frac{1}{N-1}$ of the cake, or (b) pass it along unchanged.
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            Once the piece has been evaluated by each player, whoever made the <strong>final</strong> trim recieves the piece from that round and all trimmings are returned to the cake.
          </div>
        </div>

        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            This procedure is then repeated until only one player remains.
          </div>
        </div>

      </div>
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
    <a href="{{ '/algorithms/stromquist/' | relative_url }}" class="nav-button secondary">← Back to Stromquist</a>
    <a href="{{ '/algorithms/brams-taylor/' | relative_url }}" class="nav-button primary"> Next: Brams-Taylor →</a>
  </footer>
</div>
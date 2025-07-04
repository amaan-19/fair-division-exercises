---
layout: default
title: Steinhaus' Lone-Divider
permalink: /algorithms/steinhaus-lone-divider/
---

<div class="algorithm-page">

  <!-- Algorithm Header Card -->
  <div class="algorithm-header-card">
    <div class="algorithm-header-content">
      <h1 class="algorithm-title">Steinhaus' Lone-Divider</h1>
      <div class="algorithm-meta">
        <span class="meta-badge players-badge">3 Players</span>
        <span class="meta-badge type-badge">Discrete</span>
      </div>
    </div>
  </div>

  <!-- Overview -->
  <section class="content-block">
    <h2>Overview</h2>
    <p>Rather than a continuous moving knife, Steinhaus introduced the "lone-divider" method to enable fair cake division for 3 parties. The procedure has weak fairness guarantees but provides a solid foundation for more complex algorithms to build off.</p>
    <a href="https://en.wikipedia.org/wiki/Lone_divider" target="_blank" class="algorithm-link">Read more →</a>
    
    <div class="procedure-steps">
      <h3>How It Works</h3>
      <div class="step-list">

        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            A <strong>divider</strong> is randomly chosen (suppose it's Player 1) and divdes the cake into 3 pieces, each of which they value equally.
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            The other two players <strong>non-dividers</strong> determine which pieces are worth at least their proportional share. There now exist two cases (a) either one of the <strong>non-dividers</strong> believes there are at least two proportional pieces and (b) both <strong>non-dividers</strong> believe there is at most one proportional piece.
          </div>
        </div>

        <div class="step">
          <div class="step-number">3a</div>
          <div class="step-content">
            In the first case, suppose Player 2 believes there are at least two proportional pieces. Player 3 then gets to pick any of the three pieces, followed by Player 2, and then Player 1.
          </div>
        </div>

        <div class="step">
          <div class="step-number">3b</div>
          <div class="step-content">
            In the second case, a piece the <strong>non-dividers</strong> believe is not proportional is given to the <strong>divider</strong>. The rest of the cake is reassembled and the <strong>non-dividers</strong> then perform the standard Divide-and-Choose procedure on the remaining cake.
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Fairness Properties -->

  <section class="content-block">
    <h2>Fairness Properties</h2>
    <p>Steinhaus' procedure guarantees one fundamental fairness property:</p>

    <h3>Proportionality</h3>
    <p>All three players receive at least 1/3 of their subjective valuation of the resource.</p>
    <div class="proof-sketch">
      <p><strong>Formal Statement:</strong> $\forall i \in \{1,2,3\}, v_i(\text{piece}_i) \geq 1/3$</p>
    
      <p><strong>Proof: </strong>Suppose the Player 1 is chosen to be the lone-divider. They then choose their cut positions such that $v_1(\text{piece}_1) = v_1(\text{piece}_2) = v_1(\text{piece}_3)$</p> 

      <p>Since $v_1(\text{piece}_1) + v_1(\text{piece}_2) + v_1(\text{piece}_3) = v(\text{cake})$, we know $v_1(\text{piece}_i) = 1/3$</p>
      
      <p>Player 1 will receive one of these pieces by the nature of the algorithm so they are guaranteed to receive a proportional allocation, regardless of which case the division enters.</p>

      <p>For the non-dividers we can analyze the case behavior:</p>

      <p><strong>Case 1: </strong> At least one non-divider believes there are $\geq 2$ proportional pieces.</p>

      <p>Without loss of generality, assume Player 2 believes at least two pieces are worth $\geq 1/3$. Player 3 is then guaranteed, by order of choosing, a proprtional piece by their own valuation.</p>

      <p>Since Player 2 believed there were $\geq 2$ proportional pieces they are guaranteed to see at least 1 proportional piece after Player 3 chooses one. Thus, they are also guaranteed a proprotional piece.</p>

      <p><strong>Case 2: </strong>Both non-dividers believe there is $\leq 1$ proportional piece.</p>

      <p>In this case we assume that both Player 2 and 3 believe there is at most 1 proportional piece. Thus, one of the "non-proportional" pieces is assigned to Player 1 while the rest of the cake is reassembled for Divide-and-Choose. This reconstructed cake, in the eyes of the original non-dividers, must be > 2/3 (since the removed piece was valued at < 1/3 in their view). Divide-and-Choose guarantees both players will recieve at least 1/2 of the reconstructed cake and 1/2 of 2/3 is 1/3.</p>

      <p>Thus, both of the original non-dividers are guaranteed to recieve at least 1/3 of their valuation of the cake. Therefore, this algorithm guarantees proportionality.</p>
    </div>
  </section>

  <!-- Limitations -->
  <section class="content-block">
    <h2>Limitations</h2>
    <ul>
      <li>Limited to three players</li>
      <li>Provides relatively weak fairness guarantees (only proportionality)</li>
    </ul>
  </section>

  <!-- Navigation -->
  <footer class="algorithm-navigation">
    <a href="{{ '/algorithms/austins-moving-knife/' | relative_url }}" class="nav-button secondary">← Back to Austin's Procedure</a>
    <a href="{{ '/algorithms/selfridge-conway/' | relative_url }}" class="nav-button primary">Next: Selfridge-Conway Procedure →</a>
  </footer>

</div>
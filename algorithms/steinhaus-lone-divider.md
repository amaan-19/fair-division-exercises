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
        <span class="meta-badge complexity-badge">Discrete</span>
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
            In the second case, the piece the <strong>non-dividers</strong> believe is not proportional is given to the <strong>divider</strong>. The rest of the cake is reassembled and the <strong>non-dividers</strong> then perform the standard Divide-and-Choose procedure on the remaining cake.
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Interactive Demo -->
  <section class="content-block">
    <h2>Interactive Demo</h2>
    <p>Let's explore how this algorithm functions!</p>
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin: 20px 0; min-height: 800px;">
      <iframe 
        src="{{ '/assets/demos/steinhaus-demo.html' | relative_url }}" 
        width="100%" 
        height="1300" 
        frameborder="0"
        style="display: block; border: none;">
        <p>Your browser does not support iframes. <a href="{{ '/assets/demos/steinhaus-demo.html' | relative_url }}">View the demo directly</a>.</p>
      </iframe>
    </div>
  </section>

</div>
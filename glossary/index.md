---
layout: default
title: Glossary
permalink: /glossary/
---

<div class="page-header">
  <h1 class="page-title">Glossary</h1>
  <p class="page-description">Key terms and definitions in fair division theory</p>
</div>

<div class="terms-grid" id="glossary-grid">

  <div class="term-card">
    <h3 class="term-name">Cake-Cutting</h3>
    <p class="term-definition">
      A mathematical metaphor for fair division problems involving the allocation of a heterogeneous, divisible resource among multiple parties. The "cake" represents any continuous resource where different parts may have different values to different people.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Envy-Free</h3>
    <p class="term-definition">
      A fairness property where no player prefers another player's allocation to their own. Mathematically: $v_i(\text{piece}_i) \geq v_i(\text{piece}_j)$ for all players $i$ and $j$.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Moving Knife</h3>
    <p class="term-definition">
      A continuous procedure in fair division where a knife moves across a cake and players can call for it to stop when certain conditions are met. This enables more precise divisions compared to discrete cutting procedures.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Proportional</h3>
    <p class="term-definition">
      A fairness property guaranteeing that each player receives at least their proportional share of the total value. For $n$ players, each must receive at least $\frac{1}{n}$ of their subjective valuation.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Strategy-Proof</h3>
    <p class="term-definition">
      A fairness property where truth-telling is a dominant strategy for all players. No player can benefit by misrepresenting their true preferences or valuations.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Valuation Function</h3>
    <p class="term-definition">
      A mathematical function $v_i(S)$ that represents how much player $i$ values a given piece $S$ of the resource. These functions are typically normalized so the entire resource has value 100 or 1.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Equitable</h3>
    <p class="term-definition">
      A fairness property where each player values their share equally. Mathematically: $v_i(x_i)=v_j(x_j)$
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Discrete</h3>
    <p class="term-definition">
      A cake-cutting algorithm is discrete when it operates through a finite sequence of predetermined steps, where cuts are made at specific moments based on fixed rules or player decisions. In discrete algorithms, the cutting process is not real-time or continuous—instead, players make cuts, evaluate pieces, and select allocations in distinct phases.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Continuous</h3>
    <p class="term-definition">
      
A cake-cutting algorithm is continuous when it involves moving knives or dynamic cutting processes that can theoretically be stopped at any infinitesimal moment. In continuous algorithms, cuts evolve smoothly over time, and players can call "stop" at any point when they perceive the current division as fair according to their preferences.
    </p>
  </div>

</div>

<script src="glossarySort.js"></script>
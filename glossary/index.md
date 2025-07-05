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

  <div class="term-card">
    <h3 class="term-name">Robertson-Webb Query Model</h3>
    <p class="term-definition">
      A computational framework for analyzing fair division algorithms that measures complexity in terms of queries to players rather than traditional computational operations. Introduced by Robertson and Webb (1998).
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Cut Query</h3>
    <p class="term-definition">
      A type of query in the Robertson-Webb model asking a player to cut the resource at a position such that one piece has a specified value according to their preferences.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Eval Query</h3>
    <p class="term-definition">
      A type of query in the Robertson-Webb model asking a player to evaluate the value of a given piece according to their preferences.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Query Complexity</h3>
    <p class="term-definition">
      The number of queries (cut and eval) required by an algorithm to achieve a particular fairness criterion, measured in the Robertson-Webb model.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Lone Divider Method</h3>
    <p class="term-definition">
      The general approach where one player divides and others choose
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Trimming</h3>
    <p class="term-definition">
      The process of reducing piece size in algorithms like Selfridge-Conway
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Reconstruction</h3>
    <p class="term-definition">
      When initial allocations fail and pieces must be recombined
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Case A/Case B</h3>
    <p class="term-definition">
      The two scenarios in Steinhaus' algorithm based on acceptable pieces
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Exact Division</h3>
    <p class="term-definition">
      Perfect mathematical equality (not just inequalities)
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Pareto Efficiency</h3>
    <p class="term-definition">
      No allocation improvements without harming someone
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Atomlessness</h3>
    <p class="term-definition">
      Property that any valuable piece can be subdivided
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Additivity</h3>
    <p class="term-definition">
      Property that combining pieces adds their values
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Intermediate Value Theorem</h3>
    <p class="term-definition">
      Key topological foundation for existence proofs
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Measure Theory</h3>
    <p class="term-definition">
      Mathematical framework underlying valuation functions
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Brouwer Fixed Point Theorem</h3>
    <p class="term-definition">
      Used in existence proofs
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Sperner's Lemma</h3>
    <p class="term-definition">
      Combinatorial tool for fair division proofs
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Lower Bound</h3>
    <p class="term-definition">
      Minimum queries required for a fairness property
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Approximation Algorithm</h3>
    <p class="term-definition">
      Procedure that achieves near-optimal fairness
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Continuous vs Discrete Trade-off</h3>
    <p class="term-definition">
      Precision vs implementability
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Impossibility Result</h3>
    <p class="term-definition">
      Combinations of properties that cannot be achieved
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Preferential Elicitation</h3>
    <p class="term-definition">
      Methods for learning player valuations
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Mechanism Design</h3>
    <p class="term-definition">
      Game-theoretic approach to algorithm design
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Incentive Compatibility</h3>
    <p class="term-definition">
      Broader term encompassing strategy-proofness
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Dominant Strategy</h3>
    <p class="term-definition">
      Best choice regardless of others' actions
    </p>
  </div>

</div>

<footer class="algorithm-navigation">
  <a href="{{ '/analysis/' | relative_url }}" class="nav-button secondary">← Back to Analysis</a>
  <a href="{{ '/references/' | relative_url }}" class="nav-button primary">References →</a>
</footer>

<script src="glossarySort.js"></script>
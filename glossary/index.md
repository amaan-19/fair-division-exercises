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
      Continuous algorithmic paradigm where cutting implements move dynamically across the resource, with players able to call "stop" when specific fairness conditions are satisfied. Moving knife procedures achieve exact fairness properties through continuous motion but require infinite precision and may have infinite query complexity in the Robertson-Webb model.
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
      Mechanism design property ensuring that truthful preference revelation is a dominant strategy equilibrium for all players. Formally, for each player $i$, reporting true valuation $v_i$ maximizes their utility regardless of other players' strategies: $u_i(f(v_i, s_{-i}), v_i) \geq u_i(f(s'i, s{-i}), v_i)$ for all alternative reports $s'i$ and others' strategies $s{-i}$.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Valuation Function</h3>
    <p class="term-definition">
      Mathematical mapping $v_i: 2^X \to \mathbb{R}_+$ representing player $i$'s subjective preferences over all measurable subsets of the resource space $X$. Valuation functions typically satisfy normalization ($v_i(X) = 1$), additivity for disjoint sets, and continuity with respect to the underlying measure. These functions encode complete preference information and serve as the interface between subjective human preferences and objective algorithmic procedures.
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
    <h3 class="term-name">Robertson-Webb (RW) Query Model</h3>
    <p class="term-definition">
      A computational complexity framework introduced by Robertson and Webb (1998) that measures algorithmic efficiency in terms of information queries to players rather than traditional computational operations. For algorithm $A$ and fairness property $P$, the query complexity $Q(A,P,n)$ represents the maximum number of queries required across all possible valuation profiles for $n$ players.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Cut Query</h3>
    <p class="term-definition">
      A query $\text{CUT}_i(S, \alpha)$ asking player $i$ to identify a cut position that divides subset $S$ such that one resulting piece has value exactly $\alpha$ according to their valuation function $v_i$. 
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Eval Query</h3>
    <p class="term-definition">
      A query $\text{EVAL}_i(S)$ asking player $i$ to return their valuation $v_i(S)$ for a specified piece $S$. Unlike cut queries, eval queries are purely informational and don't require players to identify specific cut positions.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Query Complexity</h3>
    <p class="term-definition">
      The query complexity $Q(A)$ of algorithm $A$ is the maximum number of Robertson-Webb queries (cut + eval) required across all possible valuation profiles.
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
      An operation where the trimmer reduces the size of the largest piece to eliminate any clear largest piece preference.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Reconstruction</h3>
    <p class="term-definition">
      When initial allocations fail and pieces must be recombined
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Exact Division</h3>
    <p class="term-definition">
      A fairness concept (also called consensus division) requiring that all players assign the same value to each player's allocated piece: $V_i(X_j) = V_k(X_j)$ for all players $i, k$ and all pieces $X_j$. This means there is complete consensus about the value of every allocation, eliminating not only envy but also any disagreement about the relative worth of different pieces.
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
      Property requiring that every piece with positive value can be subdivided into smaller pieces each with positive value. Formally, for any measurable set $A$ with $v_i(A) > 0$, there exists a partition $A = B \cup C$ where $B \cap C = \emptyset$ and $v_i(B), v_i(C) > 0$. Atomlessness ensures infinite divisibility and is essential for continuous cutting procedures that may require arbitrarily fine subdivisions.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Additivity</h3>
    <p class="term-definition">
      A fundamental property requiring that for any two disjoint measurable sets $A, B \subseteq X$, the valuation function satisfies $v_i(A \cup B) = v_i(A) + v_i(B)$. Combined with normalization and continuity, additivity enables the application of intermediate value theorem for exact cut finding.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Intermediate Value Theorem</h3>
    <p class="term-definition">
      Fundamental topological result ensuring that continuous functions on connected domains achieve all intermediate values. In fair division, IVT guarantees that for any target proportion $\alpha \in [0,1]$, there exists a cut position yielding exactly that value share. This theorem provides the mathematical foundation for most cut-finding procedures in cake-cutting algorithms.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Measure Theory</h3>
    <p class="term-definition">
      Mathematical framework providing rigorous foundations for valuation functions through measure-theoretic structure. In fair division, valuation functions $v_i: 2^X \to \mathbb{R}_+$ are typically assumed to be non-atomic probability measures on the resource space $X$. This framework enables precise formulation of divisibility conditions, supports existence proofs through topological arguments, and provides tools for analyzing algorithmic complexity.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Brouwer Fixed Point Theorem</h3>
    <p class="term-definition">
      Topological theorem stating that every continuous function from a compact convex set to itself has at least one fixed point. In fair division, BFPT enables existence proofs by constructing continuous maps on spaces of allocations where fixed points correspond to fair divisions. The theorem guarantees existence but provides no constructive algorithm for finding fair allocations.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Sperner's Lemma</h3>
    <p class="term-definition">
      Combinatorial result about labelings of triangulated simplices, serving as a discrete analog of Brouwer's fixed point theorem. In fair division, Sperner's lemma enables constructive existence proofs by establishing correspondences between fair allocations and proper colorings of geometric subdivisions. Unlike BFPT, Sperner-based proofs can sometimes be made algorithmic through explicit construction procedures.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Lower Bound</h3>
    <p class="term-definition">
      Theoretical minimum number of queries required by any algorithm achieving a specific fairness property. Lower bounds provide fundamental limits on algorithmic efficiency and distinguish between problems that admit efficient solutions and those that are inherently complex. Establishing tight lower bounds remains one of the most challenging aspects of fair division complexity analysis.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Approximation Algorithm</h3>
    <p class="term-definition">
      Algorithmic procedure that achieves fairness properties within specified tolerance parameters, trading perfect fairness for improved efficiency. For parameter $\epsilon > 0$, an $\epsilon$-approximation algorithm guarantees fairness conditions within additive or multiplicative $\epsilon$ error. Approximation enables polynomial-time solutions to problems where exact algorithms require exponential complexity.
    </p>
  </div>

  <div class="term-card">
    <h3 class="term-name">Impossibility Result</h3>
    <p class="term-definition">
      A theorem establishing that certain combinations of fairness properties cannot be simultaneously achieved by any algorithm, regardless of computational resources. Impossibility results define the fundamental boundaries of what fair division procedures can accomplish and guide algorithm design by identifying achievable property combinations.
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
    <h3 class="term-name">Dominant Strategy</h3>
    <p class="term-definition">
      Best choice regardless of others' actions
    </p>
  </div>

<div class="term-card">
  <h3 class="term-name">Finite Protocol</h3>
  <p class="term-definition">
    An algorithm that terminates in a finite number of steps with finite query complexity in the Robertson-Webb model. Finite protocols provide practical implementability by avoiding the infinite precision requirements of continuous procedures like moving knife algorithms. The distinction between finite and infinite protocols represents a fundamental trade-off between theoretical optimality and computational tractability.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Domination Principle</h3>
  <p class="term-definition">
    A key insight in envy-free algorithms where one player cannot envy another regarding specific pieces due to structural constraints in the allocation procedure. In Selfridge-Conway, Player 1 "dominates" the player who received the trimmed piece because Player 1 would not envy them even if they received all the trimmings, since trimmed piece + trimmings ≤ 1/3 in Player 1's valuation.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Irrevocable Advantage</h3>
  <p class="term-definition">
    An asymmetric relationship between players in fair division algorithms that ensures long-term fairness guarantees regardless of future allocation decisions. This concept appears in multi-phase algorithms where early decisions create structural advantages that prevent envy even when later phases involve uncertainty or player choice.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">ε-Envy-Free</h3>
  <p class="term-definition">
    A relaxed fairness concept allowing small preference violations: player $i$ is ε-envy-free if $v_i(\text{piece}_i) \geq v_i(\text{piece}_j) - ε$ for all players $j$. This approximation enables polynomial-time algorithms for problems where exact envy-freeness requires exponential complexity. The parameter ε represents the maximum tolerable envy across all players.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">ε-Proportional</h3>
  <p class="term-definition">
    An approximation of proportional fairness where each player receives at least $(1/n - ε)$ fraction of their total valuation. For $n$ players, exact proportionality requires $v_i(\text{piece}_i) \geq v_i(X)/n$, while ε-proportionality relaxes this to $v_i(\text{piece}_i) \geq v_i(X)/n - ε$. This approximation often enables logarithmic query complexity: $O(\log(1/ε))$.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Connected Pieces</h3>
  <p class="term-definition">
    A constraint requiring that each player's allocation consists of contiguous intervals rather than arbitrary measurable sets. Connected piece constraints significantly complicate algorithmic design but reflect practical preferences in many real-world applications. Many classical algorithms fail under connectivity requirements, necessitating specialized procedures with higher query complexity.
  </p>
</div>

<!-- Mathematical Foundations -->
<div class="term-card">
  <h3 class="term-name">Probability Measure</h3>
  <p class="term-definition">
    A mathematical formalization of valuation functions as normalized measures on the resource space. A probability measure $\mu$ on measurable space $(X, \mathcal{F})$ satisfies: (1) $\mu(X) = 1$ (normalization), (2) $\mu(A) \geq 0$ for all $A \in \mathcal{F}$ (non-negativity), and (3) countable additivity for disjoint sets. This framework provides rigorous foundations for cake-cutting theory.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Measurable Set</h3>
  <p class="term-definition">
    Subsets of the resource space that can be assigned well-defined values by valuation functions. In the standard cake-cutting model on $[0,1]$, measurable sets typically include all Borel sets, ensuring that reasonable geometric constructions (intervals, unions, intersections) have well-defined valuations. Measurability constraints prevent pathological cases that could break algorithmic procedures.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Continuity (Valuation)</h3>
  <p class="term-definition">
    Property ensuring that small changes in pieces yield small changes in valuations. Formally, valuation $v_i$ is continuous if for any sequence of measurable sets $\{A_n\}$ converging to set $A$, we have $\lim_{n \to \infty} v_i(A_n) = v_i(A)$. Continuity enables the application of intermediate value theorem for exact cut-finding and supports approximation algorithms with convergence guarantees.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Compactness</h3>
  <p class="term-definition">
    A topological property crucial for existence proofs in fair division theory. Compact sets have the property that every open cover has a finite subcover. In fair division, compactness of allocation spaces (often achieved through appropriate topologies on probability measures) enables applications of fixed-point theorems to guarantee existence of fair allocations.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Fixed Point</h3>
  <p class="term-definition">
    A mathematical concept where a function $f$ maps an element to itself: $f(x) = x$. In fair division theory, fixed points correspond to equilibrium allocations that cannot be improved according to specific fairness criteria. Fixed-point theorems (Brouwer, Kakutani) provide powerful existence guarantees but typically yield non-constructive proofs that don't directly produce algorithms.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Simplicial Complex</h3>
  <p class="term-definition">
    A combinatorial structure consisting of simplices (points, line segments, triangles, tetrahedra, etc.) assembled according to specific rules. Simplicial complexes appear in fair division through Sperner's lemma applications, where proper colorings of triangulated regions correspond to fair allocations. This geometric approach can bridge purely existential proofs and constructive algorithms.
  </p>
</div>

<!-- Advanced Theoretical Concepts -->
<div class="term-card">
  <h3 class="term-name">Query Lower Bound</h3>
  <p class="term-definition">
    The theoretical minimum number of Robertson-Webb queries required by any algorithm achieving a specific fairness property. Lower bounds establish fundamental limits on algorithmic efficiency and distinguish between tractable and intractable problems. Proving tight lower bounds remains one of the most challenging aspects of fair division complexity analysis, often requiring sophisticated adversarial arguments or information-theoretic techniques.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Adversarial Model</h3>
  <p class="term-definition">
    A worst-case analysis framework where an adversary chooses the most difficult input (valuation profile) for a given algorithm. In the Robertson-Webb model, adversarial analysis determines the maximum number of queries any algorithm might require across all possible valuation functions. This approach provides robust complexity bounds that hold regardless of input distribution or player behavior.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Constructive vs. Existential Proof</h3>
  <p class="term-definition">
    Fundamental distinction between proofs that provide explicit algorithms for finding fair allocations versus those that merely guarantee existence without algorithmic procedures. Constructive proofs yield implementable algorithms, while existential proofs (often using fixed-point theorems) establish theoretical foundations but may not lead to efficient computation. Bridging this gap represents a central challenge in algorithmic fair division.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Protocol Tree</h3>
  <p class="term-definition">
    A decision-theoretic representation of all possible executions of a fair division algorithm, where nodes represent decision points and branches represent possible outcomes based on query responses. Protocol trees enable formal analysis of algorithm complexity, strategy-proofness, and worst-case behavior. The size of the protocol tree often correlates with query complexity bounds.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Cake-Cutting Instance</h3>
  <p class="term-definition">
    A formal specification of a fair division problem consisting of: (1) resource space $X$ (typically $[0,1]$), (2) player set $N = \{1,2,\ldots,n\}$, (3) valuation function profile $(v_1, v_2, \ldots, v_n)$ where each $v_i: 2^X \to \mathbb{R}_+$, and (4) fairness requirements (proportional, envy-free, etc.). This mathematical formalization enables precise algorithmic analysis and complexity comparisons.
  </p>
</div>

<!-- Additional Advanced Terms -->
<div class="term-card">
  <h3 class="term-name">Non-Atomic Measure</h3>
  <p class="term-definition">
    A measure where every singleton set has measure zero, ensuring that no individual point has positive value. In cake-cutting, non-atomic measures capture the intuition that the resource is perfectly divisible - no single location is inherently valuable. This property is essential for algorithms that require arbitrary subdivision capability and supports continuous cutting procedures.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Revelation Principle</h3>
  <p class="term-definition">
    A fundamental result in mechanism design stating that for any mechanism, there exists an equivalent direct revelation mechanism that is strategy-proof and yields the same outcomes. In fair division, this principle justifies focusing on algorithms where players truthfully report their valuations, since any strategic behavior in complex mechanisms can be replicated by appropriate direct revelation procedures.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Nash Equilibrium</h3>
  <p class="term-definition">
    A strategy profile where no player can unilaterally improve their outcome by changing strategies. In fair division, Nash equilibria represent stable outcomes where all players are optimally responding to others' strategies. However, Nash equilibria may involve strategic misrepresentation of preferences, distinguishing them from strategy-proof mechanisms that ensure truthful revelation.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Information Rent</h3>
  <p class="term-definition">
    Extra utility that players obtain by exploiting private information about their preferences in strategic settings. In fair division mechanisms that are not strategy-proof, players may gain information rents by misrepresenting their valuations. Eliminating information rents typically requires either strategy-proofness or careful mechanism design with appropriate incentive structures.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Maximin Share</h3>
  <p class="term-definition">
    The maximum utility a player can guarantee for themselves when they have control over the division process but others choose their pieces first. Player $i$'s maximin share $\text{MMS}_i$ represents their worst-case outcome when optimally dividing the resource. Maximin fairness requires that each player receives at least their maximin share, providing a individual rationality guarantee.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Price of Fairness</h3>
  <p class="term-definition">
    The efficiency loss incurred by requiring fair allocations compared to purely welfare-maximizing allocations. In cake-cutting, the price of fairness measures how much total social welfare must be sacrificed to ensure properties like envy-freeness or proportionality. This concept quantifies the trade-off between fairness and efficiency in resource allocation.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Competitive Equilibrium</h3>
  <p class="term-definition">
    An allocation where all players optimize their utility subject to budget constraints at market-clearing prices. In fair division with transfers, competitive equilibria provide efficiency guarantees while maintaining fairness through equal budget allocations. The existence and computation of competitive equilibria represents an important alternative approach to traditional cake-cutting procedures.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Unanimity</h3>
  <p class="term-definition">
    Property requiring that if all players agree on a preference ordering over allocations, the mechanism should respect this unanimous preference. Unanimity ensures that mechanisms don't produce allocations that all players consider suboptimal. This property interacts strongly with strategy-proofness and efficiency requirements in mechanism design.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Individual Rationality</h3>
  <p class="term-definition">
    Requirement that participation in the fair division mechanism yields each player at least as much utility as their outside option (typically receiving nothing). Individual rationality ensures voluntary participation and prevents mechanisms from making players worse off than their disagreement point. In cake-cutting, this often translates to guaranteeing each player at least some positive value.
  </p>
</div>

<div class="term-card">
  <h3 class="term-name">Ordinal Preferences</h3>
  <p class="term-definition">
    Preference representation that only captures ranking information without quantifying preference intensities. Some fair division algorithms work with purely ordinal preferences, avoiding the need for precise cardinal valuations. However, ordinal mechanisms typically achieve weaker fairness guarantees and may require different algorithmic approaches compared to cardinal mechanisms.
  </p>
</div>

</div>

<footer class="algorithm-navigation">
  <a href="{{ '/analysis/' | relative_url }}" class="nav-button secondary">← Analysis</a>
  <a href="{{ '/references/' | relative_url }}" class="nav-button primary">References →</a>
</footer>

<script src="glossarySort.js"></script>
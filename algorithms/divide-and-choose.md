---
layout: algorithm
title: "Divide-and-Choose Algorithm"
subtitle: "The fundamental fair division procedure for two players"
permalink: /algorithms/divide-and-choose/

# Algorithm Metadata
difficulty: beginner
players: 2
properties: ["Proportional", "Envy-free", "Strategy-proof"]
algorithm_type: "Discrete"

# Demo Configuration
has_demo: true

# Navigation
next_algorithm:
  title: "Austin's Moving-Knife"
  url: "/algorithms/austins-moving-knife/"
---

## Overview

The **divide-and-choose** algorithm is the most fundamental fair division procedure for two-player scenarios. Despite its simplicity, it guarantees both proportionality and envy-freeness through an elegant mechanism design.

### How It Works

1. **Player 1 (Divider)** cuts the resource into two pieces that they value equally
2. **Player 2 (Chooser)** selects their preferred piece  
3. **Player 1** receives the remaining piece

## Mathematical Analysis

<div class="definition">
    <strong>Proportional Allocation:</strong> Each player receives at least $\frac{1}{n}$ of their subjective valuation of the total resource, where $n$ is the number of players.
</div>

<div class="definition">
    <strong>Envy-Free Allocation:</strong> No player prefers another player's allocation to their own.
</div>

<div class="theorem">
    <strong>Proportionality Guarantee:</strong> The divide-and-choose algorithm ensures both players receive at least 50% of their subjective valuation.
    <br><br><em>Proof sketch:</em> Player 1 cuts to create two equally-valued pieces ($\geq 50\%$ each). Player 2 chooses their preferred piece ($\geq 50\%$ by choice). $\square$
</div>

<div class="theorem">
    <strong>Envy-Freeness Guarantee:</strong> Neither player envies the other's allocation.
    <br><br><em>Proof sketch:</em> Let $v_1, v_2$ denote the players' valuation functions, and let $A, B$ be the two pieces after division. Player 1 ensures $v_1(A) = v_1(B)$, so regardless of Player 2's choice, Player 1 cannot envy. Player 2 chooses $\max\{v_2(A), v_2(B)\}$, so Player 2 cannot envy Player 1. $\square$
</div>

## Formal Analysis

For a more rigorous treatment, let $C$ represent the entire resource (e.g., a cake), and let $v_i: 2^C \to \mathbb{R}_+$ be player $i$'s valuation function, assumed to be:
- **Additive**: $v_i(X \cup Y) = v_i(X) + v_i(Y)$ for disjoint sets $X, Y$
- **Normalized**: $v_i(C) = 1$

The divide-and-choose protocol produces allocation $(X_1, X_2)$ where:

$$v_1(X_1) = \frac{1}{2} \quad \text{and} \quad v_2(X_2) = \max\left\{\frac{v_2(A)}{v_2(C)}, \frac{v_2(B)}{v_2(C)}\right\} \geq \frac{1}{2}$$

where $A, B$ are the pieces created by Player 1's cut.

## Interactive Demonstration

In development...

## Strategic Considerations

The algorithm is **strategy-proof** for both players:

- **Player 1** has no incentive to deviate from cutting equally, as any unequal cut risks losing the more valuable piece
- **Player 2** should always choose their preferred piece, making truth-telling optimal

Formally, if Player 1 deviates and creates pieces with valuations $v_1(A) \neq v_1(B)$, then Player 2 might select the piece that Player 1 values more highly, leaving Player 1 worse off than the $\frac{1}{2}$ guarantee.

## Complexity Analysis

- **Time Complexity**: $O(1)$ - requires exactly one cut and one choice
- **Space Complexity**: $O(1)$ - constant storage requirements  
- **Query Complexity**: $O(1)$ - each player makes one decision

## Extensions and Generalizations

This simple two-player algorithm forms the foundation for more complex multi-player procedures:

- **Austin's Moving-Knife Procedure** - Extends to three players using continuous cuts
- **Selfridge-Conway Algorithm** - Achieves envy-freeness for three players with discrete cuts  
- **Brams-Taylor Procedures** - Generalize to $n$ players with complex trimming mechanisms

## Limitations

While elegant, divide-and-choose has several limitations:

1. **Two players only** - Does not extend naturally to $n > 2$
2. **May not be Pareto efficient** - Total welfare might not be maximized
3. **Requires divisible goods** - Cannot handle discrete items directly
4. **Assumes honest preferences** - Players must accurately assess values

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
demo_description: "Explore the algorithm with concrete examples and see fairness properties in action"

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
    <strong>Proportional Allocation:</strong> Each player receives at least 1/n of their subjective valuation of the total resource, where n is the number of players.
</div>

<div class="definition">
    <strong>Envy-Free Allocation:</strong> No player prefers another player's allocation to their own.
</div>

<div class="theorem">
    <strong>Proportionality Guarantee:</strong> The divide-and-choose algorithm ensures both players receive at least 50% of their subjective valuation.
    <br><em>Proof sketch:</em> Player 1 cuts to create two equally-valued pieces (≥50% each). Player 2 chooses their preferred piece (≥50% by choice).
</div>

<div class="theorem">
    <strong>Envy-Freeness Guarantee:</strong> Neither player envies the other's allocation.
    <br><em>Proof sketch:</em> Player 1 values both pieces equally, so cannot envy Player 2. Player 2 chose their preferred piece, so cannot envy Player 1.
</div>

## Interactive Demonstration

<py-script>
import matplotlib.pyplot as plt
import numpy as np

print("=== Divide-and-Choose Simulation ===")

# Define player preferences
player1_values = {"left": 0.45, "right": 0.55}  
player2_values = {"left": 0.75, "right": 0.25}  

print(f"Player 1 valuations: Left = {player1_values['left']:.2f}, Right = {player1_values['right']:.2f}")
print(f"Player 2 valuations: Left = {player2_values['left']:.2f}, Right = {player2_values['right']:.2f}")

cut_point = 0.5
print(f"\nPlayer 1 cuts at position {cut_point}")

if player2_values["left"] >= player2_values["right"]:
    p2_choice = "left"
    p2_final_value = player2_values["left"]
    p1_final_value = player1_values["right"]
else:
    p2_choice = "right" 
    p2_final_value = player2_values["right"]
    p1_final_value = player1_values["left"]

print(f"\nPlayer 2 chooses the {p2_choice} piece")
print(f"\nFinal allocation:")
print(f"  Player 1 receives: {p1_final_value:.1%} of total value")
print(f"  Player 2 receives: {p2_final_value:.1%} of total value")

is_proportional = p1_final_value >= 0.5 and p2_final_value >= 0.5
print(f"\nFairness Properties:")
print(f"  ✓ Proportional (both ≥50%): {is_proportional}")
print(f"  ✓ Envy-free: By construction")

# Create visualization
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# Player 1's perspective
ax1.bar(['Left Piece', 'Right Piece'], [player1_values['left'], player1_values['right']], 
        color=['lightblue', 'lightcoral'], alpha=0.7)
ax1.axhline(y=0.5, color='red', linestyle='--', label='Fair share (50%)')
ax1.set_title("Player 1's Valuation", fontweight='bold')
ax1.set_ylabel('Subjective Value')
ax1.set_ylim(0, 1)
ax1.legend()

# Player 2's perspective  
ax2.bar(['Left Piece', 'Right Piece'], [player2_values['left'], player2_values['right']], 
        color=['lightblue', 'lightcoral'], alpha=0.7)
ax2.axhline(y=0.5, color='red', linestyle='--', label='Fair share (50%)')
ax2.set_title("Player 2's Valuation", fontweight='bold')
ax2.set_ylabel('Subjective Value')
ax2.set_ylim(0, 1)
ax2.legend()

plt.tight_layout()
plt.show()
</py-script>

## Strategic Considerations

The algorithm is **strategy-proof** for both players:

- **Player 1** has no incentive to deviate from cutting equally, as any unequal cut risks losing the more valuable piece
- **Player 2** should always choose their preferred piece, making truth-telling optimal

## Extensions and Generalizations

This simple two-player algorithm forms the foundation for more complex multi-player procedures:

- **Austin's Moving-Knife Procedure** - Extends to three players using continuous cuts
- **Selfridge-Conway Algorithm** - Achieves envy-freeness for three players with discrete cuts  
- **Brams-Taylor Procedures** - Generalize to n players with complex trimming mechanisms

## Real-World Applications

The divide-and-choose principle appears in many contexts:

- **Legal settlements** - Dividing assets between parties
- **International negotiations** - Territory or resource allocation
- **Family disputes** - Inheritance or property division
- **Business partnerships** - Splitting company assets or responsibilities

## Further Reading

- Brams, S. J., & Taylor, A. D. (1996). *Fair Division: From Cake-Cutting to Dispute Resolution*
- Robertson, J., & Webb, W. (1998). *Cake-Cutting Algorithms: Be Fair if You Can*
- Moulin, H. (2003). *Fair Division and Collective Welfare*
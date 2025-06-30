# Fair Division Algorithms: Interactive Research Platform

Interactive educational platform for fair division theory and algorithmic game theory.

[![Live Site](https://img.shields.io/badge/Live%20Site-Available-green)](https://amaan-19.github.io/fair-division-exercises/)
[![License](https://img.shields.io/badge/License-CC%20BY--SA%204.0-blue)](LICENSE)

## Overview

Educational Jekyll website providing interactive demonstrations and theoretical analysis for fair division algorithms. Bridges mathematical theory with hands-on exploration for students and researchers.

**Research Team**: Amaan Khan, Dr. Ron Cytron (Washington University in St. Louis)  
**Funding**: Mozilla Responsible Computer Science

## Implemented Algorithms

| Algorithm | Players | Properties | Type |
|-----------|---------|------------|------|
| Divide-and-Choose | 2 | Proportional, Envy-free, Strategy-proof | Discrete |
| Austin's Moving Knife | 2 | Equitable, Exact, Envy-free, Strategy-proof | Continuous |
| Steinhaus' Lone-Divider | 3 | Proportional | Discrete |
| Banach-Knaster's Last-Diminisher | N | Proportional | Discrete |

## Quick Start

```bash
git clone https://github.com/amaan-19/fair-division-exercises.git
cd fair-division-exercises
bundle install
bundle exec jekyll serve
```

Access at `http://localhost:4000`

## Features

- **Interactive Demos**: Real-time algorithm visualization with SVG
- **Mathematical Analysis**: Formal proofs and theorem statements  
- **Educational Resources**: Glossary, references, structured exercises
- **Responsive Design**: Mobile-optimized academic interface

## Project Structure

```
├── algorithms/          # Algorithm analysis pages
├── assets/demos/        # Interactive demonstration system
├── glossary/           # Educational terminology
├── references/         # Academic bibliography
└── exercises/          # Learning modules
```

## Technology Stack

- Jekyll 4.x + GitHub Pages
- MathJax 3 for mathematical notation
- Vanilla JavaScript + SVG visualizations
- Custom CSS with academic typography

## License

[Creative Commons Attribution-ShareAlike 4.0 International](LICENSE)

## Citation

```bibtex
@misc{khan2024fairdivision,
  title={Fair Division Algorithms: Interactive Research Platform},
  author={Khan, Amaan and Cytron, Ron},
  year={2025},
  institution={Washington University in St. Louis}
}
```

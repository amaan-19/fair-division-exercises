# Fair Division Algorithms

An interactive educational platform for learning fair division algorithms through hands-on demonstrations and mathematical analysis.

## About

This project teaches fair division theory—the mathematical study of dividing resources fairly among multiple parties. Students can explore algorithms through interactive Python demonstrations, rigorous mathematical proofs, and practical applications.

**Status:** Active development with foundational content complete

## Current Features

### 🎯 **Foundations**
- **Fairness Criteria** - Complete mathematical treatment of proportionality, envy-freeness, Pareto efficiency, and strategy-proofness
- Formal definitions with LaTeX mathematical notation
- Real-world applications and examples
- Interactive criterion comparison tables

### 🔬 **Algorithms**
- **Divide-and-Choose Algorithm** - Complete with interactive Python demo
  - Live code execution via Pyodide
  - Step-by-step mathematical analysis
  - Visualization of fairness properties
  - Formal proofs and complexity analysis

### 💻 **Interactive Features**
- **Browser-based Python** - Execute algorithms directly with Pyodide
- **Mathematical rendering** - LaTeX support via MathJax
- **Responsive design** - Optimized for desktop and mobile
- **Progressive enhancement** - Works without JavaScript for core content

### 🎨 **Educational Design**
- **Structured learning path** - From foundations to advanced algorithms
- **Visual hierarchy** - Clean, academic styling with serif headings
- **Accessibility features** - Proper contrast, semantic markup, and responsive layouts
- **Academic references** - Curated bibliography for further study

## Technology Stack

- **Jekyll** - Static site generator
- **Pyodide** - Browser-based Python environment
- **MathJax** - LaTeX mathematical notation rendering
- **Matplotlib** - Python visualizations in browser
- **GitHub Pages** - Hosting and deployment
- **Custom CSS** - Modern responsive design with CSS Grid

## Project Structure

```
├── _config.yml                    # Jekyll configuration
├── _data/
│   ├── algorithms.yml             # Algorithm metadata
│   └── foundations.yml            # Foundation topic metadata
├── _includes/
│   ├── algorithms/                # Algorithm-specific components
│   ├── foundations/               # Foundation-specific components
│   ├── header.html               # Site navigation
│   ├── footer.html               # Site footer
│   └── mathjax.html              # Mathematical notation setup
├── _layouts/
│   ├── default.html              # Base page layout
│   ├── algorithm.html            # Algorithm page layout
│   └── foundation.html           # Foundation page layout
├── algorithms/
│   ├── index.md                  # Algorithm listing page
│   └── divide-and-choose.md      # Complete algorithm implementation
├── foundations/
│   ├── index.md                  # Foundation topics overview
│   └── fairness-criteria.md     # Complete fairness criteria guide
├── assets/
│   └── main.scss                 # Comprehensive styling
└── index.md                      # Homepage
```

## Quick Start

### Local Development
```bash
git clone [repository-url]
cd fair-division-algorithms
bundle install
bundle exec jekyll serve --livereload
```
Visit `http://127.0.0.1:4000`

### GitHub Pages Deployment
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Select "Deploy from a branch" and choose `main`
4. Your site will be available at `https://username.github.io/fair-division-algorithms/`

## Content Status

### ✅ Complete
- **Fairness Criteria**: Comprehensive mathematical foundations
- **Divide-and-Choose Algorithm**: Full implementation with interactive demo
- **Site Infrastructure**: Layouts, styling, navigation, and responsive design
- **Mathematical Rendering**: LaTeX support throughout

### 🚧 In Development
- **Austin's Moving-Knife Procedure**: Algorithm page structure exists
- **Selfridge-Conway Algorithm**: Metadata configured
- **Exercise System**: Planned for interactive practice problems

### 📋 Planned
- **Mathematical Models**: Formal preference representation theory
- **Game Theory Foundations**: Strategic aspects of fair division
- **Computational Complexity**: Algorithmic efficiency analysis
- **Interactive Exercises**: Practice problems with step-by-step solutions
- **Enhanced Visualizations**: Dynamic algorithm demonstrations

## Educational Approach

### **Multiple Learning Modalities**
- **Visual**: Step-by-step algorithm demonstrations
- **Mathematical**: Formal proofs and theoretical analysis
- **Interactive**: Hands-on Python coding and experimentation
- **Applied**: Real-world examples and case studies

### **Progressive Complexity**
- **Foundations**: Core mathematical concepts
- **Basic Algorithms**: Two-player procedures
- **Advanced Algorithms**: Multi-player mechanisms
- **Research Topics**: Current developments in the field

### **Academic Rigor**
- Formal mathematical definitions and notation
- Complete proofs of algorithmic properties
- References to seminal papers and current research
- Connection to broader game theory and mechanism design

## Browser Requirements

- **Modern browser** with WebAssembly support (Chrome, Firefox, Safari, Edge)
- **JavaScript enabled** for interactive Python demonstrations
- **Note**: Python environment takes 5-10 seconds to initialize on first load

## Contributing

This is an educational project focused on clear, rigorous exposition of fair division theory. Contributions should maintain the academic tone and mathematical precision.

### Content Guidelines
- Use formal mathematical notation with LaTeX
- Include complete proofs or proof sketches for theoretical claims
- Provide concrete examples alongside abstract concepts
- Maintain consistent styling and layout patterns

### Technical Guidelines
- Follow Jekyll conventions for layouts and includes
- Use semantic HTML and accessible design patterns
- Test responsive design across device sizes
- Ensure mathematical notation renders correctly

## Team

- **Amaan Khan** - Development and content creation
- **Dr. Ron Cytron** - Academic guidance and theoretical oversight
- **Mozilla** - Project support and educational initiative funding

## License

Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

This allows for free use, modification, and distribution with proper attribution and same license for derivative works.

## Acknowledgments

Built with support from Mozilla's educational initiatives. Special thanks to the fair division research community for the theoretical foundations that make this educational resource possible.

---

*An interactive educational platform exploring mathematical approaches to fair resource allocation.*

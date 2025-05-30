# Fair Division Algorithms

An educational platform for learning fair division algorithms through interactive demonstrations. A collaborative project by Amaan Khan and Dr. Ron Cytron, with support from Mozilla.

## What This Is

This site teaches fair division algorithms—mathematical procedures for dividing resources fairly among multiple parties. Instead of just reading about these algorithms, you can run them in your browser and see how they work with real examples.

Currently, we have one fully implemented algorithm (Divide-and-Choose) with plans to add more.

## Current Status

**Working**: 
- Divide-and-Choose algorithm with interactive Python demo
- Basic site structure and navigation
- Mobile-responsive design

**In Progress**:
- Additional algorithms (Austin's, etc)
- Exercise problems and solutions
- Reference materials and citations

**Not Yet Started**:
- Comprehensive fairness criteria explanations
- Advanced algorithms
- Educational assessment tools

## Technical Setup

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation needed—everything runs in your browser using Pyodide

### Local Development
```bash
git clone [repository-url]
cd fair-division-algorithms
gem install bundler jekyll
bundle install
bundle exec jekyll serve
```

Visit `http:127.0.0.1:4000` to see the site.

### Deployment
The site is built for GitHub Pages. Enable Pages in your repository settings and it will deploy automatically from the main branch.

## How It Works

The site uses:
- **Jekyll** for static site generation
- **Pyodide** to run Python code in the browser
- **Matplotlib** for visualizations
- **GitHub Pages** for hosting

When you visit an algorithm page, it loads a Python environment and runs the algorithm code live. This takes a few seconds on first load but is cached afterward.

### Key References
- Brams & Taylor (1996). *Fair Division: From Cake-Cutting to Dispute Resolution*

## License

Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

You can use, share, and adapt this work for any purpose, including commercial use, as long as you provide attribution and share derivatives under the same license.

## Team

- **Amaan Khan** - Development and implementation
- **Dr. Ron Cytron** - Academic guidance
- **Mozilla** - Project support

## Contact

- Technical issues: GitHub Issues
- Academic inquiries: Through Washington University channels
- General questions: amaan@wustl.edu

---

This is an early-stage educational project. Content and features will expand based on development progress and user feedback.

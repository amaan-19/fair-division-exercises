document.addEventListener('DOMContentLoaded', function() {
    const exercises = [
        {
            id: 'divide-choose-fundamentals',
            title: 'Divide-and-Choose Fundamentals',
            difficulty: 'Beginner',
            timeEstimate: '15 minutes',
            description: 'Master the basic divide-and-choose procedure and understand optimal cutting strategies.',
            objectives: [
                'Execute the divide-and-choose algorithm step-by-step with confidence',
                'Develop intuition for optimal cutting strategies as the divider',
                'Understand why the algorithm guarantees proportional and envy-free outcomes',
                'Recognize strategic considerations for both players'
            ],
            instructions: `
                <strong>Phase 1: Basic Practice (5 minutes)</strong><br>
                1. Open the simulator and select "Divide-and-Choose"<br>
                2. Set up a scenario where both players have similar valuations<br>
                3. Practice making cuts at different positions as Player 1<br>
                4. Observe Player 2's choices and resulting value distributions<br><br>
                
                <strong>Phase 2: Strategic Cutting (5 minutes)</strong><br>
                5. Create a scenario with very different player preferences<br>
                6. Practice cutting as Player 1 in various positions<br>
                7. Challenge: Find cuts that give you >50% while Player 2 still accepts<br><br>
                
                <strong>Phase 3: Analysis (5 minutes)</strong><br>
                8. Try extreme scenarios with unusual preference patterns<br>
                9. Test cuts near the edges (positions 0.1 and 0.9)<br>
                10. Switch to Player 2 perspective and analyze optimal responses<br><br>
                
                <strong>Reflection Questions:</strong><br>
                • What is the optimal strategy for the divider?<br>
                • Can either player receive less than 50% of their valuation?<br>
                • What real-world challenges might arise with this algorithm?
            `
        },
        {
            id: 'austin-moving-knife-comparison',
            title: 'Austin\'s Moving Knife & Continuous vs. Discrete',
            difficulty: 'Intermediate',
            timeEstimate: '20 minutes',
            description: 'Master the moving knife procedure and understand the key differences between continuous and discrete algorithms.',
            objectives: [
                'Master the two-phase Austin\'s Moving Knife procedure',
                'Understand "exact" division vs. "proportional" division concepts',
                'Develop intuition for timing decisions under uncertainty',
                'Compare trade-offs between discrete and continuous algorithms'
            ],
            instructions: `
                <strong>Phase 1: Understanding the Basic Procedure (7 minutes)</strong><br>
                1. Select "Austin's Moving Knife" from the algorithm dropdown<br>
                2. Observe the two-phase process by letting it run automatically<br>
                3. Practice calling "stop" in Phase 1 when you think the left piece is exactly 50%<br>
                4. Try multiple runs with different timing decisions<br><br>
                
                <strong>Phase 2: Mastering the Two-Knife Phase (8 minutes)</strong><br>
                5. Gain control in Phase 1, then carefully execute Phase 2<br>
                6. Practice moving both knives while maintaining equal valuation<br>
                7. Experiment with calling "stop" early vs. late in different phases<br><br>
                
                <strong>Phase 3: Comparative Analysis (5 minutes)</strong><br>
                8. Set up identical player valuations for both algorithms<br>
                9. Run the same scenario through divide-and-choose first<br>
                10. Then run it through Austin's moving knife and compare results<br><br>
                
                <strong>Critical Questions:</strong><br>
                • Why does Austin's knife guarantee "exact" 50-50 division?<br>
                • Which algorithm felt more strategic and why?<br>
                • When would you prefer continuous vs. discrete methods?
            `
        },
        {
            id: 'steinhaus-multi-player',
            title: 'Steinhaus\' Lone-Divider & Multi-Player Complexity',
            difficulty: 'Intermediate-Advanced',
            timeEstimate: '18 minutes',
            description: 'Master three-player division and understand case-based algorithmic reasoning.',
            objectives: [
                'Execute a three-player fair division algorithm with confidence',
                'Understand case-based algorithmic reasoning (Case A vs. Case B)',
                'Recognize how algorithm complexity scales with additional players',
                'Practice reconstruction procedures when initial allocations fail'
            ],
            instructions: `
                <strong>Phase 1: Understanding the Divider Role (6 minutes)</strong><br>
                1. Select "Steinhaus' Lone-Divider" from the algorithm dropdown<br>
                2. Practice as the Divider (Player 1) creating 3 equal pieces<br>
                3. Try different cutting strategies and observe chooser responses<br>
                4. Identify what determines Case A vs. Case B outcomes<br><br>
                
                <strong>Phase 2: Case Analysis Mastery (8 minutes)</strong><br>
                5. Force Case A scenarios where choosers find multiple acceptable pieces<br>
                6. Force Case B scenarios where choosers find at most 1 acceptable piece<br>
                7. Practice the reconstruction procedure in Case B<br>
                8. Understand why choosers are guaranteed ≥1/3 in both cases<br><br>
                
                <strong>Phase 3: Strategic Analysis (4 minutes)</strong><br>
                9. Test algorithm limitations - try to create envy between players<br>
                10. Compare complexity with two-player algorithms<br>
                11. Analyze trade-offs between fairness guarantees and simplicity<br><br>
                
                <strong>Critical Questions:</strong><br>
                • Why does the algorithm need two different cases?<br>
                • Can you create scenarios where players envy each other?<br>
                • How much more complex is 3-player vs. 2-player division?
            `
        },
        {
            id: 'two-player-comparison',
            title: 'Two-Player Algorithm Comparison',
            difficulty: 'Intermediate',
            timeEstimate: '20 minutes',
            description: 'Compare divide-and-choose vs. Austin\'s moving knife on identical scenarios.',
            objectives: [
                'Analyze trade-offs between discrete and continuous methods',
                'Compare fairness property outcomes',
                'Understand when to use each algorithm'
            ],
            instructions: '<strong>Your Task:</strong><br>1. Set up identical player valuations in the simulator<br>2. Run the scenario through divide-and-choose<br>3. Run the same scenario through Austin\'s moving knife<br>4. Compare the outcomes and fairness properties achieved<br>5. Analyze which method works better for different preference patterns'
        },
        {
            id: 'fairness-property-analysis',
            title: 'Fairness Property Analysis',
            difficulty: 'Advanced',
            timeEstimate: '25 minutes',
            description: 'Systematically test how different algorithms achieve various fairness properties.',
            objectives: [
                'Verify proportional allocations across algorithms',
                'Test envy-freeness in practice',
                'Understand strategy-proofness implications'
            ],
            instructions: '<strong>Your Task:</strong><br>1. Create scenarios with extreme preference differences<br>2. Test each algorithm with these challenging cases<br>3. Verify that fairness properties hold in practice<br>4. Identify scenarios where certain algorithms excel<br>5. Document your findings about algorithm strengths'
        }
    ];

    let currentExercise = null;

    // Setup event listeners
    document.getElementById('exercise-list').addEventListener('change', function(e) {
        if (e.target.value) {
            loadExercise(e.target.value);
        } else {
            document.getElementById('exercise-panel').style.display = 'none';
        }
    });

    // Populate exercise list on page load
    populateExerciseList();

    function populateExerciseList() {
        const exerciseSelect = document.getElementById('exercise-list');
        exerciseSelect.innerHTML = '<option value="">Select an Exercise</option>';

        exercises.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise.id;
            option.textContent = exercise.title;
            exerciseSelect.appendChild(option);
        });
    }

    function loadExercise(exerciseId) {
        const exercise = exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        currentExercise = exercise;
        displayExercise(exercise);
    }

    function displayExercise(exercise) {
        document.getElementById('exercise-title').textContent = exercise.title;
        document.getElementById('exercise-difficulty').textContent = exercise.difficulty;
        document.getElementById('exercise-time').textContent = exercise.timeEstimate;
        document.getElementById('exercise-description').textContent = exercise.description;

        // Display objectives
        const objectivesEl = document.getElementById('exercise-objectives');
        objectivesEl.innerHTML = `
            <h3>Learning Objectives</h3>
            <ul>${exercise.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>
        `;

        document.getElementById('exercise-instructions').innerHTML = exercise.instructions;
        document.getElementById('exercise-panel').style.display = 'block';

        // Scroll to exercise panel
        document.getElementById('exercise-panel').scrollIntoView({ behavior: 'smooth' });
    }

    function resetExercise() {
        document.getElementById('exercise-list').value = '';
        document.getElementById('exercise-panel').style.display = 'none';
        currentExercise = null;
    }
});
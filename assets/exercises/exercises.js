document.addEventListener('DOMContentLoaded', function() {
    const exercises = {
        simulation: [
            {
                id: 'divide-choose-basic',
                title: 'Basic Divide-and-Choose Practice',
                difficulty: 'Beginner',
                timeEstimate: '10 minutes',
                description: 'Practice the fundamental divide-and-choose procedure with guided scenarios.',
                objectives: [
                    'Execute divide-and-choose algorithm step by step',
                    'Understand optimal cutting strategies',
                    'Verify proportional and envy-free properties'
                ],
                instructions: '<strong>Your Task:</strong><br>1. Open the simulator using the button below<br>2. Select "Divide-and-Choose" from the algorithm dropdown<br>3. Practice making optimal cuts as Player 1<br>4. Observe how Player 2 responds to your cuts<br>5. Try different scenarios to understand the strategy'
            },
            {
                id: 'austin-knife-practice',
                title: 'Austin\'s Moving Knife Practice',
                difficulty: 'Intermediate',
                timeEstimate: '15 minutes',
                description: 'Learn the moving knife procedure through hands-on simulation.',
                objectives: [
                    'Understand continuous division procedures',
                    'Practice timing knife-stopping decisions',
                    'Compare exact vs. proportional outcomes'
                ],
                instructions: '<strong>Your Task:</strong><br>1. Open the simulator and select "Austin\'s Moving Knife"<br>2. Experience the two-phase knife movement<br>3. Practice calling "stop" at optimal moments<br>4. Compare outcomes with divide-and-choose on the same scenario'
            },
            {
                id: 'steinhaus-three-player',
                title: 'Steinhaus Three-Player Division',
                difficulty: 'Intermediate',
                timeEstimate: '12 minutes',
                description: 'Practice the lone-divider procedure for three players.',
                objectives: [
                    'Execute three-player division algorithm',
                    'Understand case-based reasoning (A/B cases)',
                    'Practice reconstruction procedures'
                ],
                instructions: '<strong>Your Task:</strong><br>1. Select "Steinhaus Lone-Divider" in the simulator<br>2. Practice making two cuts as the divider<br>3. Observe how the case analysis works<br>4. Try scenarios that lead to different cases'
            }
        ],
        comparative: [
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
        ]
    };

    let currentExercise = null;

    // Setup event listeners
    document.getElementById('exercise-category').addEventListener('change', function(e) {
        populateExerciseList(e.target.value);
    });

    document.getElementById('exercise-list').addEventListener('change', function(e) {
        if (e.target.value) {
            loadExercise(e.target.value);
        }
    });

    document.getElementById('reset-exercise-btn').addEventListener('click', function() {
        resetExercise();
    });

    function populateExerciseList(category) {
        const exerciseSelect = document.getElementById('exercise-list');
        exerciseSelect.innerHTML = '<option value="">Select an Exercise</option>';

        if (category && exercises[category]) {
            exercises[category].forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise.id;
                option.textContent = exercise.title;
                exerciseSelect.appendChild(option);
            });
            exerciseSelect.disabled = false;
        } else {
            exerciseSelect.disabled = true;
            document.getElementById('exercise-panel').style.display = 'none';
        }
    }

    function loadExercise(exerciseId) {
        // Find exercise
        let exercise = null;
        for (const category in exercises) {
            exercise = exercises[category].find(ex => ex.id === exerciseId);
            if (exercise) break;
        }

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
        document.getElementById('exercise-category').value = '';
        document.getElementById('exercise-list').innerHTML = '<option value="">Select an Exercise</option>';
        document.getElementById('exercise-list').disabled = true;
        document.getElementById('exercise-panel').style.display = 'none';
        currentExercise = null;
    }
});
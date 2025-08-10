/**
 * Algorithm Data Repository - Separated data definitions
 * Makes it easy to add new algorithms without touching core logic
 */

const ALGORITHM_FLOWCHART_DATA = {
    'divide-and-choose': {
        algorithm: { name: 'Divide-and-Choose Procedure' },
        complexity: {
            cut: 1,
            evalQueries: 1,
            total: 2,
            display: 'Total Complexity: 2 queries (Optimal)',
            optimality: 'optimal'
        },
        steps: [
            {
                type: 'start',
                title: 'Start',
                description: 'Two players want to fairly divide a cake'
            },
            {
                type: 'query',
                title: 'Player 1 (Divider)',
                description: 'Cut the cake into two pieces you value equally',
                queries: { cut: 1 }
            },
            {
                type: 'query',
                title: 'Player 2 (Chooser)',
                description: 'Evaluate both pieces and choose your preferred piece',
                queries: { evalQueries: 1 }
            },
            {
                type: 'action',
                description: 'Player 1 receives the remaining piece'
            },
            {
                type: 'end',
                title: 'Result',
                description: 'Proportional and envy-free division achieved<br><small>Both players receive ≥50% by their valuation</small>'
            }
        ]
    },

    'austins-moving-knife': {
        algorithm: { name: 'Austin\'s Moving Knife Procedure' },
        complexity: {
            cut: 0,
            evalQueries: '∞',
            total: '∞',
            display: 'Complexity: Continuous queries (Envy-free)',
            optimality: 'suboptimal'
        },
        steps: [
            {
                type: 'start',
                title: 'Start',
                description: 'Two players and one knife moving across the cake from left to right'
            },
            {
                type: 'query',
                title: 'Continuous Evaluation',
                description: 'Both players continuously evaluate the value of the left piece as the knife moves',
                queries: { evalQueries: Infinity }
            },
            {
                type: 'decision',
                title: 'Stop Condition',
                description: 'Does any player call "stop" when the left piece equals exactly 50% of their total valuation?'
            },
            {
                type: 'action',
                title: 'Division',
                description: 'The player who called "stop" takes the left piece, the other player takes the right piece'
            },
            {
                type: 'end',
                title: 'Result',
                description: 'Envy-free division achieved<br><small>Each player gets exactly 50% by their own valuation</small>'
            }
        ]
    },

    'selfridge-conway': {
        algorithm: { name: 'Selfridge-Conway Procedure' },
        complexity: {
            cut: '2-5',
            evalQueries: '5-12',
            total: '7-17',
            display: 'Complexity: 7-17 queries (Variable)',
            optimality: 'unknown'
        },
        steps: [
            {
                type: 'start',
                title: 'Start',
                description: 'Three players participate: Player 1 begins'
            },
            {
                type: 'query',
                title: 'Step 1: Division',
                description: 'Player 1 cuts the cake into 3 pieces they value equally (requires 2 cuts)',
                queries: { cut: 2 }
            },
            {
                type: 'query',
                title: 'Step 2: Evaluation',
                description: 'Player 2 evaluates the two largest pieces to determine whether trimming is needed',
                queries: { evalQueries: 2 },
                branches: [
                    {
                        condition: 'NO',
                        label: 'No - Sequential Selection',
                        steps: [
                            {
                                type: 'action',
                                title: 'Step 3a: First Choice',
                                description: 'Player 3 chooses the piece they prefer'
                            },
                            {
                                type: 'action',
                                title: 'Step 4a: Second Choice',
                                description: 'Player 2 chooses the piece they prefer'
                            },
                            {
                                type: 'action',
                                title: 'Step 5a: Final Allocation',
                                description: 'Player 1 receives the last remaining piece'
                            }
                        ]
                    },
                    {
                        condition: 'YES',
                        label: 'Yes - Trimming Step',
                        steps: [
                            {
                                type: 'query',
                                title: 'Step 3b: Trimming',
                                description: 'Player 2 trims the largest piece so that the two largest pieces are tied in value. The trimming is set aside.',
                                queries: { cut: 1 }
                            },
                            {
                                type: 'action',
                                title: 'Step 4b: First Choice',
                                description: 'Player 3 chooses the piece they prefer from the post-trimmed pieces'
                            },
                            {
                                type: 'action',
                                title: 'Step 5b: Second Choice',
                                description: 'If Player 3 does NOT choose the trimmed piece, Player 2 must choose it. Otherwise, they choose their preferred piece.'
                            },
                            {
                                type: 'action',
                                title: 'Step 6b: Third Choice',
                                description: 'Player 1 chooses the last piece.'
                            },
                            {
                                type: 'query',
                                title: 'Step 7b: Trimming Division',
                                description: 'The trimmed piece was chosen by either Player 2 or 3. The player who did NOT choose the trimmed piece now divides the trimming into three equal pieces.',
                                queries: { cut: 2 }
                            },
                            {
                                type: 'action',
                                title: 'Step 8b: First Trimming Choice',
                                description: 'The player who chose the original trimmed piece gets to pick a divided trimming.'
                            },
                            {
                                type: 'action',
                                title: 'Step 9b: Second Trimming Choice',
                                description: 'Player 1 gets to pick a divided trimming.'
                            },
                            {
                                type: 'action',
                                title: 'Step 10b: Final Allocation',
                                description: 'The remaining player chooses the final trimming piece.'
                            }
                        ]
                    }
                ]
            },
            {
                type: 'end',
                title: 'Result',
                description: 'All players guaranteed ≥1/3 of their subjective valuation<br><small>Proportional but not necessarily envy-free</small>'
            }
        ]
    }
};
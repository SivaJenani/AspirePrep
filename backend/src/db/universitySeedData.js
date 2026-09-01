"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEED_UNIVERSITY_EXAMS = void 0;
exports.SEED_UNIVERSITY_EXAMS = [
    {
        id: 'univ_cs3351_dsa',
        subjectCode: 'CS3351',
        subjectName: 'Data Structures and Algorithms',
        universityName: 'Anna University / Autonomous Affiliated',
        department: 'Computer Science & Engineering',
        semester: 3,
        examDate: '2026-09-12',
        examTime: '10:00 AM - 01:00 PM (Forenoon Session)',
        examHallLocation: 'Examination Block B - Hall 302',
        credits: 4,
        targetGrade: 'O (Outstanding)',
        internalMarksScored: 18,
        totalInternalMarks: 20,
        requiredExternalMarks: 45,
        preparationProgress: 65,
        status: 'cramming',
        units: [
            {
                unitNumber: 1,
                unitTitle: 'Linear Data Structures - Stacks, Queues & Linked Lists',
                weightageMarks: 20,
                topics: [
                    'Array ADT vs Singly / Doubly / Circular Linked Lists',
                    'Stack ADT implementation using Arrays and Linked Lists',
                    'Applications of Stack: Infix to Postfix Conversion & Postfix Evaluation',
                    'Queue ADT, Circular Queue implementation and Priority Queue'
                ],
                isCompleted: true,
                confidenceLevel: 'strong',
                twoMarks: [
                    {
                        id: 'dsa_u1_q1',
                        unitNumber: 1,
                        question: 'Define Abstract Data Type (ADT). Give two examples.',
                        conciseAnswer: 'An Abstract Data Type (ADT) is a mathematical model for data types where a data type is defined by its behavior (semantics) from the point of view of a user, specifically in terms of possible values, possible operations on data of this type, and the behavior of these operations, without specifying the implementation details. Examples: Stack ADT, List ADT, Queue ADT.',
                        keyKeywords: ['Mathematical model', 'Behavior defined by operations', 'Implementation independent'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: true
                    },
                    {
                        id: 'dsa_u1_q2',
                        unitNumber: 1,
                        question: 'What is the condition for Circular Queue full and empty condition in an array of size MAX?',
                        conciseAnswer: 'Front = -1 and Rear = -1 indicates Queue is Empty. Queue is Full when: ((Rear + 1) % MAX) == Front.',
                        keyKeywords: ['((Rear + 1) % MAX) == Front', 'Front == -1 && Rear == -1'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: true
                    },
                    {
                        id: 'dsa_u1_q3',
                        unitNumber: 1,
                        question: 'Convert the Infix expression (A + B) * (C - D) / E to Postfix notation.',
                        conciseAnswer: 'Step 1: (A + B) -> AB+\nStep 2: (C - D) -> CD-\nStep 3: AB+ * CD- -> AB+CD-*\nStep 4: AB+CD-* / E -> AB+CD-*E/',
                        keyKeywords: ['AB+CD-*E/', 'Operator precedence', 'Left-to-right evaluation'],
                        frequency: 'Medium',
                        isMastered: false
                    }
                ],
                bigQuestions: [
                    {
                        id: 'dsa_u1_bq1',
                        unitNumber: 1,
                        title: 'Explain the Infix to Postfix conversion algorithm using Stack with a complete trace for: (A + B * C) / (D - E ^ F)',
                        marks: 13,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Nov/Dec 2024', 'Apr/May 2024', 'Nov/Dec 2023'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Algorithm Explanation & Operator Precedence Table',
                                content: 'Describe stack rules: Operands directly to output; Operators pushed if precedence > top of stack, else pop higher/equal precedence operators before pushing.',
                                diagramHint: 'Draw precedence table: ^ (Highest, Right-to-Left) > *, / > +, - (Left-to-Right).'
                            },
                            {
                                heading: '2. Step-by-Step Execution Table',
                                content: 'Create a 4-column trace table with Symbol Scanned, Stack Content, Postfix Expression, and Action Taken.',
                                diagramHint: 'Show stack states at each symbol scan.'
                            },
                            {
                                heading: '3. Final Output Postfix String',
                                content: 'Final Result: A B C * + D E F ^ - /'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 2,
                unitTitle: 'Tree Structures & Balanced Search Trees',
                weightageMarks: 20,
                topics: [
                    'Binary Trees, Traversals (Inorder, Preorder, Postorder)',
                    'Binary Search Tree (BST) Operations: Insertion, Deletion cases',
                    'AVL Trees & 4 Rotations (LL, RR, LR, RL)',
                    'B-Trees and B+ Tree Indexing in Databases',
                    'Binary Heaps / Priority Queues'
                ],
                isCompleted: true,
                confidenceLevel: 'moderate',
                twoMarks: [
                    {
                        id: 'dsa_u2_q1',
                        unitNumber: 2,
                        question: 'What is the Balance Factor in an AVL Tree? State its permissible values.',
                        conciseAnswer: 'Balance Factor (BF) = Height(Left Subtree) - Height(Right Subtree). For an AVL tree to remain balanced, the Balance Factor of every node must strictly be in {-1, 0, +1}.',
                        keyKeywords: ['BF = Height(L) - Height(R)', 'Values in {-1, 0, +1}'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: true
                    },
                    {
                        id: 'dsa_u2_q2',
                        unitNumber: 2,
                        question: 'Differentiate between B-Tree and B+ Tree.',
                        conciseAnswer: 'In a B-Tree, search keys and data pointers are stored in both internal and leaf nodes. In a B+ Tree, internal nodes store only routing keys while all actual data records/pointers are stored exclusively in leaf nodes linked sequentially for fast range queries.',
                        keyKeywords: ['Leaf node sequential linking', 'Internal nodes contain only routing keys in B+ Tree'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: false
                    }
                ],
                bigQuestions: [
                    {
                        id: 'dsa_u2_bq1',
                        unitNumber: 2,
                        title: 'Construct an AVL tree by inserting keys: 21, 26, 30, 9, 4, 14, 28, 18, 15. Show all single (LL, RR) and double (LR, RL) rotations clearly.',
                        marks: 16,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Apr/May 2025', 'Nov/Dec 2024', 'Apr/May 2023'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Initial Insertions and Detection of Imbalance',
                                content: 'Insert 21, 26, 30 -> Node 21 has BF = -2 (RR Imbalance). Perform Single Left Rotation around 21.',
                                diagramHint: 'Draw AVL node diagrams showing balance factors at each step.'
                            },
                            {
                                heading: '2. Double Rotation Demonstration',
                                content: 'Insert 9, 4 -> LL Rotation. Insert 14 -> LR Rotation on subtree rooted at 9.',
                                diagramHint: 'Show intermediate state after left-rotation on child then right-rotation on parent.'
                            },
                            {
                                heading: '3. Final AVL Tree Verification',
                                content: 'Confirm that all nodes have Balance Factor within {-1, 0, +1}.'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 3,
                unitTitle: 'Graph Algorithms & Minimum Spanning Trees',
                weightageMarks: 20,
                topics: [
                    'Graph Representations: Adjacency Matrix vs Adjacency List',
                    'Graph Traversals: Breadth First Search (BFS) & Depth First Search (DFS)',
                    'Topological Sorting for Directed Acyclic Graphs (DAG)',
                    'Shortest Path: Dijkstraâ€™s Algorithm and Bellman-Ford Algorithm',
                    'Minimum Spanning Trees: Primâ€™s and Kruskalâ€™s Greedy Algorithms'
                ],
                isCompleted: false,
                confidenceLevel: 'weak',
                twoMarks: [
                    {
                        id: 'dsa_u3_q1',
                        unitNumber: 3,
                        question: 'What is Topological Sort? Give an application.',
                        conciseAnswer: 'Topological sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge (u -> v), vertex u comes before v in the ordering. Application: Task scheduling, prerequisite course planning, build dependency resolution.',
                        keyKeywords: ['Linear ordering in DAG', 'u precedes v for edge u->v', 'Task scheduling application'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: false
                    },
                    {
                        id: 'dsa_u3_q2',
                        unitNumber: 3,
                        question: 'Why does Dijkstraâ€™s algorithm fail for graphs with negative weight cycles?',
                        conciseAnswer: 'Dijkstra assumes that adding an edge to a path always increases its total cost (greedy assumption with non-negative weights). With negative edges, an already finalized shortest path could be made shorter later, breaking the greedy invariant. Bellman-Ford algorithm must be used instead.',
                        keyKeywords: ['Greedy invariant broken', 'Negative weight cycles', 'Use Bellman-Ford'],
                        frequency: 'Medium',
                        isMastered: false
                    }
                ],
                bigQuestions: [
                    {
                        id: 'dsa_u3_bq1',
                        unitNumber: 3,
                        title: 'Explain Dijkstraâ€™s Single Source Shortest Path algorithm with pseudocode and trace the shortest paths from source vertex A for a given 6-vertex weighted graph.',
                        marks: 13,
                        frequency: 'High-Yield',
                        previousExamYears: ['Apr/May 2025', 'Nov/Dec 2023'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Pseudocode & Priority Queue Initialization',
                                content: 'Set dist[source] = 0 and dist[v] = infinity for all other vertices. Maintain a visited set S and Min-Priority Queue.',
                                diagramHint: 'Draw graph topology with edge weights.'
                            },
                            {
                                heading: '2. Iteration Table',
                                content: 'Fill a 6-row iteration table tracking visited vertex u, relaxed neighboring edges (u, v), and updated distance array.',
                                diagramHint: 'Highlight newly discovered shortest distances in bold.'
                            },
                            {
                                heading: '3. Time Complexity Analysis',
                                content: 'O((V + E) log V) using Min-Heap / Adjacency List.'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 4,
                unitTitle: 'Hashing Techniques & Sorting Algorithms',
                weightageMarks: 20,
                topics: [
                    'Hash Tables & Hash Functions (Division, Mid-square, Folding)',
                    'Collision Resolution: Open Addressing (Linear, Quadratic, Double Hashing)',
                    'Separate Chaining Collision Handling',
                    'Comparison Sorting: QuickSort & Partitioning strategies',
                    'MergeSort Divide-and-Conquer Analysis',
                    'HeapSort and Linear Time Sorting (Radix Sort, Counting Sort)'
                ],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [
                    {
                        id: 'dsa_u4_q1',
                        unitNumber: 4,
                        question: 'What is Clustering in Open Addressing? Differentiate Primary from Secondary clustering.',
                        conciseAnswer: 'Primary clustering occurs in Linear Probing where occupied slots form long contiguous blocks, increasing search time. Secondary clustering occurs in Quadratic Probing where keys that hash to the same initial slot trace the exact same probe sequence.',
                        keyKeywords: ['Linear probing -> Primary clustering', 'Quadratic probing -> Secondary clustering'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: false
                    },
                    {
                        id: 'dsa_u4_q2',
                        unitNumber: 4,
                        question: 'Compare QuickSort and MergeSort time & space complexities.',
                        conciseAnswer: 'QuickSort: Best/Avg O(N log N), Worst O(N^2), Auxiliary Space O(log N) in-place. MergeSort: Best/Avg/Worst O(N log N) strictly, Auxiliary Space O(N) external buffer.',
                        keyKeywords: ['QuickSort worst O(N^2)', 'MergeSort stable O(N log N) with O(N) space'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: true
                    }
                ],
                bigQuestions: [
                    {
                        id: 'dsa_u4_bq1',
                        unitNumber: 4,
                        title: 'Describe Hash Collision Resolution strategies: Separate Chaining vs Open Addressing (Linear Probing, Quadratic Probing, Double Hashing) with diagrams and mathematical formulas.',
                        marks: 13,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Nov/Dec 2024', 'Apr/May 2024', 'Nov/Dec 2022'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Separate Chaining Overview & Diagram',
                                content: 'Each slot in hash table points to a linked list of records that hash to same index. Load factor alpha = N / M.',
                                diagramHint: 'Draw array of bucket pointers to linked list nodes.'
                            },
                            {
                                heading: '2. Open Addressing Formulas',
                                content: 'Linear: h(k, i) = (h(k) + i) % M. Quadratic: h(k, i) = (h(k) + c1*i + c2*i^2) % M. Double: h(k, i) = (h1(k) + i * h2(k)) % M.',
                                diagramHint: 'Show probe sequence resolution on collision.'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 5,
                unitTitle: 'Algorithm Design Strategies & Dynamic Programming',
                weightageMarks: 20,
                topics: [
                    'Greedy Strategy vs Dynamic Programming Principle of Optimality',
                    '0/1 Knapsack Problem (Dynamic Programming Table Formulation)',
                    'Fractional Knapsack (Greedy Approach)',
                    'Longest Common Subsequence (LCS)',
                    'Backtracking: 8-Queens Problem & State Space Tree',
                    'Branch and Bound: Traveling Salesperson Problem (TSP)'
                ],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [
                    {
                        id: 'dsa_u5_q1',
                        unitNumber: 5,
                        question: 'State the Principle of Optimality in Dynamic Programming.',
                        conciseAnswer: 'The Principle of Optimality states that an optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision.',
                        keyKeywords: ['Optimal sub-structure', 'Overlapping sub-problems', 'Bellman optimality'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: false
                    },
                    {
                        id: 'dsa_u5_q2',
                        unitNumber: 5,
                        question: 'Differentiate Backtracking from Branch and Bound.',
                        conciseAnswer: 'Backtracking uses Depth First Search (DFS) with pruning to find feasible solutions for constraint satisfaction (e.g. N-Queens). Branch and Bound uses Breadth First Search (BFS) / Best-First Search with bounding functions to find optimal solutions for optimization problems (e.g. TSP).',
                        keyKeywords: ['Backtracking = DFS + Pruning', 'Branch & Bound = BFS / Best-First + Cost Bounds'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: false
                    }
                ],
                bigQuestions: [
                    {
                        id: 'dsa_u5_bq1',
                        unitNumber: 5,
                        title: 'Solve the 0/1 Knapsack problem using Dynamic Programming for Capacity W = 8 and items: {(w1=2, v1=1), (w2=3, v2=2), (w3=4, v3=5), (w4=5, v4=6)}. Construct the DP table and trace the selected items.',
                        marks: 16,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Apr/May 2025', 'Nov/Dec 2024', 'Apr/May 2023'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Recurrence Relation Definition',
                                content: 'V[i, w] = max(V[i-1, w], V[i-1, w - w_i] + v_i) if w_i <= w, else V[i-1, w].',
                                diagramHint: 'Write the 2D recurrence matrix equation clearly in box.'
                            },
                            {
                                heading: '2. Complete 2D Matrix (5 rows x 9 columns)',
                                content: 'Fill rows 0 to 4 across capacities 0 to 8.',
                                diagramHint: 'Highlight max value at cell V[4, 8] = 8.'
                            },
                            {
                                heading: '3. Backtracking to Identify Selected Items',
                                content: 'Items Selected: Item 4 (w=5, v=6) and Item 2 (w=3, v=2). Total Weight = 8, Max Profit = 8.'
                            }
                        ]
                    }
                ]
            }
        ],
        modelPapers: [
            {
                id: 'mp_cs3351_2025',
                title: 'Anna University April/May 2025 - CS3351 Model Question Paper with Solved Answer Keys',
                yearOrTerm: 'Apr/May 2025 (Regulation 2021)',
                pattern: 'Part A (10 x 2 = 20 Marks) + Part B (5 x 13 = 65 Marks) + Part C (1 x 15 = 15 Marks)',
                partAQuestionsCount: 10,
                partBQuestionsCount: 6
            },
            {
                id: 'mp_cs3351_2024',
                title: 'Anna University Nov/Dec 2024 - University Solved Board Question Paper',
                yearOrTerm: 'Nov/Dec 2024',
                pattern: 'Part A (10 x 2 = 20 Marks) + Part B (5 x 13 = 65 Marks) + Part C (1 x 15 = 15 Marks)',
                partAQuestionsCount: 10,
                partBQuestionsCount: 6
            }
        ],
        facultyExamTips: [
            'âš¡ **Unit 1 & Unit 2 Guarantee 36 Marks**: Infix-to-Postfix conversion and AVL Tree insertion with rotations appear in every single examination paper.',
            'ðŸ“ **Diagram Presentation Protocol**: University evaluators assign 4 out of 13 marks purely for neat labeled tree/graph diagrams and step-by-step trace tables.',
            'ðŸŽ¯ **Part A 2-Marks Accuracy**: Memorize exact definitions with formulas (e.g. AVL Balance Factor formula, ADT definition) to secure full 20/20 in Part A.',
            'â±ï¸ **Time Management Strategy**: Allocate 25 minutes for Part A (10 questions), 25 minutes per Part B question (5 questions = 125 mins), leaving 30 mins for Part C and review.'
        ],
        revisionCrammingPlan: [
            {
                day: 'Day 1 (Immediate)',
                timeSlot: '07:00 PM - 10:30 PM (3.5 Hours)',
                hoursNeeded: 3.5,
                focusUnits: 'Unit 1 & Unit 2 Linear & Trees',
                tasks: [
                    'Practice AVL Tree insertions (LL, RR, LR, RL) with 3 numerical problems',
                    'Memorize Stack applications: Infix to Postfix conversion trace',
                    'Revise all 5 Unit-1 and Unit-2 Two-Mark definitions'
                ]
            },
            {
                day: 'Day 2',
                timeSlot: '06:30 PM - 10:30 PM (4 Hours)',
                hoursNeeded: 4.0,
                focusUnits: 'Unit 3 Graph Algorithms',
                tasks: [
                    'Trace Dijkstra single-source shortest path algorithm on 6-vertex graph',
                    'Compare Prim and Kruskal MST greedy algorithms with pseudocode',
                    'Master Topological sorting steps on Directed Acyclic Graph (DAG)'
                ]
            },
            {
                day: 'Day 3',
                timeSlot: '06:00 PM - 10:30 PM (4.5 Hours)',
                hoursNeeded: 4.5,
                focusUnits: 'Unit 4 Hashing & Unit 5 Dynamic Programming',
                tasks: [
                    'Formulate 0/1 Knapsack 2D Dynamic Programming table and item backtracking',
                    'Draw Open Addressing vs Separate Chaining collision diagrams',
                    'Solve complete 2025 April/May Solved Model Paper under timed conditions'
                ]
            }
        ]
    },
    {
        id: 'univ_cs3452_toc',
        subjectCode: 'CS3452',
        subjectName: 'Theory of Computation & Automata Theory',
        universityName: 'Anna University / Autonomous Affiliated',
        department: 'Computer Science & Engineering',
        semester: 4,
        examDate: '2026-09-18',
        examTime: '02:00 PM - 05:00 PM (Afternoon Session)',
        examHallLocation: 'Examination Block A - Hall 204',
        credits: 3,
        targetGrade: 'A+ (Excellent)',
        internalMarksScored: 17,
        totalInternalMarks: 20,
        requiredExternalMarks: 48,
        preparationProgress: 40,
        status: 'cramming',
        units: [
            {
                unitNumber: 1,
                unitTitle: 'Finite Automata & Regular Expressions',
                weightageMarks: 20,
                topics: [
                    'DFA (Deterministic Finite Automata) & NFA with epsilon transitions',
                    'Equivalence of NFA and DFA (Subset Construction Algorithm)',
                    'Minimization of DFA using Myhill-Nerode / Table Filling method',
                    'Regular Expressions and Ardenâ€™s Theorem'
                ],
                isCompleted: true,
                confidenceLevel: 'strong',
                twoMarks: [
                    {
                        id: 'toc_u1_q1',
                        unitNumber: 1,
                        question: 'Define Deterministic Finite Automaton (DFA) formally with its 5-tuple.',
                        conciseAnswer: 'A DFA is a 5-tuple M = (Q, Sigma, delta, q0, F) where Q is a finite set of states, Sigma is a finite set of input symbols (alphabet), delta: Q x Sigma -> Q is the transition function, q0 in Q is the initial state, and F subset of Q is the set of accept/final states.',
                        keyKeywords: ['5-tuple (Q, Sigma, delta, q0, F)', 'delta: Q x Sigma -> Q'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: true
                    }
                ],
                bigQuestions: [
                    {
                        id: 'toc_u1_bq1',
                        unitNumber: 1,
                        title: 'Convert the given NFA with epsilon transitions to DFA using Subset Construction algorithm and minimize the resulting DFA.',
                        marks: 13,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Apr/May 2025', 'Nov/Dec 2024'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Compute epsilon-closures for each state',
                                content: 'Determine epsilon-closure(q0) as initial state of DFA.'
                            },
                            {
                                heading: '2. DFA Transition Table Construction',
                                content: 'Compute delta-D(T, a) = epsilon-closure(delta(T, a)) for each newly discovered state set.'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 2,
                unitTitle: 'Regular Languages & Pumping Lemma',
                weightageMarks: 20,
                topics: [
                    'Pumping Lemma for Regular Languages',
                    'Closure properties of Regular Languages (Union, Intersection, Complement)',
                    'Decision properties: Emptiness, Finiteness, Equivalence'
                ],
                isCompleted: false,
                confidenceLevel: 'moderate',
                twoMarks: [
                    {
                        id: 'toc_u2_q1',
                        unitNumber: 2,
                        question: 'State Pumping Lemma for Regular Languages.',
                        conciseAnswer: 'Let L be a regular language. There exists a pumping length p >= 1 such that any string w in L with |w| >= p can be divided into three parts w = xyz satisfying: (1) |y| > 0, (2) |xy| <= p, (3) for all i >= 0, x y^i z is in L.',
                        keyKeywords: ['w = xyz', '|y| > 0', '|xy| <= p', 'x(y^i)z in L for all i >= 0'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: true
                    }
                ],
                bigQuestions: [
                    {
                        id: 'toc_u2_bq1',
                        unitNumber: 2,
                        title: 'Prove using Pumping Lemma that the language L = {0^n 1^n | n >= 1} is not regular.',
                        marks: 13,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Nov/Dec 2024', 'Apr/May 2023'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Assume L is regular by contradiction',
                                content: 'Let p be the pumping length. Choose string w = 0^p 1^p with |w| = 2p >= p.'
                            },
                            {
                                heading: '2. Decompose w = xyz with conditions',
                                content: 'Since |xy| <= p, string y must consist entirely of 0s (y = 0^k where k >= 1).'
                            },
                            {
                                heading: '3. Pump y with i = 0 or i = 2 to derive contradiction',
                                content: 'String x y^2 z has p + k zeros and p ones, so number of 0s != number of 1s. Hence L is not regular.'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 3,
                unitTitle: 'Context-Free Grammars (CFG) & Pushdown Automata (PDA)',
                weightageMarks: 20,
                topics: [
                    'CFG Derivations, Parse Trees, Ambiguity in Grammars',
                    'Simplification of CFG: Elimination of Useless Symbols, Epsilon & Unit Productions',
                    'Chomsky Normal Form (CNF)',
                    'Pushdown Automata (PDA) Definition, Acceptance by Final State vs Empty Stack'
                ],
                isCompleted: false,
                confidenceLevel: 'weak',
                twoMarks: [
                    {
                        id: 'toc_u3_q1',
                        unitNumber: 3,
                        question: 'When is a context-free grammar said to be ambiguous?',
                        conciseAnswer: 'A CFG is ambiguous if there exists at least one string in its language that possesses two or more distinct leftmost derivations, rightmost derivations, or distinct parse trees.',
                        keyKeywords: ['Two or more distinct parse trees', 'Multiple leftmost derivations'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: false
                    }
                ],
                bigQuestions: [
                    {
                        id: 'toc_u3_bq1',
                        unitNumber: 3,
                        title: 'Design a Pushdown Automaton (PDA) for the language L = {w c w^R | w in {a, b}*} and show the instantaneous description (ID) trace for string "abcba".',
                        marks: 13,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Apr/May 2025', 'Nov/Dec 2023'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. PDA State Transition Diagram',
                                content: 'State q0 pushes a and b onto stack until middle marker c is read. On reading c, transition to state q1 without changing stack. State q1 pops matching symbols.'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 4,
                unitTitle: 'Turing Machines & Computability',
                weightageMarks: 20,
                topics: [
                    'Turing Machine (TM) Formal Definition & 7-tuple',
                    'Design of Turing Machine for L = {0^n 1^n 2^n | n >= 1}',
                    'Techniques for TM construction: Storage in state, Multi-track, Subroutines',
                    'Equivalence of One-Tape and Multi-Tape Turing Machines'
                ],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [
                    {
                        id: 'toc_u4_q1',
                        unitNumber: 4,
                        question: 'Define Turing Machine formally.',
                        conciseAnswer: 'A Turing Machine is a 7-tuple M = (Q, Sigma, Gamma, delta, q0, B, F) where Gamma is the tape alphabet, B is the blank symbol, and delta: Q x Gamma -> Q x Gamma x {L, R} is the transition function specifying next state, symbol written, and head direction.',
                        keyKeywords: ['7-tuple (Q, Sigma, Gamma, delta, q0, B, F)', 'delta: Q x Gamma -> Q x Gamma x {L, R}'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: false
                    }
                ],
                bigQuestions: [
                    {
                        id: 'toc_u4_bq1',
                        unitNumber: 4,
                        title: 'Design a Turing Machine to accept the language L = {0^n 1^n 2^n | n >= 1}. Provide transition table and complete state diagram.',
                        marks: 16,
                        frequency: 'High-Yield',
                        previousExamYears: ['Nov/Dec 2024', 'Apr/May 2024'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Algorithm Strategy',
                                content: 'Replace leftmost 0 with X, scan right to replace matching 1 with Y, scan right to replace matching 2 with Z. Rewind back to leftmost unreplaced 0 and repeat.'
                            }
                        ]
                    }
                ]
            },
            {
                unitNumber: 5,
                unitTitle: 'Undecidability & Tractability',
                weightageMarks: 20,
                topics: [
                    'Universal Turing Machine',
                    'Halting Problem of Turing Machine (Undecidability Proof by Diagonalization)',
                    'Post Correspondence Problem (PCP)',
                    'Class P, NP, NP-Complete and NP-Hard problems'
                ],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [
                    {
                        id: 'toc_u5_q1',
                        unitNumber: 5,
                        question: 'What is the Halting Problem of Turing Machine? Is it decidable?',
                        conciseAnswer: 'The Halting Problem asks whether an arbitrary Turing machine M will halt on a given input string w. Alan Turing proved in 1936 that the Halting Problem is strictly Undecidable (no general algorithm can solve it).',
                        keyKeywords: ['Undecidable', 'Alan Turing proof by contradiction/diagonalization'],
                        frequency: 'High (Asked 4+ times)',
                        isMastered: true
                    }
                ],
                bigQuestions: [
                    {
                        id: 'toc_u5_bq1',
                        unitNumber: 5,
                        title: 'Prove that the Halting Problem of Turing Machine is undecidable using diagonalization and proof by contradiction.',
                        marks: 13,
                        frequency: 'Repeated Every Year',
                        previousExamYears: ['Apr/May 2025', 'Nov/Dec 2024'],
                        stepByStepBlueprint: [
                            {
                                heading: '1. Assumption of decider H',
                                content: 'Assume there exists a TM H(M, w) that outputs "HALT" if M halts on w, and "LOOP" otherwise.'
                            },
                            {
                                heading: '2. Construct Adversarial TM D',
                                content: 'Construct machine D with input <M>. D runs H(M, <M>). If H says HALT, D loops infinitely. If H says LOOP, D halts immediately.'
                            },
                            {
                                heading: '3. Diagonal Contradiction with D(<D>)',
                                content: 'Running D(<D>) halts if and only if D(<D>) loops infinitely, a direct logical contradiction. Hence H cannot exist.'
                            }
                        ]
                    }
                ]
            }
        ],
        modelPapers: [
            {
                id: 'mp_cs3452_2025',
                title: 'Anna University April/May 2025 - CS3452 Theory of Computation Model Question Paper',
                yearOrTerm: 'Apr/May 2025',
                pattern: 'Part A (10 x 2 = 20 Marks) + Part B (5 x 13 = 65 Marks) + Part C (1 x 15 = 15 Marks)',
                partAQuestionsCount: 10,
                partBQuestionsCount: 6
            }
        ],
        facultyExamTips: [
            'ðŸ”¥ **Pumping Lemma & Halting Problem Proofs**: These two theorem derivations appear in virtually 100% of University exam papers.',
            'âœï¸ **Transition Tables & Diagrams**: Always write both the transition table matrix AND the bubble state transition graph for Full marks.'
        ]
    },
    {
        id: 'univ_ec3352_dsd',
        subjectCode: 'EC3352',
        subjectName: 'Digital Systems & Computer Architecture',
        universityName: 'Anna University / State Technical University',
        department: 'Electronics & Communication / Electrical Engg',
        semester: 3,
        examDate: '2026-09-24',
        examTime: '10:00 AM - 01:00 PM (Forenoon Session)',
        examHallLocation: 'Examination Block C - Hall 105',
        credits: 4,
        targetGrade: 'O (Outstanding)',
        internalMarksScored: 19,
        totalInternalMarks: 20,
        requiredExternalMarks: 45,
        preparationProgress: 50,
        status: 'in_progress',
        units: [
            {
                unitNumber: 1,
                unitTitle: 'Boolean Algebra, K-Maps & Combinational Logic',
                weightageMarks: 20,
                topics: ['Karnaugh Maps (4 & 5 variables)', 'Full Adder, Carry Look-ahead Adder', 'Multiplexers & Encoders'],
                isCompleted: true,
                confidenceLevel: 'strong',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 2,
                unitTitle: 'Synchronous & Asynchronous Sequential Circuits',
                weightageMarks: 20,
                topics: ['JK, D, T Flip-Flops', 'Synchronous Modulo-N Counters', 'Finite State Machine Design (Mealy vs Moore)'],
                isCompleted: false,
                confidenceLevel: 'moderate',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 3,
                unitTitle: 'Computer Arithmetic & ALU Design',
                weightageMarks: 20,
                topics: ['Booth Multiplication Algorithm for Signed Numbers', 'Restoring & Non-Restoring Division', 'IEEE 754 Floating Point Format'],
                isCompleted: false,
                confidenceLevel: 'weak',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 4,
                unitTitle: 'Pipelining & Instruction Level Parallelism',
                weightageMarks: 20,
                topics: ['5-stage RISC Pipeline', 'Pipeline Hazards: Structural, Data (Forwarding), Control (Branch Prediction)'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 5,
                unitTitle: 'Memory Hierarchy & Cache Mapping',
                weightageMarks: 20,
                topics: ['Direct Mapped, Fully Associative, Set Associative Cache', 'Virtual Memory & Translation Lookaside Buffer (TLB)'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            }
        ],
        modelPapers: [
            {
                id: 'mp_ec3352_2025',
                title: 'University Solved Model Paper - Digital Systems & Architecture',
                yearOrTerm: 'Apr/May 2025',
                pattern: 'Part A (20 Marks) + Part B (65 Marks) + Part C (15 Marks)',
                partAQuestionsCount: 10,
                partBQuestionsCount: 6
            }
        ],
        facultyExamTips: [
            'ðŸ’¡ **Booth Multiplication & 5-Stage Hazard Forwarding**: Practice numerical problem solving for Booth Multiplier step by step with signed 2s complement binary.'
        ]
    },
    {
        id: 'univ_ba7102_fin',
        subjectCode: 'BA7102',
        subjectName: 'Corporate Financial Management & Accounting',
        universityName: 'Delhi University / MBA Department',
        department: 'Management & Commerce',
        semester: 2,
        examDate: '2026-10-02',
        examTime: '10:00 AM - 01:00 PM (Forenoon Session)',
        examHallLocation: 'Main Auditorium Hall A',
        credits: 4,
        targetGrade: 'A+ (Excellent)',
        internalMarksScored: 36,
        totalInternalMarks: 40,
        requiredExternalMarks: 50,
        preparationProgress: 30,
        status: 'in_progress',
        units: [
            {
                unitNumber: 1,
                unitTitle: 'Financial Statements & Ratio Analysis',
                weightageMarks: 20,
                topics: ['Balance Sheet & Profit/Loss Statement', 'Liquidity, Solvency, Profitability & Turnover Ratios', 'DuPont Analysis'],
                isCompleted: true,
                confidenceLevel: 'strong',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 2,
                unitTitle: 'Capital Budgeting & Investment Decisions',
                weightageMarks: 20,
                topics: ['Net Present Value (NPV)', 'Internal Rate of Return (IRR)', 'Profitability Index & Payback Period'],
                isCompleted: false,
                confidenceLevel: 'moderate',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 3,
                unitTitle: 'Cost of Capital & Capital Structure',
                weightageMarks: 20,
                topics: ['Weighted Average Cost of Capital (WACC)', 'Modigliani-Miller (MM) Hypothesis', 'EBIT-EPS Analysis & Financial Leverage'],
                isCompleted: false,
                confidenceLevel: 'weak',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 4,
                unitTitle: 'Working Capital Management',
                weightageMarks: 20,
                topics: ['Operating Cycle & Cash Conversion Cycle', 'Cash Management & Baumol / Miller-Orr Models', 'Inventory Management (EOQ)'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 5,
                unitTitle: 'Dividend Policy & Corporate Valuation',
                weightageMarks: 20,
                topics: ['Walterâ€™s Model & Gordonâ€™s Model of Dividend', 'Dividend Irrelevance (MM Approach)', 'Corporate Valuation using DCF'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            }
        ],
        modelPapers: [
            {
                id: 'mp_ba7102_2025',
                title: 'Master of Business Administration (MBA) Solved Financial Management Exam',
                yearOrTerm: 'May/June 2025',
                pattern: 'Section A (Short Questions) + Section B (Case Study & Problems)',
                partAQuestionsCount: 8,
                partBQuestionsCount: 5
            }
        ],
        facultyExamTips: [
            'ðŸ“Š **NPV vs IRR Conflict**: Be prepared for the 16-mark problem comparing two mutually exclusive projects with different cash flow patterns.'
        ]
    }
];



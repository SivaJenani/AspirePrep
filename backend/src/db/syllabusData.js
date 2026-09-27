"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERIODS_CONFIG = exports.SEED_SYLLABUS_DATABASE = exports.getCurrentPeriodId = void 0;

exports.PERIODS_CONFIG = [
    {
        id: 'period_morning',
        slotNumber: 1,
        name: 'Morning Foundation & Concepts',
        timeRange: '06:00 - 11:00',
        startHour: 6,
        endHour: 11,
        focusCategory: 'Quantitative Aptitude & Core Theory',
        description: 'Peak cognitive focus period. Master mathematical proofs, foundational formulas, and high-difficulty conceptual topics.',
        icon: 'Sunrise',
        color: 'amber',
        recommendedMinutes: 90
    },
    {
        id: 'period_afternoon',
        slotNumber: 2,
        name: 'Afternoon Intensive Problem Solving',
        timeRange: '11:00 - 16:00',
        startHour: 11,
        endHour: 16,
        focusCategory: 'General Intelligence & Reasoning Puzzles',
        description: 'Active problem solving period. Tackle multi-step reasoning puzzles, linear & circular seating, and data interpretation tables.',
        icon: 'Sun',
        color: 'blue',
        recommendedMinutes: 90
    },
    {
        id: 'period_evening',
        slotNumber: 3,
        name: 'Evening Speed Drill & Language',
        timeRange: '16:00 - 20:00',
        startHour: 16,
        endHour: 20,
        focusCategory: 'English Comprehension & Rapid Drills',
        description: 'High-velocity practice period. Spot grammatical errors, cloze tests, vocabulary recall, and timed sectional tests.',
        icon: 'Sunset',
        color: 'emerald',
        recommendedMinutes: 60
    },
    {
        id: 'period_night',
        slotNumber: 4,
        name: 'Night Recall & Flashcard Consolidation',
        timeRange: '20:00 - 23:59',
        startHour: 20,
        endHour: 24,
        focusCategory: 'General Awareness & Formula Revision',
        description: 'Low-friction consolidation period. Review daily mistakes, formula flashcards, static GK facts, and spaced repetition cards.',
        icon: 'Moon',
        color: 'purple',
        recommendedMinutes: 45
    }
];

function getCurrentPeriodId(date = new Date()) {
    const hour = date.getHours();
    if (hour >= 6 && hour < 11) return 'period_morning';
    if (hour >= 11 && hour < 16) return 'period_afternoon';
    if (hour >= 16 && hour < 20) return 'period_evening';
    return 'period_night';
}
exports.getCurrentPeriodId = getCurrentPeriodId;

exports.SEED_SYLLABUS_DATABASE = [
    // ══════════════════════════════════════════════════════════════════════════════
    // SUBJECT 1: QUANTITATIVE APTITUDE (exam_ssc_cgl)
    // ══════════════════════════════════════════════════════════════════════════════
    {
        id: 'syl_ssc_perc',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        subjectName: 'Quantitative Aptitude',
        chapterId: 'chap_arithmetic',
        chapterName: 'Arithmetic & Core Math',
        code: 'QA-101',
        name: 'Percentages & Successive Change',
        weightage: 'High',
        weightagePercent: 12,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '3 to 5 questions',
        difficulty: 'Easy-Medium',
        estimatedMinutes: 60,
        recommendedPeriod: 'period_morning',
        summary: 'Fraction-to-percentage conversion shortcuts, successive percentage adjustments, expenditure vs consumption rules, and population depreciation.',
        keyFormulas: [
            'Successive Change = a + b + (ab / 100)%',
            'If Price ↑ by R%, Consumption must ↓ by [R / (100 + R)] × 100% to keep expenditure constant',
            'Value after n periods with r% growth = P × (1 + r/100)^n',
            '1/6 = 16.67%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/12 = 8.33%'
        ],
        cheatSheetTips: [
            'Always convert percentage figures to fractional equivalents first (e.g. 37.5% = 3/8) to cut calculation steps in half.',
            'For net effect on revenue (Price × Quantity), apply successive change directly: a + b + ab/100.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_perc_1',
                question: 'If the price of petrol increases by 25%, by what percentage should a driver reduce consumption so that the overall expenditure increases by only 10%?',
                options: ['12%', '10%', '15%', '8%'],
                correctAnswer: '12%',
                explanation: 'Let initial Price = 100, Consumption = 100. Initial Expenditure = 10,000. New Price = 125. Target Expenditure = 11,000 (10% increase). New Consumption = 11,000 / 125 = 88. Reduction = 100 - 88 = 12%.',
                shortcutTrick: 'Target ratio = (100 + Exp%) / (100 + Price%) = 110 / 125 = 22/25. Reduction = (3/25) × 100 = 12% in 5 seconds.',
                examYear: 'SSC CGL 2024 Tier-1 Shift 2'
            },
            {
                id: 'pq_syl_perc_2',
                question: 'A student scored 32% marks and failed by 16 marks. Another student scored 45% marks and obtained 23 marks more than the pass mark. Find the maximum marks of the examination.',
                options: ['300', '350', '400', '450'],
                correctAnswer: '300',
                explanation: 'Difference in percentage = 45% - 32% = 13%. Difference in marks = 23 - (-16) = 39 marks. 13% = 39 marks => 1% = 3 marks => 100% = 300 marks.',
                shortcutTrick: 'Total Marks = [(Deficit + Surplus) / (Percentage Diff)] × 100 = [(16 + 23) / 13] × 100 = 300.',
                examYear: 'SSC CGL 2023 Tier-1'
            }
        ]
    },
    {
        id: 'syl_ssc_pl',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        subjectName: 'Quantitative Aptitude',
        chapterId: 'chap_arithmetic',
        chapterName: 'Arithmetic & Core Math',
        code: 'QA-102',
        name: 'Profit, Loss & Dishonest Dealer Discounts',
        weightage: 'High',
        weightagePercent: 14,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '3 to 4 questions',
        difficulty: 'Medium',
        estimatedMinutes: 65,
        recommendedPeriod: 'period_morning',
        summary: 'Cost Price (CP), Selling Price (SP), Marked Price (MP), successive trade discounts, and deceptive weight scale problems.',
        keyFormulas: [
            'Gain% = [(SP - CP) / CP] × 100',
            'Marked Price / Cost Price = (100 + Profit%) / (100 - Discount%)',
            'Equivalent single discount for d1 and d2 = (d1 + d2 - d1×d2 / 100)%',
            'Dishonest Dealer Gain% = [False Weight Error / (Claimed Weight - False Weight Error)] × 100'
        ],
        cheatSheetTips: [
            'When two articles are sold at the same SP, one at x% gain and another at x% loss, there is ALWAYS an overall loss of (x / 10)^2 %.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_pl_1',
                question: 'A shopkeeper marks his goods 40% above the cost price and allows a discount of 25% on the marked price. In addition, he uses a false weight of 800 grams instead of 1 kg. What is his overall net profit percentage?',
                options: ['31.25%', '35%', '28.5%', '40%'],
                correctAnswer: '31.25%',
                explanation: 'Let CP of 1000g = 100. MP = 140. With 25% discount, SP = 140 × 0.75 = 105. But he gives only 800g which cost him 80. Profit = 105 - 80 = 25. Net Gain% = (25 / 80) × 100 = 31.25%.',
                shortcutTrick: 'Net Multiplier = (CP ratio) × (Markup ratio) × (Discount ratio) = (1000/800) × (1.40) × (0.75) = 1.25 × 1.05 = 1.3125 => 31.25% gain.',
                examYear: 'SSC CGL 2024 Tier-2'
            }
        ]
    },
    {
        id: 'syl_ssc_si_ci',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        subjectName: 'Quantitative Aptitude',
        chapterId: 'chap_arithmetic',
        chapterName: 'Arithmetic & Core Math',
        code: 'QA-103',
        name: 'Simple & Compound Interest with Installments',
        weightage: 'High',
        weightagePercent: 10,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '2 to 3 questions',
        difficulty: 'Medium-Hard',
        estimatedMinutes: 60,
        recommendedPeriod: 'period_morning',
        summary: 'Annual, half-yearly, and quarterly compounding; difference between CI and SI for 2 & 3 years; loan installment matrices.',
        keyFormulas: [
            'SI = (P × R × T) / 100',
            'CI - SI for 2 years = P × (R / 100)^2',
            'CI - SI for 3 years = P × (R / 100)^2 × [(300 + R) / 100]',
            'Equal Annual CI Installment X: P = X / (1 + r) + X / (1 + r)^2'
        ],
        cheatSheetTips: [
            'For 2 years at r%, effective CI rate = 2r + r^2/100. For 10%, CI is 21%, SI is 20%, diff is 1% of P.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_sici_1',
                question: 'The difference between compound interest and simple interest on a sum of money at 10% per annum for 3 years is ₹620. What is the principal sum?',
                options: ['₹20,000', '₹22,000', '₹18,000', '₹25,000'],
                correctAnswer: '₹20,000',
                explanation: 'Difference for 3 years = P × (R/100)^2 × [(300 + R)/100]. 620 = P × (1/100) × (310/100) => 620 = P × (31/1000) => P = (620 × 1000) / 31 = ₹20,000.',
                shortcutTrick: '3-yr CI effective rate at 10% = 33.1%. SI = 30%. Difference = 3.1% of P = 620. 1% = 200 => 100% = 20,000.',
                examYear: 'SSC CGL 2023 Tier-1'
            }
        ]
    },
    {
        id: 'syl_ssc_alg',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        subjectName: 'Quantitative Aptitude',
        chapterId: 'chap_algebra',
        chapterName: 'Advanced Mathematics',
        code: 'QA-201',
        name: 'Algebraic Identities & Quadratic Polynomials',
        weightage: 'High',
        weightagePercent: 12,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '3 to 5 questions',
        difficulty: 'Medium-Hard',
        estimatedMinutes: 75,
        recommendedPeriod: 'period_morning',
        summary: 'Polynomial expansions, x + 1/x reciprocal power progressions, symmetrical variable values, remainder theorems.',
        keyFormulas: [
            'If x + 1/x = k, then x^2 + 1/x^2 = k^2 - 2 and x^3 + 1/x^3 = k^3 - 3k',
            'If x + 1/x = 1, then x^3 = -1 and x^6 = 1',
            'If x + 1/x = 2, then x = 1. If x + 1/x = -2, then x = -1',
            'a^3 + b^3 + c^3 - 3abc = (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ca)'
        ],
        cheatSheetTips: [
            'Whenever an equation has 3 variables and only 1 or 2 constraints, assign c = 0 or simplify symmetrically to eliminate terms in seconds.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_alg_1',
                question: 'If x + 1/x = 3, what is the value of x^5 + 1/x^5?',
                options: ['123', '126', '120', '132'],
                correctAnswer: '123',
                explanation: 'x^2 + 1/x^2 = 3^2 - 2 = 7. x^3 + 1/x^3 = 3^3 - 3(3) = 18. (x^2 + 1/x^2)(x^3 + 1/x^3) = x^5 + 1/x^5 + (x + 1/x). 7 × 18 = x^5 + 1/x^5 + 3 => 126 - 3 = 123.',
                shortcutTrick: 'Formula: x^5 + 1/x^5 = (k^2 - 2)(k^3 - 3k) - k = 7 × 18 - 3 = 123.',
                examYear: 'SSC CGL 2024 Tier-1'
            }
        ]
    },
    {
        id: 'syl_ssc_geom',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        subjectName: 'Quantitative Aptitude',
        chapterId: 'chap_geometry',
        chapterName: 'Advanced Mathematics',
        code: 'QA-202',
        name: 'Geometry: Triangles, Circles & Chords',
        weightage: 'High',
        weightagePercent: 15,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '4 to 6 questions',
        difficulty: 'Hard',
        estimatedMinutes: 80,
        recommendedPeriod: 'period_morning',
        summary: 'Incenter, circumcenter, orthocenter, centroid; circle tangent-secant theorems, cyclic quadrilaterals, Apollonius theorem.',
        keyFormulas: [
            'Angle at Incenter = 90° + A/2. Angle at Orthocenter = 180° - A',
            'Tangent-Secant: PT^2 = PA × PB',
            'Intersecting Chords: PA × PB = PC × PD',
            'Inradius of Right Triangle r = (a + b - c) / 2'
        ],
        cheatSheetTips: [
            'In an equilateral triangle with side a: Inradius r = a / (2√3), Circumradius R = a / √3, Ratio R : r is always 2 : 1.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_geo_1',
                question: 'In a circle of radius 10 cm, two parallel chords of lengths 12 cm and 16 cm are drawn on opposite sides of the centre. What is the distance between them?',
                options: ['14 cm', '12 cm', '16 cm', '10 cm'],
                correctAnswer: '14 cm',
                explanation: 'Half-lengths of chords are 6 cm and 8 cm. Distance from centre d1 = √(10^2 - 6^2) = 8 cm. Distance d2 = √(10^2 - 8^2) = 6 cm. Since they are on opposite sides, total distance = 8 + 6 = 14 cm.',
                shortcutTrick: 'Pythagorean triplet (6, 8, 10). When on opposite sides, distance = 8 + 6 = 14 cm.',
                examYear: 'SSC CGL 2024 Tier-1'
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // SUBJECT 2: GENERAL INTELLIGENCE & REASONING (exam_ssc_cgl)
    // ══════════════════════════════════════════════════════════════════════════════
    {
        id: 'syl_ssc_syllo',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_reasoning',
        subjectName: 'General Intelligence & Reasoning',
        chapterId: 'chap_verbal_reasoning',
        chapterName: 'Verbal Logic & Reasoning',
        code: 'RE-101',
        name: 'Syllogisms & 100-50 Deduction Rules',
        weightage: 'High',
        weightagePercent: 10,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '3 to 4 questions',
        difficulty: 'Medium',
        estimatedMinutes: 50,
        recommendedPeriod: 'period_afternoon',
        summary: 'Universal and particular propositions, Venn diagram validations, Either-Or complementary pairs, and Possibility conclusions.',
        keyFormulas: [
            'All A are B (A=100, B=50). Some A are B (A=50, B=50)',
            'No A is B (A=100, B=100). Some A are not B (A=50, B=100)',
            'Two positive statements can NEVER yield a negative definite conclusion',
            'Two negative statements yield NO definite conclusion'
        ],
        cheatSheetTips: [
            'Either-Or Condition Checklist: 1) Both conclusions must be individually false/doubtful. 2) Elements must be identical. 3) One affirmative and one negative (Some + No OR Some + Some Not).'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_re_1',
                question: 'Statements: Some pens are books. All books are pencils. Conclusions: I. Some pens are pencils. II. All pencils are pens.',
                options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
                correctAnswer: 'Only I follows',
                explanation: 'Pens (50) - Books (50) + Books (100) - Pencils (50). Linking term "Books" is distributed (100). Valid conclusion: Some pens are pencils (Pens 50, Pencils 50). Conclusion II claims All pencils (100) are pens, but pencils is only 50 in premises. Hence only I follows.',
                shortcutTrick: 'Some + All => Some. Thus "Some pens are pencils" is directly guaranteed.',
                examYear: 'SSC CGL 2024 Tier-1 Shift 1'
            }
        ]
    },
    {
        id: 'syl_ssc_seating',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_reasoning',
        subjectName: 'General Intelligence & Reasoning',
        chapterId: 'chap_puzzles_seating',
        chapterName: 'Arrangements & Order Logic',
        code: 'RE-102',
        name: 'Linear & Circular Seating Arrangements',
        weightage: 'High',
        weightagePercent: 12,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '3 to 5 questions',
        difficulty: 'Medium-Hard',
        estimatedMinutes: 60,
        recommendedPeriod: 'period_afternoon',
        summary: 'Facing center vs facing outward circular circles, parallel two-row line arrangements, directional orientation traps.',
        keyFormulas: [
            'Facing Center: Left = Clockwise, Right = Counter-Clockwise',
            'Facing Outward: Left = Counter-Clockwise, Right = Clockwise',
            'Linear: North Facing (Left is student left), South Facing (Left is student right)'
        ],
        cheatSheetTips: [
            'Always start with the fixed reference anchor (e.g. "P sits third to the right of Q") rather than conditional guesses.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_seating_1',
                question: 'Eight friends A, B, C, D, E, F, G, and H sit in a circle facing the center. A sits opposite D and third to the right of B. G sits between A and H. F is to the immediate right of D. Who is second to the left of C?',
                options: ['E', 'B', 'H', 'F'],
                correctAnswer: 'E',
                explanation: 'Construct the circle with 8 positions: B at 1, A is third to right => pos 4. D is opposite A => pos 8. F is immediate right of D => pos 7. G is between A and H => pos 3 and 2. The remaining spots fill uniquely showing E is second to left of C.',
                shortcutTrick: 'Place fixed opposites first (A opposite D) to fix 50% of the ring coordinates instantly.',
                examYear: 'SSC CGL 2023 Tier-2'
            }
        ]
    },
    {
        id: 'syl_ssc_coding',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_reasoning',
        subjectName: 'General Intelligence & Reasoning',
        chapterId: 'chap_coding_puzzles',
        chapterName: 'Pattern Decoders',
        code: 'RE-103',
        name: 'Coding-Decoding & Letter Shift Matrices',
        weightage: 'High',
        weightagePercent: 10,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '3 to 4 questions',
        difficulty: 'Easy-Medium',
        estimatedMinutes: 45,
        recommendedPeriod: 'period_afternoon',
        summary: 'Alphabet positional ranks (EJOTY 5-10-15-20-25), reverse pairing (A-Z, B-Y, C-X sum to 27), and word symbol substitutions.',
        keyFormulas: [
            'Forward Ranks: E(5), J(10), O(15), T(20), Y(25)',
            'Opposite Pair Rule: Forward Rank + Reverse Rank = 27 (e.g. D(4) + W(23) = 27)',
            'Shift operations: +1/+2 cross diagonal inversion'
        ],
        cheatSheetTips: [
            'Check for vowel-consonant split patterns if uniform additions (+2 or +3) do not fit immediately.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_code_1',
                question: 'In a code language, GLAMOUR is written as IJCOWST. How is TOPICAL written in that code?',
                options: ['VQRMEDN', 'VQSMEDN', 'UQRMEDN', 'VPRMEDN'],
                correctAnswer: 'VQRMEDN',
                explanation: 'G(+2)->I, L(-2)->J, A(+2)->C, M(-2)->O, O(+2)->Q... Pattern is alternating +2, -2. Applying to TOPICAL: T(+2)->V, O(+2)->Q, P(+2)->R... results in VQRMEDN.',
                shortcutTrick: 'Verify only first and last letters (T+2=V, L+2=N) to eliminate 3 choices in 4 seconds.',
                examYear: 'SSC CGL 2024 Tier-1'
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // SUBJECT 3: ENGLISH COMPREHENSION (exam_ssc_cgl)
    // ══════════════════════════════════════════════════════════════════════════════
    {
        id: 'syl_ssc_grammar',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_english',
        subjectName: 'English Comprehension',
        chapterId: 'chap_grammar',
        chapterName: 'Grammar Foundations',
        code: 'EN-101',
        name: 'Spotting Errors: Subject-Verb & Modifier Rules',
        weightage: 'High',
        weightagePercent: 15,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '4 to 6 questions',
        difficulty: 'Medium',
        estimatedMinutes: 50,
        recommendedPeriod: 'period_evening',
        summary: 'Golden 120 grammar rules: Subject-verb agreement, inverted sentences, either/or proximity, dangling participles, parallel construction.',
        keyFormulas: [
            'Neither...nor / Either...or takes the verb agreeing with the CLOSER subject',
            'As well as / Together with / Along with: Verb agrees with the FIRST subject',
            'Scarcely / Hardly is followed by "when". No sooner is followed by "than"',
            'Lest is ALWAYS followed by "should"'
        ],
        cheatSheetTips: [
            'Phrases like "one of the [plural noun] who/that" take a PLURAL verb because the relative pronoun refers to the plural antecedent.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_eng_1',
                question: 'Identify the error: "Neither the principal (A) nor the teachers (B) was present at the annual convocation (C) No error (D)"',
                options: ['(A)', '(B)', '(C)', '(D)'],
                correctAnswer: '(C)',
                explanation: 'In "Neither...nor", the verb agrees with the closer subject "teachers" (plural). Therefore, "was present" must be replaced with "were present". Error is in part (C).',
                shortcutTrick: 'Proximity rule: Closer subject is "teachers" (plural) => must use "were".',
                examYear: 'SSC CGL 2024 Tier-1'
            }
        ]
    },
    {
        id: 'syl_ssc_cloze',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_english',
        subjectName: 'English Comprehension',
        chapterId: 'chap_rc_cloze',
        chapterName: 'Reading & Context Analysis',
        code: 'EN-102',
        name: 'Cloze Test & Passage Elimination Tactics',
        weightage: 'High',
        weightagePercent: 12,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '5 questions in Tier-1, 10 in Tier-2',
        difficulty: 'Medium',
        estimatedMinutes: 45,
        recommendedPeriod: 'period_evening',
        summary: 'Collocations, prepositional pairings, tone recognition, linking conjunctions (However, Moreover, Notwithstanding).',
        keyFormulas: [
            'Look at the word immediately preceding and following the blank to spot fixed prepositions (e.g. "abide by", "conducive to")',
            'Tone coherence: If paragraph is critical, avoid overly positive adjectives',
            'Tense agreement: Maintain consistent past/present timeframe across clauses'
        ],
        cheatSheetTips: [
            'Read the entire 5-sentence passage without filling anything first to grasp the central thesis.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_eng_2',
                question: 'Choose the most appropriate word: "The minister was accused of being complicit ___ the corrupt land allocation scheme."',
                options: ['in', 'with', 'to', 'for'],
                correctAnswer: 'in',
                explanation: 'The adjective "complicit" takes the fixed preposition "in" when referring to a crime or wrongdoing (complicit in something).',
                shortcutTrick: 'Fixed Collocation: Complicit in crime, compliant with regulations.',
                examYear: 'SSC CGL 2023 Tier-2'
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════════
    // SUBJECT 4: GENERAL AWARENESS (exam_ssc_cgl)
    // ══════════════════════════════════════════════════════════════════════════════
    {
        id: 'syl_ssc_polity',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_gs',
        subjectName: 'General Awareness',
        chapterId: 'chap_polity_cgl',
        chapterName: 'Indian Polity & Constitution',
        code: 'GS-101',
        name: 'Preamble, Fundamental Rights & Key Articles',
        weightage: 'High',
        weightagePercent: 14,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '3 to 5 questions',
        difficulty: 'Medium',
        estimatedMinutes: 45,
        recommendedPeriod: 'period_night',
        summary: 'Articles 12-35 (Fundamental Rights), Writs of Supreme Court & High Courts (Art 32 & 226), Directive Principles (Art 36-51), Constitutional amendments.',
        keyFormulas: [
            'Article 14: Equality before law; Article 17: Abolition of Untouchability',
            'Article 21: Right to Life & Personal Liberty; Article 21A: Right to Education (86th Amend 2002)',
            'Writs (5): Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto',
            'Preamble 42nd Amendment 1976 added: Socialist, Secular, Integrity'
        ],
        cheatSheetTips: [
            'Article 32 is known as "The Heart and Soul of the Constitution" per Dr. B.R. Ambedkar.'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_gs_1',
                question: 'Which constitutional writ literally translates to "We Command" and is issued to secure performance of a public duty?',
                options: ['Mandamus', 'Habeas Corpus', 'Quo-Warranto', 'Certiorari'],
                correctAnswer: 'Mandamus',
                explanation: 'Mandamus means "We Command" in Latin. It is issued by the Supreme Court (Art 32) or High Court (Art 226) commanding a public official or body to perform an official statutory duty.',
                shortcutTrick: 'M-Mandamus = M-Mandate = We Command.',
                examYear: 'SSC CGL 2024 Tier-1'
            }
        ]
    },
    {
        id: 'syl_ssc_rivers',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_gs',
        subjectName: 'General Awareness',
        chapterId: 'chap_geo_cgl',
        chapterName: 'Geography & Environment',
        code: 'GS-102',
        name: 'Indian River Systems, Dams & Biosphere Reserves',
        weightage: 'High',
        weightagePercent: 10,
        examSection: 'Tier-I & Tier-II',
        typicalQuestions: '2 to 3 questions',
        difficulty: 'Easy-Medium',
        estimatedMinutes: 40,
        recommendedPeriod: 'period_night',
        summary: 'Himalayan vs Peninsular river drainage, east-flowing vs west-flowing rivers (Narmada, Tapti), major multipurpose dams, Ramsar wetlands.',
        keyFormulas: [
            'West-flowing major rivers into Arabian Sea: Narmada, Tapti, Mahi, Sabarmati (Mnemonic: SAMANTA)',
            'Hirakud Dam: Mahanadi River (Longest earthen dam)',
            'Tehri Dam: Bhagirathi River (Highest dam in India)',
            'Bhakra Nangal Dam: Sutlej River'
        ],
        cheatSheetTips: [
            'Tributaries of Indus: Jhelum, Chenab, Ravi, Beas, Sutlej (from North to South).'
        ],
        practiceQuestions: [
            {
                id: 'pq_syl_gs_2',
                question: 'Which of the following peninsular rivers flows through a rift valley between the Vindhya and Satpura mountain ranges?',
                options: ['Narmada', 'Godavari', 'Krishna', 'Cauvery'],
                correctAnswer: 'Narmada',
                explanation: 'Narmada originates from Amarkantak plateau in MP and flows westward through a linear tectonic rift valley between the Vindhyan range (North) and Satpura range (South) into the Gulf of Khambhat.',
                shortcutTrick: 'Rift valley west-flow = Narmada & Tapti.',
                examYear: 'SSC CGL 2023 Tier-1'
            }
        ]
    }
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEED_DAILY_CHALLENGE = exports.SEED_MOCK_TESTS = exports.SEED_QUESTIONS = exports.SEED_CONCEPTS = exports.SEED_TOPICS = exports.SEED_CHAPTERS = exports.SEED_SUBJECTS = exports.SEED_EXAMS = void 0;
exports.SEED_EXAMS = [
    {
        id: 'exam_ssc_cgl',
        name: 'SSC CGL',
        slug: 'ssc-cgl',
        category: 'Government Exams',
        description: 'Staff Selection Commission Combined Graduate Level Examination for Group B and Group C posts in Indian Ministries and Departments.',
        icon: 'Landmark',
        pattern: {
            totalMarks: 200,
            durationMinutes: 60,
            totalQuestions: 100,
            negativeMarkingRatio: 0.5,
            sections: [
                { name: 'Quantitative Aptitude', questionsCount: 25, marks: 50, durationMinutes: 15 },
                { name: 'General Intelligence & Reasoning', questionsCount: 25, marks: 50, durationMinutes: 15 },
                { name: 'English Comprehension', questionsCount: 25, marks: 50, durationMinutes: 15 },
                { name: 'General Awareness', questionsCount: 25, marks: 50, durationMinutes: 15 }
            ]
        },
        eligibility: 'Bachelor’s Degree in any discipline from a recognized University. Age: 18–32 years.',
        syllabusSummary: 'Tier 1 covers Quantitative Aptitude, General Intelligence & Reasoning, English Comprehension, and General Studies.',
        mockTestsCount: 18,
        totalQuestionsCount: 450,
        isPopular: true,
        isFeatured: true,
        upcomingDate: '2026-09-15',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: 'exam_upsc_cse',
        name: 'UPSC Civil Services',
        slug: 'upsc-cse',
        category: 'Government Exams',
        description: 'Union Public Service Commission Civil Services Examination (IAS/IPS/IFS) preliminary & mains examination.',
        icon: 'Award',
        pattern: {
            totalMarks: 200,
            durationMinutes: 120,
            totalQuestions: 100,
            negativeMarkingRatio: 0.33,
            sections: [
                { name: 'Indian Polity & Governance', questionsCount: 25, marks: 50 },
                { name: 'History & Culture', questionsCount: 25, marks: 50 },
                { name: 'Economy & Environment', questionsCount: 25, marks: 50 },
                { name: 'General Science & Tech', questionsCount: 25, marks: 50 }
            ]
        },
        eligibility: 'Graduation in any stream. Age: 21–32 years with category relaxations.',
        syllabusSummary: 'General Studies Paper 1 covering Indian Polity, History, Geography, Economics, Environment, and Current Affairs.',
        mockTestsCount: 14,
        totalQuestionsCount: 320,
        isPopular: true,
        isFeatured: true,
        upcomingDate: '2026-10-04',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: 'exam_ibps_po',
        name: 'IBPS PO',
        slug: 'ibps-po',
        category: 'Banking Exams',
        description: 'Institute of Banking Personnel Selection Probationary Officer / Management Trainee preliminary & mains exam.',
        icon: 'Building2',
        pattern: {
            totalMarks: 100,
            durationMinutes: 60,
            totalQuestions: 100,
            negativeMarkingRatio: 0.25,
            sections: [
                { name: 'Quantitative Aptitude', questionsCount: 35, marks: 35, durationMinutes: 20 },
                { name: 'Reasoning Ability', questionsCount: 35, marks: 35, durationMinutes: 20 },
                { name: 'English Language', questionsCount: 30, marks: 30, durationMinutes: 20 }
            ]
        },
        eligibility: 'Degree in any discipline from a recognized University. Age: 20–30 years.',
        syllabusSummary: 'Sectionally timed exam covering Data Interpretation, Arithmetic, Puzzles, Syllogisms, and Grammar.',
        mockTestsCount: 15,
        totalQuestionsCount: 380,
        isPopular: true,
        isFeatured: true,
        upcomingDate: '2026-10-18',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: 'exam_tnpsc_group4',
        name: 'TNPSC Group 4',
        slug: 'tnpsc-group-4',
        category: 'State Government Exams',
        description: 'Tamil Nadu Public Service Commission Combined Civil Services Examination - IV (VAO, Junior Assistant, Typist).',
        icon: 'FileText',
        pattern: {
            totalMarks: 300,
            durationMinutes: 180,
            totalQuestions: 200,
            negativeMarkingRatio: 0,
            sections: [
                { name: 'General Tamil / English', questionsCount: 100, marks: 150 },
                { name: 'General Studies', questionsCount: 75, marks: 112.5 },
                { name: 'Aptitude & Mental Ability', questionsCount: 25, marks: 37.5 }
            ]
        },
        eligibility: 'SSLC (10th Standard) pass. Age: 18–32+ years.',
        syllabusSummary: 'Covers General Studies (Polity, History, TN History & Culture) and Aptitude and Mental Ability.',
        mockTestsCount: 12,
        totalQuestionsCount: 290,
        isPopular: true,
        isFeatured: false,
        upcomingDate: '2026-11-12',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: 'exam_rrb_ntpc',
        name: 'RRB NTPC',
        slug: 'rrb-ntpc',
        category: 'Railway Exams',
        description: 'Railway Recruitment Board Non-Technical Popular Categories examination for Station Master, Goods Guard, Clerk.',
        icon: 'Train',
        pattern: {
            totalMarks: 100,
            durationMinutes: 90,
            totalQuestions: 100,
            negativeMarkingRatio: 0.33,
            sections: [
                { name: 'General Awareness', questionsCount: 40, marks: 40 },
                { name: 'Mathematics', questionsCount: 30, marks: 30 },
                { name: 'General Intelligence & Reasoning', questionsCount: 30, marks: 30 }
            ]
        },
        eligibility: '12th pass or Graduate based on specific post. Age: 18–33 years.',
        syllabusSummary: 'CBT Stage 1 testing Mathematics, Reasoning, and General Awareness.',
        mockTestsCount: 10,
        totalQuestionsCount: 240,
        isPopular: false,
        isFeatured: false,
        upcomingDate: '2026-12-05',
        createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
        id: 'exam_jee_main',
        name: 'JEE Main',
        slug: 'jee-main',
        category: 'Engineering Entrance',
        description: 'National Testing Agency Joint Entrance Examination for admission into NITs, IIITs, and eligibility for JEE Advanced.',
        icon: 'Atom',
        pattern: {
            totalMarks: 300,
            durationMinutes: 180,
            totalQuestions: 75,
            negativeMarkingRatio: 0.25,
            sections: [
                { name: 'Physics', questionsCount: 25, marks: 100 },
                { name: 'Chemistry', questionsCount: 25, marks: 100 },
                { name: 'Mathematics', questionsCount: 25, marks: 100 }
            ]
        },
        eligibility: '10+2 with Physics, Chemistry, and Mathematics.',
        syllabusSummary: 'Class 11 and 12 syllabus across Physics, Chemistry, and Mathematics.',
        mockTestsCount: 16,
        totalQuestionsCount: 310,
        isPopular: true,
        isFeatured: false,
        upcomingDate: '2027-01-24',
        createdAt: '2026-01-01T00:00:00.000Z'
    }
];
exports.SEED_SUBJECTS = [
    // SSC CGL Subjects
    {
        id: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Quantitative Aptitude',
        icon: 'Calculator',
        description: 'Arithmetic, Algebra, Geometry, Trigonometry, and Data Interpretation.',
        order: 1,
        chaptersCount: 6,
        completionRate: 68,
        accuracyRate: 74
    },
    {
        id: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'General Intelligence & Reasoning',
        icon: 'Brain',
        description: 'Verbal, Non-Verbal, Analogies, Syllogisms, Coding-Decoding, and Puzzles.',
        order: 2,
        chaptersCount: 5,
        completionRate: 82,
        accuracyRate: 88
    },
    {
        id: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'English Comprehension',
        icon: 'BookOpen',
        description: 'Grammar, Vocabulary, Spotting Errors, Cloze Test, and Reading Comprehension.',
        order: 3,
        chaptersCount: 4,
        completionRate: 55,
        accuracyRate: 62
    },
    {
        id: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'General Awareness',
        icon: 'Globe',
        description: 'History, Indian Polity, Geography, Economics, General Science, and Current Affairs.',
        order: 4,
        chaptersCount: 5,
        completionRate: 40,
        accuracyRate: 54
    },
    // UPSC Subjects
    {
        id: 'sub_upsc_polity',
        examId: 'exam_upsc_cse',
        name: 'Indian Polity & Constitution',
        icon: 'Scale',
        description: 'Preamble, Fundamental Rights, Parliament, Judiciary, Constitutional Bodies.',
        order: 1,
        chaptersCount: 6,
        completionRate: 70,
        accuracyRate: 78
    },
    {
        id: 'sub_upsc_history',
        examId: 'exam_upsc_cse',
        name: 'Indian History & Art & Culture',
        icon: 'Landmark',
        description: 'Ancient, Medieval, Modern Freedom Struggle, and Art Forms.',
        order: 2,
        chaptersCount: 5,
        completionRate: 50,
        accuracyRate: 65
    },
    // Banking Subjects
    {
        id: 'sub_bank_quant',
        examId: 'exam_ibps_po',
        name: 'Quantitative Aptitude',
        icon: 'Percent',
        description: 'Data Interpretation, Quadratic Equations, Number Series, Simplification.',
        order: 1,
        chaptersCount: 5,
        completionRate: 60,
        accuracyRate: 70
    },
    {
        id: 'sub_bank_reasoning',
        examId: 'exam_ibps_po',
        name: 'Reasoning Ability',
        icon: 'Workflow',
        description: 'Seating Arrangement, Floor Puzzles, Syllogisms, Inequalities.',
        order: 2,
        chaptersCount: 5,
        completionRate: 75,
        accuracyRate: 85
    }
];
exports.SEED_CHAPTERS = [
    // Quant Chapters for SSC CGL
    {
        id: 'chap_arithmetic',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Arithmetic Math',
        order: 1,
        description: 'Core arithmetic foundations: Percentages, Profit & Loss, Ratio, Time & Work',
        topicsCount: 5
    },
    {
        id: 'chap_algebra',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Advanced Algebra',
        order: 2,
        description: 'Polynomial identities, factorisation, linear & quadratic equations',
        topicsCount: 3
    },
    {
        id: 'chap_geometry',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Geometry & Mensuration',
        order: 3,
        description: 'Triangles, circles, chords, prisms, 2D and 3D area/volume',
        topicsCount: 4
    },
    {
        id: 'chap_trig',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Trigonometry & Heights & Distances',
        order: 4,
        description: 'Trigonometric identities, complementary angles, height & distance models',
        topicsCount: 3
    },
    {
        id: 'chap_number_systems',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Number Systems & Surds',
        order: 5,
        description: 'Divisibility rules, unit digit, remainder theorems, surds and indices',
        topicsCount: 3
    },
    {
        id: 'chap_di_stats',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Data Interpretation & Statistics',
        order: 6,
        description: 'Histograms, pie charts, bar graphs, mean, median, mode, standard deviation',
        topicsCount: 3
    },
    // Reasoning Chapters for SSC CGL
    {
        id: 'chap_verbal_reasoning',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Verbal Logic & Syllogisms',
        order: 1,
        description: 'Statements, assumptions, Venn diagram conclusions, syllogisms',
        topicsCount: 3
    },
    {
        id: 'chap_coding_puzzles',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Coding-Decoding & Relations',
        order: 2,
        description: 'Alphabet patterns, blood relations, direction sense, matrix',
        topicsCount: 4
    },
    {
        id: 'chap_puzzles_seating',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Puzzles & Seating Arrangements',
        order: 3,
        description: 'Linear & circular seating, order & ranking, floor puzzles',
        topicsCount: 3
    },
    {
        id: 'chap_non_verbal',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Non-Verbal & Pattern Completion',
        order: 4,
        description: 'Mirror & water images, paper folding, embedded figures, cubes & dice',
        topicsCount: 4
    },
    // English Chapters for SSC CGL
    {
        id: 'chap_grammar',
        subjectId: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'English Grammar & Usage',
        order: 1,
        description: 'Subject-verb agreement, tenses, prepositions, modifiers',
        topicsCount: 4
    },
    {
        id: 'chap_vocab',
        subjectId: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'Vocabulary, Idioms & Phrases',
        order: 2,
        description: 'Synonyms, antonyms, one-word substitution, idioms & phrasal verbs',
        topicsCount: 4
    },
    {
        id: 'chap_rc_cloze',
        subjectId: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'Comprehension & Cloze Test',
        order: 3,
        description: 'Reading comprehension passages, cloze test, para jumbles',
        topicsCount: 3
    },
    {
        id: 'chap_voice_narration',
        subjectId: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'Active-Passive & Direct-Indirect Speech',
        order: 4,
        description: 'Voice transformations and reported speech rules for Tier 2',
        topicsCount: 2
    },
    // General Awareness Chapters for SSC CGL
    {
        id: 'chap_polity_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'Indian Polity & Constitution',
        order: 1,
        description: 'Constitution, Fundamental Rights, Parliament, Judiciary, Constitutional Bodies',
        topicsCount: 4
    },
    {
        id: 'chap_history_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'Indian History & Freedom Movement',
        order: 2,
        description: 'Ancient Indus/Vedic, Medieval Dynasties, 1857 Revolt, Freedom Struggle',
        topicsCount: 4
    },
    {
        id: 'chap_geo_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'Geography & Environment',
        order: 3,
        description: 'River systems, climate & monsoon, national parks, solar system',
        topicsCount: 3
    },
    {
        id: 'chap_eco_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'Economy & Static GK',
        order: 4,
        description: 'National income, Union Budget, Five Year Plans, dances & festivals, sports',
        topicsCount: 4
    }
];
exports.SEED_TOPICS = [
    // Arithmetic Topics
    {
        id: 'top_percentage',
        chapterId: 'chap_arithmetic',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Percentage & Successive Change',
        weightage: 'High',
        weightagePercent: 12,
        difficultyLevel: 'easy',
        keyFormulas: [
            'Percentage Increase = (Increase / Original Value) × 100',
            'Successive Percentage Change = a + b + (ab / 100)%',
            'If price increases by R%, consumption reduction = [R / (100 + R)] × 100%'
        ],
        summary: 'Master fractional conversion shortcuts (1/7 = 14.28%, 1/8 = 12.5%, 1/12 = 8.33%) and successive change formulas.',
        questionsCount: 45,
        isWeak: false,
        accuracyRate: 84,
        attemptsCount: 32
    },
    {
        id: 'top_profit_loss',
        chapterId: 'chap_arithmetic',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Profit, Loss & Discount',
        weightage: 'High',
        weightagePercent: 14,
        difficultyLevel: 'medium',
        keyFormulas: [
            'Gain% = (Gain / CP) × 100',
            'SP = CP × (100 + Gain%) / 100',
            'Marked Price / CP = (100 + Profit%) / (100 - Discount%)',
            'Dishonest Dealer Profit% = [Error / (True Weight - Error)] × 100%'
        ],
        summary: 'Concepts of Cost Price, Selling Price, Marked Price, and Dishonest Dealer problems.',
        questionsCount: 40,
        isWeak: true,
        accuracyRate: 52,
        attemptsCount: 25
    },
    {
        id: 'top_ratio_proportion',
        chapterId: 'chap_arithmetic',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Ratio, Proportion & Mixture',
        weightage: 'High',
        weightagePercent: 10,
        difficultyLevel: 'easy',
        keyFormulas: [
            'Mean Proportional between a and b = √(ab)',
            'Third Proportional to a and b = b² / a',
            'Alligation Rule: (Cheaper Qty / Dearer Qty) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price)'
        ],
        summary: 'Includes compounding ratios, age problems, partnership shares, and alligation mixtures.',
        questionsCount: 35,
        isWeak: false,
        accuracyRate: 76,
        attemptsCount: 20
    },
    {
        id: 'top_time_work',
        chapterId: 'chap_arithmetic',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Time, Work & Pipes-Cisterns',
        weightage: 'Medium',
        weightagePercent: 10,
        difficultyLevel: 'medium',
        keyFormulas: [
            'Work = Efficiency × Time',
            'If A does work in x days and B in y days, together = (xy) / (x + y) days',
            'M1 × D1 × H1 / W1 = M2 × D2 × H2 / W2'
        ],
        summary: 'Unitary and LCM efficiency methods for solving group work and alternating work hours.',
        questionsCount: 30,
        isWeak: true,
        accuracyRate: 48,
        attemptsCount: 19
    },
    {
        id: 'top_si_ci',
        chapterId: 'chap_arithmetic',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Simple & Compound Interest',
        weightage: 'High',
        weightagePercent: 8,
        difficultyLevel: 'hard',
        keyFormulas: [
            'SI = (P × R × T) / 100',
            'CI = P × [ (1 + R/100)^T - 1 ]',
            'Difference between CI and SI for 2 years = P × (R / 100)²'
        ],
        summary: 'Tree method for CI calculations, installment problems, and 2-year/3-year CI-SI differences.',
        questionsCount: 32,
        isWeak: true,
        accuracyRate: 55,
        attemptsCount: 21
    },
    // Algebra & Geometry Topics
    {
        id: 'top_algebra_identities',
        chapterId: 'chap_algebra',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Algebraic Identities & Values',
        weightage: 'High',
        weightagePercent: 10,
        difficultyLevel: 'medium',
        keyFormulas: [
            'If x + 1/x = k, then x² + 1/x² = k² - 2',
            'If x + 1/x = k, then x³ + 1/x³ = k³ - 3k',
            'If a + b + c = 0, then a³ + b³ + c³ = 3abc'
        ],
        summary: 'Master symmetrical substitutions, factoring cubic equations, and standard reciprocal patterns.',
        questionsCount: 38,
        isWeak: false,
        accuracyRate: 78,
        attemptsCount: 26
    },
    {
        id: 'top_geometry_triangles',
        chapterId: 'chap_geometry',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Triangles & Similarity Theorems',
        weightage: 'High',
        weightagePercent: 12,
        difficultyLevel: 'hard',
        keyFormulas: [
            'Incentre Angle = 90° + ∠A / 2',
            'Circumcentre Angle = 2 × ∠A',
            'Apollonius Theorem: AB² + AC² = 2(AD² + BD²)'
        ],
        summary: 'Centres of triangles, similarity criteria, and internal angle bisector theorem.',
        questionsCount: 36,
        isWeak: true,
        accuracyRate: 50,
        attemptsCount: 22
    },
    {
        id: 'top_trigonometry',
        chapterId: 'chap_trig',
        subjectId: 'sub_ssc_quant',
        examId: 'exam_ssc_cgl',
        name: 'Trigonometric Ratios & Maximum-Minimum',
        weightage: 'High',
        weightagePercent: 8,
        difficultyLevel: 'medium',
        keyFormulas: [
            'sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ',
            'Max value of a sinθ + b cosθ = √(a² + b²), Min = -√(a² + b²)'
        ],
        summary: 'Standard angle values (0°, 30°, 45°, 60°, 90°) and angle-sum transformations.',
        questionsCount: 30,
        isWeak: false,
        accuracyRate: 82,
        attemptsCount: 20
    },
    // Reasoning Topics
    {
        id: 'top_syllogisms',
        chapterId: 'chap_verbal_reasoning',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Syllogisms & Venn Diagrams',
        weightage: 'High',
        weightagePercent: 12,
        difficultyLevel: 'medium',
        keyFormulas: [
            '"Only a few A are B" means Some A are B and Some A are not B',
            '"All A can never be B" is a definite conclusion, not a possibility'
        ],
        summary: 'Standard categorical propositions, 100-50 method vs minimum overlapping Venn circles.',
        questionsCount: 38,
        isWeak: false,
        accuracyRate: 92,
        attemptsCount: 28
    },
    {
        id: 'top_coding_decoding',
        chapterId: 'chap_coding_puzzles',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Coding-Decoding & Letter Shifts',
        weightage: 'High',
        weightagePercent: 10,
        difficultyLevel: 'easy',
        keyFormulas: [
            'Opposite Letter Pairs: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N (Sum = 27)',
            'EJOTY rule for positional values (5, 10, 15, 20, 25)'
        ],
        summary: 'Letter positioning, cross shifting, reverse alphabet coding, and matrix codes.',
        questionsCount: 35,
        isWeak: false,
        accuracyRate: 88,
        attemptsCount: 22
    },
    {
        id: 'top_blood_relations',
        chapterId: 'chap_coding_puzzles',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Blood Relations & Direction Sense',
        weightage: 'Medium',
        weightagePercent: 8,
        difficultyLevel: 'easy',
        keyFormulas: [
            'Family Tree: Males (+), Females (-), Siblings (=), Couples (↔)',
            'Pythagoras Theorem for distance: Distance = √(Δx² + Δy²)'
        ],
        summary: 'Coded relations (A+B means A is father of B), pointing to photographs, and cardinal direction turns.',
        questionsCount: 28,
        isWeak: false,
        accuracyRate: 85,
        attemptsCount: 18
    },
    {
        id: 'top_seating_arrangement',
        chapterId: 'chap_puzzles_seating',
        subjectId: 'sub_ssc_reasoning',
        examId: 'exam_ssc_cgl',
        name: 'Linear & Circular Seating Puzzles',
        weightage: 'High',
        weightagePercent: 10,
        difficultyLevel: 'hard',
        keyFormulas: [
            'Facing Center: Left is clockwise, Right is anti-clockwise',
            'Facing Outside: Left is anti-clockwise, Right is clockwise'
        ],
        summary: '8-person circular tables, linear north/south facing rows, and ranking order.',
        questionsCount: 32,
        isWeak: true,
        accuracyRate: 64,
        attemptsCount: 24
    },
    // English Topics
    {
        id: 'top_spotting_errors',
        chapterId: 'chap_grammar',
        subjectId: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'Spotting Errors & Subject-Verb Agreement',
        weightage: 'High',
        weightagePercent: 14,
        difficultyLevel: 'medium',
        keyFormulas: [
            'Either/Or, Neither/Nor: Verb agrees with the nearest subject',
            'As well as, Along with, Together with: Verb agrees with the FIRST subject',
            'One of the + Plural Noun + Singular Verb (unless preceded by "who/which")'
        ],
        summary: 'Common grammatical traps tested in SSC Tier 1 and IBPS English section.',
        questionsCount: 42,
        isWeak: true,
        accuracyRate: 56,
        attemptsCount: 30
    },
    {
        id: 'top_idioms_phrases',
        chapterId: 'chap_vocab',
        subjectId: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'Idioms, Phrases & One Word Substitutes',
        weightage: 'High',
        weightagePercent: 12,
        difficultyLevel: 'medium',
        keyFormulas: [
            'Root Word Method: Phil (Love), Mis (Hate), Pathy (Feeling), Poly (Many)',
            'High-frequency official SSC repeating list of 500 idioms'
        ],
        summary: 'High-yield idioms tested in Tier 1 and Tier 2 with figurative context.',
        questionsCount: 48,
        isWeak: false,
        accuracyRate: 74,
        attemptsCount: 35
    },
    {
        id: 'top_cloze_test',
        chapterId: 'chap_rc_cloze',
        subjectId: 'sub_ssc_english',
        examId: 'exam_ssc_cgl',
        name: 'Cloze Test & Para Jumbles',
        weightage: 'High',
        weightagePercent: 10,
        difficultyLevel: 'hard',
        keyFormulas: [
            'Identify the overall tone of passage (positive/negative/neutral)',
            'Look for pronoun antecedent references (He/They/It) to link sentences in Para Jumbles'
        ],
        summary: 'Contextual vocabulary insertion and logical sentence sequencing.',
        questionsCount: 35,
        isWeak: true,
        accuracyRate: 60,
        attemptsCount: 22
    },
    // General Awareness Topics
    {
        id: 'top_indian_constitution',
        chapterId: 'chap_polity_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'Constitution & Fundamental Rights',
        weightage: 'High',
        weightagePercent: 14,
        difficultyLevel: 'medium',
        keyFormulas: [
            'Part III (Articles 12 to 35): Fundamental Rights',
            'Article 32: Constitutional Remedies (Heart & Soul of Constitution)',
            'Writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto'
        ],
        summary: 'Fundamental Rights, DPSP (Part IV), Fundamental Duties (Article 51A), and Key Constitutional Amendments.',
        questionsCount: 40,
        isWeak: true,
        accuracyRate: 50,
        attemptsCount: 24
    },
    {
        id: 'top_modern_history',
        chapterId: 'chap_history_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'Freedom Struggle & National Movement',
        weightage: 'High',
        weightagePercent: 10,
        difficultyLevel: 'easy',
        keyFormulas: [
            '1857: First War of Independence; 1885: INC Formation; 1905: Bengal Partition',
            '1920: Non-Cooperation; 1930: Civil Disobedience & Dandi March; 1942: Quit India'
        ],
        summary: 'Important Governor-Generals, Congress sessions, Gandhian movements, and revolutionary leaders.',
        questionsCount: 38,
        isWeak: false,
        accuracyRate: 70,
        attemptsCount: 25
    },
    {
        id: 'top_indian_geography',
        chapterId: 'chap_geo_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'River Systems, Dams & National Parks',
        weightage: 'Medium',
        weightagePercent: 8,
        difficultyLevel: 'medium',
        keyFormulas: [
            'East Flowing Rivers: Ganga, Brahmaputra, Mahanadi, Godavari, Krishna, Cauvery (Drain in Bay of Bengal)',
            'West Flowing Rivers: Narmada, Tapti, Sabarmati, Mahi (Drain in Arabian Sea, form Estuaries)'
        ],
        summary: 'Himalayan and Peninsular river drainage, major multipurpose dams, and biosphere reserves.',
        questionsCount: 32,
        isWeak: false,
        accuracyRate: 68,
        attemptsCount: 20
    },
    {
        id: 'top_static_gk',
        chapterId: 'chap_eco_cgl',
        subjectId: 'sub_ssc_gs',
        examId: 'exam_ssc_cgl',
        name: 'Classical Dances, Festivals & Awards',
        weightage: 'High',
        weightagePercent: 12,
        difficultyLevel: 'medium',
        keyFormulas: [
            '8 Classical Dances: Bharatanatyam (TN), Kathak (UP), Kathakali (Kerala), Mohiniyattam (Kerala), Kuchipudi (AP), Odissi (Odisha), Manipuri (Manipur), Sattriya (Assam)'
        ],
        summary: 'State festivals, musical instruments & famous exponents, Nobel and Bharat Ratna recipients.',
        questionsCount: 45,
        isWeak: false,
        accuracyRate: 72,
        attemptsCount: 30
    }
];
exports.SEED_CONCEPTS = [
    {
        id: 'conc_percentage_basics',
        topicId: 'top_percentage',
        title: 'Percentage Fraction Equivalence & Multipliers',
        theory: `The percentage concept is the foundational cornerstone of all arithmetic math. Translating percentages into simplest fractional fractions reduces calculations to single-step multiplications.
    
Key Fraction Chart:
- 1/2 = 50%
- 1/3 = 33.33%
- 1/4 = 25%
- 1/5 = 20%
- 1/6 = 16.66% (16 2/3%)
- 1/7 = 14.28% (14 2/7%)
- 1/8 = 12.5%
- 1/9 = 11.11%
- 1/11 = 9.09%
- 1/12 = 8.33%`,
        formulas: [
            'Fraction to Percentage: Multiply by 100',
            'Percentage to Fraction: Divide by 100',
            'Net Multiplier for x% increase = (1 + x/100)'
        ],
        examples: [
            {
                question: 'If the price of sugar rises by 25%, by how much percentage must a household reduce its consumption so as not to increase the expenditure?',
                solution: 'Let initial price = 100, new price = 125. Reduction needed = 25 on 125. (25/125) × 100 = 20% reduction.',
                shortcutTip: 'Formula shortcut: [R / (100 + R)] × 100 = [25 / 125] × 100 = 20%.'
            }
        ],
        keyTakeaways: [
            'Expenditure = Price × Consumption. If Expenditure is constant, Price is inversely proportional to Consumption.',
            'A percentage increase of 1/x corresponds to a required decrease of 1/(x + 1) to restore original value.'
        ]
    },
    {
        id: 'conc_fundamental_rights',
        topicId: 'top_indian_constitution',
        title: 'Fundamental Rights (Articles 12-35)',
        theory: `Fundamental Rights are enshrined in Part III of the Indian Constitution (Articles 12 to 35). They are justiciable in nature, meaning they are enforceable by the Courts. Dr. B.R. Ambedkar termed Article 32 as the "Heart and Soul of the Constitution".

Classification of Fundamental Rights:
1. Right to Equality (Articles 14–18)
2. Right to Freedom (Articles 19–22)
3. Right against Exploitation (Articles 23–24)
4. Right to Freedom of Religion (Articles 25–28)
5. Cultural and Educational Rights (Articles 29–30)
6. Right to Constitutional Remedies (Article 32)`,
        formulas: [
            'Article 14: Equality before law and equal protection of laws',
            'Article 17: Abolition of Untouchability',
            'Article 21: Protection of life and personal liberty',
            'Article 21A: Right to free and compulsory education (86th Amendment, 2002)'
        ],
        examples: [
            {
                question: 'Under which Article can an Indian citizen directly approach the Supreme Court for enforcement of Fundamental Rights?',
                solution: 'Article 32 empowers an individual to approach the Supreme Court directly via constitutional writs.',
                shortcutTip: 'Remember: Supreme Court writ jurisdiction is Article 32; High Court writ jurisdiction is Article 226.'
            }
        ],
        keyTakeaways: [
            'Fundamental rights are not absolute but qualified (subject to reasonable restrictions).',
            'Articles 20 and 21 cannot be suspended even during a National Emergency under Article 352.'
        ]
    }
];
exports.SEED_QUESTIONS = [
    // 1. Percentage Question
    {
        id: 'q_quant_01',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        chapterId: 'chap_arithmetic',
        topicId: 'top_percentage',
        questionText: 'A number is first increased by 20% and then decreased by 15%. What is the net percentage change in the number?',
        options: [
            { id: 'opt_1', text: '2% increase', isCorrect: true },
            { id: 'opt_2', text: '5% increase', isCorrect: false },
            { id: 'opt_3', text: '2% decrease', isCorrect: false },
            { id: 'opt_4', text: 'No change', isCorrect: false }
        ],
        correctOptionId: 'opt_1',
        explanation: 'Using the successive percentage change formula:\nNet Change = a + b + (ab / 100)%\nHere, a = +20% and b = -15%\nNet Change = 20 - 15 + (20 × -15)/100 = 5 - 3 = +2%.\nSince the result is positive, it is a 2% increase.',
        shortcutTip: 'Formula: a + b + (ab/100). Quick mental math: 20 - 15 - 3 = +2%.',
        difficulty: 'easy',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2024,
        source: 'SSC CGL 2024 Tier-1 (Shift 2)',
        tags: ['Percentage', 'Successive Change', 'Arithmetic'],
        isPYQ: true,
        isPublished: true
    },
    // 2. Profit & Loss Question
    {
        id: 'q_quant_02',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        chapterId: 'chap_arithmetic',
        topicId: 'top_profit_loss',
        questionText: 'A shopkeeper marks his goods 40% above the cost price and allows a discount of 25% on the marked price. Find his profit or loss percentage.',
        options: [
            { id: 'opt_1', text: '5% Profit', isCorrect: true },
            { id: 'opt_2', text: '10% Profit', isCorrect: false },
            { id: 'opt_3', text: '5% Loss', isCorrect: false },
            { id: 'opt_4', text: '15% Profit', isCorrect: false }
        ],
        correctOptionId: 'opt_1',
        explanation: 'Let Cost Price (CP) = 100.\nMarked Price (MP) = 100 + 40% of 100 = 140.\nDiscount allowed = 25% on MP = 0.25 × 140 = 35.\nSelling Price (SP) = MP - Discount = 140 - 35 = 105.\nProfit = SP - CP = 105 - 100 = 5.\nProfit% = (5 / 100) × 100 = 5% Profit.',
        shortcutTip: 'Net = MarkUp - Discount - (MarkUp × Discount / 100) = 40 - 25 - (40 × 25 / 100) = 15 - 10 = +5%.',
        difficulty: 'medium',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2024,
        source: 'SSC CGL 2024 Tier-1',
        tags: ['Profit Loss', 'Discount', 'Marked Price'],
        isPYQ: true,
        isPublished: true
    },
    // 3. Ratio & Proportion Question
    {
        id: 'q_quant_03',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        chapterId: 'chap_arithmetic',
        topicId: 'top_ratio_proportion',
        questionText: 'The ratio of income of A and B is 5 : 4 and the ratio of their expenditure is 3 : 2. If each saves ₹1600 at the end of the month, what is the income of A?',
        options: [
            { id: 'opt_1', text: '₹3,200', isCorrect: false },
            { id: 'opt_2', text: '₹4,000', isCorrect: true },
            { id: 'opt_3', text: '₹4,800', isCorrect: false },
            { id: 'opt_4', text: '₹5,000', isCorrect: false }
        ],
        correctOptionId: 'opt_2',
        explanation: 'Income ratio = 5 : 4\nExpenditure ratio = 3 : 2\nDifference in income and expenditure units for A = 5 - 3 = 2 units.\nDifference for B = 4 - 2 = 2 units.\nSince the unit difference is equal to the savings:\n2 units = ₹1600 ⇒ 1 unit = ₹800.\nIncome of A = 5 units = 5 × 800 = ₹4,000.',
        shortcutTip: 'Equal savings trick: Unit gap in income and expenditure is identical (2 units = 1600, 1 unit = 800, A = 5 × 800 = 4000).',
        difficulty: 'easy',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2023,
        source: 'SSC CGL 2023 Tier-1',
        tags: ['Ratio', 'Income Expenditure', 'Arithmetic'],
        isPYQ: true,
        isPublished: true
    },
    // 4. Time & Work Question
    {
        id: 'q_quant_04',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        chapterId: 'chap_arithmetic',
        topicId: 'top_time_work',
        questionText: 'A can complete a work in 12 days and B in 18 days. They worked together for 4 days, after which B left. How many more days will A take to complete the remaining work alone?',
        options: [
            { id: 'opt_1', text: '5 1/3 days', isCorrect: true },
            { id: 'opt_2', text: '6 days', isCorrect: false },
            { id: 'opt_3', text: '4 2/3 days', isCorrect: false },
            { id: 'opt_4', text: '7 days', isCorrect: false }
        ],
        correctOptionId: 'opt_1',
        explanation: 'Let Total Work = LCM(12, 18) = 36 units.\nEfficiency of A = 36 / 12 = 3 units/day.\nEfficiency of B = 36 / 18 = 2 units/day.\nCombined efficiency of (A + B) = 3 + 2 = 5 units/day.\nWork done in 4 days = 4 × 5 = 20 units.\nRemaining work = 36 - 20 = 16 units.\nTime taken by A alone = Remaining Work / Efficiency of A = 16 / 3 = 5 1/3 days.',
        shortcutTip: 'LCM method: Work = 36, (A+B) do 20 in 4 days. Remaining 16 units done by A (eff 3) in 16/3 = 5 1/3 days.',
        difficulty: 'medium',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2024,
        source: 'SSC CGL 2024 Tier-1',
        tags: ['Time & Work', 'LCM Method', 'Arithmetic'],
        isPYQ: true,
        isPublished: true
    },
    // 5. Syllogism Question
    {
        id: 'q_reas_01',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_reasoning',
        chapterId: 'chap_verbal_reasoning',
        topicId: 'top_syllogisms',
        questionText: 'Statements:\n1. All Mangoes are Fruits.\n2. Some Fruits are Sweet.\nConclusions:\nI. Some Mangoes are Sweet.\nII. All Sweet are Mangoes.',
        options: [
            { id: 'opt_1', text: 'Only conclusion I follows', isCorrect: false },
            { id: 'opt_2', text: 'Only conclusion II follows', isCorrect: false },
            { id: 'opt_3', text: 'Neither conclusion I nor II follows', isCorrect: true },
            { id: 'opt_4', text: 'Both conclusions follow', isCorrect: false }
        ],
        correctOptionId: 'opt_3',
        explanation: 'From the statements: "Mangoes" are entirely inside "Fruits", and "Fruits" partially intersects with "Sweet". There is no definite direct relation given between "Mangoes" and "Sweet".\nTherefore:\n- Conclusion I (Some Mangoes are Sweet) is a possibility but not definite.\n- Conclusion II (All Sweet are Mangoes) is clearly false.\nThus, neither follows.',
        shortcutTip: 'Universal Affirmative + Particular Affirmative gives no definite conclusion between extreme terms.',
        difficulty: 'easy',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2024,
        source: 'SSC CGL 2024 Tier-1',
        tags: ['Reasoning', 'Syllogisms', 'Logic'],
        isPYQ: true,
        isPublished: true
    },
    // 6. Coding Decoding Question
    {
        id: 'q_reas_02',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_reasoning',
        chapterId: 'chap_coding_puzzles',
        topicId: 'top_coding_decoding',
        questionText: 'In a certain code language, if "FLOWER" is written as "UOLDVI", how will "GARDEN" be written in that code language?',
        options: [
            { id: 'opt_1', text: 'TZIWVM', isCorrect: true },
            { id: 'opt_2', text: 'TYJVWN', isCorrect: false },
            { id: 'opt_3', text: 'SZIVVM', isCorrect: false },
            { id: 'opt_4', text: 'TZIVVN', isCorrect: false }
        ],
        correctOptionId: 'opt_1',
        explanation: 'Each letter is replaced by its reverse/opposite letter from the English alphabet (Sum of positional values = 27):\nF ↔ U (6 + 21 = 27)\nL ↔ O (12 + 15 = 27)\nO ↔ L (15 + 12 = 27)\nW ↔ D (23 + 4 = 27)\nE ↔ V (5 + 22 = 27)\nR ↔ I (18 + 9 = 27)\nApplying the same to "GARDEN":\nG ↔ T\nA ↔ Z\nR ↔ I\nD ↔ W\nE ↔ V\nN ↔ M\nResult: "TZIWVM".',
        shortcutTip: 'Opposite pair rule: G=7 (27-7=20 -> T), A->Z, R->I, D->W, E->V, N->M.',
        difficulty: 'easy',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2023,
        source: 'SSC CGL 2023 Tier-1',
        tags: ['Coding Decoding', 'Opposite Letters', 'Reasoning'],
        isPYQ: true,
        isPublished: true
    },
    // 7. Spotting Error English Question
    {
        id: 'q_eng_01',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_english',
        chapterId: 'chap_grammar',
        topicId: 'top_spotting_errors',
        questionText: 'Identify the segment in the sentence which contains a grammatical error:\n"Neither the principal (A) / nor the teachers (B) / was present in the meeting (C) / yesterday. (D)"',
        options: [
            { id: 'opt_1', text: 'was present in the meeting', isCorrect: true },
            { id: 'opt_2', text: 'nor the teachers', isCorrect: false },
            { id: 'opt_3', text: 'Neither the principal', isCorrect: false },
            { id: 'opt_4', text: 'No error', isCorrect: false }
        ],
        correctOptionId: 'opt_1',
        explanation: 'Rule: When two subjects are joined by "neither... nor", the verb agrees with the subject nearest to it. Here, the nearest subject is "the teachers", which is plural. Therefore, the singular verb "was" must be replaced with the plural verb "were present".',
        shortcutTip: 'Subject-Verb Agreement: In "Neither... nor", verb matches nearest noun ("teachers" is plural -> "were").',
        difficulty: 'medium',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2024,
        source: 'SSC CGL 2024 Tier-1',
        tags: ['English', 'Spotting Errors', 'Subject Verb Agreement'],
        isPYQ: true,
        isPublished: true
    },
    // 8. Indian Constitution Question
    {
        id: 'q_gs_01',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_gs',
        chapterId: 'chap_polity_cgl',
        topicId: 'top_indian_constitution',
        questionText: 'Which Article of the Indian Constitution guarantees the "Right to Constitutional Remedies", allowing citizens to move the Supreme Court for the enforcement of fundamental rights?',
        options: [
            { id: 'opt_1', text: 'Article 21', isCorrect: false },
            { id: 'opt_2', text: 'Article 32', isCorrect: true },
            { id: 'opt_3', text: 'Article 44', isCorrect: false },
            { id: 'opt_4', text: 'Article 226', isCorrect: false }
        ],
        correctOptionId: 'opt_2',
        explanation: 'Article 32 of the Constitution provides the Right to Constitutional Remedies. Dr. B.R. Ambedkar called Article 32 the "heart and soul of the Constitution" because without it, fundamental rights would be mere words on paper. Note: Article 226 confers writ power to High Courts, not the Supreme Court.',
        shortcutTip: 'Article 32 = Supreme Court Writs. Article 226 = High Court Writs.',
        difficulty: 'easy',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2024,
        source: 'SSC CGL 2024 / UPSC CSE',
        tags: ['Polity', 'Fundamental Rights', 'Article 32'],
        isPYQ: true,
        isPublished: true
    },
    // 9. Additional Profit Loss Hard Question
    {
        id: 'q_quant_05',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_quant',
        chapterId: 'chap_arithmetic',
        topicId: 'top_profit_loss',
        questionText: 'A dishonest dealer professes to sell his goods at cost price, but he uses a false weight of 920 grams instead of a 1 kg weight. What is his exact gain percentage?',
        options: [
            { id: 'opt_1', text: '8.69%', isCorrect: true },
            { id: 'opt_2', text: '8.00%', isCorrect: false },
            { id: 'opt_3', text: '9.20%', isCorrect: false },
            { id: 'opt_4', text: '7.50%', isCorrect: false }
        ],
        correctOptionId: 'opt_1',
        explanation: 'Gain% = [Error / (True Value - Error)] × 100%\nHere Error = 1000g - 920g = 80g.\nGain% = (80 / 920) × 100 = (8 / 92) × 100 = (2 / 23) × 100 = 200 / 23 = 8.695% ≈ 8.69%.',
        shortcutTip: 'Dishonest dealer formula: (Error / Weight actually given) × 100 = (80 / 920) × 100 = 8.69%.',
        difficulty: 'hard',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2023,
        source: 'SSC CGL 2023 Tier-2',
        tags: ['Dishonest Dealer', 'Profit & Loss', 'Advanced Arithmetic'],
        isPYQ: true,
        isPublished: true
    },
    // 10. Additional Constitution Article Question
    {
        id: 'q_gs_02',
        examId: 'exam_ssc_cgl',
        subjectId: 'sub_ssc_gs',
        chapterId: 'chap_polity_cgl',
        topicId: 'top_indian_constitution',
        questionText: 'By which Constitutional Amendment Act was the "Right to Education" inserted as Article 21A in Part III of the Indian Constitution?',
        options: [
            { id: 'opt_1', text: '44th Amendment Act, 1978', isCorrect: false },
            { id: 'opt_2', text: '86th Amendment Act, 2002', isCorrect: true },
            { id: 'opt_3', text: '91st Amendment Act, 2003', isCorrect: false },
            { id: 'opt_4', text: '42nd Amendment Act, 1976', isCorrect: false }
        ],
        correctOptionId: 'opt_2',
        explanation: 'The 86th Constitutional Amendment Act, 2002 inserted Article 21A, making free and compulsory education for children between the ages of 6 and 14 a Fundamental Right.',
        shortcutTip: '86th Amendment 2002 = Right to Education (21A).',
        difficulty: 'easy',
        marks: 2,
        negativeMarks: 0.5,
        questionType: 'single_mcq',
        year: 2022,
        source: 'SSC CGL 2022 / UPSC Prelims',
        tags: ['Polity', 'Amendments', 'Article 21A'],
        isPYQ: true,
        isPublished: true
    }
];
exports.SEED_MOCK_TESTS = [
    {
        id: 'mock_ssc_tier1_all_india_01',
        examId: 'exam_ssc_cgl',
        title: 'SSC CGL 2026 Tier-1 All India Full Mock Test #1',
        description: 'High-yield exam simulation according to latest TCS exam pattern with negative marking and sectional time splits.',
        type: 'full',
        durationMinutes: 60,
        totalMarks: 200,
        totalQuestions: 100,
        passingMarks: 130,
        difficulty: 'medium',
        isFree: true,
        sections: [
            {
                subjectId: 'sub_ssc_quant',
                subjectName: 'Quantitative Aptitude',
                questionIds: ['q_quant_01', 'q_quant_02', 'q_quant_03', 'q_quant_04', 'q_quant_05'],
                durationMinutes: 15
            },
            {
                subjectId: 'sub_ssc_reasoning',
                subjectName: 'General Intelligence & Reasoning',
                questionIds: ['q_reas_01', 'q_reas_02'],
                durationMinutes: 15
            },
            {
                subjectId: 'sub_ssc_english',
                subjectName: 'English Comprehension',
                questionIds: ['q_eng_01'],
                durationMinutes: 15
            },
            {
                subjectId: 'sub_ssc_gs',
                subjectName: 'General Awareness',
                questionIds: ['q_gs_01', 'q_gs_02'],
                durationMinutes: 15
            }
        ],
        createdAt: '2026-01-15T00:00:00.000Z'
    },
    {
        id: 'mock_ssc_quant_sectional_01',
        examId: 'exam_ssc_cgl',
        title: 'Quantitative Aptitude Sectional Speed Booster',
        description: 'Targeted sectional test for arithmetic calculations, percentages, and profit & loss speed mastery.',
        type: 'sectional',
        durationMinutes: 20,
        totalMarks: 50,
        totalQuestions: 25,
        passingMarks: 35,
        difficulty: 'hard',
        isFree: true,
        sections: [
            {
                subjectId: 'sub_ssc_quant',
                subjectName: 'Quantitative Aptitude',
                questionIds: ['q_quant_01', 'q_quant_02', 'q_quant_03', 'q_quant_04', 'q_quant_05'],
                durationMinutes: 20
            }
        ],
        createdAt: '2026-01-20T00:00:00.000Z'
    },
    {
        id: 'mock_ssc_pyq_2024_shift1',
        examId: 'exam_ssc_cgl',
        title: 'SSC CGL 2024 Tier 1 Official PYQ Live Simulation',
        description: 'Official memory-based questions from SSC CGL 2024 September examination.',
        type: 'full',
        durationMinutes: 60,
        totalMarks: 200,
        totalQuestions: 100,
        passingMarks: 135,
        difficulty: 'medium',
        isFree: true,
        sections: [
            {
                subjectId: 'sub_ssc_quant',
                subjectName: 'Quantitative Aptitude',
                questionIds: ['q_quant_01', 'q_quant_02', 'q_quant_03'],
                durationMinutes: 15
            },
            {
                subjectId: 'sub_ssc_reasoning',
                subjectName: 'General Intelligence',
                questionIds: ['q_reas_01', 'q_reas_02'],
                durationMinutes: 15
            }
        ],
        createdAt: '2026-02-01T00:00:00.000Z'
    }
];
exports.SEED_DAILY_CHALLENGE = {
    id: 'daily_challenge_today',
    date: '2026-08-29',
    examId: 'exam_ssc_cgl',
    title: 'Daily Rank Booster Challenge (20 Questions Mixed)',
    description: '5 Quant + 5 Reasoning + 5 English + 5 General Awareness to maintain daily streak and sharpen problem solving speed.',
    questions: exports.SEED_QUESTIONS.slice(0, 8),
    totalMarks: 40,
    durationMinutes: 15
};

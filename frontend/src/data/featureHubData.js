export const INITIAL_MISTAKES = [];

export const INITIAL_FLASHCARDS = [];

export const INITIAL_TOPIC_PROGRESS = {};

export const SPEED_DUEL_QUESTIONS = [
    {
        id: 'dq-1',
        subject: 'Speed Math',
        question: 'What is 105 x 95?',
        options: ['9975', '9985', '9965', '10025'],
        correctIndex: 0,
        timeLimitSeconds: 15,
        shortcutTip: '(100 + 5)(100 - 5) = 10000 - 25 = 9975'
    },
    {
        id: 'dq-2',
        subject: 'Reasoning',
        question: 'If A=1, B=2, then DOG equals what?',
        options: ['22', '24', '26', '28'],
        correctIndex: 2,
        timeLimitSeconds: 15,
        shortcutTip: 'D + O + G = 4 + 15 + 7 = 26'
    },
    {
        id: 'dq-3',
        subject: 'Quant',
        question: 'Profit on CP 400 and SP 480 is:',
        options: ['15%', '20%', '25%', '18%'],
        correctIndex: 1,
        timeLimitSeconds: 15,
        shortcutTip: 'Profit = 80, so 80 / 400 = 20%'
    },
    {
        id: 'dq-4',
        subject: 'Polity',
        question: 'Which Article sets up the Election Commission?',
        options: ['Article 324', 'Article 312', 'Article 280', 'Article 356'],
        correctIndex: 0,
        timeLimitSeconds: 15,
        shortcutTip: 'Election Commission is under Article 324'
    },
    {
        id: 'dq-5',
        subject: 'English',
        question: 'Choose the antonym for ephemeral.',
        options: ['Transient', 'Eternal', 'Brief', 'Fleeting'],
        correctIndex: 1,
        timeLimitSeconds: 15,
        shortcutTip: 'Ephemeral means short-lived; the opposite is eternal.'
    }
];

export const PYQ_TOPIC_FREQUENCIES = [
    {
        id: 'pyq-1',
        subject: 'Quantitative Aptitude',
        chapter: 'Arithmetic',
        topicName: 'Percentage',
        yieldTier: 'High-Yield (Must Do)',
        difficulty: 'Easy',
        averageQuestionsPerYear: 4.8,
        averageMarksWeightage: 9.6,
        fiveYearTrend: [
            { year: 2021, questionCount: 5 },
            { year: 2022, questionCount: 4 },
            { year: 2023, questionCount: 5 },
            { year: 2024, questionCount: 5 },
            { year: 2025, questionCount: 5 }
        ],
        typicalQuestionArchetype: 'Successive increase/decrease, profit-loss, and comparison-based percentage questions.',
        pyqCount: 24,
        masteryPercentage: 74
    },
    {
        id: 'pyq-2',
        subject: 'General Intelligence & Reasoning',
        chapter: 'Syllogism',
        topicName: 'Syllogisms',
        yieldTier: 'High-Yield (Must Do)',
        difficulty: 'Medium',
        averageQuestionsPerYear: 3.9,
        averageMarksWeightage: 7.8,
        fiveYearTrend: [
            { year: 2021, questionCount: 4 },
            { year: 2022, questionCount: 4 },
            { year: 2023, questionCount: 3 },
            { year: 2024, questionCount: 4 },
            { year: 2025, questionCount: 4 }
        ],
        typicalQuestionArchetype: 'All-following and some-not-following Venn logic statements.',
        pyqCount: 19,
        masteryPercentage: 68
    },
    {
        id: 'pyq-3',
        subject: 'English Comprehension',
        chapter: 'Grammar',
        topicName: 'Spotting Errors',
        yieldTier: 'Medium-Yield',
        difficulty: 'Medium',
        averageQuestionsPerYear: 2.6,
        averageMarksWeightage: 5.2,
        fiveYearTrend: [
            { year: 2021, questionCount: 2 },
            { year: 2022, questionCount: 3 },
            { year: 2023, questionCount: 2 },
            { year: 2024, questionCount: 3 },
            { year: 2025, questionCount: 3 }
        ],
        typicalQuestionArchetype: 'Subject-verb agreement, tense, modifier, and article usage checks.',
        pyqCount: 13,
        masteryPercentage: 61
    },
    {
        id: 'pyq-4',
        subject: 'General Awareness',
        chapter: 'Polity',
        topicName: 'Indian Constitution',
        yieldTier: 'High-Yield (Must Do)',
        difficulty: 'Easy',
        averageQuestionsPerYear: 4.2,
        averageMarksWeightage: 8.4,
        fiveYearTrend: [
            { year: 2021, questionCount: 4 },
            { year: 2022, questionCount: 4 },
            { year: 2023, questionCount: 4 },
            { year: 2024, questionCount: 4 },
            { year: 2025, questionCount: 5 }
        ],
        typicalQuestionArchetype: 'Fundamental Rights, constitutional bodies, and article-number recall.',
        pyqCount: 21,
        masteryPercentage: 79
    }
];

export const CUTOFF_BENCHMARKS = [
    {
        postId: 'p-1',
        postName: 'Assistant Section Officer (ASO)',
        department: 'Central Secretariat Service',
        payLevel: 'Level 7',
        examName: 'SSC CGL Tier 2',
        safeScoreRecommendation: 334,
        cutoffs: {
            UR: 328.5,
            OBC: 321,
            EWS: 323.5,
            SC: 304,
            ST: 292
        },
        vacancyTrend: [
            { year: 2023, vacancies: 692 },
            { year: 2024, vacancies: 1240 },
            { year: 2025, vacancies: 1450 }
        ]
    },
    {
        postId: 'p-2',
        postName: 'Inspector of Income Tax',
        department: 'CBDT - Department of Revenue',
        payLevel: 'Level 7',
        examName: 'SSC CGL Tier 2',
        safeScoreRecommendation: 338,
        cutoffs: {
            UR: 332,
            OBC: 326.5,
            EWS: 328,
            SC: 310,
            ST: 298.5
        },
        vacancyTrend: [
            { year: 2023, vacancies: 312 },
            { year: 2024, vacancies: 580 },
            { year: 2025, vacancies: 640 }
        ]
    },
    {
        postId: 'p-3',
        postName: 'Probationary Officer',
        department: 'Public Sector Banks',
        payLevel: 'Scale-I Officer',
        examName: 'IBPS PO Mains',
        safeScoreRecommendation: 54.5,
        cutoffs: {
            UR: 48.2,
            OBC: 45.75,
            EWS: 47.15,
            SC: 42.5,
            ST: 38.3
        },
        vacancyTrend: [
            { year: 2023, vacancies: 3049 },
            { year: 2024, vacancies: 3150 },
            { year: 2025, vacancies: 3300 }
        ]
    }
];

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    RotateCcw, 
    ChevronRight, 
    ChevronLeft, 
    Bookmark, 
    Award, 
    BarChart2, 
    BookOpen, 
    Sparkles, 
    Play, 
    Filter, 
    Check, 
    HelpCircle, 
    Flame, 
    Layers, 
    Zap,
    ArrowRight
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAppStore } from '../../store/useAppStore';

// Built-in rich question bank by exam category to ensure 100% offline & API resilience
const DEFAULT_EXAM_PRESETS = [
    {
        id: 'ssc_cgl',
        title: 'SSC CGL Tier-1 Simulator',
        category: 'Central Govt',
        durationMinutes: 10,
        marksPerQuestion: 2,
        negativeMarks: 0.5,
        icon: '🏛️',
        description: 'Combined Graduate Level speed & accuracy drill with Quant, Reasoning, English & GK.',
        questions: [
            {
                id: 'ssc_q1',
                subject: 'Quantitative Aptitude',
                topic: 'Ratio & Proportion',
                difficulty: 'Medium',
                questionText: 'If A : B = 3 : 4 and B : C = 8 : 9, what is the ratio of A : C?',
                options: [
                    { id: 'opt_1', text: '1 : 2' },
                    { id: 'opt_2', text: '2 : 3' },
                    { id: 'opt_3', text: '3 : 4' },
                    { id: 'opt_4', text: '4 : 5' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'A/C = (A/B) × (B/C) = (3/4) × (8/9) = 24/36 = 2/3. Therefore, A : C = 2 : 3.',
                formulaShortcut: 'Direct Product Shortcut: Multiply consecutive ratios: (3×8) : (4×9) = 24 : 36 = 2 : 3.'
            },
            {
                id: 'ssc_q2',
                subject: 'Reasoning Ability',
                topic: 'Syllogism',
                difficulty: 'Medium',
                questionText: 'Statements:\n1. All cars are vehicles.\n2. Some vehicles are electric.\n\nConclusions:\nI. Some electric items are vehicles.\nII. Some cars are electric.',
                options: [
                    { id: 'opt_1', text: 'Only conclusion I follows' },
                    { id: 'opt_2', text: 'Only conclusion II follows' },
                    { id: 'opt_3', text: 'Both I and II follow' },
                    { id: 'opt_4', text: 'Neither I nor II follows' }
                ],
                correctOptionId: 'opt_1',
                explanation: 'From statement 2, "Some vehicles are electric" converts by simple conversion to "Some electric items are vehicles" (Conclusion I follows). There is no definite intersection given between cars and electric, so Conclusion II does not necessarily follow.',
                formulaShortcut: 'Conversion Rule: Particular Affirmative (I-type: Some A are B) converts directly to (Some B are A).'
            },
            {
                id: 'ssc_q3',
                subject: 'General Awareness',
                topic: 'Indian Constitution',
                difficulty: 'Easy',
                questionText: 'Which Article of the Constitution of India guarantees the Right to Constitutional Remedies (the "Heart and Soul" of the Constitution)?',
                options: [
                    { id: 'opt_1', text: 'Article 19' },
                    { id: 'opt_2', text: 'Article 21' },
                    { id: 'opt_3', text: 'Article 32' },
                    { id: 'opt_4', text: 'Article 44' }
                ],
                correctOptionId: 'opt_3',
                explanation: 'Dr. B.R. Ambedkar called Article 32 the "Heart and Soul" of the Indian Constitution because it empowers citizens to approach the Supreme Court for enforcement of Fundamental Rights via writs.',
                formulaShortcut: '5 Prerogative Writs under Art 32: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto.'
            },
            {
                id: 'ssc_q4',
                subject: 'English Language',
                topic: 'Error Detection & Idioms',
                difficulty: 'Hard',
                questionText: 'Select the idiom that means "to face a crisis or difficult situation with courage and fortitude":',
                options: [
                    { id: 'opt_1', text: 'Bite the bullet' },
                    { id: 'opt_2', text: 'Beat around the bush' },
                    { id: 'opt_3', text: 'Burn the candle at both ends' },
                    { id: 'opt_4', text: 'Bark up the wrong tree' }
                ],
                correctOptionId: 'opt_1',
                explanation: '"Bite the bullet" means to endure a painful or difficult situation that is seen as unavoidable. Originates from wounded soldiers biting on lead bullets during surgery before anesthesia.',
                formulaShortcut: 'Mnemonic: Biting bullet = Gritting teeth under unavoidable pressure.'
            },
            {
                id: 'ssc_q5',
                subject: 'Quantitative Aptitude',
                topic: 'Profit, Loss & Discount',
                difficulty: 'Hard',
                questionText: 'A trader marks his goods 40% above cost price and allows a 15% discount on the marked price. If he makes a net profit of ₹380, what was the Cost Price (CP)?',
                options: [
                    { id: 'opt_1', text: '₹1,800' },
                    { id: 'opt_2', text: '₹2,000' },
                    { id: 'opt_3', text: '₹2,200' },
                    { id: 'opt_4', text: '₹2,500' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'Let CP = 100. MP = 140. SP = 140 × (1 - 0.15) = 140 × 0.85 = 119. Profit % = 119 - 100 = 19%. 19% of CP = 380 ⇒ CP = (380 / 19) × 100 = ₹2,000.',
                formulaShortcut: 'Net Profit % = Markup % - Discount % - (Markup × Discount)/100 = 40 - 15 - (40×15)/100 = 25 - 6 = 19%.'
            }
        ]
    },
    {
        id: 'ibps_po',
        title: 'IBPS PO Prelims Speed Drill',
        category: 'Banking',
        durationMinutes: 8,
        marksPerQuestion: 1,
        negativeMarks: 0.25,
        icon: '🏦',
        description: 'High-speed Banking Prelims covering Quadratic Equations, Data Interpretation & Coding-Decoding.',
        questions: [
            {
                id: 'ibps_q1',
                subject: 'Quantitative Aptitude',
                topic: 'Quadratic Equations',
                difficulty: 'Medium',
                questionText: 'Equation I: x² - 11x + 30 = 0\nEquation II: y² - 13y + 42 = 0\nDetermine the relationship between x and y:',
                options: [
                    { id: 'opt_1', text: 'x > y' },
                    { id: 'opt_2', text: 'x < y' },
                    { id: 'opt_3', text: 'x ≤ y' },
                    { id: 'opt_4', text: 'x = y or Relationship cannot be established' }
                ],
                correctOptionId: 'opt_3',
                explanation: 'Roots of Eq I: x² - 5x - 6x + 30 = 0 ⇒ x = 5, 6.\nRoots of Eq II: y² - 6y - 7y + 42 = 0 ⇒ y = 6, 7.\nComparing: 5 < 6, 5 < 7, 6 = 6, 6 < 7. Thus, x ≤ y.',
                formulaShortcut: 'Fast Factorization: For x² - bx + c = 0, both roots are positive. Sum = b, Product = c.'
            },
            {
                id: 'ibps_q2',
                subject: 'Reasoning Ability',
                topic: 'Direction Sense & Vectors',
                difficulty: 'Medium',
                questionText: 'Rohan walks 12m North, turns Right and walks 9m. Then he turns Right again and walks 24m. Finally he turns Left and walks 7m. How far is he from the starting point?',
                options: [
                    { id: 'opt_1', text: '18m' },
                    { id: 'opt_2', text: '20m' },
                    { id: 'opt_3', text: '22m' },
                    { id: 'opt_4', text: '25m' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'Net North-South displacement = 12 - 24 = -12m (12m South).\nNet East-West displacement = 9 + 7 = 16m East.\nShortest distance = √(12² + 16²) = √(144 + 256) = √400 = 20m.',
                formulaShortcut: 'Pythagorean Triplet: 3-4-5 scaled by factor 4 gives 12-16-20.'
            },
            {
                id: 'ibps_q3',
                subject: 'English Language',
                topic: 'Cloze Test & Phrasal Verbs',
                difficulty: 'Hard',
                questionText: 'The central bank decided to _______ the interest rates to curb runaway inflation.',
                options: [
                    { id: 'opt_1', text: 'hike' },
                    { id: 'opt_2', text: 'slash' },
                    { id: 'opt_3', text: 'liquidate' },
                    { id: 'opt_4', text: 'subsidize' }
                ],
                correctOptionId: 'opt_1',
                explanation: 'Monetary policy dictates that raising (hiking) interest rates decreases money supply and borrowing, thereby cooling down demand and curbing inflation.',
                formulaShortcut: 'Macroeconomics Concept: Inflation ↑ ⇒ Interest Rates ↑ to reduce money supply.'
            },
            {
                id: 'ibps_q4',
                subject: 'Quantitative Aptitude',
                topic: 'Time & Work',
                difficulty: 'Medium',
                questionText: 'Pipe A can fill a tank in 12 hours, while Pipe B can empty it in 18 hours. If both pipes are opened simultaneously, how long will it take to fill the empty tank completely?',
                options: [
                    { id: 'opt_1', text: '24 hours' },
                    { id: 'opt_2', text: '30 hours' },
                    { id: 'opt_3', text: '36 hours' },
                    { id: 'opt_4', text: '42 hours' }
                ],
                correctOptionId: 'opt_3',
                explanation: 'Rate of filling = 1/12 - 1/18 = (3 - 2)/36 = 1/36 tank per hour. Therefore, tank fills in 36 hours.',
                formulaShortcut: 'Combined Time Formula = (T1 × T2) / (T2 - T1) = (12 × 18) / (18 - 12) = 216 / 6 = 36 hours.'
            }
        ]
    },
    {
        id: 'upsc_cse',
        title: 'UPSC Civil Services GS Prelims',
        category: 'Civil Services',
        durationMinutes: 12,
        marksPerQuestion: 2,
        negativeMarks: 0.66,
        icon: '⚖️',
        description: 'Analytical General Studies paper testing multi-statement conceptual clarity in Indian Polity, Economy & Ecology.',
        questions: [
            {
                id: 'upsc_q1',
                subject: 'Indian Polity & Governance',
                topic: 'Constitutional Bodies',
                difficulty: 'Hard',
                questionText: 'Consider the following statements regarding the Finance Commission of India:\n1. It is a quasi-judicial body constituted by the President under Article 280.\n2. The recommendations made by the Finance Commission are legally binding on the Government of India.\n\nWhich of the statements given above is/are correct?',
                options: [
                    { id: 'opt_1', text: '1 only' },
                    { id: 'opt_2', text: '2 only' },
                    { id: 'opt_3', text: 'Both 1 and 2' },
                    { id: 'opt_4', text: 'Neither 1 nor 2' }
                ],
                correctOptionId: 'opt_1',
                explanation: 'Statement 1 is correct: Art 280 provides for the Finance Commission as a quasi-judicial body constituted every 5 years. Statement 2 is incorrect: Recommendations are advisory in nature, though conventionally accepted.',
                formulaShortcut: 'Key UPSC Trap: Words like "strictly binding" are often false in constitutional advisory bodies.'
            },
            {
                id: 'upsc_q2',
                subject: 'Environment & Ecology',
                topic: 'Biodiversity Hotspots',
                difficulty: 'Medium',
                questionText: 'Which of the following geographical regions in India is recognized as a global Biodiversity Hotspot?',
                options: [
                    { id: 'opt_1', text: 'Western Ghats' },
                    { id: 'opt_2', text: 'Aravalli Range' },
                    { id: 'opt_3', text: 'Thar Desert' },
                    { id: 'opt_4', text: 'Rann of Kutch' }
                ],
                correctOptionId: 'opt_1',
                explanation: 'India features 4 recognized global biodiversity hotspots: (1) Western Ghats & Sri Lanka, (2) Eastern Himalayas, (3) Indo-Burma region, and (4) Sundaland (including Nicobar Islands).',
                formulaShortcut: 'Criteria for Hotspot: Must contain ≥ 1,500 endemic vascular plants and lost ≥ 70% primary habitat.'
            },
            {
                id: 'upsc_q3',
                subject: 'Indian Economy',
                topic: 'Monetary Aggregates',
                difficulty: 'Hard',
                questionText: 'In the context of the Indian economy, which aggregate is commonly designated as "Broad Money" (M3)?',
                options: [
                    { id: 'opt_1', text: 'Currency with public + Demand deposits + Other deposits with RBI' },
                    { id: 'opt_2', text: 'M1 + Time deposits with the banking system' },
                    { id: 'opt_3', text: 'Currency with public + Post office savings bank deposits' },
                    { id: 'opt_4', text: 'M1 + Total post office deposits' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'M1 = Currency with public + Demand deposits + Other deposits with RBI (Narrow Money). M3 = M1 + Time deposits with banking system (Broad Money).',
                formulaShortcut: 'Memory Grid: M1 = Narrow Money; M3 = M1 + Time Deposits = Broad Money.'
            }
        ]
    },
    {
        id: 'rrb_ntpc',
        title: 'RRB NTPC CBT-1 Drill',
        category: 'Railways',
        durationMinutes: 8,
        marksPerQuestion: 1,
        negativeMarks: 0.33,
        icon: '🚆',
        description: 'Railway Recruitment Board CBT-1 testing General Science, Arithmetic, and Logical Reasoning.',
        questions: [
            {
                id: 'rrb_q1',
                subject: 'General Science',
                topic: 'Physics - Optics',
                difficulty: 'Easy',
                questionText: 'What type of mirror is used as a rear-view mirror in motor vehicles?',
                options: [
                    { id: 'opt_1', text: 'Concave mirror' },
                    { id: 'opt_2', text: 'Convex mirror' },
                    { id: 'opt_3', text: 'Plane mirror' },
                    { id: 'opt_4', text: 'Cylindrical mirror' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'Convex mirrors always produce an erect, diminished image and offer a much wider field of view, making them optimal for vehicle rear-view monitoring.',
                formulaShortcut: 'Convex Mirror Rule: Virtual, Erect & Diminished image for all object positions.'
            },
            {
                id: 'rrb_q2',
                subject: 'Mathematics',
                topic: 'Speed, Time & Distance (Trains)',
                difficulty: 'Medium',
                questionText: 'A 180-meter long train crosses a telegraph post in 9 seconds. What is the speed of the train in km/h?',
                options: [
                    { id: 'opt_1', text: '60 km/h' },
                    { id: 'opt_2', text: '72 km/h' },
                    { id: 'opt_3', text: '80 km/h' },
                    { id: 'opt_4', text: '90 km/h' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'Speed in m/s = Distance / Time = 180 / 9 = 20 m/s.\nConvert m/s to km/h by multiplying by (18/5): 20 × (18/5) = 4 × 18 = 72 km/h.',
                formulaShortcut: 'Conversion Factor: Multiply by 18/5 to turn m/s into km/h.'
            },
            {
                id: 'rrb_q3',
                subject: 'General Awareness',
                topic: 'Indian Railways & Heritage',
                difficulty: 'Easy',
                questionText: 'Between which two stations was the first passenger train in India operated in April 1853?',
                options: [
                    { id: 'opt_1', text: 'Bombay (Bori Bunder) to Thane' },
                    { id: 'opt_2', text: 'Howrah to Hooghly' },
                    { id: 'opt_3', text: 'Madras to Arkonam' },
                    { id: 'opt_4', text: 'Delhi to Agra' }
                ],
                correctOptionId: 'opt_1',
                explanation: 'India\'s first passenger train ran on April 16, 1853, covering 34 km between Bori Bunder (Bombay) and Thane with 14 carriages and 400 guests.',
                formulaShortcut: 'Three locomotives used: Sultan, Sahib, and Sindh.'
            }
        ]
    },
    {
        id: 'univ_engg',
        title: 'University Engineering Core (CS & Math)',
        category: 'University Semester',
        durationMinutes: 10,
        marksPerQuestion: 2,
        negativeMarks: 0,
        icon: '🎓',
        description: 'University 5-unit semester practice on Data Structures, Algorithms & Discrete Mathematics.',
        questions: [
            {
                id: 'univ_q1',
                subject: 'Data Structures & Algorithms',
                topic: 'Trees & Heaps',
                difficulty: 'Medium',
                questionText: 'What is the worst-case time complexity of searching an element in a Balanced Binary Search Tree (such as an AVL Tree) with n nodes?',
                options: [
                    { id: 'opt_1', text: 'O(1)' },
                    { id: 'opt_2', text: 'O(log n)' },
                    { id: 'opt_3', text: 'O(n)' },
                    { id: 'opt_4', text: 'O(n log n)' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'Because AVL trees maintain a strict height balance factor of {-1, 0, +1}, the height of the tree is mathematically bounded to 1.44 log2(n), giving O(log n) worst-case search time.',
                formulaShortcut: 'Height of AVL Tree: h < 1.4404 log2(n + 2) - 0.3277.'
            },
            {
                id: 'univ_q2',
                subject: 'Computer Architecture',
                topic: 'Pipelining & Hazards',
                difficulty: 'Hard',
                questionText: 'In a standard 5-stage RISC instruction pipeline (IF, ID, EX, MEM, WB), what type of hazard occurs when an instruction depends on the result of a previous instruction that has not yet been written back?',
                options: [
                    { id: 'opt_1', text: 'Structural Hazard' },
                    { id: 'opt_2', text: 'Data Hazard (RAW)' },
                    { id: 'opt_3', text: 'Control Hazard (Branch)' },
                    { id: 'opt_4', text: 'Memory Conflict Hazard' }
                ],
                correctOptionId: 'opt_2',
                explanation: 'A Read-After-Write (RAW) data hazard occurs when instruction j tries to read a source register before instruction i writes to it. Resolved via Operand Forwarding or Pipeline Stalling (bubbles).',
                formulaShortcut: 'Forwarding Solution: Bypass multiplexer connects ALU output directly to ALU input stage.'
            },
            {
                id: 'univ_q3',
                subject: 'Operating Systems',
                topic: 'Deadlock Detection',
                difficulty: 'Medium',
                questionText: 'Which of the following is NOT one of Coffman\'s four necessary conditions for a system deadlock to occur?',
                options: [
                    { id: 'opt_1', text: 'Mutual Exclusion' },
                    { id: 'opt_2', text: 'Hold and Wait' },
                    { id: 'opt_3', text: 'Preemptive Scheduling' },
                    { id: 'opt_4', text: 'Circular Wait' }
                ],
                correctOptionId: 'opt_3',
                explanation: 'The four Coffman conditions for deadlock are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (non-preemption), 4. Circular Wait. Preemptive scheduling actually prevents deadlocks.',
                formulaShortcut: 'Deadlock Prevention: Violate any 1 of the 4 Coffman conditions.'
            }
        ]
    }
];

export const InteractiveMockTest = ({ 
    initialExamId, 
    onComplete, 
    embeddedMode = false 
}) => {
    const { user } = useAppStore();

    // Stage State: 'select_exam' | 'active_test' | 'score_card'
    const [currentStage, setCurrentStage] = useState(initialExamId ? 'active_test' : 'select_exam');
    
    // Exam & Question State
    const [selectedExamId, setSelectedExamId] = useState(initialExamId || 'ssc_cgl');
    const [customQuestionCount, setCustomQuestionCount] = useState(0); // 0 = all
    const [activeExam, setActiveExam] = useState(DEFAULT_EXAM_PRESETS[0]);
    const [questions, setQuestions] = useState(DEFAULT_EXAM_PRESETS[0].questions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    // User Responses: { [questionId]: { selectedOptionId, isMarkedForReview, timeSpent } }
    const [userResponses, setUserResponses] = useState({});
    
    // Timer State
    const [remainingSeconds, setRemainingSeconds] = useState(600);
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [testStartTime, setTestStartTime] = useState(null);
    const questionStartTimeRef = useRef(Date.now());
    
    // UI Modals & Filters
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
    const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'skipped'
    const [expandedExplanationId, setExpandedExplanationId] = useState(null);

    // Initial setup for chosen exam
    useEffect(() => {
        const found = DEFAULT_EXAM_PRESETS.find(e => e.id === selectedExamId) || DEFAULT_EXAM_PRESETS[0];
        setActiveExam(found);
    }, [selectedExamId]);

    // Timer Countdown Hook
    useEffect(() => {
        if (currentStage !== 'active_test' || isTimerPaused) return;

        const timerInterval = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    handleSubmitTest(true); // Auto-submit on time expiry
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [currentStage, isTimerPaused]);

    // Record time spent when switching questions
    const recordTimeSpentOnCurrentQuestion = () => {
        const currentQ = questions[currentQuestionIndex];
        if (!currentQ) return;
        const now = Date.now();
        const elapsedSec = Math.max(1, Math.round((now - questionStartTimeRef.current) / 1000));
        questionStartTimeRef.current = now;

        setUserResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                timeSpent: (prev[currentQ.id]?.timeSpent || 0) + elapsedSec
            }
        }));
    };

    // Start or Restart Test
    const handleStartTest = (examIdToStart) => {
        const targetExam = DEFAULT_EXAM_PRESETS.find(e => e.id === examIdToStart) || activeExam;
        setSelectedExamId(targetExam.id);
        setActiveExam(targetExam);

        let qList = [...targetExam.questions];
        if (customQuestionCount > 0 && customQuestionCount < qList.length) {
            qList = qList.slice(0, customQuestionCount);
        }
        setQuestions(qList);
        setCurrentQuestionIndex(0);

        // Initialize empty responses map
        const initialResponses = {};
        qList.forEach(q => {
            initialResponses[q.id] = {
                selectedOptionId: null,
                isMarkedForReview: false,
                timeSpent: 0
            };
        });
        setUserResponses(initialResponses);

        const totalSec = targetExam.durationMinutes * 60;
        setRemainingSeconds(totalSec);
        setTestStartTime(Date.now());
        questionStartTimeRef.current = Date.now();
        setIsTimerPaused(false);
        setShowSubmitModal(false);
        setCurrentStage('active_test');
    };

    // Option selection
    const handleSelectOption = (optionId) => {
        const currentQ = questions[currentQuestionIndex];
        if (!currentQ) return;

        setUserResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                selectedOptionId: optionId
            }
        }));
    };

    // Clear response for current question
    const handleClearOption = () => {
        const currentQ = questions[currentQuestionIndex];
        if (!currentQ) return;

        setUserResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                selectedOptionId: null
            }
        }));
    };

    // Toggle Mark for Review
    const handleToggleMarkForReview = () => {
        const currentQ = questions[currentQuestionIndex];
        if (!currentQ) return;

        setUserResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                isMarkedForReview: !prev[currentQ.id]?.isMarkedForReview
            }
        }));
    };

    // Next / Previous navigation
    const handleNextQuestion = () => {
        recordTimeSpentOnCurrentQuestion();
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        recordTimeSpentOnCurrentQuestion();
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleJumpToQuestion = (index) => {
        recordTimeSpentOnCurrentQuestion();
        setCurrentQuestionIndex(index);
    };

    // Calculation of Test Results upon submission
    const computedResults = useMemo(() => {
        let correctCount = 0;
        let incorrectCount = 0;
        let skippedCount = 0;
        let totalScore = 0;
        let totalTimeSpentSeconds = 0;

        const evaluatedQuestions = questions.map((q) => {
            const response = userResponses[q.id] || {};
            const selectedOptId = response.selectedOptionId;
            const isAnswered = Boolean(selectedOptId);
            const isCorrect = isAnswered && selectedOptId === q.correctOptionId;
            const timeSpent = response.timeSpent || 0;
            totalTimeSpentSeconds += timeSpent;

            let marks = 0;
            if (isAnswered) {
                if (isCorrect) {
                    marks = activeExam.marksPerQuestion;
                    correctCount++;
                } else {
                    marks = -activeExam.negativeMarks;
                    incorrectCount++;
                }
            } else {
                skippedCount++;
            }
            totalScore += marks;

            return {
                ...q,
                userSelectedOptionId: selectedOptId,
                isCorrect,
                isAnswered,
                marksAwarded: marks,
                timeSpentSeconds: timeSpent
            };
        });

        const maxPossibleMarks = questions.length * activeExam.marksPerQuestion;
        const netScore = Math.max(0, Math.round(totalScore * 100) / 100);
        const percentage = maxPossibleMarks > 0 ? Math.max(0, Math.round((netScore / maxPossibleMarks) * 100)) : 0;
        const totalAttempted = correctCount + incorrectCount;
        const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
        const avgTimePerQ = questions.length > 0 ? Math.round(totalTimeSpentSeconds / questions.length) : 0;

        // Estimated Percentile
        const percentile = Math.min(99.8, Math.max(35.0, Math.round((percentage * 1.12 + 10) * 10) / 10));

        // Feedback diagnosis
        let rankBadge = 'Aspiring Candidate';
        let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        if (percentage >= 85) {
            rankBadge = 'Top 1% — Exam Ready Master';
            badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        } else if (percentage >= 65) {
            rankBadge = 'Competitive Qualifier';
            badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
        } else if (percentage >= 45) {
            rankBadge = 'Moderate Foundation';
            badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        } else {
            rankBadge = 'Needs Revision Drill';
            badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
        }

        return {
            correctCount,
            incorrectCount,
            skippedCount,
            totalAttempted,
            netScore,
            maxPossibleMarks,
            percentage,
            accuracy,
            avgTimePerQ,
            totalTimeSpentSeconds,
            percentile,
            rankBadge,
            badgeColor,
            evaluatedQuestions
        };
    }, [questions, userResponses, activeExam]);

    // Handle Submit
    const handleSubmitTest = (isAuto = false) => {
        recordTimeSpentOnCurrentQuestion();
        setShowSubmitModal(false);
        setCurrentStage('score_card');

        // If parent callback provided
        if (onComplete) {
            onComplete(computedResults);
        }
    };

    // Format remaining time MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Helper counts for Palette
    const currentQ = questions[currentQuestionIndex];
    const answeredCount = Object.values(userResponses).filter(r => r.selectedOptionId).length;
    const markedCount = Object.values(userResponses).filter(r => r.isMarkedForReview).length;
    const unansweredCount = questions.length - answeredCount;

    // Filter categories
    const categories = ['All', 'Central Govt', 'Banking', 'Civil Services', 'Railways', 'University Semester'];
    const filteredPresets = DEFAULT_EXAM_PRESETS.filter(e => activeCategoryFilter === 'All' || e.category === activeCategoryFilter);

    // =========================================================================
    // VIEW 1: EXAM SELECTOR STAGE
    // =========================================================================
    if (currentStage === 'select_exam') {
        return (
            <div id="mock-test-arena-selector" className="w-full bg-[#0a0f1d] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-8 text-white shadow-xl">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span>Timed Exam Simulator Engine</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            Choose Your Target Exam
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                            Select a standardized exam paper with official timer constraints, negative marking rules, and instant score calculation.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
                        <div className="text-right px-3 py-1">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Aspirant Profile</span>
                            <span className="text-xs font-bold text-white">{user?.name || 'Aspirant'}</span>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5" /> Category:
                    </span>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            id={`exam-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setActiveCategoryFilter(cat)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                activeCategoryFilter === cat
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Exam Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPresets.map(preset => {
                        const isSelected = selectedExamId === preset.id;
                        return (
                            <div
                                key={preset.id}
                                id={`exam-preset-card-${preset.id}`}
                                onClick={() => setSelectedExamId(preset.id)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
                                    isSelected
                                        ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl">{preset.icon}</span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                                            {preset.category}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                                            {preset.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                            {preset.description}
                                        </p>
                                    </div>

                                    {/* Exam Meta Specs */}
                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                                            <span>{preset.durationMinutes}m</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Layers className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>{preset.questions.length} Qs</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                                            <span>-{preset.negativeMarks} Neg</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                                    <span className="text-[11px] font-medium text-slate-400">
                                        +{preset.marksPerQuestion} / -{preset.negativeMarks} marks
                                    </span>
                                    <button
                                        id={`start-test-btn-${preset.id}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartTest(preset.id);
                                        }}
                                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                                    >
                                        <Play className="w-3 h-3 fill-white" />
                                        <span>Start Test</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // =========================================================================
    // VIEW 2: ACTIVE TIMED TEST INTERFACE
    // =========================================================================
    if (currentStage === 'active_test' && currentQ) {
        const isLowTime = remainingSeconds <= 120; // 2 minutes warning
        const currentResponse = userResponses[currentQ.id] || {};
        const isCurrentMarked = currentResponse.isMarkedForReview;

        return (
            <div id="active-mock-test-container" className="w-full bg-[#080c15] text-white rounded-2xl border border-slate-800 flex flex-col min-h-[620px] overflow-hidden shadow-2xl">
                {/* Simulator Header Bar */}
                <header className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shadow-md shadow-blue-600/30">
                            {activeExam.icon}
                        </span>
                        <div>
                            <h2 className="text-xs sm:text-sm font-bold text-white max-w-[200px] sm:max-w-md truncate">
                                {activeExam.title}
                            </h2>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <span>•</span>
                                <span className="text-emerald-400">+{activeExam.marksPerQuestion}</span>
                                <span>/</span>
                                <span className="text-rose-400">-{activeExam.negativeMarks}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timer & Controls */}
                    <div className="flex items-center gap-3">
                        {/* Countdown Badge */}
                        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold tracking-wider ${
                            isLowTime
                                ? 'bg-rose-950/80 text-rose-300 border-rose-700/80 animate-pulse'
                                : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}>
                            <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-blue-400'}`} />
                            <span>{formatTime(remainingSeconds)}</span>
                        </div>

                        {/* Submit Button */}
                        <button
                            id="finish-and-submit-mock-test-btn"
                            onClick={() => setShowSubmitModal(true)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Submit</span>
                        </button>
                    </div>
                </header>

                {/* Main Test Layout (Question + Palette) */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                    {/* Left 3-Columns: Question & Options */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
                        <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 space-y-6 flex-1 shadow-inner">
                            {/* Question Meta Sub-Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold uppercase tracking-wider text-[10px]">
                                        {currentQ.subject}
                                    </span>
                                    <span className="text-slate-400 font-medium">
                                        • {currentQ.topic}
                                    </span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    currentQ.difficulty === 'Hard'
                                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                                        : currentQ.difficulty === 'Medium'
                                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                    {currentQ.difficulty}
                                </span>
                            </div>

                            {/* Question Stem */}
                            <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                                <span className="font-bold text-blue-400 mr-2">Q{currentQuestionIndex + 1}.</span>
                                {currentQ.questionText}
                            </div>

                            {/* Options List */}
                            <div className="space-y-3 pt-2">
                                {currentQ.options.map((option, optIdx) => {
                                    const letter = String.fromCharCode(65 + optIdx);
                                    const isSelected = currentResponse.selectedOptionId === option.id;

                                    return (
                                        <button
                                            key={option.id}
                                            id={`question-${currentQ.id}-option-${letter}`}
                                            onClick={() => handleSelectOption(option.id)}
                                            className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-3.5 group ${
                                                isSelected
                                                    ? 'border-blue-500 bg-blue-950/60 text-blue-100 font-semibold ring-1 ring-blue-500/40 shadow-sm'
                                                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-850 text-slate-300'
                                            }`}
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                                            }`}>
                                                {letter}
                                            </span>
                                            <span className="flex-1 leading-snug">{option.text}</span>
                                            {isSelected && (
                                                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Control Bar */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    id="mark-for-review-btn"
                                    onClick={handleToggleMarkForReview}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                                        isCurrentMarked
                                            ? 'bg-purple-950/80 border-purple-600 text-purple-200 shadow-sm'
                                            : 'bg-slate-800/80 border-slate-700 text-purple-300 hover:bg-purple-950/40'
                                    }`}
                                >
                                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                                    <span>{isCurrentMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                                </button>

                                {currentResponse.selectedOptionId && (
                                    <button
                                        id="clear-response-btn"
                                        onClick={handleClearOption}
                                        className="px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition"
                                    >
                                        Clear Choice
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    id="prev-question-btn"
                                    onClick={handlePrevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 text-xs font-semibold flex items-center gap-1 transition"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>

                                {currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        id="next-question-btn"
                                        onClick={handleNextQuestion}
                                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition flex items-center gap-1"
                                    >
                                        <span>Save & Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        id="final-submit-test-btn"
                                        onClick={() => setShowSubmitModal(true)}
                                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Review & Submit</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right 1-Column: Question Palette & Summary */}
                    <div className="space-y-5">
                        {/* Summary Status Box */}
                        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Live Question Palette
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                                    <span className="w-4 h-4 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                                        {answeredCount}
                                    </span>
                                    <span className="text-emerald-300 font-medium">Answered</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/30 border border-rose-800/40">
                                    <span className="w-4 h-4 rounded bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">
                                        {unansweredCount}
                                    </span>
                                    <span className="text-rose-300 font-medium">Unanswered</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-950/30 border border-purple-800/40 col-span-2">
                                    <span className="w-4 h-4 rounded bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                                        {markedCount}
                                    </span>
                                    <span className="text-purple-300 font-medium">Marked for Review</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Matrix Grid */}
                        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                            <span className="text-xs font-bold text-slate-300 block">
                                Jump to Question
                            </span>
                            <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                                {questions.map((q, idx) => {
                                    const resp = userResponses[q.id] || {};
                                    const isAnswered = Boolean(resp.selectedOptionId);
                                    const isMarked = Boolean(resp.isMarkedForReview);
                                    const isCurrent = idx === currentQuestionIndex;

                                    let badgeColorClass = 'bg-slate-800 text-slate-400 border border-slate-700';
                                    if (isMarked) {
                                        badgeColorClass = 'bg-purple-600 text-white font-bold border-purple-500 shadow-sm';
                                    } else if (isAnswered) {
                                        badgeColorClass = 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-sm';
                                    }

                                    return (
                                        <button
                                            key={q.id}
                                            id={`palette-btn-q-${idx + 1}`}
                                            onClick={() => handleJumpToQuestion(idx)}
                                            className={`h-9 rounded-xl text-xs transition-all flex items-center justify-center ${badgeColorClass} ${
                                                isCurrent ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-105' : 'hover:opacity-90'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fast Abandon / Reset */}
                        <div className="pt-2">
                            <button
                                id="exit-mock-test-early-btn"
                                onClick={() => {
                                    if (window.confirm('Do you want to exit this mock test and return to exam selection?')) {
                                        setCurrentStage('select_exam');
                                    }
                                }}
                                className="w-full py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold transition text-center"
                            >
                                Cancel & Switch Exam
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submission Confirmation Modal */}
                {showSubmitModal && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#0e1424] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl text-white">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    Submit Test Confirmation
                                </h3>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                                You are about to complete <span className="font-semibold text-white">{activeExam.title}</span>. Here is your completion summary:
                            </p>

                            <div className="grid grid-cols-3 gap-2.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total</span>
                                    <span className="text-base font-bold text-white">{questions.length}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">Answered</span>
                                    <span className="text-base font-bold text-emerald-400">{answeredCount}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-rose-400 uppercase font-bold block">Skipped</span>
                                    <span className="text-base font-bold text-rose-400">{unansweredCount}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    id="modal-resume-test-btn"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition"
                                >
                                    Resume Test
                                </button>
                                <button
                                    id="modal-confirm-submit-btn"
                                    onClick={() => handleSubmitTest(false)}
                                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                                >
                                    Calculate My Score
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // =========================================================================
    // VIEW 3: INSTANT CALCULATED SCORECARD & REVIEW
    // =========================================================================
    if (currentStage === 'score_card') {
        const {
            correctCount,
            incorrectCount,
            skippedCount,
            netScore,
            maxPossibleMarks,
            percentage,
            accuracy,
            avgTimePerQ,
            totalTimeSpentSeconds,
            percentile,
            rankBadge,
            badgeColor,
            evaluatedQuestions
        } = computedResults;

        const filteredReviewQuestions = evaluatedQuestions.filter(q => {
            if (reviewFilter === 'correct') return q.isCorrect;
            if (reviewFilter === 'incorrect') return q.isAnswered && !q.isCorrect;
            if (reviewFilter === 'skipped') return !q.isAnswered;
            return true;
        });

        return (
            <div id="mock-test-scorecard-view" className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-8 text-white shadow-2xl">
                {/* Scorecard Hero Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeColor}`}>
                                {rankBadge}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                            {activeExam.title} — Performance Scorecard
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Evaluated using official marking scheme (+{activeExam.marksPerQuestion} / -{activeExam.negativeMarks})
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            id="retake-this-mock-test-btn"
                            onClick={() => handleStartTest(activeExam.id)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Retake Test</span>
                        </button>

                        <button
                            id="switch-exam-after-test-btn"
                            onClick={() => setCurrentStage('select_exam')}
                            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Select Different Exam</span>
                        </button>
                    </div>
                </div>

                {/* 4-Stat Core Metric Tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Net Score */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                            Calculated Net Score
                        </span>
                        <div className="text-3xl font-extrabold text-white">
                            {netScore} <span className="text-sm font-normal text-slate-400">/ {maxPossibleMarks}</span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold">
                            {percentage}% Aggregate Marks
                        </span>
                    </div>

                    {/* 2. Accuracy */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                            Accuracy Rate
                        </span>
                        <div className="text-3xl font-extrabold text-blue-400">
                            {accuracy}%
                        </div>
                        <span className="text-[11px] text-slate-300">
                            {correctCount} Correct • {incorrectCount} Wrong
                        </span>
                    </div>

                    {/* 3. Estimated Percentile */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                            All-India Percentile
                        </span>
                        <div className="text-3xl font-extrabold text-amber-400">
                            {percentile}th
                        </div>
                        <span className="text-[11px] text-slate-400">
                            Out of simulated aspirant cohort
                        </span>
                    </div>

                    {/* 4. Time Metric */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                            Time Efficiency
                        </span>
                        <div className="text-3xl font-extrabold text-slate-200">
                            {avgTimePerQ}s
                        </div>
                        <span className="text-[11px] text-slate-400">
                            Total {Math.floor(totalTimeSpentSeconds / 60)}m {totalTimeSpentSeconds % 60}s spent
                        </span>
                    </div>
                </div>

                {/* Detailed Question Review & Solution Walkthrough */}
                <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-bold text-white">
                                Question-by-Question Solution Review
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Review correct answers, your choices, and mathematical shortcuts
                            </p>
                        </div>

                        {/* Review Filter Pills */}
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: 'all', label: `All (${evaluatedQuestions.length})` },
                                { id: 'correct', label: `Correct (${correctCount})` },
                                { id: 'incorrect', label: `Incorrect (${incorrectCount})` },
                                { id: 'skipped', label: `Skipped (${skippedCount})` }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    id={`review-tab-${tab.id}`}
                                    onClick={() => setReviewFilter(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                        reviewFilter === tab.id
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question Review Cards */}
                    <div className="space-y-4">
                        {filteredReviewQuestions.map((q, idx) => {
                            const isCorrect = q.isCorrect;
                            const isSkipped = !q.isAnswered;
                            const isExpanded = expandedExplanationId === q.id;

                            return (
                                <div
                                    key={q.id}
                                    id={`solution-card-${q.id}`}
                                    className="rounded-xl border border-slate-800/90 bg-slate-950/40 overflow-hidden"
                                >
                                    {/* Header Accordion Bar */}
                                    <button
                                        onClick={() => setExpandedExplanationId(isExpanded ? null : q.id)}
                                        className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-900/60 transition gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-md bg-slate-800 text-[11px] font-bold flex items-center justify-center text-slate-300 shrink-0">
                                                {idx + 1}
                                            </span>
                                            <p className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-1">
                                                {q.questionText}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            {isSkipped ? (
                                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                                    Skipped (0.0)
                                                </span>
                                            ) : isCorrect ? (
                                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Correct (+{activeExam.marksPerQuestion})
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                                    <XCircle className="w-3 h-3" /> Wrong (-{activeExam.negativeMarks})
                                                </span>
                                            )}

                                            <span className="text-xs text-blue-400 font-semibold underline">
                                                {isExpanded ? 'Hide Solution' : 'View Solution'}
                                            </span>
                                        </div>
                                    </button>

                                    {/* Solution Details Body */}
                                    {isExpanded && (
                                        <div className="p-5 border-t border-slate-800/80 bg-slate-900/40 space-y-4 text-xs">
                                            <div className="text-sm font-semibold text-white whitespace-pre-line">
                                                {q.questionText}
                                            </div>

                                            {/* Options Grid with Correct / Incorrect Highlighting */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                                {q.options.map((opt, oIdx) => {
                                                    const letter = String.fromCharCode(65 + oIdx);
                                                    const isUserChoice = q.userSelectedOptionId === opt.id;
                                                    const isCorrectOption = q.correctOptionId === opt.id;

                                                    let optionStyle = 'border-slate-800 bg-slate-950/40 text-slate-300';
                                                    if (isCorrectOption) {
                                                        optionStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
                                                    } else if (isUserChoice && !isCorrectOption) {
                                                        optionStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200 font-semibold ring-1 ring-rose-500/30';
                                                    }

                                                    return (
                                                        <div
                                                            key={opt.id}
                                                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${optionStyle}`}
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                                                                    isCorrectOption ? 'bg-emerald-600 text-white' : isUserChoice ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                                                                }`}>
                                                                    {letter}
                                                                </span>
                                                                <span>{opt.text}</span>
                                                            </div>
                                                            {isCorrectOption && (
                                                                <span className="text-[10px] font-bold text-emerald-400">Correct Answer</span>
                                                            )}
                                                            {isUserChoice && !isCorrectOption && (
                                                                <span className="text-[10px] font-bold text-rose-400">Your Choice</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation Text */}
                                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                                                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    <span>Detailed Mathematical / Logical Solution</span>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-xs">
                                                    {q.explanation}
                                                </p>

                                                {q.formulaShortcut && (
                                                    <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 font-mono flex items-center gap-1.5">
                                                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                                                        <span><strong>Shortcut / Trick:</strong> {q.formulaShortcut}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

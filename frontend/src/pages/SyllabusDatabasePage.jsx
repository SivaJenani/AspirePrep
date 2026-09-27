import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, Clock, Sunrise, Sun, Sunset, Moon, Sparkles, CheckCircle2,
    Play, Pause, RotateCcw, Award, Zap, Brain, ChevronRight, Check,
    Search, Filter, Plus, ArrowRight, ShieldCheck, Flame, BookMarked,
    HelpCircle, Lightbulb, AlertCircle, RefreshCw, X, Copy, CheckSquare,
    Compass, Target, SlidersHorizontal, Layers, Globe, ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';

const EXAM_OFFICIAL_PATTERNS = {
    exam_ssc_cgl: {
        name: 'SSC CGL (Combined Graduate Level)',
        officialBoard: 'Staff Selection Commission (Govt of India)',
        portalUrl: 'https://ssc.gov.in',
        maxMarks: '200 Marks (Tier-I) / 390 Marks (Tier-II)',
        negativeMarks: '-0.50 Marks (1/4th penalty) per wrong answer in Tier-I',
        durationMinutes: '60 Mins (Tier-I) / 135 Mins (Tier-II)',
        sections: 'Quantitative Aptitude (50M), Reasoning (50M), English (50M), General Awareness (50M)',
        fullSyllabusText: `Unit 1: Quantitative Aptitude & Arithmetic Core
Percentages, Successive Change, Ratio and Proportion, Average, Profit & Loss, Simple and Compound Interest, Time & Distance, Relative Speed, Time & Work, Pipes & Cisterns, Mixtures & Alligations.

Unit 2: Quantitative Aptitude (Advanced Algebra, Geometry & Mensuration)
Basic Algebraic Identities, Polynomials, Triangles & Congruence, Circles, Tangents, Angles, Quadrilaterals, Regular Polygons, Right Prism, Cone, Cylinder, Sphere, Trigonometry, Heights & Distances, Histogram, Pie Chart.

Unit 3: General Intelligence & Reasoning
Analogy, Classification, Series (Number, Figural), Coding-Decoding, Venn Diagrams, Syllogisms, Space Visualization, Blood Relations, Seating Arrangement (Linear & Circular), Paper Folding, Matrix Reasoning.

Unit 4: English Language & Comprehension
Spotting Errors, Fill in the Blanks, Synonyms & Antonyms, Spelling/Detecting Misspelt Words, Idioms & Phrases, One Word Substitution, Sentence Improvement, Active/Passive Voice, Direct/Indirect Speech, Cloze Test, Reading Comprehension Passages.

Unit 5: General Awareness & Computer Knowledge
History (Ancient, Medieval, Modern Freedom Movement), Geography (Physical, Indian, World), Indian Polity & Constitution (Articles, Amendments), Indian Economy & Budget, General Science (Physics, Chemistry, Biology), Current Affairs, Computer Basics (CPU, OS, MS Office, Internet, Cyber Security).`
    },
    exam_upsc_cse: {
        name: 'UPSC Civil Services Examination (IAS/IPS)',
        officialBoard: 'Union Public Service Commission (UPSC)',
        portalUrl: 'https://upsc.gov.in',
        maxMarks: '200 Marks (Prelims GS-1) / 2025 Marks (Mains + Interview)',
        negativeMarks: '-0.66 Marks (1/3rd penalty) per wrong answer in GS-1',
        durationMinutes: '120 Mins (2 Hours) per paper',
        sections: 'GS Paper 1 (200 Marks - Merit) & CSAT Paper 2 (200 Marks - Qualifying 33%)',
        fullSyllabusText: `Unit 1: History of India & Indian National Movement
Ancient India: Indus Valley Civilisation, Vedic Period, Buddhism & Jainism, Maurya & Gupta Empires.
Medieval India: Delhi Sultanate, Mughal Empire, Vijayanagara, Bhakti & Sufi Movements.
Modern History: Advent of Europeans, Revolt of 1857, Freedom Struggle (1885-1947), Gandhian Era, Post-Independence.

Unit 2: Indian & World Geography
Physical Geography: Geomorphology, Climatology, Oceanography, Soil & Vegetation.
Indian Geography: Drainage systems, Monsoons, Resources (Minerals, Agriculture), Industries & Transport.
World Geography: Major landforms, biomes, global resource distribution.

Unit 3: Indian Polity & Governance
Constitutional Framework: Preamble, Fundamental Rights, DPSPs, Fundamental Duties, Amendments.
Executive & Legislature: President, Prime Minister, Parliament, Governor, Chief Minister.
Judiciary: Supreme Court, High Courts, Judicial Review, PIL.
Governance: Panchayati Raj (73rd/74th Amendments), Statutory Bodies, Public Policy.

Unit 4: Economic & Social Development
Macroeconomics: National Income, GDP, Inflation, Monetary Policy (RBI), Fiscal Policy & Union Budget.
Inclusion & Welfare: Poverty Alleviation, Unemployment, Sustainable Development Goals (SDGs).
Financial System: Banking Reform, Stock Markets, External Sector (BoP, Trade), WTO.

Unit 5: Environment, Ecology, Biodiversity & General Science
Ecology: Biodiversity Hotspots, Endangered Species, Protected Area Network (National Parks, Sanctuaries).
Environmental Issues: Climate Change, Global Warming, Air & Water Pollution, International Conventions (UNFCCC, CBD).
General Science & Tech: Space Tech (ISRO), Defence Tech, Biotechnology, AI & Robotics, IT & Telecom.`
    },
    exam_ibps_po: {
        name: 'IBPS PO (Bank Probationary Officer)',
        officialBoard: 'Institute of Banking Personnel Selection (IBPS)',
        portalUrl: 'https://ibps.in',
        maxMarks: '100 Marks (Prelims) / 225 Marks (Mains + Descriptive)',
        negativeMarks: '-0.25 Marks (1/4th penalty) per wrong answer in Prelims & Mains',
        durationMinutes: '60 Mins (20 Mins per section in Prelims)',
        sections: 'Quantitative Aptitude (35 Qs / 35M), Reasoning Ability (35 Qs / 35M), English Language (30 Qs / 30M)',
        fullSyllabusText: `Unit 1: Quantitative Aptitude & Data Interpretation
Data Interpretation (Bar, Line, Pie, Tabular, Radar, Caselet DI), Data Sufficiency, Quadratic Equations, Number Series (Missing & Wrong), Simplification & Approximation, Arithmetic Word Problems (Percentage, Profit-Loss, Simple/Compound Interest, Time-Work, Mixtures).

Unit 2: Reasoning Ability & Puzzles
Seating Arrangement (Circular, Linear, Square, Floor-Uncertain), Puzzles (Box, Month-Day, Category), Syllogism (Only a few), Inequalities, Input-Output, Blood Relations, Direction Sense, Coding-Decoding (New Pattern), Critical Reasoning.

Unit 3: English Language & Verbal Ability
Reading Comprehension (Economy & Financial context), Cloze Test, Para Jumbles, Error Spotting (New Pattern), Sentence Improvement, Word Swap, Phrase Replacement, Fillers.

Unit 4: General, Economy & Banking Awareness (Mains)
Banking & Financial Terms, RBI Functions & Monetary Policy, Union Budget & Economic Survey, NPA & Capital Market, Current Affairs (National & International), Government Schemes, Headquarters, Taglines & Static GK.

Unit 5: Computer Aptitude & Data Governance
Computer Hardware & Software Basics, OS, Memory Hierarchy, Networking Protocols, DBMS Basics, Binary-Octal Conversions, Keyboard Shortcuts, Cyber Security & Encryption.`
    },
    exam_tnpsc_group4: {
        name: 'TNPSC Group 4 (Tamil Nadu Services)',
        officialBoard: 'Tamil Nadu Public Service Commission (TNPSC)',
        portalUrl: 'https://tnpsc.gov.in',
        maxMarks: '300 Marks (200 Questions × 1.5 Marks)',
        negativeMarks: 'No Negative Marking (0 Penalty for wrong answers)',
        durationMinutes: '180 Mins (3 Hours)',
        sections: 'Part A: Tamil Eligibility & Language (150 Marks), Part B: General Studies (75 Marks) & Mental Ability (75 Marks)',
        fullSyllabusText: `Unit 1: Tamil Eligibility & Language (பொதுத்தமிழ் - இலக்கணம், இலக்கியம், தமிழ் அறிஞர்கள்)
இலக்கணம்: பொருத்துதல், தொடரும் தொடர்பும் அறிதல், பிரித்தெழுதுக, எதிர்ச்சொல், பொருந்தாச் சொல்லைக் கண்டறிதல், பிழை திருத்தம்.
இலக்கியம்: திருக்குறள், அறநூல்கள் (நாலடியார், நான்மணிக்கடிகை), கம்பராமாயணம், எட்டுத்தொகை, பத்துப்பாட்டு, ஐம்பெருங்காப்பியங்கள், சிற்றிலக்கியங்கள்.
தமிழ் அறிஞர்களும் தமிழ்த்தொண்டும்: பாரதியார், பாரதிதாசன், நாமக்கல் கவிஞர், மரபுக் கவிதை, புதுக்கவிதை, நாடகக்கலை, தமிழ் உரைநடை.

Unit 2: General Science (பொது அறிவியல்)
Physics: Nature of Universe, General Scientific Laws, Inventions, Electricity, Magnetism, Light, Sound, Heat.
Chemistry: Elements, Compounds, Acids, Bases, Salts, Fertilizers, Pesticides.
Botany & Zoology: Main concepts of Life Science, Classification of Living Organisms, Nutrition, Human Physiology, Diseases & Prevention.

Unit 3: Current Events, Geography & History of India & Tamil Nadu
Current Events: National symbols, States profile, Sports, Awards, Books & Authors.
Geography: Earth & Universe, Monsoon, Weather, Rainfall, Water resources, Forest & Wildlife.
History: Indus Valley Civilization, Guptas, Delhi Sultans, Mughals, Marathas, Vijayanagaram, South Indian History (Chola, Chera, Pandya).

Unit 4: Indian Polity & Economy
Indian Polity: Constitution of India, Preamble, Salient features, Fundamental Rights, Fundamental Duties, Union Executive, Legislature, Judiciary, Panchayati Raj.
Indian Economy: Nature of Indian economy, Five-year plan models, RBI, Finance Commission, Land reforms, GST, Employment generation schemes.

Unit 5: Aptitude & Mental Ability Tests (திறனறிவும் மனக்கணக்கு நுண்ணறிவும்)
Simplification, Percentage, Highest Common Factor (HCF) & Lowest Common Multiple (LCM), Ratio & Proportion, Simple Interest & Compound Interest, Area, Volume, Time & Work, Logical Reasoning, Puzzles, Dice, Visual Reasoning, Number Series.`
    },
    exam_rrb_ntpc: {
        name: 'RRB NTPC (Non-Technical Popular Categories)',
        officialBoard: 'Railway Recruitment Board (Ministry of Railways)',
        portalUrl: 'https://rrbcdg.gov.in',
        maxMarks: '100 Marks (CBT-1) / 120 Marks (CBT-2)',
        negativeMarks: '-0.33 Marks (1/3rd penalty) per wrong response',
        durationMinutes: '90 Mins (1.5 Hours)',
        sections: 'General Awareness (40 Qs), Mathematics (30 Qs), General Intelligence & Reasoning (30 Qs)',
        fullSyllabusText: `Unit 1: Mathematics (Arithmetic & Mensuration)
Number System, Decimals, Fractions, LCM & HCF, Ratio & Proportion, Percentages, Mensuration, Time & Work, Time & Distance, Simple & Compound Interest, Profit & Loss, Elementary Algebra, Geometry & Trigonometry, Elementary Statistics.

Unit 2: General Intelligence & Reasoning
Analogies, Completion of Number and Alphabetical Series, Coding & Decoding, Mathematical Operations, Similarities & Differences, Relationships, Analytical Reasoning, Syllogism, Jumbling, Venn Diagrams, Data Interpretation & Sufficiency, Statement-Conclusion, Decision Making, Maps, Interpretation of Graphs.

Unit 3: General Awareness - Science & Technology
Physics, Chemistry & Life Sciences (up to 10th CBSE Standard), Scientific & Technological Developments, Space (ISRO) & Defence (DRDO) Programs.

Unit 4: General Awareness - History, Geography & Indian Polity
Monuments & Places of India, Indian Freedom Struggle, Physical, Social & Economic Geography of India & World, Indian Polity & Governance - Constitution & Political System.

Unit 5: General Awareness - Indian Economy, Railways & Current Affairs
Indian Economy & Budget, Famous Personalities of India & World, Flagship Government Programs, Flora & Fauna of India, Important Indian & World Organizations, Indian Railway History & Infrastructure, Current Events of National & International Importance.`
    },
    exam_jee_main: {
        name: 'JEE Main (National Engineering Entrance)',
        officialBoard: 'National Testing Agency (NTA)',
        portalUrl: 'https://jeemain.nta.nic.in',
        maxMarks: '300 Marks (Physics 100 + Chemistry 100 + Mathematics 100)',
        negativeMarks: '-1 Mark for incorrect MCQ (+4 Marks for correct answer)',
        durationMinutes: '180 Mins (3 Hours)',
        sections: 'Section A (20 MCQs) + Section B (10 Numerical Value Questions, attempt 5) per subject',
        fullSyllabusText: `Unit 1: Mathematics
Sets, Relations & Functions, Complex Numbers & Quadratic Equations, Matrices & Determinants, Permutations & Combinations, Mathematical Induction, Binomial Theorem, Sequences & Series, Limit, Continuity & Differentiability, Integral Calculus, Differential Equations, Coordinate Geometry (Straight Lines, Circles, Conic Sections), Vector Algebra, 3D Geometry, Statistics & Probability, Trigonometry.

Unit 2: Physics - Mechanics & Waves
Units & Measurements, Kinematics, Laws of Motion, Work, Energy & Power, Rotational Motion, Gravitation, Properties of Solids & Liquids, Thermodynamics, Kinetic Theory of Gases, Oscillations & Waves, Simple Harmonic Motion.

Unit 3: Physics - Electricity, Magnetism & Modern Physics
Electrostatics, Current Electricity, Magnetic Effects of Current & Magnetism, Electromagnetic Induction & Alternating Currents, Electromagnetic Waves, Optics (Ray & Wave Optics), Dual Nature of Matter & Radiation, Atoms & Nuclei, Electronic Devices (Semiconductors, Logic Gates), Communication Systems.

Unit 4: Chemistry - Physical & Inorganic Chemistry
Physical Chemistry: Some Basic Concepts in Chemistry, States of Matter, Atomic Structure, Chemical Bonding & Molecular Structure, Chemical Thermodynamics, Solutions, Equilibrium, Redox Reactions & Electrochemistry, Chemical Kinetics, Surface Chemistry.
Inorganic Chemistry: Classification of Elements & Periodicity, General Principles of Extraction of Metals, Hydrogen, s-Block Elements, p-Block Elements, d- and f-Block Elements, Coordination Compounds, Environmental Chemistry.

Unit 5: Chemistry - Organic Chemistry & Practical Chemistry
Organic Chemistry: Purification & Characterization of Organic Compounds, Basic Principles of Organic Chemistry, Hydrocarbons, Organic Compounds Containing Halogens, Oxygen (Alcohols, Phenols, Ethers, Aldehydes, Ketones, Carboxylic Acids), Nitrogen (Amines, Diazo), Polymers, Biomolecules (Carbohydrates, Proteins, Nucleic Acids), Chemistry in Everyday Life, Principles Related to Practical Chemistry.`
    }
};

export const SyllabusDatabasePage = () => {
    const { user, topicProgress, updateTopicProgress, isDarkMode } = useAppStore();

    // Data states
    const [loading, setLoading] = useState(true);
    const [examData, setExamData] = useState(null);
    const [syllabusTopics, setSyllabusTopics] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [periodsConfig, setPeriodsConfig] = useState([]);
    const [currentPeriodId, setCurrentPeriodId] = useState('period_morning');
    const [selectedPeriodId, setSelectedPeriodId] = useState('period_morning');
    const [periodData, setPeriodData] = useState(null);
    const [activeExamId, setActiveExamId] = useState(user?.targetExamId || 'exam_ssc_cgl');
    const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
    const [copiedSyllabusText, setCopiedSyllabusText] = useState(false);

    // Filtering states
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedWeightage, setSelectedWeightage] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Active Study Modals / Workspaces
    const [activeQuizTopic, setActiveQuizTopic] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizResults, setQuizResults] = useState(null);
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

    const [activeFormulaTopic, setActiveFormulaTopic] = useState(null);
    const [copiedFormulaIndex, setCopiedFormulaIndex] = useState(null);

    const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
    const [tempAllocatedIds, setTempAllocatedIds] = useState([]);

    // Period Focus Timer State
    const [activeTimerTopic, setActiveTimerTopic] = useState(null);
    const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [selectedTimerDuration, setSelectedTimerDuration] = useState(25); // 15, 25, 45 mins
    const [timerNotes, setTimerNotes] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    const timerIntervalRef = useRef(null);

    // Initial load
    useEffect(() => {
        loadSyllabusDatabase(activeExamId);
        loadCurrentPeriodData(activeExamId, selectedPeriodId);
    }, [activeExamId]);

    // When selected period changes
    useEffect(() => {
        loadCurrentPeriodData(activeExamId, selectedPeriodId);
    }, [selectedPeriodId]);

    // Timer tick handler
    useEffect(() => {
        if (isTimerRunning && timerSecondsLeft > 0) {
            timerIntervalRef.current = setInterval(() => {
                setTimerSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current);
                        setIsTimerRunning(false);
                        handleLogCompletedTimer();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [isTimerRunning, timerSecondsLeft]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const loadSyllabusDatabase = async (examId) => {
        try {
            setLoading(true);
            const res = await api.get(`/syllabus/database?examId=${examId}`);
            if (res.data) {
                setExamData(res.data.exam);
                setSyllabusTopics(res.data.topics || []);
                setSubjects(res.data.subjects || []);
                setPeriodsConfig(res.data.periodsConfig || []);
                if (res.data.currentPeriodId) {
                    setCurrentPeriodId(res.data.currentPeriodId);
                    setSelectedPeriodId(res.data.currentPeriodId);
                }
            }
        } catch (err) {
            console.error('Failed to load syllabus database:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadCurrentPeriodData = async (examId, periodId) => {
        try {
            const res = await api.get(`/syllabus/current-period?examId=${examId}&periodId=${periodId}`);
            if (res.data) {
                setPeriodData(res.data);
                setTempAllocatedIds((res.data.allocatedTopics || []).map((t) => t.id));
            }
        } catch (err) {
            console.error('Failed to load current period data:', err);
        }
    };

    // Filtered topics in syllabus database
    const filteredTopics = useMemo(() => {
        return syllabusTopics.filter((t) => {
            const matchesSubject = selectedSubject === 'all' || t.subjectId === selectedSubject;
            const matchesWeightage = selectedWeightage === 'all' || t.weightage.toLowerCase() === selectedWeightage.toLowerCase();
            const matchesSearch =
                !searchQuery.trim() ||
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.chapterName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSubject && matchesWeightage && matchesSearch;
        });
    }, [syllabusTopics, selectedSubject, selectedWeightage, searchQuery]);

    // Helper to get local mastery status
    const getTopicStatus = (topicId) => {
        const local = topicProgress?.[topicId]?.status;
        if (local) return local;
        const topic = syllabusTopics.find((t) => t.id === topicId);
        return topic?.status || 'not_started';
    };

    // Save allocation of topics into current period
    const handleSavePeriodAllocations = async () => {
        try {
            const res = await api.post('/syllabus/period/allocate', {
                examId: activeExamId,
                periodId: selectedPeriodId,
                topicIds: tempAllocatedIds
            });
            if (res.data.success) {
                setIsAllocateModalOpen(false);
                loadCurrentPeriodData(activeExamId, selectedPeriodId);
                showToast(`✅ Allocated ${tempAllocatedIds.length} topic(s) to this study period!`);
            }
        } catch (err) {
            console.error('Failed to allocate topics to period:', err);
        }
    };

    // Timer helpers
    const handleStartTimerForTopic = (topic) => {
        setActiveTimerTopic(topic);
        setTimerSecondsLeft(selectedTimerDuration * 60);
        setIsTimerRunning(true);
    };

    const handleSelectTimerDuration = (mins) => {
        setSelectedTimerDuration(mins);
        setTimerSecondsLeft(mins * 60);
        setIsTimerRunning(false);
    };

    const handleLogCompletedTimer = async () => {
        if (!activeTimerTopic) return;
        try {
            const minsSpent = selectedTimerDuration;
            const res = await api.post('/syllabus/topic/study-session', {
                topicId: activeTimerTopic.id,
                periodId: selectedPeriodId,
                minutesLogged: minsSpent,
                notes: timerNotes,
                status: 'in_progress'
            });
            if (res.data.success) {
                updateTopicProgress(activeTimerTopic.id, {
                    status: 'in_progress',
                    studyMinutesLogged: (topicProgress?.[activeTimerTopic.id]?.studyMinutesLogged || 0) + minsSpent
                });
                showToast(`🎉 Logged ${minsSpent} mins in current period! +${res.data.xpEarned} XP earned.`);
                loadCurrentPeriodData(activeExamId, selectedPeriodId);
                setIsTimerRunning(false);
                setActiveTimerTopic(null);
                setTimerNotes('');
            }
        } catch (err) {
            console.error('Failed to log period session:', err);
        }
    };

    // Topic status toggle
    const handleUpdateStatus = async (topicId, newStatus) => {
        try {
            updateTopicProgress(topicId, { status: newStatus });
            await api.post('/syllabus/progress/update', {
                topicId,
                status: newStatus
            });
            showToast(`Topic updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
            loadSyllabusDatabase(activeExamId);
            loadCurrentPeriodData(activeExamId, selectedPeriodId);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    // Practice Quiz submission
    const handleAnswerSelect = (questionId, option) => {
        if (quizSubmitted) return;
        setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmitQuiz = async () => {
        if (!activeQuizTopic) return;
        try {
            setIsSubmittingQuiz(true);
            const res = await api.post('/syllabus/practice-submit', {
                topicId: activeQuizTopic.id,
                periodId: selectedPeriodId,
                answers: quizAnswers
            });
            if (res.data.success) {
                setQuizResults(res.data);
                setQuizSubmitted(true);
                updateTopicProgress(activeQuizTopic.id, {
                    status: res.data.newStatus
                });
                showToast(`🎯 Scored ${res.data.score}/${res.data.total} (${res.data.scorePercent}%)! +${res.data.xpGained} XP`);
                loadCurrentPeriodData(activeExamId, selectedPeriodId);
                loadSyllabusDatabase(activeExamId);
            }
        } catch (err) {
            console.error('Failed to submit quiz:', err);
        } finally {
            setIsSubmittingQuiz(false);
        }
    };

    const handleCopyFormula = (text, index) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedFormulaIndex(index);
            setTimeout(() => setCopiedFormulaIndex(null), 2000);
        }
    };

    const formatTimerTime = (totalSec) => {
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getPeriodIcon = (iconName) => {
        switch (iconName) {
            case 'Sunrise': return Sunrise;
            case 'Sun': return Sun;
            case 'Sunset': return Sunset;
            case 'Moon': return Moon;
            default: return Clock;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl dark:bg-indigo-600 animate-in fade-in slide-in-from-bottom-5">
                    <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                HERO & EXAM CONTEXT BAR
            ══════════════════════════════════════════════════════════════════ */}
            <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                                <BookOpen className="h-3.5 w-3.5" />
                                Official Syllabus Database & Study Period Engine
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                {examData?.name || 'SSC CGL'} Syllabus & Timetable Periods
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                                Complete official syllabus catalog mapped to high-yield exam weightage, formula cheatsheets, and real-time study period utilization.
                            </p>
                        </div>

                        {/* Exam Switcher */}
                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selected Exam:</div>
                            <select
                                id="exam-select-dropdown"
                                value={activeExamId}
                                onChange={(e) => setActiveExamId(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                            >
                                <option value="exam_ssc_cgl">SSC CGL (Government Ministries)</option>
                                <option value="exam_upsc_cse">UPSC Civil Services (IAS/IPS)</option>
                                <option value="exam_ibps_po">IBPS PO (Probationary Officer)</option>
                                <option value="exam_tnpsc_group4">TNPSC Group 4 (Tamil Nadu)</option>
                                <option value="exam_rrb_ntpc">RRB NTPC (Indian Railways)</option>
                                <option value="exam_jee_main">JEE Main (Engineering Entrance)</option>
                            </select>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Core Topics</div>
                            <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">{syllabusTopics.length} Topics</div>
                            <div className="mt-0.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{subjects.length} Major Subjects</div>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">High Weightage Focus</div>
                            <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                                {syllabusTopics.filter(t => t.weightage === 'High').length} High-Yield
                            </div>
                            <div className="mt-0.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Tier-I & Tier-II Core</div>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Study Period</div>
                            <div className="mt-1 text-xl font-black text-amber-600 dark:text-amber-400 capitalize">
                                {periodsConfig.find(p => p.id === currentPeriodId)?.name.split('&')[0] || 'Morning'}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500 font-medium">Real-time Clock Synced</div>
                        </div>

                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Period Utilization</div>
                            <div className="mt-1 text-xl font-black text-indigo-600 dark:text-indigo-400">
                                {periodData?.utilization?.utilizationPercent || 0}%
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500 font-medium">
                                {periodData?.utilization?.minutesLogged || 0} / {periodData?.utilization?.targetMinutes || 90} mins
                            </div>
                        </div>
                    </div>

                    {/* Official Exam Pattern & Marking Scheme Card */}
                    {(() => {
                        const pattern = EXAM_OFFICIAL_PATTERNS[activeExamId] || EXAM_OFFICIAL_PATTERNS['exam_ssc_cgl'];
                        return (
                            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-md space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-200">Official Exam Pattern & Marking Scheme</h3>
                                            <span className="text-[11px] text-slate-300 font-medium">{pattern.name} • Board: {pattern.officialBoard}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsSyllabusModalOpen(true)}
                                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                                        >
                                            <BookOpen className="w-3.5 h-3.5" />
                                            View Full Official Syllabus Text
                                        </button>
                                        <a
                                            href={pattern.portalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                            title="Visit Official Portal"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                                        <span className="text-[10px] font-extrabold uppercase text-amber-300 block">🎯 Maximum Marks</span>
                                        <span className="text-xs font-black text-white block">{pattern.maxMarks}</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                                        <span className="text-[10px] font-extrabold uppercase text-rose-300 block">⚠️ Negative Marking</span>
                                        <span className="text-xs font-black text-white block">{pattern.negativeMarks}</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-0.5">
                                        <span className="text-[10px] font-extrabold uppercase text-emerald-300 block">⏱️ Duration & Structure</span>
                                        <span className="text-xs font-black text-white block">{pattern.durationMinutes} • {pattern.sections}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                MAIN CONTENT BODY
            ══════════════════════════════════════════════════════════════════ */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

                {/* ──────────────────────────────────────────────────────────────
                    1. CURRENT PERIOD STUDY COMMAND CENTER
                ────────────────────────────────────────────────────────────── */}
                <div id="current-period-command-center" className="rounded-3xl border border-indigo-200/80 bg-gradient-to-b from-white to-indigo-50/30 p-6 sm:p-8 shadow-xs dark:border-indigo-900/60 dark:from-slate-900 dark:to-indigo-950/20 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-indigo-100 pb-5 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                    Current Study Period Utilization
                                </span>
                            </div>
                            <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                                {periodData?.currentPeriod?.name || 'Study Period'} ({periodData?.currentPeriod?.timeRange})
                            </h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                                {periodData?.currentPeriod?.description}
                            </p>
                        </div>

                        {/* Action buttons for Current Period */}
                        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                            <button
                                id="btn-allocate-topics-period"
                                onClick={() => setIsAllocateModalOpen(true)}
                                className="flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-white px-3.5 py-2.5 text-xs font-bold text-indigo-700 shadow-xs hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-slate-700 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Assign / Swap Topics
                            </button>
                            <Link
                                to="/study-plan"
                                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Full Timetable
                            </Link>
                        </div>
                    </div>

                    {/* Period Tabs Navigation */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {periodsConfig.map((period) => {
                            const IconComponent = getPeriodIcon(period.icon);
                            const isSelected = selectedPeriodId === period.id;
                            const isLiveNow = currentPeriodId === period.id;

                            return (
                                <button
                                    key={period.id}
                                    id={`period-tab-${period.id}`}
                                    onClick={() => setSelectedPeriodId(period.id)}
                                    className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                        isSelected
                                            ? 'border-indigo-600 bg-indigo-600/10 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/40 dark:text-white shadow-xs'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300'
                                    }`}
                                >
                                    {isLiveNow && (
                                        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            Active
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                                            Period {period.slotNumber}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm font-bold truncate">{period.name.split('&')[0]}</div>
                                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{period.timeRange}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Current Period Utilization Metrics & Active Timer */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Period Utilization Bar */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-500">Period Progress</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                    {periodData?.utilization?.minutesLogged || 0} of {periodData?.utilization?.targetMinutes || 90}m logged
                                </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-700"
                                    style={{ width: `${periodData?.utilization?.utilizationPercent || 0}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>{periodData?.utilization?.topicsCompleted || 0} of {periodData?.allocatedTopics?.length || 0} topics mastered</span>
                                <span className="font-bold">{periodData?.utilization?.utilizationPercent || 0}% utilized</span>
                            </div>
                        </div>

                        {/* Interactive Period Focus Timer */}
                        <div className="md:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                                    Active Period Focus Timer
                                </div>
                                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                                    {formatTimerTime(timerSecondsLeft)}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {activeTimerTopic ? `Target Topic: ${activeTimerTopic.name}` : 'Select a topic below to start focused study'}
                                </div>
                            </div>

                            {/* Timer Duration Pills & Controls */}
                            <div className="flex flex-wrap items-center gap-2">
                                {[15, 25, 45].map((mins) => (
                                    <button
                                        key={mins}
                                        onClick={() => handleSelectTimerDuration(mins)}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                                            selectedTimerDuration === mins
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                    >
                                        {mins}m
                                    </button>
                                ))}

                                <button
                                    id="btn-toggle-timer"
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer ${
                                        isTimerRunning
                                            ? 'bg-amber-600 hover:bg-amber-700'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                >
                                    {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                    {isTimerRunning ? 'Pause' : 'Start Focus'}
                                </button>

                                <button
                                    id="btn-log-timer-early"
                                    onClick={handleLogCompletedTimer}
                                    title="Log studied minutes to profile and database"
                                    className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Log Study
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Topics Allocated For This Current Period */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                Topics Allocated to This Period ({periodData?.allocatedTopics?.length || 0})
                            </h3>
                            <span className="text-xs text-slate-500">
                                Click any topic to test, review formulas, or study
                            </span>
                        </div>

                        {(!periodData?.allocatedTopics || periodData.allocatedTopics.length === 0) ? (
                            <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                                <BookMarked className="mx-auto h-8 w-8 text-slate-400" />
                                <div className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">No topics allocated for this period yet</div>
                                <p className="mt-1 text-xs text-slate-500">Click "Assign / Swap Topics" above to pick topics from your syllabus database.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {periodData.allocatedTopics.map((topic) => {
                                    const status = getTopicStatus(topic.id);
                                    const isMastered = status === 'mastered';
                                    const isCompleted = status === 'completed';

                                    return (
                                        <div
                                            key={topic.id}
                                            id={`topic-period-card-${topic.id}`}
                                            className="neon-outline-container bg-white p-5 dark:bg-slate-900 space-y-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                                            {topic.code}
                                                        </span>
                                                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                                                            {topic.weightage} Weightage ({topic.weightagePercent}%)
                                                        </span>
                                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            {topic.typicalQuestions}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                                        {topic.name}
                                                    </h4>
                                                    <div className="text-xs text-slate-500">
                                                        {topic.subjectName} • {topic.chapterName}
                                                    </div>
                                                </div>

                                                {/* Status indicator */}
                                                <div className="shrink-0">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                        isMastered
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                            : isCompleted
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                    }`}>
                                                        {isMastered ? <CheckCircle2 className="h-3 w-3" /> : null}
                                                        {status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Key Formulas Preview */}
                                            {topic.keyFormulas && topic.keyFormulas.length > 0 && (
                                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                                                    <div className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                                        Key Exam Rule / Formula
                                                    </div>
                                                    <div className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300">
                                                        {topic.keyFormulas[0]}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Bar for This Topic */}
                                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                                <button
                                                    onClick={() => handleStartTimerForTopic(topic)}
                                                    className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 cursor-pointer"
                                                >
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Focus Timer
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setActiveQuizTopic(topic);
                                                        setQuizAnswers({});
                                                        setQuizSubmitted(false);
                                                        setQuizResults(null);
                                                    }}
                                                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 cursor-pointer"
                                                >
                                                    <Zap className="h-3.5 w-3.5" />
                                                    Solve Topic Questions ({topic.practiceQuestions?.length || 0})
                                                </button>

                                                <button
                                                    onClick={() => setActiveFormulaTopic(topic)}
                                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                                                >
                                                    <Lightbulb className="h-3.5 w-3.5" />
                                                    Cheatsheet
                                                </button>

                                                <button
                                                    onClick={() => handleUpdateStatus(topic.id, isMastered ? 'in_progress' : 'mastered')}
                                                    className={`ml-auto flex items-center gap-1 text-[11px] font-bold ${
                                                        isMastered ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {isMastered ? 'Mastered' : 'Mark Mastered'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ──────────────────────────────────────────────────────────────
                    2. COMPLETE OFFICIAL SYLLABUS DATABASE EXPLORER
                ────────────────────────────────────────────────────────────── */}
                <div id="syllabus-database-catalog" className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                <Layers className="h-3.5 w-3.5" />
                                Exam Syllabus Repository
                            </div>
                            <h2 className="text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
                                Complete Syllabus Database ({filteredTopics.length} Topics Found)
                            </h2>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative min-w-[220px]">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    id="input-syllabus-search"
                                    type="text"
                                    placeholder="Search topic, code, or chapter..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                />
                            </div>

                            {/* Weightage filter */}
                            <select
                                id="select-weightage-filter"
                                value={selectedWeightage}
                                onChange={(e) => setSelectedWeightage(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                            >
                                <option value="all">All Weightages</option>
                                <option value="high">High Weightage</option>
                                <option value="medium">Medium Weightage</option>
                                <option value="low">Low Weightage</option>
                            </select>
                        </div>
                    </div>

                    {/* Subject Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
                        <button
                            id="filter-subject-all"
                            onClick={() => setSelectedSubject('all')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                                selectedSubject === 'all'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                        >
                            All Subjects ({syllabusTopics.length})
                        </button>
                        {subjects.map((sub) => (
                            <button
                                key={sub.id}
                                id={`filter-subject-${sub.id}`}
                                onClick={() => setSelectedSubject(sub.id)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                                    selectedSubject === sub.id
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                {sub.name} ({sub.topicsCount})
                            </button>
                        ))}
                    </div>

                    {/* Syllabus Topic Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTopics.map((topic) => {
                            const status = getTopicStatus(topic.id);
                            const isAllocatedInCurrent = (periodData?.allocatedTopics || []).some(t => t.id === topic.id);

                            return (
                                <div
                                    key={topic.id}
                                    id={`catalog-topic-${topic.id}`}
                                    className="neon-outline-container flex flex-col justify-between bg-white p-5 dark:bg-slate-900"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                {topic.code}
                                            </span>
                                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                topic.weightage === 'High'
                                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                            }`}>
                                                {topic.weightage} Weight ({topic.weightagePercent}%)
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                                                {topic.name}
                                            </h3>
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                {topic.subjectName} • {topic.chapterName}
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                            {topic.summary}
                                        </p>

                                        {/* Recommended Period Badge */}
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                            <Clock className="h-3 w-3 text-indigo-500" />
                                            <span>Best slot: <strong className="text-slate-700 dark:text-slate-300 capitalize">{topic.recommendedPeriod?.replace('period_', '')} Period</strong></span>
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => {
                                                setActiveQuizTopic(topic);
                                                setQuizAnswers({});
                                                setQuizSubmitted(false);
                                                setQuizResults(null);
                                            }}
                                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                                        >
                                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                                            Quiz ({topic.practiceQuestions?.length || 0})
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveTimerTopic(topic);
                                                setTimerSecondsLeft(selectedTimerDuration * 60);
                                                setIsTimerRunning(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                                        >
                                            <Play className="h-3.5 w-3.5" />
                                            Study Now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                MODAL 1: PRACTICE QUESTIONS WORKSPACE
            ══════════════════════════════════════════════════════════════════ */}
            {activeQuizTopic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div>
                                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    {activeQuizTopic.code} • {activeQuizTopic.subjectName}
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                    {activeQuizTopic.name} Practice Drill
                                </h3>
                            </div>
                            <button
                                onClick={() => setActiveQuizTopic(null)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-6">
                            {(activeQuizTopic.practiceQuestions || []).map((q, qIndex) => {
                                const isSelected = (opt) => quizAnswers[q.id] === opt;
                                const result = quizResults?.results?.find(r => r.id === q.id);

                                return (
                                    <div key={q.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                                            <span>Question {qIndex + 1} of {activeQuizTopic.practiceQuestions.length}</span>
                                            <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{q.examYear}</span>
                                        </div>

                                        <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                                            {q.question}
                                        </div>

                                        {/* Options */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                            {q.options.map((opt) => {
                                                let optClass = 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
                                                if (quizSubmitted) {
                                                    if (opt === q.correctAnswer) {
                                                        optClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold';
                                                    } else if (isSelected(opt)) {
                                                        optClass = 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300';
                                                    }
                                                } else if (isSelected(opt)) {
                                                    optClass = 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 font-bold';
                                                }

                                                return (
                                                    <button
                                                        key={opt}
                                                        disabled={quizSubmitted}
                                                        onClick={() => handleAnswerSelect(q.id, opt)}
                                                        className={`rounded-xl border p-3 text-xs font-medium text-left transition flex items-center justify-between cursor-pointer ${optClass}`}
                                                    >
                                                        <span>{opt}</span>
                                                        {quizSubmitted && opt === q.correctAnswer && (
                                                            <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation after submission */}
                                        {quizSubmitted && (
                                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs dark:border-indigo-900/60 dark:bg-indigo-950/40 space-y-1.5">
                                                <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                                                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                                    Official Solution & Shortcut Trick:
                                                </div>
                                                <div className="text-slate-700 dark:text-slate-300">{q.explanation}</div>
                                                {q.shortcutTrick && (
                                                    <div className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 font-bold mt-1">
                                                        ⚡ Shortcut: {q.shortcutTrick}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                            <div className="text-xs text-slate-500">
                                {quizSubmitted ? (
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        Score: {quizResults?.score}/{quizResults?.total} ({quizResults?.scorePercent}%)
                                    </span>
                                ) : (
                                    `${Object.keys(quizAnswers).length} of ${activeQuizTopic.practiceQuestions.length} answered`
                                )}
                            </div>

                            {!quizSubmitted ? (
                                <button
                                    id="btn-submit-topic-quiz"
                                    disabled={isSubmittingQuiz || Object.keys(quizAnswers).length === 0}
                                    onClick={handleSubmitQuiz}
                                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmittingQuiz ? 'Submitting...' : 'Submit Answers & Verify'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setActiveQuizTopic(null)}
                                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
                                >
                                    Done & Return to Period
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                MODAL 2: HIGH-YIELD FORMULAS CHEATSHEET
            ══════════════════════════════════════════════════════════════════ */}
            {activeFormulaTopic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div>
                                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    {activeFormulaTopic.code} Formula Deck
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                    {activeFormulaTopic.name}
                                </h3>
                            </div>
                            <button
                                onClick={() => setActiveFormulaTopic(null)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Formulas List */}
                        <div className="space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                High-Frequency Formulas & Theorems
                            </div>
                            {(activeFormulaTopic.keyFormulas || []).map((formula, idx) => (
                                <div
                                    key={idx}
                                    className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-xs font-mono text-indigo-950 dark:border-slate-800 dark:bg-slate-800/60 dark:text-indigo-200"
                                >
                                    <span>{formula}</span>
                                    <button
                                        onClick={() => handleCopyFormula(formula, idx)}
                                        className="ml-2 rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer shrink-0"
                                    >
                                        {copiedFormulaIndex === idx ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Memory Shortcuts & Speed Tips */}
                        {activeFormulaTopic.cheatSheetTips && activeFormulaTopic.cheatSheetTips.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Speed Calculation & Memory Tips
                                </div>
                                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                    {activeFormulaTopic.cheatSheetTips.map((tip, idx) => (
                                        <li key={idx} className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
                                            💡 {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setActiveFormulaTopic(null)}
                                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
                            >
                                Close Cheatsheet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                MODAL 3: ALLOCATE / SWAP TOPICS FOR THIS PERIOD
            ══════════════════════════════════════════════════════════════════ */}
            {isAllocateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
                    <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div>
                                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                    Timetable Allocation Engine
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                    Assign Topics to {periodsConfig.find(p => p.id === selectedPeriodId)?.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Select the syllabus topics you want to utilize during this specific study period.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsAllocateModalOpen(false)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Topic selector checkboxes */}
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                            {syllabusTopics.map((topic) => {
                                const isChecked = tempAllocatedIds.includes(topic.id);

                                return (
                                    <label
                                        key={topic.id}
                                        className={`flex items-start gap-3 rounded-xl border p-3.5 transition cursor-pointer ${
                                            isChecked
                                                ? 'border-indigo-600 bg-indigo-50/60 dark:border-indigo-500 dark:bg-indigo-950/40'
                                                : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                                if (isChecked) {
                                                    setTempAllocatedIds(tempAllocatedIds.filter(id => id !== topic.id));
                                                } else {
                                                    setTempAllocatedIds([...tempAllocatedIds, topic.id]);
                                                }
                                            }}
                                            className="mt-1 h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{topic.code}</span>
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">{topic.name}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {topic.subjectName} • {topic.weightage} Weightage ({topic.weightagePercent}%)
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                            <span className="text-xs text-slate-500">
                                {tempAllocatedIds.length} topic(s) selected
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsAllocateModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    id="btn-confirm-allocation"
                                    onClick={handleSavePeriodAllocations}
                                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 cursor-pointer"
                                >
                                    Confirm Allocation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Official Syllabus Text Modal */}
            {isSyllabusModalOpen && (() => {
                const pattern = EXAM_OFFICIAL_PATTERNS[activeExamId] || EXAM_OFFICIAL_PATTERNS['exam_ssc_cgl'];
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs animate-fade-in">
                        <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/60 shrink-0">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-400" />
                                        <h3 className="text-sm font-black uppercase tracking-wider">{pattern.name} • Full Actual Syllabus</h3>
                                    </div>
                                    <p className="text-[11px] text-slate-300 font-medium">Conducting Board: {pattern.officialBoard}</p>
                                </div>
                                <button
                                    onClick={() => setIsSyllabusModalOpen(false)}
                                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Marks & Negative Marking Summary Bar */}
                            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/40 space-y-0.5">
                                    <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block">🎯 Maximum Marks</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{pattern.maxMarks}</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/40 space-y-0.5">
                                    <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400 block">⚠️ Negative Marking Penalty</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{pattern.negativeMarks}</span>
                                </div>
                            </div>

                            {/* Syllabus Text Body */}
                            <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider">Official Curricular Text</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(pattern.fullSyllabusText);
                                            setCopiedSyllabusText(true);
                                            setTimeout(() => setCopiedSyllabusText(false), 2000);
                                        }}
                                        className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                                    >
                                        {copiedSyllabusText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copiedSyllabusText ? 'Copied to Clipboard!' : 'Copy Full Syllabus'}
                                    </button>
                                </div>

                                <pre className="whitespace-pre-wrap font-sans text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                    {pattern.fullSyllabusText}
                                </pre>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-800 flex justify-end shrink-0">
                                <button
                                    onClick={() => setIsSyllabusModalOpen(false)}
                                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Sparkles, UploadCloud, Calendar, Clock, ChevronRight, ChevronDown, CheckCircle2, Circle, TrendingUp, BarChart2, BookOpenCheck, BrainCircuit, CheckSquare, Layers, Clock3, Compass, Info, CheckSquare2, Trash2, Globe, ExternalLink, ShieldCheck, BookOpen, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../lib/api';
// Preset Syllabus templates for instant 1-click demos
const PRESET_TEMPLATES = [
    {
        id: 'dsa_cs',
        name: 'CS8451: Data Structures & Algorithms',
        category: 'University Semester',
        title: 'Autonomous Syllabus - Dept of CSE',
        subjectCode: 'CS8451',
        content: `Unit 1: Linear Data Structures & Algorithm Analysis
Introduction to algorithm development and asymptotic analysis: Big-O, Theta, Omega.
Abstract Data Types (ADT) - List ADT, array-based implementation, singly linked lists, doubly linked lists, circular linked lists.
Applications of lists: Polynomial manipulation, Addition of two polynomials.
Stack ADT: Array and Linked list implementation, Push and Pop operations.
Applications of Stack: Infix to Postfix conversion, Evaluation of postfix expression, Function calls.
Queue ADT: Array and Linked list implementation, Insertion and deletion, Circular Queue.

Unit 2: Non-Linear Data Structures - Trees
Trees: General tree, Binary Tree, Binary tree representation, binary tree traversals (preorder, inorder, postorder).
Expression trees, Applications of trees.
Binary Search Tree (BST): Insertion, Deletion, Searching.
Balanced Trees: AVL Trees, AVL balance factor, Single rotations (LL, RR) and Double rotations (LR, RL).
B-Trees, B+ Trees: Definitions and structural differences.

Unit 3: Graphs & Algorithmic Design
Graphs: Terminology, Representation of Graphs: Adjacency Matrix and Adjacency List.
Graph Traversals: Breadth First Search (BFS) and Depth First Search (DFS).
Topological Sort, Strongly Connected Components.
Minimum Spanning Trees: Prim's Algorithm, Kruskal's Algorithm.
Shortest Path Algorithms: Dijkstra's Single Source Shortest Path.

Unit 4: Hashing & Storage Optimization
Hashing: Hash functions, Hash table, Load factor.
Collision Resolution Techniques: Open Addressing (Linear Probing, Quadratic Probing, Double Hashing) and Separate Chaining.
Rehashing, Extendible Hashing.
Heaps: Binary Heaps, Max-Heap, Min-Heap, Heapify, Priority Queue ADT.

Unit 5: Algorithm Design Techniques
Divide and Conquer: Merge Sort, Quick Sort, binary search. Recurrence relations.
Dynamic Programming: Computing binomial coefficient, Warshall's and Floyd's algorithms, Longest Common Subsequence (LCS), 0/1 Knapsack problem.
Greedy Technique: Huffman Trees, Fractional Knapsack, Prim's and Kruskal's greedy choice validation.`
    },
    {
        id: 'quant_apt',
        name: 'Quantitative Aptitude & Advanced Algebra',
        category: 'Competitive Entrance Exam',
        title: 'Aptitude & Arithmetic syllabus for Placement & Bank Exams',
        subjectCode: 'QA-01',
        content: `Unit 1: Arithmetic Core foundations
Simplification, Speed calculations, fraction multipliers, decimal equivalents.
Percentage: Calculations, successive changes, consumption-expenditure balancing.
Ratio & Proportion: Proportional changes, diluted mixtures, alligation principles.
Average, Age-based problems, partners' investments.

Unit 2: Commercial Mathematics
Profit, Loss & Discount: Cost price, selling price, marked price, successive discounts, dishonest dealer cases.
Simple Interest (SI) and Compound Interest (CI): Differentials, annual vs semi-annual compounding, installment plans.
Time, Speed & Distance: Relative speed, trains crossing platforms, upstream-downstream boats, average speed.
Time & Work: Efficiency ratios, pipes and cisterns, alternate days scheduling.

Unit 3: Modern Algebra & Sequence Logic
Quadratic Equations: Sum and product of roots, nature of roots, discriminant conditions.
Progressions: Arithmetic Progression (AP), Geometric Progression (GP), Harmonic Progression (HP).
Linear Inequalities, Set theory, Venn diagrams for 3-attribute classification.

Unit 4: Geometry & Mensuration
Triangles: Congruency, similarity, Centroid, Orthocenter, Incenter, Circumcenter, Pythagorean triplets.
Circles: Tangents, chords, intersecting chords theorem, alternate segment theorem.
Mensuration 2D & 3D: Area, perimeter, volume, surface area of cones, spheres, cylinders, pyramids.

Unit 5: Data Interpretation & Probability
Data Interpretation: Pie charts, bar graphs, radar graphs, line charts, caselets.
Permutations & Combinations (P&C): Linear arrangements, circular tables, group selections.
Probability: Addition and multiplication theorems, conditional probability, Bayes Theorem.`
    },
    {
        id: 'upsc_polity',
        name: 'Indian Polity & Constitutional Law',
        category: 'Competitive Government',
        title: 'GS Paper II: Polity, Constitution & Governance',
        subjectCode: 'GS-II',
        content: `Unit 1: Constitutional Framework & Evolution
Historical Underpinnings: Regulating Act 1773 to Independence Act 1947.
Making of the Constitution, Salient features of the Constitution, Preamble of the Constitution.
Union and its Territory, Citizenship clauses.
Fundamental Rights (Articles 12-35): Absolute vs Restricted rights, writ jurisdictions.
Directive Principles of State Policy (DPSPs), Fundamental Duties (Article 51A).

Unit 2: System of Government & Executive
Parliamentary System vs Presidential System, Federal System, Center-State Relations.
Emergency Provisions: Articles 352, 356, and 360, impact on fundamental rights.
The President: Power, election, impeachment, pardoning powers.
The Prime Minister and Union Council of Ministers: Cabinet committees.
Parliament: Lok Sabha, Rajya Sabha, legislative procedures, money bills, parliamentary privileges.

Unit 3: Judiciary & Constitutional Bodies
Supreme Court of India: Original, appellate, advisory jurisdiction, judicial review, judicial activism, PIL.
High Courts & Subordinate Courts.
Constitutional Bodies: Election Commission, UPSC, Finance Commission, CAG, National Commissions for SCs/STs.
Statutory Bodies: NHRC, CIC, CVC, Lokpal and Lokayuktas.

Unit 4: Local Government & State Executive
State Executive: Governor's constitutional and discretionary powers, Chief Minister.
State Legislature: Legislative Councils vs Assembly.
Local Government: 73rd and 74th Constitutional Amendment Acts, Panchayati Raj Institutions, Municipalities.
Special provisions for Scheduled & Tribal Areas.`
    }
];
export const UniversalSyllabusAnalyzer = () => {
    const [syllabusText, setSyllabusText] = useState('');
    const [examName, setExamName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [syllabusTitle, setSyllabusTitle] = useState('');
    const [examCategory, setExamCategory] = useState('University Semester');
    const [dailyHours, setDailyHours] = useState(3);
    const [targetDays, setTargetDays] = useState(14);
    const [preferredSlots, setPreferredSlots] = useState(['morning', 'evening']);
    // App state
    const [analysesList, setAnalysesList] = useState([]);
    const [activeAnalysis, setActiveAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzingStep, setAnalyzingStep] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedUnit, setExpandedUnit] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingQuestions, setViewingQuestions] = useState({});
    // Official Website Fetching State
    const [isFetchingOfficial, setIsFetchingOfficial] = useState(false);
    const [officialPortal, setOfficialPortal] = useState('');
    const [officialBoardInfo, setOfficialBoardInfo] = useState(null);

    const handleFetchOfficialSyllabus = async (queryOverride) => {
        const q = (queryOverride || examName || 'SSC CGL').trim();
        setIsFetchingOfficial(true);
        try {
            const res = await api.post('/syllabus/fetch-official', {
                examQuery: q,
                examCategory,
                officialPortal
            });
            if (res.data && res.data.officialSyllabus) {
                const data = res.data.officialSyllabus;
                setSyllabusText(data.syllabusContent || '');
                setExamName(data.examName || q);
                setSyllabusTitle(data.syllabusTitle || `Official Syllabus - ${q}`);
                if (data.subjectCode) setSubjectCode(data.subjectCode);
                setOfficialBoardInfo(data);
            }
        } catch (err) {
            console.error('Error fetching official syllabus:', err);
            alert('Failed to fetch official syllabus. Please check your query or portal URL.');
        } finally {
            setIsFetchingOfficial(false);
        }
    };
    // Fetch past syllabus analyses
    const fetchAnalyses = async () => {
        try {
            const res = await api.get('/syllabus-analysis');
            if (res.data && res.data.analyses) {
                setAnalysesList(res.data.analyses);
                if (res.data.analyses.length > 0 && !activeAnalysis) {
                    // auto-load the latest one
                    setActiveAnalysis(res.data.analyses[0]);
                }
            }
        }
        catch (err) {
            console.error('Error fetching syllabus analyses:', err);
        }
    };
    useEffect(() => {
        fetchAnalyses();
    }, []);
    // Simulating beautiful step-by-step progress when AI is running
    useEffect(() => {
        let interval;
        if (isAnalyzing) {
            interval = setInterval(() => {
                setAnalyzingStep(prev => {
                    if (prev < 4)
                        return prev + 1;
                    return prev;
                });
            }, 2500);
        }
        else {
            setAnalyzingStep(0);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);
    // Load preset template helper
    const handleLoadTemplate = (tpl) => {
        setSyllabusText(tpl.content);
        setExamName(tpl.name);
        setSyllabusTitle(tpl.title);
        setSubjectCode(tpl.subjectCode);
        setExamCategory(tpl.category);
    };
    // Run syllabus analyzer
    const handleAnalyzeSyllabus = async () => {
        if (!syllabusText.trim())
            return;
        setIsAnalyzing(true);
        setAnalyzingStep(0);
        try {
            const payload = {
                syllabusText,
                examName: examName || 'Semester/Competitive Exam',
                syllabusTitle: syllabusTitle || 'Uploaded Syllabus Document',
                examCategory,
                dailyHours,
                targetDays,
                preferredTimeSlots: preferredSlots,
                subjectCode: subjectCode || undefined
            };
            const res = await api.post('/syllabus-analysis/analyze', payload);
            if (res.data && res.data.analysis) {
                const newAnalysis = res.data.analysis;
                setAnalysesList(prev => [newAnalysis, ...prev]);
                setActiveAnalysis(newAnalysis);
                setActiveTab('overview');
            }
        }
        catch (err) {
            console.error('Failed to analyze syllabus:', err);
            alert('Syllabus analysis failed. Please try a shorter content block.');
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    // Toggle topic completed
    const handleToggleTopic = async (topicId) => {
        if (!activeAnalysis)
            return;
        try {
            const res = await api.post(`/syllabus-analysis/${activeAnalysis.id}/toggle-topic`, { topicId });
            if (res.data && res.data.success) {
                setActiveAnalysis(res.data.analysis);
                setAnalysesList(prev => prev.map(a => a.id === res.data.analysis.id ? res.data.analysis : a));
            }
        }
        catch (err) {
            console.error('Error toggling topic:', err);
        }
    };
    // Toggle task completed
    const handleToggleTask = async (taskId, currentStatus) => {
        if (!activeAnalysis)
            return;
        try {
            const res = await api.post(`/syllabus-analysis/${activeAnalysis.id}/toggle-task`, {
                taskId,
                isCompleted: !currentStatus
            });
            if (res.data && res.data.success) {
                setActiveAnalysis(res.data.analysis);
                setAnalysesList(prev => prev.map(a => a.id === res.data.analysis.id ? res.data.analysis : a));
            }
        }
        catch (err) {
            console.error('Error toggling task:', err);
        }
    };
    // Delete an analysis
    const handleDeleteAnalysis = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this syllabus analysis plan?'))
            return;
        try {
            await api.delete(`/syllabus-analysis/${id}`);
            const filtered = analysesList.filter(a => a.id !== id);
            setAnalysesList(filtered);
            if (activeAnalysis?.id === id) {
                setActiveAnalysis(filtered.length > 0 ? filtered[0] : null);
            }
        }
        catch (err) {
            console.error('Error deleting analysis:', err);
        }
    };
    const handleToggleQuestionView = (id) => {
        setViewingQuestions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    // Progress metrics calculation
    const totalTopicsCount = activeAnalysis?.allTopics?.length || 0;
    const completedTopicsCount = activeAnalysis?.allTopics?.filter(t => t.isCompleted).length || 0;
    const completionPercentage = totalTopicsCount > 0
        ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
        : 0;
    const totalTasks = activeAnalysis?.schedule?.reduce((acc, day) => acc + (day.tasks?.length || 0), 0) || 0;
    const completedTasks = activeAnalysis?.schedule?.reduce((acc, day) => acc + (day.tasks?.filter(t => t.isCompleted)?.length || 0), 0) || 0;
    const tasksPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    // Drag and Drop State Simulation
    const [isDragOver, setIsDragOver] = useState(false);
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = () => {
        setIsDragOver(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        setSyllabusText(event.target.result);
                        setSyllabusTitle(file.name.replace(/\.[^/.]+$/, ""));
                        setExamName(file.name.replace(/\.[^/.]+$/, "").split('_').join(' ').split('-').join(' '));
                    }
                };
                reader.readAsText(file);
            }
            else {
                alert('Please upload a standard text (.txt) file or copy-paste the syllabus text below.');
            }
        }
    };
    return (_jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden", children: [_jsx(AnimatePresence, { children: isAnalyzing && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl", children: [_jsxs("div", { className: "relative w-24 h-24 mx-auto flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-pulse" }), _jsx("div", { className: "absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" }), _jsx(BrainCircuit, { className: "w-10 h-10 text-indigo-600 animate-pulse" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-black tracking-tight text-slate-950 dark:text-white", children: "Gemini AI Analyzing Syllabus" }), _jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: ["Parsing topics, units, and compiling custom ", targetDays, "-Day daily timetables..."] })] }), _jsxs("div", { className: "text-left space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900 max-w-sm mx-auto", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs", children: [analyzingStep >= 0 ? (_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" })) : (_jsx(Clock3, { className: "w-4 h-4 text-slate-400 animate-spin" })), _jsx("span", { className: `${analyzingStep >= 0 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}`, children: "Ingesting text document & mapping modules" })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", children: [analyzingStep >= 1 ? (_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" })) : analyzingStep === 0 ? (_jsx(Clock3, { className: "w-4 h-4 text-indigo-500 animate-spin" })) : (_jsx(Circle, { className: "w-4 h-4 text-slate-300 dark:text-slate-800" })), _jsx("span", { className: `${analyzingStep >= 1 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}`, children: "Extracting high-yield topics & formulas" })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", children: [analyzingStep >= 2 ? (_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" })) : analyzingStep === 1 ? (_jsx(Clock3, { className: "w-4 h-4 text-indigo-500 animate-spin" })) : (_jsx(Circle, { className: "w-4 h-4 text-slate-300 dark:text-slate-800" })), _jsx("span", { className: `${analyzingStep >= 2 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}`, children: "Generating short Part-A definitions & blueprints" })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", children: [analyzingStep >= 3 ? (_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" })) : analyzingStep === 2 ? (_jsx(Clock3, { className: "w-4 h-4 text-indigo-500 animate-spin" })) : (_jsx(Circle, { className: "w-4 h-4 text-slate-300 dark:text-slate-800" })), _jsx("span", { className: `${analyzingStep >= 3 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}`, children: "Calendarizing Day-by-Day study tasks" })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", children: [analyzingStep >= 4 ? (_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" })) : analyzingStep === 3 ? (_jsx(Clock3, { className: "w-4 h-4 text-indigo-500 animate-spin" })) : (_jsx(Circle, { className: "w-4 h-4 text-slate-300 dark:text-slate-800" })), _jsx("span", { className: `${analyzingStep >= 4 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}`, children: "Assembling spaced-repetition plan" })] })] }), _jsx("div", { className: "text-[10px] text-slate-400 font-mono animate-pulse", children: "Running advanced Gemini 3.7 Flash analysis engine..." })] }) })) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 min-h-[600px]", children: [_jsxs("div", { className: "lg:col-span-4 border-r border-slate-200/80 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-6 overflow-y-auto max-h-[850px]", children: [                _jsxs("div", { className: "space-y-1", children: [_jsxs("h2", { className: "text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(UploadCloud, { className: "w-4 h-4 text-indigo-600" }), " Ingest New Syllabus"] }), _jsx("p", { className: "text-[11px] text-slate-500", children: "Drag & drop, paste, or fetch directly from official board notification websites." })] }),
                _jsxs("div", { className: "p-4 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white space-y-3 border border-indigo-700/50 shadow-md", children: [
                    _jsxs("div", { className: "flex items-center justify-between", children: [
                        _jsxs("span", { className: "text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5", children: [_jsx(Globe, { className: "w-4 h-4 text-cyan-400" }), " Official Board Website Fetch"] }),
                        _jsxs("span", { className: "px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1", children: [_jsx(ShieldCheck, { className: "w-3 h-3 text-cyan-400" }), " Official Portal"] })
                    ] }),
                    _jsx("p", { className: "text-[11px] text-slate-300 font-medium leading-relaxed", children: "Fetch official curriculum guidelines & blueprints directly from national portals (SSC, UPSC, GATE, Anna University, NTA)." }),
                    _jsx("div", { className: "flex flex-wrap gap-1.5", children: [
                        { label: 'SSC CGL', query: 'SSC CGL' },
                        { label: 'UPSC IAS GS', query: 'UPSC Civil Services' },
                        { label: 'GATE CS 2026', query: 'GATE Computer Science' },
                        { label: 'Anna Univ CS8451', query: 'Anna University CS8451' }
                    ].map(b => _jsxs("button", { type: "button", onClick: () => handleFetchOfficialSyllabus(b.query), disabled: isFetchingOfficial, className: "px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white/10 hover:bg-white/20 text-indigo-100 border border-indigo-400/20 transition flex items-center gap-1 cursor-pointer", children: [_jsx(Globe, { className: "w-2.5 h-2.5 text-cyan-300" }), " ", b.label] }, b.query)) }),
                    _jsxs("div", { className: "space-y-2 pt-1", children: [
                        _jsx("input", { type: "text", placeholder: "Official Board Portal URL (optional, e.g. ssc.gov.in)", value: officialPortal, onChange: (e) => setOfficialPortal(e.target.value), className: "w-full px-3 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-indigo-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono" }),
                        _jsxs("button", { type: "button", onClick: () => handleFetchOfficialSyllabus(), disabled: isFetchingOfficial, className: "w-full py-2.5 rounded-xl font-black text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50", children: [
                            isFetchingOfficial ? (_jsxs(React.Fragment, { children: [_jsx(Clock3, { className: "w-4 h-4 animate-spin text-slate-950" }), " Fetching Official Board Syllabus..."] })) : (_jsxs(React.Fragment, { children: [_jsx(Globe, { className: "w-4 h-4 text-slate-950" }), " Fetch Official Board Syllabus"] }))
                        ] })
                    ] })
                ] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("span", { className: "text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block", children: "\uD83D\uDCA1 Click to Quick Load Demo templates" }), _jsx("div", { className: "flex flex-col gap-1.5", children: PRESET_TEMPLATES.map((tpl) => (_jsxs("button", { onClick: () => handleLoadTemplate(tpl), className: "px-3 py-2 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between group transition-all", children: [_jsx("span", { className: "truncate", children: tpl.name }), _jsx(ChevronRight, { className: "w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" })] }, tpl.id))) })] }), _jsxs("div", { className: "space-y-3.5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1", children: "Course / Exam Name" }), _jsx("input", { type: "text", placeholder: "e.g. CS3401 Design and Analysis of Algorithms", value: examName, onChange: (e) => setExamName(e.target.value), className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1", children: "Subject Code" }), _jsx("input", { type: "text", placeholder: "e.g. CS8451", value: subjectCode, onChange: (e) => setSubjectCode(e.target.value), className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1", children: "Exam Category" }), _jsxs("select", { value: examCategory, onChange: (e) => setExamCategory(e.target.value), className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition", children: [_jsx("option", { value: "University Semester", children: "University Semester" }), _jsx("option", { value: "Competitive Entrance Exam", children: "Competitive Entrance" }), _jsx("option", { value: "Competitive Government", children: "Government Exam" }), _jsx("option", { value: "Corporate Certification", children: "Corporate / Tech Cert" })] })] })] }), _jsxs("div", { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, className: `border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${isDragOver
                                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40'}`, children: [_jsx(UploadCloud, { className: "w-6 h-6 mx-auto text-slate-400 mb-1.5" }), _jsx("p", { className: "text-xs font-bold text-slate-700 dark:text-slate-300", children: "Drag & Drop Syllabus Text File here" }), _jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: "Supports .txt files" })] }), _jsxs("div", { children: [
    officialBoardInfo && _jsxs("div", { className: "mb-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 space-y-2 text-xs", children: [
        _jsxs("div", { className: "flex items-center justify-between font-bold text-cyan-900 dark:text-cyan-200", children: [
            _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(ShieldCheck, { className: "w-4 h-4 text-cyan-600 dark:text-cyan-400" }), officialBoardInfo.officialBoard] }),
            officialBoardInfo.officialPortalUrl && _jsxs("a", { href: officialBoardInfo.officialPortalUrl, target: "_blank", rel: "noopener noreferrer", className: "text-[10px] text-cyan-700 dark:text-cyan-300 underline flex items-center gap-0.5 hover:text-cyan-900 font-mono", children: ["Official Portal", _jsx(ExternalLink, { className: "w-3 h-3" })] })
        ] }),
        officialBoardInfo.officialExamPattern && _jsxs("div", { className: "text-[10px] text-cyan-800 dark:text-cyan-300 space-y-0.5 font-medium", children: [
            _jsxs("p", { children: [_jsx("strong", { children: "Exam Blueprint: " }), officialBoardInfo.officialExamPattern.stages, " (", officialBoardInfo.officialExamPattern.totalMarks, " Marks)"] }),
            _jsxs("p", { children: [_jsx("strong", { children: "Negative Marking: " }), officialBoardInfo.officialExamPattern.negativeMarking] })
        ] }),
        officialBoardInfo.recommendedTextbooks && officialBoardInfo.recommendedTextbooks.length > 0 && _jsxs("div", { className: "text-[10px] text-cyan-800 dark:text-cyan-300 pt-1.5 border-t border-cyan-200/60 dark:border-cyan-800/60", children: [
            _jsx("strong", { className: "block text-[9px] uppercase font-black tracking-wider text-cyan-900 dark:text-cyan-200 mb-0.5", children: "Official Recommended Textbooks:" }),
            _jsx("ul", { className: "list-disc pl-3 font-mono text-[9px] space-y-0.5", children: officialBoardInfo.recommendedTextbooks.map((bk, i) => _jsx("li", { children: bk }, i)) })
        ] })
    ] }),
    _jsxs("label", { className: "block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between", children: [_jsx("span", { children: "Or Paste Syllabus Text Below" }), _jsx("span", { className: "text-[10px] text-slate-400 font-normal", children: "Min 50 chars" })] }), _jsx("textarea", { rows: 5, placeholder: "Paste the units/topics syllabus details directly...", value: syllabusText, onChange: (e) => setSyllabusText(e.target.value), className: "w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono transition" })] }), _jsxs("div", { className: "space-y-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80", children: [_jsx("span", { className: "text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block", children: "\u2699\uFE0F Timetable Calibration" }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: [_jsx("span", { children: "Days until Exam:" }), _jsxs("span", { className: "text-indigo-600 dark:text-indigo-400 font-black", children: [targetDays, " Days"] })] }), _jsx("input", { type: "range", min: 5, max: 30, step: 1, value: targetDays, onChange: (e) => setTargetDays(parseInt(e.target.value, 10)), className: "w-full accent-indigo-600 cursor-pointer" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: [_jsx("span", { children: "Daily Study Commitment:" }), _jsxs("span", { className: "text-indigo-600 dark:text-indigo-400 font-black", children: [dailyHours, " Hours/Day"] })] }), _jsx("input", { type: "range", min: 1, max: 8, step: 1, value: dailyHours, onChange: (e) => setDailyHours(parseInt(e.target.value, 10)), className: "w-full accent-indigo-600 cursor-pointer" })] }), _jsxs("div", { className: "space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800", children: [_jsx("span", { className: "text-[10px] font-extrabold text-slate-500 dark:text-slate-400 block", children: "Preferred Slots:" }), _jsx("div", { className: "grid grid-cols-2 gap-1.5 text-[11px]", children: [
                                                            { id: 'morning', label: 'Morning' },
                                                            { id: 'afternoon', label: 'Afternoon' },
                                                            { id: 'evening', label: 'Evening' },
                                                            { id: 'night', label: 'Late Night' }
                                                        ].map(slot => {
                                                            const isSelected = preferredSlots.includes(slot.id);
                                                            return (_jsxs("button", { type: "button", onClick: () => {
                                                                    if (isSelected) {
                                                                        setPreferredSlots(prev => prev.filter(s => s !== slot.id));
                                                                    }
                                                                    else {
                                                                        setPreferredSlots(prev => [...prev, slot.id]);
                                                                    }
                                                                }, className: `px-2.5 py-1.5 rounded-lg border text-left font-bold transition flex items-center justify-between ${isSelected
                                                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'}`, children: [_jsx("span", { children: slot.label }), isSelected ? _jsx(CheckSquare, { className: "w-3 h-3 text-indigo-600" }) : _jsx("div", { className: "w-3 h-3 border border-slate-300 dark:border-slate-700 rounded-sm" })] }, slot.id));
                                                        }) })] })] }), _jsxs("button", { onClick: handleAnalyzeSyllabus, disabled: !syllabusText.trim() || isAnalyzing, className: `w-full py-3 rounded-2xl font-black text-xs text-white shadow-md flex items-center justify-center gap-1.5 transition ${syllabusText.trim() && !isAnalyzing
                                            ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer hover:shadow-lg'
                                            : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-400 dark:text-slate-600'}`, children: [_jsx(Sparkles, { className: "w-4 h-4 text-amber-300" }), "Analyze Syllabus & Chart Timetable"] })] }), analysesList.length > 0 && (_jsxs("div", { className: "space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800", children: [_jsx("span", { className: "text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block", children: "\uD83D\uDCCB Your Analyzed Curriculums" }), _jsx("div", { className: "space-y-2", children: analysesList.map((a) => {
                                            const isSelected = activeAnalysis?.id === a.id;
                                            return (_jsxs("div", { onClick: () => {
                                                    setActiveAnalysis(a);
                                                    setActiveTab('overview');
                                                }, className: `p-3 rounded-xl border cursor-pointer relative group flex items-start justify-between gap-2 transition ${isSelected
                                                    ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-xs'
                                                    : 'bg-white/40 dark:bg-slate-900/20 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'}`, children: [_jsxs("div", { className: "space-y-1 min-w-0", children: [_jsx("h4", { className: "text-xs font-black text-slate-800 dark:text-slate-200 truncate pr-4", children: a.examName }), _jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-slate-400 font-bold", children: [_jsxs("span", { children: [a.totalTopicsCount, " Topics"] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [a.schedule?.length || 0, " Days Plan"] })] })] }), _jsx("button", { onClick: (e) => handleDeleteAnalysis(a.id, e), className: "opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition shrink-0", title: "Delete Analysis", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] }, a.id));
                                        }) })] }))] }), _jsx("div", { className: "lg:col-span-8 p-6 space-y-6", children: activeAnalysis ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150 dark:border-slate-800", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider border border-indigo-200/40 dark:border-indigo-900", children: activeAnalysis.examCategory }), activeAnalysis.subjectCode && (_jsx("span", { className: "font-mono text-[9px] font-extrabold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md", children: activeAnalysis.subjectCode }))] }), _jsx("h1", { className: "text-xl font-black text-slate-900 dark:text-white tracking-tight", children: activeAnalysis.examName }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Syllabus: ", _jsxs("strong", { className: "text-slate-700 dark:text-slate-300", children: ["\"", activeAnalysis.syllabusDocTitle, "\""] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 block uppercase", children: "Overall Syllabus Completed" }), _jsxs("span", { className: "text-lg font-black text-indigo-600 dark:text-indigo-400", children: [completionPercentage, "%"] })] }), _jsxs("div", { className: "w-10 h-10 rounded-full border-4 border-indigo-100 dark:border-indigo-950 flex items-center justify-center relative", children: [_jsx("div", { className: "absolute inset-0 border-4 border-indigo-600 rounded-full transition-all", style: { clipPath: `polygon(0 0, 100% 0, 100% ${completionPercentage}%, 0 ${completionPercentage}%)` } }), _jsx(CheckCircle2, { className: "w-4 h-4 text-indigo-600" })] })] })] }), _jsx("div", { className: "flex items-center gap-1 border-b border-slate-250 dark:border-slate-800 pb-1.5 overflow-x-auto", children: [
                                    { id: 'overview', label: 'Overview Dashboard', icon: BarChart2 },
                                    { id: 'syllabus', label: 'Interactive 5-Unit Syllabus', icon: Layers },
                                    { id: 'schedule', label: 'Day-by-Day Timetable Calendar', icon: Calendar },
                                    { id: 'strategy', label: 'Strategic Presentation Keys', icon: Sparkles },
                                    { id: 'actual_text', label: '📜 Official Actual Syllabus & Pattern', icon: BookOpen }
                                    ].map((subTab) => {
                                        const IconComp = subTab.icon;
                                        const isSel = activeTab === subTab.id;
                                        return (_jsxs("button", { onClick: () => setActiveTab(subTab.id), className: `px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${isSel
                                                ? 'bg-indigo-600 text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`, children: [_jsx(IconComp, { className: "w-3.5 h-3.5" }), subTab.label] }, subTab.id));
                                    }) }), activeTab === 'overview' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/40 space-y-2", children: [_jsxs("span", { className: "text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5", children: [_jsx(BrainCircuit, { className: "w-4 h-4" }), " Curriculum Analysis Verdict"] }), _jsx("p", { className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium", children: activeAnalysis.summary })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: "Total Units" }), _jsx("span", { className: "text-xl font-black text-slate-900 dark:text-white block mt-1", children: activeAnalysis.totalUnitsCount }), _jsx("span", { className: "text-[10px] text-slate-500", children: "Modules found" })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: "Total Topics" }), _jsx("span", { className: "text-xl font-black text-slate-900 dark:text-white block mt-1", children: activeAnalysis.totalTopicsCount }), _jsxs("span", { className: "text-[10px] text-indigo-600 dark:text-indigo-400 font-bold", children: [completedTopicsCount, " mastered"] })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: "High Yield" }), _jsx("span", { className: "text-xl font-black text-rose-600 dark:text-rose-400 block mt-1", children: activeAnalysis.highYieldTopicsCount }), _jsx("span", { className: "text-[10px] text-rose-500 font-bold", children: "Must-Master topics" })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: "Prep Commitment" }), _jsxs("span", { className: "text-xl font-black text-purple-600 dark:text-purple-400 block mt-1", children: [activeAnalysis.totalEstimatedPrepHours, " Hrs"] }), _jsx("span", { className: "text-[10px] text-slate-500", children: "Estimated total effort" })] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx("span", { className: "text-xs font-extrabold text-slate-800 dark:text-white block", children: "\uD83D\uDCC5 Timetable Task Accomplishments" }), _jsx("p", { className: "text-[11px] text-slate-500", children: "Complete your scheduled tasks daily to award yourself XP points!" })] }), _jsxs("span", { className: "text-xs font-black text-indigo-600 dark:text-indigo-400", children: [completedTasks, " / ", totalTasks, " Tasks"] })] }), _jsx("div", { className: "w-full h-2.5 bg-slate-150 dark:bg-slate-800 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-indigo-600 rounded-full transition-all duration-300", style: { width: `${tasksPercentage}%` } }) }), _jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-500", children: [_jsxs("span", { children: [tasksPercentage, "% Completed"] }), _jsxs("span", { className: "font-bold text-slate-700 dark:text-slate-300", children: [totalTasks - completedTasks, " outstanding tasks remaining"] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("h3", { className: "text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Compass, { className: "w-3.5 h-3.5 text-indigo-600" }), " AI Spaced Repetition Retention Checkpoints"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: (activeAnalysis.spacedRepetitionPlan || []).map((checkpoint, idx) => (_jsxs("div", { className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 flex flex-col justify-between gap-3 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-3 -right-3 w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center opacity-30 text-indigo-600 font-black text-xl", children: idx + 1 }), _jsxs("div", { className: "space-y-1", children: [_jsxs("span", { className: "text-[10px] font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200/50", children: ["Day ", checkpoint.checkpointDay, " Milestone"] }), _jsxs("h5", { className: "text-xs font-bold text-slate-800 dark:text-slate-200 pt-1", children: ["Review: ", (checkpoint.unitsToReview || []).join(', ')] })] }), _jsxs("div", { className: "text-[11px] text-slate-500 pt-2 border-t border-slate-150 dark:border-slate-850", children: [_jsx("strong", { children: "Active Recall Strategy:" }), " ", checkpoint.recallMethod] })] }, idx))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("h3", { className: "text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(TrendingUp, { className: "w-3.5 h-3.5 text-indigo-600" }), " Syllabus Unit Weightage Allocation"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: (activeAnalysis.units || []).map((unit) => {
                                                        const unitTopics = unit.topics || [];
                                                        const completedUnitTopics = unitTopics.filter(t => t.isCompleted).length;
                                                        const progressPercent = unitTopics.length > 0
                                                            ? Math.round((completedUnitTopics / unitTopics.length) * 100)
                                                            : 0;
                                                        return (_jsxs("div", { className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "space-y-0.5 min-w-0", children: [_jsx("h4", { className: "text-xs font-black text-slate-800 dark:text-slate-200 truncate pr-2", children: unit.unitName }), _jsxs("span", { className: "text-[10px] text-slate-400 font-bold uppercase", children: ["Module ", unit.unitNumber, " \u2022 ", unitTopics.length, " Topics Extracted"] })] }), _jsxs("span", { className: "text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md shrink-0", children: ["Est. ", unit.estimatedHours, "h"] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-indigo-600 rounded-full transition-all", style: { width: `${progressPercent}%` } }) }), _jsxs("div", { className: "flex justify-between text-[10px] text-slate-400", children: [_jsxs("span", { children: [progressPercent, "% Complete"] }), _jsxs("span", { children: [completedUnitTopics, " of ", unitTopics.length, " checked off"] })] })] })] }, unit.unitNumber));
                                                    }) })] })] })), activeTab === 'syllabus' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 flex items-center gap-2", children: [_jsx(Info, { className: "w-4 h-4 text-indigo-600 shrink-0" }), _jsxs("span", { children: ["Check off individual topics as mastered to update your overall syllabus gauge. Access ", _jsx("strong", { children: "Part-A definitions" }), " and ", _jsx("strong", { children: "16-mark problems" }), " under each topic below."] })] }), _jsx("div", { className: "flex gap-2", children: _jsx("input", { type: "text", placeholder: "\uD83D\uDD0D Filter topics by name, keywords, or formulas...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" }) }), _jsx("div", { className: "space-y-3", children: (activeAnalysis.units || []).map((unit) => {
                                                const isExpanded = expandedUnit === unit.unitNumber;
                                                // Filter topics
                                                const filteredTopics = (unit.topics || []).filter(topic => topic.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    topic.notesSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    (topic.keyFormulasOrConcepts || []).some(f => f.toLowerCase().includes(searchQuery.toLowerCase())));
                                                if (searchQuery && filteredTopics.length === 0)
                                                    return null;
                                                return (_jsxs("div", { className: "border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs", children: [_jsxs("div", { onClick: () => setExpandedUnit(isExpanded ? null : unit.unitNumber), className: "p-4 bg-slate-50/70 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer flex items-center justify-between transition-all", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs flex items-center justify-center shrink-0", children: ["U", unit.unitNumber] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xs sm:text-sm font-black text-slate-900 dark:text-white", children: unit.unitName }), _jsxs("p", { className: "text-[10px] text-slate-400 font-bold", children: [filteredTopics.length, " Extracted Curriculum Modules \u2022 Total Weightage Marks: ", unit.totalWeightageMarks || 20] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50/60 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md", children: [unit.estimatedHours, " hrs study"] }), isExpanded ? (_jsx(ChevronDown, { className: "w-4 h-4 text-slate-500" })) : (_jsx(ChevronRight, { className: "w-4 h-4 text-slate-500" }))] })] }), isExpanded && (_jsx("div", { className: "p-4 border-t border-slate-100 dark:border-slate-800 space-y-4 divide-y divide-slate-100 dark:divide-slate-850", children: filteredTopics.map((topic, tIdx) => {
                                                                const isCompleted = topic.isCompleted;
                                                                return (_jsxs("div", { className: `pt-4 first:pt-0 space-y-3.5 transition-all ${isCompleted ? 'opacity-85' : ''}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-start gap-2.5", children: [_jsx("button", { onClick: () => handleToggleTopic(topic.id), className: "mt-0.5 shrink-0 hover:scale-105 transition", title: isCompleted ? 'Mark as Not Completed' : 'Mark as Mastered', children: isCompleted ? (_jsx(CheckCircle2, { className: "w-4.5 h-4.5 text-emerald-600 fill-emerald-50 dark:fill-emerald-950" })) : (_jsx(Circle, { className: "w-4.5 h-4.5 text-slate-300 dark:text-slate-700 hover:text-indigo-500" })) }), _jsxs("div", { className: "space-y-0.5", children: [_jsx("h4", { className: `text-xs font-black text-slate-900 dark:text-white ${isCompleted ? 'line-through text-slate-400' : ''}`, children: topic.topicName }), _jsx("p", { className: "text-[11px] text-slate-500", children: topic.notesSummary })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [_jsx("span", { className: `px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${topic.difficulty === 'hard'
                                                                                                ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-900'
                                                                                                : topic.difficulty === 'medium'
                                                                                                    ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-900'
                                                                                                    : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900'}`, children: topic.difficulty.toUpperCase() }), _jsxs("span", { className: "px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", children: ["Yield: ", topic.weightagePercentage, "%"] })] })] }), (topic.keyFormulasOrConcepts || []).length > 0 && (_jsx("div", { className: "pl-7", children: _jsxs("div", { className: "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-1", children: [_jsx("span", { className: "text-[9px] font-black text-slate-400 uppercase tracking-wider block", children: "\uD83D\uDCDD Key formulas, theorems or mnemonics:" }), _jsx("ul", { className: "list-disc pl-4 text-[11px] text-slate-600 dark:text-slate-300 space-y-1 font-mono", children: topic.keyFormulasOrConcepts.map((formula, fIdx) => (_jsx("li", { children: formula }, fIdx))) })] }) })), _jsxs("div", { className: "pl-7", children: [_jsxs("button", { onClick: () => handleToggleQuestionView(topic.id), className: "text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1", children: [_jsx(BookOpenCheck, { className: "w-3.5 h-3.5" }), viewingQuestions[topic.id]
                                                                                            ? 'Hide AI High-Yield Exam Blueprints'
                                                                                            : 'Reveal AI 2-Mark & 16-Mark High-Yield Exam Blueprints'] }), _jsx(AnimatePresence, { children: viewingQuestions[topic.id] && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "overflow-hidden mt-2 space-y-2.5", children: topic.sampleQuestions?.map((q, qIdx) => (_jsxs("div", { className: `p-3 rounded-xl border text-xs space-y-1.5 ${q.questionType === '2_mark_definition'
                                                                                                ? 'bg-indigo-50/20 dark:bg-indigo-950/5 border-indigo-100/60 dark:border-indigo-900/30'
                                                                                                : 'bg-purple-50/20 dark:bg-purple-950/5 border-purple-100/60 dark:border-purple-900/30'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: `px-2 py-0.2 rounded text-[9px] font-extrabold uppercase ${q.questionType === '2_mark_definition'
                                                                                                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                                                                                                : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'}`, children: q.questionType === '2_mark_definition' ? 'Part A: 2-Mark Definition' : 'Part B: 13/16-Mark Analytical Problem' }), _jsxs("span", { className: "font-bold text-[10px] text-slate-500", children: [q.marks, " Marks"] })] }), _jsxs("p", { className: "font-extrabold text-slate-900 dark:text-white text-xs", children: ["Q: ", q.questionText] }), _jsxs("div", { className: "text-[11px] text-slate-600 dark:text-slate-300 pt-1.5 border-t border-slate-100 dark:border-slate-800/80", children: [_jsx("strong", { className: "text-[10px] font-bold text-slate-400 block uppercase mb-0.5", children: "Evaluator Scoring Answer Guide / Formula blueprint:" }), _jsx("p", { className: "whitespace-pre-line font-medium leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850", children: q.answerHint })] })] }, qIdx))) })) })] })] }, topic.id));
                                                            }) }))] }, unit.unitNumber));
                                            }) })] })), activeTab === 'schedule' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xs sm:text-sm font-black text-slate-900 dark:text-white", children: ["\uD83D\uDDD3\uFE0F Calendar Study Blocks (Total ", activeAnalysis.schedule?.length || 0, " Days)"] }), _jsx("p", { className: "text-[11px] text-slate-500", children: "Check off each study block task to maintain your preparation streak!" })] }), _jsxs("div", { className: "flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: ["Study Budget: ", dailyHours, "h Commitment per day"] })] })] }), _jsx("div", { className: "space-y-4", children: (activeAnalysis.schedule || []).map((day) => {
                                                const dayTasks = day.tasks || [];
                                                const completedDayTasks = dayTasks.filter(t => t.isCompleted).length;
                                                const isDayCompleted = dayTasks.length > 0 && completedDayTasks === dayTasks.length;
                                                return (_jsxs("div", { className: `p-4 rounded-2xl border transition-all ${isDayCompleted
                                                        ? 'bg-emerald-50/20 dark:bg-emerald-950/5 border-emerald-200 dark:border-emerald-900/60 shadow-xs'
                                                        : day.isRestOrRevisionDay
                                                            ? 'bg-amber-50/20 dark:bg-amber-950/5 border-amber-200 dark:border-amber-900/40'
                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`, children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsxs("span", { className: `w-10 h-10 rounded-xl font-black text-xs flex flex-col items-center justify-center shrink-0 border ${isDayCompleted
                                                                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                                                                                : day.isRestOrRevisionDay
                                                                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                                                                                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200/50'}`, children: [_jsx("span", { className: "text-[8px] font-bold uppercase", children: "DAY" }), _jsx("span", { className: "text-sm -mt-1", children: day.dayNumber })] }), _jsxs("div", { children: [_jsxs("h4", { className: "text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5", children: [_jsx("span", { children: day.focusTitle }), isDayCompleted && (_jsx("span", { className: "px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold uppercase", children: "Done" }))] }), _jsxs("p", { className: "text-[10px] text-slate-500 font-bold", children: [day.unitOrTheme, " \u2022 Total Scheduled: ", day.totalStudyMinutes || (dailyHours * 60), " minutes"] })] })] }), _jsx("span", { className: "text-[11px] font-mono font-black text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200/40 dark:border-slate-850 shrink-0 self-start sm:self-center", children: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) })] }), _jsx("div", { className: "pt-3.5 space-y-3 pl-0 sm:pl-12", children: dayTasks.map((task) => (_jsxs("div", { className: `flex items-start gap-3 p-3 rounded-xl border transition-all ${task.isCompleted
                                                                    ? 'bg-emerald-50/20 dark:bg-emerald-950/5 border-emerald-200/30 dark:border-emerald-900/20 opacity-80'
                                                                    : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-800'}`, children: [_jsx("button", { onClick: () => handleToggleTask(task.id, !!task.isCompleted), className: "mt-0.5 shrink-0 transition hover:scale-105", children: task.isCompleted ? (_jsx(CheckSquare2, { className: "w-4 h-4 text-emerald-600" })) : (_jsx("div", { className: "w-4 h-4 border-2 border-slate-300 dark:border-slate-700 rounded-sm hover:border-indigo-500" })) }), _jsxs("div", { className: "space-y-1 min-w-0 flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400", children: [_jsx("span", { className: "font-extrabold text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.2 rounded border border-indigo-100 dark:border-indigo-900/60", children: task.timeSlot }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "font-bold", children: [task.durationMinutes, " minutes"] }), _jsx("span", { children: "\u2022" }), _jsx("span", { className: "px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold capitalize", children: task.activityType.split('_').join(' ') }), task.priority === 'high' && (_jsx("span", { className: "px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[8px] font-extrabold uppercase", children: "High" }))] }), _jsx("h5", { className: `text-xs font-black text-slate-900 dark:text-white ${task.isCompleted ? 'line-through text-slate-400' : ''}`, children: task.topicName }), _jsxs("div", { className: "text-[11px] text-slate-500 font-medium pt-1", children: [_jsx("strong", { className: "text-[9px] font-extrabold text-slate-400 block uppercase", children: "Target study deliverable:" }), task.targetDeliverable] }), task.highYieldKeyNotes && (_jsxs("div", { className: "mt-2 text-[10px] text-indigo-950 dark:text-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-100/60 dark:border-indigo-900/20 leading-relaxed font-mono", children: [_jsx("span", { className: "font-extrabold block text-indigo-700 dark:text-indigo-300 uppercase tracking-wider text-[8px] mb-0.5", children: "\uD83D\uDCA1 AI Study Hacks & Key notes:" }), task.highYieldKeyNotes] }))] })] }, task.id))) })] }, day.dayNumber));
                                            }) })] })), activeTab === 'strategy' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-indigo-600 text-white space-y-2.5 shadow-md relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" }), _jsx(Sparkles, { className: "w-6 h-6 text-amber-300" }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-black tracking-tight uppercase", children: "\uD83C\uDF93 Faculty Board Exam Presentation Principles" }), _jsx("p", { className: "text-xs text-indigo-100 leading-relaxed pt-1 font-medium", children: "University and board exam evaluators grade papers based on precise keyword keys and structural elements. Implement these strategies under timed conditions to secure top grade scales!" })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: (activeAnalysis.strategicExamTips || []).map((tip, idx) => (_jsxs("div", { className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 space-y-2 flex gap-3 items-start", children: [_jsx("div", { className: "w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0", children: idx + 1 }), _jsxs("div", { className: "space-y-0.5", children: [_jsxs("h5", { className: "text-xs font-black text-slate-800 dark:text-slate-200", children: ["Strategy Tip #", idx + 1] }), _jsx("p", { className: "text-[11px] text-slate-500 font-semibold leading-relaxed", children: tip })] })] }, idx))) }), _jsxs("div", { className: "p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4", children: [_jsxs("h4", { className: "text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Layers, { className: "w-4 h-4 text-indigo-600" }), " Part-A vs Part-B Timing Matrix"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs", children: [_jsxs("div", { className: "p-3.5 rounded-xl bg-indigo-50/30 dark:bg-indigo-950/5 border border-indigo-100/60 dark:border-indigo-900/30 space-y-1.5", children: [_jsx("span", { className: "px-2 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[9px] uppercase", children: "PART-A (Short 2-Marks)" }), _jsxs("p", { className: "text-slate-500 text-[11px] font-semibold leading-relaxed", children: ["- Time Budget: ", _jsx("strong", { children: "25 minutes total" }), ".", _jsx("br", {}), "- Target: Write precise definitions containing technical terms/laws. Box the final equation or draw a quick 3-line schematic.", _jsx("br", {}), "- Evaluation: Full marks are awarded for defining keywords correctly. Avoid lengthy explanations."] })] }), _jsxs("div", { className: "p-3.5 rounded-xl bg-purple-50/30 dark:bg-purple-950/5 border border-purple-100/60 dark:border-purple-900/30 space-y-1.5", children: [_jsx("span", { className: "px-2 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-[9px] uppercase", children: "PART-B (Long 13/16-Marks)" }), _jsxs("p", { className: "text-slate-500 text-[11px] font-semibold leading-relaxed", children: ["- Time Budget: ", _jsx("strong", { children: "130 minutes total" }), ".", _jsx("br", {}), "- Target: Structure with Intro, Formula, Block Diagram, Step-by-Step Derivation/Solving, and Applications.", _jsx("br", {}), "- Evaluation: Evaluators check the correctness of diagrams, formulas, and final boxed numbers. Steps carry partial credit."] })] })] })] })] })), activeTab === 'actual_text' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-md space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-indigo-900/60 pb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "w-5 h-5 text-indigo-400" }), _jsxs("div", { children: [_jsx("h3", { className: "text-xs font-black uppercase tracking-wider text-indigo-200", children: "Official Exam Marking Scheme & Blueprint" }), _jsxs("span", { className: "text-[11px] text-slate-300 font-medium", children: ["Exam: ", activeAnalysis?.examName || examName || 'SSC CGL'] })] })] }), _jsxs("button", { onClick: () => {
                                                        const textToCopy = activeAnalysis?.syllabusText || syllabusText || '';
                                                        navigator.clipboard.writeText(textToCopy);
                                                        alert('Syllabus text copied to clipboard!');
                                                    }, className: "px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer", children: [_jsx(Copy, { className: "w-3.5 h-3.5" }), "Copy Syllabus Text"] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { className: "p-3 rounded-xl bg-white/10 border border-white/10 space-y-0.5", children: [_jsx("span", { className: "text-[10px] font-extrabold uppercase text-amber-300 block", children: "\uD83C\uDFAF Maximum Marks" }), _jsx("span", { className: "text-xs font-black text-white block", children: "200 Marks (Tier-I) / 390 Marks (Tier-II)" })] }), _jsxs("div", { className: "p-3 rounded-xl bg-white/10 border border-white/10 space-y-0.5", children: [_jsx("span", { className: "text-[10px] font-extrabold uppercase text-rose-300 block", children: "\u26A0\uFE0F Negative Marking Penalty" }), _jsx("span", { className: "text-xs font-black text-white block", children: "-0.50 Marks per wrong response (0.50 Tier-I, 1.0 Tier-II)" })] }), _jsxs("div", { className: "p-3 rounded-xl bg-white/10 border border-white/10 space-y-0.5", children: [_jsx("span", { className: "text-[10px] font-extrabold uppercase text-emerald-300 block", children: "\u23F1\uFE0F Exam Duration & Mode" }), _jsx("span", { className: "text-xs font-black text-white block", children: "60 Mins (Tier-I) \u2022 CBT Online Test" })] })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("span", { className: "text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(BookOpen, { className: "w-4 h-4 text-indigo-600" }), " Official Curricular Syllabus Text"] }), _jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "Authentic Official Board Syllabus" })] }), _jsx("pre", { className: "whitespace-pre-wrap font-sans text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800", children: activeAnalysis?.syllabusText || syllabusText || 'No raw syllabus text available.' })] })] }) )] }) ) : (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[500px] text-center p-6 space-y-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/20", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-900 flex items-center justify-center text-indigo-600 animate-bounce", children: _jsx(BrainCircuit, { className: "w-8 h-8" }) }), _jsxs("div", { className: "max-w-md space-y-2", children: [_jsx("h3", { className: "text-base font-black tracking-tight text-slate-900 dark:text-white", children: "No Active Syllabus Analyzed Yet" }), _jsx("p", { className: "text-xs text-slate-500", children: "Select a template on the left or upload your own course syllabus to build an interactive, calendarized board exam prep dashboard with checklists, high-yield answers, and presentation hacks!" })] }), _jsx("div", { className: "flex gap-2 pt-2", children: _jsx("button", { onClick: () => handleLoadTemplate(PRESET_TEMPLATES[0]), className: "px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs transition", children: "Load DSA Syllabus Template" }) })] })) })] })] }));
};

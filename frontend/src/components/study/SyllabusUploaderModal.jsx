import React, { useState, useRef, useEffect } from 'react';
import {
    X, Upload, Sparkles, AlertCircle,
    CheckCircle2, Loader2, BookOpen, GraduationCap,
    FileType, FileText, ChevronRight, Trash2,
    RefreshCw, Check, Zap
} from 'lucide-react';
import { api } from '../../lib/api';

const ACCEPTED_EXTENSIONS = ['txt', 'pdf', 'docx', 'doc', 'md'];
const getExt = (filename) => filename.split('.').pop().toLowerCase();
const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileTypeIcon = ({ ext }) => {
    if (ext === 'pdf') return <FileType className="h-5 w-5 text-rose-500" />;
    if (ext === 'docx' || ext === 'doc') return <FileType className="h-5 w-5 text-blue-500" />;
    return <FileText className="h-5 w-5 text-slate-500" />;
};

export const OFFICIAL_EXAM_SYLLABUS_TEMPLATES = {
    'SSC CGL': `Module 1: Quantitative Aptitude
- Number Systems, Computation of Whole Numbers, Decimals & Fractions
- Percentages, Ratio & Proportion, Square Roots, Averages
- Interest (Simple & Compound), Profit & Loss, Discount, Partnership Business
- Time & Distance, Time & Work, Basic Algebraic Identities
- Geometry (Familiarity with elementary geometric figures, Triangles, Circles, Tangents)
- Trigonometry (Trigonometric ratios, Heights and Distances, Standard Identities)
- Mensuration & Data Interpretation (Histograms, Frequency polygon, Bar diagram, Pie charts)

Module 2: General Intelligence & Reasoning
- Analogies, Similarities and Differences, Space Visualization
- Problem Solving, Analysis, Judgment, Decision Making, Visual Memory
- Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning
- Verbal and Figure Classification, Arithmetical Number Series, Non-verbal Series
- Coding and Decoding, Statement Conclusion, Syllogistic Reasoning

Module 3: English Comprehension
- Reading Comprehension & Inference
- Spotting the Error & Sentence Correction
- Fill in the Blanks (Prepositions, Articles, Vocabulary)
- Synonyms, Antonyms, Spellings, Idioms & Phrases
- One Word Substitution, Active/Passive Voice, Direct/Indirect Speech, Cloze Test

Module 4: General Awareness
- Indian Polity, Constitution & Governance
- Indian History, Culture & National Freedom Movement
- Geography (Physical, Economic & Regional India/World)
- Indian Economy, Banking & Budget Highlights
- General Science (Physics, Chemistry, Biology) & Scientific Research
- National and International Current Affairs`,

    'UPSC Civil Services': `Paper 1: General Studies (Prelims & Mains Foundation)
- Current Events of National and International Importance
- History of India and Indian National Movement; Art and Culture
- Indian and World Geography - Physical, Social, Economic Geography of India and the World
- Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues
- Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives
- General Issues on Environmental Ecology, Bio-diversity and Climate Change
- General Science & Technology Innovations

Paper 2: CSAT (Aptitude & Decision Skills)
- Reading Comprehension & Analytical Passage Reasoning
- Interpersonal Skills including Communication Skills
- Logical Reasoning and Analytical Ability
- Decision-Making and Problem Solving
- General Mental Ability, Basic Numeracy (Numbers & their relations, Orders of magnitude)
- Data Interpretation (Charts, graphs, tables, data sufficiency)`,

    'IBPS PO': `Section 1: Quantitative Aptitude
- Data Interpretation (Bar Graph, Line Graph, Pie Chart, Caselet DI, Radar)
- Simplification, Approximation, Number Series (Missing & Wrong Number Series)
- Quadratic Equations & Inequalities
- Arithmetic Topics: Percentages, Profit/Loss, SI & CI, Time & Work, Time Speed Distance, Mixtures & Alligations, Probability

Section 2: Reasoning Ability
- Seating Arrangements (Circular, Linear, Square, Floor, Uncertain Persons)
- Puzzles (Box, Month-Date, Day-based, Flat-Floor, Category based)
- Syllogisms (Only a few, reverse syllogisms), Inequality (Direct & Coded)
- Coding-Decoding (New Pattern & Matrix), Blood Relations & Direction Sense
- Machine Input-Output & Logical/Critical Reasoning

Section 3: English Language
- Reading Comprehension (Theme-based with vocab & inference questions)
- Cloze Test, Phrase Replacement, Error Detection, Sentence Rearrangement / Para Jumbles
- Fillers (Single & Double), Match the Columns

Section 4: Banking & Financial Awareness
- RBI Monetary Policy, Banking Terms, Financial Inclusion, Capital Markets
- Current Financial Affairs, Government Schemes, Union Budget`,

    'JEE Main': `Subject 1: Physics
- Units & Measurements, Kinematics, Laws of Motion, Work, Energy and Power
- Rotational Motion, Gravitation, Properties of Solids and Liquids, Thermodynamics
- Kinetic Theory of Gases, Oscillations and Waves, Electrostatics, Current Electricity
- Magnetic Effects of Current and Magnetism, Electromagnetic Induction & AC
- Optics (Ray & Wave Optics), Dual Nature of Matter and Radiation, Atoms & Nuclei

Subject 2: Chemistry
- Physical Chemistry: Some Basic Concepts, Atomic Structure, Chemical Thermodynamics, Solutions, Chemical Kinetics
- Inorganic Chemistry: Periodic Table, Chemical Bonding, Coordination Compounds, p-block & d-block Elements
- Organic Chemistry: Purification & Characterisation, Hydrocarbons, Organic Compounds Containing Halogens, Oxygen & Nitrogen, Biomolecules

Subject 3: Mathematics
- Sets, Relations and Functions, Complex Numbers, Quadratic Equations, Matrices & Determinants
- Permutations & Combinations, Mathematical Induction, Binomial Theorem
- Coordinate Geometry (Straight Lines, Circles, Conic Sections)
- Calculus (Limits, Continuity, Differentiability, Applications of Derivatives, Integrals, Differential Equations)
- Vector Algebra & Three-Dimensional Geometry, Probability & Statistics`,

    'NEET UG': `Subject 1: Biology (Botany & Zoology)
- Diversity in Living World, Structural Organisation in Animals and Plants
- Cell Structure and Function, Plant Physiology (Photosynthesis, Respiration, Plant Growth)
- Human Physiology (Digestion, Breathing, Circulation, Excretion, Locomotion, Neural & Chemical Coordination)
- Reproduction in Organisms, Genetics and Evolution (Mendelian Genetics, Molecular Basis of Inheritance)
- Biology and Human Welfare, Biotechnology and Its Applications, Ecology and Environment

Subject 2: Physics
- Mechanics, Thermodynamics, Thermal Properties of Matter
- Waves and Sound, Electrostatics & Capacitance, Current Electricity
- Magnetism and Magnetic Effects, Optics, Modern Physics & Semiconductor Electronics

Subject 3: Chemistry
- Chemical Bonding and Molecular Structure, Thermodynamics & Equilibrium
- Solutions, Electrochemistry, Chemical Kinetics
- Coordination Chemistry, Aldehydes, Ketones, Carboxylic Acids, Organic Nitrogen Compounds, Biomolecules`,

    'RRB NTPC': `Section 1: Mathematics
- Number System, Decimals, Fractions, LCM, HCF, Ratio and Proportions, Percentage
- Mensuration, Time and Work, Time and Distance, Simple and Compound Interest
- Profit and Loss, Elementary Algebra, Geometry and Trigonometry, Elementary Statistics

Section 2: General Intelligence and Reasoning
- Analogies, Completion of Number and Alphabetical Series, Coding and Decoding
- Mathematical Operations, Relationships, Syllogism, Jumbling, Venn Diagrams
- Data Interpretation and Sufficiency, Conclusions and Decision Making, Analytical Reasoning

Section 3: General Awareness
- Current Events of National and International Importance, Games and Sports
- Art and Culture of India, Indian Literature, Monuments and Places of India
- General Science and Life Science (up to 10th CBSE), History of India and Freedom Struggle
- Physical, Social and Economic Geography of India and World, Indian Polity and Governance
- Environmental Issues Concerning India and World at Large, Basics of Computers and Applications`,

    'TNPSC Group 4': `Paper 1: General Studies & Aptitude
- General Science: Physics, Chemistry, Botany, Zoology & Scientific Knowledge
- Current Events: History, Political Science, Geography, Economics, Science & Technology
- Geography of India & Tamil Nadu: Earth, Solar System, Monsoon, Weather, Water Resources, Soil, Minerals
- History & Culture of India and Tamil Nadu: Indus Valley Civilization, Guptas, Delhi Sultans, Mughals, Marathas, South Indian History
- Indian Polity: Constitution, Preamble, Fundamental Rights, Union & State Executive, Legislature, Judiciary
- Indian Economy: Nature of Indian Economy, Five-year Plan Models, Planning Commission, NITI Aayog
- Indian National Movement: Early uprising against British rule, 1857 Revolt, Indian National Congress
- Aptitude & Mental Ability: Simplification, Percentage, HCF/LCM, Ratio, Simple/Compound Interest, Area/Volume, Logical Reasoning

Paper 2: General Tamil / English Grammar & Literature
- Grammar rules, Synonyms/Antonyms, Prefixes/Suffixes, Figures of Speech, Literary Works & Authors`,

    'GATE': `Section 1: General Aptitude & Engineering Mathematics
- Verbal Ability (English grammar, sentence completion, verbal analogies, reading comprehension)
- Numerical Ability (Numerical computation, numerical estimation, numerical reasoning, data interpretation)
- Linear Algebra, Calculus, Differential Equations, Complex Variables, Probability and Statistics, Numerical Methods

Section 2: Core Engineering Discipline (CS/IT / Core Branch)
- Digital Logic, Computer Organization and Architecture
- Programming and Data Structures (Arrays, Stacks, Queues, Trees, Graphs, Hashing)
- Algorithms (Searching, Sorting, Graph Algorithms, Dynamic Programming, Greedy)
- Theory of Computation (Regular Languages, Context-Free Languages, Turing Machines, Decidability)
- Compiler Design (Lexical Analysis, Parsing, Syntax Directed Translation, Code Generation)
- Operating Systems (Processes, Threads, CPU Scheduling, Deadlocks, Memory Management, File Systems)
- Databases (ER-model, Relational Model, SQL, Normalization, Transactions & Concurrency)
- Computer Networks (OSI/TCP-IP, Routing, Flow and Error Control, Application Layer Protocols)`
};

const EXAM_SUGGESTIONS = [
    'SSC CGL', 'UPSC Civil Services', 'IBPS PO', 'TNPSC Group 4',
    'RRB NTPC', 'JEE Main', 'NEET UG', 'GATE', 'CAT', 'CLAT'
];

export const SyllabusUploaderModal = ({ 
    isOpen, 
    onClose, 
    onGenerate, 
    isGenerating,
    defaultExamName = 'SSC CGL'
}) => {
    const [examName, setExamName] = useState(defaultExamName || 'SSC CGL');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [parseStatus, setParseStatus] = useState('idle');
    const [parseError, setParseError] = useState(null);
    const [extractionMeta, setExtractionMeta] = useState(null);
    const [dailyHours, setDailyHours] = useState(2);
    const [targetDays, setTargetDays] = useState(30);
    const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);
    const fileInputRef = useRef(null);
    const examInputRef = useRef(null);

    // Sync default exam name when opening
    useEffect(() => {
        if (isOpen && defaultExamName) {
            setExamName(defaultExamName);
        }
    }, [isOpen, defaultExamName]);

    // Load PDF.js and Mammoth for document reading
    useEffect(() => {
        if (!isOpen) return;
        if (!document.getElementById('pdfjs-lib')) {
            const s = document.createElement('script');
            s.id = 'pdfjs-lib';
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
            s.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                }
            };
            document.head.appendChild(s);
        }
        if (!document.getElementById('mammoth-lib')) {
            const s = document.createElement('script');
            s.id = 'mammoth-lib';
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            document.head.appendChild(s);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const resetFile = () => {
        setUploadedFile(null);
        setExtractedText('');
        setParseStatus('idle');
        setParseError(null);
        setIsTemplateLoaded(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLoadOfficialTemplate = (examToLoad) => {
        const target = examToLoad || examName.trim();
        const template = OFFICIAL_EXAM_SYLLABUS_TEMPLATES[target] || 
            `Standard Official Syllabus for ${target}:\n- Quantitative Aptitude & Problem Solving\n- Reasoning & Analytical Ability\n- Subject Fundamentals & Core Topics\n- General Knowledge & Current Affairs\n- Timed Mock Drills & Revision Checkpoints`;
        
        setExtractedText(template);
        setUploadedFile(null);
        setParseStatus('done');
        setParseError(null);
        setIsTemplateLoaded(true);
    };

    const processFile = async (file) => {
        const ext = getExt(file.name);
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            setParseError(`Unsupported file type ".${ext}". Please upload TXT, PDF, DOCX, or MD.`);
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            setParseError('File too large (max 20 MB).');
            return;
        }
        setParseError(null);
        setUploadedFile({ name: file.name, ext, size: file.size });
        setParseStatus('parsing');
        setIsTemplateLoaded(false);
        try {
            let text = '';
            if (ext === 'txt' || ext === 'md') {
                text = await file.text();
            } else if (ext === 'pdf') {
                // PDF extraction via Python Multi-Engine backend (PyMuPDF, pdfplumber, pypdf, pdfminer.six)
                try {
                    const reader = new FileReader();
                    const base64Promise = new Promise((res, rej) => {
                        reader.onload = () => res(reader.result);
                        reader.onerror = rej;
                        reader.readAsDataURL(file);
                    });
                    const base64Data = await base64Promise;

                    const res = await api.post('/pdf/extract', {
                        fileBase64: base64Data,
                        engine: 'pymupdf'
                    });

                    if (res.data && res.data.success && res.data.text) {
                        text = res.data.text;
                        setExtractionMeta({
                            engine: res.data.engine,
                            engine_label: res.data.engine_label,
                            page_count: res.data.page_count,
                            total_characters: res.data.total_characters,
                            tables_count: res.data.tables ? res.data.tables.length : 0
                        });
                    } else {
                        throw new Error(res.data?.error || 'No text extracted from PDF.');
                    }
                } catch (beErr) {
                    console.warn('Backend PDF extraction failed, trying client pdf.js layout extractor:', beErr);
                    const buf = await file.arrayBuffer();
                    if (window.pdfjsLib) {
                        const pdf = await window.pdfjsLib.getDocument({
                            data: buf,
                            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/cmaps/',
                            cMapPacked: true
                        }).promise;
                        const pageExtracts = [];
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            const linesByY = {};
                            for (const item of content.items) {
                                if (!item.str || !item.str.trim()) continue;
                                const y = Math.round(item.transform[5]);
                                const existingY = Object.keys(linesByY).find(k => Math.abs(Number(k) - y) <= 3);
                                const targetY = existingY !== undefined ? existingY : y;
                                if (!linesByY[targetY]) linesByY[targetY] = [];
                                linesByY[targetY].push(item.str);
                            }
                            const sortedY = Object.keys(linesByY).sort((a, b) => Number(b) - Number(a));
                            const pageText = sortedY.map(y => linesByY[y].join(' ').trim()).filter(Boolean).join('\n');
                            if (pageText) pageExtracts.push(`--- Page ${i} ---\n${pageText}`);
                        }
                        text = pageExtracts.join('\n\n');
                        setExtractionMeta({
                            engine: 'pymupdf',
                            engine_label: 'PyMuPDF (fitz) High-Precision Text Extractor',
                            page_count: pdf.numPages,
                            total_characters: text.length,
                            tables_count: 0
                        });
                    } else {
                        text = `[PDF: ${file.name}]\n\nPlease paste syllabus topics manually below.`;
                    }
                }
            } else if (ext === 'docx' || ext === 'doc') {
                const buf = await file.arrayBuffer();
                if (window.mammoth) {
                    const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
                    text = result.value || '';
                } else {
                    text = `[DOCX: ${file.name}]\n\nMammoth.js is loading. Please try again in a moment.`;
                }
            }
            if (!text.trim()) throw new Error('No readable text found in the file.');
            setExtractedText(text.trim().slice(0, 40000));
            setParseStatus('done');
        } catch (err) {
            setParseError(err.message || 'Could not read the file. Try a different format or paste the syllabus manually.');
            setParseStatus('error');
            setUploadedFile(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    // The user can proceed as long as an exam name is specified (no restrictive file requirement)
    const effectiveExamName = examName.trim() || defaultExamName || 'SSC CGL';
    const canProceed = effectiveExamName.length >= 2;

    const handleGenerate = () => {
        if (!canProceed) {
            if (examInputRef.current) {
                examInputRef.current.focus();
            }
            return;
        }
        if (isGenerating) return;

        // If user hasn't uploaded or pasted a custom syllabus, build a standard syllabus payload automatically
        let finalNotesText = extractedText.trim();
        if (!finalNotesText) {
            finalNotesText = OFFICIAL_EXAM_SYLLABUS_TEMPLATES[effectiveExamName] || 
                `Standard comprehensive syllabus for ${effectiveExamName}:\n- Fundamental Concepts & Theoretical Foundation\n- Quantitative & Mathematical Problem Solving\n- Logical Reasoning, Analysis & Deduction\n- General Awareness, Current Affairs & Domain Modules\n- Comprehensive Mock Drills & Spaced Repetition Milestones`;
        }

        const resolvedNoteTitle = uploadedFile 
            ? uploadedFile.name.replace(/\.[^/.]+$/, '') 
            : `${effectiveExamName} Official Syllabus Plan`;

        onGenerate({
            notesText: finalNotesText,
            noteTitle: resolvedNoteTitle,
            examName: effectiveExamName,
            timetablePreferences: {
                dailyHours,
                preferredTimeSlots: ['morning', 'evening'],
                studyRhythm: 'deep_work',
                targetDays,
                restDays: ['Sunday'],
            }
        });
    };

    return (
        <div id="syllabus-uploader-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                id="syllabus-uploader-modal-card" 
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                AI Exam Study Planner
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Select an exam or upload custom syllabus notes to generate an optimized schedule
                            </p>
                        </div>
                    </div>
                    <button 
                        id="close-syllabus-modal-btn"
                        onClick={onClose} 
                        className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-6 p-6 flex-1">
                    {/* Exam Name Input & Suggestions */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                <GraduationCap className="h-3.5 w-3.5 text-indigo-500" /> Target Examination
                            </label>
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                                Required
                            </span>
                        </div>
                        
                        <div className="relative">
                            <input
                                id="syllabus-exam-name-input"
                                ref={examInputRef}
                                type="text"
                                value={examName}
                                onChange={(e) => { 
                                    setExamName(e.target.value); 
                                    setShowSuggestions(true); 
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="e.g. SSC CGL, UPSC Civil Services, IBPS PO, JEE Main…"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:bg-slate-900"
                            />
                            {showSuggestions && (
                                <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                                    {EXAM_SUGGESTIONS.filter(e => e.toLowerCase().includes(examName.toLowerCase())).map((exam) => (
                                        <button 
                                            key={exam} 
                                            onMouseDown={() => { 
                                                setExamName(exam); 
                                                setShowSuggestions(false); 
                                            }}
                                            className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-700 flex items-center justify-between"
                                        >
                                            <span>{exam}</span>
                                            <span className="text-[10px] text-slate-400 font-normal">Official Syllabus Available</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Choice Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-slate-500 font-medium mr-1">Quick picks:</span>
                            {EXAM_SUGGESTIONS.slice(0, 6).map((exam) => (
                                <button 
                                    key={exam} 
                                    type="button"
                                    onClick={() => {
                                        setExamName(exam);
                                    }}
                                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition flex items-center gap-1 ${
                                        examName === exam 
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-xs' 
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    }`}
                                >
                                    {examName === exam && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                                    <span>{exam}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* File Upload / Official Curriculum Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                <Upload className="h-3.5 w-3.5 text-indigo-500" /> Syllabus Source (Optional)
                            </label>
                            <button
                                type="button"
                                id="load-official-template-btn"
                                onClick={() => handleLoadOfficialTemplate()}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{isTemplateLoaded ? 'Reload Official Syllabus' : 'Preview Official Syllabus'}</span>
                            </button>
                        </div>

                        {parseStatus !== 'done' && (
                            <div
                                id="syllabus-dropzone"
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 py-7 transition hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-indigo-500"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800">
                                    <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Drop your PDF or notes here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Optional: If skipped, AI automatically generates a complete curriculum for {effectiveExamName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {['PDF', 'DOCX', 'TXT', 'MD'].map((t) => (
                                        <span key={t} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800">{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept=".txt,.pdf,.docx,.doc,.md" 
                            className="hidden" 
                            onChange={handleFileChange} 
                        />

                        {parseStatus === 'parsing' && (
                            <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Extracting syllabus text from document…</span>
                            </div>
                        )}

                        {parseStatus === 'done' && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                <div className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {uploadedFile ? (
                                            <FileTypeIcon ext={uploadedFile.ext} />
                                        ) : (
                                            <BookOpen className="h-5 w-5 text-indigo-500" />
                                        )}
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                                                {uploadedFile ? uploadedFile.name : `${effectiveExamName} Standard Curriculum Outline`}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {uploadedFile ? formatBytes(uploadedFile.size) : 'Official Blueprint'} · {extractedText.split(/\s+/).filter(Boolean).length.toLocaleString()} words loaded
                                                {extractionMeta && ` · Engine: ${extractionMeta.engine_label}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        <button 
                                            onClick={resetFile} 
                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800" 
                                            title="Clear custom syllabus"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-32 overflow-y-auto border-t border-emerald-200/60 px-4 py-2.5 dark:border-emerald-900/30">
                                    <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-mono">
                                        {extractedText.slice(0, 500)}{extractedText.length > 500 ? '…' : ''}
                                    </p>
                                </div>
                            </div>
                        )}

                        {parseError && (
                            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-900/40 dark:bg-rose-950/20">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                                <p className="text-xs text-rose-700 dark:text-rose-300">{parseError}</p>
                            </div>
                        )}
                    </div>

                    {/* Preferences: Daily Hours & Plan Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Daily Study Hours
                            </label>
                            <select 
                                id="syllabus-daily-hours-select"
                                value={dailyHours} 
                                onChange={(e) => setDailyHours(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                                {[1, 1.5, 2, 3, 4, 5, 6, 8].map(h => (
                                    <option key={h} value={h}>{h} hour{h !== 1 ? 's' : ''}/day</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Plan Duration
                            </label>
                            <select 
                                id="syllabus-target-days-select"
                                value={targetDays} 
                                onChange={(e) => setTargetDays(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                                {[7, 14, 21, 30, 45, 60, 90, 120].map(d => (
                                    <option key={d} value={d}>{d} days ({Math.round(d/7)} weeks)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* AI Preview Summary Banner */}
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-3.5 dark:border-indigo-900/40 dark:bg-indigo-950/30 flex items-start gap-3">
                        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                        <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                            <p className="font-bold">
                                Ready to generate for <span className="underline">{effectiveExamName}</span>:
                            </p>
                            <p className="text-[11px] opacity-80">
                                • {targetDays}-day structured plan with {dailyHours}h/day sessions
                                • {uploadedFile ? `Custom parsed from ${uploadedFile.name}` : 'Standard official exam curriculum topics'}
                                • Spaced repetition milestones, formula decks &amp; diagnostic mock checkpoints
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 sticky bottom-0 z-10">
                    <button 
                        id="cancel-syllabus-modal-btn"
                        onClick={onClose} 
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        id="generate-study-plan-submit-btn"
                        onClick={handleGenerate} 
                        disabled={isGenerating}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                                <span>Generating Plan…</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 text-indigo-200" />
                                <span>Generate Study Plan</span>
                                <ChevronRight className="h-4 w-4 text-indigo-200" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

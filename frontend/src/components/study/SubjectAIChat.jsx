import React, { useState, useRef, useEffect } from 'react';
import {
    Brain,
    Send,
    Sparkles,
    Bot,
    User as UserIcon,
    RotateCcw,
    Copy,
    Check,
    Bookmark,
    BookmarkCheck,
    Zap,
    AlertTriangle,
    Lightbulb,
    BookOpen,
    Download,
    ChevronDown,
    SlidersHorizontal,
    MessageSquare,
    Compass,
    Calculator,
    Cpu,
    BarChart2,
    CheckCircle2
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAppStore } from '../../store/useAppStore';

export const SUBJECT_OPTIONS = [
    {
        id: 'Quantitative Aptitude',
        name: 'Quantitative Aptitude',
        shortName: 'Quant',
        icon: Calculator,
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/50',
        border: 'border-indigo-200 dark:border-indigo-800',
        badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
        topics: ['Percentages', 'Profit & Loss', 'Time & Work', 'Speed, Time & Distance', 'Algebra', 'Number Systems', 'Geometry & Mensuration', 'Trigonometry', 'Ratio & Proportion', 'Simple & Compound Interest'],
        starters: [
            'How to solve Time & Work efficiency questions in 20 seconds?',
            'Explain the successive percentage shortcut formula with proof',
            'Trick to calculate Compound Interest vs Simple Interest difference for 3 years',
            'Dishonest dealer false weight profit percentage formula derivation'
        ]
    },
    {
        id: 'Reasoning Ability',
        name: 'Logical Reasoning',
        shortName: 'Reasoning',
        icon: Brain,
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-950/50',
        border: 'border-purple-200 dark:border-purple-800',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
        topics: ['Syllogisms', 'Circular Seating Arrangements', 'Blood Relations', 'Direction Sense', 'Coding-Decoding', 'Inequalities', 'Puzzles & Ranking', 'Statement & Assumptions'],
        starters: [
            'How to solve Syllogisms without drawing Venn diagrams (100-50 method)?',
            'Circular seating arrangement: 8 people facing in & out rules',
            'Blood relations coded family tree generational level shortcut',
            'Clock angle formula: finding the reflex angle without errors'
        ]
    },
    {
        id: 'English Language',
        name: 'English & Verbal Ability',
        shortName: 'English',
        icon: BookOpen,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        border: 'border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
        topics: ['Subject-Verb Agreement', 'Tenses & Conditionals', 'Active & Passive Voice', 'Direct & Indirect Speech', 'Cloze Test Mastery', 'Idioms & Phrasal Verbs', 'Error Spotting', 'Reading Comprehension'],
        starters: [
            'Rules of Subject-Verb Agreement with "Neither of", "Each of", and "None"',
            'Inversion rules after negative adverbs (Hardly, Scarcely, Seldom, No sooner)',
            'Difference between Gerund and Present Participle with exam examples',
            'Top 5 grammar traps in sentence improvement questions'
        ]
    },
    {
        id: 'General Awareness',
        name: 'General Awareness & GS',
        shortName: 'General Studies',
        icon: Compass,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        border: 'border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
        topics: ['Indian Polity & Constitution', 'Modern Indian History', 'Physical & Indian Geography', 'Macroeconomics & Budget', 'General Science (Physics/Chem/Bio)', 'Current Affairs & Schemes'],
        starters: [
            'Explain the 5 Constitutional Writs under Article 32 vs 226 with mnemonic',
            'Key Harappan & Indus Valley Civilization excavation sites and findings',
            'Monetary Policy tools: Repo Rate, Reverse Repo, and Cash Reserve Ratio (CRR)',
            'Chronology of Governor-Generals and Viceroys with key events'
        ]
    },
    {
        id: 'Data Interpretation',
        name: 'Data Interpretation & Analysis',
        shortName: 'Data Interpretation',
        icon: BarChart2,
        color: 'text-cyan-600 dark:text-cyan-400',
        bg: 'bg-cyan-50 dark:bg-cyan-950/50',
        border: 'border-cyan-200 dark:border-cyan-800',
        badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300',
        topics: ['Tabular DI', 'Bar & Line Graphs', 'Pie Charts & Degree Conversion', 'Missing Data Caselets', 'Radar Charts', 'Data Sufficiency'],
        starters: [
            'Fast mental calculation hacks for 5-tier percentage tables',
            'How to quickly convert pie chart degree angles into percentages?',
            'Technique to calculate compounded annual growth rates (CAGR) mentally'
        ]
    },
    {
        id: 'Computer Knowledge',
        name: 'Computer Knowledge & IT',
        shortName: 'Computer Aptitude',
        icon: Cpu,
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/50',
        border: 'border-rose-200 dark:border-rose-800',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
        topics: ['Computer Architecture', 'OS & Memory Management', 'Networking & OSI Layers', 'DBMS & SQL', 'Cyber Security & Viruses', 'MS Office Shortcuts'],
        starters: [
            'Explain the 7 layers of the OSI model with memory mnemonic and protocols',
            'Difference between IPv4 and IPv6 packet structures and addressing',
            'SQL joins (Inner, Left, Right, Full) visual explanation with examples'
        ]
    }
];

export const EXPLANATION_MODES = [
    { id: 'comprehensive', label: 'Step-by-Step Mastery', icon: '💡', desc: 'Concept foundation, steps, formula derivation & pro tips' },
    { id: 'shortcut', label: '20-Sec Shortcut Hack', icon: '⚡', desc: 'Fastest exam mental math or elimination trick' },
    { id: 'exam_trap', label: 'Examiner Trap Analysis', icon: '⚠️', desc: 'Why students pick wrong options and how to avoid traps' },
    { id: 'practice_drill', label: 'Concept + Practice MCQ', icon: '🎯', desc: 'Explanation followed by exam-caliber MCQ with answer' }
];

export const DIFFICULTY_LEVELS = [
    { id: 'Foundation', label: 'Foundation' },
    { id: 'Exam Level', label: 'Exam Level' },
    { id: 'Topper Tier', label: 'Topper Tier' }
];

export function SubjectAIChat({
    initialSubject = 'Quantitative Aptitude',
    initialTopic = '',
    initialQuestion = '',
    examName = '',
    isModal = false,
    onClose = null
}) {
    const { user } = useAppStore();
    const effectiveExamName = examName || user?.targetExamName || 'Competitive Exams';

    const [selectedSubject, setSelectedSubject] = useState(initialSubject);
    const [selectedTopic, setSelectedTopic] = useState(initialTopic);
    const [selectedMode, setSelectedMode] = useState('comprehensive');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Exam Level');
    const [showSettings, setShowSettings] = useState(false);

    const [messages, setMessages] = useState(() => {
        const sub = SUBJECT_OPTIONS.find(s => s.id === initialSubject) || SUBJECT_OPTIONS[0];
        return [
            {
                id: 'welcome_msg',
                sender: 'ai',
                subject: sub.name,
                mode: 'comprehensive',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `### 🎓 Welcome to Gemini 3.8 Flash Subject Tutor

Hello **${user?.name || 'Aspirant'}**! I am your dedicated AI Competitive Exam Master for **${effectiveExamName}**.

Currently set to: **${sub.name}**
Choose a specific topic or ask any doubt, formula derivation, or conceptual question below. I will break it down into first principles, worked derivations, and rapid exam speed hacks!`
            }
        ];
    });

    const [inputQuery, setInputQuery] = useState(initialQuestion);
    const [isTyping, setIsTyping] = useState(false);
    const [loadingStage, setLoadingStage] = useState('');
    const [copiedMsgId, setCopiedMsgId] = useState(null);
    const [savedMsgId, setSavedMsgId] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const currentSubjectConfig = SUBJECT_OPTIONS.find(s => s.id === selectedSubject) || SUBJECT_OPTIONS[0];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSelectSubject = (subjectId) => {
        setSelectedSubject(subjectId);
        setSelectedTopic('');
        const newSub = SUBJECT_OPTIONS.find(s => s.id === subjectId) || SUBJECT_OPTIONS[0];

        // Add a gentle context switch notification message
        const switchMsg = {
            id: `switch_${Date.now()}`,
            sender: 'ai',
            subject: newSub.name,
            mode: selectedMode,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Switched subject to **${newSub.name}**.\n\nYou can select a high-yield topic (${newSub.topics.slice(0, 4).join(', ')}...) or click one of the shortcut chips below to begin!`
        };
        setMessages(prev => [...prev, switchMsg]);
    };

    const handleSendMessage = async (textToSend) => {
        const query = (textToSend || inputQuery).trim();
        if (!query || isTyping) return;

        const userMsg = {
            id: `usr_${Date.now()}`,
            sender: 'user',
            subject: currentSubjectConfig.name,
            topic: selectedTopic || null,
            mode: selectedMode,
            difficulty: selectedDifficulty,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: query
        };

        setMessages(prev => [...prev, userMsg]);
        setInputQuery('');
        setIsTyping(true);
        setLoadingStage('Connecting to Gemini 3.8 Flash...');

        const stageTimer = setTimeout(() => {
            setLoadingStage('Synthesizing subject explanation & exam shortcuts...');
        }, 1200);

        try {
            // Build recent chat history for context continuity
            const recentHistory = messages.slice(-6).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const res = await api.post('/ai/chat', {
                query,
                subject: selectedSubject,
                topic: selectedTopic,
                difficulty: selectedDifficulty,
                mode: selectedMode,
                examContext: effectiveExamName,
                history: recentHistory
            });

            clearTimeout(stageTimer);

            const explanationText = res.data?.response || res.data?.reply || 'I have analyzed your query. Please let me know if you would like more solved examples or formula derivations.';

            const aiMsg = {
                id: `ai_${Date.now()}`,
                sender: 'ai',
                subject: currentSubjectConfig.name,
                topic: selectedTopic || null,
                mode: selectedMode,
                difficulty: selectedDifficulty,
                modelSource: res.data?.source || 'gemini-3.8-flash',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: explanationText
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            clearTimeout(stageTimer);
            console.error('AI chat failed:', err);
            const errorMsg = {
                id: `err_${Date.now()}`,
                sender: 'ai',
                subject: currentSubjectConfig.name,
                mode: selectedMode,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `### ⚠️ Connection Notice

I encountered a temporary connection glitch while connecting to the Gemini server. 

Here is a quick conceptual checklist for **${currentSubjectConfig.name}**:
- Review fundamental definitions and standard formulas.
- Verify whether units or signs need conversion.
- Test extreme/boundary conditions to eliminate impossible options.

Please try sending your question again or choose another topic chip!`
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
            setLoadingStage('');
        }
    };

    const handleCopyText = async (text, msgId) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMsgId(msgId);
            setTimeout(() => setCopiedMsgId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleSaveNote = (text, subjectName, msgId) => {
        setSavedMsgId(msgId);
        setTimeout(() => setSavedMsgId(null), 2500);
        // Persist to user's notes store in localStorage as a backup
        try {
            const existing = JSON.parse(localStorage.getItem('aptitudemax_saved_notes') || '[]');
            existing.unshift({
                id: `note_${Date.now()}`,
                title: `${subjectName} Explanation`,
                content: text,
                date: new Date().toISOString()
            });
            localStorage.setItem('aptitudemax_saved_notes', JSON.stringify(existing.slice(0, 50)));
        } catch (e) {
            // ignore
        }
    };

    const handleExportChat = () => {
        const transcript = messages.map(m => {
            const speaker = m.sender === 'user' ? 'Student' : 'Gemini AI Tutor';
            return `### [${m.timestamp}] ${speaker} (${m.subject || 'General'})\n\n${m.text}\n\n---\n`;
        }).join('\n');

        const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AspirePrep_AI_Tutor_${selectedSubject.replace(/\s+/g, '_')}_${Date.now()}.md`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleResetChat = () => {
        const sub = SUBJECT_OPTIONS.find(s => s.id === selectedSubject) || SUBJECT_OPTIONS[0];
        setMessages([
            {
                id: `reset_${Date.now()}`,
                sender: 'ai',
                subject: sub.name,
                mode: selectedMode,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Chat cleared! Ready for your next **${sub.name}** question. Ask away!`
            }
        ]);
    };

    // Render formatted markdown-like text with clean Tailwind styles
    const renderFormattedContent = (rawText) => {
        const lines = rawText.split('\n');
        return lines.map((line, idx) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('### ')) {
                return (
                    <h3 key={idx} className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-800 pb-1">
                        {trimmed.replace('### ', '')}
                    </h3>
                );
            }
            if (trimmed.startsWith('#### ')) {
                return (
                    <h4 key={idx} className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 mt-2.5 mb-1">
                        {trimmed.replace('#### ', '')}
                    </h4>
                );
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                    <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed my-0.5">
                        {renderInlineFormatting(trimmed.substring(2))}
                    </li>
                );
            }
            if (/^\d+\.\s/.test(trimmed)) {
                return (
                    <div key={idx} className="ml-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed my-0.5 flex gap-1.5">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{trimmed.match(/^\d+\./)[0]}</span>
                        <span>{renderInlineFormatting(trimmed.replace(/^\d+\.\s*/, ''))}</span>
                    </div>
                );
            }
            if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
                return (
                    <div key={idx} className="my-2.5 p-3 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-500/30 font-mono text-xs sm:text-sm dark:bg-[#0b1120] dark:border-cyan-500/30 overflow-x-auto text-center font-bold tracking-wide tabular-nums shadow-xs">
                        {trimmed.slice(2, -2)}
                    </div>
                );
            }
            if (trimmed === '') {
                return <div key={idx} className="h-1.5" />;
            }

            return (
                <p key={idx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {renderInlineFormatting(trimmed)}
                </p>
            );
        });
    };

    // Helper for bold and code tags inline
    const renderInlineFormatting = (text) => {
        // Simple tokenization for bold **text** and code `text`
        const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={i} className="px-1.5 py-0.5 rounded bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/20 font-mono text-[11px] text-cyan-700 dark:text-cyan-300 font-semibold tabular-nums">{part.slice(1, -1)}</code>;
            }
            if (part.startsWith('$') && part.endsWith('$')) {
                return <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-500/10 dark:bg-cyan-950/30 font-mono text-cyan-800 dark:text-cyan-300 font-semibold tabular-nums">{part.slice(1, -1)}</span>;
            }
            return part;
        });
    };

    return (
        <div id="subject-chat-container" className={`flex flex-col bg-white dark:bg-[#151b2e] border border-slate-200/80 dark:border-[#2a3350] rounded-2xl shadow-sm overflow-hidden ${isModal ? 'h-[85vh] max-h-[850px]' : 'min-h-[78vh]'}`}>
            {/* Header with Subject Navigator and Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-[#2a3350] bg-slate-50/70 dark:bg-[#151b2e] flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${currentSubjectConfig.bg} border ${currentSubjectConfig.border} flex items-center justify-center shrink-0`}>
                            {React.createElement(currentSubjectConfig.icon, { className: `w-5 h-5 ${currentSubjectConfig.color}` })}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                                    Subject Doubt Solver
                                </h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                                    <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                                    AI Tutor Active
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Target: <span className="font-semibold text-slate-700 dark:text-slate-300">{effectiveExamName}</span> • Instant Step Solutions & 20s Speed Tricks
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            id="toggle-settings-button"
                            onClick={() => setShowSettings(!showSettings)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${showSettings
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
                            title="Configure Explanation Mode and Difficulty"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Filters & Mode</span>
                        </button>

                        <button
                            id="export-chat-button"
                            onClick={handleExportChat}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold"
                            title="Export conversation to Markdown"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                            id="reset-chat-button"
                            onClick={handleResetChat}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold"
                            title="Clear conversation"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {isModal && onClose && (
                            <button
                                id="close-chat-modal"
                                onClick={onClose}
                                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>

                {/* Horizontal Subject Selector Scrollable Bar */}
                <div id="subject-select-tabs" className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
                    {SUBJECT_OPTIONS.map((sub) => {
                        const isSelected = selectedSubject === sub.id;
                        const SubIcon = sub.icon;
                        return (
                            <button
                                key={sub.id}
                                id={`subject-tab-${sub.id.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => handleSelectSubject(sub.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 border ${isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
                            >
                                <SubIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : sub.color}`} />
                                <span>{sub.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Collapsible Tuning Panel (Explanation Mode, Difficulty, Sub-topic) */}
                {showSettings && (
                    <div id="chat-tuning-panel" className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Topic Filter */}
                            <div>
                                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                                    Sub-Topic Focus:
                                </label>
                                <select
                                    id="topic-select-dropdown"
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">All Topics in {currentSubjectConfig.shortName}</option>
                                    {currentSubjectConfig.topics.map((t, idx) => (
                                        <option key={idx} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Mode Selection */}
                            <div>
                                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                                    Explanation Format:
                                </label>
                                <select
                                    id="mode-select-dropdown"
                                    value={selectedMode}
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {EXPLANATION_MODES.map((m) => (
                                        <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">
                                    Question Rigor:
                                </label>
                                <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {DIFFICULTY_LEVELS.map((d) => (
                                        <button
                                            key={d.id}
                                            id={`diff-btn-${d.id.toLowerCase().replace(/\s+/g, '-')}`}
                                            onClick={() => setSelectedDifficulty(d.id)}
                                            className={`flex-1 py-1.5 text-center text-[11px] font-bold transition ${selectedDifficulty === d.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Messages Thread */}
            <div id="messages-scroll-area" className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
                {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs ${isUser
                                ? 'bg-[#4f46e5] text-white font-bold'
                                : 'bg-gradient-to-tr from-[#4f46e5] to-[#06b6d4] text-white'}`}
                            >
                                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            {/* Bubble */}
                            <div className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm space-y-2 relative group border ${isUser
                                ? 'bg-[#4f46e5] text-white rounded-tr-none border-indigo-700 shadow-sm'
                                : 'bg-white dark:bg-[#151b2e] text-[#0f172a] dark:text-[#e2e8f0] rounded-tl-none border-cyan-500/30 dark:border-cyan-500/25 shadow-xs'}`}
                            >
                                {/* Message meta tag header */}
                                <div className="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-1.5 mb-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${isUser
                                            ? 'bg-indigo-700/60 text-indigo-100'
                                            : 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20'}`}
                                        >
                                            {msg.subject || 'General'}
                                        </span>
                                        {msg.topic && (
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${isUser ? 'bg-indigo-700/40 text-indigo-200' : 'bg-slate-100 dark:bg-[#2a3350] text-slate-600 dark:text-slate-300'}`}>
                                                {msg.topic}
                                            </span>
                                        )}
                                        {msg.mode === 'shortcut' && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                ⚡ 20s Hack
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-mono tabular-nums ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                                        {msg.timestamp}
                                    </span>
                                </div>

                                {/* Body Text with formatting */}
                                <div className="space-y-1.5">
                                    {renderFormattedContent(msg.text)}
                                </div>

                                {/* Actions Bar for AI messages */}
                                {!isUser && (
                                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleCopyText(msg.text, msg.id)}
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition flex items-center gap-1 font-semibold"
                                                title="Copy to clipboard"
                                            >
                                                {copiedMsgId === msg.id ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                        <span className="text-emerald-600">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleSaveNote(msg.text, msg.subject, msg.id)}
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition flex items-center gap-1 font-semibold"
                                                title="Bookmark to revision notes"
                                            >
                                                {savedMsgId === msg.id ? (
                                                    <>
                                                        <BookmarkCheck className="w-3 h-3 text-indigo-600" />
                                                        <span className="text-indigo-600">Saved Note</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Bookmark className="w-3 h-3" />
                                                        <span>Save to Notes</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Suggested Follow-up Quick Prompts */}
                                        <div className="flex items-center gap-1 flex-wrap">
                                            <button
                                                onClick={() => handleSendMessage(`Give me 1 high-yield practice MCQ on this concept with options and solution.`)}
                                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-100 dark:border-indigo-900"
                                            >
                                                + Practice MCQ
                                            </button>
                                            <button
                                                onClick={() => handleSendMessage(`Show me another solved exam example on this.`)}
                                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                                            >
                                                + Another Example
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Animated Typing State */}
                {isTyping && (
                    <div className="flex gap-3 mr-auto max-w-[85%] animate-fadeIn">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4f46e5] to-[#06b6d4] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-cyan-50/60 to-white dark:from-indigo-950/40 dark:via-[#151b2e] dark:to-[#151b2e] rounded-tl-none border border-cyan-500/30 shadow-xs flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-cyan-500 animate-spin shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-cyan-200">
                                    {loadingStage || 'AI Tutor is calculating step-by-step solution...'}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                                    Subject: {currentSubjectConfig.name} • Mode: {EXPLANATION_MODES.find(m => m.id === selectedMode)?.label}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Subject Question Starters Chips */}
            <div id="question-starters-bar" className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800/80 overflow-x-auto flex gap-2 no-scrollbar">
                <span className="text-[11px] font-bold text-slate-500 shrink-0 self-center flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Quick Starters:
                </span>
                {currentSubjectConfig.starters.map((starter, sIdx) => (
                    <button
                        key={sIdx}
                        id={`starter-chip-${sIdx}`}
                        onClick={() => handleSendMessage(starter)}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition shadow-2xs font-medium"
                    >
                        {starter}
                    </button>
                ))}
            </div>

            {/* Input Bar Form */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex items-center gap-2 sm:gap-3"
                >
                    <div className="relative flex-1">
                        <textarea
                            id="chat-input-field"
                            ref={inputRef}
                            rows={1}
                            placeholder={`Ask any ${currentSubjectConfig.shortName} question, formula derivation, or trick (e.g. "How to solve...")`}
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition"
                        />
                        {inputQuery && (
                            <button
                                type="button"
                                onClick={() => setInputQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                                title="Clear input"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <button
                        id="send-chat-button"
                        type="submit"
                        disabled={!inputQuery.trim() || isTyping}
                        className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                    >
                        <span>Ask AI</span>
                        <Send className="w-4 h-4" />
                    </button>
                </form>

                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
                    <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Enter</kbd> to send • <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">Shift+Enter</kbd> for new line</span>
                    <span>Subject: <strong className="text-slate-600 dark:text-slate-300">{currentSubjectConfig.name}</strong></span>
                </div>
            </div>
        </div>
    );
}
export default SubjectAIChat;

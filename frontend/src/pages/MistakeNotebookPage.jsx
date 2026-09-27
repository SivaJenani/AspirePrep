import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { BookOpen, AlertTriangle, CheckCircle2, RotateCcw, Filter, Search, Tag, Clock, Edit3, Save, ChevronDown, ChevronUp, ArrowRight, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
const getOptionText = (option) => typeof option === 'string'
    ? option
    : option?.text || option?.optionText || option?.label || option?.value || '';
const ERROR_TAG_CONFIG = {
    conceptual_gap: {
        label: 'Conceptual Gap',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
        desc: 'Core rule or formula was unclear or forgotten'
    },
    calculation_slip: {
        label: 'Calculation Slip',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        desc: 'Arithmetic or unit conversion error under pressure'
    },
    time_rush: {
        label: 'Time Rush',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800',
        desc: 'Guessed or hurried due to running clock'
    },
    misread_question: {
        label: 'Misread Question',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        desc: 'Missed "NOT", units, or condition in statement'
    },
    silly_mistake: {
        label: 'Silly Mistake',
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-300 dark:border-slate-700',
        desc: 'Clicked wrong option despite knowing right answer'
    }
};
export const MistakeNotebookPage = () => {
    const { mistakes, updateMistakeNote, updateMistakeTag, toggleMistakeMastered, recordRetestResult } = useAppStore();
    const [selectedTag, setSelectedTag] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    // Note editing state
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [noteDraft, setNoteDraft] = useState('');
    // Expanded explanations state
    const [expandedIds, setExpandedIds] = useState(new Set(['m-1']));
    // Re-Test Modal State
    const [isRetestModalOpen, setIsRetestModalOpen] = useState(false);
    const [retestIndex, setRetestIndex] = useState(0);
    const [retestSelectedOption, setRetestSelectedOption] = useState(null);
    const [retestSubmitted, setRetestSubmitted] = useState(false);
    const [retestResults, setRetestResults] = useState([]);
    const subjects = Array.from(new Set(mistakes.map(m => m.subjectName)));
    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    const handleStartEditingNote = (entry) => {
        setEditingNoteId(entry.id);
        setNoteDraft(entry.userNotes || '');
    };
    const handleSaveNote = (id) => {
        updateMistakeNote(id, noteDraft);
        setEditingNoteId(null);
    };
    // Filtered list
    const filteredMistakes = mistakes.filter(m => {
        if (selectedTag !== 'all' && m.errorTag !== selectedTag)
            return false;
        if (selectedSubject !== 'all' && m.subjectName !== selectedSubject)
            return false;
        if (filterStatus === 'pending' && m.isMastered)
            return false;
        if (filterStatus === 'mastered' && !m.isMastered)
            return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (m.questionText.toLowerCase().includes(q) ||
                m.topicName.toLowerCase().includes(q) ||
                m.subjectName.toLowerCase().includes(q) ||
                (m.userNotes && m.userNotes.toLowerCase().includes(q)));
        }
        return true;
    });
    const totalCount = mistakes.length;
    const pendingCount = mistakes.filter(m => !m.isMastered).length;
    const masteredCount = mistakes.filter(m => m.isMastered).length;
    const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
    // Unmastered mistakes for re-test
    const retestQueue = mistakes.filter(m => !m.isMastered);
    const startRetest = () => {
        if (retestQueue.length === 0)
            return;
        setRetestIndex(0);
        setRetestSelectedOption(null);
        setRetestSubmitted(false);
        setRetestResults([]);
        setIsRetestModalOpen(true);
    };
    const handleRetestSubmit = () => {
        if (!retestSelectedOption)
            return;
        const currentQ = retestQueue[retestIndex];
        const isCorrect = retestSelectedOption === currentQ.correctOptionId;
        setRetestSubmitted(true);
        setRetestResults(prev => [...prev, { id: currentQ.id, isCorrect }]);
        recordRetestResult(currentQ.id, isCorrect);
    };
    const handleNextRetestQuestion = () => {
        if (retestIndex < retestQueue.length - 1) {
            setRetestIndex(prev => prev + 1);
            setRetestSelectedOption(null);
            setRetestSubmitted(false);
        }
        else {
            // Completed drill
        }
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800", children: [_jsxs("div", { children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-[#1e293b] dark:text-cyan-400 text-xs font-semibold mb-2 border border-indigo-100 dark:border-[#2a3350]", children: [_jsx(BookOpen, { className: "w-3.5 h-3.5" }), "Active Error Tracking & Revision Loop"] }), _jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display", children: "Intelligent Mistake Notebook" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl", children: "Automatically categorizes your wrong answers from tests and quizzes. Tag root causes, annotate solutions, and clear them via 1-click Re-Tests." })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("button", { onClick: startRetest, disabled: retestQueue.length === 0, className: `px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition ${retestQueue.length > 0
                                ? 'bg-[#4f46e5] hover:bg-indigo-600 text-white cursor-pointer shadow-md'
                                 : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'}`, children: [_jsx(RotateCcw, { className: "w-4 h-4" }), "Re-Test Errors (", _jsx("span", { className: "font-mono tabular-nums", children: retestQueue.length }), " Pending)"] }) })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-[#151b2e] dark:border-[#2a3350] shadow-xs", children: [_jsx("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: "Total Logged Errors" }), _jsx("p", { className: "text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono tabular-nums", children: totalCount }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Across mock tests & practice" })] }), _jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-[#151b2e] dark:border-[#2a3350] shadow-xs", children: [_jsxs("span", { className: "text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5" }), " Pending Unmastered"] }), _jsx("p", { className: "text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 font-mono tabular-nums", children: pendingCount }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Need 2 consecutive correct re-tests" })] }), _jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-[#151b2e] dark:border-[#2a3350] shadow-xs", children: [_jsxs("span", { className: "text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Successfully Mastered"] }), _jsx("p", { className: "text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums", children: masteredCount }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Converted from weak to strong" })] }), _jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-[#151b2e] dark:border-[#2a3350] shadow-xs", children: [_jsx("span", { className: "text-xs font-semibold text-indigo-600 dark:text-indigo-400", children: "Mastery Rate" }), _jsx("div", { className: "flex items-baseline gap-2 mt-1", children: _jsxs("p", { className: "text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums", children: [masteryPercentage, "%"] }) }), _jsx("div", { className: "w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden", children: _jsx("div", { className: "bg-indigo-600 h-1.5 rounded-full", style: { width: `${masteryPercentage}%` } }) })] })] }), _jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-[#151b2e] dark:border-[#2a3350] space-y-4 shadow-xs", children: [_jsxs("div", { className: "flex flex-col lg:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "relative w-full lg:w-96", children: [_jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }), _jsx("input", { type: "text", placeholder: "Search by topic, keyword, or note...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#0b1120] dark:border-[#2a3350] dark:text-slate-100" })] }), _jsxs("div", { className: "flex items-center gap-1 bg-slate-100 dark:bg-[#0b1120] p-1 rounded-lg w-full lg:w-auto border dark:border-[#2a3350]", children: [_jsxs("button", { onClick: () => setFilterStatus('pending'), className: `px-3 py-1.5 rounded-md text-xs font-semibold transition ${filterStatus === 'pending'
                                            ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                                            : 'text-slate-600 dark:text-slate-400'}`, children: ["Unmastered (", pendingCount, ")"] }), _jsxs("button", { onClick: () => setFilterStatus('all'), className: `px-3 py-1.5 rounded-md text-xs font-semibold transition ${filterStatus === 'all'
                                            ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                                            : 'text-slate-600 dark:text-slate-400'}`, children: ["All (", totalCount, ")"] }), _jsxs("button", { onClick: () => setFilterStatus('mastered'), className: `px-3 py-1.5 rounded-md text-xs font-semibold transition ${filterStatus === 'mastered'
                                            ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                                            : 'text-slate-600 dark:text-slate-400'}`, children: ["Mastered (", masteredCount, ")"] })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs", children: [_jsxs("span", { className: "font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1", children: [_jsx(Filter, { className: "w-3 h-3" }), " Error Reason:"] }), _jsx("button", { onClick: () => setSelectedTag('all'), className: `px-2.5 py-1 rounded-md font-medium border ${selectedTag === 'all'
                                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-blue-600 dark:border-blue-600'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`, children: "All Reasons" }), Object.keys(ERROR_TAG_CONFIG).map((tagKey) => {
                                const config = ERROR_TAG_CONFIG[tagKey];
                                const isSelected = selectedTag === tagKey;
                                return (_jsx("button", { onClick: () => setSelectedTag(tagKey), className: `px-2.5 py-1 rounded-md font-medium border transition ${isSelected
                                        ? `${config.bg} ${config.text} ${config.border} font-bold ring-1 ring-blue-500`
                                        : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`, children: config.label }, tagKey));
                            }), subjects.length > 1 && (_jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsx("span", { className: "text-slate-400", children: "Subject:" }), _jsxs("select", { value: selectedSubject, onChange: (e) => setSelectedSubject(e.target.value), className: "px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300", children: [_jsx("option", { value: "all", children: "All Subjects" }), subjects.map(s => _jsx("option", { value: s, children: s }, s))] })] }))] })] }), _jsx("div", { className: "space-y-4", children: filteredMistakes.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-white border border-slate-200 rounded-2xl dark:bg-slate-900 dark:border-slate-800", children: [_jsx(CheckCircle2, { className: "w-12 h-12 text-emerald-500 mx-auto mb-3" }), _jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white", children: "No Mistakes Found In This Filter" }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1", children: "Either you haven't made errors in this category, or you've successfully mastered them through re-tests!" })] })) : (filteredMistakes.map((entry) => {
                    const isExpanded = expandedIds.has(entry.id);
                    const tagConfig = ERROR_TAG_CONFIG[entry.errorTag] || ERROR_TAG_CONFIG.conceptual_gap;
                    const isEditingNote = editingNoteId === entry.id;
                    return (_jsxs("div", { className: `p-6 rounded-2xl border transition-all shadow-xs ${entry.isMastered
                            ? 'bg-slate-50/70 border-slate-200 dark:bg-[#151b2e]/60 dark:border-[#2a3350] opacity-80'
                            : 'bg-white border-slate-200 dark:bg-[#151b2e] dark:border-[#2a3350] hover:border-indigo-400'}`, children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: "font-semibold text-slate-800 dark:text-slate-200", children: entry.subjectName }), _jsx("span", { className: "text-slate-400", children: "•" }), _jsx("span", { className: "text-slate-500 dark:text-slate-400", children: entry.topicName }), _jsx("span", { className: "px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono text-[10px] tabular-nums", children: entry.examName })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Tag, { className: "w-3.5 h-3.5 text-slate-400" }), _jsx("select", { value: entry.errorTag, onChange: (e) => updateMistakeTag(entry.id, e.target.value), className: `px-2 py-0.5 rounded text-xs font-semibold border ${tagConfig.bg} ${tagConfig.text} ${tagConfig.border}`, children: Object.keys(ERROR_TAG_CONFIG).map((t) => (_jsx("option", { value: t, children: ERROR_TAG_CONFIG[t].label }, t))) })] }), _jsxs("button", { onClick: () => toggleMistakeMastered(entry.id), className: `px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${entry.isMastered
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`, children: [_jsx(CheckCircle2, { className: `w-3.5 h-3.5 ${entry.isMastered ? 'text-emerald-600' : 'text-slate-400'}` }), entry.isMastered ? 'Mastered' : 'Mark Mastered'] })] })] }), _jsxs("div", { className: "pt-4 space-y-3", children: [_jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans", children: entry.questionText }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs", children: entry.options.map((opt) => {
                                            const isUserWrong = opt.id === entry.userSelectedOptionId && opt.id !== entry.correctOptionId;
                                            const isCorrect = opt.id === entry.correctOptionId;
                                            let style = 'bg-slate-50 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                                            if (isUserWrong) {
                                                style = 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200 font-semibold';
                                            }
                                            else if (isCorrect) {
                                                style = 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200 font-semibold';
                                            }
                                            return (_jsxs("div", { className: `p-2.5 rounded-lg border flex items-center justify-between ${style}`, children: [_jsx("span", { children: getOptionText(opt) }), isUserWrong && _jsx("span", { className: "text-[10px] text-rose-600 font-bold", children: "✕ Your Answer" }), isCorrect && _jsx("span", { className: "text-[10px] text-emerald-600 font-bold", children: "✓ Correct Answer" })] }, opt.id));
                                        }) })] }), _jsxs("div", { className: "mt-4 pt-3 border-t border-slate-100 dark:border-slate-800", children: [_jsx("button", { onClick: () => toggleExpand(entry.id), className: "text-xs font-bold text-[#4f46e5] dark:text-[#818cf8] hover:underline flex items-center gap-1", children: isExpanded ? (_jsxs(_Fragment, { children: ["Hide Step-by-Step Solution & Trap Walkthrough ", _jsx(ChevronUp, { className: "w-3.5 h-3.5" })] })) : (_jsxs(_Fragment, { children: ["Show Step-by-Step Solution & Trap Walkthrough ", _jsx(ChevronDown, { className: "w-3.5 h-3.5" })] })) }), isExpanded && (_jsxs("div", { className: "mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-[#2a3350] text-xs space-y-2", children: [_jsx("p", { className: "font-bold text-slate-800 dark:text-slate-200", children: "Solution & Formula Breakdown:" }), _jsx("p", { className: "text-slate-700 dark:text-slate-300 leading-relaxed", children: entry.explanation })] }))] }), _jsxs("div", { className: "mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs", children: [_jsx("div", { className: "flex-1", children: isEditingNote ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: noteDraft, onChange: (e) => setNoteDraft(e.target.value), placeholder: "Write your personal shortcut, mistake trigger, or memory rule...", className: "w-full p-2.5 rounded-lg bg-white border border-blue-400 text-xs text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-white", rows: 2 }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => handleSaveNote(entry.id), className: "px-3 py-1 rounded bg-blue-600 text-white font-semibold flex items-center gap-1", children: [_jsx(Save, { className: "w-3 h-3" }), " Save Note"] }), _jsx("button", { onClick: () => setEditingNoteId(null), className: "px-3 py-1 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-semibold", children: "Cancel" })] })] })) : (_jsxs("div", { className: "flex items-start gap-2 text-slate-600 dark:text-slate-400", children: [_jsx(Edit3, { className: "w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" }), _jsx("span", { className: "italic", children: entry.userNotes ? `"${entry.userNotes}"` : 'No personal note added yet.' }), _jsx("button", { onClick: () => handleStartEditingNote(entry), className: "text-blue-600 dark:text-blue-400 hover:underline font-semibold ml-2 shrink-0", children: entry.userNotes ? 'Edit' : '+ Add Note' })] })) }), _jsxs("div", { className: "text-[11px] text-slate-400 flex items-center gap-2 shrink-0", children: [_jsx(Clock, { className: "w-3 h-3" }), _jsxs("span", { children: ["Attempts: ", entry.attemptCount, " \u2022 Re-test wins: ", entry.retestSuccessCount] })] })] })] }, entry.id));
                })) }), isRetestModalOpen && retestQueue.length > 0 && (_jsx("div", { className: "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-2xl bg-white dark:bg-[#151b2e] border border-slate-200 dark:border-[#2a3350] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans", children: [_jsxs("div", { className: "p-4 bg-[#4f46e5] text-white flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), _jsx("span", { className: "font-bold text-sm font-display", children: "Mistake Re-Test Sprint" }), _jsxs("span", { className: "px-2 py-0.5 rounded bg-indigo-700 text-xs font-semibold font-mono tabular-nums", children: ["Question ", retestIndex + 1, " of ", retestQueue.length] })] }), _jsx("button", { onClick: () => setIsRetestModalOpen(false), className: "text-white/80 hover:text-white cursor-pointer", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-6 overflow-y-auto space-y-5 flex-1", children: retestIndex < retestQueue.length ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [_jsxs("span", { children: [retestQueue[retestIndex].subjectName, " • ", retestQueue[retestIndex].topicName] }), _jsxs("span", { className: "font-mono text-amber-600 dark:text-amber-400 font-bold", children: ["Past Error: ", ERROR_TAG_CONFIG[retestQueue[retestIndex].errorTag]?.label] })] }), _jsx("p", { className: "text-base font-semibold text-slate-900 dark:text-white leading-relaxed font-sans", children: retestQueue[retestIndex].questionText }), _jsx("div", { className: "space-y-2 pt-2", children: retestQueue[retestIndex].options.map((opt) => {
                                            const isSelected = retestSelectedOption === opt.id;
                                            const isCorrect = opt.id === retestQueue[retestIndex].correctOptionId;
                                            let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700';
                                            if (retestSubmitted) {
                                                if (isCorrect) {
                                                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold';
                                                }
                                                else if (isSelected && !isCorrect) {
                                                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 font-bold';
                                                }
                                            }
                                            else if (isSelected) {
                                                btnStyle = 'border-[#4f46e5] bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:border-indigo-500 dark:text-indigo-200 font-bold';
                                            }
                                            return (_jsxs("button", { disabled: retestSubmitted, onClick: () => setRetestSelectedOption(opt.id), className: `w-full p-3.5 rounded-xl border text-left text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`, children: [_jsx("span", { children: getOptionText(opt) }), retestSubmitted && isCorrect && _jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600" }), retestSubmitted && isSelected && !isCorrect && _jsx(X, { className: "w-4 h-4 text-rose-600" })] }, opt.id));
                                        }) }), retestSubmitted && (_jsxs("div", { className: "p-4 rounded-xl bg-slate-100 dark:bg-[#0b1120] text-xs space-y-1.5 border border-slate-200 dark:border-[#2a3350]", children: [_jsx("p", { className: "font-bold text-slate-800 dark:text-slate-200", children: "Solution Recap:" }), _jsx("p", { className: "text-slate-700 dark:text-slate-300", children: retestQueue[retestIndex].explanation })] }))] })) : (_jsxs("div", { className: "text-center py-8 space-y-3", children: [_jsx(CheckCircle2, { className: "w-12 h-12 text-emerald-500 mx-auto" }), _jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white font-display", children: "Re-Test Drill Completed!" }), _jsxs("p", { className: "text-xs text-slate-500 max-w-xs mx-auto font-mono tabular-nums", children: ["You practiced ", retestResults.length, " questions. ", retestResults.filter(r => r.isCorrect).length, " were answered correctly!"] })] })) }), _jsxs("div", { className: "p-4 bg-slate-50 dark:bg-[#0b1120] border-t border-slate-200 dark:border-[#2a3350] flex items-center justify-between", children: [_jsx("button", { onClick: () => setIsRetestModalOpen(false), className: "px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 cursor-pointer", children: "Close Drill" }), !retestSubmitted ? (_jsx("button", { disabled: !retestSelectedOption, onClick: handleRetestSubmit, className: `px-5 py-2 rounded-lg text-xs font-bold transition ${retestSelectedOption
                                        ? 'bg-[#4f46e5] text-white hover:bg-indigo-600 shadow-sm cursor-pointer'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'}`, children: "Confirm Answer" })) : (_jsxs("button", { onClick: handleNextRetestQuestion, className: "px-5 py-2 rounded-lg bg-[#4f46e5] text-white text-xs font-bold hover:bg-indigo-600 shadow-sm flex items-center gap-1.5 cursor-pointer", children: [retestIndex < retestQueue.length - 1 ? 'Next Question' : 'Finish Drill', " ", _jsx(ArrowRight, { className: "w-3.5 h-3.5" })] }))] })] }) }))] }));
};
export default MistakeNotebookPage;

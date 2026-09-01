import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { RotateCw, CheckCircle2, Sparkles, Search, BookOpen, Clock, ArrowRight, ArrowLeft, Lightbulb, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
export const FormulaDeckPage = () => {
    const { flashcards, updateFlashcardStatus } = useAppStore();
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    // Flipped card IDs
    const [flippedIds, setFlippedIds] = useState(new Set());
    // Full-Screen Carousel Drill Mode
    const [isDrillMode, setIsDrillMode] = useState(false);
    const [drillIndex, setDrillIndex] = useState(0);
    const [drillFlipped, setDrillFlipped] = useState(false);
    const subjects = Array.from(new Set(flashcards.map(f => f.subject)));
    const toggleFlip = (id) => {
        setFlippedIds(prev => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    const handleAdvanceInterval = (id) => {
        const current = flashcards.find(f => f.id === id);
        if (!current)
            return;
        let nextInterval = 3;
        let nextStatus = 'review_needed';
        if (current.intervalStageDays === 1) {
            nextInterval = 3;
            nextStatus = 'review_needed';
        }
        else if (current.intervalStageDays === 3) {
            nextInterval = 7;
            nextStatus = 'mastered';
        }
        else if (current.intervalStageDays === 7) {
            nextInterval = 14;
            nextStatus = 'mastered';
        }
        else if (current.intervalStageDays >= 14) {
            nextInterval = 30;
            nextStatus = 'mastered';
        }
        updateFlashcardStatus(id, nextStatus, nextInterval);
    };
    const handleResetInterval = (id) => {
        updateFlashcardStatus(id, 'learning', 1);
    };
    const filteredCards = flashcards.filter(f => {
        if (selectedSubject !== 'all' && f.subject !== selectedSubject)
            return false;
        if (selectedStatus !== 'all' && f.masteryStatus !== selectedStatus)
            return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (f.title.toLowerCase().includes(q) ||
                f.formula.toLowerCase().includes(q) ||
                f.topic.toLowerCase().includes(q) ||
                f.mnemonic.toLowerCase().includes(q));
        }
        return true;
    });
    const totalCards = flashcards.length;
    const masteredCards = flashcards.filter(f => f.masteryStatus === 'mastered').length;
    const reviewNeededCards = flashcards.filter(f => f.masteryStatus === 'review_needed').length;
    const learningCards = flashcards.filter(f => f.masteryStatus === 'learning').length;
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800", children: [_jsxs("div", { children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-300 text-xs font-semibold mb-2", children: [_jsx(BookOpen, { className: "w-3.5 h-3.5" }), "Digital Memory Flashcards & Spaced Repetition Engine"] }), _jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white", children: "Interactive Formula Deck & Mnemonics" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl", children: "Master high-yield formulas, 10-second shortcuts, and constitutional memory tricks with automatic Leitner intervals (Day 1 \u2192 3 \u2192 7 \u2192 30)." })] }), _jsxs("button", { onClick: () => {
                            setDrillIndex(0);
                            setDrillFlipped(false);
                            setIsDrillMode(true);
                        }, disabled: filteredCards.length === 0, className: "px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4 fill-white" }), "Launch Flashcard Drill (", filteredCards.length, " Cards)"] })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm", children: [_jsx("span", { className: "text-xs font-semibold text-slate-500", children: "Total Formula Cards" }), _jsx("p", { className: "text-2xl font-extrabold text-slate-900 dark:text-white mt-1", children: totalCards }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Quant, Reasoning, Polity & Vocab" })] }), _jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm", children: [_jsxs("span", { className: "text-xs font-semibold text-amber-600 flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), " Stage 1: Learning (1-Day)"] }), _jsx("p", { className: "text-2xl font-extrabold text-amber-600 mt-1", children: learningCards }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Daily practice required" })] }), _jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm", children: [_jsxs("span", { className: "text-xs font-semibold text-blue-600 flex items-center gap-1", children: [_jsx(RotateCw, { className: "w-3.5 h-3.5" }), " Stage 2: Review (3-Day)"] }), _jsx("p", { className: "text-2xl font-extrabold text-blue-600 mt-1", children: reviewNeededCards }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Consolidating memory" })] }), _jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm", children: [_jsxs("span", { className: "text-xs font-semibold text-emerald-600 flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Stage 3: Mastered (7-30 Day)"] }), _jsx("p", { className: "text-2xl font-extrabold text-emerald-600 mt-1", children: masteredCards }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Long-term retention locked" })] })] }), _jsx("div", { className: "p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-3", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "relative w-full lg:w-96", children: [_jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }), _jsx("input", { type: "text", placeholder: "Search formula, mnemonic, or topic...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-1.5 w-full lg:w-auto", children: [_jsx("button", { onClick: () => setSelectedSubject('all'), className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubject === 'all'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`, children: "All Subjects" }), subjects.map((sub) => (_jsx("button", { onClick: () => setSelectedSubject(sub), className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubject === sub
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`, children: sub }, sub)))] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredCards.map((card) => {
                    const isFlipped = flippedIds.has(card.id);
                    return (_jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden hover:border-blue-300 transition-all min-h-[360px]", children: [_jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs", children: [_jsxs("span", { className: "font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]", children: [card.subject, " \u2022 ", card.chapter] }), _jsxs("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${card.masteryStatus === 'mastered'
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                            : card.masteryStatus === 'review_needed'
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'}`, children: [card.intervalStageDays, "-Day Interval"] })] }), _jsx("div", { className: "p-6 flex-1 flex flex-col justify-center space-y-4", children: !isFlipped ? (
                                /* FRONT OF CARD */
                                _jsxs("div", { className: "space-y-4 text-center", children: [_jsx("span", { className: "text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider", children: card.topic }), _jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white leading-snug", children: card.title }), _jsx("div", { className: "p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 font-mono text-xs font-bold text-blue-950 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200", children: card.formula }), _jsxs("button", { onClick: () => toggleFlip(card.id), className: "inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2", children: [_jsx(RotateCw, { className: "w-3.5 h-3.5" }), " Flip for Mnemonic & Shortcut Proof"] })] })) : (
                                /* BACK OF CARD */
                                _jsxs("div", { className: "space-y-3 text-xs", children: [_jsxs("div", { className: "p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1", children: [_jsxs("span", { className: "font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300", children: [_jsx(Lightbulb, { className: "w-3.5 h-3.5" }), " Mnemonic Memory Trigger:"] }), _jsx("p", { className: "italic font-medium", children: card.mnemonic })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "font-bold text-slate-800 dark:text-slate-200", children: "Shortcut Proof / Logic:" }), _jsx("p", { className: "text-slate-600 dark:text-slate-400 leading-relaxed", children: card.shortcutProof })] }), _jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] space-y-1 border border-slate-200 dark:border-slate-700", children: [_jsxs("p", { className: "font-semibold text-slate-800 dark:text-slate-200", children: ["Sample Exam Q: ", card.sampleQuestion] }), _jsxs("p", { className: "text-slate-600 dark:text-slate-400 font-mono text-[10px]", children: ["Sol: ", card.stepByStepSolution] })] }), _jsx("button", { onClick: () => toggleFlip(card.id), className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px] underline block text-center pt-1", children: "Flip Back" })] })) }), _jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs font-semibold", children: [_jsx("button", { onClick: () => handleResetInterval(card.id), className: "py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-400 transition text-center", children: "Need Practice (1d)" }), _jsx("button", { onClick: () => handleAdvanceInterval(card.id), className: "py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-xs text-center", children: "Got It! (+Interval)" })] })] }, card.id));
                }) }), isDrillMode && filteredCards.length > 0 && (_jsx("div", { className: "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6 flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-4 h-4 text-blue-600" }), _jsxs("span", { className: "font-bold text-slate-800 dark:text-slate-200", children: ["Card ", drillIndex + 1, " of ", filteredCards.length] })] }), _jsx("button", { onClick: () => setIsDrillMode(false), className: "text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white", children: "Exit Drill" })] }), _jsx("div", { onClick: () => setDrillFlipped(!drillFlipped), className: "p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-5 cursor-pointer min-h-[280px] flex flex-col justify-center", children: !drillFlipped ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-xs font-semibold text-blue-600 uppercase tracking-wider", children: [filteredCards[drillIndex].subject, " \u2022 ", filteredCards[drillIndex].topic] }), _jsx("h2", { className: "text-xl font-extrabold text-slate-900 dark:text-white", children: filteredCards[drillIndex].title }), _jsx("div", { className: "p-4 rounded-xl bg-blue-50 border border-blue-200 font-mono text-sm font-bold text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200", children: filteredCards[drillIndex].formula }), _jsx("p", { className: "text-xs text-slate-400 italic", children: "Click anywhere to flip and reveal mnemonic shortcut" })] })) : (_jsxs("div", { className: "space-y-4 text-left text-xs", children: [_jsxs("div", { className: "p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200", children: [_jsxs("span", { className: "font-bold flex items-center gap-1.5", children: [_jsx(Lightbulb, { className: "w-4 h-4 text-amber-500" }), " Mnemonic:"] }), _jsx("p", { className: "mt-1 font-medium", children: filteredCards[drillIndex].mnemonic })] }), _jsxs("div", { children: [_jsx("span", { className: "font-bold text-slate-800 dark:text-slate-200", children: "Explanation & Proof:" }), _jsx("p", { className: "text-slate-600 dark:text-slate-400 mt-1", children: filteredCards[drillIndex].shortcutProof })] })] })) }), _jsxs("div", { className: "flex items-center justify-between pt-2", children: [_jsxs("button", { disabled: drillIndex === 0, onClick: () => {
                                        setDrillIndex(prev => prev - 1);
                                        setDrillFlipped(false);
                                    }, className: "px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-300 disabled:opacity-30", children: [_jsx(ArrowLeft, { className: "w-4 h-4 inline mr-1" }), " Previous"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => {
                                                handleResetInterval(filteredCards[drillIndex].id);
                                                if (drillIndex < filteredCards.length - 1) {
                                                    setDrillIndex(prev => prev + 1);
                                                    setDrillFlipped(false);
                                                }
                                            }, className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold transition", children: "Need Practice" }), _jsx("button", { onClick: () => {
                                                handleAdvanceInterval(filteredCards[drillIndex].id);
                                                if (drillIndex < filteredCards.length - 1) {
                                                    setDrillIndex(prev => prev + 1);
                                                    setDrillFlipped(false);
                                                }
                                            }, className: "px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm", children: "Mastered (+Interval)" })] }), _jsxs("button", { disabled: drillIndex === filteredCards.length - 1, onClick: () => {
                                        setDrillIndex(prev => prev + 1);
                                        setDrillFlipped(false);
                                    }, className: "px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-300 disabled:opacity-30", children: ["Next ", _jsx(ArrowRight, { className: "w-4 h-4 inline ml-1" })] })] })] }) }))] }));
};
export default FormulaDeckPage;

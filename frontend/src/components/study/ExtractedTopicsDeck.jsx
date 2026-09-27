import React, { useState } from 'react';
import { Zap, Check, Copy, Layers, Clock, ArrowUpRight, Search, FileText, CheckCircle2, Circle } from 'lucide-react';

const cleanTopicTitle = (text) => {
    if (!text) return '';
    return String(text)
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/^[\d]+[\.\)]\s*/, '')
        .replace(/^[-•*]\s*/, '')
        .trim();
};

export const ExtractedTopicsDeck = ({ topics, noteTitle = 'Uploaded Study Notes', onPracticeTopic }) => {
    const [copiedId, setCopiedId] = useState(null);
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [checkedTopicIds, setCheckedTopicIds] = useState({});

    if (!topics || topics.length === 0) {
        return (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Extracted Topics Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Generate a study plan from your uploaded notes to see an organized breakdown of chapters, key formulas, and exam cheat-sheets here.
                </p>
            </div>
        );
    }

    const handleToggleTopicCheck = (id) => {
        setCheckedTopicIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const completedCount = Object.values(checkedTopicIds).filter(Boolean).length;
    const progressPct = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

    const filtered = topics.filter(t => {
        const matchesDiff = filterDifficulty === 'all' || t.difficulty === filterDifficulty;
        const matchesSearch = t.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subjectCategory.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDiff && matchesSearch;
    });

    const handleCopyFormulas = (topic) => {
        const textToCopy = `Topic: ${topic.topicName}\nSubject: ${topic.subjectCategory}\nFormulas & Shortcuts:\n${topic.keyFormulasOrHacks.map(f => `• ${f}`).join('\n')}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(topic.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Checklist Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
                            AI Notes Extraction
                        </span>
                        <span className="text-xs text-slate-500">
                            • {topics.length} Chapters Extracted
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {completedCount}/{topics.length} Checked ({progressPct}%)
                        </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {noteTitle} - Topics & Formula Cheat Deck
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search topics..."
                            className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
                        />
                    </div>

                    <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
                        {['all', 'hard', 'medium', 'easy'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setFilterDifficulty(diff)}
                                className={`px-2.5 py-1 rounded-lg font-bold capitalize text-[11px] transition ${
                                    filterDifficulty === diff
                                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Topic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((topic) => {
                    const isCopied = copiedId === topic.id;
                    const isChecked = !!checkedTopicIds[topic.id];

                    const diffBadgeClass = {
                        easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
                        medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
                        hard: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }[topic.difficulty || 'medium'];

                    return (
                        <div
                            key={topic.id}
                            className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                                isChecked
                                    ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-80'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-purple-300 dark:hover:border-purple-800'
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleTopicCheck(topic.id)}
                                            className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition shrink-0"
                                            title="Mark chapter as completed"
                                        >
                                            {isChecked ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                            )}
                                        </button>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                                                {topic.subjectCategory}
                                            </span>
                                            <h4 className={`text-sm font-extrabold mt-0.5 ${
                                                isChecked ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                                            }`}>
                                                {cleanTopicTitle(topic.topicName)}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${diffBadgeClass}`}>
                                            {topic.difficulty}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {topic.estimatedHours}h
                                        </span>
                                    </div>
                                </div>

                                {topic.coreConcepts && topic.coreConcepts.length > 0 && (
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 space-y-1">
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                            <Layers className="w-3 h-3 text-indigo-500" /> Core Concepts:
                                        </span>
                                        <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 pl-3 list-disc">
                                            {topic.coreConcepts.map((concept, cIdx) => (
                                                <li key={cIdx}>{concept}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {topic.keyFormulasOrHacks && topic.keyFormulasOrHacks.length > 0 && (
                                    <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                                                <Zap className="w-3.5 h-3.5 text-amber-500" /> Formulas & Speed Hacks:
                                            </span>
                                            <button
                                                onClick={() => handleCopyFormulas(topic)}
                                                className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                                            >
                                                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                {isCopied ? 'Copied' : 'Copy Formulas'}
                                            </button>
                                        </div>
                                        <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1 font-mono">
                                            {topic.keyFormulasOrHacks.map((formula, fIdx) => (
                                                <li key={fIdx} className="bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded border border-amber-200/40 dark:border-amber-900/30">
                                                    {formula}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">
                                    Included in daily timetable
                                </span>
                                {onPracticeTopic && (
                                    <button
                                        onClick={() => onPracticeTopic(topic.topicName)}
                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                    >
                                        Practice Questions <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

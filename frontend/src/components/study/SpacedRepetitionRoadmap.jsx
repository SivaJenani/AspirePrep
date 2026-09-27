import React, { useState } from 'react';
import { RotateCcw, Brain, Award, Zap, CheckCircle2, Circle, Play, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SpacedRepetitionRoadmap = ({ spacedPlan, facultyTips }) => {
    const [checkedItems, setCheckedItems] = useState({});

    const handleToggleCheck = (checkpointIdx, topicIdx) => {
        const key = `${checkpointIdx}_${topicIdx}`;
        setCheckedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Calculate total recall checklist items and completed ones
    let totalItems = 0;
    let completedItems = 0;

    (spacedPlan || []).forEach((slot, cIdx) => {
        (slot.topicsToRecall || []).forEach((_, tIdx) => {
            totalItems++;
            if (checkedItems[`${cIdx}_${tIdx}`]) {
                completedItems++;
            }
        });
    });

    const retentionScore = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                    <Brain className="w-4 h-4 text-purple-300" />
                    <span>Ebbinghaus Forgetting Curve Countermeasures</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    Spaced Repetition & Recall Checklist
                </h3>
                <p className="text-xs sm:text-sm text-purple-100 max-w-2xl">
                    By systematically reviewing formulas and concepts at Day 1, Day 3, and Day 7 intervals, your long-term memory retention jumps from 20% to over 85% on exam day.
                </p>

                {totalItems > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Retention Checklist: <strong>{completedItems}/{totalItems} Completed ({retentionScore}%)</strong></span>
                        </div>
                        {retentionScore >= 70 && (
                            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                                <Flame className="w-4 h-4 text-amber-400" />
                                <span>High Long-Term Memory Consolidation</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Scheduled Checkpoints with Interactive Checklist */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Active Recall Checklist & Scheduled Checkpoints</span>
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Check off topics as you perform rapid flash recall
                    </span>
                </div>

                {(!spacedPlan || spacedPlan.length === 0) ? (
                    <div className="text-xs text-slate-500 py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        Review milestones will be calculated automatically when you generate your timetable from notes or syllabus.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {spacedPlan.map((slot, cIdx) => {
                            const slotCompleted = (slot.topicsToRecall || []).every((_, tIdx) => checkedItems[`${cIdx}_${tIdx}`]);

                            return (
                                <div
                                    key={cIdx}
                                    className={`p-4 rounded-xl border transition-all ${
                                        slotCompleted
                                            ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                                            : 'border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20'
                                    } space-y-3`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                                            slotCompleted ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                                        }`}>
                                            Review Checkpoint: Day {slot.reviewDay}
                                        </span>
                                        <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                                            <Zap className="w-3 h-3 text-amber-500" /> {slot.technique}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                                            Topic Recall Checklist:
                                        </span>
                                        <div className="space-y-1.5">
                                            {slot.topicsToRecall.map((topic, tIdx) => {
                                                const isChecked = !!checkedItems[`${cIdx}_${tIdx}`];
                                                return (
                                                    <div
                                                        key={tIdx}
                                                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition ${
                                                            isChecked
                                                                ? 'bg-white/80 dark:bg-slate-900 border-emerald-300 dark:border-emerald-800'
                                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                                        }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleCheck(cIdx, tIdx)}
                                                            className="flex items-center gap-2.5 text-left flex-1 text-xs"
                                                        >
                                                            {isChecked ? (
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                                                            )}
                                                            <span className={`font-semibold ${
                                                                isChecked ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'
                                                            }`}>
                                                                {topic}
                                                            </span>
                                                        </button>

                                                        <Link
                                                            to={`/practice?mode=topic&search=${encodeURIComponent(topic)}`}
                                                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 shrink-0 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-md"
                                                        >
                                                            <Play className="w-2.5 h-2.5 fill-indigo-600" />
                                                            <span>Recall Drill</span>
                                                        </Link>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Faculty Tips */}
            {facultyTips && facultyTips.length > 0 && (
                <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-3">
                    <h4 className="text-sm font-extrabold text-amber-950 dark:text-amber-300 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Faculty Exam & Scoring Strategy Tips</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-amber-900 dark:text-amber-200 pl-4 list-disc">
                        {facultyTips.map((tip, idx) => (
                            <li key={idx} className="leading-relaxed">{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

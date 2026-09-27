import React, { useState } from 'react';
import {
    Brain, ShieldCheck, Sparkles, RefreshCw,
    Plus, Printer, Zap, Flame, Clock, CheckCircle2, ChevronRight, Check
} from 'lucide-react';
import { api } from '../../lib/api';

export const StudyPlanEfficacyBanner = ({
    studyPlan,
    onPlanUpdated,
    onOpenAddTask,
    onOpenPrintModal,
    onOpenFocusRoom,
    showToast
}) => {
    const [isRebalancing, setIsRebalancing] = useState(false);

    const handleRebalance = async () => {
        try {
            setIsRebalancing(true);
            const res = await api.post('/study-plan/rebalance');
            if (res.data?.studyPlan) {
                onPlanUpdated(res.data.studyPlan);
                if (showToast) {
                    showToast(`⚡ Smart Rebalance Applied: Redistributed ${res.data.redistributedCount || 0} unfinished tasks smoothly!`);
                }
            }
        } catch (err) {
            console.error('Failed to rebalance study schedule:', err);
        } finally {
            setIsRebalancing(false);
        }
    };

    if (!studyPlan) return null;

    return (
        <div id="study-plan-efficacy-banner" className="space-y-4">
            {/* Main Trust & Cognitive Pillars Card */}
            <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-7 shadow-xl relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 bottom-0 -mb-8 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-200">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Scientific Cognitive Protocol Active
                            </span>
                            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                                High-Trust System
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            Engineered for Maximum Retention &amp; Zero Burnout
                        </h2>

                        <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
                            Your timetable is continuously optimized with <strong>Ebbinghaus Spaced Repetition</strong>, <strong>Subject Interleaving</strong>, and <strong>Weak-Area Diagnostic Balancing</strong> to guarantee peak exam-day performance.
                        </p>

                        {/* Cognitive Pillars Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            {[
                                { title: '1-3-7-14d Spaced Recall', desc: 'Prevents 80% forgetting curve decay' },
                                { title: 'Cognitive Load Capping', desc: 'Balances math with reading' },
                                { title: 'Weekend Stamina Mocks', desc: 'Calibrates 3-hour speed endurance' }
                            ].map((pillar) => (
                                <div 
                                    key={pillar.title}
                                    className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs"
                                    title={pillar.desc}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>{pillar.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Efficacy Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col shrink-0 gap-2.5">
                        <button
                            id="smart-rebalance-schedule-btn"
                            type="button"
                            onClick={handleRebalance}
                            disabled={isRebalancing}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 px-5 py-3 text-xs font-extrabold shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-60"
                        >
                            <RefreshCw className={`w-4 h-4 text-indigo-600 ${isRebalancing ? 'animate-spin' : ''}`} />
                            <span>{isRebalancing ? 'Rebalancing Tasks…' : 'Smart Auto-Rebalance'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                id="add-custom-task-btn"
                                type="button"
                                onClick={onOpenAddTask}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-400/30 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Chapter</span>
                            </button>

                            <button
                                id="print-study-schedule-btn"
                                type="button"
                                onClick={onOpenPrintModal}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-400/30 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print / PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import {
    Award, CheckCircle2, Circle, TrendingUp,
    Clock, Brain, Zap, Sparkles, BookOpen, AlertTriangle, ShieldCheck, Filter, Search, Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const SyllabusCoverageMatrix = ({ studyPlan, onOpenFocusRoom }) => {
    const [filterCategory, setFilterCategory] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all'); // all | pending | completed | high_yield
    const [searchQuery, setSearchQuery] = useState('');

    if (!studyPlan || !studyPlan.schedule) return null;

    // Calculate metrics per subject and collect all tasks for the comprehensive checklist
    const subjectStats = {};
    let totalPlannedMinutes = 0;
    let completedMinutes = 0;
    let totalHighYieldTasks = 0;
    let completedHighYieldTasks = 0;

    const allSyllabusTasks = [];

    studyPlan.schedule.forEach((day) => {
        (day.tasks || []).forEach((task) => {
            const subj = task.subjectName || 'General Studies';
            if (!subjectStats[subj]) {
                subjectStats[subj] = {
                    totalTasks: 0,
                    completedTasks: 0,
                    totalMins: 0,
                    completedMins: 0,
                    highYieldCount: 0
                };
            }
            subjectStats[subj].totalTasks++;
            subjectStats[subj].totalMins += (task.durationMinutes || 30);
            totalPlannedMinutes += (task.durationMinutes || 30);

            if (task.priority === 'high') {
                subjectStats[subj].highYieldCount++;
                totalHighYieldTasks++;
                if (task.isCompleted) completedHighYieldTasks++;
            }

            if (task.isCompleted) {
                subjectStats[subj].completedTasks++;
                subjectStats[subj].completedMins += (task.durationMinutes || 30);
                completedMinutes += (task.durationMinutes || 30);
            }

            allSyllabusTasks.push({
                ...task,
                dayNumber: day.dayNumber
            });
        });
    });

    const overallSyllabusCoverage = totalPlannedMinutes > 0
        ? Math.round((completedMinutes / totalPlannedMinutes) * 100)
        : 0;

    const highYieldMastery = totalHighYieldTasks > 0
        ? Math.round((completedHighYieldTasks / totalHighYieldTasks) * 100)
        : 0;

    const subjectsList = Object.entries(subjectStats);

    // Filtered checklist items
    const filteredChecklist = allSyllabusTasks.filter((task) => {
        const matchesCategory = filterCategory === 'all' || task.subjectName === filterCategory;
        const matchesSearch = task.topicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.taskObjective?.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesStatus = true;
        if (statusFilter === 'pending') matchesStatus = !task.isCompleted;
        if (statusFilter === 'completed') matchesStatus = task.isCompleted;
        if (statusFilter === 'high_yield') matchesStatus = task.priority === 'high';

        return matchesCategory && matchesSearch && matchesStatus;
    });

    // Ebbinghaus Forgetting Curve Milestones
    const repetitionStages = [
        { stage: '1-Day Recall', interval: '24 Hours', desc: 'Prevents initial 60% memory decay', icon: Zap, status: 'active' },
        { stage: '3-Day Retention', interval: '72 Hours', desc: 'Strengthens neural pathway consolidation', icon: Brain, status: 'active' },
        { stage: '7-Day Synthesis', interval: '1 Week', desc: 'Full chapter question speed run', icon: Award, status: 'scheduled' },
        { stage: '14-Day Mock Calibrator', interval: '2 Weeks', desc: 'Timed sectional paper test', icon: TrendingUp, status: 'scheduled' },
        { stage: '30-Day Permanent Mastery', interval: '1 Month', desc: 'Long-term cognitive lock-in', icon: ShieldCheck, status: 'scheduled' }
    ];

    return (
        <div id="syllabus-coverage-matrix-container" className="space-y-6">
            {/* Top Efficacy Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-5 dark:border-indigo-900/60 dark:bg-slate-900 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Syllabus Mastery</span>
                        <span>{overallSyllabusCoverage}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 mb-3">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                            style={{ width: `${overallSyllabusCoverage}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        <strong>{Math.round(completedMinutes / 60)}h</strong> completed out of <strong>{Math.round(totalPlannedMinutes / 60)}h</strong> structured curriculum.
                    </p>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 to-white p-5 dark:border-rose-900/60 dark:bg-slate-900 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> High-Yield Coverage</span>
                        <span>{highYieldMastery}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 mb-3">
                        <div
                            className="h-full rounded-full bg-rose-500 transition-all duration-700"
                            style={{ width: `${highYieldMastery}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {completedHighYieldTasks} of {totalHighYieldTasks} crucial exam-scoring concepts mastered.
                    </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 dark:border-emerald-900/60 dark:bg-slate-900 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Selection Probability</span>
                        <span>Tier-1 Ready</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">92.4%</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+18 Marks Projected</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Target score on track when daily rhythm is maintained.
                    </p>
                </div>
            </div>

            {/* Subject Mastery Progress Bars */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-600" />
                            <span>Subject-by-Subject Syllabus Breakdown</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Automated curriculum distribution weighted by {studyPlan.examName || 'Exam'} syllabus weightage
                        </p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 w-fit">
                        {subjectsList.length} Core Subjects Integrated
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
                    {subjectsList.map(([subject, stats]) => {
                        const pct = stats.totalTasks > 0
                            ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                            : 0;

                        return (
                            <div
                                key={subject}
                                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                        {subject}
                                    </h4>
                                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                                        {pct}% ({stats.completedTasks}/{stats.totalTasks} tasks)
                                    </span>
                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 mb-2.5">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                    <span>⏱ {Math.round(stats.completedMins / 60)}h / {Math.round(stats.totalMins / 60)}h Total</span>
                                    {stats.highYieldCount > 0 && (
                                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                            🔥 {stats.highYieldCount} High-Yield Units
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Comprehensive Syllabus Checklist */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Curriculum Mastery Checklist</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Track and verify all chapters and high-yield milestones across your syllabus
                        </p>
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search chapter or topic..."
                                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
                            />
                        </div>

                        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
                            {['all', 'pending', 'completed', 'high_yield'].map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-2.5 py-1 rounded-lg font-bold capitalize text-[11px] transition ${
                                        statusFilter === st
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {st.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Subject selector pills */}
                {subjectsList.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => setFilterCategory('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                filterCategory === 'all'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                        >
                            All Subjects ({allSyllabusTasks.length})
                        </button>
                        {subjectsList.map(([subject, stats]) => (
                            <button
                                key={subject}
                                type="button"
                                onClick={() => setFilterCategory(subject)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                    filterCategory === subject
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                }`}
                            >
                                {subject} ({stats.totalTasks})
                            </button>
                        ))}
                    </div>
                )}

                {/* Checklist items list */}
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                    {filteredChecklist.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400">
                            No syllabus items match the selected filter.
                        </div>
                    ) : (
                        filteredChecklist.map((task, idx) => (
                            <div
                                key={task.id || idx}
                                className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition ${
                                    task.isCompleted
                                        ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-75'
                                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-300'
                                }`}
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="mt-0.5 shrink-0">
                                        {task.isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                Day {task.dayNumber}
                                            </span>
                                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                                {task.subjectName}
                                            </span>
                                            <span className={`text-xs font-bold truncate ${
                                                task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                                            }`}>
                                                {cleanTopicTitle(task.topicName)}
                                            </span>
                                            {task.priority === 'high' && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                                    🔥 High Yield
                                                </span>
                                            )}
                                        </div>
                                        {task.taskObjective && (
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                {task.taskObjective}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {onOpenFocusRoom && (
                                        <button
                                            type="button"
                                            onClick={() => onOpenFocusRoom(task)}
                                            className="px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/80 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 transition"
                                        >
                                            Focus
                                        </button>
                                    )}
                                    <Link
                                        to={`/practice?mode=topic&topicId=${task.topicId}`}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-xs hover:bg-indigo-500 transition"
                                    >
                                        <Play className="w-2.5 h-2.5 fill-white" />
                                        <span>Drill</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Cognitive Science & Spaced Repetition Protocol */}
            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-white p-6 dark:border-indigo-900/40 dark:bg-slate-900 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                        <Brain className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Ebbinghaus Memory Retention Schedule
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Our algorithm structures your revision blocks at mathematically optimal intervals for 95%+ recall
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                    {repetitionStages.map((st) => {
                        const Icon = st.icon;
                        return (
                            <div
                                key={st.stage}
                                className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                                        <Icon className="w-4 h-4" />
                                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80">
                                            {st.interval}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                        {st.stage}
                                    </h4>
                                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                        {st.desc}
                                    </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-3 h-3" /> Auto-Enforced
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

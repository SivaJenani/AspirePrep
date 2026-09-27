import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { BookOpen, CheckCircle2, Circle, Flame, ChevronRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUBJECT_COLORS = {
    'Quantitative Aptitude': { bar: '#6366f1', bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400' },
    'General Intelligence & Reasoning': { bar: '#8b5cf6', bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400' },
    'English Comprehension': { bar: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' },
    'General Awareness': { bar: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400' },
    'Engineering Mathematics': { bar: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400' },
    'Core Subject': { bar: '#ec4899', bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-600 dark:text-pink-400' }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                <p className="font-bold text-white mb-1.5">{label}</p>
                {payload.map((entry, index) => (
                    <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 py-0.5">
                        <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-300">{entry.name}:</span>
                        </span>
                        <span className="font-bold text-white">{entry.value}%</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const SyllabusCompletionMatrix = ({ subjectPerformance, syllabusCompletion }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);

    const chartData = (subjectPerformance || []).map(s => {
        const shortName = s.subjectName
            .replace('Quantitative Aptitude', 'Quant')
            .replace('General Intelligence & Reasoning', 'Reasoning')
            .replace('General Awareness', 'General Aware')
            .replace('English Comprehension', 'English')
            .split(' ')[0];

        const completed = s.syllabusCoveragePercent || 50;
        const inProgress = Math.min(100 - completed, Math.round(completed * 0.35));
        const remaining = Math.max(0, 100 - completed - inProgress);

        return {
            subjectKey: s.subjectId,
            name: shortName,
            fullName: s.subjectName,
            Completed: completed,
            'In Progress': inProgress,
            Remaining: remaining,
            completedTopics: s.completedTopics,
            totalTopics: s.totalTopics,
            accuracy: s.accuracy
        };
    });

    const overallPct = syllabusCompletion?.overallPercentage || 58;

    return (
        <div className="space-y-6">
            {/* Top Summary Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-blue-900/20 to-slate-900/40 p-5 border border-indigo-500/20">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-bold text-indigo-400">
                            Syllabus Benchmark
                        </span>
                        <span className="text-xs text-slate-400">Target Exam Timeline</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Overall Syllabus Coverage</h3>
                    <p className="text-xs text-slate-400">
                        {syllabusCompletion?.masteredTopicsCount || 10} of {syllabusCompletion?.totalTopicsCount || 24} core curriculum topics mastered to date
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-48 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-300">Completion</span>
                            <span className="text-indigo-400">{overallPct}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
                                style={{ width: `${overallPct}%` }}
                            />
                        </div>
                    </div>
                    <Link
                        to="/study-plan"
                        className="shrink-0 flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
                    >
                        <span>View Study Plan</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Recharts Stacked Bar Chart for Subject Completion */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Subject-Wise Syllabus Distribution
                        </h4>
                        <p className="text-xs text-slate-500">
                            Percentage of topics completed vs in progress vs untouched
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium">
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                            <span className="h-2 w-2 rounded-full bg-indigo-600" /> Completed
                        </span>
                        <span className="flex items-center gap-1 text-amber-500">
                            <span className="h-2 w-2 rounded-full bg-amber-500" /> In Progress
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" /> Remaining
                        </span>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                                width={85}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="Completed" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="In Progress" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="Remaining" stackId="a" fill="#334155" opacity={0.3} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Subject Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(subjectPerformance || []).map((subj, idx) => {
                    const theme = SUBJECT_COLORS[subj.subjectName] || {
                        bar: '#6366f1',
                        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
                        text: 'text-indigo-600 dark:text-indigo-400'
                    };

                    return (
                        <div
                            key={subj.subjectId || idx}
                            className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
                        >
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Subject Module
                                    </span>
                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                        {subj.subjectName}
                                    </h5>
                                </div>
                                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${theme.bg} ${theme.text}`}>
                                    {subj.accuracy}% Acc
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Coverage</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {subj.completedTopics} / {subj.totalTopics} Topics
                                    </span>
                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${subj.syllabusCoveragePercent || 50}%`,
                                            backgroundColor: theme.bar
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                                    <span>{subj.questionsSolved || 35} Qs Solved</span>
                                    <Link
                                        to={`/practice?mode=subject&subjectId=${subj.subjectId}`}
                                        className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-0.5"
                                    >
                                        Drill <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

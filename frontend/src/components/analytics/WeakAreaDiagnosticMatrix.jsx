import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';
import {
    AlertTriangle,
    Zap,
    Play,
    Brain,
    Clock,
    Flame,
    Filter,
    ArrowUpRight,
    ShieldAlert,
    CheckCircle2,
    RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs">
                <p className="font-bold text-white mb-1">{data.topicName}</p>
                <p className="text-slate-400 text-[11px] mb-2">{data.subjectName}</p>
                <div className="space-y-1 border-t border-slate-800 pt-1.5">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Accuracy:</span>
                        <span className="font-bold text-rose-400">{data.accuracy}%</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Avg Time / Q:</span>
                        <span className="font-bold text-amber-400">{data.averageTimeSeconds}s</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Attempts:</span>
                        <span className="font-bold text-slate-200">{data.attemptsCount} Qs</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const WeakAreaDiagnosticMatrix = ({ weakTopics }) => {
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTopics = (weakTopics || []).filter(topic => {
        if (selectedSeverity === 'critical' && topic.accuracy >= 50) return false;
        if (selectedSeverity === 'moderate' && (topic.accuracy < 50 || topic.accuracy >= 65)) return false;
        if (selectedSeverity === 'hesitation' && topic.averageTimeSeconds < 60) return false;
        if (searchQuery.trim()) {
            const term = searchQuery.toLowerCase();
            return (
                topic.topicName?.toLowerCase().includes(term) ||
                topic.subjectName?.toLowerCase().includes(term) ||
                topic.errorPattern?.toLowerCase().includes(term)
            );
        }
        return true;
    });

    const chartData = (weakTopics || []).slice(0, 8).map(t => ({
        name: t.topicName.length > 16 ? `${t.topicName.substring(0, 15)}...` : t.topicName,
        topicName: t.topicName,
        subjectName: t.subjectName,
        accuracy: t.accuracy,
        averageTimeSeconds: t.averageTimeSeconds,
        attemptsCount: t.attemptsCount,
        topicId: t.topicId
    }));

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-rose-200/80 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Automated Weak-Area Diagnostic Matrix
                            <span className="rounded-full bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 text-xs font-black text-rose-700 dark:text-rose-300">
                                {weakTopics?.length || 0} Flagged Topics
                            </span>
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Chapters where accuracy is &lt; 65% or hesitation indicates risk of negative marking penalty.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        to="/practice?mode=weak"
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 transition"
                    >
                        <Zap className="h-4 w-4" />
                        <span>Launch All-Weak AI Drill</span>
                    </Link>
                </div>
            </div>

            {/* Visual Recharts Bar Comparison for Accuracy vs Target Threshold */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                Weak Topics Accuracy vs. 65% Threshold
                            </h4>
                            <p className="text-xs text-slate-500">
                                Red bars indicate critical deficiency (&lt;50%), orange bars indicate moderate weakness
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                                <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical (&lt;50%)
                            </span>
                            <span className="flex items-center gap-1 text-amber-500">
                                <span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate (50-64%)
                            </span>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    angle={-20}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                                <Tooltip content={<CustomTooltip />} />
                                <ReferenceLine y={65} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target 65%', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />
                                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.accuracy < 50 ? '#ef4444' : '#f59e0b'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Diagnostic Breakdown Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Brain className="h-4 w-4" /> AI Cognitive Assessment
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                            Primary Bottleneck Analysis
                        </h4>
                        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                                <span className="font-bold text-rose-600 dark:text-rose-400 block mb-0.5">
                                    High Negative Marking Drag
                                </span>
                                Solving without eliminate-and-confirm strategy leads to ~12 marks lost per 100-question mock.
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                                    Speed Hesitation (&gt;65s/Q)
                                </span>
                                Quantitative formulas require mnemonic recall to reduce step-by-step calculation latency.
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/formula-deck"
                        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition"
                    >
                        <span>Review Formula Flashcards</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>

            {/* Filter Pills & Interactive Topic Matrix Table */}
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            onClick={() => setSelectedSeverity('all')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                selectedSeverity === 'all'
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                        >
                            All ({weakTopics?.length || 0})
                        </button>
                        <button
                            onClick={() => setSelectedSeverity('critical')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                selectedSeverity === 'critical'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300'
                            }`}
                        >
                            Critical &lt;50%
                        </button>
                        <button
                            onClick={() => setSelectedSeverity('moderate')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                selectedSeverity === 'moderate'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300'
                            }`}
                        >
                            Moderate (50-64%)
                        </button>
                        <button
                            onClick={() => setSelectedSeverity('hesitation')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                selectedSeverity === 'hesitation'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300'
                            }`}
                        >
                            Slow Latency (&gt;60s)
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Search weak topics or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                            <tr>
                                <th className="py-3 px-4">Topic / Chapter</th>
                                <th className="py-3 px-4">Subject</th>
                                <th className="py-3 px-4">Accuracy</th>
                                <th className="py-3 px-4">Avg Speed</th>
                                <th className="py-3 px-4">Identified Pattern</th>
                                <th className="py-3 px-4">Prescribed Intervention</th>
                                <th className="py-3 px-4 text-right">Direct Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredTopics.map((topic, idx) => {
                                const isCritical = topic.accuracy < 50;
                                return (
                                    <tr
                                        key={topic.topicId || idx}
                                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                                    >
                                        <td className="py-3.5 px-4">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {topic.topicName}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {topic.attemptsCount} attempts logged
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                                {topic.subjectName}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black ${
                                                isCritical
                                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                            }`}>
                                                {topic.accuracy}%
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                                            {topic.averageTimeSeconds}s
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                                {topic.errorPattern || (isCritical ? 'Conceptual Gap' : 'Speed Hesitation')}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 max-w-xs text-slate-600 dark:text-slate-300 text-[11px]">
                                            {topic.recommendedAction}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    to={`/practice?mode=topic&topicId=${topic.topicId}`}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 text-xs font-bold text-white shadow-xs transition"
                                                    title="Start Topic Drill"
                                                >
                                                    <Play className="h-3 w-3 fill-current" />
                                                    <span>Drill</span>
                                                </Link>
                                                <Link
                                                    to={`/ai-tutor?topic=${encodeURIComponent(topic.topicName)}`}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                                                    title="Ask AI Doubt Tutor"
                                                >
                                                    <Brain className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredTopics.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-slate-400">
                                        No weak topics matching the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

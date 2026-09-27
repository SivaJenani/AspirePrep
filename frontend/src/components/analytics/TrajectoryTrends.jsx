import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { TrendingUp, Award, Zap } from 'lucide-react';

const ScoreTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                <p className="font-bold text-white mb-1.5 border-b border-slate-800 pb-1">{label}</p>
                {payload.map((entry, idx) => (
                    <div key={`score-tt-${idx}`} className="flex items-center justify-between gap-4 py-0.5">
                        <span className="text-slate-300 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}:
                        </span>
                        <span className="font-bold text-white">
                            {entry.value} {entry.name.includes('Score') ? 'Marks' : '%'}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const TrajectoryTrends = ({ scoreTrend, accuracyTrend }) => {
    const [viewMode, setViewMode] = useState('score'); // 'score' | 'subject_accuracy'

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Performance Trajectory & Milestone Progression
                    </h4>
                    <p className="text-xs text-slate-500">
                        Historical learning curve across tests and weekly evaluation checkpoints
                    </p>
                </div>

                <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                    <button
                        onClick={() => setViewMode('score')}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                            viewMode === 'score'
                                ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                        }`}
                    >
                        Mock Test Marks
                    </button>
                    <button
                        onClick={() => setViewMode('subject_accuracy')}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                            viewMode === 'subject_accuracy'
                                ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white'
                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                        }`}
                    >
                        Multi-Subject Acc %
                    </button>
                </div>
            </div>

            <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'score' ? (
                        <AreaChart data={scoreTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis domain={[80, 200]} tick={{ fontSize: 11 }} />
                            <Tooltip content={<ScoreTooltip />} />
                            <ReferenceLine
                                y={150}
                                stroke="#10b981"
                                strokeDasharray="3 3"
                                label={{ value: 'AIR Cutoff (150)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#scoreGradient)"
                                name="Mock Score"
                                dot={{ r: 4, fill: '#6366f1' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="targetScore"
                                stroke="#10b981"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                dot={false}
                                name="Target Goal"
                            />
                        </AreaChart>
                    ) : (
                        <LineChart data={accuracyTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} unit="%" />
                            <Tooltip content={<ScoreTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                            <Line type="monotone" dataKey="quant" stroke="#6366f1" strokeWidth={2.5} name="Quantitative" dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="reasoning" stroke="#8b5cf6" strokeWidth={2.5} name="Reasoning" dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="english" stroke="#10b981" strokeWidth={2.5} name="English" dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="ga" stroke="#f59e0b" strokeWidth={2.5} name="General Awareness" dot={{ r: 3 }} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

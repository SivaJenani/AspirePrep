import React from 'react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Target, Award, Users } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                <p className="font-bold text-white mb-1.5 border-b border-slate-800 pb-1">
                    {payload[0]?.payload?.subjectFull || payload[0]?.payload?.subject}
                </p>
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

export const CompetencyRadar = ({ subjectPerformance }) => {
    if (!subjectPerformance || subjectPerformance.length === 0) {
        return (
            <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-400 dark:border-slate-800">
                <p className="text-xs">No subject competency data available yet</p>
            </div>
        );
    }

    const data = subjectPerformance.map(s => {
        const shortName = s.subjectName
            .replace('Quantitative Aptitude', 'Quant')
            .replace('General Intelligence & Reasoning', 'Reasoning')
            .replace('General Awareness', 'General Aware')
            .replace('English Comprehension', 'English')
            .split(' ')[0];

        return {
            subject: shortName,
            subjectFull: s.subjectName,
            studentAccuracy: s.accuracy || 65,
            targetBenchmark: s.targetAccuracy || 85,
            peerAverage: s.peerAverageAccuracy || 64
        };
    });

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                        <PolarGrid stroke="#64748b" strokeOpacity={0.25} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 9 }}
                            strokeOpacity={0.2}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Radar
                            name="Your Accuracy"
                            dataKey="studentAccuracy"
                            stroke="#6366f1"
                            fill="#6366f1"
                            fillOpacity={0.35}
                            strokeWidth={2.5}
                        />
                        <Radar
                            name="Target Benchmark"
                            dataKey="targetBenchmark"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.12}
                            strokeWidth={1.5}
                            strokeDasharray="3 3"
                        />
                        <Radar
                            name="Peer Average"
                            dataKey="peerAverage"
                            stroke="#94a3b8"
                            fill="#94a3b8"
                            fillOpacity={0.08}
                            strokeWidth={1}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Metric Comparison Badges */}
            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3 text-[11px]">
                <div className="flex items-center gap-2 rounded-xl bg-indigo-50/70 p-2 dark:bg-indigo-950/40">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    <div>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">Your Accuracy</span>
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">
                            {Math.round(data.reduce((acc, d) => acc + d.studentAccuracy, 0) / data.length)}% Avg
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-emerald-50/70 p-2 dark:bg-emerald-950/40">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <div>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">Target Standard</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">85% Goal</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                    <div>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">Peer Aspirants</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">64% Avg</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

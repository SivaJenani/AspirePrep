import React from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell
} from 'recharts';
import { Crosshair, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                <p className="font-bold text-white mb-1">{data.topicName}</p>
                <p className="text-slate-400 text-[11px] mb-2">{data.subjectName}</p>
                <div className="space-y-1 border-t border-slate-800 pt-1.5">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Accuracy:</span>
                        <span className="font-bold text-indigo-400">{data.accuracy}%</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Average Time:</span>
                        <span className="font-bold text-amber-400">{data.averageTimeSeconds}s / Q</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Quadrant:</span>
                        <span className="font-bold text-emerald-400 capitalize">{data.quadrantLabel}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const SpeedAccuracyQuadrant = ({ efficiencyMatrix }) => {
    const rawData = efficiencyMatrix || [];

    const data = rawData.map(item => {
        let color = '#6366f1';
        let quadrantLabel = 'In Progress';

        const isFast = item.averageTimeSeconds <= 50;
        const isAccurate = item.accuracy >= 70;

        if (isFast && isAccurate) {
            color = '#10b981'; // Green: Mastered (Fast & Accurate)
            quadrantLabel = 'Mastered (Fast & Accurate)';
        } else if (!isFast && isAccurate) {
            color = '#3b82f6'; // Blue: Needs Speed Practice (Accurate but Slow)
            quadrantLabel = 'Accurate but Slow (Speed Drills Needed)';
        } else if (isFast && !isAccurate) {
            color = '#f59e0b'; // Amber: Guessing / Rushing Risk (Fast but Inaccurate)
            quadrantLabel = 'Rushing / Guessing Risk';
        } else {
            color = '#ef4444'; // Red: Critical Deficit (Slow & Inaccurate)
            quadrantLabel = 'Critical Focus Required';
        }

        return {
            ...item,
            color,
            quadrantLabel
        };
    });

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Crosshair className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Speed vs. Accuracy Efficiency Quadrants
                    </h4>
                    <p className="text-xs text-slate-500">
                        Scatter matrix evaluating solving velocity (seconds/question) against precision (%)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Mastered
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        <span className="h-2 w-2 rounded-full bg-blue-500" /> Needs Speed
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Rushing Hazard
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical Weak
                    </span>
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis
                            type="number"
                            dataKey="averageTimeSeconds"
                            name="Avg Time (s)"
                            unit="s"
                            domain={[15, 90]}
                            tick={{ fontSize: 10 }}
                            label={{ value: 'Average Time Per Question (seconds) →', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="accuracy"
                            name="Accuracy"
                            unit="%"
                            domain={[20, 100]}
                            tick={{ fontSize: 10 }}
                            label={{ value: 'Accuracy % ↑', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
                        />
                        <ZAxis range={[70, 70]} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine x={50} stroke="#64748b" strokeDasharray="4 4" opacity={0.5} />
                        <ReferenceLine y={70} stroke="#64748b" strokeDasharray="4 4" opacity={0.5} />
                        <Scatter name="Topics" data={data}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

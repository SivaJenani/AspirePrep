import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell
} from 'recharts';
import { Clock, Flame, Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                <p className="font-bold text-white mb-1">{label}</p>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Study Time:</span>
                        <span className="font-bold text-purple-400">{payload[0].value} mins</span>
                    </div>
                    {payload[0]?.payload?.questions && (
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Questions Solved:</span>
                            <span className="font-bold text-indigo-400">{payload[0].payload.questions} Qs</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export const StudyTimeRhythm = ({ studyTimeTrend, streakDays = 5 }) => {
    const data = studyTimeTrend || [
        { day: 'Mon', minutes: 75, targetMinutes: 120, questions: 35 },
        { day: 'Tue', minutes: 110, targetMinutes: 120, questions: 50 },
        { day: 'Wed', minutes: 95, targetMinutes: 120, questions: 42 },
        { day: 'Thu', minutes: 130, targetMinutes: 120, questions: 65 },
        { day: 'Fri', minutes: 80, targetMinutes: 120, questions: 30 },
        { day: 'Sat', minutes: 160, targetMinutes: 120, questions: 90 },
        { day: 'Sun', minutes: 145, targetMinutes: 120, questions: 80 }
    ];

    const totalWeekMinutes = data.reduce((acc, d) => acc + (d.minutes || 0), 0);
    const avgDailyMinutes = Math.round(totalWeekMinutes / data.length);

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        Weekly Study Rhythm & Consistency
                    </h4>
                    <p className="text-xs text-slate-500">
                        Daily minutes logged vs. 120 min daily target
                    </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Flame className="h-3.5 w-3.5 fill-current" />
                    <span>{streakDays}d Streak</span>
                </div>
            </div>

            <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 180]} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine
                            y={120}
                            stroke="#8b5cf6"
                            strokeDasharray="3 3"
                            label={{ value: '120m Goal', fill: '#8b5cf6', fontSize: 10, position: 'insideTopRight' }}
                        />
                        <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.minutes >= 120 ? '#8b5cf6' : '#c4b5fd'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Weekly Total: <strong>{Math.floor(totalWeekMinutes / 60)}h {totalWeekMinutes % 60}m</strong></span>
                <span className="text-slate-500 dark:text-slate-400">Daily Average: <strong>{avgDailyMinutes}m / day</strong></span>
            </div>
        </div>
    );
};

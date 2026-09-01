import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TimelineView = ({ studyPlan }) => {
    if (!studyPlan?.schedule || studyPlan.schedule.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16 text-slate-400 dark:border-slate-700">
                <p className="text-sm font-semibold">No tasks available for timeline</p>
            </div>
        );
    }

    // Flatten all tasks and sort by day/time (assuming dayNumber serves as order)
    const timelineEvents = studyPlan.schedule.flatMap(day => {
        return day.tasks.map(task => ({
            ...task,
            dayNumber: day.dayNumber,
            date: day.date,
            isRestDay: day.isRestDay,
        }));
    });

    return (
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8 py-4 dark:border-slate-800">
            {timelineEvents.map((event, idx) => (
                <div key={event.id || idx} className="relative">
                    {/* Timeline Node */}
                    <div className={`absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-slate-50 dark:border-slate-950 ${
                        event.isCompleted || event.status === 'done'
                            ? 'bg-emerald-500' 
                            : event.status === 'in_progress'
                                ? 'bg-amber-500'
                                : 'bg-indigo-500'
                    }`}>
                        {(event.isCompleted || event.status === 'done') && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>

                    {/* Content Card */}
                    <div className={`flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                        event.isCompleted || event.status === 'done'
                            ? 'border-emerald-100 bg-emerald-50/50 opacity-80 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                            : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900'
                    }`}>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                    Day {event.dayNumber} · {event.date}
                                </span>
                                {event.priority === 'high' && (
                                    <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                                        High Priority
                                    </span>
                                )}
                            </div>
                            <h4 className={`text-base font-bold ${
                                event.isCompleted || event.status === 'done' ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-900 dark:text-white'
                            }`}>
                                {event.topicName}
                            </h4>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.durationMinutes} min</span>
                                <span className="uppercase tracking-wider">{event.activityType?.replace('_', ' ')}</span>
                            </div>
                        </div>

                        {!(event.isCompleted || event.status === 'done') && (
                            <Link 
                                to={`/practice?mode=topic&topicId=${event.topicId}`}
                                className="shrink-0 rounded-lg bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-900"
                            >
                                Start Task
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

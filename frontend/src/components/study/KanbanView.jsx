import React, { useState } from 'react';
import { Play, CheckCircle2, GripVertical, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const KanbanView = ({ studyPlan, onTaskUpdate }) => {
    const [draggedTask, setDraggedTask] = useState(null);

    // Extract all tasks across all days
    const allTasks = studyPlan?.schedule?.flatMap(day => 
        day.tasks.map(task => ({ ...task, dayNumber: day.dayNumber, date: day.date }))
    ) || [];

    // Categorize tasks by status
    const columns = {
        not_started: {
            id: 'not_started',
            title: 'To Do',
            color: 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300',
            headerColor: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
            tasks: allTasks.filter(t => !t.status || t.status === 'not_started' || (!t.status && !t.isCompleted))
        },
        in_progress: {
            id: 'in_progress',
            title: 'In Progress',
            color: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300',
            headerColor: 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
            tasks: allTasks.filter(t => t.status === 'in_progress')
        },
        done: {
            id: 'done',
            title: 'Done',
            color: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300',
            headerColor: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
            tasks: allTasks.filter(t => t.status === 'done' || (!t.status && t.isCompleted))
        }
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        // Required for Firefox
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        
        // Add a class to hide the original element slightly to show it's moving
        setTimeout(() => e.target.classList.add('opacity-50'), 0);
    };

    const handleDragEnd = (e) => {
        setDraggedTask(null);
        e.target.classList.remove('opacity-50');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== columnId) {
            onTaskUpdate(draggedTask.id, { status: columnId });
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Object.values(columns).map(col => (
                <div 
                    key={col.id} 
                    className={`flex flex-col rounded-2xl border p-4 ${col.color}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>
                            {col.title}
                        </h3>
                        <span className="text-xs font-bold opacity-50">{col.tasks.length}</span>
                    </div>

                    <div className="flex flex-col gap-3 min-h-[150px]">
                        {col.tasks.map(task => (
                            <div 
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                                onDragEnd={handleDragEnd}
                                className="group cursor-grab flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="flex items-start gap-2">
                                    <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100" />
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                                Day {task.dayNumber}
                                            </span>
                                            {task.priority === 'high' && (
                                                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                                                    High Yield
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                                            {task.topicName}
                                        </h4>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pl-6 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                        <Clock className="h-3 w-3" />
                                        {task.durationMinutes} min
                                    </div>
                                    <Link 
                                        to={`/practice?mode=topic&topicId=${task.topicId}`}
                                        className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                                        title="Start Practice"
                                    >
                                        <Play className="h-3.5 w-3.5 fill-current" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {col.tasks.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-8 text-slate-400 dark:border-slate-700">
                                <p className="text-xs font-semibold">No tasks here</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

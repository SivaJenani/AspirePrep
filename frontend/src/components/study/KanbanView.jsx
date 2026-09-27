import React, { useState, useMemo } from 'react';
import { Play, CheckCircle2, GripVertical, Clock, Flame, Search, ArrowRight, RotateCcw, Check, Sparkles, Layers } from 'lucide-react';
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

export const KanbanView = ({ studyPlan, onTaskUpdate }) => {
    const [draggedTask, setDraggedTask] = useState(null);
    const [activeOverCol, setActiveOverCol] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDayFilter, setSelectedDayFilter] = useState('all');

    // Extract all tasks across all days
    const allTasks = useMemo(() => {
        return studyPlan?.schedule?.flatMap(day => 
            day.tasks.map(task => ({ ...task, dayNumber: day.dayNumber, date: day.date }))
        ) || [];
    }, [studyPlan]);

    // Available days for filter dropdown
    const availableDays = useMemo(() => {
        const days = Array.from(new Set(allTasks.map(t => t.dayNumber))).sort((a, b) => a - b);
        return days;
    }, [allTasks]);

    // Filter tasks based on search & day filter
    const filteredTasks = useMemo(() => {
        return allTasks.filter(task => {
            const matchesDay = selectedDayFilter === 'all' || task.dayNumber === Number(selectedDayFilter);
            const cleanTitle = cleanTopicTitle(task.topicName).toLowerCase();
            const subject = (task.subjectName || '').toLowerCase();
            const matchesSearch = !searchQuery.trim() || 
                cleanTitle.includes(searchQuery.toLowerCase()) || 
                subject.includes(searchQuery.toLowerCase());
            return matchesDay && matchesSearch;
        });
    }, [allTasks, searchQuery, selectedDayFilter]);

    // Categorize tasks by status
    const columns = {
        not_started: {
            id: 'not_started',
            title: 'To Do',
            color: 'border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200',
            headerBg: 'bg-slate-200/90 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
            badgeBg: 'bg-slate-300/80 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
            emptyBorder: 'border-slate-300 dark:border-slate-700',
            emptyText: 'No pending tasks in To Do.',
            emptyHint: 'All tasks have been moved to In Progress or Done!',
            tasks: filteredTasks.filter(t => (!t.status || t.status === 'not_started') && !t.isCompleted)
        },
        in_progress: {
            id: 'in_progress',
            title: 'In Progress',
            color: 'border-amber-200/90 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200',
            headerBg: 'bg-amber-100 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200',
            badgeBg: 'bg-amber-200/80 text-amber-900 dark:bg-amber-800 dark:text-amber-100',
            emptyBorder: 'border-amber-300/70 dark:border-amber-800/50',
            emptyText: 'No tasks currently in progress.',
            emptyHint: 'Drag a task card here from To Do or click "Start" on a card.',
            tasks: filteredTasks.filter(t => t.status === 'in_progress' && !t.isCompleted)
        },
        done: {
            id: 'done',
            title: 'Done',
            color: 'border-emerald-200/90 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200',
            headerBg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-200',
            badgeBg: 'bg-emerald-200/80 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100',
            emptyBorder: 'border-emerald-300/70 dark:border-emerald-800/50',
            emptyText: 'No completed tasks yet.',
            emptyHint: 'Drag finished tasks here or click "Complete" to record XP!',
            tasks: filteredTasks.filter(t => t.status === 'done' || t.isCompleted)
        }
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => e.target.classList.add('opacity-40'), 0);
    };

    const handleDragEnd = (e) => {
        setDraggedTask(null);
        setActiveOverCol(null);
        e.target.classList.remove('opacity-40');
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (activeOverCol !== colId) {
            setActiveOverCol(colId);
        }
    };

    const handleDragLeave = (e, colId) => {
        e.preventDefault();
        if (activeOverCol === colId) {
            setActiveOverCol(null);
        }
    };

    const handleDrop = (e, columnId) => {
        e.preventDefault();
        setActiveOverCol(null);
        if (draggedTask) {
            const currentStatus = draggedTask.isCompleted ? 'done' : (draggedTask.status || 'not_started');
            if (currentStatus !== columnId) {
                onTaskUpdate(draggedTask.id, { 
                    status: columnId,
                    isCompleted: columnId === 'done'
                });
            }
        }
    };

    const handleQuickMove = (taskId, newStatus) => {
        onTaskUpdate(taskId, { 
            status: newStatus,
            isCompleted: newStatus === 'done'
        });
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tasks or subjects in Kanban board..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        Day Filter:
                    </span>
                    <select
                        value={selectedDayFilter}
                        onChange={(e) => setSelectedDayFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 transition"
                    >
                        <option value="all">All Days ({allTasks.length} tasks)</option>
                        {availableDays.map(dayNum => (
                            <option key={dayNum} value={dayNum}>Day {dayNum}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Kanban Columns Grid - Fixed max height with scrollable task columns */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {Object.values(columns).map(col => {
                    const isDragOver = activeOverCol === col.id;

                    return (
                        <div 
                            key={col.id} 
                            className={`flex flex-col h-[620px] max-h-[72vh] rounded-3xl border p-4 shadow-2xs transition-all duration-200 ${col.color} ${
                                isDragOver ? 'ring-2 ring-indigo-500 scale-[1.008]' : ''
                            }`}
                            onDragOver={(e) => handleDragOver(e, col.id)}
                            onDragLeave={(e) => handleDragLeave(e, col.id)}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            {/* Column Header */}
                            <div className="mb-3.5 flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className={`rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wider ${col.headerBg}`}>
                                        {col.title}
                                    </span>
                                </div>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${col.badgeBg}`}>
                                    {col.tasks.length}
                                </span>
                            </div>

                            {/* Column Content Area - Internal Scrollbar preventing infinite stretching */}
                            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                                {col.tasks.map(task => {
                                    const cleanTitle = cleanTopicTitle(task.topicName);
                                    const isCompleted = col.id === 'done';

                                    return (
                                        <div 
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task)}
                                            onDragEnd={handleDragEnd}
                                            className={`group cursor-grab flex flex-col gap-2.5 rounded-2xl border p-3.5 shadow-2xs transition-all hover:shadow-md active:cursor-grabbing ${
                                                isCompleted
                                                    ? 'border-emerald-200 bg-white/90 opacity-90 dark:border-emerald-900/50 dark:bg-slate-900'
                                                    : 'border-slate-200/90 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900'
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            Day {task.dayNumber}
                                                        </span>
                                                        {task.subjectName && (
                                                            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                                                {task.subjectName}
                                                            </span>
                                                        )}
                                                        {task.priority === 'high' && (
                                                            <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 flex items-center gap-0.5">
                                                                <Flame className="w-2.5 h-2.5" /> High Yield
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className={`text-xs sm:text-sm font-extrabold leading-snug ${
                                                        isCompleted ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'
                                                    }`}>
                                                        {cleanTitle}
                                                    </h4>
                                                </div>
                                            </div>

                                            {/* Card Footer Actions */}
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono">
                                                    <Clock className="h-3 w-3" />
                                                    {task.durationMinutes} min
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    {/* Quick status move buttons */}
                                                    {col.id === 'not_started' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleQuickMove(task.id, 'in_progress')}
                                                                className="rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:hover:bg-amber-900/80 dark:text-amber-300 px-2 py-1 text-[10px] font-bold transition flex items-center gap-1"
                                                                title="Move to In Progress"
                                                            >
                                                                <span>Start</span>
                                                                <ArrowRight className="w-2.5 h-2.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickMove(task.id, 'done')}
                                                                className="rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/80 dark:text-emerald-300 px-2 py-1 text-[10px] font-bold transition flex items-center gap-1"
                                                                title="Mark as Completed"
                                                            >
                                                                <Check className="w-2.5 h-2.5" />
                                                                <span>Done</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {col.id === 'in_progress' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleQuickMove(task.id, 'not_started')}
                                                                className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 px-2 py-1 text-[10px] font-bold transition"
                                                                title="Move back to To Do"
                                                            >
                                                                To Do
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickMove(task.id, 'done')}
                                                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 text-[10px] font-bold transition flex items-center gap-1 shadow-2xs"
                                                                title="Mark as Completed"
                                                            >
                                                                <Check className="w-2.5 h-2.5" />
                                                                <span>Complete</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {col.id === 'done' && (
                                                        <button
                                                            onClick={() => handleQuickMove(task.id, 'not_started')}
                                                            className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 px-2 py-1 text-[10px] font-bold transition flex items-center gap-1"
                                                            title="Reopen task"
                                                        >
                                                            <RotateCcw className="w-2.5 h-2.5" />
                                                            <span>Reopen</span>
                                                        </button>
                                                    )}

                                                    {/* Direct Drill practice button */}
                                                    <Link 
                                                        to={`/practice?mode=topic&topicId=${task.topicId}`}
                                                        className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                                                        title="Launch Topic Practice Drill"
                                                    >
                                                        <Play className="h-2.5 w-2.5 fill-current" />
                                                        <span>Drill</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Compact, neat empty state when 0 tasks in a column */}
                                {col.tasks.length === 0 && (
                                    <div className={`flex flex-col items-center justify-center h-full min-h-[220px] rounded-2xl border-2 border-dashed ${col.emptyBorder} bg-white/40 dark:bg-slate-900/40 p-6 text-center transition-all`}>
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                                            {col.id === 'done' ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : col.id === 'in_progress' ? (
                                                <Clock className="w-5 h-5 text-amber-500" />
                                            ) : (
                                                <Layers className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                                            {col.emptyText}
                                        </p>
                                        <p className="mt-1 text-[11px] font-medium text-slate-400 max-w-[200px]">
                                            {col.emptyHint}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


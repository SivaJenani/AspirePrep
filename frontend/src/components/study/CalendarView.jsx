import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

export const CalendarView = ({ studyPlan, onTaskUpdate }) => {
    const [draggedTask, setDraggedTask] = useState(null);
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

    // Build the calendar data structure
    const { calendarDays, monthLabel } = useMemo(() => {
        if (!studyPlan?.schedule || studyPlan.schedule.length === 0) {
            return { calendarDays: [], monthLabel: 'No Plan' };
        }

        // Find the start date of the plan
        const firstDateStr = studyPlan.schedule[0].date;
        const firstDate = new Date(firstDateStr);
        
        // Apply month offset
        const targetDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + currentMonthOffset, 1);
        
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();
        
        const monthLabel = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Get first day of month (0 = Sunday, 1 = Monday)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        // Pad beginning of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ isPadding: true });
        }
        
        // Map tasks by date string (YYYY-MM-DD)
        const tasksByDate = {};
        studyPlan.schedule.forEach(day => {
            tasksByDate[day.date] = {
                dayNumber: day.dayNumber,
                isRestDay: day.isRestDay,
                tasks: day.tasks
            };
        });
        
        // Fill actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            const dateStr = dateObj.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            
            const planData = tasksByDate[dateStr] || { tasks: [] };
            
            days.push({
                date: i,
                fullDateStr: dateStr,
                planData,
                isToday: dateStr === new Date().toISOString().split('T')[0]
            });
        }
        
        return { calendarDays: days, monthLabel };
    }, [studyPlan, currentMonthOffset]);

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
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

    const handleDrop = (e, targetDayNumber) => {
        e.preventDefault();
        if (draggedTask && targetDayNumber && draggedTask.dayNumber !== targetDayNumber) {
            onTaskUpdate(draggedTask.id, { targetDayNumber });
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <CalendarIcon className="h-5 w-5 text-indigo-500" />
                    <span className="text-lg">{monthLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentMonthOffset(prev => prev - 1)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => setCurrentMonthOffset(0)}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        Today
                    </button>
                    <button 
                        onClick={() => setCurrentMonthOffset(prev => prev + 1)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                    if (day.isPadding) {
                        return <div key={`pad-${idx}`} className="min-h-[120px] border-b border-r border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20" />;
                    }

                    const isPlanDay = day.planData?.dayNumber;
                    const tasks = day.planData?.tasks || [];

                    return (
                        <div 
                            key={day.fullDateStr} 
                            className={`min-h-[120px] border-b border-r border-slate-100 p-2 transition-colors dark:border-slate-800 ${
                                day.isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                            }`}
                            onDragOver={isPlanDay ? handleDragOver : undefined}
                            onDrop={isPlanDay ? (e) => handleDrop(e, day.planData.dayNumber) : undefined}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                    day.isToday 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    {day.date}
                                </span>
                                {isPlanDay && (
                                    <span className="text-[10px] font-bold text-slate-400">Day {day.planData.dayNumber}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                {tasks.map(task => (
                                    <div 
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, { ...task, dayNumber: day.planData.dayNumber })}
                                        onDragEnd={handleDragEnd}
                                        className={`group cursor-grab flex items-start gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold shadow-sm transition active:cursor-grabbing ${
                                            task.isCompleted || task.status === 'done'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : task.status === 'in_progress'
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    : 'bg-white text-slate-700 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                        title={task.topicName}
                                    >
                                        <GripVertical className="mt-[2px] h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-50" />
                                        <span className="truncate">{task.topicName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

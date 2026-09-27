import React, { useState, useMemo } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight,
    CheckCircle2, Circle, Clock, Brain, Play, Plus,
    X, Sparkles, Filter, List, Grid, CalendarDays,
    ChevronDown, Flame, Zap, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Clean raw markdown, bold symbols, asterisks, and numeric prefixes from topic titles
const cleanTopicTitle = (text) => {
    if (!text) return '';
    let cleaned = String(text)
        .replace(/\*\*(.*?)\*\*/g, '$1') // remove **bold**
        .replace(/\*(.*?)\*/g, '$1')     // remove *italic*
        .replace(/__(.*?)__/g, '$1')     // remove __underline__
        .replace(/^[\d]+[\.\)]\s*/, '')  // remove "1. " or "1) "
        .replace(/^[-•*]\s*/, '')        // remove bullet points
        .trim();
    return cleaned;
};

// Map subjects to refined theme colors
const getSubjectTheme = (subjectName = '') => {
    const s = subjectName.toLowerCase();
    if (s.includes('quant') || s.includes('math') || s.includes('arithmetic') || s.includes('algebra') || s.includes('geometry')) {
        return {
            bg: 'bg-indigo-50 dark:bg-indigo-950/50',
            text: 'text-indigo-700 dark:text-indigo-300',
            border: 'border-indigo-200 dark:border-indigo-800',
            chipBg: 'bg-indigo-100/80 dark:bg-indigo-900/60',
            dot: 'bg-indigo-500',
            label: 'Quantitative'
        };
    }
    if (s.includes('reason') || s.includes('logic') || s.includes('intelligence')) {
        return {
            bg: 'bg-purple-50 dark:bg-purple-950/50',
            text: 'text-purple-700 dark:text-purple-300',
            border: 'border-purple-200 dark:border-purple-800',
            chipBg: 'bg-purple-100/80 dark:bg-purple-900/60',
            dot: 'bg-purple-500',
            label: 'Reasoning'
        };
    }
    if (s.includes('english') || s.includes('verbal') || s.includes('vocab') || s.includes('comprehension')) {
        return {
            bg: 'bg-emerald-50 dark:bg-emerald-950/50',
            text: 'text-emerald-700 dark:text-emerald-300',
            border: 'border-emerald-200 dark:border-emerald-800',
            chipBg: 'bg-emerald-100/80 dark:bg-emerald-900/60',
            dot: 'bg-emerald-500',
            label: 'English'
        };
    }
    if (s.includes('aware') || s.includes('gk') || s.includes('current') || s.includes('history') || s.includes('science') || s.includes('general')) {
        return {
            bg: 'bg-amber-50 dark:bg-amber-950/50',
            text: 'text-amber-700 dark:text-amber-300',
            border: 'border-amber-200 dark:border-amber-800',
            chipBg: 'bg-amber-100/80 dark:bg-amber-900/60',
            dot: 'bg-amber-500',
            label: 'General Awareness'
        };
    }
    return {
        bg: 'bg-slate-50 dark:bg-slate-800/60',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        chipBg: 'bg-slate-100 dark:bg-slate-800',
        dot: 'bg-slate-500',
        label: subjectName || 'General'
    };
};

export const CalendarView = ({
    studyPlan,
    onTaskUpdate,
    onOpenFocusRoom,
    onOpenAddTask
}) => {
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
    const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'agenda'
    const [selectedDayData, setSelectedDayData] = useState(null);
    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

    // Build the calendar data structure
    const { calendarDays, monthLabel, allDaysList } = useMemo(() => {
        if (!studyPlan?.schedule || studyPlan.schedule.length === 0) {
            return { calendarDays: [], monthLabel: 'No Plan', allDaysList: [] };
        }

        const firstDateStr = studyPlan.schedule[0].date;
        const firstDate = new Date(firstDateStr);

        const targetDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + currentMonthOffset, 1);
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();

        const monthLabel = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Pad beginning of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ isPadding: true, key: `pad-start-${i}` });
        }

        const tasksByDate = {};
        studyPlan.schedule.forEach(day => {
            tasksByDate[day.date] = {
                dayNumber: day.dayNumber,
                focusTitle: day.focusTitle,
                isRestDay: day.isRestDay,
                isCompleted: day.isCompleted,
                tasks: day.tasks || []
            };
        });

        const todayStr = new Date().toISOString().split('T')[0];

        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            const dateStr = dateObj.toISOString().split('T')[0];
            const planData = tasksByDate[dateStr] || null;

            days.push({
                key: dateStr,
                date: i,
                fullDateStr: dateStr,
                dateObj,
                planData,
                isToday: dateStr === todayStr
            });
        }

        return {
            calendarDays: days,
            monthLabel,
            allDaysList: studyPlan.schedule
        };
    }, [studyPlan, currentMonthOffset]);

    // Subjects list for filter
    const uniqueSubjects = useMemo(() => {
        if (!studyPlan?.schedule) return [];
        const set = new Set();
        studyPlan.schedule.forEach(d => {
            (d.tasks || []).forEach(t => {
                if (t.subjectName) set.add(t.subjectName);
            });
        });
        return Array.from(set);
    }, [studyPlan]);

    const handleTaskToggle = (taskId, currentCompleted, e) => {
        if (e) e.stopPropagation();
        if (onTaskUpdate) {
            onTaskUpdate(taskId, { status: currentCompleted ? 'not_started' : 'done' });
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Top Calendar Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{monthLabel}</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {studyPlan?.examName || 'Preparation'} • {studyPlan?.schedule?.length || 0}-Day Timetable
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* View mode toggle */}
                    <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setViewMode('month')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                                viewMode === 'month'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Grid className="w-3.5 h-3.5" />
                            <span>Month</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('week')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                                viewMode === 'week'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>Week</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('agenda')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                                viewMode === 'agenda'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <List className="w-3.5 h-3.5" />
                            <span>Agenda</span>
                        </button>
                    </div>

                    {/* Month navigation */}
                    <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                        <button
                            type="button"
                            onClick={() => setCurrentMonthOffset(prev => prev - 1)}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                            title="Previous Month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentMonthOffset(0)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentMonthOffset(prev => prev + 1)}
                            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
                            title="Next Month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Subject Filter Bar */}
            {uniqueSubjects.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="font-bold text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Filter:
                    </span>
                    <button
                        type="button"
                        onClick={() => setSelectedSubjectFilter('all')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                            selectedSubjectFilter === 'all'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                    >
                        All Subjects
                    </button>
                    {uniqueSubjects.map(subj => {
                        const theme = getSubjectTheme(subj);
                        const isSelected = selectedSubjectFilter === subj;
                        return (
                            <button
                                key={subj}
                                type="button"
                                onClick={() => setSelectedSubjectFilter(subj)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap border ${
                                    isSelected
                                        ? `${theme.bg} ${theme.text} ${theme.border} shadow-xs font-black`
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                                <span>{subj}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── View 1: Month Grid View ─────────────────────────────────── */}
            {viewMode === 'month' && (
                <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                        {weekDays.map(day => (
                            <div key={day} className="py-2.5 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Day Cells Grid */}
                    <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/70 border-b border-slate-100 dark:border-slate-800">
                        {calendarDays.map((cell, idx) => {
                            if (cell.isPadding) {
                                return (
                                    <div
                                        key={cell.key || idx}
                                        className="min-h-[110px] bg-slate-50/40 dark:bg-slate-950/20"
                                    />
                                );
                            }

                            const planData = cell.planData;
                            const isPlanDay = Boolean(planData);
                            const tasks = planData?.tasks || [];
                            const filteredTasks = selectedSubjectFilter === 'all'
                                ? tasks
                                : tasks.filter(t => t.subjectName === selectedSubjectFilter);

                            const completedCount = tasks.filter(t => t.isCompleted).length;
                            const isAllDone = tasks.length > 0 && completedCount === tasks.length;
                            const isRest = planData?.isRestDay;

                            return (
                                <div
                                    key={cell.key}
                                    onClick={() => isPlanDay && setSelectedDayData({ ...cell, planData })}
                                    className={`group relative min-h-[115px] p-2 flex flex-col justify-between transition cursor-pointer ${
                                        cell.isToday
                                            ? 'bg-indigo-50/30 dark:bg-indigo-950/20 ring-2 ring-inset ring-indigo-500/40'
                                            : isRest
                                                ? 'bg-emerald-50/20 dark:bg-emerald-950/10 hover:bg-emerald-50/40'
                                                : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                                    }`}
                                >
                                    {/* Cell Header: Date + Day Badge */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black transition ${
                                                cell.isToday
                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                    : isAllDone
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600'
                                            }`}>
                                                {cell.date}
                                            </span>

                                            {isPlanDay && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                                    isRest
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : isAllDone
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    {isRest ? '🌿 Rest' : `Day ${planData.dayNumber}`}
                                                </span>
                                            )}
                                        </div>

                                        {/* Task Chips (Clean & Color Coded) */}
                                        {isPlanDay && (
                                            <div className="space-y-1 mt-1">
                                                {isRest ? (
                                                    <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/70 p-1.5 text-[10px] font-bold text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 text-center">
                                                        Active Recovery
                                                    </div>
                                                ) : (
                                                    filteredTasks.slice(0, 2).map((task) => {
                                                        const theme = getSubjectTheme(task.subjectName);
                                                        const cleanTitle = cleanTopicTitle(task.topicName);

                                                        return (
                                                            <div
                                                                key={task.id}
                                                                className={`flex items-center justify-between gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold border transition ${
                                                                    task.isCompleted
                                                                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800'
                                                                        : `${theme.chipBg} ${theme.text} ${theme.border}`
                                                                }`}
                                                                title={`${task.subjectName}: ${cleanTitle}`}
                                                            >
                                                                <div className="flex items-center gap-1 min-w-0">
                                                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dot}`} />
                                                                    <span className="truncate">{cleanTitle}</span>
                                                                </div>
                                                                {task.priority === 'high' && (
                                                                    <Flame className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Indicator for More Tasks */}
                                    {isPlanDay && !isRest && (
                                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                                            {filteredTasks.length > 2 ? (
                                                <span className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                                                    +{filteredTasks.length - 2} more
                                                </span>
                                            ) : (
                                                <span />
                                            )}
                                            {tasks.length > 0 && (
                                                <span className="font-mono font-semibold">
                                                    {completedCount}/{tasks.length}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── View 2: Week Detailed Column Schedule ──────────────────── */}
            {viewMode === 'week' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                        {allDaysList.slice(0, 7).map((day) => {
                            const completedCount = (day.tasks || []).filter(t => t.isCompleted).length;
                            const totalCount = (day.tasks || []).length;
                            const isToday = day.dayNumber === (studyPlan?.currentDay || 1);

                            return (
                                <div
                                    key={day.dayNumber}
                                    className={`rounded-2xl border p-4 flex flex-col justify-between shadow-xs transition ${
                                        isToday
                                            ? 'border-indigo-300 bg-indigo-50/30 dark:border-indigo-800 dark:bg-slate-900 ring-2 ring-indigo-500/20'
                                            : day.isRestDay
                                                ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-slate-900'
                                                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                                            <div>
                                                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                                                    Day {day.dayNumber}
                                                </span>
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                                    {day.focusTitle || `Schedule Day ${day.dayNumber}`}
                                                </h4>
                                            </div>
                                            <span className="text-[11px] font-bold font-mono text-slate-500">
                                                {completedCount}/{totalCount}
                                            </span>
                                        </div>

                                        {/* Task Cards in Week Column */}
                                        <div className="space-y-2">
                                            {day.isRestDay ? (
                                                <div className="p-3 text-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                                    🌿 Active Rest & Formula Consolidation
                                                </div>
                                            ) : (
                                                (day.tasks || []).map((task) => {
                                                    const theme = getSubjectTheme(task.subjectName);
                                                    const cleanTitle = cleanTopicTitle(task.topicName);

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className={`p-2.5 rounded-xl border transition ${
                                                                task.isCompleted
                                                                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                                                                    : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 shadow-2xs'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-1 mb-1">
                                                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${theme.chipBg} ${theme.text}`}>
                                                                    {task.subjectName || 'Study'}
                                                                </span>
                                                                {task.priority === 'high' && (
                                                                    <span className="text-[9px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1 rounded">
                                                                        🔥 High
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h5 className={`text-xs font-bold leading-tight ${
                                                                task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                                                            }`}>
                                                                {cleanTitle}
                                                            </h5>

                                                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px]">
                                                                <span className="text-slate-400 flex items-center gap-0.5">
                                                                    <Clock className="w-2.5 h-2.5" /> {task.durationMinutes}m
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    {onOpenFocusRoom && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onOpenFocusRoom(task, day.dayNumber)}
                                                                            className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded"
                                                                            title="Focus Room"
                                                                        >
                                                                            <Brain className="w-3 h-3" />
                                                                        </button>
                                                                    )}
                                                                    <Link
                                                                        to={`/practice?mode=topic&topicId=${task.topicId}`}
                                                                        className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded"
                                                                        title="Drill Questions"
                                                                    >
                                                                        <Play className="w-3 h-3 fill-indigo-600" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    {/* Action footer */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDayData({ fullDateStr: day.date, planData: day })}
                                        className="mt-3 w-full py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                    >
                                        Inspect Day
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── View 3: Agenda Stream View ─────────────────────────────── */}
            {viewMode === 'agenda' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-indigo-600" />
                        <span>Chronological Timetable Agenda</span>
                    </h4>

                    <div className="space-y-4">
                        {allDaysList.map((day) => {
                            const completedCount = (day.tasks || []).filter(t => t.isCompleted).length;
                            const totalCount = (day.tasks || []).length;
                            const isToday = day.dayNumber === (studyPlan?.currentDay || 1);

                            return (
                                <div
                                    key={day.dayNumber}
                                    className={`rounded-2xl border p-4 transition ${
                                        isToday
                                            ? 'border-indigo-300 bg-indigo-50/20 dark:border-indigo-800 dark:bg-slate-900/60'
                                            : 'border-slate-200/80 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/30'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-extrabold text-white ${
                                                isToday ? 'bg-indigo-600' : 'bg-slate-700'
                                            }`}>
                                                {day.dayNumber}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {day.focusTitle}
                                                    </h5>
                                                    {isToday && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                                            TODAY
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {day.date}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-500">
                                                {completedCount}/{totalCount} completed
                                            </span>
                                            {onOpenAddTask && (
                                                <button
                                                    type="button"
                                                    onClick={() => onOpenAddTask(day.dayNumber)}
                                                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add Task
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Task list */}
                                    <div className="space-y-2">
                                        {day.isRestDay ? (
                                            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                                                🌿 Scheduled Active Rest & Spaced Repetition Review
                                            </div>
                                        ) : (
                                            (day.tasks || []).map((task) => {
                                                const cleanTitle = cleanTopicTitle(task.topicName);
                                                const theme = getSubjectTheme(task.subjectName);

                                                return (
                                                    <div
                                                        key={task.id}
                                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border bg-white dark:bg-slate-800 ${
                                                            task.isCompleted
                                                                ? 'border-slate-200 dark:border-slate-700/60 opacity-75'
                                                                : 'border-slate-200/80 dark:border-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleTaskToggle(task.id, task.isCompleted, e)}
                                                                className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                                                            >
                                                                {task.isCompleted ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                                ) : (
                                                                    <Circle className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${theme.chipBg} ${theme.text}`}>
                                                                        {task.subjectName}
                                                                    </span>
                                                                    <h6 className={`text-xs font-bold ${
                                                                        task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                                                                    }`}>
                                                                        {cleanTitle}
                                                                    </h6>
                                                                    {task.priority === 'high' && (
                                                                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                                                                            🔥 High Yield
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {task.taskObjective && (
                                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                                        {task.taskObjective}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                                            {onOpenFocusRoom && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => onOpenFocusRoom(task, day.dayNumber)}
                                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 transition"
                                                                >
                                                                    <Brain className="w-3 h-3" /> Focus
                                                                </button>
                                                            )}
                                                            <Link
                                                                to={`/practice?mode=topic&topicId=${task.topicId}`}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-xs hover:bg-indigo-500 transition"
                                                            >
                                                                <Play className="w-2.5 h-2.5 fill-white" /> Drill
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Day Detail Modal (Full Unclipped View) ────────────────── */}
            {selectedDayData && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
                    onClick={() => setSelectedDayData(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] flex flex-col justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white">
                                            Day {selectedDayData.planData?.dayNumber || 1}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400">
                                            {selectedDayData.fullDateStr}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                                        {selectedDayData.planData?.focusTitle || 'Daily Study Schedule'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDayData(null)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Task List */}
                            <div className="py-4 space-y-3 overflow-y-auto max-h-[50vh] pr-1">
                                {selectedDayData.planData?.isRestDay ? (
                                    <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-center space-y-2">
                                        <span className="text-2xl">🌿</span>
                                        <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                            Scheduled Rest & Cognitive Re-consolidation
                                        </h4>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
                                            Give your working memory time to transfer new formulas into long-term cortex retention. Light flash-card recall is recommended.
                                        </p>
                                    </div>
                                ) : (
                                    (selectedDayData.planData?.tasks || []).map((task) => {
                                        const cleanTitle = cleanTopicTitle(task.topicName);
                                        const theme = getSubjectTheme(task.subjectName);

                                        return (
                                            <div
                                                key={task.id}
                                                className={`p-4 rounded-2xl border transition space-y-2.5 ${
                                                    task.isCompleted
                                                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                                                        : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 shadow-2xs'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleTaskToggle(task.id, task.isCompleted, e)}
                                                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                                                        >
                                                            {task.isCompleted ? (
                                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                            ) : (
                                                                <Circle className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.chipBg} ${theme.text}`}>
                                                                    {task.subjectName}
                                                                </span>
                                                                {task.priority === 'high' && (
                                                                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md">
                                                                        🔥 High Yield
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className={`text-sm font-bold ${
                                                                task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'
                                                            }`}>
                                                                {cleanTitle}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <span className="text-xs font-semibold text-slate-400 shrink-0">
                                                        {task.durationMinutes}m
                                                    </span>
                                                </div>

                                                {task.taskObjective && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                                                        🎯 {task.taskObjective}
                                                    </p>
                                                )}

                                                {task.extractedCheatNotes && (
                                                    <div className="ml-8 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 font-mono">
                                                        💡 {task.extractedCheatNotes}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                                    {onOpenFocusRoom && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedDayData(null);
                                                                onOpenFocusRoom(task, selectedDayData.planData?.dayNumber || 1);
                                                            }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 transition"
                                                        >
                                                            <Brain className="w-3.5 h-3.5" />
                                                            <span>Focus Mode</span>
                                                        </button>
                                                    )}
                                                    <Link
                                                        to={`/practice?mode=topic&topicId=${task.topicId}`}
                                                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 transition"
                                                    >
                                                        <Play className="w-3 h-3 fill-white" />
                                                        <span>Start Drill</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            {onOpenAddTask && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const dayNum = selectedDayData.planData?.dayNumber || 1;
                                        setSelectedDayData(null);
                                        onOpenAddTask(dayNum);
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Custom Task</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setSelectedDayData(null)}
                                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

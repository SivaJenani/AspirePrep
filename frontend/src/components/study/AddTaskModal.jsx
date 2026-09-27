import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, BookOpen, Sparkles, Target, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

export const AddTaskModal = ({ isOpen, onClose, dayNumber, scheduleLength = 30, onTaskAdded }) => {
    const [targetDay, setTargetDay] = useState(dayNumber || 1);
    const [topicName, setTopicName] = useState('');
    const [subjectName, setSubjectName] = useState('Quantitative Aptitude');
    const [durationMinutes, setDurationMinutes] = useState(45);
    const [activityType, setActivityType] = useState('topic_practice');
    const [priority, setPriority] = useState('high');
    const [timeSlot, setTimeSlot] = useState('07:00 AM - 08:30 AM');
    const [taskObjective, setTaskObjective] = useState('');
    const [cheatNotes, setCheatNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!topicName.trim()) {
            setError('Please enter a topic name or chapter title.');
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            const res = await api.post('/study-plan/task/add', {
                dayNumber: Number(targetDay),
                topicName: topicName.trim(),
                subjectName: subjectName.trim(),
                durationMinutes: Number(durationMinutes),
                activityType,
                priority,
                timeSlot,
                taskObjective: taskObjective.trim() || `Master ${topicName} with focused active recall.`,
                cheatNotes: cheatNotes.trim()
            });
            if (res.data?.studyPlan) {
                onTaskAdded(res.data.studyPlan);
                onClose();
            }
        } catch (err) {
            console.error('Failed to add custom task:', err);
            setError(err.response?.data?.error || 'Could not add task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="add-task-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                id="add-task-modal-card" 
                className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-y-auto max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                Add Custom Study Session
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Insert a tailored revision chapter or mock test into your timetable
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {error && (
                        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Day Selector */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                Schedule On Day
                            </label>
                            <select
                                value={targetDay}
                                onChange={(e) => setTargetDay(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                                {Array.from({ length: Math.max(scheduleLength, 30) }, (_, i) => i + 1).map(d => (
                                    <option key={d} value={d}>Day {d}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                Subject / Category
                            </label>
                            <select
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                                <option value="Reasoning & Mental Ability">Reasoning & Mental Ability</option>
                                <option value="English Language & Vocab">English Language & Vocab</option>
                                <option value="General Awareness & Polity">General Awareness & Polity</option>
                                <option value="Current Affairs & Static GK">Current Affairs & Static GK</option>
                                <option value="Core Engineering / Domain">Core Engineering / Domain</option>
                                <option value="Mock Test & Error Log">Mock Test & Error Log</option>
                            </select>
                        </div>
                    </div>

                    {/* Topic Title */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Topic / Chapter Title *
                        </label>
                        <input
                            type="text"
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value)}
                            placeholder="e.g. Quadratic Equations & Inequalities, Indian Constitution Preamble"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        />
                    </div>

                    {/* Duration & Activity Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                Duration (Minutes)
                            </label>
                            <select
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                                <option value={20}>20 mins (Quick Sprint)</option>
                                <option value={30}>30 mins</option>
                                <option value={45}>45 mins (Standard)</option>
                                <option value={60}>60 mins (1 Hour)</option>
                                <option value={90}>90 mins (Deep Drill)</option>
                                <option value={120}>120 mins (Full Mock)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                Activity Type
                            </label>
                            <select
                                value={activityType}
                                onChange={(e) => setActivityType(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                                <option value="topic_practice">Topic Practice Drill</option>
                                <option value="concept_study">Concept & Theory Study</option>
                                <option value="revision">Active Recall / Revision</option>
                                <option value="mock_test">Mock Test Simulation</option>
                            </select>
                        </div>
                    </div>

                    {/* Preferred Time Slot */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                Time Slot
                            </label>
                            <input
                                type="text"
                                value={timeSlot}
                                onChange={(e) => setTimeSlot(e.target.value)}
                                placeholder="07:00 AM - 08:30 AM"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                                Priority Level
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            >
                                <option value="high">🔥 High Yield (Must Master)</option>
                                <option value="medium">⚡ Medium Priority</option>
                                <option value="normal">Standard Routine</option>
                            </select>
                        </div>
                    </div>

                    {/* Task Objective */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Specific Objective / Target
                        </label>
                        <input
                            type="text"
                            value={taskObjective}
                            onChange={(e) => setTaskObjective(e.target.value)}
                            placeholder="e.g. Master speed calculation shortcuts & solve 15 PYQs"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    {/* Key Formula / Notes Cheat */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Key Formula / Mnemonics (Optional)
                        </label>
                        <input
                            type="text"
                            value={cheatNotes}
                            onChange={(e) => setCheatNotes(e.target.value)}
                            placeholder="e.g. Profit% = (Profit / CP) * 100 | Shortcut: Use fraction multiplication"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{isSubmitting ? 'Adding…' : 'Add to Timetable'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

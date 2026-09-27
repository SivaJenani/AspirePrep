import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Calendar, CheckCircle2, Sparkles, Brain, Play, RefreshCw,
    BookOpen, Check, FolderOpen, Clock, Target, TrendingUp,
    ChevronRight, Zap, ListChecks, BarChart2, Award, AlertCircle,
    BookMarked, Flame, Plus, Trash2, Printer, CheckSquare, ShieldCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
import { NotesTimetableGeneratorModal } from '../components/study/NotesTimetableGeneratorModal';
import { ExtractedTopicsDeck } from '../components/study/ExtractedTopicsDeck';
import { SpacedRepetitionRoadmap } from '../components/study/SpacedRepetitionRoadmap';
import { SavedNotesLibraryModal } from '../components/study/SavedNotesLibraryModal';
import { KanbanView } from '../components/study/KanbanView';
import { CalendarView } from '../components/study/CalendarView';
import { TimelineView } from '../components/study/TimelineView';
import { SyllabusUploaderModal } from '../components/study/SyllabusUploaderModal';
import { FocusStudyRoomModal } from '../components/study/FocusStudyRoomModal';
import { AddTaskModal } from '../components/study/AddTaskModal';
import { PrintableTimetableModal } from '../components/study/PrintableTimetableModal';
import { StudyPlanEfficacyBanner } from '../components/study/StudyPlanEfficacyBanner';
import { SyllabusCoverageMatrix } from '../components/study/SyllabusCoverageMatrix';

// ─── Small reusable components ───────────────────────────────────────────────

const StatBadge = ({ icon: Icon, label, value, color = 'indigo' }) => {
    const colors = {
        indigo: 'bg-indigo-50/80 border-indigo-200 text-indigo-700 dark:bg-[#151b2e] dark:border-[#2a3350] dark:text-indigo-300',
        emerald: 'bg-emerald-50/80 border-emerald-200 text-emerald-700 dark:bg-[#151b2e] dark:border-[#2a3350] dark:text-emerald-300',
        amber: 'bg-amber-50/80 border-amber-200 text-amber-700 dark:bg-[#151b2e] dark:border-[#2a3350] dark:text-amber-300',
        rose: 'bg-rose-50/80 border-rose-200 text-rose-700 dark:bg-[#151b2e] dark:border-[#2a3350] dark:text-rose-300',
        purple: 'bg-purple-50/80 border-purple-200 text-purple-700 dark:bg-[#151b2e] dark:border-[#2a3350] dark:text-purple-300',
    };
    return (
        <div className={`flex items-center gap-3 rounded-xl border p-4 shadow-xs ${colors[color]}`}>
            <div className="shrink-0">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">{label}</div>
                <div className="mt-0.5 text-base font-extrabold font-mono tabular-nums">{value}</div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label, color = 'indigo' }) => {
    const activeColors = {
        indigo: 'border-indigo-600 text-indigo-600 dark:text-indigo-400',
        purple: 'border-purple-600 text-purple-600 dark:text-purple-400',
    };
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition ${
                active ? activeColors[color] : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    );
};

const ActivityTypePill = ({ type }) => {
    const map = {
        topic_practice: { label: 'Practice', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
        mock_test: { label: 'Mock Test', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' },
        revision: { label: 'Revision', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
        reading: { label: 'Reading', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
    };
    const entry = map[type] || { label: type?.replace(/_/g, ' ') || 'Study', bg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' };
    return (
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${entry.bg}`}>
            {entry.label}
        </span>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

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

export const StudyPlanPage = () => {
    const { user } = useAppStore();
    const navigate = useNavigate();

    const [studyPlan, setStudyPlan] = useState(null);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [isSavedNotesOpen, setIsSavedNotesOpen] = useState(false);
    const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('schedule');
    const [scheduleView, setScheduleView] = useState('checklist');
    const [loading, setLoading] = useState(true);
    const [successToast, setSuccessToast] = useState(null);

    // High-Efficacy & Focus Room States
    const [focusRoomTask, setFocusRoomTask] = useState(null);
    const [focusRoomDay, setFocusRoomDay] = useState(1);
    const [isFocusRoomOpen, setIsFocusRoomOpen] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [addTaskDayNumber, setAddTaskDayNumber] = useState(1);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    useEffect(() => {
        loadStudyPlan();
    }, []);

    const loadStudyPlan = async () => {
        try {
            setLoading(true);
            const res = await api.get('/study-plan');
            if (res.data?.studyPlan) setStudyPlan(res.data.studyPlan);
        } catch (err) {
            console.error('Failed to load study plan:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateDefaultAI = async () => {
        try {
            setIsRegenerating(true);
            const examName = user?.customExamName || user?.targetExamName || 'SSC CGL';
            const res = await api.post('/study-plan/generate', {
                examId: user?.targetExamId || 'exam_ssc_cgl',
                examName,
                targetExamDate: user?.targetExamDate || '2026-11-15',
                dailyStudyMinutes: user?.dailyStudyMinutes || 120,
                targetScore: user?.targetScorePercent || 85,
            });
            if (res.data?.studyPlan) {
                setStudyPlan(res.data.studyPlan);
                showToast('✅ Plan recalibrated with latest performance data!');
            }
        } catch (err) {
            console.error('AI Study plan generation failed:', err);
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleGenerateFromNotes = async (payload) => {
        try {
            setIsRegenerating(true);
            const res = await api.post('/study-plan/generate-from-notes', payload);
            if (res.data?.studyPlan) {
                setStudyPlan(res.data.studyPlan);
                setIsNotesModalOpen(false);
                setActiveTab('schedule');
                showToast(`📚 Organized ${res.data.studyPlan.extractedTopics?.length || 0} topics from "${payload.noteTitle}" into your timetable! (+50 XP)`);
            }
        } catch (err) {
            console.error('Failed to generate study plan from notes:', err);
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleGenerateFromSyllabus = async (payload) => {
        try {
            setIsRegenerating(true);
            const res = await api.post('/study-plan/generate-from-notes', payload);
            if (res.data?.studyPlan) {
                setStudyPlan(res.data.studyPlan);
                setIsSyllabusModalOpen(false);
                setActiveTab('schedule');
                showToast(`🎓 Study plan built from "${payload.examName}" syllabus — ${res.data.studyPlan.extractedTopics?.length || 0} topics extracted! (+50 XP)`);
            }
        } catch (err) {
            console.error('Failed to generate plan from syllabus:', err);
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleSelectSavedNote = async (note) => {
        setIsSavedNotesOpen(false);
        setIsNotesModalOpen(true);
    };

    const handleToggleTask = async (taskId, isCompleted) => {
        try {
            const res = await api.post('/study-plan/task/update', { taskId, status: isCompleted ? 'not_started' : 'done' });
            if (res.data?.studyPlan) {
                setStudyPlan(res.data.studyPlan);
                if (!isCompleted) showToast('🎯 Task completed! +20 XP earned');
            }
        } catch (err) {
            console.error('Toggle task failed:', err);
        }
    };

    const handleTaskUpdate = async (taskId, updates) => {
        try {
            const res = await api.post('/study-plan/task/update', { taskId, ...updates });
            if (res.data?.studyPlan) {
                setStudyPlan(res.data.studyPlan);
                if (updates.status === 'done') showToast('🎯 Task completed! +20 XP earned');
            }
        } catch (err) {
            console.error('Task update failed:', err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const res = await api.post('/study-plan/task/delete', { taskId });
            if (res.data?.studyPlan) {
                setStudyPlan(res.data.studyPlan);
                showToast('🗑️ Task removed from timetable.');
            }
        } catch (err) {
            console.error('Delete task failed:', err);
        }
    };

    const handleCompleteAllDay = async (dayNumber) => {
        try {
            const res = await api.post('/study-plan/day/complete-all', { dayNumber });
            if (res.data?.studyPlan) {
                setStudyPlan(res.data.studyPlan);
                showToast(`🎉 Day ${dayNumber} fully completed! +${res.data.earnedXp || 75} XP & Streak advanced!`);
            }
        } catch (err) {
            console.error('Complete all day failed:', err);
        }
    };

    const handleOpenFocusRoom = (task, dayNumber) => {
        setFocusRoomTask(task);
        setFocusRoomDay(dayNumber);
        setIsFocusRoomOpen(true);
    };

    const handleOpenAddTaskModal = (dayNumber = 1) => {
        setAddTaskDayNumber(dayNumber);
        setIsAddTaskOpen(true);
    };

    const showToast = (msg) => {
        setSuccessToast(msg);
        setTimeout(() => setSuccessToast(null), 3500);
    };

    // ── Computed values ──────────────────────────────────────────────────────
    const isCustomNotesPlan = studyPlan?.planSource === 'uploaded_notes';
    const totalTasksCount = studyPlan?.schedule?.reduce((sum, d) => sum + d.tasks.length, 0) || 0;
    const completedTasksCount = studyPlan?.schedule?.reduce((sum, d) => sum + d.tasks.filter(t => t.isCompleted).length, 0) || 0;
    const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
    const daysLeft = user?.targetExamDate
        ? Math.max(0, Math.ceil((new Date(user.targetExamDate) - new Date()) / 86400000))
        : null;

    // ── Loading state ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="text-sm font-semibold text-slate-500">Loading your personalised preparation roadmap…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 dark:bg-[#0b1120] font-sans">

            {/* ── Toast ─────────────────────────────────────────────────── */}
            {successToast && (
                <div className="fixed right-6 top-6 z-50 flex items-center gap-2.5 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                    </div>
                    {successToast}
                </div>
            )}

            {/* ── Hero Header (Light + Dark Theme) ─────────────────────── */}
            <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 px-4 py-10 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-none dark:bg-[#0b1120]">
                <div className="mx-auto max-w-7xl space-y-8">

                    {/* Top bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                            <Calendar className="h-4 w-4" />
                            Adaptive Study Engine & Timetable Planner
                        </div>
                        <button
                            onClick={() => setIsSavedNotesOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-[#2a3350] dark:bg-[#151b2e] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                        >
                            <FolderOpen className="h-3.5 w-3.5" />
                            My Notes Library
                        </button>
                    </div>

                    {/* Title + description */}
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl font-display">
                                    {studyPlan?.planTitle || 'Personalized Preparation Roadmap'}
                                </h1>
                                {isCustomNotesPlan && (
                                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                                        Custom Notes Timetable
                                    </span>
                                )}
                            </div>
                            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                {isCustomNotesPlan
                                    ? `Structured around your uploaded notes "${studyPlan?.uploadedNoteTitle || 'Notes'}" with personalised daily study slots.`
                                    : `AI-generated daily sessions weighted by your exam (${studyPlan?.examName || user?.targetExamName || 'your exam'}), remaining days, and weak-area data.`}
                            </p>
                            {!studyPlan && (
                                <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    No plan yet. Click <strong>"Generate AI Plan"</strong> to create your personalized schedule.
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsSyllabusModalOpen(true)}
                                disabled={isRegenerating}
                                className="flex items-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 px-5 py-3 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/70"
                            >
                                <BookOpen className="h-4 w-4" />
                                Upload Syllabus (PDF / DOCX / TXT)
                            </button>
                            <button
                                onClick={handleRegenerateDefaultAI}
                                disabled={isRegenerating}
                                title="Recalibrate using your latest analytics data"
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                                {studyPlan ? 'Regenerate AI Plan' : 'Generate AI Plan'}
                            </button>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <StatBadge
                            icon={Clock}
                            label="Daily Study Target"
                            value={studyPlan?.dailyStudyMinutes ? `${Math.round(studyPlan.dailyStudyMinutes / 60)}h ${studyPlan.dailyStudyMinutes % 60 > 0 ? `${studyPlan.dailyStudyMinutes % 60}m` : ''}/day` : '—'}
                            color="indigo"
                        />
                        <StatBadge
                            icon={ListChecks}
                            label="Task Completion"
                            value={`${progressPercent}% (${completedTasksCount}/${totalTasksCount})`}
                            color="emerald"
                        />
                        <StatBadge
                            icon={Calendar}
                            label="Roadmap Duration"
                            value={studyPlan ? `Day ${studyPlan.currentDay || 1} of ${studyPlan.totalDays || '—'}` : '—'}
                            color="purple"
                        />
                        <StatBadge
                            icon={Flame}
                            label={isCustomNotesPlan ? 'Extracted Chapters' : 'Weak Areas Targeted'}
                            value={isCustomNotesPlan
                                ? `${studyPlan?.extractedTopics?.length || 0} Topics`
                                : `${studyPlan?.weakTopicsTargeted?.length || 0} Focus Areas`}
                            color="amber"
                        />
                    </div>

                    {/* Overall progress bar */}
                    {studyPlan && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span>Overall Plan Progress</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}% complete</span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Timetable preferences (custom plans) */}
                    {studyPlan?.timetablePreferences && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Timetable Settings:</span>
                            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] shadow-sm dark:border-slate-700 dark:bg-slate-800">⏱ {studyPlan.timetablePreferences.dailyHours}h Daily</span>
                            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] capitalize shadow-sm">🕐 {studyPlan.timetablePreferences.preferredTimeSlots.join(' & ')}</span>
                            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] capitalize shadow-sm">⚡ {studyPlan.timetablePreferences.studyRhythm.replace('_', ' ')}</span>
                            {studyPlan.timetablePreferences.restDays.length > 0 && (
                                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700 shadow-sm">🌿 Rest: {studyPlan.timetablePreferences.restDays.join(', ')}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Body ──────────────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl space-y-6 px-4 pt-8 sm:px-6 lg:px-8">

                {/* Tabs */}
                <div className="flex gap-6 overflow-x-auto border-b border-slate-200 pb-0 dark:border-slate-800">
                    <TabButton
                        active={activeTab === 'schedule'}
                        onClick={() => setActiveTab('schedule')}
                        icon={Calendar}
                        label={`📅 Daily Schedule (${studyPlan?.schedule?.length || 0} days)`}
                        color="indigo"
                    />
                    <TabButton
                        active={activeTab === 'mastery'}
                        onClick={() => setActiveTab('mastery')}
                        icon={ShieldCheck}
                        label="🎯 Syllabus Mastery & Protocol"
                        color="indigo"
                    />
                    {isCustomNotesPlan && studyPlan?.extractedTopics?.length > 0 && (
                        <TabButton
                            active={activeTab === 'topics_deck'}
                            onClick={() => setActiveTab('topics_deck')}
                            icon={BookOpen}
                            label={`📖 Notes & Formula Deck (${studyPlan.extractedTopics.length})`}
                            color="purple"
                        />
                    )}
                    <TabButton
                        active={activeTab === 'spaced_repetition'}
                        onClick={() => setActiveTab('spaced_repetition')}
                        icon={Brain}
                        label="🧠 Spaced Repetition & Faculty Advice"
                        color="indigo"
                    />
                </div>

                {/* ── Schedule Tab ──────────────────────────────────────── */}
                {activeTab === 'schedule' && (
                    <div className="space-y-6">

                        {/* High-Efficacy Trust Banner */}
                        {studyPlan && (
                            <StudyPlanEfficacyBanner
                                studyPlan={studyPlan}
                                onPlanUpdated={(newPlan) => setStudyPlan(newPlan)}
                                onOpenAddTask={() => handleOpenAddTaskModal(studyPlan?.currentDay || 1)}
                                onOpenPrintModal={() => setIsPrintModalOpen(true)}
                                onOpenFocusRoom={(task, dayNum) => handleOpenFocusRoom(task, dayNum)}
                                showToast={showToast}
                            />
                        )}

                        {/* AI Strategy notes */}
                        {studyPlan?.adaptiveNotes?.length > 0 && (
                            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/30">
                                <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                                    <Brain className="h-4 w-4" />
                                    AI Strategy & Focus Notes
                                </div>
                                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                                    {studyPlan.adaptiveNotes.map((note, i) => (
                                        <li key={i}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* No plan empty state */}
                        {!studyPlan && (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 py-16 dark:border-slate-700">
                                <Calendar className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
                                <h3 className="text-base font-bold text-slate-600 dark:text-slate-300">No Study Plan Yet</h3>
                                <p className="mt-2 max-w-sm text-center text-sm text-slate-400">
                                    Generate an AI-powered plan to get day-by-day study sessions tailored to your exam, target date, and weak topics.
                                </p>
                                <button
                                    onClick={handleRegenerateDefaultAI}
                                    disabled={isRegenerating}
                                    className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    {isRegenerating ? 'Generating…' : 'Generate AI Plan'}
                                </button>
                            </div>
                        )}

                        {/* View Switcher */}
                        {studyPlan && (
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs dark:border-[#2a3350] dark:bg-[#151b2e] w-fit">
                                    {['checklist', 'kanban', 'calendar', 'timeline'].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => setScheduleView(v)}
                                            className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition cursor-pointer ${
                                                scheduleView === v 
                                                    ? 'bg-indigo-50 text-indigo-700 shadow-xs dark:bg-indigo-950/60 dark:text-cyan-400'
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenAddTaskModal(studyPlan?.currentDay || 1)}
                                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-[#2a3350] dark:bg-[#151b2e] dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                                        <span>Add Task</span>
                                    </button>
                                    <button
                                        onClick={() => setIsPrintModalOpen(true)}
                                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-[#2a3350] dark:bg-[#151b2e] dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                                    >
                                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Print Schedule</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Day cards (Checklist View) */}
                        {studyPlan && scheduleView === 'checklist' && (
                            <div className="space-y-4">
                            {studyPlan?.schedule?.map((day) => {
                                const completedInDay = day.tasks.filter(t => t.isCompleted).length;
                                const dayProgress = day.tasks.length > 0 ? Math.round((completedInDay / day.tasks.length) * 100) : 0;
                                const isToday = day.dayNumber === (studyPlan.currentDay || 1);

                                return (
                                    <div
                                        key={day.dayNumber}
                                        className={`rounded-2xl border shadow-xs transition-all ${
                                            day.isCompleted
                                                ? 'border-slate-200 bg-slate-50 opacity-85 dark:border-[#2a3350] dark:bg-[#151b2e]/60'
                                                : day.isRestDay
                                                    ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                                                    : isToday
                                                        ? 'border-indigo-300 bg-white shadow-indigo-100 dark:border-indigo-800 dark:bg-[#151b2e] dark:shadow-none'
                                                        : 'border-slate-200/80 bg-white dark:border-[#2a3350] dark:bg-[#151b2e]'
                                        }`}
                                    >
                                        {/* Day header */}
                                        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 dark:border-[#2a3350] sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white font-mono tabular-nums ${
                                                    day.isRestDay ? 'bg-emerald-500' : isToday ? 'bg-[#4f46e5]' : 'bg-slate-700'
                                                }`}>
                                                    {day.dayNumber}
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                            {day.focusTitle}
                                                        </h3>
                                                        {isToday && (
                                                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                                                TODAY
                                                            </span>
                                                        )}
                                                        {day.isRestDay && (
                                                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                                                Rest Day 🌿
                                                            </span>
                                                        )}
                                                        {day.isCompleted && (
                                                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                                                <CheckCircle2 className="h-3 w-3" /> Done
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        {day.date} · {day.totalMinutes} min planned
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Day actions & progress */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                {!day.isCompleted && day.tasks.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCompleteAllDay(day.dayNumber)}
                                                        className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 transition"
                                                    >
                                                        <CheckSquare className="w-3.5 h-3.5" />
                                                        <span>Complete Day (+XP)</span>
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenAddTaskModal(day.dayNumber)}
                                                    className="flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                                                    title="Add custom task to this day"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    <span>Add Task</span>
                                                </button>
                                                <div className="flex flex-col items-end gap-1 text-xs">
                                                    <span className="font-semibold text-slate-500">
                                                        {completedInDay}/{day.tasks.length} tasks
                                                    </span>
                                                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-500 transition-all"
                                                            style={{ width: `${dayProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tasks list */}
                                        <div className="space-y-3 p-5">
                                            {day.tasks.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`flex flex-col gap-4 rounded-xl border p-4 transition lg:flex-row lg:items-center lg:justify-between ${
                                                        task.isCompleted
                                                            ? 'border-slate-200 bg-slate-50/60 opacity-70 dark:border-[#2a3350] dark:bg-[#151b2e]/40'
                                                            : 'border-slate-200 bg-white shadow-xs hover:border-indigo-300 dark:border-[#2a3350] dark:bg-[#151b2e]'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3.5 flex-1">
                                                        {/* Checkbox */}
                                                        <button
                                                            onClick={() => handleToggleTask(task.id, task.isCompleted)}
                                                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition cursor-pointer ${
                                                                task.isCompleted
                                                                    ? 'bg-emerald-600 text-white'
                                                                    : 'border-2 border-slate-300 hover:border-indigo-600 dark:border-[#2a3350]'
                                                            }`}
                                                        >
                                                            {task.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                                                        </button>

                                                        {/* Task content */}
                                                        <div className="space-y-1.5 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                {task.timeSlot && (
                                                                    <span className="rounded-md border border-indigo-200/60 bg-indigo-50 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-700 dark:border-[#2a3350] dark:bg-[#1e293b] dark:text-cyan-400 tabular-nums">
                                                                        ⏰ {task.timeSlot}
                                                                    </span>
                                                                )}
                                                                <span className={`text-sm font-bold ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                                                                    {cleanTopicTitle(task.topicName)}
                                                                </span>
                                                                <ActivityTypePill type={task.activityType} />
                                                                {task.priority === 'high' && (
                                                                    <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                                                        🔥 High Yield
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {task.taskObjective && (
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    🎯 {task.taskObjective}
                                                                </p>
                                                            )}

                                                            {task.extractedCheatNotes && (
                                                                <div className="rounded-lg border border-amber-200/60 bg-amber-50/70 px-3 py-2 font-mono text-[11px] text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                                                                    💡 {task.extractedCheatNotes}
                                                                </div>
                                                            )}

                                                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono tabular-nums">
                                                                <span className="font-sans">📚 {task.subjectName}</span>
                                                                <span>⏱ {task.durationMinutes} min</span>
                                                                <span>🎯 {task.targetQuestionsCount || 10} questions</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Task Action Group: Focus Mode + Start Drill + Delete */}
                                                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenFocusRoom(task, day.dayNumber)}
                                                            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-[#2a3350] dark:bg-[#1e293b] dark:text-cyan-400 dark:hover:bg-slate-800 transition cursor-pointer"
                                                            title="Launch Pomodoro Focus Session with ambient sounds"
                                                        >
                                                            <Brain className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
                                                            <span>Focus Study</span>
                                                        </button>

                                                        <Link
                                                            to={`/practice?mode=topic&topicId=${task.topicId}`}
                                                            className="flex items-center gap-1.5 rounded-lg bg-[#4f46e5] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-600"
                                                        >
                                                            <Play className="h-3 w-3 fill-white" />
                                                            <span>Drill</span>
                                                        </Link>

                                                        {task.id.startsWith('custom_task_') && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteTask(task.id)}
                                                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                                                title="Delete this custom task"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        )}

                        {/* Additional Views */}
                        {studyPlan && scheduleView === 'kanban' && <KanbanView studyPlan={studyPlan} onTaskUpdate={handleTaskUpdate} />}
                        {studyPlan && scheduleView === 'calendar' && (
                            <CalendarView
                                studyPlan={studyPlan}
                                onTaskUpdate={handleTaskUpdate}
                                onOpenFocusRoom={handleOpenFocusRoom}
                                onOpenAddTask={handleOpenAddTaskModal}
                            />
                        )}
                        {studyPlan && scheduleView === 'timeline' && <TimelineView studyPlan={studyPlan} />}
                    </div>
                )}

                {/* ── Mastery & Protocol Tab ────────────────────────────── */}
                {activeTab === 'mastery' && studyPlan && (
                    <SyllabusCoverageMatrix
                        studyPlan={studyPlan}
                        onOpenFocusRoom={(task) => handleOpenFocusRoom(task, studyPlan.currentDay || 1)}
                    />
                )}

                {/* ── Topics Deck Tab ──────────────────────────────────── */}
                {activeTab === 'topics_deck' && studyPlan?.extractedTopics && (
                    <ExtractedTopicsDeck
                        topics={studyPlan.extractedTopics}
                        noteTitle={studyPlan.uploadedNoteTitle || 'My Study Notes'}
                        onPracticeTopic={(topicName) => navigate(`/practice?mode=topic&search=${encodeURIComponent(topicName)}`)}
                    />
                )}

                {/* ── Spaced Repetition Tab ─────────────────────────────── */}
                {activeTab === 'spaced_repetition' && (
                    <SpacedRepetitionRoadmap
                        spacedPlan={studyPlan?.spacedRepetitionPlan}
                        facultyTips={studyPlan?.facultyTips}
                    />
                )}
            </div>

            {/* ── Modals ────────────────────────────────────────────────── */}
            <NotesTimetableGeneratorModal
                isOpen={isNotesModalOpen}
                onClose={() => setIsNotesModalOpen(false)}
                onGenerate={handleGenerateFromNotes}
                isGenerating={isRegenerating}
                selectedExamId={studyPlan?.examId || user?.targetExamId || 'exam_ssc_cgl'}
            />
            <SavedNotesLibraryModal
                isOpen={isSavedNotesOpen}
                onClose={() => setIsSavedNotesOpen(false)}
                onSelectNote={handleSelectSavedNote}
            />
            <SyllabusUploaderModal
                isOpen={isSyllabusModalOpen}
                onClose={() => setIsSyllabusModalOpen(false)}
                onGenerate={handleGenerateFromSyllabus}
                isGenerating={isRegenerating}
                defaultExamName={studyPlan?.examName || user?.customExamName || user?.targetExamName || 'SSC CGL'}
            />
            <FocusStudyRoomModal
                isOpen={isFocusRoomOpen}
                onClose={() => setIsFocusRoomOpen(false)}
                task={focusRoomTask}
                dayNumber={focusRoomDay}
                onTaskCompleted={(taskId, updatedPlan) => {
                    if (updatedPlan) {
                        setStudyPlan(updatedPlan);
                    }
                    showToast('🎉 Focus study session logged & task completed! +XP awarded');
                }}
            />
            <AddTaskModal
                isOpen={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
                dayNumber={addTaskDayNumber}
                scheduleLength={studyPlan?.schedule?.length || 30}
                onTaskAdded={(updatedPlan) => {
                    setStudyPlan(updatedPlan);
                    showToast('✨ Custom study task added to timetable (+15 XP)');
                }}
            />
            <PrintableTimetableModal
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                studyPlan={studyPlan}
            />
        </div>
    );
};

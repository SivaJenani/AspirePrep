import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Award, BarChart2, ChevronRight, Clock3, RotateCcw, Sparkles,
    AlertTriangle, Zap, BookOpen, Target, TrendingUp, CheckCircle2,
    PlayCircle, CalendarDays, Brain, ListChecks, Flame, Star,
    Trophy, Edit3, Clock, GraduationCap, Crosshair, Timer
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../lib/api';

const MetricCard = ({ label, value, tone, hint }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
        <div className={`mt-2 text-2xl font-bold ${tone}`}>{value}</div>
        {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
);

const InfoBadge = ({ color, children }) => (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${color}`}>
        {children}
    </span>
);

/** Circular SVG countdown ring */
const CountdownRing = ({ percent, daysLeft, urgent }) => {
    const r = 44;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;
    const color = urgent ? '#ef4444' : daysLeft < 30 ? '#f59e0b' : '#3b82f6';
    return (
        <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" className="-rotate-90">
                <circle cx="55" cy="55" r={r} fill="none" stroke="currentColor" strokeWidth="8"
                    className="text-slate-200 dark:text-slate-800" />
                <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black leading-none" style={{ color }}>{daysLeft ?? '—'}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">days</span>
            </div>
        </div>
    );
};

export const DashboardPage = () => {
    const { user, topicProgress } = useAppStore();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [studyPlan, setStudyPlan] = useState(null);
    const [revisions, setRevisions] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [anRes, planRes, revRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/study-plan'),
                    api.get('/revisions')
                ]);
                setAnalytics(anRes.data?.analytics || null);
                setStudyPlan(planRes.data?.studyPlan || null);
                setRevisions(revRes.data?.revisions || []);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            }
        };
        load();
    }, []);

    const progressList = Object.values(topicProgress || {}).filter(
        (item) => !user?.targetExamId || item.examId === user?.targetExamId || user?.targetExamId === 'exam_custom'
    );
    const masteredCount = progressList.filter((item) => item.status === 'mastered').length;
    const completedCount = progressList.filter((item) => item.status === 'completed').length;
    const inProgressCount = progressList.filter((item) => item.status === 'in_progress').length;
    const coveredTopicsCount = masteredCount + completedCount;
    const totalTracked = progressList.length;
    const syllabusPercent = totalTracked > 0
        ? Math.min(100, Math.round(((masteredCount + completedCount + inProgressCount * 0.5) / Math.max(totalTracked, 8)) * 100))
        : 0;

    const weakTopics = (analytics?.weakTopics || []).filter(
        (item) => !user?.targetExamId || item.examName === user?.targetExamName || user?.targetExamId === 'exam_custom' || !item.examName
    );
    const todayTask = studyPlan?.schedule?.[0];
    const dueRevisions = revisions.filter((item) => item.status === 'due' || (item.intervalStage || 0) <= 3);

    // Days left calculation
    const daysLeft = user?.targetExamDate
        ? Math.max(0, Math.ceil((new Date(user.targetExamDate) - new Date()) / (1000 * 60 * 60 * 24)))
        : null;

    // For the ring: if total window is 365d, compute how much is remaining
    const totalWindow = studyPlan?.totalDays || 365;
    const ringPercent = daysLeft !== null
        ? Math.min(100, Math.round((daysLeft / Math.max(totalWindow, daysLeft, 1)) * 100))
        : 0;
    const isUrgent = daysLeft !== null && daysLeft <= 7;

    const xp = user?.xp || 0;
    const streak = user?.streakDays || 0;
    const targetScore = user?.targetScorePercent || studyPlan?.targetScore || 0;
    const dailyGoal = user?.dailyStudyMinutes || 120;
    const examName = user?.targetExamName || studyPlan?.examName || null;
    const examDate = user?.targetExamDate || null;

    const getInitials = (name = 'User') =>
        name.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50 pb-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto max-w-7xl space-y-6 px-4 pt-8 sm:px-6 lg:px-8">

                {/* ══════════════════════════════════════════════════
                    YOUR TARGET HERO BANNER
                ══════════════════════════════════════════════════ */}
                <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    {/* decorative blobs */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 rounded-full bg-slate-100 blur-2xl" />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                        {/* Left: user identity + target info */}
                        <div className="flex flex-1 flex-col gap-5">
                            {/* User row */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-md">
                                    {user?.avatar
                                        ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-2xl object-cover" />
                                        : getInitials(user?.name || 'User')
                                    }
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-500">Your Target</p>
                                    <h1 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                                        {user?.name?.split(' ')[0] || 'Aspirant'}'s Study Dashboard
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || ''}</p>
                                </div>
                            </div>

                            {/* Target data grid */}
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {/* Exam */}
                                <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <GraduationCap className="h-3 w-3" /> Target Exam
                                    </div>
                                    <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                        {examName || <span className="font-normal text-slate-400 text-xs">Not set</span>}
                                    </div>
                                </div>

                                {/* Exam Date */}
                                <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <CalendarDays className="h-3 w-3" /> Exam Date
                                    </div>
                                    <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                        {examDate
                                            ? new Date(examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : <span className="font-normal text-slate-400 text-xs">Not set</span>
                                        }
                                    </div>
                                </div>

                                {/* Target Score */}
                                <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <Crosshair className="h-3 w-3" /> Target Score
                                    </div>
                                    <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                        {targetScore ? `${targetScore}%` : <span className="font-normal text-slate-400 text-xs">Not set</span>}
                                    </div>
                                </div>

                                {/* Daily Goal */}
                                <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        <Timer className="h-3 w-3" /> Daily Goal
                                    </div>
                                    <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                        {dailyGoal} <span className="text-xs font-normal text-slate-500">min/day</span>
                                    </div>
                                </div>
                            </div>

                            {/* XP + Streak badges */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    {xp.toLocaleString()} XP
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    {streak} day streak
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                                    <Trophy className="h-4 w-4 text-emerald-500" />
                                    {syllabusPercent}% covered
                                </div>
                                <Link to="/profile" className="ml-auto flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <Edit3 className="h-3 w-3" /> Edit Goals
                                </Link>
                            </div>
                        </div>

                        {/* Right: countdown ring */}
                        <div className="flex shrink-0 flex-col items-center gap-2 self-center md:pl-4">
                            <CountdownRing percent={ringPercent} daysLeft={daysLeft} urgent={isUrgent} />
                            <p className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                                {daysLeft === null
                                    ? 'Set your exam date'
                                    : daysLeft === 0
                                        ? '🎯 Exam day!'
                                        : isUrgent
                                            ? '🔥 Final stretch!'
                                            : 'until exam'
                                }
                            </p>
                            {daysLeft !== null && (
                                <Link to="/mock-tests" className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 shadow-sm transition hover:bg-blue-100">
                                    <Award className="h-3.5 w-3.5" /> Mock Test
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    METRIC CARDS
                ══════════════════════════════════════════════════ */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Questions Solved"
                        value={analytics?.totalQuestionsSolved?.toLocaleString?.() || '0'}
                        tone="text-slate-900 dark:text-white"
                        hint="Total attempts for your exam"
                    />
                    <MetricCard
                        label="Avg. Accuracy"
                        value={`${analytics?.overallAccuracy ?? 0}%`}
                        tone="text-emerald-500"
                        hint={analytics?.overallAccuracy >= 70 ? '✓ Above target' : 'Target: 70%+'}
                    />
                    <MetricCard
                        label="Study Time"
                        value={analytics?.totalStudyMinutes ? `${Math.floor(analytics.totalStudyMinutes / 60)}h ${analytics.totalStudyMinutes % 60}m` : '0m'}
                        tone="text-blue-500"
                        hint={`Goal: ${dailyGoal} min/day`}
                    />
                    <MetricCard
                        label="Syllabus Coverage"
                        value={`${syllabusPercent}%`}
                        tone="text-purple-500"
                        hint={`${coveredTopicsCount} of ${totalTracked} topics done`}
                    />
                </div>

                {/* ══════════════════════════════════════════════════
                    MAIN GRID
                ══════════════════════════════════════════════════ */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Left col (2/3) */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Today section */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-500" />
                                    <h2 className="text-base font-bold">Today's Focus</h2>
                                    <InfoBadge color="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">From your plan</InfoBadge>
                                </div>
                                <Link to="/study-plan" className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">
                                    Open full plan →
                                </Link>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                Your AI study plan schedules what to study each day based on your exam date, weak areas, and time available.
                            </p>
                            {todayTask ? (
                                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-white">
                                                {todayTask.focusTitle || todayTask.title || 'Scheduled session'}
                                            </div>
                                            <div className="mt-1 text-sm text-slate-500">
                                                {todayTask.totalMinutes ? `${todayTask.totalMinutes} min` : ''}{todayTask.tasks?.length ? ` · ${todayTask.tasks.length} tasks` : ''}
                                            </div>
                                        </div>
                                        <Link to="/study-plan" className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500">
                                            <PlayCircle className="h-3 w-3" /> Start
                                        </Link>
                                    </div>
                                    {todayTask.tasks?.slice(0, 3).map((task, i) => (
                                        <div key={i} className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                            <ListChecks className="h-3 w-3 shrink-0" />
                                            {task.topicName || task.subjectName} — {task.durationMinutes} min
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-5 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="h-8 w-8 shrink-0 text-slate-300 dark:text-slate-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">No study plan generated yet</div>
                                            <div className="mt-0.5 text-xs text-slate-400">Generate an AI plan once and it will schedule your daily sessions automatically.</div>
                                        </div>
                                    </div>
                                    <Link to="/study-plan" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500">
                                        Generate AI Plan <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Weak Topics section */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="h-5 w-5 text-rose-500" />
                                    <h2 className="text-base font-bold">Weak Topics</h2>
                                    <InfoBadge color="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Auto-detected</InfoBadge>
                                </div>
                                <Link to="/analytics" className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">Full analysis →</Link>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                Topics where your accuracy dropped below 60% over 2+ attempts. These are automatically prioritized in your study plan.
                            </p>
                            {weakTopics.length > 0 ? (
                                <div className="mt-4 space-y-3">
                                    {weakTopics.map((item) => (
                                        <div key={item.topicId || item.topicName} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Brain className="h-4 w-4 text-amber-500" />
                                                    <div className="font-semibold">{item.topicName}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs font-bold text-amber-700 dark:text-amber-300">{item.accuracy}% accuracy</div>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.recommendedAction}</p>
                                            <Link to={`/practice?mode=topic&topicId=${item.topicId}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                                Practice this topic <ChevronRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-5 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <Target className="h-8 w-8 shrink-0 text-slate-300 dark:text-slate-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">No weak topics detected yet</div>
                                            <div className="mt-0.5 text-xs text-slate-400">
                                                Solve at least 2 questions on any topic — if your score is below 60%, it will appear here automatically.
                                            </div>
                                        </div>
                                    </div>
                                    <Link to="/practice" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-400">
                                        Start Practice <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Quick Status section */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-emerald-500" />
                                <h2 className="text-base font-bold">Syllabus Progress</h2>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                Tracks topics you have marked as in-progress, completed, or mastered for your exam.
                            </p>
                            <div className="mt-4 grid gap-3 text-sm">
                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <BookOpen className="h-4 w-4" />
                                        <span>Topics tracked</span>
                                    </div>
                                    <span className="font-bold">{totalTracked}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/20">
                                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Completed / Mastered</span>
                                    </div>
                                    <span className="font-bold text-emerald-600">{coveredTopicsCount}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/20">
                                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>Due for revision</span>
                                    </div>
                                    <span className="font-bold text-amber-600">{dueRevisions.length}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right col (1/3) */}
                    <div className="space-y-6">

                        {/* Plan section */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Clock3 className="h-5 w-5 text-blue-500" />
                                <h2 className="text-base font-bold">Your Study Plan</h2>
                            </div>
                            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                                Your AI-generated plan breaks down your preparation into daily sessions — covering all subjects proportionally based on your exam date and target score.
                            </p>
                            {studyPlan ? (
                                <div className="mt-4 space-y-2 text-xs text-slate-500">
                                    <div className="flex justify-between">
                                        <span>Exam</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{studyPlan.examName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Daily target</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{studyPlan.dailyStudyMinutes} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duration</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{studyPlan.totalDays} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Target score</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{studyPlan.targetScore}%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-3 text-xs text-slate-400 dark:border-slate-700">
                                    No plan yet. Go to Study Plan and click "Generate AI Plan" to create one.
                                </div>
                            )}
                            <Link to="/study-plan" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
                                View full schedule <ChevronRight className="h-4 w-4" />
                            </Link>
                        </section>

                        {/* Study Actions section */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-500" />
                                <h2 className="text-base font-bold">Quick Actions</h2>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">Jump straight into your prep.</p>
                            <div className="mt-4 grid gap-2 text-sm">
                                <Link to="/practice" className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-semibold transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/50">
                                    <PlayCircle className="h-4 w-4 text-blue-500" />
                                    <div>
                                        <div>Start Practice</div>
                                        <div className="text-[11px] font-normal text-slate-400">Topic-wise or random questions</div>
                                    </div>
                                </Link>
                                <Link to="/mock-tests" className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-semibold transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/50">
                                    <Award className="h-4 w-4 text-emerald-500" />
                                    <div>
                                        <div>Mock Tests</div>
                                        <div className="text-[11px] font-normal text-slate-400">Full timed exam simulation</div>
                                    </div>
                                </Link>
                                <Link to="/analytics" className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-semibold transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/50">
                                    <TrendingUp className="h-4 w-4 text-purple-500" />
                                    <div>
                                        <div>Analytics</div>
                                        <div className="text-[11px] font-normal text-slate-400">Subject & topic performance</div>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

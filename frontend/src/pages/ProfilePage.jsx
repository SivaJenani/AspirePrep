import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    BadgeCheck,
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    Save,
    Target,
    TrendingUp,
    Trophy,
    UserCircle2,
    Award,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { evaluateUserBadges } from '../utils/achievementsEngine';
import { api } from '../lib/api';

const CUSTOM_EXAM_ID = 'exam_custom';

const examOptions = [
    { id: 'exam_ssc_cgl', name: 'SSC CGL' },
    { id: 'exam_upsc_cse', name: 'UPSC Civil Services' },
    { id: 'exam_ibps_po', name: 'IBPS PO' },
    { id: 'exam_tnpsc_group4', name: 'TNPSC Group 4' },
    { id: 'exam_rrb_ntpc', name: 'RRB NTPC' },
    { id: 'exam_jee_main', name: 'JEE Main' },
    { id: CUSTOM_EXAM_ID, name: 'Other / Custom exam' }
];

const getInitials = (name = 'User') =>
    name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export const ProfilePage = () => {
    const navigate = useNavigate();
    const {
        user,
        setUser,
        topicProgress,
        mistakes,
        flashcards,
        duelWins,
        duelLosses,
        userUnlockedBadges
    } = useAppStore();

    const evaluatedBadges = useMemo(() => {
        return evaluateUserBadges({
            user,
            topicProgress,
            mistakes,
            flashcards,
            duelWins,
            duelLosses,
            userUnlockedState: userUnlockedBadges
        });
    }, [user, topicProgress, mistakes, flashcards, duelWins, duelLosses, userUnlockedBadges]);

    const unlockedCount = useMemo(() => evaluatedBadges.filter(b => b.isUnlocked).length, [evaluatedBadges]);
    const topBadges = useMemo(() => {
        const featured = evaluatedBadges.filter(b => b.isFeatured);
        if (featured.length > 0) return featured;
        return evaluatedBadges.filter(b => b.isUnlocked).slice(0, 3);
    }, [evaluatedBadges]);

    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [targetExamId, setTargetExamId] = useState(examOptions[0].id);
    const [customExamName, setCustomExamName] = useState('');
    const [targetExamDate, setTargetExamDate] = useState('');
    const [dailyStudyMinutes, setDailyStudyMinutes] = useState(120);
    const [targetScorePercent, setTargetScorePercent] = useState(80);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isCustomExam = targetExamId === CUSTOM_EXAM_ID;

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const isPresetExam = examOptions.some((exam) => exam.id === user.targetExamId);
        setName(user.name || '');
        setAvatar(user.avatar || '');
        setTargetExamId(isPresetExam ? (user.targetExamId || examOptions[0].id) : CUSTOM_EXAM_ID);
        setCustomExamName(user.customExamName || (!isPresetExam ? user.targetExamName || '' : ''));
        setTargetExamDate(user.targetExamDate || '');
        setDailyStudyMinutes(user.dailyStudyMinutes || 120);
        setTargetScorePercent(user.targetScorePercent || 80);
    }, [user, navigate]);

    const selectedExam = useMemo(() => {
        if (targetExamId === CUSTOM_EXAM_ID) {
            return {
                id: CUSTOM_EXAM_ID,
                name: customExamName.trim() || user?.targetExamName || 'Custom exam'
            };
        }

        return examOptions.find((exam) => exam.id === targetExamId) || examOptions[0];
    }, [targetExamId, customExamName, user?.targetExamName]);

    const profileInitials = getInitials(name || user?.name || 'User');
    const roleLabel = user?.role === 'admin' ? 'Faculty Admin' : 'Active Aspirant';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/auth');
            return;
        }

        if (isCustomExam && !customExamName.trim()) {
            setError('Please enter your exam name.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setIsSaving(true);

            const resolvedCustomName = isCustomExam ? customExamName.trim() : '';
            const updates = {
                name: name.trim() || user.name,
                avatar: avatar.trim(),
                targetExamId,
                targetExamName: resolvedCustomName,
                customExamName: resolvedCustomName,
                targetExamDate,
                dailyStudyMinutes: Number(dailyStudyMinutes),
                targetScorePercent: Number(targetScorePercent)
            };

            const res = await api.put('/auth/profile', updates);
            if (res.data?.user) {
                setUser(res.data.user);
            }
            setSuccess('Profile updated successfully.');
        } catch (err) {
            setError(err?.response?.data?.error || err?.message || 'Could not save profile right now.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3 border-b border-slate-200/70 pb-5 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Profile</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Edit your study profile</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            Keep your account details, target exam, and study goals in one clean place.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <BadgeCheck className="h-4 w-4 text-emerald-500" />
                        Connected account
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
                            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-black text-white shadow-lg">
                                {avatar ? (
                                    <img src={avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
                                ) : (
                                    profileInitials
                                )}
                                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-600 shadow">
                                    <Camera className="h-3.5 w-3.5" />
                                </div>
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2 className="truncate text-2xl font-extrabold text-slate-900 dark:text-white">{name || 'User'}</h2>
                                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {roleLabel}
                                    </span>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                        Target: {selectedExam.name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">XP</div>
                                <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{user.xp || 0}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Streak</div>
                                <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{user.streakDays || 0}d</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target date</div>
                                <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">{user.targetExamDate || 'Not set'}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target score</div>
                                <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">{user.targetScorePercent || 0}%</div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                            <div className="flex items-center gap-2 text-sm font-bold text-blue-800 dark:text-blue-300">
                                <Trophy className="h-4 w-4" />
                                Profile status
                            </div>
                            <p className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                                Your study profile is live and ready to be updated whenever your target changes.
                            </p>
                        </div>

                        {/* Achievements & Badges Showcase Box */}
                        <div className="mt-6 rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-indigo-500/10 p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-amber-500" />
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                        Showcase Badges ({unlockedCount} Earned)
                                    </h3>
                                </div>
                                <Link
                                    to="/achievements"
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                                >
                                    All Badges <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            {topBadges.length === 0 ? (
                                <div className="text-center py-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        No badges earned yet. Complete your first study session or quiz!
                                    </p>
                                    <Link
                                        to="/achievements"
                                        className="inline-block mt-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400"
                                    >
                                        Explore Achievement Milestones &rarr;
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2.5">
                                    {topBadges.map((badge) => (
                                        <div
                                            key={badge.id}
                                            className="rounded-2xl bg-white dark:bg-slate-900 p-3 text-center border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-between"
                                        >
                                            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${badge.tierDetails.color} flex items-center justify-center text-white mb-1.5 shadow-sm text-xs`}>
                                                <Award className="h-5 w-5" />
                                            </div>
                                            <div className="text-[11px] font-black truncate w-full text-slate-900 dark:text-white">
                                                {badge.title}
                                            </div>
                                            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                                                +{badge.rewardXp} XP
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Editable profile</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Update the fields below and save to keep your account in sync.
                                </p>
                            </div>
                            <UserCircle2 className="h-6 w-6 text-slate-400" />
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            {error && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                                    {success}
                                </div>
                            )}

                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <UserCircle2 className="h-4 w-4" />
                                        Display name
                                    </span>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:focus:bg-slate-900"
                                        placeholder="Your name"
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <Camera className="h-4 w-4" />
                                        Avatar URL
                                    </span>
                                    <input
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:focus:bg-slate-900"
                                        placeholder="https://..."
                                    />
                                </label>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <Target className="h-4 w-4" />
                                        Target exam
                                    </span>
                                    <select
                                        value={targetExamId}
                                        onChange={(e) => setTargetExamId(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:focus:bg-slate-900"
                                    >
                                        {examOptions.map((exam) => (
                                            <option key={exam.id} value={exam.id}>
                                                {exam.name}
                                            </option>
                                        ))}
                                    </select>
                                    {isCustomExam && (
                                        <input
                                            value={customExamName}
                                            onChange={(e) => setCustomExamName(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:focus:bg-slate-900"
                                            placeholder="Type your exam name"
                                            required
                                        />
                                    )}
                                </label>

                                <label className="space-y-2">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                        Target date
                                    </span>
                                    <input
                                        type="date"
                                        value={targetExamDate}
                                        onChange={(e) => setTargetExamDate(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:focus:bg-slate-900"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Target score
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-300">{targetScorePercent}%</span>
                                    </span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={targetScorePercent}
                                        onChange={(e) => setTargetScorePercent(Number(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                </label>

                                <label className="space-y-2">
                                    <span className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Daily study commitment
                                        </span>
                                        <span className="text-amber-600 dark:text-amber-300">
                                            {Math.floor(dailyStudyMinutes / 60)}h {dailyStudyMinutes % 60}m
                                        </span>
                                    </span>
                                    <input
                                        type="range"
                                        min="30"
                                        max="480"
                                        step="30"
                                        value={dailyStudyMinutes}
                                        onChange={(e) => setDailyStudyMinutes(Number(e.target.value))}
                                        className="w-full accent-amber-500"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Changes update your live account profile
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-60"
                                >
                                    {isSaving ? 'Saving...' : 'Save profile'}
                                    <Save className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useMemo } from 'react';
import {
    Award,
    BookOpen,
    CheckCircle2,
    Clock,
    Crown,
    Filter,
    Flame,
    GraduationCap,
    Lock,
    Medal,
    Moon,
    Pin,
    Search,
    Share2,
    ShieldCheck,
    Sparkles,
    SunMedium,
    Swords,
    Target,
    TrendingUp,
    Trophy,
    Video,
    Zap,
    Star,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { evaluateUserBadges } from '../utils/achievementsEngine';
import { BADGE_CATEGORIES, BADGE_TIERS } from '../data/achievementsData';

// Icon Map helper
const ICON_MAP = {
    SunMedium,
    Moon,
    Flame,
    Crown,
    Award,
    Zap,
    Target,
    Sparkles,
    ShieldCheck,
    Swords,
    Trophy,
    BookOpen,
    GraduationCap,
    TrendingUp,
    Medal,
    Video
};

export const AchievementsPage = () => {
    const {
        user,
        topicProgress,
        mistakes,
        flashcards,
        duelWins,
        duelLosses,
        userUnlockedBadges,
        claimBadgeReward,
        toggleFeaturedBadge,
        recordHabitActivity
    } = useAppStore();

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all'); // all | unlocked | in_progress | claimable
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBadgeModal, setSelectedBadgeModal] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Calculate all evaluated badges dynamically
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

    // Statistics
    const totalBadges = evaluatedBadges.length;
    const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
    const claimableCount = evaluatedBadges.filter((b) => b.isUnlocked && !b.isClaimed).length;
    const featuredCount = evaluatedBadges.filter((b) => b.isFeatured).length;

    const totalXpFromBadges = evaluatedBadges
        .filter((b) => b.isUnlocked)
        .reduce((sum, b) => sum + b.rewardXp, 0);

    const userXp = user?.xp || 0;
    const userLevel = Math.floor(userXp / 250) + 1;
    const xpForNextLevel = userLevel * 250;
    const xpProgressPercent = Math.min(100, Math.round(((userXp % 250) / 250) * 100));

    // Filtered Badges
    const filteredBadges = useMemo(() => {
        return evaluatedBadges.filter((b) => {
            // Category filter
            if (selectedCategory !== 'all' && b.category !== selectedCategory) {
                return false;
            }
            // Status filter
            if (statusFilter === 'unlocked' && !b.isUnlocked) return false;
            if (statusFilter === 'in_progress' && b.isUnlocked) return false;
            if (statusFilter === 'claimable' && (!b.isUnlocked || b.isClaimed)) return false;

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = b.title.toLowerCase().includes(q);
                const matchDesc = b.description.toLowerCase().includes(q);
                const matchTier = b.tier.toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchTier) return false;
            }
            return true;
        });
    }, [evaluatedBadges, selectedCategory, statusFilter, searchQuery]);

    const handleClaim = (e, badge) => {
        e.stopPropagation();
        claimBadgeReward(badge.id, badge.rewardXp);
        triggerToast(`🎉 Claimed +${badge.rewardXp} XP for unlocking '${badge.title}'!`);
    };

    const handlePinToggle = (e, badge) => {
        e.stopPropagation();
        const success = toggleFeaturedBadge(badge.id);
        if (!success) {
            triggerToast('⚠️ You can feature up to 3 badges on your profile.');
        } else {
            const isNowFeatured = !badge.isFeatured;
            triggerToast(
                isNowFeatured
                    ? `📌 Featured '${badge.title}' on your profile!`
                    : `Unpinned '${badge.title}' from profile.`
            );
        }
    };

    const handleQuickHabitSim = (type, label) => {
        recordHabitActivity(type, { isPerfect: true });
        triggerToast(`⚡ Activity recorded: ${label}! Milestone progress updated.`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-200">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3.5 shadow-2xl border border-slate-700/50 dark:border-slate-200 animate-bounce">
                    <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
                    <span className="text-sm font-bold">{toastMessage}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-2xl border border-indigo-900/40">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1.5 text-xs font-bold text-indigo-300 border border-indigo-400/30">
                                <Trophy className="h-4 w-4 text-amber-400" />
                                Aspirant Achievements & Milestone Badges
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                                Earn Your Badges, <br />
                                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-indigo-300 bg-clip-text text-transparent">
                                    Conquer Exam Milestones
                                </span>
                            </h1>
                            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-medium">
                                Build strong daily study habits, solve practice sets, master mistake logs, and maintain streaks to earn badges and bonus XP.
                            </p>

                            {/* Level Progress */}
                            <div className="pt-2 max-w-md">
                                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                                    <span className="text-amber-300 flex items-center gap-1.5">
                                        <Crown className="h-4 w-4 text-amber-400" />
                                        Level {userLevel} Scholar
                                    </span>
                                    <span className="text-slate-300">{userXp} / {xpForNextLevel} XP</span>
                                </div>
                                <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-indigo-400 rounded-full transition-all duration-500"
                                        style={{ width: `${xpProgressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Top Summary Stat Grid */}
                        <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="text-xs font-bold uppercase tracking-wider">Unlocked</span>
                                    <Award className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl sm:text-3xl font-black text-white">{unlockedCount} / {totalBadges}</div>
                                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                                        {Math.round((unlockedCount / totalBadges) * 100)}% Badges Earned
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="text-xs font-bold uppercase tracking-wider">Badge XP</span>
                                    <Sparkles className="h-5 w-5 text-indigo-300" />
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl sm:text-3xl font-black text-amber-300">+{totalXpFromBadges}</div>
                                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">Total Reward XP</div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                                    <Flame className="h-5 w-5 text-orange-400" />
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl sm:text-3xl font-black text-white">{user?.streakDays || 1} Days</div>
                                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">Current Streak</div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="text-xs font-bold uppercase tracking-wider">Claimable</span>
                                    <GiftIcon className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl sm:text-3xl font-black text-emerald-300">{claimableCount}</div>
                                    <div className="text-[11px] text-slate-300 font-medium mt-0.5">Ready to Claim</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Habit Testing & Quick Action Tracker Bar */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                                Log Study Habits & Test Progress
                            </h2>
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Log sessions to instantly update habits and trigger badge unlocks
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <button
                            type="button"
                            onClick={() => handleQuickHabitSim('early_bird', 'Early Bird Morning Study')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/20 px-3 py-2.5 text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition active:scale-95 cursor-pointer"
                        >
                            <SunMedium className="h-4 w-4 text-amber-500 shrink-0" />
                            <span>Log Early Session</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleQuickHabitSim('night_owl', 'Night Owl Evening Study')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-indigo-50/60 dark:bg-indigo-950/20 px-3 py-2.5 text-xs font-bold text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition active:scale-95 cursor-pointer"
                        >
                            <Moon className="h-4 w-4 text-indigo-500 shrink-0" />
                            <span>Log Night Session</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleQuickHabitSim('test_completed', 'Practice Quiz Completed')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-50/60 dark:bg-emerald-950/20 px-3 py-2.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition active:scale-95 cursor-pointer"
                        >
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>Log Quiz Session</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleQuickHabitSim('video_explainer', '3D Concept Explainer Session')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-purple-50/60 dark:bg-purple-950/20 px-3 py-2.5 text-xs font-bold text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition active:scale-95 cursor-pointer"
                        >
                            <Video className="h-4 w-4 text-purple-500 shrink-0" />
                            <span>Log 3D Video</span>
                        </button>
                    </div>
                </div>

                {/* Main Filter & Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                        {BADGE_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                                    selectedCategory === cat.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Right Filter & Search controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Status Toggle */}
                        <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'unlocked', label: 'Unlocked' },
                                { id: 'in_progress', label: 'In Progress' },
                                { id: 'claimable', label: `Claimable (${claimableCount})` }
                            ].map((st) => (
                                <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => setStatusFilter(st.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                        statusFilter === st.id
                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    {st.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search badges..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Featured Showcase Drawer if any */}
                {featuredCount > 0 && (
                    <div className="rounded-3xl border border-amber-300/40 dark:border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-indigo-500/10 p-5 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Pin className="h-5 w-5 text-amber-500" />
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    Showcase Badges ({featuredCount}/3)
                                </h3>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Displayed on your public aspirant profile
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {evaluatedBadges
                                .filter((b) => b.isFeatured)
                                .map((badge) => {
                                    const IconComponent = ICON_MAP[badge.iconName] || Award;
                                    return (
                                        <div
                                            key={badge.id}
                                            onClick={() => setSelectedBadgeModal(badge)}
                                            className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer"
                                        >
                                            <div className={`h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br ${badge.tierDetails.color} flex items-center justify-center text-white shadow-md`}>
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="truncate font-extrabold text-sm text-slate-900 dark:text-white">
                                                        {badge.title}
                                                    </span>
                                                    <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                                </div>
                                                <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {badge.tierDetails.name} • +{badge.rewardXp} XP
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}

                {/* Badge Grid */}
                {filteredBadges.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900/50">
                        <Lock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No badges match criteria</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                            Try adjusting your search terms or category filters to explore all available study milestones.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {filteredBadges.map((badge) => {
                            const IconComponent = ICON_MAP[badge.iconName] || Award;
                            const isLocked = !badge.isUnlocked;
                            const canClaim = badge.isUnlocked && !badge.isClaimed;

                            return (
                                <div
                                    key={badge.id}
                                    onClick={() => setSelectedBadgeModal(badge)}
                                    className={`relative group rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                                        isLocked
                                            ? 'bg-slate-100/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-85 hover:opacity-100'
                                            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1'
                                    }`}
                                >
                                    {/* Top Badge Header Bar */}
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                {/* Badge Icon Container */}
                                                <div
                                                    className={`relative h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 ${
                                                        isLocked
                                                            ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                                            : `bg-gradient-to-br ${badge.tierDetails.color}`
                                                    }`}
                                                >
                                                    <IconComponent className="h-7 w-7" />
                                                    {isLocked && (
                                                        <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                                                            <Lock className="h-5 w-5 text-slate-200" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.tierDetails.badgeBg}`}>
                                                        {badge.tierDetails.name} Tier
                                                    </span>
                                                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 leading-snug">
                                                        {badge.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Pin Showcase Toggle */}
                                            {badge.isUnlocked && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handlePinToggle(e, badge)}
                                                    title={badge.isFeatured ? 'Unpin from showcase' : 'Pin to showcase'}
                                                    className={`p-2 rounded-xl transition cursor-pointer ${
                                                        badge.isFeatured
                                                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300'
                                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <Pin className={`h-4 w-4 ${badge.isFeatured ? 'fill-amber-500' : ''}`} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                                            {badge.description}
                                        </p>
                                    </div>

                                    {/* Progress & Actions Section */}
                                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                        {/* Progress Bar */}
                                        <div>
                                            <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                                                <span className="text-slate-500 dark:text-slate-400">
                                                    Progress: {badge.currentProgress} / {badge.targetCount} {badge.unit}
                                                </span>
                                                <span className={badge.isUnlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                                                    {badge.percent}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        badge.isUnlocked
                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                                            : 'bg-indigo-500'
                                                    }`}
                                                    style={{ width: `${badge.percent}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action Button Row */}
                                        <div className="flex items-center justify-between gap-2 pt-1">
                                            {canClaim ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleClaim(e, badge)}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md hover:from-emerald-500 hover:to-teal-500 transition active:scale-95 cursor-pointer"
                                                >
                                                    <Sparkles className="h-4 w-4" />
                                                    Claim +{badge.rewardXp} XP Reward
                                                </button>
                                            ) : badge.isUnlocked ? (
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Unlocked & Claimed
                                                    </span>
                                                    <span className="text-[11px] font-medium text-slate-400">
                                                        +{badge.rewardXp} XP
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        <Lock className="h-3.5 w-3.5" />
                                                        Locked Milestone
                                                    </span>
                                                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                                                        View Tip <ChevronRight className="h-3 w-3" />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Badge Detail Modal */}
            {selectedBadgeModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSelectedBadgeModal(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6"
                    >
                        <div className="text-center space-y-3">
                            {/* Icon */}
                            <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl">
                                {React.createElement(ICON_MAP[selectedBadgeModal.iconName] || Award, { className: 'h-10 w-10' })}
                            </div>

                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${selectedBadgeModal.tierDetails.badgeBg}`}>
                                {selectedBadgeModal.tierDetails.name} Tier Milestone
                            </span>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                {selectedBadgeModal.title}
                            </h3>

                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                {selectedBadgeModal.description}
                            </p>
                        </div>

                        {/* Tip Box */}
                        <div className="rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 p-4 border border-indigo-200/60 dark:border-indigo-900/50 flex items-start gap-3">
                            <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                                <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">How to Earn</div>
                                <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-0.5 font-medium">
                                    {selectedBadgeModal.hint}
                                </p>
                            </div>
                        </div>

                        {/* Modal Action Footer */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                            {selectedBadgeModal.isUnlocked && !selectedBadgeModal.isClaimed ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        handleClaim(e, selectedBadgeModal);
                                        setSelectedBadgeModal(null);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-lg hover:bg-emerald-500 transition cursor-pointer"
                                >
                                    Claim +{selectedBadgeModal.rewardXp} XP
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setSelectedBadgeModal(null)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-sm transition cursor-pointer"
                                >
                                    Close Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper GiftIcon component
const GiftIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
);

export default AchievementsPage;

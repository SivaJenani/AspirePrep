import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Award,
    BadgeCheck,
    BarChart2,
    BookOpen,
    Brain,
    Calendar,
    ChevronDown,
    ChevronRight,
    GraduationCap,
    LayoutGrid,
    LogOut,
    Menu,
    Moon,
    RotateCcw,
    Shield,
    Swords,
    Sun,
    Target,
    TrendingUp,
    UserRound,
    Video,
    X,
    Zap,
    Flame,
    Trophy,
    Eye,
    EyeOff,
    Crosshair,
    Maximize2,
    Minimize2,
    Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';


const primaryNavLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Target },
    { label: 'Syllabus', path: '/syllabus', icon: BookOpen },
    { label: 'Exams', path: '/exams', icon: GraduationCap },
    { label: 'Practice', path: '/practice', icon: Zap },
    { label: 'Mock Tests', path: '/mock-tests', icon: Award }
];

const prepToolsLinks = [
    { label: 'Achievements & Badges', path: '/achievements', icon: Trophy, desc: 'Habit milestones & XP badges' },
    { label: 'Syllabus Database & Periods', path: '/syllabus', icon: BookOpen, desc: 'Topic-wise database & study period workspace' },
    { label: 'AI Video Generator', path: '/video-generator', icon: Video, desc: 'Video generation workspace' },
    { label: '1v1 Speed Duel Arena', path: '/speed-duel', icon: Swords, desc: 'Fast quiz battles' },
    { label: 'Mistake Notebook', path: '/mistakes', icon: RotateCcw, desc: 'Review incorrect answers' },
    { label: 'University Exam Prep', path: '/university-prep', icon: GraduationCap, desc: 'Semester prep tools' },
    { label: 'AIR Cutoff Predictor', path: '/cutoff-predictor', icon: TrendingUp, desc: 'Cutoff and rank preview' },
    { label: 'Formula Deck & Mnemonics', path: '/formula-deck', icon: LayoutGrid, desc: 'Flashcards and recall' },
    { label: '5-Year PYQ Trends', path: '/pyq-trends', icon: BarChart2, desc: 'Question frequency trends' },
    { label: 'AI Doubt Tutor', path: '/ai-tutor', icon: Brain, desc: 'Step-by-step help' },
    { label: 'Learning Progress & Analytics', path: '/learning-progress', icon: BarChart2, desc: 'Syllabus completion & weak areas' },
    { label: 'Study Roadmap Planner', path: '/study-plan', icon: Calendar, desc: 'Build a study plan' }
];

const mobileQuickLinks = [
    { label: 'AI Tutor', path: '/ai-tutor', icon: Brain },
    { label: 'Profile', path: '/profile', icon: UserRound },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Study Plan', path: '/study-plan', icon: Calendar },
    { label: 'Speed Duel', path: '/speed-duel', icon: Swords }
];

const getInitials = (name = 'User') =>
    name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

export const Navbar = () => {
    const { user, isDarkMode, toggleDarkMode, isFocusMode, toggleFocusMode, logout } = useAppStore();
    const location = useLocation();

    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

    const toolsDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
                setIsToolsMenuOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsToolsMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    const activeToolExists = useMemo(
        () => prepToolsLinks.some((tool) => location.pathname.startsWith(tool.path)),
        [location.pathname]
    );

    const profileRoleLabel = user?.role === 'admin' ? 'Faculty Admin' : 'Active Aspirant';
    const profileAccent = user?.role === 'admin' ? 'from-amber-600 to-orange-600' : 'from-orange-500 to-amber-500';
    const profileStats = [
        { label: 'XP', value: user?.xp || 0 },
        { label: 'Streak', value: `${user?.streakDays || 0}d` },
        { label: 'Target', value: user?.targetExamName || 'Unset' }
    ];

    const renderToolLink = (tool) => {
        const Icon = tool.icon;
        const active = location.pathname.startsWith(tool.path);

        return (
            <Link
                key={tool.path}
                to={tool.path}
                onClick={() => setIsToolsMenuOpen(false)}
                className={`flex items-start gap-3 rounded-2xl p-3 transition ${
                    active
                        ? 'bg-blue-50 text-blue-950 dark:bg-blue-950/55 dark:text-blue-100'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80'
                }`}
            >
                <div className="mt-0.5 shrink-0 rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                    <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="min-w-0">
                    <span className="block truncate font-bold text-slate-900 dark:text-white">{tool.label}</span>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{tool.desc}</p>
                </div>
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 transition-all duration-300">
            {/* Top Banner */}
            <div className="bg-slate-950 text-slate-300 dark:bg-black">
                <div className="w-full flex h-10 items-center justify-between gap-3 px-4 text-[11px] font-medium sm:px-6 lg:px-8 xl:px-12">
                    <div className="flex min-w-0 items-center gap-3 truncate">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-white shadow-sm transition-colors hover:bg-white/20">
                            <Flame className="h-3.5 w-3.5 text-amber-400" />
                            {user?.targetExamName || 'Set your target exam'}
                        </span>
                        <span className="hidden sm:inline text-slate-600">|</span>
                        <span className="hidden sm:inline truncate">
                            Clean workspace for practice, tracking, and revision
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/speed-duel"
                            className="hidden lg:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                        >
                            <Swords className="h-3.5 w-3.5 text-amber-400" />
                            1v1 Speed Duel
                        </Link>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 transition-colors hover:bg-white/10">
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="hidden sm:inline">Live profile</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Left: Logo */}
                    <div className="flex min-w-0 items-center shrink-0 xl:w-[210px]">
                        <Link to="/" className="flex shrink-0 items-center gap-3 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transition-transform group-hover:-translate-y-0.5 group-hover:shadow-lg">
                                <span className="text-xl font-black">A</span>
                            </div>
                            <div className="min-w-0">
                                <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                                    Aspire<span className="text-orange-500 dark:text-orange-400">Prep</span>
                                </div>
                                <div className="hidden text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:block">
                                    Adaptive exam workspace
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Clean Segmented Navigation Dock */}
                    <nav aria-label="Main Navigation" className="hidden flex-1 items-center justify-center lg:flex">
                        <div className="inline-flex items-center gap-0.5 xl:gap-1 rounded-2xl border border-slate-200/80 bg-slate-100/75 p-1 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                            {primaryNavLinks.map((link) => {
                                const Icon = link.icon;
                                const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-bold tracking-tight transition-all duration-150 xl:px-3.5 xl:py-2 xl:text-sm ${
                                            active
                                                ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                                                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${active ? 'text-orange-500 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}

                            {!isFocusMode && (
                                <>
                                    {/* Clean Divider */}
                                    <div className="mx-1 h-4 w-px bg-slate-200/90 dark:bg-slate-800" aria-hidden="true" />

                                    {/* Prep Tools Dropdown */}
                                    <div className="relative" ref={toolsDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsToolsMenuOpen((v) => !v)}
                                            className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-bold tracking-tight transition-all duration-150 xl:px-3.5 xl:py-2 xl:text-sm cursor-pointer ${
                                                activeToolExists
                                                    ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                                                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                                            }`}
                                        >
                                            <LayoutGrid className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
                                            <span>Prep Tools</span>
                                            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`} />
                                        </button>

                                        {isToolsMenuOpen && (
                                            <div className="absolute left-1/2 z-50 mt-3.5 w-[36rem] -translate-x-1/2 rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95">
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                    {prepToolsLinks.map(renderToolLink)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* AI Tutor */}
                                    <Link
                                        to="/ai-tutor"
                                        id="nav-ai-tutor-link"
                                        className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all duration-150 xl:px-3 xl:py-2 xl:text-sm ${
                                            location.pathname.startsWith('/ai-tutor')
                                                ? 'bg-purple-600 text-white shadow-xs'
                                                : 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/60'
                                        }`}
                                    >
                                        <Brain className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                        <span>AI Tutor</span>
                                    </Link>

                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all duration-150 xl:px-3 xl:py-2 xl:text-sm ${
                                                location.pathname.startsWith('/admin')
                                                    ? 'bg-violet-600 text-white shadow-xs'
                                                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                                            }`}
                                        >
                                            <Shield className={`h-4 w-4 shrink-0 ${location.pathname.startsWith('/admin') ? 'opacity-100' : 'opacity-70'}`} />
                                            <span>Admin</span>
                                        </Link>
                                    )}
                                </>
                            )}

                            {isFocusMode && (
                                <div className="hidden xl:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold">
                                    <Crosshair className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
                                    <span>Focus Mode Active</span>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right side Actions */}
                    <div className="hidden items-center justify-end gap-2.5 lg:flex shrink-0">
                        {/* Focus Mode Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleFocusMode}
                            title={isFocusMode ? 'Exit Focus Mode (Show all navigation)' : 'Enter Focus Mode (Hide distracting nav)'}
                            className={`inline-flex h-10 px-3.5 items-center gap-2 rounded-full border text-xs font-black transition-all active:scale-95 cursor-pointer ${
                                isFocusMode
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                                    : 'border-slate-200/90 bg-slate-100/70 text-slate-700 hover:bg-slate-200/90 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                        >
                            {isFocusMode ? (
                                <>
                                    <EyeOff className="h-4 w-4 text-white" />
                                    <span>Focus ON</span>
                                </>
                            ) : (
                                <>
                                    <Crosshair className="h-4 w-4 text-indigo-500" />
                                    <span>Focus</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            id="header-theme-toggle-desktop"
                            onClick={toggleDarkMode}
                            role="switch"

                            aria-checked={isDarkMode}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-slate-100/70 text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-200/90 hover:text-slate-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-amber-400 dark:hover:bg-slate-800 dark:hover:text-amber-300 dark:focus-visible:ring-offset-slate-950"
                        >
                            {isDarkMode ? (
                                <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                            ) : (
                                <Moon className="h-4.5 w-4.5 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
                            )}
                            <span className="sr-only">
                                {isDarkMode ? 'Dark mode enabled. Click to switch to light mode.' : 'Light mode enabled. Click to switch to dark mode.'}
                            </span>
                        </button>

                        {user ? (
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsUserMenuOpen((v) => !v)}
                                    className="group flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/50 p-1 pr-3 shadow-sm backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white hover:shadow dark:border-slate-700/80 dark:bg-slate-900/50 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                                >
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${user?.role === 'admin' ? 'from-violet-600 to-fuchsia-600' : 'from-blue-600 to-cyan-500'} text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-950 transition-transform group-hover:scale-105`}>
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <div className="max-w-[110px] truncate text-xs font-bold text-slate-900 dark:text-white">
                                            {user.name?.split(' ')[0] || 'User'}
                                        </div>
                                    </div>
                                    <ChevronDown className="ml-1 h-3.5 w-3.5 text-slate-400 transition-transform group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 z-50 mt-3 w-[22rem] overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95">
                                        <div className={`bg-gradient-to-br ${profileAccent} px-5 py-5 text-white`}>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/15 ring-2 ring-white/20 shadow-inner">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-lg font-black">{getInitials(user.name)}</span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-lg font-black leading-tight">{user.name || 'User'}</p>
                                                        <p className="truncate text-[12px] font-medium text-white/80 mt-0.5">{user.email || 'No email linked'}</p>
                                                    </div>
                                                </div>
                                                <div className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                                                    {profileRoleLabel}
                                                </div>
                                            </div>

                                            <div className="mt-5 grid grid-cols-3 gap-2">
                                                {profileStats.map((stat) => (
                                                    <div key={stat.label} className="rounded-2xl bg-black/10 px-3 py-2 text-center backdrop-blur-sm shadow-inner transition-colors hover:bg-black/20">
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">{stat.label}</div>
                                                        <div className="mt-1 text-sm font-black text-white">{stat.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                                    <UserRound className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-white">Profile Settings</p>
                                                    <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">Edit name, avatar, and goals</p>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/achievements"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                                    <Trophy className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-white">Achievements & Badges</p>
                                                    <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">Habit milestones & XP rewards</p>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                                    <Target className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 dark:text-white">Target Dashboard</p>
                                                    <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">Track your current plan</p>
                                                </div>
                                            </Link>
                                            <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-800"></div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    logout();
                                                    navigate('/auth');
                                                }}
                                                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                                    <LogOut className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold">Sign out</p>
                                                    <p className="truncate text-xs font-medium text-rose-500/80 dark:text-rose-400/80">End your session</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                            >
                                <UserRound className="h-4 w-4" />
                                Sign in
                            </Link>
                        )}
                    </div>

                    {/* Mobile Header Actions */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            type="button"
                            id="header-theme-toggle-mobile"
                            onClick={toggleDarkMode}
                            role="switch"
                            aria-checked={isDarkMode}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-slate-100/70 text-slate-700 shadow-sm transition-all hover:bg-slate-200/90 hover:text-slate-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-amber-400 dark:hover:bg-slate-800 dark:hover:text-amber-300 dark:focus-visible:ring-offset-slate-950"
                        >
                            {isDarkMode ? (
                                <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                            ) : (
                                <Moon className="h-4.5 w-4.5 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
                            )}
                            <span className="sr-only">
                                {isDarkMode ? 'Dark mode enabled. Click to switch to light mode.' : 'Light mode enabled. Click to switch to dark mode.'}
                            </span>
                        </button>

                        <button
                            type="button"
                            id="mobile-menu-toggle-btn"
                            onClick={() => setIsMobileMenuOpen((v) => !v)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="border-t border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 xl:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="grid gap-2">
                            {primaryNavLinks.map((link) => {
                                const Icon = link.icon;
                                const active = location.pathname === link.path || location.pathname.startsWith(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                            active
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {link.label}
                                        </span>
                                        <ChevronRight className="h-4 w-4 opacity-70" />
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                            <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Prep Tools
                            </div>
                            <div className="grid gap-2">
                                {prepToolsLinks.map((tool) => {
                                    const Icon = tool.icon;
                                    const active = location.pathname.startsWith(tool.path);
                                    return (
                                        <Link
                                            key={tool.path}
                                            to={tool.path}
                                            className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition ${
                                                active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <span className="flex min-w-0 items-center gap-3">
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span className="truncate font-semibold">{tool.label}</span>
                                            </span>
                                            <ChevronRight className="h-4 w-4 opacity-70" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                id="drawer-theme-toggle-btn"
                                onClick={toggleDarkMode}
                                role="switch"
                                aria-checked={isDarkMode}
                                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600 dark:text-slate-300" />}
                                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                            {user ? (
                                <Link
                                    to="/profile"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                                >
                                    <UserRound className="h-4 w-4" />
                                    Profile
                                </Link>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                                >
                                    <UserRound className="h-4 w-4" />
                                    Sign in
                                </Link>
                            )}
                        </div>

                        {user && (
                            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${user?.role === 'admin' ? 'from-violet-600 to-fuchsia-600' : 'from-blue-600 to-cyan-500'} text-white`}>
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full rounded-2xl object-cover" />
                                        ) : (
                                            <span className="text-xs font-black">{getInitials(user.name)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-extrabold text-slate-900 dark:text-white">{user.name || 'User'}</p>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.targetExamName || 'Set your target exam'}</p>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {profileStats.map((stat) => (
                                        <div key={stat.label} className="rounded-2xl bg-slate-50 px-3 py-2 text-center dark:bg-slate-950">
                                            <div className="text-[10px] uppercase tracking-wider text-slate-400">{stat.label}</div>
                                            <div className="text-sm font-black text-slate-900 dark:text-white">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        logout();
                                        navigate('/auth');
                                    }}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

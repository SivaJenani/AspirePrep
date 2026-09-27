import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart2,
    Zap,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Target,
    Clock,
    BookOpen,
    Brain,
    Layers,
    Award,
    Flame,
    Filter,
    ArrowUpRight,
    RefreshCw,
    Download,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
import { CompetencyRadar } from '../components/analytics/CompetencyRadar';
import { SyllabusCompletionMatrix } from '../components/analytics/SyllabusCompletionMatrix';
import { WeakAreaDiagnosticMatrix } from '../components/analytics/WeakAreaDiagnosticMatrix';
import { SpeedAccuracyQuadrant } from '../components/analytics/SpeedAccuracyQuadrant';
import { TrajectoryTrends } from '../components/analytics/TrajectoryTrends';
import { StudyTimeRhythm } from '../components/analytics/StudyTimeRhythm';
import { MlPredictiveEngine } from '../components/analytics/MlPredictiveEngine';

export const AnalyticsPage = () => {
    const { user } = useAppStore();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'syllabus' | 'weak_areas' | 'trajectory'
    const [timeframe, setTimeframe] = useState('30d'); // '7d' | '30d' | 'all'
    const [selectedExam, setSelectedExam] = useState(user?.targetExamName || 'SSC CGL');

    useEffect(() => {
        loadAnalytics();
    }, [user?.targetExamId]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/overview');
            if (res.data?.analytics) {
                setAnalytics(res.data.analytics);
            }
        } catch (err) {
            console.error('Failed to load learning progress analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !analytics) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-20">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span className="text-sm font-bold">Computing syllabus completion & weak-area models...</span>
                </div>
            </div>
        );
    }

    const readinessScore = analytics.examReadinessScore || 82;
    const syllabusPct = analytics.syllabusCompletion?.overallPercentage || 58;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300">
            {/* Top Navigation & Header */}
            <div className="bg-white border-b border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                <BarChart2 className="w-4 h-4" />
                                <span>Learning Progress & Diagnostics</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Syllabus Completion & Weak-Area Intelligence
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                                Real-time Recharts visualization of topic mastery, subject competencies, negative mark liabilities, and automated remedial prescriptions.
                            </p>
                        </div>

                        {/* Top Action Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                                <button
                                    onClick={() => setTimeframe('7d')}
                                    className={`rounded-lg px-2.5 py-1 transition ${
                                        timeframe === '7d'
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white font-bold shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                                    }`}
                                >
                                    7 Days
                                </button>
                                <button
                                    onClick={() => setTimeframe('30d')}
                                    className={`rounded-lg px-2.5 py-1 transition ${
                                        timeframe === '30d'
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white font-bold shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                                    }`}
                                >
                                    30 Days
                                </button>
                                <button
                                    onClick={() => setTimeframe('all')}
                                    className={`rounded-lg px-2.5 py-1 transition ${
                                        timeframe === 'all'
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white font-bold shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                                    }`}
                                >
                                    All Time
                                </button>
                            </div>

                            <Link
                                to="/practice?mode=weak"
                                className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Remedial Drill</span>
                            </Link>
                        </div>
                    </div>

                    {/* Projected Exam Readiness & Key Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                        {/* Readiness Score Card */}
                        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-4.5 text-white shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                                    Readiness Score
                                </span>
                                <ShieldCheck className="h-4 w-4 text-indigo-200" />
                            </div>
                            <div className="my-2">
                                <div className="text-3xl font-black">{readinessScore}<span className="text-lg font-normal text-indigo-200">/100</span></div>
                                <span className="text-[11px] font-semibold text-indigo-100">
                                    {readinessScore >= 80 ? 'High Cutoff Clearance Chance' : 'Accelerate Weak Topics'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-300 rounded-full" style={{ width: `${readinessScore}%` }} />
                            </div>
                        </div>

                        {/* Syllabus Completed */}
                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4.5 shadow-xs">
                            <span className="text-xs text-slate-500 font-semibold block">Syllabus Covered</span>
                            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                                {syllabusPct}%
                            </div>
                            <span className="text-[11px] text-slate-400">
                                {analytics.syllabusCompletion?.masteredTopicsCount || 10} of {analytics.syllabusCompletion?.totalTopicsCount || 24} Topics
                            </span>
                        </div>

                        {/* Overall Accuracy */}
                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4.5 shadow-xs">
                            <span className="text-xs text-slate-500 font-semibold block">Overall Accuracy</span>
                            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                                {analytics.overallAccuracy}%
                            </div>
                            <span className="text-[11px] text-slate-400">
                                Target Benchmark: 85%
                            </span>
                        </div>

                        {/* Flagged Weak Areas */}
                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4.5 shadow-xs">
                            <span className="text-xs text-slate-500 font-semibold block">Weak Areas</span>
                            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                                {analytics.weakTopics?.length || 0} Topics
                            </div>
                            <span className="text-[11px] text-rose-500 font-medium">
                                Accuracy &lt; 65%
                            </span>
                        </div>

                        {/* Total Solved & Time */}
                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4.5 shadow-xs">
                            <span className="text-xs text-slate-500 font-semibold block">Total Solved</span>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                                {analytics.totalQuestionsSolved} Qs
                            </div>
                            <span className="text-[11px] text-slate-400">
                                Avg {analytics.averageTimePerQuestion}s / question
                            </span>
                        </div>
                    </div>

                    {/* View Navigation Tabs */}
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pt-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold border-b-2 transition ${
                                activeTab === 'overview'
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Layers className="h-4 w-4" />
                            <span>Executive Overview</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('syllabus')}
                            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold border-b-2 transition ${
                                activeTab === 'syllabus'
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Syllabus Completion ({syllabusPct}%)</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('weak_areas')}
                            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold border-b-2 transition ${
                                activeTab === 'weak_areas'
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <AlertTriangle className="h-4 w-4 text-rose-500" />
                            <span>Weak-Area Diagnostic Matrix ({analytics.weakTopics?.length || 0})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('trajectory')}
                            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold border-b-2 transition ${
                                activeTab === 'trajectory'
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <TrendingUp className="h-4 w-4" />
                            <span>Speed & Trajectory</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('ml_engine')}
                            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold border-b-2 transition ${
                                activeTab === 'ml_engine'
                                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Brain className="h-4 w-4 text-cyan-500 animate-pulse" />
                            <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent font-extrabold">
                                ML Model Studio & Rank Predictor
                            </span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                {/* 1. EXECUTIVE OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Section A: Syllabus Completion & Competency Radar */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <SyllabusCompletionMatrix
                                    subjectPerformance={analytics.subjectPerformance}
                                    syllabusCompletion={analytics.syllabusCompletion}
                                />
                            </div>

                            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        Subject Competency Radar
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        Your accuracy vs. 85% target vs. peer average
                                    </p>
                                </div>
                                <CompetencyRadar subjectPerformance={analytics.subjectPerformance} />
                            </div>
                        </div>

                        {/* Section B: Automated Weak Area Diagnostic */}
                        <WeakAreaDiagnosticMatrix weakTopics={analytics.weakTopics} />

                        {/* Section C: Speed vs Accuracy Quadrant & Trends */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SpeedAccuracyQuadrant efficiencyMatrix={analytics.efficiencyMatrix} />
                            <TrajectoryTrends scoreTrend={analytics.scoreTrend} accuracyTrend={analytics.accuracyTrend} />
                        </div>

                        {/* Section D: Weekly Study Rhythm & Mastered Topics */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <StudyTimeRhythm studyTimeTrend={analytics.studyTimeTrend} streakDays={analytics.currentStreakDays} />
                            </div>

                            <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            Mastered Strong Areas (&ge; 75% Accuracy)
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Topics where you consistently score above competitive cutoff benchmark
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                        {analytics.strongTopics?.length || 0} Mastered
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {(analytics.strongTopics || []).map((topic, tIdx) => (
                                        <div
                                            key={topic.topicId || tIdx}
                                            className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {topic.topicName}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {topic.subjectName}
                                                </p>
                                            </div>
                                            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                                                {topic.accuracy}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SYLLABUS TAB */}
                {activeTab === 'syllabus' && (
                    <div className="space-y-8 animate-fade-in">
                        <SyllabusCompletionMatrix
                            subjectPerformance={analytics.subjectPerformance}
                            syllabusCompletion={analytics.syllabusCompletion}
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                                    Competency Radar by Subject Module
                                </h4>
                                <CompetencyRadar subjectPerformance={analytics.subjectPerformance} />
                            </div>
                            <StudyTimeRhythm studyTimeTrend={analytics.studyTimeTrend} streakDays={analytics.currentStreakDays} />
                        </div>
                    </div>
                )}

                {/* 3. WEAK AREAS TAB */}
                {activeTab === 'weak_areas' && (
                    <div className="space-y-8 animate-fade-in">
                        <WeakAreaDiagnosticMatrix weakTopics={analytics.weakTopics} />
                        <SpeedAccuracyQuadrant efficiencyMatrix={analytics.efficiencyMatrix} />
                    </div>
                )}

                {/* 4. TRAJECTORY & SPEED TAB */}
                {activeTab === 'trajectory' && (
                    <div className="space-y-8 animate-fade-in">
                        <TrajectoryTrends scoreTrend={analytics.scoreTrend} accuracyTrend={analytics.accuracyTrend} />
                        <SpeedAccuracyQuadrant efficiencyMatrix={analytics.efficiencyMatrix} />
                    </div>
                )}

                {/* 5. ML MODEL STUDIO & RANK PREDICTOR TAB */}
                {activeTab === 'ml_engine' && (
                    <div className="animate-fade-in">
                        <MlPredictiveEngine user={user} />
                    </div>
                )}
            </div>
        </div>
    );
};


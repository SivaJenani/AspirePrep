import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target,
    Calendar,
    Clock,
    ChevronRight,
    CheckCircle2,
    TrendingUp,
    Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../lib/api';

const CUSTOM_EXAM_ID = 'exam_custom';

const exams = [
    { id: 'exam_ssc_cgl', name: 'SSC CGL' },
    { id: 'exam_upsc_cse', name: 'UPSC Civil Services' },
    { id: 'exam_ibps_po', name: 'IBPS PO' },
    { id: 'exam_tnpsc_group4', name: 'TNPSC Group 4' },
    { id: 'exam_rrb_ntpc', name: 'RRB NTPC' },
    { id: 'exam_jee_main', name: 'JEE Main' },
    { id: CUSTOM_EXAM_ID, name: 'Other / Custom exam' }
];

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const { fetchCurrentUser } = useAppStore();
    const [targetExamId, setTargetExamId] = useState(exams[0].id);
    const [customExamName, setCustomExamName] = useState('');
    const [targetExamDate, setTargetExamDate] = useState('2026-11-15');
    const [dailyStudyMinutes, setDailyStudyMinutes] = useState(120);
    const [targetScorePercent, setTargetScorePercent] = useState(80);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isCustomExam = targetExamId === CUSTOM_EXAM_ID;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isCustomExam && !customExamName.trim()) {
            setError('Please enter your exam name.');
            return;
        }

        try {
            setError('');
            setIsSubmitting(true);
            const resolvedCustomName = isCustomExam ? customExamName.trim() : '';
            const updates = {
                targetExamId,
                targetExamName: resolvedCustomName,
                customExamName: resolvedCustomName,
                targetExamDate,
                dailyStudyMinutes,
                targetScorePercent
            };

            await api.put('/auth/profile', updates);
            await fetchCurrentUser();
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to save onboarding data', err);
            setError(err?.response?.data?.error || err?.message || 'Could not save your profile right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#080c14] text-white flex items-center justify-center p-4 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e3a5f_0%,_#080c14_60%)]" />
            <div className="relative z-10 w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 mb-4">
                        <Sparkles className="w-4 h-4" />
                        New profile setup
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                        Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AspirePrep</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Let's set up your personalized study plan.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                            <Target className="w-4 h-4 text-blue-400" />
                            Target Exam
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {exams.map((exam) => (
                                <button
                                    key={exam.id}
                                    type="button"
                                    onClick={() => setTargetExamId(exam.id)}
                                    className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                                        targetExamId === exam.id
                                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    {exam.name}
                                    {targetExamId === exam.id && <CheckCircle2 className="w-4 h-4 mt-1 mx-auto text-blue-400" />}
                                </button>
                            ))}
                        </div>
                        {isCustomExam && (
                            <input
                                value={customExamName}
                                onChange={(e) => setCustomExamName(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none focus:border-blue-500 transition-colors"
                                placeholder="Type your exam name"
                                required
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                Exam Date
                            </label>
                            <input
                                type="date"
                                value={targetExamDate}
                                onChange={(e) => setTargetExamDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-200 outline-none focus:border-purple-500 transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                Target Score (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={targetScorePercent}
                                onChange={(e) => setTargetScorePercent(parseInt(e.target.value, 10))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between text-sm font-bold text-slate-300">
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                Daily Study Commitment
                            </span>
                            <span className="text-amber-400">
                                {Math.floor(dailyStudyMinutes / 60)}h {dailyStudyMinutes % 60}m
                            </span>
                        </label>
                        <input
                            type="range"
                            min="30"
                            max="480"
                            step="30"
                            value={dailyStudyMinutes}
                            onChange={(e) => setDailyStudyMinutes(parseInt(e.target.value, 10))}
                            className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>30 min</span>
                            <span>8 hours</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving Profile...' : 'Complete Profile & Start'}
                        {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

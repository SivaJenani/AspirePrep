import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, GraduationCap, Lock, Mail, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

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

export const AuthPage = () => {
    const navigate = useNavigate();
    const { loginWithEmailPassword, registerWithEmailPassword, signInWithGoogle } = useAppStore();

    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [targetExamId, setTargetExamId] = useState(examOptions[0].id);
    const [customExamName, setCustomExamName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isCustomExam = targetExamId === CUSTOM_EXAM_ID;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'register' && isCustomExam && !customExamName.trim()) {
            setError('Please enter your exam name.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (mode === 'register') {
                const resolvedCustomName = isCustomExam ? customExamName.trim() : '';
                await registerWithEmailPassword({
                    name: name.trim() || 'New Aspirant',
                    email: email.trim(),
                    password,
                    targetExamId,
                    customExamName: resolvedCustomName,
                    targetExamName: resolvedCustomName
                });
                navigate('/onboarding');
            } else {
                await loginWithEmailPassword(email.trim(), password);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err?.response?.data?.error || err?.message || 'Authentication failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center px-4 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e3a5f_0%,_#080c14_60%)]" />
            <div className="relative z-10 w-full max-w-3xl grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 mb-6">
                        <Sparkles className="w-4 h-4" />
                        New user setup
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
                        Create your AspirePrep <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">account</span>
                    </h1>
                    <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-400">
                        Sign in with email and password, then set your target exam and profile details. Your account keeps its own progress history.
                    </p>
                    <div className="mt-8 space-y-3">
                        <button
                            type="button"
                            onClick={() => signInWithGoogle()}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            <GraduationCap className="w-4 h-4" />
                            Continue with Google
                        </button>
                        <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                            Demo login has been removed. Use login or registration to begin.
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                    <div className="mb-6 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                                mode === 'login' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                                mode === 'register' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                        >
                            Create account
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 pr-12"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <GraduationCap className="w-4 h-4" />
                                    Target exam
                                </label>
                                <select
                                    value={targetExamId}
                                    onChange={(e) => setTargetExamId(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
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
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                                        placeholder="Type your exam name"
                                        required
                                    />
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                            {isSubmitting ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Login'}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

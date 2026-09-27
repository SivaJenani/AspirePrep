import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, GraduationCap, Lock, Mail, Sparkles, Eye, EyeOff, Shield, UserCheck, KeyRound, ArrowLeft } from 'lucide-react';
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
    const { 
        loginWithEmailPassword, 
        registerWithEmailPassword, 
        loginWithDemo, 
        resetPassword, 
        signInWithGoogle 
    } = useAppStore();

    const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('sivajenanis@gmail.com');
    const [password, setPassword] = useState('password123');
    const [targetExamId, setTargetExamId] = useState(examOptions[0].id);
    const [customExamName, setCustomExamName] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isCustomExam = targetExamId === CUSTOM_EXAM_ID;

    const handleGoogleSignIn = async () => {
        setError('');
        setSuccessMsg('');
        setIsSubmitting(true);
        try {
            const res = await signInWithGoogle();
            if (res?.user) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err?.message || 'Google sign-in could not be completed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoLogin = async (role = 'student') => {
        setError('');
        setSuccessMsg('');
        setIsSubmitting(true);
        try {
            const res = await loginWithDemo(role);
            if (res?.user) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err?.response?.data?.error || err?.message || 'Demo access failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

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
            } else if (mode === 'reset') {
                const res = await resetPassword(email.trim(), password);
                if (res?.user) {
                    navigate('/dashboard');
                } else {
                    setSuccessMsg('Password updated! You can now log in.');
                    setMode('login');
                }
            } else {
                await loginWithEmailPassword(email.trim(), password);
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err?.response?.data?.error || err?.message || 'Authentication failed. Please verify your credentials.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center px-4 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e3a5f_0%,_#080c14_60%)]" />
            
            <div className="relative z-10 w-full max-w-4xl grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                {/* Left Card: Value Prop & 1-Click Access */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 mb-6">
                            <Sparkles className="w-4 h-4" />
                            Next-Gen Exam Prep
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4 tracking-tight">
                            Master your exam with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AspirePrep</span>
                        </h1>
                        <p className="text-sm sm:text-base leading-relaxed text-slate-400 mb-6">
                            Personalized diagnostic mock tests, mistake notebook with spaced repetition, live syllabus trackers, and AI video explanations tailored to competitive exams.
                        </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Instant Quick Access
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                id="btn-demo-aspirant"
                                type="button"
                                onClick={() => handleDemoLogin('student')}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-600/20 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-blue-200 hover:bg-blue-600/30 hover:border-blue-400 transition"
                            >
                                <UserCheck className="w-4 h-4 text-blue-400" />
                                <span>Demo Aspirant</span>
                            </button>

                            <button
                                id="btn-demo-admin"
                                type="button"
                                onClick={() => handleDemoLogin('admin')}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-600/20 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-purple-200 hover:bg-purple-600/30 hover:border-purple-400 transition"
                            >
                                <Shield className="w-4 h-4 text-purple-400" />
                                <span>Demo Admin</span>
                            </button>
                        </div>

                        <button
                            id="btn-google-signin"
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            <GraduationCap className="w-4 h-4 text-emerald-400" />
                            Continue with Google Account
                        </button>
                    </div>
                </div>

                {/* Right Card: Authentication Form */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    id="tab-login"
                                    type="button"
                                    onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                                        mode === 'login' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    Login
                                </button>
                                <button
                                    id="tab-register"
                                    type="button"
                                    onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                                        mode === 'register' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    Create account
                                </button>
                            </div>

                            {mode === 'reset' ? (
                                <button
                                    type="button"
                                    onClick={() => { setMode('login'); setError(''); }}
                                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back to login
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => { setMode('reset'); setError(''); setSuccessMsg(''); }}
                                    className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
                                >
                                    Reset password
                                </button>
                            )}
                        </div>

                        {mode === 'reset' && (
                            <div className="mb-4 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-2.5 text-xs text-blue-300 flex items-start gap-2">
                                <KeyRound className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>Enter your email and a new password to immediately update your account and sign in.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'register' && (
                                <div className="space-y-1.5">
                                    <label htmlFor="auth-name" className="text-xs font-bold uppercase tracking-wider text-slate-400">Name</label>
                                    <input
                                        id="auth-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label htmlFor="auth-email" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <Mail className="w-3.5 h-3.5" />
                                    Email
                                </label>
                                <input
                                    id="auth-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="auth-password" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <Lock className="w-3.5 h-3.5" />
                                        {mode === 'reset' ? 'New Password' : 'Password'}
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        id="auth-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 pr-12 transition"
                                        placeholder={mode === 'reset' ? 'Enter new password' : 'Password'}
                                        required
                                    />
                                    <button
                                        id="btn-toggle-password"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {mode === 'register' && (
                                <div className="space-y-1.5">
                                    <label htmlFor="auth-exam" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <GraduationCap className="w-3.5 h-3.5" />
                                        Target exam
                                    </label>
                                    <select
                                        id="auth-exam"
                                        value={targetExamId}
                                        onChange={(e) => setTargetExamId(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition"
                                    >
                                        {examOptions.map((exam) => (
                                            <option key={exam.id} value={exam.id} className="bg-slate-900 text-white">
                                                {exam.name}
                                            </option>
                                        ))}
                                    </select>
                                    {isCustomExam && (
                                        <input
                                            id="auth-custom-exam"
                                            value={customExamName}
                                            onChange={(e) => setCustomExamName(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 mt-2 transition"
                                            placeholder="Type your exam name"
                                            required
                                        />
                                    )}
                                </div>
                            )}

                            {successMsg && (
                                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-200">
                                    {successMsg}
                                </div>
                            )}

                            {error && (
                                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200 space-y-2">
                                    <p>{error}</p>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => { setMode('reset'); setError(''); }}
                                            className="text-xs font-semibold text-blue-300 hover:text-blue-200 underline block"
                                        >
                                            Forgot password? Click here to set a new password
                                        </button>
                                    )}
                                </div>
                            )}

                            <button
                                id="btn-submit-auth"
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-600/20 mt-2"
                            >
                                {isSubmitting ? (
                                    'Please wait...'
                                ) : mode === 'register' ? (
                                    'Create account & Start'
                                ) : mode === 'reset' ? (
                                    'Update Password & Sign In'
                                ) : (
                                    'Sign In to AspirePrep'
                                )}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        Protected by end-to-end authentication and encrypted session tokens.
                    </div>
                </div>
            </div>
        </div>
    );
};

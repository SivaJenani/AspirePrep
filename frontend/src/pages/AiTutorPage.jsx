import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Brain, Sparkles, Target, ArrowLeft, Lightbulb, Zap, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SubjectAIChat } from '../components/study/SubjectAIChat';

export const AiTutorPage = () => {
    const { user } = useAppStore();
    const [searchParams] = useSearchParams();

    const initialTopic = searchParams.get('topic') || '';
    const initialSubject = searchParams.get('subject') || (
        initialTopic.toLowerCase().includes('syllogism') || initialTopic.toLowerCase().includes('reason') ? 'Reasoning Ability' :
        initialTopic.toLowerCase().includes('english') || initialTopic.toLowerCase().includes('grammar') ? 'English Language' :
        initialTopic.toLowerCase().includes('polity') || initialTopic.toLowerCase().includes('history') ? 'General Awareness' :
        'Quantitative Aptitude'
    );
    const initialQuestion = searchParams.get('q') || (initialTopic ? `Can you explain ${initialTopic} with core formulas, exam shortcuts, and 2 solved examples?` : '');

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-200">
            {/* Header / Sub-navigation banner */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    AI Subject Doubt Solver & Tutor
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    Powered by Gemini 3.8 Flash
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                Ask subject-specific questions and receive step-by-step derivations, 20-second speed tricks, and examiner trap warnings.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Dashboard
                        </Link>
                        <Link
                            to="/analytics"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition border border-indigo-100 dark:border-indigo-900/60"
                        >
                            <Target className="w-3.5 h-3.5" />
                            Weak Area Diagnostics
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Context Strip */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-medium">
                        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>
                            Target Exam: <strong>{user?.targetExamName || 'Competitive Exams'}</strong>
                            {initialTopic && <> • Diagnosing: <span className="underline decoration-indigo-400 font-bold">{initialTopic}</span></>}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-amber-500" />
                            Select subject & topic for tuned explanations
                        </span>
                        <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Zero Hallucination Sandbox
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Chat Engine */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
                <SubjectAIChat
                    initialSubject={initialSubject}
                    initialTopic={initialTopic}
                    initialQuestion={initialQuestion}
                    examName={user?.targetExamName || ''}
                />
            </div>
        </div>
    );
};

export default AiTutorPage;

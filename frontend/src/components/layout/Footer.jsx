import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck, ArrowRight, EyeOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Footer = () => {
    const { isFocusMode, toggleFocusMode } = useAppStore();

    if (isFocusMode) {
        return (
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-400 py-3 px-4 text-xs transition-all">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-slate-300">Zen Focus Mode Active</span>
                    </div>
                    <button
                        type="button"
                        onClick={toggleFocusMode}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                    >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Exit Focus Mode</span>
                    </button>
                </div>
            </footer>
        );
    }

    return (
        <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800 dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                                <Target className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Aspire<span className="text-indigo-400">Prep</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                            The premier adaptive competitive exam preparation platform. Powered by spaced repetition, weak-topic diagnostics, official PYQ simulators, and personalized AI tutoring.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            Over 25,000+ Aspirants Practicing Daily
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
                            Supported Exams
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/exams" className="hover:text-white transition">SSC CGL Tier 1 & 2</Link></li>
                            <li><Link to="/exams" className="hover:text-white transition">UPSC Civil Services</Link></li>
                            <li><Link to="/exams" className="hover:text-white transition">IBPS Bank PO & Clerk</Link></li>
                            <li><Link to="/exams" className="hover:text-white transition">TNPSC Group 4 & VAO</Link></li>
                            <li><Link to="/exams" className="hover:text-white transition">RRB NTPC & Group D</Link></li>
                            <li><Link to="/exams" className="hover:text-white transition">JEE Main & NEET</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
                            Learning Engine
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/practice" className="hover:text-white transition">Topic-wise Practice</Link></li>
                            <li><Link to="/mock-tests" className="hover:text-white transition">Mock Test Simulator</Link></li>
                            <li><Link to="/learning-progress" className="hover:text-white transition">Weak Area Diagnostics</Link></li>
                            <li><Link to="/study-plan" className="hover:text-white transition">Adaptive Study Plan</Link></li>
                            <li><Link to="/formula-deck" className="hover:text-white transition">Spaced Repetition</Link></li>
                            <li><Link to="/ai-tutor" className="hover:text-white transition">Voice AI Exam Tutor</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
                            Daily Challenge
                        </h4>
                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                            <p className="text-xs text-slate-300">
                                Sharpen speed and accuracy with 20 mixed exam questions updated daily.
                            </p>
                            <Link to="/practice?mode=daily" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition w-full justify-center">
                                Take Challenge <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>© 2026 AspirePrep Platform. Built for serious competitive exam aspirants.</p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                        <span>Honor Code</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ChevronRight, UploadCloud, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { UniversalSyllabusAnalyzer } from '../components/university/UniversalSyllabusAnalyzer';

export const ExamDiscoveryPage = () => {
    const [exams, setExams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('directory');

    const categories = ['All', 'Government', 'Civil Services', 'Banking', 'State Govt', 'Railways', 'Engineering', 'Medical', 'Management'];

    useEffect(() => {
        if (activeTab === 'directory') {
            loadExams();
        } else {
            setLoading(false);
        }
    }, [selectedCategory, searchTerm, activeTab]);

    const loadExams = async () => {
        try {
            setLoading(true);
            const res = await api.get('/exams', {
                params: {
                    category: selectedCategory,
                    search: searchTerm
                }
            });
            if (res.data?.exams) {
                setExams(res.data.exams);
            }
        } catch (err) {
            console.error('Failed to load exams:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16">
            <div className="bg-white border-b border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        <BookOpen className="w-4 h-4" />
                        Competitive Exam Hub
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Supported Competitive Examinations
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                        Choose your target exam to access structured subject roadmaps, topic-wise practice questions, official PYQ archives, and full-length exam simulations.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('directory')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                activeTab === 'directory'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Exam Directory
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('analyzer')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                activeTab === 'analyzer'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            <UploadCloud className="w-4 h-4" />
                            Syllabus Upload
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {activeTab === 'directory' ? (
                    <>
                        <div className="pt-0 flex flex-col sm:flex-row gap-3 items-center justify-between">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search exams (e.g. SSC, UPSC, Bank PO, TNPSC)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                            selectedCategory === cat
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8">
                            {loading ? (
                                <div className="py-20 text-center text-xs text-slate-500">Loading competitive exams...</div>
                            ) : exams.length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No exams found matching your filter.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {exams.map((exam) => (
                                        <div
                                            key={exam.id}
                                            className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[11px] font-bold">
                                                        {exam.category}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-500">{exam.tierLevels?.length || 2} Tiers</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{exam.name}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{exam.description}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <div>
                                                        <span className="font-semibold text-slate-900 dark:text-white">Duration:</span> {exam.patternSummary?.durationMinutes || 60} mins
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-slate-900 dark:text-white">Max Marks:</span> {exam.patternSummary?.totalMarks || 200}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-slate-900 dark:text-white">Questions:</span> {exam.patternSummary?.totalQuestions || 100}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-slate-900 dark:text-white">Penalty:</span> -{exam.patternSummary?.negativeMarking || 0.5}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                                                <Link to={`/exam/${exam.slug}`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                                    Syllabus & Details
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                                <Link
                                                    to={`/practice?examId=${exam.id}`}
                                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                                                >
                                                    Start Practice
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="space-y-5">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="w-4 h-4" />
                                Competitive syllabus upload
                            </div>
                            <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                                Upload any competitive exam syllabus
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                                Paste a syllabus, upload a `.txt` file, or type your custom exam name. This works for SSC, UPSC, banking, railways, state exams, and custom competitive tests.
                            </p>
                        </div>
                        <UniversalSyllabusAnalyzer />
                    </div>
                )}
            </div>
        </div>
    );
};

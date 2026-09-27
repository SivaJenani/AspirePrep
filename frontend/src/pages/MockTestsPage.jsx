import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, CheckCircle2, Play, Sparkles, LayoutGrid, Zap, Cpu, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { InteractiveMockTest } from '../components/mock/InteractiveMockTest';
import { PyqNeuralMockTestEngine } from '../components/mock/PyqNeuralMockTestEngine';

export const MockTestsPage = () => {
    const [viewMode, setViewMode] = useState('pyq_neural'); // 'pyq_neural' | 'interactive' | 'catalog'
    const [mockTests, setMockTests] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMockTests();
    }, []);

    const loadMockTests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/mock-tests');
            if (res.data?.mockTests) {
                setMockTests(res.data.mockTests);
            }
        } catch (err) {
            console.error('Failed to load mock tests:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = mockTests.filter(t => {
        if (filterType === 'all') return true;
        const type = t.testType || t.type || 'full';
        if (filterType === 'full_length') return type === 'full' || type === 'full_length';
        if (filterType === 'sectional') return type === 'sectional';
        if (filterType === 'previous_year') return type === 'previous_year' || t.id?.includes('pyq') || t.title?.includes('PYQ');
        return type === filterType;
    });

    return (
        <div id="mock-tests-page-root" className="bg-[#080c14] min-h-screen text-white pb-20">
            {/* Header Title Section */}
            <div className="bg-[#0c1222] border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                                <Award className="w-4 h-4 text-blue-400" />
                                <span>Examination Simulator & Test Arena</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Timed Mock Test Engine
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                                Select an exam, face real-time timer constraints with negative marking rules, answer multiple-choice questions, and receive instant score evaluations with solutions.
                            </p>
                        </div>

                        {/* View Mode Toggle Switch */}
                        <div className="flex flex-wrap items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto shadow-inner gap-1">
                            <button
                                id="mode-pyq-neural-btn"
                                onClick={() => setViewMode('pyq_neural')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                    viewMode === 'pyq_neural'
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                                <span>PYQ PDF & Neural Engine</span>
                            </button>

                            <button
                                id="mode-interactive-arena-btn"
                                onClick={() => setViewMode('interactive')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                    viewMode === 'interactive'
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Interactive Test Arena</span>
                            </button>

                            <button
                                id="mode-test-catalog-btn"
                                onClick={() => setViewMode('catalog')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                    viewMode === 'catalog'
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>Exam Papers Directory</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {viewMode === 'pyq_neural' ? (
                    <PyqNeuralMockTestEngine />
                ) : viewMode === 'interactive' ? (
                    <InteractiveMockTest />
                ) : (
                    <div className="space-y-6">
                        {/* Filters Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'all', label: 'All Mock Tests' },
                                    { id: 'full_length', label: 'Full-Length Tiers' },
                                    { id: 'sectional', label: 'Sectional Speed Drills' },
                                    { id: 'previous_year', label: 'Official PYQ Tests' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        id={`catalog-filter-${tab.id}`}
                                        onClick={() => setFilterType(tab.id)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                                            filterType === tab.id
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs text-slate-500">
                                Showing {filtered.length} curated papers
                            </span>
                        </div>

                        {/* Catalog Cards Grid */}
                        {loading ? (
                            <div className="py-20 text-center text-xs text-slate-500">
                                Loading mock tests...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="py-20 text-center text-xs text-slate-500">
                                No mock tests found for this filter.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.map((test) => (
                                    <div
                                        key={test.id}
                                        id={`catalog-test-card-${test.id}`}
                                        className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/60 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/60 text-[10px] font-bold uppercase tracking-wider">
                                                    {(test.testType || test.type || 'full_length').toString().replace('_', ' ')}
                                                </span>
                                                <span className="text-[11px] font-mono font-bold text-amber-400">
                                                    {(test.difficulty || 'medium').toUpperCase()}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-base font-bold text-white leading-snug">
                                                    {test.title}
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                                    {test.description}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                                                    <span>{test.durationMinutes || 60} Minutes</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Marks:</span> {test.totalMarks || 200}
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Questions:</span> {test.totalQuestions || 100}
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Penalty:</span> -{test.negativeMarks ?? 0.5}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {test.sections?.map((sec, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700/60"
                                                    >
                                                        {(sec.subjectName || 'Subject').split(' ')[0]} ({sec.totalQuestions || sec.questionIds?.length || 10})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
                                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> All-India Percentile
                                            </span>
                                            <Link
                                                id={`take-test-link-${test.id}`}
                                                to={`/mock-tests/simulator/${test.id}`}
                                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                                            >
                                                <Play className="w-3 h-3 fill-white" />
                                                <span>Take Test</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, CheckCircle2, Play } from 'lucide-react';
import { api } from '../lib/api';
export const MockTestsPage = () => {
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
        }
        catch (err) {
            console.error('Failed to load mock tests:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const filtered = mockTests.filter(t => {
        if (filterType === 'all')
            return true;
        return t.testType === filterType;
    });
    return (_jsxs("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen pb-16", children: [_jsx("div", { className: "bg-white border-b border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400", children: [_jsx(Award, { className: "w-4 h-4" }), " Examination Simulator"] }), _jsx("h1", { className: "text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight", children: "Full-Length & Sectional Mock Tests" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 max-w-2xl", children: "Simulate real exam pressure with official timer constraints, negative marking rules, sectional switches, and instant All-India percentile reports." }), _jsx("div", { className: "flex flex-wrap gap-2 pt-4", children: [
                                { id: 'all', label: 'All Mock Tests' },
                                { id: 'full_length', label: 'Full-Length Tiers' },
                                { id: 'sectional', label: 'Sectional Speed Drills' },
                                { id: 'previous_year', label: 'Official PYQ Tests' }
                            ].map((tab) => (_jsx("button", { onClick: () => setFilterType(tab.id), className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${filterType === tab.id
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`, children: tab.label }, tab.id))) })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8", children: loading ? (_jsx("div", { className: "py-20 text-center text-xs text-slate-500", children: "Loading mock tests..." })) : filtered.length === 0 ? (_jsx("div", { className: "py-20 text-center text-xs text-slate-500", children: "No mock tests found for this filter." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filtered.map((test) => (_jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider", children: test.testType.replace('_', ' ') }), _jsx("span", { className: "text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400", children: test.difficulty.toUpperCase() })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white leading-snug", children: test.title }), _jsx("p", { className: "text-xs text-slate-500 mt-1 line-clamp-2", children: test.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), _jsxs("span", { children: [test.durationMinutes, " Minutes"] })] }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-slate-900 dark:text-white", children: "Marks:" }), " ", test.totalMarks] }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-slate-900 dark:text-white", children: "Questions:" }), " ", test.totalQuestions] }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-slate-900 dark:text-white", children: "Penalty:" }), " -", test.negativeMarks] })] }), _jsx("div", { className: "flex flex-wrap gap-1 pt-1", children: test.sections.map((sec, sIdx) => (_jsxs("span", { className: "px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400", children: [sec.subjectName.split(' ')[0], " (", sec.totalQuestions, ")"] }, sIdx))) })] }), _jsxs("div", { className: "pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between", children: [_jsxs("span", { className: "text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " All-India Percentile"] }), _jsxs(Link, { to: `/mock-tests/simulator/${test.id}`, className: "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5", children: [_jsx(Play, { className: "w-3 h-3 fill-white" }), " Take Test"] })] })] }, test.id))) })) })] }));
};

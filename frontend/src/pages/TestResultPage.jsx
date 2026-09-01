import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, XCircle, Brain, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
const getOptionText = (option) => typeof option === 'string'
    ? option
    : option?.text || option?.optionText || option?.label || option?.value || '';
export const TestResultPage = () => {
    const { attemptId } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [questionsMap, setQuestionsMap] = useState({});
    const [filterReview, setFilterReview] = useState('all');
    const [expandedQuestionId, setExpandedQuestionId] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadAttemptResult();
    }, [attemptId]);
    const loadAttemptResult = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/mock-tests/attempts/${attemptId}`);
            if (res.data?.attempt) {
                setAttempt(res.data.attempt);
            }
            // Fetch questions to render detailed review
            const qRes = await api.get('/questions/practice', { params: { count: 50 } });
            const map = {};
            (qRes.data?.questions || []).forEach((q) => {
                map[q.id] = q;
            });
            setQuestionsMap(map);
        }
        catch (err) {
            console.error('Failed to load test attempt:', err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading || !attempt) {
        return (_jsx("div", { className: "py-20 text-center text-xs text-slate-500", children: "Generating comprehensive score report..." }));
    }
    const responses = attempt.questionResponses || [];
    const filteredResponses = responses.filter(r => {
        if (filterReview === 'correct')
            return r.isCorrect;
        if (filterReview === 'incorrect')
            return r.selectedOptionId && !r.isCorrect;
        if (filterReview === 'skipped')
            return !r.selectedOptionId;
        return true;
    });
    return (_jsxs("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen pb-16", children: [_jsx("div", { className: "bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-10", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-indigo-400", children: [_jsx(Link, { to: "/mock-tests", className: "hover:underline", children: "Mock Tests" }), _jsx(ChevronRight, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Scorecard & All-India Analysis" })] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsx("span", { className: "px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider", children: "Exam Evaluation Completed" }), _jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2", children: attempt.mockTestTitle }), _jsxs("p", { className: "text-xs sm:text-sm text-slate-300 mt-1", children: ["Completed on ", new Date(attempt.completedAt).toLocaleDateString(), " \u2022 Official Marking Scheme (+2 / -0.5)"] })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs(Link, { to: "/mock-tests", className: "px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow transition flex items-center gap-1.5", children: [_jsx(RotateCcw, { className: "w-4 h-4 text-indigo-600" }), " Retake Test"] }), _jsxs(Link, { to: "/practice?mode=weak", className: "px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), " Practice Weak Areas"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1", children: [_jsx("span", { className: "text-xs text-slate-400 font-semibold block", children: "Total Score" }), _jsxs("div", { className: "text-3xl font-extrabold text-white", children: [attempt.score, " ", _jsxs("span", { className: "text-sm font-normal text-slate-400", children: ["/ ", attempt.maxScore] })] }), _jsxs("span", { className: "text-[11px] text-emerald-400 font-medium", children: [attempt.percentage, "% Net Marks"] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1", children: [_jsx("span", { className: "text-xs text-slate-400 font-semibold block", children: "All-India Percentile" }), _jsxs("div", { className: "text-3xl font-extrabold text-amber-400", children: [attempt.percentileRank, "th"] }), _jsx("span", { className: "text-[11px] text-slate-300", children: "Top 10.6% Aspirants" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1", children: [_jsx("span", { className: "text-xs text-slate-400 font-semibold block", children: "Accuracy" }), _jsxs("div", { className: "text-3xl font-extrabold text-indigo-400", children: [attempt.accuracy, "%"] }), _jsxs("span", { className: "text-[11px] text-slate-300", children: [attempt.totalCorrect, " Correct \u2022 ", attempt.totalWrong, " Wrong"] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1", children: [_jsx("span", { className: "text-xs text-slate-400 font-semibold block", children: "Time Taken" }), _jsxs("div", { className: "text-3xl font-extrabold text-slate-200", children: [Math.floor(attempt.timeTakenSeconds / 60), "m ", attempt.timeTakenSeconds % 60, "s"] }), _jsxs("span", { className: "text-[11px] text-slate-300", children: ["Avg ", attempt.timeAnalysis?.averageTimePerQuestion || 35, "s / question"] })] })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8", children: [_jsxs("div", { className: "p-6 rounded-2xl bg-indigo-900/40 border border-indigo-700 text-white space-y-3 shadow-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-indigo-400", children: [_jsx(Brain, { className: "w-5 h-5 text-indigo-400" }), _jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-white", children: "AI Diagnostic Assessment" })] }), _jsx("ul", { className: "space-y-2 text-xs text-slate-200", children: attempt.recommendations.map((rec, rIdx) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-amber-400 font-bold shrink-0", children: "\u26A1" }), _jsx("span", { children: rec })] }, rIdx))) })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4", children: [_jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Sectional Performance Breakdown" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { className: "border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3 px-4", children: "Subject" }), _jsx("th", { className: "py-3 px-4", children: "Score" }), _jsx("th", { className: "py-3 px-4", children: "Accuracy" }), _jsx("th", { className: "py-3 px-4", children: "Attempted" }), _jsx("th", { className: "py-3 px-4", children: "Correct" }), _jsx("th", { className: "py-3 px-4", children: "Wrong" }), _jsx("th", { className: "py-3 px-4", children: "Time Spent" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: attempt.sectionAnalytics.map((sec, sIdx) => (_jsxs("tr", { className: "hover:bg-slate-50 dark:hover:bg-slate-800/40", children: [_jsx("td", { className: "py-3 px-4 font-bold text-slate-900 dark:text-white", children: sec.subjectName }), _jsxs("td", { className: "py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400", children: [sec.score, " / ", sec.maxScore] }), _jsx("td", { className: "py-3 px-4", children: _jsxs("span", { className: `px-2 py-0.5 rounded font-bold ${sec.accuracy >= 80
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : sec.accuracy >= 65
                                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`, children: [sec.accuracy, "%"] }) }), _jsx("td", { className: "py-3 px-4", children: sec.totalAttempted }), _jsx("td", { className: "py-3 px-4 text-emerald-600 font-semibold", children: sec.totalCorrect }), _jsx("td", { className: "py-3 px-4 text-rose-600 font-semibold", children: sec.totalWrong }), _jsxs("td", { className: "py-3 px-4 font-mono text-slate-500", children: [Math.floor(sec.timeTakenSeconds / 60), "m ", sec.timeTakenSeconds % 60, "s"] })] }, sIdx))) })] }) })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Question Review & Explanations" }), _jsx("p", { className: "text-xs text-slate-500", children: "Analyze answers, solutions, formulas, and examiner traps" })] }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: [
                                            { id: 'all', label: `All (${responses.length})` },
                                            { id: 'correct', label: `Correct (${attempt.totalCorrect})` },
                                            { id: 'incorrect', label: `Incorrect (${attempt.totalWrong})` },
                                            { id: 'skipped', label: `Skipped (${attempt.totalSkipped})` }
                                        ].map((tab) => (_jsx("button", { onClick: () => setFilterReview(tab.id), className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filterReview === tab.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`, children: tab.label }, tab.id))) })] }), _jsx("div", { className: "space-y-4", children: filteredResponses.map((resp, rIdx) => {
                                    const q = questionsMap[resp.questionId];
                                    const isExpanded = expandedQuestionId === resp.questionId;
                                    const isCorrect = resp.isCorrect;
                                    const isSkipped = !resp.selectedOptionId;
                                    return (_jsxs("div", { className: "rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden", children: [_jsxs("button", { onClick: () => setExpandedQuestionId(isExpanded ? null : resp.questionId), className: "w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center shrink-0", children: rIdx + 1 }), _jsx("p", { className: "text-xs font-medium text-slate-900 dark:text-white line-clamp-1", children: q?.questionText || `Question #${rIdx + 1} (${resp.questionId})` })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [isSkipped ? (_jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300", children: "Skipped" })) : isCorrect ? (_jsxs("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1", children: [_jsx(CheckCircle2, { className: "w-3 h-3" }), " Correct (+2.0)"] })) : (_jsxs("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1", children: [_jsx(XCircle, { className: "w-3 h-3" }), " Incorrect (-0.5)"] })), isExpanded ? _jsx(ChevronDown, { className: "w-4 h-4 text-slate-400" }) : _jsx(ChevronRight, { className: "w-4 h-4 text-slate-400" })] })] }), isExpanded && q && (_jsxs("div", { className: "p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4 text-xs", children: [_jsx("div", { className: "font-semibold text-slate-900 dark:text-white text-sm", children: q.questionText }), _jsx("div", { className: "space-y-2", children: q.options.map((opt, oIdx) => {
                                                            const isUserSelection = resp.selectedOptionId === opt.id;
                                                            const isCorrectChoice = opt.id === q.correctOptionId;
                                                            return (_jsxs("div", { className: `p-3 rounded-lg border flex items-center justify-between ${isCorrectChoice
                                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold'
                                                                    : isUserSelection
                                                                        ? 'border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200'
                                                                        : 'border-slate-200 dark:border-slate-700 text-slate-500'}`, children: [_jsxs("span", { children: [String.fromCharCode(65 + oIdx), ". ", getOptionText(opt)] }), isCorrectChoice && _jsx("span", { className: "text-emerald-600 font-bold", children: "\u2713 Correct Answer" }), isUserSelection && !isCorrectChoice && _jsx("span", { className: "text-rose-600 font-bold", children: "\u2717 Your Selection" })] }, opt.id));
                                                        }) }), _jsxs("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2", children: [_jsx("span", { className: "font-bold text-indigo-600 dark:text-indigo-400 block uppercase text-[10px]", children: "Step-by-Step Solution:" }), _jsx("p", { className: "text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line", children: q.explanation }), q.shortcutTip && (_jsxs("div", { className: "pt-2 text-amber-800 dark:text-amber-300 font-medium", children: ["\u26A1 Shortcut: ", q.shortcutTip] }))] })] }))] }, resp.questionId));
                                }) })] })] })] }));
};

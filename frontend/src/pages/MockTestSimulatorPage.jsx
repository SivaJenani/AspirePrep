import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, X } from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
const getOptionText = (option) => typeof option === 'string'
    ? option
    : option?.text || option?.optionText || option?.label || option?.value || '';
export const MockTestSimulatorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, recordHabitActivity } = useAppStore();
    const [mockTest, setMockTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // Responses map: questionId -> { selectedOptionId, status, timeSpentSeconds }
    const [responses, setResponses] = useState({});
    const [remainingSeconds, setRemainingSeconds] = useState(3600);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const questionStartTimeRef = useRef(Date.now());
    useEffect(() => {
        loadTestSimulator();
    }, [id]);
    // Main countdown timer
    useEffect(() => {
        if (loading || remainingSeconds <= 0)
            return;
        const timer = setInterval(() => {
            setRemainingSeconds(s => {
                if (s <= 1) {
                    clearInterval(timer);
                    handleSubmitTest(true); // Auto-submit on timer expiry
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, remainingSeconds]);
    const loadTestSimulator = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/mock-tests/${id}`);
            if (res.data?.mockTest) {
                const test = res.data.mockTest;
                setMockTest(test);
                setRemainingSeconds(test.durationMinutes * 60);
                const loadedQuestions = test.questions || [];
                setQuestions(loadedQuestions);
                // Initialize question responses state
                const initialResponses = {};
                loadedQuestions.forEach((q, idx) => {
                    initialResponses[q.id] = {
                        selectedOptionId: undefined,
                        status: idx === 0 ? 'not_answered' : 'not_visited',
                        timeSpentSeconds: 0
                    };
                });
                setResponses(initialResponses);
            }
        }
        catch (err) {
            console.error('Failed to load mock test:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const currentQ = questions[currentQuestionIndex];
    const currentSection = mockTest?.sections[currentSectionIndex];
    // Helper to record question time
    const recordCurrentQuestionTime = () => {
        if (!currentQ)
            return;
        const now = Date.now();
        const elapsed = Math.round((now - questionStartTimeRef.current) / 1000);
        questionStartTimeRef.current = now;
        setResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                timeSpentSeconds: (prev[currentQ.id]?.timeSpentSeconds || 0) + elapsed
            }
        }));
    };
    const handleSelectOption = (optId) => {
        if (!currentQ)
            return;
        setResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                selectedOptionId: optId
            }
        }));
    };
    const handleClearResponse = () => {
        if (!currentQ)
            return;
        setResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                selectedOptionId: undefined,
                status: 'not_answered'
            }
        }));
    };
    const handleSaveAndNext = () => {
        if (!currentQ)
            return;
        recordCurrentQuestionTime();
        const selectedOpt = responses[currentQ.id]?.selectedOptionId;
        const newStatus = selectedOpt ? 'answered' : 'not_answered';
        setResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                status: newStatus
            }
        }));
        if (currentQuestionIndex < questions.length - 1) {
            jumpToQuestion(currentQuestionIndex + 1);
        }
    };
    const handleMarkForReviewAndNext = () => {
        if (!currentQ)
            return;
        recordCurrentQuestionTime();
        const selectedOpt = responses[currentQ.id]?.selectedOptionId;
        const newStatus = selectedOpt ? 'answered_and_marked' : 'marked_for_review';
        setResponses(prev => ({
            ...prev,
            [currentQ.id]: {
                ...prev[currentQ.id],
                status: newStatus
            }
        }));
        if (currentQuestionIndex < questions.length - 1) {
            jumpToQuestion(currentQuestionIndex + 1);
        }
    };
    const jumpToQuestion = (targetIdx) => {
        recordCurrentQuestionTime();
        setCurrentQuestionIndex(targetIdx);
        const targetQ = questions[targetIdx];
        if (targetQ && responses[targetQ.id]?.status === 'not_visited') {
            setResponses(prev => ({
                ...prev,
                [targetQ.id]: {
                    ...prev[targetQ.id],
                    status: 'not_answered'
                }
            }));
        }
    };
    const handleSubmitTest = async (isAutoSubmit = false) => {
        if (!mockTest)
            return;
        try {
            setIsSubmitting(true);
            recordCurrentQuestionTime();
            const questionResponses = Object.keys(responses).map(qId => ({
                questionId: qId,
                selectedOptionId: responses[qId].selectedOptionId,
                status: responses[qId].status,
                timeSpentSeconds: responses[qId].timeSpentSeconds || 30
            }));
            const totalTimeTaken = (mockTest.durationMinutes * 60) - remainingSeconds;
            const res = await api.post(`/mock-tests/${mockTest.id}/submit`, {
                questionResponses,
                timeTakenSeconds: totalTimeTaken
            });
            if (res.data?.attempt?.id) {
                if (recordHabitActivity) {
                    recordHabitActivity('test_completed', { scorePercent: res.data?.attempt?.scorePercent || 75 });
                }
                navigate(`/mock-tests/result/${res.data.attempt.id}`);
            }
        }
        catch (err) {
            console.error('Test submission failed:', err);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "bg-slate-900 text-white min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center space-y-3", children: [_jsx("div", { className: "w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" }), _jsx("p", { className: "text-xs text-slate-400", children: "Loading official test simulator..." })] }) }));
    }
    if (!mockTest || !currentQ) {
        return (_jsx("div", { className: "bg-slate-900 text-white min-h-screen flex items-center justify-center p-4", children: _jsxs("div", { className: "text-center space-y-4 max-w-md p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl", children: [_jsx("h2", { className: "text-base font-bold text-white", children: "Test Simulator Paper Not Loaded" }), _jsx("p", { className: "text-xs text-slate-300", children: "Unable to find questions for this mock test paper. Please return to the Mock Test Arena and select an official test or generate a PYQ paper." }), _jsx(Link, { to: "/mock-tests", className: "inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition", children: "Return to Mock Tests" })] }) }));
    }
    // Count question palette stats
    const answeredCount = Object.values(responses).filter(r => r.status === 'answered' || r.status === 'answered_and_marked').length;
    const notAnsweredCount = Object.values(responses).filter(r => r.status === 'not_answered').length;
    const notVisitedCount = Object.values(responses).filter(r => r.status === 'not_visited').length;
    const markedReviewCount = Object.values(responses).filter(r => r.status === 'marked_for_review' || r.status === 'answered_and_marked').length;
    const formatTimer = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };
    const isLowTime = remainingSeconds <= 300; // 5 mins left
    return (_jsxs("div", { className: "bg-[#f8fafc] dark:bg-[#0b1120] min-h-screen text-slate-900 dark:text-slate-100 flex flex-col justify-between", children: [_jsxs("header", { className: "bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs", children: "CBT" }), _jsxs("div", { children: [_jsx("h1", { className: "text-xs sm:text-sm font-bold text-white max-w-[200px] sm:max-w-md truncate font-display", children: mockTest.title }), _jsxs("span", { className: "text-[10px] text-slate-400 font-mono tabular-nums", children: ["Marking: +", mockTest.marksPerQuestion || 2, " / -", mockTest.negativeMarks || 0.5] })] })] }), _jsx("div", { className: "hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50", children: mockTest.sections.map((sec, sIdx) => (_jsx("button", { onClick: () => setCurrentSectionIndex(sIdx), className: `px-3 py-1 rounded-lg text-xs font-semibold transition ${currentSectionIndex === sIdx
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-white'}`, children: sec.subjectName.split(' ')[0] }, sIdx))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: `flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono tabular-nums text-xs font-bold shadow-xs ${isLowTime
                                    ? 'bg-rose-950/80 text-rose-300 border-rose-700 animate-pulse'
                                    : 'bg-slate-800 text-slate-200 border-slate-700'}`, children: [_jsx(Clock, { className: `w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-indigo-400'}` }), _jsx("span", { className: "tracking-wider font-mono text-sm", children: formatTimer(remainingSeconds) })] }), _jsx("button", { onClick: () => setIsSubmitModalOpen(true), className: "px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition", children: "Submit Test" })] })] }), _jsxs("div", { className: "max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "lg:col-span-3 flex flex-col justify-between space-y-6", children: [_jsxs("div", { className: "p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-[#151b2e] dark:border-[#2a3350] space-y-6 flex-1", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("span", { className: "text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider", children: ["Question ", currentQuestionIndex + 1, " of ", questions.length, " \u2022 ", currentSection?.subjectName] }), _jsxs("span", { className: "text-xs font-mono text-slate-500 tabular-nums", children: ["Difficulty: ", currentQ.difficulty.toUpperCase()] })] }), _jsx("div", { className: "text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans", children: currentQ.questionText }), _jsx("div", { className: "space-y-3 pt-2", children: currentQ.options.map((opt, optIdx) => {
                                            const letter = String.fromCharCode(65 + optIdx);
                                            const isSelected = responses[currentQ.id]?.selectedOptionId === opt.id;
                                            return (_jsxs("button", { onClick: () => handleSelectOption(opt.id), className: `w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-center gap-3 ${isSelected
                                                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500/20'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:bg-[#151b2e] dark:border-[#2a3350]'}`, children: [_jsx("span", { className: `w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`, children: letter }), _jsx("span", { children: getOptionText(opt) })] }, opt.id));
                                        }) })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-[#151b2e] dark:border-[#2a3350] flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: handleMarkForReviewAndNext, className: "px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-semibold dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 transition", children: "Mark for Review & Next" }), _jsx("button", { onClick: handleClearResponse, className: "px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition", children: "Clear Response" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => currentQuestionIndex > 0 && jumpToQuestion(currentQuestionIndex - 1), disabled: currentQuestionIndex === 0, className: "px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800", children: "Previous" }), _jsxs("button", { onClick: handleSaveAndNext, className: "px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center gap-1", children: ["Save & Next ", _jsx(ChevronRight, { className: "w-3.5 h-3.5" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-[#151b2e] dark:border-[#2a3350] flex items-center gap-3", children: [_jsx("img", { src: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', alt: user?.name, className: "w-10 h-10 rounded-xl object-cover" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-slate-900 dark:text-white font-display", children: user?.name || 'Aspirant' }), _jsxs("p", { className: "text-[10px] text-slate-500 font-mono tabular-nums", children: ["Roll: SSC2026-", user?.id.substr(0, 6)] })] })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-[#151b2e] dark:border-[#2a3350] space-y-2.5 text-xs", children: [_jsx("span", { className: "font-bold text-slate-900 dark:text-white block text-[11px] uppercase tracking-wider font-display", children: "Question Palette Status" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-[11px]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-4 h-4 rounded bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold font-mono tabular-nums", children: answeredCount }), _jsx("span", { className: "text-slate-600 dark:text-slate-400", children: "Answered" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-4 h-4 rounded bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold font-mono tabular-nums", children: notAnsweredCount }), _jsx("span", { className: "text-slate-600 dark:text-slate-400", children: "Not Answered" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-4 h-4 rounded bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold font-mono tabular-nums", children: markedReviewCount }), _jsx("span", { className: "text-slate-600 dark:text-slate-400", children: "Marked Review" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-4 h-4 rounded bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center justify-center font-bold font-mono tabular-nums", children: notVisitedCount }), _jsx("span", { className: "text-slate-600 dark:text-slate-400", children: "Not Visited" })] })] })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-[#151b2e] dark:border-[#2a3350] space-y-3", children: [_jsx("span", { className: "text-xs font-bold text-slate-900 dark:text-white block font-display", children: "Jump to Question" }), _jsx("div", { className: "grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1", children: questions.map((q, qIdx) => {
                                            const status = responses[q.id]?.status || 'not_visited';
                                            const isCurrent = currentQuestionIndex === qIdx;
                                            let btnStyle = 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
                                            if (status === 'answered') {
                                                btnStyle = 'bg-emerald-600 text-white font-bold';
                                            }
                                            else if (status === 'not_answered') {
                                                btnStyle = 'bg-rose-500 text-white font-bold';
                                            }
                                            else if (status === 'marked_for_review' || status === 'answered_and_marked') {
                                                btnStyle = 'bg-amber-500 text-white font-bold';
                                            }
                                            return (_jsx("button", { onClick: () => jumpToQuestion(qIdx), className: `h-9 rounded-lg text-xs font-mono tabular-nums transition flex items-center justify-center ${btnStyle} ${isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`, children: qIdx + 1 }, q.id));
                                        }) })] })] })] }), isSubmitModalOpen && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-md w-full p-6 space-y-6 border border-slate-200 dark:bg-[#151b2e] dark:border-[#2a3350] shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800", children: [_jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white font-display", children: "Submit Test Confirmation" }), _jsx("button", { onClick: () => setIsSubmitModalOpen(false), className: "text-slate-400 hover:text-slate-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "space-y-3 text-xs", children: [_jsx("p", { className: "text-slate-600 dark:text-slate-400", children: "You are about to finalize your test. Review your completion summary before submission:" }), _jsxs("div", { className: "grid grid-cols-2 gap-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono tabular-nums", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block font-sans", children: "Total Questions:" }), _jsx("span", { className: "font-bold text-slate-900 dark:text-white text-sm", children: questions.length })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block font-sans", children: "Answered:" }), _jsx("span", { className: "font-bold text-emerald-600 dark:text-emerald-400 text-sm", children: answeredCount })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block font-sans", children: "Not Answered:" }), _jsx("span", { className: "font-bold text-rose-500 dark:text-rose-400 text-sm", children: notAnsweredCount })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-500 block font-sans", children: "Marked for Review:" }), _jsx("span", { className: "font-bold text-amber-500 dark:text-amber-400 text-sm", children: markedReviewCount })] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-2", children: [_jsx("button", { onClick: () => setIsSubmitModalOpen(false), className: "px-4 py-2 rounded-xl border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 text-xs font-semibold", children: "Resume Test" }), _jsx("button", { onClick: () => handleSubmitTest(false), disabled: isSubmitting, className: "px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition disabled:opacity-50", children: isSubmitting ? 'Evaluating Marks...' : 'Yes, Submit Test' })] })] }) }))] }));
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Zap, Brain, ArrowRight, ArrowLeft, Sparkles, Award } from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
const getOptionText = (option) => typeof option === 'string'
    ? option
    : option?.text || option?.optionText || option?.label || option?.value || '';
export const PracticeSessionPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAppStore();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [answersMap, setAnswersMap] = useState({});
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [questionTimer, setQuestionTimer] = useState(0);
    const [aiExplanation, setAiExplanation] = useState(null);
    const [isExplainingAi, setIsExplainingAi] = useState(false);
    const [sessionFinished, setSessionFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    // Load Practice Session Questions
    useEffect(() => {
        loadQuestions();
    }, []);
    // Timer Tick
    useEffect(() => {
        if (sessionFinished || loading)
            return;
        const interval = setInterval(() => {
            setTimerSeconds(s => s + 1);
            if (!isSubmitted) {
                setQuestionTimer(q => q + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionFinished, loading, isSubmitted]);
    const loadQuestions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/questions/practice', {
                params: {
                    mode: searchParams.get('mode') || 'random',
                    examId: searchParams.get('examId'),
                    subjectId: searchParams.get('subjectId'),
                    topicId: searchParams.get('topicId'),
                    difficulty: searchParams.get('difficulty') || 'all',
                    count: searchParams.get('count') || '10'
                }
            });
            if (res.data?.questions && res.data.questions.length > 0) {
                setQuestions(res.data.questions);
            }
            else {
                // Fallback fetch all
                const allRes = await api.get('/questions/practice', { params: { count: 10 } });
                setQuestions(allRes.data?.questions || []);
            }
        }
        catch (err) {
            console.error('Failed to load practice questions:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const currentQ = questions[currentIndex];
    const handleSelectOption = (optId) => {
        if (isSubmitted)
            return;
        setSelectedOptionId(optId);
    };
    const handleCheckAnswer = async () => {
        if (!selectedOptionId || !currentQ)
            return;
        setIsSubmitted(true);
        const isCorrect = selectedOptionId === currentQ.correctOptionId;
        setAnswersMap(prev => ({
            ...prev,
            [currentQ.id]: {
                selectedId: selectedOptionId,
                isCorrect,
                timeSpent: questionTimer
            }
        }));
        try {
            await api.post('/questions/attempt', {
                questionId: currentQ.id,
                selectedOptionId,
                timeSpentSeconds: questionTimer,
                mode: searchParams.get('mode') || 'topic'
            });
        }
        catch (err) {
            console.error('Failed to record attempt:', err);
        }
    };
    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            const nextQ = questions[currentIndex + 1];
            const existingAnswer = answersMap[nextQ.id];
            if (existingAnswer) {
                setSelectedOptionId(existingAnswer.selectedId);
                setIsSubmitted(true);
            }
            else {
                setSelectedOptionId(null);
                setIsSubmitted(false);
            }
            setQuestionTimer(0);
            setAiExplanation(null);
        }
        else {
            setSessionFinished(true);
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            const prevQ = questions[currentIndex - 1];
            const existingAnswer = answersMap[prevQ.id];
            if (existingAnswer) {
                setSelectedOptionId(existingAnswer.selectedId);
                setIsSubmitted(true);
            }
            else {
                setSelectedOptionId(null);
                setIsSubmitted(false);
            }
            setQuestionTimer(0);
            setAiExplanation(null);
        }
    };
    const handleAskAiExplanation = async () => {
        if (!currentQ)
            return;
        try {
            setIsExplainingAi(true);
            const res = await api.post('/ai/explain', {
                questionId: currentQ.id,
                selectedOptionId
            });
            if (res.data?.explanation) {
                setAiExplanation(res.data.explanation);
            }
        }
        catch (err) {
            console.error('AI explanation failed:', err);
        }
        finally {
            setIsExplainingAi(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "py-20 text-center text-xs text-slate-500", children: "Preparing practice session questions..." }));
    }
    if (questions.length === 0) {
        return (_jsxs("div", { className: "max-w-md mx-auto py-20 px-4 text-center space-y-4", children: [_jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "No questions found" }), _jsx("p", { className: "text-xs text-slate-500", children: "Try choosing a different topic or exam." }), _jsx(Link, { to: "/practice", className: "inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs", children: "Return to Practice Hub" })] }));
    }
    // ----------------------------------------------------
    // SESSION FINISHED SUMMARY
    // ----------------------------------------------------
    if (sessionFinished) {
        const totalAttempted = Object.keys(answersMap).length;
        const totalCorrect = Object.values(answersMap).filter(a => a.isCorrect).length;
        const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
        const xpEarned = totalCorrect * 15 + (totalAttempted - totalCorrect) * 5;
        return (_jsx("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-xl dark:bg-slate-900 dark:border-slate-800 p-8 space-y-8", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2", children: _jsx(Award, { className: "w-8 h-8" }) }), _jsx("h1", { className: "text-2xl font-extrabold text-slate-900 dark:text-white", children: "Practice Session Completed! \uD83C\uDF89" }), _jsx("p", { className: "text-xs text-slate-500", children: "Great effort! Here is your session speed and accuracy breakdown." })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-center", children: [_jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsx("span", { className: "text-[11px] text-slate-500 block font-semibold", children: "Score" }), _jsxs("span", { className: "text-xl font-extrabold text-slate-900 dark:text-white", children: [totalCorrect, " / ", questions.length] })] }), _jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsx("span", { className: "text-[11px] text-slate-500 block font-semibold", children: "Accuracy" }), _jsxs("span", { className: "text-xl font-extrabold text-emerald-600 dark:text-emerald-400", children: [accuracy, "%"] })] }), _jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsx("span", { className: "text-[11px] text-slate-500 block font-semibold", children: "Time Spent" }), _jsxs("span", { className: "text-xl font-extrabold text-slate-900 dark:text-white", children: [Math.floor(timerSeconds / 60), "m ", timerSeconds % 60, "s"] })] }), _jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsx("span", { className: "text-[11px] text-slate-500 block font-semibold", children: "XP Earned" }), _jsxs("span", { className: "text-xl font-extrabold text-amber-500", children: ["+", xpEarned, " XP"] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800", children: [_jsx(Link, { to: "/practice", className: "flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center shadow-md transition", children: "Start Another Session" }), _jsx(Link, { to: "/dashboard", className: "flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-bold text-xs text-center transition", children: "Return to Dashboard" })] })] }) }));
    }
    // ----------------------------------------------------
    // ACTIVE QUESTION SOLVING VIEW
    // ----------------------------------------------------
    const currentAnswer = answersMap[currentQ.id];
    return (_jsxs("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen pb-16", children: [_jsxs("div", { className: "bg-white border-b border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-16 z-30 shadow-sm", children: [_jsxs("div", { className: "max-w-4xl mx-auto flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-xs font-bold text-slate-900 dark:text-white", children: ["Question ", currentIndex + 1, " of ", questions.length] }), _jsx("span", { className: "hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", children: currentQ.source || 'Competitive Exam' })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400", children: [_jsx(Clock, { className: "w-4 h-4 text-indigo-600" }), _jsxs("span", { children: [Math.floor(timerSeconds / 60), ":", timerSeconds % 60 < 10 ? '0' : '', timerSeconds % 60] })] }), _jsx("button", { onClick: () => setSessionFinished(true), className: "text-xs font-bold text-slate-500 hover:text-red-600 transition", children: "Finish Session" })] })] }), _jsx("div", { className: "w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden max-w-4xl mx-auto", children: _jsx("div", { className: "bg-indigo-600 h-full transition-all duration-300 rounded-full", style: { width: `${((currentIndex + 1) / questions.length) * 100}%` } }) })] }), _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6", children: [_jsxs("div", { className: "p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: `px-2.5 py-0.5 rounded text-[11px] font-bold ${currentQ.difficulty === 'hard'
                                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                            : currentQ.difficulty === 'medium'
                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`, children: ["Difficulty: ", currentQ.difficulty.toUpperCase()] }), _jsxs("span", { className: "text-xs font-mono text-slate-500", children: ["+", currentQ.marks, " / -", currentQ.negativeMarks, " Marks"] })] }), _jsx("div", { className: "text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed", children: currentQ.questionText }), _jsx("div", { className: "space-y-3 pt-2", children: currentQ.options.map((option, idx) => {
                                    const letter = String.fromCharCode(65 + idx); // A, B, C, D
                                    const isSelected = selectedOptionId === option.id;
                                    const isCorrectOption = option.id === currentQ.correctOptionId;
                                    let optionStyle = 'border-slate-200 hover:border-indigo-300 bg-white dark:bg-slate-900 dark:border-slate-800';
                                    if (isSubmitted) {
                                        if (isCorrectOption) {
                                            optionStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20';
                                        }
                                        else if (isSelected && !isCorrectOption) {
                                            optionStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold ring-2 ring-rose-500/20';
                                        }
                                        else {
                                            optionStyle = 'border-slate-200 bg-slate-50/40 dark:bg-slate-800/40 text-slate-400 dark:border-slate-800 opacity-60';
                                        }
                                    }
                                    else if (isSelected) {
                                        optionStyle = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500/20';
                                    }
                                    return (_jsxs("button", { onClick: () => handleSelectOption(option.id), disabled: isSubmitted, className: `w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${optionStyle}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0", children: letter }), _jsx("span", { children: getOptionText(option) })] }), isSubmitted && isCorrectOption && (_jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600 shrink-0" })), isSubmitted && isSelected && !isCorrectOption && (_jsx(XCircle, { className: "w-5 h-5 text-rose-600 shrink-0" }))] }, option.id));
                                }) }), _jsxs("div", { className: "pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3", children: [_jsxs("button", { onClick: handlePrevious, disabled: currentIndex === 0, className: "px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1.5", children: [_jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), " Previous"] }), !isSubmitted ? (_jsx("button", { onClick: handleCheckAnswer, disabled: !selectedOptionId, className: "px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50", children: "Check Answer" })) : (_jsxs("button", { onClick: handleNext, className: "px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5", children: [currentIndex === questions.length - 1 ? 'Finish Session' : 'Next Question', _jsx(ArrowRight, { className: "w-3.5 h-3.5" })] }))] })] }), isSubmitted && (_jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4 animate-in fade-in-50", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800", children: [_jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400", children: "Detailed Explanation & Shortcut" }), _jsxs("button", { onClick: handleAskAiExplanation, disabled: isExplainingAi, className: "px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 transition flex items-center gap-1.5", children: [_jsx(Brain, { className: "w-3.5 h-3.5 text-purple-600" }), isExplainingAi ? 'Analyzing with AI...' : 'Ask AI Tutor to Break Down'] })] }), _jsx("div", { className: "text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line", children: currentQ.explanation }), currentQ.shortcutTip && (_jsxs("div", { className: "p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1", children: [_jsxs("span", { className: "font-bold flex items-center gap-1.5", children: [_jsx(Zap, { className: "w-3.5 h-3.5 text-amber-600 fill-amber-600" }), " Exam Shortcut / 10-Second Trick:"] }), _jsx("p", { children: currentQ.shortcutTip })] })), aiExplanation && (_jsxs("div", { className: "p-4 rounded-xl bg-purple-50/80 border border-purple-200 dark:bg-purple-950/30 dark:border-purple-900 text-xs space-y-2 text-purple-950 dark:text-purple-200", children: [_jsxs("span", { className: "font-bold flex items-center gap-1.5 text-purple-700 dark:text-purple-300", children: [_jsx(Sparkles, { className: "w-4 h-4 text-purple-600" }), " AI Master Tutor Deep Dive:"] }), _jsx("div", { className: "leading-relaxed whitespace-pre-line", children: aiExplanation })] }))] }))] })] }));
};

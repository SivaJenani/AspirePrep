import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Target, AlertTriangle, Archive, Shuffle, BookOpen, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../lib/api';
export const PracticeHubPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedMode, setSelectedMode] = useState(searchParams.get('mode') || 'topic');
    const [selectedExamId, setSelectedExamId] = useState(searchParams.get('examId') || 'exam_ssc_cgl');
    const [selectedSubjectId, setSelectedSubjectId] = useState(searchParams.get('subjectId') || 'sub_ssc_quant');
    const [selectedTopicId, setSelectedTopicId] = useState(searchParams.get('topicId') || 'top_profit_loss');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [questionCount, setQuestionCount] = useState(10);
    useEffect(() => {
        loadPrerequisites();
    }, [selectedExamId]);
    const loadPrerequisites = async () => {
        try {
            const [exRes, hRes] = await Promise.all([
                api.get('/exams'),
                api.get(`/exams/${selectedExamId}/hierarchy`)
            ]);
            if (exRes.data?.exams)
                setExams(exRes.data.exams);
            if (hRes.data?.subjects) {
                setSubjects(hRes.data.subjects);
                if (hRes.data.subjects.length > 0 && !selectedSubjectId) {
                    setSelectedSubjectId(hRes.data.subjects[0].id);
                }
            }
            if (hRes.data?.topics) {
                setTopics(hRes.data.topics);
                if (hRes.data.topics.length > 0 && !selectedTopicId) {
                    setSelectedTopicId(hRes.data.topics[0].id);
                }
            }
        }
        catch (err) {
            console.error('Failed to load practice hub options:', err);
        }
    };
    const handleStartSession = () => {
        const params = new URLSearchParams();
        params.set('mode', selectedMode);
        params.set('examId', selectedExamId);
        params.set('count', questionCount.toString());
        params.set('difficulty', selectedDifficulty);
        if (selectedMode === 'topic' && selectedTopicId) {
            params.set('topicId', selectedTopicId);
        }
        if (selectedMode === 'subject' && selectedSubjectId) {
            params.set('subjectId', selectedSubjectId);
        }
        navigate(`/practice/session?${params.toString()}`);
    };
    const currentSubjectTopics = topics.filter(t => t.subjectId === selectedSubjectId);
    const practiceModes = [
        {
            id: 'topic',
            title: 'Topic-wise Practice',
            desc: 'Master individual concepts like Profit & Loss, Syllogisms, or Indian Constitution.',
            icon: Target,
            color: 'indigo'
        },
        {
            id: 'subject',
            title: 'Subject-wise Drill',
            desc: 'Broad practice across all topics inside Quantitative Aptitude, Reasoning, or English.',
            icon: BookOpen,
            color: 'blue'
        },
        {
            id: 'weak',
            title: 'Weak Area Booster',
            desc: 'AI-filtered session focusing strictly on topics where your accuracy is below 60%.',
            icon: AlertTriangle,
            color: 'amber'
        },
        {
            id: 'pyq',
            title: 'Previous-Year Questions (PYQ)',
            desc: 'Official historical questions from past exams with shift metadata.',
            icon: Archive,
            color: 'purple'
        },
        {
            id: 'random',
            title: 'Mixed Random Drill',
            desc: 'Adaptive mixed set to simulate unexpected question patterns.',
            icon: Shuffle,
            color: 'emerald'
        }
    ];
    return (_jsxs("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen pb-16", children: [_jsx("div", { className: "bg-white border-b border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400", children: [_jsx(Zap, { className: "w-4 h-4" }), " Practice Engine"] }), _jsx("h1", { className: "text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight", children: "Targeted Question Practice" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 max-w-2xl", children: "Select your preferred training mode, fine-tune topic filters, and reinforce speed with instant explanations." })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white mb-4", children: "1. Choose Training Mode" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: practiceModes.map((mode) => {
                                    const Icon = mode.icon;
                                    const isSelected = selectedMode === mode.id;
                                    return (_jsx("button", { onClick: () => setSelectedMode(mode.id), className: `p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${isSelected
                                            ? 'bg-indigo-50/60 border-indigo-600 shadow-md ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:border-indigo-500'
                                            : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'}`, children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center ${isSelected
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`, children: _jsx(Icon, { className: "w-4 h-4" }) }), isSelected && _jsx(CheckCircle2, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white", children: mode.title }), _jsx("p", { className: "text-xs text-slate-500 mt-1 leading-relaxed", children: mode.desc })] })] }) }, mode.id));
                                }) })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 space-y-6", children: [_jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "2. Practice Configuration" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300", children: "Target Examination" }), _jsx("select", { value: selectedExamId, onChange: (e) => setSelectedExamId(e.target.value), className: "w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: exams.map((ex) => (_jsx("option", { value: ex.id, children: ex.name }, ex.id))) })] }), (selectedMode === 'topic' || selectedMode === 'subject') && (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300", children: "Subject" }), _jsx("select", { value: selectedSubjectId, onChange: (e) => setSelectedSubjectId(e.target.value), className: "w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: subjects.map((sub) => (_jsx("option", { value: sub.id, children: sub.name }, sub.id))) })] })), selectedMode === 'topic' && (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300", children: "Target Topic" }), _jsx("select", { value: selectedTopicId, onChange: (e) => setSelectedTopicId(e.target.value), className: "w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: currentSubjectTopics.length > 0 ? (currentSubjectTopics.map((top) => (_jsx("option", { value: top.id, children: top.name }, top.id)))) : (_jsx("option", { value: "", children: "No specific topics found" })) })] })), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300", children: "Difficulty Level" }), _jsxs("select", { value: selectedDifficulty, onChange: (e) => setSelectedDifficulty(e.target.value), className: "w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: [_jsx("option", { value: "all", children: "All Difficulties (Balanced)" }), _jsx("option", { value: "easy", children: "Easy (Foundation Building)" }), _jsx("option", { value: "medium", children: "Medium (Standard Exam Level)" }), _jsx("option", { value: "hard", children: "Hard (Rank Decider Traps)" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300", children: "Questions in Session" }), _jsx("div", { className: "flex gap-2", children: [5, 10, 15, 20].map((num) => (_jsxs("button", { type: "button", onClick: () => setQuestionCount(num), className: `flex-1 py-2 rounded-lg text-xs font-bold transition ${questionCount === num
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'}`, children: [num, " Qs"] }, num))) })] })] }), _jsxs("div", { className: "pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500", children: [_jsx(Clock, { className: "w-4 h-4 text-slate-400" }), "Estimated session duration: ~", questionCount * 1.5, " minutes \u2022 +15 XP per correct answer"] }), _jsxs("button", { onClick: handleStartSession, className: "px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2", children: ["Start Practice Session ", _jsx(ArrowRight, { className: "w-4 h-4" })] })] })] })] })] }));
};

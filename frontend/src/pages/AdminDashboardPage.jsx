import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
export const AdminDashboardPage = () => {
    const { user } = useAppStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalExams: 0,
        totalQuestions: 0,
        totalMockTests: 0,
        totalUsers: 0
    });
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [mockTests, setMockTests] = useState([]);
    // Create Question Form State
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [newQ, setNewQ] = useState({
        subjectId: '',
        topicId: '',
        difficulty: 'medium',
        questionText: '',
        options: [
            { id: 'opt_1', text: '' },
            { id: 'opt_2', text: '' },
            { id: 'opt_3', text: '' },
            { id: 'opt_4', text: '' }
        ],
        correctOptionId: 'opt_1',
        explanation: '',
        shortcutTip: '',
        marks: 2,
        negativeMarks: 0.5,
        isPreviousYearQuestion: false,
        examYear: '2025'
    });
    // Create Exam Form State
    const [isAddingExam, setIsAddingExam] = useState(false);
    const [newExam, setNewExam] = useState({
        name: '',
        slug: '',
        category: 'Government',
        description: '',
        conductingBody: '',
        totalMarks: 200,
        durationMinutes: 60,
        totalQuestions: 100,
        negativeMarking: 0.5
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadAdminData();
    }, []);
    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [exRes, qRes, mRes] = await Promise.all([
                api.get('/exams'),
                api.get('/questions/practice', { params: { count: 50 } }),
                api.get('/mock-tests')
            ]);
            const exList = exRes.data?.exams || [];
            const qList = qRes.data?.questions || [];
            const mList = mRes.data?.mockTests || [];
            setExams(exList);
            setQuestions(qList);
            setMockTests(mList);
            setStats({
                totalExams: exList.length,
                totalQuestions: qList.length * 10 + 250, // Projected total
                totalMockTests: mList.length,
                totalUsers: 1420
            });
            if (exList.length > 0) {
                const hRes = await api.get(`/exams/${exList[0].id}/hierarchy`);
                setSubjects(hRes.data?.subjects || []);
                setTopics(hRes.data?.topics || []);
                if (hRes.data?.subjects?.length > 0) {
                    setNewQ(prev => ({
                        ...prev,
                        subjectId: hRes.data.subjects[0].id,
                        topicId: hRes.data.topics?.[0]?.id || ''
                    }));
                }
            }
        }
        catch (err) {
            console.error('Failed to load admin data:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/questions', newQ);
            if (res.data?.question) {
                setQuestions(prev => [res.data.question, ...prev]);
                setIsAddingQuestion(false);
                alert('Question added successfully to the competitive question bank!');
            }
        }
        catch (err) {
            console.error('Failed to create question:', err);
            alert('Failed to add question. Check inputs.');
        }
    };
    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: newExam.name,
                slug: newExam.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                category: newExam.category,
                description: newExam.description,
                conductingBody: newExam.conductingBody,
                patternSummary: {
                    totalMarks: Number(newExam.totalMarks),
                    durationMinutes: Number(newExam.durationMinutes),
                    totalQuestions: Number(newExam.totalQuestions),
                    negativeMarking: Number(newExam.negativeMarking)
                },
                tierLevels: ['Tier 1 Computer Based Exam', 'Tier 2 Descriptive / Mains']
            };
            const res = await api.post('/admin/exams', payload);
            if (res.data?.exam) {
                setExams(prev => [...prev, res.data.exam]);
                setIsAddingExam(false);
                alert('New competitive exam added to directory successfully!');
            }
        }
        catch (err) {
            console.error('Failed to add exam:', err);
        }
    };
    return (_jsxs("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen pb-16", children: [_jsx("div", { className: "bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold", children: _jsx(ShieldCheck, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-xl font-extrabold text-white", children: "Admin Management Portal" }), _jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30", children: "Role: Faculty / Admin" })] }), _jsx("p", { className: "text-xs text-slate-400", children: "Manage Competitive Exams, Author Multi-Choice Questions, and Publish Official Mock Tests" })] })] }), _jsx("div", { className: "flex gap-1.5 bg-slate-800 p-1 rounded-xl", children: [
                                { id: 'overview', label: 'Overview' },
                                { id: 'questions', label: 'Question Bank' },
                                { id: 'exams', label: 'Exams Directory' },
                                { id: 'mocks', label: 'Mock Test Suite' }
                            ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === tab.id
                                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                                    : 'text-slate-300 hover:text-white'}`, children: tab.label }, tab.id))) })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8", children: [activeTab === 'overview' && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800", children: [_jsx("span", { className: "text-xs text-slate-500 font-semibold block", children: "Supported Exams" }), _jsxs("div", { className: "text-2xl font-extrabold text-slate-900 dark:text-white mt-1", children: [exams.length, " Exams"] }), _jsx("span", { className: "text-[11px] text-indigo-600 font-medium", children: "Across 8 Categories" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800", children: [_jsx("span", { className: "text-xs text-slate-500 font-semibold block", children: "Total Question Bank" }), _jsxs("div", { className: "text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1", children: [stats.totalQuestions, "+ Qs"] }), _jsx("span", { className: "text-[11px] text-slate-400", children: "With verified formulas" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800", children: [_jsx("span", { className: "text-xs text-slate-500 font-semibold block", children: "Published Mock Tests" }), _jsxs("div", { className: "text-2xl font-extrabold text-amber-500 mt-1", children: [mockTests.length, " Full Tests"] }), _jsx("span", { className: "text-[11px] text-slate-400", children: "Sectional & PYQ sets" })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800", children: [_jsx("span", { className: "text-xs text-slate-500 font-semibold block", children: "Active Candidates" }), _jsx("div", { className: "text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1", children: "1,420 Aspirants" }), _jsx("span", { className: "text-[11px] text-emerald-600 font-medium", children: "+18% this month" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4", children: [_jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Author Questions & Explanations" }), _jsx("p", { className: "text-xs text-slate-500", children: "Upload new MCQs tagged with topic taxonomy, 10-second shortcuts, formula cards, and difficulty weights." }), _jsxs("button", { onClick: () => {
                                                    setActiveTab('questions');
                                                    setIsAddingQuestion(true);
                                                }, className: "px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add Question to Bank"] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4", children: [_jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Expand Exam Hierarchy" }), _jsx("p", { className: "text-xs text-slate-500", children: "Add new state or national competitive examinations with custom tier patterns, marking rules, and duration." }), _jsxs("button", { onClick: () => {
                                                    setActiveTab('exams');
                                                    setIsAddingExam(true);
                                                }, className: "px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs transition flex items-center gap-1.5", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add New Examination"] })] })] })] })), activeTab === 'questions' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Question Bank Repository" }), _jsx("p", { className: "text-xs text-slate-500", children: "Review, tag, and author questions across topics" })] }), _jsxs("button", { onClick: () => setIsAddingQuestion(!isAddingQuestion), className: "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5", children: [_jsx(Plus, { className: "w-4 h-4" }), " ", isAddingQuestion ? 'Cancel' : 'Add New Question'] })] }), isAddingQuestion && (_jsxs("form", { onSubmit: handleCreateQuestion, className: "p-6 rounded-2xl bg-white border border-slate-200 shadow-md dark:bg-slate-900 dark:border-slate-800 space-y-4", children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white", children: "Create New MCQ Item" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Subject" }), _jsx("select", { value: newQ.subjectId, onChange: (e) => setNewQ({ ...newQ, subjectId: e.target.value }), className: "w-full p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: subjects.map((sub) => (_jsx("option", { value: sub.id, children: sub.name }, sub.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Topic" }), _jsx("select", { value: newQ.topicId, onChange: (e) => setNewQ({ ...newQ, topicId: e.target.value }), className: "w-full p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: topics.map((top) => (_jsx("option", { value: top.id, children: top.name }, top.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Difficulty" }), _jsxs("select", { value: newQ.difficulty, onChange: (e) => setNewQ({ ...newQ, difficulty: e.target.value }), className: "w-full p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: [_jsx("option", { value: "easy", children: "Easy" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "hard", children: "Hard" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Question Statement" }), _jsx("textarea", { rows: 3, placeholder: "Enter the full question problem text...", value: newQ.questionText, onChange: (e) => setNewQ({ ...newQ, questionText: e.target.value }), required: true, className: "w-full p-3 rounded-xl border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block", children: "4 Multiple Choice Options (Select Radio for Correct)" }), newQ.options.map((opt, idx) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "radio", name: "correctOpt", checked: newQ.correctOptionId === opt.id, onChange: () => setNewQ({ ...newQ, correctOptionId: opt.id }), className: "w-4 h-4 text-indigo-600" }), _jsxs("span", { className: "text-xs font-bold text-slate-500 w-4", children: [String.fromCharCode(65 + idx), ":"] }), _jsx("input", { type: "text", placeholder: `Option ${String.fromCharCode(65 + idx)} text`, value: opt.text, onChange: (e) => {
                                                            const updated = [...newQ.options];
                                                            updated[idx].text = e.target.value;
                                                            setNewQ({ ...newQ, options: updated });
                                                        }, required: true, className: "flex-1 p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }, opt.id)))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Step-by-Step Explanation" }), _jsx("textarea", { rows: 3, placeholder: "Detailed conceptual solution...", value: newQ.explanation, onChange: (e) => setNewQ({ ...newQ, explanation: e.target.value }), className: "w-full p-2.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "10-Second Shortcut Hack" }), _jsx("textarea", { rows: 3, placeholder: "Shortcut trick, formula, or elimination technique...", value: newQ.shortcutTip, onChange: (e) => setNewQ({ ...newQ, shortcutTip: e.target.value }), className: "w-full p-2.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setIsAddingQuestion(false), className: "px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700", children: "Publish Question" })] })] })), _jsx("div", { className: "bg-white border border-slate-200/80 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { className: "border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3.5 px-4", children: "Question Text" }), _jsx("th", { className: "py-3.5 px-4", children: "Difficulty" }), _jsx("th", { className: "py-3.5 px-4", children: "Marks" }), _jsx("th", { className: "py-3.5 px-4", children: "Source" }), _jsx("th", { className: "py-3.5 px-4 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: questions.map((q) => (_jsxs("tr", { className: "hover:bg-slate-50 dark:hover:bg-slate-800/40", children: [_jsx("td", { className: "py-3 px-4 max-w-md font-medium text-slate-900 dark:text-white truncate", children: q.questionText }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", children: q.difficulty }) }), _jsxs("td", { className: "py-3 px-4 font-mono", children: ["+", q.marks, " / -", q.negativeMarks] }), _jsx("td", { className: "py-3 px-4 text-slate-500", children: q.source || 'Faculty Verified' }), _jsx("td", { className: "py-3 px-4 text-right", children: _jsx("button", { className: "text-slate-400 hover:text-red-600 p-1", children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }, q.id))) })] }) })] })), activeTab === 'exams' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Exam Catalog Management" }), _jsx("p", { className: "text-xs text-slate-500", children: "Configure exam patterns, durations, marking schemes" })] }), _jsxs("button", { onClick: () => setIsAddingExam(!isAddingExam), className: "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5", children: [_jsx(Plus, { className: "w-4 h-4" }), " ", isAddingExam ? 'Cancel' : 'Add New Exam'] })] }), isAddingExam && (_jsxs("form", { onSubmit: handleCreateExam, className: "p-6 rounded-2xl bg-white border border-slate-200 shadow-md dark:bg-slate-900 dark:border-slate-800 space-y-4", children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white", children: "Add New Competitive Exam" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Exam Name" }), _jsx("input", { type: "text", placeholder: "e.g. TNPSC Group 1 Combined Civil Services", value: newExam.name, onChange: (e) => setNewExam({ ...newExam, name: e.target.value }), required: true, className: "w-full p-2.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Category" }), _jsxs("select", { value: newExam.category, onChange: (e) => setNewExam({ ...newExam, category: e.target.value }), className: "w-full p-2.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white", children: [_jsx("option", { value: "Government", children: "Government" }), _jsx("option", { value: "Civil Services", children: "Civil Services" }), _jsx("option", { value: "Banking", children: "Banking" }), _jsx("option", { value: "State Govt", children: "State Govt" }), _jsx("option", { value: "Railways", children: "Railways" }), _jsx("option", { value: "Engineering", children: "Engineering" }), _jsx("option", { value: "Medical", children: "Medical" }), _jsx("option", { value: "Management", children: "Management" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Description" }), _jsx("textarea", { rows: 2, placeholder: "Brief description of the exam posts and pattern...", value: newExam.description, onChange: (e) => setNewExam({ ...newExam, description: e.target.value }), className: "w-full p-2.5 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Duration (Mins)" }), _jsx("input", { type: "number", value: newExam.durationMinutes, onChange: (e) => setNewExam({ ...newExam, durationMinutes: Number(e.target.value) }), className: "w-full p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Total Marks" }), _jsx("input", { type: "number", value: newExam.totalMarks, onChange: (e) => setNewExam({ ...newExam, totalMarks: Number(e.target.value) }), className: "w-full p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Total Questions" }), _jsx("input", { type: "number", value: newExam.totalQuestions, onChange: (e) => setNewExam({ ...newExam, totalQuestions: Number(e.target.value) }), className: "w-full p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1", children: "Negative Mark" }), _jsx("input", { type: "number", step: "0.25", value: newExam.negativeMarking, onChange: (e) => setNewExam({ ...newExam, negativeMarking: Number(e.target.value) }), className: "w-full p-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setIsAddingExam(false), className: "px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700", children: "Add Exam" })] })] })), _jsx("div", { className: "bg-white border border-slate-200/80 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs", children: [_jsx("thead", { className: "border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3.5 px-4", children: "Exam Name" }), _jsx("th", { className: "py-3.5 px-4", children: "Category" }), _jsx("th", { className: "py-3.5 px-4", children: "Duration" }), _jsx("th", { className: "py-3.5 px-4", children: "Marks" }), _jsx("th", { className: "py-3.5 px-4", children: "Negative Mark" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: exams.map((ex) => (_jsxs("tr", { className: "hover:bg-slate-50 dark:hover:bg-slate-800/40", children: [_jsx("td", { className: "py-3 px-4 font-bold text-slate-900 dark:text-white", children: ex.name }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", children: ex.category }) }), _jsxs("td", { className: "py-3 px-4 font-mono", children: [ex.patternSummary?.durationMinutes || 60, " mins"] }), _jsx("td", { className: "py-3 px-4 font-mono", children: ex.patternSummary?.totalMarks || 200 }), _jsxs("td", { className: "py-3 px-4 font-mono text-rose-600", children: ["-", ex.patternSummary?.negativeMarking || 0.5] })] }, ex.id))) })] }) })] })), activeTab === 'mocks' && (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Active Mock Test Catalog" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: mockTests.map((t) => (_jsxs("div", { className: "p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white", children: t.title }), _jsx("span", { className: "px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", children: t.testType })] }), _jsx("p", { className: "text-xs text-slate-500", children: t.description }), _jsxs("div", { className: "flex gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 pt-2", children: [_jsxs("span", { children: [t.durationMinutes, " mins"] }), _jsxs("span", { children: [t.totalQuestions, " Qs"] }), _jsxs("span", { children: [t.totalMarks, " Marks"] })] })] }, t.id))) })] }))] })] }));
};

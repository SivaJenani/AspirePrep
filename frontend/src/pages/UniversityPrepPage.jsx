import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, Sparkles, Plus, Flame, Layers, Calculator, FileText, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { UniversityCountdownTimer } from '../components/university/UniversityCountdownTimer';
import { UnitSyllabusAccordion } from '../components/university/UnitSyllabusAccordion';
import { InternalMarksGradeCalculator } from '../components/university/InternalMarksGradeCalculator';
import { UniversityCramPlanView } from '../components/university/UniversityCramPlanView';
import { AddUniversityExamModal } from '../components/university/AddUniversityExamModal';
import { UniversalSyllabusAnalyzer } from '../components/university/UniversalSyllabusAnalyzer';
import { BrainCircuit } from 'lucide-react';
export const UniversityPrepPage = () => {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [activeTab, setActiveTab] = useState('analyzer');
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // Fetch all university exams
    const fetchExams = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/university-exams');
            const data = res.data;
            if (data && data.exams) {
                setExams(data.exams);
                if (data.exams.length > 0 && !selectedExamId) {
                    setSelectedExamId(data.exams[0].id);
                }
            }
        }
        catch (err) {
            console.error('Error fetching university exams:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchExams();
    }, []);
    const currentExam = exams.find(e => e.id === selectedExamId) || exams[0];
    // Handle adding new university exam
    const handleAddExam = async (examData) => {
        try {
            const res = await api.post('/university-exams', examData);
            const data = res.data;
            if (data && data.exam) {
                setExams(prev => [data.exam, ...prev]);
                setSelectedExamId(data.exam.id);
            }
        }
        catch (err) {
            console.error('Error adding university exam:', err);
        }
    };
    // Handle toggling unit completion
    const handleToggleUnit = async (unitNumber, isCompleted) => {
        if (!currentExam)
            return;
        try {
            const res = await api.post(`/university-exams/${currentExam.id}/toggle-unit`, {
                unitNumber,
                isCompleted: !isCompleted
            });
            const data = res.data;
            if (data && data.exam) {
                setExams(prev => prev.map(e => e.id === data.exam.id ? data.exam : e));
            }
        }
        catch (err) {
            console.error('Error toggling unit:', err);
        }
    };
    // Handle toggling 2-mark mastery
    const handleToggleTwoMark = async (questionId) => {
        if (!currentExam)
            return;
        try {
            const res = await api.post(`/university-exams/${currentExam.id}/toggle-twomark`, {
                questionId
            });
            const data = res.data;
            if (data && data.exam) {
                setExams(prev => prev.map(e => e.id === data.exam.id ? data.exam : e));
            }
        }
        catch (err) {
            console.error('Error toggling 2-mark:', err);
        }
    };
    // Generate AI crash revision plan
    const handleGenerateCramPlan = async () => {
        if (!currentExam)
            return;
        setIsGeneratingPlan(true);
        try {
            const res = await api.post(`/university-exams/${currentExam.id}/generate-cram-plan`, {
                dailyStudyHours: 4
            });
            const data = res.data;
            if (data && data.exam) {
                setExams(prev => prev.map(e => e.id === data.exam.id ? data.exam : e));
                setActiveTab('cram');
            }
        }
        catch (err) {
            console.error('Error generating cram plan:', err);
        }
        finally {
            setIsGeneratingPlan(false);
        }
    };
    // Update internals & target grade
    const handleUpdateMarks = async (internals, totalInternals, targetGrade) => {
        if (!currentExam)
            return;
        try {
            const res = await api.put(`/university-exams/${currentExam.id}`, {
                internalMarksScored: internals,
                totalInternalMarks: totalInternals,
                targetGrade
            });
            const data = res.data;
            if (data && data.exam) {
                setExams(prev => prev.map(e => e.id === data.exam.id ? data.exam : e));
            }
        }
        catch (err) {
            console.error('Error updating marks:', err);
        }
    };
    // Handle Delete Exam
    const handleDeleteExam = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this university exam?'))
            return;
        try {
            await api.delete(`/university-exams/${id}`);
            const updated = exams.filter(ex => ex.id !== id);
            setExams(updated);
            if (updated.length > 0)
                setSelectedExamId(updated[0].id);
        }
        catch (err) {
            console.error('Error deleting exam:', err);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20", children: [_jsx("div", { className: "border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md", children: _jsx(GraduationCap, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight", children: "University Exam Preparation & Deadlines" }), _jsx("span", { className: "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase", children: "Semester Hub" })] }), _jsx("p", { className: "text-xs text-slate-500", children: "Track upcoming university board exam dates, 5-unit syllabus completion, and target GPA grades" })] })] }), _jsx("div", { className: "flex items-center gap-2.5", children: _jsxs("button", { onClick: () => setIsAddModalOpen(true), className: "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add Semester Exam"] }) })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-indigo-600" }), " Upcoming University Semester Schedule"] }), _jsxs("span", { className: "text-xs text-slate-400 font-bold", children: [exams.length, " Enrolled Courses"] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: exams.map((exam) => {
                                    const isSelected = exam.id === currentExam?.id;
                                    const daysLeft = Math.max(0, Math.ceil((new Date(exam.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                                    const isUrgent = daysLeft <= 14;
                                    return (_jsxs("div", { onClick: () => setSelectedExamId(exam.id), className: `p-4 rounded-2xl border transition-all cursor-pointer relative group ${isSelected
                                            ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                                            : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: "font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-900", children: exam.subjectCode }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsxs("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${isUrgent
                                                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                                                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'}`, children: [daysLeft, " Days Left"] }), _jsx("button", { onClick: (e) => handleDeleteExam(exam.id, e), className: "opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition", title: "Delete Exam", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] }), _jsx("h3", { className: "text-xs font-bold text-slate-900 dark:text-white mt-2 line-clamp-1", children: exam.subjectName }), _jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800", children: [_jsx("span", { children: new Date(exam.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }), _jsxs("span", { className: "font-bold text-slate-700 dark:text-slate-300", children: ["Target: ", exam.targetGrade.split(' ')[0]] })] }), _jsx("div", { className: "w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-indigo-600 rounded-full transition-all duration-300", style: { width: `${exam.preparationProgress || 0}%` } }) })] }, exam.id));
                                }) })] }), currentExam && (_jsxs("div", { className: "space-y-6", children: [_jsx(UniversityCountdownTimer, { examDate: currentExam.examDate, examTime: currentExam.examTime, subjectCode: currentExam.subjectCode, subjectName: currentExam.subjectName, onCramNow: handleGenerateCramPlan }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider block", children: "Target Grade" }), _jsx("span", { className: "text-lg font-black text-slate-900 dark:text-white mt-0.5 block", children: currentExam.targetGrade }), _jsxs("span", { className: "text-[11px] text-emerald-600 dark:text-emerald-400 font-bold", children: [currentExam.credits, " Credits Weightage"] })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider block", children: "Syllabus Coverage" }), _jsxs("span", { className: "text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block", children: [currentExam.preparationProgress, "% Completed"] }), _jsxs("span", { className: "text-[11px] text-slate-500", children: [currentExam.units.filter(u => u.isCompleted).length, " of ", currentExam.units.length, " Units Mastered"] })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider block", children: "Internals Scored" }), _jsxs("span", { className: "text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5 block", children: [currentExam.internalMarksScored, " / ", currentExam.totalInternalMarks] }), _jsx("span", { className: "text-[11px] text-slate-500", children: "Continuous Assessment Score" })] }), _jsxs("div", { className: "p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider block", children: "Exam Hall Venue" }), _jsx("span", { className: "text-xs font-black text-slate-900 dark:text-white mt-1 block line-clamp-1", children: currentExam.examHallLocation || 'Main Exam Hall' }), _jsxs("span", { className: "text-[11px] text-slate-500", children: [currentExam.department, " \u2022 Sem ", currentExam.semester] })] })] }), _jsxs("div", { className: "flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto", children: [_jsxs("button", { onClick: () => setActiveTab('analyzer'), className: `px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'analyzer'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`, children: [_jsx(BrainCircuit, { className: "w-4 h-4 text-indigo-500 dark:text-indigo-400" }), "Universal AI Syllabus Analyzer & Timetable"] }), _jsxs("button", { onClick: () => setActiveTab('syllabus'), className: `px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'syllabus'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`, children: [_jsx(Layers, { className: "w-4 h-4" }), "5-Unit Syllabus & Question Blueprints"] }), _jsxs("button", { onClick: () => setActiveTab('cram'), className: `px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'cram'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`, children: [_jsx(Flame, { className: "w-4 h-4 text-amber-300" }), "Crash Revision Timetable", currentExam.revisionCrammingPlan?.length ? (_jsxs("span", { className: "px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]", children: [currentExam.revisionCrammingPlan.length, " Days"] })) : null] }), _jsxs("button", { onClick: () => setActiveTab('calculator'), className: `px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'calculator'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`, children: [_jsx(Calculator, { className: "w-4 h-4" }), "Internal Marks & Grade Estimator"] }), _jsxs("button", { onClick: () => setActiveTab('papers'), className: `px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'papers'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`, children: [_jsx(FileText, { className: "w-4 h-4" }), "Solved Papers & Faculty Tips"] })] }), activeTab === 'analyzer' && (_jsx(UniversalSyllabusAnalyzer, {})), activeTab === 'syllabus' && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-2.5 text-xs text-indigo-950 dark:text-indigo-200", children: [_jsx(Sparkles, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" }), _jsxs("span", { children: ["Review Part-A (2-Mark Definitions) and Part-B (13/16-Mark Blueprints) prepared specifically for ", _jsx("strong", { children: currentExam.universityName }), " board standards."] })] }), _jsxs("button", { onClick: handleGenerateCramPlan, className: "px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 shadow-xs flex items-center gap-1", children: [_jsx(Flame, { className: "w-3.5 h-3.5" }), " Start Timetable"] })] }), _jsx(UnitSyllabusAccordion, { units: currentExam.units, onToggleUnitCompleted: handleToggleUnit, onToggleTwoMark: handleToggleTwoMark })] })), activeTab === 'cram' && (_jsx(UniversityCramPlanView, { cramPlan: currentExam.revisionCrammingPlan || [], modelPapers: currentExam.modelPapers || [], facultyTips: currentExam.facultyExamTips || [], onGeneratePlan: handleGenerateCramPlan, isLoading: isGeneratingPlan })), activeTab === 'calculator' && (_jsx(InternalMarksGradeCalculator, { initialInternals: currentExam.internalMarksScored, initialTotalInternals: currentExam.totalInternalMarks, initialTargetGrade: currentExam.targetGrade, onUpdateMarks: handleUpdateMarks })), activeTab === 'papers' && (_jsx("div", { className: "space-y-6", children: _jsx(UniversityCramPlanView, { cramPlan: [], modelPapers: currentExam.modelPapers || [], facultyTips: currentExam.facultyExamTips || [] }) }))] }))] }), _jsx(AddUniversityExamModal, { isOpen: isAddModalOpen, onClose: () => setIsAddModalOpen(false), onAddExam: handleAddExam })] }));
};

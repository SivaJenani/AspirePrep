import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Zap, CheckCircle2, Layers, Clock, Sparkles, FileText, Play, Check, Star, Edit3, Search, RotateCcw, Download, AlertCircle, BarChart3, BookmarkCheck, CheckCheck } from 'lucide-react';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
export const ExamSubjectDetailPage = () => {
    const { slug } = useParams();
    const { user, setUser, topicProgress, setTopicStatus, bulkUpdateChapterProgress, updateTopicProgress } = useAppStore();
    const [exam, setExam] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [expandedChapterIds, setExpandedChapterIds] = useState([]);
    const [selectedTopicConcepts, setSelectedTopicConcepts] = useState(null);
    // Progress edit modal state
    const [activeNoteTopic, setActiveNoteTopic] = useState(null);
    const [noteContent, setNoteContent] = useState('');
    const [noteMinutes, setNoteMinutes] = useState(30);
    const [noteConfidence, setNoteConfidence] = useState(4);
    // Filters & Tabs
    const [activeTab, setActiveTab] = useState('syllabus');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [weightFilter, setWeightFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    useEffect(() => {
        loadExamDetail();
    }, [slug]);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };
    const loadExamDetail = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/exams/${slug}`);
            if (res.data?.exam) {
                setExam(res.data.exam);
                const subList = res.data.subjects || [];
                setSubjects(subList);
                if (subList.length > 0) {
                    setSelectedSubjectId(subList[0].id);
                }
                // Fetch complete hierarchy
                const hRes = await api.get(`/exams/${res.data.exam.id}/hierarchy`);
                if (hRes.data?.chapters)
                    setChapters(hRes.data.chapters);
                if (hRes.data?.topics) {
                    setTopics(hRes.data.topics);
                    // Expand all chapters by default for easy syllabus scanning
                    if (hRes.data.chapters?.length > 0) {
                        setExpandedChapterIds(hRes.data.chapters.map((c) => c.id));
                    }
                }
            }
        }
        catch (err) {
            console.error('Failed to load exam details:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSetAsTarget = async () => {
        if (!exam || !user)
            return;
        try {
            const res = await api.put('/auth/profile', {
                targetExamId: exam.id,
                targetExamName: exam.name
            });
            if (res.data?.user) {
                setUser(res.data.user);
                showToast(`${exam.name} is now your primary target exam!`);
            }
        }
        catch (err) {
            console.error('Failed to update target exam:', err);
        }
    };
    const toggleChapter = (chapId) => {
        setExpandedChapterIds(prev => prev.includes(chapId) ? prev.filter(id => id !== chapId) : [...prev, chapId]);
    };
    const handleOpenConcept = async (topic) => {
        try {
            const res = await api.get(`/concepts/${topic.id}`);
            setSelectedTopicConcepts({
                topic,
                concepts: res.data?.concepts || []
            });
        }
        catch (err) {
            console.error('Failed to load concepts:', err);
        }
    };
    const handleStatusChange = (topic, newStatus) => {
        setTopicStatus(topic.id, newStatus, {
            subjectId: topic.subjectId,
            chapterId: topic.chapterId,
            examId: topic.examId
        });
        // Sync with backend API
        api.post('/syllabus/progress/update', {
            topicId: topic.id,
            status: newStatus
        }).catch(err => console.error('Syllabus API sync error:', err));
        showToast(`Updated "${topic.name}" to ${newStatus.replace('_', ' ').toUpperCase()}`);
    };
    const handleBulkChapterChange = (chapter, newStatus) => {
        const chapterTopics = topics.filter(t => t.chapterId === chapter.id);
        const topicIds = chapterTopics.map(t => t.id);
        bulkUpdateChapterProgress(topicIds, newStatus, {
            subjectId: chapter.subjectId,
            chapterId: chapter.id,
            examId: chapter.examId
        });
        api.post('/syllabus/progress/bulk-chapter', {
            chapterId: chapter.id,
            status: newStatus
        }).catch(err => console.error('Bulk chapter API error:', err));
        showToast(`Marked all ${topicIds.length} topics in "${chapter.name}" as ${newStatus.replace('_', ' ').toUpperCase()}`);
    };
    const handleOpenNoteModal = (topic) => {
        const prog = topicProgress[topic.id];
        setActiveNoteTopic(topic);
        setNoteContent(prog?.notes || '');
        setNoteConfidence(prog?.confidenceRating || 4);
        setNoteMinutes(prog?.studyMinutesLogged || 30);
    };
    const handleSaveNote = () => {
        if (!activeNoteTopic)
            return;
        updateTopicProgress(activeNoteTopic.id, {
            notes: noteContent,
            confidenceRating: noteConfidence,
            studyMinutesLogged: noteMinutes
        });
        api.post('/syllabus/progress/update', {
            topicId: activeNoteTopic.id,
            notes: noteContent,
            confidenceRating: noteConfidence,
            studyMinutesLogged: noteMinutes
        }).catch(err => console.error('Note save error:', err));
        setActiveNoteTopic(null);
        showToast(`Saved revision notes for "${activeNoteTopic.name}"`);
    };
    // Syllabus Statistics Calculations
    const syllabusMetrics = useMemo(() => {
        const examTopics = topics.filter(t => !exam || t.examId === exam.id);
        const total = examTopics.length || 1;
        let masteredCount = 0;
        let completedCount = 0;
        let inProgressCount = 0;
        let revisionCount = 0;
        let notStartedCount = 0;
        examTopics.forEach(t => {
            const p = topicProgress[t.id]?.status || 'not_started';
            if (p === 'mastered')
                masteredCount++;
            else if (p === 'completed')
                completedCount++;
            else if (p === 'in_progress')
                inProgressCount++;
            else if (p === 'revision_needed')
                revisionCount++;
            else
                notStartedCount++;
        });
        const coveredCount = masteredCount + completedCount + inProgressCount * 0.5;
        const overallPercent = Math.min(100, Math.round((coveredCount / total) * 100));
        // Subject stats
        const subjectStats = subjects.map(sub => {
            const subTopics = examTopics.filter(t => t.subjectId === sub.id);
            const subTotal = subTopics.length || 1;
            const subDone = subTopics.filter(t => {
                const s = topicProgress[t.id]?.status;
                return s === 'completed' || s === 'mastered';
            }).length;
            return {
                ...sub,
                totalTopics: subTotal,
                doneTopics: subDone,
                percentage: Math.round((subDone / subTotal) * 100)
            };
        });
        return {
            total,
            masteredCount,
            completedCount,
            inProgressCount,
            revisionCount,
            notStartedCount,
            overallPercent,
            subjectStats
        };
    }, [topics, topicProgress, subjects, exam]);
    const currentSubjectChapters = chapters.filter(c => c.subjectId === selectedSubjectId);
    // Filtered Topics per chapter
    const getFilteredChapterTopics = (chapId) => {
        return topics.filter(t => {
            if (t.chapterId !== chapId)
                return false;
            const currentStatus = topicProgress[t.id]?.status || 'not_started';
            if (statusFilter !== 'all' && currentStatus !== statusFilter)
                return false;
            if (weightFilter !== 'all' && t.weightage !== weightFilter)
                return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = t.name.toLowerCase().includes(q);
                const matchesDesc = (t.description || '').toLowerCase().includes(q);
                const matchesFormulas = (t.keyFormulas || []).some(f => f.toLowerCase().includes(q));
                if (!matchesName && !matchesDesc && !matchesFormulas)
                    return false;
            }
            return true;
        });
    };
    if (loading || !exam) {
        return _jsx("div", { className: "py-20 text-center text-xs text-slate-500", children: "Loading syllabus hierarchy..." });
    }
    const isCurrentTarget = user?.targetExamId === exam.id;
    return (_jsxs("div", { className: "bg-slate-50 dark:bg-slate-950 min-h-screen pb-16", children: [toastMessage && (_jsxs("div", { className: "fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-bounce text-xs font-semibold", children: [_jsx(Sparkles, { className: "w-4 h-4 text-amber-400" }), _jsx("span", { children: toastMessage })] })), _jsx("div", { className: "bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-10", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-bold text-indigo-400", children: [_jsx(Link, { to: "/exams", className: "hover:underline", children: "Exams" }), _jsx(ChevronRight, { className: "w-3.5 h-3.5" }), _jsx("span", { children: exam.name }), _jsx(ChevronRight, { className: "w-3.5 h-3.5" }), _jsx("span", { className: "text-slate-300", children: "Official Syllabus & Tracker" })] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold", children: exam.category }), _jsxs("span", { className: "text-xs text-slate-400 font-mono", children: ["Conducting Body: ", exam.conductingBody || 'Staff Selection Commission'] })] }), _jsx("h1", { className: "text-3xl font-extrabold text-white tracking-tight mt-1", children: exam.name }), _jsx("p", { className: "text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed", children: exam.description })] }), _jsxs("div", { className: "flex flex-wrap gap-2.5", children: [_jsxs("button", { onClick: handleSetAsTarget, disabled: isCurrentTarget, className: `px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-1.5 ${isCurrentTarget
                                                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 cursor-default'
                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`, children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), isCurrentTarget ? 'Current Target Exam' : 'Set as My Target Exam'] }), _jsxs(Link, { to: `/practice?examId=${exam.id}`, className: "px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-1.5 shadow", children: [_jsx(Zap, { className: "w-4 h-4 text-indigo-600" }), " Start Mixed Practice"] })] })] }), _jsxs("div", { className: "p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-indigo-400", children: "Preparation Readiness" }), _jsxs("span", { className: "px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold", children: [syllabusMetrics.overallPercent, "% Syllabus Covered"] })] }), _jsxs("p", { className: "text-xs text-slate-300", children: [syllabusMetrics.masteredCount + syllabusMetrics.completedCount, " of ", syllabusMetrics.total, " topics completed \u2022 ", syllabusMetrics.masteredCount, " mastered \u2022 ", syllabusMetrics.revisionCount, " needing revision"] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs", children: [_jsxs("span", { className: "px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1", children: [_jsx(CheckCheck, { className: "w-3.5 h-3.5" }), " ", syllabusMetrics.masteredCount + syllabusMetrics.completedCount, " Done"] }), _jsxs("span", { className: "px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), " ", syllabusMetrics.inProgressCount, " Learning"] }), _jsxs("span", { className: "px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1", children: [_jsx(AlertCircle, { className: "w-3.5 h-3.5" }), " ", syllabusMetrics.revisionCount, " Revise"] })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "w-full h-3 rounded-full bg-slate-700 overflow-hidden flex", children: [_jsx("div", { className: "bg-indigo-500 transition-all duration-500", style: { width: `${(syllabusMetrics.masteredCount / syllabusMetrics.total) * 100}%` }, title: `Mastered: ${syllabusMetrics.masteredCount}` }), _jsx("div", { className: "bg-emerald-500 transition-all duration-500", style: { width: `${(syllabusMetrics.completedCount / syllabusMetrics.total) * 100}%` }, title: `Completed: ${syllabusMetrics.completedCount}` }), _jsx("div", { className: "bg-amber-500 transition-all duration-500", style: { width: `${(syllabusMetrics.inProgressCount / syllabusMetrics.total) * 100}%` }, title: `In Progress: ${syllabusMetrics.inProgressCount}` }), _jsx("div", { className: "bg-rose-500 transition-all duration-500", style: { width: `${(syllabusMetrics.revisionCount / syllabusMetrics.total) * 100}%` }, title: `Needs Revision: ${syllabusMetrics.revisionCount}` })] }), _jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 font-mono", children: [_jsx("span", { children: "0%" }), _jsx("span", { children: "Target: 100% Comprehensive Coverage" }), _jsxs("span", { children: [syllabusMetrics.overallPercent, "%"] })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs", children: [_jsxs("div", { className: "p-3 rounded-xl bg-slate-800/80 border border-slate-700", children: [_jsx("span", { className: "text-slate-400 block text-[11px]", children: "Total Questions" }), _jsxs("span", { className: "font-bold text-white text-base", children: [exam.patternSummary?.totalQuestions || 100, " Qs"] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-slate-800/80 border border-slate-700", children: [_jsx("span", { className: "text-slate-400 block text-[11px]", children: "Total Marks" }), _jsxs("span", { className: "font-bold text-white text-base", children: [exam.patternSummary?.totalMarks || 200, " Marks"] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-slate-800/80 border border-slate-700", children: [_jsx("span", { className: "text-slate-400 block text-[11px]", children: "Duration" }), _jsxs("span", { className: "font-bold text-white text-base", children: [exam.patternSummary?.durationMinutes || 60, " Minutes"] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-slate-800/80 border border-slate-700", children: [_jsx("span", { className: "text-slate-400 block text-[11px]", children: "Negative Marking" }), _jsxs("span", { className: "font-bold text-amber-400 text-base", children: ["-", exam.patternSummary?.negativeMarking || 0.5, " Mark"] })] })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setActiveTab('syllabus'), className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'syllabus'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300'}`, children: [_jsx(Layers, { className: "w-4 h-4" }), "Interactive Syllabus Tracker"] }), _jsxs("button", { onClick: () => setActiveTab('pattern'), className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'pattern'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300'}`, children: [_jsx(BarChart3, { className: "w-4 h-4" }), "Pattern & Weightage Breakdown"] }), _jsxs("button", { onClick: () => setActiveTab('summary'), className: `px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'summary'
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300'}`, children: [_jsx(BookmarkCheck, { className: "w-4 h-4" }), "Printable Checklist"] })] }), activeTab === 'syllabus' && (_jsxs("div", { className: "flex items-center gap-2 text-xs", children: [_jsx("button", { onClick: () => setExpandedChapterIds(chapters.map(c => c.id)), className: "px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 font-semibold", children: "Expand All" }), _jsx("button", { onClick: () => setExpandedChapterIds([]), className: "px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 font-semibold", children: "Collapse All" })] }))] }), activeTab === 'syllabus' && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: syllabusMetrics.subjectStats.map((sub) => {
                                    const isSelected = selectedSubjectId === sub.id;
                                    return (_jsxs("button", { onClick: () => setSelectedSubjectId(sub.id), className: `p-4 rounded-2xl text-left border transition relative overflow-hidden ${isSelected
                                            ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20 dark:bg-slate-900 dark:border-indigo-500'
                                            : 'bg-white border-slate-200/80 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800'}`, children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("h3", { className: `text-xs font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`, children: sub.name }), _jsxs("span", { className: "text-[11px] font-bold text-slate-500 font-mono", children: [sub.percentage, "%"] })] }), _jsx("p", { className: "text-[11px] text-slate-500 mt-1 line-clamp-1", children: sub.description }), _jsx("div", { className: "w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden", children: _jsx("div", { className: "h-full bg-indigo-600 rounded-full transition-all duration-300", style: { width: `${sub.percentage}%` } }) })] }, sub.id));
                                }) }), _jsxs("div", { className: "p-4 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search syllabus topic, concept, formula (e.g. Syllogism, Apollonius, Article 32)...", className: "w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-1.5 text-xs", children: [_jsx("span", { className: "text-slate-400 text-[11px] font-semibold mr-1", children: "Status:" }), [
                                                { id: 'all', label: 'All' },
                                                { id: 'not_started', label: 'Not Started' },
                                                { id: 'in_progress', label: 'In Progress' },
                                                { id: 'revision_needed', label: 'Needs Revision' },
                                                { id: 'completed', label: 'Completed' },
                                                { id: 'mastered', label: 'Mastered' }
                                            ].map((s) => (_jsx("button", { onClick: () => setStatusFilter(s.id), className: `px-2.5 py-1 rounded-lg text-xs font-semibold transition ${statusFilter === s.id
                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`, children: s.label }, s.id)))] })] }), _jsx("div", { className: "space-y-4", children: currentSubjectChapters.length === 0 ? (_jsx("div", { className: "p-8 text-center bg-white rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800", children: _jsx("p", { className: "text-xs text-slate-500", children: "No chapters configured yet for this subject." }) })) : (currentSubjectChapters.map((chap) => {
                                    const isExpanded = expandedChapterIds.includes(chap.id);
                                    const filteredTopics = getFilteredChapterTopics(chap.id);
                                    const allChapterTopics = topics.filter(t => t.chapterId === chap.id);
                                    const chapterDoneCount = allChapterTopics.filter(t => {
                                        const st = topicProgress[t.id]?.status;
                                        return st === 'completed' || st === 'mastered';
                                    }).length;
                                    const chapterPercent = allChapterTopics.length > 0 ? Math.round((chapterDoneCount / allChapterTopics.length) * 100) : 0;
                                    return (_jsxs("div", { className: "rounded-2xl bg-white border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-hidden", children: [_jsxs("div", { className: "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition", children: [_jsxs("button", { onClick: () => toggleChapter(chap.id), className: "flex items-center gap-3 text-left flex-1", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0", children: _jsx(Layers, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white", children: chap.name }), _jsxs("span", { className: "px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold", children: [chapterDoneCount, "/", allChapterTopics.length, " Done (", chapterPercent, "%)"] })] }), _jsx("p", { className: "text-[11px] text-slate-500", children: chap.description })] })] }), _jsxs("div", { className: "flex items-center gap-2 self-end sm:self-center", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsxs("button", { onClick: () => handleBulkChapterChange(chap, 'completed'), title: "Mark entire chapter topics as Completed", className: "px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-bold transition flex items-center gap-1", children: [_jsx(Check, { className: "w-3 h-3" }), " Mark All Done"] }), _jsx("button", { onClick: () => handleBulkChapterChange(chap, 'not_started'), title: "Reset chapter progress", className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200", children: _jsx(RotateCcw, { className: "w-3.5 h-3.5" }) })] }), _jsx("button", { onClick: () => toggleChapter(chap.id), className: "p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400", children: isExpanded ? _jsx(ChevronDown, { className: "w-5 h-5" }) : _jsx(ChevronRight, { className: "w-5 h-5" }) })] })] }), isExpanded && (_jsx("div", { className: "px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3", children: filteredTopics.length === 0 ? (_jsx("div", { className: "py-4 text-center text-xs text-slate-400", children: "No topics match the current filter in this chapter." })) : (filteredTopics.map((topic) => {
                                                    const prog = topicProgress[topic.id] || {
                                                        status: 'not_started',
                                                        confidenceRating: 3,
                                                        studyMinutesLogged: 0,
                                                        masteryPercent: 0,
                                                        notes: ''
                                                    };
                                                    return (_jsxs("div", { className: "p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 dark:bg-slate-800/30 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1.5 flex-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("h4", { className: "text-xs font-bold text-slate-900 dark:text-white", children: topic.name }), _jsxs("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${topic.weightage === 'High'
                                                                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                                                    : topic.weightage === 'Medium'
                                                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                                                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`, children: ["Weightage: ", topic.weightage || 'Medium', " (", topic.weightagePercent || 10, "%)"] }), _jsxs("select", { value: prog.status, onChange: (e) => handleStatusChange(topic, e.target.value), className: `text-[11px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none transition ${prog.status === 'mastered'
                                                                                    ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                                                                                    : prog.status === 'completed'
                                                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                                                                                        : prog.status === 'in_progress'
                                                                                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                                                                                            : prog.status === 'revision_needed'
                                                                                                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                                                                                                : 'bg-white text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`, children: [_jsx("option", { value: "not_started", children: "\u26AA Not Started" }), _jsx("option", { value: "in_progress", children: "\uD83D\uDFE1 In Progress" }), _jsx("option", { value: "revision_needed", children: "\uD83D\uDD34 Needs Revision" }), _jsx("option", { value: "completed", children: "\uD83D\uDFE2 Completed" }), _jsx("option", { value: "mastered", children: "\uD83D\uDFE3 Mastered (90%+)" })] })] }), _jsx("p", { className: "text-[11px] text-slate-500", children: topic.summary || topic.description }), prog.notes && (_jsxs("div", { className: "text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-1.5", children: [_jsx(Edit3, { className: "w-3 h-3 shrink-0" }), _jsx("span", { className: "font-semibold", children: "My Note:" }), " ", prog.notes] }))] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 shrink-0", children: [_jsx("div", { className: "flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-amber-500 text-[10px]", title: "Self Confidence Level", children: [1, 2, 3, 4, 5].map((star) => (_jsx(Star, { className: `w-3 h-3 ${star <= (prog.confidenceRating || 3) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}` }, star))) }), _jsxs("button", { onClick: () => handleOpenNoteModal(topic), className: "px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 flex items-center gap-1", title: "Add revision notes and log study hours", children: [_jsx(Edit3, { className: "w-3.5 h-3.5 text-slate-500" }), "Notes & Hours"] }), _jsxs("button", { onClick: () => handleOpenConcept(topic), className: "px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 flex items-center gap-1", children: [_jsx(FileText, { className: "w-3.5 h-3.5 text-indigo-600" }), "Formulas"] }), _jsxs(Link, { to: `/practice?mode=topic&topicId=${topic.id}`, className: "px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1", children: [_jsx(Play, { className: "w-3 h-3 fill-white" }), "Practice (", topic.questionsCount || 25, " Qs)"] })] })] }, topic.id));
                                                })) }))] }, chap.id));
                                })) })] })), activeTab === 'pattern' && (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 space-y-4", children: [_jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Exam Scheme & Section Distribution" }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Official section breakdown for ", exam.name] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-xs text-left", children: [_jsx("thead", { className: "bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3", children: "Section / Subject" }), _jsx("th", { className: "p-3", children: "Total Questions" }), _jsx("th", { className: "p-3", children: "Max Marks" }), _jsx("th", { className: "p-3", children: "Duration" }), _jsx("th", { className: "p-3", children: "Negative Marking" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300", children: subjects.map((sub, idx) => (_jsxs("tr", { children: [_jsxs("td", { className: "p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2", children: [_jsx("span", { className: "w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[10px]", children: idx + 1 }), sub.name] }), _jsx("td", { className: "p-3", children: "25 Questions" }), _jsx("td", { className: "p-3 font-bold text-indigo-600 dark:text-indigo-400", children: "50 Marks" }), _jsx("td", { className: "p-3", children: "Composite 60 Mins" }), _jsx("td", { className: "p-3 text-rose-600", children: "-0.50 Mark" })] }, sub.id))) })] }) })] }) })), activeTab === 'summary' && (_jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: [exam.name, " - Complete Syllabus Checklist"] }), _jsx("p", { className: "text-xs text-slate-500", children: "Official preparation tracker with real-time status" })] }), _jsxs("button", { onClick: () => window.print(), className: "px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition flex items-center gap-1.5", children: [_jsx(Download, { className: "w-4 h-4" }), " Print / Save PDF"] })] }), _jsx("div", { className: "space-y-6", children: subjects.map(sub => {
                                    const subChapters = chapters.filter(c => c.subjectId === sub.id);
                                    return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider", children: sub.name }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: subChapters.flatMap(c => topics.filter(t => t.chapterId === c.id)).map(topic => {
                                                    const st = topicProgress[topic.id]?.status || 'not_started';
                                                    return (_jsxs("div", { className: "p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs", children: [_jsx("span", { className: "font-semibold text-slate-800 dark:text-slate-200", children: topic.name }), _jsx("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold ${st === 'mastered' ? 'bg-purple-100 text-purple-800' :
                                                                    st === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                                                        st === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                                                                            st === 'revision_needed' ? 'bg-rose-100 text-rose-800' :
                                                                                'bg-slate-100 text-slate-600'}`, children: st.replace('_', ' ') })] }, topic.id));
                                                }) })] }, sub.id));
                                }) })] }))] }), activeNoteTopic && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-900 dark:text-white", children: ["Study Notes & Confidence: ", activeNoteTopic.name] }), _jsx("button", { onClick: () => setActiveNoteTopic(null), className: "text-slate-400 hover:text-slate-600 text-xs font-bold", children: "\u2715" })] }), _jsxs("div", { className: "space-y-3 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-700 dark:text-slate-300 font-bold mb-1", children: "Revision Notes & Key Mnemonics" }), _jsx("textarea", { rows: 4, value: noteContent, onChange: (e) => setNoteContent(e.target.value), placeholder: "E.g. Remember the 1/7 fraction multiplier shortcut; Article 32 writ sequence...", className: "w-full p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-slate-700 dark:text-slate-300 font-bold mb-1", children: "Self-Confidence Rating (1-5)" }), _jsx("div", { className: "flex items-center gap-1.5 pt-1 text-amber-500", children: [1, 2, 3, 4, 5].map((num) => (_jsx("button", { type: "button", onClick: () => setNoteConfidence(num), className: "p-1 hover:scale-110 transition", children: _jsx(Star, { className: `w-5 h-5 ${num <= noteConfidence ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}` }) }, num))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-slate-700 dark:text-slate-300 font-bold mb-1", children: "Minutes Studied" }), _jsx("input", { type: "number", value: noteMinutes, onChange: (e) => setNoteMinutes(Number(e.target.value)), className: "w-full p-2 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white" })] })] })] }), _jsxs("div", { className: "pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2", children: [_jsx("button", { onClick: () => setActiveNoteTopic(null), className: "px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold", children: "Cancel" }), _jsx("button", { onClick: handleSaveNote, className: "px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition", children: "Save Progress" })] })] }) })), selectedTopicConcepts && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400", children: "Concept Notes & Shortcuts" }), _jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white", children: selectedTopicConcepts.topic.name })] }), _jsx("button", { onClick: () => setSelectedTopicConcepts(null), className: "px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold", children: "Close" })] }), selectedTopicConcepts.concepts.length === 0 ? (_jsx("div", { className: "py-8 text-center text-xs text-slate-500", children: "Formula sheets are being updated by faculty for this topic." })) : (selectedTopicConcepts.concepts.map((concept) => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-slate-900 dark:text-white", children: concept.title }), _jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed", children: concept.summary })] }), concept.keyFormulas && concept.keyFormulas.length > 0 && (_jsxs("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 space-y-2", children: [_jsx("span", { className: "text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block", children: "\uD83D\uDD11 High-Yield Formulas" }), _jsx("ul", { className: "space-y-1.5 text-xs font-mono text-slate-800 dark:text-slate-200", children: concept.keyFormulas.map((f, fIdx) => (_jsx("li", { className: "p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800", children: f }, fIdx))) })] })), concept.shortcuts && concept.shortcuts.length > 0 && (_jsxs("div", { className: "p-4 rounded-xl bg-amber-50/60 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 space-y-2", children: [_jsx("span", { className: "text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block", children: "\u26A1 Exam 10-Second Shortcut Hacks" }), _jsx("ul", { className: "space-y-1 text-xs text-slate-700 dark:text-slate-300", children: concept.shortcuts.map((s, sIdx) => (_jsxs("li", { children: ["\u2022 ", s] }, sIdx))) })] })), concept.examples && concept.examples.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-xs font-bold text-slate-900 dark:text-white block", children: "Master Solved Example:" }), concept.examples.map((ex, eIdx) => (_jsxs("div", { className: "p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs space-y-1.5", children: [_jsxs("p", { className: "font-semibold text-slate-900 dark:text-white", children: ["Q: ", ex.question] }), _jsxs("p", { className: "text-slate-600 dark:text-slate-300", children: ["\uD83D\uDCA1 Solution: ", ex.solution] })] }, eIdx)))] }))] }, concept.id)))), _jsx("div", { className: "pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end", children: _jsxs(Link, { to: `/practice?mode=topic&topicId=${selectedTopicConcepts.topic.id}`, onClick: () => setSelectedTopicConcepts(null), className: "px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition flex items-center gap-1.5", children: [_jsx(Play, { className: "w-3.5 h-3.5 fill-white" }), " Start Practice on this Topic"] }) })] }) }))] }));
};


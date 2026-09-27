import React, { useRef } from 'react';
import { X, Printer, Download, CheckSquare, Calendar, GraduationCap, Clock, Sparkles } from 'lucide-react';

export const PrintableTimetableModal = ({ isOpen, onClose, studyPlan }) => {
    const printAreaRef = useRef(null);

    if (!isOpen || !studyPlan) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div id="printable-timetable-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                id="printable-timetable-modal-card" 
                className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col overflow-hidden"
            >
                {/* Header (No print) */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                            <Printer className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                Printable Study Timetable &amp; Desk Checklist
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Clean, printer-friendly layout for physical study pinning and habit tracking
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print / Save PDF</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 transition"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Printable Content Area */}
                <div ref={printAreaRef} className="p-8 overflow-y-auto space-y-6 flex-1 bg-white text-slate-900 print:p-0 print:m-0">
                    {/* Document Header */}
                    <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-700">
                                <GraduationCap className="w-4 h-4" /> AspirePrep Adaptive Roadmap
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 mt-1">
                                {studyPlan.planTitle || `${studyPlan.examName || 'Competitive Exam'} Preparation Timetable`}
                            </h1>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Target Date: <strong>{studyPlan.targetExamDate || 'Next Exam Cycle'}</strong> · Daily Goal: <strong>{Math.round((studyPlan.dailyStudyMinutes || 120) / 60)}h / Day</strong>
                            </p>
                        </div>
                        <div className="border border-slate-300 rounded-xl p-3 text-right text-xs">
                            <div className="font-bold text-slate-900">Total Duration: {studyPlan.totalDays || studyPlan.schedule?.length || 30} Days</div>
                            <div className="text-slate-500 mt-0.5">Selection Target: 90th+ Percentile</div>
                        </div>
                    </div>

                    {/* Day-by-Day Table / List */}
                    <div className="space-y-4">
                        {studyPlan.schedule?.map((day) => (
                            <div 
                                key={day.dayNumber} 
                                className="border border-slate-300 rounded-xl p-4 break-inside-avoid"
                            >
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-slate-900 text-white font-black text-xs px-2 py-0.5 rounded">
                                            Day {day.dayNumber}
                                        </span>
                                        <span className="font-bold text-sm text-slate-900">
                                            {day.focusTitle}
                                        </span>
                                        {day.isRestDay && (
                                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                Active Recovery / Light Revision
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {day.date} ({day.totalMinutes || 120} min)
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {day.tasks?.map((task, tIdx) => (
                                        <div 
                                            key={task.id || tIdx} 
                                            className="flex items-start gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                                        >
                                            <div className="w-4 h-4 border-2 border-slate-400 rounded mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {task.timeSlot && (
                                                        <span className="font-mono font-bold text-indigo-700">
                                                            [{task.timeSlot}]
                                                        </span>
                                                    )}
                                                    <span className="font-extrabold text-slate-900">
                                                        {task.topicName}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                                                        {task.subjectName}
                                                    </span>
                                                    {task.priority === 'high' && (
                                                        <span className="text-[10px] font-bold text-rose-700">
                                                            ★ High-Yield
                                                        </span>
                                                    )}
                                                </div>
                                                {task.taskObjective && (
                                                    <p className="text-slate-600 mt-1">
                                                        {task.taskObjective}
                                                    </p>
                                                )}
                                                {task.extractedCheatNotes && (
                                                    <p className="text-slate-700 font-mono mt-1 text-[11px] bg-amber-50 border border-amber-200 p-1.5 rounded">
                                                        💡 {task.extractedCheatNotes}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                                                {task.durationMinutes} min
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desk Advice Footer */}
                    <div className="border-t border-slate-300 pt-4 text-xs text-slate-500 flex items-center justify-between">
                        <span>AspirePrep Study Platform · Scientific Spaced Recall System</span>
                        <span>Track every checkbox daily for guaranteed retention</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

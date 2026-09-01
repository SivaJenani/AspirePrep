import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Flame, Calendar, Sparkles } from 'lucide-react';
export const UniversityCountdownTimer = ({ examDate, examTime = '10:00 AM - 01:00 PM', subjectCode, subjectName, onCramNow }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });
    useEffect(() => {
        const calculateTime = () => {
            // Parse exam date at 09:00 AM
            const target = new Date(`${examDate}T09:00:00`).getTime();
            const now = new Date().getTime();
            const difference = target - now;
            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
                return;
            }
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            setTimeLeft({ days, hours, minutes, seconds, isPast: false });
        };
        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [examDate]);
    const isUrgent = timeLeft.days < 7 && !timeLeft.isPast;
    const isModerate = timeLeft.days >= 7 && timeLeft.days <= 21 && !timeLeft.isPast;
    return (_jsxs("div", { className: `p-6 rounded-3xl border text-white shadow-xl transition relative overflow-hidden ${timeLeft.isPast
            ? 'bg-slate-900 border-slate-800'
            : isUrgent
                ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 border-rose-800/80 shadow-rose-950/40'
                : isModerate
                    ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 border-amber-800/80'
                    : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-indigo-800/80'}`, children: [_jsx("div", { className: "absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative z-10 space-y-5", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/10 text-white border border-white/15 flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 text-indigo-400" }), "University Exam Deadline"] }), _jsx("span", { className: "font-mono text-xs text-indigo-300 font-bold bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-800/60", children: subjectCode })] }), _jsxs("div", { className: "flex items-center gap-2", children: [isUrgent && (_jsxs("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse", children: [_jsx(Flame, { className: "w-3.5 h-3.5 text-rose-400" }), "Urgent: High Cramming Window"] })), isModerate && (_jsxs("span", { className: "px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-amber-400" }), "Unit Sprint Phase"] }))] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl sm:text-2xl font-black text-white tracking-tight", children: subjectName }), _jsxs("p", { className: "text-xs sm:text-sm text-slate-300 flex items-center gap-2 mt-1", children: [_jsx(Clock, { className: "w-4 h-4 text-indigo-400" }), _jsxs("span", { children: ["Exam Date: ", _jsx("strong", { className: "text-white", children: new Date(examDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) }), " \u2022 ", examTime] })] })] }), timeLeft.isPast ? (_jsx("div", { className: "p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center", children: _jsx("p", { className: "text-sm font-bold text-slate-300", children: "Exam completed or in session." }) })) : (_jsxs("div", { className: "grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg", children: [_jsxs("div", { className: "p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 text-center", children: [_jsx("span", { className: "block text-2xl sm:text-4xl font-black text-white font-mono", children: String(timeLeft.days).padStart(2, '0') }), _jsx("span", { className: "text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider", children: "Days" })] }), _jsxs("div", { className: "p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 text-center", children: [_jsx("span", { className: "block text-2xl sm:text-4xl font-black text-white font-mono", children: String(timeLeft.hours).padStart(2, '0') }), _jsx("span", { className: "text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider", children: "Hours" })] }), _jsxs("div", { className: "p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 text-center", children: [_jsx("span", { className: "block text-2xl sm:text-4xl font-black text-white font-mono", children: String(timeLeft.minutes).padStart(2, '0') }), _jsx("span", { className: "text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider", children: "Mins" })] }), _jsxs("div", { className: "p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 text-center", children: [_jsx("span", { className: "block text-2xl sm:text-4xl font-black text-rose-400 font-mono animate-pulse", children: String(timeLeft.seconds).padStart(2, '0') }), _jsx("span", { className: "text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider", children: "Secs" })] })] })), onCramNow && !timeLeft.isPast && (_jsxs("div", { className: "pt-2 flex items-center justify-between gap-4 border-t border-white/10", children: [_jsxs("span", { className: "text-xs text-slate-400 hidden sm:inline", children: ["Generate timed crash syllabus for the remaining ", timeLeft.days, " days"] }), _jsxs("button", { onClick: onCramNow, className: "px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition ml-auto", children: [_jsx(Sparkles, { className: "w-4 h-4 text-amber-300" }), "Generate Crash Revision Plan"] })] }))] })] }));
};

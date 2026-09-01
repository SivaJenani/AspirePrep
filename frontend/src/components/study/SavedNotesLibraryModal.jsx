import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { FileText, Trash2, X, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
export const SavedNotesLibraryModal = ({ isOpen, onClose, onSelectNote }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (isOpen) {
            loadNotes();
        }
    }, [isOpen]);
    const loadNotes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/study-plan/notes');
            if (res.data?.notes) {
                setNotes(res.data.notes);
            }
        }
        catch (err) {
            console.error('Failed to load notes library:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (noteId, e) => {
        e.stopPropagation();
        try {
            await api.delete(`/study-plan/notes/${noteId}`);
            setNotes(notes.filter(n => n.id !== noteId));
        }
        catch (err) {
            console.error('Failed to delete note:', err);
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-fade-in", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]", children: [_jsxs("div", { className: "px-6 py-5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white", children: _jsx(FileText, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-base sm:text-lg font-extrabold text-white", children: "My Uploaded Notes & Topics Library" }), _jsx("p", { className: "text-xs text-slate-300", children: "View your uploaded notes and rebuild custom timetables anytime." })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-6 overflow-y-auto space-y-4 flex-1", children: loading ? (_jsx("div", { className: "py-12 text-center text-xs text-slate-500", children: "Loading uploaded notes..." })) : notes.length === 0 ? (_jsxs("div", { className: "py-12 text-center space-y-3", children: [_jsx(FileText, { className: "w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" }), _jsx("p", { className: "text-sm font-bold text-slate-700 dark:text-slate-300", children: "No Uploaded Notes Found" }), _jsx("p", { className: "text-xs text-slate-500 max-w-sm mx-auto", children: "Upload your notes or paste topics using the \"Upload Notes & Custom Timetable\" button to store them here." })] })) : (_jsx("div", { className: "space-y-3", children: notes.map((note) => (_jsxs("div", { onClick: () => {
                                onSelectNote(note);
                                onClose();
                            }, className: "p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition", children: note.title }), _jsxs("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300", children: [note.extractedTopicsCount, " Topics"] })] }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 line-clamp-1", children: note.summary || note.rawContent.slice(0, 100) }), _jsxs("span", { className: "text-[10px] text-slate-400 block", children: ["Uploaded ", new Date(note.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx("button", { onClick: (e) => handleDelete(note.id, e), className: "p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition", title: "Delete note", children: _jsx(Trash2, { className: "w-4 h-4" }) }), _jsxs("button", { className: "px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " Re-generate Timetable"] })] })] }, note.id))) })) }), _jsx("div", { className: "px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end", children: _jsx("button", { onClick: onClose, className: "px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold text-xs transition", children: "Close" }) })] }) }));
};

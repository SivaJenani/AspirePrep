import React, { useState, useRef, useEffect } from 'react';
import {
    X, Upload, Sparkles, AlertCircle,
    CheckCircle2, Loader2, BookOpen, GraduationCap,
    FileType, FileText, ChevronRight, Trash2
} from 'lucide-react';

const ACCEPTED_EXTENSIONS = ['txt', 'pdf', 'docx', 'doc', 'md'];
const getExt = (filename) => filename.split('.').pop().toLowerCase();
const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
const FileTypeIcon = ({ ext }) => {
    if (ext === 'pdf') return <FileType className="h-5 w-5 text-rose-500" />;
    if (ext === 'docx' || ext === 'doc') return <FileType className="h-5 w-5 text-blue-500" />;
    return <FileText className="h-5 w-5 text-slate-500" />;
};

const EXAM_SUGGESTIONS = [
    'SSC CGL', 'UPSC Civil Services', 'IBPS PO', 'TNPSC Group 4',
    'RRB NTPC', 'JEE Main', 'NEET UG', 'CAT', 'GATE', 'CLAT'
];

export const SyllabusUploaderModal = ({ isOpen, onClose, onGenerate, isGenerating }) => {
    const [examName, setExamName] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [parseStatus, setParseStatus] = useState('idle');
    const [parseError, setParseError] = useState(null);
    const [dailyHours, setDailyHours] = useState(2);
    const [targetDays, setTargetDays] = useState(30);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        if (!document.getElementById('pdfjs-lib')) {
            const s = document.createElement('script');
            s.id = 'pdfjs-lib';
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
            s.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                }
            };
            document.head.appendChild(s);
        }
        if (!document.getElementById('mammoth-lib')) {
            const s = document.createElement('script');
            s.id = 'mammoth-lib';
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            document.head.appendChild(s);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const resetFile = () => {
        setUploadedFile(null);
        setExtractedText('');
        setParseStatus('idle');
        setParseError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const processFile = async (file) => {
        const ext = getExt(file.name);
        if (!ACCEPTED_EXTENSIONS.includes(ext)) {
            setParseError(`Unsupported file type ".${ext}". Please upload TXT, PDF, DOCX, or MD.`);
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            setParseError('File too large (max 20 MB).');
            return;
        }
        setParseError(null);
        setUploadedFile({ name: file.name, ext, size: file.size });
        setParseStatus('parsing');
        try {
            let text = '';
            if (ext === 'txt' || ext === 'md') {
                text = await file.text();
            } else if (ext === 'pdf') {
                const buf = await file.arrayBuffer();
                if (window.pdfjsLib) {
                    const pdf = await window.pdfjsLib.getDocument({ data: buf, cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/cmaps/', cMapPacked: true }).promise;
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map(item => item.str).join(' ') + '\n';
                    }
                    const latinRatio = ((text.match(/[a-zA-Z0-9\s.,!?:;()\-]/g) || []).length) / (text.length || 1);
                    if (latinRatio < 0.35) throw new Error('PDF font encoding issue detected. Try a text-based PDF.');
                } else {
                    text = `[PDF: ${file.name}]\n\nPDF.js is still loading. Please try again in a moment, or paste the syllabus text manually below.`;
                }
            } else if (ext === 'docx' || ext === 'doc') {
                const buf = await file.arrayBuffer();
                if (window.mammoth) {
                    const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
                    text = result.value || '';
                } else {
                    text = `[DOCX: ${file.name}]\n\nMammoth.js is loading. Please try again in a moment.`;
                }
            }
            if (!text.trim()) throw new Error('No readable text found in the file.');
            setExtractedText(text.trim().slice(0, 40000));
            setParseStatus('done');
        } catch (err) {
            setParseError(err.message || 'Could not read the file. Try a different format or paste the syllabus manually.');
            setParseStatus('error');
            setUploadedFile(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const canProceed = examName.trim().length >= 2 && (parseStatus === 'done' || extractedText.trim().length > 20);

    const handleGenerate = () => {
        if (!canProceed || isGenerating) return;
        onGenerate({
            notesText: extractedText,
            noteTitle: uploadedFile ? uploadedFile.name.replace(/\.[^/.]+$/, '') : `${examName} Syllabus`,
            examName: examName.trim(),
            timetablePreferences: {
                dailyHours,
                preferredTimeSlots: ['morning', 'evening'],
                studyRhythm: 'deep_work',
                targetDays,
                restDays: ['Sunday'],
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-900 dark:text-white">Upload Exam Syllabus</h2>
                            <p className="text-xs text-slate-500">AI will parse the syllabus and build your study plan</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-6 p-6">

                    {/* Exam Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <GraduationCap className="h-3.5 w-3.5" /> Exam Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={examName}
                                onChange={(e) => { setExamName(e.target.value); setShowSuggestions(true); }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                placeholder="e.g. SSC CGL, UPSC CSE, JEE Main…"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            {showSuggestions && examName.length === 0 && (
                                <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                                    {EXAM_SUGGESTIONS.map((exam) => (
                                        <button key={exam} onMouseDown={() => { setExamName(exam); setShowSuggestions(false); }}
                                            className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-700">
                                            {exam}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {EXAM_SUGGESTIONS.slice(0, 6).map((exam) => (
                                <button key={exam} onClick={() => setExamName(exam)}
                                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${examName === exam ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                    {exam}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <Upload className="h-3.5 w-3.5" /> Upload Syllabus File
                        </label>

                        {parseStatus !== 'done' && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-9 transition hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-500"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800">
                                    <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Drop your syllabus here or <span className="text-indigo-600">browse</span>
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">Supports PDF, DOCX, TXT, MD · Max 20 MB</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {['PDF', 'DOCX', 'TXT', 'MD'].map((t) => (
                                        <span key={t} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800">{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <input ref={fileInputRef} type="file" accept=".txt,.pdf,.docx,.doc,.md" className="hidden" onChange={handleFileChange} />

                        {parseStatus === 'parsing' && (
                            <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Extracting syllabus text…</span>
                            </div>
                        )}

                        {parseStatus === 'done' && uploadedFile && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                <div className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <FileTypeIcon ext={uploadedFile.ext} />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{uploadedFile.name}</p>
                                            <p className="text-xs text-slate-500">{formatBytes(uploadedFile.size)} · {extractedText.split(/\s+/).length.toLocaleString()} words extracted</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        <button onClick={resetFile} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800" title="Remove file">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-36 overflow-y-auto border-t border-emerald-200 px-4 py-3 dark:border-emerald-900/30">
                                    <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                        {extractedText.slice(0, 600)}{extractedText.length > 600 ? '…' : ''}
                                    </p>
                                </div>
                            </div>
                        )}

                        {parseError && (
                            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-900/40 dark:bg-rose-950/20">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                                <p className="text-sm text-rose-700 dark:text-rose-300">{parseError}</p>
                            </div>
                        )}
                    </div>

                    {/* Manual paste fallback */}
                    {parseStatus !== 'done' && (
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <BookOpen className="h-3.5 w-3.5" /> Or paste syllabus / topics manually
                            </label>
                            <textarea
                                value={extractedText}
                                onChange={(e) => setExtractedText(e.target.value)}
                                placeholder={'Paste your syllabus, chapter list, or key topics here…\n\nExample:\nPaper 1: General Intelligence & Reasoning\n- Analogies, Similarities & Differences\n...\n\nPaper 2: Quantitative Aptitude\n- Number Systems, LCM/HCF, Percentages…'}
                                rows={6}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            />
                        </div>
                    )}

                    {/* Preferences */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Study Hours</label>
                            <select value={dailyHours} onChange={(e) => setDailyHours(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                {[1, 1.5, 2, 3, 4, 5, 6].map(h => <option key={h} value={h}>{h} hour{h !== 1 ? 's' : ''}/day</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plan Duration</label>
                            <select value={targetDays} onChange={(e) => setTargetDays(Number(e.target.value))}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                                {[7, 14, 21, 30, 45, 60, 90].map(d => <option key={d} value={d}>{d} days</option>)}
                            </select>
                        </div>
                    </div>

                    {/* AI preview hint */}
                    {canProceed && (
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                            <p className="mb-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">✨ Gemini AI will:</p>
                            <ul className="space-y-1 text-xs text-indigo-600 dark:text-indigo-400">
                                <li>• Parse the full syllabus of <strong>{examName}</strong></li>
                                <li>• Extract all chapters, subjects, and topics</li>
                                <li>• Build a {targetDays}-day plan with {dailyHours}h/day sessions</li>
                                <li>• Add formula notes &amp; spaced repetition reminders</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                    <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Cancel
                    </button>
                    <button onClick={handleGenerate} disabled={!canProceed || isGenerating}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                        {isGenerating
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Plan…</>
                            : <><Sparkles className="h-4 w-4" /> Generate Study Plan <ChevronRight className="h-4 w-4" /></>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

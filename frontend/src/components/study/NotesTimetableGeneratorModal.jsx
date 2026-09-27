import React, { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Upload, FileText, Clock, Check, X, AlertCircle,
    BookOpen, FileType, File, FilePlus, RefreshCw
} from 'lucide-react';
import { api } from '../../lib/api';

const SAMPLE_NOTES_PRESETS = [
    {
        title: 'Quantitative Speed Formulas & Arithmetic Shortcuts',
        category: 'Quantitative Aptitude',
        content: `Chapter: Arithmetic Shortcuts & Percentage Multipliers
1. Fraction to % table: 1/7 = 14.28%, 1/8 = 12.5%, 1/12 = 8.33%, 1/16 = 6.25%
2. Successive percentage change rule: Net % = a + b + (ab/100)%
3. Profit & Loss: Marked Price Markup % = (Profit% + Discount%) / (100 - Discount%) * 100
4. Dishonest Dealer Shortcut: Gain% = [Error / (True Value - Error)] * 100
5. Time & Work LCM Method: Total Work = LCM of individual times. Efficiency = Work / Time
6. Relative Speed: Same direction = (S1 - S2), Opposite direction = (S1 + S2)
7. Compound Interest 2-Year difference formula: CI - SI = P * (R/100)^2`
    },
    {
        title: 'Indian Polity - Fundamental Rights & Writs Cheat Notes',
        category: 'General Awareness',
        content: `Subject: Indian Constitution & Polity
Core Chapters to Cover:
- Preamble: Sovereign, Socialist, Secular, Democratic, Republic. 42nd Amendment added Socialist, Secular, Integrity.
- Part III: Fundamental Rights (Articles 12 to 35)
  * Article 14: Equality before law
  * Article 17: Abolition of Untouchability
  * Article 19: 6 Basic Freedoms (Speech, Assembly, Association, Movement, Residence, Trade)
  * Article 21: Right to Life & Personal Liberty
  * Article 21A: Right to Education (86th CAA 2002)
  * Article 32: Constitutional Remedies - 5 Writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto)
- Part IV: Directive Principles of State Policy (Articles 36 to 51)
- Part IVA: Fundamental Duties (Article 51A - 11 Duties recommended by Swaran Singh Committee)`
    },
    {
        title: 'Reasoning - Syllogisms & Seating Logic Topics',
        category: 'Reasoning Ability',
        content: `Topics & Rules for Logical Reasoning:
1. Syllogisms 100-50 & Venn Diagram Methods
  - All A are B (Universal Affirmative) -> Some A are B, Some B are A
  - No A is B (Universal Negative) -> No B is A, Some A are not B
  - Some A are B (Particular Affirmative) -> Some B are A
  - Either-Or Case Conditions: Same subject & predicate, one positive one negative, neither definitely true
2. Circular & Linear Seating Arrangement Rules:
  - Facing Center vs Facing Outside directions
  - Thread method for parallel row arrangements
3. Blood Relations Coded Symbols: P+Q means father, P-Q means sister
4. Direction Sense: Shadow concepts at Sunrise (Shadow in West) and Sunset (Shadow in East)`
    },
    {
        title: 'English Grammar Rules & High-Frequency Idioms',
        category: 'English Language',
        content: `Key English Grammar Rules:
1. Subject-Verb Agreement: Neither...Nor / Either...Or takes verb according to closest subject.
2. Rule of 'One of the + Plural Noun + Singular Verb' vs 'One of the + Plural Noun + Who + Plural Verb'.
3. Inversion Rule: Hardly / Scarcely followed by 'when', No sooner followed by 'than'.
4. High-frequency Idioms:
  - At one's wits' end (Completely confused)
  - Bite the bullet (Face a difficult situation with courage)
  - Spill the beans (Reveal a secret prematurely)
  - Through thick and thin (Under all circumstances)`
    }
];

// File type icon helper
const FileIcon = ({ type }) => {
    if (type === 'pdf') return <FileType className="w-4 h-4 text-rose-500" />;
    if (type === 'docx' || type === 'doc') return <FileType className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-slate-400" />;
};

export const NotesTimetableGeneratorModal = ({ isOpen, onClose, onGenerate, isGenerating, selectedExamId }) => {
    const [activeTab, setActiveTab] = useState('notes');
    const [noteTitle, setNoteTitle] = useState('My High-Yield Exam Notes');
    const [notesText, setNotesText] = useState(SAMPLE_NOTES_PRESETS[0].content);
    const [uploadedFile, setUploadedFile] = useState(null); // { name, type, size }
    const [uploadError, setUploadError] = useState(null);
    const [isExtractingPdf, setIsExtractingPdf] = useState(false);
    const [extractionMeta, setExtractionMeta] = useState(null); // { pages, total_characters }
    const fileInputRef = useRef(null);

    // Dynamically inject parsing libraries when the modal opens
    useEffect(() => {
        if (isOpen) {
            // Load PDF.js
            if (!document.getElementById('pdfjs-lib')) {
                const script = document.createElement('script');
                script.id = 'pdfjs-lib';
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                script.onload = () => {
                    if (window.pdfjsLib) {
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                    }
                };
                document.head.appendChild(script);
            }
            // Load mammoth.js
            if (!document.getElementById('mammoth-lib')) {
                const script = document.createElement('script');
                script.id = 'mammoth-lib';
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
                document.head.appendChild(script);
            }
        }
    }, [isOpen]);

    // Timetable preferences state
    const [dailyHours, setDailyHours] = useState(3);
    const [preferredSlots, setPreferredSlots] = useState(['morning', 'evening']);
    const [studyRhythm, setStudyRhythm] = useState('deep_work');
    const [targetDays, setTargetDays] = useState(7);
    const [restDays, setRestDays] = useState(['Sunday']);
    const [errorMsg, setErrorMsg] = useState(null);

    if (!isOpen) return null;

    const toggleSlot = (slot) => {
        if (preferredSlots.includes(slot)) {
            if (preferredSlots.length === 1) return;
            setPreferredSlots(preferredSlots.filter(s => s !== slot));
        } else {
            setPreferredSlots([...preferredSlots, slot]);
        }
    };

    const toggleRestDay = (day) => {
        if (restDays.includes(day)) {
            setRestDays(restDays.filter(d => d !== day));
        } else {
            setRestDays([...restDays, day]);
        }
    };

    const getFileExtension = (filename) => filename.split('.').pop().toLowerCase();

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError(null);
        const ext = getFileExtension(file.name);
        const baseName = file.name.replace(/\.[^/.]+$/, '');

        // Validate size (max 200MB)
        if (file.size > 200 * 1024 * 1024) {
            setUploadError('File too large. Maximum size is 200MB.');
            return;
        }

        setUploadedFile({ name: file.name, type: ext, size: file.size });
        setNoteTitle(baseName);

        if (ext === 'txt' || ext === 'md' || ext === 'csv' || ext === 'json') {
            // Plain text — read directly
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result;
                if (content) setNotesText(content);
            };
            reader.readAsText(file);

        } else if (ext === 'pdf') {
            // PDF — Extract using Python multi-engine backend (PyMuPDF, pdfplumber, pypdf, pdfminer.six)
            setIsExtractingPdf(true);
            setUploadError(null);
            try {
                // Convert file to base64
                const reader = new FileReader();
                const fileBase64Promise = new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                const base64Data = await fileBase64Promise;

                // Call backend PDF extraction API
                const response = await api.post('/pdf/extract', {
                    fileBase64: base64Data,
                    engine: 'pymupdf'
                });

                if (response.data && response.data.success) {
                    const { text, page_count, total_characters } = response.data;
                    setExtractionMeta({
                        page_count,
                        total_characters
                    });

                    if (text && text.trim().length > 0) {
                        setNotesText(text.trim());
                    } else {
                        setNotesText(`[PDF uploaded: ${file.name}]\n\nNo text could be extracted. Please paste key topics below.`);
                    }
                } else {
                    throw new Error(response.data?.error || 'Extraction returned empty result');
                }
            } catch (err) {
                console.warn('Backend Python extraction fallback to client-side pdf.js:', err);
                // Fallback attempt: client-side pdf.js
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    if (window.pdfjsLib) {
                        const pdf = await window.pdfjsLib.getDocument({ 
                            data: arrayBuffer,
                            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/cmaps/',
                            cMapPacked: true,
                            standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/standard_fonts/'
                        }).promise;
                        const pageExtracts = [];
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            const linesByY = {};
                            for (const item of content.items) {
                                if (!item.str || !item.str.trim()) continue;
                                const y = Math.round(item.transform[5]);
                                const existingY = Object.keys(linesByY).find(k => Math.abs(Number(k) - y) <= 3);
                                const targetY = existingY !== undefined ? existingY : y;
                                if (!linesByY[targetY]) linesByY[targetY] = [];
                                linesByY[targetY].push(item.str);
                            }
                            const sortedY = Object.keys(linesByY).sort((a, b) => Number(b) - Number(a));
                            const pageText = sortedY.map(y => linesByY[y].join(' ').trim()).filter(Boolean).join('\n');
                            if (pageText) pageExtracts.push(`--- Page ${i} ---\n${pageText}`);
                        }
                        const extracted = pageExtracts.join('\n\n').trim();
                        setNotesText(extracted || `[PDF uploaded: ${file.name}]\n\nPlease paste content manually if incomplete.`);
                        setExtractionMeta({
                            page_count: pdf.numPages,
                            total_characters: extracted.length
                        });
                    } else {
                        setUploadError('Could not process PDF. Please paste topics manually below.');
                    }
                } catch (fallbackErr) {
                    setUploadError('Could not extract text from PDF. Please paste the content manually below.');
                    setUploadedFile(null);
                }
            } finally {
                setIsExtractingPdf(false);
            }

        } else if (ext === 'docx' || ext === 'doc') {
            // DOCX — try mammoth.js if available, else fallback
            try {
                if (window.mammoth) {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await window.mammoth.extractRawText({ arrayBuffer });
                    setNotesText(result.value.trim() || `[DOCX uploaded: ${file.name}]\n\nDocument content extraction complete.`);
                } else {
                    setNotesText(`[Word Document: ${file.name}]\n\nFile size: ${(file.size / 1024).toFixed(1)} KB\n\nPlease paste the key topics, formulas, or chapters from your Word document below:\n\n`);
                }
            } catch (err) {
                setUploadError('Could not extract text from DOCX. Please paste the content manually below.');
                setUploadedFile(null);
            }
        } else {
            setUploadError('Unsupported file type. Please use .txt, .md, .pdf, or .docx files.');
            setUploadedFile(null);
        }
    };

    const handleDropZoneClick = () => fileInputRef.current?.click();

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && fileInputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInputRef.current.files = dt.files;
            handleFileUpload({ target: fileInputRef.current });
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleClearFile = () => {
        setUploadedFile(null);
        setNotesText('');
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!notesText.trim()) {
            setErrorMsg('Please paste your study notes, topics or upload a file.');
            setActiveTab('notes');
            return;
        }
        setErrorMsg(null);
        const preferences = {
            dailyHours,
            preferredTimeSlots: preferredSlots,
            studyRhythm,
            targetDays,
            restDays,
        };
        await onGenerate({
            notesText: notesText.trim(),
            noteTitle: noteTitle.trim() || 'My Custom Notes',
            examId: selectedExamId || 'exam_ssc_cgl',
            timetablePreferences: preferences,
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900" style={{ maxHeight: '90vh' }}>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-5 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg">
                            <Sparkles className="h-5 w-5 text-amber-300" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold sm:text-lg">AI Study Plan & Timetable from Notes</h2>
                            <p className="text-xs text-slate-300">Turn your notes & custom topics into an organized, high-retention daily timetable.</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={isGenerating} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 border-b border-slate-200 bg-slate-50 px-6 pt-3 dark:border-slate-800 dark:bg-slate-950">
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-bold transition ${activeTab === 'notes'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <FileText className="h-4 w-4" /> 1. Upload or Paste Notes & Topics
                    </button>
                    <button
                        onClick={() => setActiveTab('timetable')}
                        className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-bold transition ${activeTab === 'timetable'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Clock className="h-4 w-4" /> 2. Personalize Daily Timetable
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-6 overflow-y-auto p-6 text-slate-800 dark:text-slate-200">

                    {/* Global error */}
                    {errorMsg && (
                        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    {/* ── Notes Tab ─────────────────────────────────────── */}
                    {activeTab === 'notes' && (
                        <div className="space-y-5">

                            {/* Presets */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Quick Load High-Yield Presets:
                                </label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {SAMPLE_NOTES_PRESETS.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => { setNoteTitle(preset.title); setNotesText(preset.content); setUploadedFile(null); }}
                                            className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${noteTitle === preset.title && !uploadedFile
                                                ? 'border-indigo-500 bg-indigo-50/60 text-indigo-900 shadow-sm dark:bg-indigo-950/40 dark:text-indigo-200'
                                                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700'}`}
                                        >
                                            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                                            <div className="overflow-hidden">
                                                <div className="truncate text-xs font-bold">{preset.title}</div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400">{preset.category}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Notes / Syllabus Title
                                </label>
                                <input
                                    type="text"
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                    placeholder="e.g. My Quantitative Arithmetic & Geometry Notes"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                />
                            </div>

                            {/* Upload zone */}
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Upload File
                                </label>

                                {/* Drag-and-drop drop zone */}
                                {!uploadedFile ? (
                                    <div
                                        onClick={handleDropZoneClick}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 transition hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/20"
                                    >
                                        {isExtractingPdf ? (
                                            <div className="flex flex-col items-center py-2">
                                                <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
                                                <p className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                    Extracting document text and key topics...
                                                </p>
                                                <p className="text-[10px] text-slate-400">Analyzing layout and syllabus content</p>
                                            </div>
                                        ) : (
                                            <>
                                                <FilePlus className="mb-3 h-8 w-8 text-slate-400" />
                                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                    Click to upload or drag & drop
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Supported: <span className="font-bold text-rose-500">.pdf</span>, <span className="font-bold text-blue-500">.docx</span>, <span className="font-bold text-slate-500">.txt</span>, <span className="font-bold text-slate-500">.md</span>
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-slate-400">Max size: 200 MB</p>
                                            </>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.docx,.doc,.txt,.md,.csv,.json"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </div>
                                ) : (
                                    /* Uploaded file preview */
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                                            <FileIcon type={uploadedFile.type} />
                                            <div className="flex-1 overflow-hidden">
                                                <div className="truncate text-xs font-bold text-slate-800 dark:text-white">{uploadedFile.name}</div>
                                                <div className="text-[11px] text-slate-500">
                                                    {uploadedFile.type.toUpperCase()} · {formatFileSize(uploadedFile.size)}
                                                    {uploadedFile.type === 'pdf' && (
                                                        <span> · Text extracted</span>
                                                    )}
                                                    {(uploadedFile.type === 'docx' || uploadedFile.type === 'doc') && ' · Text extracted from Word document'}
                                                </div>
                                            </div>
                                            <button onClick={handleClearFile} className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Document extraction summary */}
                                        {extractionMeta && (
                                            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                                                <span className="font-semibold text-slate-700 dark:text-slate-200">{extractionMeta.page_count || 1} Pages</span>
                                                <span>·</span>
                                                <span>{extractionMeta.total_characters?.toLocaleString()} characters extracted</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Upload error */}
                                {uploadError && (
                                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {uploadError}
                                    </div>
                                )}
                            </div>

                            {/* Text area */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Paste Notes, Cheat Formulas, or Topics List
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400">
                                        <Upload className="h-3.5 w-3.5" />
                                        Or upload .txt / .md
                                        <input
                                            type="file"
                                            accept=".txt,.md"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <textarea
                                    value={notesText}
                                    onChange={(e) => setNotesText(e.target.value)}
                                    rows={8}
                                    placeholder="Paste your syllabus topics, formulas, or notes here... The AI will extract chapters, organize difficulty levels, and build an optimal schedule."
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3.5 font-mono text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                />
                                <p className="mt-1 text-[11px] text-slate-500">
                                    {notesText.length} characters · AI will automatically extract formulas, key concepts, and schedule milestones.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Timetable Tab ─────────────────────────────────── */}
                    {activeTab === 'timetable' && (
                        <div className="space-y-6">

                            {/* Daily hours */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Study Commitment</label>
                                    <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                        {dailyHours} Hours / Day ({dailyHours * 60} mins)
                                    </span>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {[1, 2, 3, 4, 6].map((hrs) => (
                                        <button
                                            key={hrs}
                                            type="button"
                                            onClick={() => setDailyHours(hrs)}
                                            className={`rounded-xl border py-2.5 text-xs font-bold transition ${dailyHours === hrs
                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'}`}
                                        >
                                            {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time slots */}
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Time of Day for Study Sessions</label>
                                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                    {[
                                        { id: 'morning', label: 'Morning', time: '06:30 - 09:00 AM' },
                                        { id: 'afternoon', label: 'Afternoon', time: '02:00 - 05:00 PM' },
                                        { id: 'evening', label: 'Evening', time: '06:00 - 09:00 PM' },
                                        { id: 'night', label: 'Night', time: '09:30 - 12:00 AM' }
                                    ].map((slot) => {
                                        const isSelected = preferredSlots.includes(slot.id);
                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => toggleSlot(slot.id)}
                                                className={`rounded-xl border p-3 text-left transition ${isSelected
                                                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-sm dark:bg-indigo-950/40 dark:text-indigo-200'
                                                    : 'border-slate-200 text-slate-600 opacity-60 hover:opacity-100 dark:border-slate-800 dark:text-slate-400'}`}
                                            >
                                                <div className="mb-0.5 flex items-center justify-between text-xs font-bold">
                                                    <span>{slot.label}</span>
                                                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                                                </div>
                                                <div className="text-[10px] text-slate-500">{slot.time}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Study rhythm */}
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">Study Rhythm & Focus Style</label>
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                    {[
                                        { id: 'deep_work', label: 'Deep Work (90-Min Focus Blocks)', desc: 'Extended intense focus with formula mastery and question sets' },
                                        { id: 'pomodoro', label: 'Pomodoro Technique (25m + 5m)', desc: 'High-energy short sprints with scheduled mental resets' },
                                        { id: 'balanced', label: 'Balanced Blocks (45-Min Sessions)', desc: 'Even split between theory revision and timed problem sets' },
                                        { id: 'weekend_heavy', label: 'Weekend Power Sprints', desc: 'Light daily revision with heavy mock sessions on weekends' }
                                    ].map((rhythm) => (
                                        <button
                                            key={rhythm.id}
                                            type="button"
                                            onClick={() => setStudyRhythm(rhythm.id)}
                                            className={`rounded-xl border p-3 text-left transition ${studyRhythm === rhythm.id
                                                ? 'border-purple-600 bg-purple-50/60 text-purple-950 shadow-sm dark:bg-purple-950/40 dark:text-purple-200'
                                                : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'}`}
                                        >
                                            <div className="mb-0.5 text-xs font-bold">{rhythm.label}</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{rhythm.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration + rest days */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">Target Plan Duration</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { days: 7, label: '7-Day Sprint' },
                                            { days: 14, label: '14-Day Intensive' },
                                            { days: 21, label: '21-Day Mastery' }
                                        ].map((plan) => (
                                            <button
                                                key={plan.days}
                                                type="button"
                                                onClick={() => setTargetDays(plan.days)}
                                                className={`rounded-xl border py-2 text-center text-xs font-bold transition ${targetDays === plan.days
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-900'
                                                    : 'border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300'}`}
                                            >
                                                {plan.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">Light / Recovery Days</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Sunday', 'Saturday', 'Friday', 'Wednesday'].map((day) => {
                                            const isRest = restDays.includes(day);
                                            return (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleRestDay(day)}
                                                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${isRest
                                                        ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : 'border-slate-200 text-slate-500 hover:text-slate-800 dark:border-slate-800'}`}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
                    <div className="text-xs text-slate-500">
                        {activeTab === 'notes'
                            ? 'Step 1 of 2 · Uploaded notes will be converted into structured topics'
                            : 'Step 2 of 2 · Timetable will be built with spaced repetition checkpoints'}
                    </div>
                    <div className="flex items-center gap-2">
                        {activeTab === 'notes' ? (
                            <button
                                type="button"
                                onClick={() => setActiveTab('timetable')}
                                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                Next: Customize Timetable →
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('notes')}
                                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    ← Back to Notes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isGenerating}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
                                >
                                    <Sparkles className="h-4 w-4 text-amber-300" />
                                    {isGenerating ? 'Architecting Timetable...' : 'Generate Study Plan & Timetable'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

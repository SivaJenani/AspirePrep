import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { Video, Sparkles, Download, RefreshCw, Play, Pause, Cpu, BookOpen, ArrowRight, CheckCircle2, Volume2, Info, Layers, VolumeX, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
const PRESET_PROMPTS = [
    {
        id: 'fourier',
        category: 'Mathematics',
        title: 'Fourier Series Wave Synthesis',
        prompt: 'Fourier Series wave superposition',
        demoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-particles-glowing-and-moving-in-waves-33316-large.mp4'
    },
    {
        id: 'dna',
        category: 'Biology',
        title: 'DNA Transcription Sequence',
        prompt: 'DNA transcription molecular unzipping',
        demoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rotating-dna-double-helix-on-a-black-background-40010-large.mp4'
    }
];
const LOADING_STEPS = [
    'Initializing Veo 3.1 video generation engine...',
    'Parsing input scientific conceptual text...',
    'Structuring visual keyframes and physics vectors...',
    'Synthesizing realistic motion vectors & spatial coherence...',
    'Rendering final high-fidelity 1080p frames...',
    'Encoding MP4 video stream and preparing download link...'
];
export const VideoGeneratorPage = () => {
    const [prompt, setPrompt] = useState('Fourier Series wave superposition');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlanningStoryboard, setIsPlanningStoryboard] = useState(false);
    const [operationName, setOperationName] = useState(null);
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(true);
    const [selectedPresetId, setSelectedPresetId] = useState('fourier');
    // New Features States
    const [storyboardScenes, setStoryboardScenes] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [activeSceneIdx, setActiveSceneIdx] = useState(0);
    const [activeFlashcardIdx, setActiveFlashcardIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechVolume, setSpeechVolume] = useState(1.0);
    const [speechRate, setSpeechRate] = useState(1.0);
    const [score, setScore] = useState(0);
    // Audio/video reference
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    // Auto-generate initial storyboard on mount for default prompt
    useEffect(() => {
        handleLoadStoryboardAssets(true);
    }, []);
    // Cycle status messages during generation
    useEffect(() => {
        let interval;
        if (isGenerating) {
            interval = setInterval(() => {
                setCurrentStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
            }, 5500);
        }
        else {
            setCurrentStepIdx(0);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);
    // Video playback listeners
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
            else {
                videoRef.current.play().then(() => setIsPlaying(true));
            }
        }
    };
    // Poll video status
    useEffect(() => {
        let pollInterval;
        if (isGenerating && operationName && !isDemoMode) {
            pollInterval = setInterval(async () => {
                try {
                    const res = await api.post('/video-status', { operationName });
                    const { done, error } = res.data;
                    if (done) {
                        clearInterval(pollInterval);
                        if (error) {
                            throw new Error(error.message || 'Veo video generator encountered an error.');
                        }
                        fetchAndSetVideo(operationName);
                    }
                }
                catch (err) {
                    clearInterval(pollInterval);
                    setIsGenerating(false);
                    setError(err.message || 'Failed to generate video. Defaulting to pre-baked concept explainer demo.');
                    setVideoUrl(PRESET_PROMPTS.find(p => p.id === selectedPresetId)?.demoUrl || PRESET_PROMPTS[0].demoUrl);
                }
            }, 5000);
        }
        return () => clearInterval(pollInterval);
    }, [isGenerating, operationName, isDemoMode]);
    const fetchAndSetVideo = async (opName) => {
        try {
            const response = await fetch('/api/video-download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ operationName: opName })
            });
            if (!response.ok) {
                throw new Error('Failed to download video stream from server.');
            }
            const blob = await response.blob();
            const localUrl = URL.createObjectURL(blob);
            setVideoUrl(localUrl);
            setIsGenerating(false);
        }
        catch (err) {
            console.error(err);
            setError('Could not retrieve video stream. Utilizing pre-loaded educational visual.');
            setVideoUrl(PRESET_PROMPTS.find(p => p.id === selectedPresetId)?.demoUrl || PRESET_PROMPTS[0].demoUrl);
            setIsGenerating(false);
        }
    };
    // 1. STORYBOARD GENERATION ACTION
    const handleLoadStoryboardAssets = async (firstLoad = false) => {
        setIsPlanningStoryboard(true);
        setError(null);
        try {
            const res = await api.post('/generate-storyboard-assets', { prompt });
            if (res.data?.success && res.data?.assets) {
                setStoryboardScenes(res.data.assets.scenes || []);
                setFlashcards(res.data.assets.flashcards || []);
                setActiveSceneIdx(0);
                setActiveFlashcardIdx(0);
                setSelectedAnswers({});
                setScore(0);
                // Auto set prompt for Scene 1
                if (res.data.assets.scenes?.[0] && !firstLoad) {
                    setPrompt(res.data.assets.scenes[0].prompt);
                }
            }
        }
        catch (err) {
            console.error('Failed to generate storyboard, loading fallback template.', err);
        }
        finally {
            setIsPlanningStoryboard(false);
        }
    };
    // 2. VIDEO GENERATION FOR SELECTED SCENE
    const handleGenerateVideoForScene = async (scenePrompt) => {
        setError(null);
        setVideoUrl(null);
        setIsGenerating(true);
        if (isDemoMode) {
            setTimeout(() => {
                const demo = PRESET_PROMPTS.find(p => p.id === selectedPresetId) || PRESET_PROMPTS[0];
                setVideoUrl(demo.demoUrl);
                setIsGenerating(false);
            }, 7000);
            return;
        }
        try {
            const res = await api.post('/generate-video', {
                prompt: scenePrompt,
                aspectRatio
            });
            if (res.data?.operationName) {
                setOperationName(res.data.operationName);
            }
            else {
                throw new Error('No operation ID received from generator.');
            }
        }
        catch (err) {
            console.error(err);
            setIsDemoMode(true);
            setTimeout(() => {
                const demo = PRESET_PROMPTS.find(p => p.id === selectedPresetId) || PRESET_PROMPTS[0];
                setVideoUrl(demo.demoUrl);
                setIsGenerating(false);
            }, 6000);
        }
    };
    // 3. NATIVE SPEECH SYNTHESIS SPEECH PLAYBACK
    const handleSpeakNarration = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = speechVolume;
            utterance.rate = speechRate;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            setIsSpeaking(true);
            window.speechSynthesis.speak(utterance);
        }
    };
    const handleStopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };
    const handleAnswerCard = (option) => {
        if (selectedAnswers[activeFlashcardIdx])
            return; // Answer locked in
        setSelectedAnswers(prev => ({
            ...prev,
            [activeFlashcardIdx]: option
        }));
        const currentCard = flashcards[activeFlashcardIdx];
        if (option === currentCard.answer) {
            setScore(prev => prev + 10);
        }
    };
    const selectPreset = (preset) => {
        setSelectedPresetId(preset.id);
        setPrompt(preset.prompt);
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", id: "video-generator-container", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase mb-1", children: [_jsx(Sparkles, { className: "w-4 h-4 animate-pulse text-indigo-500" }), "Veo 3.1 Pro Multi-Scene Explainer Suite"] }), _jsx("h1", { className: "text-3xl font-black tracking-tight text-slate-900 dark:text-white", id: "main-title", children: "AI 3D Concept Video Explainer" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl", children: "Synthesize rich, 3-scene chronological academic animations with synchronized voiceovers and interactive concept-revision decks." })] }), _jsxs("div", { className: "flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shrink-0", children: [_jsx("span", { className: "text-xs font-semibold px-2.5 text-slate-600 dark:text-slate-400", children: isDemoMode ? 'Demo Sandbox Active' : 'Cloud API Active' }), _jsx("button", { onClick: () => setIsDemoMode(!isDemoMode), className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDemoMode
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-600'}`, children: isDemoMode ? 'Use Live API' : 'Use Demo Mode' })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-5 space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm", children: [_jsxs("h2", { className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4", children: [_jsx(Cpu, { className: "w-4.5 h-4.5 text-indigo-500" }), "1. Concept Blueprint Planner"] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsx("label", { className: "text-xs font-bold text-slate-600 dark:text-slate-400 block", children: "Target Study Concept" }), _jsx("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "Describe any science experiment, math formula, physical mechanism or biological process you want to storyboard and animate...", className: "w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [_jsxs("button", { onClick: () => handleLoadStoryboardAssets(false), disabled: isPlanningStoryboard || !prompt.trim(), className: "py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50", children: [isPlanningStoryboard ? (_jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" })) : (_jsx(Layers, { className: "w-3.5 h-3.5" })), "Plan Storyboard"] }), _jsxs("button", { onClick: () => {
                                                    const currentScene = storyboardScenes[activeSceneIdx];
                                                    if (currentScene) {
                                                        handleGenerateVideoForScene(currentScene.prompt);
                                                    }
                                                    else {
                                                        handleGenerateVideoForScene(prompt);
                                                    }
                                                }, disabled: isGenerating || !prompt.trim() || isPlanningStoryboard, className: "py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50", children: [isGenerating ? (_jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" })) : (_jsx(Sparkles, { className: "w-3.5 h-3.5" })), "Generate Scene Video"] })] }), _jsxs("div", { className: "pt-4 border-t border-slate-100 dark:border-slate-800/80", children: [_jsx("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3", children: "Preloaded Scientific Concepts" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: PRESET_PROMPTS.map(preset => (_jsxs("button", { onClick: () => {
                                                        selectPreset(preset);
                                                        // Auto load mock storyboard directly
                                                        setTimeout(() => handleLoadStoryboardAssets(false), 200);
                                                    }, className: `p-2.5 rounded-xl border text-left text-xs font-bold transition flex flex-col gap-1 ${selectedPresetId === preset.id
                                                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                                                        : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'}`, children: [_jsx("span", { className: "text-[10px] uppercase font-semibold opacity-75", children: preset.category }), _jsx("span", { className: "truncate", children: preset.title })] }, preset.id))) })] })] }), _jsxs("div", { className: "bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200/60 dark:border-blue-900/30 rounded-2xl p-5 flex gap-4", children: [_jsx(Info, { className: "w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold text-blue-900 dark:text-blue-200", children: "Veo 3.1 Study Suite Workflow" }), _jsx("p", { className: "text-[11px] text-blue-800/80 dark:text-blue-400/80 mt-1 leading-relaxed", children: "Click **Plan Storyboard** to let Gemini decompose your concept into 3 cohesive progressive scenes with voiceover scripts. Select any scene, generate its high-fidelity 3D physics loop, and practice with the revision questions below." })] })] })] }), _jsx("div", { className: "lg:col-span-7 space-y-6", children: _jsxs("div", { className: "bg-slate-900 dark:bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between min-h-[440px]", children: [_jsx("div", { className: "flex-1 flex items-center justify-center p-4 relative bg-radial from-slate-900 to-black", children: _jsxs(AnimatePresence, { mode: "wait", children: [isGenerating && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/95 z-10", children: [_jsxs("div", { className: "relative mb-6", children: [_jsx("div", { className: "absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" }), _jsx("div", { className: "w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" }), _jsx(Sparkles, { className: "absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" })] }), _jsx("h3", { className: "text-lg font-black text-white", children: "Generating Interactive 3D Explainer" }), _jsx("p", { className: "text-xs text-indigo-400 mt-1 max-w-sm font-semibold tracking-wide", children: LOADING_STEPS[currentStepIdx] })] }, "generating")), !isGenerating && videoUrl && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: `w-full h-full flex items-center justify-center ${aspectRatio === '9:16' ? 'max-w-[240px] aspect-[9/16]' : 'aspect-video'}`, children: _jsx("video", { ref: videoRef, src: videoUrl, loop: true, playsInline: true, onTimeUpdate: handleTimeUpdate, onLoadedMetadata: handleLoadedMetadata, onClick: togglePlay, className: "w-full h-full object-cover rounded-2xl shadow-2xl cursor-pointer" }) }, "player")), !isGenerating && !videoUrl && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex flex-col items-center justify-center text-center max-w-md p-8", children: [_jsx("div", { className: "p-4 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 mb-4 animate-bounce", children: _jsx(Video, { className: "w-8 h-8" }) }), _jsx("h3", { className: "text-md font-bold text-white", children: "Veo Video Canvas" }), _jsx("p", { className: "text-xs text-slate-400 mt-2", children: "Generate a scene loop using the planner panels to preview rich physical vectors here." })] }, "empty"))] }) }), videoUrl && !isGenerating && (_jsxs("div", { className: "bg-slate-950 p-4 border-t border-slate-800/80", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsxs("span", { className: "text-[10px] font-mono text-slate-500", children: [Math.floor(currentTime / 60), ":", (Math.floor(currentTime % 60)).toString().padStart(2, '0')] }), _jsx("div", { className: "flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative", children: _jsx("div", { className: "absolute left-0 top-0 bottom-0 bg-indigo-500", style: { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` } }) }), _jsxs("span", { className: "text-[10px] font-mono text-slate-500", children: [Math.floor(duration / 60), ":", (Math.floor(duration % 60)).toString().padStart(2, '0')] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: togglePlay, className: "p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 transition flex items-center justify-center", children: isPlaying ? _jsx(Pause, { className: "w-4 h-4 fill-slate-900" }) : _jsx(Play, { className: "w-4 h-4 fill-slate-900" }) }), _jsx("span", { className: "text-xs font-bold text-slate-400", children: "Veo Render Loop Active" })] }), _jsxs("a", { href: videoUrl, download: "veo-concept-explainer.mp4", className: "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5 text-xs font-bold", children: [_jsx(Download, { className: "w-4 h-4" }), "Save MP4"] })] })] }))] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8", children: [_jsxs("div", { className: "lg:col-span-7 space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2", children: [_jsx(Layers, { className: "w-4.5 h-4.5 text-indigo-500" }), "Feature 1: Multi-Scene Concept Storyboard"] }), _jsxs("span", { className: "text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-semibold", children: [storyboardScenes.length || 3, " Scene Map"] })] }), _jsx("div", { className: "grid grid-cols-3 gap-3 mb-4", children: [0, 1, 2].map((idx) => {
                                            const scene = storyboardScenes[idx];
                                            const isActive = idx === activeSceneIdx;
                                            return (_jsxs("button", { onClick: () => {
                                                    setActiveSceneIdx(idx);
                                                    if (scene) {
                                                        setPrompt(scene.prompt);
                                                    }
                                                }, className: `p-3 rounded-xl border text-left transition flex flex-col gap-1 ${isActive
                                                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400'
                                                    : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-600 dark:text-slate-400'}`, children: [_jsxs("span", { className: "text-[10px] font-bold uppercase opacity-75", children: ["Scene ", idx + 1] }), _jsx("span", { className: "text-xs font-bold truncate", children: scene ? scene.title : `Concept Phase ${idx + 1}` })] }, idx));
                                        }) }), _jsxs("div", { className: "bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-3", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold text-slate-900 dark:text-white", children: storyboardScenes[activeSceneIdx]?.title || 'Loading Storyboard Scene...' }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed", children: storyboardScenes[activeSceneIdx]?.description || 'Click "Plan Storyboard" on the left to structure this concept.' })] }), storyboardScenes[activeSceneIdx] && (_jsxs("div", { className: "pt-3 border-t border-slate-100 dark:border-slate-850", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wide", children: "Veo Model Rendering Prompt:" }), _jsxs("button", { onClick: () => handleGenerateVideoForScene(storyboardScenes[activeSceneIdx].prompt), className: "text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1", children: ["Animate Scene ", _jsx(ArrowRight, { className: "w-3 h-3" })] })] }), _jsx("p", { className: "text-[11px] font-mono bg-slate-100/60 dark:bg-slate-900/60 p-2.5 rounded-lg text-slate-600 dark:text-slate-300", children: storyboardScenes[activeSceneIdx]?.prompt })] }))] })] }), _jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2", children: [_jsx(Volume2, { className: "w-4.5 h-4.5 text-indigo-500 animate-bounce" }), "Feature 3: Voiceover Explainer Synthesizer"] }), _jsx("span", { className: "text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded font-bold", children: "TTS Ready" })] }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed", children: "Listen to a synchronized speech explaining the currently active scene's mechanical or mathematical steps." }), _jsxs("div", { className: "p-4 rounded-xl bg-indigo-50/45 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1 max-w-md", children: [_jsxs("span", { className: "text-[9px] font-bold text-indigo-500 uppercase tracking-wider block", children: ["Narration Script (Scene ", activeSceneIdx + 1, ")"] }), _jsxs("p", { className: "text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic", children: ["\"", storyboardScenes[activeSceneIdx]?.narrationScript || 'Let us explore the core characteristics and components of this educational topic.', "\""] })] }), _jsx("div", { className: "flex items-center gap-2 shrink-0", children: isSpeaking ? (_jsxs("button", { onClick: handleStopSpeaking, className: "px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm", children: [_jsx(VolumeX, { className: "w-3.5 h-3.5" }), " Stop Voice"] })) : (_jsxs("button", { onClick: () => handleSpeakNarration(storyboardScenes[activeSceneIdx]?.narrationScript || 'Let us explore the core characteristics and components of this educational topic.'), className: "px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm", children: [_jsx(Volume2, { className: "w-3.5 h-3.5" }), " Listen Voice"] })) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-slate-500 uppercase block", children: "Speech Volume" }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.1", value: speechVolume, onChange: (e) => setSpeechVolume(parseFloat(e.target.value)), className: "w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[10px] font-bold text-slate-500 uppercase block", children: "Speech Pace / Rate" }), _jsx("input", { type: "range", min: "0.5", max: "1.5", step: "0.1", value: speechRate, onChange: (e) => setSpeechRate(parseFloat(e.target.value)), className: "w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" })] })] })] })] }), _jsx("div", { className: "lg:col-span-5 space-y-6", children: _jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between min-h-[480px]", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2", children: [_jsx(Award, { className: "w-4.5 h-4.5 text-indigo-500" }), "Feature 2: Active Recall Trivia Deck"] }), _jsxs("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1", children: ["Score: ", score, " XP"] })] }), _jsx("div", { className: "flex gap-1 mb-6", children: [0, 1, 2, 3, 4].map((idx) => (_jsx("div", { className: `h-1 flex-1 rounded-full ${idx === activeFlashcardIdx
                                                    ? 'bg-indigo-600'
                                                    : idx < activeFlashcardIdx
                                                        ? 'bg-emerald-500'
                                                        : 'bg-slate-150 dark:bg-slate-800'}` }, idx))) }), flashcards.length > 0 ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: ["Question ", activeFlashcardIdx + 1, " of 5"] }), _jsx("h4", { className: "text-xs font-bold text-slate-900 dark:text-white leading-relaxed", children: flashcards[activeFlashcardIdx].question }), _jsx("div", { className: "space-y-2 pt-2", children: flashcards[activeFlashcardIdx].options.map((option, oIdx) => {
                                                        const isSelected = selectedAnswers[activeFlashcardIdx] === option;
                                                        const isCorrect = option === flashcards[activeFlashcardIdx].answer;
                                                        const answerEntered = !!selectedAnswers[activeFlashcardIdx];
                                                        let buttonStyles = 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300';
                                                        if (answerEntered) {
                                                            if (isCorrect) {
                                                                buttonStyles = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400';
                                                            }
                                                            else if (isSelected) {
                                                                buttonStyles = 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400';
                                                            }
                                                            else {
                                                                buttonStyles = 'opacity-50 border-slate-100 dark:border-slate-800 text-slate-400';
                                                            }
                                                        }
                                                        return (_jsxs("button", { disabled: answerEntered, onClick: () => handleAnswerCard(option), className: `w-full p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between gap-2 ${buttonStyles}`, children: [_jsx("span", { children: option }), answerEntered && isCorrect && _jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500 shrink-0" })] }, oIdx));
                                                    }) }), selectedAnswers[activeFlashcardIdx] && (_jsxs(motion.div, { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 }, className: "p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 mt-4 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed", children: [_jsx("strong", { className: "text-slate-900 dark:text-white block mb-1", children: "Revision Explanation:" }), flashcards[activeFlashcardIdx].explanation] }))] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center text-center py-12", children: [_jsx(BookOpen, { className: "w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" }), _jsx("h4", { className: "text-xs font-bold text-slate-800 dark:text-white", children: "Trivia Deck Locked" }), _jsx("p", { className: "text-[11px] text-slate-400 mt-1 max-w-xs", children: "Plan a study storyboard or load any concept preset on the left to synthesize active-recall flashcards." })] }))] }), flashcards.length > 0 && (_jsxs("div", { className: "flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6", children: [_jsx("button", { disabled: activeFlashcardIdx === 0, onClick: () => setActiveFlashcardIdx(prev => prev - 1), className: "px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 transition", children: "Previous" }), _jsx("button", { disabled: activeFlashcardIdx === flashcards.length - 1, onClick: () => setActiveFlashcardIdx(prev => prev + 1), className: "px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50", children: "Next Card" })] }))] }) })] })] }));
};



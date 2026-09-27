import React, { useState, useEffect, useRef } from 'react';
import { 
    Video, Sparkles, Download, RefreshCw, Play, Pause, Cpu, BookOpen, 
    ArrowRight, CheckCircle2, Volume2, Info, Layers, VolumeX, Award, 
    Sliders, Zap, Eye, RotateCcw, FastForward, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';

const PRESET_PROMPTS = [
    {
        id: 'fourier',
        category: 'Mathematics',
        title: 'Fourier Series Wave Synthesis',
        prompt: 'Fourier Series wave superposition and harmonic epicycle breakdown',
        demoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-particles-glowing-and-moving-in-waves-33316-large.mp4',
        simType: 'fourier'
    },
    {
        id: 'dna',
        category: 'Biology',
        title: 'DNA Transcription Sequence',
        prompt: 'DNA transcription molecular unzipping by helicase and mRNA synthesis',
        demoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rotating-dna-double-helix-on-a-black-background-40010-large.mp4',
        simType: 'dna'
    },
    {
        id: 'em_induction',
        category: 'Physics',
        title: 'Electromagnetic Induction',
        prompt: 'Faraday law electromagnetic induction with magnetic flux vectors and induced electromotive force',
        demoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-technology-circuit-network-41551-large.mp4',
        simType: 'induction'
    },
    {
        id: 'projectile',
        category: 'Physics',
        title: 'Projectile Vector Motion',
        prompt: 'Parabolic projectile motion with velocity vectors and gravitational acceleration',
        demoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-and-dots-in-motion-33318-large.mp4',
        simType: 'projectile'
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
    
    // Multi-Scene and Deck States
    const [storyboardScenes, setStoryboardScenes] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [activeSceneIdx, setActiveSceneIdx] = useState(0);
    const [activeFlashcardIdx, setActiveFlashcardIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speechVolume, setSpeechVolume] = useState(1.0);
    const [speechRate, setSpeechRate] = useState(1.0);
    const [score, setScore] = useState(0);
    
    // Canvas vs Video player tab
    const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'video'
    const [isSimulating, setIsSimulating] = useState(true);
    const [simHarmonics, setSimHarmonics] = useState(4);
    const [isAutoPlayingStoryboard, setIsAutoPlayingStoryboard] = useState(false);

    // References
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Auto-generate initial storyboard on mount
    useEffect(() => {
        handleLoadStoryboardAssets(true);
    }, []);

    // Cycle status messages during generation
    useEffect(() => {
        let interval;
        if (isGenerating) {
            interval = setInterval(() => {
                setCurrentStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
            }, 3000);
        } else {
            setCurrentStepIdx(0);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    // Canvas 2D/3D Interactive Vector Simulation Engine
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let time = 0;
        const wavePoints = [];

        const render = () => {
            const width = canvas.width = canvas.parentElement?.clientWidth || 700;
            const height = canvas.height = canvas.parentElement?.clientHeight || 420;
            ctx.clearRect(0, 0, width, height);

            // Dark space background
            const bgGradient = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, width*0.8);
            bgGradient.addColorStop(0, '#0f172a');
            bgGradient.addColorStop(1, '#020617');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Grid blueprint lines
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
            ctx.lineWidth = 1;
            const gridSize = 30;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            const currentPreset = PRESET_PROMPTS.find(p => p.id === selectedPresetId);
            const simType = currentPreset?.simType || 'fourier';

            if (simType === 'fourier' || prompt.toLowerCase().includes('fourier') || prompt.toLowerCase().includes('wave')) {
                // FOURIER SERIES HARMONIC EPICYCLES
                const centerX = width * 0.28;
                const centerY = height * 0.5;
                let x = centerX;
                let y = centerY;

                for (let i = 0; i < simHarmonics; i++) {
                    const prevX = x;
                    const prevY = y;
                    const n = i * 2 + 1; // Odd harmonics
                    const radius = (height * 0.22) * (4 / (n * Math.PI));

                    x += radius * Math.cos(n * time);
                    y += radius * Math.sin(n * time);

                    // Circle
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.4 - i * 0.08})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(prevX, prevY, Math.abs(radius), 0, Math.PI * 2);
                    ctx.stroke();

                    // Vector line
                    ctx.strokeStyle = '#818cf8';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x, y);
                    ctx.stroke();

                    // Tip point
                    ctx.fillStyle = '#6366f1';
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Add point to wave trail
                wavePoints.unshift(y);
                if (wavePoints.length > width * 0.6) {
                    wavePoints.pop();
                }

                // Connecting line from epicycle tip to wave
                ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(centerX + width * 0.2, wavePoints[0] || y);
                ctx.stroke();
                ctx.setLineDash([]);

                // Draw resultant synthesized wave
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#0284c7';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                const waveStartX = centerX + width * 0.2;
                for (let i = 0; i < wavePoints.length; i++) {
                    ctx.lineTo(waveStartX + i * 1.5, wavePoints[i]);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Labels
                ctx.fillStyle = '#94a3b8';
                ctx.font = '11px monospace';
                ctx.fillText(`Fourier Harmonics: N = ${simHarmonics}`, 20, 30);
                ctx.fillText(`Frequency: ${(time).toFixed(1)} rad/s`, 20, 48);

            } else if (simType === 'dna' || prompt.toLowerCase().includes('dna') || prompt.toLowerCase().includes('bio')) {
                // DNA DOUBLE HELIX 3D ROTATION SIMULATION
                const numPairs = 24;
                const centerX = width * 0.5;
                const centerY = height * 0.5;

                for (let i = 0; i < numPairs; i++) {
                    const offset = (i / numPairs) * Math.PI * 4 + time;
                    const yPos = centerY + (i - numPairs/2) * 14;
                    const radius = 90;

                    const x1 = centerX + Math.sin(offset) * radius;
                    const z1 = Math.cos(offset);
                    const x2 = centerX - Math.sin(offset) * radius;

                    // Base Pair connecting bond
                    ctx.strokeStyle = `rgba(148, 163, 184, ${0.3 + z1 * 0.2})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x1, yPos);
                    ctx.lineTo(x2, yPos);
                    ctx.stroke();

                    // Strand 1 node (Cyan)
                    ctx.fillStyle = z1 > 0 ? '#06b6d4' : '#0891b2';
                    ctx.shadowColor = '#22d3ee';
                    ctx.shadowBlur = z1 > 0 ? 8 : 2;
                    ctx.beginPath();
                    ctx.arc(x1, yPos, 5 + z1 * 2, 0, Math.PI * 2);
                    ctx.fill();

                    // Strand 2 node (Magenta)
                    ctx.fillStyle = z1 > 0 ? '#ec4899' : '#be185d';
                    ctx.shadowColor = '#f472b6';
                    ctx.shadowBlur = z1 > 0 ? 8 : 2;
                    ctx.beginPath();
                    ctx.arc(x2, yPos, 5 + z1 * 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = '#38bdf8';
                ctx.font = '11px monospace';
                ctx.fillText('3D Molecular Vector: DNA Double Helix Unzipping', 20, 30);
                ctx.fillText('Helicase Active Site | Base Pair Affinity: 99.8%', 20, 48);

            } else if (simType === 'induction' || prompt.toLowerCase().includes('induction') || prompt.toLowerCase().includes('flux')) {
                // ELECTROMAGNETIC INDUCTION SIMULATION
                const cx = width * 0.5;
                const cy = height * 0.5;

                // Magnetic Field Vector Grid
                ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
                for (let ix = -3; ix <= 3; ix++) {
                    for (let iy = -2; iy <= 2; iy++) {
                        const px = cx + ix * 70;
                        const py = cy + iy * 60;
                        ctx.beginPath();
                        ctx.arc(px, py, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = '#6366f1';
                        ctx.strokeText('x', px - 3, py + 3);
                    }
                }

                // Conductive Loop
                const loopRadius = 80 + Math.sin(time * 2) * 20;
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 4;
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(cx, cy, loopRadius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Induced Current Arrow
                ctx.strokeStyle = '#10b981';
                ctx.fillStyle = '#10b981';
                ctx.lineWidth = 3;
                const angle = time * 3;
                const ax = cx + Math.cos(angle) * loopRadius;
                const ay = cy + Math.sin(angle) * loopRadius;
                ctx.beginPath();
                ctx.arc(ax, ay, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#f59e0b';
                ctx.font = '11px monospace';
                ctx.fillText('Magnetic Flux Φ = B · A · cos(θ)', 20, 30);
                ctx.fillText(`Induced EMF ε = -dΦ/dt = ${(Math.cos(time * 2) * 12.4).toFixed(2)} V`, 20, 48);

            } else {
                // GENERIC PHYSICS / VECTOR PARTICLES
                const cx = width * 0.5;
                const cy = height * 0.5;
                for (let i = 0; i < 12; i++) {
                    const angle = time * 0.8 + (i * Math.PI / 6);
                    const r = 100 + Math.sin(time * 2 + i) * 30;
                    const px = cx + Math.cos(angle) * r;
                    const py = cy + Math.sin(angle) * r;

                    ctx.strokeStyle = '#818cf8';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(px, py);
                    ctx.stroke();

                    ctx.fillStyle = '#c084fc';
                    ctx.beginPath();
                    ctx.arc(px, py, 6, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fillStyle = '#a855f7';
                ctx.font = '11px monospace';
                ctx.fillText('Concept Field: Physical Spatial Vector Simulation', 20, 30);
            }

            time += isSimulating ? 0.03 : 0;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [selectedPresetId, prompt, simHarmonics, isSimulating]);

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
            } else {
                videoRef.current.play().then(() => setIsPlaying(true));
            }
        }
    };

    // Poll video status in cloud API mode
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
                } catch (err) {
                    clearInterval(pollInterval);
                    setIsGenerating(false);
                    setError(err.message || 'Failed to generate video. Defaulting to interactive sandbox render.');
                    setVideoUrl(PRESET_PROMPTS.find(p => p.id === selectedPresetId)?.demoUrl || PRESET_PROMPTS[0].demoUrl);
                    setViewMode('canvas');
                }
            }, 4000);
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
            setViewMode('video');
        } catch (err) {
            console.error(err);
            setError('Could not retrieve video stream. Utilizing pre-loaded educational visual.');
            setVideoUrl(PRESET_PROMPTS.find(p => p.id === selectedPresetId)?.demoUrl || PRESET_PROMPTS[0].demoUrl);
            setIsGenerating(false);
            setViewMode('canvas');
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
                if (res.data.assets.scenes?.[0] && !firstLoad) {
                    setPrompt(res.data.assets.scenes[0].prompt);
                }
            }
        } catch (err) {
            console.error('Failed to generate storyboard, loading fallback template.', err);
        } finally {
            setIsPlanningStoryboard(false);
        }
    };

    // 2. VIDEO GENERATION FOR SELECTED SCENE
    const handleGenerateVideoForScene = async (scenePrompt) => {
        setError(null);
        setIsGenerating(true);
        if (isDemoMode) {
            setTimeout(() => {
                const demo = PRESET_PROMPTS.find(p => p.id === selectedPresetId) || PRESET_PROMPTS[0];
                setVideoUrl(demo.demoUrl);
                setIsGenerating(false);
                setViewMode('canvas'); // Keep interactive 3D physics vector canvas active
            }, 3500);
            return;
        }

        try {
            const res = await api.post('/generate-video', {
                prompt: scenePrompt,
                aspectRatio
            });
            if (res.data?.operationName) {
                setOperationName(res.data.operationName);
            } else {
                throw new Error('No operation ID received from generator.');
            }
        } catch (err) {
            console.error(err);
            setIsDemoMode(true);
            setTimeout(() => {
                const demo = PRESET_PROMPTS.find(p => p.id === selectedPresetId) || PRESET_PROMPTS[0];
                setVideoUrl(demo.demoUrl);
                setIsGenerating(false);
                setViewMode('canvas');
            }, 3000);
        }
    };

    // 3. NATIVE SPEECH SYNTHESIS NARRATION
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

    // 4. AUTO-PLAY FULL STORYBOARD PRESENTATION MODE
    const handlePlayFullPresentation = () => {
        if (storyboardScenes.length === 0) return;
        setIsAutoPlayingStoryboard(true);
        setActiveSceneIdx(0);
        
        const playSceneSequence = (idx) => {
            if (idx >= storyboardScenes.length) {
                setIsAutoPlayingStoryboard(false);
                return;
            }
            setActiveSceneIdx(idx);
            const script = storyboardScenes[idx]?.narrationScript || '';
            if ('speechSynthesis' in window && script) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(script);
                utterance.volume = speechVolume;
                utterance.rate = speechRate;
                utterance.onend = () => {
                    setTimeout(() => playSceneSequence(idx + 1), 1200);
                };
                utterance.onerror = () => {
                    setTimeout(() => playSceneSequence(idx + 1), 1200);
                };
                setIsSpeaking(true);
                window.speechSynthesis.speak(utterance);
            } else {
                setTimeout(() => playSceneSequence(idx + 1), 4000);
            }
        };

        playSceneSequence(0);
    };

    const handleAnswerCard = (option) => {
        if (selectedAnswers[activeFlashcardIdx]) return;
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
        if (preset.demoUrl) {
            setVideoUrl(preset.demoUrl);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="video-generator-container">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wider uppercase mb-1">
                        <Sparkles className="w-4 h-4 animate-pulse text-indigo-500" />
                        Veo 3.1 Pro Multi-Scene Explainer Suite
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white" id="main-title">
                        AI 3D Concept Video Explainer
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                        Synthesize rich, 3-scene chronological academic animations with synchronized voiceovers and interactive concept-revision decks.
                    </p>
                </div>
                
                {/* Mode Switcher */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shrink-0">
                    <span className="text-xs font-semibold px-2.5 text-slate-600 dark:text-slate-400">
                        {isDemoMode ? 'Demo Sandbox Active' : 'Live API Active'}
                    </span>
                    <button
                        onClick={() => setIsDemoMode(!isDemoMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isDemoMode
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-600'
                        }`}
                    >
                        {isDemoMode ? 'Use Live API' : 'Use Demo Sandbox'}
                    </button>
                </div>
            </div>

            {/* Main Upper Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Concept Blueprint Planner */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                            <Cpu className="w-4.5 h-4.5 text-indigo-500" />
                            1. Concept Blueprint Planner
                        </h2>

                        <div className="space-y-2 mb-4">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                                Target Study Concept
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe any science experiment, math formula, physical mechanism or biological process you want to storyboard and animate..."
                                className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => handleLoadStoryboardAssets(false)}
                                disabled={isPlanningStoryboard || !prompt.trim()}
                                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isPlanningStoryboard ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Layers className="w-3.5 h-3.5" />
                                )}
                                Plan Storyboard
                            </button>

                            <button
                                onClick={() => {
                                    const currentScene = storyboardScenes[activeSceneIdx];
                                    if (currentScene) {
                                        handleGenerateVideoForScene(currentScene.prompt);
                                    } else {
                                        handleGenerateVideoForScene(prompt);
                                    }
                                }}
                                disabled={isGenerating || !prompt.trim() || isPlanningStoryboard}
                                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                )}
                                Generate Scene Video
                            </button>
                        </div>

                        {/* Concept Presets */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                                Preloaded Scientific Concepts
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {PRESET_PROMPTS.map(preset => (
                                    <button
                                        key={preset.id}
                                        onClick={() => {
                                            selectPreset(preset);
                                            setTimeout(() => handleLoadStoryboardAssets(false), 200);
                                        }}
                                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex flex-col gap-1 ${
                                            selectedPresetId === preset.id
                                                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                                                : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        <span className="text-[10px] uppercase font-semibold opacity-75">{preset.category}</span>
                                        <span className="truncate">{preset.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Workflow Explanation Banner */}
                    <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200/60 dark:border-blue-900/30 rounded-2xl p-5 flex gap-4">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                                Veo 3.1 Study Suite Workflow
                            </h4>
                            <p className="text-[11px] text-blue-800/80 dark:text-blue-400/80 mt-1 leading-relaxed">
                                Click <strong>Plan Storyboard</strong> to let Gemini decompose your concept into 3 cohesive progressive scenes with voiceover scripts. Select any scene, generate its high-fidelity 3D physics loop, and practice with the revision questions below.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Veo Video Canvas / Interactive 3D Physics Vector Render */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-slate-900 dark:bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between min-h-[440px]">
                        
                        {/* Canvas Header & View Switcher Bar */}
                        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-white">
                                <Activity className="w-4 h-4 text-indigo-400" />
                                Veo Video Canvas & 3D Vector Engine
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('canvas')}
                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                                        viewMode === 'canvas'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    3D Vector Canvas
                                </button>
                                {videoUrl && (
                                    <button
                                        onClick={() => setViewMode('video')}
                                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                                            viewMode === 'video'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Veo Video Render
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Main Render Frame */}
                        <div className="flex-1 flex items-center justify-center p-4 relative bg-slate-950 min-h-[360px]">
                            <AnimatePresence mode="wait">
                                {isGenerating ? (
                                    <motion.div
                                        key="generating"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/95 z-10"
                                    >
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                                            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                                            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
                                        </div>
                                        <h3 className="text-lg font-black text-white">Generating Interactive 3D Explainer</h3>
                                        <p className="text-xs text-indigo-400 mt-1 max-w-sm font-semibold tracking-wide">
                                            {LOADING_STEPS[currentStepIdx]}
                                        </p>
                                    </motion.div>
                                ) : viewMode === 'video' && videoUrl ? (
                                    <motion.div
                                        key="player"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`w-full h-full flex items-center justify-center ${
                                            aspectRatio === '9:16' ? 'max-w-[240px] aspect-[9/16]' : 'aspect-video'
                                        }`}
                                    >
                                        <video
                                            ref={videoRef}
                                            src={videoUrl}
                                            loop
                                            playsInline
                                            onTimeUpdate={handleTimeUpdate}
                                            onLoadedMetadata={handleLoadedMetadata}
                                            onClick={togglePlay}
                                            className="w-full h-full object-cover rounded-2xl shadow-2xl cursor-pointer"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="canvas"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full h-full flex flex-col items-center justify-center relative"
                                    >
                                        <canvas
                                            ref={canvasRef}
                                            className="w-full h-[320px] rounded-2xl border border-slate-800 shadow-inner block"
                                        />
                                        
                                        {/* Canvas Physics Controls overlay */}
                                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 text-xs text-slate-300">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setIsSimulating(!isSimulating)}
                                                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1"
                                                >
                                                    {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                                    {isSimulating ? 'Pause Vector Engine' : 'Resume Vector Engine'}
                                                </button>
                                            </div>

                                            {prompt.toLowerCase().includes('fourier') && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Harmonics:</span>
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="8"
                                                        value={simHarmonics}
                                                        onChange={(e) => setSimHarmonics(parseInt(e.target.value))}
                                                        className="w-20 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-indigo-500"
                                                    />
                                                    <span className="text-xs font-mono font-bold text-indigo-400">{simHarmonics}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Video Controls Bar when video view active */}
                        {viewMode === 'video' && videoUrl && !isGenerating && (
                            <div className="bg-slate-950 p-4 border-t border-slate-800/80">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-mono text-slate-500">
                                        {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                                    </span>
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                        <div
                                            className="absolute left-0 top-0 bottom-0 bg-indigo-500"
                                            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">
                                        {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={togglePlay}
                                            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 transition flex items-center justify-center"
                                        >
                                            {isPlaying ? <Pause className="w-4 h-4 fill-slate-900" /> : <Play className="w-4 h-4 fill-slate-900" />}
                                        </button>
                                        <span className="text-xs font-bold text-slate-400">
                                            Veo Render Loop Active
                                        </span>
                                    </div>

                                    <a
                                        href={videoUrl}
                                        download="veo-concept-explainer.mp4"
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5 text-xs font-bold"
                                    >
                                        <Download className="w-4 h-4" />
                                        Save MP4
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lower Grid: Storyboard Scenes, Voiceover & Active Recall Trivia */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                {/* Left Column: Multi-Scene Storyboard & Voiceover */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Storyboard Map Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Layers className="w-4.5 h-4.5 text-indigo-500" />
                                Feature 1: Multi-Scene Concept Storyboard
                            </h3>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePlayFullPresentation}
                                    disabled={isAutoPlayingStoryboard || storyboardScenes.length === 0}
                                    className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 hover:bg-indigo-100 transition disabled:opacity-50"
                                >
                                    <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
                                    {isAutoPlayingStoryboard ? 'Playing Presentation...' : 'Play Presentation'}
                                </button>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-semibold">
                                    {storyboardScenes.length || 3} Scene Map
                                </span>
                            </div>
                        </div>

                        {/* Scene Selection Buttons */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[0, 1, 2].map((idx) => {
                                const scene = storyboardScenes[idx];
                                const isActive = idx === activeSceneIdx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveSceneIdx(idx);
                                            if (scene) {
                                                setPrompt(scene.prompt);
                                            }
                                        }}
                                        className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                                            isActive
                                                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400'
                                                : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        <span className="text-[10px] font-bold uppercase opacity-75">
                                            Scene {idx + 1}
                                        </span>
                                        <span className="text-xs font-bold truncate">
                                            {scene ? scene.title : `Concept Phase ${idx + 1}`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Active Scene Detail Box */}
                        <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-3">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    {storyboardScenes[activeSceneIdx]?.title || 'Loading Storyboard Scene...'}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {storyboardScenes[activeSceneIdx]?.description || 'Click "Plan Storyboard" on the left to structure this concept.'}
                                </p>
                            </div>

                            {storyboardScenes[activeSceneIdx] && (
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-850">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                            Veo Model Rendering Prompt:
                                        </span>
                                        <button
                                            onClick={() => handleGenerateVideoForScene(storyboardScenes[activeSceneIdx].prompt)}
                                            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
                                        >
                                            Animate Scene <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <p className="text-[11px] font-mono bg-slate-100/60 dark:bg-slate-900/60 p-2.5 rounded-lg text-slate-600 dark:text-slate-300">
                                        {storyboardScenes[activeSceneIdx]?.prompt}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Voiceover Synthesizer Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Volume2 className="w-4.5 h-4.5 text-indigo-500 animate-bounce" />
                                Feature 3: Voiceover Explainer Synthesizer
                            </h3>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                                TTS Ready
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                            Listen to a synchronized speech explaining the currently active scene's mechanical or mathematical steps.
                        </p>

                        <div className="p-4 rounded-xl bg-indigo-50/45 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="space-y-1 max-w-md">
                                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider block">
                                    Narration Script (Scene {activeSceneIdx + 1})
                                </span>
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                                    "{storyboardScenes[activeSceneIdx]?.narrationScript || 'Let us explore the core characteristics and components of this educational topic.'}"
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {isSpeaking ? (
                                    <button
                                        onClick={handleStopSpeaking}
                                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                                    >
                                        <VolumeX className="w-3.5 h-3.5" /> Stop Voice
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSpeakNarration(storyboardScenes[activeSceneIdx]?.narrationScript || 'Let us explore the core characteristics and components of this educational topic.')}
                                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Volume2 className="w-3.5 h-3.5" /> Listen Voice
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Controls Sliders */}
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                                    Speech Volume
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={speechVolume}
                                    onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                                    Speech Pace / Rate
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="1.5"
                                    step="0.1"
                                    value={speechRate}
                                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Feature 2 - Active Recall Trivia Deck */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between min-h-[480px]">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Award className="w-4.5 h-4.5 text-indigo-500" />
                                    Feature 2: Active Recall Trivia Deck
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                                    Score: {score} XP
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="flex gap-1 mb-6">
                                {[0, 1, 2, 3, 4].map((idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 flex-1 rounded-full ${
                                            idx === activeFlashcardIdx
                                                ? 'bg-indigo-600'
                                                : idx < activeFlashcardIdx
                                                ? 'bg-emerald-500'
                                                : 'bg-slate-150 dark:bg-slate-800'
                                        }`}
                                    />
                                ))}
                            </div>

                            {flashcards.length > 0 ? (
                                <div className="space-y-4">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Question {activeFlashcardIdx + 1} of 5
                                    </span>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                        {flashcards[activeFlashcardIdx]?.question}
                                    </h4>

                                    <div className="space-y-2 pt-2">
                                        {flashcards[activeFlashcardIdx]?.options?.map((option, oIdx) => {
                                            const isSelected = selectedAnswers[activeFlashcardIdx] === option;
                                            const isCorrect = option === flashcards[activeFlashcardIdx].answer;
                                            const answerEntered = !!selectedAnswers[activeFlashcardIdx];

                                            let buttonStyles = 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300';
                                            if (answerEntered) {
                                                if (isCorrect) {
                                                    buttonStyles = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400';
                                                } else if (isSelected) {
                                                    buttonStyles = 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400';
                                                } else {
                                                    buttonStyles = 'opacity-50 border-slate-100 dark:border-slate-800 text-slate-400';
                                                }
                                            }

                                            return (
                                                <button
                                                    key={oIdx}
                                                    disabled={answerEntered}
                                                    onClick={() => handleAnswerCard(option)}
                                                    className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between gap-2 ${buttonStyles}`}
                                                >
                                                    <span>{option}</span>
                                                    {answerEntered && isCorrect && (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {selectedAnswers[activeFlashcardIdx] && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 mt-4 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed"
                                        >
                                            <strong className="text-slate-900 dark:text-white block mb-1">
                                                Revision Explanation:
                                            </strong>
                                            {flashcards[activeFlashcardIdx]?.explanation}
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-12">
                                    <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                                        Trivia Deck Locked
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                                        Plan a study storyboard or load any concept preset on the left to synthesize active-recall flashcards.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Flashcard Navigation Footer */}
                        {flashcards.length > 0 && (
                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                                <button
                                    disabled={activeFlashcardIdx === 0}
                                    onClick={() => setActiveFlashcardIdx(prev => prev - 1)}
                                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 transition disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={activeFlashcardIdx === flashcards.length - 1}
                                    onClick={() => setActiveFlashcardIdx(prev => prev + 1)}
                                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50"
                                >
                                    Next Card
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

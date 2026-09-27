import React, { useState, useEffect, useRef } from 'react';
import {
    X, Play, Pause, RotateCcw, Volume2, VolumeX,
    CheckCircle2, Sparkles, Brain, Clock, Zap,
    BookOpen, Award, ArrowUpRight, Flame, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAppStore } from '../../store/useAppStore';

// Synthesize ambient sounds cleanly via Web Audio API without needing external MP3s
class AmbientSoundGenerator {
    constructor() {
        this.ctx = null;
        this.nodes = [];
        this.gainNode = null;
        this.isPlaying = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(soundType = 'alpha') {
        this.stop();
        this.init();
        if (!this.ctx) return;

        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);

        if (soundType === 'alpha') {
            // Binaural Alpha waves (~432Hz with 10Hz beat)
            const oscL = this.ctx.createOscillator();
            const oscR = this.ctx.createOscillator();
            oscL.type = 'sine';
            oscR.type = 'sine';
            oscL.frequency.setValueAtTime(432, this.ctx.currentTime);
            oscR.frequency.setValueAtTime(442, this.ctx.currentTime); // 10Hz alpha wave difference

            const merger = this.ctx.createChannelMerger(2);
            oscL.connect(merger, 0, 0);
            oscR.connect(merger, 0, 1);
            merger.connect(this.gainNode);

            oscL.start();
            oscR.start();
            this.nodes = [oscL, oscR, merger];
        } else if (soundType === 'rain') {
            // Pink/Soft noise simulation
            const bufferSize = this.ctx.sampleRate * 2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);

            noise.connect(filter);
            filter.connect(this.gainNode);
            noise.start();
            this.nodes = [noise, filter];
        } else if (soundType === 'whitenoise') {
            const bufferSize = this.ctx.sampleRate * 2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.15;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            noise.connect(this.gainNode);
            noise.start();
            this.nodes = [noise];
        }
        this.isPlaying = true;
    }

    stop() {
        this.nodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {
                // ignore
            }
        });
        this.nodes = [];
        this.isPlaying = false;
    }
}

const ambientAudio = new AmbientSoundGenerator();

export const FocusStudyRoomModal = ({ isOpen, onClose, task, dayNumber, onTaskCompleted }) => {
    const { addToast } = useAppStore();
    const [selectedDuration, setSelectedDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [soundMode, setSoundMode] = useState('alpha'); // 'off' | 'alpha' | 'rain' | 'whitenoise'
    const [completedLogged, setCompletedLogged] = useState(false);
    const [loggedMinutes, setLoggedMinutes] = useState(0);

    const timerRef = useRef(null);

    // Initialize timer when task or duration changes
    useEffect(() => {
        if (isOpen && task) {
            const initialMins = task.durationMinutes || 25;
            setSelectedDuration(initialMins);
            setTimeLeft(initialMins * 60);
            setIsRunning(false);
            setCompletedLogged(false);
            setLoggedMinutes(0);
        }
    }, [isOpen, task]);

    // Timer tick interval
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setIsRunning(false);
                        handleFinishSession(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, timeLeft]);

    // Sound manager
    useEffect(() => {
        if (isRunning && soundMode !== 'off') {
            ambientAudio.play(soundMode);
        } else {
            ambientAudio.stop();
        }
        return () => {
            ambientAudio.stop();
        };
    }, [isRunning, soundMode]);

    if (!isOpen || !task) return null;

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleToggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const handleResetTimer = () => {
        setIsRunning(false);
        setTimeLeft(selectedDuration * 60);
    };

    const handleSelectDurationPreset = (mins) => {
        setSelectedDuration(mins);
        setTimeLeft(mins * 60);
        setIsRunning(false);
    };

    const handleFinishSession = async (autoFinished = false) => {
        const spentSeconds = selectedDuration * 60 - timeLeft;
        const minutesToLog = Math.max(1, Math.round(spentSeconds / 60));
        
        try {
            const res = await api.post('/study-plan/log-focus-session', {
                taskId: task.id,
                minutesFocused: minutesToLog,
                topicName: task.topicName,
                markTaskCompleted: true
            });
            setCompletedLogged(true);
            setLoggedMinutes(minutesToLog);
            if (onTaskCompleted) {
                onTaskCompleted(task.id, res.data?.studyPlan);
            }
        } catch (err) {
            console.error('Focus session log error:', err);
        }
    };

    const totalSeconds = selectedDuration * 60;
    const progressPercent = Math.min(100, Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100));

    return (
        <div id="focus-study-room-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div 
                id="focus-study-room-card" 
                className="relative w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            <Brain className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                                    Day {dayNumber || 1} Focus Study Session
                                </span>
                                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-400">
                                    +30 XP / Session
                                </span>
                            </div>
                            <h2 className="text-base font-extrabold text-white">
                                {task.topicName}
                            </h2>
                        </div>
                    </div>
                    <button 
                        id="close-focus-room-btn"
                        onClick={() => {
                            ambientAudio.stop();
                            onClose();
                        }}
                        className="rounded-xl border border-slate-700 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Main Study Core */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    {/* Active Timer Display */}
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-800/60 to-slate-900/80 p-8 relative overflow-hidden">
                        {/* Progress ring background */}
                        <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none" />

                        {/* Presets */}
                        <div className="flex items-center gap-2 mb-6 z-10">
                            {[
                                { label: '25m Pomodoro', val: 25 },
                                { label: '50m Deep Work', val: 50 },
                                { label: '90m Ultradian', val: 90 },
                                { label: '15m Quick Drill', val: 15 }
                            ].map((preset) => (
                                <button
                                    key={preset.val}
                                    type="button"
                                    onClick={() => handleSelectDurationPreset(preset.val)}
                                    className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                                        selectedDuration === preset.val
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {/* Giant Digital Clock */}
                        <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white mb-2 z-10">
                            {formatTime(timeLeft)}
                        </div>

                        <p className="text-xs text-slate-400 font-medium mb-6 z-10 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {isRunning ? 'Focused Deep Study in Progress…' : 'Timer Paused / Ready to Start'}
                        </p>

                        {/* Timer Controls */}
                        <div className="flex items-center gap-3 z-10">
                            <button
                                id="toggle-focus-timer-btn"
                                type="button"
                                onClick={handleToggleTimer}
                                className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold shadow-lg transition-all active:scale-95 cursor-pointer ${
                                    isRunning
                                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                                }`}
                            >
                                {isRunning ? (
                                    <>
                                        <Pause className="w-4 h-4 fill-slate-950" />
                                        Pause Session
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-white" />
                                        Start Focus Study
                                    </>
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleResetTimer}
                                title="Reset timer"
                                className="rounded-2xl border border-slate-700 bg-slate-800 p-3 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Ambient Sound Switcher */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 z-10 pt-4 border-t border-slate-800/80 w-full">
                            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                                <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Focus Sound:
                            </span>
                            {[
                                { id: 'alpha', label: 'Alpha Waves (432Hz)' },
                                { id: 'rain', label: 'Soft Rain' },
                                { id: 'whitenoise', label: 'White Noise' },
                                { id: 'off', label: 'Muted' }
                            ].map((snd) => (
                                <button
                                    key={snd.id}
                                    type="button"
                                    onClick={() => setSoundMode(snd.id)}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                                        soundMode === snd.id
                                            ? 'bg-indigo-950 border border-indigo-500 text-indigo-300'
                                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    {snd.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Task Objectives & Extracted Cheat Formulas */}
                    <div className="space-y-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                                <Target className="w-3.5 h-3.5" /> Session Objective
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed font-medium">
                                {task.taskObjective || `Study core theoretical derivations for ${task.topicName}, solve 10 standard test series drill questions, and review mistake analysis.`}
                            </p>
                        </div>

                        {task.extractedCheatNotes && (
                            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                                    <Sparkles className="w-3.5 h-3.5" /> High-Yield Formula / Shortcut Key
                                </div>
                                <p className="text-xs text-amber-200 font-mono leading-relaxed">
                                    {task.extractedCheatNotes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Target Question Practice Quick Action */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">Ready for Active Recall Drill?</h4>
                                <p className="text-[11px] text-indigo-300">
                                    Practice {task.targetQuestionsCount || 10} targeted questions on {task.topicName} with real-time feedback
                                </p>
                            </div>
                        </div>
                        <Link
                            to={`/practice?mode=topic&topicId=${task.topicId}`}
                            onClick={() => {
                                ambientAudio.stop();
                                onClose();
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md transition whitespace-nowrap"
                        >
                            <span>Launch Drill</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Completed Toast message */}
                    {completedLogged && (
                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-emerald-300">
                                    Session logged successfully! ({loggedMinutes} minutes focus time recorded)
                                </p>
                                <p className="text-[11px] text-emerald-400/80">
                                    Task marked as complete · +{Math.round(loggedMinutes * 1.5) + 25} XP added to your profile!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-900/90">
                    <button
                        type="button"
                        onClick={() => {
                            ambientAudio.stop();
                            onClose();
                        }}
                        className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        Minimize
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => handleFinishSession(false)}
                        disabled={completedLogged}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-5 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{completedLogged ? 'Task Completed' : 'Complete & Mark Done (+XP)'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Swords, Trophy, Clock, Flame, ArrowRight, RotateCcw, CheckCircle2, X, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SPEED_DUEL_QUESTIONS } from '../data/featureHubData';
const OPPONENT_POOL = [
    { id: 'bot-1', name: 'Priya Nair', avatar: 'PN', score: 0, correctAnswers: 0, currentStreak: 4, avgTimePerQuestion: 6.2, isBot: true },
    { id: 'bot-2', name: 'Arjun Verma', avatar: 'AV', score: 0, correctAnswers: 0, currentStreak: 8, avgTimePerQuestion: 4.8, isBot: true },
    { id: 'bot-3', name: 'Rohan Gupta', avatar: 'RG', score: 0, correctAnswers: 0, currentStreak: 3, avgTimePerQuestion: 7.1, isBot: true },
    { id: 'bot-4', name: 'Sneha Patil', avatar: 'SP', score: 0, correctAnswers: 0, currentStreak: 6, avgTimePerQuestion: 5.5, isBot: true }
];
export const SpeedDuelPage = () => {
    const { user, duelWins, duelLosses, duelHistory, recordDuelOutcome } = useAppStore();
    // Match states: 'lobby' | 'matching' | 'playing' | 'round_result' | 'match_summary'
    const [matchState, setMatchState] = useState('lobby');
    const [opponent, setOpponent] = useState(OPPONENT_POOL[0]);
    const [currentRound, setCurrentRound] = useState(0); // 0 to 4 (5 questions)
    const [questions, setQuestions] = useState([]);
    const [timeLeft, setTimeLeft] = useState(15);
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [mySelectedAnswer, setMySelectedAnswer] = useState(null);
    const [opponentSelectedAnswer, setOpponentSelectedAnswer] = useState(null);
    const [roundStats, setRoundStats] = useState([]);
    const timerRef = useRef(null);
    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, []);
    // Timer loop during 'playing'
    useEffect(() => {
        if (matchState !== 'playing') {
            if (timerRef.current)
                clearInterval(timerRef.current);
            return;
        }
        setTimeLeft(15);
        setMySelectedAnswer(null);
        setOpponentSelectedAnswer(null);
        // Simulate opponent answering after random 3 to 10 seconds
        const opponentAnswerDelay = Math.floor(Math.random() * 6000) + 3000;
        const opponentCorrectChance = Math.random() > 0.3; // 70% accuracy
        const currentQ = questions[currentRound];
        const oppTimeout = setTimeout(() => {
            if (matchState === 'playing') {
                const choice = opponentCorrectChance
                    ? currentQ.correctIndex
                    : (currentQ.correctIndex + 1) % currentQ.options.length;
                setOpponentSelectedAnswer(choice);
            }
        }, opponentAnswerDelay);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeExpire();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            clearTimeout(oppTimeout);
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [matchState, currentRound]);
    const handleStartMatchmaking = () => {
        setMatchState('matching');
        const randomOpp = OPPONENT_POOL[Math.floor(Math.random() * OPPONENT_POOL.length)];
        setOpponent(randomOpp);
        // Pick 5 random questions
        const shuffled = [...SPEED_DUEL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestions(shuffled);
        setCurrentRound(0);
        setMyScore(0);
        setOpponentScore(0);
        setRoundStats([]);
        setTimeout(() => {
            setMatchState('playing');
        }, 2200);
    };
    const handleSelectAnswer = (optionIdx) => {
        if (mySelectedAnswer !== null || matchState !== 'playing')
            return;
        setMySelectedAnswer(optionIdx);
        const timeTaken = 15 - timeLeft;
        const currentQ = questions[currentRound];
        const isCorrect = optionIdx === currentQ.correctIndex;
        // Base 100 points + speed bonus up to 50
        const points = isCorrect ? 100 + Math.max(0, Math.round(timeLeft * 3.33)) : 0;
        setMyScore(prev => prev + points);
        // Opponent score logic
        const oppCorrect = opponentSelectedAnswer !== null ? opponentSelectedAnswer === currentQ.correctIndex : Math.random() > 0.35;
        const oppTime = Math.floor(Math.random() * 8) + 4;
        const oppPoints = oppCorrect ? 100 + Math.max(0, Math.round((15 - oppTime) * 3)) : 0;
        setOpponentScore(prev => prev + oppPoints);
        setRoundStats(prev => [
            ...prev,
            {
                round: currentRound + 1,
                myCorrect: isCorrect,
                myTime: timeTaken,
                myPoints: points,
                oppCorrect,
                oppTime,
                oppPoints
            }
        ]);
        // Transition to round result
        if (timerRef.current)
            clearInterval(timerRef.current);
        setMatchState('round_result');
    };
    const handleTimeExpire = () => {
        if (mySelectedAnswer === null) {
            const currentQ = questions[currentRound];
            const oppCorrect = Math.random() > 0.4;
            const oppPoints = oppCorrect ? 110 : 0;
            setOpponentScore(prev => prev + oppPoints);
            setRoundStats(prev => [
                ...prev,
                {
                    round: currentRound + 1,
                    myCorrect: false,
                    myTime: 15,
                    myPoints: 0,
                    oppCorrect,
                    oppTime: 8,
                    oppPoints
                }
            ]);
            setMatchState('round_result');
        }
    };
    const handleProceedNextRound = () => {
        if (currentRound < questions.length - 1) {
            setCurrentRound(prev => prev + 1);
            setMatchState('playing');
        }
        else {
            // Duel finished!
            const isWin = myScore >= opponentScore;
            const xpEarned = isWin ? 120 : 40;
            recordDuelOutcome(isWin, myScore, opponentScore, opponent.name, xpEarned);
            setMatchState('match_summary');
        }
    };
    const totalMatches = duelWins + duelLosses;
    const winRate = totalMatches > 0 ? Math.round((duelWins / totalMatches) * 100) : 0;
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800", children: [_jsxs("div", { children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-slate-800 dark:text-amber-300 text-xs font-semibold mb-2", children: [_jsx(Swords, { className: "w-3.5 h-3.5" }), "Live 1v1 Competitive Sprint Arena"] }), _jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white", children: "1v1 Speed Duel Arena" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl", children: "Test your speed, accuracy, and adrenaline resistance against peer aspirants in 5-question rapid sprints with strict 15-second countdowns." })] }), matchState === 'lobby' && (_jsxs("button", { onClick: handleStartMatchmaking, className: "px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4 fill-white" }), "Find Live Opponent (+120 XP)"] }))] }), matchState === 'lobby' && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md", children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME' }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-base text-slate-900 dark:text-white", children: user?.name || 'Aspirant Challenger' }), _jsx("p", { className: "text-xs text-slate-500", children: "Tier: Gold Division \u2022 AIR #42" }), _jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs text-amber-600 font-semibold", children: [_jsx(Flame, { className: "w-3.5 h-3.5 fill-amber-500 text-amber-500" }), _jsxs("span", { children: [user?.streakDays || 7, " Days Active Streak"] })] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [_jsxs("div", { className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsx("span", { className: "text-slate-400", children: "Wins" }), _jsx("p", { className: "text-lg font-extrabold text-emerald-600 mt-0.5", children: duelWins })] }), _jsxs("div", { className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsx("span", { className: "text-slate-400", children: "Losses" }), _jsx("p", { className: "text-lg font-extrabold text-rose-600 mt-0.5", children: duelLosses })] }), _jsxs("div", { className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsx("span", { className: "text-slate-400", children: "Win Rate" }), _jsxs("p", { className: "text-lg font-extrabold text-blue-600 mt-0.5", children: [winRate, "%"] })] })] }), _jsxs("div", { className: "p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-2 text-blue-900 dark:text-blue-200", children: [_jsxs("span", { className: "font-bold flex items-center gap-1.5", children: [_jsx(Trophy, { className: "w-4 h-4 text-amber-500" }), " Scoring Rules:"] }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-[11px] text-blue-800 dark:text-blue-300", children: [_jsx("li", { children: "+100 base points for each correct answer" }), _jsx("li", { children: "Up to +50 bonus points for ultra-fast response speed" }), _jsx("li", { children: "0 points for wrong answer or timeout" }), _jsx("li", { children: "Winner earns +120 XP, +1 Win Record, and Leaderboard rank boost" })] })] })] }), _jsxs("div", { className: "p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 flex flex-col justify-between shadow-xl space-y-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("span", { className: "px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold inline-flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " Daily Speed Arena"] }), _jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight", children: "Ready for a 5-Round Speed Sprint?" }), _jsx("p", { className: "text-xs text-slate-300 leading-relaxed", children: "Sharpen your calculation reflexes under pressure. Questions test Speed Math tricks, Reasoning syllogisms, Polity articles, and English vocab." })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: handleStartMatchmaking, className: "w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5", children: [_jsx(Swords, { className: "w-4 h-4" }), " Start Matchmaking Now"] }), _jsx("p", { className: "text-center text-[11px] text-slate-400", children: "Average matchmaking time: ~2 seconds" })] })] }), _jsxs("div", { className: "p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-4 shadow-sm", children: [_jsxs("h3", { className: "font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-slate-400" }), " Recent Arena Duels"] }), _jsx("div", { className: "space-y-3", children: duelHistory.slice(0, 5).map((duel) => (_jsxs("div", { className: "p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs", children: [_jsxs("div", { children: [_jsxs("span", { className: "font-semibold text-slate-800 dark:text-slate-200", children: ["vs ", duel.opponentName] }), _jsx("p", { className: "text-[10px] text-slate-400", children: duel.date })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: `font-bold px-2 py-0.5 rounded text-[10px] ${duel.isWin
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`, children: duel.isWin ? 'VICTORY' : 'DEFEAT' }), _jsxs("p", { className: "text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-0.5", children: [duel.myScore, " - ", duel.opponentScore] })] })] }, duel.id))) })] })] })), matchState === 'matching' && (_jsxs("div", { className: "py-20 text-center space-y-6 max-w-xl mx-auto", children: [_jsxs("div", { className: "relative w-24 h-24 mx-auto", children: [_jsx("div", { className: "absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" }), _jsx("div", { className: "w-full h-full rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center", children: _jsx(Swords, { className: "w-10 h-10 text-blue-600 animate-pulse" }) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-extrabold text-slate-900 dark:text-white", children: "Searching for live aspirant..." }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: "Matching with similar All-India Rank percentile and accuracy tier" })] }), _jsxs("div", { className: "p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-xs mx-auto text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2", children: [_jsxs("span", { children: ["Found: ", _jsx("strong", { className: "text-blue-600 dark:text-blue-400", children: opponent.name })] }), _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200", children: "AIR #31" })] })] })), (matchState === 'playing' || matchState === 'round_result') && questions.length > 0 && (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center", children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME' }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-slate-900 dark:text-white", children: user?.name || 'You' }), _jsxs("p", { className: "text-xl font-extrabold text-blue-600 dark:text-blue-400", children: [myScore, " pts"] })] })] }), _jsxs("div", { className: "text-center", children: [_jsxs("span", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-wider", children: ["Round ", currentRound + 1, " of ", questions.length] }), _jsx("div", { className: "flex items-center justify-center gap-1 mt-0.5", children: _jsxs("div", { className: `w-12 h-12 rounded-full flex items-center justify-center font-mono font-extrabold text-lg border-2 ${timeLeft <= 5
                                                        ? 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/50 animate-pulse'
                                                        : 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-slate-800'}`, children: [timeLeft, "s"] }) })] }), _jsxs("div", { className: "flex items-center gap-3 text-right", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-slate-900 dark:text-white", children: opponent.name }), _jsxs("p", { className: "text-xl font-extrabold text-purple-600 dark:text-purple-400", children: [opponentScore, " pts"] })] }), _jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center", children: opponent.avatar })] })] }), _jsx("div", { className: "grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800", children: questions.map((_, idx) => {
                                    const stat = roundStats[idx];
                                    let color = 'bg-slate-200 dark:bg-slate-800';
                                    if (stat) {
                                        color = stat.myCorrect ? 'bg-emerald-500' : 'bg-rose-500';
                                    }
                                    else if (idx === currentRound) {
                                        color = 'bg-blue-600 animate-pulse';
                                    }
                                    return (_jsx("div", { className: `h-1.5 rounded-full ${color}` }, idx));
                                }) })] }), _jsxs("div", { className: "p-8 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500 dark:text-slate-400", children: [_jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300", children: questions[currentRound].subject }), _jsx("span", { className: "font-mono text-blue-600 font-bold", children: "15s Rapid Clock" })] }), _jsx("h3", { className: "text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed", children: questions[currentRound].question }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2", children: questions[currentRound].options.map((opt, optIdx) => {
                                    const isSelected = mySelectedAnswer === optIdx;
                                    const isCorrect = optIdx === questions[currentRound].correctIndex;
                                    let style = 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-blue-400 dark:bg-slate-800/70 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
                                    if (matchState === 'round_result') {
                                        if (isCorrect) {
                                            style = 'bg-emerald-50 border-emerald-400 text-emerald-900 dark:bg-emerald-950/70 dark:border-emerald-700 dark:text-emerald-200 font-bold';
                                        }
                                        else if (isSelected && !isCorrect) {
                                            style = 'bg-rose-50 border-rose-400 text-rose-900 dark:bg-rose-950/70 dark:border-rose-700 dark:text-rose-200 font-bold';
                                        }
                                    }
                                    else if (isSelected) {
                                        style = 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold';
                                    }
                                    return (_jsxs("button", { disabled: matchState === 'round_result', onClick: () => handleSelectAnswer(optIdx), className: `p-4 rounded-xl border text-left text-sm transition flex items-center justify-between ${style}`, children: [_jsx("span", { children: opt }), matchState === 'round_result' && isCorrect && (_jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600 shrink-0" })), matchState === 'round_result' && isSelected && !isCorrect && (_jsx(X, { className: "w-4 h-4 text-rose-600 shrink-0" }))] }, optIdx));
                                }) }), matchState === 'round_result' && (_jsxs("div", { className: "pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4", children: [_jsxs("div", { className: "p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-1 text-amber-900 dark:text-amber-200", children: [_jsxs("span", { className: "font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5" }), " 10-Second Shortcut Trick:"] }), _jsx("p", { children: questions[currentRound].shortcutTip })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { onClick: handleProceedNextRound, className: "px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-2", children: [currentRound < questions.length - 1 ? 'Next Round' : 'View Duel Summary', " ", _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] }))] })] })), matchState === 'match_summary' && (_jsxs("div", { className: "max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-center space-y-6 shadow-xl", children: [myScore >= opponentScore ? (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center mx-auto mb-3", children: _jsx(Trophy, { className: "w-9 h-9" }) }), _jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400", children: "Victory Achieved!" }), _jsx("h2", { className: "text-3xl font-extrabold text-slate-900 dark:text-white", children: "You Won the Speed Duel!" }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Outstanding speed and accuracy. You defeated ", opponent.name, "!"] })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center mx-auto mb-3", children: _jsx(Swords, { className: "w-9 h-9" }) }), _jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400", children: "Hard Fought Match" }), _jsx("h2", { className: "text-3xl font-extrabold text-slate-900 dark:text-white", children: "Defeat in Round 5" }), _jsxs("p", { className: "text-xs text-slate-500", children: [opponent.name, " pulled ahead with speed bonuses. Good practice!"] })] })), _jsxs("div", { className: "grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [_jsxs("div", { className: "text-center", children: [_jsx("span", { className: "text-xs text-slate-500", children: "Your Score" }), _jsxs("p", { className: "text-2xl font-extrabold text-blue-600", children: [myScore, " pts"] }), _jsxs("span", { className: "text-[11px] text-slate-400", children: [roundStats.filter(r => r.myCorrect).length, "/5 Correct"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "text-xs text-slate-500", children: opponent.name }), _jsxs("p", { className: "text-2xl font-extrabold text-purple-600", children: [opponentScore, " pts"] }), _jsxs("span", { className: "text-[11px] text-slate-400", children: [roundStats.filter(r => r.oppCorrect).length, "/5 Correct"] })] })] }), _jsxs("div", { className: "p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4 fill-emerald-500 text-emerald-500" }), _jsxs("span", { children: ["Reward Awarded: +", myScore >= opponentScore ? 120 : 40, " XP Added to your Profile"] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3 pt-2", children: [_jsxs("button", { onClick: handleStartMatchmaking, className: "px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), " Play Another Duel"] }), _jsx("button", { onClick: () => setMatchState('lobby'), className: "px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-bold text-xs transition", children: "Back to Arena Lobby" })] })] }))] }));
};
export default SpeedDuelPage;

import React, { useState, useEffect } from 'react';
import {
    Brain,
    Zap,
    Target,
    TrendingUp,
    Award,
    Clock,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    BarChart,
    Sliders,
    Layers,
    Cpu,
    RefreshCw,
    HelpCircle,
    ChevronRight,
    Flame
} from 'lucide-react';
import { api } from '../../lib/api';

export const MlPredictiveEngine = ({ user }) => {
    // 1. ML Rank Predictor State
    const [rankInput, setRankInput] = useState({
        targetExamId: user?.targetExamId || 'exam_jee_main',
        accuracyPercent: 74,
        avgSpeedSeconds: 48,
        totalQuestionsAttempted: 120,
        incorrectRatio: 0.22,
        consistencyIndex: 0.88
    });
    const [rankPrediction, setRankPrediction] = useState(null);
    const [loadingRank, setLoadingRank] = useState(false);

    // 2. IRT Latent Trait Ability State
    const [irtAttempts, setIrtAttempts] = useState([
        { isCorrect: true, difficulty: 'easy', discrimination: 1.2 },
        { isCorrect: true, difficulty: 'medium', discrimination: 1.3 },
        { isCorrect: false, difficulty: 'hard', discrimination: 1.5 },
        { isCorrect: true, difficulty: 'medium', discrimination: 1.1 },
        { isCorrect: true, difficulty: 'hard', discrimination: 1.6 }
    ]);
    const [irtResult, setIrtResult] = useState(null);
    const [loadingIrt, setLoadingIrt] = useState(false);

    // 3. Forgetting Curve State
    const [hlrInput, setHlrInput] = useState({
        timesReviewed: 3,
        successes: 4,
        failures: 1,
        daysElapsed: 5
    });
    const [hlrResult, setHlrResult] = useState(null);

    // Run predictions on initial load
    useEffect(() => {
        runRankPrediction();
        runIrtEstimation();
        runHlrCalculation();
    }, []);

    const runRankPrediction = async () => {
        try {
            setLoadingRank(true);
            const res = await api.post('/ml/predict-rank', rankInput);
            if (res.data?.prediction) {
                setRankPrediction(res.data.prediction);
            }
        } catch (err) {
            console.error('Error running ML Rank Predictor:', err);
        } finally {
            setLoadingRank(false);
        }
    };

    const runIrtEstimation = async () => {
        try {
            setLoadingIrt(true);
            const res = await api.post('/ml/estimate-ability', { attempts: irtAttempts });
            if (res.data) {
                setIrtResult(res.data);
            }
        } catch (err) {
            console.error('Error running IRT Ability model:', err);
        } finally {
            setLoadingIrt(false);
        }
    };

    const runHlrCalculation = async () => {
        try {
            const res = await api.post('/ml/forgetting-curve', hlrInput);
            if (res.data?.retentionModel) {
                setHlrResult(res.data.retentionModel);
            }
        } catch (err) {
            console.error('Error running Forgetting Curve model:', err);
        }
    };

    const addIrtAttempt = (isCorrect, difficulty) => {
        const newAttempts = [...irtAttempts, { isCorrect, difficulty, discrimination: 1.3 }];
        setIrtAttempts(newAttempts);
    };

    return (
        <div className="space-y-8">
            {/* Model Architecture Overview Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white border border-indigo-900/50 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-400/30">
                            <Cpu className="h-4 w-4 text-cyan-400" />
                            Production Machine Learning Engine Active
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            Adaptive Intelligence & Statistical Predictors
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                            AspirePrep utilizes 4 live Machine Learning models: <strong>Item Response Theory (IRT 2PL)</strong> for latent trait ability $\theta$, <strong>Gradient-Boosted Rank & Cutoff Predictor</strong>, <strong>Half-Life Memory Decay (HLR)</strong>, and <strong>Weakness Vector Clustering</strong>.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                runRankPrediction();
                                runIrtEstimation();
                                runHlrCalculation();
                            }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-3 shadow-lg transition active:scale-95 cursor-pointer"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Re-run ML Inference
                        </button>
                    </div>
                </div>
            </div>

            {/* Model Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. GRADIENT-BOOSTED RANK & PERCENTILE PREDICTOR */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-md space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white shadow-md">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    Gradient-Boosted Rank & Cutoff Predictor
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Simulate mock test variables to predict All India Rank (AIR) & Cutoff Probability
                                </p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            XGBoost Model
                        </span>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                        <div>
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Target Exam
                            </label>
                            <select
                                value={rankInput.targetExamId}
                                onChange={(e) => setRankInput({ ...rankInput, targetExamId: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold p-2.5 text-slate-900 dark:text-white"
                            >
                                <option value="exam_jee_main">JEE Main (1.2M Candidates)</option>
                                <option value="exam_jee_adv">JEE Advanced (180K Candidates)</option>
                                <option value="exam_neet">NEET UG (2.0M Candidates)</option>
                                <option value="exam_cat">CAT MBA (280K Candidates)</option>
                                <option value="exam_gate_cs">GATE CS (120K Candidates)</option>
                                <option value="exam_ssc_cgl">SSC CGL (2.5M Candidates)</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                <span>Accuracy Rate</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{rankInput.accuracyPercent}%</span>
                            </div>
                            <input
                                type="range"
                                min="30"
                                max="99"
                                value={rankInput.accuracyPercent}
                                onChange={(e) => setRankInput({ ...rankInput, accuracyPercent: Number(e.target.value) })}
                                className="w-full accent-indigo-600"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                <span>Average Speed</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{rankInput.avgSpeedSeconds}s / qn</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="120"
                                value={rankInput.avgSpeedSeconds}
                                onChange={(e) => setRankInput({ ...rankInput, avgSpeedSeconds: Number(e.target.value) })}
                                className="w-full accent-indigo-600"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                <span>Question Sample Size</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{rankInput.totalQuestionsAttempted} qns</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="300"
                                value={rankInput.totalQuestionsAttempted}
                                onChange={(e) => setRankInput({ ...rankInput, totalQuestionsAttempted: Number(e.target.value) })}
                                className="w-full accent-indigo-600"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={runRankPrediction}
                        disabled={loadingRank}
                        className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-extrabold text-xs shadow-md hover:bg-slate-800 transition cursor-pointer"
                    >
                        {loadingRank ? 'Evaluating Regression Model...' : 'Calculate Predicted Rank & Cutoff Probability'}
                    </button>

                    {/* Output Card */}
                    {rankPrediction && (
                        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900/10 border border-indigo-500/20 p-5 space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Predicted AIR Rank</div>
                                    <div className="text-xl font-black text-amber-500 mt-1">
                                        #{rankPrediction.estimatedRank.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-slate-400">out of {rankPrediction.totalCandidates.toLocaleString()}</div>
                                </div>

                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Predicted Percentile</div>
                                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                        {rankPrediction.predictedPercentile}%ile
                                    </div>
                                    <div className="text-[10px] text-slate-400">Cutoff: {rankPrediction.cutoffPercentile}%ile</div>
                                </div>

                                <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Cutoff Clearance</div>
                                    <div className="text-xl font-black text-emerald-500 mt-1">
                                        {rankPrediction.qualificationOddsPercent}%
                                    </div>
                                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{rankPrediction.admissionTierStatus}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. ITEM RESPONSE THEORY (IRT 2-PARAMETER LOGISTIC) */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-md space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                                <Brain className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    Item Response Theory (IRT)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Latent Trait Ability $\theta$ Estimation
                                </p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                            2PL Logistic Model
                        </span>
                    </div>

                    {irtResult && (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Latent Trait Ability ($\theta$)</span>
                                <span className="text-lg font-black text-cyan-500">
                                    {irtResult.irtModel.abilityTheta > 0 ? `+${irtResult.irtModel.abilityTheta}` : irtResult.irtModel.abilityTheta}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Standard Error (SEM)</span>
                                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                                    ±{irtResult.irtModel.confidenceInterval}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                <div className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase">Adaptive Recommendation</div>
                                <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                                    Target Difficulty: <span className="uppercase text-cyan-500">{irtResult.nextQuestionRecommendation.targetDifficulty}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                                    {irtResult.nextQuestionRecommendation.recommendedStrategy}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Attempt Stream Simulator */}
                    <div className="space-y-2">
                        <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Simulate Response Stream</div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    addIrtAttempt(true, 'hard');
                                    runIrtEstimation();
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition cursor-pointer"
                            >
                                + Correct Hard Qn
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    addIrtAttempt(false, 'medium');
                                    runIrtEstimation();
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition cursor-pointer"
                            >
                                - Incorrect Medium Qn
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. FORGETTING CURVE & HALF-LIFE MEMORY DECAY (HLR) */}
                <div className="lg:col-span-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    Spaced Repetition & Forgetting Curve Model (HLR)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Predicts cognitive memory decay $R(t) = 2^{-t / h}$ to schedule optimal revision dates
                                </p>
                            </div>
                        </div>

                        {hlrResult && (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Retention</div>
                                    <div className="text-xl font-black text-purple-600 dark:text-purple-400">
                                        {hlrResult.retentionPercent}%
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Half-Life ($h$)</div>
                                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                                        {hlrResult.halfLifeDays} Days
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div>
                                <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    <span>Days Since Last Review</span>
                                    <span className="text-purple-600">{hlrInput.daysElapsed} days</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={hlrInput.daysElapsed}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setHlrInput({ ...hlrInput, daysElapsed: val });
                                        runHlrCalculation();
                                    }}
                                    className="w-full accent-purple-600"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                    <span>Successful Reviews</span>
                                    <span className="text-purple-600">{hlrInput.successes} times</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={hlrInput.successes}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setHlrInput({ ...hlrInput, successes: val });
                                        runHlrCalculation();
                                    }}
                                    className="w-full accent-purple-600"
                                />
                            </div>
                        </div>

                        {/* Half Life Decay Bar Visualizer */}
                        {hlrResult && (
                            <div className="md:col-span-2 space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-700 dark:text-slate-300">Memory Retention Decay Meter</span>
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        Optimal Revision in {hlrResult.recommendedRevisionIntervalDays} Days
                                    </span>
                                </div>
                                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            hlrResult.retentionPercent > 75
                                                ? 'bg-emerald-500'
                                                : hlrResult.retentionPercent > 50
                                                ? 'bg-amber-500'
                                                : 'bg-rose-500'
                                        }`}
                                        style={{ width: `${hlrResult.retentionPercent}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                                    <span>0% Memory Decay</span>
                                    <span className="font-bold text-indigo-500">{hlrResult.urgencyStatus}</span>
                                    <span>100% Full Retention</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MlPredictiveEngine;

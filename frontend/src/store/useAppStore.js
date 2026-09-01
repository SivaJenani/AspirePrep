import { create } from 'zustand';
import { api } from '../lib/api';
import { INITIAL_MISTAKES, INITIAL_FLASHCARDS, INITIAL_TOPIC_PROGRESS } from '../data/featureHubData';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
const EMPTY_TOPIC_PROGRESS = {};
const EMPTY_MISTAKES = [];
const EMPTY_FLASHCARDS = [];
const EMPTY_DUEL_HISTORY = [];
const clearGuestScopeDefaults = () => {
    [
        getScopeKey('aspire_topic_progress', 'guest'),
        getScopeKey('aspire_mistakes', 'guest'),
        getScopeKey('aspire_flashcards', 'guest'),
        getScopeKey('aspire_duel_wins', 'guest'),
        getScopeKey('aspire_duel_losses', 'guest'),
        getScopeKey('aspire_duel_history', 'guest')
    ].forEach((key) => localStorage.removeItem(key));
};
// --- FIRESTORE PERSISTENCE WRAPPER HELPERS ---
const pushUserProfile = async (user) => {
    if (auth.currentUser) {
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(docRef, {
                uid: auth.currentUser.uid,
                name: user.name,
                email: user.email,
                xp: user.xp,
                streakDays: user.streakDays,
                role: user.role || 'student',
                updatedAt: new Date().toISOString()
            });
        }
        catch (e) {
            console.error('Error writing user profile:', e);
        }
    }
};
const pushTopicProgress = async (topicId, record) => {
    if (auth.currentUser) {
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid, 'topicProgress', topicId);
            await setDoc(docRef, {
                topicId: record.topicId,
                status: record.status,
                lastStudiedAt: record.lastStudiedAt || new Date().toISOString()
            });
        }
        catch (e) {
            console.error('Error writing topic progress:', e);
        }
    }
};
const pushMistake = async (id, record) => {
    if (auth.currentUser) {
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid, 'mistakes', id);
            await setDoc(docRef, {
                id: record.id || id,
                questionText: record.questionText || 'Question',
                correctAnswer: record.correctAnswer || 'A',
                userAnswer: record.userAnswer || record.userSelectedOptionId || 'B',
                errorTag: record.errorTag === 'conceptual_gap' ? 'Conceptual Gap' :
                    record.errorTag === 'calculation_slip' ? 'Calculation Slip' :
                        record.errorTag === 'time_rush' ? 'Time Pressure' :
                            record.errorTag === 'misread_question' ? 'Misread Question' :
                                record.errorTag === 'silly_mistake' ? 'Silly Error' :
                                    (record.errorTag || 'Conceptual Gap'),
                isMastered: !!record.isMastered,
                lastAttemptedAt: record.lastAttemptedAt || new Date().toISOString()
            });
        }
        catch (e) {
            console.error('Error writing mistake:', e);
        }
    }
};
const pushFlashcard = async (id, record) => {
    if (auth.currentUser) {
        try {
            const docRef = doc(db, 'users', auth.currentUser.uid, 'flashcards', id);
            await setDoc(docRef, {
                id: record.id || id,
                question: record.question || record.title || 'Formula',
                answer: record.answer || record.formula || 'Proof',
                masteryStatus: record.masteryStatus || 'learning',
                timesReviewed: record.timesReviewed ?? 0
            });
        }
        catch (e) {
            console.error('Error writing flashcard:', e);
        }
    }
};
const getScopeKey = (baseKey, scope = 'guest') => `${baseKey}:${scope}`;
const readScopedJSON = (baseKey, scope, fallback) => {
    const saved = localStorage.getItem(getScopeKey(baseKey, scope));
    if (saved) {
        try {
            return JSON.parse(saved);
        }
        catch (e) { /* ignore */ }
    }
    return fallback;
};
const writeScopedJSON = (baseKey, scope, value) => {
    localStorage.setItem(getScopeKey(baseKey, scope), JSON.stringify(value));
};
const getScopeId = (user) => user?.id || 'guest';
export const useAppStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('aptitudemax_token') || null,
    currentExam: null,
    isDarkMode: localStorage.getItem('aptitudemax_theme') === 'dark',
    isLoading: true,
    _guestSeedCleared: (() => {
        clearGuestScopeDefaults();
        return true;
    })(),
    // Syllabus & Progress Tracking
    topicProgress: (() => {
        return readScopedJSON('aspire_topic_progress', 'guest', EMPTY_TOPIC_PROGRESS);
    })(),
    updateTopicProgress: (topicId, updates) => {
        const current = get().topicProgress;
        const existing = current[topicId] || {
            topicId,
            subjectId: 'sub_ssc_quant',
            examId: 'exam_ssc_cgl',
            status: 'not_started',
            confidenceRating: 3,
            notes: '',
            studyMinutesLogged: 0,
            lastStudiedAt: new Date().toISOString(),
            masteryPercent: 0
        };
        const updated = {
            ...current,
            [topicId]: {
                ...existing,
                ...updates,
                lastStudiedAt: new Date().toISOString()
            }
        };
        writeScopedJSON('aspire_topic_progress', getScopeId(get().user), updated);
        set({ topicProgress: updated });
    },
    setTopicStatus: (topicId, status, meta) => {
        const current = get().topicProgress;
        const existing = current[topicId] || {
            topicId,
            subjectId: meta?.subjectId || 'sub_ssc_quant',
            chapterId: meta?.chapterId,
            examId: meta?.examId || 'exam_ssc_cgl',
            status: 'not_started',
            confidenceRating: 3,
            notes: '',
            studyMinutesLogged: 0,
            lastStudiedAt: new Date().toISOString(),
            masteryPercent: 0
        };
        let masteryPercent = existing.masteryPercent;
        if (status === 'mastered')
            masteryPercent = Math.max(90, masteryPercent);
        else if (status === 'completed')
            masteryPercent = Math.max(75, masteryPercent);
        else if (status === 'in_progress')
            masteryPercent = Math.max(40, masteryPercent);
        else if (status === 'revision_needed')
            masteryPercent = Math.min(55, masteryPercent);
        else if (status === 'not_started')
            masteryPercent = 0;
        const updated = {
            ...current,
            [topicId]: {
                ...existing,
                ...meta,
                status,
                masteryPercent,
                lastStudiedAt: new Date().toISOString()
            }
        };
        writeScopedJSON('aspire_topic_progress', getScopeId(get().user), updated);
        set({ topicProgress: updated });
        // Reward XP on topic completion/mastery
        const currentUser = get().user;
        if (currentUser && (status === 'completed' || status === 'mastered')) {
            const xpGained = status === 'mastered' ? 40 : 25;
            set({
                user: {
                    ...currentUser,
                    xp: (currentUser.xp || 0) + xpGained
                }
            });
        }
    },
    bulkUpdateChapterProgress: (topicIds, status, meta) => {
        const current = { ...get().topicProgress };
        let masteryPercent = 0;
        if (status === 'mastered')
            masteryPercent = 95;
        else if (status === 'completed')
            masteryPercent = 80;
        else if (status === 'in_progress')
            masteryPercent = 50;
        else if (status === 'revision_needed')
            masteryPercent = 55;
        topicIds.forEach(topicId => {
            const existing = current[topicId] || {
                topicId,
                subjectId: meta?.subjectId || 'sub_ssc_quant',
                chapterId: meta?.chapterId,
                examId: meta?.examId || 'exam_ssc_cgl',
                status: 'not_started',
                confidenceRating: 4,
                notes: '',
                studyMinutesLogged: 30,
                lastStudiedAt: new Date().toISOString(),
                masteryPercent: 0
            };
            current[topicId] = {
                ...existing,
                ...meta,
                status,
                masteryPercent: status === 'not_started' ? 0 : masteryPercent,
                lastStudiedAt: new Date().toISOString()
            };
        });
        writeScopedJSON('aspire_topic_progress', getScopeId(get().user), current);
        set({ topicProgress: current });
        // Add XP bonus for chapter advancement
        const currentUser = get().user;
        if (currentUser && status !== 'not_started') {
            set({
                user: {
                    ...currentUser,
                    xp: (currentUser.xp || 0) + topicIds.length * 20
                }
            });
        }
    },
    resetSyllabusProgress: (examId) => {
        let current = { ...get().topicProgress };
        if (!examId) {
            current = {};
        }
        else {
            Object.keys(current).forEach(tId => {
                if (current[tId].examId === examId) {
                    delete current[tId];
                }
            });
        }
        writeScopedJSON('aspire_topic_progress', getScopeId(get().user), current);
        set({ topicProgress: current });
    },
    // Feature 1: Mistakes
    mistakes: (() => {
        return readScopedJSON('aspire_mistakes', 'guest', EMPTY_MISTAKES);
    })(),
    updateMistakeNote: (id, note) => {
        const updated = get().mistakes.map(m => m.id === id ? { ...m, userNotes: note } : m);
        writeScopedJSON('aspire_mistakes', getScopeId(get().user), updated);
        set({ mistakes: updated });
    },
    updateMistakeTag: (id, tag) => {
        const updated = get().mistakes.map(m => m.id === id ? { ...m, errorTag: tag } : m);
        writeScopedJSON('aspire_mistakes', getScopeId(get().user), updated);
        set({ mistakes: updated });
    },
    toggleMistakeMastered: (id) => {
        const updated = get().mistakes.map(m => m.id === id ? { ...m, isMastered: !m.isMastered } : m);
        writeScopedJSON('aspire_mistakes', getScopeId(get().user), updated);
        set({ mistakes: updated });
    },
    recordRetestResult: (id, isCorrect) => {
        const updated = get().mistakes.map(m => {
            if (m.id !== id)
                return m;
            const success = isCorrect ? m.retestSuccessCount + 1 : m.retestSuccessCount;
            return {
                ...m,
                isMastered: isCorrect ? (success >= 2 ? true : m.isMastered) : false,
                retestedAt: new Date().toISOString(),
                retestSuccessCount: success
            };
        });
        localStorage.setItem('aspire_mistakes', JSON.stringify(updated));
        set({ mistakes: updated });
    },
    addMistake: (mistake) => {
        const newEntry = {
            ...mistake,
            id: `m-${Date.now()}`,
            lastAttemptedAt: new Date().toISOString(),
            retestSuccessCount: 0
        };
        const updated = [newEntry, ...get().mistakes];
        writeScopedJSON('aspire_mistakes', getScopeId(get().user), updated);
        set({ mistakes: updated });
    },
    // Feature 4: Flashcards
    flashcards: (() => {
        return readScopedJSON('aspire_flashcards', 'guest', EMPTY_FLASHCARDS);
    })(),
    updateFlashcardStatus: (id, status, intervalDays) => {
        const updated = get().flashcards.map(fc => {
            if (fc.id !== id)
                return fc;
            return {
                ...fc,
                masteryStatus: status,
                intervalStageDays: intervalDays,
                lastReviewedDate: new Date().toISOString().split('T')[0],
                timesReviewed: fc.timesReviewed + 1
            };
        });
        writeScopedJSON('aspire_flashcards', getScopeId(get().user), updated);
        set({ flashcards: updated });
    },
    // Feature 2: Speed Duel Arena
    duelWins: Number(localStorage.getItem(getScopeKey('aspire_duel_wins', 'guest')) || 0),
    duelLosses: Number(localStorage.getItem(getScopeKey('aspire_duel_losses', 'guest')) || 0),
    duelHistory: readScopedJSON('aspire_duel_history', 'guest', EMPTY_DUEL_HISTORY),
    recordDuelOutcome: (isWin, myScore, opponentScore, opponentName, xpEarned) => {
        const wins = isWin ? get().duelWins + 1 : get().duelWins;
        const losses = !isWin ? get().duelLosses + 1 : get().duelLosses;
        writeScopedJSON('aspire_duel_wins', getScopeId(get().user), wins);
        writeScopedJSON('aspire_duel_losses', getScopeId(get().user), losses);
        const newHistory = [
            {
                id: `dh-${Date.now()}`,
                date: 'Just now',
                myScore,
                opponentScore,
                opponentName,
                isWin
            },
            ...get().duelHistory
        ];
        const currentUser = get().user;
        if (currentUser) {
            set({
                user: {
                    ...currentUser,
                    xp: (currentUser.xp || 0) + xpEarned
                }
            });
        }
        set({
            duelWins: wins,
            duelLosses: losses,
            duelHistory: newHistory
        });
    },
    hydrateWorkspaceForUser: (user) => {
        const scope = getScopeId(user);
        set({
            topicProgress: readScopedJSON('aspire_topic_progress', scope, EMPTY_TOPIC_PROGRESS),
            mistakes: readScopedJSON('aspire_mistakes', scope, EMPTY_MISTAKES),
            flashcards: readScopedJSON('aspire_flashcards', scope, EMPTY_FLASHCARDS),
            duelWins: Number(localStorage.getItem(getScopeKey('aspire_duel_wins', scope)) || 0),
            duelLosses: Number(localStorage.getItem(getScopeKey('aspire_duel_losses', scope)) || 0),
            duelHistory: readScopedJSON('aspire_duel_history', scope, EMPTY_DUEL_HISTORY)
        });
    },
    setUser: (user) => {
        set({ user });
        if (user) {
            get().hydrateWorkspaceForUser(user);
        }
    },
    setToken: (token) => {
        if (token) {
            localStorage.setItem('aptitudemax_token', token);
        }
        else {
            localStorage.removeItem('aptitudemax_token');
        }
        set({ token });
    },
    setCurrentExam: (currentExam) => set({ currentExam }),
    toggleDarkMode: () => {
        const next = !get().isDarkMode;
        localStorage.setItem('aptitudemax_theme', next ? 'dark' : 'light');
        if (next) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        set({ isDarkMode: next });
    },
    fetchCurrentUser: async () => {
        try {
            set({ isLoading: true });
            const res = await api.get('/auth/me');
            if (res.data?.user) {
                set({ user: res.data.user });
                get().hydrateWorkspaceForUser(res.data.user);
            }
        }
        catch (err) {
            console.warn('Auto auth fetch failed or unauthenticated', err);
        }
        finally {
            set({ isLoading: false });
        }
    },
    registerWithEmailPassword: async ({ name, email, password, targetExamId, customExamName, targetExamName }) => {
        try {
            set({ isLoading: true });
            const res = await api.post('/auth/register', { name, email, password, targetExamId, customExamName, targetExamName });
            if (res.data?.token && res.data?.user) {
                localStorage.setItem('aptitudemax_token', res.data.token);
                set({ token: res.data.token, user: res.data.user });
                get().hydrateWorkspaceForUser(res.data.user);
                return res.data;
            }
            return null;
        }
        catch (err) {
            console.error('Register error:', err);
            throw err;
        }
        finally {
            set({ isLoading: false });
        }
    },
    loginWithEmailPassword: async (email, password) => {
        try {
            set({ isLoading: true });
            const res = await api.post('/auth/login', { email, password });
            if (res.data?.token && res.data?.user) {
                localStorage.setItem('aptitudemax_token', res.data.token);
                set({ token: res.data.token, user: res.data.user });
                get().hydrateWorkspaceForUser(res.data.user);
                return res.data;
            }
            return null;
        }
        catch (err) {
            console.error('Login error:', err);
            throw err;
        }
        finally {
            set({ isLoading: false });
        }
    },
    logout: () => {
        localStorage.removeItem('aptitudemax_token');
        clearGuestScopeDefaults();
        set({
            token: null,
            user: null,
            topicProgress: EMPTY_TOPIC_PROGRESS,
            mistakes: EMPTY_MISTAKES,
            flashcards: EMPTY_FLASHCARDS,
            duelWins: 0,
            duelLosses: 0,
            duelHistory: EMPTY_DUEL_HISTORY
        });
    },
    signInWithGoogle: async () => {
        try {
            set({ isLoading: true });
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const { user } = result;
            // Register/Login user with our backend
            const res = await api.post('/auth/google', {
                email: user.email,
                name: user.displayName,
                uid: user.uid,
                avatar: user.photoURL
            });
            if (res.data?.token && res.data?.user) {
                localStorage.setItem('aptitudemax_token', res.data.token);
                set({ token: res.data.token, user: res.data.user });
                get().hydrateWorkspaceForUser(res.data.user);
            }
        }
        catch (err) {
            console.error('Google Sign-In Error:', err);
        }
        finally {
            set({ isLoading: false });
        }
    },
    syncProgressFromFirestore: async (userId) => {
        // Optional: add any logic to sync from firestore
    }
}));

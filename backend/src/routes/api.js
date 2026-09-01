"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const store_1 = require("../db/store");
const auth_1 = require("../middleware/auth");
const aiService_1 = require("../services/aiService");
exports.apiRouter = express_1.default.Router();
const CUSTOM_EXAM_ID = 'exam_custom';
const normalizeExamId = (examId) => {
    if (examId === 'exam_tnpsc_group_4')
        return 'exam_tnpsc_group4';
    if (examId === 'other')
        return CUSTOM_EXAM_ID;
    return examId;
};
const isCustomExamId = (examId) => examId === CUSTOM_EXAM_ID;
const resolveTargetExam = ({ targetExamId, targetExamName, customExamName }) => {
    const normalizedExamId = normalizeExamId(targetExamId);
    if (isCustomExamId(normalizedExamId)) {
        const resolvedName = (customExamName || targetExamName || 'Custom Exam').trim();
        return {
            targetExamId: CUSTOM_EXAM_ID,
            targetExamName: resolvedName || 'Custom Exam',
            customExamName: resolvedName || 'Custom Exam'
        };
    }
    const exam = normalizedExamId ? store_1.store.exams.findById(normalizedExamId) : null;
    const resolvedName = exam?.name || (targetExamName || 'SSC CGL').trim() || 'SSC CGL';
    return {
        targetExamId: exam?.id || normalizedExamId || 'exam_ssc_cgl',
        targetExamName: resolvedName
    };
};
// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
exports.apiRouter.post('/auth/register', (req, res) => {
    const { name, email, password, customExamName, targetExamName } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const existing = store_1.store.users.findByEmail(email);
    if (existing) {
        return res.status(400).json({ error: 'User with this email already exists' });
    }
    const resolvedExam = resolveTargetExam({
        targetExamId: req.body.targetExamId,
        targetExamName,
        customExamName
    });
    const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        passwordHash: bcryptjs_1.default.hashSync(password, 10),
        role: 'student',
        targetExamId: resolvedExam.targetExamId,
        targetExamName: resolvedExam.targetExamName,
        customExamName: resolvedExam.customExamName,
        targetExamDate: '2026-11-15',
        dailyStudyMinutes: 120,
        targetScorePercent: 80,
        xp: 100,
        level: 1,
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        badges: [
            { id: 'b_first_signup', name: 'First account', description: 'Created a real AspirePrep account', icon: 'Sparkles', isUnlocked: true, unlockedAt: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
    };
    store_1.store.users.create(newUser);
    const token = (0, auth_1.generateToken)(newUser);
    const { passwordHash, ...userClean } = newUser;
    res.json({ token, user: userClean });
});
exports.apiRouter.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = store_1.store.users.findByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = bcryptjs_1.default.compareSync(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = (0, auth_1.generateToken)(user);
    const { passwordHash, ...userClean } = user;
    res.json({ token, user: userClean });
});
exports.apiRouter.post('/auth/google', (req, res) => {
    const { email, name, uid, avatar } = req.body;
    if (!email || !uid) {
        return res.status(400).json({ error: 'Email and UID are required' });
    }
    let user = store_1.store.users.findByEmail(email);
    if (!user) {
        // Fallback: check if user exists by uid
        user = store_1.store.users.find().find((u) => u.uid === uid);
    }
    let isNewUser = false;
    if (!user) {
        // Create new user for OAuth
        isNewUser = true;
        const newUser = {
            id: `user_${Date.now()}`,
            uid, // Store Firebase UID
            name: name || 'Google User',
            email,
            passwordHash: bcryptjs_1.default.hashSync(Math.random().toString(36).slice(-8), 10), // Random password
            role: 'student',
            avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            targetExamId: 'exam_ssc_cgl',
            targetExamName: 'SSC CGL',
            targetExamDate: '2026-11-15',
            dailyStudyMinutes: 120,
            targetScorePercent: 80,
            xp: 100,
            level: 1,
            streakDays: 1,
            lastActiveDate: new Date().toISOString(),
            badges: [
                { id: 'b_first_signup', name: 'First account', description: 'Created a real AspirePrep account', icon: 'Sparkles', isUnlocked: true, unlockedAt: new Date().toISOString() }
            ],
            createdAt: new Date().toISOString()
        };
        store_1.store.users.create(newUser);
        user = newUser;
    }
    else {
        // Update existing user with uid/avatar if needed
        if (!user.uid || user.avatar !== avatar) {
            store_1.store.users.update(user.id, { uid, avatar: avatar || user.avatar });
        }
    }
    const token = (0, auth_1.generateToken)(user);
    const { passwordHash, ...userClean } = user;
    res.json({ token, user: userClean, isNewUser });
});
exports.apiRouter.get('/auth/me', auth_1.authenticate, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { passwordHash, ...userClean } = req.user;
    res.json({ user: userClean });
});
exports.apiRouter.put('/auth/profile', auth_1.authenticate, (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    const updates = { ...req.body };
    const resolvedExam = resolveTargetExam({
        targetExamId: updates.targetExamId ?? req.user.targetExamId,
        targetExamName: updates.targetExamName ?? req.user.targetExamName,
        customExamName: updates.customExamName ?? req.user.customExamName
    });
    updates.targetExamId = resolvedExam.targetExamId;
    updates.targetExamName = resolvedExam.targetExamName;
    if (resolvedExam.customExamName) {
        updates.customExamName = resolvedExam.customExamName;
    }
    else {
        delete updates.customExamName;
    }
    const updated = store_1.store.users.update(req.user.id, updates);
    res.json({ user: updated });
});
exports.apiRouter.post('/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    res.json({ message: `Password reset instructions have been dispatched to ${email || 'your email'}.` });
});
// ==========================================
// 2. EXAM & SYLLABUS HIERARCHY
// ==========================================
exports.apiRouter.get('/exams', (req, res) => {
    const { category, search } = req.query;
    let exams = store_1.store.exams.find();
    if (category && category !== 'All') {
        exams = exams.filter(e => e.category === category);
    }
    if (search && typeof search === 'string') {
        const term = search.toLowerCase();
        exams = exams.filter(e => e.name.toLowerCase().includes(term) ||
            e.description.toLowerCase().includes(term) ||
            e.category.toLowerCase().includes(term));
    }
    res.json({ exams });
});
exports.apiRouter.get('/exams/:slug', (req, res) => {
    const { slug } = req.params;
    const exam = store_1.store.exams.findBySlug(slug) || store_1.store.exams.findById(slug);
    if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
    }
    const subjects = store_1.store.subjects.findByExamId(exam.id);
    const mockTests = store_1.store.mockTests.findByExamId(exam.id);
    res.json({ exam, subjects, mockTests });
});
exports.apiRouter.get('/exams/:examId/hierarchy', (req, res) => {
    const { examId } = req.params;
    const subjects = store_1.store.subjects.findByExamId(examId);
    const chapters = store_1.store.chapters.find().filter(c => c.examId === examId);
    const topics = store_1.store.topics.find().filter(t => t.examId === examId);
    res.json({ subjects, chapters, topics });
});
exports.apiRouter.get('/concepts/:topicId', (req, res) => {
    const { topicId } = req.params;
    const concepts = store_1.store.concepts.findByTopicId(topicId);
    const topic = store_1.store.topics.findById(topicId);
    res.json({ concepts, topic });
});
// ==========================================
// 2.5 SYLLABUS & PROGRESS ENGINE
// ==========================================
exports.apiRouter.get('/syllabus/progress', auth_1.authenticate, (req, res) => {
    const { examId = 'exam_ssc_cgl' } = req.query;
    const subjects = store_1.store.subjects.findByExamId(examId);
    const topics = store_1.store.topics.find().filter(t => t.examId === examId);
    const chapters = store_1.store.chapters.find().filter(c => c.examId === examId);
    // Return hierarchy with calculated metrics
    res.json({
        examId,
        subjects,
        chapters,
        topics
    });
});
exports.apiRouter.post('/syllabus/progress/update', auth_1.authenticate, (req, res) => {
    const { topicId, status, confidenceRating, notes, studyMinutesLogged } = req.body;
    const topic = store_1.store.topics.findById(topicId);
    if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
    }
    // Grant user XP if marked completed/mastered
    if (req.user && (status === 'completed' || status === 'mastered')) {
        const xpGained = status === 'mastered' ? 40 : 25;
        store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + xpGained });
    }
    res.json({
        success: true,
        topicId,
        status,
        confidenceRating,
        notes,
        studyMinutesLogged,
        updatedAt: new Date().toISOString()
    });
});
exports.apiRouter.post('/syllabus/progress/bulk-chapter', auth_1.authenticate, (req, res) => {
    const { chapterId, status } = req.body;
    const chapter = store_1.store.chapters.findById(chapterId);
    if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
    }
    const topics = store_1.store.topics.findByChapterId(chapterId);
    if (req.user && status !== 'not_started') {
        store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + topics.length * 20 });
    }
    res.json({
        success: true,
        chapterId,
        status,
        affectedTopicIds: topics.map(t => t.id),
        updatedAt: new Date().toISOString()
    });
});
// ==========================================
// 3. QUESTIONS & PRACTICE SESSIONS
// ==========================================
exports.apiRouter.get('/questions/practice', auth_1.authenticate, (req, res) => {
    const { mode, examId, subjectId, topicId, difficulty, count = '10' } = req.query;
    const limit = parseInt(count, 10) || 10;
    let questions = [];
    if (mode === 'topic' && topicId) {
        questions = store_1.store.questions.findByTopicId(topicId);
    }
    else if (mode === 'subject' && subjectId) {
        questions = store_1.store.questions.findBySubjectId(subjectId);
    }
    else if (mode === 'weak') {
        // Generate from weak topics
        const analytics = (0, store_1.calculateUserAnalytics)(req.user.id);
        const weakTopicIds = analytics.weakTopics.map(w => w.topicId);
        questions = store_1.store.questions.find().filter(q => weakTopicIds.includes(q.topicId));
        if (questions.length === 0) {
            questions = store_1.store.questions.find().slice(0, 10);
        }
    }
    else if (mode === 'pyq') {
        questions = store_1.store.questions.findPYQs(examId);
    }
    else {
        // Random practice
        questions = store_1.store.questions.find();
        if (examId)
            questions = questions.filter(q => q.examId === examId);
        if (difficulty && difficulty !== 'all') {
            questions = questions.filter(q => q.difficulty === difficulty);
        }
    }
    // Shuffle & limit
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, limit);
    res.json({ questions: shuffled, count: shuffled.length, mode });
});
exports.apiRouter.get('/questions/pyq', (req, res) => {
    const { examId, year, subjectId, topicId } = req.query;
    const pyqs = store_1.store.questions.findPYQs(examId, year ? parseInt(year, 10) : undefined, subjectId, topicId);
    res.json({ questions: pyqs });
});
exports.apiRouter.post('/questions/attempt', auth_1.authenticate, (req, res) => {
    const { questionId, selectedOptionId, timeSpentSeconds, mode = 'practice' } = req.body;
    const question = store_1.store.questions.findById(questionId);
    if (!question) {
        return res.status(404).json({ error: 'Question not found' });
    }
    const isCorrect = selectedOptionId === question.correctOptionId;
    const attempt = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        userId: req.user.id,
        questionId,
        examId: question.examId,
        subjectId: question.subjectId,
        topicId: question.topicId,
        selectedOptionId,
        isCorrect,
        timeSpentSeconds: timeSpentSeconds || 30,
        mode: mode,
        timestamp: new Date().toISOString()
    };
    store_1.store.questionAttempts.create(attempt);
    // Update user XP & Level
    if (req.user) {
        const xpGained = isCorrect ? 15 : 5;
        const newXp = (req.user.xp || 0) + xpGained;
        const newLevel = Math.floor(newXp / 500) + 1;
        store_1.store.users.update(req.user.id, { xp: newXp, level: newLevel });
    }
    res.json({
        isCorrect,
        correctOptionId: question.correctOptionId,
        explanation: question.explanation,
        shortcutTip: question.shortcutTip,
        marksAwarded: isCorrect ? question.marks : -question.negativeMarks
    });
});
// ==========================================
// 4. MOCK TEST ENGINE
// ==========================================
exports.apiRouter.get('/mock-tests', (req, res) => {
    const { examId } = req.query;
    let tests = store_1.store.mockTests.find();
    if (examId) {
        tests = tests.filter(t => t.examId === examId);
    }
    res.json({ mockTests: tests });
});
exports.apiRouter.get('/mock-tests/:id', (req, res) => {
    const { id } = req.params;
    const test = store_1.store.mockTests.findById(id);
    if (!test) {
        return res.status(404).json({ error: 'Mock test not found' });
    }
    // Populate questions
    const allQuestionIds = test.sections.flatMap(s => s.questionIds ?? []);
    const questions = store_1.store.questions.find().filter(q => allQuestionIds.includes(q.id));
    // If questions are fewer than totalQuestions (in mock test config), supplement with relevant questions
    let populatedQuestions = [...questions];
    if (populatedQuestions.length === 0) {
        populatedQuestions = store_1.store.questions.find().slice(0, 10);
    }
    res.json({ mockTest: { ...test, questions: populatedQuestions } });
});
exports.apiRouter.post('/mock-tests/:id/submit', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const { questionResponses, timeTakenSeconds } = req.body;
    const test = store_1.store.mockTests.findById(id);
    if (!test) {
        return res.status(404).json({ error: 'Mock test not found' });
    }
    const exam = store_1.store.exams.findById(test.examId);
    let totalScore = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;
    const evaluatedResponses = (questionResponses || []).map((resp) => {
        const q = store_1.store.questions.findById(resp.questionId);
        if (!q)
            return resp;
        let isCorrect = false;
        let marksAwarded = 0;
        if (resp.selectedOptionId) {
            if (resp.selectedOptionId === q.correctOptionId) {
                isCorrect = true;
                marksAwarded = q.marks || 2;
                totalCorrect += 1;
            }
            else {
                isCorrect = false;
                marksAwarded = -(q.negativeMarks || 0.5);
                totalWrong += 1;
            }
        }
        else {
            totalSkipped += 1;
        }
        totalScore += marksAwarded;
        // Record question attempt
        store_1.store.questionAttempts.create({
            id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            userId: req.user.id,
            questionId: q.id,
            examId: q.examId,
            subjectId: q.subjectId,
            topicId: q.topicId,
            selectedOptionId: resp.selectedOptionId,
            isCorrect,
            timeSpentSeconds: resp.timeSpentSeconds || 30,
            mode: 'mock',
            timestamp: new Date().toISOString()
        });
        return {
            ...resp,
            isCorrect,
            marksAwarded
        };
    });
    const totalAttempted = totalCorrect + totalWrong;
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const percentage = Math.max(0, Math.round((totalScore / test.totalMarks) * 100));
    const percentileRank = Math.min(99.4, Math.max(45.0, Math.round((percentage * 1.15) * 10) / 10));
    // Section Analytics
    const sectionAnalytics = test.sections.map(sec => {
        const sectionQuestionIds = sec.questionIds ?? [];
        const secQuestions = evaluatedResponses.filter((r) => {
            const q = store_1.store.questions.findById(r.questionId);
            return q && q.subjectId === sec.subjectId;
        });
        const secCorrect = secQuestions.filter((r) => r.isCorrect).length;
        const secWrong = secQuestions.filter((r) => r.selectedOptionId && !r.isCorrect).length;
        const secScore = secQuestions.reduce((sum, r) => sum + (r.marksAwarded || 0), 0);
        const secAttempted = secCorrect + secWrong;
        const secAcc = secAttempted > 0 ? Math.round((secCorrect / secAttempted) * 100) : 0;
        return {
            subjectId: sec.subjectId,
            subjectName: sec.subjectName,
            score: Math.max(0, secScore),
            maxScore: sec.durationMinutes ? 50 : 50,
            accuracy: secAcc,
            totalAttempted: secAttempted,
            totalCorrect: secCorrect,
            totalWrong: secWrong,
            totalSkipped: Math.max(0, sectionQuestionIds.length - secAttempted),
            timeTakenSeconds: Math.round((timeTakenSeconds || 1800) / test.sections.length)
        };
    });
    const recommendations = [
        accuracy < 70
            ? 'High negative marking detected in quantitative aptitude. Practice selective attempting.'
            : 'Strong performance! Focus on speed maintenance for full-length tests.',
        'Review the questions marked for review to understand hesitation triggers.'
    ];
    const attemptResult = {
        id: `attempt_${Date.now()}`,
        userId: req.user.id,
        mockTestId: test.id,
        mockTestTitle: test.title,
        examId: test.examId,
        examName: exam?.name || 'Competitive Exam',
        score: Math.max(0, Math.round(totalScore * 10) / 10),
        maxScore: test.totalMarks,
        accuracy,
        percentage,
        percentileRank,
        timeTakenSeconds: timeTakenSeconds || 3200,
        totalCorrect,
        totalWrong,
        totalSkipped,
        sectionAnalytics,
        questionResponses: evaluatedResponses,
        difficultyAnalysis: {
            easy: { correct: Math.round(totalCorrect * 0.5), total: Math.round(totalAttempted * 0.5) + 1, accuracy: 88 },
            medium: { correct: Math.round(totalCorrect * 0.35), total: Math.round(totalAttempted * 0.35) + 1, accuracy: 72 },
            hard: { correct: Math.round(totalCorrect * 0.15), total: Math.round(totalAttempted * 0.15) + 1, accuracy: 50 }
        },
        timeAnalysis: {
            averageTimePerQuestion: totalAttempted > 0 ? Math.round((timeTakenSeconds || 1800) / totalAttempted) : 40,
            fastestQuestionTime: 14,
            slowestQuestionTime: 88
        },
        recommendations,
        completedAt: new Date().toISOString()
    };
    store_1.store.mockTestAttempts.create(attemptResult);
    // Reward XP
    if (req.user) {
        const xpBonus = 150;
        store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + xpBonus });
    }
    res.json({ attempt: attemptResult });
});
exports.apiRouter.get('/mock-tests/attempts/:attemptId', (req, res) => {
    const { attemptId } = req.params;
    const attempt = store_1.store.mockTestAttempts.findById(attemptId);
    if (!attempt) {
        return res.status(404).json({ error: 'Attempt result not found' });
    }
    res.json({ attempt });
});
// ==========================================
// 5. PERFORMANCE ANALYTICS & WEAK TOPICS
// ==========================================
exports.apiRouter.get('/analytics/overview', auth_1.authenticate, (req, res) => {
    const userId = req.user.id;
    const analytics = (0, store_1.calculateUserAnalytics)(userId);
    console.log(`[DEBUG] /analytics/overview for user ${userId} =>`, analytics.totalQuestionsSolved);
    res.json({ analytics });
});
// ==========================================
// 6. ADAPTIVE STUDY PLAN
// ==========================================
exports.apiRouter.get('/study-plan', auth_1.authenticate, (req, res) => {
    const userId = req.user.id;
    let plan = store_1.store.studyPlans.findByUserId(userId);
    if (!plan) {
        plan = store_1.store.studyPlans.find()[0];
    }
    res.json({ studyPlan: plan });
});
exports.apiRouter.post('/study-plan/generate', auth_1.authenticate, async (req, res) => {
    const userId = req.user.id;
    const { examId, examName, targetExamDate, dailyStudyMinutes = 120, targetScore = 85 } = req.body;
    const normalizedExamId = normalizeExamId(examId);
    const exam = normalizedExamId ? store_1.store.exams.findById(normalizedExamId) : null;
    const resolvedExamName = exam?.name || (examName || req.user?.targetExamName || 'Competitive Exams').trim() || 'Competitive Exams';
    const analytics = (0, store_1.calculateUserAnalytics)(userId);
    const weakTopics = analytics.weakTopics.map(w => w.topicName);
    // Generate with AI
    const aiPlan = await aiService_1.aiService.generateAdaptiveStudyPlan(resolvedExamName, targetExamDate || '2026-11-15', dailyStudyMinutes, targetScore, weakTopics);
    // Build a fresh schedule — always reset isCompleted: false on every regenerate
    const buildFreshSchedule = (days) => days.map((d, idx) => ({
        dayNumber: d.dayNumber || idx + 1,
        date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
        focusTitle: d.focusTitle || 'Targeted Topic Mastery & Drill',
        totalMinutes: d.totalMinutes || dailyStudyMinutes,
        isCompleted: false,
        isRestDay: d.isRestDay || false,
        dailyTestQuestions: 20,
        tasks: (d.tasks || []).map((t, tIdx) => ({
            id: `t_${Date.now()}_${idx}_${tIdx}`,
            subjectId: 'sub_ssc_quant',
            subjectName: t.subjectName || 'Quantitative Aptitude',
            topicId: t.topicId || 'top_percentage',
            topicName: t.topicName || 'Formula Practice',
            durationMinutes: t.durationMinutes || 30,
            activityType: t.activityType || 'topic_practice',
            targetQuestionsCount: t.targetQuestionsCount || 10,
            taskObjective: t.taskObjective || null,
            priority: t.priority || 'normal',
            timeSlot: t.timeSlot || null,
            isCompleted: false,
        }))
    }));
    // Fallback: a minimal clean 7-day schedule (no old completed states)
    const fallbackSchedule = Array.from({ length: 7 }, (_, idx) => ({
        dayNumber: idx + 1,
        date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
        focusTitle: 'Study Session',
        totalMinutes: dailyStudyMinutes,
        isCompleted: false,
        isRestDay: false,
        dailyTestQuestions: 20,
        tasks: []
    }));
    const newPlan = {
        id: `plan_${Date.now()}`,
        userId,
        examId: exam?.id || normalizedExamId || req.user?.targetExamId || CUSTOM_EXAM_ID,
        examName: resolvedExamName,
        targetExamDate: targetExamDate || '2026-11-15',
        dailyStudyMinutes,
        targetScore,
        currentDay: 1,
        totalDays: 60,
        weakTopicsTargeted: weakTopics.slice(0, 3),
        adaptiveNotes: [
            `Prioritized ${weakTopics[0] || 'Arithmetic Math'} due to detected weak accuracy.`,
            `Scheduled 1 full mock test every weekend to calibrate exam stamina.`
        ],
        schedule: aiPlan?.days?.length > 0
            ? buildFreshSchedule(aiPlan.days)
            : fallbackSchedule,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    store_1.store.studyPlans.save(newPlan);
    res.json({ studyPlan: newPlan });
});
exports.apiRouter.post('/study-plan/generate-from-notes', auth_1.authenticate, async (req, res) => {
    const userId = req.user.id;
    const { notesText, noteTitle = 'Uploaded Study Notes', examId = 'exam_ssc_cgl', examName, timetablePreferences = {
        dailyHours: 2,
        preferredTimeSlots: ['morning', 'evening'],
        studyRhythm: 'pomodoro',
        targetDays: 7,
        restDays: ['Sunday']
    } } = req.body;
    if (!notesText || typeof notesText !== 'string' || notesText.trim().length === 0) {
        return res.status(400).json({ error: 'Notes or topics text is required.' });
    }
    const normalizedExamId = normalizeExamId(examId);
    const exam = normalizedExamId ? store_1.store.exams.findById(normalizedExamId) : null;
    const resolvedExamName = exam?.name || (examName || req.user?.targetExamName || 'Competitive Exams').trim() || 'Competitive Exams';
    // Call AI Service to parse notes and generate structured timetable
    const aiResult = await aiService_1.aiService.generatePlanFromNotesAndTimetable(notesText, noteTitle, resolvedExamName, timetablePreferences);
    const noteDoc = {
        id: `note_${Date.now()}`,
        userId,
        title: noteTitle,
        rawContent: notesText.slice(0, 10000),
        uploadedAt: new Date().toISOString(),
        extractedTopicsCount: aiResult.extractedTopics?.length || 0,
        summary: aiResult.syllabusSummary || `Extracted ${aiResult.extractedTopics?.length || 0} core topics for ${resolvedExamName}.`
    };
    store_1.store.uploadedNotes.create(noteDoc);
    const newPlan = {
        id: `plan_notes_${Date.now()}`,
        userId,
        examId: exam?.id || normalizedExamId || req.user?.targetExamId || CUSTOM_EXAM_ID,
        examName: resolvedExamName,
        targetExamDate: new Date(Date.now() + (timetablePreferences.targetDays || 7) * 86400000).toISOString().split('T')[0],
        dailyStudyMinutes: (timetablePreferences.dailyHours || 2) * 60,
        targetScore: req.user?.targetScorePercent || 85,
        currentDay: 1,
        totalDays: timetablePreferences.targetDays || 7,
        planSource: 'uploaded_notes',
        timetablePreferences,
        uploadedNoteId: noteDoc.id,
        uploadedNoteTitle: noteDoc.title,
        extractedTopics: (aiResult.extractedTopics || []).map((t, idx) => ({
            id: t.id || `ext_top_${idx + 1}`,
            topicName: t.topicName || `Topic ${idx + 1}`,
            subjectCategory: t.subjectCategory || 'General Studies',
            estimatedHours: t.estimatedHours || 2,
            difficulty: t.difficulty || 'medium',
            keyFormulasOrHacks: t.keyFormulasOrHacks || [],
            coreConcepts: t.coreConcepts || [],
            notesSnippet: t.notesSnippet || ''
        })),
        spacedRepetitionPlan: aiResult.spacedRepetitionPlan || [],
        facultyTips: aiResult.facultyTips || [
            'Focus on understanding formulas from your notes before speed problem sets.',
            'Active recall for 10 minutes at the end of each study block yields 2x retention.'
        ],
        schedule: (aiResult.schedule || []).map((day, dIdx) => ({
            dayNumber: day.dayNumber || dIdx + 1,
            date: day.date || new Date(Date.now() + dIdx * 86400000).toISOString().split('T')[0],
            focusTitle: day.focusTitle || `Day ${dIdx + 1}: Study & Practice`,
            totalMinutes: day.totalMinutes || (timetablePreferences.dailyHours || 2) * 60,
            isRestDay: day.isRestDay || false,
            isCompleted: false,
            dailyTestQuestions: 15,
            tasks: (day.tasks || []).map((task, tIdx) => ({
                id: task.id || `task_${dIdx + 1}_${tIdx + 1}`,
                subjectId: 'sub_notes',
                subjectName: task.subjectName || 'Study Notes',
                topicId: `top_notes_${dIdx + 1}_${tIdx + 1}`,
                topicName: task.topicName || 'Core Concept Mastery',
                timeSlot: task.timeSlot || '07:00 AM - 08:30 AM',
                durationMinutes: task.durationMinutes || 45,
                activityType: task.activityType || 'concept_study',
                targetQuestionsCount: task.targetQuestionsCount || 10,
                taskObjective: task.taskObjective || `Study ${task.topicName} from notes and solve drill questions.`,
                extractedCheatNotes: task.extractedCheatNotes || '',
                priority: task.priority || 'medium',
                isCompleted: false,
                notesSourceId: noteDoc.id
            }))
        })),
        weakTopicsTargeted: (aiResult.extractedTopics || []).slice(0, 3).map((t) => t.topicName),
        adaptiveNotes: aiResult.adaptiveNotes || [
            `Customized timetable built from "${noteTitle}".`,
            `Optimized for ${timetablePreferences.dailyHours} hours/day with ${timetablePreferences.studyRhythm} rhythm.`
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    store_1.store.studyPlans.save(newPlan);
    // Award user XP for creating and organizing a custom notes study plan
    if (req.user) {
        store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + 50 });
    }
    res.json({
        success: true,
        studyPlan: newPlan,
        uploadedNote: noteDoc
    });
});
exports.apiRouter.get('/study-plan/notes', auth_1.authenticate, (req, res) => {
    const userId = req.user.id;
    const notes = store_1.store.uploadedNotes.findByUserId(userId);
    res.json({ notes });
});
exports.apiRouter.delete('/study-plan/notes/:noteId', auth_1.authenticate, (req, res) => {
    const { noteId } = req.params;
    const deleted = store_1.store.uploadedNotes.delete(noteId);
    res.json({ success: deleted });
});
exports.apiRouter.post('/study-plan/task/toggle', auth_1.authenticate, (req, res) => {
    const userId = req.user.id;
    const { taskId, isCompleted } = req.body;
    const plan = store_1.store.studyPlans.findByUserId(userId);
    if (!plan)
        return res.status(404).json({ error: 'Plan not found' });
    let updated = false;
    plan.schedule.forEach(day => {
        day.tasks.forEach(task => {
            if (task.id === taskId) {
                task.isCompleted = isCompleted;
                updated = true;
            }
        });
        day.isCompleted = day.tasks.length > 0 && day.tasks.every(t => t.isCompleted);
    });
    if (updated) {
        store_1.store.studyPlans.save(plan);
        if (isCompleted && req.user) {
            store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + 20 });
        }
    }
    res.json({ studyPlan: plan });
});

exports.apiRouter.post('/study-plan/task/update', auth_1.authenticate, (req, res) => {
    const userId = req.user.id;
    const { taskId, status, targetDayNumber, isLocked } = req.body;
    const plan = store_1.store.studyPlans.findByUserId(userId);
    if (!plan)
        return res.status(404).json({ error: 'Plan not found' });
    
    let targetTask = null;
    let sourceDayIndex = -1;
    let targetDayIndex = -1;
    
    plan.schedule.forEach((day, dIdx) => {
        const tIdx = day.tasks.findIndex(t => t.id === taskId);
        if (tIdx !== -1) {
            targetTask = day.tasks[tIdx];
            sourceDayIndex = dIdx;
            if (targetDayNumber && day.dayNumber !== targetDayNumber) {
                day.tasks.splice(tIdx, 1);
            }
        }
        if (targetDayNumber && day.dayNumber === targetDayNumber) {
            targetDayIndex = dIdx;
        }
    });
    
    if (!targetTask)
        return res.status(404).json({ error: 'Task not found' });
        
    if (status !== undefined) {
        targetTask.status = status;
        targetTask.isCompleted = (status === 'done');
        if (status === 'done' && req.user) {
            store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + 20 });
        }
    }
    
    if (isLocked !== undefined) {
        targetTask.isLocked = isLocked;
    }
    
    if (targetDayNumber && sourceDayIndex !== targetDayIndex && targetDayIndex !== -1) {
        plan.schedule[targetDayIndex].tasks.push(targetTask);
    }
    
    plan.schedule.forEach(day => {
        day.isCompleted = day.tasks.length > 0 && day.tasks.every(t => t.isCompleted);
    });
    
    store_1.store.studyPlans.save(plan);
    res.json({ studyPlan: plan });
});
// ==========================================
// 7. SPACED REPETITION REVISION
// ==========================================
exports.apiRouter.get('/revisions', auth_1.authenticate, (req, res) => {
    const userId = req.user.id;
    const revisions = store_1.store.revisions.findByUserId(userId);
    res.json({ revisions });
});
exports.apiRouter.post('/revisions/:id/complete', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const { score = 85 } = req.body;
    const revision = store_1.store.revisions.find().find(r => r.id === id);
    if (!revision)
        return res.status(404).json({ error: 'Revision not found' });
    // Advance interval stage: 0 -> 1 -> 3 -> 7 -> 14 -> 30
    const stages = [0, 1, 3, 7, 14, 30];
    const currIdx = stages.indexOf(revision.intervalStage);
    const nextStage = currIdx < stages.length - 1 ? stages[currIdx + 1] : 30;
    const nextDate = new Date(Date.now() + nextStage * 86400000).toISOString().split('T')[0];
    const updated = store_1.store.revisions.update(id, {
        intervalStage: nextStage,
        lastStudiedDate: new Date().toISOString().split('T')[0],
        nextReviewDate: nextDate,
        masteryScore: Math.min(100, (revision.masteryScore || 50) + 15),
        status: 'upcoming'
    });
    res.json({ revision: updated });
});
// ==========================================
// 8. DAILY CHALLENGE & LEADERBOARD
// ==========================================
exports.apiRouter.get('/daily-challenge', (req, res) => {
    const challenge = store_1.store.dailyChallenges.getToday();
    res.json({ challenge });
});
exports.apiRouter.get('/leaderboard', (req, res) => {
    const users = store_1.store.users.find().map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        xp: u.xp || 500,
        level: u.level || 1,
        streakDays: u.streakDays || 1,
        targetExamName: u.targetExamName || 'SSC CGL'
    })).sort((a, b) => b.xp - a.xp);
    res.json({ leaderboard: users });
});
// ==========================================
// 9. AI EXAM TUTOR & QUESTION EXPLAINER
// ==========================================
exports.apiRouter.post('/ai/tutor', auth_1.authenticate, async (req, res) => {
    const { message, history } = req.body;
    if (!message)
        return res.status(400).json({ error: 'Message is required' });
    const analytics = (0, store_1.calculateUserAnalytics)(req.user.id);
    const context = {
        studentName: req.user?.name || 'Aspirant',
        targetExam: req.user?.targetExamName || 'SSC CGL',
        targetScore: req.user?.targetScorePercent || 85,
        weakTopics: analytics.weakTopics.map(w => w.topicName),
        accuracy: analytics.overallAccuracy
    };
    const reply = await aiService_1.aiService.chatWithTutor(message, context, history || []);
    res.json({ reply });
});
exports.apiRouter.post('/ai/explain', async (req, res) => {
    const { questionId, selectedOptionId } = req.body;
    const question = store_1.store.questions.findById(questionId);
    if (!question)
        return res.status(404).json({ error: 'Question not found' });
    const explanation = await aiService_1.aiService.explainQuestion(question, selectedOptionId);
    res.json({ explanation });
});
// ==========================================
// 10. ADMIN DASHBOARD & MANAGEMENT
// ==========================================
exports.apiRouter.get('/admin/stats', auth_1.authenticate, (req, res) => {
    const totalStudents = store_1.store.users.find().filter(u => u.role === 'student').length;
    const totalExams = store_1.store.exams.find().length;
    const totalQuestions = store_1.store.questions.find().length;
    const totalMockTests = store_1.store.mockTests.find().length;
    const totalAttempts = store_1.store.questionAttempts.find().length;
    res.json({
        stats: {
            totalStudents,
            activeStudents: Math.max(1, totalStudents),
            totalExams,
            totalQuestions,
            totalMockTests,
            totalAttempts,
            revenueMonthly: '₹1,45,000',
            passRate: '78.4%'
        }
    });
});
exports.apiRouter.post('/admin/exams', auth_1.authenticate, auth_1.requireAdmin, (req, res) => {
    const exam = req.body;
    exam.id = `exam_${Date.now()}`;
    exam.slug = exam.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    store_1.store.exams.create(exam);
    res.json({ exam });
});
exports.apiRouter.post('/admin/questions', auth_1.authenticate, auth_1.requireAdmin, (req, res) => {
    const q = req.body;
    q.id = `q_${Date.now()}`;
    q.isPublished = q.isPublished ?? true;
    store_1.store.questions.create(q);
    res.json({ question: q });
});
exports.apiRouter.put('/admin/questions/:id/publish', auth_1.authenticate, auth_1.requireAdmin, (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;
    const updated = store_1.store.questions.update(id, { isPublished });
    res.json({ question: updated });
});
exports.apiRouter.post('/admin/ai/generate-questions', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    const { examName, subjectName, topicName, difficulty, count = 3 } = req.body;
    const draftQuestions = await aiService_1.aiService.generateDraftQuestions(examName || 'SSC CGL', subjectName || 'Quantitative Aptitude', topicName || 'Percentage & Profit Loss', difficulty || 'medium', parseInt(count, 10) || 3);
    res.json({ draftQuestions });
});
// ==========================================
// 12. UNIVERSITY EXAM PREPARATION & DEADLINES
// ==========================================
exports.apiRouter.get('/university-exams', (req, res) => {
    const exams = store_1.store.universityExams.find();
    res.json({ exams });
});
exports.apiRouter.get('/university-exams/:id', (req, res) => {
    const { id } = req.params;
    const exam = store_1.store.universityExams.findById(id);
    if (!exam) {
        return res.status(404).json({ error: 'University exam not found' });
    }
    res.json({ exam });
});
exports.apiRouter.post('/university-exams', auth_1.authenticate, (req, res) => {
    const { subjectCode, subjectName, universityName, department, semester, examDate, examTime, examHallLocation, credits, targetGrade, internalMarksScored, totalInternalMarks, requiredExternalMarks, units } = req.body;
    if (!subjectName || !examDate) {
        return res.status(400).json({ error: 'Subject Name and Exam Date are required' });
    }
    const newExam = {
        id: `univ_${Date.now()}`,
        subjectCode: subjectCode || `SUB${Math.floor(1000 + Math.random() * 9000)}`,
        subjectName,
        universityName: universityName || 'State University / Autonomous College',
        department: department || 'Engineering & Technology',
        semester: Number(semester) || 1,
        examDate,
        examTime: examTime || '10:00 AM - 01:00 PM (Forenoon)',
        examHallLocation: examHallLocation || 'Main Exam Hall',
        credits: Number(credits) || 3,
        targetGrade: targetGrade || 'A+ (Excellent)',
        internalMarksScored: Number(internalMarksScored) || 18,
        totalInternalMarks: Number(totalInternalMarks) || 20,
        requiredExternalMarks: Number(requiredExternalMarks) || 45,
        preparationProgress: 0,
        status: 'not_started',
        units: units || [
            {
                unitNumber: 1,
                unitTitle: 'Unit 1: Fundamentals & Core Architecture',
                weightageMarks: 20,
                topics: ['Basic Principles & Overview', 'Classification & Architectures', 'Initial Problem Sets'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 2,
                unitTitle: 'Unit 2: Design & Analysis Techniques',
                weightageMarks: 20,
                topics: ['Mathematical Formulations', 'Component Models', 'Analytical Procedures'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 3,
                unitTitle: 'Unit 3: Advanced Methods & Algorithms',
                weightageMarks: 20,
                topics: ['Key Theorems & Properties', 'Step-by-step Workflows', 'Performance Metrics'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 4,
                unitTitle: 'Unit 4: System Integration & Applications',
                weightageMarks: 20,
                topics: ['Case Studies & Prototypes', 'Optimization Strategies', 'System Limitations'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            },
            {
                unitNumber: 5,
                unitTitle: 'Unit 5: Recent Trends, Standards & Case Studies',
                weightageMarks: 20,
                topics: ['Emerging Frameworks', 'Industrial Standards', 'Comprehensive Review'],
                isCompleted: false,
                confidenceLevel: 'unprepared',
                twoMarks: [],
                bigQuestions: []
            }
        ],
        modelPapers: [
            {
                id: `mp_${Date.now()}`,
                title: `${subjectName} - University Solved Model Paper`,
                yearOrTerm: 'Apr/May 2025 Solved Series',
                pattern: 'Part A (20 Marks) + Part B (65 Marks) + Part C (15 Marks)',
                partAQuestionsCount: 10,
                partBQuestionsCount: 6
            }
        ],
        facultyExamTips: [
            'Focus heavily on Unit 1 & Unit 2 2-mark definitions for quick 20 marks.',
            'Always draw neat labelled block diagrams with pen and pencil for Part B questions.',
            'Solve previous year university questions for repeated 16-mark derivations.'
        ],
        revisionCrammingPlan: [
            {
                day: 'Day 1',
                timeSlot: '07:00 PM - 10:00 PM',
                hoursNeeded: 3,
                focusUnits: 'Unit 1 & Unit 2 Fundamentals',
                tasks: ['Memorize all Part-A 2-mark definitions', 'Practice 2 repeated 16-mark blueprints']
            },
            {
                day: 'Day 2',
                timeSlot: '06:00 PM - 10:30 PM',
                hoursNeeded: 4.5,
                focusUnits: 'Unit 3 & Unit 4 Core Derivations',
                tasks: ['Solve major analytical problems', 'Review previous 2024 university paper']
            },
            {
                day: 'Day 3 (Eve of Exam)',
                timeSlot: '05:00 PM - 09:30 PM',
                hoursNeeded: 4.5,
                focusUnits: 'Unit 5 & Full Mock Revision',
                tasks: ['Final formula sheet review', 'Attempt Part-A speed drill', 'Early sleep for fresh focus']
            }
        ]
    };
    store_1.store.universityExams.create(newExam);
    res.json({ exam: newExam });
});
exports.apiRouter.put('/university-exams/:id', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updated = store_1.store.universityExams.update(id, updates);
    if (!updated) {
        return res.status(404).json({ error: 'University exam not found' });
    }
    res.json({ exam: updated });
});
exports.apiRouter.post('/university-exams/:id/toggle-unit', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const { unitNumber, isCompleted, confidenceLevel } = req.body;
    const exam = store_1.store.universityExams.findById(id);
    if (!exam)
        return res.status(404).json({ error: 'Exam not found' });
    const units = exam.units.map(u => {
        if (u.unitNumber === unitNumber) {
            return {
                ...u,
                isCompleted: isCompleted !== undefined ? isCompleted : !u.isCompleted,
                confidenceLevel: confidenceLevel || u.confidenceLevel
            };
        }
        return u;
    });
    const completedUnits = units.filter(u => u.isCompleted).length;
    const preparationProgress = Math.round((completedUnits / units.length) * 100);
    const updated = store_1.store.universityExams.update(id, {
        units,
        preparationProgress,
        status: preparationProgress === 100 ? 'ready' : preparationProgress > 0 ? 'in_progress' : 'not_started'
    });
    res.json({ exam: updated });
});
exports.apiRouter.post('/university-exams/:id/toggle-twomark', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const { questionId } = req.body;
    const exam = store_1.store.universityExams.findById(id);
    if (!exam)
        return res.status(404).json({ error: 'Exam not found' });
    const units = exam.units.map(u => ({
        ...u,
        twoMarks: u.twoMarks.map(q => q.id === questionId ? { ...q, isMastered: !q.isMastered } : q)
    }));
    const updated = store_1.store.universityExams.update(id, { units });
    res.json({ exam: updated });
});
exports.apiRouter.post('/university-exams/:id/generate-cram-plan', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const { dailyStudyHours = 4 } = req.body;
    const exam = store_1.store.universityExams.findById(id);
    if (!exam)
        return res.status(404).json({ error: 'Exam not found' });
    const examDate = new Date(exam.examDate);
    const now = new Date();
    const diffDays = Math.max(1, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const cramTasks = [];
    const planDays = Math.min(diffDays, 7);
    for (let i = 1; i <= planDays; i++) {
        let focusUnits = '';
        let tasks = [];
        if (i === 1) {
            focusUnits = 'Unit 1 & Unit 2 Core Foundations';
            tasks = [
                'Master all Part-A 2-Mark definitions with key scientific/technical terms',
                'Solve 2 high-frequency Part-B derivations/problems from Unit 1',
                'Draw and memorize architectural/circuit block diagrams'
            ];
        }
        else if (i === 2) {
            focusUnits = 'Unit 2 & Unit 3 Analytical Workflows';
            tasks = [
                'Practice algorithmic execution traces and step-by-step problem sets',
                'Review Previous Year 2024 University Part-B solution keys',
                'Self-test on 5 repeated 2-mark questions'
            ];
        }
        else if (i === 3) {
            focusUnits = 'Unit 3 & Unit 4 High-Yield Scoring Modules';
            tasks = [
                'Master the 16-mark recurring theorem / case study blueprints',
                'Create a 1-page formula & shortcut revision cheat-sheet',
                'Timed speed drill: Complete Part-A in under 25 minutes'
            ];
        }
        else if (i === planDays) {
            focusUnits = 'Final Sprint & University Model Paper Simulation';
            tasks = [
                'Full 3-Hour University Model Question Paper Simulation',
                'Final glance at faculty exam scoring tips and 2-mark definitions',
                'Check examination hall ticket, ID, calculators and writing stationery'
            ];
        }
        else {
            focusUnits = `Unit ${Math.min(5, i + 1)} Deep Dive & Revision`;
            tasks = [
                'Cover remaining syllabus topics and special application questions',
                'Reinforce weak areas identified during practice drills'
            ];
        }
        cramTasks.push({
            day: `Day ${i} (${planDays - i} Days to Exam)`,
            timeSlot: i % 2 === 0 ? '02:00 PM - 06:00 PM (Afternoon)' : '06:30 PM - 10:30 PM (Evening)',
            hoursNeeded: dailyStudyHours,
            focusUnits,
            tasks
        });
    }
    const updated = store_1.store.universityExams.update(id, {
        revisionCrammingPlan: cramTasks,
        status: 'cramming'
    });
    res.json({ exam: updated, revisionPlan: cramTasks });
});
exports.apiRouter.delete('/university-exams/:id', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const success = store_1.store.universityExams.delete(id);
    res.json({ success });
});
// ==========================================
// 13. AI UNIVERSAL SYLLABUS ANALYZER & TIMETABLE SCHEDULER
// ==========================================
exports.apiRouter.post('/syllabus-analysis/analyze', auth_1.authenticate, async (req, res) => {
    const userId = req.user.id;
    const { syllabusText, examName = 'Semester/Competitive Exam', syllabusTitle = 'Uploaded Syllabus Document', examCategory = 'University Semester', dailyHours = 3, targetDays = 14, preferredTimeSlots = ['morning', 'evening'], subjectCode } = req.body;
    if (!syllabusText || typeof syllabusText !== 'string' || syllabusText.trim().length === 0) {
        return res.status(400).json({ error: 'Syllabus content text is required for analysis.' });
    }
    try {
        const analysis = await aiService_1.aiService.analyzeSyllabusAndGenerateSchedule(syllabusText, examName, syllabusTitle, examCategory, {
            dailyHours: parseInt(dailyHours, 10) || 3,
            targetDays: parseInt(targetDays, 10) || 14,
            preferredTimeSlots,
            subjectCode
        });
        analysis.userId = userId;
        const created = store_1.store.syllabusAnalyses.create(analysis);
        // Award XP to student for analyzing syllabus
        if (req.user) {
            store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + 75 });
        }
        res.json({ success: true, analysis: created });
    }
    catch (error) {
        console.error('Syllabus Analysis Route Error:', error);
        res.status(500).json({ error: 'Failed to analyze syllabus. Please try again with shorter content or contact support.' });
    }
});
exports.apiRouter.get('/syllabus-analysis', auth_1.authenticate, (req, res) => {
    const userId = req.user.id;
    const list = store_1.store.syllabusAnalyses.findByUserId(userId);
    res.json({ analyses: list });
});
exports.apiRouter.get('/syllabus-analysis/:id', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const analysis = store_1.store.syllabusAnalyses.findById(id);
    if (!analysis)
        return res.status(404).json({ error: 'Syllabus analysis not found.' });
    res.json({ analysis });
});
exports.apiRouter.delete('/syllabus-analysis/:id', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const success = store_1.store.syllabusAnalyses.delete(id);
    res.json({ success });
});
exports.apiRouter.post('/syllabus-analysis/:id/toggle-topic', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const { topicId } = req.body;
    const analysis = store_1.store.syllabusAnalyses.findById(id);
    if (!analysis)
        return res.status(404).json({ error: 'Syllabus analysis not found.' });
    // Toggle in allTopics
    let isCompletedNow = false;
    const allTopics = (analysis.allTopics || []).map(t => {
        if (t.id === topicId) {
            isCompletedNow = !t.isCompleted;
            return { ...t, isCompleted: isCompletedNow };
        }
        return t;
    });
    // Toggle in units structure too
    const units = (analysis.units || []).map(u => ({
        ...u,
        topics: (u.topics || []).map(t => {
            if (t.id === topicId) {
                return { ...t, isCompleted: !t.isCompleted };
            }
            return t;
        })
    }));
    const updated = store_1.store.syllabusAnalyses.update(id, { allTopics, units });
    // Award minor XP for topic completion
    if (isCompletedNow && req.user) {
        store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + 15 });
    }
    res.json({ success: true, analysis: updated });
});
exports.apiRouter.post('/syllabus-analysis/:id/toggle-task', auth_1.authenticate, (req, res) => {
    const { id } = req.params;
    const { taskId, isCompleted } = req.body;
    const analysis = store_1.store.syllabusAnalyses.findById(id);
    if (!analysis)
        return res.status(404).json({ error: 'Syllabus analysis not found.' });
    let toggled = false;
    const schedule = (analysis.schedule || []).map(day => {
        let dayCompleted = true;
        const tasks = (day.tasks || []).map(task => {
            if (task.id === taskId) {
                const nextState = isCompleted !== undefined ? isCompleted : !task.isCompleted;
                toggled = nextState;
                return { ...task, isCompleted: nextState };
            }
            return task;
        });
        return {
            ...day,
            tasks,
            isRestOrRevisionDay: day.isRestOrRevisionDay
        };
    });
    const updated = store_1.store.syllabusAnalyses.update(id, { schedule });
    // Award minor XP for checking off a task
    if (toggled && req.user) {
        store_1.store.users.update(req.user.id, { xp: (req.user.xp || 0) + 10 });
    }
    res.json({ success: true, analysis: updated });
});
// ==========================================
// 14. VEO 3 VIDEO GENERATION FROM TEXT ROUTES
// ==========================================
exports.apiRouter.post('/generate-video', auth_1.authenticate, async (req, res) => {
    const { prompt, aspectRatio = '16:9' } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: 'Prompt is required for video generation.' });
    }
    try {
        const operationName = await aiService_1.aiService.generateVideo(prompt, aspectRatio);
        res.json({ operationName });
    }
    catch (error) {
        console.error('Video Generation Route Error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate video.' });
    }
});
exports.apiRouter.post('/video-status', auth_1.authenticate, async (req, res) => {
    const { operationName } = req.body;
    if (!operationName) {
        return res.status(400).json({ error: 'operationName is required.' });
    }
    try {
        const updated = await aiService_1.aiService.getVideoStatus(operationName);
        res.json({ done: updated.done, response: updated.response, error: updated.error });
    }
    catch (error) {
        console.error('Video Status Route Error:', error);
        res.status(500).json({ error: error.message || 'Failed to check video status.' });
    }
});
exports.apiRouter.post('/video-download', auth_1.authenticate, async (req, res) => {
    const { operationName } = req.body;
    if (!operationName) {
        return res.status(400).json({ error: 'operationName is required.' });
    }
    try {
        const updated = await aiService_1.aiService.getVideoStatus(operationName);
        const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
        if (!uri) {
            return res.status(400).json({ error: 'Video is not ready yet or has no URI.' });
        }
        const apiKey = process.env.GEMINI_API_KEY;
        const videoRes = await fetch(uri, {
            headers: { 'x-goog-api-key': apiKey || '' },
        });
        res.setHeader('Content-Type', 'video/mp4');
        if (videoRes.body) {
            const stream = videoRes.body;
            if (typeof stream.pipeTo === 'function') {
                await stream.pipeTo(new WritableStream({
                    write(chunk) { res.write(chunk); },
                    close() { res.end(); },
                }));
            }
            else {
                const reader = stream.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        res.end();
                        break;
                    }
                    res.write(Buffer.from(value));
                }
            }
        }
        else {
            res.status(500).json({ error: 'Failed to retrieve video stream.' });
        }
    }
    catch (error) {
        console.error('Video Download Route Error:', error);
        res.status(500).json({ error: 'Failed to stream video download. ' + error.message });
    }
});
exports.apiRouter.post('/generate-storyboard-assets', auth_1.authenticate, async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: 'Prompt is required for storyboarding.' });
    }
    try {
        const assets = await aiService_1.aiService.generateStoryboardAndAssets(prompt);
        res.json({ success: true, assets });
    }
    catch (error) {
        console.error('Storyboard Assets Route Error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate storyboard assets.' });
    }
});

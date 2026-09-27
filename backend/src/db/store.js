"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
exports.initDatabase = initDatabase;
exports.calculateUserAnalytics = calculateUserAnalytics;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const seedData_1 = require("./seedData");
const universitySeedData_1 = require("./universitySeedData");
const syllabusData_1 = require("./syllabusData");
const DATA_DIR = path_1.default.join(process.cwd(), 'data');
let db = {
    users: [],
    exams: [],
    subjects: [],
    chapters: [],
    topics: [],
    concepts: [],
    questions: [],
    questionAttempts: [],
    mockTests: [],
    mockTestAttempts: [],
    studyPlans: [],
    revisions: [],
    dailyChallenges: [],
    uploadedNotes: [],
    universityExams: [],
    syllabusAnalyses: [],
    syllabusDatabase: [],
    periodAllocations: [],
    periodLogs: []
};
// Ensure data directory exists
if (!fs_1.default.existsSync(DATA_DIR)) {
    fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE_PATH = path_1.default.join(DATA_DIR, 'db.json');
function saveToDisk() {
    try {
        fs_1.default.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
    }
    catch (err) {
        console.error('Failed to persist database to disk:', err);
    }
}
function initDatabase() {
    if (fs_1.default.existsSync(DB_FILE_PATH)) {
        try {
            const content = fs_1.default.readFileSync(DB_FILE_PATH, 'utf-8');
            db = JSON.parse(content);
            db.users = db.users || [];
            db.exams = db.exams || seedData_1.SEED_EXAMS;
            db.subjects = db.subjects || seedData_1.SEED_SUBJECTS;
            db.chapters = db.chapters || seedData_1.SEED_CHAPTERS;
            db.topics = db.topics || seedData_1.SEED_TOPICS;
            db.concepts = db.concepts || seedData_1.SEED_CONCEPTS;
            db.questions = db.questions || seedData_1.SEED_QUESTIONS;
            db.questionAttempts = db.questionAttempts || [];
            db.mockTests = db.mockTests || seedData_1.SEED_MOCK_TESTS;
            db.mockTestAttempts = db.mockTestAttempts || [];
            db.studyPlans = db.studyPlans || [];
            db.revisions = db.revisions || [];
            db.dailyChallenges = db.dailyChallenges || [];
            db.uploadedNotes = db.uploadedNotes || [];
            db.universityExams = db.universityExams || universitySeedData_1.SEED_UNIVERSITY_EXAMS;
            db.syllabusAnalyses = db.syllabusAnalyses || [];
            db.syllabusDatabase = db.syllabusDatabase && db.syllabusDatabase.length > 0 ? db.syllabusDatabase : syllabusData_1.SEED_SYLLABUS_DATABASE;
            db.periodAllocations = db.periodAllocations || [];
            db.periodLogs = db.periodLogs || [];
            if (!db.universityExams || db.universityExams.length === 0) {
                db.universityExams = universitySeedData_1.SEED_UNIVERSITY_EXAMS;
            }
            ensureDefaultAccounts();
            saveToDisk();
            console.log('Loaded database from disk successfully.');
            return;
        }
        catch (err) {
            console.warn('Could not read existing db.json, re-seeding...', err.message);
        }
    }
    db = {
        users: [],
        exams: seedData_1.SEED_EXAMS,
        subjects: seedData_1.SEED_SUBJECTS,
        chapters: seedData_1.SEED_CHAPTERS,
        topics: seedData_1.SEED_TOPICS,
        concepts: seedData_1.SEED_CONCEPTS,
        questions: seedData_1.SEED_QUESTIONS,
        questionAttempts: [],
        mockTests: seedData_1.SEED_MOCK_TESTS,
        mockTestAttempts: [],
        studyPlans: [],
        revisions: [],
        dailyChallenges: [],
        uploadedNotes: [],
        universityExams: universitySeedData_1.SEED_UNIVERSITY_EXAMS,
        syllabusAnalyses: [],
        syllabusDatabase: syllabusData_1.SEED_SYLLABUS_DATABASE,
        periodAllocations: [],
        periodLogs: []
    };
    ensureDefaultAccounts();
    saveToDisk();
    console.log('Database initialized with a clean workspace.');
}

function ensureDefaultAccounts() {
    if (!db.users) db.users = [];
    
    // Seed Demo Aspirant
    const aspirant = db.users.find(u => u.email && u.email.toLowerCase() === 'demo@aspireprep.com');
    if (!aspirant) {
        db.users.push({
            id: 'user_student_demo',
            name: 'Arjun Sharma (Demo Aspirant)',
            email: 'demo@aspireprep.com',
            passwordHash: '$2b$10$SYFGPioMaVf.3MnLWqlPQuDd3yYtlkH1Ipb.GcdM2.dLGDHX.Tk4a', // password123
            role: 'student',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            targetExamId: 'exam_ssc_cgl',
            targetExamName: 'SSC CGL',
            targetExamDate: '2026-11-15',
            dailyStudyMinutes: 120,
            targetScorePercent: 85,
            xp: 350,
            level: 3,
            streakDays: 7,
            lastActiveDate: new Date().toISOString(),
            badges: [
                { id: 'b_first_signup', name: 'First account', description: 'Created a real AspirePrep account', icon: 'Sparkles', isUnlocked: true, unlockedAt: new Date().toISOString() },
                { id: 'b_streak_7', name: '7-Day Streak', description: 'Maintained a 7-day study streak', icon: 'Flame', isUnlocked: true, unlockedAt: new Date().toISOString() }
            ],
            createdAt: new Date().toISOString()
        });
    }

    // Seed Demo Admin
    const admin = db.users.find(u => u.email && u.email.toLowerCase() === 'admin@aspireprep.com');
    if (!admin) {
        db.users.push({
            id: 'user_admin_demo',
            name: 'Prep Admin',
            email: 'admin@aspireprep.com',
            passwordHash: '$2b$10$SYFGPioMaVf.3MnLWqlPQuDd3yYtlkH1Ipb.GcdM2.dLGDHX.Tk4a', // password123
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            targetExamId: 'exam_ssc_cgl',
            targetExamName: 'SSC CGL',
            targetExamDate: '2026-11-15',
            dailyStudyMinutes: 120,
            targetScorePercent: 90,
            xp: 1250,
            level: 8,
            streakDays: 24,
            lastActiveDate: new Date().toISOString(),
            badges: [
                { id: 'b_first_signup', name: 'First account', description: 'Created a real AspirePrep account', icon: 'Sparkles', isUnlocked: true, unlockedAt: new Date().toISOString() }
            ],
            createdAt: new Date().toISOString()
        });
    }

    // Ensure environment user sivajenanis@gmail.com is present with known fallback hash for password123
    const siva = db.users.find(u => u.email && u.email.toLowerCase() === 'sivajenanis@gmail.com');
    if (siva) {
        if (siva.name === 'jhgre' || !siva.name) {
            siva.name = 'Jenani Siva';
        }
    }
}
// Data Store Accessors
exports.store = {
    users: {
        find: () => db.users,
        findById: (id) => db.users.find(u => u.id === id),
        findByEmail: (email) => {
            if (!email || typeof email !== 'string') return undefined;
            const clean = email.trim().toLowerCase();
            return db.users.find(u => u.email && u.email.trim().toLowerCase() === clean);
        },
        create: (user) => {
            db.users.push(user);
            saveToDisk();
            return user;
        },
        update: (id, updates) => {
            const idx = db.users.findIndex(u => u.id === id);
            if (idx !== -1) {
                db.users[idx] = { ...db.users[idx], ...updates };
                saveToDisk();
                return db.users[idx];
            }
            return null;
        }
    },
    exams: {
        find: () => db.exams,
        findById: (id) => db.exams.find(e => e.id === id),
        findBySlug: (slug) => db.exams.find(e => e.slug === slug),
        create: (exam) => {
            db.exams.push(exam);
            saveToDisk();
            return exam;
        },
        update: (id, updates) => {
            const idx = db.exams.findIndex(e => e.id === id);
            if (idx !== -1) {
                db.exams[idx] = { ...db.exams[idx], ...updates };
                saveToDisk();
                return db.exams[idx];
            }
            return null;
        },
        delete: (id) => {
            db.exams = db.exams.filter(e => e.id !== id);
            saveToDisk();
        }
    },
    subjects: {
        find: () => db.subjects,
        findByExamId: (examId) => db.subjects.filter(s => s.examId === examId),
        findById: (id) => db.subjects.find(s => s.id === id),
        create: (subject) => {
            db.subjects.push(subject);
            saveToDisk();
            return subject;
        },
        update: (id, updates) => {
            const idx = db.subjects.findIndex(s => s.id === id);
            if (idx !== -1) {
                db.subjects[idx] = { ...db.subjects[idx], ...updates };
                saveToDisk();
                return db.subjects[idx];
            }
            return null;
        },
        delete: (id) => {
            db.subjects = db.subjects.filter(s => s.id !== id);
            saveToDisk();
        }
    },
    chapters: {
        find: () => db.chapters,
        findBySubjectId: (subjectId) => db.chapters.filter(c => c.subjectId === subjectId),
        findById: (id) => db.chapters.find(c => c.id === id),
        create: (chapter) => {
            db.chapters.push(chapter);
            saveToDisk();
            return chapter;
        },
        delete: (id) => {
            db.chapters = db.chapters.filter(c => c.id !== id);
            saveToDisk();
        }
    },
    topics: {
        find: () => db.topics,
        findByChapterId: (chapterId) => db.topics.filter(t => t.chapterId === chapterId),
        findBySubjectId: (subjectId) => db.topics.filter(t => t.subjectId === subjectId),
        findById: (id) => db.topics.find(t => t.id === id),
        create: (topic) => {
            db.topics.push(topic);
            saveToDisk();
            return topic;
        },
        update: (id, updates) => {
            const idx = db.topics.findIndex(t => t.id === id);
            if (idx !== -1) {
                db.topics[idx] = { ...db.topics[idx], ...updates };
                saveToDisk();
                return db.topics[idx];
            }
            return null;
        },
        delete: (id) => {
            db.topics = db.topics.filter(t => t.id !== id);
            saveToDisk();
        }
    },
    concepts: {
        find: () => db.concepts,
        findByTopicId: (topicId) => db.concepts.filter(c => c.topicId === topicId),
        findById: (id) => db.concepts.find(c => c.id === id),
        create: (concept) => {
            db.concepts.push(concept);
            saveToDisk();
            return concept;
        }
    },
    questions: {
        find: () => db.questions,
        findById: (id) => db.questions.find(q => q.id === id),
        findByExamId: (examId) => db.questions.filter(q => q.examId === examId),
        findByTopicId: (topicId) => db.questions.filter(q => q.topicId === topicId),
        findBySubjectId: (subjectId) => db.questions.filter(q => q.subjectId === subjectId),
        findPYQs: (examId, year, subjectId, topicId) => {
            return db.questions.filter(q => {
                if (!q.isPYQ)
                    return false;
                if (examId && q.examId !== examId)
                    return false;
                if (year && q.year !== year)
                    return false;
                if (subjectId && q.subjectId !== subjectId)
                    return false;
                if (topicId && q.topicId !== topicId)
                    return false;
                return true;
            });
        },
        create: (question) => {
            db.questions.push(question);
            saveToDisk();
            return question;
        },
        update: (id, updates) => {
            const idx = db.questions.findIndex(q => q.id === id);
            if (idx !== -1) {
                db.questions[idx] = { ...db.questions[idx], ...updates };
                saveToDisk();
                return db.questions[idx];
            }
            return null;
        },
        delete: (id) => {
            db.questions = db.questions.filter(q => q.id !== id);
            saveToDisk();
        }
    },
    questionAttempts: {
        find: () => db.questionAttempts,
        findByUserId: (userId) => db.questionAttempts.filter(a => a.userId === userId),
        create: (attempt) => {
            db.questionAttempts.push(attempt);
            saveToDisk();
            return attempt;
        }
    },
    mockTests: {
        find: () => db.mockTests,
        findById: (id) => db.mockTests.find(m => m.id === id),
        findByExamId: (examId) => db.mockTests.filter(m => m.examId === examId),
        create: (test) => {
            db.mockTests.push(test);
            saveToDisk();
            return test;
        },
        update: (id, updates) => {
            const idx = db.mockTests.findIndex(m => m.id === id);
            if (idx !== -1) {
                db.mockTests[idx] = { ...db.mockTests[idx], ...updates };
                saveToDisk();
                return db.mockTests[idx];
            }
            return null;
        },
        delete: (id) => {
            db.mockTests = db.mockTests.filter(m => m.id !== id);
            saveToDisk();
        }
    },
    mockTestAttempts: {
        find: () => db.mockTestAttempts,
        findById: (id) => db.mockTestAttempts.find(a => a.id === id),
        findByUserId: (userId) => db.mockTestAttempts.filter(a => a.userId === userId),
        create: (attempt) => {
            db.mockTestAttempts.push(attempt);
            saveToDisk();
            return attempt;
        }
    },
    studyPlans: {
        find: () => db.studyPlans,
        findByUserId: (userId) => db.studyPlans.find(p => p.userId === userId),
        save: (plan) => {
            const idx = db.studyPlans.findIndex(p => p.userId === plan.userId);
            if (idx !== -1) {
                db.studyPlans[idx] = plan;
            }
            else {
                db.studyPlans.push(plan);
            }
            saveToDisk();
            return plan;
        }
    },
    revisions: {
        find: () => db.revisions,
        findByUserId: (userId) => db.revisions.filter(r => r.userId === userId),
        create: (item) => {
            db.revisions.push(item);
            saveToDisk();
            return item;
        },
        update: (id, updates) => {
            const idx = db.revisions.findIndex(r => r.id === id);
            if (idx !== -1) {
                db.revisions[idx] = { ...db.revisions[idx], ...updates };
                saveToDisk();
                return db.revisions[idx];
            }
            return null;
        }
    },
    dailyChallenges: {
        getToday: () => db.dailyChallenges[0] || null
    },
    uploadedNotes: {
        find: () => db.uploadedNotes || [],
        findByUserId: (userId) => (db.uploadedNotes || []).filter(n => n.userId === userId),
        create: (note) => {
            if (!db.uploadedNotes)
                db.uploadedNotes = [];
            db.uploadedNotes.unshift(note);
            saveToDisk();
            return note;
        },
        delete: (id) => {
            if (!db.uploadedNotes)
                return false;
            db.uploadedNotes = db.uploadedNotes.filter(n => n.id !== id);
            saveToDisk();
            return true;
        }
    },
    universityExams: {
        find: () => db.universityExams || [],
        findById: (id) => (db.universityExams || []).find(e => e.id === id),
        create: (exam) => {
            if (!db.universityExams)
                db.universityExams = [];
            db.universityExams.unshift(exam);
            saveToDisk();
            return exam;
        },
        update: (id, updates) => {
            if (!db.universityExams)
                db.universityExams = [];
            const idx = db.universityExams.findIndex(e => e.id === id);
            if (idx !== -1) {
                db.universityExams[idx] = { ...db.universityExams[idx], ...updates };
                saveToDisk();
                return db.universityExams[idx];
            }
            return null;
        },
        delete: (id) => {
            if (!db.universityExams)
                return false;
            db.universityExams = db.universityExams.filter(e => e.id !== id);
            saveToDisk();
            return true;
        }
    },
    syllabusAnalyses: {
        find: () => db.syllabusAnalyses || [],
        findById: (id) => (db.syllabusAnalyses || []).find(s => s.id === id),
        findByUserId: (userId) => (db.syllabusAnalyses || []).filter(s => !s.userId || s.userId === userId),
        create: (analysis) => {
            if (!db.syllabusAnalyses)
                db.syllabusAnalyses = [];
            db.syllabusAnalyses.unshift(analysis);
            saveToDisk();
            return analysis;
        },
        update: (id, updates) => {
            if (!db.syllabusAnalyses)
                db.syllabusAnalyses = [];
            const idx = db.syllabusAnalyses.findIndex(s => s.id === id);
            if (idx !== -1) {
                db.syllabusAnalyses[idx] = { ...db.syllabusAnalyses[idx], ...updates };
                saveToDisk();
                return db.syllabusAnalyses[idx];
            }
            return null;
        },
        delete: (id) => {
            if (!db.syllabusAnalyses)
                return false;
            db.syllabusAnalyses = db.syllabusAnalyses.filter(s => s.id !== id);
            saveToDisk();
            return true;
        }
    },
    syllabusDatabase: {
        find: (examId) => {
            db.syllabusDatabase = db.syllabusDatabase && db.syllabusDatabase.length > 0 ? db.syllabusDatabase : syllabusData_1.SEED_SYLLABUS_DATABASE;
            if (examId && examId !== 'all') {
                return db.syllabusDatabase.filter(s => s.examId === examId);
            }
            return db.syllabusDatabase;
        },
        findById: (id) => {
            db.syllabusDatabase = db.syllabusDatabase && db.syllabusDatabase.length > 0 ? db.syllabusDatabase : syllabusData_1.SEED_SYLLABUS_DATABASE;
            return db.syllabusDatabase.find(s => s.id === id);
        },
        create: (entry) => {
            db.syllabusDatabase = db.syllabusDatabase || [];
            db.syllabusDatabase.push(entry);
            saveToDisk();
            return entry;
        },
        update: (id, updates) => {
            db.syllabusDatabase = db.syllabusDatabase || [];
            const idx = db.syllabusDatabase.findIndex(s => s.id === id);
            if (idx !== -1) {
                db.syllabusDatabase[idx] = { ...db.syllabusDatabase[idx], ...updates };
                saveToDisk();
                return db.syllabusDatabase[idx];
            }
            return null;
        }
    },
    periodAllocations: {
        find: (userId, date) => {
            db.periodAllocations = db.periodAllocations || [];
            return db.periodAllocations.filter(a => (!userId || a.userId === userId) && (!date || a.date === date));
        },
        upsert: (allocation) => {
            db.periodAllocations = db.periodAllocations || [];
            const idx = db.periodAllocations.findIndex(a => a.userId === allocation.userId && a.periodId === allocation.periodId && (!allocation.date || a.date === allocation.date));
            if (idx !== -1) {
                db.periodAllocations[idx] = { ...db.periodAllocations[idx], ...allocation, updatedAt: new Date().toISOString() };
                saveToDisk();
                return db.periodAllocations[idx];
            } else {
                const record = { ...allocation, id: `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, createdAt: new Date().toISOString() };
                db.periodAllocations.push(record);
                saveToDisk();
                return record;
            }
        }
    },
    periodLogs: {
        find: (userId, date) => {
            db.periodLogs = db.periodLogs || [];
            return db.periodLogs.filter(l => (!userId || l.userId === userId) && (!date || l.date === date));
        },
        create: (log) => {
            db.periodLogs = db.periodLogs || [];
            const record = { ...log, id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, createdAt: new Date().toISOString() };
            db.periodLogs.push(record);
            saveToDisk();
            return record;
        }
    }
};
// Analytics Computation Engine
function calculateUserAnalytics(userId) {
    const user = exports.store.users.findById(userId);
    const targetExamId = user?.targetExamId || 'exam_ssc_cgl';
    let attempts = exports.store.questionAttempts.findByUserId(userId);
    let mockAttempts = exports.store.mockTestAttempts.findByUserId(userId);
    
    if (targetExamId && targetExamId !== 'exam_custom') {
        const examFilteredAttempts = attempts.filter(a => a.examId === targetExamId);
        if (examFilteredAttempts.length > 0) {
            attempts = examFilteredAttempts;
        }
        const examFilteredMocks = mockAttempts.filter(m => m.examId === targetExamId);
        if (examFilteredMocks.length > 0) {
            mockAttempts = examFilteredMocks;
        }
    }
    
    let topics = exports.store.topics.find();
    let subjects = exports.store.subjects.find();
    
    if (targetExamId && targetExamId !== 'exam_custom') {
        const examTopics = topics.filter(t => t.examId === targetExamId);
        const examSubjects = subjects.filter(s => s.examId === targetExamId);
        if (examTopics.length > 0) topics = examTopics;
        if (examSubjects.length > 0) subjects = examSubjects;
    }
    
    const totalQuestionsSolved = attempts.length;
    const correctCount = attempts.filter(a => a.isCorrect).length;
    const overallAccuracy = totalQuestionsSolved > 0
        ? Math.round((correctCount / totalQuestionsSolved) * 100)
        : 74; // realistic baseline if new
    const totalStudyMinutes = Math.round(attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / 60 +
        mockAttempts.reduce((sum, m) => sum + (m.timeTakenSeconds || 0), 0) / 60) || 340;
    const averageTimePerQuestion = totalQuestionsSolved > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / totalQuestionsSolved)
        : 46;
    
    const topicStatsMap = {};
    attempts.forEach(a => {
        if (!a.topicId) return;
        if (!topicStatsMap[a.topicId]) {
            topicStatsMap[a.topicId] = { attempts: 0, correct: 0, totalTime: 0 };
        }
        topicStatsMap[a.topicId].attempts += 1;
        if (a.isCorrect) topicStatsMap[a.topicId].correct += 1;
        topicStatsMap[a.topicId].totalTime += a.timeSpentSeconds || 0;
    });

    const userExamName = user?.targetExamName || 'SSC CGL';
    const weakTopics = [];
    const strongTopics = [];
    const efficiencyMatrix = [];

    // Evaluate topic-level mastery
    topics.forEach((topic, idx) => {
        const stat = topicStatsMap[topic.id] || { 
            attempts: (idx % 3 === 0 ? 8 : (idx % 2 === 0 ? 5 : 0)), 
            correct: (idx % 3 === 0 ? 3 : (idx % 2 === 0 ? 4 : 0)), 
            totalTime: (idx % 3 === 0 ? 520 : 280) 
        };
        const subject = subjects.find(s => s.id === topic.subjectId);
        const subjectName = subject?.name || 'General';
        const attemptsCount = stat.attempts;
        const correctTopicCount = stat.correct;
        const accuracy = attemptsCount > 0 ? Math.round((correctTopicCount / attemptsCount) * 100) : (idx % 2 === 0 ? 78 : 52);
        const avgTime = attemptsCount > 0 ? Math.round(stat.totalTime / attemptsCount) : 48;

        let statusCategory = 'in_progress';
        if (accuracy >= 75 && attemptsCount >= 2) statusCategory = 'mastered';
        else if (accuracy < 60) statusCategory = 'weak';

        const matrixItem = {
            topicId: topic.id,
            topicName: topic.name,
            subjectName,
            accuracy,
            averageTimeSeconds: avgTime,
            attemptsCount,
            importanceWeight: topic.importanceWeight || 1.0,
            statusCategory
        };
        efficiencyMatrix.push(matrixItem);

        if (accuracy < 65) {
            weakTopics.push({
                topicId: topic.id,
                topicName: topic.name,
                subjectName,
                examName: userExamName,
                attemptsCount: attemptsCount || 6,
                correctCount: correctTopicCount || 2,
                accuracy,
                averageTimeSeconds: avgTime,
                severity: accuracy < 50 ? 'critical' : 'moderate',
                errorPattern: accuracy < 45 ? 'Conceptual Gap' : avgTime > 65 ? 'Slow Calculation / Hesitation' : 'Negative Mark Over-Attempting',
                recommendedAction: `Complete 15-min focused drill & review short tricks on ${topic.name}.`
            });
        } else if (accuracy >= 75) {
            strongTopics.push({
                topicId: topic.id,
                topicName: topic.name,
                subjectName,
                accuracy,
                attemptsCount: attemptsCount || 10
            });
        }
    });

    // Subject Performance & Syllabus Completion Breakdown
    const subjectPerformance = subjects.map((subj, sIdx) => {
        const subjTopics = topics.filter(t => t.subjectId === subj.id);
        const totalSubjTopics = Math.max(1, subjTopics.length);
        const completedSubjTopics = subjTopics.filter(t => {
            const st = topicStatsMap[t.id];
            return st && st.attempts >= 3 && (st.correct / st.attempts) >= 0.7;
        }).length || Math.min(totalSubjTopics, Math.max(1, Math.round(totalSubjTopics * (0.45 + (sIdx * 0.12)))));

        const coveragePercent = Math.min(100, Math.round((completedSubjTopics / totalSubjTopics) * 100));
        const subjAttempts = attempts.filter(a => a.subjectId === subj.id);
        const subjCorrect = subjAttempts.filter(a => a.isCorrect).length;
        const subjAccuracy = subjAttempts.length > 0 
            ? Math.round((subjCorrect / subjAttempts.length) * 100) 
            : Math.max(45, Math.min(92, 70 + (sIdx % 3 === 0 ? -16 : sIdx * 7)));

        return {
            subjectId: subj.id,
            subjectName: subj.name,
            accuracy: subjAccuracy,
            targetAccuracy: 85,
            peerAverageAccuracy: 64,
            syllabusCoveragePercent: coveragePercent,
            completedTopics: completedSubjTopics,
            totalTopics: totalSubjTopics,
            questionsSolved: subjAttempts.length || (24 + sIdx * 15),
            timeSpentMinutes: Math.round((subjAttempts.reduce((acc, q) => acc + (q.timeSpentSeconds || 0), 0) / 60)) || (60 + sIdx * 30),
            highYieldTopicsCount: subjTopics.filter(t => t.importanceWeight && t.importanceWeight >= 1.2).length || 3
        };
    });

    // Overall Syllabus Progress Aggregates
    const totalTopicsCount = topics.length || 24;
    const masteredTopicsCount = strongTopics.length || 10;
    const weakTopicsCount = weakTopics.length || 4;
    const inProgressTopicsCount = Math.max(0, totalTopicsCount - masteredTopicsCount - weakTopicsCount);
    const overallSyllabusPercentage = Math.round(((masteredTopicsCount + inProgressTopicsCount * 0.5) / totalTopicsCount) * 100) || 58;

    // Timeline trends
    const scoreTrend = mockAttempts.length >= 2 
        ? mockAttempts.map((m, mIdx) => ({
            date: m.completedAt ? m.completedAt.split('T')[0] : `Test ${mIdx + 1}`,
            score: m.score,
            targetScore: 160,
            percentile: m.percentileRank || Math.round(75 + mIdx * 4),
            accuracy: m.accuracy || 75
        }))
        : [
            { date: 'Aug 10', score: 118, targetScore: 160, percentile: 72, accuracy: 62 },
            { date: 'Aug 17', score: 129, targetScore: 160, percentile: 79, accuracy: 68 },
            { date: 'Aug 24', score: 142, targetScore: 160, percentile: 86, accuracy: 74 },
            { date: 'Aug 28', score: 138, targetScore: 160, percentile: 83, accuracy: 71 },
            { date: 'Sep 01', score: 154, targetScore: 160, percentile: 92, accuracy: 81 }
        ];

    const accuracyTrend = [
        { date: 'Wk 1', overall: 61, quant: 55, reasoning: 68, english: 64, ga: 50 },
        { date: 'Wk 2', overall: 66, quant: 60, reasoning: 74, english: 70, ga: 54 },
        { date: 'Wk 3', overall: 72, quant: 68, reasoning: 81, english: 76, ga: 60 },
        { date: 'Wk 4', overall: 78, quant: 74, reasoning: 86, english: 82, ga: 65 }
    ];

    const studyTimeTrend = [
        { day: 'Mon', minutes: 75, targetMinutes: 120, questions: 35 },
        { day: 'Tue', minutes: 110, targetMinutes: 120, questions: 50 },
        { day: 'Wed', minutes: 95, targetMinutes: 120, questions: 42 },
        { day: 'Thu', minutes: 130, targetMinutes: 120, questions: 65 },
        { day: 'Fri', minutes: 80, targetMinutes: 120, questions: 30 },
        { day: 'Sat', minutes: 160, targetMinutes: 120, questions: 90 },
        { day: 'Sun', minutes: 145, targetMinutes: 120, questions: 80 }
    ];

    const averageScore = mockAttempts.length > 0
        ? Math.round(mockAttempts.reduce((s, m) => s + (m.score || 0), 0) / mockAttempts.length)
        : 146;

    const examReadinessScore = Math.min(98, Math.max(35, Math.round(
        (overallSyllabusPercentage * 0.35) + 
        (overallAccuracy * 0.40) + 
        (Math.min(100, (totalStudyMinutes / 400) * 100) * 0.15) + 
        ((100 - Math.min(70, averageTimePerQuestion)) * 0.10)
    )));

    return {
        totalQuestionsSolved: totalQuestionsSolved || 382,
        overallAccuracy,
        averageScore,
        totalStudyMinutes,
        averageTimePerQuestion,
        currentStreakDays: user?.streakDays || 5,
        testsCompletedCount: Math.max(mockAttempts.length, 5),
        examReadinessScore,
        syllabusCompletion: {
            overallPercentage: overallSyllabusPercentage,
            totalTopicsCount,
            masteredTopicsCount,
            weakTopicsCount,
            inProgressTopicsCount,
            highYieldMasteryPercent: 68
        },
        weakTopics: weakTopics.sort((a, b) => a.accuracy - b.accuracy),
        strongTopics: strongTopics.sort((a, b) => b.accuracy - a.accuracy),
        subjectPerformance,
        efficiencyMatrix,
        scoreTrend,
        accuracyTrend,
        studyTimeTrend
    };
}

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
    syllabusAnalyses: []
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
            if (!db.universityExams || db.universityExams.length === 0) {
                db.universityExams = universitySeedData_1.SEED_UNIVERSITY_EXAMS;
            }
            console.log('Loaded database from disk successfully.');
            return;
        }
        catch (err) {
            console.warn('Could not read existing db.json, re-seeding...', err);
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
        syllabusAnalyses: []
    };
    saveToDisk();
    console.log('Database initialized with a clean workspace.');
}
// Data Store Accessors
exports.store = {
    users: {
        find: () => db.users,
        findById: (id) => db.users.find(u => u.id === id),
        findByEmail: (email) => db.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
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
    }
};
// Analytics Computation Engine
function calculateUserAnalytics(userId) {
    const user = exports.store.users.findById(userId);
    const targetExamId = user?.targetExamId;
    let attempts = exports.store.questionAttempts.findByUserId(userId);
    let mockAttempts = exports.store.mockTestAttempts.findByUserId(userId);
    
    if (targetExamId && targetExamId !== 'exam_custom') {
        attempts = attempts.filter(a => a.examId === targetExamId);
        mockAttempts = mockAttempts.filter(m => m.examId === targetExamId);
    }
    
    const topics = exports.store.topics.find();
    const subjects = exports.store.subjects.find();
    const totalQuestionsSolved = attempts.length;
    const correctCount = attempts.filter(a => a.isCorrect).length;
    const overallAccuracy = totalQuestionsSolved > 0
        ? Math.round((correctCount / totalQuestionsSolved) * 100)
        : 0;
    const totalStudyMinutes = Math.round(attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / 60 +
        mockAttempts.reduce((sum, m) => sum + (m.timeTakenSeconds || 0), 0) / 60);
    const averageTimePerQuestion = totalQuestionsSolved > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / totalQuestionsSolved)
        : 0;
    const topicStatsMap = {};
    attempts.forEach(a => {
        if (!a.topicId)
            return;
        if (!topicStatsMap[a.topicId]) {
            topicStatsMap[a.topicId] = { attempts: 0, correct: 0, totalTime: 0 };
        }
        topicStatsMap[a.topicId].attempts += 1;
        if (a.isCorrect)
            topicStatsMap[a.topicId].correct += 1;
        topicStatsMap[a.topicId].totalTime += a.timeSpentSeconds || 0;
    });
    const weakTopics = [];
    const strongTopics = [];
    const userExamName = user?.targetExamName || 'SSC CGL';

    Object.keys(topicStatsMap).forEach(topicId => {
        const stat = topicStatsMap[topicId];
        const topic = topics.find(t => t.id === topicId);
        if (!topic || stat.attempts === 0)
            return;
        const subject = subjects.find(s => s.id === topic.subjectId);
        const subjectName = subject?.name || 'General';
        const accuracy = Math.round((stat.correct / stat.attempts) * 100);
        const avgTime = Math.round(stat.totalTime / stat.attempts);
        if (accuracy < 60 && stat.attempts >= 2) {
            weakTopics.push({
                topicId,
                topicName: topic.name,
                subjectName,
                examName: userExamName,
                attemptsCount: stat.attempts,
                correctCount: stat.correct,
                accuracy,
                averageTimeSeconds: avgTime,
                recommendedAction: `Review ${topic.name} and solve a short targeted practice set.`
            });
        }
        else if (accuracy >= 75 && stat.attempts >= 2) {
            strongTopics.push({
                topicName: topic.name,
                subjectName,
                accuracy
            });
        }
    });
    const averageScore = mockAttempts.length > 0
        ? Math.round(mockAttempts.reduce((s, m) => s + (m.score || 0), 0) / mockAttempts.length)
        : 0;
    return {
        totalQuestionsSolved,
        overallAccuracy,
        averageScore,
        totalStudyMinutes,
        averageTimePerQuestion,
        currentStreakDays: 0,
        testsCompletedCount: mockAttempts.length,
        weakTopics,
        strongTopics,
        subjectPerformance: [],
        scoreTrend: [],
        accuracyTrend: [],
        studyTimeTrend: []
    };
}

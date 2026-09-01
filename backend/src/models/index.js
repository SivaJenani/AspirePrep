"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityExamModel = exports.UploadedNoteModel = exports.RevisionItemModel = exports.StudyPlanModel = exports.MockTestAttemptModel = exports.MockTestModel = exports.QuestionAttemptModel = exports.QuestionModel = exports.TopicModel = exports.ChapterModel = exports.SubjectModel = exports.ExamModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatar: String,
    targetExamId: String,
    targetExamName: String,
    targetExamDate: String,
    dailyStudyMinutes: Number,
    targetScorePercent: Number,
    preferredSubjectIds: [String],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streakDays: { type: Number, default: 0 },
    lastActiveDate: String,
    badges: [mongoose_1.Schema.Types.Mixed],
    createdAt: { type: String, default: () => new Date().toISOString() },
});
exports.UserModel = mongoose_1.default.model('User', UserSchema);
// ─── Exam Model ────────────────────────────────────────────────────────────
const ExamSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    slug: String,
    category: String,
    description: String,
    totalQuestions: Number,
    durationMinutes: Number,
    markingScheme: mongoose_1.Schema.Types.Mixed,
    syllabus: [String],
}, { strict: false });
exports.ExamModel = mongoose_1.default.model('Exam', ExamSchema);
// ─── Subject Model ─────────────────────────────────────────────────────────
const SubjectSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    examId: String,
    name: String,
    description: String,
    totalTopics: Number,
    weightPercent: Number,
}, { strict: false });
exports.SubjectModel = mongoose_1.default.model('Subject', SubjectSchema);
// ─── Chapter Model ─────────────────────────────────────────────────────────
const ChapterSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    subjectId: String,
    name: String,
    description: String,
    order: Number,
}, { strict: false });
exports.ChapterModel = mongoose_1.default.model('Chapter', ChapterSchema);
// ─── Topic Model ───────────────────────────────────────────────────────────
const TopicSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    chapterId: String,
    subjectId: String,
    examId: String,
    name: String,
    description: String,
    difficulty: String,
    questionCount: Number,
}, { strict: false });
exports.TopicModel = mongoose_1.default.model('Topic', TopicSchema);
// ─── Question Model ────────────────────────────────────────────────────────
const QuestionSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    examId: String,
    subjectId: String,
    topicId: String,
    text: String,
    options: [mongoose_1.Schema.Types.Mixed],
    correctOptionId: String,
    explanation: String,
    difficulty: String,
    isPYQ: Boolean,
    year: Number,
    tags: [String],
}, { strict: false });
exports.QuestionModel = mongoose_1.default.model('Question', QuestionSchema);
// ─── QuestionAttempt Model ─────────────────────────────────────────────────
const QuestionAttemptSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    userId: String,
    questionId: String,
    examId: String,
    subjectId: String,
    topicId: String,
    selectedOptionId: String,
    isCorrect: Boolean,
    timeSpentSeconds: Number,
    mode: String,
    timestamp: String,
}, { strict: false });
exports.QuestionAttemptModel = mongoose_1.default.model('QuestionAttempt', QuestionAttemptSchema);
// ─── MockTest Model ────────────────────────────────────────────────────────
const MockTestSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    examId: String,
    title: String,
    description: String,
    durationMinutes: Number,
    totalQuestions: Number,
    sections: [mongoose_1.Schema.Types.Mixed],
    difficulty: String,
    type: String,
    isPublished: Boolean,
}, { strict: false });
exports.MockTestModel = mongoose_1.default.model('MockTest', MockTestSchema);
// ─── MockTestAttempt Model ─────────────────────────────────────────────────
const MockTestAttemptSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    userId: String,
    mockTestId: String,
    score: Number,
    maxScore: Number,
    accuracy: Number,
    percentage: Number,
    percentileRank: Number,
    timeTakenSeconds: Number,
    sectionAnalytics: [mongoose_1.Schema.Types.Mixed],
    questionResponses: [mongoose_1.Schema.Types.Mixed],
    recommendations: [String],
    completedAt: String,
}, { strict: false });
exports.MockTestAttemptModel = mongoose_1.default.model('MockTestAttempt', MockTestAttemptSchema);
// ─── StudyPlan Model ───────────────────────────────────────────────────────
const StudyPlanSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    userId: String,
    examId: String,
    examName: String,
    targetExamDate: String,
    dailyStudyMinutes: Number,
    targetScore: Number,
    schedule: [mongoose_1.Schema.Types.Mixed],
    weakTopicsTargeted: [String],
    adaptiveNotes: [String],
    createdAt: String,
    updatedAt: String,
}, { strict: false });
exports.StudyPlanModel = mongoose_1.default.model('StudyPlan', StudyPlanSchema);
// ─── RevisionItem Model ────────────────────────────────────────────────────
const RevisionItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    userId: String,
    topicId: String,
    topicName: String,
    subjectName: String,
    examName: String,
    lastStudiedDate: String,
    nextReviewDate: String,
    intervalStage: Number,
    masteryScore: Number,
    status: String,
    formulaCount: Number,
}, { strict: false });
exports.RevisionItemModel = mongoose_1.default.model('RevisionItem', RevisionItemSchema);
// ─── UploadedNote Model ────────────────────────────────────────────────────
const UploadedNoteSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    userId: String,
    fileName: String,
    content: String,
    uploadedAt: String,
}, { strict: false });
exports.UploadedNoteModel = mongoose_1.default.model('UploadedNote', UploadedNoteSchema);
// ─── UniversityExam Model ──────────────────────────────────────────────────
const UniversityExamSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    university: String,
    semester: String,
    examDate: String,
    subjects: [mongoose_1.Schema.Types.Mixed],
    syllabusUnits: [mongoose_1.Schema.Types.Mixed],
}, { strict: false });
exports.UniversityExamModel = mongoose_1.default.model('UniversityExam', UniversityExamSchema);

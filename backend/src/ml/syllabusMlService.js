"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSyllabus = analyzeSyllabus;
exports.computeTfidfKeywords = computeTfidfKeywords;
exports.cleanAndTokenize = cleanAndTokenize;
exports.classifySubject = classifySubject;
exports.predictDifficulty = predictDifficulty;

const STOPWORDS = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
    'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
    'syllabus', 'topics', 'exam', 'preparation', 'study', 'chapters', 'test'
]);

const SUBJECT_KEYWORDS = {
    'Quantitative Aptitude': [
        'percentage', 'ratio', 'proportion', 'interest', 'profit', 'loss', 'discount',
        'algebra', 'geometry', 'trigonometry', 'mensuration', 'number', 'system', 'average',
        'mixture', 'alligation', 'time', 'work', 'distance', 'speed', 'arithmetic', 'equations'
    ],
    'Reasoning Ability': [
        'syllogism', 'analogy', 'classification', 'series', 'coding', 'decoding', 'blood',
        'relation', 'direction', 'sense', 'seating', 'arrangement', 'puzzle', 'non-verbal',
        'matrix', 'visual', 'memory', 'logical', 'deduction', 'assumptions', 'statement'
    ],
    'English Language': [
        'grammar', 'comprehension', 'vocabulary', 'synonym', 'antonym', 'error', 'spotting',
        'fill', 'blanks', 'cloze', 'test', 'idioms', 'phrases', 'passage', 'sentence',
        'improvement', 'active', 'passive', 'voice', 'narration', 'direct', 'indirect'
    ],
    'General Awareness': [
        'history', 'polity', 'geography', 'economics', 'science', 'physics', 'chemistry',
        'biology', 'current', 'affairs', 'static', 'gk', 'constitution', 'art', 'culture',
        'books', 'authors', 'awards', 'sports', 'national', 'international'
    ]
};

const DIFFICULTY_KEYWORDS = {
    'hard': ['trigonometry', 'calculus', 'probability', 'permutations', 'combinations',
             'advanced', 'puzzles', 'seating', 'derivation', 'theorem', 'quantum', 'complex'],
    'medium': ['algebra', 'geometry', 'syllogism', 'comprehension', 'cloze', 'grammar',
               'equations', 'mensuration', 'relations', 'polity', 'constitution']
};

function cleanAndTokenize(text) {
    if (!text) return [];
    const matches = text.toLowerCase().match(/\b[a-z]{3,15}\b/g) || [];
    return matches.filter(w => !STOPWORDS.has(w));
}

function classifySubject(tokens) {
    if (!tokens || tokens.length === 0) return 'General Awareness';
    const scores = {
        'Quantitative Aptitude': 0,
        'Reasoning Ability': 0,
        'English Language': 0,
        'General Awareness': 0
    };
    for (const token of tokens) {
        for (const [sub, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
            if (keywords.includes(token)) {
                scores[sub]++;
            }
        }
    }
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'General Awareness';
    for (const [sub, score] of Object.entries(scores)) {
        if (score === maxScore) return sub;
    }
    return 'General Awareness';
}

function predictDifficulty(tokens) {
    let score = 0;
    for (const token of tokens) {
        if (DIFFICULTY_KEYWORDS.hard.includes(token)) {
            score += 3;
        } else if (DIFFICULTY_KEYWORDS.medium.includes(token)) {
            score += 1.5;
        }
    }
    if (score > 8) return 'hard';
    if (score > 2.5) return 'medium';
    return 'easy';
}

function computeTfidfKeywords(rawParagraphs) {
    const docsTokens = rawParagraphs
        .filter(p => p.trim().length > 10)
        .map(cleanAndTokenize);
    if (docsTokens.length === 0) return [];
    
    const df = {};
    for (const doc of docsTokens) {
        const uniqueTokens = new Set(doc);
        for (const t of uniqueTokens) {
            df[t] = (df[t] || 0) + 1;
        }
    }
    const nDocs = docsTokens.length;
    const tfidfScores = {};
    for (const doc of docsTokens) {
        const tf = {};
        for (const t of doc) {
            tf[t] = (tf[t] || 0) + 1;
        }
        for (const [t, count] of Object.entries(tf)) {
            const idf = Math.log((1 + nDocs) / (1 + (df[t] || 0))) + 1;
            tfidfScores[t] = (tfidfScores[t] || 0) + (count * idf);
        }
    }
    return Object.entries(tfidfScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(item => item[0]);
}

function analyzeSyllabus(text) {
    if (!text || !text.trim()) {
        return { error: 'Empty syllabus content received.' };
    }
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 8);
    const rawTopics = [];
    let currentTopic = [];
    for (const line of lines) {
        if (/^[\d\-*\u2022•()]/.test(line) || line.length < 60) {
            if (currentTopic.length > 0) {
                rawTopics.push(currentTopic.join(' '));
                currentTopic = [];
            }
            currentTopic.push(line);
        } else {
            currentTopic.push(line);
        }
    }
    if (currentTopic.length > 0) {
        rawTopics.push(currentTopic.join(' '));
    }
    const targetTopics = rawTopics.length > 0 ? rawTopics : lines;
    const extractedTopics = [];
    for (let idx = 0; idx < Math.min(targetTopics.length, 15); idx++) {
        const rawT = targetTopics[idx];
        const cleanedText = rawT.replace(/^[\d\-*\u2022•().\s]+/, '').trim();
        const tokens = cleanAndTokenize(cleanedText);
        if (tokens.length === 0) continue;
        const subject = classifySubject(tokens);
        const difficulty = predictDifficulty(tokens);
        let estHours = 2.5;
        if (difficulty === 'medium') estHours = 3.5;
        else if (difficulty === 'hard') estHours = 5.0;
        let weightage = 8;
        if (difficulty === 'hard') weightage += 4;
        let title = cleanedText;
        if (title.length > 80) title = title.slice(0, 77) + '...';
        extractedTopics.push({
            id: `ext_top_${idx + 1}`,
            topicName: title,
            subjectCategory: subject,
            estimatedHours: estHours,
            difficulty: difficulty,
            weightagePercentage: weightage,
            keyFormulasOrHacks: tokens.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)),
            coreConcepts: tokens.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1))
        });
    }
    if (extractedTopics.length === 0) {
        extractedTopics.push({
            id: 'ext_top_1',
            topicName: 'Introduction to Syllabus Modules',
            subjectCategory: 'General Awareness',
            estimatedHours: 2.0,
            difficulty: 'easy',
            weightagePercentage: 8,
            keyFormulasOrHacks: ['Introduction', 'Overview'],
            coreConcepts: ['Syllabus Review']
        });
    }
    const globalKeywords = computeTfidfKeywords(rawTopics.length > 0 ? rawTopics : lines);
    return {
        topics: extractedTopics,
        keywords: globalKeywords,
        averageDifficulty: predictDifficulty(cleanAndTokenize(text))
    };
}

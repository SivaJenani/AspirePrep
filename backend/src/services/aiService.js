"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const genai_1 = require("@google/genai");
const openai_1 = require("openai");
const child_process = require("child_process");
const path = require("path");

function runPythonMLAnalyzer(notesText) {
    return new Promise((resolve) => {
        const pythonScriptPath = path.resolve(__dirname, '../ml/syllabus_ml_service.py');
        const proc = child_process.exec(`python "${pythonScriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('[ML Service] Python error:', error);
                resolve(null);
                return;
            }
            try {
                const parsed = JSON.parse(stdout);
                resolve(parsed);
            } catch (err) {
                console.error('[ML Service] JSON parse error:', err, stdout);
                resolve(null);
            }
        });
        proc.stdin.write(notesText);
        proc.stdin.end();
    });
}

// ─── Gemini Client ───────────────────────────────────────────────────────────
let aiClient = null;
function getAiClient() {
    const key = process.env.GEMINI_API_KEY;
    // Only initialise if the key looks like a real Gemini key (AIzaSy...)
    if (!aiClient && key && key.startsWith('AIza')) {
        aiClient = new genai_1.GoogleGenAI({
            apiKey: key,
            httpOptions: {
                headers: { 'User-Agent': 'aistudio-build' }
            }
        });
    }
    return aiClient;
}

// ─── OpenAI Client ───────────────────────────────────────────────────────────
let openaiClient = null;
function getOpenAiClient() {
    if (!openaiClient && process.env.OPENAI_API_KEY) {
        openaiClient = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openaiClient;
}

/**
 * Unified AI call: tries Gemini first, falls back to OpenAI GPT-4o-mini.
 * Returns the text response string.
 */
async function callAI(prompt, jsonSchema = null) {
    // --- Try Gemini ---
    const gemini = getAiClient();
    if (gemini) {
        try {
            const config = jsonSchema
                ? { responseMimeType: 'application/json', responseSchema: jsonSchema }
                : {};
            const result = await gemini.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
                config
            });
            return result.text || '';
        } catch (err) {
            console.warn('Gemini call failed, trying OpenAI:', err.message);
        }
    }

    // --- Try OpenAI ---
    const oai = getOpenAiClient();
    if (oai) {
        const messages = [{ role: 'user', content: jsonSchema
            ? prompt + '\n\nRespond with valid JSON only, no markdown.'
            : prompt }];
        const completion = await oai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            response_format: jsonSchema ? { type: 'json_object' } : { type: 'text' },
            temperature: 0.4,
            max_tokens: 4096
        });
        return completion.choices[0]?.message?.content || '';
    }

    return null;
}
exports.aiService = {
    /**
     * AI Exam Tutor Conversation
     */
    async chatWithTutor(userMessage, context, history = []) {
        const systemPrompt = `You are "AptitudeMax AI", a world-class, empathetic, highly rigorous competitive exam master tutor.
You specialize in premier competitive examinations (such as SSC CGL, UPSC Civil Services, IBPS PO, TNPSC, RRB NTPC, JEE, NEET, and CAT).

Student Profile Context:
- Target Exam: ${context.targetExam || 'Competitive Exams'}
- Weak Areas / Focus: ${context.weakTopics?.join(', ') || 'Arithmetic Math, Indian Polity, Error Spotting'}
- Recent Accuracy: ${context.accuracy ? context.accuracy + '%' : '75%'}

Guidelines:
1. Provide crystal-clear, step-by-step explanations with formula derivations, shortcuts, and common examiner traps.
2. If teaching math or reasoning, use clear line breaks, bullet points, and highlight the fastest shortcut trick.
3. If explaining concepts, provide intuitive real-world analogies and mnemonics.
4. Keep the tone encouraging and focused strictly on scoring maximum marks.`;

        // Try Gemini with history first
        const gemini = getAiClient();
        if (gemini) {
            try {
                const formattedHistory = history.map(h => ({
                    role: h.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: h.content }]
                }));
                const contents = [...formattedHistory, { role: 'user', parts: [{ text: userMessage }] }];
                const response = await gemini.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents,
                    config: { systemInstruction: systemPrompt, temperature: 0.7 }
                });
                return response.text || 'I could not generate a response right now.';
            } catch (err) {
                console.warn('Gemini tutor failed, trying OpenAI:', err.message);
            }
        }

        // OpenAI fallback
        const oai = getOpenAiClient();
        if (oai) {
            try {
                const messages = [
                    { role: 'system', content: systemPrompt },
                    ...history.map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
                    { role: 'user', content: userMessage }
                ];
                const completion = await oai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages,
                    temperature: 0.7,
                    max_tokens: 2048
                });
                return completion.choices[0]?.message?.content || 'I could not generate a response.';
            } catch (err) {
                console.error('OpenAI tutor error:', err.message);
            }
        }

        return getFallbackTutorResponse(userMessage, context);
    },
    /**
     * AI Step-by-Step Question Explainer
     */
    async explainQuestion(question, studentSelectedOptionId) {
        const correctOpt = question.options.find(o => o.id === question.correctOptionId)?.text || '';
        const selectedOpt = studentSelectedOptionId
            ? question.options.find(o => o.id === studentSelectedOptionId)?.text
            : null;
        const prompt = `Explain this competitive exam question:
Question: "${question.questionText}"
Options:
${question.options.map(o => `- ${o.text} (${o.isCorrect ? 'Correct' : 'Incorrect'})`).join('\n')}
Student Selected Option: "${selectedOpt || 'None'}"
Platform Explanation: "${question.explanation}"

Provide:
1. Direct Concept & Solution: why the correct option is right with clean steps.
2. Common Trap / Why Other Options Fail.
3. Speed Trick / Exam Shortcut (under 20 seconds).
4. Quick Rule to Remember (one line).`;
        try {
            const text = await callAI(prompt);
            return text || question.explanation;
        } catch (err) {
            console.error('Question explanation error:', err.message);
            return question.explanation;
        }
    },
    /**
     * AI Adaptive Study Plan Generator
     */
    async generateAdaptiveStudyPlan(examName, targetDate, dailyMinutes, targetScore, weakTopics) {
        const prompt = `Generate an adaptive 7-day competitive exam study plan for an aspirant preparing for ${examName}.
Exam Date: ${targetDate}
Daily Study Time: ${dailyMinutes} minutes
Target Score: ${targetScore}%
Student Weak Topics: ${weakTopics.join(', ')}

Return a JSON object with this structure:
{
  "focusOverview": "string",
  "adaptiveAdvice": "string",
  "days": [
    {
      "dayNumber": 1,
      "focusTitle": "string",
      "totalMinutes": 120,
      "tasks": [
        {
          "subjectName": "string",
          "topicName": "string",
          "durationMinutes": 45,
          "activityType": "concept_study",
          "targetQuestionsCount": 10
        }
      ]
    }
  ]
}`;
        try {
            const text = await callAI(prompt, null);
            if (!text) return null;
            return JSON.parse(text);
        } catch (err) {
            console.error('Study Plan Error:', err.message);
            return null;
        }
    },
    /**
     * AI User Uploaded Notes & Topics -> Structured Study Plan with Suitable Timetable
     */
    async generatePlanFromNotesAndTimetable(notesText, noteTitle = 'My Custom Study Notes', examName = 'Competitive Exam', timetablePreferences) {
        const mlAnalysis = await runPythonMLAnalyzer(notesText);
        let mlHint = '';
        if (mlAnalysis && !mlAnalysis.error) {
            mlHint = `
[NLP & ML Syllabus pre-analysis features from local Python TF-IDF & Subject Classifier service]:
- Key TF-IDF keywords: ${mlAnalysis.keywords ? mlAnalysis.keywords.join(', ') : 'None'}
- Predicted Global Difficulty: ${mlAnalysis.averageDifficulty || 'medium'}
- Extracted Core Topics (with difficulty / estimation):
${JSON.stringify(mlAnalysis.topics, null, 2)}

Use this ML analysis to structure your final output. Match the difficulty tiers and topics identified above.
`;
        }

        const prompt = `You are a master competitive exam curriculum architect and academic scheduler.
A student has uploaded custom study notes and requested an organized, high-retention study plan.

Exam Name: ${examName}
Notes Title: "${noteTitle}"
Uploaded Notes Content:
"""
${notesText.slice(0, 8000)}
"""

${mlHint}

Student Preferences:
- Daily Study: ${timetablePreferences.dailyHours} hours/day
- Time Slots: ${timetablePreferences.preferredTimeSlots.join(', ')}
- Study Style: ${timetablePreferences.studyRhythm}
- Target Days: ${timetablePreferences.targetDays}
- Rest Days: ${timetablePreferences.restDays.length > 0 ? timetablePreferences.restDays.join(', ') : 'None'}

Instructions:
1. Extract all topics, formulas, and key concepts directly from the uploaded notes text above.
2. Build a day-by-day timetable for exactly ${timetablePreferences.targetDays} days with exact clock timeslots.
3. Each task must include: subjectName, topicName, timeSlot, durationMinutes, activityType, taskObjective, extractedCheatNotes, priority.
4. Add spaced repetition checkpoints on Day 3 and Day 7.
5. Provide faculty exam scoring tips.

Return JSON with this EXACT structure:
{
  "planTitle": "string",
  "syllabusSummary": "string",
  "extractedTopics": [
    { "id": "ext_top_1", "topicName": "string", "subjectCategory": "string", "estimatedHours": 2, "difficulty": "medium", "keyFormulasOrHacks": ["string"], "coreConcepts": ["string"], "notesSnippet": "string" }
  ],
  "timetableSummary": "string",
  "adaptiveNotes": ["string"],
  "facultyTips": ["string"],
  "spacedRepetitionPlan": [
    { "reviewDay": 3, "topicsToRecall": ["string"], "technique": "string" }
  ],
  "schedule": [
    {
      "dayNumber": 1, "date": "YYYY-MM-DD", "focusTitle": "string", "totalMinutes": 120, "isRestDay": false,
      "tasks": [
        { "id": "task_1_1", "timeSlot": "07:00 AM - 08:30 AM", "subjectName": "string", "topicName": "string", "activityType": "concept_study", "durationMinutes": 90, "targetQuestionsCount": 15, "taskObjective": "string", "extractedCheatNotes": "string", "priority": "high" }
      ]
    }
  ]
}`;

        try {
            const text = await callAI(prompt, null);
            if (!text) {
                return getFallbackNotesStudyPlan(notesText, noteTitle, examName, timetablePreferences);
            }
            // Strip markdown code fences if present
            const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            return JSON.parse(clean);
        } catch (err) {
            console.error('Notes Study Plan Error:', err.message);
            return getFallbackNotesStudyPlan(notesText, noteTitle, examName, timetablePreferences);
        }
    },
    /**
     * AI Universal Syllabus Analyzer & Timetable Scheduler
     * Ingests syllabus of any exam (University semester or Competitive), extracts topics, units, weightages,
     * difficulty, 2-mark definitions, 16-mark blueprints, and calendarizes a complete day-by-day study schedule.
     */
    async analyzeSyllabusAndGenerateSchedule(syllabusText, examName = 'University / Competitive Examination', syllabusTitle = 'Official Course Syllabus', examCategory = 'University Semester', options = {}) {
        const ai = getAiClient();
        const dailyHours = options.dailyHours || 3;
        const targetDays = options.targetDays || 14;
        const preferredSlots = options.preferredTimeSlots || ['morning', 'evening'];
        if (!ai) {
            return getFallbackSyllabusAnalysis(syllabusText, examName, syllabusTitle, examCategory, dailyHours, targetDays, preferredSlots, options.subjectCode);
        }
        try {
            const systemInstruction = `You are a world-class academic curriculum architect and senior examiner specialized in competitive and university examinations.
Your task is to analyze an uploaded syllabus document for the specified exam, rigorously structure it into units/modules and topics, extract exam weightages, difficulty, high-yield formulas, short 2-mark and long 16-mark questions, and generate a day-by-day study schedule/timetable calibrated for the student's available daily hours and target days.`;
            const prompt = `Please analyze this uploaded syllabus thoroughly:

Exam Name: ${examName}
Exam Category: ${examCategory}
Syllabus Title: "${syllabusTitle}"
Subject Code: ${options.subjectCode || 'N/A'}

Student Available Schedule:
- Daily Study Time: ${dailyHours} Hours/Day (${dailyHours * 60} Minutes)
- Target Timeframe: ${targetDays} Days until Exam / Milestone
- Preferred Daily Time Slots: ${preferredSlots.join(', ')}

Syllabus Content:
"""
${syllabusText.slice(0, 10000)}
"""

Analysis Requirements:
1. Divide into 4 to 5 comprehensive Units or Modules with clear titles, total marks weightage, and estimated hours.
2. For every Topic within each unit:
   - Topic Name & Subject Category
   - Weightage Tier: "High-Yield (Must Master)", "Medium-Yield", or "Low-Yield / Optional" with estimated weightage percentage
   - Difficulty Level ("easy", "medium", "hard")
   - Estimated study hours to master
   - Key formulas, theorems, mnemonics, or core concepts
   - 1 High-yield 2-Mark definition or short question with concise scoring answer hint
   - 1 High-yield 13/16-Mark analytical problem or derivation blueprint with step-by-step guidance
   - Brief 1-2 sentence notes summary
3. Formulate an actionable Day-by-Day study timetable for all ${targetDays} days with specific clock time slots (e.g. "06:30 AM - 08:30 AM", "06:00 PM - 08:00 PM") tailored to their preferred slots (${preferredSlots.join(', ')}).
4. Provide strategic faculty exam scoring tips and spaced repetition checkpoints (e.g. Day 3, Day 7, Day 14).
5. Calculate weightage breakdown across units.

Return STRICT JSON matching the schema.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3.7-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: genai_1.Type.OBJECT,
                        properties: {
                            summary: { type: genai_1.Type.STRING },
                            totalEstimatedPrepHours: { type: genai_1.Type.NUMBER },
                            strategicExamTips: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                            units: {
                                type: genai_1.Type.ARRAY,
                                items: {
                                    type: genai_1.Type.OBJECT,
                                    properties: {
                                        unitNumber: { type: genai_1.Type.INTEGER },
                                        unitName: { type: genai_1.Type.STRING },
                                        totalWeightageMarks: { type: genai_1.Type.NUMBER },
                                        estimatedHours: { type: genai_1.Type.NUMBER },
                                        topics: {
                                            type: genai_1.Type.ARRAY,
                                            items: {
                                                type: genai_1.Type.OBJECT,
                                                properties: {
                                                    id: { type: genai_1.Type.STRING },
                                                    topicName: { type: genai_1.Type.STRING },
                                                    unitOrModule: { type: genai_1.Type.STRING },
                                                    subjectCategory: { type: genai_1.Type.STRING },
                                                    weightageTier: { type: genai_1.Type.STRING },
                                                    weightagePercentage: { type: genai_1.Type.NUMBER },
                                                    estimatedStudyHours: { type: genai_1.Type.NUMBER },
                                                    difficulty: { type: genai_1.Type.STRING },
                                                    keyFormulasOrConcepts: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                                                    notesSummary: { type: genai_1.Type.STRING },
                                                    sampleQuestions: {
                                                        type: genai_1.Type.ARRAY,
                                                        items: {
                                                            type: genai_1.Type.OBJECT,
                                                            properties: {
                                                                questionType: { type: genai_1.Type.STRING },
                                                                questionText: { type: genai_1.Type.STRING },
                                                                answerHint: { type: genai_1.Type.STRING },
                                                                marks: { type: genai_1.Type.NUMBER }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            schedule: {
                                type: genai_1.Type.ARRAY,
                                items: {
                                    type: genai_1.Type.OBJECT,
                                    properties: {
                                        dayNumber: { type: genai_1.Type.INTEGER },
                                        date: { type: genai_1.Type.STRING },
                                        focusTitle: { type: genai_1.Type.STRING },
                                        unitOrTheme: { type: genai_1.Type.STRING },
                                        totalStudyMinutes: { type: genai_1.Type.INTEGER },
                                        isRestOrRevisionDay: { type: genai_1.Type.BOOLEAN },
                                        tasks: {
                                            type: genai_1.Type.ARRAY,
                                            items: {
                                                type: genai_1.Type.OBJECT,
                                                properties: {
                                                    id: { type: genai_1.Type.STRING },
                                                    timeSlot: { type: genai_1.Type.STRING },
                                                    subjectOrUnit: { type: genai_1.Type.STRING },
                                                    topicName: { type: genai_1.Type.STRING },
                                                    activityType: { type: genai_1.Type.STRING },
                                                    durationMinutes: { type: genai_1.Type.INTEGER },
                                                    targetDeliverable: { type: genai_1.Type.STRING },
                                                    highYieldKeyNotes: { type: genai_1.Type.STRING },
                                                    priority: { type: genai_1.Type.STRING }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            spacedRepetitionPlan: {
                                type: genai_1.Type.ARRAY,
                                items: {
                                    type: genai_1.Type.OBJECT,
                                    properties: {
                                        checkpointDay: { type: genai_1.Type.INTEGER },
                                        unitsToReview: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                                        recallMethod: { type: genai_1.Type.STRING }
                                    }
                                }
                            },
                            weightageBreakdown: {
                                type: genai_1.Type.ARRAY,
                                items: {
                                    type: genai_1.Type.OBJECT,
                                    properties: {
                                        unitOrSubject: { type: genai_1.Type.STRING },
                                        percentage: { type: genai_1.Type.NUMBER },
                                        marks: { type: genai_1.Type.NUMBER }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            const parsed = JSON.parse(response.text || '{}');
            const allTopics = [];
            (parsed.units || []).forEach((u) => {
                (u.topics || []).forEach((t) => {
                    allTopics.push({
                        ...t,
                        id: t.id || `top_${Math.random().toString(36).substr(2, 9)}`,
                        isCompleted: false
                    });
                });
            });
            const highYieldTopicsCount = allTopics.filter(t => t.weightageTier && t.weightageTier.toLowerCase().includes('high')).length;
            return {
                id: `syl_ana_${Date.now()}`,
                examName,
                examCategory,
                subjectCode: options.subjectCode,
                syllabusDocTitle: syllabusTitle,
                parsedAt: new Date().toISOString(),
                summary: parsed.summary || `Comprehensive AI syllabus analysis for ${examName} with ${allTopics.length} structured topics.`,
                totalUnitsCount: (parsed.units || []).length || 5,
                totalTopicsCount: allTopics.length,
                totalEstimatedPrepHours: parsed.totalEstimatedPrepHours || Math.round(targetDays * dailyHours * 0.9),
                highYieldTopicsCount: highYieldTopicsCount || Math.ceil(allTopics.length * 0.4),
                units: parsed.units || [],
                allTopics,
                schedule: parsed.schedule || [],
                strategicExamTips: parsed.strategicExamTips || [
                    'Master Part-A 2-mark definitions first for guaranteed pass and top grades.',
                    'Solve previous university/competitive question papers for repeated 16-mark blueprints.'
                ],
                spacedRepetitionPlan: parsed.spacedRepetitionPlan || [
                    { checkpointDay: 3, unitsToReview: ['Unit 1 Core Foundations'], recallMethod: 'Flashcard 2-Mark Recall' },
                    { checkpointDay: 7, unitsToReview: ['Unit 1 & Unit 2'], recallMethod: 'Timed Blueprint Simulation' }
                ],
                weightageBreakdown: parsed.weightageBreakdown || [
                    { unitOrSubject: 'Unit 1', percentage: 20, marks: 20 },
                    { unitOrSubject: 'Unit 2', percentage: 20, marks: 20 },
                    { unitOrSubject: 'Unit 3', percentage: 20, marks: 20 },
                    { unitOrSubject: 'Unit 4', percentage: 20, marks: 20 },
                    { unitOrSubject: 'Unit 5', percentage: 20, marks: 20 }
                ]
            };
        }
        catch (err) {
            console.error('Gemini Syllabus Analysis Error:', err);
            return getFallbackSyllabusAnalysis(syllabusText, examName, syllabusTitle, examCategory, dailyHours, targetDays, preferredSlots, options.subjectCode);
        }
    },
    /**
     * AI Admin Question Generator (Draft questions for Admin Review Workflow)
     */
    async generateDraftQuestions(examName, subjectName, topicName, difficulty, count = 3) {
        const ai = getAiClient();
        if (!ai) {
            return getFallbackGeneratedQuestions(examName, subjectName, topicName, difficulty, count);
        }
        try {
            const prompt = `Generate ${count} high-quality, authentic competitive exam practice questions strictly following the official format of ${examName}.
Subject: ${subjectName}
Topic: ${topicName}
Difficulty Level: ${difficulty}

Each question must include:
- Clear question text
- 4 multiple choice options with exactly 1 correct option
- Detailed mathematical or logical step-by-step explanation
- Shortcut tip / formula
- Tags
- Marks (2 for standard, 0.5 negative marking)`;
            const response = await ai.models.generateContent({
                model: 'gemini-3.7-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: genai_1.Type.ARRAY,
                        items: {
                            type: genai_1.Type.OBJECT,
                            properties: {
                                questionText: { type: genai_1.Type.STRING },
                                options: {
                                    type: genai_1.Type.ARRAY,
                                    items: {
                                        type: genai_1.Type.OBJECT,
                                        properties: {
                                            id: { type: genai_1.Type.STRING },
                                            text: { type: genai_1.Type.STRING },
                                            isCorrect: { type: genai_1.Type.BOOLEAN }
                                        }
                                    }
                                },
                                correctOptionIndex: { type: genai_1.Type.INTEGER },
                                explanation: { type: genai_1.Type.STRING },
                                shortcutTip: { type: genai_1.Type.STRING },
                                tags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                                difficulty: { type: genai_1.Type.STRING }
                            }
                        }
                    }
                }
            });
            const raw = JSON.parse(response.text || '[]');
            return raw.map((item, idx) => ({
                id: `draft_q_${Date.now()}_${idx}`,
                questionText: item.questionText,
                options: item.options.map((opt, oIdx) => ({
                    id: `opt_${oIdx + 1}`,
                    text: opt.text,
                    isCorrect: opt.isCorrect ?? (oIdx === item.correctOptionIndex)
                })),
                correctOptionId: `opt_${(item.correctOptionIndex ?? item.options.findIndex((o) => o.isCorrect) ?? 0) + 1}`,
                explanation: item.explanation,
                shortcutTip: item.shortcutTip || 'Check basic formula relations.',
                difficulty: item.difficulty || difficulty,
                marks: 2,
                negativeMarks: 0.5,
                questionType: 'single_mcq',
                tags: item.tags || [topicName, subjectName],
                source: `AI Generated Draft (${examName})`,
                isPYQ: false,
                isPublished: false // Requires admin review
            }));
        }
        catch (err) {
            console.error('Gemini Question Generation Error:', err);
            return getFallbackGeneratedQuestions(examName, subjectName, topicName, difficulty, count);
        }
    },
    /**
     * Start Veo 3 Video Generation
     */
    async generateVideo(prompt, aspectRatio) {
        const ai = getAiClient();
        if (!ai) {
            throw new Error('Gemini API is not configured.');
        }
        const operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: aspectRatio
            }
        });
        return operation.name ?? '';
    },
    /**
     * Check Veo 3 Video Status
     */
    async getVideoStatus(operationName) {
        const ai = getAiClient();
        if (!ai) {
            throw new Error('Gemini API is not configured.');
        }
        const op = new genai_1.GenerateVideosOperation();
        op.name = operationName;
        const updated = await ai.operations.getVideosOperation({ operation: op });
        return updated;
    },
    /**
     * Generate Multi-Scene Storyboard, Narration Script and Flashcards
     */
    async generateStoryboardAndAssets(prompt) {
        const ai = getAiClient();
        if (!ai) {
            return getFallbackStoryboardAssets(prompt);
        }
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Break down this conceptual topic or animation prompt: "${prompt}" into:
1. A structured 3-scene storyboarding flow suitable for Veo video generators.
2. An interactive Voiceover Narration script (1-2 sentences per scene).
3. A set of 5 multiple choice trivia/revision flashcards with explanation of the correct answers.

Ensure the output is valid JSON strictly matching this schema:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene 1 Title",
      "description": "Short summary of visual scene",
      "prompt": "Highly detailed physical visual rendering prompt for Veo 3.1 video generation",
      "narrationScript": "Narrative explanation for the speaker voiceover"
    }
  ],
  "flashcards": [
    {
      "question": "Revision question text about the concept?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Detailed scientific explanation..."
    }
  ]
}

Ensure you generate exactly 3 scenes and 5 multiple choice flashcards.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: genai_1.Type.OBJECT,
                        properties: {
                            scenes: {
                                type: genai_1.Type.ARRAY,
                                items: {
                                    type: genai_1.Type.OBJECT,
                                    properties: {
                                        sceneNumber: { type: genai_1.Type.INTEGER },
                                        title: { type: genai_1.Type.STRING },
                                        description: { type: genai_1.Type.STRING },
                                        prompt: { type: genai_1.Type.STRING },
                                        narrationScript: { type: genai_1.Type.STRING }
                                    },
                                    required: ['sceneNumber', 'title', 'description', 'prompt', 'narrationScript']
                                }
                            },
                            flashcards: {
                                type: genai_1.Type.ARRAY,
                                items: {
                                    type: genai_1.Type.OBJECT,
                                    properties: {
                                        question: { type: genai_1.Type.STRING },
                                        options: {
                                            type: genai_1.Type.ARRAY,
                                            items: { type: genai_1.Type.STRING }
                                        },
                                        answer: { type: genai_1.Type.STRING },
                                        explanation: { type: genai_1.Type.STRING }
                                    },
                                    required: ['question', 'options', 'answer', 'explanation']
                                }
                            }
                        },
                        required: ['scenes', 'flashcards']
                    }
                }
            });
            const text = response.text;
            if (!text)
                throw new Error('No content received from Gemini model.');
            return JSON.parse(text);
        }
        catch (error) {
            console.error('Error generating storyboard assets:', error);
            return getFallbackStoryboardAssets(prompt);
        }
    }
};
function getFallbackTutorResponse(userMessage, context) {
    const query = userMessage.toLowerCase();
    if (query.includes('percent') || query.includes('%')) {
        return `### ðŸ“Š Percentage Concepts & Exam Shortcuts

When preparing for **${context.targetExam || 'SSC CGL'}**, percentage problems test your speed with fractional multipliers.

#### 1. Core Fractional Equivalences
- $\\frac{1}{7} = 14.28\\%$ (or $14\\frac{2}{7}\\%$)
- $\\frac{1}{8} = 12.5\\%$
- $\\frac{1}{12} = 8.33\\%$
- $\\frac{1}{16} = 6.25\\%$

#### 2. Successive Percentage Formula
For two consecutive percentage changes $a\\%$ and $b\\%$:
$$\\text{Net Change} = a + b + \\frac{a \\times b}{100}\\%$$

#### 3. Expenditure Invariance Rule
If the price of an article increases by $R\\%$, the percentage reduction in consumption to keep expenditure constant is:
$$\\text{Reduction} = \\left(\\frac{R}{100 + R}\\right) \\times 100\\%$$

Would you like to practice 3 quick percentage questions or dive into Profit & Loss next?`;
    }
    if (query.includes('polity') || query.includes('constitution') || query.includes('article') || query.includes('fundamental right')) {
        return `### ðŸ›ï¸ Indian Polity: Fundamental Rights (Articles 12 to 35)

Fundamental Rights in Part III of the Constitution are a recurring high-weightage topic for **${context.targetExam || 'Competitive Exams'}**.

#### ðŸ”‘ Key Articles to Memorize
1. **Article 14**: Equality before law and Equal protection of laws.
2. **Article 17**: Abolition of Untouchability (Absolute Right).
3. **Article 19**: 6 Democratic Freedoms (Speech, Assembly, Association, Movement, Residence, Profession).
4. **Article 21**: Protection of Life & Personal Liberty.
5. **Article 21A**: Right to Education (86th Amendment Act, 2002).
6. **Article 32**: Right to Constitutional Remedies (**Heart and Soul of the Constitution** - Dr. B.R. Ambedkar).

#### ðŸ“œ The 5 Constitutional Writs (Article 32 / 226)
- **Habeas Corpus**: "To have the body of" (Against illegal detention).
- **Mandamus**: "We command" (Directs public authority to perform official duty).
- **Prohibition**: Issued by higher court to lower court to prevent exceeding jurisdiction.
- **Certiorari**: "To be certified" (Quashes order of lower court).
- **Quo-Warranto**: "By what warrant" (Prevents illegal usurpation of public office).

Would you like to take a quick 5-question drill on Constitutional Writs?`;
    }
    return `### ðŸŽ¯ AptitudeMax Exam Tutor

Hello **${context.studentName || 'Aspirant'}**! Based on your target **${context.targetExam || 'SSC CGL'}** and current analytics:

- **Key Focus Area**: ${context.weakTopics?.[0] || 'Profit & Loss & Time-Work'}
- **Current Performance**: Solid foundations with strong reasoning scores.

You can ask me to:
1. ðŸ’¡ **Explain any concept** (e.g. *"Explain Syllogisms using Venn diagrams"*, *"Derive compound interest successive formulas"*)
2. ðŸ” **Diagnose a mistake** (e.g. *"Why is dishonest dealer weight formula error/given weight?"*)
3. ðŸ“ **Generate targeted practice questions** on your weak topics.
4. â±ï¸ **Teach 10-second topper shortcuts** for arithmetic or grammar rules.

What concept or problem would you like to master right now?`;
}
function getFallbackGeneratedQuestions(examName, subjectName, topicName, difficulty, count) {
    return [
        {
            id: `draft_q_${Date.now()}_1`,
            questionText: `In an examination, 65% of students passed in Mathematics and 48% passed in Physics. If 30% passed in both subjects, what percentage of students failed in both subjects?`,
            options: [
                { id: 'opt_1', text: '17%', isCorrect: true },
                { id: 'opt_2', text: '23%', isCorrect: false },
                { id: 'opt_3', text: '13%', isCorrect: false },
                { id: 'opt_4', text: '27%', isCorrect: false }
            ],
            correctOptionId: 'opt_1',
            explanation: 'Using Set Theory: n(M âˆª P) = n(M) + n(P) - n(M âˆ© P) = 65% + 48% - 30% = 83% passed in at least one subject. Therefore, failed in both = 100% - 83% = 17%.',
            shortcutTip: 'Failed in both = 100 - (65 + 48 - 30) = 100 - 83 = 17%.',
            difficulty,
            marks: 2,
            negativeMarks: 0.5,
            questionType: 'single_mcq',
            tags: [topicName, 'Set Theory', 'Percentage'],
            source: `Draft for ${examName}`,
            isPYQ: false,
            isPublished: false
        }
    ];
}
function getFallbackNotesStudyPlan(notesText, noteTitle, examName, timetablePreferences) {
    // Extract topics by line breaks, headings, bullets or commas
    const rawLines = (notesText || '')
        .split(/\r?\n|,|;/)
        .map(s => s.trim().replace(/^[-*â€¢#\d.]+\s*/, ''))
        .filter(s => s.length > 2 && s.length < 80);
    // Always use whatever is in the notes text — NEVER fall back to hardcoded math/GK topics
    // Take up to 20 lines to ensure variety
    const distinctTopics = Array.from(new Set(rawLines)).slice(0, 20);
    // If notes are completely empty or unreadable, create generic placeholders
    // that at least use the note title so they're recognizable
    const baseTitle = noteTitle || 'Uploaded Notes';
    const extractedTopicNames = distinctTopics.length >= 1 ? distinctTopics : [
        `${baseTitle} - Core Concepts`,
        `${baseTitle} - Key Definitions`,
        `${baseTitle} - Practice Problems`,
        `${baseTitle} - Revision Summary`
    ];
    const extractedTopics = extractedTopicNames.map((name, idx) => {
        let subject = 'General Studies';
        if (/percent|profit|loss|ratio|math|quant|speed|work|algebra|geometry|interest/i.test(name)) {
            subject = 'Quantitative Aptitude';
        }
        else if (/syllogism|puzzle|blood|reasoning|venn|seating|coding/i.test(name)) {
            subject = 'Reasoning Ability';
        }
        else if (/english|grammar|vocab|idiom|comprehension|cloze/i.test(name)) {
            subject = 'English Language';
        }
        else if (/polity|history|geography|economy|current|gk|science|constitution/i.test(name)) {
            subject = 'General Studies';
        }
        return {
            id: `ext_top_${idx + 1}`,
            topicName: name,
            subjectCategory: subject,
            estimatedHours: Math.max(1.5, Math.round((timetablePreferences?.dailyHours || 2) * 0.75 * 10) / 10),
            difficulty: idx % 3 === 0 ? 'hard' : idx % 2 === 0 ? 'medium' : 'easy',
            keyFormulasOrHacks: [
                `High-yield revision formula for ${name}`,
                'Exam hack: Eliminate extreme boundary options first.'
            ],
            coreConcepts: [
                `Fundamental definitions and core theorems of ${name}`,
                'Frequently tested patterns in recent 5-year PYQs.'
            ],
            notesSnippet: `Extracted from uploaded notes: Focus on accuracy and speed multipliers for ${name}.`
        };
    });
    // Calculate time slot strings according to user preferences
    const slotLabels = {
        morning: ['06:30 AM - 08:00 AM', '08:15 AM - 09:30 AM'],
        afternoon: ['02:00 PM - 03:30 PM', '03:45 PM - 05:00 PM'],
        evening: ['06:00 PM - 07:30 PM', '07:45 PM - 09:00 PM'],
        night: ['09:30 PM - 11:00 PM', '11:15 PM - 12:15 AM']
    };
    const selectedSlotTimes = [];
    (timetablePreferences?.preferredTimeSlots || ['morning', 'evening']).forEach(slot => {
        if (slotLabels[slot]) {
            selectedSlotTimes.push(...slotLabels[slot]);
        }
    });
    if (selectedSlotTimes.length === 0) {
        selectedSlotTimes.push('07:00 AM - 08:30 AM', '06:30 PM - 08:00 PM');
    }
    const daysCount = Math.max(3, Math.min(30, timetablePreferences?.targetDays || 7));
    const restDaysList = timetablePreferences?.restDays || [];
    const schedule = [];
    const startDate = new Date();
    for (let d = 1; d <= daysCount; d++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + (d - 1));
        const dateStr = dayDate.toISOString().split('T')[0];
        const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
        const isRest = restDaysList.includes(dayOfWeek);
        const topicA = extractedTopics[(d - 1) % extractedTopics.length];
        const topicB = extractedTopics[d % extractedTopics.length];
        const dailyHrs = timetablePreferences?.dailyHours || 2;
        const tasks = isRest
            ? [
                {
                    id: `task_d${d}_rest`,
                    timeSlot: selectedSlotTimes[0] || '08:00 AM - 09:00 AM',
                    subjectName: 'Weekly Consolidation',
                    topicName: 'Light Formula Revision & Mistake Notebook Review',
                    activityType: 'revision',
                    durationMinutes: 60,
                    targetQuestionsCount: 10,
                    taskObjective: 'Review past mistakes and consolidate formula memory without fatigue.',
                    extractedCheatNotes: 'Active recall for formula deck.',
                    priority: 'low'
                }
            ]
            : [
                {
                    id: `task_d${d}_1`,
                    timeSlot: selectedSlotTimes[0] || '07:00 AM - 08:30 AM',
                    subjectName: topicA.subjectCategory,
                    topicName: topicA.topicName,
                    activityType: 'concept_study',
                    durationMinutes: Math.round(dailyHrs * 30),
                    targetQuestionsCount: 15,
                    taskObjective: `Deep study notes for ${topicA.topicName} and master key derivations.`,
                    extractedCheatNotes: topicA.keyFormulasOrHacks[0] || 'Key formulas extracted from notes.',
                    priority: 'high'
                },
                {
                    id: `task_d${d}_2`,
                    timeSlot: selectedSlotTimes[1] || selectedSlotTimes[0] || '06:00 PM - 07:30 PM',
                    subjectName: topicB.subjectCategory,
                    topicName: topicB.topicName,
                    activityType: 'topic_practice',
                    durationMinutes: Math.round(dailyHrs * 30),
                    targetQuestionsCount: 20,
                    taskObjective: `Timed PYQ drill on ${topicB.topicName} using exam shortcuts.`,
                    extractedCheatNotes: topicB.keyFormulasOrHacks[1] || 'Eliminate extreme choices.',
                    priority: 'medium'
                }
            ];
        const totalMins = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
        schedule.push({
            dayNumber: d,
            date: dateStr,
            focusTitle: isRest ? `Day ${d}: Active Recovery & Retention Review` : `Day ${d}: ${topicA.topicName} & ${topicB.topicName}`,
            totalMinutes: totalMins,
            isRestDay: isRest,
            tasks
        });
    }
    return {
        planTitle: `${noteTitle} - Personalized ${daysCount}-Day Master Timetable`,
        syllabusSummary: `Organized ${extractedTopics.length} core topics extracted from your notes tailored for ${examName}.`,
        extractedTopics,
        timetableSummary: `Customized for ${timetablePreferences?.dailyHours || 2}h daily study across ${(timetablePreferences?.preferredTimeSlots || ['morning', 'evening']).join(', ')} slots with ${(timetablePreferences?.studyRhythm || 'pomodoro').replace('_', ' ')} rhythm.`,
        adaptiveNotes: [
            `Syllabus broken down into high-retention daily modules matching your ${(timetablePreferences?.preferredTimeSlots || ['morning', 'evening']).join(' & ')} routine.`,
            `Spaced repetition intervals placed on Day 3 and Day 7 to prevent memory decay.`,
            `Includes 15-20 daily speed practice questions calibrated for ${examName}.`
        ],
        facultyTips: [
            'Prioritize concept notes in the first session before jumping into speed practice.',
            'Spend 10 minutes before sleep doing active recall on the formulas memorized earlier.'
        ],
        spacedRepetitionPlan: [
            {
                reviewDay: 3,
                topicsToRecall: [extractedTopics[0]?.topicName || 'Core Principles'],
                technique: 'Active Recall & Flash Formula Drill'
            },
            {
                reviewDay: 7,
                topicsToRecall: [extractedTopics[1]?.topicName || 'Intermediate Applications', extractedTopics[2]?.topicName || 'Revision'],
                technique: 'Comprehensive PYQ Speed Test (25 Qs)'
            }
        ],
        schedule
    };
}
function getFallbackSyllabusAnalysis(syllabusText, examName, syllabusTitle, examCategory, dailyHours, targetDays, preferredSlots, subjectCode) {
    // Parse lines or sections
    const rawLines = (syllabusText || '')
        .split(/\r?\n|â€¢|\*/)
        .map(s => s.trim().replace(/^[-*â€¢#\d.]+\s*/, ''))
        .filter(s => s.length > 3 && s.length < 120);
    // Group into 5 units
    const isComputerScience = /data structure|algorithm|tree|graph|operating system|database|sql|network|compiler|software|python|java|c\+\+|automata/i.test(syllabusText + ' ' + examName);
    const isMathOrQuant = /percentage|algebra|calculus|differential|matrix|vector|geometry|arithmetic|trigonometry|probability|statistics/i.test(syllabusText + ' ' + examName);
    const isGovtOrGS = /polity|constitution|history|geography|economy|governance|upsc|ssc|tnpsc|banking|reasoning/i.test(syllabusText + ' ' + examName);
    let unitBlueprints = [];
    if (isComputerScience) {
        unitBlueprints = [
            {
                title: 'Unit 1: Linear Data Structures & Algorithm Analysis',
                topics: [
                    {
                        name: 'Array ADT, Linked Lists & Polynomial Addition',
                        difficulty: 'easy',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 12,
                        hours: 3.5,
                        formulas: ['Singly linked list insertion: O(1) at head, O(n) at tail', 'Polynomial node structure: (coeff, exp, next)'],
                        sample2Mark: { q: 'What is an Abstract Data Type (ADT)? Give examples.', a: 'An ADT is a mathematical model with a collection of operations defined independently of representation (e.g., Stack ADT, List ADT).' },
                        sample16Mark: { q: 'Explain polynomial addition using singly linked lists with complete algorithm and trace diagram.', a: 'Step 1: Traverse both polynomials simultaneously comparing exponents. Step 2: Add coefficients if exponents match. Step 3: Append remaining nodes.' }
                    },
                    {
                        name: 'Stack & Queue Applications (Infix to Postfix & Evaluation)',
                        difficulty: 'medium',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 10,
                        hours: 4.0,
                        formulas: ['Postfix evaluation: Operand -> Push; Operator -> Pop 2, Apply, Push result', 'Circular queue condition: (rear + 1) % MAX == front'],
                        sample2Mark: { q: 'Convert the infix expression A + B * C to postfix form.', a: 'Postfix result: A B C * +. Multiplication takes precedence before addition.' },
                        sample16Mark: { q: 'Describe the algorithm for converting an Infix expression to Postfix with operator precedence table and stack trace.', a: 'Use operator stack. Higher precedence operators pop lower precedence operators before pushing.' }
                    }
                ]
            },
            {
                title: 'Unit 2: Non-Linear Structures: Trees & Binary Search Trees',
                topics: [
                    {
                        name: 'Binary Trees, Tree Traversals (Inorder, Preorder, Postorder)',
                        difficulty: 'easy',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 10,
                        hours: 3.0,
                        formulas: ['Max nodes in binary tree of height h = 2^(h+1) - 1', 'Inorder of BST always produces ascending sorted sequence'],
                        sample2Mark: { q: 'State the properties of a strictly binary tree.', a: 'Every non-leaf node has exactly two children. Total nodes = 2*leaves - 1.' },
                        sample16Mark: { q: 'Construct a binary tree from given Preorder and Inorder traversal sequences with step-by-step illustrations.', a: 'First element of Preorder is Root. Locate root in Inorder to partition Left and Right subtrees recursively.' }
                    },
                    {
                        name: 'AVL Trees & Rotations (LL, RR, LR, RL)',
                        difficulty: 'hard',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 12,
                        hours: 5.0,
                        formulas: ['Balance Factor BF = height(Left) - height(Right) in {-1, 0, +1}', 'LR rotation = Left rotation on left child, then Right rotation on root'],
                        sample2Mark: { q: 'Define Balance Factor in AVL Trees.', a: 'BF = Height of Left Subtree minus Height of Right Subtree. Must be -1, 0, or +1.' },
                        sample16Mark: { q: 'Explain AVL tree balancing with illustrations for LL, RR, LR and RL rotations with numerical example.', a: 'Demonstrate single rotations for outside cases (LL, RR) and double rotations for inside cases (LR, RL).' }
                    }
                ]
            },
            {
                title: 'Unit 3: Graph Algorithms & Minimum Spanning Trees',
                topics: [
                    {
                        name: 'Graph Representations & Traversals (BFS & DFS)',
                        difficulty: 'medium',
                        weightageTier: 'Medium-Yield',
                        weightage: 8,
                        hours: 3.5,
                        formulas: ['BFS uses Queue ADT: Time O(V + E)', 'DFS uses Stack/Recursion: Time O(V + E)'],
                        sample2Mark: { q: 'Differentiate between BFS and DFS traversal strategies.', a: 'BFS explores level-by-level using Queue; DFS explores depth-first using recursion/stack.' },
                        sample16Mark: { q: 'Explain Breadth First Search (BFS) and Depth First Search (DFS) on an undirected graph with adjacency list and queue trace.', a: 'Provide pseudocode, vertex visitation order, and edge classification (Tree, Back, Cross edges).' }
                    },
                    {
                        name: 'Dijkstra Single Source Shortest Path & MST (Prim/Kruskal)',
                        difficulty: 'hard',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 14,
                        hours: 5.5,
                        formulas: ["Dijkstra Relaxation: if (dist[u] + w(u,v) < dist[v]) dist[v] = dist[u] + w(u,v)", "Kruskal's algorithm uses Disjoint Set Union (DSU) sorted by weight"],
                        sample2Mark: { q: "State the greedy choice property in Prim's algorithm.", a: 'Always choose the minimum weight edge connecting a visited vertex in MST to an unvisited vertex.' },
                        sample16Mark: { q: "Trace Dijkstra's shortest path algorithm step-by-step for a given weighted directed graph with distance table.", a: 'Initialize source dist=0, others=inf. Repeatedly pick minimum unvisited vertex, relax adjacent edges, update predecessors.' }
                    }
                ]
            },
            {
                title: 'Unit 4: Hashing, Heaps & Advanced Search',
                topics: [
                    {
                        name: 'Hash Functions & Collision Resolution Techniques',
                        difficulty: 'medium',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 10,
                        hours: 4.0,
                        formulas: ['Linear Probing: h(k, i) = (h(k) + i) % M', 'Quadratic Probing: h(k, i) = (h(k) + c1*i + c2*i^2) % M', 'Load factor Î± = n / m'],
                        sample2Mark: { q: 'What is primary clustering in open addressing hash tables?', a: 'Primary clustering occurs when long continuous runs of occupied slots build up, degrading lookup time to O(n).' },
                        sample16Mark: { q: 'Explain Open Addressing (Linear, Quadratic, Double Hashing) vs Separate Chaining with load factor analysis.', a: 'Compare memory overhead, cache performance, deletion complexity, and clustering behaviors.' }
                    },
                    {
                        name: 'Binary Heaps, Priority Queues & Heap Sort',
                        difficulty: 'medium',
                        weightageTier: 'Medium-Yield',
                        weightage: 8,
                        hours: 3.5,
                        formulas: ['Parent index = (i - 1) / 2', 'Left child = 2i + 1, Right child = 2i + 2', 'Build-Heap Time: O(n), Heap Sort Time: O(n log n)'],
                        sample2Mark: { q: 'Define Max-Heap and Min-Heap property.', a: 'In a Max-Heap, key at root >= keys of all descendants; in Min-Heap, key at root <= keys of all descendants.' },
                        sample16Mark: { q: 'Explain Heap Sort algorithm with build-heap phase and extract-max phase on an unsorted array.', a: 'Step 1: Build max-heap in O(n). Step 2: Swap root with last element, reduce heap size, sift-down root. Repeat n-1 times.' }
                    }
                ]
            },
            {
                title: 'Unit 5: Algorithm Design Paradigms & Complexity Analysis',
                topics: [
                    {
                        name: 'Divide & Conquer (Merge Sort, Quick Sort & Recurrence)',
                        difficulty: 'medium',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 10,
                        hours: 4.0,
                        formulas: ["Master Theorem: T(n) = aT(n/b) + O(n^d)", 'Merge Sort: T(n) = 2T(n/2) + O(n) => O(n log n)', 'Quick Sort Worst Case: O(n^2), Best: O(n log n)'],
                        sample2Mark: { q: 'State Master Theorem for solving divide and conquer recurrences.', a: 'Compares n^(log_b(a)) with f(n) to identify if work is dominated by leaf nodes, root, or evenly distributed.' },
                        sample16Mark: { q: 'Derive the time complexity of Quick Sort in best, average and worst cases with partition algorithm.', a: 'Analyze pivot selection, recurrence trees, and demonstrate why already sorted array yields O(n^2) without randomized pivot.' }
                    },
                    {
                        name: 'Dynamic Programming & Greedy Approaches (0/1 Knapsack, LCS)',
                        difficulty: 'hard',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 14,
                        hours: 5.5,
                        formulas: ['DP 0/1 Knapsack: DP[i][w] = max(DP[i-1][w], val[i] + DP[i-1][w - wt[i]])', 'LCS: if (X[i]==Y[j]) 1 + LCS(i-1,j-1) else max(LCS(i-1,j), LCS(i,j-1))'],
                        sample2Mark: { q: 'State the difference between Greedy method and Dynamic Programming.', a: 'Greedy makes irrevocable locally optimal choice at each step; DP explores overlapping subproblems and memoizes global optimum.' },
                        sample16Mark: { q: 'Solve 0/1 Knapsack problem using Dynamic Programming with table construction and item traceback.', a: 'Define state recurrence, construct (N+1) x (W+1) table, fill row-by-row, trace back to find included items.' }
                    }
                ]
            }
        ];
    }
    else if (isMathOrQuant) {
        unitBlueprints = [
            {
                title: 'Unit 1: Number Systems, Arithmetic & Speed Calculation',
                topics: [
                    {
                        name: 'Percentage, Ratio & Proportions Multipliers',
                        difficulty: 'easy',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 14,
                        hours: 3.5,
                        formulas: ['Fraction conversion: 1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%', 'Successive change: a + b + (ab)/100'],
                        sample2Mark: { q: 'If price rises by 25%, by what percentage must consumption fall to keep expenditure constant?', a: 'Required reduction = 25 / (100 + 25) * 100 = 20%.' },
                        sample16Mark: { q: 'Comprehensive applications of mixture, alligation and ratio changes in tiered financial setups.', a: 'Apply weighted average alligation cross-multiplication rule to solve multi-vessel dilutions.' }
                    }
                ]
            },
            {
                title: 'Unit 2: Commercial Mathematics & Time-Distance Mechanics',
                topics: [
                    {
                        name: 'Profit, Loss, Discount & Compound Interest CI-SI Differentials',
                        difficulty: 'medium',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 12,
                        hours: 4.5,
                        formulas: ['2-Year CI - SI difference = P * (R/100)^2', 'Marked Price * (100 - d)% = Cost Price * (100 + g)%'],
                        sample2Mark: { q: 'State the formula for 2-year CI and SI difference.', a: 'Difference = P * (r/100)^2.' },
                        sample16Mark: { q: 'Derive the effective annual interest rate under semi-annual and quarterly compounding with multi-step amortization.', a: 'Equate compound amount equations and solve for principal amortization rate.' }
                    }
                ]
            },
            {
                title: 'Unit 3: Advanced Algebra & Polynomial Roots',
                topics: [
                    {
                        name: 'Quadratic Equations, Symmetric Functions of Roots & Inequalities',
                        difficulty: 'medium',
                        weightageTier: 'Medium-Yield',
                        weightage: 10,
                        hours: 4.0,
                        formulas: ['Sum of roots Î±+Î² = -b/a, Product Î±Î² = c/a', 'Discriminant D = b^2 - 4ac'],
                        sample2Mark: { q: 'If roots of ax^2 + bx + c = 0 are reciprocal, find relation between a and c.', a: 'Product of roots = 1 => c/a = 1 => a = c.' },
                        sample16Mark: { q: 'Solve higher-order polynomial symmetry equations and find maximum/minimum under algebraic constraints.', a: 'Use AM-GM inequality and Cauchy-Schwarz inequality to establish boundary limits.' }
                    }
                ]
            },
            {
                title: 'Unit 4: Geometry, Trigonometric Heights & Mensuration',
                topics: [
                    {
                        name: 'Circle Theorems, Tangents & Triangle Centers (Incenter, Circumcenter)',
                        difficulty: 'hard',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 12,
                        hours: 5.0,
                        formulas: ['Angle at center = 2 * Angle at circumference', 'Inradius r = Area / semi-perimeter (s)'],
                        sample2Mark: { q: 'State Alternate Segment Theorem.', a: 'The angle between a tangent and a chord through the point of contact equals the angle subtended in the alternate segment.' },
                        sample16Mark: { q: 'Prove cyclic quadrilateral Ptolemy theorem and apply to calculate diagonal length from side measures.', a: 'Product of diagonals = sum of products of opposite sides (AC * BD = AB*CD + BC*AD).' }
                    }
                ]
            },
            {
                title: 'Unit 5: Data Interpretation, Probability & Combinatorics',
                topics: [
                    {
                        name: 'Permutations, Combinations & Conditional Probability',
                        difficulty: 'hard',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 12,
                        hours: 4.5,
                        formulas: ['nCr = n! / (r! * (n-r)!)', 'Bayes Theorem: P(A|B) = [P(B|A)*P(A)] / P(B)'],
                        sample2Mark: { q: 'State the Multiplication Rule of Probability for independent events.', a: 'P(A âˆ© B) = P(A) * P(B).' },
                        sample16Mark: { q: 'Explain Bayes Theorem with derivation and solve 3-machine manufacturing defect diagnosis scenario.', a: 'Calculate total probability in denominator and posterior probability for suspect machine.' }
                    }
                ]
            }
        ];
    }
    else {
        // Standard Universal 5-Unit Template adaptable to any exam or syllabus text
        const topicPool = rawLines.length >= 5 ? rawLines : [
            'Foundational Concepts, Definitions & Historical Background',
            'Structural Principles, Classifications & Core Frameworks',
            'Analytical Methods, Mathematical Models & Case Studies',
            'System Architecture, Protocols & Standard Procedures',
            'Advanced Applications, Optimization & Modern Industry Trends'
        ];
        unitBlueprints = [
            {
                title: `Unit 1: ${topicPool[0] || 'Foundations & Core Principles'}`,
                topics: [
                    {
                        name: topicPool[0] || 'Foundational Definitions & Scope',
                        difficulty: 'easy',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 12,
                        hours: 3.5,
                        formulas: ['Fundamental governing definition', 'Primary classification criteria'],
                        sample2Mark: { q: `State the primary purpose and scope of ${topicPool[0]}.`, a: 'Provides standard baseline conventions and operational guidelines tested repeatedly in Part-A.' },
                        sample16Mark: { q: `Explain the complete theoretical framework of ${topicPool[0]} with detailed diagrams.`, a: 'Structure answer with: 1. Introduction, 2. Block Diagram, 3. Mathematical Formula, 4. Step-by-Step Working, 5. Merits & Applications.' }
                    }
                ]
            },
            {
                title: `Unit 2: ${topicPool[1] || 'Structural Design & Methodologies'}`,
                topics: [
                    {
                        name: topicPool[1] || 'Methodology & Procedural Guidelines',
                        difficulty: 'medium',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 10,
                        hours: 4.0,
                        formulas: ['Analytical evaluation formula', 'Performance benchmarking metric'],
                        sample2Mark: { q: `List any two major advantages of ${topicPool[1]}.`, a: '1. High precision and reproducibility. 2. Low resource overhead in execution.' },
                        sample16Mark: { q: `Describe the step-by-step implementation of ${topicPool[1]} with a worked numerical or architectural example.`, a: 'Present tabulated data, intermediate variable traces, and state transitions clearly.' }
                    }
                ]
            },
            {
                title: `Unit 3: ${topicPool[2] || 'Analytical Models & Problem Solving'}`,
                topics: [
                    {
                        name: topicPool[2] || 'Analytical Derivations & Calculations',
                        difficulty: 'hard',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 14,
                        hours: 5.0,
                        formulas: ['Core analytical derivation equation', 'Boundary condition constraints'],
                        sample2Mark: { q: `State the critical boundary condition for ${topicPool[2]}.`, a: 'Must satisfy conservation law and stability threshold under maximum load conditions.' },
                        sample16Mark: { q: `Derive the governing mathematical formula for ${topicPool[2]} and analyze sensitivity under varying parameters.`, a: 'Start with fundamental differential or algebraic laws and arrive at closed-form expression.' }
                    }
                ]
            },
            {
                title: `Unit 4: ${topicPool[3] || 'System Architecture & Execution Workflows'}`,
                topics: [
                    {
                        name: topicPool[3] || 'System Design & Execution',
                        difficulty: 'medium',
                        weightageTier: 'Medium-Yield',
                        weightage: 8,
                        hours: 3.5,
                        formulas: ['Throughput equation', 'Efficiency metric calculation'],
                        sample2Mark: { q: `Define efficiency in the context of ${topicPool[3]}.`, a: 'Ratio of useful output deliverable to total input energy/resource consumed.' },
                        sample16Mark: { q: `Draw and explain the modular architecture of ${topicPool[3]} highlighting inter-module communication.`, a: 'Include neat labelled layout, bus/data flow arrows, and functional descriptions of each block.' }
                    }
                ]
            },
            {
                title: `Unit 5: ${topicPool[4] || 'Advanced Applications & Real-World Case Studies'}`,
                topics: [
                    {
                        name: topicPool[4] || 'Contemporary Trends & Case Studies',
                        difficulty: 'hard',
                        weightageTier: 'High-Yield (Must Master)',
                        weightage: 12,
                        hours: 4.5,
                        formulas: ['Optimization objective function', 'Risk factor estimation matrix'],
                        sample2Mark: { q: `Identify the modern bottleneck faced in ${topicPool[4]}.`, a: 'Scalability constraints and latency bottlenecks under high-volume parallel workloads.' },
                        sample16Mark: { q: `Critically evaluate a real-world case study on ${topicPool[4]} proposing an optimal solution with trade-offs.`, a: 'Highlight architectural decisions, performance metrics, fault tolerance, and comparative benchmark results.' }
                    }
                ]
            }
        ];
    }
    // Construct structured units & allTopics list
    const structuredUnits = [];
    const allTopics = [];
    unitBlueprints.forEach((ub, uIdx) => {
        const unitTopics = [];
        const unitNum = uIdx + 1;
        ub.topics.forEach((t, tIdx) => {
            const topicObj = {
                id: `syl_top_${unitNum}_${tIdx + 1}`,
                topicName: t.name,
                unitOrModule: `Unit ${unitNum}: ${ub.title.replace(/^Unit \d+:\s*/i, '')}`,
                subjectCategory: examName,
                weightageTier: t.weightageTier,
                weightagePercentage: t.weightage,
                estimatedStudyHours: t.hours,
                difficulty: t.difficulty,
                prerequisites: uIdx > 0 ? [`Unit ${uIdx} Foundations`] : [],
                keyFormulasOrConcepts: t.formulas,
                notesSummary: `Key high-yield module extracted from syllabus. Master the 2-mark definition and 16-mark blueprint for guaranteed exam scoring.`,
                isCompleted: false,
                sampleQuestions: [
                    {
                        questionType: '2_mark_definition',
                        questionText: t.sample2Mark.q,
                        answerHint: t.sample2Mark.a,
                        marks: 2
                    },
                    {
                        questionType: '16_mark_problem',
                        questionText: t.sample16Mark.q,
                        answerHint: t.sample16Mark.a,
                        marks: 16
                    }
                ]
            };
            unitTopics.push(topicObj);
            allTopics.push(topicObj);
        });
        const totalMarks = unitTopics.reduce((s, t) => s + (t.sampleQuestions.reduce((qs, q) => qs + q.marks, 0) || 20), 0);
        const totalHrs = unitTopics.reduce((s, t) => s + t.estimatedStudyHours, 0);
        structuredUnits.push({
            unitNumber: unitNum,
            unitName: ub.title,
            totalWeightageMarks: totalMarks,
            estimatedHours: Math.round(totalHrs * 10) / 10,
            topics: unitTopics
        });
    });
    // Build Day-by-Day Schedule for targetDays
    const slotLabels = {
        morning: ['06:30 AM - 08:30 AM', '08:45 AM - 10:00 AM'],
        afternoon: ['02:00 PM - 04:00 PM', '04:15 PM - 05:30 PM'],
        evening: ['06:00 PM - 08:00 PM', '08:15 PM - 09:30 PM'],
        night: ['09:30 PM - 11:30 PM', '11:45 PM - 12:45 AM']
    };
    const selectedSlotTimes = [];
    preferredSlots.forEach(slot => {
        if (slotLabels[slot])
            selectedSlotTimes.push(...slotLabels[slot]);
    });
    if (selectedSlotTimes.length === 0) {
        selectedSlotTimes.push('07:00 AM - 09:00 AM', '06:30 PM - 08:30 PM');
    }
    const scheduleDays = [];
    const startDate = new Date();
    for (let d = 1; d <= targetDays; d++) {
        const curDate = new Date(startDate);
        curDate.setDate(startDate.getDate() + (d - 1));
        const dateStr = curDate.toISOString().split('T')[0];
        const isEve = d === targetDays;
        const isMidRevision = d === Math.ceil(targetDays / 2);
        const topicIndex = (d - 1) % allTopics.length;
        const activeTopic = allTopics[topicIndex];
        const unitNumber = Math.min(5, Math.ceil((d / targetDays) * 5));
        const unitObj = structuredUnits[unitNumber - 1] || structuredUnits[0];
        const tasks = [];
        if (isEve) {
            tasks.push({
                id: `task_d${d}_1`,
                timeSlot: selectedSlotTimes[0] || '07:00 AM - 09:00 AM',
                subjectOrUnit: 'Full Syllabus Speed Review',
                topicName: 'Formula Sheet & Part-A 2-Mark Flashcard Speed Run',
                activityType: 'formula_mastery',
                durationMinutes: Math.round(dailyHours * 30),
                targetDeliverable: 'Review all 10 high-yield 2-mark definitions across all 5 units',
                highYieldKeyNotes: 'Check diagrams, keyword definitions, and exam hall stationery checklist.',
                priority: 'high'
            }, {
                id: `task_d${d}_2`,
                timeSlot: selectedSlotTimes[1] || selectedSlotTimes[0] || '06:00 PM - 08:00 PM',
                subjectOrUnit: 'Model Exam Simulation',
                topicName: '3-Hour Timed Mock Paper / Blueprint Write-up',
                activityType: 'pyq_simulation',
                durationMinutes: Math.round(dailyHours * 30),
                targetDeliverable: 'Simulate 1 full question paper under exam conditions with neat pen diagrams',
                highYieldKeyNotes: 'Time budget: Part A = 25 mins, Part B = 130 mins, Verification = 25 mins.',
                priority: 'high'
            });
        }
        else if (isMidRevision) {
            tasks.push({
                id: `task_d${d}_1`,
                timeSlot: selectedSlotTimes[0] || '07:00 AM - 09:00 AM',
                subjectOrUnit: 'Consolidation Checkpoint',
                topicName: 'Units 1 & 2 Retentive Active Recall & Mistake Correction',
                activityType: 'active_recall',
                durationMinutes: Math.round(dailyHours * 30),
                targetDeliverable: 'Retest memory on Units 1 and 2 theorems without looking at solution notes',
                highYieldKeyNotes: 'Identify weak derivation steps and rewrite tricky formulas 3 times.',
                priority: 'medium'
            }, {
                id: `task_d${d}_2`,
                timeSlot: selectedSlotTimes[1] || selectedSlotTimes[0] || '06:00 PM - 08:00 PM',
                subjectOrUnit: unitObj.unitName,
                topicName: activeTopic.topicName,
                activityType: 'problem_solving_drill',
                durationMinutes: Math.round(dailyHours * 30),
                targetDeliverable: `Solve 2 standard 16-mark problems on ${activeTopic.topicName}`,
                highYieldKeyNotes: activeTopic.keyFormulasOrConcepts[0] || 'Focus on accuracy.',
                priority: 'high'
            });
        }
        else {
            tasks.push({
                id: `task_d${d}_1`,
                timeSlot: selectedSlotTimes[0] || '07:00 AM - 09:00 AM',
                subjectOrUnit: activeTopic.unitOrModule,
                topicName: `${activeTopic.topicName} - Core Theory & Derivations`,
                activityType: 'concept_deep_dive',
                durationMinutes: Math.round(dailyHours * 35),
                targetDeliverable: `Master definitions and algorithmic trace for ${activeTopic.topicName}`,
                highYieldKeyNotes: activeTopic.keyFormulasOrConcepts[0] || 'High-yield scoring concept.',
                priority: 'high'
            }, {
                id: `task_d${d}_2`,
                timeSlot: selectedSlotTimes[1] || selectedSlotTimes[0] || '06:00 PM - 08:00 PM',
                subjectOrUnit: activeTopic.unitOrModule,
                topicName: `${activeTopic.topicName} - 16-Mark Blueprints & Speed Drills`,
                activityType: 'problem_solving_drill',
                durationMinutes: Math.round(dailyHours * 25),
                targetDeliverable: `Solve Part-B questions and memorize Part-A flashcards for ${activeTopic.topicName}`,
                highYieldKeyNotes: activeTopic.sampleQuestions[0]?.answerHint || 'Memorize exact evaluator keywords.',
                priority: 'medium'
            });
        }
        const totalMins = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
        scheduleDays.push({
            dayNumber: d,
            date: dateStr,
            focusTitle: isEve
                ? `Day ${d}: Final Eve Exam Simulation & Formula Consolidation`
                : isMidRevision
                    ? `Day ${d}: Mid-Term Mastery & Unit 1-2 Retention Checkpoint`
                    : `Day ${d}: ${activeTopic.topicName}`,
            unitOrTheme: activeTopic.unitOrModule,
            totalStudyMinutes: totalMins,
            isRestOrRevisionDay: isMidRevision,
            tasks
        });
    }
    const totalPrepHours = Math.round(targetDays * dailyHours * 0.9);
    const highYieldCount = allTopics.filter(t => t.weightageTier.toLowerCase().includes('high')).length;
    return {
        id: `syl_ana_${Date.now()}`,
        examName,
        examCategory,
        subjectCode,
        syllabusDocTitle: syllabusTitle,
        parsedAt: new Date().toISOString(),
        summary: `Structured ${allTopics.length} topics across ${structuredUnits.length} units extracted from "${syllabusTitle}". Generated a balanced ${targetDays}-day schedule with ${dailyHours}h daily study.`,
        totalUnitsCount: structuredUnits.length,
        totalTopicsCount: allTopics.length,
        totalEstimatedPrepHours: totalPrepHours,
        highYieldTopicsCount: highYieldCount,
        units: structuredUnits,
        allTopics,
        schedule: scheduleDays,
        strategicExamTips: [
            'Master all Part-A (2-Mark) definitions first: They provide an effortless 20-mark head start.',
            'Always draw labelled diagrams in pencil and box final formulas with pen to maximize examiner presentation marks.',
            'In numerical/algorithmic questions, write down the formula, variable definitions, and intermediate steps for partial marking.',
            'Prioritize Unit 1 and Unit 2 in early revision as they carry high foundational weight in Part-B.'
        ],
        spacedRepetitionPlan: [
            { checkpointDay: 3, unitsToReview: ['Unit 1: Core Foundations'], recallMethod: '2-Mark Flashcard Active Recall' },
            { checkpointDay: Math.ceil(targetDays / 2), unitsToReview: ['Unit 1 & Unit 2'], recallMethod: 'Timed 16-Mark Problem Writing' },
            { checkpointDay: targetDays - 1, unitsToReview: ['All 5 Units'], recallMethod: 'Comprehensive Formula Sheet & Model Exam Run' }
        ],
        weightageBreakdown: structuredUnits.map(u => ({
            unitOrSubject: `Unit ${u.unitNumber}`,
            percentage: 20,
            marks: u.totalWeightageMarks
        }))
    };
}
function getFallbackStoryboardAssets(prompt) {
    const cleanPrompt = prompt.toLowerCase();
    if (cleanPrompt.includes('dna') || cleanPrompt.includes('bio')) {
        return {
            scenes: [
                {
                    sceneNumber: 1,
                    title: "The DNA Double Helix Core Structure",
                    description: "A slow 3D rotation of a pristine double helix molecule with bases glowing in cyan and magenta against a clean physics blueprint backdrop.",
                    prompt: "Double helix DNA molecule, slow 3D rotation, glowing nucleotide bases (cyan and magenta), mathematical grid blueprint backdrop, high precision laboratory rendering.",
                    narrationScript: "Our exploration begins at the microscopic level with the double helix structure of DNA, the blueprint of all organic life."
                },
                {
                    sceneNumber: 2,
                    title: "Helicase Unzipping Mechanism",
                    description: "The active unzipping process of the DNA chain as Helicase splits hydrogen bonds, revealing base pairings in real-time.",
                    prompt: "Helicase enzyme sliding along DNA chain, splitting double helix into single strands, hydrogen bonds breaking, glowing chemical reactions, slow motion 4k scientific animation.",
                    narrationScript: "Next, watch as the helicase enzyme gracefully unzips the molecular chain, exposing individual chemical base sequences for transcription."
                },
                {
                    sceneNumber: 3,
                    title: "RNA Polymerase Synthesis",
                    description: "RNA Polymerase sliding along the template strand, assembling a matching single-stranded messenger RNA.",
                    prompt: "RNA Polymerase molecule sliding along single-strand DNA template, synthesizing single-stranded mRNA with vibrant base matching, ultra-detailed biology simulation.",
                    narrationScript: "Finally, the RNA Polymerase reads the single-stranded blueprint, synthesizing a complete, highly accurate messenger RNA chain ready for cellular translation."
                }
            ],
            flashcards: [
                {
                    question: "Which enzyme is directly responsible for unzipping the DNA double helix?",
                    options: ["RNA Polymerase", "DNA Ligase", "Helicase", "Topoisomerase"],
                    answer: "Helicase",
                    explanation: "Helicase is the specialized motor enzyme that actively untwists and separates the complementary double strands of DNA."
                },
                {
                    question: "What sugar molecule is present in a messenger RNA (mRNA) nucleotide?",
                    options: ["Deoxyribose", "Ribose", "Fructose", "Glucose"],
                    answer: "Ribose",
                    explanation: "Unlike DNA which utilizes deoxyribose, RNA molecules contain ribose sugar, which possesses an additional hydroxyl (-OH) group."
                },
                {
                    question: "Which nucleotide base replaces Thymine (T) in all RNA sequences?",
                    options: ["Adenine (A)", "Cytosine (C)", "Uracil (U)", "Guanine (G)"],
                    answer: "Uracil (U)",
                    explanation: "In RNA, Thymine is completely substituted with Uracil, which bonds directly to Adenine during base pairing."
                },
                {
                    question: "In which cellular compartment does eukaryotic transcription occur?",
                    options: ["Cytoplasm", "Nucleus", "Ribosome", "Mitochondria"],
                    answer: "Nucleus",
                    explanation: "Transcription of DNA to RNA occurs securely within the membrane-bound nucleus of eukaryotic cells."
                },
                {
                    question: "What is the primary product of the transcription process?",
                    options: ["Polypeptide chain", "Double helix DNA replica", "Single-stranded mRNA", "ATP energy unit"],
                    answer: "Single-stranded mRNA",
                    explanation: "Transcription's primary role is synthesizing a temporary single-stranded messenger RNA copy of a target gene locus."
                }
            ]
        };
    }
    // Default wave / mathematical fallback
    return {
        scenes: [
            {
                sceneNumber: 1,
                title: "Harmonic Wave Genesis",
                description: "A single pure sinusoidal wave propagating horizontally on a dark vector grid canvas with crisp gridlines.",
                prompt: "Sinusoidal wave propagation, horizontal animation, bright glowing cyan line over black mathematical gridded blueprint, crisp typography labels.",
                narrationScript: "Let's first visualize a single pure harmonic wave, propagating continuously through physical space with constant amplitude."
            },
            {
                sceneNumber: 2,
                title: "Multi-Wave Superposition Phase",
                description: "Three distinct sine waves of decreasing wavelength and scaling amplitudes stacking up in real-time.",
                prompt: "Three colorful sine waves aligning, stacking together, superposition principles, high-contrast mathematical physics simulation.",
                narrationScript: "By combining multiple individual harmonics of differing frequencies, we witness the complex physical law of wave superposition."
            },
            {
                sceneNumber: 3,
                title: "Final Square Wave Synthesis",
                description: "The complete mathematical synthesis where the infinite sine waves construct a clean, sharp square wave.",
                prompt: "glowing square wave synthesized from stacked harmonics, Fourier series representation, vibrant red glowing vector lines, slow rendering loop.",
                narrationScript: "As the harmonics approach infinity, they synthesize a perfect square wave, showing the magical precision of Fourier wave analysis."
            }
        ],
        flashcards: [
            {
                question: "What physical principle states that waves combine together to form a resultant wave?",
                options: ["Diffraction", "Superposition", "Refraction", "Polarization"],
                answer: "Superposition",
                explanation: "The principle of superposition states that when multiple waves travel through a medium, the resultant displacement is the vector sum of individual displacements."
            },
            {
                question: "Which series is used to decompose periodic waveforms into simple sine waves?",
                options: ["Taylor Series", "Fibonacci Series", "Fourier Series", "Laurent Series"],
                answer: "Fourier Series",
                explanation: "Fourier series decomposes any arbitrary periodic function or waveform into a sum of simple sines and cosines."
            },
            {
                question: "What mathematical component represents the peak value of a wave cycle?",
                options: ["Frequency", "Wavelength", "Amplitude", "Phase shift"],
                answer: "Amplitude",
                explanation: "The amplitude is the maximum absolute displacement of a wave from its equilibrium position."
            },
            {
                question: "What is the unit of physical wave frequency?",
                options: ["Joule", "Hertz", "Watt", "Tesla"],
                answer: "Hertz",
                explanation: "Frequency, which represents wave cycles per second, is measured in Hertz (Hz)."
            },
            {
                question: "What happens to the wavelength as wave frequency is increased in a constant medium?",
                options: ["It increases proportionately", "It remains completely identical", "It decreases inversely", "It becomes negative"],
                answer: "It decreases inversely",
                explanation: "Since wave velocity is the product of frequency and wavelength (v = f * lambda), an increase in frequency causes wavelength to decrease proportionately."
            }
        ]
    };
}



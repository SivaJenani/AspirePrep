import os
import json
import re
import math
from datetime import datetime, timedelta
from google import genai
from google.genai import types
from openai import OpenAI

# Initialize clients lazily
_gemini_client = None
_openai_client = None

def get_gemini_client():
    global _gemini_client
    key = os.getenv("GEMINI_API_KEY")
    if not _gemini_client and key and key.startswith("AIza"):
        try:
            _gemini_client = genai.Client(api_key=key)
        except Exception as e:
            print("[AI Service] Failed to initialize Gemini Client:", e)
    return _gemini_client

def get_openai_client():
    global _openai_client
    key = os.getenv("OPENAI_API_KEY")
    if not _openai_client and key:
        try:
            _openai_client = OpenAI(api_key=key)
        except Exception as e:
            print("[AI Service] Failed to initialize OpenAI Client:", e)
    return _openai_client

async def call_ai(prompt: str, json_schema=None):
    # Try Gemini first
    gemini = get_gemini_client()
    if gemini:
        try:
            config = {}
            if json_schema:
                config = {
                    "response_mime_type": "application/json",
                    "response_schema": json_schema
                }
            response = gemini.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=config
            )
            return response.text or ""
        except Exception as e:
            print("[AI Service] Gemini call failed, trying OpenAI:", e)

    # Fallback to OpenAI
    oai = get_openai_client()
    if oai:
        try:
            messages = [{"role": "user", "content": prompt}]
            if json_schema:
                messages[0]["content"] += "\n\nRespond with valid JSON only, no markdown."
                
            response_format = {"type": "json_object"} if json_schema else {"type": "text"}
            completion = oai.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                response_format=response_format,
                temperature=0.4,
                max_tokens=4096
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            print("[AI Service] OpenAI call failed:", e)

    return None

# Pure Python NLP Syllabus Analyzer pre-analysis module
STOPWORDS = set([
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
])

SUBJECT_KEYWORDS = {
    'Quantitative Aptitude': ['percentage', 'ratio', 'proportion', 'interest', 'profit', 'loss', 'discount', 'algebra', 'geometry', 'trigonometry', 'mensuration', 'number', 'system', 'average', 'mixture', 'alligation', 'time', 'work', 'distance', 'speed', 'arithmetic', 'equations'],
    'Reasoning Ability': ['syllogism', 'analogy', 'classification', 'series', 'coding', 'decoding', 'blood', 'relation', 'direction', 'sense', 'seating', 'arrangement', 'puzzle', 'non-verbal', 'matrix', 'visual', 'memory', 'logical', 'deduction', 'assumptions', 'statement'],
    'English Language': ['grammar', 'comprehension', 'vocabulary', 'synonym', 'antonym', 'error', 'spotting', 'fill', 'blanks', 'cloze', 'test', 'idioms', 'phrases', 'passage', 'sentence', 'improvement', 'active', 'passive', 'voice', 'narration', 'direct', 'indirect'],
    'General Awareness': ['history', 'polity', 'geography', 'economics', 'science', 'physics', 'chemistry', 'biology', 'current', 'affairs', 'static', 'gk', 'constitution', 'art', 'culture', 'books', 'authors', 'awards', 'sports', 'national', 'international']
}

DIFFICULTY_KEYWORDS = {
    'hard': ['trigonometry', 'calculus', 'probability', 'permutations', 'combinations', 'advanced', 'puzzles', 'seating', 'derivation', 'theorem', 'quantum', 'complex'],
    'medium': ['algebra', 'geometry', 'syllogism', 'comprehension', 'cloze', 'grammar', 'equations', 'mensuration', 'relations', 'polity', 'constitution']
}

def clean_and_tokenize(text):
    words = re.findall(r'\b[a-z]{3,15}\b', text.lower())
    return [w for w in words if w not in STOPWORDS]

def run_python_ml_analyzer(notes_text, exam_name):
    try:
        lines = [line.strip() for line in notes_text.split('\n') if len(line.strip()) > 8]
        raw_topics = []
        current_topic = []
        for line in lines:
            if re.match(r'^[\d\-\*\u2022•\(\)]', line) or len(line) < 60:
                if current_topic:
                    raw_topics.append(" ".join(current_topic))
                    current_topic = []
                current_topic.append(line)
            else:
                current_topic.append(line)
        if current_topic:
            raw_topics.append(" ".join(current_topic))
        if not raw_topics:
            raw_topics = lines

        extracted_topics = []
        for idx, raw_t in enumerate(raw_topics[:15]):
            cleaned = re.sub(r'^[\d\-\*\u2022•\(\)\.\s]+', '', raw_t)
            tokens = clean_and_tokenize(cleaned)
            if not tokens:
                continue
                
            # Classify Subject
            scores = {sub: 0 for sub in SUBJECT_KEYWORDS}
            for t in tokens:
                for sub, kws in SUBJECT_KEYWORDS.items():
                    if t in kws:
                        scores[sub] += 1
            max_score = max(scores.values())
            subject = 'General Awareness'
            if max_score > 0:
                subject = next(sub for sub, scr in scores.items() if scr == max_score)
                
            # Predict Difficulty
            diff_score = sum(3 if t in DIFFICULTY_KEYWORDS['hard'] else 1.5 if t in DIFFICULTY_KEYWORDS['medium'] else 0 for t in tokens)
            difficulty = 'hard' if diff_score > 8 else 'medium' if diff_score > 2.5 else 'easy'
            
            est_hours = 5.0 if difficulty == 'hard' else 3.5 if difficulty == 'medium' else 2.5
            weightage = 12 if difficulty == 'hard' else 10 if difficulty == 'medium' else 8
            
            title = cleaned[:77] + '...' if len(cleaned) > 80 else cleaned
            extracted_topics.append({
                "id": f"ext_top_{idx + 1}",
                "topicName": title,
                "subjectCategory": subject,
                "estimatedHours": est_hours,
                "difficulty": difficulty,
                "weightagePercentage": weightage,
                "keyFormulasOrHacks": [w.capitalize() for w in tokens[:3]],
                "coreConcepts": [w.capitalize() for w in tokens[:4]]
            })
            
        # Global TF-IDF
        df = {}
        docs_tokens = [clean_and_tokenize(p) for p in raw_topics if len(p.strip()) > 10]
        for doc in docs_tokens:
            for t in set(doc):
                df[t] = df.get(t, 0) + 1
        n_docs = len(docs_tokens)
        
        tfidf = {}
        for doc in docs_tokens:
            tf = Counter = {}
            for t in doc:
                tf[t] = tf.get(t, 0) + 1
            for t, count in tf.items():
                idf = math.log((1 + n_docs) / (1 + df[t])) + 1
                tfidf[t] = tfidf.get(t, 0) + (count * idf)
                
        sorted_kws = sorted(tfidf.items(), key=lambda x: x[1], reverse=True)
        keywords = [k[0] for k in sorted_kws[:12]]
        
        return {
            "topics": extracted_topics,
            "keywords": keywords,
            "averageDifficulty": 'hard' if len([t for t in extracted_topics if t['difficulty'] == 'hard']) > 2 else 'medium'
        }
    except Exception as e:
        print("[AI Service] run_python_ml_analyzer error:", e)
        return None


class AIService:
    async def chat_with_tutor(self, user_message, context, history=[]):
        system_prompt = f"""You are "AptitudeMax AI", a world-class, empathetic, highly rigorous competitive exam master tutor.
You specialize in premier competitive examinations (such as SSC CGL, UPSC Civil Services, IBPS PO, TNPSC, RRB NTPC, JEE, NEET, and CAT).

Student Profile Context:
- Target Exam: {context.get('targetExam', 'Competitive Exams')}
- Weak Areas / Focus: {', '.join(context.get('weakTopics', [])) or 'Arithmetic Math, Indian Polity, Error Spotting'}
- Recent Accuracy: {context.get('accuracy', '75%')}%

Guidelines:
1. Provide crystal-clear, step-by-step explanations with formula derivations, shortcuts, and common examiner traps.
2. If teaching math or reasoning, use clear line breaks, bullet points, and highlight the fastest shortcut trick.
3. If explaining concepts, provide intuitive real-world analogies and mnemonics.
4. Keep the tone encouraging and focused strictly on scoring maximum marks."""

        gemini = get_gemini_client()
        if gemini:
            try:
                formatted_history = []
                for h in history:
                    role = "model" if h.get("role") == "assistant" else "user"
                    formatted_history.append(types.Content(role=role, parts=[types.Part.from_text(text=h.get("content", ""))]))
                
                contents = formatted_history + [types.Content(role="user", parts=[types.Part.from_text(text=user_message)])]
                
                response = gemini.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.7
                    )
                )
                return response.text or "I could not generate a response right now."
            except Exception as e:
                print("[AI Service] Gemini tutor chat failed, trying OpenAI:", e)

        # OpenAI Fallback
        oai = get_openai_client()
        if oai:
            try:
                messages = [{"role": "system", "content": system_prompt}]
                for h in history:
                    role = "assistant" if h.get("role") == "assistant" else "user"
                    messages.append({"role": role, "content": h.get("content", "")})
                messages.append({"role": "user", "content": user_message})
                
                completion = oai.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=2048
                )
                return completion.choices[0].message.content or "I could not generate a response."
            except Exception as e:
                print("[AI Service] OpenAI tutor chat error:", e)

        return self.get_fallback_tutor_response(user_message, context)

    async def explain_question(self, question, student_selected_option_id=None):
        options = question.get("options", [])
        correct_opt = next((o["text"] for o in options if o.get("id") == question.get("correctOptionId")), "")
        selected_opt = next((o["text"] for o in options if o.get("id") == student_selected_option_id), None) if student_selected_option_id else None
        
        prompt = f"""Explain this competitive exam question:
Question: "{question.get('questionText', '')}"
Options:
{chr(10).join(f"- {o['text']} ({'Correct' if o.get('isCorrect') else 'Incorrect'})" for o in options)}
Student Selected Option: "{selected_opt or 'None'}"
Platform Explanation: "{question.get('explanation', '')}"

Provide:
1. Direct Concept & Solution: why the correct option is right with clean steps.
2. Common Trap / Why Other Options Fail.
3. Speed Trick / Exam Shortcut (under 20 seconds).
4. Quick Rule to Remember (one line)."""

        res = await call_ai(prompt)
        if res:
            return res
            
        return f"""**Concept & Solution:**
The correct option is **{correct_opt}**.
{question.get('explanation', '')}

**Common Trap:**
Carefully check intermediate mathematical signs or negative keywords.

**Speed Trick:**
{question.get('shortcutTip', 'Check basic equations and options elimination.')}"""

    async def generate_adaptive_study_plan(self, exam_name, target_date, daily_study_minutes, target_score, weak_topics):
        prompt = f"""You are a premier student performance mentor.
Create a detailed, day-by-day Study Schedule for the exam: {exam_name}.
Remaining parameters:
- Daily study duration: {daily_study_minutes} minutes
- Target exam date: {target_date}
- Target score: {target_score}%
- Weak areas requiring intensive practice: {', '.join(weak_topics) or 'Arithmetic Formulas'}

Ensure the response contains a comprehensive schedule of daily target topics.
Return JSON with this EXACT structure:
{{
  "planTitle": "string",
  "totalDays": 60,
  "days": [
    {{
      "dayNumber": 1,
      "focusTitle": "string",
      "totalMinutes": 120,
      "isRestDay": false,
      "tasks": [
        {{
          "subjectName": "string",
          "topicName": "string",
          "durationMinutes": 45,
          "activityType": "topic_practice",
          "targetQuestionsCount": 10,
          "taskObjective": "string",
          "priority": "normal"
        }}
      ]
    }}
  ]
}}"""
        schema = {
            "type": "OBJECT",
            "properties": {
                "planTitle": {"type": "STRING"},
                "totalDays": {"type": "INTEGER"},
                "days": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "dayNumber": {"type": "INTEGER"},
                            "focusTitle": {"type": "STRING"},
                            "totalMinutes": {"type": "INTEGER"},
                            "isRestDay": {"type": "BOOLEAN"},
                            "tasks": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "subjectName": {"type": "STRING"},
                                        "topicName": {"type": "STRING"},
                                        "durationMinutes": {"type": "INTEGER"},
                                        "activityType": {"type": "STRING"},
                                        "targetQuestionsCount": {"type": "INTEGER"},
                                        "taskObjective": {"type": "STRING"},
                                        "priority": {"type": "STRING"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        res = await call_ai(prompt, schema)
        if res:
            try:
                return json.loads(res)
            except Exception as e:
                print("[AI Service] JSON load error in adaptive study plan:", e)
        return None

    async def generate_plan_from_notes_and_timetable(self, notes_text, note_title, exam_name, timetable_preferences):
        # Direct Python ML analysis
        ml_analysis = run_python_ml_analyzer(notes_text, exam_name)
        ml_hint = ""
        if ml_analysis:
            ml_hint = f"""
[NLP & ML Syllabus pre-analysis features from local Python TF-IDF & Subject Classifier service]:
- Key TF-IDF keywords: {', '.join(ml_analysis.get('keywords', []))}
- Predicted Global Difficulty: {ml_analysis.get('averageDifficulty', 'medium')}
- Extracted Core Topics (with difficulty / estimation):
{json.dumps(ml_analysis.get('topics', []), indent=2)}

Use this ML analysis to structure your final output. Match the difficulty tiers and topics identified above.
"""

        prompt = f"""You are a master competitive exam curriculum architect and academic scheduler.
A student has uploaded custom study notes and requested an organized, high-retention study plan.

Exam Name: {exam_name}
Notes Title: "{note_title}"
Uploaded Notes Content:
\"\"\"
{notes_text[:8000]}
\"\"\"

{ml_hint}

Student Preferences:
- Daily Study: {timetable_preferences.get('dailyHours')} hours/day
- Time Slots: {', '.join(timetable_preferences.get('preferredTimeSlots', []))}
- Study Style: {timetable_preferences.get('studyRhythm')}
- Target Days: {timetable_preferences.get('targetDays')}
- Rest Days: {', '.join(timetable_preferences.get('restDays', [])) if timetable_preferences.get('restDays') else 'None'}

Instructions:
1. Extract all topics, formulas, and key concepts directly from the uploaded notes text above.
2. Build a day-by-day timetable for exactly {timetable_preferences.get('targetDays')} days with exact clock timeslots.
3. Each task must include: subjectName, topicName, timeSlot, durationMinutes, activityType, taskObjective, extractedCheatNotes, priority.
4. Add spaced repetition checkpoints on Day 3 and Day 7.
5. Provide faculty exam scoring tips.

Return JSON with this EXACT structure:
{{
  "planTitle": "string",
  "syllabusSummary": "string",
  "extractedTopics": [
    {{ "id": "ext_top_1", "topicName": "string", "subjectCategory": "string", "estimatedHours": 2, "difficulty": "medium", "keyFormulasOrHacks": ["string"], "coreConcepts": ["string"], "notesSnippet": "string" }}
  ],
  "timetableSummary": "string",
  "adaptiveNotes": ["string"],
  "facultyTips": ["string"],
  "spacedRepetitionPlan": [
    {{ "reviewDay": 3, "topicsToRecall": ["string"], "technique": "string" }}
  ],
  "schedule": [
    {{
      "dayNumber": 1, "date": "YYYY-MM-DD", "focusTitle": "string", "totalMinutes": 120, "isRestDay": false,
      "tasks": [
        {{ "id": "task_1_1", "timeSlot": "07:00 AM - 08:30 AM", "subjectName": "string", "topicName": "string", "activityType": "concept_study", "durationMinutes": 90, "targetQuestionsCount": 15, "taskObjective": "string", "extractedCheatNotes": "string", "priority": "high" }}
      ]
    }}
  ]
}}"""
        res = await call_ai(prompt)
        if res:
            try:
                # Strip markdown code fences if present
                clean = re.sub(r"^```json\s*", "", res, flags=re.IGNORECASE)
                clean = re.sub(r"^```\s*", "", clean)
                clean = re.sub(r"```\s*$", "", clean).strip()
                return json.loads(clean)
            except Exception as e:
                print("[AI Service] JSON load error in notes study plan:", e)
        return self.get_fallback_notes_study_plan(notes_text, note_title, exam_name, timetable_preferences)

    async def analyze_syllabus_and_generate_schedule(self, syllabus_text, exam_name, syllabus_title, exam_category, options):
        gemini = get_gemini_client()
        daily_hours = options.get("dailyHours", 3)
        target_days = options.get("targetDays", 14)
        preferred_slots = options.get("preferredTimeSlots", ["morning", "evening"])
        
        if not gemini:
            return self.get_fallback_syllabus_analysis(syllabus_text, exam_name, syllabus_title, exam_category, daily_hours, target_days, preferred_slots, options.get("subjectCode"))
            
        try:
            system_instruction = """You are a world-class academic curriculum architect and senior examiner specialized in competitive and university examinations.
Your task is to analyze an uploaded syllabus document for the specified exam, rigorously structure it into units/modules and topics, extract exam weightages, difficulty, high-yield formulas, short 2-mark and long 16-mark questions, and generate a day-by-day study schedule/timetable calibrated for the student's available daily hours and target days."""
            
            prompt = f"""Please analyze this uploaded syllabus thoroughly:

Exam Name: {exam_name}
Exam Category: {exam_category}
Syllabus Title: "{syllabus_title}"
Subject Code: {options.get('subjectCode', 'N/A')}

Student Available Schedule:
- Daily Study Time: {daily_hours} Hours/Day ({daily_hours * 60} Minutes)
- Target Timeframe: {target_days} Days until Exam / Milestone
- Preferred Daily Time Slots: {', '.join(preferred_slots)}

Syllabus Content:
\"\"\"
{syllabus_text[:10000]}
\"\"\"

Analysis Requirements:
1. Divide into 4 to 5 units or modules with clear titles, total marks weightage, and estimated hours.
2. For every Topic within each unit:
   - Topic Name & Subject Category
   - Weightage Tier: "High-Yield (Must Master)", "Medium-Yield", or "Low-Yield"
   - Difficulty Level ("easy", "medium", "hard")
   - Estimated study hours
   - Formulas/Concepts
   - 1 High-yield 2-Mark definition or short question
   - 1 High-yield 16-Mark analytical problem
   - Brief notes summary
3. Day-by-Day schedule for exactly {target_days} days.
4. Strategic exam tips & spaced repetition plan.
"""
            # Define response schema objects
            schema = {
                "type": "OBJECT",
                "properties": {
                    "summary": {"type": "STRING"},
                    "totalEstimatedPrepHours": {"type": "NUMBER"},
                    "strategicExamTips": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "units": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "unitNumber": {"type": "INTEGER"},
                                "unitName": {"type": "STRING"},
                                "totalWeightageMarks": {"type": "NUMBER"},
                                "estimatedHours": {"type": "NUMBER"},
                                "topics": {
                                    "type": "ARRAY",
                                    "items": {
                                        "type": "OBJECT",
                                        "properties": {
                                            "id": {"type": "STRING"},
                                            "topicName": {"type": "STRING"},
                                            "unitOrModule": {"type": "STRING"},
                                            "subjectCategory": {"type": "STRING"},
                                            "weightageTier": {"type": "STRING"},
                                            "weightagePercentage": {"type": "NUMBER"},
                                            "estimatedStudyHours": {"type": "NUMBER"},
                                            "difficulty": {"type": "STRING"},
                                            "keyFormulasOrConcepts": {"type": "ARRAY", "items": {"type": "STRING"}},
                                            "notesSummary": {"type": "STRING"},
                                            "sampleQuestions": {
                                                "type": "ARRAY",
                                                "items": {
                                                    "type": "OBJECT",
                                                    "properties": {
                                                        "questionType": {"type": "STRING"},
                                                        "questionText": {"type": "STRING"},
                                                        "answerHint": {"type": "STRING"},
                                                        "marks": {"type": "NUMBER"}
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "schedule": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "dayNumber": {"type": "INTEGER"},
                                "date": {"type": "STRING"},
                                "focusTitle": {"type": "STRING"},
                                "unitOrTheme": {"type": "STRING"},
                                "totalStudyMinutes": {"type": "INTEGER"},
                                "isRestOrRevisionDay": {"type": "BOOLEAN"},
                                "tasks": {
                                    "type": "ARRAY",
                                    "items": {
                                        "type": "OBJECT",
                                        "properties": {
                                            "id": {"type": "STRING"},
                                            "timeSlot": {"type": "STRING"},
                                            "subjectOrUnit": {"type": "STRING"},
                                            "topicName": {"type": "STRING"},
                                            "activityType": {"type": "STRING"},
                                            "durationMinutes": {"type": "INTEGER"},
                                            "targetDeliverable": {"type": "STRING"},
                                            "highYieldKeyNotes": {"type": "STRING"},
                                            "priority": {"type": "STRING"}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "spacedRepetitionPlan": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "checkpointDay": {"type": "INTEGER"},
                                "unitsToReview": {"type": "ARRAY", "items": {"type": "STRING"}},
                                "recallMethod": {"type": "STRING"}
                            }
                        }
                    }
                }
            }

            response = gemini.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=schema
                )
            )
            parsed = json.loads(response.text or "{}")
            
            # Map unit topics list and compile stats
            all_topics = []
            for u in parsed.get("units", []):
                for t in u.get("topics", []):
                    t["isCompleted"] = False
                    all_topics.append(t)
                    
            # Complete extra attributes
            parsed["id"] = f"syl_ana_{int(time.time() * 1000)}"
            parsed["examName"] = exam_name
            parsed["examCategory"] = exam_category
            parsed["subjectCode"] = options.get("subjectCode")
            parsed["syllabusDocTitle"] = syllabus_title
            parsed["parsedAt"] = datetime.utcnow().isoformat() + "Z"
            parsed["allTopics"] = all_topics
            parsed["totalUnitsCount"] = len(parsed.get("units", []))
            parsed["totalTopicsCount"] = len(all_topics)
            parsed["highYieldTopicsCount"] = len([t for t in all_topics if "high" in t.get("weightageTier", "").lower()])
            parsed["weightageBreakdown"] = [
                {"unitOrSubject": f"Unit {u.get('unitNumber')}", "percentage": 20, "marks": u.get("totalWeightageMarks", 20)}
                for u in parsed.get("units", [])
            ]
            
            return parsed
        except Exception as e:
            print("[AI Service] Gemini Syllabus Analysis Error:", e)
            return self.get_fallback_syllabus_analysis(syllabus_text, exam_name, syllabus_title, exam_category, daily_hours, target_days, preferred_slots, options.get("subjectCode"))

    async def generate_draft_questions(self, exam_name, subject_name, topic_name, difficulty, count=3):
        gemini = get_gemini_client()
        if not gemini:
            return self.get_fallback_generated_questions(exam_name, subject_name, topic_name, difficulty, count)
            
        try:
            prompt = f"""Generate {count} high-quality, authentic competitive exam practice questions strictly following the official format of {exam_name}.
Subject: {subject_name}
Topic: {topic_name}
Difficulty Level: {difficulty}

Each question must include:
- Clear question text
- 4 multiple choice options with exactly 1 correct option
- Detailed explanation
- Shortcut tip
- Tags
- Marks (2 for standard, 0.5 negative marking)"""

            schema = {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "questionText": {"type": "STRING"},
                        "options": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "id": {"type": "STRING"},
                                    "text": {"type": "STRING"},
                                    "isCorrect": {"type": "BOOLEAN"}
                                }
                            }
                        },
                        "correctOptionIndex": {"type": "INTEGER"},
                        "explanation": {"type": "STRING"},
                        "shortcutTip": {"type": "STRING"},
                        "tags": {"type": "ARRAY", "items": {"type": "STRING"}},
                        "difficulty": {"type": "STRING"}
                    }
                }
            }

            response = gemini.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema
                )
            )
            raw = json.loads(response.text or "[]")
            
            drafts = []
            for idx, item in enumerate(raw):
                opts = []
                for o_idx, opt in enumerate(item.get("options", [])):
                    opts.append({
                        "id": f"opt_{o_idx + 1}",
                        "text": opt.get("text", ""),
                        "isCorrect": opt.get("isCorrect") or (o_idx == item.get("correctOptionIndex"))
                    })
                
                correct_id = f"opt_{(item.get('correctOptionIndex', 0)) + 1}"
                drafts.append({
                    "id": f"draft_q_{int(time.time() * 1000)}_{idx}",
                    "questionText": item.get("questionText", ""),
                    "options": opts,
                    "correctOptionId": correct_id,
                    "explanation": item.get("explanation", ""),
                    "shortcutTip": item.get("shortcutTip", "Solve using basic logic."),
                    "difficulty": item.get("difficulty") or difficulty,
                    "marks": 2,
                    "negativeMarks": 0.5,
                    "questionType": "single_mcq",
                    "tags": item.get("tags") or [topic_name, subject_name],
                    "source": f"AI Generated Draft ({exam_name})",
                    "isPYQ": False,
                    "isPublished": False
                })
            return drafts
        except Exception as e:
            print("[AI Service] Gemini Question Generation Error:", e)
            return self.get_fallback_generated_questions(exam_name, subject_name, topic_name, difficulty, count)

    async def generate_video(self, prompt, aspect_ratio):
        client = get_gemini_client()
        if not client:
            raise Exception("Gemini API is not configured.")
        try:
            operation = client.models.generate_videos(
                model="veo-3.1-fast-generate-preview",
                prompt=prompt,
                config=dict(
                    number_of_videos=1,
                    resolution="1080p",
                    aspect_ratio=aspect_ratio
                )
            )
            return operation.name or ""
        except Exception as e:
            print("[AI Service] Veo generation error:", e)
            raise e

    async def get_video_status(self, operation_name):
        client = get_gemini_client()
        if not client:
            raise Exception("Gemini API is not configured.")
        try:
            op = types.GenerateVideosOperation(name=operation_name)
            updated = client.operations.get_videos_operation(operation=op)
            return updated
        except Exception as e:
            print("[AI Service] Veo status fetch error:", e)
            raise e

    async def generate_storyboard_and_assets(self, prompt):
        client = get_gemini_client()
        if not client:
            return self.get_fallback_storyboard_assets(prompt)
            
        try:
            content_prompt = f"""Break down this conceptual topic or animation prompt: "{prompt}" into:
1. A structured 3-scene storyboarding flow suitable for Veo video generators.
2. An interactive Voiceover Narration script (1-2 sentences per scene).
3. A set of 5 multiple choice trivia/revision flashcards with explanation of the correct answers.

Ensure the output is valid JSON strictly matching this schema:
{{
  "scenes": [
    {{
      "sceneNumber": 1,
      "title": "Scene 1 Title",
      "description": "Short summary of visual scene",
      "prompt": "Highly detailed physical visual rendering prompt for Veo 3.1 video generation",
      "narrationScript": "Narrative explanation for the speaker voiceover"
    }}
  ],
  "flashcards": [
    {{
      "question": "Revision question text about the concept?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Detailed scientific explanation..."
    }}
  ]
}}"""
            schema = {
                "type": "OBJECT",
                "properties": {
                    "scenes": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "sceneNumber": {"type": "INTEGER"},
                                "title": {"type": "STRING"},
                                "description": {"type": "STRING"},
                                "prompt": {"type": "STRING"},
                                "narrationScript": {"type": "STRING"}
                            },
                            "required": ["sceneNumber", "title", "description", "prompt", "narrationScript"]
                        }
                    },
                    "flashcards": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "question": {"type": "STRING"},
                                "options": {"type": "ARRAY", "items": {"type": "STRING"}},
                                "answer": {"type": "STRING"},
                                "explanation": {"type": "STRING"}
                            },
                            "required": ["question", "options", "answer", "explanation"]
                        }
                    }
                }
            }

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=content_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema
                )
            )
            return json.loads(response.text or "{}")
        except Exception as e:
            print("[AI Service] Storyboard assets error:", e)
            return self.get_fallback_storyboard_assets(prompt)

    # ── Fallback Implementations ──
    def get_fallback_tutor_response(self, user_message, context):
        return f"""Hi there! I am **AptitudeMax AI**, your virtual exam tutor.

Currently, my cloud model endpoints are offline or unconfigured. However, based on your study targets for **{context.get('targetExam', 'your exam')}**, here is my tutoring advice:

- **Active Recall**: Don't just re-read notes. Try to write down key concepts from memory.
- **Formulas first**: Focus on deriving major quantitative equations step-by-step so you understand the logic.
- **Tutor Response to**: "{user_message}"
  *Please check your backend env keys (GEMINI_API_KEY) to unlock full conversational tutoring.*"""

    def get_fallback_notes_study_plan(self, notes_text, note_title, exam_name, timetable_preferences):
        days = []
        target_days = timetable_preferences.get("targetDays", 7)
        daily_hours = timetable_preferences.get("dailyHours", 2)
        
        for d in range(1, target_days + 1):
            days.append({
                "dayNumber": d,
                "date": (datetime.now() + timedelta(days=d-1)).strftime("%Y-%m-%d"),
                "focusTitle": f"Day {d}: Concept Study & Practice Drill",
                "totalMinutes": daily_hours * 60,
                "isRestDay": False,
                "tasks": [
                    {
                        "id": f"task_{d}_1",
                        "timeSlot": "08:00 AM - 09:30 AM",
                        "subjectName": "Core Subject",
                        "topicName": f"Concept Block {d}",
                        "activityType": "concept_study",
                        "durationMinutes": 90,
                        "targetQuestionsCount": 10,
                        "taskObjective": "Read from uploaded notes and outline key terms",
                        "extractedCheatNotes": "Focus on terms and relationships highlighted in notes.",
                        "priority": "high"
                    }
                ]
            })
            
        return {
            "planTitle": f"Roadmap for {exam_name}",
            "syllabusSummary": f"Custom plan built from study notes '{note_title}'.",
            "extractedTopics": [
                { "id": "ext_top_1", "topicName": "Key Concepts Overview", "subjectCategory": "Quant / Theory", "estimatedHours": 3, "difficulty": "medium", "keyFormulasOrHacks": ["Focus terms"], "coreConcepts": ["Syllabus Mapping"], "notesSnippet": "Fallback parsed notes." }
            ],
            "timetableSummary": f"7-day schedule, {daily_hours}h daily.",
            "adaptiveNotes": ["Maintain daily consistency.", "Check weak areas periodically."],
            "facultyTips": ["Write down tricky formulas.", "Always double check mathematical signs."],
            "spacedRepetitionPlan": [
                { "reviewDay": 3, "topicsToRecall": ["Key Concepts Overview"], "technique": "Active Recall" }
            ],
            "schedule": days
        }

    def get_fallback_syllabus_analysis(self, syllabus_text, exam_name, syllabus_title, exam_category, daily_hours, target_days, preferred_slots, subject_code=None):
        import time
        t_id = int(time.time() * 1000)
        
        # Build 5 dummy units
        units = []
        all_topics = []
        for i in range(1, 6):
            topic_obj = {
                "id": f"syl_top_{i}_1",
                "topicName": f"Unit {i} Core Concept and Formula Applications",
                "unitOrModule": f"Unit {i}: Foundations & Theories",
                "subjectCategory": exam_name,
                "weightageTier": "High-Yield (Must Master)",
                "weightagePercentage": 20,
                "estimatedStudyHours": 4,
                "difficulty": "medium",
                "keyFormulasOrConcepts": [f"Unit {i} theorem formulas", "Standard equations"],
                "notesSummary": f"High-yield core unit module for the exam.",
                "sampleQuestions": [
                    {
                        "questionType": "2_mark_definition",
                        "questionText": f"Define the primary function and boundary conditions for Unit {i} concepts.",
                        "answerHint": "Explain the base parameters, constants, and normal operating conditions.",
                        "marks": 2
                    },
                    {
                        "questionType": "16_mark_problem",
                        "questionText": f"State, derive and discuss Unit {i} equations under varying loads.",
                        "answerHint": "1. Write mathematical equation, 2. Draw circuit/block diagram, 3. Trace calculations.",
                        "marks": 16
                    }
                ]
            }
            units.append({
                "unitNumber": i,
                "unitName": f"Unit {i}: Core Principles & Methods",
                "totalWeightageMarks": 20,
                "estimatedHours": 5,
                "topics": [topic_obj]
            })
            all_topics.append(topic_obj)
            
        schedule = []
        for d in range(1, target_days + 1):
            schedule.append({
                "dayNumber": d,
                "date": (datetime.now() + timedelta(days=d-1)).strftime("%Y-%m-%d"),
                "focusTitle": f"Day {d}: Syllabus Coverage",
                "unitOrTheme": f"Unit {min(5, math.ceil((d / target_days) * 5))}",
                "totalStudyMinutes": daily_hours * 60,
                "isRestOrRevisionDay": False,
                "tasks": [
                    {
                        "id": f"task_d{d}_1",
                        "timeSlot": preferred_slots[0] if preferred_slots else "08:00 AM - 10:00 AM",
                        "subjectOrUnit": f"Unit {min(5, math.ceil((d / target_days) * 5))} Theory",
                        "topicName": f"Concept deep dive & blueprint practice",
                        "activityType": "concept_study",
                        "durationMinutes": daily_hours * 60,
                        "targetDeliverable": f"Complete Unit {min(5, math.ceil((d / target_days) * 5))} active recall list",
                        "highYieldKeyNotes": "Check formulas and diagram blueprints.",
                        "priority": "high"
                    }
                ]
            })
            
        return {
            "id": f"syl_ana_{t_id}",
            "examName": exam_name,
            "examCategory": exam_category,
            "subjectCode": subject_code,
            "syllabusDocTitle": syllabus_title,
            "parsedAt": datetime.utcnow().isoformat() + "Z",
            "summary": "Sandbox fallback syllabus analysis. Check API key settings to enable AI extraction.",
            "totalUnitsCount": len(units),
            "totalTopicsCount": len(all_topics),
            "totalEstimatedPrepHours": target_days * daily_hours,
            "highYieldTopicsCount": len(all_topics),
            "units": units,
            "allTopics": all_topics,
            "schedule": schedule,
            "strategicExamTips": [
                "Master all 2-mark definitions first for quick marks.",
                "Draw block diagrams cleanly for descriptive questions.",
                "Verify math equations on final answers."
            ],
            "spacedRepetitionPlan": [
                {"checkpointDay": 3, "unitsToReview": ["Unit 1"], "recallMethod": "Active Recall"},
                {"checkpointDay": target_days - 1, "unitsToReview": ["All Units"], "recallMethod": "Model Exam Simulation"}
            ],
            "weightageBreakdown": [
                {"unitOrSubject": f"Unit {i}", "percentage": 20, "marks": 20}
                for i in range(1, 6)
            ]
        }

    def get_fallback_generated_questions(self, exam_name, subject_name, topic_name, difficulty, count):
        import time
        drafts = []
        for i in range(count):
            drafts.append({
                "id": f"draft_q_{int(time.time() * 1000)}_{i}",
                "questionText": f"Sample Practice Question {i + 1} for {topic_name} ({difficulty})?",
                "options": [
                    {"id": "opt_1", "text": "Option A (Correct)", "isCorrect": True},
                    {"id": "opt_2", "text": "Option B", "isCorrect": False},
                    {"id": "opt_3", "text": "Option C", "isCorrect": False},
                    {"id": "opt_4", "text": "Option D", "isCorrect": False}
                ],
                "correctOptionId": "opt_1",
                "explanation": "This is a sandbox fallback explanation. Configure API key to generate genuine syllabus questions.",
                "shortcutTip": "Look for symmetry in the options.",
                "difficulty": difficulty,
                "marks": 2,
                "negativeMarks": 0.5,
                "questionType": "single_mcq",
                "tags": [topic_name, subject_name],
                "source": f"Sandbox Fallback ({exam_name})",
                "isPYQ": False,
                "isPublished": False
            })
        return drafts

    def get_fallback_storyboard_assets(self, prompt):
        return {
            "scenes": [
                {
                    "sceneNumber": 1,
                    "title": "Introduction to Harmonic Concepts",
                    "description": "A single sine wave propagating on a gridded layout.",
                    "prompt": "Sine wave vector propagation, glowing cyan lines on dark mathematical grid background, clean scientific grid, slow motion.",
                    "narrationScript": "Let's first visualize the foundational physics of sinusoidal wave propagation through a continuous physical medium."
                }
            ],
            "flashcards": [
                {
                    "question": "What mathematical function represents a pure harmonic wave shape?",
                    "options": ["Sine function", "Tangent function", "Exponential function", "Logarithmic function"],
                    "answer": "Sine function",
                    "explanation": "A pure, single-frequency harmonic wave is mathematically modeled as a sinusoidal wave (sine or cosine function)."
                }
            ]
        }


ai_service = AIService()

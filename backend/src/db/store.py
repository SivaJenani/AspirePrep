import os
import json
import time

DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
DB_FILE_PATH = os.path.join(DB_DIR, "db.json")

# In-memory database representation
db = {
    "users": [],
    "exams": [],
    "subjects": [],
    "chapters": [],
    "topics": [],
    "concepts": [],
    "questions": [],
    "questionAttempts": [],
    "mockTests": [],
    "mockTestAttempts": [],
    "studyPlans": [],
    "revisions": [],
    "dailyChallenges": [],
    "uploadedNotes": [],
    "universityExams": [],
    "syllabusAnalyses": []
}

def load_db():
    global db
    if os.path.exists(DB_FILE_PATH):
        try:
            with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                # Ensure all keys exist
                for key in db.keys():
                    db[key] = data.get(key, [])
            print("[Store] Loaded database from disk.")
        except Exception as e:
            print("[Store] Failed to load database from disk:", e)
    else:
        # DB directory ensure
        os.makedirs(DB_DIR, exist_ok=True)
        save_db()

def save_db():
    try:
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(db, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print("[Store] Failed to persist database to disk:", e)

# Load immediately on import
load_db()

# DB Store Accessors
class UsersAccessor:
    def find(self):
        return db["users"]
    
    def find_by_id(self, user_id):
        return next((u for u in db["users"] if u["id"] == user_id), None)
        
    def find_by_email(self, email):
        if not email:
            return None
        return next((u for u in db["users"] if u.get("email", "").lower() == email.lower()), None)
        
    def create(self, user):
        db["users"].append(user)
        save_db()
        return user
        
    def update(self, user_id, updates):
        for idx, u in enumerate(db["users"]):
            if u["id"] == user_id:
                db["users"][idx] = {**db["users"][idx], **updates}
                save_db()
                return db["users"][idx]
        return None

class ExamsAccessor:
    def find(self):
        return db["exams"]
        
    def find_by_id(self, exam_id):
        return next((e for e in db["exams"] if e["id"] == exam_id), None)
        
    def find_by_slug(self, slug):
        return next((e for e in db["exams"] if e.get("slug") == slug), None)
        
    def create(self, exam):
        db["exams"].append(exam)
        save_db()
        return exam
        
    def update(self, exam_id, updates):
        for idx, e in enumerate(db["exams"]):
            if e["id"] == exam_id:
                db["exams"][idx] = {**db["exams"][idx], **updates}
                save_db()
                return db["exams"][idx]
        return None
        
    def delete(self, exam_id):
        db["exams"] = [e for e in db["exams"] if e["id"] != exam_id]
        save_db()
        return True

class SubjectsAccessor:
    def find(self):
        return db["subjects"]
        
    def find_by_id(self, sub_id):
        return next((s for s in db["subjects"] if s["id"] == sub_id), None)
        
    def find_by_exam_id(self, exam_id):
        return [s for s in db["subjects"] if s.get("examId") == exam_id]
        
    def create(self, subject):
        db["subjects"].append(subject)
        save_db()
        return subject
        
    def update(self, sub_id, updates):
        for idx, s in enumerate(db["subjects"]):
            if s["id"] == sub_id:
                db["subjects"][idx] = {**db["subjects"][idx], **updates}
                save_db()
                return db["subjects"][idx]
        return None
        
    def delete(self, sub_id):
        db["subjects"] = [s for s in db["subjects"] if s["id"] != sub_id]
        save_db()
        return True

class ChaptersAccessor:
    def find(self):
        return db["chapters"]
        
    def find_by_id(self, chap_id):
        return next((c for c in db["chapters"] if c["id"] == chap_id), None)
        
    def find_by_subject_id(self, subject_id):
        return [c for c in db["chapters"] if c.get("subjectId") == subject_id]
        
    def create(self, chapter):
        db["chapters"].append(chapter)
        save_db()
        return chapter
        
    def delete(self, chap_id):
        db["chapters"] = [c for c in db["chapters"] if c["id"] != chap_id]
        save_db()
        return True

class TopicsAccessor:
    def find(self):
        return db["topics"]
        
    def find_by_id(self, topic_id):
        return next((t for t in db["topics"] if t["id"] == topic_id), None)
        
    def find_by_chapter_id(self, chapter_id):
        return [t for t in db["topics"] if t.get("chapterId") == chapter_id]
        
    def find_by_subject_id(self, subject_id):
        return [t for t in db["topics"] if t.get("subjectId") == subject_id]
        
    def create(self, topic):
        db["topics"].append(topic)
        save_db()
        return topic
        
    def update(self, topic_id, updates):
        for idx, t in enumerate(db["topics"]):
            if t["id"] == topic_id:
                db["topics"][idx] = {**db["topics"][idx], **updates}
                save_db()
                return db["topics"][idx]
        return None
        
    def delete(self, topic_id):
        db["topics"] = [t for t in db["topics"] if t["id"] != topic_id]
        save_db()
        return True

class ConceptsAccessor:
    def find(self):
        return db["concepts"]
        
    def find_by_id(self, concept_id):
        return next((c for c in db["concepts"] if c["id"] == concept_id), None)
        
    def find_by_topic_id(self, topic_id):
        return [c for c in db["concepts"] if c.get("topicId") == topic_id]
        
    def create(self, concept):
        db["concepts"].append(concept)
        save_db()
        return concept

class QuestionsAccessor:
    def find(self):
        return db["questions"]
        
    def find_by_id(self, q_id):
        return next((q for q in db["questions"] if q["id"] == q_id), None)
        
    def find_by_exam_id(self, exam_id):
        return [q for q in db["questions"] if q.get("examId") == exam_id]
        
    def find_by_topic_id(self, topic_id):
        return [q for q in db["questions"] if q.get("topicId") == topic_id]
        
    def find_by_subject_id(self, subject_id):
        return [q for q in db["questions"] if q.get("subjectId") == subject_id]
        
    def find_pyqs(self, exam_id=None, year=None, subject_id=None, topic_id=None):
        results = []
        for q in db["questions"]:
            if not q.get("isPYQ"):
                continue
            if exam_id and q.get("examId") != exam_id:
                continue
            if year and q.get("year") != year:
                continue
            if subject_id and q.get("subjectId") != subject_id:
                continue
            if topic_id and q.get("topicId") != topic_id:
                continue
            results.append(q)
        return results
        
    def create(self, question):
        db["questions"].append(question)
        save_db()
        return question
        
    def update(self, q_id, updates):
        for idx, q in enumerate(db["questions"]):
            if q["id"] == q_id:
                db["questions"][idx] = {**db["questions"][idx], **updates}
                save_db()
                return db["questions"][idx]
        return None
        
    def delete(self, q_id):
        db["questions"] = [q for q in db["questions"] if q["id"] != q_id]
        save_db()
        return True

class QuestionAttemptsAccessor:
    def find(self):
        return db["questionAttempts"]
        
    def find_by_user_id(self, user_id):
        return [a for a in db["questionAttempts"] if a.get("userId") == user_id]
        
    def create(self, attempt):
        db["questionAttempts"].append(attempt)
        save_db()
        return attempt

class MockTestsAccessor:
    def find(self):
        return db["mockTests"]
        
    def find_by_id(self, m_id):
        return next((m for m in db["mockTests"] if m["id"] == m_id), None)
        
    def find_by_exam_id(self, exam_id):
        return [m for m in db["mockTests"] if m.get("examId") == exam_id]
        
    def create(self, test):
        db["mockTests"].append(test)
        save_db()
        return test
        
    def update(self, m_id, updates):
        for idx, m in enumerate(db["mockTests"]):
            if m["id"] == m_id:
                db["mockTests"][idx] = {**db["mockTests"][idx], **updates}
                save_db()
                return db["mockTests"][idx]
        return None
        
    def delete(self, m_id):
        db["mockTests"] = [m for m in db["mockTests"] if m["id"] != m_id]
        save_db()
        return True

class MockTestAttemptsAccessor:
    def find(self):
        return db["mockTestAttempts"]
        
    def find_by_id(self, a_id):
        return next((a for a in db["mockTestAttempts"] if a["id"] == a_id), None)
        
    def find_by_user_id(self, user_id):
        return [a for a in db["mockTestAttempts"] if a.get("userId") == user_id]
        
    def create(self, attempt):
        db["mockTestAttempts"].append(attempt)
        save_db()
        return attempt

class StudyPlansAccessor:
    def find(self):
        return db["studyPlans"]
        
    def find_by_user_id(self, user_id):
        return next((p for p in db["studyPlans"] if p.get("userId") == user_id), None)
        
    def save(self, plan):
        idx = next((i for i, p in enumerate(db["studyPlans"]) if p.get("userId") == plan.get("userId")), -1)
        if idx != -1:
            db["studyPlans"][idx] = plan
        else:
            db["studyPlans"].append(plan)
        save_db()
        return plan

class RevisionsAccessor:
    def find(self):
        return db["revisions"]
        
    def find_by_user_id(self, user_id):
        return [r for r in db["revisions"] if r.get("userId") == user_id]
        
    def create(self, item):
        db["revisions"].append(item)
        save_db()
        return item
        
    def update(self, r_id, updates):
        for idx, r in enumerate(db["revisions"]):
            if r["id"] == r_id:
                db["revisions"][idx] = {**db["revisions"][idx], **updates}
                save_db()
                return db["revisions"][idx]
        return None

class DailyChallengesAccessor:
    def get_today(self):
        return db["dailyChallenges"][0] if db["dailyChallenges"] else None

class UploadedNotesAccessor:
    def find(self):
        return db.get("uploadedNotes", [])
        
    def find_by_user_id(self, user_id):
        return [n for n in db.get("uploadedNotes", []) if n.get("userId") == user_id]
        
    def create(self, note):
        if "uploadedNotes" not in db:
            db["uploadedNotes"] = []
        db["uploadedNotes"].insert(0, note)
        save_db()
        return note
        
    def delete(self, note_id):
        if "uploadedNotes" not in db:
            return False
        db["uploadedNotes"] = [n for n in db["uploadedNotes"] if n["id"] != note_id]
        save_db()
        return True

class UniversityExamsAccessor:
    def find(self):
        return db.get("universityExams", [])
        
    def find_by_id(self, exam_id):
        return next((e for e in db.get("universityExams", []) if e["id"] == exam_id), None)
        
    def create(self, exam):
        if "universityExams" not in db:
            db["universityExams"] = []
        db["universityExams"].insert(0, exam)
        save_db()
        return exam
        
    def update(self, exam_id, updates):
        if "universityExams" not in db:
            db["universityExams"] = []
        for idx, e in enumerate(db["universityExams"]):
            if e["id"] == exam_id:
                db["universityExams"][idx] = {**db["universityExams"][idx], **updates}
                save_db()
                return db["universityExams"][idx]
        return None
        
    def delete(self, exam_id):
        if "universityExams" not in db:
            return False
        db["universityExams"] = [e for e in db["universityExams"] if e["id"] != exam_id]
        save_db()
        return True

class SyllabusAnalysesAccessor:
    def find(self):
        return db.get("syllabusAnalyses", [])
        
    def find_by_id(self, sa_id):
        return next((s for s in db.get("syllabusAnalyses", []) if s["id"] == sa_id), None)
        
    def find_by_user_id(self, user_id):
        return [s for s in db.get("syllabusAnalyses", []) if s.get("userId") == user_id]
        
    def create(self, analysis):
        if "syllabusAnalyses" not in db:
            db["syllabusAnalyses"] = []
        db["syllabusAnalyses"].insert(0, analysis)
        save_db()
        return analysis
        
    def update(self, sa_id, updates):
        if "syllabusAnalyses" not in db:
            db["syllabusAnalyses"] = []
        for idx, s in enumerate(db["syllabusAnalyses"]):
            if s["id"] == sa_id:
                db["syllabusAnalyses"][idx] = {**db["syllabusAnalyses"][idx], **updates}
                save_db()
                return db["syllabusAnalyses"][idx]
        return None
        
    def delete(self, sa_id):
        if "syllabusAnalyses" not in db:
            return False
        db["syllabusAnalyses"] = [s for s in db["syllabusAnalyses"] if s["id"] != sa_id]
        save_db()
        return True

# Export accessors instanced
class Store:
    users = UsersAccessor()
    exams = ExamsAccessor()
    subjects = SubjectsAccessor()
    chapters = ChaptersAccessor()
    topics = TopicsAccessor()
    concepts = ConceptsAccessor()
    questions = QuestionsAccessor()
    questionAttempts = QuestionAttemptsAccessor()
    mockTests = MockTestsAccessor()
    mockTestAttempts = MockTestAttemptsAccessor()
    studyPlans = StudyPlansAccessor()
    revisions = RevisionsAccessor()
    dailyChallenges = DailyChallengesAccessor()
    uploadedNotes = UploadedNotesAccessor()
    universityExams = UniversityExamsAccessor()
    syllabusAnalyses = SyllabusAnalysesAccessor()

store = Store()

def calculate_user_analytics(user_id):
    user = store.users.find_by_id(user_id)
    target_exam_id = user.get("targetExamId") if user else None
    
    attempts = store.questionAttempts.find_by_user_id(user_id)
    mock_attempts = store.mockTestAttempts.find_by_user_id(user_id)
    
    if target_exam_id and target_exam_id != "exam_custom":
        attempts = [a for a in attempts if a.get("examId") == target_exam_id]
        mock_attempts = [m for m in mock_attempts if m.get("examId") == target_exam_id]
        
    topics = store.topics.find()
    subjects = store.subjects.find()
    
    total_solved = len(attempts)
    correct_count = len([a for a in attempts if a.get("isCorrect")])
    overall_accuracy = round((correct_count / total_solved) * 100) if total_solved > 0 else 0
    
    total_attempt_time = sum(a.get("timeSpentSeconds", 0) for a in attempts)
    total_mock_time = sum(m.get("timeTakenSeconds", 0) for m in mock_attempts)
    total_study_minutes = round((total_attempt_time + total_mock_time) / 60)
    
    avg_time_per_q = round(total_attempt_time / total_solved) if total_solved > 0 else 0
    
    topic_stats = {}
    for a in attempts:
        t_id = a.get("topicId")
        if not t_id:
            continue
        if t_id not in topic_stats:
            topic_stats[t_id] = {"attempts": 0, "correct": 0, "time": 0}
        topic_stats[t_id]["attempts"] += 1
        if a.get("isCorrect"):
            topic_stats[t_id]["correct"] += 1
        topic_stats[t_id]["time"] += a.get("timeSpentSeconds", 0)
        
    weak_topics = []
    strong_topics = []
    user_exam_name = user.get("targetExamName", "SSC CGL") if user else "SSC CGL"
    
    for t_id, stat in topic_stats.items():
        topic = next((t for t in topics if t["id"] == t_id), None)
        if not topic or stat["attempts"] == 0:
            continue
        sub = next((s for s in subjects if s["id"] == topic.get("subjectId")), None)
        sub_name = sub.get("name", "General") if sub else "General"
        
        accuracy = round((stat["correct"] / stat["attempts"]) * 100)
        avg_time = round(stat["time"] / stat["attempts"])
        
        if accuracy < 60 and stat["attempts"] >= 2:
            weak_topics.append({
                "topicId": t_id,
                "topicName": topic["name"],
                "subjectName": sub_name,
                "examName": user_exam_name,
                "attemptsCount": stat["attempts"],
                "correctCount": stat["correct"],
                "accuracy": accuracy,
                "averageTimeSeconds": avg_time,
                "recommendedAction": f"Review {topic['name']} and solve a short targeted practice set."
            })
        elif accuracy >= 75 and stat["attempts"] >= 2:
            strong_topics.append({
                "topicName": topic["name"],
                "subjectName": sub_name,
                "accuracy": accuracy
            })
            
    avg_score = round(sum(m.get("score", 0) for m in mock_attempts) / len(mock_attempts)) if mock_attempts else 0
    
    return {
        "totalQuestionsSolved": total_solved,
        "overallAccuracy": overall_accuracy,
        "averageScore": avg_score,
        "totalStudyMinutes": total_study_minutes,
        "averageTimePerQuestion": avg_time_per_q,
        "currentStreakDays": 0,
        "testsCompletedCount": len(mock_attempts),
        "weakTopics": weak_topics,
        "strongTopics": strong_topics,
        "subjectPerformance": [],
        "scoreTrend": [],
        "accuracyTrend": [],
        "studyTimeTrend": []
    }

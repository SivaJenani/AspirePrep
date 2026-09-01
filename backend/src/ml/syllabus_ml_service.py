import sys
import json
import re
import math
from collections import Counter

# Pure-Python Stopwords list to keep the script dependency-free and lightning fast
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
}

DIFFICULTY_KEYWORDS = {
    'hard': ['trigonometry', 'calculus', 'probability', 'permutations', 'combinations', 
             'advanced', 'puzzles', 'seating', 'derivation', 'theorem', 'quantum', 'complex'],
    'medium': ['algebra', 'geometry', 'syllogism', 'comprehension', 'cloze', 'grammar', 
               'equations', 'mensuration', 'relations', 'polity', 'constitution']
}

def clean_and_tokenize(text):
    words = re.findall(r'\b[a-z]{3,15}\b', text.lower())
    return [w for w in words if w not in STOPWORDS]

def classify_subject(tokens):
    if not tokens:
        return 'General Awareness'
    scores = {sub: 0 for sub in SUBJECT_KEYWORDS}
    for token in tokens:
        for sub, keywords in SUBJECT_KEYWORDS.items():
            if token in keywords:
                scores[sub] += 1
    max_score = max(scores.values())
    if max_score == 0:
        return 'General Awareness'
    for sub, score in scores.items():
        if score == max_score:
            return sub
    return 'General Awareness'

def predict_difficulty(tokens):
    score = 0
    for token in tokens:
        if token in DIFFICULTY_KEYWORDS['hard']:
            score += 3
        elif token in DIFFICULTY_KEYWORDS['medium']:
            score += 1.5
    if score > 8:
        return 'hard'
    elif score > 2.5:
        return 'medium'
    return 'easy'

def compute_tfidf_keywords(raw_paragraphs):
    docs_tokens = [clean_and_tokenize(p) for p in raw_paragraphs if len(p.strip()) > 10]
    if not docs_tokens:
        return []
    df = Counter()
    for doc in docs_tokens:
        unique_tokens = set(doc)
        for t in unique_tokens:
            df[t] += 1
    n_docs = len(docs_tokens)
    tfidf_scores = Counter()
    for doc in docs_tokens:
        tf = Counter(doc)
        for t, count in tf.items():
            idf = math.log((1 + n_docs) / (1 + df[t])) + 1
            tfidf_scores[t] += count * idf
    return [item[0] for item in tfidf_scores.most_common(12)]

def analyze_syllabus(text):
    lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 8]
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
        cleaned_text = re.sub(r'^[\d\-\*\u2022•\(\)\.\s]+', '', raw_t)
        tokens = clean_and_tokenize(cleaned_text)
        if not tokens:
            continue
        subject = classify_subject(tokens)
        difficulty = predict_difficulty(tokens)
        est_hours = 2.5
        if difficulty == 'medium':
            est_hours = 3.5
        elif difficulty == 'hard':
            est_hours = 5.0
        weightage = 8
        if difficulty == 'hard':
            weightage += 4
        title = cleaned_text
        if len(title) > 80:
            title = title[:77] + '...'
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
    if not extracted_topics:
        extracted_topics = [
            {
                "id": "ext_top_1",
                "topicName": "Introduction to Syllabus Modules",
                "subjectCategory": "General Awareness",
                "estimatedHours": 2.0,
                "difficulty": "easy",
                "weightagePercentage": 8,
                "keyFormulasOrHacks": ["Introduction", "Overview"],
                "coreConcepts": ["Syllabus Review"]
            }
        ]
    global_keywords = compute_tfidf_keywords(raw_topics)
    analysis = {
        "topics": extracted_topics,
        "keywords": global_keywords,
        "averageDifficulty": predict_difficulty(clean_and_tokenize(text))
    }
    return analysis

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        if not input_data.strip():
            print(json.dumps({"error": "Empty syllabus content received."}))
            sys.exit(0)
        result = analyze_syllabus(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"ML pipeline failed: {str(e)}"}))

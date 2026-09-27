import os
import re
from typing import Dict, Any, List, Optional
from google import genai

STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'you', 'your', 'he', 'him',
    'she', 'her', 'it', 'its', 'they', 'them', 'what', 'which', 'who', 'this',
    'that', 'is', 'are', 'was', 'were', 'be', 'have', 'has', 'had', 'do', 'does',
    'a', 'an', 'the', 'and', 'but', 'if', 'or', 'as', 'of', 'at', 'by', 'for',
    'with', 'about', 'to', 'from', 'in', 'out', 'on', 'off', 'over', 'under',
    'syllabus', 'topics', 'exam', 'preparation', 'study', 'chapters', 'test'
}

def analyze_syllabus_nlp(text: str) -> Dict[str, Any]:
    if not text or not text.strip():
        return {"error": "Empty syllabus content"}
    
    lines = [l.strip() for l in text.split("\n") if len(l.strip()) > 8]
    extracted = []
    
    for idx, line in enumerate(lines[:15]):
        cleaned = re.sub(r'^[\d\-*\u2022•().\s]+', '', line).strip()
        if not cleaned:
            continue
            
        subject = "Quantitative Aptitude" if any(w in cleaned.lower() for w in ['ratio', 'algebra', 'math', 'percent']) else \
                  "Reasoning Ability" if any(w in cleaned.lower() for w in ['puzzle', 'series', 'coding', 'logic']) else \
                  "English Language" if any(w in cleaned.lower() for w in ['grammar', 'vocab', 'english', 'reading']) else "General Awareness"
                  
        extracted.append({
            "id": f"ext_top_{idx+1}",
            "topicName": cleaned[:80],
            "subjectCategory": subject,
            "estimatedHours": 3.0,
            "difficulty": "medium",
            "weightagePercentage": 8,
            "coreConcepts": [cleaned[:25]]
        })
        
    return {
        "topics": extracted,
        "totalEstimatedHours": len(extracted) * 3.0,
        "keywords": [t["topicName"] for t in extracted[:6]]
    }

async def generate_ai_tutor_response(message: str, history: Optional[List[Dict[str, str]]] = None) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return f"Hello Aspirant! I am your AspirePrep AI Tutor. You asked: '{message}'. To enable full generative AI explanations, please set your GEMINI_API_KEY."
        
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"You are AspirePrep AI Tutor, an expert tutor for competitive and university exams. Answer the student concisely with clear bullet points and examples.\n\nStudent: {message}"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text or "Here is the explanation for your study topic."
    except Exception as e:
        return f"AI Tutor Response: Based on standard exam patterns, break this topic down into core formulas, daily practice of 15 questions, and review mistakes weekly."

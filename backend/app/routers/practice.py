from fastapi import APIRouter
from typing import Optional

router = APIRouter(prefix="/practice", tags=["practice"])

@router.get("/questions")
def get_practice_questions(subject: Optional[str] = None, difficulty: Optional[str] = None):
    return [
        {
            "id": "prac_q1",
            "question": "A shopkeeper buys an article for $450 and marks it 20% above CP. He sells it with a 10% discount. Find his profit percentage.",
            "options": ["8%", "10%", "12%", "15%"],
            "correctAnswer": "8%",
            "explanation": "Effective markup = 1.20 * 0.90 = 1.08 -> 8% profit.",
            "subject": subject or "Quantitative Aptitude",
            "difficulty": difficulty or "Medium"
        },
        {
            "id": "prac_q2",
            "question": "Statements: All cats are dogs. Some dogs are birds.\nConclusions: I. Some cats are birds. II. Some birds are dogs.",
            "options": ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
            "correctAnswer": "Only II follows",
            "explanation": "Direct conversion of 'Some dogs are birds' is 'Some birds are dogs'.",
            "subject": subject or "Reasoning Ability",
            "difficulty": difficulty or "Medium"
        }
    ]

@router.get("/daily-challenge")
def get_daily_challenge():
    return {
        "id": "dc_today",
        "title": "Daily 5-Minute Brain Sprint",
        "xpReward": 50,
        "questionsCount": 5,
        "completed": False
    }

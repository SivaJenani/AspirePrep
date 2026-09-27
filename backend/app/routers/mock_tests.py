from fastapi import APIRouter, HTTPException
from ..models.schemas import TestSubmissionRequest
from typing import List, Optional
import datetime

router = APIRouter(prefix="/mock-tests", tags=["mock-tests"])

SAMPLE_TESTS = [
    {
        "id": "mock_ssc_cgl_tier1_01",
        "examId": "exam_ssc_cgl",
        "title": "SSC CGL Tier-1 Full Mock Test 01 (Latest Pattern 2026)",
        "durationMinutes": 60,
        "totalQuestions": 25,
        "totalMarks": 50,
        "difficulty": "Moderate",
        "questions": [
            {
                "id": "q1",
                "question": "If A:B = 3:4 and B:C = 8:9, find A:C.",
                "options": ["1:2", "2:3", "3:4", "4:5"],
                "correctAnswer": "2:3",
                "explanation": "A/C = (A/B) * (B/C) = (3/4) * (8/9) = 24/36 = 2/3.",
                "subject": "Quantitative Aptitude"
            },
            {
                "id": "q2",
                "question": "Find the odd one out: 64, 125, 216, 343, 512, 729",
                "options": ["64", "125", "216", "All are cubes"],
                "correctAnswer": "All are cubes",
                "explanation": "4^3=64, 5^3=125, 6^3=216, 7^3=343, 8^3=512, 9^3=729.",
                "subject": "Reasoning Ability"
            }
        ]
    }
]

@router.get("")
def list_mock_tests(examId: Optional[str] = None):
    if examId:
        return [t for t in SAMPLE_TESTS if t.get("examId") == examId or not t.get("examId")]
    return SAMPLE_TESTS

@router.get("/{test_id}")
def get_mock_test(test_id: str):
    for test in SAMPLE_TESTS:
        if test["id"] == test_id:
            return test
    return SAMPLE_TESTS[0]

@router.post("/submit")
def submit_mock_test(submission: TestSubmissionRequest):
    return {
        "attemptId": f"att_{datetime.datetime.utcnow().timestamp()}",
        "score": 42,
        "accuracyPercent": 84.0,
        "timeSpentSeconds": submission.timeSpentSeconds,
        "rank": 14,
        "totalParticipants": 1250,
        "weakAreas": ["Trigonometric Identities", "Syllogisms"]
    }

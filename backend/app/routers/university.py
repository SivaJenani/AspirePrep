from fastapi import APIRouter
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/university", tags=["university"])

SAMPLE_COURSES = [
    {
        "id": "univ_cs8491",
        "code": "CS8491",
        "subjectName": "Computer Architecture & Organization",
        "semester": 4,
        "department": "Computer Science & Engineering",
        "units": [
            {"unitNumber": 1, "title": "Basic Structure of Computers", "weightage": 20},
            {"unitNumber": 2, "title": "Arithmetic Operations & ALU", "weightage": 20},
            {"unitNumber": 3, "title": "Processing Unit & Pipelining", "weightage": 25},
            {"unitNumber": 4, "title": "Memory System & Cache Mapping", "weightage": 20},
            {"unitNumber": 5, "title": "I/O Organization & Buses", "weightage": 15}
        ]
    }
]

@router.get("/subjects")
def get_university_subjects():
    return SAMPLE_COURSES

@router.get("/cram-plan/{subject_id}")
def get_cram_plan(subject_id: str):
    return {
        "subjectId": subject_id,
        "strategy": "5-Unit High-Yield Cramming Blueprint",
        "priorityUnits": [3, 2, 4],
        "mustLearnQuestions": [
            "Explain 5-stage instruction pipelining with hazard resolution.",
            "Compare Direct, Associative, and Set-Associative Cache Mapping."
        ]
    }

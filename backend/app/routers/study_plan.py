from fastapi import APIRouter, HTTPException
from ..models.schemas import SyllabusAnalyzeRequest
from ..services.ai_service import analyze_syllabus_nlp
import datetime

router = APIRouter(prefix="/study-plan", tags=["study-plan"])

@router.post("/analyze-notes")
def analyze_notes(req: SyllabusAnalyzeRequest):
    if not req.notesText:
        raise HTTPException(status_code=400, detail="notesText is required")
    
    analysis = analyze_syllabus_nlp(req.notesText)
    return {
        "success": True,
        "topics": analysis["topics"],
        "totalEstimatedHours": analysis["totalEstimatedHours"],
        "keywords": analysis.get("keywords", [])
    }

@router.get("/current")
def get_current_plan():
    return {
        "id": "sp_current",
        "title": "SSC CGL 60-Day Adaptive Study Schedule",
        "targetExam": "SSC CGL 2026",
        "targetDate": "2026-09-15",
        "dailyGoalMinutes": 120,
        "completedMinutes": 45,
        "tasks": [
            {"id": "t1", "title": "Percentage & Ratio Revision", "status": "completed", "minutes": 45},
            {"id": "t2", "title": "Syllogisms Practice Quiz", "status": "in_progress", "minutes": 30},
            {"id": "t3", "title": "Current Affairs Capsule", "status": "pending", "minutes": 45}
        ]
    }
